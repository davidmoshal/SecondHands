# Tailscale

The project owner reported on 2026-10-17 that Tailscale is now available for the project. Remote command access to the [Dell Snapdragon laptop](../hardware/snapdragon-x-elite.md) has not been verified in this session.

## Local installs

| Machine | Tailscale status | Evidence |
| --- | --- | --- |
| Dell Snapdragon laptop, `qcworkshop27.tail2122cc.ts.net` | Reported installed | Project owner report, 2026-10-17. Not checked from another tailnet device. |
| Project owner's Mac | Not installed | Assistant check, 2026-10-17: no `tailscale` command, no app in `/Applications`, no Tailscale process, and the laptop's MagicDNS name did not resolve. |

Install on a Mac with [the runbook procedure](../runbooks/mac-and-snapdragon-development.md#access-the-snapdragon-laptop-over-tailscale). Update this table when a machine is installed or joins the tailnet.

## Team invitation

[Join through the supplied Tailscale invitation](https://login.tailscale.com/admin/invite/5GZdcQw46KEm63iM63cS11).

The project owner supplied this exact link and requested its inclusion on 2026-10-17. This is an invitation, not a general documentation link. Publishing this page in the public repository makes the invitation visible to everyone. Its expiry and access restrictions have not been checked.

## Remote access work

The connection procedure, including the reported laptop name, is in [the runbook](../runbooks/mac-and-snapdragon-development.md#access-the-snapdragon-laptop-over-tailscale). See [issue #9](https://github.com/davidmoshal/SecondHands/issues/9) for the requested setup and [the deployment plan](../plan.md#snapdragon-deployment) for task status. Availability of Tailscale alone does not establish that SSH commands work on the laptop.
