#pragma once

// ============================================================
// ESP32 Smart Door Controller — pin wiring
// (based on the starter demo, buzzer moved from GPIO35 to
//  GPIO32 — GPIO34-39 are input-only on the ESP32)
// ============================================================

// MFRC522 RFID reader (SPI)
#define RFID_SS_PIN   5    // D5  (SDA / SSN)
#define RFID_RST_PIN  22   // D22 (RST)
#define SPI_SCK_PIN   18   // D18
#define SPI_MOSI_PIN  23   // D23
#define SPI_MISO_PIN  19   // D19

// Feedback / outputs
#define RED_LED_PIN   13   // D13 (access denied / error)
#define GREEN_LED_PIN 12   // D12 (access granted / success)
#define RELAY_PIN     25   // D25 (lock relay signal, active HIGH to unlock)
#define BUZZER_PIN    32   // D32 (active buzzer)