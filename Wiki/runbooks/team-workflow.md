# Team workflow: project structure, separation of concerns, and the shared laptop

**Status:** written on 2026-10-17 at the user's request so the team can work in parallel on one repository and one Snapdragon laptop reached over Tailscale. It owns the proposed code structure, the ownership boundaries, the laptop-sharing rules, and the model acquisition table. Commands for individual steps stay in [the Mac and Snapdragon runbook](mac-and-snapdragon-development.md); architecture stays in [the tech stack](../design/tech-stack.md); task status stays in [the plan](../plan.md#dependencies-and-order). Where this page says "proposed", the folder or rule does not exist yet.

## Project structure

What exists today, and the proposed additions for the tracker. Each folder has one owner so two people do not edit the same module on the same day.

```
SecondHands/
├── AGENTS.md, CLAUDE.md          repository governance (read first)
├── justfile                      every command the team runs; add a recipe, never a README snippet
├── pyproject.toml, uv.lock       Python package and locked root environment
├── src/secondhands/
│   ├── capture/                  camera sources: OpenCV UVC today; RealSense and Femto bridge clients proposed
│   ├── perception/   (proposed)  pose backends behind one interface: executorch_xnnpack, executorch_qnn (socket client), mediapipe
│   ├── analysis/     (proposed)  joint angles, rep state machines, test scorers, protocol loader
│   ├── protocols/    (proposed)  clinician-authored JSON protocol files, one per test
│   ├── storage/      (proposed)  SQLite sessions, baselines, reports
│   ├── api/                      FastAPI loopback service and WebSocket session (pose, rep_event, session_summary)
│   ├── recognition/              MediaPipe face and hand recognition (assistive control, retained)
│   ├── decisions/                trigger engine for assistive control (retained; its hysteresis pattern is reused by analysis)
│   └── training/                 window-classifier training (proposed content)
├── ui/                           React 19, TypeScript, Vite, Bun; screens consume the WebSocket messages, never compute scores
├── experiments/                  one script per experiment with its own .py.lock; nothing here is imported by src
├── tests/                        pytest; mocked camera, public images; model tests opt in through an environment variable
├── Wiki/                         maintained knowledge; plan.md is the single task list
└── artifacts/, data/  (ignored)  downloaded models, exported .pte files, recordings, SQLite file; never committed
```

## Separation of concerns

The contract between layers is data, not code. A person working in one row never needs to read another row's code to do their job.

| Layer | Owns | Receives | Produces | Owner | Must not |
| --- | --- | --- | --- | --- | --- |
| Capture | opening the camera, frame timing, letterboxing | device index or bridge address | RGB frames with timestamps | Cam and Jacqueline | run a model or know about protocols |
| Perception | loading a `.pte` or MediaPipe bundle, running it, decoding keypoints | RGB frame | 17 keypoints with confidence, inference time, runtime and model names | Vishwa, with the Qualcomm engineer for the QNN backend | smooth, count, or score anything |
| Analysis | angles, smoothing, rep state machines, test scorers, protocol loading | keypoints plus a protocol | `rep_event`, test events, scores, `session_summary` | engineers with the clinicians, who own the protocol files | touch the camera or the UI |
| Protocols | instructions, phases, metrics, thresholds, report fields | the clinicians' decisions | JSON files | clinicians | contain code |
| Service | sessions, WebSocket, SQLite, control messages | the three layers above | the message stream and `GET /api/sessions` | Vishwa and David | compute scores inline |
| Frontend | screens, overlay drawing, charts, controls | messages over the WebSocket | control messages (select protocol, start, stop, baseline) | David | recompute reps or scores from keypoints |
| Experiments | exports, benchmarks, conversions | pinned dependencies | JSON results under `artifacts/results/` | whoever runs them | be imported by `src` |
| Wiki | decisions, evidence, tasks | everyone's results | one task list and dated log entries | everyone, per [governance](../../AGENTS.md) | contain credentials, recordings, or names beyond role labels |

Interfaces to hold fixed this weekend: the `pose`, `rep_event`, and `session_summary` message fields in [the tech stack](../design/tech-stack.md#service-and-interface-contract); the perception interface `infer(frame) -> keypoints` so backends swap without touching analysis; and the protocol JSON shape shown in [the console prototype](https://claude.ai/artifact/CQdDefYFJcuS6qYVJN4K9B). Extend fields, never rename them.

## Prototypes and reference pages on GitHub Pages

The `docs/` folder holds standalone copies of the interactive prototypes and reference pages, and `.github/workflows/pages.yml` publishes that folder to GitHub Pages on every push to `main` that touches it. The site address is `https://davidmoshal.github.io/SecondHands/`. Publishing needs a one-time repository setting that only the owner can change: Settings, Pages, Build and deployment, Source set to **GitHub Actions**. Until that is done the workflow run fails with a Pages-not-enabled error and the files are still viewable by opening them from the repository. When a prototype changes, regenerate its `docs/` copy in the same pull request so the published page and the Wiki link stay in step.

## How we collaborate in Git

1. Work on your own machine on a branch named `<initials>/<topic>`, for example `dm/session-screen` or `vp/qnn-backend`. Keep branches small and short-lived.
2. Run the relevant `just test-*` recipe and `uv run --locked ruff check src` before opening a pull request. The UI runs `bun run --cwd ui test` and `bun run --cwd ui build`.
3. Open a pull request against `main`, link the plan task identifier, and ask one teammate to review. Merge early and often; a day-old branch on this project is already stale.
4. When a change affects project knowledge, update the owning Wiki page and add a dated entry to [the log](../log.md) in the same pull request. Do not create a second task list.
5. Never commit `artifacts/`, `data/`, recordings, model weights, calibration files, personal names, Windows account names, or anything from the laptop's user folders.
6. Identifiers: the next unused `SH-T-` number is in [the plan](../plan.md); check before adding one so two parallel pull requests do not collide. The same applies to `SH-Q-` and `SH-S-`.

## Sharing the one Snapdragon laptop

The laptop is a deployment and measurement target, not a development machine. Everyone develops and tests on their own computer; the laptop runs `main` plus the one branch under test. It is reached over Tailscale at `qcworkshop27.tail2122cc.ts.net`; the access procedure is in [the runbook](mac-and-snapdragon-development.md#access-the-snapdragon-laptop-over-tailscale), and [the Tailscale reference](../references/tailscale.md) records the invitation.

**Access.** Each teammate's computer joins the team tailnet, either by invitation to the tailnet or by having the laptop shared to their own tailnet through Tailscale's device sharing. Tailscale's free Personal plan covers a small number of users; check the plan limit before inviting everyone, and use device sharing for anyone beyond it. SSH uses the laptop's Windows OpenSSH Server; the Windows account name is shared in the team chat, never in Git.

**One steward.** Vishwa is the laptop steward: the only person who changes the laptop's Python environments, installs system software, updates the shared checkout, or restarts services. Everyone else runs commands in their own SSH session inside the shared checkout and leaves the environment as they found it.

**Layout on the laptop (proposed; the steward confirms the actual paths).**

```
C:\sh\SecondHands\          shared checkout, normally on main; the steward switches branches on request
C:\sh\envs\x64\             x64 Python 3.12 environment (Tier 0: OpenCV, ExecuTorch, Ultralytics, MediaPipe)
C:\sh\envs\arm64\           native ARM64 Python 3.12 (PyTorch, ONNX Runtime QNN; no OpenCV or ExecuTorch)
C:\sh\models\               downloaded weights and exported .pte files, shared by everyone (SECONDHANDS_MODEL_DIR)
C:\sh\qnn\                  QAIRT libraries, the supplied DeepLabV3 bundle, the ARM64 runner, and QNN .pte files
C:\sh\runs\<initials>\      each person's results, logs, and reports; nothing personal, nothing committed
```

**The camera is exclusive.** Only one process can hold the camera, and only one pipeline should drive it at a time. Before starting anything that opens the camera, post "laptop camera: <who>, <what>, until <time>" in the team chat and clear it when done. Exports, unit tests, conversions, and documentation can run concurrently in other sessions because they do not touch the camera.

**Ports.** Two things already claim port 8765: the SecondHands API in `src/secondhands/api` and Jacqueline's [depth bridge viewer](../setup/ms-09-femto-bolt-bridge.md#how-to-use-the-installed-setup). Do not run both at once until the API port is configurable (see [SH-T-059](../plan.md#dependencies-and-order)). Proposed plan:

| Port | Service | Notes |
| --- | --- | --- |
| 8765 | SecondHands API (FastAPI, WebSocket) | current code; loopback only |
| 5173 | Vite dev server (React UI) | proxies `/api` to 8765 |
| 8770 | Femto Bolt depth bridge viewer | proposed move from 8765 when it is next touched |
| 8780 | QNN runner socket (Tier 2) | proposed; native ARM64 process |

To see the laptop's dashboard from your own computer, forward 5173 and 8765 through SSH as the runbook shows. Only one person's forwarded dashboard talks to the camera pipeline at a time, because there is one pipeline.

**Environment discipline.** The x64 and ARM64 environments are built from the repository lockfiles. If something needs a new package, change `pyproject.toml` or a script's inline metadata on a branch, run `uv lock`, and open a pull request; the steward then re-syncs the laptop. No `pip install` into the shared environments by hand, because the next `uv sync --locked` removes it and the person who relied on it loses an hour.

**What goes where.** Measurements belong in `C:\sh\runs\<initials>\` and then in [the experiments page](../experiments-before-saturday.md) as a dated observation with the command, versions, and numbers. Recordings of people stay on the laptop under `C:\sh\runs\` and are deleted after the event unless the clinicians keep consented data elsewhere.

## Getting the models, and which ones need work for ExecuTorch

Download once into the shared model folder on the laptop and once on each development machine. Every download below is explicit; nothing fetches silently at inference time.

| Model | How to get it | ExecuTorch status | Work needed | Who |
| --- | --- | --- | --- | --- |
| YOLO11n-pose | `just smoke-yolo-pose-executorch` downloads `yolo11n-pose.pt` from Ultralytics and writes `artifacts/yolo-pose/yolo11n-pose_executorch_model/model.pte` | **Runs** through ExecuTorch 1.5.1 on XNNPACK, verified against PyTorch ([observation](../experiments-before-saturday.md#yolo-pose-executorch-export-observation)) | None for the CPU demo. Optional: 8-bit quantization and a QNN export for the NPU; operator coverage unknown | Vishwa |
| RTMPose (Qualcomm's recommendation; [model page](../references/models/rtmpose.md)) | `pip install "qai-hub-models[rtmpose-body2d]"` for the PyTorch wrapper and weights, or the MMPose RTMPose-t or -s body checkpoint from the [MMPose project page](https://github.com/open-mmlab/mmpose/tree/main/projects/rtmpose) | **Needs conversion.** No published `.pte`; AI Hub ships ONNX, QNN DLC, and TFLite | `torch.export`, PT2E 8-bit quantization with about 100 calibration frames, Qualcomm backend lowering for SC8380XP, native ARM64 runner; SimCC decoding stays outside the graph. Recipe: [`experiments/qnn_export_pose.py`](../../experiments/qnn_export_pose.py) (untested) | Qualcomm engineer with Vishwa |
| Window classifier (ours) | Not downloaded; trained from a short labeled recording on a development machine | **Needs training, then export.** Tiny operator set; the easiest NPU candidate | Record clips, label with the rule counter, train minutes on CPU, export with XNNPACK, then the Qualcomm backend | engineers; the Qualcomm engineer for the QNN step |
| MediaPipe Pose Landmarker | Explicit download through a new entry in `recognition/assets.py`, like the existing Face and Gesture bundles (`just download-mediapipe-models`) | **Not ExecuTorch.** Runs in the MediaPipe runtime | None; it is the robustness fallback and the validation reference. On native ARM64 Python it installs only with `--no-deps` because its OpenCV dependency has no ARM64 wheel | Vishwa |
| MediaPipe Face Landmarker and Gesture Recognizer | `just download-mediapipe-models` | Not ExecuTorch | None; assistive control, retained | existing |
| Qualcomm AI Hub MediaPipe-Pose, HRNetPose, LiteHRNet, Posenet | Pre-exported QNN or ONNX downloads from the AI Hub model pages | **Not `.pte`.** Would run through `onnxruntime-qnn`, which has a native ARM64 wheel | Only as an NPU fallback outside ExecuTorch if the RTMPose conversion fails and the team accepts a mixed runtime | Vishwa |
| DeepLabV3 (`dlv3_qnn.pte`) | Supplied by the hackathon on the laptop; location to be found ([SH-T-009](../plan.md#snapdragon-deployment)) | Runs through the Qualcomm backend by design | None; it is the reference for the runner, libraries, and profiling procedure | Vishwa |
| Laya Vision, Mapika, SmolVLM | `just download-laya`, `just download-mapika`, `just download-smolvlm` (several gigabytes) | Not ExecuTorch; Mac experiments for assistive decision making | Deferred; not part of the tracker demo | nobody this weekend |

Licences to keep in mind: Ultralytics weights and code are AGPL-3.0; RTMPose and MMPose are Apache-2.0; MediaPipe is Apache-2.0; AI Hub deployable models carry the AI Hub Models licence. The public repository is compatible with all of them; a closed product later would need an Ultralytics commercial licence or a different fallback model.

## Daily rhythm for the event

- **Morning, ten minutes, everyone:** what each person runs on the laptop today and when the camera is needed. Record the camera schedule in the chat.
- **During the day:** branches and pull requests as above; the steward merges to `main` on the laptop at agreed times, not continuously, so a measurement is never taken on a moving target.
- **Before the demo rehearsal:** freeze `main`, record the commit hash, the `.pte` hashes, and the versions in [the experiments page](../experiments-before-saturday.md), and stop merging.

## Questions

None open here. The port change is [SH-T-059](../plan.md#dependencies-and-order); laptop paths are confirmed by the steward when the environments are built ([SH-T-051](../plan.md#dependencies-and-order)).
