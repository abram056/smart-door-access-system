#pragma once

#include "../type.h"

class LockController
{
public:
    bool begin();

    void unlock();

    void lock();

    DoorState state();
};