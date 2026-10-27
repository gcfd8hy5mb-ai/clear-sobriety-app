# CLEAR — Sobriety Support

An iPhone-friendly, mobile-first prototype built as a single static HTML page.

## What works
- Sober-day counter and estimated savings
- Emergency craving-support screen with five-minute breathing timer and coping suggestions
- One-tap craving and mood check-ins; optional triggers
- Local time-of-day craving pattern summary, with minimum evidence threshold
- Local settings and wipe-data control

## Limitations
This is an early prototype, not a medical device. It cannot passively detect cravings. It does not yet send background notifications, provide cloud sync, or predict relapse risk. All user entries are stored in this browser's localStorage without encryption: avoid using real sensitive data on shared devices.

## Preview on iPhone
GitHub repository **Settings → Pages → Deploy from a branch → main / root**. Once the Pages deployment succeeds, visit `https://gcfd8hy5mb-ai.github.io/clear-sobriety-app/`. The URL is not verified live until Pages has deployed.

## Safety
If someone drinks heavily or regularly, stopping suddenly can cause serious alcohol withdrawal. Medical guidance should precede abrupt cessation if withdrawal is possible. For seizures, severe confusion, or hallucinations, seek emergency care.

## Next engineering milestones
1. Installable PWA and accessibility checks.
2. Privacy-first notification architecture and real iPhone testing; only promise reliable background support after testing.
3. Better on-device adaptive pattern logic and bias/false-alarm controls.
4. Security/privacy review before any account sync or production use.
