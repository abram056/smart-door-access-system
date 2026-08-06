# Message Contract 1 — Heartbeat

## Purpose

Tell the backend the ESP32 is alive.

### Request

```
{
    "firmware_version": "1.0.0",
    "door_state": "LOCKED",
    "signal_strength": -58
}
```

Headers

```
Device-ID
Device-Token
```

---

### Response

```
{
    "status": "OK",
    "heartbeat_interval": 60
}
```

The backend can even tell the ESP32 how often to send heartbeats.

---

# Message Contract 2 — Access Request

This is the most important message in the system.

## Request

```
{
    "rfid_uid": "A4B8C291",
    "timestamp": "2026-08-04T14:52:13Z"
}
```

---

### Backend Processing

The backend determines

- User
- Permissions
- Card validity
- Device validity

---

### Response

```
{
    "granted": true,
    "unlock_duration": 5,
    "message": "Access Granted",
    "reason": "AUTHORIZED"
}
```

or

```
{
    "granted": false,
    "unlock_duration": 0,
    "message": "Access Denied",
    "reason": "UNKNOWN_CARD"
}
```

Possible reasons

```
AUTHORIZED

UNKNOWN_CARD

DEVICE_DISABLED

USER_DISABLED

NO_PERMISSION

SYSTEM_ERROR
```

---

# Message Contract 3 — Offline Log Upload

Once Wi-Fi returns.

Request

```
{
    "logs": [
        {
            "rfid_uid": "A4B8C291",
            "timestamp": "2026-08-04T13:01:04Z",
            "result": "GRANTED",
            "reason": "OFFLINE_CACHE"
        },
        {
            "rfid_uid": "FA91D231",
            "timestamp": "2026-08-04T13:15:32Z",
            "result": "DENIED",
            "reason": "UNKNOWN_CARD"
        }
    ]
}
```

Response

```
{
    "uploaded": 2
}
```

---

# Message Contract 4 — Card Enrollment

ESP32

```
{
    "rfid_uid": "A4B8C291"
}
```

Backend

```
{
    "status": "REGISTERED",
    "user": "John Doe"
}
```

or

```
{
    "status": "FAILED",
    "reason": "CARD_ALREADY_EXISTS"
}
```

---

# Message Contract 5 — Door State

Whenever the reed switch changes.

```
{
    "state": "OPEN",
    "timestamp": "2026-08-04T15:11:41Z"
}
```

Response

```
{
    "status": "OK"
}
```

---

# Message Contract 6 — Device Provisioning

Request

```
{
    "device_name": "Boss Office Door",
    "door_name": "Boss Office"
}
```

Backend

```
{
    "device_id": "door-001",
    "device_token": "7af32..."
}
```

This message probably won't be used by the ESP32 itself in the prototype, but it documents how provisioning works.

---

# Message Contract 7 — Administrator Login

Dashboard

```
{
    "username": "admin",
    "password": "********"
}
```

Backend

```
{
    "access_token": "...",
    "expires_in": 3600
}
```

This is where JWT belongs.

---

# Standard Error Format

One thing many student projects overlook is having a consistent error format. I'd recommend using the same structure everywhere.

```
{
    "error": {
        "code": "DEVICE_NOT_FOUND",
        "message": "Device does not exist."
    }
}
```

or

```
{
    "error": {
        "code": "INVALID_DEVICE_TOKEN",
        "message": "Authentication failed."
    }
}
```

Both teams only need to learn one pattern.

---

# Enumerations

This is another industry practice that's worth introducing. Rather than sending arbitrary strings, define the allowed values once and reuse them everywhere.

### Access Result

```
GRANTED
DENIED
```

### Access Reason

```
AUTHORIZED
UNKNOWN_CARD
NO_PERMISSION
USER_DISABLED
DEVICE_DISABLED
OFFLINE_CACHE
SYSTEM_ERROR
```

### Door State

```
LOCKED
UNLOCKED
OPEN
CLOSED
```

### Device Status

```
ONLINE
OFFLINE
DISABLED
```

### Enrollment Status

```
WAITING
SUCCESS
FAILED
```
