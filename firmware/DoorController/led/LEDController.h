#pragma once

#include <Arduino.h>

#include "../pins.h"
#include "../utils/TimeUtils.h"

// Non-blocking LED feedback. Color language follows docs/07:
//   green = granted / success, red = denied / error,
//   pulsing green = waiting (enrollment), blips = online/offline.
// (The prototype board has only green + red; "waiting" pulses green.)
class LEDController
{
public:
    bool begin();

    void success();

    void error();

    void waiting();

    void connected();

    void disconnected();

    void off();

    // Call every loop() to advance the active pattern.
    void loop();

private:
    enum class Pattern
    {
        None,
        Success,
        Error,
        Waiting,
        Connected,
        Disconnected
    };

    struct Step
    {
        uint8_t pin;
        bool on;
        uint16_t ms;
    };

    Pattern pattern_ = Pattern::None;
    int stepIndex_ = 0;
    unsigned long stepStartMs_ = 0;

    void startPattern(Pattern pattern);
    void applyStep(const Step &step);
    const Step *stepsFor(Pattern pattern, int &count) const;
};

inline bool LEDController::begin()
{
    pinMode(RED_LED_PIN, OUTPUT);
    pinMode(GREEN_LED_PIN, OUTPUT);
    off();
    return true;
}

inline void LEDController::startPattern(Pattern pattern)
{
    pattern_ = pattern;
    stepIndex_ = 0;
    stepStartMs_ = TimeUtils::currentMillis();
}

inline void LEDController::success()
{
    startPattern(Pattern::Success);
}

inline void LEDController::error()
{
    startPattern(Pattern::Error);
}

inline void LEDController::waiting()
{
    startPattern(Pattern::Waiting);
}

inline void LEDController::connected()
{
    startPattern(Pattern::Connected);
}

inline void LEDController::disconnected()
{
    startPattern(Pattern::Disconnected);
}

inline void LEDController::off()
{
    pattern_ = Pattern::None;
    digitalWrite(RED_LED_PIN, LOW);
    digitalWrite(GREEN_LED_PIN, LOW);
}

inline const LEDController::Step *LEDController::stepsFor(Pattern pattern, int &count) const
{
    static const Step successSteps[] = {
        {GREEN_LED_PIN, true, 200},
        {GREEN_LED_PIN, false, 150},
        {GREEN_LED_PIN, true, 200},
        {GREEN_LED_PIN, false, 300},
    };
    static const Step errorSteps[] = {
        {RED_LED_PIN, true, 200},
        {RED_LED_PIN, false, 100},
        {RED_LED_PIN, true, 200},
        {RED_LED_PIN, false, 400},
    };
    static const Step waitingSteps[] = {
        {GREEN_LED_PIN, true, 300},
        {GREEN_LED_PIN, false, 300},
    };
    static const Step connectedSteps[] = {
        {GREEN_LED_PIN, true, 80},
        {GREEN_LED_PIN, false, 80},
        {GREEN_LED_PIN, true, 80},
        {GREEN_LED_PIN, false, 80},
    };
    static const Step disconnectedSteps[] = {
        {RED_LED_PIN, true, 80},
        {RED_LED_PIN, false, 80},
        {RED_LED_PIN, true, 80},
        {RED_LED_PIN, false, 80},
    };

    switch (pattern)
    {
    case Pattern::Success:
        count = sizeof(successSteps) / sizeof(successSteps[0]);
        return successSteps;
    case Pattern::Error:
        count = sizeof(errorSteps) / sizeof(errorSteps[0]);
        return errorSteps;
    case Pattern::Waiting:
        count = sizeof(waitingSteps) / sizeof(waitingSteps[0]);
        return waitingSteps;
    case Pattern::Connected:
        count = sizeof(connectedSteps) / sizeof(connectedSteps[0]);
        return connectedSteps;
    case Pattern::Disconnected:
        count = sizeof(disconnectedSteps) / sizeof(disconnectedSteps[0]);
        return disconnectedSteps;
    default:
        count = 0;
        return nullptr;
    }
}

inline void LEDController::applyStep(const Step &step)
{
    if (step.pin == GREEN_LED_PIN)
    {
        digitalWrite(RED_LED_PIN, LOW);
        digitalWrite(GREEN_LED_PIN, step.on ? HIGH : LOW);
    }
    else
    {
        digitalWrite(GREEN_LED_PIN, LOW);
        digitalWrite(RED_LED_PIN, step.on ? HIGH : LOW);
    }
}

inline void LEDController::loop()
{
    if (pattern_ == Pattern::None)
    {
        return;
    }

    int count = 0;
    const Step *steps = stepsFor(pattern_, count);

    if (stepIndex_ >= count)
    {
        if (pattern_ == Pattern::Waiting)
        {
            stepIndex_ = 0; // loop while waiting (until a card is scanned)
            stepStartMs_ = TimeUtils::currentMillis();
        }
        else
        {
            off();
            return;
        }
    }

    applyStep(steps[stepIndex_]);

    if (TimeUtils::timeout(stepStartMs_, steps[stepIndex_].ms))
    {
        stepIndex_++;
        stepStartMs_ = TimeUtils::currentMillis();
    }
}