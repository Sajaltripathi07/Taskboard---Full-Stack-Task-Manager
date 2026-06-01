# Taskboard - Full-Stack Task Manager

A production-quality Kanban board with JWT authentication, drag-and-drop, real-time search/filter, and a polished responsive UI.

**Stack:** React 19 · Vite · Tailwind CSS · React Router v7 · @dnd-kit  
**Backend:** Node.js · Express · JWT · bcrypt · SQLite (sql.js)

---

## Quick Start

```bash
npm run install:all
cp backend/.env.example backend/.env   # set JWT_SECRET
cp frontend/.env.example frontend/.env

npm run dev
# frontend → http://localhost:5173
# backend  → http://localhost:4000
```

---

## API Documentation

**Base URL:** `http://localhost:4000/api`

All responses use:
```json
{ "success": true,  "data": { ... } }
{ "success": false, "message": "Human-readable error" }
```

### Auth

| Method | Endpoint       | Auth | Description        |
|--------|----------------|------|--------------------|
| POST   | /auth/register | —    | Create account     |
| POST   | /auth/login    | —    | Sign in, get token |
| GET    | /auth/me       | ✅   | Current user info  |

**POST /auth/register** body:
```json
{ "name": "Ada Lovelace", "email": "ada@example.com", "password": "secret1" }
```

**POST /auth/login** body:
```json
{ "email": "ada@example.com", "password": "secret1" }
```

Both return:
```json
{
  "success": true,
  "data": {
    "user":  { "id": "uuid", "name": "Ada Lovelace", "email": "ada@example.com" },
    "token": "<jwt>"
  }
}
```

### Tasks *(require `Authorization: Bearer <token>`)*

| Method | Endpoint   | Description             |
|--------|------------|-------------------------|
| GET    | /tasks     | All tasks for this user |
| POST   | /tasks     | Create a task           |
| PUT    | /tasks/:id | Update a task           |
| DELETE | /tasks/:id | Delete a task           |

**Task schema:**

| Field       | Type   | Values                      |
|-------------|--------|-----------------------------|
| id          | string | UUID v4                     |
| title       | string | Required, max 200 chars     |
| description | string | Optional, max 2000 chars    |
| stage       | string | `TODO` `IN_PROGRESS` `DONE` |
| user_id     | string | Set automatically from JWT  |
| created_at  | string | ISO 8601                    |
| updated_at  | string | ISO 8601                    |

---

## Design Decisions & Tradeoffs

**sql.js (WASM SQLite) over better-sqlite3** - no native compilation required; works in any Node environment without build tooling. Tradeoff: DB lives in-memory and flushes to disk after each write. Negligible for this load; swap to better-sqlite3 or PostgreSQL for heavier workloads.

**JWT in localStorage** - simple SPA pattern, no cookie/CSRF complexity. Tradeoff: XSS-vulnerable. For higher-security apps, migrate to httpOnly cookies.

**Single SQLite file** - zero-ops, self-contained. Tradeoff: no horizontal scaling. Migrating to PostgreSQL requires only swapping `src/database/` — controllers and services are untouched.

**Optimistic drag-and-drop** - stage moves update local state instantly, API fires in the background. If API fails, state re-fetches from server. Gives snappy UX while keeping server as source of truth.

**No ORM** - raw SQL with named parameters. More readable for a schema this size, no hidden N+1 queries.

---

## Docker

```bash
docker-compose up --build
```

The SQLite file is persisted in the `sqlite_data` Docker volume — it survives container restarts.

---

## Assumptions

- Single-user-per-account; no team sharing.
- Tasks are private — users can only see their own.
- No email verification (out of scope).
- SQLite sufficient for expected load; architecture supports swap to PostgreSQL.
