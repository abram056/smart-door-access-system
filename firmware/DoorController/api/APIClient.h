#pragma once

#include <Arduino.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>
#include <WiFi.h>

#include "../config.h"
#include "../storage/StorageController.h"
#include "../type.h"
#include "../utils/Logger.h"
#include "../utils/TimeUtils.h"

// HTTP client for the smart door backend. Every request carries the
// Device-ID / Device-Token headers (docs/01 FR-9.1) and the exact JSON
// shapes from docs/05. Timeouts are tuned to the <= 2s decision goal
// (docs/02 NFR-1.1); failures are reported to the caller, which falls
// back to the offline emergency flow (docs/01 FR-5.x).
class APIClient
{
public:
    bool begin();

    void setStorage(StorageManager *storage);

    // Contract 1 — heartbeat. Returns the backend-tuned interval.
    bool heartbeat();

    // Contract 2 — access request. Result is exposed in lastGranted /
    // lastUnlockDurationMs / lastReason (see docs/05 Contract 2).
    bool requestAccess(const String &uid);

    // Contract 3 — upload queued offline logs and clear them on ack.
    bool uploadOfflineLogs();

    // Contract 4 — enrollment confirm (docs/01 FR-8.3 / FR-8.4).
    bool registerCard(const String &uid);

    // Enrollment status poll (additive; reuses the docs/05 status enum).
    EnrollmentState checkEnrollment();

    void setDoorState(DoorState state);

    // Results of the last access request (docs/05 Contract 2).
    bool lastGranted = false;
    unsigned long lastUnlockDurationMs = 0;
    String lastReason;

    // Results of the last enrollment confirm (docs/05 Contract 4).
    String lastEnrollStatus;
    String lastEnrollMessage;

    // Contract 1 — backend may override the heartbeat interval.
    unsigned long heartbeatIntervalMs = DEFAULT_HEARTBEAT_INTERVAL * 1000UL;

private:
    DoorState doorState_ = DoorState::Locked;
    StorageManager *storage_ = nullptr;

    bool sendJson(const String &path, const String &body, String &response);
};

inline bool APIClient::begin()
{
    return true;
}

inline void APIClient::setStorage(StorageManager *storage)
{
    storage_ = storage;
}

inline void APIClient::setDoorState(DoorState state)
{
    doorState_ = state;
}

inline bool APIClient::sendJson(const String &path, const String &body, String &response)
{
    if (WiFi.status() != WL_CONNECTED)
    {
        Logger::warning("[api] wifi down, skipping " + path);
        return false;
    }

    HTTPClient http;
    http.begin(String(SERVER_BASE_URL) + path);
    http.setConnectTimeout(API_CONNECT_TIMEOUT_MS);
    http.setTimeout(API_TIMEOUT_MS);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("Device-ID", DEVICE_ID);
    http.addHeader("Device-Token", DEVICE_TOKEN);

    int code = http.POST(body);
    bool ok = (code == HTTP_CODE_OK || code == HTTP_CODE_CREATED);
    Logger::info("[api] " + String(code) + " " + path);
    if (ok)
    {
        response = http.getString();
    }
    else if (code > 0)
    {
        Logger::error("[api] error " + String(code) + " on " + path);
    }
    http.end();
    return ok;
}

inline bool APIClient::heartbeat()
{
    JsonDocument doc;
    doc["firmware_version"] = FIRMWARE_VERSION;
    doc["door_state"] = (doorState_ == DoorState::Unlocked) ? "UNLOCKED" : "LOCKED";
    doc["signal_strength"] = WiFi.RSSI();

    String body;
    serializeJson(doc, body);

    String response;
    if (!sendJson("/devices/heartbeat", body, response))
    {
        return false;
    }

    JsonDocument resp;
    if (deserializeJson(resp, response))
    {
        Logger::warning("[api] heartbeat response parse failed");
        return true; // HTTP ok, just no tuning data
    }

    long interval = resp["heartbeat_interval"] | (long)(DEFAULT_HEARTBEAT_INTERVAL);
    if (interval > 0)
    {
        heartbeatIntervalMs = interval * 1000UL;
        Logger::info("[api] heartbeat interval set to " + String(interval) + "s");
    }
    return true;
}

inline bool APIClient::requestAccess(const String &uid)
{
    lastGranted = false;
    lastUnlockDurationMs = 0;
    lastReason = "SYSTEM_ERROR";

    JsonDocument doc;
    doc["rfid_uid"] = uid;
    doc["timestamp"] = TimeUtils::isoNow();

    String body;
    serializeJson(doc, body);

    String response;
    if (!sendJson("/access", body, response))
    {
        return false;
    }

    JsonDocument resp;
    if (deserializeJson(resp, response))
    {
        Logger::warning("[api] access response parse failed");
        return false;
    }

    lastGranted = resp["granted"] | false;
    long duration = resp["unlock_duration"] | 0L;
    lastUnlockDurationMs = (duration > 0) ? (unsigned long)duration * 1000UL : 0;
    if (resp["reason"].is<const char *>())
    {
        lastReason = resp["reason"].as<const char *>();
    }
    return true;
}

inline bool APIClient::uploadOfflineLogs()
{
    if (storage_ == nullptr || storage_->offlineLogCount() <= 0)
    {
        return true;
    }

    JsonDocument stored;
    if (deserializeJson(stored, storage_->getOfflineLogsJson()))
    {
        Logger::error("[api] stored offline logs corrupt");
        return false;
    }

    JsonDocument doc;
    JsonArray logs = doc["logs"].to<JsonArray>();
    for (JsonObject item : stored.as<JsonArray>())
    {
        JsonObject out = logs.add<JsonObject>();
        out["rfid_uid"] = item["rfid_uid"] | "";
        out["timestamp"] = item["timestamp"] | "";
        out["result"] = item["result"] | "DENIED";
        out["reason"] = item["reason"] | "SYSTEM_ERROR";
    }

    String body;
    serializeJson(doc, body);

    String response;
    if (!sendJson("/access/logs/sync", body, response))
    {
        return false;
    }

    // Backend acknowledged (docs/04 Event 4) -> safe to clear the queue.
    storage_->clearOfflineLogs();
    Logger::info("[api] offline logs uploaded and cleared");
    return true;
}

inline bool APIClient::registerCard(const String &uid)
{
    JsonDocument doc;
    doc["rfid_uid"] = uid;

    String body;
    serializeJson(doc, body);

    String response;
    if (!sendJson("/cards/enroll/confirm", body, response))
    {
        return false;
    }

    JsonDocument resp;
    if (deserializeJson(resp, response))
    {
        lastEnrollStatus = "FAILED";
        lastEnrollMessage = "malformed response";
        return false;
    }

    lastEnrollStatus = resp["status"] | "FAILED";
    if (resp["user"].is<const char *>())
    {
        lastEnrollMessage = resp["user"].as<const char *>();
    }
    else if (resp["reason"].is<const char *>())
    {
        lastEnrollMessage = resp["reason"].as<const char *>();
    }
    return true;
}

inline EnrollmentState APIClient::checkEnrollment()
{
    if (WiFi.status() != WL_CONNECTED)
    {
        return EnrollmentState::Idle;
    }

    HTTPClient http;
    http.begin(String(SERVER_BASE_URL) + "/cards/enroll/status");
    http.setConnectTimeout(API_CONNECT_TIMEOUT_MS);
    http.setTimeout(API_TIMEOUT_MS);
    http.addHeader("Device-ID", DEVICE_ID);
    http.addHeader("Device-Token", DEVICE_TOKEN);

    int code = http.GET();
    EnrollmentState result = EnrollmentState::Idle;
    if (code == HTTP_CODE_OK)
    {
        String response = http.getString();
        JsonDocument resp;
        if (!deserializeJson(resp, response))
        {
            String status = resp["status"] | "";
            if (status == "WAITING")
            {
                result = EnrollmentState::WaitingForCard;
            }
            else if (status == "SUCCESS")
            {
                result = EnrollmentState::Complete;
            }
            else if (status == "FAILED")
            {
                result = EnrollmentState::Failed;
            }
        }
    }
    http.end();
    return result;
}