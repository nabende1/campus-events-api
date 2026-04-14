# Campus Events API

A standalone Node.js + Express API project with two collections:
- `organizers`
- `events`

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

## API Documentation

Swagger UI is available at:
- `/api-docs`
