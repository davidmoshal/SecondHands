# MotionVitals AI
## Turning Physical Function into Actionable Clinical Evidence

Prepared 17 October 2026. Planning package, not a clinical validation report or a functioning application.

MotionVitals proposes supervised, camera-based Five-Times Sit-to-Stand (5xSTS) measurement for exploratory use in pharmaceutical studies. The initial buyer is a sponsor or CRO seeking consistent functional assessment records alongside existing laboratory, imaging and patient-reported data. The prototype must execute a real ExecuTorch model on the supplied Snapdragon X Elite, count repetitions, time the assessment, identify unusable measurements and export traceable results. Whether this saves money or improves measurement is a question for comparative studies.

## Read in this order

For the implementation team, start with the concise [Hackathon Project Specification](TEAM_PROJECT_SPEC.md).

For judging, use the [five-slide demo-first pitch](MotionVitals_Demo_Pitch.md). The original ten-slide presentation remains extended background. Current build priorities require visible movement events, a deliberate failure example, device/offline evidence and a small independent evaluation before optional depth features.

1. [Product and business case](01_PRODUCT_AND_BUSINESS_CASE.md)
2. [Evidence and regulatory review](02_CLINICAL_EVIDENCE_AND_REGULATORY.md)
3. [Engineering specifications](03_TECHNICAL_SPECIFICATIONS.md)
4. [Pitch content and speaker notes](04_HACKATHON_PITCH.md)
5. [Commercialization roadmap and ROI](05_COMMERCIALIZATION_ROADMAP.md)
6. [Sources and limitations](06_SOURCES.md)

Additional assets: adjustable `roi_model.py` / `roi_inputs.json`, `synthetic_trial_profile.json`, and [delivery/verification notes](07_DELIVERY_NOTES.md).

The convertible presentation is `MotionVitals_Hackathon_Pitch.md`: ten slides with speaker notes and source references. PowerPoint generation was attempted, but the bundled runtime could not start because system-file access remained blocked after escalation. This is the alternative expressly permitted in the brief. No `.pptx` has been generated or visually verified.

## Prioritized technical requirements

| Priority | Requirement | Proof needed |
|---|---|---|
| P0 | Run a meaningful `.pte` model on the actual Snapdragon laptop | Device identity, runtime/build, model hash, execution log and outputs |
| P0 | Resolve camera capture | Astra 2 stream test; webcam and consented recording fallback |
| P0 | Freeze one 5xSTS protocol | Chair, instructions, start/stop events, assistance and incomplete-test rules |
| P0 | Model-driven events and deterministic scoring | Reference-annotated test clips; count/timing and failure review |
| P0 | Quality control and explicit invalid outcomes | Occlusion, missing frames, incomplete test and tracking-loss demonstrations |
| P0 | Local results and JSON export | Reloadable record with provenance and synthetic labels |
| P1 | Baseline/follow-up evidence view | Synthetic imported biomarker and PRO values; separate from measured outputs |
| P1 | Benchmark and offline demonstration | p50/p95 inference and end-to-end latency, dropped frames, memory, network check |
| P2 | Depth features, acceleration, extra assessments | Only after the complete primary path works |

## Complete pitch outline

1. MotionVitals: physical function as clinical evidence.
2. Problem: biological change does not establish functional benefit.
3. Evidence: anamorelin and ponsegromab illustrate complementary outcomes.
4. Workflow: standardization, scoring and documentation deserve measurement.
5. Solution: supervised 5xSTS → local inference → quality-controlled record.
6. Demonstration: live or explicitly labeled recorded assessment, review and export.
7. Architecture: actual `.pte` execution, actual backend and measured performance.
8. Trial use: join functional observations with imported multimodal evidence.
9. Business: sponsor-funded pilots, study licensing, economics to validate.
10. Roadmap: feasibility → validation → exploratory trial → disease-specific modules.

## Shared assumptions and decision register

| ID | Status | Decision or dependency |
|---|---|---|
| A1 | User-specified | Available hardware: Snapdragon X Elite laptop and Astra 2; no Arduino or actuators |
| A2 | User-specified | Primary assessment 5xSTS; primary market pharmaceutical trials |
| A3 | Proposed | Begin with supervised site use; home use requires separate evidence and safety design |
| A4 | Unverified | Windows ARM64 build, camera drivers and supported model operators on the actual device |
| A5 | Unverified | Qualcomm NPU path; CPU fallback is permitted but also must execute successfully |
| A6 | Partly confirmed | User supplied the official Compute Track page; detailed rubric, deadline, eligibility and allowed prior work remain unpublished on the reviewed guide; organizer video awaits review |
| A7 | Proposed | Model candidate and exact clinical timing convention in technical specifications |
| A8 | Not demonstrated | Accuracy, clinical validity, savings, customer demand and reimbursement |
| A9 | Packaging limitation | Presentation delivered as editable, convertible Markdown under the brief’s fallback |

## Contradictions reconciled

- Earlier project context said hardware and assessment were undecided. The new saved brief now specifies both; actual compatibility remains unverified.
- Earlier context requested waiting for “done” before consolidating discussion archives. This new brief explicitly requests this package now. Only the readable project context and saved brief were used; inaccessible earlier attachments were not inferred.
- “Objective, reproducible” describes the goal; current MotionVitals performance has not been measured.
- “The missing vital sign” is positioning, not a claim that function is unmeasured today. Existing camera and wearable systems are acknowledged.
- The supplied pipeline mixed development/export with runtime steps. The engineering document separates these.
- The user identified the official Compute Track page during this work. Its public guide confirms the event and submission workflow but does not publish the detailed rubric. The supplied 40/25/15 weights remain attributed to the brief; no remaining point weights are invented.

## What is ready, and what is not

Today: evidence-supported product strategy, specifications, financial assumptions and pitch materials. Weekend target: one working local measurement path, conditional on the runtime feasibility gate. Requires validation: agreement, reliability, subgroup performance, meaningful change and economic value. Commercial future: controlled disease-specific modules integrated into sponsor workflows.

No inference, clinical experiment, device benchmark, customer interview or vendor security audit was performed to prepare this package.
