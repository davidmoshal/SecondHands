# Sources and evidence limitations

Reviewed 17 October 2026. Public primary sources only for substantive clinical, regulatory and technical claims. Vendor pages describe offerings, not independent comparative evidence. Search results and accessible page text were reviewed; paywalled supplements, procurement documents and target-device builds were not independently audited. Source IDs are used across the documents and presentation notes.

| ID | Source and URL | Supports / limits |
|---|---|---|
| S1 | [Temel et al., Lancet Oncology 2016, ROMANA 1/2](https://pubmed.ncbi.nlm.nih.gov/26906526/) | Lean-mass benefit without significant handgrip benefit; does not evaluate 5xSTS or MotionVitals |
| S2 | [EMA: Adlumiz refusal](https://www.ema.europa.eu/en/medicines/human/EPAR/adlumiz) | Clinical-benefit concerns and inadequate safety-data recording; not a measurement-only regulatory failure |
| S3 | [Groarke et al., NEJM 2024: Ponsegromab](https://www.nejm.org/doi/10.1056/NEJMoa2409515) | Phase II population, weight primary endpoint, symptom/activity domains; abstract-level review does not establish every secondary result |
| S4 | [Bertrand et al., PLOS Digital Health, 6 January 2026](https://journals.plos.org/digitalhealth/article?id=10.1371/journal.pdig.0001172) | Ameya validation and failure analysis; supervised setting; no transfer of validity to our system; apparent 5xSTS ICC/CI inconsistency requires clarification |
| S5 | [FDA: Key Considerations for Development and Use of Digitally Derived Measures, August 2026](https://www.fda.gov/media/194348/download) | Patient relevance, context and risk-based evidence; considerations paper, not a product authorization |
| S6 | [FDA: Selecting, Developing, or Modifying Fit-for-Purpose COAs, final October 2025](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/patient-focused-drug-development-selecting-developing-or-modifying-fit-purpose-clinical-outcome) | COA development framework; not evidence that our implementation is fit for purpose |
| S7 | [FDA: DHTs for Remote Data Acquisition, final December 2023](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/digital-health-technologies-remote-data-acquisition-clinical-investigations) | Remote-investigation technology considerations; applicability must be mapped to actual use |
| S8 | [EMA: SV95C primary-endpoint qualification opinion, July 2023](https://www.ema.europa.eu/en/documents/scientific-guideline/qualification-opinion-stride-velocity-95th-centile-primary-endpoint-studies-ambulatory-duchenne-muscular-dystrophy-studies_en.pdf) | Context-specific wearable endpoint precedent; not qualification of chair-rise assessment |
| S9 | [FDA: Electronic Systems, Records and Signatures in Clinical Investigations, final October 2024](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/electronic-systems-electronic-records-and-electronic-signatures-clinical-investigations-questions) | Computerized-system and record expectations; no compliance conclusion for prototype |
| S10 | [Koneksa: multimodal clinical data](https://www.koneksahealth.com/) | Vendor describes integration of digital and conventional study data; pricing, audit/security details and comparative performance unverified |
| S11 | [Clario: Precision Motion](https://clario.com/solutions/precision-motion/), [hybrid trials](https://clario.com/solutions/hybrid-trials/), [publication library](https://opalknowledgebase.clario.com/) | Wearable-based trial offering; published evidence must be matched to a particular measure/population |
| S12 | [OneStep product](https://www.onestep.co/product), [integration offering](https://onestep.co/solutions/medical-devices) | Smartphone gait/mobility and organizational workflows; no independent superiority or privacy audit here |
| S13 | [ActiGraph LEAP FAQ](https://blog.theactigraph.com/blog/leap-faq) | Multisensor research/trial wearable comparator; no prices or comparative endpoint validation inferred |
| S14 | [FDA DHT drug-development resources](https://www.fda.gov/science-research/science-and-research-special-topics/digital-health-technologies-dhts-drug-development) | Links to framework and related guidance; not a substitute for intended-use evidence |
| S15 | [HHS: Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/index.html) | Safeguards for covered entities/business associates; local processing alone is insufficient |
| S16 | [HHS: Business Associates](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/business-associates/index.html) | Relationship and contracting considerations; actual applicability remains to be assessed |
| S17 | [ExecuTorch desktop platforms](https://docs.pytorch.org/executorch/stable/platforms-desktop.html) | General platform/backend documentation; stable URL changes over time |
| S18 | [ExecuTorch source-build documentation](https://github.com/pytorch/executorch/blob/main/docs/source/using-executorch-building-from-source.md), [Windows support workstream](https://github.com/pytorch/executorch/issues/13781) | Tested Windows architecture/build constraints; main branch and issue history are not proof of target compatibility |
| S19 | [ExecuTorch backend overview](https://docs.pytorch.org/executorch/stable/backends-overview.html) | Backend-specific export/deployment; no automatic NPU delegation |
| S20 | [Orbbec SDK repository](https://github.com/orbbec/OrbbecSDK), [SDK v2 repository](https://github.com/orbbec/OrbbecSDK_v2) | Device/platform and package documentation; Windows x64 does not establish Windows ARM64 drivers |
| S21 | [Official ViTPose repository](https://github.com/ViTAE-Transformer/ViTPose) | Candidate PyTorch pose architecture; selected checkpoint/license/export/clinical performance unresolved |
| S22 | [User-identified Compute Track event](https://hackersquad.io/events/executorch-hackathon-compute-track), [builder guide](https://hackersquad.io/events/executorch-hackathon-compute-track/resources) | Confirms event identity. Guide explicitly gives UTC start/end; no submission deadline published at review |
| S23 | [Compute Track submission and judging](https://hackersquad.io/events/executorch-hackathon-compute-track/resources?tab=submission), [rules](https://hackersquad.io/events/executorch-hackathon-compute-track/resources?tab=rules) | Repository/project information, saved demo and explicit submission; detailed rubric/rules not published at review |

## User materials and precedence

- `request.txt.rtf`: the authoritative saved brief. Defines deliverables, primary market, hardware, assessment, constraints and partial 40/25/15 judging allocation. These weights are user-supplied, not independently verified from an organizer rubric.
- `PROJECT_CONTEXT.md`: prior discussion summary, not a transcript. New explicit brief supersedes earlier uncertainty about chosen assessment/hardware.
- User supplied S22 during this work; it replaces unrelated public event search results as the relevant event.
- HEIC judging photograph: inaccessible in Photos Library; not read, transcribed or used as evidence.
- Later inline JPG: user explicitly asked to disregard it. Not used for requirements.
- `IMG_4572.mov`: present in workspace; local media runtime blocked. Spoken demo requirements have not been extracted. Incorporate a reviewed transcript or accessible playback before treating demo duration/content rules as settled.
- Earlier inaccessible text attachments: not read and not incorporated.

## Evidence gaps and follow-up

1. Exact full organizer rubric, submission deadline and demo length; recording review pending.
2. Actual Snapdragon OS/runtime/backend and Astra 2 compatibility, model/checkpoint license and performance.
3. Locked 5xSTS instructions and start/stop convention chosen with a clinical lead.
4. Target-population relevance, analytical error limits, reliability and meaningful change.
5. Independent measure-specific competitor validation and procurement/security diligence.
6. Buyer interviews, measured workflow burden, total costs and willingness to pay.
7. Intended-use/device assessment, trial-system controls and payer analysis for any future clinical offering.

Numbers in the ROI model, synthetic examples and engineering gates are assumptions. No source is cited as validating those assumptions. No confidential employer data, proprietary clinical-trial data or internal company documents were used.
