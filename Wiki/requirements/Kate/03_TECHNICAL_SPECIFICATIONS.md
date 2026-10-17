# Technical specifications

17 October 2026 · Proposed implementation, not an implemented or tested system.

## Scope and build sequence

Primary workflow: supervised 5xSTS → local model-driven event detection → deterministic timing/counting → QC → reviewed result → JSON export. No Arduino, actuators or second assessment are required. Clinical interpretation and physical supervision remain human responsibilities.

**Must have:** meaningful `.pte` execution on Snapdragon X Elite; camera or clearly labeled prerecorded input; standardized instructions; count and completion time; incomplete/invalid outcomes; QC; local results; versioned structured export; synthetic longitudinal context; reproducible run instructions.

**Stretch:** Astra 2 depth integration; verified NPU delegation; per-rise/descent features; reference overlays; power measurement; additional assessments. Do not delay a functioning CPU path for acceleration.

Build order: (1) runtime/device feasibility; (2) frozen model and annotated clip; (3) count/timing state machine; (4) camera; (5) QC and export; (6) dashboard and synthetic imports; (7) profiling and rehearsal. This document specifies the build; this package does not claim to implement it.

## Hardware and compatibility gate

| Component | User-specified or proposed | Required verification |
|---|---|---|
| Snapdragon X Elite | User-supplied target | Exact laptop, OS/build, ISA, available memory, runtime build |
| Astra 2 | User-supplied RGB/depth sensor | SDK/firmware pair, driver loading, sustained frames, timestamps and RGB/depth registration |
| Webcam | Fallback input | Capture API and actual frame cadence on target |
| Prerecorded consented video | Capture fallback | Decode locally and use source presentation timestamps |
| Chair and camera mount | Required physical setup | Stable, protocol-specified chair; repeatable placement and full-body visibility |
| ExecuTorch | Required runtime | Exported `.pte` loads and its outputs drive the assessment |

Official desktop docs describe Windows and CPU deployment, but build documentation explicitly lists tested Windows x86_64. These sources do not establish this Windows ARM64 combination. Qualcomm backend support must be verified for the exact OS/runtime; NPU availability in hardware is not proof of delegation. Orbbec documentation lists Windows x64 and Linux ARM64 separately; that is not Windows ARM64 driver confirmation. [S17–S20, sources document]

Gate artifact: save OS/ISA, compiler, runtime commit, model/checkpoint hash, backend, camera SDK/firmware, command, output and short recording. Native CPU is preferred as the initial target. An emulated x64 process, if it works, must be labeled emulated; it does not prove native ARM64 or NPU execution. If neither local route works, report the Compute Track requirement unmet. Remote execution is not a valid substitute.

## Model selection and architecture

Provisional first candidate: a fixed-input single-person ViTPose-S-style PyTorch pose estimator from the official ViTPose project [S21]. This is a selection for a feasibility spike, not a verified compatible model. Before adoption, resolve checkpoint provenance, weights/code/data licensing, commercial rights, preprocessing, operators, input dimensions and measured memory/latency. Do not claim that the project’s published accuracy applies to clinical chair-rise assessment.

Use a manually defined participant crop and one-person framing initially, avoiding a separate detector. Target contract: RGB tensor `[1,3,H,W]` with dimensions and normalization fixed to the chosen checkpoint; output keypoints with confidence. Decode heatmaps outside the model if export compatibility requires it, preserving the original transform. Reject multiple people, swapped tracking identity or missing required joints.

If this candidate fails the export/performance gate, choose a smaller licensed PyTorch pose model and rerun parity checks. A trained temporal classifier on independently obtained keypoints is an alternative only if it meaningfully determines movement state and has adequate authorized training data. A dummy `.pte` alongside an unrelated measurement pipeline is unacceptable.

Development pipeline:

```text
Licensed checkpoint + fixed preprocessing
  → PyTorch reference outputs
  → torch.export capture → ExecuTorch conversion/lowering
  → .pte + hashes + operator/backend manifest
  → target-device parity and performance tests
```

Runtime pipeline:

```text
Camera / recorded frames + capture timestamps
  → crop / resize / normalize
  → local ExecuTorch .pte pose inference
  → keypoints + confidence → filtered movement states
  → deterministic 5xSTS scoring → QC → human review
  → local dashboard + controlled JSON/CSV export
```

Inference estimates pose; deterministic code applies the protocol. Export is a development step, not an action repeated for every video frame. Depth is optional and must not silently change endpoint derivation.

## Protocol and scoring

The clinical lead must approve one written 5xSTS convention before collecting reference data. Proposed prototype convention: begin from seated posture; standardized start cue; count a rise only after full standing is confirmed; stop timing at the fifth full stand. This is a proposed convention, not a claim that every 5xSTS variant uses it. A protocol ending in the fifth sitting position is a different derivation and must use a different protocol ID.

Record chair height, arm-use instructions, footwear, assistance, camera geometry, practice policy and stop rules. A trained supervisor determines readiness and stops testing when appropriate; the camera does not certify safety. If unable to complete, preserve status and reason rather than assigning an arbitrary poor time.

State machine: `SETUP → READY_SEATED → RUNNING → COMPLETE | INCOMPLETE | ABORTED | INVALID`.

Within RUNNING, movement states are `SEATED → RISING → STANDING → DESCENDING → SEATED`. Count only a valid rising-to-standing sequence following a confirmed seat state, with distinct thresholds for entry and exit (hysteresis). A pause in standing is not a new repetition. Partial rises, arm assistance and uncertain posture require protocol-specific handling and flags.

Use hip vertical displacement normalized to body scale plus knee/hip angles and keypoint confidence. Calibrate seated and standing ranges when safe and feasible; lock the calibration and thresholds for the attempt. Filter jitter with a documented causal filter and minimum dwell time. Assign event time to the first qualifying frame in a sustained state, not the delayed UI confirmation time. Record filter/dwell parameters and uncertainty. Do not hard-code population validity into an arbitrary joint-angle threshold.

Duration = capture-clock timestamp of fifth standing event − timestamp of the synchronized start cue. Timestamp the cue in the same clock domain; a manual “start recording” click is not automatically the test start. For prerecorded video, use annotated cue time and media timestamps, not decoding wall time or frame number divided by assumed FPS. Keep UTC assessment time separate from monotonic event time.

If tracking disappears, retain elapsed time; never silently pause the clinical timer. Mark intervals uncertain and reject completion when the final count or endpoint cannot be recovered reliably. Reprocessing creates a new derived result linked to the original attempt. A repeat physical assessment creates a new attempt ID.

## Quality control and interface

Preflight checks: camera active, participant framed, usable lighting, one person, stable chair, selected protocol, synthetic/consented data status. During capture: joint visibility, identity continuity, frame gaps, model failures, impossible state sequences and assistance concerns. After capture: exactly five valid rises for a complete result, consistent timestamps and reviewer disposition.

QC states: `pass`, `review_required`, `fail`. These are measurement statuses, not statements of patient health. A failure must remain visible in the dataset. Warning alone is insufficient when a result is not interpretable.

Screens: setup and protocol checklist; assessment with progress/count and stop button; result with time/count/QC and backend badge; longitudinal view with distinct source labels; export/review panel. Show “experimental measurement” throughout. Charts must not connect missing visits as if measured, combine incompatible units on one axis or label a decrease in time “treatment response.”

## Record specification

One immutable attempt record, with derived revisions and review events separately linked. Required fields and example values below are entirely synthetic; values are not observed performance.

```json
{
  "schema_version": "0.1.0",
  "assessment_id": "DEMO-A001",
  "study_id": "SYNTH-STUDY-01",
  "participant_id": "SYNTH-P001",
  "visit_id": "WEEK_04",
  "attempt": 1,
  "assessment_type": "5xSTS",
  "protocol_id": "DEMO-CUE-TO-FIFTH-STAND-v1",
  "assessment_timestamp": "2026-10-17T17:00:00Z",
  "repetition_count": 5,
  "completion_time": {"value": 14.2, "unit": "s"},
  "qc": {"status": "pass", "flags": []},
  "processing_status": "complete",
  "data_source": "synthetic_fixture",
  "is_synthetic": true,
  "model": {"version": "UNSELECTED", "sha256": null},
  "software_version": "SPECIFICATION_ONLY",
  "device": {"host": "NOT_EXECUTED", "camera": "NOT_EXECUTED", "backend": "NOT_EXECUTED"},
  "review_status": "not_reviewed",
  "raw_video_retained": false
}
```

Production schema must additionally constrain enums, types and ranges; include timestamp source, timezone, OS/ISA, runtime/backend version, model hash, protocol configuration hash, camera/frame settings, missing-frame summary, source reference, event list, operator/reviewer identifiers and revision linkage. For incomplete/invalid results, `completion_time.value` is null with a reason; never zero. Counts are nonnegative integers; complete 5xSTS requires five. Reject inconsistent status/score combinations and nonmonotonic events.

For longitudinal analysis, keep assessment attempts separate from a prespecified selected visit result. Use long-format observations: study/participant/visit/assessment/measure/value/unit/source/QC/version. Imported laboratories, body composition and PROs retain their original source and collection time. A join does not establish simultaneity. Changes from baseline require the same measure/protocol and a valid baseline; preserve missing values and reasons. Treatment labels belong only in authorized analysis datasets.

Future controlled export: data dictionary, transfer agreement, schema validation, checksums, reconciliation reports, mapping to sponsor standards, audit trail, locked releases and signed approvals where required. An ordinary CSV export is not an EDC integration or regulated-system validation.

## Testing and acceptance

All numeric targets below are proposed engineering gates, not achieved results or clinical thresholds.

| Test | Proposed demonstration acceptance |
|---|---|
| Export parity | Predefine tensor tolerance; compare PyTorch/ExecuTorch outputs and downstream events on identical inputs |
| Correct counting | Exact count on all ten selected clean held-out demonstrations; disclose sample size and failures |
| Timing | ≤0.5 s absolute difference on those demonstrations against synchronized independent annotation; clinical margin still unresolved |
| Fault handling | Every scripted incomplete, occluded, disconnected and multi-person case yields explicit invalid/review state |
| Repeatability | Identical input/build/config produces identical count and event times within documented numerical tolerance |
| Latency | Proposed p95 model inference ≤100 ms at chosen resolution; separately report end-to-end latency and effective FPS |
| Provenance/export | Every record reloads and validates; incomplete tests retain null result and reason |
| Offline behavior | Full scoring/export with network disabled; inspect traffic rather than infer privacy from UI |
| Rehearsal | Three consecutive end-to-end runs without intervention beyond documented workflow |

Reference method: two independent annotators use the same protocol and synchronized video; adjudicate differences. Store count agreement, signed/absolute timing error, all-attempt completion/failure rate and QC false accept/reject counts. Small demonstration sets do not support clinical validity or subgroup equivalence. Later validation includes body types, skin tones, clothing, lighting, sites, movement speeds and clinically relevant impairments.

Benchmark after warm-up and report warm-up separately. Log model/backend, thread count, power mode, input resolution, number of frames, median/p95 inference, preprocessing, capture-to-result latency, peak memory and frame drops. NPU claims require delegation/profiler evidence. Report power only if directly measured with an appropriate method.

## Ownership and fallbacks

| Role | Deliverable |
|---|---|
| Runtime engineer (unassigned) | Model export, device execution, backend evidence and benchmark |
| Capture/UI engineer (unassigned) | Camera adapters, timestamps, dashboard and offline operation |
| Clinical/measurement lead (unassigned) | Protocol, annotation, QC policy and evidence boundaries |
| Data/product lead (unassigned) | Schema, export, synthetic imports, buyer story and demo |

One person may hold multiple roles. Assign named owners before implementation.

Fallback order: Astra 2 → standard webcam → consented prerecorded video, preserving genuine local inference. NPU → verified CPU. Depth features → RGB count/time. Complex dashboard → local result and export. A prerecorded demo video is proof only of what it actually records; label it as recorded, and distinguish it from processing a prerecorded input through the live runtime. If `.pte` execution fails, do not claim the minimum demo succeeded.

Known limitations: model licensing/selection and hardware compatibility unresolved; thresholds uncalibrated; no clinical validation; no MotionVitals benchmark; no raw-video-free reference validation workflow established; no production security or audit system implemented.
