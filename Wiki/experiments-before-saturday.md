# Experiments before Saturday

**Status:** Proposed experiment plan for the lead-up to Saturday, 2026-10-17. This page incorporates “The experiment I'd run before Saturday” from the model review supplied by the user on 2026-10-14. That section matches the [archived source](SecondHands-conversation.md#the-experiment-id-run-before-saturday), including its proposed division of effort and Saturday follow-up. The original three-model comparison remains unrun. The dated MediaPipe observations below record a separate execution check.

## Purpose

Task status and execution evidence links are tracked in [the task plan](plan.md). This page owns the experiment method and recorded results when available.

Compare candidate decision models on SecondHands movements before access to the supplied Compute PC. Use the same small test set on the Apple Silicon Mac to establish a comparative baseline. The results will inform [SH-Q-001 — Model and runtime selection](project.md#sh-q-001--model-and-runtime-selection); Mac results will not establish Snapdragon X Elite performance or compatibility.

## Models and observations

This is the earlier three-model comparison proposal. The [model reference index](references/models/index.md#recommended-starting-order) owns the newer five-candidate starting recommendation and the retained research leads. Recording that recommendation does not by itself revise this proposed benchmark or claim completed experiments.

On 2026-10-16, the user requested about five candidate integrations on the Mac before porting. The [runtime design](design/runtime-stack.md#five-candidate-integrations) explains that expanded exploration and its different model roles. The original comparison below remains a preserved proposal, not a completed evaluation or a requirement to replace SmolVLM with MobileCLIP2.

Compare these three models from the supplied review:

- [Laya Vision 201M](https://huggingface.co/thaitea/laya-vision-201m).
- [Mapika Decider 2B Vision](https://huggingface.co/Mapika/decider-2b-vision).
- [MobileCLIP2-S0](https://huggingface.co/apple/MobileCLIP2-S0).

Create approximately 30–50 labeled observations with examples from two different volunteers. Include deliberate movements, neutral movements, and ambiguous gestures. Run the same observations through each model so that the comparison uses the same evidence.

These are experiment candidates from the supplied review, not a final model selection. The later image checks below establish execution for named candidates, not completion of this proposed benchmark. MobileCLIP2 remains untested. The [current proposal](proposal.md) continues to own the product architecture and hardware proposal; this benchmark does not select a camera.

## Measurements

| Metric | Question the measurement answers |
| --- | --- |
| Decision accuracy | Does the model choose the correct observable gesture? |
| False activation rate | Does it trigger when no command was intended? |
| Abstention performance | Can it decline uncertain decisions? |
| Median / p95 latency | How responsive is it? p95 is the 95th percentile of measured response times. |
| Memory use | How much memory does it need, and could it fit the event hardware? |
| Calibration effort | How many examples does a new user need? |
| Configurability | Can the available choices change without retraining? |

These measurements concern SecondHands observations. Published benchmarks on unrelated images or decision tasks do not replace this comparison. The source gives no numerical acceptance thresholds or results.

## Proposed division of effort

These roles reproduce the source's recommended responsibilities; they do not record confirmed task assignments.

| Role | Responsibility |
| --- | --- |
| AI specialist | Compare Laya Vision, Mapika Decider, and MobileCLIP2. |
| Project lead | Camera pipeline, calibration data collection, actuator, and application integration. |
| Doctor | Choose movements that are accessible, intentional, and practical; define safe failure behavior. |
| Marketing teammate | Develop the two-person demonstration, product story, and presentation. |

## Saturday follow-up

The source recommends first getting the supplied DeepLab ExecuTorch demonstration running on the Compute PC. Then assess whether a useful part of the vision-decision pipeline can move into ExecuTorch while experimental decision models run through their native local runtimes. Availability of the supplied demonstration and acceptance of this runtime combination remain [evidence gaps](project.md#implementation-and-evidence-limits).

## MediaPipe baseline observations

On 2026-10-16, the user requested the first Python baseline through a subagent: MediaPipe Face Landmarker and Gesture Recognizer, followed by another model in a later step. The implementation and parent review used the Apple Silicon Mac with Python 3.12.9, MediaPipe 0.10.35, opencv-contrib-python 4.14.0.94, and NumPy 2.5.4. PyTorch 2.14.1 remained installed but is not the runtime for these MediaPipe tasks.

Inputs were Google's public [portrait sample](https://storage.googleapis.com/mediapipe-assets/portrait.jpg) and [thumb-up sample](https://storage.googleapis.com/mediapipe-assets/thumb_up.jpg). Version-1 task bundles came from the official model URLs recorded with SHA-256 checksums in [`recognition/assets.py`](../src/secondhands/recognition/assets.py). Model bundles and samples remain under ignored `artifacts/`; no camera recordings or personal calibration data were added to Git.

- The portrait produced one detected face, 478 landmarks, and 52 blendshape scores.
- The thumb-up sample produced one detected hand, 21 landmarks, and the `Thumb_Up` category. The subagent's initial observation reported a score of about 0.7433; that is a raw model score for one image, not calibrated command confidence.
- The parent ran both samples through the `just recognize-image` recipe and checked parseable JSON and the output counts/categories.
- The Python suite passed all 10 tests with local bundles enabled through `SECONDHANDS_TEST_MODELS=artifacts/mediapipe`. Without that opt-in, the subagent observed nine passing tests and one skipped model integration test. Cases cover structured outputs, empty detections, invalid CLI input, download checksum rejection, camera cleanup on failure, and real-model blank-frame/timestamp behavior.
- The subagent verified Ruff lint/formatting, source distribution and wheel builds, isolated package imports and CLI help without vision dependencies, and the existing PyTorch CPU smoke calculation. The parent also checked the explicit model-download recipe and the camera recipe by dry run.

This establishes installability and real image inference on the Mac. No comparative accuracy study, calibrated intentional command, sustained latency benchmark, physical action, Vue integration, real-camera execution, or Windows execution was tested. Inference timing boundaries are defined in [the runbook](runbooks/mac-and-snapdragon-development.md#run-mediapipe-face-and-hand-recognition); the reported task timings exclude capture, loading, conversion, output, and display. Live camera tracking does not establish recognition of a temporal gesture such as nodding.

## ExecuTorch CPU smoke observation

On 2026-10-16, the Mac ran [`experiments/executorch_cpu_smoke.py`](../experiments/executorch_cpu_smoke.py) through `just smoke-executorch`. Its separate script lock resolved an isolated Python 3.12 environment with ExecuTorch 1.5.1 and PyTorch 2.14.1. The root application dependency files were not changed for this experiment.

The script exported an untrained 52-input, 16-hidden-unit, 3-output multilayer perceptron (MLP) through `torch.export` and XNNPACK lowering. It verified that the serialized program contains an `XnnpackBackend` delegate, wrote a 6,540-byte `.pte`, then loaded and executed that file through the ExecuTorch Python runtime. Across 12 synthetic inputs, all output comparisons passed with `rtol=1e-4` and `atol=1e-6`; maximum absolute error was approximately `5.96e-8`.

This verifies export, CPU backend registration, serialization, loading, and numerical agreement for this small network on Darwin ARM64. It does not establish recognition accuracy, a trained personalized classifier, candidate-model compatibility, performance, or Windows/NPU execution. Upstream warnings about macOS redirects, deprecated PyTorch enum registration, and CPU-info probing did not prevent the check from passing. Commands are in [the runbook](runbooks/mac-and-snapdragon-development.md#run-the-executorch-cpu-smoke-check); the [runtime design](design/runtime-stack.md) explains how this differs from the Qualcomm path.

## YOLO pose ExecuTorch export observation

On 2026-10-17, a Linux x86-64 cloud container ran [`experiments/yolo_pose_executorch.py`](../experiments/yolo_pose_executorch.py) through `uv run --locked --script`, the command behind `just smoke-yolo-pose-executorch`. Its separate script lock resolved an isolated Python 3.12.3 environment with Ultralytics 8.4.181, ExecuTorch 1.5.1, and CPU-only PyTorch 2.14.1 from the PyTorch CPU index. The root application dependency files were not changed.

Ultralytics exported the pretrained `yolo11n-pose.pt` checkpoint (2,866,468 parameters, 17 COCO keypoints) with `format="executorch"` at 640 pixels in about 31 seconds, producing an 11,694,668-byte `model.pte` with the XNNPACK CPU backend. Feeding one identical 640×640 letterboxed tensor of the public `bus.jpg` sample through the PyTorch model and the ExecuTorch Python runtime gave the same `(1, 56, 8400)` output shape with a maximum absolute difference of about `3.3e-3` and a median relative difference of about `1.5e-7`. The ExecuTorch forward pass took a median of 34.1 ms over ten repeats on the container's CPU.

Ultralytics prediction through both runtimes found four people. Three matched by box centre, with 37 keypoints visible in both and a maximum keypoint difference of 27.1 pixels; the fourth person's boxes did not match within 20 pixels. Ultralytics letterboxes the PyTorch checkpoint to a rectangular input and the exported model to a fixed square, so this prediction-level difference includes preprocessing and postprocessing differences, not only the export. Median prediction time was 36.9 ms for PyTorch and 67.1 ms for the exported model through Ultralytics' loader, which includes its own pre- and postprocessing.

This verifies that the Ultralytics pose export to ExecuTorch works with the hackathon's ExecuTorch version and that the exported graph matches PyTorch numerically. It does not establish pose accuracy on team participants, exercise recognition, Mac or Windows execution, emulated x64 performance on the Snapdragon laptop, or Qualcomm NPU delegation. The FP32 XNNPACK artifact is a CPU baseline. Commands are in [the runbook](runbooks/mac-and-snapdragon-development.md#run-the-yolo-pose-executorch-export-check); [the tech stack](design/tech-stack.md#perception-pose-estimation) explains the model's role.

## Dashboard implementation observations

On 2026-10-17, the user approved the reviewed design and requested implementation through a subagent. The implementation adds a loopback FastAPI WebSocket service and Vue exploration dashboard. Commands and interaction steps are in [the runbook](runbooks/mac-and-snapdragon-development.md#run-the-live-exploration-dashboard); [the design](design/recognition-and-triggers.md) owns the implemented behavior and remaining proposals.

The subagent ran `SECONDHANDS_TEST_MODELS=artifacts/mediapipe just test-dashboard`: 33 Python tests and two frontend transport tests passed, followed by Vue type checking and its production build. Ruff lint and formatting also passed. Covered boundaries include holds, hysteresis, release without repeats, single-modality Either mode, missing tracking, combined overlap, sequence confirmation edges, timeout/cancel, bounded work, old mapping results, calibration visibility, worker failure, and in-flight Stop/resource cleanup. API-dependent tests have an optional-dependency skip boundary.

Separate locked, isolated runs verified optional dependencies without changing the running application environment: base development had 24 passing tests and four skips; vision-only had 26 passing tests and two skips, with FastAPI confirmed absent. API tests skip without FastAPI, camera-device tests skip without OpenCV, and the model-backed integration test remains opt-in. The later mapping-field note also passed Vue type checking/build.

The actual native backend also processed the existing official portrait and hand samples with camera reads replaced by those static inputs. The portrait produced one face and no hands; the hand sample produced one hand and no faces. JPEG preview dimensions matched each recognition result. Both MediaPipe models loaded and executed; no physical camera was opened.

The parent reviewed the source and inspected the stopped dashboard in the collaborative browser. The Vite `/api/health` proxy returned success, simulation was off, action controls were disabled before Start, the mapping selector changed, and no desktop horizontal overflow or browser console error was observed. This is browser rendering and proxy evidence, not a live-camera end-to-end test.

Limits remain: one active mapping and participant, exactly one detected hand for hand commands, shared activation/release scores across cues, in-memory sample calibration rather than a trained classifier, and comparison of already-computed MediaPipe outputs. At this dashboard check, the remaining pretrained candidates were untested; later image experiments are recorded below. Participant accuracy/false activations, complete interaction latency, physical controls, remote operation, and Windows/NPU execution remain untested. Native work must finish before resource cleanup; there is no forced camera-driver interruption.

## Decision-model image observations

On 2026-10-17, the user requested setup, testing, and documentation of the remaining three starting candidates. Laya Vision, Mapika Decider Vision, and SmolVLM completed local image tests on an Apple M3 Max Mac with 128 GiB RAM. Together with the two MediaPipe bundles, all five starting candidates now execute locally. These are CLI experiments, separate from the dashboard. No camera was opened and no personal recordings were used.

The [shared runner](../src/secondhands/recognition/decision_experiments.py) records model revisions, dependencies, device, dtype, image checksums, outputs, loading time, and synchronized request timing. Each model uses its own locked script environment and pinned weights. The same public MediaPipe portrait and thumb-up images used above supplied two questions:

- Hand: “Which visible hand gesture is present?” Choices: `thumbs up`, `open palm`, `closed fist`, `other hand pose`, `no visible hand`.
- Face: “Which visible facial movement is present?” Choices: `smiling`, `mouth open`, `neutral expression`, `no visible face`.

The portrait shows a smile and resting hands with crossed arms. The thumb-up sample shows a hand and no face. These visual observations are smoke-test references, not an independently labeled evaluation set. Each image/question pair receives one first request and three measured warm requests. A warm request uses an already-loaded model. The model processes the image again on each request; results are not retrieved from a prediction cache.

The shared context is “Describe visible posture only. Do not infer a command or intent.” The final runner also records this context and its source-file SHA-256 in new reports. The earlier Laya and SmolVLM reports predate those two metadata fields; their questions, choices, model pins, and outputs are recorded.

| Model | Verified runtime | Hand warm median, portrait / thumb-up | Face warm median, portrait / thumb-up |
| --- | --- | --- | --- |
| Laya Vision 201M | PyTorch 2.14.1, Transformers 5.17.0, MPS float32 | 64.00 / 62.04 ms | 63.74 / 62.72 ms |
| Mapika Decider 2B Vision | PyTorch 2.14.1, Transformers 5.20.1, MPS float16 | 661.96 / 182.77 ms | 660.03 / 181.05 ms |
| SmolVLM-500M | PyTorch 2.14.1, Transformers 4.57.6, MPS float32 | 134.03 / 123.60 ms | 113.05 / 107.51 ms |

Laya selected `thumbs up` for the hand sample and `closed fist` for the portrait. It selected `smiling` for both facial questions, including the image with no face. Mapika selected `thumbs up` for the hand sample, `open palm` for the portrait, `smiling` for the portrait's face, and `no visible face` for the hand-only image. SmolVLM generated `Thumbs up.` and `Other hand pose.` for the hand questions. It generated `Smiling.` for the portrait and incorrectly generated `Neutral expression.` for the image with no face. All repeated outputs within each image/question pair were identical. Model scores and generated answers do not establish command intent.

Laya also completed a separate CPU check with one warm repeat per image. Hand outputs matched the MPS run; warm requests took about 195–197 ms. This verifies an additional Mac execution path, not a Windows path. Version problems and the remaining Laya configuration warning are recorded in [its model page](references/models/laya-vision-201m.md#compatibility-findings). SmolVLM uses no image splitting, a 512-pixel longest edge, greedy generation, and a maximum of 32 new tokens; [its model page](references/models/smolvlm-500m-instruct.md#verified-mac-execution) records the settings and memory observations.

Mapika's MPS patch reported success. Its first hand process took 16.54 seconds to load, compared with 3.15 seconds for the later face process. Peak process RSS was about 8,985–9,022 MiB; this is not total GPU or system memory. Its large weight download was completed through parallel HTTP ranges and verified against the expected SHA-256 before the normal download command finalized the local snapshot. The optional MLX package and dependency overrides were not needed. [The Mapika page](references/models/mapika-decider-2b-vision.md) records the pinned setup and inference interface.

Timings include image preprocessing, model inference, output decoding, and MPS synchronization. They exclude image-file reading, model loading, camera capture, transport, display, and action execution. Downloads continued in the background during parts of this session. Three warm repetitions on two images cannot establish p95 latency, comparative accuracy, calibrated confidence, or performance under sustained camera load.

The useful result is that local execution works and absence handling fails in these examples. A future command integration must keep tracking checks, an explicit no-command outcome, and temporal confirmation separate from model output. No model is selected for production by these checks. The [runbook](runbooks/mac-and-snapdragon-development.md#run-the-other-three-image-models) owns reproducible commands; [the task plan](plan.md#models) owns remaining work.

Generated JSON stays under ignored `artifacts/results/`; the model pages and this section preserve the observed findings. The Python suite passed 39 tests with local MediaPipe bundles enabled. New tests cover choice validation, invalid probabilities, generated text without invented confidence, empty answers, and rejected sample checksums. Ruff checks and the Python package build also passed. These checks do not replace the real-model image runs or the still-unrun participant comparison.
