# Wiki change log

## 2026-10-17 — Workstream issues linked

Created GitHub issues #19 to #26 for workstreams A to G and I in the transferred `SecondHands-AI/SecondHands` repository and linked them from [the plan](plan.md); recorded the new repository address in [the team workflow](runbooks/team-workflow.md#how-we-collaborate-in-git).

## 2026-10-17 — Repository transfer and Pages address

The repository now lives under the `SecondHands-AI` organization. Updated every GitHub Pages link from `davidmoshal.github.io` to `secondhands-ai.github.io` and noted in [the team workflow](runbooks/team-workflow.md#prototypes-and-reference-pages-on-github-pages) that Pages must be re-enabled in the transferred repository.

## 2026-10-17 — Live camera page added to GitHub Pages

Added `docs/live.html`: camera selection, MediaPipe Pose Landmarker (lite) in the browser, skeleton and angle overlay, and the knee-angle hysteresis counter for chair stands and squats in Home and Clinic views, with editable thresholds and a visible runtime badge stating that this is the browser model, not ExecuTorch. Verified in headless Chromium with a fake camera: model load, camera open, set start, no page errors. Linked from the site index, [use cases](use-cases.md), and [the tech stack](design/tech-stack.md#frontend).

## 2026-10-17 — Overall plan by workstream and implementation briefs

Restructured [the plan](plan.md) around nine workstreams (clinical protocols, laptop, perception and NPU, analysis, service and storage, frontend, data and benchmarks, demonstration, documentation) with owners, a dependency graph, and the event timeline; moved the assistive-control phases under a previous-idea section without deleting them; added SH-T-060 to SH-T-067. Added [implementation briefs](design/implementation-briefs.md) with a self-contained specification per engineering task. Linked both from the index and the design index; source SH-S-029.

## 2026-10-17 — Prototypes published through GitHub Pages

Added a `docs/` folder with standalone copies of the Companion, clinic console, architecture, brief, and team workflow pages plus an index, and a GitHub Actions workflow that deploys it to GitHub Pages from `main`. Recorded the site address and the owner-only Pages setting in [the team workflow](runbooks/team-workflow.md#prototypes-and-reference-pages-on-github-pages) and linked the site from [the index](index.md).

## 2026-10-17 — Two-mode Companion prototype linked

Published and linked a second prototype with a Home view for older adults (chair stand, large type, one instruction at a time, read-aloud, contrast, break button, weekly dots) and a Clinic view for clinicians (overlays, rise time, trunk lean, knee extension, symmetry, flags against editable thresholds, baseline comparison, notes), both driven by one simulated sit-to-stand engine with the hip-height and knee-angle rule. Linked from [use cases](use-cases.md) and [the tech stack frontend section](design/tech-stack.md#frontend). The person and camera are drawn, not real footage.
## 2026-10-17 — Tailscale local install status recorded

Added a [local installs table](references/tailscale.md#local-installs) to the Tailscale reference: the Dell laptop is reported installed, and the project owner's Mac was checked and has no Tailscale installation. The install steps stay in [the runbook](runbooks/mac-and-snapdragon-development.md#access-the-snapdragon-laptop-over-tailscale). No connection was tested.

## 2026-10-17 — Team workflow and laptop sharing documented

Added [the team workflow runbook](runbooks/team-workflow.md): project structure with proposed `perception`, `analysis`, `protocols`, and `storage` modules, the separation-of-concerns table with owners, Git collaboration rules, rules for sharing the Tailscale-connected Snapdragon laptop (steward, exclusive camera, proposed paths and ports, environment discipline), and the model acquisition table with ExecuTorch status. Noted the port 8765 conflict between the API and the depth bridge viewer and added SH-T-059. Linked from the index; source SH-S-028.

## 2026-10-17 — Interactive console prototype linked

Published an interactive prototype of the clinic console (live session with simulated skeleton and the real knee-angle hysteresis rep counter, single-leg stance test with live sway and events, progress chart, editable protocol thresholds, device status) and linked it from [use cases](use-cases.md) and [the tech stack frontend section](design/tech-stack.md#frontend). Camera and keypoints in the prototype are simulated; it is a reference for the frontend, not a measurement.

## 2026-10-17 — Use cases, ownership, and project brief

Added [use cases and team ownership](use-cases.md): the clinician-owned protocol principle, the use-case catalog with conditions (clinical assessment, rehabilitation, field sobriety support, private skin screening, assistive control, other settings), the protocol template, engine benchmarks, the proposed ownership map, reach to phones, and privacy rules. Published a companion project brief with process and interface sketches and linked it. Added the direction to [Project direction](project.md#established-user-direction), SH-T-057 and SH-T-058 to [the plan](plan.md#dependencies-and-order), navigation in [the index](index.md), and source SH-S-027. Thresholds are placeholders until the clinicians supply them.
## 2026-10-17 — Candidate skeletal medical tests listed

Added [ten candidate tests](requirements/skeletal-medical-tests.md) that a body-pose camera can time, count, or measure: one-leg stance, four-stage balance, Timed Up and Go, gait speed, two chair-stand tests, heel-to-toe walk, functional reach, active range of motion, and the two-minute step test. Linked the list from the index, [Project direction](project.md#established-user-direction), the [fitness-tracker scope](design/tech-stack.md#what-the-product-does), and the [field sobriety example](requirements/field-sobriety.md). Recorded source SH-S-026. No test was selected, implemented, or validated.

## 2026-10-17 — On-device advantages recorded

Added [the on-device advantages](requirements/on-device.md) from the user's two reasons: private images from a home medical test, such as a patient in pajamas, stay on the machine, and the camera can run without a network. Linked the page from the index, [Project direction](project.md#established-user-direction), [storage and privacy](design/tech-stack.md#storage-and-privacy), and the [field sobriety example](requirements/field-sobriety.md). Recorded source SH-S-025. No privacy audit or offline session was run.

## 2026-10-17 — Field sobriety example added

Added [the field sobriety example](requirements/field-sobriety.md) after the user asked for a driving-under-the-influence test as another example. The page limits the camera to visible walk-and-turn and one-leg-stand movements and states that the software does not determine impairment. Linked it from the README, the Wiki index, [Project direction](project.md#established-user-direction), and the [tech-stack document map](design/tech-stack.md#document-map-for-the-team). Recorded source SH-S-024. The fitness tracker remains the hackathon direction. No test was implemented or recorded.

## 2026-10-17 — RTMPose-family skeletal tracking references

Added source-checked pages for [RTMPose](references/models/rtmpose.md), [RTMO](references/models/rtmo.md), [RTMW](references/models/rtmw.md), [RTMW3D](references/models/rtmw3d.md), and [SimCC](references/models/simcc.md), and linked them from [the model index](references/models/index.md#skeletal-tracking-leads). The supplied summary's citation redirects were not used. Author benchmarks stay labeled as author-reported, including the RTMPose whole-body result of 67.0% AP and the later RTMW-l result of 70.1 AP. The Snapdragon 865 phone figure is distinguished from the Dell Snapdragon X Elite laptop. Updated navigation, [SH-Q-001](project.md#sh-q-001--model-and-runtime-selection), and source SH-S-023. Linked the existing [pose-candidate comparison](references/models/pose-candidates.md). No model was installed or run.

## 2026-10-17 — Tailscale invitation recorded

Added the user-supplied invitation and reported availability to [the Tailscale reference](references/tailscale.md). Linked the existing [runbook access procedure](runbooks/mac-and-snapdragon-development.md#access-the-snapdragon-laptop-over-tailscale), documented the invitation's public visibility if published, and added navigation and source SH-S-022. No invitation acceptance or remote connection test was performed.

## 2026-10-17 — Pose candidates and Qualcomm handoff added

Added [pose model candidates and the Qualcomm handoff](references/models/pose-candidates.md) after Qualcomm staff recommended RTMPose: a comparison of RTMPose, YOLO-pose, RTMO, MediaPipe Pose, HRNet/LiteHRNet, Posenet, MoveNet, and ViTPose with their ExecuTorch routes and NPU evidence, what needs training, and the handoff pack. Added the untested `experiments/qnn_export_pose.py` recipe, a Qualcomm section and RTMPose row in [the tech stack](design/tech-stack.md#working-with-the-qualcomm-engineer), a pointer from [the model index](references/models/index.md), SH-T-056 in [the plan](plan.md#dependencies-and-order), and source SH-S-021. No conversion was run.

## 2026-10-17 — Tailscale access procedure added

Added [the Tailscale access section](runbooks/mac-and-snapdragon-development.md#access-the-snapdragon-laptop-over-tailscale) to the runbook with the user-reported laptop name `qcworkshop27.tail2122cc.ts.net`, Windows OpenSSH Server setup, Mac connection and port-forwarding commands, and the Tailscale SSH limitation on Windows. Updated SH-T-036 in [the plan](plan.md#snapdragon-deployment), [Project direction](project.md#established-user-direction), [the laptop page](hardware/snapdragon-x-elite.md#deployment-checks), and source record SH-S-020. The procedure is documentation-derived; no connection has been tested.

## 2026-10-17 — Fitness tracker confirmed as the project direction

Recorded the user's confirmation that the camera-based fitness tracker is the project and the assistive-control pages are a previous idea awaiting the team's update. Resolved SH-Q-005 in [the tech stack](design/tech-stack.md#sh-q-005--how-does-the-movement-tracker-relate-to-secondhands) with its alternatives preserved, re-scoped SH-T-048 in [the plan](plan.md#dependencies-and-order) to the Wiki update, added the decision to [Project direction](project.md#established-user-direction), pointed [the index](index.md) at the tracker first, and added superseded notices to [the proposal](proposal.md) and the README. No older page was rewritten.

## 2026-10-17 — YOLO pose ExecuTorch export recorded

Added [the YOLO pose ExecuTorch export observation](experiments-before-saturday.md#yolo-pose-executorch-export-observation) from the new locked `experiments/yolo_pose_executorch.py` check, its [runbook section](runbooks/mac-and-snapdragon-development.md#run-the-yolo-pose-executorch-export-check), and the `just smoke-yolo-pose-executorch` recipe. Updated [the tech stack](design/tech-stack.md) perception, plan, and evidence text, noted the React and Bun frontend direction from the unmerged `dm/react-ui` branch, checked SH-T-050 in [the plan](plan.md#dependencies-and-order), and revised source SH-S-019. The run was in a Linux x86-64 container; Mac, laptop, and NPU execution remain unverified.

## 2026-10-17 — Movement tracker tech stack proposed

Added [the movement tracker tech stack](design/tech-stack.md) for the user's camera-based fitness tracker request: article-to-feature mapping, sensing options for the available cameras, YOLO-pose through ExecuTorch with MediaPipe and Qualcomm AI Hub fallbacks, deterministic rep counting plus a small trained ExecuTorch classifier, three runtime tiers on Windows ARM64 with a checked package-availability table, the WebSocket interface contract, a document map for the requirements, design, and frontend teammates, a two-day plan, and risks. Opened SH-Q-005 (relation to SecondHands) and SH-Q-006 (demonstration camera). Added Phase 9 tasks SH-T-048 to SH-T-055 to [the plan](plan.md#dependencies-and-order), a direction entry in [Project direction](project.md#established-user-direction), pointers from [the design index](design/index.md), [the laptop page](hardware/snapdragon-x-elite.md#deployment-checks), and [the runbook](runbooks/mac-and-snapdragon-development.md#windows-arm64-compatibility-limit), and source record SH-S-019. Nothing ran on the laptop; the Mayo article page could not be fetched.
## 2026-10-17 — Local depth bridge setup documented

Created [the MS-09 / Femto Bolt setup summary](setup/ms-09-femto-bolt-bridge.md) in the user-requested `setup` folder. Reviewed the earlier local session and saved installation/test evidence to explain the SDK failure, direct capture bridge, depth decoding, person-position application, and launch procedure. Preserved the initial successful checks and a later capture timeout as separate observations. Updated navigation, source SH-S-018, [hardware findings](hardware/femto-bolt.md), [deployment hardware](hardware/snapdragon-x-elite.md), [project evidence limits](project.md#implementation-and-evidence-limits), and [task status](plan.md). No camera tests were rerun, no application integration was performed, and no private recordings or calibration files were copied into Git.

## 2026-10-17 — React and Bun dashboard migration

Recorded the user-approved replacement of Vue with React and pnpm with Bun in [Project direction](project.md#development-setup), [runtime stack](design/runtime-stack.md), and [recognition design](design/recognition-and-triggers.md). Updated [runbook commands](runbooks/mac-and-snapdragon-development.md), SH-T-047 in [the plan](plan.md#ui), source SH-S-017, and [migration evidence](experiments-before-saturday.md#react-and-bun-migration-observations). Historical Vue checks remain labeled as earlier results. Issue #11 tracks the requested migration; Windows and physical-camera checks remain open.

## 2026-10-17 — Event backers recorded

Added GitHub, Meta, and Qualcomm to [the judging page](hackathon/judging-criteria.md#event-backers), following the user's identification and the logos visible in the supplied photograph. No specific sponsorship roles or commitments are inferred.

## 2026-10-17 — Judging criteria recorded

Added [judging criteria](hackathon/judging-criteria.md) from the user-supplied attendee-guide photograph: five criteria totaling 100 points. Preserved the visible wording and weights without reconstructing hidden descriptions. Linked the page from the index and presentation task, recorded source SH-S-016, and resolved the earlier rubric gap in [the Compute summary](hackathon-compute.md). The source page could not be retrieved through the web tool; the photograph was not added to Git.

## 2026-10-17 — Tailscale setup assigned

Created [issue #9](https://github.com/davidmoshal/SecondHands/issues/9) for Tailscale and Mac-to-Windows command access on the Dell Snapdragon laptop, assigned to Vishwa's collaborator account `theja2289`. Updated existing SH-T-036 in [the plan](plan.md#snapdragon-deployment), [project direction and account mappings](project.md), and source SH-S-015. Installation and connection testing remain open.

## 2026-10-17 — Clinical application ownership confirmed

Recorded Kate's clinical application role in [Project direction](project.md#established-user-direction), created [issue #7](https://github.com/davidmoshal/SecondHands/issues/7), and linked the work from [the plan](plan.md#team-coordination). Updated source record SH-S-014 and the owner-account context. Presentation ownership remains unconfirmed; no clinical requirements or findings were established by this assignment.

## 2026-10-17 — Browser-based 3D room demonstration added

Recorded the user's [3D room direction](project.md#established-user-direction) and created [issue #6](https://github.com/davidmoshal/SecondHands/issues/6) for David and Vishwa. Added linked work in [the plan](plan.md#ui) for a gesture/facial-command light response and optional Quest 2 viewing through WebXR, without an Android SDK. Recorded source SH-S-013. Existing physical-control work remains separate; no 3D implementation or headset compatibility is claimed.

## 2026-10-17 — Deployment laptop processor recorded

Added the [Dell Snapdragon hardware page](hardware/snapdragon-x-elite.md) with the user's exact X1E80100/Oryon processor description and reported 3.42 GHz speed. Separated those supplied details from unknown RAM, OS build, runtime versions, and untested deployment behavior. Linked the page from the index, device-configuration task, and Femto Bolt procedure. No hardware inspection or performance test was performed.

## 2026-10-17 — Femto Bolt selection and team work items

Replaced the current Astra 2 hardware choice with [Orbbec Femto Bolt](hardware/femto-bolt.md), following the user's revised direction. Added the Windows laptop-first, Dell Snapdragon-second procedure with current SDK evidence and explicit architecture limits. Updated the proposal, README, project direction, Compute hardware reference, navigation, source records, and [plan](plan.md#team-coordination). Created five GitHub coordination issues for stack, hardware, models, UI, and presentation. Recorded unconfirmed account mappings and Kate's proposed presentation ownership as linked Questions. No Astra-specific capture code existed to move, and no hardware connection was tested.

## 2026-10-17 — Additional local model experiments

Added isolated, locked image experiments and root just commands for Laya Vision, Mapika Decider Vision, and SmolVLM. Updated [model references](references/models/index.md), [observed results](experiments-before-saturday.md#decision-model-image-observations), [runbook commands](runbooks/mac-and-snapdragon-development.md#run-the-other-three-image-models), [runtime boundaries](design/runtime-stack.md), Project direction, source record SH-S-010, and [the task plan](plan.md#models). The records distinguish successful execution, model mistakes, dependency failures, and unresolved work. Added the user-requested `wait-what-dm` and `caveman` pointers to [repository governance](../AGENTS.md#communication-and-documentation-skills). Personal recordings remain outside Git; the new model runners do not yet supply the dashboard or execute through ExecuTorch.

## 2026-10-17 — Task plan reorganized by topic and phase

Reworked [the existing plan](plan.md) at the user's request into Mac foundation, models, recognition features, UI, design/ExecuTorch, comparison, Snapdragon deployment, and physical demonstration phases. Preserved earlier task identifiers and evidence limits, added explicit remaining model integrations and feature follow-ups, and removed governance/personal-name cleanup from the task list. Checked tasks distinguish implemented exploration from untested real-camera, participant, and target-device behavior. Updated navigation and source record SH-S-009; no application behavior changed.

## 2026-10-17 — Approved exploration dashboard implemented

Implemented the user-approved dashboard through a subagent and reconciled the [design](design/recognition-and-triggers.md), [runtime stack](design/runtime-stack.md), [Project direction](project.md#live-exploration-dashboard), source record SH-S-008, and SH-T-025 in [the task plan](plan.md#project-setup). Added [startup and interaction steps](runbooks/mac-and-snapdragon-development.md#run-the-live-exploration-dashboard). [Observed checks](experiments-before-saturday.md#dashboard-implementation-observations) record 33 Python tests, two transport tests, Vue type checking/build, native MediaPipe execution on public images, and parent source/browser review. The docs distinguish implemented deterministic triggers and frozen comparison from future decision-model inference. Real-camera, participant accuracy, remote operation, and Windows remain untested. Current personal-name checks remain clear; no Git history was rewritten.

## 2026-10-17 — Design approved and personal-name check repeated

Recorded the user's approval of the reviewed wording and explicit subagent implementation request in [the design](design/index.md), [Project direction](project.md#established-user-direction), source record SH-S-008, and SH-T-025 in [the task plan](plan.md#project-setup). Rechecked current repository content for the requested personal names and reviewed prose candidates for other names. The requested names were already absent from prose after the earlier redactions; working repository and technical source links remain. No further captured text was changed and no Git history was rewritten. Implementation evidence will be recorded separately after verification.

## 2026-10-17 — Recognition design and local ExecuTorch check

Added [system design](design/index.md) at the user's request: continuous recognition versus command triggers, proposed calibration/state transitions, dashboard exploration modes, package boundaries, and the reviewed [runtime stack](design/runtime-stack.md). Recorded the user's five-candidate Mac exploration and mixed-runtime preference separately from proposed product behavior and unresolved organizer acceptance. Added `just smoke-executorch` with a standalone script lock; the [observed Mac check](experiments-before-saturday.md#executorch-cpu-smoke-observation) verifies export, XNNPACK delegation, `.pte` loading, and agreement with PyTorch on 12 synthetic inputs. Updated the [runbook](runbooks/mac-and-snapdragon-development.md#run-the-executorch-cpu-smoke-check), project direction, model-index navigation, source records, and SH-T-024/SH-T-005 in [the task plan](plan.md). This is not a trained gesture model, implemented trigger policy, or target-PC result.

## 2026-10-16 — First MediaPipe Python baseline implemented

Implemented the user-requested Face Landmarker and Gesture Recognizer baseline through a subagent, with explicit checked model downloads, image and bounded camera CLIs, structured outputs, and focused tests. Updated [Project direction](project.md#mediapipe-baseline), the [model references](references/models/index.md), the [runbook](runbooks/mac-and-snapdragon-development.md#run-mediapipe-face-and-hand-recognition), and SH-T-023 in [the task plan](plan.md#project-setup). [Dated observations](experiments-before-saturday.md#mediapipe-baseline-observations) record the real image smoke checks, 10 passing tests with local models, and the limits of the evidence. Camera use, Windows, comparative accuracy, and Vue integration remain untested or unimplemented.

## 2026-10-16 — Public-repository privacy policy applied

Applied the user-approved [public repository rule](../AGENTS.md#public-repository-content) and linked the Wiki convention to that owner. Replaced team names with role labels and removed private conversation links and identifiers from the public archive and source record. Marked the redactions and retained the technical exchange content. Updated the model reference's source description and SH-T-022 in [the task plan](plan.md#project-setup). Targeted current-file scans passed; this was not a full secret or history audit. Earlier Git commits retain the original archive and have not been rewritten.

## 2026-10-16 — Local development tasks added

Added the root [justfile](../justfile) for the four commands the user confirmed working, plus combined setup and task listing. Updated [the development runbook](runbooks/mac-and-snapdragon-development.md#try-the-existing-scaffold-on-the-mac) to use the shortcuts and retain the Windows ARM64 dependency limit. Recorded verification under SH-T-021 in [the task plan](plan.md#project-setup). Recipe execution is verified on the Mac except for UI startup, whose command was checked by dry run; Windows execution remains untested.

## 2026-10-16 — Mac and Snapdragon development runbook added

Created [the development runbook](runbooks/mac-and-snapdragon-development.md) from the user-approved workflow explanation. Consolidated installation and check commands from [Project direction](project.md#development-procedure), while retaining package responsibilities and observed verification there. Recorded the separate checkouts and environments, Git workflow, T3 execution context, and current lockfile's Windows ARM64 PyTorch limitation. Updated [navigation and source records](index.md) and SH-T-020 in [the task plan](plan.md#project-setup). The Windows and remote-connection procedures remain untested.

## 2026-10-16 — Model references added

Added [the model reference index](references/models/index.md) and detail pages for the five recommended starting candidates supplied by the user. Reviewed the full captured conversation for other model mentions, including HSEmotion in the older quoted ranking; retained additional leads and distinguished deferrals from exclusions. Updated the [source records](index.md#source-records), [model-selection Question](project.md#sh-q-001--model-and-runtime-selection), experiment context, and SH-T-019 in [the task plan](plan.md#reference-review). The archive is unchanged. Historical technical claims remain unverified except where a primary-source check is explicitly stated; no models were installed or evaluated.

## 2026-10-16 — Python and UI project configured

Updated [Project direction](project.md#development-setup) with Python and Vue package responsibilities, setup commands, implementation limits, and observed Mac verification. Recorded the user's built-in-camera-first decision, with Astra 2 and a phone camera as optional inputs. Updated SH-T-003 and recorded completed setup as SH-T-018 in [the task plan](plan.md). Linked development instructions from the repository README and [Wiki index](index.md). No camera, recognition model, browser interaction, or Windows execution was tested.

## 2026-10-14 — Compute Track guide reviewed

Added [the Compute Track summary](hackathon-compute.md) from the current hackathon repository and public event pages, with pinned repository references and explicit evidence limits. Placed the hackathon link at the top of [the Wiki index](index.md). Updated [Project direction](project.md) and SH-T-001 in [the task plan](plan.md) to distinguish verified source statements from unresolved organizer and hardware questions. No runtime tests, organizer contact, or full docaudit were performed.

## 2026-10-14 — Task plan established

Created the user-requested [task plan](plan.md) with ordered preparation, Compute PC verification, demonstration integration, and optional experiment tasks. Each task states its expected completion evidence; no task is marked complete. Updated [repository governance](../AGENTS.md), [Wiki conventions](AGENTS.md), and [navigation](index.md) to make this the single task-tracking owner and linked it from the [experiment page](experiments-before-saturday.md).

## 2026-10-14 — Pre-Saturday experiments extracted

Created [Experiments before Saturday](experiments-before-saturday.md) from the user-supplied review: three-model Mac comparison, 30–50 observations from two volunteers, seven measurements, proposed responsibilities, and Saturday follow-up. Confirmed that the selected source section matches the existing archive. Replaced the duplicated comparison summary in [Project direction](project.md) with a link and updated [navigation and source records](index.md). This records a proposed plan, not experiment results or confirmed assignments.

## 2026-10-14 — Current proposal recorded

Preserved the user-supplied [current proposal](proposal.md) in full. Updated [Project direction](project.md) to identify it as current, record the Astra 2 difference from the earlier camera-only direction, and clarify the remaining model/deployment Question. Added the proposal to [navigation and source records](index.md). Technical and market-size claims were not independently verified; the historical conversation archive is unchanged.

## 2026-10-14 — Governance adoption

Adapted the ownership and maintenance structure reviewed in `au2604-auction-legacy` (`AGENTS.md`, `Wiki/AGENTS.md`, `Wiki/index.md`, and the update and consolidation sections of its maintenance runbook). The shared `docs-governance-dm` skill remains the method owner; auction-specific rules and tooling were not adopted.

Established [repository governance](../AGENTS.md), [Wiki conventions](AGENTS.md), and [the index with source records](index.md). Moved the existing project context from root guidance into [Project direction](project.md), with explicit evidence limits and an unresolved model/runtime Question. [CLAUDE.md](../CLAUDE.md) now contains only `@AGENTS.md`.

The [conversation archive](SecondHands-conversation.md) remains unchanged. This change does not claim complete incorporation of that source or verification of its technical claims. No full docaudit was run.
