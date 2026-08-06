# Dashboard Team Tasks

**Team:** 4 students — Dashboard (React + TypeScript + Vite)

**Read first:** `docs/08_Student_Guide.md` (AI usage, git, Definition of Done),
`docs/09_Setup.md` (environment), `docs/10_Team_Coordinates.md` (integration).

**Key references:** `docs/07_Dashboard_Specification.md`, `docs/05_Message_Contracts.md`,
`docs/03_Use_Cases.md`, `shared/` (types are imported from here).

**Check command for every task:** `npm run check` from the repo root (or
`npm run build -w @smartdoor/dashboard`).

> Page shells, components, hooks, and service stubs already exist in `dashboard/src/`.
> Fill them in. All types come from `@smartdoor/shared` — do not create local copies.

**Stack already installed:** React 19, TypeScript, Vite, react-router-dom,
socket.io-client. **Not installed (optional stretch):** Tailwind, shadcn/ui,
TanStack Query — add only with team-lead approval (see `docs/07` for the vision).

---

## Dashboard-1 — API client + Auth + Layout

**Objective:** login works, protected routes exist, and one place calls the backend.

**Files:** `services/api/apiClient.ts`, `services/auth/authService.ts`,
`contexts/AuthContext.tsx`, `hooks/useAuth.ts`, `pages/Login/LoginPage.tsx`,
`routes/AppRoutes.tsx`, `layouts/*`, `components/layout/Header.tsx`.

**Docs:** `docs/05` (Contract 7, error format), `docs/07` (login + navigation), `docs/03` UC-1.

**Acceptance criteria:**
- `apiClient` implements `get/post` against the backend base URL, attaches the JWT
  `Authorization: Bearer …` header, and normalizes the standard error format.
- `authService.login` calls `POST /api/auth/login` and stores the token.
- `AuthContext` exposes `isAuthenticated`, `login`, `logout`; `AppRoutes` protects
  the dashboard routes (redirect to `/login` when unauthenticated).
- Login page: form → error message shown on bad credentials.
- Sidebar navigation with the 6 items from `docs/07` (Overview, Users, Cards,
  Doors & Devices, Logs, Settings).

**AI prompt starter:** "Implement `apiClient` with `fetch` for the smart door
dashboard: base URL from an env constant, attach `Authorization` when a token
exists, and throw a normalized `ApiError` using the `{ error: { code, message } }`
shape from `docs/05`. Use `shared/src/constants/Routes.ts` for paths."

**Stretch:** remember login across refreshes (localStorage); Socket.IO live status in Header.

---

## Dashboard-2 — Overview + Device Status

**Objective:** the landing page shows system health with live data.

**Files:** `pages/Dashboard/DashboardPage.tsx`, `components/devices/DeviceCard.tsx`,
`hooks/useFetch.ts`.

**Docs:** `docs/07` §1 (widgets: system summary, device status, recent activity, quick actions).

**Acceptance criteria:**
- Overview shows: registered users, registered cards, registered devices, today's
  access attempts (from `/api/logs`).
- Device status widget lists each device with online/offline color (green/red per
  `docs/07` color language) and "last seen".
- Recent activity list shows the latest ~10 log entries (time, user, door, result).
- Data comes from real backend endpoints via `useFetch`/`apiClient` — no hardcoded
  sample data.
- Quick-action buttons link to Users / Cards / Devices / Logs pages.

**AI prompt starter:** "Build the Overview page for `DashboardPage.tsx`. Fetch
`/api/logs` and `/api/devices` through the existing `useFetch` hook, render recent
activity and device status with green/red indicators per `docs/07`."

**Stretch:** auto-refresh every 5s; "last seen" relative time.

---

## Dashboard-3 — Users + RFID Cards (incl. Enroll wizard)

**Objective:** manage users and cards; the enroll-card demo works.

**Files:** `pages/Users/UsersPage.tsx`, `pages/Cards/CardsPage.tsx`,
`components/users/UserCard.tsx`, `components/cards/CardSummary.tsx`.

**Docs:** `docs/07` §2–3, `docs/05` (Contract 4), `docs/03` UC-3, UC-4, UC-9.

**Acceptance criteria:**
- Users page: list users (name, role, card, status), add, edit, disable, delete —
  wired to `/api/users`.
- Cards page: list cards (uid, user, status), disable/replace/delete — wired to
  `/api/cards`.
- **Enroll wizard (UC-4):** pick user → "Start Enrollment" → show
  *"Waiting for RFID card…"* (yellow) → backend confirms → *"Enrollment Successful"*
  (green). Handle the `CARD_ALREADY_EXISTS` failure path.
- UIDs displayed as hex (from `shared/types/RFIDCard.ts`).

**AI prompt starter:** "Implement the enroll wizard in `CardsPage.tsx`. It calls the
backend to start a session, shows a waiting state, then calls confirm with the uid
the firmware scanned. Use `EnrollmentRequest`/`EnrollmentResponse` from
`shared/src/types/Enrollment.ts`. Follow the color language in `docs/07`."

**Stretch:** client-side filtering of the user list; confirmation dialogs.

---

## Dashboard-4 — Devices/Doors + Access Logs + Settings

**Objective:** device management, searchable logs, and the settings page.

**Files:** `pages/Devices/DevicesPage.tsx`, `pages/Logs/LogsPage.tsx`,
`pages/Settings/SettingsPage.tsx`, `components/logs/LogEntry.tsx`.

**Docs:** `docs/07` §4–6, `docs/01` (FR-6), `docs/03` UC-8.

**Acceptance criteria:**
- Devices page: list devices (door, status, last seen); register device
  (form → shows generated device id + token to copy); disable/rename.
- Logs page: table of logs with filters (date, door, user, granted/denied) and
  search (name/uid/door) — wired to `/api/logs` (FR-6.3, FR-6.4).
- Log row detail: timestamp, device, door, uid, username, decision, reason, offline? — per `docs/07` §5.
- Settings page: change admin password, heartbeat interval, unlock duration,
  emergency cards (list UI), system info.
- Offline entries clearly marked (offline badge).

**AI prompt starter:** "Implement the Logs page with filters for date/door/user/result.
Query the backend `/api/logs` with query params and render `AccessLog` entries from
`shared/src/types/AccessLog.ts`. Show an offline badge for offline entries."

**Stretch:** export logs to CSV; live log updates via Socket.IO.

---

## Cross-cutting

- After any change to `shared/` or an API contract, tell the other teams.
- Use the exact response shapes from `docs/05`; ask the Backend team before
  assuming an endpoint exists.
- Keep the color language in `docs/07` consistent across all pages.
