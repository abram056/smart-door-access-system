# Smart Door Access System

An RFID smart door lock with an ESP32 controller, a Node.js API, and a React
dashboard. Built as a **three-team internship project**.

## Teams

| Team      | Stack                        | Folder       | Task cards           |
|-----------|------------------------------|--------------|----------------------|
| Firmware  | ESP32 + MFRC522 (Arduino)    | `firmware/`  | `docs/tasks/firmware.md` |
| Backend   | Node.js + Express + Prisma   | `backend/`   | `docs/tasks/backend.md`  |
| Dashboard | React + TypeScript + Vite    | `dashboard/` | `docs/tasks/dashboard.md`|

Shared types and constants live in `shared/` (imported by backend and dashboard).

## Documentation

| Doc | Contents |
|-----|----------|
| `docs/01` | Functional requirements |
| `docs/02` | Non-functional requirements |
| `docs/03` | Use cases |
| `docs/04` | Event protocols & decision trees |
| `docs/05` | Message contracts (JSON shapes) |
| `docs/06` | Domain model & database |
| `docs/07` | Dashboard specification |
| `docs/08` | **Student guide** — AI usage, git, Definition of Done |
| `docs/09` | **Setup guide** — get everything running |
| `docs/10` | **Team coordinates** — who touches what |

## Quick start

```bash
npm install            # install all three workspaces
npm run build:shared   # compile shared types
npm run dev:backend    # API on http://localhost:3000
npm run dev:dashboard  # dashboard on http://localhost:5173
```

See `docs/09_Setup.md` for full setup (including PostgreSQL) and
`docs/08_Student_Guide.md` before you start coding.
