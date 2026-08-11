#pragma once

#include <Arduino.h>
#include <MFRC522.h>
#include <SPI.h>

#include "../pins.h"
#include "../utils/Logger.h"

class RFIDManager
{
public:
    bool begin();

    // Reads a new card into the MFRC522 buffer and returns true.
    bool isCardPresent();

    // Uppercase hex UID without separators, e.g. "538986FB"
    // (matches the backend rfid_uid format in docs/05).
    String readUID();

    void clear();

private:
    MFRC522 mfrc522_{RFID_SS_PIN, RFID_RST_PIN};
};

inline bool RFIDManager::begin()
{
    SPI.begin(SPI_SCK_PIN, SPI_MISO_PIN, SPI_MOSI_PIN, RFID_SS_PIN);
    mfrc522_.PCD_Init();
    Logger::info("[rfid] MFRC522 initialized");
    return true;
}

inline bool RFIDManager::isCardPresent()
{
    return mfrc522_.PICC_IsNewCardPresent() && mfrc522_.PICC_ReadCardSerial();
}

inline String RFIDManager::readUID()
{
    String uid = "";
    for (byte i = 0; i < mfrc522_.uid.size; i++)
    {
        if (mfrc522_.uid.uidByte[i] < 0x10)
        {
            uid += "0";
        }
        uid += String(mfrc522_.uid.uidByte[i], HEX);
    }
    uid.toUpperCase();
    return uid;
}

inline void RFIDManager::clear()
{
    mfrc522_.PICC_HaltA();
    mfrc522_.PCD_StopCrypto1();
}