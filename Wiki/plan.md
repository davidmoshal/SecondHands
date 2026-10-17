# SecondHands plan

**Updated 2026-10-17, evening.** This is the single task tracker. The project is the on-device movement assessment tracker confirmed by the user on 2026-10-17; the assistive-control work that came first is kept at the end as the previous idea and as a reusable extension. Checked tasks have evidence; unchecked tasks are open work or marked proposals. Every engineering task below has a self-contained specification in [the implementation briefs](design/implementation-briefs.md) so a teammate or a coding agent can pick it up from a fresh checkout.

**Current position.** Verified: YOLO11n-pose exports to ExecuTorch 1.5.1 and matches PyTorch on the CPU; the React/Bun dashboard, the MediaPipe recognition, and the trigger engine run on the Mac; a local depth bridge captured Femto Bolt depth on the laptop; the laptop is on Tailscale. Not yet verified: any SecondHands code on the laptop, a camera choice, a protocol from the clinicians, the analysis engine, the tracker service and views, the NPU. Public prototypes and reference pages: [secondhands-ai.github.io/SecondHands](https://secondhands-ai.github.io/SecondHands/).

## How to pick up work

1. Choose an unchecked task in a workstream below. Say so in the team chat with the task identifier, so two people do not start the same one.
2. Read the task's brief in [implementation briefs](design/implementation-briefs.md) and the pages it names. The brief is the specification; this plan is only the order and status.
3. Branch `<initials>/<topic>`, keep to the brief's files and acceptance checks, run the tests the brief names, open a pull request against `main` that links the task identifier, and update the owning Wiki page plus [the log](log.md) in the same pull request.
4. For a coding agent: give it the brief's heading, the repository, and the instruction to stop at the brief's acceptance checks. Briefs marked agent-friendly need no camera and no laptop. Review the agent's pull request like any other.
5. The laptop is shared: follow [the team workflow](runbooks/team-workflow.md#sharing-the-one-snapdragon-laptop). Only Workstreams B, C2, G1, and G3 need it.

Workstream issues #19 to #26 were created on 2026-10-17 evening in the `SecondHands-AI/SecondHands` repository; the previous-idea issues #1 to #9 remain below. Next free identifiers: task SH-T-070, question SH-Q-014, source SH-S-031. Check again before using them.

## Dependencies and order

```
A protocols (clinicians) ──────────────────────────┐
                                                   ▼
C1 perception ──► D1 analysis ──► E1 service ──► F1 Home + Clinic views ──► H demo
      │                ▲              ▲
      │                └── D2 protocol loader
      ├──► G1 recordings ──► G2 classifier ──► C2 NPU (with Qualcomm)
      └──► B6 laptop Tier 0 ──► B7 camera ──► G3 benchmarks ──► H demo
```

C1, D1, D2, and E1 can be built and tested on any computer with a fake backend and synthetic traces; they do not wait for the laptop or the clinicians. F1 can start against the prototype's message shapes today. A changes numbers, not structure, so it can land any time before the rehearsal.

## Timeline

| When | Must be true | Workstreams |
| --- | --- | --- |
| Tonight (17 Oct) | Protocol drafts started; C1 perception module and D1 analysis in review; Tier 0 environment building on the laptop; recordings scheduled | A, B6, C1, D1 |
| Sunday morning | Service streams the three messages against a fake backend; Home and Clinic views render them; camera chosen; first laptop fps numbers; handoff pack delivered to Qualcomm | B7, D2, E1, F1, C2 |
| Sunday midday | Live session on the laptop end to end; recordings taken; classifier trained or declared out; benchmarks table filled | G1, G2, G3 |
| Sunday afternoon | `main` frozen, rehearsal done, demo script final, evidence pages updated | H, I |
| After the event | Phone build, skin-screening path, sobriety protocol, validation studies | later items below |

## Workstream A · Clinical protocols

**Owner: the clinicians; Kate coordinates.** Brief [A](design/implementation-briefs.md#a--protocol-definitions-clinicians). GitHub: [issue #19](https://github.com/SecondHands-AI/SecondHands/issues/19).

- [ ] **SH-T-057 — Define CS-30 and SLS-01.** Fill the [protocol template](use-cases.md#protocol-template) for the 30-second chair stand and the single-leg stance, including adapted variants and the demo acceptance criteria. Record on the use-cases page, then as JSON under `src/secondhands/protocols/` once SH-T-061 exists.
- [ ] **SH-T-046 — Define the clinical application.** Kate owns [issue #7](https://github.com/davidmoshal/SecondHands/issues/7); now scoped to the tracker's clinical family and the demo story.
- [ ] **SH-T-043 — Confirm the presentation lead.** Resolve [SH-Q-004](project.md#sh-q-004--presentation-lead); Kate remains proposed.

## Workstream B · Laptop and environments

**Owner: Vishwa (steward); camera tests with Cam and Jacqueline ([issue #2](https://github.com/davidmoshal/SecondHands/issues/2)).** Briefs [B6](design/implementation-briefs.md#b6--tier-0-environment-on-the-laptop) and [B7](design/implementation-briefs.md#b7--camera-selection). GitHub: [issue #20](https://github.com/SecondHands-AI/SecondHands/issues/20).

- [ ] **SH-T-036 — Verify Mac-to-laptop access over Tailscale.** A Mac SSH login, reconnection after restart, dashboard port forwarding, per [the runbook](runbooks/mac-and-snapdragon-development.md#access-the-snapdragon-laptop-over-tailscale). [Issue #9](https://github.com/davidmoshal/SecondHands/issues/9).
- [ ] **SH-T-051 — Stand up Tier 0 on the laptop.** x64 Python 3.12 from the lockfiles, `just smoke-yolo-pose-executorch`, then a 60-second live run; record fps, latency, memory; commit `scripts/laptop-setup.ps1`.
- [ ] **SH-T-049 — Select the demonstration camera.** One measured test per camera; resolve [SH-Q-006](design/tech-stack.md#sh-q-006--which-camera-serves-the-demonstration). Supersedes SH-T-041 for the tracker.
- [ ] **SH-T-059 — Make the API port configurable.** `SECONDHANDS_API_PORT` and the Vite proxy; the depth-bridge viewer also uses 8765. Record the port table in [the team workflow](runbooks/team-workflow.md#sharing-the-one-snapdragon-laptop).
- [ ] **SH-T-001 — Record the laptop configuration and event details.** RAM, Windows build, installed QAIRT and ExecuTorch versions, bundle location, remaining organizer questions on [the laptop page](hardware/snapdragon-x-elite.md).
- [ ] **SH-T-009 — Run the supplied DeepLabV3 bundle.** Keep the profiler evidence; it is the reference for the NPU runner in C2.

## Workstream C · Perception and the NPU

**Owner: Vishwa, with the Qualcomm engineer.** Briefs [C1](design/implementation-briefs.md#c1--perception-module-and-executorch-xnnpack-backend) (agent-friendly) and [C2](design/implementation-briefs.md#c2--qnn-backend-client-and-the-qualcomm-handoff). GitHub: [issue #21](https://github.com/SecondHands-AI/SecondHands/issues/21).

- [x] **SH-T-050 — Export a pose model to ExecuTorch and validate it.** `just smoke-yolo-pose-executorch`: 11.7 MB XNNPACK `.pte`, matches PyTorch within 3.3e-3 ([observation](experiments-before-saturday.md#yolo-pose-executorch-export-observation)).
- [ ] **SH-T-060 — Build the perception module.** `perception/base.py` interface and `Keypoints` type, the ExecuTorch XNNPACK backend with YOLO pose decoding, the MediaPipe fallback stub, `just recognize-pose`, tests against a saved reference.
- [ ] **SH-T-056 — Hand RTMPose and the classifier to the Qualcomm engineer.** Deliver the [handoff pack](references/models/pose-candidates.md#handoff-pack-for-the-qualcomm-engineer); record the returned `.pte`, runner build, delegation profile, CPU-fallback operators, and keypoint error; then `perception/executorch_qnn.py`.
- [ ] **SH-T-035 — A useful component through ExecuTorch on the device.** Satisfied for the CPU once SH-T-051 runs the perception module live; the NPU half is SH-T-056.

## Workstream D · Analysis engine

**Owner: engineers; thresholds from Workstream A.** Briefs [D1](design/implementation-briefs.md#d1--analysis-angles-rep-counter-scorers) and [D2](design/implementation-briefs.md#d2--protocol-schema-and-loader), both agent-friendly. GitHub: [issue #22](https://github.com/SecondHands-AI/SecondHands/issues/22).

- [ ] **SH-T-052 — Angles, rep counters, and scorers.** `analysis/angles.py`, `reps.py` (sit-to-stand and squat hysteresis state machines emitting contract `rep_event`s), `scorers.py` (CS-30, SLS-01), `session.py`; synthetic-trace tests; `just replay-keypoints`.
- [ ] **SH-T-061 — Protocol schema, loader, and the two JSON files.** Validation with clear errors, overrides for Clinic-view threshold edits, `just validate-protocols`; files marked draft until Workstream A supplies values.

## Workstream E · Service and storage

**Owner: first of Vishwa or David to claim it.** Brief [E1](design/implementation-briefs.md#e1--tracker-session-in-the-service-sessions-api-storage), agent-friendly given C1 and D1. GitHub: [issue #23](https://github.com/SecondHands-AI/SecondHands/issues/23).

- [ ] **SH-T-063 — Tracker session in the API.** Control messages, the three streamed messages, one camera owner, invalidation on protocol change, fake-backend tests.
- [ ] **SH-T-062 — SQLite storage and sessions endpoints.** Participants by role label, baselines, sessions, rep events; `GET /api/sessions`, detail, export.

## Workstream F · Frontend

**Owner: David.** Brief [F1](design/implementation-briefs.md#f1--home-and-clinic-views). GitHub: [issue #24](https://github.com/SecondHands-AI/SecondHands/issues/24).

- [ ] **SH-T-054 — Home and Clinic views.** Per the [Companion prototype](https://secondhands-ai.github.io/SecondHands/companion.html): Home with one instruction at a time and no numbers, Clinic with overlays, measurements, flags, threshold editor, baseline comparison, notes; mode switch; runtime badge; preferences; transport and mapping tests.
- [ ] **SH-T-013 — Demonstration interface polish.** Measured capture-to-display latency shown in the Clinic view; replaces the earlier assistive scope of this task.

## Workstream G · Data, validation, and benchmarks

**Owner: engineers; two consenting team members for recordings.** Briefs [G1](design/implementation-briefs.md#g1--recording-and-labelling-tools), [G2](design/implementation-briefs.md#g2--window-classifier), [G3](design/implementation-briefs.md#g3--benchmarks-and-evidence). GitHub: [issue #25](https://github.com/SecondHands-AI/SecondHands/issues/25).

- [ ] **SH-T-064 — Recording and labelling tools, and the recordings.** `just record-keypoints`, `just label-reps`; chair stands and single-leg stance from two people; about 100 calibration frames; all under ignored `data/`.
- [ ] **SH-T-053 — Train and export the window classifier.** Held-out accuracy and agreement with the rule counter; XNNPACK export; Qualcomm export attempt; adapter emitting `source: "classifier"`.
- [ ] **SH-T-065 — Benchmarks and evidence.** `experiments/benchmark_pose.py`; latency, fps, keypoint error, memory, sustained run per backend and tier; NPU evidence from C2; table on [the experiments page](experiments-before-saturday.md).
- [ ] **SH-T-011 — Validate against the reference instruments.** Stopwatch and clinician count agreement for one session per protocol, against the acceptance criteria from Workstream A. Replaces the earlier two-participant calibration scope.

## Workstream H · Demonstration and presentation

**Owner: Kate (proposed) with everyone's evidence.** GitHub: [issue #5](https://github.com/SecondHands-AI/SecondHands/issues/5). Brief [H](design/implementation-briefs.md#h--demonstration-script-and-presentation).

- [ ] **SH-T-002 — Agree the demonstration and acceptance criteria.** Participant, the two protocols, screens, success and failure behaviour, from Workstream A's criteria.
- [ ] **SH-T-015 — Demo script, presentation, and evidence.** `Wiki/hackathon/demo-script.md` against [the judging weights](hackathon/judging-criteria.md#scoring); only claims that have run. [Issue #5](https://github.com/davidmoshal/SecondHands/issues/5).
- [ ] **SH-T-014 — Rehearse on the frozen `main`.** On the laptop, over the chosen camera, both views; record what went wrong.

## Workstream I · Documentation and Pages

**Owner: Vishwa; anyone may contribute.** Brief [I](design/implementation-briefs.md#i--documentation-sync). GitHub: [issue #26](https://github.com/SecondHands-AI/SecondHands/issues/26).

- [ ] **SH-T-048 — Update the Wiki, README, proposal, and issues to the tracker direction.** Keep the assistive story as an extension; update [issues #1 to #7](https://github.com/davidmoshal/SecondHands/issues) descriptions.
- [ ] **SH-T-069 — Close the MotionVitals decisions.** Collect the votes from [issue #33](https://github.com/SecondHands-AI/SecondHands/issues/33), record each answer under [SH-Q-007 to SH-Q-013](motionvitals-decision.md#questions), then update the plan, briefs D1, D2, E1, Workstream G acceptance, and Workstream H with the adopted items and the outcomes.
- [ ] **SH-T-055 — Link the teammates' documents.** PRD, TDD, frontend document, from [the document map](design/tech-stack.md#document-map-for-the-team) and the index.
- [ ] **SH-T-042 — Confirm GitHub owner accounts.** Resolve [SH-Q-003](project.md#sh-q-003--github-accounts-for-the-named-owners) so the remaining owners can be assigned.
- [ ] **SH-T-034 — Expand the design documentation.** Now covered by the tech stack, briefs, and team workflow pages; close by linking them from [the design index](design/index.md) and removing the stale proposal list.

## Later

- [ ] **SH-T-058 — Assess the skin-screening model path.** After the movement demonstration is stable; privacy design first.
- [ ] **SH-T-066 — Phone build feasibility.** Re-export the pose model for a Snapdragon phone chipset with the Qualcomm backend, an Android shell around the ExecuTorch runtime, the same protocol files; record what changes.
- [ ] **SH-T-067 — Field sobriety protocol draft.** Walk-and-turn and one-leg-stand clues from [the requirement page](requirements/field-sobriety.md), with the legal and validation conditions stated before any implementation.
- [ ] **SH-T-038 — Phone camera over Wi-Fi.** Input compatibility, latency, disconnects.

## Previous idea: assistive control

The tasks below belong to the gesture-control proposal that preceded the tracker. Their code and evidence are reused (capture, trigger engine, dashboard, model experiments). Unchecked items are retained for the extension; none is required for the hackathon demonstration unless listed in a workstream above.

### Team coordination

The GitHub issues below were created for the previous idea on 2026-10-17 and remain the team's named coordination points until SH-T-048 updates them. The workstreams above are the current checklist. Issue descriptions contain the requested owners; only confirmed GitHub accounts receive formal assignments.

| Workstream | GitHub issue |
| --- | --- |
| Hackathon stack review | [Review the stack and Snapdragon deployment path](https://github.com/davidmoshal/SecondHands/issues/1) |
| Femto Bolt hardware | [Windows laptop first, then Dell Snapdragon](https://github.com/davidmoshal/SecondHands/issues/2) |
| Model evaluation | [Evaluate five local candidates](https://github.com/davidmoshal/SecondHands/issues/3) |
| UI | [Review and extend the dashboard](https://github.com/davidmoshal/SecondHands/issues/4) |
| Presentation | [Confirm the lead and prepare the presentation](https://github.com/davidmoshal/SecondHands/issues/5) |
| 3D room simulation | [Build the browser room with optional Quest 2 WebXR viewing](https://github.com/davidmoshal/SecondHands/issues/6) |
| Clinical application | [Define the clinical application — Kate](https://github.com/davidmoshal/SecondHands/issues/7) |
| Laptop remote access | [Set up Tailscale — Vishwa](https://github.com/davidmoshal/SecondHands/issues/9) |

- [ ] **SH-T-041 — Resolve the Dell camera path.** [SH-Q-002](hardware/femto-bolt.md#sh-q-002--which-capture-path-works-on-the-dell) is partially resolved by the local bridge. Record sustained capture, timeout diagnosis, reconnect/reboot recovery, measured distance accuracy, and application integration evidence before closing the remaining scope.

### Project setup

**Phase 1: Mac foundation.**

- [x] **SH-T-018 — Configure Python and Vue packages.** Python 3.12, uv locking, optional PyTorch dependencies, and the original Vue 3/TypeScript/Vite scaffold were configured. SH-T-047 supersedes the frontend selection. [Setup checks](project.md#setup-verification) passed on the Mac.
- [x] **SH-T-021 — Add just commands.** Setup, model download, image/camera inference, dashboard services, tests, and the ExecuTorch smoke check are exposed through the [justfile](../justfile).
- [x] **SH-T-020 — Document shared Mac/PC development.** [The runbook](runbooks/mac-and-snapdragon-development.md) covers separate environments, Git synchronization, T3 execution context, and known Windows dependency limits. Remote connection and PC execution remain untested.

### Models

**Phase 2: establish about five runnable candidates on the Mac before porting.** The first completed baseline below contains two recognition bundles; the other three are separate integrations. A compatibility blocker must be recorded and does not count as a working model.

#### Reference review

- [x] **SH-T-019 — Record model references.** [The model index](references/models/index.md) contains the top five, individual detail pages, and other retained candidates from the captured chats.

#### Mac integrations

- [x] **SH-T-023 — Integrate MediaPipe Face Landmarker and Gesture Recognizer.** Both run on public sample images, with checked downloads, structured results, image/camera CLIs, and dashboard integration. [Observed results](experiments-before-saturday.md#mediapipe-baseline-observations); physical-camera use and participant accuracy remain untested.
- [x] **SH-T-026 — Integrate Laya Vision 201M.** The isolated CLI loads pinned weights, answers configurable image questions on Mac MPS and CPU, and records runtime, latency, memory, and failures. [Observed results](experiments-before-saturday.md#decision-model-image-observations) include an incorrect face classification. Dashboard integration and participant accuracy remain open.
- [x] **SH-T-027 — Integrate Mapika Decider 2B Vision.** The isolated CLI runs pinned weights on Mac MPS, with its MPS patch active. [The same image questions](experiments-before-saturday.md#decision-model-image-observations) establish output and cost differences from Laya; the participant benchmark, dashboard integration, and Windows path remain unverified.
- [x] **SH-T-028 — Integrate SmolVLM-500M-Instruct locally.** The isolated CLI executes pinned weights on Mac MPS and records image-conditioned text, runtime, latency, and memory. [Observed results](experiments-before-saturday.md#decision-model-image-observations) include an incorrect face classification. Generated text is not a typed decision score; dashboard integration and an ExecuTorch port remain separate work.

### Recognition features

**Phase 3: turn observations into configurable command experiments.** Implemented features below are deterministic logic over MediaPipe measurements, not validated intention recognition.

- [x] **SH-T-029 — Implement configurable trigger rules.** Face, hand, either, combined, and hand-then-face sequence modes include hold, hysteresis, confirmation timeout, cancellation, release, and cooldown. [Trigger behavior and limits](design/recognition-and-triggers.md#trigger-policy).
- [x] **SH-T-030 — Implement session calibration.** Collect neutral/deliberate measurements, show signal separation, and suggest an experimental threshold pair. Collection disables simulation; data stays in memory.
- [x] **SH-T-031 — Bound work and reject old results.** One camera owner, one frame job, session/frame/mapping identity, invalidation after control changes, and cleanup on Stop/disconnect are implemented and [tested](experiments-before-saturday.md#dashboard-implementation-observations).
- [ ] **SH-T-040 — Connect a decision model to candidate events.** Supply selected images, context, and configurable choices after a possible command is detected. Bound outstanding requests and reject expired decisions; do not require a large model on every frame.
- [ ] **SH-T-032 — Investigate independent face/hand thresholds.** Proposed improvement: current mappings share one activation/release pair, so applying one modality's calibration replaces that pair for both cues.
- [ ] **SH-T-033 — Add temporal movement experiments.** After selecting a movement such as nodding, test observations over time. MediaPipe video tracking alone does not implement movement-sequence recognition.

### UI

**Phase 4: let the team inspect capabilities and try command mappings.**

- [x] **SH-T-047 — Migrate the dashboard to React and Bun.** Completed the user-requested [issue #11](https://github.com/davidmoshal/SecondHands/issues/11) implementation with the same Python API, controls, and layout. Bun replaces pnpm; [verification](experiments-before-saturday.md#react-and-bun-migration-observations) covers locked installation, interaction tests, types, build, and stopped browser checks. Windows execution remains part of SH-T-010.
- [x] **SH-T-025 — Implement the live exploration dashboard.** The dashboard connects to the Python service and displays matched preview/landmarks, facial blendshapes, hand categories, timings, mapping controls, calibration, bounded history, and a simulated lamp. Comparison freezes existing MediaPipe results; three unintegrated candidates are labeled honestly. [Verification](experiments-before-saturday.md#dashboard-implementation-observations).
- [ ] **SH-T-003 — Verify the physical Mac camera and live dashboard.** Start capture, inspect real face/hand output, exercise mappings, and check Stop/restart. Public-image and mocked-camera checks do not complete this task.
- [ ] **SH-T-044 — Build and connect the 3D room simulation.** Under [issue #6](https://github.com/davidmoshal/SecondHands/issues/6), David and Vishwa will make an accepted gesture or facial command change a light in a browser-based room. Follow [the approved direction](project.md#established-user-direction); confirm the command/state connection and demonstrate the response. No implementation is complete yet.
- [ ] **SH-T-045 — Try optional Quest 2 viewing through WebXR.** Use the same room as a web experience, without an Android SDK. Record headset/browser compatibility, connection setup, and whether the selected movement remains observable when the participant wears the headset. Keep ordinary browser viewing available. Coordinate through [issue #6](https://github.com/davidmoshal/SecondHands/issues/6).

### Design and ExecuTorch

**Phase 5: document boundaries and establish useful framework execution.**

- [x] **SH-T-024 — Document the initial design and run ExecuTorch on the Mac.** [Design docs](design/index.md) exist. ExecuTorch 1.5.1 exported and executed an untrained XNNPACK CPU network with outputs matching PyTorch on 12 synthetic inputs. [Smoke result](experiments-before-saturday.md#executorch-cpu-smoke-observation); this is not a recognition model.

### Comparison and selection

**Phase 6: measure the candidates on relevant observations.** [The experiment topic](experiments-before-saturday.md) owns methods and results. Its older Laya/Mapika/MobileCLIP2 benchmark remains a proposal; the five-candidate integration goal above is the newer direction.

- [ ] **SH-T-004 — Collect and label comparison observations.** Include deliberate, neutral, and ambiguous movements from two volunteers; retain personal recordings outside Git.
- [ ] **SH-T-005 — Build a repeatable comparison runner.** The shared image CLI now preserves distinct output types, versions, and timings for three candidates on the same inputs. Dataset-level aggregation and the labeled participant comparison remain to be implemented.
- [ ] **SH-T-006 — Run the Mac comparison.** Record accuracy, false activations, abstention, median/p95 latency, memory, calibration effort, and configurability. Smoke tests are not these measurements.
- [ ] **SH-T-007 — Select the initial integration candidate.** Record the choice and evidence under [SH-Q-001](project.md#sh-q-001--model-and-runtime-selection), including licensing and remaining PC checks.

### Snapdragon deployment

**Phase 7: verify the actual hackathon PC.** [The Compute summary](hackathon-compute.md) owns the supplied stack and unresolved event details. Mac success does not establish Windows ARM64 or NPU compatibility.

- [ ] **SH-T-010 — Run SecondHands on the PC.** Verify dependencies, camera, selected models, dashboard, output quality, latency, and memory. Record blockers and revise the provisional model choice if necessary.

### Physical demonstration

**Phase 8: connect the validated interaction to an actual object.** This remains separate from the implemented virtual lamp.

- [ ] **SH-T-008 — Test physical control manually.** Verify the selected microcontroller/actuator independently of recognition.
- [ ] **SH-T-012 — Connect recognition to the physical action.** Exercise deliberate, neutral, ambiguous, and failed-input cases against the agreed behavior.

### Optional experiments

These remain outside the initial completion requirement; record results in [experiments](experiments-before-saturday.md).

- [ ] **SH-T-017 — Investigate SmolVLM's Qualcomm ExecuTorch path.** Verify the recipe/version/Windows route before porting. The cited Android recipe is not a ready-made Compute PC package.
- [ ] **SH-T-016 — Evaluate Clef-Flash as a higher-level decision layer.** Subject to memory and runtime feasibility; it remains deferred, not excluded.
- [x] **SH-T-068 — Record the local Snapdragon depth bridge setup.** (Renumbered from a second SH-T-047 on 2026-10-17.) The [setup summary](setup/ms-09-femto-bolt-bridge.md) records the failed SDK route, successful depth/person verification, launch instructions, and later timeout from saved evidence. Applications and private captures remain outside this repository; no fresh camera test or SecondHands integration is claimed.
- [ ] **SH-T-037 — Connect Orbbec Femto Bolt.** The [hardware procedure](hardware/femto-bolt.md) now links successful standalone Snapdragon bridge tests. The originally requested x86 reference test, sustained reliability, measured accuracy, and SecondHands integration remain open. Record driver, Viewer, Python, and application results separately. This replaces the Astra 2 hardware task.
- [ ] **SH-T-039 — Explore audio recognition.** Select a useful audio interaction and candidate model if time permits; none is implemented yet.
