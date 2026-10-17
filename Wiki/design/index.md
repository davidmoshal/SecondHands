# SecondHands design

The user requested these design documents on 2026-10-16 so the team can explore capabilities before porting to the hackathon PC. The user wants about five candidate integrations working on the Mac and accepts a combination of ExecuTorch and other local runtimes. This is project direction; organizer acceptance of mixed runtimes remains [unconfirmed](../hackathon-compute.md#unresolved-event-details).

- [Recognition and triggers](recognition-and-triggers.md) explains the implemented exploration dashboard, command policy, evidence limits, and remaining decision-model proposals.
- [Runtime stack](runtime-stack.md) explains PyTorch, ExecuTorch, MediaPipe, Mac execution, and the Snapdragon deployment boundary.
- [Implementation briefs](implementation-briefs.md) give each tracker task a self-contained specification: goal, files, contract, acceptance checks, and scope limits, for teammates and coding agents.
- [Movement tracker tech stack](tech-stack.md) proposes the end-to-end stack for the camera-based fitness tracker requested on 2026-10-17: cameras, pose estimation through ExecuTorch, deterministic and trained analysis, runtime tiers on Windows ARM64, the service interface contract, and the document map for the requirements, design, and frontend teammates.

On 2026-10-17, the user approved the reviewed wording and requested implementation through a subagent. The local MediaPipe dashboard and configurable trigger exploration are now implemented, with [recorded checks](../experiments-before-saturday.md#dashboard-implementation-observations). Numerical settings remain editable experiment settings; final demonstration criteria and model selection remain open. Real-camera and Windows execution remain untested. Larger decision-model review is still a proposal.

These pages develop the [current proposal](../proposal.md). [Project direction](../project.md) owns decisions and [the task plan](../plan.md) owns work status. [The runbook](../runbooks/mac-and-snapdragon-development.md) owns executable commands, and [the experiment page](../experiments-before-saturday.md) owns observed results.
