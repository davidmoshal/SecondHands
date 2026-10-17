# Recognition and triggers

**Status: local exploration implemented on 2026-10-17 after the user's approval and explicit subagent request.** This covers the dashboard and configurable trigger experiments, not final numerical thresholds or demonstration criteria. Backend/trigger tests, frontend transport tests, the initial Vue build, and public-image backend inference passed. The parent inspected the stopped dashboard and API proxy in a browser. A physical camera, participant accuracy, and Windows remain untested. See [observed results](../experiments-before-saturday.md#dashboard-implementation-observations).

The user subsequently requested React with Bun on 2026-10-17. The dashboard now uses that stack with the same Python protocol and controls. [Migration observations](../experiments-before-saturday.md#react-and-bun-migration-observations) record the new interaction tests and browser checks.

## What starts recognition

The UI has an explicit Start camera control. Python opens the selected camera on the machine running recognition and supplies timestamped frames to both MediaPipe tasks. Stop closes the session and clears pending commands and calibration. A browser open on the Mac does not select the PC's camera: the Python process determines the capture device. The current dashboard binds to loopback; remote device access remains later work.

There is no separate detector that must first know a gesture is happening. While the session runs, the fast recognition models examine successive frames. Face Landmarker returns facial landmarks and blendshape scores, which measure visible facial movements. Gesture Recognizer returns hand landmarks and static gesture categories. An absent face or hand is missing input, not a command. These are the current [baseline outputs](../runbooks/mac-and-snapdragon-development.md#run-mediapipe-face-and-hand-recognition).

Recognition answers “what movement is visible?” A trigger policy answers “does this movement satisfy this person's configured command?” A model score alone cannot establish intention or an internal emotional state. A smile measurement can be a control signal without claiming that the person is happy.

## Processing path

1. **Capture:** obtain a frame and timestamp it after the camera read. Keep the latest frame in memory and, when requested, one frozen comparison. A rolling video history remains future work.
2. **Recognize:** run enabled face and hand processing. Retain raw measurements and missing-input states.
3. **Find a candidate:** compare selected measurements with the person's calibration profile. A candidate is a possible command, not an action.
4. **Check the candidate:** apply persistence and the configured cue sequence. Reject missing or expired evidence. Contextual decision-model checks remain future work.
5. **Apply the command policy:** use the configured confirmation rule, emit one command, then require release before another activation.
6. **Display or act:** initially update a simulated action in the UI. Physical control remains a separate integration against agreed demonstration behavior.

Face and hand recognition can run throughout a session. A larger decision model would run on a manual snapshot or a candidate event. It need not process every frame. Laya or Mapika can evaluate selected images and supplied choices; multiple observations require an explicit aggregation method. Do not assume that an image model understands a video sequence. A nod detector must inspect changes over time; enabling MediaPipe video tracking alone does not implement one.

## Trigger policy

| State | Meaning and transition |
| --- | --- |
| Stopped | Camera processing is off; no command can fire. |
| Observing | Show measurements. Wait for a selected movement to enter its calibrated activation range. |
| Candidate | Require the configured duration or sequence. Return to Observing if the evidence fails or expires. |
| Awaiting confirmation | Used only by a mapping that requires another cue. A valid cue advances; cancellation or timeout rejects the candidate. |
| Activated | Emit one command with its evidence and mapping identity. |
| Waiting for release | A held gesture cannot emit repeatedly. Return to Observing after the required neutral/release condition and any configured cooldown. |

The implementation uses separate activation and release thresholds. This is called hysteresis; it prevents small score changes near one threshold from repeatedly changing state. The editable initial settings are experiments, not approved demonstration criteria. Calibration measures neutral and deliberate movements and suggests a threshold pair when the samples separate. This does not establish reliability on ambiguous or unseen movements.

One active mapping currently shares its activation/release threshold pair across selected face and hand cues. Applying either calibration suggestion replaces that shared draft pair. Independent thresholds for each cue remain future work. In Either mode, one visible modality is sufficient; tracking loss is not an observed neutral release. Combined and sequence modes require both selected modalities. Hand command experiments require exactly one detected hand; other hands remain visible in the raw readings.

Support these mapping experiments:

- **Face only:** a deliberate eyebrow raise activates a simulated selection after the configured hold.
- **Hand only:** `Open_Palm` activates a simulated control, once per hold and release.
- **Either cue:** either configured movement requests the same action; simultaneous candidates produce one command under an explicit conflict rule.
- **Combined cues:** require a face cue and hand cue within a defined overlap window.
- **Sequence:** an open palm requests an action, then a deliberate facial movement confirms it before timeout.

These mapping modes are implemented exploration features, not validated accessible controls. Natural blinking and smiling can occur without command intent. Test each person's usable movements. Use one active participant: current output array positions do not provide persistent identity, so they cannot associate one person's face with another person's hand reliably. Identity tracking and multi-person control require separate work.

## Dashboard for team exploration

| Mode | What the team could explore |
| --- | --- |
| Observe | Live preview, landmark overlays, facial blendshape bars, hand categories, missing input, active model/runtime, and measured inference time. No automatic actions. |
| Compare | Freeze the current image and its existing MediaPipe results. Show the two task timings and label Laya, Mapika, and SmolVLM as not integrated. This does not run additional inference. |
| Calibrate | Collect neutral and deliberate measurements in memory, inspect signal separation, and test a person's proposed movement mapping. No recording is saved. |
| Compose | Try face/hand/either/combined/sequence mappings and inspect why a candidate advanced or failed. |
| Simulate | Toggle a virtual lamp and inspect recent state transitions, including rejection and release, before connecting hardware. The history is bounded to 100 events. |

The UI shows raw recognition separately from candidate, confirmation, and activation events. The team can distinguish “the model saw an open palm” from “the application accepted a command.” Calibration collects 30 valid measurements for each selected label, keeps them in session memory, and disables simulation while collecting. Applying settings clears calibration and pending evidence. The event history keeps the latest 100 state transitions.

## Code and data boundaries

Keep the [existing package responsibilities](../project.md#package-responsibilities). `capture` owns input, `recognition` owns model adapters, `decisions` owns calibration and temporal command policy, `training` owns offline training/export, `api` connects Python to React, and `ui` owns interaction and display. A model adapter means a small module that converts a runtime's input/output into application observations while retaining model-specific fields.

The CLI recognition JSON schema remains unchanged inside the dashboard envelope. The envelope adds session ID, frame ID, server capture timestamp, and mapping version, with the JPEG and its matching observations. Status includes model/runtime identity and bounded state events referring to frame/mapping IDs. Future decision-model outputs must retain their own meaning; do not treat blendshape measurements, option probabilities, and generated text as one universal confidence value.

The browser requests one frame at a time, with one pending user command. The service allows one camera owner and one outstanding frame job. Both MediaPipe models stay loaded for the session; native capture/inference runs on one worker thread. Stop, cancel, calibration, and mapping changes invalidate pending results. Native work must finish before its resources can close; forced interruption of a blocked camera driver is not implemented. Future decision-model scheduling and process isolation remain separate work.

The selected local service is FastAPI: HTTP provides health status; WebSocket carries session commands and events. Vite proxies `/api` to the loopback service and uses fixed port 5173. The service permits the two local Vite browser origins. Preview frames and landmarks arrive together; the UI renders that frame's coordinates. The UI may later display the PC's results from the Mac through a separately configured remote connection. [The runbook](../runbooks/mac-and-snapdragon-development.md#run-the-live-exploration-dashboard) owns commands.

## Evidence needed before physical control

Exercise neutral input, deliberate holds, release, ambiguity, lost tracking, confirmation timeout, cancellation, simultaneous cues, and late model results. Measure false activations and missed commands separately from static recognition accuracy. Record capture-to-recognition, recognition-to-candidate, candidate-to-command, and command-to-visible-action timing. A configured hold or confirmation delay is part of the interaction, not just model inference latency.

The [task plan](../plan.md) owns implementation and demonstration acceptance. The team must agree the movements and command behavior before treating any proposed mapping here as the demonstration requirement.
