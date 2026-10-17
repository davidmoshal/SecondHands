# Commercialization roadmap and business economics

17 October 2026. Proposed work and assumptions; no forecast of clinical success, revenue or regulatory acceptance.

## Entry strategy

Start with a sponsor/CRO design partner and one supervised, exploratory assessment use case. Cancer cachexia provides the initial scientific narrative; confirm that the target study population can perform 5xSTS and that the sponsor values this outcome. Sell scoped feasibility and evidence development before promising a validated endpoint platform. A digital endpoint provider could be a partner rather than a competitor.

Do not estimate an addressable market from all oncology patients. Build a bottom-up opportunity map from identifiable studies, relevant endpoint plans, procurement authority and willingness to fund a pilot. Keep prospective relationships separate from signed contracts.

## Stage gates

| Stage | Required evidence and workstreams | Potential partner, not committed | Key risk | Success gate and commercial milestone |
|---|---|---|---|---|
| 1. Prototype / feasibility | Actual `.pte` on target; protocol; camera, QC and export; reproducible demo | Hackathon mentors, runtime and camera engineers | OS/driver incompatibility; unreliable measurement | Repeatable full workflow with honest benchmark; design-partner conversations |
| 2. Analytical validation | Locked model; independent reference; agreement, reliability and failure analysis; usability | Measurement lab, physiotherapy/COA scientists, biostatistician | Biased evaluation, unacceptable error, poor subgroup performance | Prespecified criteria met on held-out data; paid validation engagement if buyer interest exists |
| 3. Prospective clinical feasibility | Ethics/consent, target-population protocol, safety, burden, missingness and clinical relevance | Oncology/cachexia research group and patient advisors | Inability to perform task; fatigue; informative missingness | Feasible collection and interpretable outcomes; sponsor-ready evidence dossier |
| 4. Exploratory pharmaceutical trial | Controlled system, training, data transfer, prespecified analysis, change control, monitoring | Sponsor/CRO with a relevant Phase II program | Procurement delay, integration burden, protocol deviations | Contracted exploratory deployment; reconciled data and study closeout |
| 5. Disease-specific modules | Responsiveness, meaningful change, external replication, regulatory engagement as appropriate | Disease consortium, academic sites and sponsors | Disease/context differences; evidence insufficient for intended claim | Fit-for-purpose module with explicit use boundaries; repeat study licenses |
| 6. Clinical-practice expansion | Intended-use/device assessment, clinical utility, workflow economics, EHR integration, reimbursement review | Geriatric oncology or rehabilitation network | No purchase rationale, added workload, unsupported clinical claims | Demonstrated clinical workflow value and sustainable buyer budget |

Stages may overlap operationally, but later claims cannot precede their evidence. No calendar duration or investment requirement is asserted. Budget each stage only after protocol, sites, staffing, device strategy and acceptance criteria are agreed. A failed gate can mean revising the task or stopping that market approach.

## Adjustable ROI model

Use `roi_model.py` with `roi_inputs.json` to recalculate. All defaults are illustrative assumptions, not quotes, market prices, measured staff times or observed failure rates. Currency is USD. Compare the same scheduled assessment opportunities and include setup, supervision, scoring and documentation in staff minutes.

| Input | Symbol | Assumed default |
|---|---|---:|
| Participants | P | 200 |
| Visits per participant | V | 4 |
| Sites | S | 10 |
| Conventional staff minutes/attempt | mC | 12 |
| Automated staff minutes/attempt | mM | 8 |
| Loaded staff cost/hour | W | 60 |
| Conventional repeat-trigger rate | rC | 0.10 |
| Automated repeat-trigger rate | rM | 0.05 |
| Incremental hardware/site | H | 1,000 |
| Study software fee | L | 5,000 |
| Deployment/training/site | D | 500 |
| Study validation/support | Q | 3,000 |

Simplifying repeat assumption: at most one additional attempt per scheduled visit. Expected attempts = scheduled visits × (1 + repeat-trigger rate). This is a cost model, not an assumption that all repeats succeed. If repeats can recur, use a justified alternative; if participants cannot safely repeat, do not model automatic repeats. Count final usable-record yield separately. Conventional hardware is assumed already available; adjust both arms for incremental conventional costs when appropriate.

```text
N = P × V
Conventional labor = N × (1 + rC) × mC × W / 60
Automated labor = N × (1 + rM) × mM × W / 60
Incremental fixed cost F = S × (H + D) + L + Q
Conventional total = conventional labor
MotionVitals total = automated labor + F
Savings = conventional total − MotionVitals total
ROI = savings / MotionVitals total
Per-scheduled-assessment labor saving d = ((1+rC)mC − (1+rM)mM)W/60
Break-even N = F/d, only if d > 0, with sites/fixed costs held constant
Break-even licensing ceiling = conventional labor − automated labor − S(H+D) − Q
```

With the defaults: N = 800; conventional total = **$10,560**; automated labor = **$6,720**; fixed cost = **$23,000**; MotionVitals total = **$29,720**; savings = **−$19,160**; ROI ≈ **−64.47%**. Labor saving is $4.80 per scheduled assessment, so break-even requires **4,792** scheduled assessments at unchanged fixed costs and sites. That would be 1,198 participants at four visits. More sites or support at scale would change this threshold.

The default licensing ceiling is **−$14,160**: even zero software fees would not produce cost parity under these assumptions. This demonstrates why a small study may not justify dedicated hardware and deployment on labor savings alone. Better data quality might still matter, but its value must be demonstrated and cannot simply be added as invented avoided-development costs.

| Illustrative sensitivity | Conventional cost | MotionVitals cost | Savings |
|---|---:|---:|---:|
| Base assumptions | $10,560 | $29,720 | −$19,160 |
| Reuse hardware (H=0) | $10,560 | $19,720 | −$9,160 |
| 5,000 scheduled assessments, same ten sites/fixed costs | $66,000 | $65,000 | $1,000 |
| No staff-time advantage (mM=12), base volume | $10,560 | $33,080 | −$22,520 |

The high-volume case excludes incremental support beyond the assumed fixed amount and is not a scale forecast. The model excludes participant travel, space, taxes, financing, integration beyond Q and downstream trial decisions. Add them symmetrically where relevant. Compare cost per usable record after measuring terminal failure rates; a cheaper unusable record has no economic advantage.

## Pilot economic evaluation

Time setup, supervision, scoring, transcription, review and troubleshooting separately. Capture initial failures, repeats, terminal failures and reasons. Record hardware provisioning, support tickets, training hours and integration work. Use the same protocol and comparable populations in both workflows; account for learning effects and site clustering. Report confidence intervals and variation across sites, not only average minutes.

Purchase criteria should combine acceptable measurement error, usable-record yield, workflow burden, integration fit and all-in cost. Agree criteria with the buyer before the pilot. Stop or redesign if reliability requires disproportionate review or if the target population cannot complete the task.

## Commercial milestones and risks

Near term: documented buyer pain, a credible prototype, an agreed validation protocol and a scoped paid pilot. Medium term: successful deployment, evidence dossier, reusable integrations and a second independent sponsor. Long term: disease-specific modules and optional practice-market expansion. These are proposed milestones, not forecasts.

Risks requiring explicit owners: runtime/camera feasibility (engineering); endpoint suitability and validity (clinical lead); security and computerized-system controls (quality/security); licensing rights (product/legal); procurement and support economics (commercial lead). Maintain a change-impact assessment: a camera, model or scoring update can require renewed verification or validation.
