# Use cases and team ownership

**Status:** recorded on 2026-10-17 from the user's direction. The clinicians (MDs) on the team own the test protocols, metrics, thresholds, and benchmarks; the platform is a shared engine that scores clinician-defined movement tests, with further applications beyond general fitness. This page owns the use-case catalog, the protocol template, and the proposed ownership map. Thresholds and protocols below are placeholders until the clinicians supply them. [The tech stack](design/tech-stack.md) owns the architecture; [the plan](plan.md#movement-tracker) owns task status.

Two shareable companion pages were published for the team on 2026-10-17: [the project brief](https://claude.ai/artifact/2gnYWwfqMh4ZTrJrz2u5iQ) with the process, interface sketches, benchmarks table, and ownership, [the architecture walkthrough](https://claude.ai/artifact/PMN1kdP24iQBhRaxZJrvz3), and [the interactive console prototype](https://claude.ai/artifact/CQdDefYFJcuS6qYVJN4K9B), which runs the rep-counting hysteresis rule and the single-leg-stance scoring on a simulated skeleton with editable protocol thresholds. They are presentations of this Wiki, not separate sources of requirements; the prototype's screens are the reference for [the frontend work](plan.md#movement-tracker).

## Principle

The product is a test engine, not a fitness app. The engine turns camera frames into keypoints through ExecuTorch and keypoints into metrics; a protocol file defined by clinicians states the instructions, phases, metrics, thresholds, scoring, and report for one test. A new test is a new protocol file, not a new model.

## Use-case catalog

| Family | What is measured | Hackathon status | Owner of requirements | Conditions |
| --- | --- | --- | --- | --- |
| Clinical movement assessment | Standardized functional tests scored from the camera: 30-second chair stand, single-leg stance time and sway, timed up and go, joint range of motion | Demonstration target | Clinicians | Validate against stopwatch, goniometer, and clinician rating on the same session |
| Rehabilitation and fitness progress | Guided exercise sets with rep counts and form cues, baseline and retest, adapted for limited mobility | Demonstration target | Clinicians with the frontend owners | Progress is against the person's own baseline |
| Field sobriety support | Walk-and-turn and one-leg-stand clues from a body camera or a phone: steps, heel-to-toe gaps, arm raise, sway, hop, timing | Later | Clinicians plus legal review | Decision support and record only; validation studies, consent and retention rules, and bias testing across body types, footwear, and lighting before field use. Horizontal gaze testing would use the face model, not body pose |
| Skin and body-surface screening | Private, on-device mapping of moles and marks, asymmetry, size change, new bumps, compared across visits | Later | Clinicians | A separate lesion detection and segmentation model on the same runtime. Screening and change tracking, not diagnosis. Images never leave the device and are encrypted at rest. Hackathon demonstrations use public dermatology datasets only, never participants' own images |
| Assistive control | The original SecondHands gesture and facial-expression control of switches and appliances | Retained as an extension | Existing [proposal](proposal.md) | Reuses the trigger engine and dashboard as implemented |
| Other settings | Fall-risk screening at home, desk ergonomics, sports technique, remote physiotherapy check-ins, occupational fitness tests, clinic triage far from specialists | Ideas | To be proposed | Each is a protocol file plus a validation plan |

## Protocol template

Each clinician-defined test is recorded with these fields before it counts as specified. Keep the filled-in protocols in a `protocols/` folder as JSON once the engine reads them; until then, record them in this section.

| Field | Meaning | Example (placeholder) |
| --- | --- | --- |
| Identifier and name | Stable id and the test's clinical name | `SLS-01`, single-leg stance |
| Instructions | What the person is told, in plain words | "Stand on your right leg, hands on hips, as long as you can" |
| Setup | Camera distance and height, clothing, space, assistive devices allowed | Camera at 1.2 m height, 2.5 m away, full body visible |
| Phases | Named phases with start and end conditions from keypoints | ready, holding, ended (foot touch-down or 30 s) |
| Metrics | What is computed from the keypoints | hold time; hip-centre sway amplitude; arm abduction events over 30° |
| Thresholds and scoring | Pass marks and scoring rules set by the clinician | hold ≥ 20 s passes (to set) |
| Report | What the clinician must see | time, sway trace with band, events, comparison to baseline |
| Reference instrument | How the measurement is validated | stopwatch and clinician observation |
| Agreement target | Acceptable difference from the reference | within ± 0.5 s (to set) |
| Safety | Stop conditions and supervision | stop on loss of balance; spotter present |

## Engine benchmarks

The engineering side reports, per device and runtime: pose inference latency and frames per second, keypoint error against the PyTorch reference, the share of operators delegated to the NPU with profiler evidence, memory, and sustained behavior over a ten-minute session. The current evidence is the [YOLO pose CPU export observation](experiments-before-saturday.md#yolo-pose-executorch-export-observation); no device numbers exist yet. The [Compute procedure](hackathon-compute.md#compute-deployment-and-verification) states what the event expects.

## Proposed ownership

Names are the role labels already used in this Wiki. Rows marked proposed need the team's confirmation; [SH-Q-003](project.md#sh-q-003--github-accounts-for-the-named-owners) and [SH-Q-004](project.md#sh-q-004--presentation-lead) remain the places where account mapping and the presentation lead are resolved.

| Who | Owns | First deliverable |
| --- | --- | --- |
| Clinicians (MDs on the team) | Protocol definitions, metrics, thresholds, validation plan, report content, ethics of each use case | Two protocol files for the demonstration with pass marks |
| Kate | Clinical application scope and demonstration narrative; presentation lead (proposed) | Demonstration script matching the protocols and the [judging weights](hackathon/judging-criteria.md#scoring) |
| Vishwa | Tech stack, laptop environment, ExecuTorch pipeline on the device, Tailscale access, Qualcomm handoff | Tier 0 running on the Dell with frame-rate numbers; [handoff pack](references/models/pose-candidates.md#handoff-pack-for-the-qualcomm-engineer) delivered |
| David | React and Bun frontend, session and progress screens, model evaluation | Live session screen against real messages |
| Cam and Jacqueline | Cameras and capture on the Dell, calibration recordings | Camera decision with measured frame rate; about 100 calibration frames |
| Requirements and design document owners | PRD and TDD, linked from [the document map](design/tech-stack.md#document-map-for-the-team) | Acceptance criteria that quote the clinicians' thresholds |
| Qualcomm engineer | RTMPose and classifier conversion to the NPU, runner build, delegation profile | A `.pte` that loads on the Dell with a profiler trace |

## Reach beyond the laptop

ExecuTorch targets mobile, so the same PyTorch models export to a `.pte` for a Snapdragon phone with the Qualcomm backend set to that phone's chipset; the protocol files, scoring code, and report format do not change. A phone camera is enough for every protocol above; depth is optional precision. Running without cloud services, connectivity, or per-use fees, on open-weight models and an open-source runtime, is what makes the platform usable in low-resource clinics and home visits. These are design properties, not demonstrated results: a phone build needs a re-export per chipset and an application shell, and nothing has run on a phone.

## Rules

- Frames stay on the device; keypoints and scores are stored, video is not, unless a clinician starts an explicit consented recording.
- Every report states that it is screening or decision support, not diagnosis or evidence.
- Validation covers body types, skin tones, clothing, mobility aids, lighting, and camera placement before any accuracy claim.
- Sensitive imagery is never demonstrated on people; public datasets only.
- Claims match evidence; work in progress is labelled as such.

## Questions

None open on this page. Protocol content is work for the clinicians under [SH-T-057](plan.md#movement-tracker); the skin-screening model choice is [SH-T-058](plan.md#movement-tracker).
