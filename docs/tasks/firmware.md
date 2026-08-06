# Firmware Team Tasks

**Team:** 3 students — Firmware (ESP32 + MFRC522 RFID)

**Read first:** `docs/08_Student_Guide.md` (AI usage, git, Definition of Done),
`docs/09_Setup.md` (environment).

**Key references:** `docs/01` (FR-4, FR-5, FR-8, FR-9), `docs/04_Event_Protocols.md`,
`docs/05_Message_Contracts.md`, `firmware/DoorController/`.

**Layout:** every hardware module already has an interface header in
`firmware/DoorController/`. Your job is to add the implementations (as `.cpp`
files, or inline in the headers) and wire them up in `DoorController.ino`.

> `pins.h` and `config.h` are empty on purpose — that is your config.

---

## Firmware-1 — WiFi + API Client

**Objective:** the ESP32 connects to WiFi and talks to the backend.

**Files:** `wifi/WiFiManager.h`, `api/APIClient.h`, `config.h`, `pins.h`, `utils/Logger.h`.

**Docs:** `docs/05` (Contracts 1, 2, 3, 4, 6), `docs/04` (Events 1, 8, 10).

**Acceptance criteria:**
- `config.h`: WiFi SSID/password + backend base URL + device id/token as constants.
- `WiFiManager`: connect, reconnect on failure, `isConnected()`, expose IP.
- `APIClient`:
  - `heartbeat()` — sends Contract 1, returns `heartbeat_interval`.
  - `requestAccess(uid)` — sends Contract 2, parses `{ granted, unlock_duration, reason }`.
  - `uploadOfflineLogs()` — sends Contract 3.
  - `registerCard(uid)` — sends Contract 4 during enrollment.
- All requests send `Device-ID` + `Device-Token` headers (FR-9.1).
- Clean disconnect → JSON parse failure → timeout handling; log everything with `Logger`.

**Verification:** serial log shows WiFi connected and a successful heartbeat against
a running backend (coordinate with Backend team).

**AI prompt starter:** "Implement `APIClient` for an ESP32 using the `HTTPClient`
library. Read the contract JSON shapes from `docs/05`. Send headers `Device-ID` /
`Device-Token`. Handle HTTP 401 by logging and retrying later."

**Stretch:** timeouts tuned for offline detection (2s access request goal).

---

## Firmware-2 — RFID + Lock + Feedback

**Objective:** cards are read reliably and the door responds with lock/unlock + LED/buzzer feedback.

**Files:** `rfid/RFIDManager.h`, `lock/LockController.h`, `led/LEDController.h`, `buzzer/BuzzerController.h`, `pins.h`, `type.h`.

**Docs:** `docs/01` (FR-4.1, FR-4.4–4.6, FR-8.2), `docs/02` (NFR-6.2), `docs/07` (color language).

**Acceptance criteria:**
- `RFIDManager` (MFRC522): `begin()`, `isCardPresent()`, `readUID()` returning the
  hex string UID (matching backend `rfid_uid` format).
- `LockController`: unlock/lock on the correct pin; track `DoorState`.
- Auto-relock after the `unlock_duration` from the access response (FR-4.5).
- `LEDController`/`BuzzerController`: success (green/beep), denied (red), waiting
  (blue flash) per `docs/07`.
- Wiring table in `pins.h` documented in comments (SS, RST, LED, lock relay, buzzer).

**Verification:** a card scan prints the UID; serial shows grant/deny feedback.

**AI prompt starter:** "Implement `RFIDManager` for the MFRC522 on ESP32. Return the
UID as uppercase hex. Update `pins.h` with the wiring. Keep the header signature."

**Stretch:** read error retries; anti-tamper delay on repeated failures.

---

## Firmware-3 — Storage + Main Loop (state machine)

**Objective:** the device works offline, remembers its config, and syncs logs later.

**Files:** `storage/StorageController.h`, `DoorController.ino`, `utils/TimeUtils.h`, `type.h`.

**Docs:** `docs/01` (FR-5.x, FR-8.x, FR-9.x), `docs/04` (Events 3, 4, 5), `docs/05` (Contract 3).

**Acceptance criteria:**
- `StorageManager` (ESP32 Preferences/flash):
  - save/load device token (FR-3.2 credentials survive reboots).
  - emergency card cache: `cacheEmergencyCard`, `isEmergencyCard` (FR-5.2).
  - offline log queue: `storeOfflineLog`, `clearOfflineLogs` — survives power loss (NFR-2.3).
- `DoorController.ino` main loop implements the **state machine in `docs/04`
  Complete System Lifecycle**: boot → wifi → heartbeat → wait for card → access →
  unlock → auto-lock.
- **Offline mode (Event 3):** on request timeout, check emergency cache; grant/deny;
  store the offline log.
- **Reconnect (Event 4):** on heartbeat success, upload queued logs and clear them.
- **Enrollment mode (Event 5):** `EnrollmentState` waiting → read card → send uid.

**Verification:** unplug the backend → scan an emergency card → door unlocks and a log
is queued; restart backend → logs appear (check with Backend/Dashboard).

**AI prompt starter:** "Implement the ESP32 main loop as a state machine: `BOOT`,
`CONNECTED`, `WAITING_FOR_CARD`, `PROCESSING`, `UNLOCKED`, `OFFLINE`. Use the
lifecycle diagram in `docs/04`. Persist the offline log queue with Preferences."

**Stretch:** periodic emergency-cache sync from backend; door state (reed switch) reporting.
