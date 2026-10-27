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
