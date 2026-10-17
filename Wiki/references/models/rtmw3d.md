# RTMW3D

**Status:** Documented research lead on 2026-10-17. Not installed, not run, and outside the five-candidate starting order. Figures below are author-reported. They are not SecondHands measurements.

## Capability and role

[RTMW3D](https://arxiv.org/abs/2407.08634) is the monocular 3D extension of [RTMW](rtmw.md). One RGB image produces 2D image coordinates and a relative depth for the 133 COCO-WholeBody keypoints. The [technical report](https://arxiv.org/html/2407.08634), checked on 2026-10-17, says the model adds a z-axis branch to the RTMW decoder. It does not use a depth camera. It estimates relative depth from the color image.

For SecondHands, the selected external camera is the [Orbbec Femto Bolt](../../hardware/femto-bolt.md), which can supply measured depth. RTMW3D answers a different question: inferred 3D joint position from one RGB frame. That estimate can support a forward or backward lean when only a color camera is available. It does not replace a depth-camera measurement, and it does not establish an intentional command.

## Published design

The report keeps [SimCC](simcc.md) classification for the x and y coordinates. For z, it does not classify the dataset's raw depth values. It picks a skeleton root and classifies each keypoint's offset from that root, so datasets with different depth scales can share one target. Images that have only 2D labels use a z-axis mask and still train x and y. The 3D training mix adds H3WB, UBody, and DNA-Rendering to the 14 2D datasets used for RTMW.

The report states the limitation directly: a single RGB image does not determine the z coordinate, 3D keypoint datasets are scarce, and their scenes are narrow.

## Published results

On the report's COCO-WholeBody table, the 3D models also receive a 2D whole-body score:

| Model | Input | Whole-body AP on COCO-WholeBody |
| --- | --- | --- |
| RTMW3D-l | 384×288 | 67.8 |
| RTMW3D-x | 384×288 | 68.0 |

Those rows are 2D keypoint scores. They are below the 2D [RTMW-l](rtmw.md#published-results) score of 70.1 at the same input size. The hand AP on the RTMW3D-l row is 61.7.

On the H3WB 3D test set, the report gives mean per-joint position error:

| Model | Input | MPJPE |
| --- | --- | --- |
| RTMW3D-l | 384×288 | 0.056 |
| RTMW3D-x | 384×288 | 0.057 |

The table compares those figures with previously published H3WB baselines between 0.088 and 0.117. The report does not state the MPJPE unit on that HTML table. The baselines it cites were taken from the H3WB paper rather than rerun for this table. This repository has not checked the H3WB protocol or reproduced the error.

The report's Figure 4 caption says one RTMW3D inference returns both the 2D and 3D keypoints.

## Deployment and limits

[rtmlib](https://github.com/Tau-J/rtmlib) lists RTMW3D for 133 keypoints and a Wholebody3d solution. The MMPose repository license, checked on 2026-10-17, is Apache-2.0. No ExecuTorch export, Windows ARM64 run, or Qualcomm NPU path was verified.

Relative z from a color frame can disagree with Femto Bolt depth. If both exist, compare them on the same joints before using either as a command signal. Selection remains [SH-Q-001](../../project.md#sh-q-001--model-and-runtime-selection).
