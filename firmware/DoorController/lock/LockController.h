#pragma once

#include <Arduino.h>

#include "../pins.h"
#include "../type.h"
#include "../utils/Logger.h"
#include "../utils/TimeUtils.h"

class LockController
{
public:
    bool begin();

    void unlock();

    // Unlock and auto-relock after durationMs (docs/01 FR-4.4 / FR-4.5).
    void unlockFor(unsigned long durationMs);

    void lock();

    // Call every loop() to enforce the auto-relock timer (non-blocking).
    void loop();

    DoorState state();

private:
    DoorState doorState_ = DoorState::Locked;
    unsigned long unlockStartedMs_ = 0;
    unsigned long unlockDurationMs_ = 0;
};

inline bool LockController::begin()
{
    pinMode(RELAY_PIN, OUTPUT);
    lock();
    return true;
}

inline void LockController::unlock()
{
    if (doorState_ == DoorState::Unlocked)
    {
        return;
    }
    digitalWrite(RELAY_PIN, HIGH);
    doorState_ = DoorState::Unlocked;
    Logger::info("[lock] unlock");
}

inline void LockController::unlockFor(unsigned long durationMs)
{
    if (durationMs < 1000)
    {
        durationMs = 1000; // never less than 1 second in the prototype
    }
    unlockStartedMs_ = TimeUtils::currentMillis();
    unlockDurationMs_ = durationMs;
    unlock();
}

inline void LockController::lock()
{
    if (doorState_ == DoorState::Locked)
    {
        return;
    }
    digitalWrite(RELAY_PIN, LOW);
    doorState_ = DoorState::Locked;
    unlockDurationMs_ = 0;
    Logger::info("[lock] lock");
}

inline void LockController::loop()
{
    if (doorState_ == DoorState::Unlocked &&
        unlockDurationMs_ > 0 &&
        TimeUtils::timeout(unlockStartedMs_, unlockDurationMs_))
    {
        lock();
    }
}

inline DoorState LockController::state()
{
    return doorState_;
}