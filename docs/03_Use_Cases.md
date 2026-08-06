## Actors

There are three primary actors in the system:

### Administrator

Responsible for managing the system.

Can:

- Log into the dashboard
- Register users
- Register RFID cards
- Register devices
- View logs
- Manage permissions

---

### Door Device (ESP32)

Responsible for:

- Reading RFID cards
- Communicating with the backend
- Unlocking/locking the door
- Logging offline events
- Synchronizing with the backend

---

### User

A person attempting to access a protected door using an RFID card.

---

# UC-1 Administrator Login

### Description

Administrator authenticates to access the management dashboard.

### Primary Actor

Administrator

### Preconditions

- Administrator account exists.

### Main Flow

1. Administrator enters username and password.
2. Backend validates credentials.
3. Dashboard is displayed.

### Alternate Flow

Invalid credentials.

System displays an error.

---

# UC-2 Register a New Device

### Description

Register a new ESP32 into the system.

### Primary Actor

Administrator

### Preconditions

Administrator is logged in.

### Main Flow

1. Administrator opens Device Management.
2. Clicks **Register Device**.
3. Enters:
    - Device Name
    - Door Name
    - Location (optional)
4. Backend generates:
    - Device ID
    - Device Token
5. Credentials are flashed or configured into the ESP32.
6. ESP32 authenticates successfully.
7. Device appears online.

### Postconditions

New device is available for use.

---

# UC-3 Register a New User

### Description

Create a new employee.

### Primary Actor

Administrator

### Main Flow

1. Administrator opens User Management.
2. Clicks **New User**.
3. Enters:
    - Name
    - Role
4. Saves.

### Postconditions

User exists but has no RFID card yet.

---

# UC-4 Enroll an RFID Card

This will probably become the coolest demo.

### Primary Actor

Administrator

### Preconditions

- User exists.
- ESP32 Enrollment Mode is active.

### Main Flow

1. Administrator selects user.
2. Administrator clicks **Enroll Card**.
3. Dashboard waits.
4. ESP32 enters Enrollment Mode.
5. RFID card is scanned.
6. ESP32 sends UID to backend.
7. Backend associates UID with selected user.
8. Dashboard displays **Enrollment Successful**.

### Alternate Flow

UID already exists.

Dashboard displays

> RFID card already assigned.

---

# UC-5 Access Request (Normal Operation)

This is the primary use case.

### Primary Actor

User

### Preconditions

- Device online
- Card registered

### Main Flow

1. User scans RFID card.
2. ESP32 reads UID.
3. ESP32 authenticates with Device Token.
4. ESP32 sends access request.
5. Backend validates:
    - Device
    - Card
    - User
    - Permissions
6. Backend returns decision.
7. ESP32 unlocks door.
8. Event logged.
9. Door relocks after timeout.

### Alternate Flow

Card unauthorized.

Door remains locked.

Event logged.

---

# UC-6 Offline Emergency Access

### Primary Actor

User

### Preconditions

Backend unavailable.

### Main Flow

1. User scans card.
2. ESP32 detects backend unavailable.
3. ESP32 checks emergency cache.
4. Card found.
5. Door unlocks.
6. Offline event stored locally.

### Alternate Flow

Card absent.

Access denied.

Offline denial logged.

---

# UC-7 Synchronize Offline Logs

### Primary Actor

ESP32

### Preconditions

Connection restored.

### Main Flow

1. ESP32 reconnects.
2. Sends heartbeat.
3. Backend acknowledges.
4. ESP32 uploads stored logs.
5. Backend stores logs.
6. ESP32 clears local queue.

---

# UC-8 View Access Logs

### Primary Actor

Administrator

### Main Flow

1. Administrator opens Logs.
2. Dashboard retrieves logs.
3. Logs displayed.
4. Administrator filters by:
    - User
    - Door
    - Date
    - Result

---

# UC-9 Manage RFID Cards

### Primary Actor

Administrator

### Main Flow

Administrator may:

- View cards
- Disable card
- Delete card
- Replace card

---

# UC-10 Heartbeat

### Primary Actor

ESP32

### Main Flow

Every 60 seconds:

1. ESP32 sends heartbeat.
2. Backend updates Last Seen.
3. Dashboard displays device as online.

---

# UC-11 Device Authentication Failure

This is a good edge case that often gets overlooked.

### Primary Actor

ESP32

### Main Flow

1. Device sends request.
2. Token invalid.
3. Backend rejects request.
4. Access request ignored.
5. Event logged.

---

# UC-12 Door Status Update (Optional for Prototype)

If you're including the reed switch, this is a nice addition.

### Primary Actor

ESP32

### Main Flow

1. Reed switch changes state.
2. ESP32 detects event.
3. Sends:
    - Door Open
    - Door Closed
4. Backend stores status.
5. Dashboard updates.

---

# Use Case Diagram (Conceptual)

```
                         +----------------------+
                         |   Administrator      |
                         +----------------------+
                                   |
      ---------------------------------------------------------
      |            |             |            |               |
      ▼            ▼             ▼            ▼               ▼
 Login        Register User   Register Device  Enroll Card  View Logs
                                  |
                                  ▼
                          Generate Device Token


                    +----------------------+
                    |      ESP32 Door      |
                    +----------------------+
                         |          |
                         |          |
                         ▼          ▼
                 Authenticate   Heartbeat
                         |
                         ▼
                  Access Request
                         |
            ---------------------------
            |                         |
            ▼                         ▼
      Access Granted           Access Denied
            |
            ▼
      Unlock Door


                    +----------------------+
                    |       User           |
                    +----------------------+
                              |
                              ▼
                      Present RFID Card
```

---
