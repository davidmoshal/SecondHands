[windows]
set shell := ["powershell.exe", "-NoLogo", "-NoProfile", "-Command"]

# List the available tasks.
default:
    @just --list

# Install the Mac development environment, including PyTorch and UI dependencies.
setup: setup-python setup-ui

# Install Python dependencies with the optional PyTorch extra.
setup-python:
    uv sync --locked --extra pytorch

# Check PyTorch with a small CPU tensor calculation.
smoke-python:
    uv run --locked --extra pytorch python -c "import torch; print(torch.tensor([1, 2]) * 2)"

# Export and verify an untrained model with ExecuTorch 1.5.1 on the Mac CPU.
smoke-executorch:
    uv run --locked --script experiments/executorch_cpu_smoke.py

# Export YOLO11n-pose to an ExecuTorch XNNPACK .pte and compare it with PyTorch on the CPU.
smoke-yolo-pose-executorch:
    uv run --locked --script experiments/yolo_pose_executorch.py yolo11n-pose.pt 640

# Install the locked UI dependencies.
setup-ui:
    bun install --cwd ui --frozen-lockfile

# Start the UI development server; stop it with Ctrl+C.
dev-ui:
    bun run --cwd ui dev

# Install MediaPipe dependencies alongside the Mac PyTorch environment.
setup-vision:
    uv sync --locked --extra pytorch --extra vision

# Run the Python baseline tests; local-model integration is opt-in.
test-vision:
    uv run --locked --extra vision pytest -q

# Download the official MediaPipe model bundles to local artifacts.
download-mediapipe-models:
    uv run --locked --extra vision python -m secondhands.recognition download-models

# Recognize faces and hand gestures in a local image.
recognize-image image:
    uv run --locked --extra vision python -m secondhands.recognition image {{quote(image)}}

# Preview a bounded camera run; results are printed as JSON lines.
recognize-camera:
    uv run --locked --extra vision python -m secondhands.recognition camera --camera-index 0 --max-frames 300 --preview

# Install the local dashboard API and recognition dependencies.
setup-dashboard:
    uv sync --locked --extra pytorch --extra vision --extra dashboard
    bun install --cwd ui --frozen-lockfile

# Run the local camera API; use dev-ui in a second terminal.
dev-api:
    uv run --locked --extra vision --extra dashboard python -m secondhands.api

# Check Python behavior and the React dashboard, transport, types, and build.
test-dashboard:
    uv run --locked --extra vision --extra dashboard pytest -q
    bun run --cwd ui test
    bun run --cwd ui build

# Explicit downloads use pinned revisions and separate dependency environments.
download-model-samples:
    uv run --locked python -c "from secondhands.recognition.decision_experiments import download_samples; download_samples()"

download-laya:
    uv run --locked --with-editable . --script experiments/laya_vision.py download

download-mapika:
    uv run --locked --with-editable . --script experiments/mapika_vision.py download

download-smolvlm:
    uv run --locked --with-editable . --script experiments/smolvlm.py download

# Run static-image experiments; model files must already be downloaded.
recognize-laya image:
    uv run --locked --with-editable . --script experiments/laya_vision.py run {{quote(image)}}

recognize-mapika image:
    uv run --locked --with-editable . --script experiments/mapika_vision.py run {{quote(image)}}

recognize-smolvlm image:
    uv run --locked --with-editable . --script experiments/smolvlm.py run {{quote(image)}}

# Smoke checks use two public samples; they are not accuracy benchmarks.
test-laya: download-model-samples
    uv run --locked --with-editable . --script experiments/laya_vision.py run artifacts/portrait.jpg artifacts/thumb_up.jpg --output artifacts/results/laya-hand.json

test-mapika: download-model-samples
    uv run --locked --with-editable . --script experiments/mapika_vision.py run artifacts/portrait.jpg artifacts/thumb_up.jpg --output artifacts/results/mapika-hand.json

test-smolvlm: download-model-samples
    uv run --locked --with-editable . --script experiments/smolvlm.py run artifacts/portrait.jpg artifacts/thumb_up.jpg --output artifacts/results/smolvlm-hand.json

test-decision-models: test-laya test-mapika test-smolvlm
