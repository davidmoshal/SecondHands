# K&F Concept MS-09 / Femto Bolt setup

On 2026-10-17, a local software bridge enabled real depth capture from the Orbbec Femto Bolt on the Snapdragon Windows laptop. A second application combined the color camera with depth to detect people and estimate their positions. Both ran on this computer, as the user requested. The initial verification passed; a later saved run ended in a capture timeout, so sustained reliability remains unresolved.

The equipment was initially called “K&F Concept MS-09.” K&F identifies [MS09 as a mini tripod/selfie stick](https://www.kfconcept.com/reviews_16194?page=2). Windows and the SDK identified the connected camera as **Orbbec Femto Bolt**, with separate RGB and depth interfaces. The software work concerned that camera. [The hardware page](../hardware/femto-bolt.md) owns camera selection and the broader compatibility investigation.

## Why a bridge was needed

The color image worked, but that did not establish that the depth sensor was delivering distances. Four diagnostic attempts using Orbbec SDK **1.10.37** and **2.10.6** produced no depth frames. The camera reported firmware **1.0.9** over **USB 3.1**; the host ran **Windows 11 Pro, version 10.0.26200, ARM64**. The initial HTML report recorded these failures:

```text
Can not find firmware data profile.
got nvram data failed.retrying...
DeviceComponentPtr is nullptr
```

Investigation found a capture-path mismatch: the normal Windows camera interfaces exposed the calibration stream as 1024 × 512 at 30 FPS, while initialization expected it at 5 FPS. The camera's USB descriptors advertised additional raw depth modes that those interfaces did not expose. Reading calibration succeeded, and direct access through the Windows Kernel Streaming proxy subsequently exposed usable raw modes. This supported a software capture-path explanation for the initial failure; the error messages alone did not prove defective hardware.

## What was built and why

| Work completed | Purpose |
| --- | --- |
| Added `direct_capture.py`, using DirectShow with an explicitly loaded Windows Kernel Streaming proxy | Bypass the Windows Frame Server route and select the camera's calibration and raw sensor streams directly. |
| Added `depth_engine.py`, using camera calibration and the vendor `depthengine_2_0.dll` from SDK 1.10.37 | Convert raw phase measurements into real depth in millimetres and an infrared image. The raw adapter follows the [Orbbec SDK v2 implementation](https://github.com/orbbec/OrbbecSDK_v2), with attribution retained locally. |
| Added `run_bridge.py`, launch/stop scripts, a browser viewer, and HTML/data exports | Make capture repeatable and inspectable without editing scripts for each test. |
| Downloaded and adapted [Orbbec's YOLO object-detection example](https://github.com/orbbec/pyorbbecsdk/tree/0f089c9bf6e618e7782228ee6bcf666e3339ae78/examples/applications/object_detection) | Test color and depth together by detecting people and attaching measured camera-relative positions. The upstream checkout is retained locally at this commit. |
| Added factory-calibrated RGB/depth alignment and timing checks | Associate a person's color-image box with the corresponding depth samples, and withhold positions when the image pair is too far apart in time. |

The bridge supports narrow-field-of-view (NFOV), unbinned **640 × 576 depth at 15 FPS**. Its x64 Python process and vendor depth engine run through Windows ARM64 emulation; native ARM64 capture was also tested separately. This is a local viewer/export prototype, not a general virtual-camera driver or a complete native ARM64 SDK. The setup records report no driver, firmware, registry, or persistent camera-calibration changes.

The person application uses YOLOv5s in ONNX Runtime's CPU path, with OpenCV, NumPy, and Pillow in a separate x64 Python environment. It captures 1280 × 720 RGB and resizes it to 640 × 360 for detection. SDK v2 reads factory calibration; the custom bridge captures frames and the SDK v1 depth engine decodes them. Positions use central bounding-box depth samples with outlier rejection, expressed in metres relative to the color camera: **X right, Y down, Z forward**. These are person-position estimates, not skeleton tracking or persistent identities.

RGB/depth pairing uses host arrival timestamps rather than hardware synchronization. Pairs more than **75 ms** apart do not receive measured positions. Processing runs more slowly than capture and intentionally skips intermediate frames. All inference and viewer services run locally, without a second computer or cloud inference.

## Recorded results

These are results from the earlier setup session and saved verification files, reviewed for this summary. Camera tests were not rerun while writing the documentation.

| Test | Saved result |
| --- | --- |
| Standard SDK capture | Four attempts; zero depth frames. |
| Depth bridge verification | **215 distinct frames**, 640 × 576, **15.05 FPS**, zero callback queue drops. |
| Depth coverage and decoding | Mean **49.72% valid depth pixels** in that scene; median decode time after warm-up **5.57 ms**. Coverage is not an accuracy score. |
| Person application verification | **400 processed frames**; 398 contained detected people and **397 contained people with measured depth**. |
| Person processing speed | **4.69 updates/second**; median model inference **113.77 ms**; zero depth/color queue drops during this verification. |
| Viewer and export checks | Start/stop, person-app capture restart, previews, HTML reports, and downloads passed. The bridge's 16-bit depth PNG matched its exported depth array. |

A later person-app snapshot saved at **13:29 local time on 2026-10-17** recorded 5,634 processed frames, including 5,563 with measured people, then the error `No sensor frame arrived within 8 seconds; check USB and camera power`. It also recorded 71 depth and 70 color queue drops. That snapshot does not establish the cause of the timeout. The earlier successful checks remain valid, but do not establish uninterrupted operation or recovery after unplugging or rebooting.

Absolute distance accuracy has **not** been checked against a measured target. Factory calibration and plausible coordinates demonstrate a working measurement pipeline; they do not establish measurement accuracy, person-detection accuracy, or demonstration readiness. The remaining capture investigation is tracked under [SH-Q-002](../hardware/femto-bolt.md#sh-q-002--which-capture-path-works-on-the-dell) and [the plan](../plan.md#optional-experiments).

## How to use the installed setup

The local installation is under the operator's Windows Documents folder. Keep these sibling directories in place; the person application depends on the bridge and its vendor libraries:

```text
Documents/
  Femto-Bolt-Depth-Test-2026-10-17/
    bridge/
      Start-Depth-Bridge.cmd
      depth-bridge-report.html
  Femto-Bolt-Person-Detection/
    Start-Person-Detection.cmd
    results/person-detection-report.html
```

- **Depth only:** Run `Start-Depth-Bridge.cmd`, open [the local depth viewer](http://127.0.0.1:8765/), and select **Start depth**. **Stop & save** writes the report and latest depth/infrared exports.
- **People and 3D positions:** Use the **Femto Bolt Person Detection** desktop shortcut or `Start-Person-Detection.cmd`. The [local person viewer](http://127.0.0.1:8766/) starts capture automatically. **Save test report** exports the results; **Stop camera** releases capture.
- **Camera ownership:** Close other camera applications. Use one depth-capture application at a time; starting the person application stops capture in the depth-only viewer. The matching `Stop-Depth-Bridge.ps1` and `Stop-Person-Detection.ps1` scripts stop their background servers.

Both viewers bind to `127.0.0.1`, so these addresses work on the setup computer while the corresponding server is running. Neither is configured to start with Windows. New saves replace the latest reports and exports.

## Evidence and project boundary

The review used the earlier local conversation, installation READMEs, bridge source, `test-evidence.json`, `bridge/bridge-results.json`, both `verification.json` files, and the later person-app `results/test-results.json`. [Source record SH-S-018](../index.md#source-records) records their incorporation. Raw reports, images, recordings, calibration, private session identifiers, and machine-specific paths remain outside Git; only this technical summary is added to the Wiki.

The installed bridge and person application remain outside the SecondHands checkout. They have not been integrated into [SecondHands capture](../../src/secondhands/capture/camera.py), its recognition dashboard, or its trigger policy. The results establish local RGB/depth and person-position experiments, not ExecuTorch execution, Qualcomm NPU use, or completion of the previously planned x86 reference-laptop test. [Project direction](../project.md#implementation-and-evidence-limits) records that distinction.
