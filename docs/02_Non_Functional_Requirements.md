# 1. Performance

### NFR-1.1 Authentication Response Time

The system shall return an access decision within **2 seconds** under normal operating conditions.

---

### NFR-1.2 Door Unlock Delay

The ESP32 shall unlock the door within **500 milliseconds** after receiving an approval response.

---

### NFR-1.3 Dashboard Performance

Dashboard pages shall load within **3 seconds** under normal network conditions.

---

### NFR-1.4 Concurrent Requests

The backend shall support requests from multiple registered door devices simultaneously.

_(Even though you'll probably only have one ESP32 during development, designing for multiple devices is a good habit.)_

---

# 2. Reliability

### NFR-2.1 Offline Operation

The ESP32 shall continue operating during temporary network outages using the emergency card cache.

---

### NFR-2.2 Automatic Recovery

When network connectivity is restored, the ESP32 shall automatically reconnect to the backend.

---

### NFR-2.3 Log Preservation

Access logs generated while offline shall not be lost after power interruptions, provided they have been written to non-volatile storage (such as flash memory).

---

### NFR-2.4 System Availability

The backend shall remain available throughout normal office operating hours.

(For the prototype, this is sufficient. You don't need to specify uptime percentages like 99.9%.)

---

# 3. Security

### NFR-3.1 Device Authentication

All ESP32 devices shall authenticate using a unique Device ID and Device Token.

---

### NFR-3.2 Dashboard Authentication

Only authenticated administrators shall access the dashboard.

---

### NFR-3.3 Password Storage

Administrator passwords shall be stored as secure password hashes, never in plain text.

---

### NFR-3.4 Access Control

Administrative actions shall require administrator authentication.

---

### NFR-3.5 Communication Security

The system architecture shall support secure communication (HTTPS) between devices and the backend, even if HTTP is used during local prototype development.

This wording is intentional. It doesn't force the interns to set up TLS certificates during the prototype, but it encourages them to design with security in mind.

---

# 4. Scalability

### NFR-4.1 Device Expansion

The system shall support the registration of additional ESP32 devices without modifying the firmware of existing devices.

---

### NFR-4.2 Door Expansion

The system architecture shall support multiple doors.

---

### NFR-4.3 User Expansion

The system shall support the addition of new users without firmware changes.

---

# 5. Maintainability

### NFR-5.1 Modular Design

The system shall separate embedded firmware, backend services, and dashboard components into independent modules.

---

### NFR-5.2 Documentation

Source code shall include sufficient documentation to support future maintenance.

---

### NFR-5.3 API Documentation

The backend API shall be documented.

(FastAPI gives you this almost for free with OpenAPI.)

---

# 6. Usability

### NFR-6.1 Dashboard Navigation

Dashboard navigation shall be clear and intuitive.

---

### NFR-6.2 User Feedback

The ESP32 shall provide visual and/or audible feedback for successful and unsuccessful authentication attempts.

---

### NFR-6.3 Error Messages

Dashboard error messages shall clearly describe problems encountered.

---

# 7. Compatibility

### NFR-7.1 Hardware Compatibility

The firmware shall run on ESP32 development boards.

---

### NFR-7.2 Browser Compatibility

The dashboard shall support modern desktop web browsers.

---

### NFR-7.3 RFID Compatibility

The system shall support MFRC522-compatible RFID tags.

---

# 8. Data Integrity

### NFR-8.1 Log Accuracy

Access logs shall accurately record the outcome of each authentication attempt.

---

### NFR-8.2 Unique Identifiers

Users, devices, and RFID cards shall each have unique identifiers.

---

### NFR-8.3 Duplicate Prevention

The backend shall prevent duplicate device registrations and duplicate RFID registrations.

---

# 9. Extensibility

This is one of my favorite sections because it encourages good architecture without adding implementation work.

### NFR-9.1 Feature Expansion

The system architecture shall support future features including:

- Facial recognition
- PIN authentication
- Remote unlock
- Attendance reporting
- Mobile applications

without requiring significant redesign.

---

### NFR-9.2 Modular Components

New authentication methods shall be introducible without replacing the existing RFID authentication workflow.

---

# 10. Development Constraints

These are especially relevant since this is an internship project.

### NFR-10.1 Project Duration

The prototype shall be completed within two weeks.

---

### NFR-10.2 Technology Stack

The project shall use:

- ESP32 (Arduino framework)
- MFRC522 RFID reader
- Node.js + Express + TypeScript
- Prisma ORM + PostgreSQL
- REST API
- React + TypeScript web dashboard (Vite)
- Socket.IO (optional, for live dashboard updates)

---

### NFR-10.3 Team Structure

Development shall be performed by three teams working in parallel:

- Firmware Team (ESP32 + RFID) — 3 students
- Dashboard Team (React) — 4 students
- Backend Team (Node.js API + database) — 4 students

All three teams coordinate through the contracts defined in
`docs/05_Message_Contracts.md` and the shared types in `shared/`.
