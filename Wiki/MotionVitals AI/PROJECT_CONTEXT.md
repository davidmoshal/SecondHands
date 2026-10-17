# MotionVitals AI — Project Context

Last updated: 2026-10-17

This file preserves the project discussion available in this chat. It is a working context record, not a verbatim transcript. Earlier conversations can be pasted into the discussion archive below. Consolidation of those conversations should wait until the user says “done.”

## Project purpose

Build MotionVitals AI for the ExecuTorch hackathon. The initial user-provided brief is titled “MotionVitals AI — Turning Human Movement into Clinical Evidence” and identifies the Qualcomm Snapdragon Compute Track.

MotionVitals aims to measure physical function through computer vision, depth sensing, and on-device AI. The longer-term goal is a library of validated digital measures that can support clinical research and drug development.

The initial clinical use case is cancer cachexia: exploring whether improvements in biological markers, weight, or muscle mass are accompanied by improvements in physical function.

## Proposed hackathon prototype from the initial brief

- Guide a participant through a standardized chair-rise assessment.
- Detect movement transitions, count repetitions, and measure completion time.
- Explore movement velocity, transition timing, and movement consistency.
- Display results in an interactive dashboard with historical comparisons and illustrative clinical trial biomarkers.
- Demonstrate local inference, low-latency processing, and operation without cloud-based video analysis.
- Clearly identify illustrative biomarker values and historical data.

Established functional assessments provide the starting point. Novel camera-derived features remain exploratory and require validation before use as confirmatory clinical endpoints. The prototype is not established as clinically validated.

## Intended technology and hardware

The initial brief proposes:

- Qualcomm Snapdragon X Elite laptop.
- Orbbec Astra 2 depth-sensing camera.
- PyTorch and Meta ExecuTorch.

Hardware availability, operating systems, model choice, camera integration, and deployment architecture have not yet been confirmed.

## Longer-term vision

Potential customers are pharmaceutical companies, biotechnology companies, and contract research organizations. The proposed business model includes study-level licensing, validated assessment modules, and integration into clinical trial data systems.

Potential expansion areas include neurology, neuromuscular disorders, cardiopulmonary diseases, and rehabilitation. These are longer-term ideas, not the current implementation scope.

## Decisions and current status

- The user established this folder as the MotionVitals AI project workspace.
- At the user's request, `.codex/config.toml` was copied exactly from the 2020 Park Revenue Management project and verified against the source.
- The user added a trusted-project entry for MotionVitals AI in their user-level Codex configuration; the entry was checked.
- The latest session context reflects restricted filesystem access, including denial of general filesystem and temporary-directory reads, with workspace access and minimal system reads permitted.
- Implementation has not started. The current phase is collecting previous discussions.
- The assistant suggested starting with a five-times sit-to-stand pipeline and recorded-video demo before hardware integration. This remains a proposal, not a user-approved implementation decision.

## Saved project permission configuration

The authoritative configuration is `.codex/config.toml`:

```toml
default_permissions = "workspace-only"

approval_policy = "on-request"
approvals_reviewer = "user"

[permissions.workspace-only]
extends = ":workspace"

[permissions.workspace-only.filesystem]
":root" = "deny"
":minimal" = "read"
":tmpdir" = "deny"
":slash_tmp" = "deny"

[permissions.workspace-only.network]
enabled = false
```

Saved settings and effective session permissions must be distinguished. This record does not establish that every other project chat has loaded the same settings.

## Previous discussions awaiting import

The user supplied later attachments titled “MotionVitals — The Missing Vital Sign,” but their contents have not been read because the attachment locations are outside the active permitted workspace. No decisions or requirements have been inferred from those attachments.

Paste the previous discussions below, or place their text files inside this project folder for import. Keep original wording in the archive when available; identify later summaries as summaries.

### Discussion archive

<!-- Paste previous conversations here. Add a date or source label for each conversation when known. -->

## Open questions to resolve after discussion import

- What decisions were already made in the other conversations?
- Are the Snapdragon laptop and Orbbec camera available now?
- What are the hackathon deadline, submission requirements, and judging criteria?
- Which assessment, demo flow, and deliverables should be prioritized?
- What recordings or other development data are available and authorized for use?

## Next step

Collect the remaining discussions. When the user says “done,” reconcile them with this record, distinguish confirmed decisions from proposals, and prepare the implementation plan.

## Update — 17 October 2026: explicit package request

The user saved a new authoritative brief as `request.txt.rtf`, explicitly requesting a complete product/business, evidence/regulatory, technical, pitch and commercialization package. This supersedes the earlier wait-to-consolidate step for this task. Six numbered supporting documents, `00_START_HERE.md`, a convertible ten-slide Markdown presentation and an adjustable Python/JSON ROI model were created. They specify the intended product; no application or target-device execution is implemented or demonstrated.

The brief now explicitly identifies 5xSTS as the initial assessment and Snapdragon X Elite/Astra 2 as available hardware. Runtime and camera compatibility remain unverified. The user confirmed the event URL: https://hackersquad.io/events/executorch-hackathon-compute-track . Its public builder guide does not yet publish detailed judging criteria or a submission deadline at review. The brief’s 40/25/15 weights remain user-supplied.

The user added `IMG_4572.mov` for demo requirements. It is present in this workspace but has not been reviewed because media runtime access is blocked. A HEIC judging image was inaccessible; the later JPG event photo was explicitly disregarded at the user’s request. Do not infer the missing rubric or spoken instructions. Presentation generation also encountered runtime access restrictions; the brief-authorized Markdown fallback is supplied, not a PPTX.

### Team-specification strategy refinement

The user subsequently supplied feedback to preserve the single-assessment scope while making its evidence more visible. `TEAM_PROJECT_SPEC.md` now requires an actual movement overlay/event strip, deliberate tracking-failure demonstration, backend/latency/offline evidence and independent evaluation with failures included. `MotionVitals_Demo_Pitch.md` is the main five-slide pitch; the ten-slide deck remains background. CPU fallback eligibility and exact organizer weights remain unverified. No implementation or new device results are implied by these revisions.
