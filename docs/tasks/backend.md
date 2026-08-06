# Backend Team Tasks

**Team:** 4 students — Backend (Node.js + Express + TypeScript + Prisma + PostgreSQL)

**Read first:** `docs/08_Student_Guide.md` (AI usage, git, Definition of Done),
`docs/09_Setup.md` (environment), `docs/10_Team_Coordinates.md` (integration).

**Key references:** `docs/04_Event_Protocols.md`, `docs/05_Message_Contracts.md`,
`docs/06_Domain_Model.md`, `prisma/schema.prisma`, `shared/`.

**Check command for every task:** `npm run check` from the repo root (or
`npm run check -w @smartdoor/backend`).

> All module folders already exist with `// TODO` stubs. Fill them in — do not
> restructure without asking.

---

## Backend-1 — Auth + Middleware

**Objective:** administrators can log in with a JWT; the standard error format works.

**Files:** `modules/auth/*`, `middleware/auth.middleware.ts`, `middleware/error.middleware.ts`,
`middleware/validate.middleware.ts`, `middleware/notFound.middleware.ts`, `routes.ts`, `app.ts`.

**Docs:** `docs/05` (Contract 7 login + Standard Error Format), `docs/03` UC-1, `docs/06` (Administrator).

**Acceptance criteria:**
- `POST /api/auth/login` validates the body with zod and returns
  `{ access_token, expires_in }` on success (Contract 7), `401` + standard error otherwise.
- Passwords are bcrypt-hashed; never stored in plaintext (NFR-3.3).
- `auth.middleware` protects admin routes (Bearer token → Administrator).
- `error.middleware` returns the standard `{ error: { code, message } }` shape everywhere.
- All routes mounted via `routes.ts` under an `/api` prefix.
- Smoke test: login with the seeded admin (see task note) returns a token; bad
  password returns the standard error.

**AI prompt starter:** see the sample prompt in `docs/08_Student_Guide.md`.

**Stretch:** refresh tokens; role checks (`SUPER_ADMIN`/`ADMIN`/`VIEWER`).

---

## Backend-2 — Users + RFID Cards

**Objective:** full CRUD for users and cards, plus the enrollment session endpoint.

**Files:** `modules/users/*`, `modules/cards/*`.

**Docs:** `docs/01` FR-1.x, FR-2.x; `docs/06` (users, rfid_cards); `docs/05` (Contract 4); `docs/03` UC-3, UC-9.

**Acceptance criteria:**
- `GET/POST/PUT/DELETE /api/users` with validation (zod schemas already stubbed).
- User fields per `docs/06`; status ACTIVE/INACTIVE; delete is soft-disable (NFR).
- `GET/POST/PUT/DELETE /api/cards`; `uid` is unique (FR-2.4); one card per user (FR-2.2).
- Enrollment: `POST /api/cards/enroll` starts a waiting session and `POST /api/cards/enroll/confirm`
  (uid from firmware) assigns the card. Handle `CARD_ALREADY_EXISTS` (Contract 4).
- All admin actions require a valid admin JWT.

**AI prompt starter:** point the AI at `modules/cards/card.schema.ts` + `docs/05` Contract 4;
ask for zod validation, duplicate-uid handling, and the standard error format.

**Stretch:** replace a card (`REPLACE` flow); card status LOST/DISABLED.

---

## Backend-3 — Devices + Heartbeat + WebSocket

**Objective:** devices register, authenticate, and report status; live updates.

**Files:** `modules/devices/*`, `config/websocket.ts`, `websocket/*`, `src/events/*`.

**Docs:** `docs/01` FR-3.x, FR-9.x; `docs/05` (Contracts 1 & 6); `docs/04` (Events 1, 6, 8, 10); `docs/03` UC-2, UC-10.

**Acceptance criteria:**
- `POST /api/devices` registers a device, generates `device_id` + `device_token`
  (Contract 6), and creates the linked Door.
- Device routes authenticate via `Device-ID`/`Device-Token` headers
  (`middleware/device.middleware.ts`) — every device request carries them (FR-9.1).
- `POST /api/devices/heartbeat` (Contract 1) updates `last_seen` + status; returns
  `{ status, heartbeat_interval }`.
- Heartbeat response can tune the interval; offline detection (stale `last_seen`).
- Socket.IO: emit device online/offline + new access log events for the dashboard.
- Invalid token → `401` with standard error (Contract/Event 8).

**AI prompt starter:** "Implement `device.service.register` generating
`device-<uuid>`-style id + random token, with `middleware/device.middleware.ts`
validating headers against the DB. Use `docs/05` Contract 1 and 6 shapes."

**Stretch:** auto-provisioning; device enable/disable endpoint.

---

## Backend-4 — Access Decision + Logs

**Objective:** the access decision engine and audit logging work end-to-end.

**Files:** `modules/access/*`, `modules/logs/*`.

**Docs:** `docs/01` FR-4.x, FR-6.x; `docs/04` (Event 2 decision tree); `docs/05`
(Contracts 2 & 3, enumerations); `docs/06` (access_logs); `docs/03` UC-5, UC-7, UC-8.

**Acceptance criteria:**
- `POST /api/access` (Contract 2): validates device, card, user active, then
  decides via the **decision tree in `docs/04` Event 2**. Returns
  `{ granted, unlock_duration, message, reason }` with the exact `reason` enums.
- Every attempt is logged (FR-6.1) with the fields in `docs/06` access_logs
  (device, door, rfid_uid, user, result, reason, offline).
- `POST /api/access/logs/sync` (Contract 3): accepts the batch upload, stores logs,
  returns `{ uploaded }`.
- `GET /api/logs`: list, search, and filter by user / date / door / device / result
  (FR-6.3, FR-6.4) with pagination.
- Door remains locked on denial; response time goal ≤ 2s (NFR-1.1).

**AI prompt starter:** "Implement the access decision in `access.service.ts`
following the decision tree in `docs/04` Event 2. Map every branch to a
`reason` from `docs/05`. Log each attempt in `access_logs`."

**Stretch:** door permissions per user (future); rate limiting.

---

## Cross-cutting

- After any change to `shared/` or a message contract, tell the other teams.
- Coordinate with the Dashboard team on response shapes and with Firmware on the
  heartbeat/access/upload contracts.
- Keep `docs/05` as the source of truth for JSON shapes.
