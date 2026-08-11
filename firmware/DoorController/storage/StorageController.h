#pragma once

#include <Arduino.h>
#include <Preferences.h>

#include "../config.h"
#include "../utils/Logger.h"

// Persistent storage on the ESP32 (NVS / flash, survives power loss —
// docs/02 NFR-2.3). Holds:
//   - the device token (docs/01 FR-3.2)
//   - the offline emergency card cache (docs/01 FR-5.2)
//   - a queue of offline access logs (docs/01 FR-5.6)
class StorageManager
{
public:
    bool begin();

    bool saveDeviceToken(const String &token);

    String loadDeviceToken();

    bool cacheEmergencyCard(const String &uid);

    bool isEmergencyCard(const String &uid);

    // log is a single JSON record, e.g.
    // {"rfid_uid":"538986FB","timestamp":"2026-08-04T13:01:04Z",
    //  "result":"GRANTED","reason":"OFFLINE_CACHE"}
    bool storeOfflineLog(const String &log);

    bool clearOfflineLogs();

    int offlineLogCount();

    // Returns the queue as a JSON array string (docs/05 Contract 3 "logs").
    String getOfflineLogsJson();

private:
    static const int LOG_QUEUE_MAX = 20; // flash-string size guard

    Preferences prefs_;
};

inline bool StorageManager::begin()
{
    prefs_.begin("door", false);
    Logger::info("[storage] preferences initialized");
    return true;
}

inline bool StorageManager::saveDeviceToken(const String &token)
{
    return prefs_.putString("device_token", token) > 0;
}

inline String StorageManager::loadDeviceToken()
{
    return prefs_.getString("device_token", DEVICE_TOKEN);
}

inline bool StorageManager::cacheEmergencyCard(const String &uid)
{
    if (isEmergencyCard(uid))
    {
        return true;
    }
    String current = prefs_.getString("emergency_uids", "");
    if (!current.isEmpty())
    {
        current += ",";
    }
    current += uid;
    return prefs_.putString("emergency_uids", current) > 0;
}

inline bool StorageManager::isEmergencyCard(const String &uid)
{
    String current = prefs_.getString("emergency_uids", "");
    int start = 0;
    while (start <= (int)current.length())
    {
        int comma = current.indexOf(',', start);
        String token = (comma < 0) ? current.substring(start) : current.substring(start, comma);
        if (token == uid)
        {
            return true;
        }
        if (comma < 0)
        {
            break;
        }
        start = comma + 1;
    }
    return false;
}

inline bool StorageManager::storeOfflineLog(const String &log)
{
    if (prefs_.getInt("offline_count", 0) >= LOG_QUEUE_MAX)
    {
        Logger::warning("[storage] offline log queue full");
        return false;
    }
    String current = prefs_.getString("offline_logs", "");
    String updated;
    if (current.isEmpty())
    {
        updated = "[" + log + "]";
    }
    else
    {
        current.remove(current.length() - 1); // drop trailing "]"
        updated = current + "," + log + "]";
    }
    if (prefs_.putString("offline_logs", updated) > 0)
    {
        prefs_.putInt("offline_count", prefs_.getInt("offline_count", 0) + 1);
        return true;
    }
    return false;
}

inline bool StorageManager::clearOfflineLogs()
{
    prefs_.remove("offline_logs");
    prefs_.putInt("offline_count", 0);
    return true;
}

inline int StorageManager::offlineLogCount()
{
    return prefs_.getInt("offline_count", 0);
}

inline String StorageManager::getOfflineLogsJson()
{
    return prefs_.getString("offline_logs", "[]");
}