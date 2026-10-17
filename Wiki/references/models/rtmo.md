# RTMO

**Status:** Documented research lead on 2026-10-17. Not installed, not run, and outside the five-candidate starting order. Figures below are author-reported. They are not SecondHands measurements.

## Capability and role

[RTMO](https://arxiv.org/abs/2312.07526) is OpenMMLab's one-stage real-time multi-person pose model. The [project page](https://github.com/open-mmlab/mmpose/tree/main/projects/rtmo), checked on 2026-10-17, says it predicts pose without a separate human detector and runs faster than [RTMPose](rtmpose.md) when more than four people are in the image. The published models use 17 body keypoints. This is a body-landmark estimator, not a configurable decision model and not a whole-body face/hand model. Whole-body keypoints belong to [RTMW](rtmw.md).

For SecondHands, RTMO matters if several people are visible and a top-down detector-plus-pose pipeline becomes too slow. A single-person demonstration may not show that advantage. A keypoint still does not establish an intentional command.

## Published design

The project introduction says RTMO puts coordinate classification inside a YOLO-style dense detector. It represents each keypoint with dual 1-D heatmaps, using the same coordinate-classification idea as [SimCC](simcc.md), plus a dynamic coordinate classifier and a loss intended for dense prediction. The page says this avoids the incompatibilities between ordinary coordinate classification and a one-stage detector.

## Published results

The project introduction says the largest model, RTMO-l, attains 74.8% AP on COCO val2017 and 141 FPS on one V100 GPU. The same page's results table, measured with ONNX Runtime on one V100, lists:

| Model | Train set | Latency | AP |
| --- | --- | --- | --- |
| RTMO-s | COCO | 8.9 ms | 0.677 |
| RTMO-m | COCO | 12.4 ms | 0.709 |
| RTMO-l | COCO | 19.1 ms | 0.724 |
| RTMO-s | body7 | 8.9 ms | 0.686 |
| RTMO-m | body7 | 12.4 ms | 0.726 |
| RTMO-l | body7 | 19.1 ms | 0.748 |

The page defines body7 as AI Challenger, COCO, CrowdPose, Halpe, MPII, PoseTrack18, and sub-JHMDB. The 74.8% AP figure matches the body7 RTMO-l row. The 141 FPS sentence and the 19.1 ms table row are both published on that page and do not describe the same speed. This repository has not reproduced either figure. Neither figure is a Snapdragon X Elite result.

The introduction also says RTMO is 1.1% AP higher than prior one-stage estimators and about nine times faster with the same backbone. That comparison was not rechecked against those other papers.

## Deployment and limits

The project page points to [rtmlib](https://github.com/Tau-J/rtmlib) for ONNX Runtime, OpenCV, and OpenVINO inference without PyTorch or MMCV. The MMPose repository license, checked on 2026-10-17, is Apache-2.0. No ExecuTorch, Windows ARM64, or Qualcomm NPU path was verified. One-stage inference removes the detector dependency, but it does not remove the need to measure capture-to-action latency on the [shared measurements](../../experiments-before-saturday.md#measurements). Selection remains [SH-Q-001](../../project.md#sh-q-001--model-and-runtime-selection).
