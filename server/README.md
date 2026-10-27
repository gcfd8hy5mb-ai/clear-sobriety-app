# CLEAR notification backend — schedule preview only

The repository now includes `scheduler.js`, timezone/DST unit tests, encrypted persistent SQLite storage, and a read-only due-reminder job preview. It can calculate which UTC instant corresponds to a learned weekday/hour and the selected lead time, and expose a **read-only** authenticated preview at `GET /schedule` after device registration.

**Not deployed. No notifications are scheduled or sent by this server.** Device records now persist in an AES-256-GCM encrypted SQLite database, but production hosting, authentication hardening, a sending job, and a live push subscription flow are still missing. No app user data should be sent to the prototype service.

## Local developer checks
```sh
cd server
npm install
npm test
```

To run the server, configure `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`, and `CLEAR_STORAGE_KEY` (base64-encoded 32 random bytes) only as private environment variables. Set `CLEAR_DB_PATH` to a persistent *private* volume, then run `npm start`. Do not publish these variables.

## Before production
- Choose a durable database with encryption, credential rotation, retention limits and deletion workflow.
- Add authentication, rate limiting, strict origin allowlists, verified push-subscription endpoints, and an abuse/security review.
- Add a real periodic job, idempotent sends and expiration handling (410/404).
- Build device opt-in/opt-out flows and sync **only coarse craving time windows** with explicit consent.
- Deploy behind HTTPS and validate locked-iPhone background push delivery.

For the prototype `POST /device`, use a random 64-character hex bearer token and supply a push subscription, `timezone` (IANA), `windows` (weekday/hour/minute), and optional `leadMinutes` (0–120). `GET /schedule` with the same token returns computed preview timestamps, but `scheduled:false` indicates that no background job exists.

## Current integration status
`server/index.js` now uses the encrypted SQLite store, and `server/job-preview.js` can identify due reminders without contacting any push provider. There is no active sending worker, external deployment, or iPhone subscription sync. The tests have not yet been independently executed. The server remains prototype-only and should not be exposed publicly without additional authentication, origin/abuse controls, and security review.

## October 27 backend milestone
- `dispatch.js` now exposes an explicit `dispatch(now)` sending function. **No automatic process calls it yet.**
- Corrected due-time calculations to include the warning lead time; added regression tests for 30-minute and zero-minute leads.
- Required before enabling real delivery: authenticated opt-in client registration, secure backend hosting, persistent private disk, server-only credentials, durable distributed dispatch locking, retry handling, notification quotas, rate limiting, endpoint validation, and supervised locked-iPhone testing.
- **Important:** This prototype is not hardened for public internet access. Do not expose it or rely on it for recovery support until security testing is complete.

## Worker commands (new)
`npm run preview:reminders` reads encrypted device records and prints **only a count** of due reminders; it never sends one. `npm run dispatch:reminders` calls the delivery worker **only when** private environment variable `CLEAR_ALLOW_DELIVERY=yes` and the VAPID credentials are available. Neither command is scheduled by GitHub Pages.

**Production blocker:** GitHub Pages cannot run the Node server. A persistent secure runtime and private encrypted database are required. Serverless Vercel functions with only local SQLite files are not a reliable persistent store. Do not enable delivery until hosting, device registration, security controls and locked-iPhone end-to-end tests are finished.
