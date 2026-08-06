# 1. User

Represents someone allowed to use the system.

## Attributes

```
User
id (UUID)
full_name
email
role
status
created_at
updated_at
```

### Relationships
A user
- owns RFID cards
- appears in many access logs
For the prototype:

> One user → One RFID card

In Version 2:

> One user → Multiple RFID cards

---

# 2. RFID Card

Represents a physical RFID tag.

```
RFIDCard

id

uid

status

user_id

created_at
```

Status

```
ACTIVE

DISABLED

LOST
```

Relationships

Belongs to one User.

Appears in many Access Logs.

---

# 3. Device

This is the ESP32.

```
Device

id

device_id

device_token

name

firmware_version

status

last_seen

door_id

created_at
```

Status

```
ONLINE

OFFLINE

DISABLED
```

Each device belongs to exactly one door.

---

# 4. Door

This might seem unnecessary with one prototype, but it makes the architecture much cleaner.

```
Door

id

name

location

status

created_at
```

Examples

```
Boss Office

Conference Room

Server Room
```

Relationship

One Door

↓

One Device

Today.

In the future, if you wanted multiple controllers for one door, you could change the relationship without redesigning the whole system.

---

# 5. Access Log

Probably the most important table.

```
AccessLog

id

timestamp

device_id

door_id

rfid_uid

user_id

result

reason

offline

synced
```

Notice something interesting.

I still keep

```
rfid_uid
```

even though we already have

```
user_id
```

---

## Result

```
GRANTED

DENIED
```

Reason

```
AUTHORIZED

UNKNOWN_CARD

NO_PERMISSION

DEVICE_DISABLED

USER_DISABLED

OFFLINE_CACHE

SYSTEM_ERROR
```

---

# 6. Administrator

```
Administrator

id

username

password_hash

role

created_at
```

Later we can implement:

```
SUPER_ADMIN

ADMIN

VIEWER
```

But one Admin account is enough for now.

---

# Emergency Cache

This one is different because it only exists on the ESP32.

```
Emergency Cache

UID

UID

UID

UID
```

These UIDs are synchronized from the backend whenever they change.

---

# Relationships

```
Administrator

      │

      │ manages

      ▼

 Users -------- RFID Cards

      │              │

      │              │

      ▼              ▼

          Access Logs

          ▲        ▲

          │        │

          │        │

       Devices ---- Doors
```

---

# Database Tables

This translates almost directly into six tables.

```
users

rfid_cards

devices

doors

access_logs

administrators
```

That's it.

Six tables.

Very manageable for interns.

---

# Suggested Fields

## Users

|Field|Type|
|---|---|
|id|UUID|
|full_name|VARCHAR|
|email|VARCHAR|
|role|VARCHAR|
|status|ENUM|
|created_at|TIMESTAMP|

---

## RFID Cards

|Field|Type|
|---|---|
|id|UUID|
|uid|VARCHAR UNIQUE|
|user_id|FK|
|status|ENUM|

---

## Devices

|Field|Type|
|---|---|
|id|UUID|
|device_id|VARCHAR UNIQUE|
|device_token|VARCHAR|
|name|VARCHAR|
|door_id|FK|
|last_seen|TIMESTAMP|

---

## Doors

|Field|Type|
|---|---|
|id|UUID|
|name|VARCHAR|
|location|VARCHAR|

---

## Access Logs

|Field|Type|
|---|---|
|id|UUID|
|timestamp|TIMESTAMP|
|device_id|FK|
|door_id|FK|
|user_id|FK (nullable)|
|rfid_uid|VARCHAR|
|result|ENUM|
|reason|ENUM|
|offline|BOOLEAN|

---

## Administrators

|Field|Type|
|---|---|
|id|UUID|
|username|VARCHAR UNIQUE|
|password_hash|VARCHAR|

---
