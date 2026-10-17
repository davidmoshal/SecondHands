# Field sobriety observation example

**Status:** Example application requested on 2026-10-17. It shows how the same local camera and pose pipeline could watch a standardized field sobriety test. It is not the hackathon project. The confirmed direction remains the [fitness tracker](../design/tech-stack.md). Nothing on this page is implemented, and no impairment study has been run.

## What this example is

A field sobriety test is the roadside procedure an officer uses to watch a driver perform a small set of physical tasks. In the United States, the National Highway Traffic Safety Administration publishes the Standardized Field Sobriety Test battery: horizontal gaze nystagmus, the walk-and-turn, and the one-leg stand ([NHTSA SFST resources](https://www.nhtsa.gov/dwi/dwi-detection-and-standardized-field-sobriety-test-sfst-resources)). This page uses those task names as the example. It does not copy the officer instructions, and it does not adopt NHTSA's validation figures as project evidence.

The useful part for this repository is the body movement. The [movement tracker stack](../design/tech-stack.md#architecture) already turns a camera frame into body keypoints and then into joint angles, counts, and balance time. The same measurements can describe the walk-and-turn and the one-leg stand. Horizontal gaze nystagmus is an eye observation. The 17-keypoint body models do not measure it. [Face Landmarker](../references/models/mediapipe-face-landmarker.md) reports facial landmarks, which is still not a nystagmus test.

This example is separate from Kate's [clinical application](https://github.com/davidmoshal/SecondHands/issues/7). That application still has no defined requirements.

## Movements the pose pipeline can describe

These are observation targets for a later experiment, not a scoring rubric and not a claim that the current models can detect them.

| Task | What a person does | What keypoints can describe | What remains hard |
| --- | --- | --- | --- |
| Walk-and-turn | Walk a counted series of heel-to-toe steps along a line, turn, and walk back | Step count, whether a foot leaves the line, whether the arms leave the sides, a stop in the walk, and whether the turn stays in place | True heel-to-toe contact and a straight line need a visible floor reference. A single frontal camera can hide the feet. |
| One-leg stand | Stand on one leg for a timed interval with the other foot raised | Which foot is down, how long it stays down, hops, the raised foot returning to the ground, and the arms moving out for balance | Small sway is a few pixels at the hips and ankles. Camera distance and a loose shirt change that signal. |

A session could show the skeleton, the step count, the balance time, and which of those visible events occurred. The person operating the system would still decide what the events mean. The software would report measurements.

## What this example does not do

- It does not estimate blood alcohol, drug impairment, or fitness to drive.
- It does not produce a pass, fail, or legal conclusion.
- It does not replace an officer, a clinician, or a breath or blood test.
- It does not claim the accuracy, sensitivity, or specificity reported for the human-administered test.
- It does not change the hackathon demonstration, which remains one guided fitness session.

Recording of a real test, a real roadside stop, or a person who may be impaired stays outside Git under the [public repository rules](../../AGENTS.md#public-repository-content). Keeping that image on the machine, and running the camera with no network, are the [on-device advantages](on-device.md).

The one-leg stance and the heel-to-toe walk also appear on the [skeletal medical-test list](skeletal-medical-tests.md). There they are mobility observations. Here they stay part of the field-sobriety example, and neither page judges impairment.

## Relation to the current stack

The fitness tracker's single-leg balance baseline is the nearest implemented concept: a timed one-leg stance scored from pose. The field-sobriety example adds a counted walk, a turn, and explicit arm and foot events. Those events can reuse the same keypoint message. They need their own state machine, their own acceptance checks, and a recording of a sober rehearsal before anyone compares them with an impaired performance.

[Pose candidates](../references/models/pose-candidates.md) still own model choice. YOLO-pose and RTMPose supply body joints. Neither has been run on a walk-and-turn or one-leg-stand recording in this repository.
