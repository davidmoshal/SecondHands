# MotionVitals AI — Product and business case

17 October 2026 · Proposed research product · Sources indexed in [06_SOURCES.md](06_SOURCES.md).

## Product thesis

MotionVitals would help pharmaceutical sponsors collect standardized physical-function observations and preserve their measurement context. Begin with supervised 5xSTS, using camera input and local AI to assist scoring, followed by human review and structured export. Sell a dependable assessment workflow, with evidence for its intended use, rather than an isolated pose model.

Biological effects, symptoms and functional performance answer different questions. The clinical examples in document 02 support collecting complementary evidence; they do not prove demand for this product or that 5xSTS is the right endpoint for every cachexia trial. Sponsors must choose measures appropriate to the treatment hypothesis and patient population.

## Problem to validate with buyers

| Potential problem | Current evidence status | Discovery or pilot measurement |
|---|---|---|
| Staff time for setup, timing, scoring and transcription | Manual reference workflows exist; MotionVitals savings unmeasured | Observe full workflow, not just stopwatch time |
| Inconsistent instructions, equipment or scoring | Plausible site-level risk; prevalence in target studies unknown | Protocol-deviation and inter-rater review |
| Missing or unusable assessments | Demonstrated in published automated work; product-specific rate unknown | Count all attempted assessments and reasons for failure |
| Disconnected functional and biomarker data | Integration need is plausible; incumbent vendors already address it | Interview data managers; inspect authorized synthetic transfer specification |
| Limited assessment outside sites | Future opportunity, with added safety and usability risks | Separate supervised feasibility from home-use research |

Automation cannot remove participant effort, supervision, protocol design or investigator responsibility. It may shift work into setup, troubleshooting and review. A credible pilot measures those costs too.

## Product boundary

**Direct outputs:** candidate repetition count, elapsed 5xSTS time, event timestamps if reliable, measurement quality flags, processing status and provenance. Established assessment concepts do not make the new automated implementation validated. Rise/descent timing and consistency metrics remain exploratory.

**Imported context:** laboratory GDF-15, body composition from the source modality, patient-reported scores and authorized clinical outcomes. MotionVitals does not measure laboratory analytes, muscle mass, treatment efficacy or diagnosis. Preserve instrument, unit, collection time and source for each imported value.

**Future modules:** 30-second chair stand, TUG, gait speed, SPPB and selected disease-specific motor tasks, each with its own protocol and evidence requirements. Do not interpret a single 5xSTS result as an SPPB score.

## Application A: pharmaceutical trials

A Phase II sponsor studying a muscle-function hypothesis selects a suitable population and prespecifies the functional assessment as exploratory. A trained site coordinator screens readiness under the protocol, standardizes chair and camera setup, confirms participant and visit identifiers, and supervises testing. MotionVitals proposes a score and quality status. The reviewer confirms acceptability or records an exception without overwriting original outputs. Controlled exports enter the sponsor’s clinical data pipeline.

Data management joins records by study, pseudonymous participant and visit; actual collection dates remain available. Authorized statisticians can assess change from baseline alongside laboratory, imaging and PRO outcomes. Treatment allocation is joined only within authorized analysis roles after the relevant blinding rules permit it. A visually improving individual trajectory is neither causal evidence nor a treatment-effect estimate. The analysis plan must handle missingness, intercurrent events and multiplicity.

Initial therapeutic exploration: cancer cachexia, followed by sarcopenia or geriatric oncology if feasibility and buyer demand support expansion. Neuromuscular populations require disease-specific suitability review; inability to complete the task may create floor effects and informative missingness.

## Application B: future clinical practice

| Setting | Administration and review | Documentation and purchaser | Evidence needed |
|---|---|---|---|
| Geriatric oncology | Trained nurse/assistant administers; oncology clinician reviews in context | Visit note or later EHR integration; clinic/service line buyer | Feasibility in treatment visits, interpretable change, workflow benefit |
| Rehabilitation | Therapist or trained assistant supervises; therapist interprets | Assessment report and rehabilitation record; practice owner/health system | Agreement, responsiveness, effect on documentation burden |
| Geriatric/mobility service | Trained staff under local safety protocol; responsible clinician reviews | Longitudinal report; department buyer | Accessible operation, failure rates and useful follow-up decisions |

Proposed planning allowance: a stable protocol-specified chair, unobstructed full-body view, space for a supervising staff member and roughly 2–3 m camera separation, subject to actual field-of-view testing. These are setup assumptions, not validated space requirements. Allocate 5–10 minutes for identity, setup, instructions, readiness, testing and review as an initial scheduling assumption; measure actual time and fatigue. Do not prescribe repeated attempts merely to obtain a usable score.

Training covers the exact test protocol, camera alignment, assistance rules, stop criteria, quality review and record correction. Clinicians retain interpretation and safety responsibility. There is no verified MotionVitals-specific reimbursement pathway in this package. Initial purchases would need an operational or research budget; any billing proposal requires separate coding and payer review.

## Buyer and procurement

Primary economic buyer: the sponsor’s clinical-development or clinical-operations budget owner. Scientific champion: endpoint/COA lead or therapeutic-area clinician. CROs may deploy or subcontract the tool; digital endpoint providers may be channel partners. Gatekeepers include procurement, information security, privacy, quality assurance, data management and biostatistics.

Proposed process: discovery → defined context of use → technical/scientific diligence → scoped paid feasibility work → acceptance against agreed metrics → study contract and data-transfer specification → trained deployment → monitored delivery and closeout. Enterprise expansion follows repeatable delivery. No purchase commitments are assumed.

## Commercial offering and economics

Start with study licensing plus explicitly scoped deployment, validation and support services. Alternatives include site fees or per-assessment fees. Per-assessment contracts should define whether failed, repeated or rejected attempts are billable. Enterprise licenses become credible only after repeated sponsor use. Avoid unlimited bespoke integration hidden in a low software fee.

Cost drivers include site hardware, replacements, training, support, quality review, secure data handling, integration, software maintenance and validation after changes. The adjustable model in document 05 deliberately includes a loss-making illustrative scenario. There are no market prices, market-size estimates or revenue forecasts here.

Plausible near-term value: automated record creation and consistent application of fixed scoring rules. Empirical claims requiring pilots: reduced labor, fewer repeat assessments, acceptable agreement, lower total cost and faster data availability. Longer-term hypotheses: better development decisions or more useful endpoints. Do not monetize avoided failed trials in the base ROI case.

## Competitive landscape

Public-source desk review; vendor descriptions are not independent verification. “Unknown” means not established by the reviewed material, not absent from the product.

| Comparator | Assessment and hardware | Validation / trial experience | Workflow and deployment | Privacy, auditability and commercial diligence |
|---|---|---|---|---|
| Koneksa | Multimodal digital measures; apps/wearables and conventional data | Markets clinical-study evidence generation; measure-specific evidence must be reviewed | Analysis and export pipelines already overlap with our integration thesis | Enterprise service/platform offering; exact local/cloud flow, audit controls and prices require diligence [S10] |
| Clario | Opal wearable motion assessment; active and passive approaches | Trial-focused offerings and publication library; no blanket transfer of validity to every endpoint | Broad endpoint services and hybrid-trial integration | Evaluate sensor provisioning, source retention, audit trail and contracts; public prices not verified [S11] |
| OneStep | Smartphone-based gait/mobility; phone sensors rather than a dedicated camera station | Product makes clinical claims; target-population performance and trial references need separate assessment | App, organization-level views and integration options | Local/cloud partition, trial audit controls and pricing not established here [S12] |
| Ameya research application | LiDAR-enabled iOS markerless physical assessments | Direct published validation summarized in document 02 | Supervised clinical study; commercial availability and enterprise integration not established | Public study does not establish commercial security architecture or pricing [S4] |
| ActiGraph | LEAP multisensor wearable; activity and other research measures | Research and trial offering; relevance depends on selected measure | Continuous monitoring differs from a short supervised task | Assess wearing burden, data flow, analysis services and contracts [S13] |
| Manual standardized assessment | Chair, timer and trained assessor | Established clinical approach when protocol and context are appropriate | Familiar, low hardware burden; documentation may already be electronic | Important economic comparator; cannot assume automation is cheaper |

## Differentiation hypotheses and falsification

| Hypothesis | Why it might matter | What would disprove it |
|---|---|---|
| Lower total deployment cost | Reuse existing computers/cameras | Hardware, support and review exceed saved labor |
| Reliable offline inference | Sites can operate without network-dependent scoring | Runtime fragility or unacceptable failure under real conditions |
| Trial-specific workflows | Protocol locks, provenance and controlled exports | Incumbents provide equivalent capabilities more conveniently |
| Local video processing | Less video transmission and centralized storage | Existing solutions already offer it; buyer sees little incremental value |
| Measurement QC | Avoid silently accepting unreliable scores | QC misses failures or rejects too many valid assessments |
| Multimodal evidence view | Easier review across measurement domains | Sponsor platforms already solve the problem; integration adds duplication |

The most defensible potential advantage is the combination of a validated workflow, reliable operation, service quality and deployable economics for a narrow use case. None is established today. Chair-stand counting and gait measurement are not new inventions. Model accuracy alone is unlikely to be a durable commercial advantage.

## Immediate discovery plan

Proposed, not completed: interview five sponsor/CRO stakeholders and three site assessors, then observe an authorized mock workflow. Ask who owns the budget, which data failures matter, what integration is required, what existing vendor is used and what acceptance evidence would justify a purchase. Use these interviews to define a pilot rather than infer a market size from disease prevalence.
