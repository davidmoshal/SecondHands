# Clinical evidence and regulatory positioning

17 October 2026. Sources and URLs are in [06_SOURCES.md](06_SOURCES.md). This is a product evidence review, not patient-care guidance. No MotionVitals clinical data exist in this package.

## A. Anamorelin: biological and functional outcomes diverged

ROMANA 1 and 2 were randomized Phase III studies in advanced non-small-cell lung cancer with cachexia (484 and 495 participants). The co-primary outcomes assessed lean body mass and handgrip strength over 12 weeks. Lean body mass improved versus placebo; handgrip strength did not show a significant between-group benefit in either trial. [Temel et al., 2016; S1](https://pubmed.ncbi.nlm.nih.gov/26906526/)

EMA confirmed refusal of Adlumiz in September 2017. Its explanation described a marginal lean-mass effect without proven handgrip or quality-of-life benefit. It also identified inadequate safety-data recording after site inspections, preventing satisfactory risk evaluation. The refusal therefore must not be framed solely as a failed functional endpoint. [EMA; S2](https://www.ema.europa.eu/en/medicines/human/EPAR/adlumiz)

Implication for MotionVitals: collect evidence that addresses the intended patient benefit, with suitable endpoints and trustworthy data. This does not establish that 5xSTS would have succeeded, that handgrip was an inappropriate choice, or that a different measurement could have changed authorization.

## B. Ponsegromab: complementary domains

The 2024 randomized, double-blind Phase II trial enrolled 187 patients with cancer cachexia, serum GDF-15 ≥1,500 pg/mL, and lung, pancreatic or colorectal cancer. Participants received placebo or 100, 200 or 400 mg ponsegromab every four weeks for three doses. The primary endpoint was weight change at week 12; secondary domains included appetite/cachexia symptoms, digitally measured physical activity and safety. Ponsegromab inhibits GDF-15, a circulating cytokine implicated in cachexia. Weight improved across active-dose groups; the 400-mg group showed improvements in symptoms and activity. This was not a trial of MotionVitals or camera-based 5xSTS. [Groarke et al.; S3](https://www.nejm.org/doi/10.1056/NEJMoa2409515)

Activity monitoring reflects behavior in daily life; a supervised performance task reflects capacity under specified conditions. They are complementary, not interchangeable. The public abstract supports the digital-activity domain, but device placement, valid-wear rules, missingness, endpoint-specific estimates and multiplicity handling require the full protocol/supplement before technical replication. No claim is made that every secondary activity or gait outcome improved. The study does not validate 5xSTS in cachexia or establish a commercial requirement for our product.

## C. Published camera validation already exists

Bertrand et al. studied 228 adults with chronic conditions/history of cancer (mean age 61.6; 79% White), using the Ameya iOS app with LiDAR and 34 tracked landmarks at approximately 30 Hz. Assessments included 30-second STS, TUG and SPPB components: 5xSTS, gait speed and three balance tasks. Reported agreement with a certified exercise physiologist included ICCs of 0.995 for 5xSTS, 0.96 for TUG, 0.93 for 30-second STS and 0.87 for gait speed; total SPPB weighted kappa was 0.808. Technical loss was 49/1,576 recordings (3.1%), after nontechnical exclusions. Five 5xSTS recordings missed the fifth repetition. Limitations included occlusion, clothing, timing conventions, demographic representation and supervised-only testing. The reported 5xSTS confidence interval appears inconsistent with its point estimate; do not reuse it without clarification. [Bertrand et al.; S4](https://journals.plos.org/digitalhealth/article?id=10.1371/journal.pdig.0001172)

MotionVitals needs independent evidence on its own model, hardware, population and protocol. Similarity to a published system conveys no inherited validation. Evaluate agreement and failure together; a high correlation or ICC alone does not establish acceptable individual error. Unsupervised use, disease responsiveness and clinically meaningful change remain separate questions.

## D. Measurement taxonomy

| Term | Meaning for this product |
|---|---|
| Digital measurement | A value derived using a digital system; describes collection/derivation, not validity |
| Performance outcome (PerfO) assessment | A standardized task performed by the participant; the proposed 5xSTS implementation is a candidate digitally administered/scored PerfO |
| Biological biomarker | A measured indicator of biological processes; serum GDF-15 is imported laboratory data, not a camera output |
| Exploratory endpoint | A prespecified research use intended to investigate signals; “exploratory” does not eliminate requirements for usable and interpretable data |
| Validated measure | Evidence supports a defined interpretation and use in a population and setting; not a universal label |
| Qualified tool/endpoint | Formal regulatory acceptance within a specified context of use; distinct from product clearance, approval or validation in a single study |

FDA’s August 2026 digitally derived measures paper discusses DDMs as possible COAs, biomarkers or components of multimodal endpoints. It emphasizes meaningful patient outcomes, context of use, verification, validation, usability and sources of error. It is a considerations paper drawing on guidance, not a MotionVitals authorization or an automatic qualification route. [S5](https://www.fda.gov/media/194348/download)

FDA’s final October 2025 COA guidance provides the relevant fit-for-purpose framework. Selecting a familiar task is only the beginning: justify the concept, population, interpretation and change-detection evidence. [S6](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/patient-focused-drug-development-selecting-developing-or-modifying-fit-purpose-clinical-outcome)

FDA’s December 2023 DHT guidance addresses remote acquisition in investigations. MotionVitals should build a fit-for-purpose evidence dossier, usability evaluation, data-management plan and risk controls before any proposed remote deployment. Its existence does not establish that our present supervised prototype meets those expectations. [S7](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/digital-health-technologies-remote-data-acquisition-clinical-investigations)

EMA qualified wearable-derived stride velocity 95th centile for primary-endpoint use in specified ambulatory Duchenne muscular dystrophy studies in 2023. This is a context-specific precedent for evidence development, not a general endorsement of digital endpoints or camera-derived chair-rise scores. [S8](https://www.ema.europa.eu/en/documents/scientific-guideline/qualification-opinion-stride-velocity-95th-centile-primary-endpoint-studies-ambulatory-duchenne-muscular-dystrophy-studies_en.pdf)

## Proposed evidence program

1. **Define intended use:** supervised exploratory 5xSTS in a named population; specify what aspect of functioning the score represents. Interview patients, clinicians and sponsors. Confirm task feasibility and floor/ceiling effects.
2. **Technical verification:** timestamps, sensor/frame integrity, actual runtime execution, deterministic scoring, reproducible software/model versions and controlled exports.
3. **Analytical validation:** compare with independent synchronized reference annotation; estimate bias, absolute error, Bland–Altman limits and uncertainty. Evaluate all attempts and stratify failures by relevant characteristics and conditions.
4. **Reliability and usability:** repeated assessments under appropriate rest and safety procedures; inter-site variation; operator training and accessibility; test whether users follow instructions.
5. **Clinical validation:** establish construct validity, relationship to relevant patient experience, responsiveness and meaningful change in the actual disease/context. Do not import thresholds from another population without justification.
6. **Trial use and regulatory engagement:** prespecify endpoint derivation and missing-data treatment; discuss the evidence package with the sponsor and relevant agency pathway. Formal qualification may be useful but is not the only route to study-specific acceptance.

Sample sizes and clinical acceptance margins require statistician and clinician input before data collection. The engineering acceptance targets in document 03 are demonstration gates, not validated clinical thresholds. Preserve a held-out validation set; avoid tuning and reporting final performance on the same participants.

## Privacy, security and system controls

Proposed default: local video processing, no retained identifiable video, no video upload or telemetry containing frames. Consent-based reference recordings need a separate retention and access policy. Derived skeletons, timestamps and identifiers can still be sensitive. Local processing reduces transmission exposure but does not establish HIPAA compliance.

HIPAA applicability depends on entities, relationships and data flows. HHS identifies administrative, physical and technical safeguards for regulated entities; business-associate relationships can require appropriate agreements. A future deployment needs risk assessment, unique accounts, role permissions, encryption, secure configuration, incident response, retention/deletion controls and vendor/subcontractor review. [S15](https://www.hhs.gov/hipaa/for-professionals/security/index.html), [S16](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/business-associates/index.html)

FDA software/device obligations depend on intended use and claims; a research label alone does not settle classification. Obtain a documented intended-use and regulatory-pathway assessment before clinical deployment. Avoid diagnostic or treatment-selection claims. The FDA DDM paper explicitly notes that applicable device requirements still apply when a technology meets the device definition. [S5]

Future trial deployment needs a validated computerized-system lifecycle, access control, traceable corrections, source integrity, backups, version/change control and controlled transfer. Assess 21 CFR Part 11 applicability in relation to required electronic records and signatures and underlying predicate rules; do not call the prototype “Part 11 compliant.” FDA’s final October 2024 electronic-systems guidance is the starting reference. [S9](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/electronic-systems-electronic-records-and-electronic-signatures-clinical-investigations-questions)

## Claim controls

Allowed today: “proposed local assessment workflow,” “experimental camera-derived measurements,” “designed to integrate functional and imported trial data.” Allowed after demonstrated testing: narrowly stated actual runtime, latency, count/timing agreement on the specified test set. Not supported: validated biomarker, drug-efficacy determination, clinical diagnosis, regulatory approval, HIPAA compliance, improved trial success, superior accuracy or lower total cost.
