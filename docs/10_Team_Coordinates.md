# Team Coordinates — Who touches what

This page maps which files and contracts each team depends on. When something
crosses a team boundary, **it must be agreed as a contract first**, then everyone
implements against it independently.

---

## 1. The three contract surfaces

Everything flows through these. If two teams disagree, these win:

1. **`docs/05_Message_Contracts.md`** — JSON shapes for every HTTP exchange.
2. **`shared/`** — TypeScript types/enums/constants imported by backend and dashboard.
3. **`docs/06_Domain_Model.md` + `backend/prisma/schema.prisma`** — the database.

---

## 2. End-to-end flows (who does what)

### Normal access (the main demo)

```
Firmware: scan card → APIClient.requestAccess(uid)
Backend:  access module → validates device/card/user → decision
Firmware: LockController unlocks (granted) or shows error (denied)
Backend:  writes AccessLog
Dashboard: Access Logs page shows it
```

Dependency chain: **Firmware → Backend `/access` → Backend Logs → Dashboard Logs page.**

### Heartbeat / device status

```
Firmware: WiFiManager + APIClient.heartbeat() every 60s
Backend:  devices module updates lastSeen + status
Dashboard: Overview + Devices page shows online/offline
```

### Enrollment (cross-team demo)

```
Dashboard: Admin picks user → clicks "Enroll Card" → calls backend
Backend:  starts an enrollment session (waits)
Firmware: enters Enrollment Mode → reads card → registerCard(uid)
Backend:  associates uid with user → confirms
Dashboard: shows "Enrollment Successful"
```

Dependency chain: **Dashboard → Backend session → Firmware card read → Backend → Dashboard.**

### Offline mode

```
Firmware: detects backend unreachable → checks emergency cache → unlocks or denies
Firmware: stores offline log in Preferences
Firmware: on reconnect → uploadOfflineLogs()
Backend:  logs module accepts batch → firmware clears queue
```

---

## 3. Shared type map

| Backend / Dashboard file                    | Shared source                    |
|---------------------------------------------|----------------------------------|
| users module, Users page                    | `shared/src/types/User.ts`       |
| cards module, Cards page                    | `shared/src/types/RFIDCard.ts`   |
| devices module, Devices page                | `shared/src/types/Device.ts`     |
| doors module (future), Door widget          | `shared/src/types/Door.ts`       |
| logs module, Logs page                      | `shared/src/types/AccessLog.ts`  |
| auth module, Login page                     | `shared/src/types/Auth.ts`       |
| API routes                                 | `shared/src/constants/Routes.ts` |
| roles, permissions                         | `shared/src/constants/Roles.ts`  |

**Rule:** if you need a new field or enum, edit the file in `shared/src/`, run
`npm run build:shared`, and tell the other team. Never define a parallel type in
your own app.

---

## 4. Freeze dates / integration checkpoints

| When     | What must be working                     |
|----------|------------------------------------------|
| Day 4    | All three apps run; heartbeat flow works |
| Day 8    | Access decision flow works end-to-end    |
| Final    | Full demo: enroll → access → logs → offline → sync |

Anything not marked "optional" in the docs must be done by these dates. Leave
buffers — don't start the day before.

---

## 5. Coordination rules

1. **Contracts freeze first.** Backend defines HTTP shapes (from `docs/05`);
   Dashboard and Firmware code against them. Backend team: do not change a
   response shape after Day 4 without telling everyone.
2. **`shared/` changes need a heads-up.** Message in the shared channel: *"adding
   `DISABLED` to `DeviceStatus`"* etc.
3. **One person owns a module.** Don't both edit the same controller.
4. **Never force-push or delete branches.** Ask the mentor.
5. **Demo early, demo often.** A half-working demo of the real flow beats three
   screenshots of fake data.
