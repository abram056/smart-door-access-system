#include "pins.h"
#include "config.h"
#include "type.h"

#include "utils/Logger.h"
#include "utils/TimeUtils.h"
#include "rfid/RFIDManager.h"
#include "wifi/WiFiManager.h"
#include "api/APIClient.h"
#include "lock/LockController.h"
#include "led/LEDController.h"
#include "buzzer/BuzzerController.h"
#include "storage/StorageController.h"

// ============================================================
// Smart Door Controller
//
// Implements the main-let state machine from docs/04
// ("Complete System Lifecycle") and the access flows of docs/01:
//   boot -> wifi -> heartbeat -> wait for card -> access ->
//   unlock -> auto-lock            (online, Event 2)
//   offline emergency cache + local logs (Event 3 / FR-5.x)
//   reconnect -> log upload        (Event 4)
//   enrollment session             (Event 5 / FR-8.x)
// ============================================================

WiFiManager wifi;
RFIDManager rfid;
LockController lock;
LEDController led;
BuzzerController buzzer;
StorageManager storage;
APIClient api;

SystemState state = SystemState::Boot;

unsigned long lastHeartbeatMs = 0;
unsigned long lastEnrollPollMs = 0;
unsigned long enrollStartedMs = 0;
unsigned long connectStartMs = 0;
String currentUid = "";

// --- helpers --------------------------------------------------

bool doHeartbeat()
{
    lastHeartbeatMs = TimeUtils::currentMillis();
    return api.heartbeat();
}

// docs/05 log record (result / reason enums), stored locally (FR-5.6).
String offlineLogRecord(const String &uid, const char *result, const char *reason)
{
    return "{\"rfid_uid\":\"" + uid + "\",\"timestamp\":\"" + TimeUtils::isoNow() +
           "\",\"result\":\"" + result + "\",\"reason\":\"" + reason + "\"}";
}

// docs/01 FR-5.3: offline authentication against the emergency cache.
AccessDecision decideOffline(const String &uid)
{
    return storage.isEmergencyCard(uid) ? AccessDecision::OfflineGranted
                                        : AccessDecision::OfflineDenied;
}

void setup()
{
    Serial.begin(115200);
    delay(300); // let the serial console attach

    Logger::info("=== Smart Door Controller boot ===");

    led.begin();
    buzzer.begin();
    lock.begin();
    storage.begin();
    api.setStorage(&storage);

    // Persist the flashed device token (FR-3.2) and seed the emergency
    // cache from config.h (FR-5.2).
    storage.saveDeviceToken(DEVICE_TOKEN);
    for (unsigned int i = 0; i < EMERGENCY_UID_COUNT; i++)
    {
        storage.cacheEmergencyCard(EMERGENCY_UIDS[i]);
    }
    Logger::info("[boot] emergency cache seeded with " + String(EMERGENCY_UID_COUNT) + " UIDs");

    rfid.begin();
    wifi.begin();
    buzzer.startupTone();

    connectStartMs = TimeUtils::currentMillis();
    state = SystemState::Connecting;
    Logger::info("[boot] setup complete");
}

void loop()
{
    wifi.loop();
    led.loop();
    buzzer.loop();
    lock.loop();

    // Keep the heartbeat payload's door_state current (docs/05 Contract 1).
    api.setDoorState(lock.state());

    switch (state)
    {
    case SystemState::Connecting:
    {
        if (wifi.isConnected())
        {
            state = SystemState::WaitingForCard;
            // Heartbeat ~1s after connect so the device shows "ready" quickly.
            lastHeartbeatMs = TimeUtils::currentMillis() - api.heartbeatIntervalMs + 1000;
            lastEnrollPollMs = TimeUtils::currentMillis();
            Logger::info("[state] -> WaitingForCard");
        }
        else
        {
            wifi.connect();
            // If the network is unavailable, move to Offline so emergency
            // access still works (docs/01 FR-5.1).
            if (TimeUtils::timeout(connectStartMs, 10000))
            {
                state = SystemState::Offline;
                led.disconnected();
                Logger::warning("[state] -> Offline (no wifi)");
            }
        }
        break;
    }

    case SystemState::WaitingForCard:
    {
        if (!wifi.isConnected())
        {
            state = SystemState::Offline;
            led.disconnected();
            Logger::warning("[state] -> Offline (wifi lost)");
            break;
        }

        // Heartbeat on the backend-tuned interval (docs/05 Contract 1).
        if (TimeUtils::timeout(lastHeartbeatMs, api.heartbeatIntervalMs))
        {
            if (doHeartbeat())
            {
                // Event 4: once online, push any queued offline logs.
                if (storage.offlineLogCount() > 0)
                {
                    api.uploadOfflineLogs();
                }
            }
            else
            {
                state = SystemState::Offline;
                led.disconnected();
                Logger::warning("[state] -> Offline (heartbeat failed)");
            }
        }

        // Enrollment session poll (Event 5). Does not run while processing.
        if (TimeUtils::timeout(lastEnrollPollMs, ENROLL_POLL_MS))
        {
            lastEnrollPollMs = TimeUtils::currentMillis();
            if (api.checkEnrollment() == EnrollmentState::WaitingForCard)
            {
                enrollStartedMs = TimeUtils::currentMillis();
                led.waiting();
                state = SystemState::Enrollment;
                Logger::info("[state] -> Enrollment (waiting for card)");
            }
        }

        // Card presented -> access request (docs/04 Event 2).
        if (rfid.isCardPresent())
        {
            currentUid = rfid.readUID();
            rfid.clear();
            Logger::info("[rfid] card scanned: " + currentUid);
            state = SystemState::Processing;
        }
        break;
    }

    case SystemState::Processing:
    {
        AccessDecision decision;
        if (wifi.isConnected() && api.requestAccess(currentUid))
        {
            decision = api.lastGranted ? AccessDecision::Granted
                                       : AccessDecision::Denied;
        }
        else
        {
            decision = decideOffline(currentUid);
        }

        if (decision == AccessDecision::Granted)
        {
            unsigned long d = (api.lastUnlockDurationMs > 0)
                                  ? api.lastUnlockDurationMs
                                  : DEFAULT_UNLOCK_DURATION_S * 1000UL;
            lock.unlockFor(d);
            led.success();
            buzzer.successTone();
            Logger::info("[access] GRANTED (" + api.lastReason + ")");
            state = SystemState::Unlocked;
        }
        else if (decision == AccessDecision::OfflineGranted)
        {
            lock.unlockFor(DEFAULT_UNLOCK_DURATION_S * 1000UL);
            led.success();
            buzzer.successTone();
            storage.storeOfflineLog(offlineLogRecord(currentUid, "GRANTED", "OFFLINE_CACHE"));
            Logger::info("[access] OFFLINE GRANTED (emergency cache)");
            state = SystemState::Unlocked;
        }
        else if (decision == AccessDecision::OfflineDenied)
        {
            led.error();
            buzzer.errorTone();
            storage.storeOfflineLog(offlineLogRecord(currentUid, "DENIED", "UNKNOWN_CARD"));
            Logger::warning("[access] OFFLINE DENIED");
            state = SystemState::WaitingForCard;
        }
        else
        {
            // Online denial — door stays locked (FR-4.6); backend logged it.
            led.error();
            buzzer.errorTone();
            Logger::warning("[access] DENIED (" + api.lastReason + ")");
            state = SystemState::WaitingForCard;
        }
        break;
    }

    case SystemState::Unlocked:
    {
        // Auto-relock handled by LockController; wait for it (FR-4.5).
        if (lock.state() == DoorState::Locked)
        {
            state = SystemState::WaitingForCard;
            Logger::info("[state] -> WaitingForCard (relocked)");
        }
        break;
    }

    case SystemState::Offline:
    {
        // Reconnect attempt (NFR-2.2); wifi.loop() also retries.
        if (wifi.isConnected())
        {
            Logger::info("[state] online again, syncing");
            if (doHeartbeat())
            {
                api.uploadOfflineLogs();
                state = SystemState::WaitingForCard;
                led.connected();
            }
        }
        else
        {
            wifi.connect();
        }

        // Emergency access while offline (docs/04 Event 3).
        if (rfid.isCardPresent())
        {
            currentUid = rfid.readUID();
            rfid.clear();
            Logger::info("[rfid] card while offline: " + currentUid);
            if (storage.isEmergencyCard(currentUid))
            {
                lock.unlockFor(DEFAULT_UNLOCK_DURATION_S * 1000UL);
                led.success();
                buzzer.successTone();
                storage.storeOfflineLog(offlineLogRecord(currentUid, "GRANTED", "OFFLINE_CACHE"));
                Logger::info("[access] OFFLINE GRANTED");
                state = SystemState::Unlocked;
            }
            else
            {
                led.error();
                buzzer.errorTone();
                storage.storeOfflineLog(offlineLogRecord(currentUid, "DENIED", "UNKNOWN_CARD"));
                Logger::warning("[access] OFFLINE DENIED");
            }
        }
        break;
    }

    case SystemState::Enrollment:
    {
        // Give up after ENROLL_TTL_MS (docs/05 Enrollment Status FAILED).
        if (TimeUtils::timeout(enrollStartedMs, ENROLL_TTL_MS))
        {
            led.off();
            state = SystemState::WaitingForCard;
            Logger::warning("[enroll] timed out waiting for card");
            break;
        }

        if (rfid.isCardPresent())
        {
            currentUid = rfid.readUID();
            rfid.clear();
            Logger::info("[enroll] sending UID " + currentUid);
            if (api.registerCard(currentUid))
            {
                if (api.lastEnrollStatus == "REGISTERED")
                {
                    led.success();
                    buzzer.successTone();
                    Logger::info("[enroll] REGISTERED (" + api.lastEnrollMessage + ")");
                }
                else
                {
                    led.error();
                    buzzer.errorTone();
                    Logger::warning("[enroll] FAILED: " + api.lastEnrollMessage);
                }
            }
            else
            {
                led.error();
                buzzer.errorTone();
                Logger::error("[enroll] request failed");
            }
            state = SystemState::WaitingForCard;
        }
        else if (TimeUtils::timeout(lastEnrollPollMs, ENROLL_POLL_MS))
        {
            lastEnrollPollMs = TimeUtils::currentMillis();
            EnrollmentState enr = api.checkEnrollment();
            if (enr == EnrollmentState::Complete || enr == EnrollmentState::Failed)
            {
                led.off();
                state = SystemState::WaitingForCard;
                Logger::info("[enroll] session ended");
            }
        }
        break;
    }

    default:
        break;
    }
}