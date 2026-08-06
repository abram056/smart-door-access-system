# Dashboard Structure

```
Dashboard
│
├── Overview
├── Users
├── RFID Cards
├── Doors & Devices
├── Access Logs
└── Settings
```

---

# 1. Overview (Landing Page)

This is what the administrator sees after logging in.

## Purpose

Provide a quick summary of the system's health.

---

## Widgets

### System Summary

```
Registered Users

Registered Cards

Registered Devices

Today's Access Attempts
```

---

### Device Status

```
🟢 Boss Office Door

Online

Last Seen: 8 seconds ago
```

Future:

```
🟢 Boss Office

🟢 Lab

🔴 Server Room
```

---

### Recent Activity

```
09:12

John Doe

Boss Office

Granted

-------------------

09:15

Unknown Card

Denied

-------------------

09:19

Jane Smith

Granted
```

---

### Quick Actions

Buttons

```
+ Register User

+ Register Card

+ Add Device

View Logs
```

---

# 2. User Management

This becomes the HR section.

---

## User List

Table

|Name|Role|RFID|Status|
|---|---|---|---|
|John Doe|Staff|Assigned|Active|

---

Administrator can

- Add User
- Edit User
- Disable User
- Delete User

---

## User Details

Clicking a user opens

```
John Doe

Role

Staff

Card

A4B8C291

Door Access

Boss Office

Status

Active
```

Later

Multiple cards

Multiple doors

---

# 3. RFID Card Management

This page is all about enrollment.

---

## Card List

|UID|User|Status|
|---|---|---|
|A4B8C291|John|Active|

---

Buttons

```
Enroll Card

Disable Card

Replace Card

Delete Card
```

---

## Enroll Card Wizard

---

Step 1

Select User

↓

Step 2

Click

```
Start Enrollment
```

↓

Dashboard displays

```
Waiting for RFID card...
```

↓

ESP32 LED flashes.

↓

Card tapped.

↓

Dashboard

```
Enrollment Successful
```

That's much more intuitive than asking users to type a UID manually.

---

# 4. Doors & Devices

I actually combined these because, in your prototype, one device equals one door.

---

## Device List

|Door|Device|Status|Last Seen|
|---|---|---|---|

---

Clicking one

```
Boss Office

Device ID

door-001

Firmware

1.0.0

Status

Online

Last Seen

2 seconds ago
```

---

Buttons

```
Register Device

Disable Device

Rename Device
```

---

## Register Device

Simple form

```
Door Name

Friendly Name

Location
```

Backend generates

```
Device ID

Device Token
```

Administrator copies these to the ESP32 configuration.

---

# 5. Access Logs

This will probably become the page people use the most.

---

Table

|Time|User|Door|Result|Reason|
|---|---|---|---|---|

---

Filters

```
Date

Door

User

Granted

Denied
```

---

Search

```
Search by

Name

UID

Door
```

---

Click a row

Shows

```
Timestamp

Device

Door

RFID UID

Username

Decision

Reason

Offline?

YES / NO
```

---

# 6. Settings

Small page.

Contains

Administrator password

Heartbeat interval

Door unlock duration

Emergency cards

System information

---

# Navigation

I like side navigation.

```
🏠 Overview

👥 Users

💳 RFID Cards

🚪 Doors & Devices

📜 Access Logs

⚙ Settings
```

---

# Dashboard Workflow

```
Login

↓

Overview

↓

Register User

↓

Enroll RFID

↓

Test Card

↓

View Logs

↓

Done
```


---

# Color Language

🟢 **Green**

- Access Granted
- Device Online
- Success

🔴 **Red**

- Access Denied
- Device Offline
- Errors

🟡 **Yellow**

- Warning
- Device hasn't checked in recently
- Enrollment waiting

🔵 **Blue**

- Information
- Enrollment in progress

---

# Suggested Tech Stack

- **React** (or Next.js if they're already comfortable with it)
- **Tailwind CSS** for styling
- **shadcn/ui** for reusable components
- **TanStack Query** for fetching backend data
- **React Hook Form** for forms
- **Node.Js**

---
