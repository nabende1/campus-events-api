# Campus Events API

A standalone Node.js + Express API project with four collections:
- `organizers`
- `events`
- `venues`
- `registrations`

The `events` collection stores 9+ fields per document (title, date, location, organizerId, venueId,
category, startTime, endTime, isVirtual, and optional description), satisfying the final-project
requirement for at least one collection with 7 fields or more.

## Run locally

1. Install dependencies:
   - `npm install`
2. Copy `.env.example` to `.env` and set your MongoDB URI.
3. Generate Swagger output:
   - `npm run swagger`
4. Start server:
   - `npm run dev`

## Routes

- Organizers: `GET/POST /organizers`, `GET/PUT/DELETE /organizers/:id`
- Events: `GET/POST /events`, `GET/PUT/DELETE /events/:id`
- Venues: `GET/POST /venues`, `GET/PUT/DELETE /venues/:id`
- Registrations: `GET/POST /registrations`, `GET/PUT/DELETE /registrations/:id`

## OAuth

- Login route: `/auth/github`
- Callback route: `/auth/github/callback`
- Logout route: `/auth/logout`
- Session status: `/auth`

POST and PUT endpoints are protected by OAuth session authentication by default.

For local testing without OAuth setup, set `AUTH_DISABLED=true` in `.env`.

## Testing

Run unit tests for GET endpoints:
- `npm test`

Seed sample data:
- `npm run seed`

## API Documentation

Swagger UI is available at:
- `/api-docs`
