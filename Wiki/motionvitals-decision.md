# MotionVitals package and SecondHands: decisions

**Status:** opened on 2026-10-17 evening. Szvier added the planning package under [`Wiki/MotionVitals AI/`](MotionVitals%20AI/00_START_HERE.md) in pull request #30: a supervised Five-Times Sit-to-Stand (5xSTS) assessment scored by a camera and a local ExecuTorch model, positioned as an exploratory functional endpoint for pharmaceutical trials, with cancer cachexia as the clinical story. The package states that nothing in it is implemented. This page records how it relates to the current build, what is adopted without a vote, and the seven decisions put to the team. The vote runs in [GitHub issue #33](https://github.com/SecondHands-AI/SecondHands/issues/33); the [decision board](https://secondhands-ai.github.io/SecondHands/decisions.html) presents the same material. Until the votes are in, the recommendations below are the working assumption.

## Relation to the current build

The package describes the same engine as [the tech stack](design/tech-stack.md): frames, a local ExecuTorch pose model, event detection, deterministic counting and timing, quality control, review, and export. Its measurement advice (hip vertical displacement normalized to body scale, with knee and hip angles, hysteresis, and dwell time) is the signal adopted in [brief D1](design/implementation-briefs.md#d1--analysis-angles-rep-counter-scorers) after the frontal-camera finding. Its four workstreams map onto Workstreams C, D, E and F, and G and H of [the plan](plan.md). It assumes an Astra 2 camera and proposes ViTPose-S as a feasibility model; both are differences of detail, not of architecture. Two files it references, the ten-slide pitch (04) and the commercialization roadmap (05), are not in the upload, and the organiser demo video it mentions was not reviewed.

## Adopted without a vote

- Sit-to-stand protocol precision: cue-to-fifth-stand timing, event time at the first qualifying frame, the timer never pauses on tracking loss, explicit INCOMPLETE, INTERRUPTED, and INVALID outcomes with a null time and a reason, every attempt preserved. Owner: briefs D1 and D2 and the protocol JSON.
- A deliberate tracking-obstruction demonstration that flags the attempt and withholds the time. Owner: Workstream H.
- The evidence bar: three consecutive end-to-end runs, ten held-out clips with independent annotation, exact counts and completion time within 0.5 seconds, p50 and p95 latency with warm-up and sample counts, and an assessment plus export with networking disabled. Owner: Workstream G acceptance.
- The versioned assessment record (schema version, attempt lineage, QC status, source labels, model hash, backend, software version). Owner: brief E1.
- The claim controls from the package's regulatory review as the rule for presentation wording.

Two cautions from the same reading: the package's ROI model returns a negative return at its default inputs and should stay out of the pitch unless the inputs are defended, and the synthetic biomarker context is easy to misread as evidence.

## Questions

Each question follows [the Wiki question conventions](AGENTS.md#questions). Options are listed with the current recommendation first. Record the team's answer under each question when the vote closes, then check [SH-T-069](plan.md#workstream-i--documentation-and-pages).

### SH-Q-007 — Positioning for the pitch

**Context.** The package sells to sponsors and contract research organizations; [the use-case page](use-cases.md) spans clinic, rehabilitation, home, and field settings. The five-minute pitch needs one story. Use case and impact carries 40 of 100 points ([criteria](hackathon/judging-criteria.md#scoring)).

- **C, recommended: one engine, first product is the trial endpoint.** Lead with the MotionVitals demonstration and close with the platform reach. Example: slides 1 to 4 are the supervised 5xSTS, slide 5 is phones and low-cost reach.
- **A: trial endpoint only.** Example: the reach slide is dropped for a buyer slide.
- **B: broad clinical platform.** Example: the demo is framed as home rehabilitation follow-up.

Criteria: a specific user with a specific problem, demo credibility within the time, and consistency with the documents already written.

### SH-Q-008 — Primary protocol for the demonstration

**Context.** The counter supports both stop rules; the demo rehearses one. Files: [use-case protocol template](use-cases.md#protocol-template), [brief D2](design/implementation-briefs.md#d2--protocol-schema-and-loader).

- **A, recommended: 5xSTS, cue to fifth stand.** One number, timed against a stopwatch, clear failure cases.
- **B: CS-30, stands in 30 seconds.** Count-based; a repetition near the end is ambiguous.
- **C: both, 5xSTS primary.** A second protocol file and a second rehearsal.

Criteria: what the clinicians can validate against a reference instrument tonight, and rehearsal time.

### SH-Q-009 — Pose model

**Context.** YOLO11n-pose runs through ExecuTorch on the CPU ([observation](experiments-before-saturday.md#yolo-pose-executorch-export-observation)); RTMPose is in conversion with the Qualcomm engineer ([candidates](references/models/pose-candidates.md)). The package proposes ViTPose-S as a spike.

- **A, recommended: keep YOLO11n-pose on the CPU and RTMPose on the NPU.**
- **B: switch to ViTPose-S.** Heavier, unverified export, no NPU evidence.

Criteria: verified execution on the laptop before Sunday afternoon.

### SH-Q-010 — The participant-facing Home view

**Context.** The package wants supervised site use first and treats home use as needing separate evidence. The [Companion](https://secondhands-ai.github.io/SecondHands/companion.html) and [live](https://secondhands-ai.github.io/SecondHands/live.html) pages have a Home view for the person exercising.

- **C, recommended: keep it, labelled as the participant screen in a supervised session.**
- **A: keep it as built.**
- **B: drop it this weekend; coordinator view only.**

Criteria: accessibility story versus the risk of implying unsupervised home use.

### SH-Q-011 — Evidence bar for the demonstration

**Context.** On-device efficiency carries 15 points and documentation 10. The package's definition of success is stricter than [Workstream G](plan.md#workstream-g--data-validation-and-benchmarks).

- **A, recommended: adopt the package's definition of success.**
- **B: keep the lighter current plan.**

Criteria: what can be collected on the laptop by Sunday midday.

### SH-Q-012 — Name on the submission

**Context.** The repository and organization are SecondHands; the package is MotionVitals AI.

- **C, recommended: SecondHands, with MotionVitals as the trial-endpoint product.**
- **A: MotionVitals AI.**
- **B: SecondHands.**

Criteria: no renaming work tonight, one name on the demo screen.

### SH-Q-013 — Synthetic biomarker and longitudinal context

**Context.** The package includes a synthetic trial profile with GDF-15 values and an explicitly missing visit, and says to keep it brief and after the demo.

- **B, recommended: omit this weekend.** Baseline-versus-latest from our own sessions is the context.
- **A: one labelled backup slide after the demo.**

Criteria: every pitch minute shows something that ran; synthetic data invites the wrong question.
