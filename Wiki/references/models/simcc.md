# SimCC

**Status:** Documented technique on 2026-10-17. It is the keypoint head used by the RTMPose family. It is not a standalone SecondHands checkpoint, and it has not been implemented here.

## What it changes

[SimCC](https://arxiv.org/abs/2107.03332) reformulates 2D human pose estimation as two classification tasks, one for the horizontal coordinate and one for the vertical coordinate. The [paper](https://arxiv.org/abs/2107.03332), checked on 2026-10-17, divides each pixel into bins so the predicted coordinate can fall between pixels. The authors' reason is the quantization error of a low-resolution 2D heatmap: raising heatmap resolution needs extra upsampling, and heatmap methods often add a refinement step after the argmax.

SimCC is a localization method. It does not choose which skeleton, which dataset, or whether a separate person detector is required. [RTMPose](rtmpose.md), [RTMO](rtmo.md), [RTMW](rtmw.md), and [RTMW3D](rtmw3d.md) each use a coordinate-classification head derived from this idea. RTMW3D adds a third branch for relative depth.

## Published claim and later use

The paper reports experiments on COCO, CrowdPose, and MPII, and says the gain over heatmap baselines is largest at low input resolution. Those dataset scores were not copied here because the later RTMPose-family pages own the checkpoint results that SecondHands would actually run.

MMPose implements the representation as `SimCCLabel`. The [RTMPose README](https://github.com/open-mmlab/mmpose/blob/main/projects/rtmpose/README.md) uses `simcc` in checkpoint names and in ONNX Runtime, TensorRT, and ncnn deployment configs. [rtmlib](https://github.com/Tau-J/rtmlib) decodes RTMPose ONNX outputs by splitting the SimCC x and y vectors, with a documented split ratio of 2.0.

## SecondHands limits

A SimCC head can make a small pose network easier to export than a high-resolution heatmap head. That possibility is not an ExecuTorch export, a Windows ARM64 measurement, or a Qualcomm NPU result. Any future port still has to check that decoded joint coordinates match the source runtime on the same images. The technique also does not decide whether a joint movement is a command. That comparison stays with the [shared measurements](../../experiments-before-saturday.md#measurements) and [SH-Q-001](../../project.md#sh-q-001--model-and-runtime-selection).
