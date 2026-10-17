# Orbbec Femto Bolt

**Status:** Selected external camera on 2026-10-17, replacing Orbbec Astra 2. The requested sequence was x86 Windows laptop first, then Dell Snapdragon. A subsequent [local Snapdragon bridge test](../setup/ms-09-femto-bolt-bridge.md) demonstrated depth capture and RGB/depth person positioning; the x86 reference test remains unverified. Sustained capture reliability and SecondHands integration remain open. Cam and Jacqueline own the hardware work requested by the user.

## Purpose and current implementation

Femto Bolt supplies color and depth images. RGB-D means a color image plus depth measurements; ToF, or time of flight, is the camera's depth-sensing method. The [manufacturer's product page](https://www.orbbec.com/products/tof-camera/femto-bolt/) documents USB-C connectivity and color, depth, infrared, and point-cloud output. Capturing those streams does not itself recognize gestures or determine command intent.

The first goal is reliable capture. Start with color images for the existing recognition models, then inspect depth separately. The built-in camera remains the working baseline while this external-camera path is tested.

The repository has no Astra-specific capture implementation to move. Hardware references have been consolidated here and updated to Femto Bolt. The current [camera module](../../src/secondhands/capture/camera.py) uses OpenCV `VideoCapture` and returns RGB pixels. It does not expose Orbbec depth, camera calibration, or synchronized color/depth frames. Future device code belongs in `src/secondhands/capture/`; this page owns hardware compatibility and remaining checks. The [setup summary](../setup/ms-09-femto-bolt-bridge.md) owns the separate installed bridge's rationale, implementation, results, and launch procedure.

## Windows laptop test

The requested first machine uses an x86-family processor. Confirm whether Windows and the application are 64-bit; the inspected current Windows release supplies x64 packages.

1. Record the Windows version, processor architecture, camera firmware version, and cable/port used. Keep serial numbers and personal machine identifiers out of public reports.
2. Connect Femto Bolt with a suitable USB 3 data cable and the power arrangement specified by its hardware guide. A USB-C connector alone does not establish data speed or sufficient power.
3. Install the Windows x64 SDK and Orbbec Viewer from the [official SDK release](https://github.com/orbbec/OrbbecSDK_v2/releases/tag/v2.10.6). The release inspected on 2026-10-17 is v2.10.6. Verify firmware compatibility before changing firmware.
4. Follow the manufacturer's [Windows frame-metadata registration procedure](https://github.com/orbbec/OrbbecSDK_v2/blob/main/scripts/env_setup/obsensor_metadata_win10.md). The SDK warns that missing metadata can affect device timestamps and synchronization.
5. Open Orbbec Viewer. Confirm device detection, then inspect color and depth streams, both individually and together. Record the selected resolution, frame rate, timestamps, missing frames, and any alignment setting.
6. Stop and restart capture, then disconnect and reconnect the camera. Record whether streams recover without restarting Windows.
7. After Viewer works, test a color-frame capture through the [Python SDK v2 wrapper](https://github.com/orbbec/pyorbbecsdk/tree/v2-main). Pin the version that works with the installed SDK and Python interpreter. Its `main` branch targets SDK v1; do not combine branches by name alone.

Completion means repeatable color and depth capture with recorded versions and stream settings. A Viewer screenshot alone does not establish Python integration or recognition accuracy. Keep recordings outside Git. Use [the existing model commands](../runbooks/mac-and-snapdragon-development.md#run-the-other-three-image-models) only after a compatible color image is available.

## Dell Snapdragon test

Use the working x86-laptop setup as a reference, then repeat detection and stream tests on the [Dell Snapdragon deployment laptop](snapdragon-x-elite.md). Record failures separately for the device driver, Viewer, SDK, Python wrapper, and application.

The [SDK platform list](https://github.com/orbbec/OrbbecSDK_v2#13-supported-platforms) lists Windows x86/x64. The inspected [v2.10.6 release assets](https://github.com/orbbec/OrbbecSDK_v2/releases/tag/v2.10.6) include Windows x64 binaries but no Windows ARM64 package. Linux ARM64 support is not evidence of Windows ARM64 support. A possible x64 application under Windows emulation still needs testing; application emulation does not establish driver compatibility.

Camera capture and neural-network execution are separate checks. A working camera does not prove ExecuTorch or Qualcomm NPU inference. Follow the [Compute deployment procedure](../hackathon-compute.md#compute-deployment-and-verification) for that work.

## Results to record

For each machine, record the OS and process architecture, SDK/wrapper/firmware versions, connection and stream settings, color/depth results, restart behavior, and exact errors. State whether the evidence comes from Viewer, a Python example, or SecondHands. The [2026-10-17 bridge results](../setup/ms-09-femto-bolt-bridge.md#recorded-results) provide standalone Snapdragon evidence, including a later capture timeout. Viewer success, x86 reference results, and SecondHands integration remain unverified. Work status belongs in [the task plan](../plan.md).

## Questions

### SH-Q-002 — Which capture path works on the Dell?

**Partially resolved on 2026-10-17.** The user's earlier setup request required operation entirely on this Snapdragon computer. The [saved bridge evidence](../setup/ms-09-femto-bolt-bridge.md#recorded-results) establishes a local capture path: direct Windows Kernel Streaming proxy capture, vendor depth decoding in an emulated x64 process, and a separate RGB/depth person application. Standard SDK capture failed. Initial start/stop checks passed, but a later run ended in a sensor-frame timeout; repeatable sustained capture, reconnect/reboot recovery, measured distance accuracy, and SecondHands integration remain unverified. This is an observed prototype result, not approval of a final application architecture or a claim of official Windows ARM64 SDK support.

The original alternatives remain relevant for comparison:

- **Native Windows ARM64 path, if available:** Obtain a supported driver, SDK, and wrapper for that architecture. Example: an ARM64 Python process captures both color and depth. No such package was verified in this review.
- **Windows x64 application under emulation:** Test the available x64 Viewer and SDK on the Dell. Example: Viewer displays both streams, followed by an x64 Python capture test. Driver compatibility remains a separate condition.
- **Built-in camera fallback:** Retain local RGB recognition if Femto Bolt capture cannot be established. Example: the [existing camera module](../../src/secondhands/capture/camera.py) supplies color frames, with no claim of depth support.
- **Continue testing the local bridge:** Use the [installed viewer](../setup/ms-09-femto-bolt-bridge.md#how-to-use-the-installed-setup) to repeat sustained capture and recovery checks, and compare reported depth against measured targets. This already produces depth locally but needs custom application integration and has an unresolved timeout.

Compare repeatable capture, timestamp behavior, measured distance error, application compatibility, and setup time. Record the timeout's cause and recovery evidence before calling the Dell path reliable; link the outcome from [the plan](../plan.md#team-coordination). The earlier x86 reference procedure remains available to separate device faults from platform-specific behavior.
