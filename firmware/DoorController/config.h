#pragma once

// ============================================================
// Smart Door Controller — device configuration
// Fill these in with your own values before flashing.
// ============================================================

// --- Wi-Fi -------------------------------------------------
#define WIFI_SSID       "Virus"
#define WIFI_PASSWORD   "11111111"

// --- Backend ------------------------------------------------
// Point this at your backend (LAN IP of the machine running the API).
#define SERVER_BASE_URL "http://192.168.1.100:3000/api"
#define DEVICE_ID       "device-001"
#define DEVICE_TOKEN    "replace-with-the-generated-device-token"
#define FIRMWARE_VERSION "1.0.0"

// --- Timing (docs/02 NFR-1.1: decision in <= 2s) ------------
#define API_TIMEOUT_MS            2000UL  // max wait for an HTTP response
#define API_CONNECT_TIMEOUT_MS    1000UL  // TCP connect timeout
#define DEFAULT_HEARTBEAT_INTERVAL 60UL  // seconds, backend may override
#define DEFAULT_UNLOCK_DURATION_S 5UL    // seconds (docs/01 FR-4.4)
#define WIFI_RETRY_MS             5000UL // reconnect attempt period
#define ENROLL_POLL_MS            2000UL // enrollment status poll period
#define ENROLL_TTL_MS             30000UL// give up waiting for the card

// --- Offline emergency cards (docs/01 FR-5.2) ---------------
// UIDs from the starter demo. These are seeded into flash at boot
// and authorize access ONLY when the backend is unreachable.
// Format: uppercase hex without separators (matches readUID()).
const char *const EMERGENCY_UIDS[] = {
    "538986FB",
    "F3CC13E3",
    "03FE21E3",
};
#define EMERGENCY_UID_COUNT (sizeof(EMERGENCY_UIDS) / sizeof(EMERGENCY_UIDS[0]))