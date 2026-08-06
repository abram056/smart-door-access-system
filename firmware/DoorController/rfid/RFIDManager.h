#pragma once

#include <Arduino.h>

class RFIDManager
{
public:
    bool begin();

    bool isCardPresent();

    String readUID();

    void clear();
};