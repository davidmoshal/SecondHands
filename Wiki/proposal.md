> **Status:** Current proposal, supplied by the user on 2026-10-14. Its camera selection was updated to Orbbec Femto Bolt at the user's request on 2026-10-17. It describes intended capabilities, not verified implementation. Technical and market-size claims have not been independently checked in this documentation update. See [Project direction](project.md) for the relation to earlier decisions and remaining evidence gaps.

> **Superseded on 2026-10-17.** The user confirmed that the project is now a camera-based fitness tracker; see [the movement tracker tech stack](design/tech-stack.md). This page is retained as the previous idea until the team rewrites it under [SH-T-048](plan.md#dependencies-and-order).

# SecondHands
**Making the Physical World Accessible Through AI**

*ExecuTorch Hackathon 2026 — Compute Track*

### The Vision

What if, instead of requiring people with disabilities to adapt to their environment, we could make the physical world adapt to them?

SecondHands is an affordable, adaptable AI-powered system that enables people with limited mobility to interact with everyday objects using whatever voluntary movements they can still perform.

For someone living with paralysis, ALS, or another mobility-limiting condition, a small head movement, facial gesture, or hand motion could become a way to switch on a lamp, open a curtain, operate an appliance, or request assistance.

**The goal is simple: translate remaining physical abilities into greater independence.**

### How It Works

SecondHands combines depth sensing, local AI decision-making, and modular physical controls.

1. **Sense:** An [Orbbec Femto Bolt camera](hardware/femto-bolt.md) supplies RGB and depth data for movement recognition. Validate capture on the x86 Windows laptop before the Dell Snapdragon PC.
2. **Personalize:** The system guides each user through a short calibration process, identifying movements they can perform comfortably and consistently.
3. **Decide:** Lightweight PyTorch models running through ExecuTorch recognize movements in real time. Clef-Flash, an open-weight multimodal decision model, provides a potential higher-level decision layer for interpreting user-specific actions and configurable choices.
4. **Act:** A connected Arduino or other microcontroller operates a physical mechanism, translating the recognized intention into a real-world action.

All sensing and AI processing are designed to run locally, without transmitting personal camera data to cloud services.

### The Hackathon Demonstration

We will demonstrate a person controlling a physical object—such as a small lamp or model curtain—using a personalized gesture.

The key differentiator will be **adaptive calibration**.

Two volunteers will use different intentional movements to perform the same action. One might tilt their head; the other might raise a hand or make a small facial movement.

SecondHands will demonstrate how different physical abilities can be mapped to the same everyday control.

A live interface will display the detected movement, selected action, confirmation status, and measured response latency.

### Technical Innovation

SecondHands brings together:

- **Meta ExecuTorch:** Efficient on-device PyTorch inference for continuous sensing and gesture recognition.
- **Qualcomm Snapdragon X Elite:** Local AI processing on the Copilot+ PC, with supported hardware acceleration where available.
- **Clef-Flash:** Experimental schema-driven multimodal decisions, enabling flexible interpretation of different users' movements and contextual choices.
- **[Orbbec Femto Bolt](hardware/femto-bolt.md):** Color and depth input; hardware capture and gesture recognition require separate validation.
- **Arduino and modular actuators:** Physical interaction with ordinary objects.

The architecture separates fast, continuous movement recognition from higher-level decision-making, allowing the system to remain responsive while supporting personalized controls.

### The Opportunity

The need is substantial. Research has estimated approximately 5.4 million Americans living with paralysis, while the World Health Organization estimates that more than 2.5 billion people worldwide need at least one form of assistive technology.

SecondHands would initially focus on people with significant mobility limitations, with potential applications in independent living, rehabilitation, aged care, and eventually mainstream touchless control.

Rather than requiring expensive replacement devices, the longer-term vision is a platform of affordable, modular attachments that can make existing household objects more accessible.

### Beyond the Hackathon

SecondHands could eventually support:

- Personalized controls that adapt as physical abilities change.
- Modular attachments for household objects.
- Rehabilitation and assistive-technology partnerships.
- Affordable independent-living solutions.
- Everyday touchless interfaces for broader consumer markets.

### Our Mission

**People shouldn't have to adapt to technology. Technology should adapt to what people can do.**

SecondHands gives people a new way to interact with the physical world—using the movements they have, rather than the movements technology traditionally demands.
