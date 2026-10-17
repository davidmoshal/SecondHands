# Develop on the Mac and run on the Snapdragon PC

Use this runbook to work on SecondHands from the Mac and run the same source on the Windows ARM64 Snapdragon PC. The user requested this workflow explanation as a runbook on 2026-10-16. The Mac setup is verified; the PC setup and T3 connection remain untested because the device is first available at the hackathon.

The application has a Python MediaPipe face/hand baseline and a connected Vue exploration dashboard. Backend/trigger tests, frontend transport tests, public-image inference, and the stopped browser UI have been checked on the Mac. A physical camera, participant recognition accuracy, and Windows execution remain untested. [Project direction](../project.md#development-setup) owns package responsibilities, [observed dashboard checks](../experiments-before-saturday.md#dashboard-implementation-observations) own verification results, and [the task plan](../plan.md) owns work status.

## What is shared between machines

Use one Git repository with a separate checkout on each computer. Git transfers the Python source, UI source, configuration, lockfiles, and Wiki. Each machine installs and runs its own environment from that checkout.

- [`src/secondhands/`](../../src/secondhands/__init__.py) contains the shared Python source.
- [`pyproject.toml`](../../pyproject.toml) defines Python dependencies and tools; [`uv.lock`](../../uv.lock) records resolved dependency versions and platform packages.
- [`ui/`](../../ui/package.json) contains the Vue source and frontend configuration; its `pnpm-lock.yaml` records frontend dependencies.
- `.venv`, `node_modules`, local recordings under `data/`, and model files under `artifacts/` stay local and are ignored by Git. Recreate environments on each machine instead of copying them.

The source can be shared while installed packages differ by operating system and processor. A lockfile records dependencies; it does not prove that every dependency or hardware backend works on both machines. Keep required platform differences in configuration and small runtime-specific modules within the same repository.

## Prerequisites

Both machines need Git, access to the SecondHands remote, and [uv](https://docs.astral.sh/uv/getting-started/installation/). [`.python-version`](../../.python-version) selects Python 3.12. UI development also needs Node.js 22.12 or later and pnpm 10.33.0, as recorded in [`ui/package.json`](../../ui/package.json). The task shortcuts use [just](https://just.systems/); it is installed on the Mac.

Run the commands below from the checkout's root directory unless a step says otherwise. The Git examples assume the current project branch, `main`.

## Try the existing scaffold on the Mac

The Mac already has this checkout. The user confirmed on 2026-10-16 that Python setup, the tensor smoke command, UI installation, and UI startup worked. The root [`justfile`](../../justfile) now owns shortcuts for those commands. Install the Python/PyTorch and UI dependencies, then run the CPU check:

```sh
just setup
just smoke-python
```

Expected smoke-command output: `tensor([2, 4])`. This checks PyTorch execution, not gesture recognition or accelerator use. The optional extra contains PyTorch and torchvision. `just setup-python` and `just setup-ui` run the two installations independently; `just` lists the available tasks. The base `uv sync --locked` installs the Python package and development tools without requiring the PyTorch extra.

Start the UI:

```sh
just dev-ui
```

Open the development URL printed by Vite. This now displays the exploration dashboard. Its camera controls also need the Python service described below. Stop the development server with Ctrl+C when finished.

MediaPipe is installed through the optional `vision` extra; the local service adds the `dashboard` extra. Pretrained decision-model candidates are not installed. ExecuTorch has a separate isolated smoke environment described below; it is not an application dependency. The [model references](../references/models/index.md) own the candidate details.

## Run the live exploration dashboard

From the repository root on the Mac, install the dashboard environment and download the models if absent:

```sh
just setup-dashboard
just download-mediapipe-models
```

Start the Python service in one terminal:

```sh
just dev-api
```

Start Vue in a second terminal:

```sh
just dev-ui
```

Open `http://127.0.0.1:5173`. Vite uses fixed port 5173 and proxies `/api` to Python on `127.0.0.1:8765`. Both services bind to loopback. Stop an existing process using one of those ports before starting another copy. This local setup does not configure remote access to the Snapdragon PC.

1. Leave camera index 0 initially and select **Start camera**. Allow camera access for the terminal/Python process if macOS asks. The browser does not open the camera itself. Start defaults to observation without simulated actions.
2. Inspect the matching image, landmarks, facial blendshape measurements, hand categories, and task times. The view is unmirrored. Use one participant; hand commands require exactly one detected hand.
3. Choose a mapping and signals under **Compose a command**, then apply the experiment settings. Modes are face, hand, either, combined, and hand-hold followed by a new face cue. Activation/release scores are one shared threshold pair across selected cues.
4. For calibration, collect 30 valid neutral frames, then 30 deliberate frames. Required visibility follows the mapping. Collection disables simulation. A suggested range appears only when the deliberate minimum exceeds the neutral maximum by at least 0.1; this is an experiment heuristic, not measured reliability. Copy a suggestion into the draft and review it before applying. Applying settings clears the collected measurements and pending evidence.
5. To test commands, explicitly check **Enable simulated commands when applying** and apply the settings. Accepted commands toggle the virtual lamp. Watch candidate, confirmation, cancellation, and release events in the recent history. No physical actuator is connected.
6. Use **Freeze current observation for comparison** to retain one image and its existing MediaPipe results while live processing continues. This does not run additional models. The three remaining candidates are labeled not integrated.
7. Select **Stop** to close the session and clear its frames, calibration, and pending commands. Close both terminal services with Ctrl+C when finished. Native work already in progress must finish before its resources can close; a blocked OS camera driver cannot be forcibly interrupted by this worker.

Session data stays in memory; no recording or calibration file is saved. Reopening the session resets simulation to observation. Settings, numerical defaults, and calibration suggestions are exploration tools, not approved demonstration acceptance criteria. [The design](../design/recognition-and-triggers.md) owns the exact state and scheduling behavior.

## Run MediaPipe face and hand recognition

From the repository root on the Mac:

```sh
just setup-vision
just download-mediapipe-models
just recognize-camera
```

The download recipe fetches versioned Face Landmarker and Gesture Recognizer bundles from Google's model storage, verifies their SHA-256 checksums, and stores them under ignored `artifacts/mediapipe/`. Downloads are explicit; inference does not silently fetch models. The asset URLs and checksums are owned by [`recognition/assets.py`](../../src/secondhands/recognition/assets.py).

The camera recipe uses camera index 0, enables a local OpenCV preview, and stops after at most 300 frames. Press `q` in the preview or Ctrl+C to stop earlier. OS camera permission may be needed. This CLI uses a separate local window; use the dashboard procedure above for Vue results. No recording is saved automatically.

For an image, pass the path to an existing local file; files containing people or personal observations belong outside Git:

```sh
just recognize-image data/example.jpg
```

`data/example.jpg` is an example path, not a supplied fixture. For a bounded headless camera run or a different camera index, use the CLI directly:

```sh
uv run --locked --extra vision python -m secondhands.recognition camera --camera-index 0 --max-frames 100
```

Each subcommand accepts `--model-dir`; its default is `artifacts/mediapipe`. `image` uses independent image inference, while `camera` uses synchronous video tracking with increasing timestamps. JSON lines go to stdout; native model diagnostics can appear on stderr. Face output contains landmarks and named facial blendshape scores. Hand output contains landmarks, handedness, and gesture categories. An empty detection is an empty array, not a command. Array positions are not persistent person or hand identities.

The JSON `timing_ms.face` and `timing_ms.hand` fields cover the synchronous model calls; `timing_ms.total` is their sum. Camera capture, RGB conversion, loading, result conversion, JSON serialization, and display are excluded. These are inference timings, not end-to-end response latency or evidence of intent. See [the baseline observations](../experiments-before-saturday.md#mediapipe-baseline-observations) for the actual image checks and test limits.

## Run the other three image models

These are local image experiments for Laya Vision 201M, Mapika Decider 2B Vision, and SmolVLM-500M-Instruct. They use PyTorch and Transformers, not ExecuTorch. They do not yet supply results to the live dashboard. See [the recorded observations](../experiments-before-saturday.md#decision-model-image-observations) before interpreting the output.

From the repository root, download the public sample images and pinned model weights once:

```sh
just download-model-samples
just download-laya
just download-mapika
just download-smolvlm
```

The model downloads require internet access and several gigabytes of disk space. The scripts use a repository-local Hugging Face cache under ignored `artifacts/huggingface/hub/`. The download commands disable the optional Xet transfer path by default because it stalled during the first Mac setup. A failed download is not a successful model test; rerun its download command before inference.

Run each model on the same public portrait and thumb-up images:

```sh
just test-laya
just test-mapika
just test-smolvlm
```

Or run all three sequentially with `just test-decision-models`. Each command asks which hand gesture is visible, with five supplied choices, and saves JSON under ignored `artifacts/results/`. The choices include another hand pose and no visible hand, so the portrait's resting hands need not be forced into a command gesture. Each image receives one initial request and three measured repeat requests. These few requests are installation and output checks, not a recognition benchmark.

For your own local image, use `just recognize-laya data/example.jpg`, `just recognize-mapika data/example.jpg`, or `just recognize-smolvlm data/example.jpg`. The file must exist. Personal images and recordings must remain outside Git.

To change the question and choices, use the script directly. For example:

```sh
uv run --locked --with-editable . --script experiments/laya_vision.py run artifacts/portrait.jpg artifacts/thumb_up.jpg --question "Which visible facial movement is present?" --choice "smiling" --choice "mouth open" --choice "neutral expression" --choice "no visible face" --output artifacts/results/laya-face.json
```

Use `experiments/mapika_vision.py` or `experiments/smolvlm.py` for the same question with another model. Include every choice with a separate `--choice`; provide two to 32 distinct choices. These labels describe visible features, not emotions or intentional commands.

Each script has its own inline dependencies and adjacent `.py.lock`. `--with-editable .` also installs the local SecondHands package into that isolated script environment. This keeps the models' different Transformers versions separate from the MediaPipe application environment. Do not combine these dependency sets into the root environment merely to run an experiment.

Inference reads cached weights with Hugging Face offline mode enabled. uv may still need internet access to install a missing script dependency. The default `--device auto` selects Apple Metal through PyTorch MPS when available, otherwise CPU. To request a fresh CPU process, append `--device cpu` to a direct script invocation. A failed MPS run does not silently retry on CPU. Mac execution does not establish Windows ARM64 or Qualcomm NPU support.

JSON records model and code revisions, runtime versions, selected device and dtype, input checksums, outputs, loading time, and synchronized request timings. Request timing includes preprocessing and output decoding but excludes file reading and model loading. Peak process resident memory is not a complete measurement of GPU or system memory. Laya and Mapika return option probabilities; these are not calibrated intent scores. SmolVLM returns generated text; `exact_choice` is null unless that text matches a supplied choice. A nonmatching answer must not be converted into a command.

## Run the ExecuTorch CPU smoke check

From the repository root on the Mac:

```sh
just smoke-executorch
```

This runs `uv run --locked --script experiments/executorch_cpu_smoke.py`. The script's inline dependency metadata and adjacent `.py.lock` select an isolated environment with ExecuTorch 1.5.1 and PyTorch 2.14.1. uv installs missing packages on first use. The root application `.venv`, `pyproject.toml`, and `uv.lock` are not changed by this command.

Expected final JSON includes `status: passed`, `backend: ["XnnpackBackend"]`, and `samples_checked: 12`. Native diagnostics can appear before the JSON. The script checks an untrained network on synthetic inputs; it is not a recognition demo. It writes `artifacts/executorch/synthetic_head_xnnpack.pte`, loads that file through ExecuTorch, and fails if its outputs disagree with PyTorch or its XNNPACK delegate is absent.

The command was exercised on the Mac on 2026-10-16. See [the exact observation](../experiments-before-saturday.md#executorch-cpu-smoke-observation) and [the runtime design](../design/runtime-stack.md) for evidence limits and the different Qualcomm deployment path. Do not use this CPU artifact as a claimed Snapdragon NPU model.

## Run the YOLO pose ExecuTorch export check

From the repository root:

```sh
just smoke-yolo-pose-executorch
```

This runs `uv run --locked --script experiments/yolo_pose_executorch.py yolo11n-pose.pt 640`. The script's inline metadata and adjacent `.py.lock` select an isolated environment with Ultralytics, ExecuTorch 1.5.1, and CPU-only PyTorch 2.14.1 from the PyTorch CPU package index, which also carries native Windows ARM64 PyTorch wheels. The root application environment is not changed. The first run downloads the pretrained `yolo11n-pose.pt` weights, which Ultralytics distributes under AGPL-3.0, and a public sample image into ignored `artifacts/yolo-pose/`.

The script exports the model with Ultralytics' ExecuTorch integration, predicts the sample image through PyTorch and through the exported `.pte`, and then feeds one identical letterboxed tensor through the PyTorch model and the ExecuTorch Python runtime. Expected final JSON includes `status: passed`, a `raw_max_abs_diff` well below `0.05`, and equal person counts. The prediction-level `max_keypoint_pixel_diff` can be tens of pixels because Ultralytics letterboxes the PyTorch model to a rectangular input and the exported model to a fixed square; it is not an export error on its own. Results are also written to ignored `artifacts/results/yolo-pose-executorch.json`.

Pass another Ultralytics pose checkpoint or input size as arguments, for example `uv run --locked --script experiments/yolo_pose_executorch.py yolo26n-pose.pt 320`. Timings are CPU timings on the running machine. See [the recorded observation](../experiments-before-saturday.md#yolo-pose-executorch-export-observation) and [the tech stack](../design/tech-stack.md#perception-pose-estimation) for what this does and does not establish. On the Snapdragon laptop, run it from x64 Python under emulation until a native ExecuTorch runtime is built; the ExecuTorch Python package has no Windows ARM64 wheel.

## Prepare the Snapdragon checkout at the hackathon

Clone the same repository on the PC, then enter that checkout:

```sh
git clone https://github.com/davidmoshal/SecondHands.git
cd SecondHands
uv sync --locked
uv run --locked python -c "import platform, secondhands; print(platform.system(), platform.machine())"
```

The final command checks that the Python package imports and reports the execution platform. It does not load a recognition model. These PC commands are a procedure to test, not recorded successful results. `just setup` and `just setup-python` include the PyTorch extra, so use the base commands above until its Windows execution path is established. If dependencies cannot be installed, record the failing package and interpreter architecture before changing the environment.

Install the UI dependencies on the PC only if building or running the UI there. With just installed, use `just setup-ui` and `just dev-ui`. The justfile selects PowerShell on Windows; this setting and the recipes remain untested on the PC. Do not copy the Mac's `node_modules` or `.venv`.

## Send changes between machines

1. On the Mac, edit and test the intended change. Review `git status`, stage the intended files, and commit them.
2. Push the commit from the Mac:

   ```sh
   git push origin main
   ```

3. In the PC's checkout, pull the same branch and update its environment:

   ```sh
   git pull --ff-only origin main
   uv sync --locked
   ```

4. Run the relevant commands on the PC and inspect its output. If UI dependencies changed and the UI is used there, run `pnpm --dir ui install --frozen-lockfile` there too.

The PC command above updates the base Python environment. Enable an optional model extra only after establishing a supported execution path on that machine. If a pull refuses because of local changes or branch divergence, reconcile those changes before continuing; preserve work on both machines.

If editing on the PC, commit and push there, then pull on the Mac. Use separate branches when both machines are making changes concurrently. After pulling on the Mac, use `uv sync --locked --extra pytorch` to retain its PyTorch development environment.

## Run PC commands through T3

Install T3 and configure the chosen coding-agent provider on the PC. Connect the Mac to that PC environment through T3 Connect or network pairing, following [T3's remote-access instructions](https://github.com/pingdotgg/t3code/blob/main/docs/user/remote-access.md). The documented automatic desktop-managed SSH setup targets Linux and Apple Silicon Mac hosts; use the Windows installation and pairing route for this PC.

A command started in the PC's T3 environment executes on the PC, using its checkout, Python environment, files, and available hardware. A command started in the Mac environment executes on the Mac. Confirm the selected environment and working directory before running commands.

The local application now has Python capture frames and run inference, with Vue displaying that process's results. A remote application connection still needs separate configuration and device verification; opening a dashboard page on the Mac alone does not select the PC's camera. The current services bind to loopback and permit local Vite browser origins only.

## Windows ARM64 compatibility limit

The repository's lockfile was inspected on 2026-10-16. Its PyTorch 2.14.1 and torchvision 0.29.1 entries contain CPython 3.12 packages for macOS ARM64 and Windows x64, but no matching native Windows ARM64 wheels. A wheel is a prebuilt Python package. This is a finding about the current lockfile, not a claim that no alternative distribution exists.

A later index check on 2026-10-17 found native Windows ARM64 PyTorch 2.14.1 CPU wheels on the PyTorch package index, but no Windows ARM64 wheel for ExecuTorch 1.5.1 or OpenCV; see [the package availability table](../design/tech-stack.md#runtime-on-the-snapdragon-laptop). The Mac PyTorch extra is therefore verified only on the Mac. A supported Windows inference runtime or an x64 Python environment under emulation remains an investigation; neither path has been verified for SecondHands. Do not treat the Mac installation as proof of Windows or Qualcomm NPU support. The [Compute Track summary](../hackathon-compute.md#compute-deployment-and-verification) owns the supplied ExecuTorch baseline procedure. [SH-Q-001](../project.md#sh-q-001--model-and-runtime-selection) remains open for model and runtime selection.

## Check a change

For Python package changes, run the relevant behavior tests when present, plus:

```sh
uv run --locked ruff check src
uv run --locked ruff format --check src
uv build
```

For UI changes:

```sh
pnpm --dir ui build
```

Run the Python baseline tests with `just test-vision`. The real-model integration test is opt-in and requires downloaded bundles. On the Mac, enable it with:

```sh
SECONDHANDS_TEST_MODELS=artifacts/mediapipe uv run --locked --extra vision pytest -q
```

For the complete dashboard checks, including the Vue transport tests and production build:

```sh
SECONDHANDS_TEST_MODELS=artifacts/mediapipe just test-dashboard
```

The environment variable uses Mac shell syntax. These checks use mocked capture and public image inputs; they do not open a physical camera. API tests skip when the optional dashboard dependencies are not installed.

The earlier Mac [setup verification](../project.md#setup-verification) covers packaging, a PyTorch CPU calculation, lint, formatting, and the UI production build. The [MediaPipe observations](../experiments-before-saturday.md#mediapipe-baseline-observations) record the later model checks. Neither establishes personalized recognition accuracy, real-camera operation, remote connectivity, or Windows execution.
