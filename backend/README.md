# Smart Door Access Backend

## Tech Stack

- Node.js
- Express
- TypeScript
- Prisma + PostgreSQL
- Socket.IO
- Shared types from `@smartdoor/shared` (workspace package)

## Prerequisites

- Node.js 20+ (this repo was developed with Node 22)
- PostgreSQL running locally
- One-time setup in the repo root (monorepo):

```bash
npm install
npm run build:shared
```

## Database Setup

1. Create the database (one time):

   ```sql
   CREATE DATABASE smart_door;
   ```

2. Copy `.env.example` to `.env` and adjust `DATABASE_URL` to match your
   local PostgreSQL credentials.

3. Run the migration (creates the tables from `docs/06_Domain_Model.md`):

   ```bash
   npm run prisma:migrate   # prisma migrate dev
   npm run prisma:generate  # generate the Prisma client
   ```

   Note: `src/generated/prisma` is gitignored and generated on each machine.

## Running

```bash
npm run dev   # starts ts-node-dev on port 3000 (default)
```

Smoke test:

```bash
curl http://localhost:3000/
# {"message":"Smart Door Access API"}
```

## Project Layout

```
src/
  app.ts                 # express app (root route, middleware)
  server.ts              # entrypoint
  routes.ts              # TODO: mount all module routes
  config/                # env, database, logger, websocket
  middleware/            # auth, device auth, validation, error handling
  modules/
    auth/                # admin login (JWT)
    users/               # user CRUD
    cards/               # RFID card CRUD + enrollment
    devices/             # device registration, heartbeat, status
    access/              # access decision engine
    logs/                # access logs + offline log upload
  websocket/             # Socket.IO wiring
  generated/prisma/      # generated Prisma client (do not edit)
```
