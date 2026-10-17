# SecondHands plan

Updated 2026-10-17 at the user's request. This is the single task tracker, organized by topic and phase. Checked tasks have implementation or verification evidence; their stated limits still apply. Unchecked tasks are remaining work or explicitly marked proposals, not blanket approval to implement every option.

Current position: all five starting candidates execute on the Mac. The two MediaPipe bundles feed the local exploration dashboard; Laya Vision, Mapika, and SmolVLM run as separate image experiments. Public-image inference and automated checks pass, but the image experiments expose false face classifications from Laya and SmolVLM. Physical-camera use, comparative accuracy, and Snapdragon execution remain unverified. Detailed behavior stays in [the design](design/index.md), commands in [the runbook](runbooks/mac-and-snapdragon-development.md), and results in [experiments](experiments-before-saturday.md).

## Team coordination

The user requested these GitHub work items on 2026-10-17. Use the issues for named team coordination and this plan for the detailed project checklist. Issue descriptions contain the requested owners; only confirmed GitHub accounts receive formal assignments.

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

- [ ] **SH-T-041 — Resolve the Dell camera path.** Record the tested outcome for [SH-Q-002](hardware/femto-bolt.md#sh-q-002--which-capture-path-works-on-the-dell), including a precise blocker or fallback if required.
- [ ] **SH-T-042 — Confirm GitHub owner accounts.** Resolve [SH-Q-003](project.md#sh-q-003--github-accounts-for-the-named-owners) before assigning unverified accounts or changing repository access.
- [ ] **SH-T-043 — Confirm the presentation lead.** Resolve [SH-Q-004](project.md#sh-q-004--presentation-lead); Kate remains proposed.
- [ ] **SH-T-046 — Define the clinical application.** Kate owns [issue #7](https://github.com/davidmoshal/SecondHands/issues/7). Record the intended application and agreed requirements, then connect them to model evaluation, UI, and demonstration work. [Project direction](project.md#established-user-direction) records the confirmed role; presentation ownership remains separate.

## Project setup

**Phase 1: Mac foundation.**

- [x] **SH-T-018 — Configure Python and Vue packages.** Python 3.12, uv locking, optional PyTorch dependencies, and Vue 3/TypeScript/Vite are configured. [Setup checks](project.md#setup-verification) passed on the Mac.
- [x] **SH-T-021 — Add just commands.** Setup, model download, image/camera inference, dashboard services, tests, and the ExecuTorch smoke check are exposed through the [justfile](../justfile).
- [x] **SH-T-020 — Document shared Mac/PC development.** [The runbook](runbooks/mac-and-snapdragon-development.md) covers separate environments, Git synchronization, T3 execution context, and known Windows dependency limits. Remote connection and PC execution remain untested.

## Models

**Phase 2: establish about five runnable candidates on the Mac before porting.** The first completed baseline below contains two recognition bundles; the other three are separate integrations. A compatibility blocker must be recorded and does not count as a working model.

### Reference review

- [x] **SH-T-019 — Record model references.** [The model index](references/models/index.md) contains the top five, individual detail pages, and other retained candidates from the captured chats.

### Mac integrations

- [x] **SH-T-023 — Integrate MediaPipe Face Landmarker and Gesture Recognizer.** Both run on public sample images, with checked downloads, structured results, image/camera CLIs, and dashboard integration. [Observed results](experiments-before-saturday.md#mediapipe-baseline-observations); physical-camera use and participant accuracy remain untested.
- [x] **SH-T-026 — Integrate Laya Vision 201M.** The isolated CLI loads pinned weights, answers configurable image questions on Mac MPS and CPU, and records runtime, latency, memory, and failures. [Observed results](experiments-before-saturday.md#decision-model-image-observations) include an incorrect face classification. Dashboard integration and participant accuracy remain open.
- [x] **SH-T-027 — Integrate Mapika Decider 2B Vision.** The isolated CLI runs pinned weights on Mac MPS, with its MPS patch active. [The same image questions](experiments-before-saturday.md#decision-model-image-observations) establish output and cost differences from Laya; the participant benchmark, dashboard integration, and Windows path remain unverified.
- [x] **SH-T-028 — Integrate SmolVLM-500M-Instruct locally.** The isolated CLI executes pinned weights on Mac MPS and records image-conditioned text, runtime, latency, and memory. [Observed results](experiments-before-saturday.md#decision-model-image-observations) include an incorrect face classification. Generated text is not a typed decision score; dashboard integration and an ExecuTorch port remain separate work.

## Recognition features

**Phase 3: turn observations into configurable command experiments.** Implemented features below are deterministic logic over MediaPipe measurements, not validated intention recognition.

- [x] **SH-T-029 — Implement configurable trigger rules.** Face, hand, either, combined, and hand-then-face sequence modes include hold, hysteresis, confirmation timeout, cancellation, release, and cooldown. [Trigger behavior and limits](design/recognition-and-triggers.md#trigger-policy).
- [x] **SH-T-030 — Implement session calibration.** Collect neutral/deliberate measurements, show signal separation, and suggest an experimental threshold pair. Collection disables simulation; data stays in memory.
- [x] **SH-T-031 — Bound work and reject old results.** One camera owner, one frame job, session/frame/mapping identity, invalidation after control changes, and cleanup on Stop/disconnect are implemented and [tested](experiments-before-saturday.md#dashboard-implementation-observations).
- [ ] **SH-T-040 — Connect a decision model to candidate events.** Supply selected images, context, and configurable choices after a possible command is detected. Bound outstanding requests and reject expired decisions; do not require a large model on every frame.
- [ ] **SH-T-032 — Investigate independent face/hand thresholds.** Proposed improvement: current mappings share one activation/release pair, so applying one modality's calibration replaces that pair for both cues.
- [ ] **SH-T-033 — Add temporal movement experiments.** After selecting a movement such as nodding, test observations over time. MediaPipe video tracking alone does not implement movement-sequence recognition.
- [ ] **SH-T-011 — Validate personalized calibration with two participants.** The generic calibration flow exists; still demonstrate distinct usable movements mapped to the same action, against agreed criteria.

## UI

**Phase 4: let the team inspect capabilities and try command mappings.**

- [x] **SH-T-025 — Implement the live exploration dashboard.** Vue connects to the Python service and displays matched preview/landmarks, facial blendshapes, hand categories, timings, mapping controls, calibration, bounded history, and a simulated lamp. Comparison freezes existing MediaPipe results; three unintegrated candidates are labeled honestly. [Verification](experiments-before-saturday.md#dashboard-implementation-observations).
- [ ] **SH-T-003 — Verify the physical Mac camera and live dashboard.** Start capture, inspect real face/hand output, exercise mappings, and check Stop/restart. Public-image and mocked-camera checks do not complete this task.
- [ ] **SH-T-013 — Complete the demonstration interface.** Extend the working dashboard to show the actual selected action/device state and measured capture-to-action latency. Current task/frame timings exclude transport, display, and physical response.
- [ ] **SH-T-044 — Build and connect the 3D room simulation.** Under [issue #6](https://github.com/davidmoshal/SecondHands/issues/6), David and Vishwa will make an accepted gesture or facial command change a light in a browser-based room. Follow [the approved direction](project.md#established-user-direction); confirm the command/state connection and demonstrate the response. No implementation is complete yet.
- [ ] **SH-T-045 — Try optional Quest 2 viewing through WebXR.** Use the same room as a web experience, without an Android SDK. Record headset/browser compatibility, connection setup, and whether the selected movement remains observable when the participant wears the headset. Keep ordinary browser viewing available. Coordinate through [issue #6](https://github.com/davidmoshal/SecondHands/issues/6).

## Design and ExecuTorch

**Phase 5: document boundaries and establish useful framework execution.**

- [x] **SH-T-024 — Document the initial design and run ExecuTorch on the Mac.** [Design docs](design/index.md) exist. ExecuTorch 1.5.1 exported and executed an untrained XNNPACK CPU network with outputs matching PyTorch on 12 synthetic inputs. [Smoke result](experiments-before-saturday.md#executorch-cpu-smoke-observation); this is not a recognition model.
- [ ] **SH-T-034 — Expand the design documentation.** Proposed follow-ups: `architecture.md` for component/data boundaries, `model-integration.md` for adding candidates, and `dashboard.md` for exploration flows. Move existing owned explanations when splitting; do not duplicate them. These files are not yet created.
- [ ] **SH-T-035 — Run a useful SecondHands component through ExecuTorch.** Select a recognition or decision component, validate its outputs against its source runtime, and connect it to the application. CPU execution and Qualcomm NPU execution need separate evidence.

## Comparison and selection

**Phase 6: measure the candidates on relevant observations.** [The experiment topic](experiments-before-saturday.md) owns methods and results. Its older Laya/Mapika/MobileCLIP2 benchmark remains a proposal; the five-candidate integration goal above is the newer direction.

- [ ] **SH-T-004 — Collect and label comparison observations.** Include deliberate, neutral, and ambiguous movements from two volunteers; retain personal recordings outside Git.
- [ ] **SH-T-005 — Build a repeatable comparison runner.** The shared image CLI now preserves distinct output types, versions, and timings for three candidates on the same inputs. Dataset-level aggregation and the labeled participant comparison remain to be implemented.
- [ ] **SH-T-006 — Run the Mac comparison.** Record accuracy, false activations, abstention, median/p95 latency, memory, calibration effort, and configurability. Smoke tests are not these measurements.
- [ ] **SH-T-007 — Select the initial integration candidate.** Record the choice and evidence under [SH-Q-001](project.md#sh-q-001--model-and-runtime-selection), including licensing and remaining PC checks.

## Snapdragon deployment

**Phase 7: verify the actual hackathon PC.** [The Compute summary](hackathon-compute.md) owns the supplied stack and unresolved event details. Mac success does not establish Windows ARM64 or NPU compatibility.

- [ ] **SH-T-001 — Confirm device configuration and event details.** The guide review is complete and the [deployment laptop's reported X1E80100 processor](hardware/snapdragon-x-elite.md) is recorded. Actual RAM, Windows build, installed runtimes, bundle location, mixed-runtime acceptance, and other organizer details remain open.
- [ ] **SH-T-036 — Verify Mac-to-PC development access.** Vishwa (@theja2289) owns [Tailscale setup on the Dell Snapdragon laptop](https://github.com/davidmoshal/SecondHands/issues/9). Verify Mac connectivity, ordinary SSH to Windows, and reconnection after restart; confirm commands use the PC checkout and environment. Record the tested procedure in [the runbook](runbooks/mac-and-snapdragon-development.md). Setup and device execution remain unverified.
- [ ] **SH-T-009 — Run the supplied DeepLabV3 ExecuTorch demonstration.** Inspect real inputs and rendered outputs; retain profiling evidence before claiming Qualcomm NPU execution.
- [ ] **SH-T-010 — Run SecondHands on the PC.** Verify dependencies, camera, selected models, dashboard, output quality, latency, and memory. Record blockers and revise the provisional model choice if necessary.

## Physical demonstration

**Phase 8: connect the validated interaction to an actual object.** This remains separate from the implemented virtual lamp.

- [ ] **SH-T-002 — Agree demonstration behavior and acceptance criteria.** Choose the object, participants' movements, confirmation/failure behavior, response targets, and acceptable false activations.
- [ ] **SH-T-008 — Test physical control manually.** Verify the selected microcontroller/actuator independently of recognition.
- [ ] **SH-T-012 — Connect recognition to the physical action.** Exercise deliberate, neutral, ambiguous, and failed-input cases against the agreed behavior.
- [ ] **SH-T-014 — Rehearse the two-participant demonstration.** Verify personalized mappings, physical response, target-PC operation, and local processing.
- [ ] **SH-T-015 — Prepare presentation and evidence.** Address the [five judging criteria](hackathon/judging-criteria.md#scoring). Separate demonstrated behavior, measured results, the actual ExecuTorch contribution, and future proposals.

## Movement tracker

**Phase 9: camera-based fitness tracker on the Snapdragon laptop.** Requested on 2026-10-17; [the tech stack page](design/tech-stack.md) owns the proposed stack, tiers, and interface contract. Its relation to the assistive scope is undecided, so these tasks establish feasibility and the shared contract without changing the current proposal.

- [ ] **SH-T-047 — Decide the tracker's relation to SecondHands.** Resolve [SH-Q-005](design/tech-stack.md#sh-q-005--how-does-the-movement-tracker-relate-to-secondhands) with the team, then align the requirements document, proposal, and demo script.
- [ ] **SH-T-048 — Select and test the demonstration camera.** Resolve [SH-Q-006](design/tech-stack.md#sh-q-006--which-camera-serves-the-demonstration) with one capture test per available camera on the Dell; record frame rate and the x64-versus-ARM64 process used.
- [ ] **SH-T-049 — Export a pose model to ExecuTorch and validate it.** Export YOLO-pose to an XNNPACK `.pte` on a development machine, compare keypoints with the PyTorch model on sample images, and record size, latency, and the export tool versions. No export has been run yet.
- [ ] **SH-T-050 — Stand up Tier 0 on the laptop.** Install x64 Python 3.12 under emulation with the [checked package set](design/tech-stack.md#runtime-on-the-snapdragon-laptop), run the `.pte` on live frames, and record frames per second, latency, and memory.
- [ ] **SH-T-051 — Implement angle-based rep counting and the session service.** Joint angles, squat and push-up state machines, `pose`, `rep_event`, and `session_summary` messages per [the interface contract](design/tech-stack.md#service-and-interface-contract), and SQLite session storage. Test with recorded clips kept outside Git.
- [ ] **SH-T-052 — Train and export the window classifier.** Record a small labeled set, train the keypoint-window classifier, export it with XNNPACK, then attempt the Qualcomm backend export with 8-bit quantization and record delegation evidence. The deterministic counter remains the demo path if this is incomplete.
- [ ] **SH-T-053 — Build the session and progress screens.** Skeleton overlay, rep counter, form cues, and baseline comparison from the contract messages; coordinate with the frontend teammates' chosen framework.
- [ ] **SH-T-054 — Link the teammates' documents.** When the requirements, design, and frontend documents exist, link them from [the document map](design/tech-stack.md#document-map-for-the-team) and [the index](index.md).

## Optional experiments

These remain outside the initial completion requirement; record results in [experiments](experiments-before-saturday.md).

- [ ] **SH-T-017 — Investigate SmolVLM's Qualcomm ExecuTorch path.** Verify the recipe/version/Windows route before porting. The cited Android recipe is not a ready-made Compute PC package.
- [ ] **SH-T-016 — Evaluate Clef-Flash as a higher-level decision layer.** Subject to memory and runtime feasibility; it remains deferred, not excluded.
- [ ] **SH-T-037 — Connect Orbbec Femto Bolt.** Follow [the hardware procedure](hardware/femto-bolt.md): establish color and depth capture on the x86 Windows laptop first, then test the Dell Snapdragon. Record driver, Viewer, Python, and application results separately. This replaces the Astra 2 hardware task.
- [ ] **SH-T-038 — Try a phone camera over Wi-Fi.** Verify input compatibility, latency, and disconnect behavior.
- [ ] **SH-T-039 — Explore audio recognition.** Select a useful audio interaction and candidate model if time permits; none is implemented yet.
