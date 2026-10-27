# CLEAR push backend — foundation, NOT deployed

This is an isolated Node.js prototype for web-push registration. It **does not schedule or send** notifications and deliberately stores records only in memory. Do not deploy it as a production service or enter actual recovery information.

Requirements for making it real:
1. Provision secure hosting with HTTPS and persistent encrypted-at-rest storage.
2. Configure VAPID keys as **server secrets**, never in the public GitHub repository.
3. Add production-grade device authentication, origin checks, rate limiting, quotas, subscription removal and deletion.
4. Build a scheduled job to calculate each device's next alert in its IANA time zone, with DST handling and idempotency.
5. Send notifications using `webpush.sendNotification` only after server opt-in; handle expired endpoints, retries and suppression.
6. Only sync coarse time windows after explicit consent; never upload journal contents or symptom notes.
7. Test iPhone notifications with CLEAR closed and locked. Permission alone is not proof of server delivery.

Run locally: `npm install`, then `VAPID_PUBLIC_KEY=... VAPID_PRIVATE_KEY=... VAPID_SUBJECT=mailto:... npm start`.

The `POST /device` and `DELETE /device` routes accept a 64-character random device bearer token. Registration intentionally returns `scheduled:false` and `persistent:false` to prevent suggesting the feature is live.
