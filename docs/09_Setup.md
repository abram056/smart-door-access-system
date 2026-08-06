# Setup Guide — Get the project running

One-time setup for every student. If something here does not work, **ask your team
lead before changing anything** — don't "fix" it in a way that breaks your team.

---

## 1. Prerequisites

Install these before the first session (check with your team lead if unsure):

- **Node.js 20+** — <https://nodejs.org> (LTS version is fine)
- **Git** — <https://git-scm.com> (comes with Git Bash on Windows)
- **GitHub Desktop** — <https://desktop.github.com>
- **PostgreSQL** — <https://www.postgresql.org/download/windows/>
- **Arduino IDE or PlatformIO** (Firmware team only) with ESP32 board support

---

## 2. Clone and install (everyone)

```bash
git clone https://github.com/YOUR_ORG/smart-door-project.git
cd smart-door-project
npm install          # installs all three workspaces at once
npm run build:shared # compiles the shared types package
```

> This is a monorepo: `npm install` at the root installs `shared/`, `backend/`,
> and `dashboard/` together. `@smartdoor/shared` must be built before the backend
> or dashboard can use it. The `predev`/`prebuild` scripts do this automatically.

### Backend team only — database

1. Create the database in psql (or pgAdmin):

   ```sql
   CREATE DATABASE smart_door;
   ```

2. Copy the env template and fix the credentials:

   ```bash
   cd backend
   cp .env.example .env
   ```

   Edit `.env` → `DATABASE_URL` must match your local PostgreSQL username/password.

3. Create the tables:

   ```bash
   cd backend
   npm run prisma:migrate    # prisma migrate dev
   npm run prisma:generate   # generate the Prisma client
   ```

---

## 3. Run the apps

### Backend (port 3000)

```bash
cd backend
npm run dev
# smoke test: curl http://localhost:3000/  → {"message":"Smart Door Access API"}
```

### Dashboard (port 5173)

```bash
cd dashboard
npm run dev
# open http://localhost:5173 in a browser
```

### Firmware (ESP32)

Open `firmware/DoorController/DoorController.ino` in Arduino IDE, install the ESP32
board package, and compile. Hardware pin wiring goes in `pins.h` and WiFi/API config
in `config.h`.

---

## 4. Useful commands

| Command                            | What it does                          |
|------------------------------------|---------------------------------------|
| `npm run check` (repo root)        | Typechecks backend + builds dashboard |
| `npm run dev:backend` (root)       | Run backend                           |
| `npm run dev:dashboard` (root)     | Run dashboard                         |
| `npm run build:shared` (root)      | Rebuild shared types                  |
| `npm run prisma:studio` (backend)  | Visual database browser               |
| `npx prisma migrate dev` (backend) | Apply a new migration                 |

---

## 5. Environment variables (`backend/.env`)

`.env` is **never committed** — it contains local secrets.

| Variable       | Example                                             |
|----------------|-----------------------------------------------------|
| `PORT`         | `3000`                                              |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/smart_door` |
| `JWT_SECRET`   | a long random string (backend auth team sets this)  |
| `NODE_ENV`     | `development`                                       |

---

## 6. Known gotchas

- **Dashboard fails to build after pulling shared changes** → run
  `npm run build:shared` first.
- **Prisma says "database does not exist"** → you forgot to `CREATE DATABASE smart_door;`.
- **Port 3000/5173 already in use** → something else is running; close it, or ask
  your lead before changing ports.
- **MFRC522 not reading cards** → check the wiring table in `pins.h`; power and SS
  (SDA) are the most common mistakes.
