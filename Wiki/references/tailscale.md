# Tailscale

The project owner reported on 2026-10-17 that Tailscale is now available for the project. Remote command access to the [Dell Snapdragon laptop](../hardware/snapdragon-x-elite.md) has not been verified in this session.

## Local installs

| Machine | Tailscale status | Evidence |
| --- | --- | --- |
| Dell Snapdragon laptop, `qcworkshop27.tail2122cc.ts.net` | Reported installed | Project owner report, 2026-10-17. Not checked from another tailnet device. |
| Project owner's Mac | Installed and signed in | Assistant check, 2026-10-17: standalone variant `io.tailscale.ipn.macsys` 1.104.1. The laptop was not yet reachable; see [the connection check](#connection-check-on-2026-10-17). |

Install on a Mac with [the runbook procedure](../runbooks/mac-and-snapdragon-development.md#access-the-snapdragon-laptop-over-tailscale). Update this table when a machine is installed or joins the tailnet.

## Connection check on 2026-10-17

The project owner's Mac is partly connected: it lists the laptop in Tailscale, but the laptop did not answer, so SSH could not be tested.

**Working:**

- The project owner's Mac is signed in to Tailscale.
- The laptop appears in the Mac's device list as `qcworkshop27.tail2122cc.ts.net`, shared from Vishwa's tailnet. Tailscale's control server marked it `Online`, connected through the `sfo` relay.
- The Mac is in the project owner's own tailnet, not Vishwa's. The [team invitation](#team-invitation) acted as a device share, not a tailnet membership.

**Not working:**

1. `tailscale ping` to the laptop got no reply. Tailscale itself answers this ping, not Windows networking, so the Windows firewall is probably not the cause. Possible causes, most likely first: the laptop was asleep or its Tailscale was stalled while the server still showed it online; or access rules in Vishwa's tailnet block shared-in users, which has not been checked.
2. The laptop's MagicDNS name did not resolve on the Mac, because MagicDNS is off in the project owner's tailnet. Use the laptop's Tailscale IP address from `tailscale status` instead, or turn on MagicDNS under DNS in that tailnet's admin console.
3. Port 22 at the laptop's Tailscale address was unreachable. This is expected until the ping works; SSH also needs Windows OpenSSH Server running.

**Next checks.** Keep the laptop awake, confirm that the share to the Mac is active, and run on the laptop in PowerShell:

```powershell
tailscale status
tailscale ping <mac-tailscale-ip>
Get-Service sshd
```

Then on the Mac:

```sh
/Applications/Tailscale.app/Contents/MacOS/Tailscale ping <laptop-tailscale-ip>
ssh <windows-account>@<laptop-tailscale-ip>
```

## Team invitation

[Join through the supplied Tailscale invitation](https://login.tailscale.com/admin/invite/5GZdcQw46KEm63iM63cS11).

The project owner supplied this exact link and requested its inclusion on 2026-10-17. This is an invitation, not a general documentation link. Publishing this page in the public repository makes the invitation visible to everyone. Its expiry and access restrictions have not been checked.

## Remote access work

The connection procedure, including the reported laptop name, is in [the runbook](../runbooks/mac-and-snapdragon-development.md#access-the-snapdragon-laptop-over-tailscale). See [issue #9](https://github.com/davidmoshal/SecondHands/issues/9) for the requested setup and [the deployment plan](../plan.md#snapdragon-deployment) for task status. Availability of Tailscale alone does not establish that SSH commands work on the laptop.
