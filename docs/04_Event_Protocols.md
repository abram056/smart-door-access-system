# Event 1 — Device Heartbeat

## Purpose

Inform the backend that the ESP32 is online.

## Initiator

ESP32

## Participants

- ESP32
- Backend

## Trigger

Every 60 seconds.

## Event Flow

```
ESP32

↓

Authenticate using Device Token

↓

Send Heartbeat

↓

Backend validates token

↓

Update Last Seen timestamp

↓

Respond Success
```

## Success Response

```
200 OK

Heartbeat received.
```

## Failure

```
401 Unauthorized
```

---

# Event 2 — Access Request

This is the most important event.

## Trigger

RFID card scanned.

## Flow

```
User

↓

Tap RFID Card

↓

ESP32 reads UID

↓

ESP32 authenticates

↓

Send Access Request

↓

Backend validates

↓

Backend checks

• Device

• User

• Card

• Permission

↓

Generate Access Decision

↓

Log Event

↓

Return Decision

↓

ESP32 unlocks or denies
```

---

## Backend Decision Tree

```
Device Valid?

NO

↓

Reject

YES

↓

Card Exists?

NO

↓

Unknown Card

YES

↓

User Active?

NO

↓

Reject

YES

↓

Permission?

NO

↓

Reject

YES

↓

Grant Access
```

Notice how **the ESP32 never makes authorization decisions while online**. It simply asks the backend.

---

# Event 3 — Offline Access

Trigger

Backend unreachable.

```
Card Scanned

↓

Connection Timeout

↓

Offline Mode

↓

Check Emergency Cache

↓

Found?

↓

YES

↓

Unlock

↓

Store Offline Log

↓

Wait for Reconnection
```

If not found

```
Deny Access

↓

Store Offline Log
```

---

# Event 4 — Offline Synchronization

Trigger

Connection restored.

```
Heartbeat

↓

Success

↓

Offline Logs Exist?

↓

YES

↓

Upload Logs

↓

Backend Stores Logs

↓

Backend Acknowledges

↓

ESP32 Deletes Local Logs
```

---

# Event 5 — Card Enrollment

This one is slightly different because it involves both teams.

```
Dashboard

↓

Administrator clicks

Enroll Card

↓

Backend starts Enrollment Session

↓

ESP32 notified

↓

LED flashes blue (optional)

↓

Waiting...

↓

Card Scanned

↓

ESP32 sends UID

↓

Backend assigns card

↓

Dashboard updates

↓

Enrollment Complete
```

---

# Event 6 — Device Provisioning

```
Dashboard

↓

Register Device

↓

Backend generates

DeviceID

DeviceToken

↓

Embedded Team

Copies credentials

↓

Flash ESP32

↓

ESP32 boots

↓

Heartbeat

↓

Device Online
```

Later, this can evolve into automatic provisioning without changing the rest of the architecture.

---

# Event 7 — User Registration

```
Dashboard

↓

Create User

↓

Backend validates

↓

Save User

↓

Dashboard updates
```

Simple.

---

# Event 8 — Device Authentication Failure

```
ESP32

↓

Heartbeat

↓

Invalid Token

↓

Backend Rejects

↓

401

↓

ESP32 retries later
```

Dashboard can later show

```
Door Offline

Authentication Failed
```

---

# Event 9 — Door State Update

(Using the reed switch.)

```
Door Open

↓

ESP32 detects

↓

Send Door Open Event

↓

Backend updates status

↓

Dashboard shows

Door Open
```

Likewise for the door closing.

---

# Event 10 — Device Boot

This one is often forgotten but is useful.

```
Power On

↓

ESP32 boots

↓

Connect WiFi

↓

Authenticate

↓

Heartbeat

↓

Ready

↓

Waiting for RFID
```

---

# Complete System Lifecycle

One thing I love to include in system design documents is a single diagram that tells the whole story.

```
          Device Boot
               │
               ▼
      Authenticate Device
               │
               ▼
        Send Heartbeat
               │
               ▼
      Wait for RFID Card
               │
      ┌────────┴────────┐
      │                 │
      ▼                 ▼
 Card Scanned      Heartbeat Timer
      │                 │
      ▼                 ▼
 Access Request    Send Heartbeat
      │
      ▼
 Backend Decision
      │
 ┌────┴────┐
 │         │
 ▼         ▼
Grant     Deny
 │          │
 ▼          ▼
Unlock    Locked
 │
 ▼
Auto Lock
 │
 ▼
Wait for Next Card
```

---
