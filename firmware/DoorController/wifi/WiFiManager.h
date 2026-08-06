#pragma once

#include <Arduino.h>

class WiFiManager
{
public:
    bool begin();

    bool connect();

    void disconnect();

    void loop();

    bool isConnected();

    String ipAddress();
};