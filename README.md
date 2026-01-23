# ts-http-server

Basic TypeScript/Express HTTP API with PostgreSQL, JWT auth, and simple "chirps"
CRUD endpoints. The server auto-runs Drizzle migrations on startup and serves a
static web app from `/app`.

This is a learning project.

## Requirements

- Node.js (ESM)
- PostgreSQL

## Setup

1. Install dependencies

```bash
npm ci
```

2. Create a `.env` file (or export env vars)

```bash
DB_URL=postgres://user:password@localhost:5432/chirpy
JWT_SECRET=your-secret
PLATFORM=dev
```

Notes:

- `PLATFORM=dev` enables `/admin/reset`; omit or change it in non-dev
  environments.

## Run

```bash
npm run dev
```

The server listens on `http://localhost:8080`.

## Scripts

- `npm run build` - compile TypeScript to `dist/`
- `npm run start` - run the built server
- `npm run dev` - build + run
- `npm test` - run Vitest

## API endpoints (high level)

- `GET /api/healthz` - readiness check
- `GET /admin/metrics` - HTML metrics page
- `POST /admin/reset` - delete users (dev only)
- `POST /api/users` - create user
- `PUT /api/users` - update user credentials (auth required)
- `POST /api/login` - login, returns JWT + refresh token
- `POST /api/refresh` - exchange refresh token for JWT
- `POST /api/revoke` - revoke refresh token
- `POST /api/chirps` - create chirp (auth required)
- `GET /api/chirps` - list chirps (`authorId`, `sort=asc|desc`)
- `GET /api/chirps/:chirpId` - get chirp
- `DELETE /api/chirps/:chirpId` - delete chirp (auth required)
- `POST /api/polka/webhooks` - upgrade user via webhook (API key required)

## Auth

- JWTs are accepted via `Authorization: Bearer <token>`.
- The webhook expects `Authorization: ApiKey <key>` (presence-only check).
