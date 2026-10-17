# RTMW

**Status:** Documented research lead on 2026-10-17. Not installed, not run, and outside the five-candidate starting order. Figures below are author-reported. They are not SecondHands measurements.

## Capability and role

[RTMW](https://arxiv.org/abs/2407.08634) is OpenMMLab's real-time 2D whole-body pose series. It predicts body, face, hand, and foot keypoints together, using the 133-point COCO-WholeBody definition. That is a different output from [RTMPose](rtmpose.md) and [RTMO](rtmo.md), which publish 17 body keypoints, and from running [Face Landmarker](mediapipe-face-landmarker.md) and [Gesture Recognizer](mediapipe-gesture-recognizer.md) as separate tasks. [RTMW3D](rtmw3d.md) adds a depth branch.

For SecondHands, one whole-body model could supply face, hand, and body measurements from one crop. The paper itself says facial keypoints are easier than hand keypoints because the hands move with more freedom. A whole-body score can look strong while the hand keypoints that a gesture command needs remain weak. The output is still a measurement, not an intentional command.

## Published design

The [technical report](https://arxiv.org/html/2407.08634), checked on 2026-10-17, starts from the RTMPose architecture and adds PAFPN and a Hierarchical Encoding Module so small body parts keep more feature resolution. Training uses 14 open datasets whose keypoints were manually aligned to COCO-WholeBody, then the two-stage distillation method from DWPose. Localization remains [SimCC](simcc.md) coordinate classification. The report says the earlier RTMPose design was aimed at body pose and stopped improving on whole-body data as the parameter count grew.

The MMPose [RTMPose README](https://github.com/open-mmlab/mmpose/blob/main/projects/rtmpose/README.md) records the release notes: an alpha RTMW-x at 70.2 mAP in September 2023, and RTMW-l at 70.1 mAP on the COCO-WholeBody validation set in December 2023.

## Published results

The report's COCO-WholeBody table gives these whole-body average-precision scores for the combined-data models. The dagger in the paper marks that combined training set.

| Model | Input | Whole-body AP |
| --- | --- | --- |
| RTMW-m | 256×192 | 58.0 |
| RTMW-l | 256×192 | 66.2 |
| RTMW-x | 256×192 | 67.2 |
| RTMW-l | 384×288 | 70.1 |
| RTMW-x | 384×288 | 70.2 |

The abstract says RTMW-l reaches 70.2 mAP and is the first open-source model above 70 mAP on this benchmark. The table assigns 70.1 to RTMW-l at 384×288 and 70.2 to RTMW-x at 384×288. The December 2023 README note matches the table's 70.1 for RTMW-l. Keep the table and the abstract wording distinct.

The same table lists hand AP separately. For RTMW-l at 384×288 the hand AP is 66.3, below the 70.1 whole-body AP. Body, foot, and face scores on that row are higher than the hand score. A single whole-body AP is the wrong number for a hand-command decision.

On the report's ONNX Runtime CPU table, RTMW-l at 384×288 takes 47.618 ms per inference, against 44.581 ms for RTMPose-l at the same input. The report does not name that CPU in the table caption. These times exclude a person detector, camera capture, and display.

The [RTMPose paper](rtmpose.md#published-results) separately reports an earlier RTMPose-l whole-body result of 67.0% AP at 130+ FPS. That result is not this RTMW-l row.

## Deployment and limits

RTMW is trained and released through the MMPose RTMPose project. [rtmlib](https://github.com/Tau-J/rtmlib) lists an RTMW estimator for 133 keypoints over ONNX. The MMPose repository license, checked on 2026-10-17, is Apache-2.0. No ExecuTorch export, Windows ARM64 run, or Qualcomm NPU path was verified.

Do not compare this model with MediaPipe by the whole-body AP alone. Measure face, hand, and body errors separately on the [shared measurements](../../experiments-before-saturday.md#measurements), including small or partly hidden hands. Selection remains [SH-Q-001](../../project.md#sh-q-001--model-and-runtime-selection).
