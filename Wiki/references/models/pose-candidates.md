# Pose model candidates and the Qualcomm handoff

**Status:** written on 2026-10-17 after Qualcomm staff at the hackathon recommended RTMPose and offered to help convert models for ExecuTorch on the Snapdragon NPU. This page compares the pose models worth trying, states which parts need training, and lists exactly what to hand to the Qualcomm engineer. Facts come from the sources linked beside them; only the YOLO11n-pose CPU export has run in this project ([observation](../../experiments-before-saturday.md#yolo-pose-executorch-export-observation)). [The tech stack](../../design/tech-stack.md) owns the overall architecture; this page owns the comparison and the conversion handoff. Design and author-reported scores for RTMPose, RTMO, RTMW, RTMW3D, and SimCC are on the [skeletal tracking pages](index.md#skeletal-tracking-leads).

## Candidates

All of these output 2D body keypoints per frame. The tracker's rep counting and form cues need the 17 COCO joints (nose, eyes, ears, shoulders, elbows, wrists, hips, knees, ankles) or a superset of them.

| Model | Type and keypoints | Size | PyTorch source | Route to ExecuTorch | NPU evidence | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| **RTMPose** (Qualcomm's recommendation) | Top-down, needs a person box; body variants give 17 COCO joints, the AI Hub "Body2d" variant gives 133 whole-body joints | RTMPose-t about 3.3M parameters at 256×192; AI Hub Body2d 17.9M, 68.5 MB float | [MMPose `projects/rtmpose`](https://github.com/open-mmlab/mmpose/tree/main/projects/rtmpose), Apache-2.0; Qualcomm's [`qai_hub_models` wrapper](https://pypi.org/project/qai-hub-models) packages a PyTorch module with its weights | `torch.export` of the MMPose or `qai_hub_models` module, then the ExecuTorch Qualcomm backend. No published ExecuTorch recipe; the SimCC head decodes with an argmax that can stay outside the graph | AI Hub reports 1.7 to 1.9 ms per inference on the Snapdragon X Elite NPU for Body2d ([model card](https://huggingface.co/qualcomm/RTMPose-Body2d)); formats published there are ONNX, QNN DLC, and TFLite, not `.pte` | **Primary NPU candidate**, converted with the Qualcomm engineer. Needs a person box: use the whole frame for a single participant or a tiny detector |
| **YOLO11n-pose / YOLO26n-pose** | Single-stage detector plus 17 COCO joints, multi-person | 2.9M parameters; 11.7 MB FP32 `.pte` | [Ultralytics](https://docs.ultralytics.com/tasks/pose/), AGPL-3.0 | Documented `export(format="executorch")`, XNNPACK CPU; verified here | AI Hub lists YOLO26-pose but marks it unsupported on compute chipsets; no QNN delegation evidence | **Working CPU baseline today.** Keep as the demo fallback; try QNN lowering only after RTMPose |
| **RTMO** | One-stage multi-person, 17 joints, no detector needed | RTMO-s about 9.9M parameters | [MMPose `projects/rtmo`](https://github.com/open-mmlab/mmpose/tree/main/projects/rtmo), Apache-2.0 | Same path as RTMPose but with dynamic-shape postprocessing that complicates export | None found | Second choice if a detector-free NPU model is wanted; more export risk |
| **MediaPipe Pose Landmarker (BlazePose)** | Detector plus 33 landmarks with visibility, single person per crop | 3 MB detector plus 13 MB landmark model | TensorFlow Lite; Qualcomm's AI Hub port uses a community PyTorch re-implementation | Not a PyTorch model in its official form; the AI Hub port could be lowered, but it is unverified | AI Hub reports about 1 ms per stage on the X Elite NPU ([model card](https://huggingface.co/qualcomm/MediaPipe-Pose-Estimation)) | Best robustness fallback through the MediaPipe runtime; not an ExecuTorch deliverable |
| **HRNetPose / LiteHRNet** | Top-down heatmaps, 17 joints | HRNet 28.5M; LiteHRNet 4.6 MB | AI Hub wrappers of the MMPose models | `torch.export` plus Qualcomm backend; heatmap argmax outside the graph | AI Hub: about 1.3 ms quantized on the X Elite NPU ([HRNetPose](https://aihub.qualcomm.com/compute/models/hrnet_pose_quantized)) | Accurate but heavier; try only if RTMPose conversion fails |
| **Posenet-Mobilenet** | Bottom-up, 17 joints, older | 3.5 MB quantized | AI Hub wrapper | Same path | AI Hub lists X Elite support ([model card](https://aihub.qualcomm.com/compute/models/posenet_mobilenet_quantized)) | Smallest model; lower accuracy; a last resort |
| **MoveNet Lightning** | Single person, 17 joints | Small | TensorFlow only; no maintained PyTorch port found | Would need a re-implementation | None for Qualcomm | Skip for this event |
| **ViTPose** | Top-down transformer, 17 joints | 20M and up | PyTorch | Exportable but heavy for a laptop NPU in two days | None found | Skip for this event |

Choose by one rule: the demo must never wait on a conversion. Run the YOLO CPU path today, and let the Qualcomm engineer bring up RTMPose on the NPU in parallel. If RTMPose lands, the service swaps the pose backend behind the same `pose` message; nothing above the keypoints changes.

## What needs training or fine-tuning

- **Pose models: none.** Every candidate above ships pretrained on COCO. Fine-tuning would need labeled exercise images and is not worth two days.
- **Rep counting and form cues: none.** They are joint-angle rules and state machines over the keypoints ([analysis layer](../../design/tech-stack.md#analysis-reps-form-and-the-trained-executorch-component)).
- **Window classifier: yes, small.** The exercise-and-phase classifier over one to two seconds of keypoints is trained by the team on a short self-recorded set labeled by the rule counter. It is a few hundred thousand parameters, trains in minutes on a laptop, and is the easiest model to put on the NPU because its operators are plain convolutions or a GRU over a small tensor. Recordings stay outside Git.
- **Quantization calibration: data, not training.** The Qualcomm backend's 8-bit post-training quantization needs about 100 representative frames of people exercising at the camera distance used in the demo. Record them on day one.

## Handoff pack for the Qualcomm engineer

Give the engineer one folder per model with the items below. The first three are enough to start; the rest make the result verifiable.

1. **A PyTorch module and weights that load without the training framework.** For RTMPose, the cleanest source is Qualcomm's own `qai_hub_models` package (`pip install "qai-hub-models[rtmpose-body2d]"`, then the model class's `from_pretrained()`); it exposes the input specification and sample inputs that AI Hub uses. The MMPose checkpoint for RTMPose-t or RTMPose-s body (17 joints, 256×192) is the smaller alternative if whole-body joints are unnecessary. For the window classifier, the team supplies the `nn.Module` definition and a `state_dict`.
2. **Input contract.** Shape `(1, 3, 256, 192)` for RTMPose and `(1, 3, 640, 640)` for YOLO-pose, float32, RGB, the model's own mean and standard deviation normalization, and how the person crop is produced. The engineer needs this to build the calibration loop and to confirm preprocessing on the device.
3. **Target and versions.** Snapdragon X Elite, `QcomChipset.SC8380XP`, ExecuTorch 1.5.1, QAIRT/QNN 2.37.0, Windows 11 ARM64 runtime, ahead-of-time export under x64 Python as the [backend documentation](https://docs.pytorch.org/executorch/stable/backends-qualcomm.html) requires. The same page documents the API the [untested export recipe](../../../experiments/qnn_export_pose.py) in this repository follows.
4. **Calibration images.** About 100 frames in the input contract above, from the demo setting, kept outside Git and shared directly.
5. **Reference outputs.** For ten of those frames, the PyTorch model's raw output tensors saved as `.npy`, so the lowered model can be checked for agreement before anyone looks at drawn skeletons.
6. **Precision preference.** Start with 8-bit activations and weights (`8a8w`); fall back to `16a8w` if keypoint error grows. Record the measured maximum keypoint error against the reference outputs for each precision.

Ask for these back:

- The `.pte` for each model with the exact export command and tool versions.
- The native ARM64 runner or backend DLL build used, or confirmation that the hackathon's supplied bundle runs it.
- A profiler or ETDump trace showing which operators ran on the HTP, and the warmed per-inference latency, so the [Compute evidence requirements](../../hackathon-compute.md#compute-deployment-and-verification) are met.
- A list of any operators that fell back to the CPU; a model that mostly falls back is not an NPU result.

Record the outcome on this page and link it from [the plan](../../plan.md#dependencies-and-order).

## Questions

None open on this page. Model selection evidence feeds [SH-Q-001](../../project.md#sh-q-001--model-and-runtime-selection), and the camera choice is [SH-Q-006](../../design/tech-stack.md#sh-q-006--which-camera-serves-the-demonstration).
