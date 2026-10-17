# Medical tests a skeletal tracker can observe

**Status:** Candidate list written on 2026-10-17. The user asked for ten medical tests that skeletal tracking can support, with balance as the example. This page is a shortlist, not a selected protocol, a diagnosis, or a validated measurement. The hackathon product remains the [fitness tracker](../design/tech-stack.md). None of these tests has been run in this repository.

The ordering favors tests whose usual score is a time, a count, or a joint angle that 17 body keypoints can describe with one RGB camera. A published clinical cutoff is not adopted here. [Pose candidates](../references/models/pose-candidates.md) own the model. [On-device advantages](on-device.md) own why the image stays on the machine.

## The ten tests

| Order | Test | Usual record | What skeletal tracking can supply | Main limit |
| --- | --- | --- | --- | --- |
| 1 | One-leg stance | Seconds until the raised foot touches down or the arms move out, often stopped at 30 seconds | Which foot is down, the hold time, a hop, and the arms leaving the sides | Small sway is only a few pixels. The fitness tracker already treats single-leg balance as a baseline, not as this named test. |
| 2 | Four-stage balance | Ten seconds each of feet together, semi-tandem, tandem, and one leg | Stance type from the two ankles, hold time, and a step or arm movement that ends the stage | Tandem feet overlap in a frontal view. A side camera sees the front-to-back foot placement more clearly. |
| 3 | Timed Up and Go | Seconds to stand, walk about 3 metres, turn, walk back, and sit | The sequence of sit, stand, walk, turn, and sit, plus the total time | The 3-metre mark needs a visible floor reference or a known start. The turn can leave the frame. |
| 4 | Short-walk gait speed | Seconds to walk a marked 4-metre or 10-metre path at a usual pace, then speed in metres per second | Step count, cadence, and time between the start and end of the path | Speed needs a known distance. A single camera does not measure metres unless the path is calibrated or depth is available. |
| 5 | Five-times sit-to-stand | Seconds to stand up and sit down five times, preferably without using the hands | Rep count from hip and knee angles, and the time for five completed stands | Using the armrests changes the test. The hands are small in a full-body view, so hand contact is easy to miss. |
| 6 | 30-second chair stand | How many full stands fit in 30 seconds | The same sit-stand count, stopped by the clock | Same chair and hand-use limit as the five-times test. This is a count, not a strength measurement in newtons. |
| 7 | Heel-to-toe walk | Steps walked on a line with the heel touching the toe, plus whether the person steps off | Step count, a foot leaving the line, a pause, and the arms leaving the sides | True heel-to-toe contact needs the feet and the line to be visible. This overlaps the [field sobriety walk-and-turn](field-sobriety.md) and does not judge impairment. |
| 8 | Functional reach | Centimetres reached forward with the fist while the feet stay still | The hand moving forward relative to the shoulder or hip, and whether a foot steps | Centimetres need depth or a calibrated scale. The [tech stack](../design/tech-stack.md#sensing) already treats absolute reach distance as a depth enhancement. |
| 9 | Active range of motion | Degrees at a joint, compared with the other side or with a starting posture | Elbow, shoulder, hip, and knee angles from adjacent keypoints while the person moves through the range | A pose angle is not a goniometer reading until it is compared with one. Clothing and the camera angle change the angle. |
| 10 | Two-minute step test | How many times a knee rises to a target height while marching in place for two minutes | Knee lifts whose height passes the hip or a chosen fraction of the thigh, and the count | The target height is usually the iliac crest, which is not one of the 17 COCO joints. The count needs a stated substitute such as knee height relative to the hip. |

## How the list was cut

A test is on the list when one camera view of the body can produce its usual score without a heart-rate sensor, a floor mat, or a diagnosis. Tests left off include pulse, blood pressure, pain scales, lung capacity, and fine finger coordination. Sit-and-reach and a back-scratch test are close to items 8 and 9, and they need the hand and the foot or the two hands to be visible at once. Pronator drift needs forearm rotation, which a 17-point skeleton shows poorly.

The [field sobriety example](field-sobriety.md) already covers the one-leg stance and the heel-to-toe walk for a different purpose. Reusing the movement does not reuse the interpretation.
