## 1. User Management
### FR-1.1 User Registration
The system shall allow an administrator to create new users.

---
### FR-1.2 User Information
Each user shall have:
- Unique User ID
- Full Name
- Email (optional for prototype)
- Role
- Status (Active/Inactive)

---
### FR-1.3 User Modification
The system shall allow administrators to:
- Edit user details
- Activate users
- Deactivate users
- Delete users

---

## 2. RFID Card Management

### FR-2.1 Card Registration

The system shall allow administrators to register a new RFID card to a user.

---

### FR-2.2 Card Assignment

Each RFID card shall be assigned to exactly one user.

(For this prototype. Future versions can allow multiple cards per user.)

---

### FR-2.3 Card Removal

The system shall allow administrators to remove or deactivate RFID cards.

---

### FR-2.4 Duplicate Prevention

The system shall prevent duplicate registration of the same RFID UID.

---

## 3. Device Management

### FR-3.1 Device Registration

The system shall allow administrators to register new ESP32 door devices.

---

### FR-3.2 Device Identification

Each device shall possess:

- Device ID
- Device Token
- Device Name
- Door Name
- Status

---

### FR-3.3 Device Activation

Administrators shall be able to:

- Activate
- Disable
- Remove

registered devices.

---

### FR-3.4 Device Monitoring

The system shall record each device's last communication time.

---

## 4. Door Access Control

### FR-4.1 RFID Detection

The system shall detect RFID cards presented to the reader.

---

### FR-4.2 Authentication

Upon detecting a card, the system shall request an access decision from the backend.

---

### FR-4.3 Authorization

The backend shall determine whether access is granted based on:

- User status
- Card status
- Door permissions

---

### FR-4.4 Unlocking

When access is granted, the ESP32 shall unlock the door for a configurable duration.

---

### FR-4.5 Relocking

The system shall automatically relock the door after the unlock period expires.

---

### FR-4.6 Denied Access

When access is denied:

- Door shall remain locked
- User shall receive visual/audible feedback

---

## 5. Emergency Offline Access

This deserves its own section.

### FR-5.1 Offline Detection

The ESP32 shall detect loss of communication with the backend.

---

### FR-5.2 Emergency Cache

The ESP32 shall maintain a locally stored list of emergency RFID cards.

---

### FR-5.3 Offline Authentication

When offline, the ESP32 shall authenticate presented cards using the emergency cache.

---

### FR-5.4 Emergency Unlock

If the scanned card exists in the emergency cache, the ESP32 shall unlock the door.

---

### FR-5.5 Offline Denial

Cards not present in the emergency cache shall be denied access.

---

### FR-5.6 Offline Log Preservation

The ESP32 shall locally store access events generated while offline.

_(This one is important. Otherwise, you'll lose the audit trail.)_

---

### FR-5.7 Log Synchronization

Once communication is restored, the ESP32 shall upload offline access logs to the backend.

---

## 6. Access Logging

### FR-6.1 Event Logging

Every access attempt shall be recorded.

---

### FR-6.2 Log Fields

Each log entry shall contain:

- Timestamp
- Door ID
- Device ID
- RFID UID
- Username
- Access Decision
- Reason

---

### FR-6.3 Search

Administrators shall be able to search logs.

---

### FR-6.4 Filtering

Administrators shall be able to filter logs by:

- User
- Date
- Door
- Device
- Access Result

---

## 7. Dashboard

### FR-7.1 Authentication

Administrators shall authenticate before accessing the dashboard.

---

### FR-7.2 Dashboard Overview

The dashboard shall display:

- Registered devices
- Online/offline status
- Recent access logs

---

### FR-7.3 Device Status

The dashboard shall display each device's:

- Status
- Last Seen
- Door Name

---

### FR-7.4 User Management

Administrators shall manage:

- Users
- RFID cards
- Devices

through the dashboard.

---

## 8. Enrollment Mode

This is one of the most interesting parts of the project.

### FR-8.1 Enrollment Session

The administrator shall be able to initiate a card enrollment session.

---

### FR-8.2 Card Reading

During enrollment, the ESP32 shall read the presented RFID card.

---

### FR-8.3 Card Transmission

The ESP32 shall transmit the card UID to the backend.

---

### FR-8.4 Assignment

The backend shall assign the card to the selected user.

---

### FR-8.5 Enrollment Confirmation

The dashboard shall notify the administrator of successful registration.

---

## 9. Device Communication

### FR-9.1 Device Authentication

Every request from an ESP32 shall include its Device ID and Device Token.

---

### FR-9.2 Access Requests

The ESP32 shall transmit an access request whenever a card is scanned.

---

### FR-9.3 Access Response

The backend shall return:

- Access Decision
- Unlock Duration
- Optional Message

---

### FR-9.4 Heartbeat

The ESP32 shall periodically send heartbeat messages to indicate it is online.

---

### FR-9.5 Heartbeat Processing

The backend shall update the device's online status upon receiving a heartbeat.

---
