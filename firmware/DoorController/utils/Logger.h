#pragma once

#include <Arduino.h>

class Logger
{
public:
    static void info(const String &message);

    static void warning(const String &message);

    static void error(const String &message);

private:
    static void prefix(const char *level);
};

inline void Logger::prefix(const char *level)
{
    Serial.print("[");
    Serial.print(level);
    Serial.print("] ");
}

inline void Logger::info(const String &message)
{
    prefix("INFO");
    Serial.println(message);
}

inline void Logger::warning(const String &message)
{
    prefix("WARN");
    Serial.println(message);
}

inline void Logger::error(const String &message)
{
    prefix("ERROR");
    Serial.println(message);
}