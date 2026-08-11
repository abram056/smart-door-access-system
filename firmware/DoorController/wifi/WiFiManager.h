#pragma once

#include <Arduino.h>
#include <WiFi.h>

#include "../config.h"
#include "../utils/Logger.h"
#include "../utils/TimeUtils.h"

class WiFiManager
{
public:
    bool begin();

    bool connect();

    void disconnect();

    // Call every loop(): keeps the connection alive and retries (NFR-2.2).
    void loop();

    bool isConnected();

    String ipAddress();

    int signalStrength();

private:
    bool connecting_ = false;
    unsigned long lastAttemptMs_ = 0;
};

inline bool WiFiManager::begin()
{
    WiFi.mode(WIFI_STA);
    WiFi.disconnect();
    // NTP for accurate UTC log timestamps (docs/05 'Z' format).
    configTime(0, 0, "pool.ntp.org", "time.nist.gov");
    Logger::info("[wifi] begin");
    return true;
}

inline bool WiFiManager::connect()
{
    if (isConnected())
    {
        connecting_ = false;
        return true;
    }
    if (!connecting_)
    {
        Logger::info("[wifi] connecting to " + String(WIFI_SSID));
        WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
        connecting_ = true;
        lastAttemptMs_ = TimeUtils::currentMillis();
    }
    return false; // still connecting; the .ino re-checks later
}

inline void WiFiManager::disconnect()
{
    connecting_ = false;
    WiFi.disconnect();
}

inline void WiFiManager::loop()
{
    if (connecting_ && isConnected())
    {
        connecting_ = false;
        Logger::info("[wifi] connected, IP " + ipAddress());
    }
    else if (!connecting_ && !isConnected() &&
             TimeUtils::timeout(lastAttemptMs_, WIFI_RETRY_MS))
    {
        connect();
    }
}

inline bool WiFiManager::isConnected()
{
    return WiFi.status() == WL_CONNECTED;
}

inline String WiFiManager::ipAddress()
{
    return WiFi.localIP().toString();
}

inline int WiFiManager::signalStrength()
{
    return WiFi.RSSI();
}