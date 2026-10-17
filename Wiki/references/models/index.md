# Model references

**Pose estimation for the movement tracker:** see [pose model candidates and the Qualcomm handoff](pose-candidates.md), added on 2026-10-17 after Qualcomm staff recommended RTMPose.

This index owns the SecondHands model candidates, their suggested roles, and the current recommended order. The user requested this reference on 2026-10-16, supplying the five-candidate recommendation below. Recording that recommendation does not establish a final model/runtime selection or a tested deployment. [SH-Q-001](../../project.md#sh-q-001--model-and-runtime-selection) owns that decision; the [task plan](../../plan.md) owns execution status.

The first inputs are the computer's built-in camera, as recorded in [Project direction](../../project.md#established-user-direction). All five starting candidates now run on public sample images on the Mac. [The image observations](../../experiments-before-saturday.md#decision-model-image-observations) separate execution checks from accuracy evaluation and record false face classifications from Laya and SmolVLM. Camera operation, participant accuracy, and Windows execution remain open. The earlier Python CPU tensor check is not a model evaluation.

## Recommended starting order

1. [MediaPipe Face Landmarker](mediapipe-face-landmarker.md) — facial landmarks and facial movement measurements; a recognition model bundle.
2. [MediaPipe Gesture Recognizer](mediapipe-gesture-recognizer.md) — hand landmarks and common static hand gestures; a recognition model bundle.
3. [Laya Vision 201M](laya-vision-201m.md) — the first configurable visual decision-model experiment.
4. [Mapika Decider 2B Vision](mapika-decider-2b-vision.md) — a larger decision-model comparison against Laya on the same observations.
5. [SmolVLM-500M-Instruct](smolvlm-500m-instruct.md) — an advanced Qualcomm ExecuTorch investigation using a generative vision-language model.

The recommended starting combination is Face Landmarker, Gesture Recognizer, and Laya Vision. The first two measure visible movements; Laya tests questions and choices that can be configured. These are complementary roles, not five interchangeable classifiers. Clef-Flash remains [deferred](#clef-flash-9b).

Live-stream input does not by itself establish recognition of a sequence such as nodding, or show that a movement was an intentional command. Test observations over time, personalized calibration, uncertain inputs, and repeated activations separately. The [experiment topic](../../experiments-before-saturday.md#measurements) owns measurements and observed smoke results; the comparative evaluation remains unrun. The [system design](../../design/index.md) explains proposed triggering and runtime roles.

## Supplied framework baseline

### DeepLabV3

**Status: supplied-demo baseline, separate from the top five.** The [Compute guide](https://github.com/aaishikasb/qc-executorch-guide/blob/9f3aae1f53053729ed28a242643e39feaf38fb9d/Compute/README.md) describes the supplied `dlv3_qnn.pte` segmentation model and matching runtime. The [Compute summary](../../hackathon-compute.md#compute-deployment-and-verification) owns the setup and verification requirements. The archive proposes using person segmentation for larger silhouette changes; this is not a demonstrated gesture or facial-expression recognizer. Actual-device execution remains open under SH-T-009.

## Other candidates from captured chats

The candidates below are retained research leads, without a new ranking. Their roles and source-stated limits come from [exchange 4](../../SecondHands-conversation.md#exchange-4--camera-hardware-and-model-options) and [exchange 5](../../SecondHands-conversation.md#exchange-5--decision-model-ranking), including the older VENTUNO Q ranking quoted by the user. External links identify the original reference; availability, licenses, benchmark figures, and deployment support have not been reverified for these candidates in this change, except for the stated HSEmotion capability check. None has a verified SecondHands execution path.

### MobileCLIP2-S0

**Retained comparison baseline.** The archive proposes [MobileCLIP2-S0](https://huggingface.co/apple/MobileCLIP2-S0) for image/text similarity, such as comparing a frame with descriptions of hand or head positions. It is not a native typed decision model, and similarity is not established command confidence. The archive flags separate Apple model-weight terms and an unverified ExecuTorch port. It remains in the earlier [three-model comparison proposal](../../experiments-before-saturday.md#models-and-observations).

### Clef-Flash 9B

**Deferred experiment, not excluded.** The current recommendation defers [Clef-Flash](https://huggingface.co/Cloudflare/clef-flash) because of its size and unverified target-device performance. The archive proposes occasional higher-level multimodal decisions using images, context, and an action menu. The proposal's experimental Clef-Flash role remains recorded in [the supplied proposal](../../proposal.md#how-it-works); it is not a prerequisite for continuous recognition. RAM, Windows ARM64 execution, and an ExecuTorch path remain unverified.

### InternVL3-1B

**Retained ExecuTorch research lead.** The archive lists InternVL3-1B alongside SmolVLM as a generative vision-language model with an upstream Qualcomm recipe. The [upstream model guide](https://github.com/pytorch/executorch/blob/main/examples/qualcomm/oss_scripts/llama/README.md) is the reference to check before a deployment attempt. This listing does not establish a Windows package, typed decision output, or performance on the event PC.

### Vision-Jev 0.8B

**Retained experimental decision-model lead.** The archive describes [Vision-Jev](https://huggingface.co/LMDHQ-0420/vision-jev) as a Qwen3.5-0.8B backbone with adapters and typed Choice, Noul, and Score heads. Here those terms mean option selection, yes/no probability, and a value on an ordered scale. Base weights, adapter compatibility, the serving pipeline, and target-device performance need verification. The archive's reported latency is not a Compute PC measurement.

### JEVision 0.8B

**Retained experimental decision-model lead.** The archive describes [JEVision](https://huggingface.co/divyanshx11/JEVision) as a separate Qwen3.5-0.8B-based project with adapters, typed decisions, and a bundled local serving runtime. Its source-stated Linux/NVIDIA testing does not establish Windows ARM64 support. Do not merge this candidate with Vision-Jev merely because their names and backbones are similar.

### SelfJev-4B Vision

**Retained lower-priority research lead.** The archive describes [SelfJev-4B Vision](https://huggingface.co/Jwuthrich/selfjev-4b-vision) as a 4B backbone plus a LoRA adapter, which is a separately trained set of model adjustments. It flags a CUDA-oriented image path. That path is not evidence of a usable Snapdragon runtime; portability, memory, and performance remain unverified.

### Laya 322M and 421M

**Retained second-stage decision-model leads.** The archive describes [Laya 421M and multilingual 322M](https://huggingface.co/convaiinnovations/laya) as text/JSON models, distinct from Laya Vision 201M. Their proposed input is structured observations, a calibration profile, and application context after visual features have been extracted. The source does not present them as direct camera-image recognizers. Exact checkpoints, feature encoding, and execution support remain unverified.

### MediaPipe Pose Estimation

**Retained body-movement recognition lead.** The archive proposes [the Qualcomm AI Hub MediaPipe Pose entry](https://aihub.qualcomm.com/models/mediapipe_pose) for body landmarks and movements such as leaning or raising a shoulder. It may be useful when hand movements are limited. The selected package, runtime, landmark quality, and Compute availability need verification.

### MediaPipe Face Detection

**Retained face-detection lead.** The archive links [the Qualcomm AI Hub MediaPipe Face entry](https://aihub.qualcomm.com/models/mediapipe_face) for face location and coarse face movement. It does not establish the 52-blendshape Face Landmarker pipeline recommended above. Check the exact model outputs before treating the two entries as substitutes.

### PoseNet MobileNet

**Retained pose-estimation alternative.** The archive proposes [PoseNet MobileNet](https://aihub.qualcomm.com/models/posenet_mobilenet) for body-joint measurements and deliberate upper-body or arm movement. It is an alternative to the pose-estimation candidate, not a configurable decision model. Runtime availability and recognition quality on SecondHands observations remain unverified.

### MobileNetV2 and MobileNetV3-Small

**Retained custom-classifier backbones.** The archive proposes [MobileNetV2](https://aihub.qualcomm.com/models/mobilenet_v2) and [MobileNetV3-Small](https://aihub.qualcomm.com/models/mobilenet_v3_small) for a trained gesture classifier. Standard ImageNet classes are not SecondHands commands. This route would require labeled data, training, and export/runtime verification rather than assuming that pretrained weights recognize the chosen gestures.

### HSEmotion EfficientNet-B0

**Retained facial-expression baseline from the older ranking.** The user quoted this candidate in [exchange 5](../../SecondHands-conversation.md#exchange-5--decision-model-ranking); its absence from the assistant's later ranking is not an exclusion. The [HSEmotion primary repository](https://github.com/av-savchenko/hsemotion), checked on 2026-10-16, documents EfficientNet-B0 variants and fixed emotion-category outputs from a face image. Those labels are a different output from Face Landmarker's facial movement measurements or a personalized intentional command. The exact checkpoint, current dependencies, gesture suitability, and Windows/ExecuTorch support remain unverified.

### SigLIP2

**Retained conditional image/text-similarity lead.** The archive suggests [SigLIP2](https://aihub.qualcomm.com/compute/models/siglip2) as an alternative comparison if MobileCLIP2 is difficult to deploy. It records a then-current Compute catalog status of “Not supported”; that historical observation is not a fresh check or a project-wide exclusion. Verify the selected model, runtime, device, and current catalog status before attempting deployment.

### MediaPipe landmarks with a small PyTorch classifier

**Retained custom-model design, not a released checkpoint.** The archive proposes hand, face, or body landmarks followed by a small trained classifier, including a multilayer perceptron (MLP), to map observations to personalized actions. ExecuTorch execution is a proposed deployment goal, not a completed conversion. Training data, classes, temporal inputs, and export support remain undecided. This design can be compared with the configurable decision models without treating them as equivalent approaches.

## Review scope and exclusions

The review read the full available [captured conversation](../../SecondHands-conversation.md#import-scope), the maintained proposal and project context, the Compute summary, the experiment proposal, and the task plan. The public archive now contains marked privacy redactions. It remains partial: missing earlier messages, attachments, and citation targets were not reconstructed. This index incorporates model identities, suggested roles, and relevant limits; it does not incorporate all historical rankings, benchmark numbers, or hardware claims as current facts.

No explicit user exclusion of a model was found in the captured exchanges. The older hardware-specific assessment that Clef-Flash was too large for VENTUNO Q was later reconsidered for Compute. Deferred models, lower-priority models, and unverified catalog entries therefore remain visible here. The Qualcomm AI Hub hand-gesture package is recorded on the [Gesture Recognizer page](mediapipe-gesture-recognizer.md#qualcomm-package-lead), rather than counted as a new top-five model. Backbone names such as Qwen3.5 are context for their derived candidates, not separate recommendations in the captured source.
