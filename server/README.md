# CLEAR notification backend — schedule preview only

The repository now includes `scheduler.js` and timezone/DST unit tests. It can calculate which UTC instant corresponds to a learned weekday/hour and the selected lead time, and expose a **read-only** authenticated preview at `GET /schedule` after device registration.

**Not deployed. No notifications are scheduled or sent by this server.** Device records currently live only in memory and are lost on restart. No app user data should be sent to the prototype service.

## Local developer checks
```sh
cd server
npm install
npm test
```

To run the server, configure `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, and `VAPID_SUBJECT` only as private environment variables and run `npm start`.

## Before production
- Choose a durable database with encryption, credential rotation, retention limits and deletion workflow.
- Add authentication, rate limiting, strict origin allowlists, verified push-subscription endpoints, and an abuse/security review.
- Add a real periodic job, idempotent sends and expiration handling (410/404).
- Build device opt-in/opt-out flows and sync **only coarse craving time windows** with explicit consent.
- Deploy behind HTTPS and validate locked-iPhone background push delivery.

For the prototype `POST /device`, use a random 64-character hex bearer token and supply a push subscription, `timezone` (IANA), `windows` (weekday/hour/minute), and optional `leadMinutes` (0–120). `GET /schedule` with the same token returns computed preview timestamps, but `scheduled:false` indicates that no background job exists.
