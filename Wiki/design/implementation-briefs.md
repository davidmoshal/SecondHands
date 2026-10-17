# Implementation briefs

**Status:** written on 2026-10-17 so that any teammate, or a coding agent working from a fresh checkout, can pick up one piece of the tracker without the chat history. Each brief states the goal, what to read, the files to create or change, the contract it must honour, the acceptance checks, and what is out of scope. [The plan](../plan.md) owns status and order; this page owns the technical specification of each task. Module names follow [the team workflow](../runbooks/team-workflow.md#project-structure); until a module exists, the brief that creates it is the authority.

Rules for every brief: work on a branch named `<initials>/<topic>`; keep the [public repository rules](../../AGENTS.md#public-repository-content); add tests next to the code; update the owning Wiki page and [the log](../log.md) in the same pull request; never commit `artifacts/` or `data/`. An agent should run `uv sync --locked --extra vision --extra dashboard` and `just test-vision` first to see the baseline passing, then stop at the acceptance checks of its brief rather than widening scope.

## Shared contract

The three WebSocket messages are fixed by [the tech stack](tech-stack.md#service-and-interface-contract). The `Keypoints` type that crosses from perception to analysis is defined in brief C1 and is the only thing analysis may depend on from perception. Joint order is COCO-17: nose, left eye, right eye, left ear, right ear, left shoulder, right shoulder, left elbow, right elbow, left wrist, right wrist, left hip, right hip, left knee, right knee, left ankle, right ankle. Coordinates are normalized to the image, origin top-left, with a confidence in `[0, 1]` per joint.

## A · Protocol definitions (clinicians)

**Goal.** Two protocol definitions, CS-30 (30-second chair stand) and SLS-01 (single-leg stance), in the [template](../use-cases.md#protocol-template), with thresholds the clinicians stand behind for the demonstration.

**Read.** [Use cases](../use-cases.md), [skeletal medical tests](../requirements/skeletal-medical-tests.md), the Home-view wording in the [Companion prototype](https://davidmoshal.github.io/SecondHands/companion.html).

**Deliver.** The filled template on the use-cases page, then the same values in `src/secondhands/protocols/cs-30.json` and `sls-01.json` once brief D2 exists (an engineer transcribes; the clinician checks the diff). Include the adapted variants (hands allowed, fewer reps, chair with arms) and the acceptance criteria for the demo: count agreement with a clinician count, time agreement with a stopwatch.

**Done when** both files validate with `just validate-protocols` and the plan task SH-T-057 links to them. Not in scope: thresholds for any other test.

## B6 · Tier 0 environment on the laptop

**Goal.** A reproducible x64 Python 3.12 environment on the Windows ARM64 laptop that runs the verified YOLO11n-pose `.pte` through ExecuTorch on live camera frames, with frame rate and latency recorded.

**Read.** [Team workflow](../runbooks/team-workflow.md#sharing-the-one-snapdragon-laptop), [runtime tiers](tech-stack.md#runtime-on-the-snapdragon-laptop), [runbook](../runbooks/mac-and-snapdragon-development.md).

**Steps.** Install the x64 build of Python 3.12 and `uv`; clone to the agreed path; `uv sync --locked --extra vision --extra dashboard`; `just smoke-yolo-pose-executorch`; then `just recognize-pose --camera-index 0` (brief C1) for 60 seconds; record median and p95 inference time, frames per second, process memory, and the exact package versions. Repeat at 416 pixels if under 15 fps. Write a `scripts/laptop-setup.ps1` that reproduces the steps.

**Done when** the numbers are on [the experiments page](../experiments-before-saturday.md) under a dated heading, the script is committed, and the runbook's Windows section links to it. Not in scope: native ARM64 Python, the NPU.

## B7 · Camera selection

**Goal.** Close [SH-Q-006](tech-stack.md#sh-q-006--which-camera-serves-the-demonstration) with one measured test per available camera on the laptop.

**Steps.** For each of the built-in camera, the RealSense colour stream, and the Femto Bolt bridge: does Windows list it, does OpenCV in x64 Python read frames, resolution and frames per second over 30 seconds, and any disconnect. Record in `Wiki/hardware/` and name the demo camera in the Question's resolution.

**Done when** the Question is resolved with numbers and `capture/camera.py` defaults match the chosen device. Not in scope: depth.

## C1 · Perception module and ExecuTorch XNNPACK backend

**Goal.** `src/secondhands/perception/` with one interface and a working ExecuTorch backend for YOLO11n-pose, so analysis never imports a model library.

**Files.**

- `perception/base.py`: `@dataclass(frozen=True) class Keypoints: joints: tuple[tuple[float, float, float], ...]` (17 entries of x, y, confidence), `image_size: tuple[int, int]`, `inference_ms: float`, `runtime: str`, `model: str`, `person_confidence: float`; `class PoseBackend(Protocol)` with `infer(self, rgb: np.ndarray) -> Keypoints | None` and `close(self) -> None`; `COCO_JOINTS` names; `def load_backend(name: str, **options) -> PoseBackend`.
- `perception/executorch_xnnpack.py`: loads `artifacts/yolo-pose/yolo11n-pose_executorch_model/model.pte` (path configurable) through `executorch.runtime.Runtime`; letterboxes to the model input, runs, decodes the `(1, 56, 8400)` output (4 box values, 1 objectness, 17 × 3 keypoints), keeps the highest-confidence person with a confidence threshold, maps keypoints back to normalized image coordinates. Use the raw-tensor path proven in `experiments/yolo_pose_executorch.py`.
- `perception/mediapipe_pose.py`: optional fallback under the `vision` extra, mapping MediaPipe's 33 landmarks to the 17 COCO joints; may be a stub that raises a clear error if the bundle is absent.
- `perception/__main__.py`: `python -m secondhands.perception image path` and `camera --camera-index 0 --max-frames N` printing one JSON line per frame; add `just recognize-pose` and `just download-pose-model` (which calls the existing export script) to the justfile.
- Dependencies: add `executorch==1.5.1` and `ultralytics` only to a new optional extra `pose` in `pyproject.toml`; do not add them to the root defaults. Run `uv lock`.

**Acceptance.** `tests/test_perception.py`: the decoder on a saved reference output tensor yields 17 joints inside `[0, 1]`; the backend on the public `bus.jpg` returns a person with nose confidence above 0.5 and joints within 20 pixels of the Ultralytics prediction saved as a fixture; a frame without a person returns `None`. Tests skip cleanly when the `.pte` is absent. `ruff check` and `ruff format --check` pass.

**Out of scope.** Tracking across frames, multiple people, the QNN runner (brief C2).

## C2 · QNN backend client and the Qualcomm handoff

**Goal.** The NPU path behind the same interface, once a QNN `.pte` exists.

**Steps.** Deliver the [handoff pack](../references/models/pose-candidates.md#handoff-pack-for-the-qualcomm-engineer) (module and weights, input contract, calibration frames from brief G1, reference outputs, precision preference). When the `.pte` and runner come back: `perception/executorch_qnn.py` as a client that sends one preprocessed tensor per frame to a native ARM64 runner process over a loopback socket (proposed port 8780) and parses keypoints back; a tiny C++ or Python-side wrapper for `qnn_executor_runner.exe` if the runner only takes files. Record delegation evidence (profiler or ETDump) and latency on the experiments page.

**Acceptance.** Same tests as C1 with `runtime == "executorch-qnn"`; keypoint error against the PyTorch reference recorded per precision. Out of scope: training.

## D1 · Analysis: angles, rep counter, scorers

**Goal.** Pure functions and small state machines that turn `Keypoints` sequences and a protocol into events. No I/O, no camera, no model.

**Files.**

- `analysis/angles.py`: `joint_angle(a, b, c)` in degrees; `knee_angles`, `hip_angles`, `trunk_lean` (shoulder-midpoint to hip-midpoint against vertical), `hip_height` (normalized between a seated and standing reference captured at session start), `symmetry` (left/right knee angle difference as a percentage); an exponential smoother with a configurable time constant; all tolerant of low-confidence joints (return `None`, never `NaN`).
- `analysis/reps.py`: `class SitToStandCounter` and `class SquatCounter` with states `seated/rising/standing/sitting` and `standing/down/bottom/up`, hysteresis thresholds taken from the protocol, minimum phase durations, and a `step(sample, t) -> list[Event]` method emitting `rep_event` dictionaries exactly as the contract specifies (`rep`, `phase`, `duration_ms`, `depth_score` or `rise_ms`, `cues`, `source: "rules"`), plus `shallow_attempt` events. Mirror the structure of [`decisions/triggers.py`](../../src/secondhands/decisions/triggers.py).
- `analysis/scorers.py`: `ChairStand30` (count within 30 s, median rise, flags) and `SingleLegStance` (hold time until foot-down or 30 s, sway amplitude of the hip midpoint in normalized units converted to centimetres with a calibrated scale, arm-abduction and hop events) producing `session_summary` fields.
- `analysis/session.py`: accumulates events into the `session_summary` (reps, median rep time, form score, flags, baseline delta when a baseline is supplied).

**Acceptance.** `tests/test_analysis.py` with synthetic traces generated in the test: one clean sit-to-stand yields exactly one rep with plausible timing; a rise to 60 % hip height yields a `shallow_attempt` and no rep; a slow rise above the protocol's `rise_s` sets the flag; smoothing removes a one-frame glitch; low-confidence joints never raise; scorer outputs match hand-computed values. A `just replay-keypoints file.jsonl --protocol cs-30` command prints the events for a recorded sequence.

**Out of scope.** Learning anything from data (brief G2), drawing.

## D2 · Protocol schema and loader

**Goal.** Clinician-authored JSON that the engine reads, validated at load.

**Files.** `protocols/schema.py` (dataclasses: `Protocol(id, name, instructions, setup, phases, metrics, thresholds, report, reference, agreement, safety, draft: bool)`, validation with clear messages), `protocols/loader.py` (`load(id)`, `list()`, overrides for threshold edits from the Clinic view), `protocols/cs-30.json` and `protocols/sls-01.json` using the [template fields](../use-cases.md#protocol-template) with `"draft": true` until brief A replaces the values, and `just validate-protocols`.

**Acceptance.** Tests for a valid file, a missing threshold, an out-of-range value, and an override that changes a counter's behaviour in D1. Out of scope: a protocol editor UI beyond threshold overrides.

## E1 · Tracker session in the service, sessions API, storage

**Goal.** The loopback FastAPI service streams the three contract messages for a tracker session and stores summaries.

**Files.** `api/tracker.py` (a session class parallel to the existing `DashboardSession`: owns one perception backend from C1, one counter or scorer from D1 per selected protocol, bounded frame work, invalidation on `select_protocol`), control messages `select_protocol {id, overrides}`, `start`, `pause`, `stop`, `mark_baseline`; `storage/db.py` (standard-library SQLite under `data/secondhands.sqlite`: `participants(role_label)`, `baselines`, `sessions`, `rep_events`), `GET /api/sessions`, `GET /api/sessions/{id}`, `GET /api/sessions/{id}/export`; `SECONDHANDS_API_PORT` honoured by `python -m secondhands.api` and by `ui/vite.config.ts`.

**Acceptance.** `tests/test_tracker_api.py` with a fake backend that replays a synthetic trace: message types and field names match the contract; `rep_event` precedes the `session_summary`; a `select_protocol` mid-session discards in-flight results; storage round-trips a session; the port setting is respected. Existing dashboard tests still pass. Out of scope: authentication, remote access (SSH forwarding covers it).

## F1 · Home and Clinic views

**Goal.** The React/Bun app gains the two views of the [Companion prototype](https://davidmoshal.github.io/SecondHands/companion.html), driven only by the WebSocket messages.

**Files.** `ui/src/tracker/` with `useTrackerSession.ts` (transport for the three messages and the control messages), `HomeView.tsx`, `ClinicView.tsx`, `Overlay.tsx` (canvas skeleton, angles, box, hip trace, each toggleable), `ProtocolEditor.tsx` (threshold overrides sent as `select_protocol`), `Progress.tsx` (sessions from `/api/sessions`, bar chart against the baseline), a mode switch in the top bar, a runtime badge, and a preferences panel (bigger text, read-aloud through the Web Speech API, more contrast) that persists per browser.

**Rules.** The Home view shows no numbers other than the count; every instruction comes from the latest `rep_event` and phase through one mapping table that the clinicians can read in the source. The frontend never recomputes reps or scores. Keep the existing dashboard reachable.

**Acceptance.** `bun run --cwd ui test` covers message parsing and the instruction mapping; `bun run --cwd ui build` passes; a manual session against the service with the fake backend works in both views at phone width and at 1280 pixels. Out of scope: the 3D room, Quest viewing.

## G1 · Recording and labelling tools

**Goal.** Keypoint recordings for development, calibration frames for quantization, and labelled clips for the classifier, with no frames committed.

**Files.** `secondhands/tools/record.py` behind `just record-keypoints --camera-index 0 --out data/recordings/<name>.jsonl [--frames]`: writes one JSON line per frame (`t`, `Keypoints`) and optional JPEG frames to `data/`; `just label-reps file.jsonl --protocol cs-30` runs D1 and writes rep boundaries next to the file for review. Collect from two consenting team members: chair stands, single-leg stance, and about 100 calibration frames at the demo distance.

**Acceptance.** Files exist under ignored `data/` on the laptop and on one development machine; a README in `data/` (ignored) names what was recorded by role label. Out of scope: any upload.

## G2 · Window classifier

**Goal.** A small PyTorch model over 1 to 2 second keypoint windows that classifies exercise and phase, trained on G1 recordings and exported to ExecuTorch.

**Files.** `secondhands/training/windows.py` (dataset from recordings and D1 labels), `training/model.py` (1-D convolution or GRU, under one million parameters), `training/train.py` (`just train-classifier`), `training/export.py` (XNNPACK export plus a `--qnn` option that calls the recipe in `experiments/qnn_export_pose.py`), and an `analysis/classifier.py` adapter that emits `rep_event` with `source: "classifier"` so the Clinic view can show agreement.

**Acceptance.** Held-out accuracy and agreement with the rule counter recorded on the experiments page; the exported `.pte` matches PyTorch within 1e-3 on ten windows; the service can run with the classifier enabled or disabled. Out of scope: replacing the rule counter in the demo.

## G3 · Benchmarks and evidence

**Goal.** The numbers the judges and the Compute guide ask for.

**Files.** `experiments/benchmark_pose.py` with its own lock: per backend and tier, median and p95 inference, frames per second on a 60-second camera run or a recorded clip, keypoint error versus PyTorch, process memory, and a ten-minute sustained run with temperature or clock notes where available; a markdown table appended to [the experiments page](../experiments-before-saturday.md) with commands and versions. For the NPU, attach the profiler or ETDump evidence from C2.

**Acceptance.** The table exists with laptop numbers for Tier 0, and with NPU numbers if C2 delivered. Out of scope: optimizing the model.

## H · Demonstration script and presentation

**Goal.** A ten-minute story that matches [the judging weights](../hackathon/judging-criteria.md#scoring) and claims only what has run.

**Deliver.** A script in `Wiki/hackathon/demo-script.md`: the participant, the two protocols, the Home view for the participant and the Clinic view on the second screen, the runtime badge and benchmark table as the on-device evidence, the Qualcomm NPU result if it landed or the honest CPU statement if not, and the reach slide (phones, no cloud, low cost). Rehearse once on the laptop over the chosen camera with the frozen `main`.

**Done when** the script is committed and a rehearsal is recorded on the experiments page with what went wrong. Not in scope: new features.

## I · Documentation sync

**Goal.** The repository reads as the tracker project without the chat history, and the public pages stay in step with the code.

**Deliver.** README and proposal rewritten for the tracker with the assistive story kept as an extension (SH-T-048); the document map linked to the PRD, TDD, and frontend documents when they exist (SH-T-055); `docs/` regenerated whenever a prototype changes; a log entry per merged documentation change.

**Done when** a newcomer can start from the README, the index, and the plan. Not in scope: rewriting history.
