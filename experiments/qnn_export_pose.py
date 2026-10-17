# /// script
# requires-python = ">=3.10,<3.13"
# dependencies = [
#   "executorch==1.5.1",
#   "torch>=2.14,<2.15",
#   "torchao",
#   "numpy>=2,<3",
#   "pillow>=10",
# ]
# ///
"""UNTESTED recipe: lower a pose model to ExecuTorch for the Snapdragon X Elite NPU.

Written on 2026-10-17 from the ExecuTorch 1.5 Qualcomm backend documentation
(https://docs.pytorch.org/executorch/stable/backends-qualcomm.html). It has not been run,
because this repository's development machines have no QAIRT/QNN SDK. It is the starting
point for the Qualcomm engineer helping the team, who should expect to adjust imports and
options to the installed SDK.

Run on x64 Python with QNN_SDK_ROOT set, as the documentation requires for ahead-of-time
compilation on Windows ARM64 hosts. Example:

    python experiments/qnn_export_pose.py --model yolo11n-pose --images calib/ --out artifacts/qnn

Models:
  yolo11n-pose      Ultralytics YOLO11n-pose (AGPL-3.0); input (1, 3, 640, 640), RGB 0-1.
  rtmpose-body2d    Qualcomm AI Hub RTMPose-Body2d wrapper; input (1, 3, 256, 192).
  classifier        The team's keypoint-window classifier from a TorchScript or state_dict file.

The script quantizes with 8-bit activations and weights by default, lowers to the HTP
backend for SC8380XP, writes the .pte, and saves PyTorch reference outputs for the first
ten calibration images so the device run can be checked numerically.
"""

import argparse
import json
from pathlib import Path

import numpy as np
import torch
from PIL import Image


def load_model(name: str, weights: str | None):
    """Return (module, example_input, preprocess) for the selected model."""
    if name == "yolo11n-pose":
        from ultralytics import YOLO  # noqa: PLC0415

        yolo = YOLO(weights or "yolo11n-pose.pt")
        module = yolo.model.eval()
        shape = (1, 3, 640, 640)

        def preprocess(image: Image.Image) -> torch.Tensor:
            image = image.convert("RGB").resize((640, 640))
            array = np.asarray(image, dtype=np.float32) / 255.0
            return torch.from_numpy(array).permute(2, 0, 1)[None]

        return module, torch.zeros(shape), preprocess

    if name == "rtmpose-body2d":
        # Qualcomm AI Hub Models publish a PyTorch wrapper per model. Install with
        # pip install "qai-hub-models[rtmpose-body2d]" and check its README for the
        # exact class name and normalization; the names below follow the package convention.
        from qai_hub_models.models.rtmpose_body2d import Model  # noqa: PLC0415

        module = Model.from_pretrained().eval()
        shape = (1, 3, 256, 192)

        def preprocess(image: Image.Image) -> torch.Tensor:
            image = image.convert("RGB").resize((192, 256))
            array = np.asarray(image, dtype=np.float32) / 255.0
            return torch.from_numpy(array).permute(2, 0, 1)[None]

        return module, torch.zeros(shape), preprocess

    if name == "classifier":
        if not weights:
            raise SystemExit("--weights must point to a TorchScript file for the classifier")
        module = torch.jit.load(weights).eval()
        shape = (1, 60, 34)  # 60 frames by 17 keypoints by (x, y)

        def preprocess(_image):
            raise SystemExit("The classifier is calibrated with keypoint windows, not images")

        return module, torch.zeros(shape), preprocess

    raise SystemExit(f"Unknown model {name}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument(
        "--model", required=True, choices=["yolo11n-pose", "rtmpose-body2d", "classifier"]
    )
    parser.add_argument("--weights")
    parser.add_argument("--images", help="Directory of calibration images (about 100)")
    parser.add_argument("--out", default="artifacts/qnn")
    parser.add_argument("--fp16", action="store_true", help="Skip quantization; lower in fp16")
    args = parser.parse_args()

    from executorch.backends.qualcomm.utils.utils import (  # noqa: PLC0415
        QcomChipset,
        generate_htp_compiler_spec,
        generate_qnn_executorch_compiler_spec,
        to_edge_transform_and_lower_to_qnn,
    )

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    module, example, preprocess = load_model(args.model, args.weights)
    example_inputs = (example,)

    calibration = []
    if args.images:
        for path in sorted(Path(args.images).iterdir())[:200]:
            if path.suffix.lower() in {".jpg", ".jpeg", ".png"}:
                calibration.append(preprocess(Image.open(path)))
    if not calibration:
        calibration = [torch.rand_like(example)]
        print("warning: no calibration images given; using random data, accuracy will be poor")

    with torch.no_grad():
        reference = [module(x) for x in calibration[:10]]
    for i, y in enumerate(reference):
        y = y[0] if isinstance(y, (tuple, list)) else y
        np.save(out / f"reference_{i:02d}.npy", y.detach().cpu().numpy())

    if args.fp16:
        model_to_lower = module
    else:
        from executorch.backends.qualcomm.quantizer.quantizer import QnnQuantizer  # noqa: PLC0415
        from torchao.quantization.pt2e.quantize_pt2e import convert_pt2e, prepare_pt2e  # noqa: PLC0415

        quantizer = QnnQuantizer()  # default 8a8w; see QuantDtype for 16a8w and others
        exported = torch.export.export(module, example_inputs, strict=True).module()
        prepared = prepare_pt2e(exported, quantizer)
        with torch.no_grad():
            for x in calibration:
                prepared(x)
        model_to_lower = convert_pt2e(prepared)

    backend_options = generate_htp_compiler_spec(use_fp16=args.fp16)
    compile_spec = generate_qnn_executorch_compiler_spec(
        soc_model=QcomChipset.SC8380XP, backend_options=backend_options
    )
    delegated = to_edge_transform_and_lower_to_qnn(model_to_lower, example_inputs, compile_spec)
    program = delegated.to_executorch()
    pte = out / f"{args.model}_qnn_{'fp16' if args.fp16 else '8a8w'}.pte"
    pte.write_bytes(program.buffer)

    summary = {
        "model": args.model,
        "pte": str(pte),
        "pte_bytes": pte.stat().st_size,
        "input_shape": list(example.shape),
        "precision": "fp16" if args.fp16 else "8a8w",
        "calibration_samples": len(calibration),
        "soc": "SC8380XP",
        "reference_outputs": 10,
    }
    (out / f"{args.model}_summary.json").write_text(json.dumps(summary, indent=1) + "\n")
    print(json.dumps(summary, indent=1))
    print("Next: run on the device with qnn_executor_runner.exe; compare with reference_*.npy")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
