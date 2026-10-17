# Project direction

The [current proposal](proposal.md) owns the SecondHands vision, demonstration, proposed architecture, and longer-term opportunity. The user supplied it on 2026-10-14 and identified it as the current proposal. This page records its relation to earlier direction and remaining evidence gaps.

## Established user direction

- On 2026-10-17, the user asked for the whole tech stack of a camera-based fitness tracker modeled on a Mayo Clinic five-step fitness program, running on the Snapdragon X Elite laptop with ExecuTorch, using the available Orbbec Astra and RealSense cameras, kept as cheap as possible, and linked to teammates' product requirements, technical design, and frontend work. [The tech stack page](design/tech-stack.md) records the proposed stack, interface contract, and document map. Later the same day the user confirmed that the fitness tracker is the project idea and that the assistive-control material in this Wiki is a previous idea that the team will update soon. [SH-Q-005](design/tech-stack.md#sh-q-005--how-does-the-movement-tracker-relate-to-secondhands) records that resolution; [the proposal](proposal.md) and README are therefore superseded pending [SH-T-048](plan.md#movement-tracker). [Phase 9 in the plan](plan.md#movement-tracker) tracks the tracker work.
- Later on 2026-10-17, the user reported that Tailscale is set up on the Snapdragon laptop with the MagicDNS name `qcworkshop27.tail2122cc.ts.net` and asked for the access procedure to be documented; see [the runbook](runbooks/mac-and-snapdragon-development.md#access-the-snapdragon-laptop-over-tailscale). The name is reachable only inside the team's tailnet. A connection has not yet been verified from a Mac.
- On 2026-10-17, the user requested a migration from Vue to React, with Bun preferred over pnpm. [Issue #11](https://github.com/davidmoshal/SecondHands/issues/11) records the work. React, TypeScript, Vite, and Bun now supply the dashboard; this supersedes the earlier Vue selection. [Migration checks](experiments-before-saturday.md#react-and-bun-migration-observations) record Mac verification and remaining device limits.
- On 2026-10-17, the user requested Tailscale setup on the Dell Snapdragon laptop, assigned to Vishwa in [issue #9](https://github.com/davidmoshal/SecondHands/issues/9). The repository collaborator account `theja2289` has a matching public profile name and is assigned to this issue. [SH-T-036](plan.md#snapdragon-deployment) tracks verification; the connection has not been tested.
- On 2026-10-17, the user confirmed that Kate will work on the clinical application of SecondHands. [Issue #7](https://github.com/davidmoshal/SecondHands/issues/7) records that ownership; specific clinical requirements remain to be defined. This does not resolve the separate [presentation lead question](#sh-q-004--presentation-lead).
- On 2026-10-17, the user added a browser-based 3D room demonstration: an accepted gesture or facial-expression command turns on a light in the room. David and Vishwa will build it under [issue #6](https://github.com/davidmoshal/SecondHands/issues/6). Normal browser viewing is the baseline; optional viewing through the available Oculus Quest 2 should use WebXR, with no Android SDK or native Android application. No 3D implementation, library selection, headset compatibility, or connection has been verified. This is an addition; the request does not cancel physical-control work. [The plan](plan.md#ui) tracks implementation.
- On 2026-10-16, the user chose the computer's built-in camera first: develop on the Mac, then test on the supplied Snapdragon PC at the hackathon. A depth camera or a phone camera streaming over Wi-Fi are optional follow-up inputs. The depth camera was changed to Femto Bolt on 2026-10-17; see the current decision below. This superseded the original Astra-first capture sequence; the [current proposal](proposal.md#how-it-works) now reflects the later camera revision. The earlier camera-only instruction remains in [exchange 4](SecondHands-conversation.md#exchange-4--camera-hardware-and-model-options).
- On 2026-10-17, the user replaced Orbbec Astra 2 with [Orbbec Femto Bolt](hardware/femto-bolt.md). Cam and Jacqueline will first establish capture on the x86 Windows laptop, then test the Dell Snapdragon PC. This changes the external camera choice, not the existing built-in-camera baseline. The same request authorizes the supplied first names for the named GitHub work items; Kate's presentation ownership remains proposed.
- Later on 2026-10-16, the user requested [system design documents](design/index.md), a broad local exploration for the team, about five candidate integrations on the Mac before porting, and an ExecuTorch trial on this machine. The user accepts some models using ExecuTorch and others using separate local frameworks. This permits a mixed-runtime project experiment; organizer acceptance remains unconfirmed. Trigger thresholds, confirmation rules, and final model selection remain open.
- On 2026-10-17, the user approved the reviewed design wording and requested implementation through a subagent. This approves the [dashboard and configurable trigger exploration](design/recognition-and-triggers.md), while numerical experiment settings, final demonstration acceptance criteria, and model selection remain separate. The same request confirms removal of personal names from current repository content under [the public repository policy](../AGENTS.md#public-repository-content); it does not authorize Git-history rewriting.
- Explore decision models and review their suitability for the Compute PC. The user requests an updated ranking and evidence about ExecuTorch requirements in [exchange 5](SecondHands-conversation.md#exchange-5--decision-model-ranking).
- Use [qc-executorch-guide](https://github.com/aaishikasb/qc-executorch-guide) as the supplied hackathon reference. The user supplies this repository in [exchange 3](SecondHands-conversation.md#exchange-3--hackathon-repository).

The supplied text is the user's current proposal. The assistant's earlier model ranking remains research input; it does not override that proposal or establish a tested implementation.

## Implementation and evidence limits

At the 2026-10-14 import, this repository contained no application, build process, or test suite. The archive preserves five exchanges and is incomplete; see [its import scope](SecondHands-conversation.md#import-scope).

The 2026-10-16 setup added an installable Python package, Vue scaffold, and MediaPipe image/camera CLIs. The approved 2026-10-17 implementation connects the dashboard, now migrated to React, to a local Python service and adds configurable trigger experiments, in-memory calibration, and a simulated lamp. Real-model image execution, protocol behavior, and deterministic trigger behavior are checked on the Mac. Physical camera operation through SecondHands, recognition accuracy for participants, and Windows execution of SecondHands remain untested.

A separate 2026-10-17 setup on the Snapdragon computer demonstrated [Femto Bolt depth capture and RGB/depth person positioning](setup/ms-09-femto-bolt-bridge.md). Those installed applications remain outside this repository. Initial checks passed; a later saved run recorded a capture timeout. The setup summary owns the results, rationale, launch procedure, and reliability/accuracy limits. This does not establish SecondHands integration or ExecuTorch/NPU execution.

The [Compute Track review](hackathon-compute.md) verifies the published event direction and documented deployment target as of 2026-10-14. It distinguishes those source statements from actual-device evidence and records unresolved event details. The complete allocated PC configuration, sustained Femto Bolt reliability, target-PC compatibility and performance of the selected SecondHands models, and acceptance of mixed runtimes remain unverified. Other assistant claims and the proposal's market-size claims remain unchecked research leads. No model was run in that 2026-10-14 review.

The later [runtime-stack review](design/runtime-stack.md) rechecks the relevant guide versions and deployment boundaries on 2026-10-16. A real ExecuTorch 1.5.1 XNNPACK CPU smoke run now agrees with PyTorch on synthetic inputs; it is not a gesture model or a Qualcomm NPU test. The [design](design/recognition-and-triggers.md) explains proposed continuous recognition and command triggers without presenting them as implemented behavior.

## Development setup

The user requested Python configuration on 2026-10-16 and initially selected Vue 3, TypeScript, and Vite. On 2026-10-17, the user replaced Vue with React and preferred Bun for UI tooling. The current UI uses React 19, TypeScript, Vite, and Bun 1.4.3. The repository uses one Python package under `src/secondhands/` and one independent frontend package under `ui/`. Python 3.12 is the selected starting version; [the Compute guide](https://github.com/aaishikasb/qc-executorch-guide/blob/9f3aae1f53053729ed28a242643e39feaf38fb9d/Compute/README.md) also specifies Python 3.12 for its optional export workflow. The initial setup created scaffolding; the current recognition baseline is described below.

### Package responsibilities

- [`src/secondhands/capture/`](../src/secondhands/capture/__init__.py): camera input and recorded observations.
- [`src/secondhands/recognition/`](../src/secondhands/recognition/__init__.py): gesture and facial movement recognition, including model loading for that task.
- [`src/secondhands/decisions/`](../src/secondhands/decisions/__init__.py): decision models and interpretation of observations over time.
- [`src/secondhands/training/`](../src/secondhands/training/__init__.py): PyTorch training, evaluation, and model export. Keep these offline operations separate from live recognition.
- [`src/secondhands/api/`](../src/secondhands/api/__init__.py): FastAPI service and session state, with WebSocket commands/results connecting the Python camera worker to React.
- [`ui/`](../ui/package.json): React components, browser interaction, and presentation. It has its own dependencies and build; it is not included in the Python wheel.

The capture and recognition packages implement the MediaPipe baseline; decisions implements deterministic trigger policy, and API implements the local dashboard service. Training remains a placeholder. Behavior tests are under `tests/`; model-backed integration is opt-in. Experimental scripts stay outside the live application package. Local recordings and datasets belong under `data/`, and model weights and exported models under `artifacts/`; both paths are ignored by Git. Model bundles are created by an explicit download command, not ordinary package setup.

The implemented local boundary has React send commands and display results while Python owns capture and inference. This preserves the intended separation for a future Mac-to-PC connection. Remote access is not configured by the loopback-only dashboard; the [design](design/recognition-and-triggers.md#code-and-data-boundaries) owns the current protocol and limits.

### Development procedure

The [Mac and Snapdragon development runbook](runbooks/mac-and-snapdragon-development.md) owns installation, local commands, Git synchronization, remote T3 execution, and platform-specific dependency limits. Python and UI dependencies are managed separately; no JavaScript workspace or additional Python packages are needed for this initial layout.

### Setup verification

The later [React and Bun migration checks](experiments-before-saturday.md#react-and-bun-migration-observations) describe the current frontend. The following Vue results are historical.

Observed on the Apple Silicon Mac on 2026-10-16: Python 3.12.9 imported all six package modules; PyTorch 2.14.1 and torchvision 0.29.1 imported and a CPU tensor calculation returned the expected values. Ruff lint and formatting checks passed. `uv build` produced a source distribution and wheel; the wheel imported successfully in an isolated environment outside the repository. The Vue UI passed `vue-tsc` and its Vite production build.

These initial setup checks verify packaging and tooling. No recognition models, cameras, browser interaction, or Windows execution were tested in that setup step. No behavior tests were added for the scaffold. See [SH-T-018](plan.md#project-setup) for setup completion; camera and demonstration tasks remain open.

### MediaPipe baseline

The user requested the first MediaPipe implementation through a subagent on 2026-10-16. The resulting Python CLI supports explicit model download, image inference, and bounded camera execution. The [runbook](runbooks/mac-and-snapdragon-development.md#run-mediapipe-face-and-hand-recognition) owns commands and output/timing interpretation. [Dated observations](experiments-before-saturday.md#mediapipe-baseline-observations) record the public-image and test checks. No pretrained decision model, personalized calibration, temporal gesture recognition, physical action, or Vue integration is implemented by this baseline.

### Live exploration dashboard

The 2026-10-17 subagent implementation adds the approved [recognition and trigger exploration](design/recognition-and-triggers.md): frame-matched preview/readings, five mapping modes, session calibration, frozen comparisons, and simulated actions. The [runbook](runbooks/mac-and-snapdragon-development.md#run-the-live-exploration-dashboard) owns startup and use; [observed checks](experiments-before-saturday.md#dashboard-implementation-observations) distinguish tests and public-image backend execution from the still-untested real camera. This is a deterministic policy over MediaPipe measurements, not a new pretrained decision model or a new ExecuTorch component.

## Questions

### SH-Q-001 — Model and runtime selection

**Open.** Which specific models and deployment paths should implement the decision component? The [current proposal](proposal.md) specifies lightweight PyTorch models through ExecuTorch for continuous recognition and identifies Clef-Flash as a potential, experimental higher-level layer. It does not select the lightweight models or establish a working Clef-Flash deployment.

The [model reference index](references/models/index.md) owns the current five-candidate recommendation and the additional candidates retained from the captured chats. The user requested that reference on 2026-10-16; it records an experiment starting order, not a final runtime selection. The [earlier rankings](SecondHands-conversation.md#exchange-5--decision-model-ranking) remain historical source material. MediaPipe image execution is smoke-tested. The later [decision-model image experiments](experiments-before-saturday.md#decision-model-image-observations) run Laya Vision, Mapika, and SmolVLM in isolated Mac environments, with configurable questions and recorded failures. All five starting candidates execute locally; the participant comparison remains open. These CLI experiments are not yet connected to the dashboard or ExecuTorch.

The [pre-Saturday experiment plan](experiments-before-saturday.md) owns the proposed comparison, observations, measurements, and division of effort. Its results would inform this decision. Target-PC execution, licensing, and the [unresolved event details](hackathon-compute.md#unresolved-event-details) remain evidence needed for selection.

### SH-Q-003 — GitHub accounts for the named owners

**Partially resolved.** The user named Cam, Jacqueline, David, Vishwa, and Kate for the [team work items](plan.md#team-coordination). Kate owns the clinical application work; her presentation role remains proposed. The latest collaborator check identifies `davidmoshal` and `theja2289`; the latter's public profile identifies Vishwa and is assigned to [Tailscale setup](https://github.com/davidmoshal/SecondHands/issues/9). Cam's `cbuscaron` account was verified from his correspondence and invited with write access; acceptance has not been confirmed. Kate and Jacqueline still need verified account mappings. David remains assigned to the model, UI, and 3D room issues.

- **Keep named owners in descriptions for now:** Team coordination can start without account changes. Example: [the hardware issue](https://github.com/davidmoshal/SecondHands/issues/2) names Cam and Jacqueline but has no formal GitHub assignee.
- **Provide confirmed account mappings and repository access:** Use those accounts for formal assignments. Example: supply `Jacqueline: <actual GitHub login>` and confirm that the account should have access before inviting or assigning it.

The criterion is an exact person-to-account match and authorized access. Keep the current description-based ownership until those details are confirmed. Track this question in [the plan](plan.md#team-coordination).

### SH-Q-004 — Presentation lead

**Open.** The user proposed “Kate?” for [the presentation issue](https://github.com/davidmoshal/SecondHands/issues/5), so the lead is not confirmed. The [proposal](proposal.md#the-hackathon-demonstration) describes the demonstration story; [the experiment record](experiments-before-saturday.md) separates observed results from future capabilities.

The user subsequently confirmed Kate's [clinical application work](https://github.com/davidmoshal/SecondHands/issues/7). That assignment does not confirm or exclude her presentation role.

- **Confirm Kate as lead:** Kate owns the narrative, deck, and rehearsal, with technical evidence from the other workstreams. Example: Kate assembles the demonstration sequence while the hardware and model owners verify the claims.
- **Leave the lead pending until the team confirms availability:** Contributors can collect screenshots and results without implying that Kate accepted ownership. Example: the issue remains unassigned while the team confirms who will deliver the presentation.

Choose based on availability and responsibility for the final presentation. Keep the lead marked as proposed until confirmed, and update [the plan](plan.md#team-coordination) when resolved.
