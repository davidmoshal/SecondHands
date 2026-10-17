---
marp: true
theme: default
size: 16:9
paginate: true
style: |
  section { background: #f7fafc; color: #10283f; font-family: Arial, sans-serif; padding: 56px 64px; }
  h1 { font-size: 42px; }
  h2 { color: #087e8b; font-size: 30px; }
  p, li { font-size: 25px; line-height: 1.35; }
  strong { color: #087e8b; }
  footer { font-size: 13px; color: #506274; }
footer: 'MotionVitals AI | Build target; demonstration evidence pending'
---

# MotionVitals AI
## Physical-function measurements people can inspect

A supervised chair-rise assessment.
Local processing. Visible movement events. Quality checks.

**For research teams collecting functional observations across visits.**

<!--
1 — PROBLEM. Keep this short and move to the application.
“Research teams need to know what happened during an assessment, not just receive a final number. MotionVitals turns a supervised chair-rise test into a locally processed, reviewable functional measurement.”
Cancer cachexia motivates the trial use case; do not imply the volunteer demo validates use in that population. Clinical evidence and competitor references remain in 02_CLINICAL_EVIDENCE_AND_REGULATORY.md and 06_SOURCES.md.
Everything here is a build target until verified. The deck contains no actual performance results.
-->

---

# Watch the measurement happen

**Movement overlay + confirmed stand events + count + timer**

Start seated → five confirmed full stands → review

**DEMO SLOT — actual application capture pending**

Show the input source and actual processing backend.

<!--
2 — LIVE ASSESSMENT.
Switch to the application. Identify live camera, live inference on recorded input, or recording of a prior run. Show that overlay/event outputs come from the model used by scoring. Explain the start cue and fifth-stand endpoint, then let the measurement run.
Do not fill this slot with a mockup presented as a working product. If execution is not ready, say so. Keep model and runtime logs available to substantiate genuine .pte execution.
-->

---

# A result—and a reason to trust or reject it

**Inspect:** count, time, event timestamps, quality flags and versions.

**Export:** the same result as a structured record.

**Challenge:** obscure tracking → flag the attempt → withhold an unreliable completion time.

<!--
3 — REVIEW AND FAILURE.
Open the actual exported record from the successful attempt. Then show a deliberate obstruction using recorded input or a stationary volunteer. The system must visibly mark tracking loss; it must not carry stale pose forward as current or manufacture a completion time. Preserve the unsuccessful attempt.
This is a required part of the main demo. It demonstrates the implemented failure behavior, not proof that all failures are detected or that the measurement is clinically validated. A prerecorded failure case must be labeled.
-->

---

# Show the evidence on the device

- **Execution:** Snapdragon device, `.pte`, runtime and actual backend.
- **Performance:** measured p50/p95 latency and test conditions.
- **Offline:** assessment and export with networking disabled.
- **Evaluation:** independent reference agreement, all attempts and failures.

**Results pending. No performance values claimed.**

<!--
4 — DEVICE AND EVALUATION EVIDENCE.
Replace the pending statement only when evidence has been collected. Show a compact table with clean test attempts N, usable results n, exact-count agreement, timing error with its denominator, and failure reasons. Identify deliberate fault cases separately. The proposed ten-recording target is an engineering check, not a clinical study.
Report warm-up, timed sample count, resolution and backend alongside latency; distinguish model time from end-to-end time. Show offline-run evidence. Do not claim NPU acceleration without delegation/profiler evidence. CPU fallback eligibility is not confirmed by organizer rules. Logs and actual measurements, not these bullets, constitute proof.
-->

---

# Start with one study workflow

**User:** research coordinator

**Buyer:** pharmaceutical sponsor or CRO

**Next step:** validate measurement and workflow value with a design partner.

One assessment today. Broader clinical applications only with evidence.

<!--
5 — BUYER AND NEXT STEP.
“Our first product hypothesis is a dependable assessment workflow for research teams. We are seeking a clinical measurement partner and a sponsor/CRO design partner to test validity, usability and operational value.”
If time permits, briefly show synthetic historical visits with visible source labels. Optional biomarkers are imported examples, not camera measurements or treatment-effect evidence. Do not claim a committed buyer, savings, regulatory approval or clinical validation.
Detailed clinical rationale, business assumptions and roadmap are in the extended ten-slide deck and supporting documents. Demo duration remains provisional pending organizer instructions.
-->
