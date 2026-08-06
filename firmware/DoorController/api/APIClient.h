#pragma once

#include <Arduino.h>

class APIClient
{
public:
    bool begin();

    bool heartbeat();

    bool requestAccess(const String &uid);

    bool uploadOfflineLogs();

    bool registerCard(const String &uid);
};