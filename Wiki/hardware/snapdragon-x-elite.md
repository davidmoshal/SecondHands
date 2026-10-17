# Dell Snapdragon deployment laptop

**Status:** Deployment laptop identified by the user on 2026-10-17. The processor description below is user-reported. Saved evidence from a separate local setup establishes [Femto Bolt bridge and person-position tests](../setup/ms-09-femto-bolt-bridge.md); SecondHands itself has not been tested on this machine.

## Known hardware

The user supplied this processor description:

> Snapdragon(R) X Elite - X1E80100 - Qualcomm(R) Oryon(TM) CPU (3.42 GHz)

| Field | Recorded value |
| --- | --- |
| Laptop manufacturer | Dell, as identified in the earlier deployment discussion |
| Processor family | Snapdragon X Elite |
| Processor identifier | `X1E80100`, exactly as supplied |
| CPU name | Qualcomm Oryon |
| Reported CPU speed | 3.42 GHz |
| Observed operating system | Windows 11 Pro, version 10.0.26200, ARM64, from the [local setup evidence](../setup/ms-09-femto-bolt-bridge.md#why-a-bridge-was-needed) |

The reported CPU speed is an identification detail, not a measured inference rate or a guarantee of sustained clock speed. Do not infer RAM, exact Dell model, available accelerators, or installed runtime versions from this string.

## Details still to record

Before selecting model sizes or installing deployment packages, record the RAM capacity, exact laptop model, and the architecture of each additional Python or application process. The bridge and person application use x64 Python under ARM64 emulation; native ARM64 capture was tested separately. An x64 process and an ARM64 process can require different packages even on the same laptop.

Also record the installed ExecuTorch and Qualcomm runtime versions and the supplied model-bundle location. Camera detection and standalone capture results are in the [setup summary](../setup/ms-09-femto-bolt-bridge.md#recorded-results). Keep serial numbers, account names, device identifiers, and other personal machine details out of the public record.

The remaining configuration checks are tracked under [SH-T-001 in the plan](../plan.md#snapdragon-deployment).

## Deployment checks

The [movement tracker tech stack](../design/tech-stack.md#runtime-on-the-snapdragon-laptop) records which Python packages publish native Windows ARM64 wheels and which exist only for x64 emulation, checked against package indexes on 2026-10-17. That table explains why the first laptop setup uses x64 Python under emulation and why the ExecuTorch Python package and OpenCV are not installable in a native ARM64 Python today.

Use the [Compute deployment procedure](../hackathon-compute.md#compute-deployment-and-verification) for the supplied ExecuTorch baseline. The event guide describes the expected stack; only tests on this laptop can establish what is installed and working.

Use the [Mac and Snapdragon development runbook](../runbooks/mac-and-snapdragon-development.md) for separate environments, Git synchronization, and remote execution. The laptop is reported to be on the team's Tailscale network as `qcworkshop27.tail2122cc.ts.net`; [the Tailscale access section](../runbooks/mac-and-snapdragon-development.md#access-the-snapdragon-laptop-over-tailscale) gives the SSH and dashboard-forwarding procedure. Successful Mac model runs do not establish Windows compatibility or NPU execution.

For [Orbbec Femto Bolt](femto-bolt.md), the originally requested x86-first reference test remains unverified. The later bridge work tested capture directly on this Dell. The x86 reference laptop and this Snapdragon deployment laptop remain separate test targets. Record camera, Python, model, and dashboard results separately so a successful camera connection is not mistaken for a working SecondHands pipeline.

The [saved local results](../setup/ms-09-femto-bolt-bridge.md#recorded-results) establish initial depth and person-position operation and record a later timeout. They do not establish absolute measurement accuracy, SecondHands deployment, ExecuTorch or NPU execution, or a memory benchmark.
