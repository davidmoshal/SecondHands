# RTMPose

**Status:** Documented research lead on 2026-10-17. Not installed, not run, and outside the five-candidate starting order. Figures below are author-reported. They are not SecondHands measurements.

## Capability and role

[RTMPose](https://arxiv.org/abs/2303.07399) is OpenMMLab's real-time 2D multi-person pose framework inside [MMPose](https://github.com/open-mmlab/mmpose/tree/main/projects/rtmpose). The usual body models predict the 17 COCO body keypoints. A detected pose is a measurement of visible joints. It does not establish that a movement was an intentional command.

For SecondHands, this is a body-landmark alternative to the retained [MediaPipe Pose](index.md#mediapipe-pose-estimation) and [PoseNet](index.md#posenet-mobilenet) leads. It can be compared with [Face Landmarker](mediapipe-face-landmarker.md) and [Gesture Recognizer](mediapipe-gesture-recognizer.md) when the useful signal is a shoulder, torso, or arm movement rather than a face or hand category. [RTMO](rtmo.md) removes the separate person detector. [RTMW](rtmw.md) and [RTMW3D](rtmw3d.md) extend the family to 133 whole-body keypoints.

## Published design

The [project README](https://github.com/open-mmlab/mmpose/blob/main/projects/rtmpose/README.md), checked on 2026-10-17, describes a top-down pipeline: a person detector such as RTMDet, then a pose model on each cropped person. The same page publishes CSPNeXt backbone pretraining for the RTMPose sizes and names SimCC in its pose checkpoints. [SimCC](simcc.md) classifies the horizontal and vertical coordinates separately. The README's pipeline table pairs RTMDet-nano or RTMDet-m with RTMPose-t/s/m/l.

Pose cost grows with the number of detected people. The README notes that its pipeline latency uses a default detection interval of five frames and does not use flip test.

## Published results

The [paper abstract](https://arxiv.org/abs/2303.07399) and the project README agree on these body-pose highlights:

| Model | Reported COCO AP | Reported speed |
| --- | --- | --- |
| RTMPose-t | 68.5% | 300+ FPS CPU, 940+ FPS GPU |
| RTMPose-s | 72.2% | 200+ FPS CPU, 710+ FPS GPU; also 70+ FPS on a Snapdragon 865 |
| RTMPose-m | 75.8% | 90+ FPS on an Intel i7-11700 CPU, 430+ FPS on an NVIDIA GTX 1660 Ti |
| RTMPose-l | 76.5% | 50+ FPS CPU, 280+ FPS GPU |

The README table does not restate the exact CPU and GPU models for every row. The abstract and the RTMPose-m row name the i7-11700 and GTX 1660 Ti. The Snapdragon 865 figure is a phone-class result from the abstract. It is not a measurement on the [Dell Snapdragon X Elite laptop](../../hardware/snapdragon-x-elite.md).

The same abstract reports RTMPose-l at 67.0% AP on COCO-WholeBody and 130+ FPS. That is the 2023 whole-body RTMPose result. The later [RTMW](rtmw.md) models report higher COCO-WholeBody scores with a different architecture. Do not treat 67.0% as the RTMW result.

The README also publishes pipeline scores that include the detector. Those scores are lower than the pose-only AP when the detector is RTMDet-nano. Example from that table: RTMDet-nano plus RTMPose-m has pose AP 75.3 and pipeline AP 73.2 on COCO.

## Deployment

The README says MMDeploy supports ONNX Runtime, TensorRT, ncnn, and OpenVINO, on CPU, GPU, NVIDIA Jetson, Windows, Linux, and ARM. [rtmlib](https://github.com/Tau-J/rtmlib) is a separate lightweight ONNX library for the RTMPose series. Its README says it does not require PyTorch, mmcv, mmpose, or mmdet. The MMPose repository license, checked on 2026-10-17, is Apache-2.0. Separate weight-redistribution terms were not audited.

No ExecuTorch export, Qualcomm AI Hub package, Windows ARM64 run, or Hexagon NPU path was found in this check. An ONNX file is not an ExecuTorch `.pte`.

## SecondHands limits

Nothing in this family has been downloaded or executed in this repository. Author FPS numbers omit camera capture, preprocessing, display, and a physical action. A top-down pipeline's latency depends on how many people are in frame and how often detection runs. Compare deliberate, neutral, and ambiguous upper-body movements with the [shared measurements](../../experiments-before-saturday.md#measurements) before treating a keypoint change as a command. [SH-Q-001](../../project.md#sh-q-001--model-and-runtime-selection) still owns model and runtime selection.
