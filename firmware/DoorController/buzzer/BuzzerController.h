#pragma once

#include <Arduino.h>

#include "../pins.h"
#include "../utils/TimeUtils.h"

// Non-blocking audible feedback (active buzzer on BUZZER_PIN).
class BuzzerController
{
public:
    bool begin();

    void successTone();

    void errorTone();

    void startupTone();

    // Call every loop() to finish the active tone sequence.
    void loop();

private:
    struct Step
    {
        bool on;
        uint16_t ms;
    };

    const Step *steps_ = nullptr;
    int stepCount_ = 0;
    int stepIndex_ = -1;
    unsigned long stepStartMs_ = 0;

    void run(const Step *steps, int count);
    void applyStep(int index);
    void off();
};

inline bool BuzzerController::begin()
{
    pinMode(BUZZER_PIN, OUTPUT);
    off();
    return true;
}

inline void BuzzerController::off()
{
    stepIndex_ = -1;
    digitalWrite(BUZZER_PIN, LOW);
}

inline void BuzzerController::run(const Step *steps, int count)
{
    steps_ = steps;
    stepCount_ = count;
    stepIndex_ = 0;
    stepStartMs_ = TimeUtils::currentMillis();
    applyStep(0);
}

inline void BuzzerController::applyStep(int index)
{
    digitalWrite(BUZZER_PIN, steps_[index].on ? HIGH : LOW);
}

inline void BuzzerController::successTone()
{
    static const Step steps[] = {
        {true, 120},
        {false, 200},
    };
    run(steps, sizeof(steps) / sizeof(steps[0]));
}

inline void BuzzerController::errorTone()
{
    static const Step steps[] = {
        {true, 120},
        {false, 80},
        {true, 120},
        {false, 200},
    };
    run(steps, sizeof(steps) / sizeof(steps[0]));
}

inline void BuzzerController::startupTone()
{
    static const Step steps[] = {
        {true, 200},
        {false, 100},
    };
    run(steps, sizeof(steps) / sizeof(steps[0]));
}

inline void BuzzerController::loop()
{
    if (stepIndex_ < 0)
    {
        return;
    }
    if (!TimeUtils::timeout(stepStartMs_, steps_[stepIndex_].ms))
    {
        return;
    }
    stepIndex_++;
    if (stepIndex_ >= stepCount_)
    {
        off();
    }
    else
    {
        stepStartMs_ = TimeUtils::currentMillis();
        applyStep(stepIndex_);
    }
}