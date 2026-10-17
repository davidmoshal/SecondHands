# On-device advantages

**Status:** Reasons the team is considering on 2026-10-17. On-device means the camera session and the pose inference run on the machine in front of the person, without sending frames to a cloud service. These are stated advantages. They are not yet a measured privacy audit or an offline test of the application.

The [fitness tracker](../design/tech-stack.md) is the hackathon product. The [field sobriety example](field-sobriety.md) is another movement task. Both can show a person's body and surroundings, so both use the reasons below. [Storage and privacy](../design/tech-stack.md#storage-and-privacy) owns where session data sits in the current design.

## Privacy

A home medical test can show more than the measurement. The team's example is a patient doing a test at home in pajamas, or in other private clothes and rooms. A cloud service that receives the camera frames also receives that image of the person's body, condition, and home.

On the device, the frame is processed locally. The result that leaves the session can be a count, a time, a joint angle, or another derived measurement. The picture itself does not have to be uploaded to make the test run. Recordings still stay outside Git under the [public repository rules](../../AGENTS.md#public-repository-content).

This reason does not by itself prove a particular legal or medical privacy standard. A later export, a screen share, or a remote-administration session can still reveal the image. [Tailscale access](../runbooks/mac-and-snapdragon-development.md#access-the-snapdragon-laptop-over-tailscale) is a development path for the team. It is separate from the person's test session.

## Use without an online connection

The camera and the test can run when the machine has no network. A home visit, a clinic room with no reliable connection, or a roadside stop should not have to wait for an upload or a cloud model before the camera works.

That requires the application and its models to be installed beforehand. Losing the network during a test then does not stop capture or inference. This repository has not yet demonstrated a session with the network disconnected.

## What these reasons leave open

The hackathon also scores on-device efficiency separately. That score is about where the model runs and how fast it is, as recorded in the [judging criteria](../hackathon/judging-criteria.md#scoring). It is a different claim from the privacy and offline reasons on this page.
