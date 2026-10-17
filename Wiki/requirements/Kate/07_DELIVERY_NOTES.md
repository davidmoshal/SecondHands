# Delivery and verification notes

17 October 2026.

## Included

- Six requested supporting Markdown documents, with source register and linked clinical/regulatory references.
- Concise summary, priority order, pitch outline and shared decision register in `00_START_HERE.md`.
- Ten-slide Marp-style `MotionVitals_Hackathon_Pitch.md`, with editable content, source links and speaker notes. It is a conversion source, not a rendered presentation.
- `roi_inputs.json` and standard-library-only `roi_model.py`. Run with `python3 roi_model.py` in an environment with Python available; changing input values recalculates all outputs.
- `synthetic_trial_profile.json` demonstrating long-format functional and imported values plus an explicitly missing visit. Its PRO scale is invented for display and must not be represented as a validated instrument. All entries are synthetic.

## Verification performed and limitations

Reviewed the readable brief and prior project context; checked public primary sources; reconciled event identity using the user’s link; preserved unresolved organizer instructions. Reviewed document consistency around prototype status, hardware, assessment, backend and privacy claims.

Independently recomputed default ROI arithmetic in JavaScript: conventional $10,560, MotionVitals $29,720, savings −$19,160, ROI −64.47%, break-even 4,792 scheduled assessments with fixed sites/costs. Python execution was attempted but the system Python launcher requires missing developer tools, while the bundled Python runtime was inaccessible. Therefore the Python script has not been runtime-tested here.

No PPTX generated: the bundled Node presentation runtime could not read its startup system configuration, including after escalation. The requested presentation skill and writing skill files were also inaccessible. The user’s express Markdown fallback was used. The deck has not been rendered or visually verified; convert and inspect before presentation.

No video transcript extracted: `IMG_4572.mov` exists (approximately 211 MB), but no usable local media/transcription runtime was available. No third-party upload was performed. Obtain a transcript or an accessible local media tool before finalizing the organizer-specific demo script.

No target Snapdragon execution, camera test, clinical measurement validation, latency benchmark, privacy certification, security audit, purchase interview or hackathon submission was performed. The package describes the proposed build and evidence program without claiming these activities occurred.

## Next decisions

1. Recover the organizer rubric and recording instructions; replace provisional pitch timing.
2. Prove actual `.pte` execution and capture on the supplied Snapdragon device.
3. Freeze model/checkpoint/license and 5xSTS protocol with named engineering and clinical owners.
4. Build and record the end-to-end assessment; replace storyboard and unmeasured fields with actual evidence.
5. Render the presentation and inspect layout before external use.
