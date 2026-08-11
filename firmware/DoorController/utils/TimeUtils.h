#pragma once

#include <Arduino.h>
#include <time.h>

class TimeUtils
{
public:
    static unsigned long currentMillis();

    static bool timeout(
        unsigned long start,
        unsigned long duration);

    // True once NTP has set the clock (docs/05 timestamps use UTC 'Z').
    static bool timeSynced();

    // ISO-8601 UTC string: "2026-08-04T14:52:13Z" (docs/05 Contract 2).
    static String isoNow();
};

inline unsigned long TimeUtils::currentMillis()
{
    return millis();
}

inline bool TimeUtils::timeout(unsigned long start, unsigned long duration)
{
    return (millis() - start) >= duration;
}

inline bool TimeUtils::timeSynced()
{
    // Fallback if NTP never succeeded.
    time_t now = time(nullptr);
    return now > 1600000000; // after 2020-09-13
}

inline String TimeUtils::isoNow()
{
    time_t now = time(nullptr);
    if (now <= 1600000000)
    {
        // NTP not synced yet — emit a stable placeholder.
        return "1970-01-01T00:00:00Z";
    }
    struct tm t;
    gmtime_r(&now, &t);
    char buf[21];
    snprintf(buf, sizeof(buf), "%04d-%02d-%02dT%02d:%02d:%02dZ",
             t.tm_year + 1900, t.tm_mon + 1, t.tm_mday,
             t.tm_hour, t.tm_min, t.tm_sec);
    return String(buf);
}