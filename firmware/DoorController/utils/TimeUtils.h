#pragma once

#include <Arduino.h>

class TimeUtils
{
public:
    static unsigned long currentMillis();

    static bool timeout(
        unsigned long start,
        unsigned long duration);
};