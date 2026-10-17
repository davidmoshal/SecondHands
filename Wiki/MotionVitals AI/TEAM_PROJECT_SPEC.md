# MotionVitals AI — Hackathon Project Specification

**Team build brief · 17 October 2026**

## Project purpose

MotionVitals AI helps research teams collect structured measurements of physical function using a camera and local AI.

**Positioning:** MotionVitals turns a supervised chair-rise assessment into a locally processed, reviewable functional measurement—with timing, movement events and quality checks in one workflow.

The longer-term opportunity is to help pharmaceutical sponsors assess functional changes alongside laboratory biomarkers, body composition and patient-reported outcomes. The hackathon prototype demonstrates one part of that workflow: a supervised five-times sit-to-stand assessment.

## The problem

Physical-function assessments can involve manual timing, observation and documentation. Across repeated visits, research teams need consistent measurements, clear identification of unsuccessful assessments and results they can compare over time.

Our hypothesis is that automating parts of this workflow could reduce assessment effort and improve consistency. The prototype will demonstrate technical feasibility, not establish these benefits clinically.

## Intended users

- **Primary user:** a research coordinator supervising an assessment.
- **Result user:** an investigator or study team reviewing functional measurements.
- **Potential customer:** a pharmaceutical sponsor or clinical research organization.

Cancer cachexia provides the initial clinical-trial story. The demonstration uses a consenting volunteer; it does not establish suitability for patients with cancer cachexia.

## What we will build

A working application that guides an assessment, observes movement, counts five completed chair rises, measures completion time and saves a structured result. A simple longitudinal view will place the demonstration result alongside clearly labeled synthetic historical visits.

**Target hardware:** Snapdragon X Elite laptop and Orbbec Astra 2 camera where compatible.

**Required AI runtime:** genuine ExecuTorch model inference on the Snapdragon device, contributing directly to movement assessment.

**Fallbacks:** a standard webcam or consented prerecorded input if camera integration fails, subject to organizer rules. CPU inference is acceptable for our proposed product scope, but its eligibility for the track is unverified. Confirm whether organizers require NPU acceleration before treating it as optional for submission. Claim only the backend actually demonstrated.

## User experience

1. **Prepare:** Select a demo participant and visit, review instructions and check camera framing.
2. **Start:** Confirm the participant is seated and issue a clear start cue.
3. **Measure:** Show the movement overlay, detected stand events, repetition count and timer together as the participant performs five chair rises. Keep a stop control available.
4. **Finish:** Display completion time, repetition count and measurement-quality concerns.
5. **Review:** Accept a usable result or record why the attempt was unsuccessful. A repeat, if appropriate, becomes a new attempt; the original remains identifiable.
6. **Compare:** Show the result alongside visibly labeled synthetic history.
7. **Export:** Save the assessment record as JSON. CSV is optional.

## Assessment rules

For this prototype, the participant starts seated and the test ends at the **fifth confirmed full stand**. Timing runs from the start cue to that final event. Keep the chair setup, instructions, arm-use convention and timing rules consistent between attempts.

Count each completed rise once. Pausing while standing must not add repetitions. Use capture timestamps for timing; prerecorded input must use the recording’s timeline rather than playback speed.

If the participant stops early, the camera loses tracking or the result cannot be trusted, show an incomplete, interrupted or unreliable attempt. Do not report a successful completion time. A supervisor remains responsible for participant readiness and stopping the assessment when needed.

## Required capabilities

| Capability | Expected behavior |
|---|---|
| Guided assessment | Setup instructions, start cue, progress and stop control |
| Local AI measurement | An actual `.pte` model runs through ExecuTorch on the target device and drives movement assessment |
| Counting and timing | Completed-rise count and elapsed completion time in seconds |
| Inspectable measurement | Overlay actual model outputs on the input; show each confirmed stand with its timestamp in an event strip alongside count and timer |
| Quality handling | Explicit flags for tracking loss, incomplete movement or interrupted capture |
| Result review | Separate assessment outcome, measurement quality and coordinator review status |
| Structured export | Save results, identifiers, units, source and version information |
| Trial context | Display synthetic history without presenting it as measured patient data |
| Transparent demo | Identify live versus prerecorded input and the actual CPU/NPU backend |
| Device evidence | Save runtime/model/backend details, measured inference latency and an offline assessment/export run |

The overlay must reflect the outputs used by scoring, not a decorative animation. When tracking is lost, mark the overlay unavailable rather than presenting stale joints as current observations.

## Technical approach

```text
Camera or recorded video
  → frame preparation
  → local ExecuTorch pose/movement model
  → movement-event detection
  → deterministic counting and timing
  → quality checks
  → result display and structured export
```

The model estimates movement; application logic applies the assessment rules. Select the model based on successful export, licensing, reliable movement observations and performance on the actual laptop. Model selection remains an engineering decision to verify, not an established dependency.

The Astra 2 supplies movement observations. Depth sensing is an optional enhancement if it integrates reliably. The core project must remain useful without depth-derived measurements.

## Minimum assessment record

Save study, demo participant, visit and attempt identifiers; assessment type and timestamp; repetition count; detected-event timestamps; completion time and units; completion status; quality flags; review status; protocol, model and software versions; camera/device/backend information; and live, recorded or synthetic source labels.

For an unsuccessful attempt, completion time is empty with a reason—not zero. Preserve the attempt when a new one is collected. Keep measured demonstration values separate from synthetic or imported example values.

## Team workstreams

| Workstream | Responsibility | Handoff |
|---|---|---|
| Model and runtime | Select/export model; execute on Snapdragon; record actual backend and latency | Timestamped movement estimates with confidence/quality information |
| Assessment logic | Detect events; implement count, timer and failure handling | Assessment result and quality status |
| Application and data | Movement overlay/event strip; setup/results screens; JSON export; brief synthetic history | Inspectable measurement and saved records |
| Validation and demo | Independent annotations; all-attempt evaluation; offline test; failure demo and fallback rehearsal | Evaluation table, device evidence and repeatable demonstration |

Assign a named owner to each workstream. One person may own more than one. Agree on the movement-output and result-record formats before connecting components.

## Definition of success

The team can demonstrate:

- Three consecutive end-to-end supervised runs, including review and export.
- Local ExecuTorch execution that directly contributes to the measurement.
- A synchronized movement overlay and timestamped events that explain how the displayed count was obtained.
- Correct repetition counts and completion times checked against independent reference observations.
- A deliberate tracking-obstruction case that flags the attempt and withholds an unreliable completion time. Use prerecorded input or a stationary volunteer for the obstruction; do not interfere with someone mid-rise.
- Saved device evidence: actual backend, model/runtime versions, p50/p95 inference latency with sample count and test settings, and an assessment/export run with networking disabled.
- An exported record that matches the displayed result and preserves its source and versions.
- A clearly labeled synthetic longitudinal comparison.

**Proposed demonstration tolerance:** exact counting and completion time within 0.5 seconds of the agreed reference on ten clean test recordings not used to tune the algorithm. Confirm this target before testing and report actual results, including failures. It is an engineering target, not a clinical validation threshold.

**Evaluation reporting:** freeze the test set before testing; annotate it independently of model output. Report the total attempted recordings, usable results, exact-count agreement, timing errors and every failure reason. Report timing error only where a valid reference and result exist, with its denominator. Keep deliberate fault cases separately identified and include whether each was correctly flagged. Do not discard tracking failures to improve the headline result.

**Required evidence handoff:** model/device execution log; benchmark table with resolution, backend, warm-up and timed-frame count; offline-run evidence; per-recording evaluation table; successful and unsuccessful demonstration captures. All remain pending until actually collected. Offline operation is evidence about that tested workflow, not a compliance certification.

## Priority order

1. Prove actual local model execution and usable camera/recorded input.
2. Complete one reliable assessment with visible model-driven events, failure handling and export.
3. Capture independent evaluation and device-performance evidence, including offline operation.
4. Polish and rehearse the successful assessment, deliberate failure case and labeled fallback. Keep synthetic history brief.
5. Add depth or NPU acceleration only when the core is dependable, unless verified track requirements make acceleration mandatory.

## Outside scope

Diagnosis, treatment recommendations, drug-efficacy conclusions, clinical validation or regulatory/compliance claims; camera measurement of laboratory biomarkers or muscle mass; additional movement assessments; production trial systems or hospital integration; and proof of cost savings or superiority over manual assessment.

## Clinical-trial demonstration and final pitch

Use an illustrative participant profile with synthetic baseline and follow-up visits. Add the new volunteer demonstration result to show how a functional observation could enter a study workflow. Optional laboratory, body-composition or patient-reported values must be labeled as imported synthetic examples. Do not imply that their relationship demonstrates a treatment effect.

**Pitch order:** problem → live assessment → reviewable result and failure handling → device/evaluation evidence → buyer and next step. Cancer cachexia motivates the work; detailed clinical evidence and synthetic biomarkers belong after the working demonstration or in backup material.

**Pitch:** MotionVitals turns a supervised chair-rise assessment into a locally processed, reviewable functional measurement—with timing, movement events and quality checks in one workflow. Further work would test measurement validity, usability and operational value in the intended clinical setting.

## Decisions to resolve at kickoff

Confirm the working runtime/backend, camera path, model, assessment instructions, team owners and organizer demo requirements. The organizer recording has not yet been reviewed; no demo-length requirement is assumed here.

Detailed engineering background: [03_TECHNICAL_SPECIFICATIONS.md](03_TECHNICAL_SPECIFICATIONS.md). This team brief defines the current scope: additional assessments remain outside it.
