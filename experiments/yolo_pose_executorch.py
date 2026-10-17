# /// script
# requires-python = ">=3.12,<3.13"
# dependencies = [
#   "ultralytics>=8.4,<9",
#   "executorch==1.5.1",
#   "torch==2.14.1",
#   "torchvision==0.29.1",
#   "numpy>=2,<3",
#   "opencv-python>=4.13,<5",
# ]
#
# [[tool.uv.index]]
# name = "pytorch-cpu"
# url = "https://download.pytorch.org/whl/cpu"
# explicit = true
#
# [tool.uv.sources]
# torch = { index = "pytorch-cpu" }
# torchvision = { index = "pytorch-cpu" }
# ///
"""Export a YOLO pose model to an ExecuTorch XNNPACK .pte and compare it with PyTorch.

Usage: uv run --locked --script experiments/yolo_pose_executorch.py [weights] [imgsz]

The script downloads the pretrained Ultralytics pose weights (AGPL-3.0) and a public
sample image into ignored artifacts/, exports the model with Ultralytics' ExecuTorch
integration, then runs two checks: Ultralytics prediction through both runtimes on the
sample image, and the identical letterboxed tensor through the PyTorch model and the
ExecuTorch Python runtime. The raw-tensor check is the export validation; the
prediction check also reflects Ultralytics' different letterbox shapes for the two
formats. Timings are CPU timings on the machine that runs the script, not laptop or
NPU results.
"""

import json
import os
import platform
import sys
import time
from importlib.metadata import version
from pathlib import Path

import cv2
import numpy as np
import torch
import ultralytics
from executorch.runtime import Runtime
from ultralytics import YOLO
from ultralytics.data.augment import LetterBox

SAMPLE_IMAGE = "https://ultralytics.com/images/bus.jpg"


def predict(model, image, imgsz, repeats=5):
    """Return keypoints with confidences, boxes, and a median prediction time."""
    result = model.predict(image, imgsz=imgsz, verbose=False, device="cpu")[0]
    times = []
    for _ in range(repeats):
        start = time.perf_counter()
        model.predict(image, imgsz=imgsz, verbose=False, device="cpu")
        times.append((time.perf_counter() - start) * 1000)
    keypoints = result.keypoints.data.cpu().numpy() if result.keypoints is not None else np.zeros((0, 17, 3))
    boxes = result.boxes.xyxy.cpu().numpy() if result.boxes is not None else np.zeros((0, 4))
    return keypoints, boxes, float(np.median(times))


def compare_people(kp_a, box_a, kp_b, box_b, threshold=0.5):
    """Match people by box centre and compare keypoints both runtimes mark visible."""
    matched = compared = 0
    worst = []
    if len(box_b) == 0:
        return matched, compared, None
    centres_b = (box_b[:, :2] + box_b[:, 2:]) / 2
    for box, keypoints in zip(box_a, kp_a, strict=True):
        centre = (box[:2] + box[2:]) / 2
        j = int(np.argmin(np.linalg.norm(centres_b - centre, axis=1)))
        if np.linalg.norm(centres_b[j] - centre) > 20:
            continue
        matched += 1
        visible = (keypoints[:, 2] > threshold) & (kp_b[j][:, 2] > threshold)
        compared += int(visible.sum())
        if visible.any():
            worst.append(np.abs(keypoints[visible, :2] - kp_b[j][visible, :2]).max())
    return matched, compared, (float(max(worst)) if worst else None)


def main():
    weights = sys.argv[1] if len(sys.argv) > 1 else "yolo11n-pose.pt"
    imgsz = int(sys.argv[2]) if len(sys.argv) > 2 else 640
    repo_root = Path(__file__).resolve().parents[1]
    work_dir = Path(os.environ.get("YOLO_POSE_OUT_DIR", repo_root / "artifacts" / "yolo-pose"))
    results_dir = repo_root / "artifacts" / "results"
    work_dir.mkdir(parents=True, exist_ok=True)
    results_dir.mkdir(parents=True, exist_ok=True)
    os.chdir(work_dir)

    model = YOLO(weights)
    start = time.perf_counter()
    exported = Path(model.export(format="executorch", imgsz=imgsz))
    export_seconds = time.perf_counter() - start
    pte = next(exported.glob("*.pte"))

    kp_pt, box_pt, ms_pt = predict(model, SAMPLE_IMAGE, imgsz)
    exported_model = YOLO(str(exported))
    kp_et, box_et, ms_et = predict(exported_model, SAMPLE_IMAGE, imgsz)
    matched, compared, keypoint_diff = compare_people(kp_pt, box_pt, kp_et, box_et)

    image = cv2.imread("bus.jpg")
    boxed = LetterBox((imgsz, imgsz), auto=False)(image=image)
    x = torch.from_numpy(boxed[..., ::-1].transpose(2, 0, 1).copy()).float()[None] / 255
    with torch.no_grad():
        y_pt = model.model.eval()(x)
    y_pt = y_pt[0] if isinstance(y_pt, (tuple, list)) else y_pt
    method = Runtime.get().load_program(str(pte)).load_method("forward")
    y_et = method.execute([x])[0]
    raw_times = []
    for _ in range(10):
        start = time.perf_counter()
        method.execute([x])
        raw_times.append((time.perf_counter() - start) * 1000)
    raw_abs = float((y_pt - y_et).abs().max())
    raw_rel = float(((y_pt - y_et).abs() / (y_pt.abs() + 1e-6)).median())

    result = {
        "status": "passed" if raw_abs < 0.05 and len(kp_pt) == len(kp_et) else "check",
        "weights": weights,
        "imgsz": imgsz,
        "pte": str(pte),
        "pte_bytes": pte.stat().st_size,
        "export_seconds": round(export_seconds, 1),
        "raw_output_shape": list(y_et.shape),
        "raw_max_abs_diff": raw_abs,
        "raw_median_rel_diff": raw_rel,
        "median_raw_forward_ms_executorch": round(float(np.median(raw_times)), 1),
        "persons_pytorch": int(len(kp_pt)),
        "persons_executorch": int(len(kp_et)),
        "persons_matched": matched,
        "keypoints_compared": compared,
        "max_keypoint_pixel_diff": keypoint_diff,
        "median_predict_ms_pytorch": round(ms_pt, 1),
        "median_predict_ms_executorch": round(ms_et, 1),
        "versions": {
            "python": platform.python_version(),
            "torch": torch.__version__,
            "executorch": version("executorch"),
            "ultralytics": ultralytics.__version__,
            "platform": f"{platform.system()} {platform.machine()}",
        },
    }
    (results_dir / "yolo-pose-executorch.json").write_text(json.dumps(result, indent=1) + "\n")
    print(json.dumps(result, indent=1))
    return 0 if result["status"] == "passed" else 1


if __name__ == "__main__":
    sys.exit(main())
