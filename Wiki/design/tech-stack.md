# Movement tracker tech stack

**Status:** the current project direction. On 2026-10-17 the user confirmed that the camera-based fitness tracker is the team's idea for the hackathon and that the older assistive-control pages in this Wiki describe a previous idea that the team will update. This page was written the same day for a tracker modeled on the Mayo Clinic article [Fitness program: 5 steps to get started](https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/fitness/art-20046433). The target machine is the [Dell Snapdragon X Elite laptop](../hardware/snapdragon-x-elite.md) running Windows 11 ARM64, and the required inference framework is ExecuTorch. Package and documentation facts below were checked on 2026-10-17 from the sources linked beside them; nothing in this page has run on the laptop yet. The relation to the earlier assistive-control scope is [resolved below](#sh-q-005--how-does-the-movement-tracker-relate-to-secondhands): the tracker is the project.

This page owns the end-to-end stack selection and the interface contract between layers. [Runtime stack](runtime-stack.md) owns the general PyTorch/ExecuTorch/MediaPipe framework roles, [the Compute summary](../hackathon-compute.md) owns event rules, [the plan](../plan.md#dependencies-and-order) owns task status, and the hardware pages own camera and laptop findings.

## What the product does

The Mayo article describes five steps: assess your fitness level, design a program, assemble equipment, get started, and monitor progress. The article page returned HTTP 403 to the documentation tool, so this mapping relies on the article as indexed by search and on the team's reading of it; confirm the wording in the product requirements document. The table turns those steps into tracker features and marks what a camera can measure.

| Article step | Tracker feature | Camera-measurable? | Hackathon scope |
| --- | --- | --- | --- |
| Assess fitness level | Baseline tests: push-up count, sit-and-reach reach distance, single-leg balance time, resting and post-walk pulse, waist and BMI entry | Push-ups, reach, balance: yes from body pose. Pulse: needs a heart-rate sensor or manual entry. Waist and BMI: manual entry | Push-up and balance baselines; others as manual entry |
| Design a program | Choose goals and a weekly routine of aerobic, strength, flexibility, and balance activities | No, this is configuration | A fixed demo routine of two or three exercises |
| Assemble equipment | Record what the user owns; keep it cheap | No | The laptop camera is the only required equipment |
| Get started | Guided session with warm-up, reps, rest, and stop-if-dizzy safety prompt | Rep counting, tempo, and range of motion: yes. Pain or dizziness: self-reported stop button | Guided session with live rep count and form cues |
| Monitor progress | Retest after six weeks and compare to baseline | Yes, same tests | Session history and a baseline-versus-latest comparison screen |

Related clinical observations that the same keypoints can time or count are listed in [skeletal medical tests](../requirements/skeletal-medical-tests.md). That list does not add those tests to the hackathon demonstration. The hackathon demonstration is one guided session: the participant stands in front of the camera, the tracker recognizes the exercise phase, counts repetitions, gives a simple form cue from joint angles, and saves a session summary that the progress screen compares with the baseline. Everything runs locally on the laptop. The detailed requirements belong to the teammates' product requirements document; this page defines what the stack must support.

## Constraints

- **Processor:** Snapdragon X Elite X1E80100 with the Hexagon NPU. The hackathon guide documents ExecuTorch 1.5.1 with QAIRT/QNN 2.37.0 for the HTP v73 NPU ([Compute environment](../hackathon-compute.md#compute-environment)).
- **Operating system:** Windows 11 ARM64. Native ARM64 processes and emulated x64 processes need different Python packages; the tier table below records which exist.
- **Framework:** ExecuTorch must run a meaningful model. Mixed runtimes beside it are the team's accepted exploration path, but organizer acceptance is [unconfirmed](../hackathon-compute.md#unresolved-event-details).
- **Cost:** the laptop camera and free software are the baseline. Depth cameras and extra sensors are optional additions, never prerequisites.
- **Time:** the event is 17–18 October 2026. Every layer below has a day-one fallback that needs no device-specific work.
- **Privacy:** camera frames stay on the laptop. Store only derived measurements and session summaries, and keep recordings outside Git ([public repository rules](../../AGENTS.md#public-repository-content)).

## Architecture

```
 camera (UVC webcam, RealSense RGB, Orbbec, phone)
   │ RGB frames
   ▼
 capture  ──►  pose estimation  ──►  keypoints (17 or 33 per frame)
                 (ExecuTorch .pte;         │
                  MediaPipe fallback)       ▼
                                     movement analysis
                                     ├─ joint angles, rep state machine, tempo   (deterministic)
                                     └─ exercise/phase classifier over 1–2 s window (small ExecuTorch model)
                                            │ rep events, form cues, scores
                                            ▼
                                     FastAPI service + WebSocket  ──►  SQLite session store
                                            │ JSON messages
                                            ▼
                                     React frontend: session view, skeleton overlay, progress
 optional: heart-rate sensor (BLE or manual), Arduino sensors over serial, depth stream
```

The pipeline is one process on the laptop when ExecuTorch runs on the CPU. When the NPU is used, the ExecuTorch runner is a separate native ARM64 process and the Python service talks to it over a local socket or pipe; the [runtime tier table](#runtime-on-the-snapdragon-laptop) explains why.

## Layer decisions

### Sensing

| Option | Cost | What was checked | Decision |
| --- | --- | --- | --- |
| Laptop webcam or any UVC webcam | Nothing extra | OpenCV `VideoCapture` already exists in [the capture module](../../src/secondhands/capture/camera.py); it is Mac-tested only | **Baseline.** Pose estimation needs only RGB |
| Intel RealSense D4xx, RGB only | Already owned | Intel staff report the color sensor works as a standard Windows webcam without the SDK ([community answer](https://communities.intel.com/thread/123297)); confirm on the laptop | Use as the webcam if it is already on the desk |
| RealSense depth | Already owned | librealsense's Windows build is x86/x64 only ([installation doc](https://github.com/realsenseai/librealsense/blob/master/doc/installation_windows.md)); no Windows ARM64 package or wheel was found | Try the x64 SDK under emulation only if a feature needs depth; otherwise skip |
| Orbbec Astra | Already owned | The Orbbec SDK v2 README lists Windows x86/x64 only and does not list the original Astra or Astra Pro; Astra+ and Astra Pro Plus are "not supported" in v2 ([README](https://github.com/orbbec/OrbbecSDK_v2/blob/main/README.md)). Older Astra firmware uses the OpenNI protocol and the legacy Astra or OpenNI SDK | Not for day one. Record the exact model; see [SH-Q-006](#sh-q-006--which-camera-serves-the-demonstration) |
| Orbbec Femto Bolt | Already selected for SecondHands | [Hardware page](../hardware/femto-bolt.md): Windows x64 SDK, no ARM64 package, untested | Same status as RealSense depth |
| Phone camera over Wi-Fi | Nothing extra | Listed as [SH-T-038](../plan.md#optional-experiments), untested | Backup if the laptop camera is poor |

Depth is useful for sit-and-reach distance in centimetres and squat depth in absolute units. Every planned feature works in relative units from 2D keypoints, so depth is an enhancement with its own evidence, not a requirement.

### Perception: pose estimation

| Candidate | Why | Checked facts | Role |
| --- | --- | --- | --- |
| YOLO11n-pose or YOLO26n-pose (Ultralytics) | PyTorch-native, single stage, 17 COCO keypoints, exports straight to ExecuTorch | Ultralytics documents `model.export(format="executorch")` for the Pose task, producing `model.pte` plus `metadata.yaml`, FP32 only, XNNPACK CPU backend by default ([integration page](https://docs.ultralytics.com/integrations/executorch/)). YOLO26n-pose lists 2.9M parameters, 7.6B FLOPs, 57.2 pose mAP, and about 40 ms CPU ONNX latency ([pose task page](https://docs.ultralytics.com/tasks/pose/)). Ultralytics code and weights are AGPL-3.0; check the repository license before publishing | **Primary ExecuTorch perception model.** Export verified on 2026-10-17 in a Linux x86-64 container: 11.7 MB `.pte`, raw outputs match PyTorch within `3.3e-3`, about 34 ms per CPU forward ([observation](../experiments-before-saturday.md#yolo-pose-executorch-export-observation)) |
| RTMPose (recommended by Qualcomm staff at the event) | Top-down 17-joint body variants or the 133-joint AI Hub Body2d variant; CSPNeXt backbone with a SimCC head; Apache-2.0 | AI Hub reports 1.7 to 1.9 ms per inference on the X Elite NPU for Body2d, published as ONNX, QNN DLC, and TFLite rather than `.pte` ([model card](https://huggingface.co/qualcomm/RTMPose-Body2d)); the PyTorch module in `qai_hub_models` is the conversion source ([candidates page](../references/models/pose-candidates.md)) | **Primary NPU candidate**, converted with the Qualcomm engineer; needs a person box, so use the whole frame for one participant |
| MediaPipe Pose Landmarker | Fast, 33 landmarks with visibility, well documented, Apache-2.0 | MediaPipe 1.1.1 publishes a `win_arm64` wheel but declares `opencv-contrib-python` as a dependency, which has no Windows ARM64 wheel (PyPI file lists checked 2026-10-17) | Fallback perception and a reference for validating the ExecuTorch model |
| Qualcomm AI Hub MediaPipe-Pose-Estimation | Pre-optimized for the X Elite NPU, about 1 ms per stage | Published as precompiled QNN ONNX and QNN context binaries, not `.pte` ([model card](https://huggingface.co/qualcomm/MediaPipe-Pose-Estimation)); runs through `onnxruntime-qnn`, which has a `win_arm64` wheel | NPU fallback outside ExecuTorch; only if the ExecuTorch NPU route fails and the team accepts a mixed runtime |

The first pose model to run on the laptop should be YOLO-pose through ExecuTorch on the CPU, because that path is documented end to end, needs no Qualcomm tooling, and already exports and runs correctly through `just smoke-yolo-pose-executorch` ([runbook](../runbooks/mac-and-snapdragon-development.md#run-the-yolo-pose-executorch-export-check)). The ExecuTorch Qualcomm backend example list for 1.5.1 contains classification, detection, and language models but no pose model ([oss_scripts](https://github.com/pytorch/executorch/tree/v1.5.1/examples/qualcomm/oss_scripts)), so NPU delegation of a pose model is an experiment with unknown operator coverage, not a documented path.

### Working with the Qualcomm engineer

Qualcomm staff at the event recommended RTMPose and offered to convert models for ExecuTorch on the NPU. [The pose candidates page](../references/models/pose-candidates.md) compares the options and lists the handoff pack: a PyTorch module with weights, the input contract, the target versions, about 100 calibration frames, ten reference output tensors, and the precision preference, plus what to ask for back (the `.pte`, the runner build, a delegation profile, and the CPU-fallback operator list). [`experiments/qnn_export_pose.py`](../../experiments/qnn_export_pose.py) is an untested recipe written from the backend documentation for them to start from. The pose models need no training; the only trained component is the team's window classifier, which is also the simplest model to delegate.

### Analysis: reps, form, and the trained ExecuTorch component

Two layers sit on top of the keypoints.

The deterministic layer computes joint angles (knee, hip, elbow, shoulder, trunk lean) from keypoints, smooths them over a few frames, and runs a per-exercise state machine: for a squat, standing above a knee-angle threshold, descending, bottom below a threshold, ascending, then one repetition counted on return. This mirrors the hold, hysteresis, and cooldown logic already implemented in [the trigger engine](../../src/secondhands/decisions/triggers.py), and it guarantees a working rep counter without training data. Form cues are threshold rules on the same angles, such as knees past toes or incomplete depth.

The trained layer is a small PyTorch model over a sliding window of normalized keypoints, about 30 to 60 frames by 17 keypoints by 2 coordinates, that classifies the exercise and its phase, or scores repetition quality. A one-dimensional convolution or GRU of a few hundred thousand parameters is enough. This is the component the team fully controls and the most reliable ExecuTorch NPU candidate, because its operator set is tiny and quantizes well with the Qualcomm backend's 8-bit PT2E flow ([backend documentation](https://docs.pytorch.org/executorch/stable/backends-qualcomm.html)). Training data comes from a short team recording session labeled with the deterministic counter, kept outside Git. The same route was already proposed for SecondHands in [the runtime stack](runtime-stack.md#five-candidate-integrations).

Rule of thumb: the deterministic counter is the demo; the trained model is the on-device AI story. Never let the demo depend on a model that did not finish training.

### Runtime on the Snapdragon laptop

Three process types matter on Windows 11 ARM64. The table records which packages were found for each on 2026-10-17.

| Package | Native ARM64 Python 3.12 | x64 Python 3.12 under emulation | Source checked |
| --- | --- | --- | --- |
| PyTorch 2.14.1 CPU and torchvision 0.29.1 | Yes, `win_arm64` wheels on the PyTorch CPU index, Python 3.11 to 3.13 | Yes | [download.pytorch.org/whl/cpu](https://download.pytorch.org/whl/cpu/torch/) |
| ExecuTorch 1.5.1 Python package | **No** `win_arm64` wheel; Windows wheels are x64 only | Yes, `win_amd64` wheel with XNNPACK | [PyPI files](https://pypi.org/project/executorch/1.5.1/#files) |
| ExecuTorch Qualcomm backend runtime | Built from source with `build.ps1`, producing the ARM64 runner and backend DLL; verified by the maintainers on SC8380XP | Not applicable; ahead-of-time export must use x64 Python | [backend documentation](https://docs.pytorch.org/executorch/stable/backends-qualcomm.html) |
| OpenCV (`opencv-python`, `opencv-contrib-python`) | **No** `win_arm64` wheel | Yes | PyPI file lists |
| MediaPipe 1.1.1 | `win_arm64` wheel exists, but its OpenCV dependency does not | Yes | [PyPI files](https://pypi.org/project/mediapipe/#files) |
| NumPy, SciPy, Pillow, PyAV, pydantic-core | Yes | Yes | PyPI file lists |
| ONNX Runtime 1.31 and `onnxruntime-qnn` 2.7 | Yes | Yes | PyPI file lists |
| Ultralytics, FastAPI, Uvicorn, pyserial, bleak | Pure Python, any architecture | Yes | PyPI file lists |

These facts lead to three tiers. Build them in order and keep each one working before starting the next.

**Tier 0, day-one demo:** one x64 Python 3.12 process under Windows emulation running capture, YOLO-pose through the ExecuTorch 1.5.1 XNNPACK `.pte`, the analysis layers, and the FastAPI service. Every package in that process has an x64 wheel, so setup is `uv sync` plus a model export. Emulation costs speed; measure frames per second and accept a lower camera resolution if needed. This tier already satisfies "ExecuTorch runs the model on the device", on the CPU.

**Tier 1, native CPU:** the same service in native ARM64 Python, which gains native PyTorch, NumPy, and the ONNX Runtime wheels but loses OpenCV and the ExecuTorch Python package. Capture would move to PyAV or to the browser, and ExecuTorch would be driven through a locally built runner. The win is speed; the cost is a from-source build during the event. Only attempt this if Tier 0 is too slow for a usable demo.

**Tier 2, NPU:** export the pose model and the small classifier with the Qualcomm backend (x64 Python, `QcomChipset.SC8380XP`, 8-bit PT2E quantization), build or reuse the ARM64 `qnn_executor_runner.exe` and `qnn_executorch_backend.dll` with the QNN 2.37 libraries, and wrap the runner in a small native process that the Python service feeds over a local socket. Start with the hackathon's supplied DeepLabV3 bundle ([SH-T-009](../plan.md#snapdragon-deployment)) to learn the installed paths, then swap in the team's `.pte`. Record profiler evidence of delegation, as the [Compute procedure](../hackathon-compute.md#compute-deployment-and-verification) requires. This tier earns the on-device efficiency points; it is not required for the demo to work.

The export machine for all tiers is a Mac or Linux laptop, or the x64 Python on the device. A `.pte` is specific to its backend, so keep the XNNPACK and QNN artifacts separate under ignored `artifacts/`.

### Service and interface contract

Keep the existing FastAPI service and loopback WebSocket from [the dashboard](recognition-and-triggers.md). Add one session mode and three message types so the frontend, the requirements document, and the design document share one vocabulary. Field names below are the contract; extend them, do not rename them.

```json
{"type": "pose", "frame_id": 812, "captured_ms": 1718000000123, "inference_ms": 38.2,
 "runtime": "executorch-xnnpack", "model": "yolo11n-pose",
 "keypoints": [[0.51, 0.22, 0.98], [0.49, 0.20, 0.97]],
 "angles": {"left_knee": 92.5, "right_knee": 94.1, "trunk_lean": 12.0}}
```

```json
{"type": "rep_event", "session_id": "s-20261017-01", "exercise": "squat", "rep": 7,
 "phase": "up", "duration_ms": 2150, "depth_score": 0.82,
 "cues": ["Go a little deeper"], "source": "rules"}
```

```json
{"type": "session_summary", "session_id": "s-20261017-01", "exercise": "squat",
 "reps": 12, "median_rep_ms": 2200, "form_score": 0.78,
 "baseline": {"reps": 8, "form_score": 0.70, "recorded": "2026-10-17"}}
```

Keypoints are normalized to the image, with a per-point confidence. `source` distinguishes the deterministic counter from the trained classifier so the UI can show both during evaluation. Control messages from the frontend select the exercise, start and stop a session, and mark a baseline. The service stores summaries in SQLite through the standard library and exposes `GET /api/sessions` for the progress screen. Frames and keypoint sequences are never stored unless the user starts an explicit recording for training, and those files stay outside Git.

### Frontend

The dashboard is now React 19, TypeScript, and Vite with Bun as the package manager and runner, merged to `main` on 2026-10-17 through [pull request #12](https://github.com/davidmoshal/SecondHands/pull/12) from the earlier Vue scaffold; it keeps the WebSocket transport, camera preview, and signal views ([UI package](../../ui/package.json)). An [interactive prototype](https://claude.ai/artifact/CQdDefYFJcuS6qYVJN4K9B) published on 2026-10-17 shows the intended screens (session, clinical test, progress, protocols, device) with the real rep rule running on simulated keypoints. A second [Companion prototype](https://claude.ai/artifact/NEUGjVwwQnghzXrQRcVb3F) establishes the two-audience requirement: a Home view for the person exercising, with large type, one instruction at a time, encouragement instead of numbers, a break button, and accessibility preferences, and a Clinic view for the clinician with every measurement and threshold. Both read the same messages; the Home view turns thresholds into a single instruction and never shows them. The tracker adds a session screen with a skeleton overlay drawn on a canvas from the `pose` message, a large rep counter and phase indicator, a form-cue line, and a progress screen that charts `session_summary` records against the baseline. Whichever framework the frontend teammates finish in, the WebSocket contract above and the Vite-style proxy to `127.0.0.1:8765` are the only integration points; the Python service does not depend on the UI framework. Browser-side camera capture through `getUserMedia` is a documented fallback for Tier 1, where the browser sends JPEG frames over the same socket.

### Storage and privacy

SQLite through Python's standard library, one file under ignored `data/`, with tables for users (a role label, never a name), baselines, sessions, and rep events. Export to JSON for the presentation. No cloud service, no accounts, and no frames on disk by default. The reasons for keeping frames on the machine are on the [on-device advantages](../requirements/on-device.md) page.

### Optional sensors and actuators

- **Heart rate:** the article's walking-test pulse needs a sensor. A Bluetooth Low Energy chest strap or watch broadcasting the standard heart-rate service can be read with the pure-Python `bleak` library; its Windows ARM64 behavior is untested here. Manual pulse entry is the day-one path.
- **Arduino sensors:** an ultrasonic distance sensor for sit-and-reach or a pressure mat for balance, read over USB serial with `pyserial`. Pure Python; the serial driver on Windows ARM64 needs a quick check. This also reuses the SecondHands actuator path if the demonstration wants a physical response.
- **Depth stream:** see [Sensing](#sensing); only after RGB capture works.

## Document map for the team

| Teammate document | What it owns | Where it links into this stack |
| --- | --- | --- |
| Product requirements document | Target users, the five-step feature list, acceptance criteria, demo script | [What the product does](#what-the-product-does) supplies the feature-to-measurement table; acceptance criteria should name the rep-count accuracy and latency the demo must meet |
| Technical design document | Component boundaries, data flow, error handling, test plan | [Architecture](#architecture), [layer decisions](#layer-decisions), and the [interface contract](#service-and-interface-contract); add sequence diagrams and failure cases there rather than here |
| Frontend | Screens, state, visual design | [Frontend](#frontend) and the three message types; React 19 with Bun is the merged frontend stack; the frontend consumes, never computes, reps and scores |
| Hardware and camera setup | Which camera, cables, drivers, measured frame rate | [Sensing](#sensing), [SH-Q-006](#sh-q-006--which-camera-serves-the-demonstration), and the hardware pages |
| Presentation | Story, evidence, judging criteria | The [judging weights](../hackathon/judging-criteria.md#scoring): use case and impact 40, technical 25, on-device efficiency 15, deployment and documentation 10, presentation 10. The efficiency points need Tier 2 profiler evidence or an honest CPU measurement |
| [Field sobriety example](../requirements/field-sobriety.md) | An additional example of the pose pipeline, not the product requirements document | Walk-and-turn and one-leg-stand observations. The hackathon product remains the fitness session in [What the product does](#what-the-product-does) |

When those documents exist in this repository, link them from this table and from [the Wiki index](../index.md). Until then this page is the shared reference.

## Two-day plan

| When | Perception and runtime | Analysis and service | Frontend and docs |
| --- | --- | --- | --- |
| Day 1 morning | Export YOLO-pose to an XNNPACK `.pte` (done in a Linux container with `just smoke-yolo-pose-executorch`; repeat on a Mac if one is the export machine); check keypoints on a few exercise images | Implement angles and the squat and push-up state machines with recorded clips | Session screen skeleton with mocked `pose` messages; requirements and design documents started |
| Day 1 afternoon | Install x64 Python 3.12 and the Tier 0 environment on the laptop; run the `.pte` on live camera frames; measure frames per second and latency | Wire `rep_event` and `session_summary`; SQLite store; baseline marking | Live overlay, rep counter, progress screen against real messages |
| Day 1 evening | Locate the supplied Qualcomm bundle; run DeepLabV3 per the guide; attempt the QNN export of the small classifier | Record a short labeled training set; train the window classifier on a Mac | Rehearse the demo script; record screenshots |
| Day 2 morning | If the QNN export loads, run it through the native runner and capture profiler output; otherwise keep CPU and document why | Compare classifier output with the rule counter on held-out clips; pick which one feeds the UI | Progress and comparison polish; documentation of setup commands |
| Day 2 afternoon | Freeze the artifacts; measure warmed latency, memory, and sustained behavior per the Compute procedure | Final checks on stop, restart, and camera loss | Presentation, demonstration, and this page updated with observed results |

One person owns Tier 2 for the whole event so that the NPU experiment never blocks the demo path.

## Risks and fallbacks

| Risk | Signal | Fallback |
| --- | --- | --- |
| Emulated x64 Python is too slow for live pose | Under about 10 frames per second at 640 pixels | Lower the input to 320 or 416 pixels; skip frames; try Tier 1 native PyTorch with browser capture |
| YOLO-pose ExecuTorch export fails or keypoints disagree with PyTorch | Export error or large keypoint differences | Use MediaPipe Pose Landmarker for perception and keep ExecuTorch for the window classifier |
| Qualcomm backend rejects pose-model operators | Partitioner leaves most nodes on the CPU or lowering fails | Delegate only the small classifier to the NPU; report the pose model as CPU |
| No camera on the laptop works | OpenCV cannot open any index | Phone camera over Wi-Fi, or browser `getUserMedia` capture |
| Training set too small for the classifier | Poor held-out accuracy | Demo with the deterministic counter; present the classifier as evaluation output only |
| Organizers require all inference through ExecuTorch | Clarification during the event | Tier 0 already satisfies this for perception; disable MediaPipe fallbacks in the demo |

## Evidence and limits

Verified on 2026-10-17 by running the locked export check in a Linux x86-64 container: YOLO11n-pose exports to an ExecuTorch 1.5.1 XNNPACK `.pte` and matches PyTorch on an identical input ([observation](../experiments-before-saturday.md#yolo-pose-executorch-export-observation)). Verified the same day by inspecting package indexes and official documentation: the wheel availability table, the Ultralytics ExecuTorch export support for the Pose task, the ExecuTorch Qualcomm backend's Windows ARM64 verification on SC8380XP and its x64-Python export requirement, the absence of pose examples in the 1.5.1 Qualcomm example scripts, and the Orbbec and RealSense platform lists. Not verified: any execution on the Dell laptop, pose-model accuracy on team participants, NPU delegation of any pose or classifier model, Windows ARM64 behavior of `bleak` and serial drivers, and the exact wording of the Mayo article page. The plan's [movement tracker tasks](../plan.md#dependencies-and-order) track that work.

## Questions

### SH-Q-005 — How does the movement tracker relate to SecondHands?

**Resolved on 2026-10-17 by the user: the fitness tracker is the project.** The user stated that the assistive-control material currently in the Wiki is a previous idea and that the Wiki will be updated to the tracker. Until that update lands, [the proposal](../proposal.md), the README, and the assistive tasks in [the plan](../plan.md) are historical context, not current requirements. [Project direction](../project.md#established-user-direction) records the decision.

The alternatives considered before the decision are preserved here for the record. An extension within SecondHands would have kept the assistive story and added adapted exercises as a rehabilitation mode; a pivot makes the Mayo-style tracker the submission; two deliverables would have shared one stack. The user chose the pivot. The existing capture, service, trigger-engine, and dashboard code remain reusable, and [Kate's clinical application work](https://github.com/davidmoshal/SecondHands/issues/7) should be re-scoped to the tracker by its owner.

Remaining follow-up, tracked as [SH-T-048](../plan.md#dependencies-and-order): update the proposal, README, index wording, and issue descriptions to the tracker, and retire or re-scope the assistive-only tasks. Use case and impact carries 40 of 100 judging points ([criteria](../hackathon/judging-criteria.md#scoring)), so the product requirements document should state the tracker's impact story explicitly.

### SH-Q-006 — Which camera serves the demonstration?

**Open technical investigation with a decision at the end.** The user has an Orbbec Astra and an Intel RealSense available; the SecondHands proposal selected a Femto Bolt, and the laptop has a built-in camera. No external camera has been tested on the Dell. The [sensing table](#sensing) records that none of the depth SDKs publishes a Windows ARM64 package.

- **Built-in or UVC webcam, RGB only:** zero setup, works with the existing capture module. Example: the laptop camera at 720p feeding YOLO-pose. Loses absolute distances such as sit-and-reach in centimetres.
- **RealSense as a UVC webcam:** likely to appear as a normal Windows camera for RGB; depth needs the x64 SDK under emulation. Example: use its color stream today, and test `pyrealsense2` x64 only if a depth feature is scheduled.
- **Orbbec Astra:** record the exact model first. Original Astra models use the OpenNI protocol and legacy SDKs with no Windows ARM64 support; Astra Mini Pro variants can be upgraded to UVC firmware for SDK v2 on x64. Example: skip for the event unless the Astra's RGB stream appears as a UVC camera.
- **Femto Bolt:** follow [the existing procedure](../hardware/femto-bolt.md); same x64-only limitation.

Decide by one test per camera on the Dell: does Windows list it as a camera, does OpenCV in x64 Python read frames, and what frame rate results. Record outcomes in the hardware pages and close this Question with the chosen camera and the measured frame rate. [SH-Q-002](../hardware/femto-bolt.md#sh-q-002--which-capture-path-works-on-the-dell) covers the Femto Bolt part of the same investigation.
