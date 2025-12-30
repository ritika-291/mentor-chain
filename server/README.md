# MentorChain Server — Mentor Profile Endpoints

## Endpoints (Mentor Profile)

- GET /api/mentors/:mentorId/profile
  - Public endpoint to fetch mentor's user info and profile data.

- PUT /api/mentors/:mentorId/profile
  - Protected endpoint. Requires Authorization: Bearer <token> and role `mentor`.
  - Payload fields (any subset): `bio` (string), `expertise` (array of strings), `avatar_url` (string), `hourly_rate` (number), `availability_status` ('available'|'busy').

## Seed script

You can seed a sample mentor with a profile by running:

```
node server/tools/seed.js
```

Make sure your `.env` contains DB credentials and `DB_NAME`.

### Google Calendar Integration

Add these environment variables to `server/.env` to enable Google OAuth and syncing:

- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GOOGLE_REDIRECT_URI  (e.g., https://yourdomain.com/api/mentors/calendar/oauth/callback)
- CALENDAR_SYNC_INTERVAL_MIN (optional, defaults to 15 minutes)

Endpoints added:
- GET /api/mentors/:mentorId/calendar/connect/url — returns the Google OAuth URL (mentor must be authenticated and owner)
- GET /api/mentors/calendar/oauth/callback — OAuth callback used by Google to return auth code; stores tokens
- POST /api/mentors/:mentorId/calendar/connect — placeholder to store tokens directly (mentor-auth required)

Notes:
- Install `googleapis` package: `npm i googleapis`
- The background sync job fetches events for the next 7 days and stores them in `calendar_events` table. This is a minimal implementation; extend as needed for conflict detection or full two-way sync.


