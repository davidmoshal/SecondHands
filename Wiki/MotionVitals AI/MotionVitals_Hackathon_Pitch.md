---
marp: true
theme: default
size: 16:9
paginate: true
style: |
  section { background: #f7fafc; color: #10283f; font-family: Arial, sans-serif; padding: 56px 64px; }
  h1 { color: #10283f; font-size: 44px; }
  h2 { color: #087e8b; font-size: 30px; }
  p, li { font-size: 25px; line-height: 1.35; }
  strong { color: #087e8b; }
  footer { font-size: 13px; color: #506274; }
  table { font-size: 22px; }
  th { background: #e5f3f3; }
footer: 'MotionVitals AI | Proposed research product | 17 October 2026'
---

# MotionVitals AI
## Turning Physical Function into Clinical Evidence

**Movement → Measurement → Evidence**

A proposed local measurement workflow for pharmaceutical trials.

Experimental measurements. Clinical validation still required.

<!--
SLIDE 1 — Opening
We are building a way to document what patients can do using standardized movement assessments. Our first application is pharmaceutical research, starting with five chair rises. Distinguish the product vision from demonstrated capabilities throughout. No working prototype is claimed by this planning deck.
-->

---

# A biological change is only part of the story

Clinical development needs evidence of how patients function.

| Biology | Symptoms | Physical function |
|---|---|---|
| What changed biologically? | How does the patient feel? | What can the patient do? |

**Complementary questions. Complementary evidence.**

<!--
SLIDE 2 — Problem
A biological signal and a performance result answer different questions. Endpoint choice must match the treatment hypothesis and population. We propose helping collect the functional component alongside existing evidence.
Sources S1: https://pubmed.ncbi.nlm.nih.gov/26906526/
S3: https://www.nejm.org/doi/10.1056/NEJMoa2409515
-->

---
<!-- footer: 'Sources: Temel et al. 2016; EMA Adlumiz; Groarke et al. 2024 | Different studies, not a head-to-head comparison' -->

# Why complementary outcomes matter

## Anamorelin
Lean-mass improvement did not establish handgrip benefit.

## Ponsegromab
Weight, symptoms and digital activity assessed together.

**Neither study validates MotionVitals.**

<!--
SLIDE 3 — Evidence
EMA also identified inadequate safety-data recording in its anamorelin refusal. Do not imply that a different functional measure would have changed that outcome. The ponsegromab study illustrates multiple evidence domains; do not imply every secondary endpoint improved or that activity monitoring is equivalent to 5xSTS.
S1 https://pubmed.ncbi.nlm.nih.gov/26906526/
S2 https://www.ema.europa.eu/en/medicines/human/EPAR/adlumiz
S3 https://www.nejm.org/doi/10.1056/NEJMoa2409515
-->

---
<!-- footer: 'Comparators: Bertrand et al. 2026; Koneksa; Clario; OneStep; ActiGraph | Workflow benefits remain hypotheses' -->

# Automate the workflow. Prove the value.

**Setup → Standardize → Score → Review → Document**

- Keep supervision and review in the workflow.
- Measure staff effort and unusable assessments.
- Test whether automation improves the full process.

Camera-based physical assessment already exists.

<!--
SLIDE 4 — Existing approaches
Chair-stand counting is not the invention. MotionVitals must earn differentiation through reliable operation, quality controls and an economical trial workflow. No superiority over manual assessment or competitors is demonstrated.
S4 https://journals.plos.org/digitalhealth/article?id=10.1371/journal.pdig.0001172
S10 https://www.koneksahealth.com/
S11 https://clario.com/solutions/precision-motion/
S12 https://www.onestep.co/product
S13 https://blog.theactigraph.com/blog/leap-faq
-->

---
<!-- footer: 'MotionVitals AI | Proposed architecture | Experimental measurements' -->

# One task. A traceable result.
## Supervised Five-Times Sit-to-Stand

**Camera → Local inference → Count + time**

**Quality review → Versioned record → Export**

The model estimates movement.
The protocol defines scoring.
The reviewer assesses acceptability.

<!--
SLIDE 5 — Architecture
Sensitive video processing is intended to stay on the device. This architecture does not itself establish HIPAA compliance. Inference produces pose or movement estimates; deterministic rules count and time the standardized task. QC should prevent unusable data from becoming confident-looking results. Full design: 03_TECHNICAL_SPECIFICATIONS.md.
-->

---

# Demonstration: chair rise to record

## Start → Five rises → Review → Export

**STORYBOARD — application capture not yet available**

Show the actual count, time, quality status and exported record.

Label the input: live camera or prerecorded video.
Label the output: actual measurement or synthetic example.

<!--
SLIDE 6 — Demonstration placeholder
Replace this storyboard with an actual capture only after the prototype works. State whether the demonstration is live camera capture, live processing of prerecorded input, or a recorded prototype run. Open the exported record. If no runtime execution is available, explicitly state that this is the intended workflow and the minimum demo is not yet demonstrated.
Organizer recording IMG_4572.mov has not been reviewed because local media tools are blocked. The two-minute run-of-show in 04_HACKATHON_PITCH.md is a proposed rehearsal length, not an organizer rule.
-->

---
<!-- footer: 'ExecuTorch and Orbbec official documentation | Target-device compatibility still requires verification' -->

# Show the compute, not just the logo
## Snapdragon X Elite + ExecuTorch

| Required proof | Current status |
|---|---|
| `.pte` execution, model hash, backend | Not yet demonstrated |
| Inference and end-to-end latency | Not yet measured |
| Memory, frame drops, offline operation | Not yet measured |

**CPU execution ≠ verified NPU acceleration.**

<!--
SLIDE 7 — Technical credibility
The deployed neural model must run through ExecuTorch and drive the measurement; a token example is insufficient. Show logs on the actual Snapdragon device. Do not imply generic Windows support establishes Windows ARM64 compatibility. Use actual profiler/delegation evidence for an NPU claim. A successful CPU fallback is acceptable under the brief but must be labeled.
S17 https://docs.pytorch.org/executorch/stable/platforms-desktop.html
S18 https://github.com/pytorch/executorch/blob/main/docs/source/using-executorch-building-from-source.md
S19 https://docs.pytorch.org/executorch/stable/backends-overview.html
S20 https://github.com/orbbec/OrbbecSDK
-->

---
<!-- footer: 'MotionVitals AI | Synthetic trial demonstration | Imported biomarkers are not measured by the camera' -->

# Function in the context of the trial

**Functional observations**
+ imported laboratory data
+ imported body composition
+ imported patient-reported outcomes

→ Authorized longitudinal review

**Synthetic examples are not patient data or efficacy evidence.**

<!--
SLIDE 8 — Trial use
Use separate timelines, units and source badges. Join by study, participant and visit while retaining actual collection time. MotionVitals does not measure GDF-15 or muscle mass. A demonstration participant’s real test should not be relabeled as follow-up for a real patient. Treatment assignments remain within authorized analysis roles and blinding rules. An individual trend is not a causal treatment-effect estimate.
-->

---
<!-- footer: 'Business hypothesis | No verified prices, market-size estimates, savings or customer commitments' -->

# A focused B2B entry point

**Buyer:** pharmaceutical sponsor or CRO

**First offering:** scoped feasibility pilot

**Model:** study license + deployment + validation/support

Prove usable data, workflow benefit and total cost.

<!--
SLIDE 9 — Commercial model
The economic buyer owns a study budget. Agree acceptance criteria before a pilot. The adjustable ROI in 05_COMMERCIALIZATION_ROADMAP.md uses hypothetical inputs and shows negative savings at its default small-study volume. Dedicated deployment is not automatically economical. Avoid invented prices, TAM or monetized trial-success claims. A design partner is sought, not already secured.
-->

---
<!-- footer: 'Evidence path informed by FDA DDM/COA/DHT guidance and EMA qualification precedent | No MotionVitals qualification claimed' -->

# Earn the right to scale

Feasibility → Validation → Clinical feasibility
→ Exploratory trial → Disease-specific modules
→ Potential clinical-practice expansion

**Seeking a clinical measurement partner and a sponsor/CRO design partner.**

“Because treatment success isn't just what changes in the laboratory. It's what patients can actually do.”

<!--
SLIDE 10 — Roadmap and ask
The next milestone is a reviewable measurement workflow and an agreed validation plan. Expansion is conditional on evidence, economic value and the relevant regulatory/system requirements. The closing statement expresses the mission, not that one performance test establishes drug efficacy.
S5 https://www.fda.gov/media/194348/download
S6 https://www.fda.gov/regulatory-information/search-fda-guidance-documents/patient-focused-drug-development-selecting-developing-or-modifying-fit-purpose-clinical-outcome
S7 https://www.fda.gov/regulatory-information/search-fda-guidance-documents/digital-health-technologies-remote-data-acquisition-clinical-investigations
S8 https://www.ema.europa.eu/en/documents/scientific-guideline/qualification-opinion-stride-velocity-95th-centile-primary-endpoint-studies-ambulatory-duchenne-muscular-dystrophy-studies_en.pdf
S9 https://www.fda.gov/regulatory-information/search-fda-guidance-documents/electronic-systems-electronic-records-and-electronic-signatures-clinical-investigations-questions
-->
