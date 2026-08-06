#pragma once

#include <Arduino.h>

class StorageManager
{
public:
    bool begin();

    bool saveDeviceToken(const String &token);

    String loadDeviceToken();

    bool cacheEmergencyCard(const String &uid);

    bool isEmergencyCard(const String &uid);

    bool storeOfflineLog(const String &log);

    bool clearOfflineLogs();
};