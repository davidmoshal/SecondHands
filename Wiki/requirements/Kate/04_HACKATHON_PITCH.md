# Hackathon pitch — content, narrative and delivery

17 October 2026. Ten slides. The editable conversion source is `MotionVitals_Hackathon_Pitch.md`. All capabilities remain proposed until replaced with actual demonstration evidence. No benchmark numbers or real screenshots are available in this package.

## Narrative

MotionVitals is an early-stage product concept for collecting physical-function evidence in pharmaceutical trials. Its immediate demonstration is deliberately narrow: one supervised assessment, executed locally, producing a reviewable record. Scientific credibility comes from appropriate claims and failure handling; commercial credibility comes from a buyer, an evidence plan and honest economics.

## Slide 1 — MotionVitals AI

**On slide:** Turning Physical Function into Clinical Evidence. “A proposed local measurement workflow for pharmaceutical trials.” Small status: “Research prototype concept · experimental measurements.”

**Visual:** restrained wordmark and three connected labels: Movement → Measurement → Evidence. No generic AI brain, drug image or regulatory badge.

**Speaker notes:** “We are building a way to document what patients can do using standardized movement assessments. Our first application is pharmaceutical research, starting with five chair rises. Today we will distinguish the planned product from what our prototype actually demonstrates.”

## Slide 2 — A biological change is only part of the story

**On slide:** “Clinical development needs evidence of how patients function.” Three distinct domains: Biology / Symptoms / Physical function.

**Visual:** three equal columns; no causal arrow implying biomarker change guarantees function.

**Speaker notes:** “A laboratory or body-composition result and a physical-performance result answer different questions. We propose helping sponsors collect the functional component alongside their existing data. The right endpoint still depends on the treatment, population and study design.” Reference S1 and S3 in footer.

## Slide 3 — Why complementary outcomes matter

**On slide:** Anamorelin: “Lean-mass improvement did not establish handgrip benefit.” Ponsegromab: “Weight, symptoms and digital activity assessed together.” Footer: “Different studies; not a head-to-head comparison.”

**Visual:** two study cards, no efficacy ranking or fabricated effect-size chart.

**Speaker notes:** “The anamorelin example must also acknowledge EMA’s safety-data concerns. Ponsegromab illustrates a multidomain assessment strategy. Neither study demonstrates that our camera measurement is valid or that changing an endpoint would change a regulatory decision.” Sources S1–S3, linked in the deck notes.

## Slide 4 — Automate the workflow, then prove the value

**On slide:** Setup → Standardize → Score → Review → Document. “Measure burden and failure before claiming savings.” Small note: “Camera-based assessment already exists.”

**Visual:** five-step workflow; highlight scoring/documentation as intervention points, retain human supervision/review.

**Speaker notes:** “Our hypothesis is that selected automation can improve the collection workflow. That needs testing against existing practice. Published camera systems and established wearable vendors already operate in this space, so chair-stand counting is not our novelty claim.” Sources S4, S10–S13. Potential differentiation is a trial-focused, locally processed and quality-controlled implementation, not a first-ever measurement.

## Slide 5 — One task. A traceable result.

**On slide:** “Supervised 5xSTS.” Capture → Local inference → Count + time → Quality review → Structured export. Footer: “Proposed architecture; not clinically validated.”

**Visual:** clean horizontal architecture diagram; show local device boundary around sensitive processing.

**Speaker notes:** “The model estimates movement. Fixed protocol rules determine counting and timing. We retain quality flags and versions so a result can be interpreted in context. Unusable data should be rejected visibly, not turned into a confident-looking number.”

## Slide 6 — Demonstration: from chair rise to record

**On slide:** Start / Five rises / Review / Export. Reserve a large area for an actual application capture, labeled “Insert verified demo capture.” Until available, display a text storyboard clearly marked as such.

**Speaker notes:** “This is [live camera / live processing of a recorded input / a recording of the prototype—choose the actual mode]. The displayed backend is [actual backend]. We start one assessment, inspect count and time, review the quality result and open the exported record.” If execution is unavailable, say: “This is the intended workflow; the runtime requirement is not yet demonstrated.” Do not narrate an illustrative UI as a completed product.

## Slide 7 — Show the compute, not just the logo

**On slide:** “Snapdragon X Elite + genuine ExecuTorch execution.” Evidence slots: `.pte` hash / runtime + backend / p50, p95 latency / memory + dropped frames / offline test. All slots say “Not yet measured” until verified.

**Visual:** device-bound pipeline, with the neural inference stage highlighted; development/export shown separately in notes.

**Speaker notes:** “ExecuTorch is essential to this demonstration because the deployed model runs through its runtime and drives the measurement. Snapdragon is the target edge-compute device. We only claim the backend we can prove: CPU execution is distinct from NPU acceleration. Our first engineering gate is runtime compatibility on this exact machine.” Sources S17–S20. Do not make an exclusive claim that no other runtime could implement the product.

## Slide 8 — Function in the context of the trial

**On slide:** Camera-derived function + Imported laboratory / body composition / PRO data → Authorized longitudinal review. Large visible “Synthetic demonstration data.”

**Visual:** parallel timelines with separate units and source badges, joining at study/participant/visit. A real measured demonstration result, if added, must keep its own source label and must not be represented as a genuine patient follow-up.

**Speaker notes:** “These accompanying values are synthetic. MotionVitals does not measure GDF-15 or muscle mass. In a real study, authorized data management would join functional records to existing datasets. An individual trend is descriptive; evidence of treatment effect comes from the trial design and prespecified analysis.”

Illustrative profile is provided in `synthetic_trial_profile.json`: 5xSTS 16.0 s at baseline and 14.2 s at week 4, with a missing week-8 result; synthetic laboratory/body-composition values; and an explicitly invented 0–10 self-report scale for display. None is measured or an efficacy claim. A real PRO instrument requires its own selection, interpretation and licensing review.

## Slide 9 — A focused B2B entry point

**On slide:** Buyer: sponsor/CRO. First offering: scoped feasibility pilot. Model: study license + deployment + validation/support. “Prove usable data, workflow benefit and total cost.”

**Visual:** Pilot → Study deployment → Repeat license, each conditional on evidence. No invented TAM or price.

**Speaker notes:** “The economic buyer owns a study budget. We would begin with a defined use case and agreed acceptance criteria. Our illustrative cost model does not assume savings: small studies may not recover deployment costs. A commercial case must be earned through measured workflow value and dependable delivery.” Point to document 05 for adjustable economics.

## Slide 10 — Earn the right to scale

**On slide:** Feasibility → Analytical validation → Clinical feasibility → Exploratory trial → Disease-specific modules → Clinical practice. Ask: “Seeking a clinical measurement partner and a sponsor/CRO design partner.”

**Closing line:** “Because treatment success isn't just what changes in the laboratory. It's what patients can actually do.”

**Speaker notes:** “Our next milestone is a working, reviewable measurement workflow and an agreed validation plan—not a claim of endpoint qualification. We want partners who can help define the relevant population, evidence requirements and operational value.” Sources S5–S9 for the evidence path. The closing line expresses the vision, not a claim that our test alone establishes treatment success.

## Proposed demo run-of-show

The durations below are internal rehearsal assumptions, **not organizer requirements**. The organizer recording `IMG_4572.mov` remains unreviewed because the local media runtime is blocked.

| Segment | Proposed allocation | Evidence to show |
|---|---:|---|
| Problem and user | 15 s | Sponsor/site workflow and exact assessment |
| Environment | 15 s | Device, input source, `.pte`/runtime/backend |
| Assessment | 35 s | Start cue, real model-driven events, completion or explicit failure |
| Results and export | 25 s | Count, time, QC, versions and structured record |
| Trial context | 15 s | Clearly synthetic imported values |
| Limits and next gate | 15 s | Measured results only, known compatibility/validation gaps |

This is a proposed two-minute recording. Replace its length after reviewing organizer instructions. Do not cut away to conceal a failed live result; use an explicitly labeled recording of a successful attempt if needed. Keep a short failure/QC case available for questions. Avoid identifiable bystanders and confidential screen contents.

## Judging strategy

The official Compute Track link is confirmed. At review, its builder guide did not publish detailed criteria, rules or submission deadline. The supplied brief states the first three weights; retain their provenance rather than treating them as independently verified.

| Category | Weight status | Evidence to prepare |
|---|---|---|
| Innovation, product value, UX | 40 points, user brief | Real user and buyer; coherent start-to-export workflow; comparison with existing approaches |
| Technical implementation | 25 points, user brief | Source code, model export, meaningful runtime integration, timestamp/QC logic and reproducibility |
| On-device AI and efficiency | 15 points, user brief | Actual local inference, backend proof, latency/memory/drop metrics, offline behavior |
| Deployment/documentation | Remaining allocation unverified | Setup instructions, version locks, input fallback, known limitations and reproducible command |
| Presentation/demo | Remaining allocation unverified | Clear narrative, recorded working flow, limitations and business rationale |

Do not assign the remaining 20 points between categories without the organizer material. The inaccessible HEIC image has not been used to infer those weights. No claim is made about winning.

## Confirmed submission workflow

The official project form calls for project description, repository and technologies, team information, a saved video demo, then explicit submission for judging. Saving a draft is not submission. This package does not publish a project or submit on the user’s behalf. [S23](https://hackersquad.io/events/executorch-hackathon-compute-track/resources?tab=submission)

The builder guide lists start 17 October 2026 at 17:00 UTC and end 19 October at 02:00 UTC: **17 October, 10:00 a.m. to 18 October, 7:00 p.m. Pacific**. Event end is not a confirmed submission deadline. [S22](https://hackersquad.io/events/executorch-hackathon-compute-track/resources)

## Design and presentation controls

Use 16:9, white or deep-navy background, teal accent, generous margins, editable text and simple diagrams. Limit each slide to one argument. Put short source labels in footers and full links in notes. Preserve status badges: proposed, synthetic, demonstrated and requires validation. Do not use patient photos or fabricated dashboard screenshots. No image asset is needed to explain the architecture.

Before presenting, replace all “not measured” slots only with device logs and actual test evidence, update the demo source badge, verify readable fonts and slide fit, confirm organizer timing, and retain the longer scientific caveats in speaker notes. This Markdown package has been checked as text; a converted PowerPoint still needs rendering and visual inspection.
