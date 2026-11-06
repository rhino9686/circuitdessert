---
manufacturer: Silergy
family: SY7T6xx
part: SY7T6xx
category: processor
summary: "Energy measurement processor family: delta-sigma ADC, 24-bit processor and flash in one chip, 3.3 V, TSSOP-14/16 and TQFN-24/32 packages, SPI and UART, and I2C on the SY7T610 to SY7T612."
abstract: "A single-chip power measurement front end and processor. A multiplexer feeds up to six sense inputs to one delta-sigma ADC with a trimmed reference, and a 24-bit energy measurement processor with on-chip flash turns the readings into measurements. The family covers the SY7T609, SY7T610, SY7T611 and SY7T612, which differ in analog inputs, digital I/O and package, and an E version of each (except the SY7T611) that is rated to 105 °C. A host reads the results over SPI, UART or I2C, chosen when the chip comes out of reset. The datasheet covers the hardware only: the registers, the I2C address, calibration and the serial protocols come from the firmware documentation, and a part ordered without a firmware code has none."
status: active
packages:
- TSSOP-14
- TSSOP-16
- TQFN-24
- TQFN-32 5x5mm
specs:
  vin_min_v: 3
  vin_max_v: 3.6
  topology: Delta-sigma ADC and 24-bit energy measurement processor with on-chip flash
  extra:
  - label: Analog inputs
    value: "SY7T609: AIN1, a differential AIN2 and MFIO. SY7T610: two differential pairs and one single-ended input. SY7T611: three differential pairs. SY7T612: four differential pairs"
  - label: Serial interfaces
    value: SPI and UART on all four parts; I2C on the SY7T610, SY7T611 and SY7T612 (not in the SY7T609 pin table)
  - label: Clock
    value: 20 MHz internal oscillator, optional external 20 MHz crystal or clock
features:
- Delta-sigma ADC with up to six time-multiplexed analog inputs, a trimmed voltage reference and a die-temperature sensor
- 24-bit energy measurement processor with on-chip flash for firmware, calibration and configuration data
- SPI, UART and I2C slave interfaces, one active at a time and chosen at reset on the DIO8 pin
- Configurable digital I/O for alarms, address pins or user control, and a free-running PWM output on DIO7 or DIO8
- Internal 20 MHz oscillator that switches to an external 20 MHz crystal or clock when one is present
- Power-on reset, watchdog timer and, on the SY7T611 and SY7T612, a RESETB pin
- Four packages from 14 to 32 pins; E versions are rated to +105 °C
spec_groups:
- title: Supply and logic levels
  items:
  - label: Supply voltage (V3P3D and V3P3A)
    value: 3.0 V minimum, 3.3 V typical, 3.6 V maximum
  - label: Supply current (V3P3D and V3P3A together, 3.3 V)
    value: 8.1 mA typical, 10.3 mA maximum
  - label: Digital input high (VIH)
    value: 2 V minimum
  - label: Digital input low (VIL)
    value: 0.8 V maximum
  - label: Digital output high (VOH)
    value: V3P3 − 0.4 V minimum at 1 mA; V3P3 − 0.6 V minimum at 10 mA
  - label: Digital output low (VOL)
    value: 0.4 V maximum at 1 mA; 0.5 V maximum at 10 mA
  - label: Power-on reset
    value: "Watches V3P3D: resets at power-up and again if the supply falls below the minimum operating level. The datasheet gives no threshold"
- title: Analog front end
  items:
  - label: Converter
    value: Second-order delta-sigma ADC with an FIR filter, shared by time-multiplexed inputs
  - label: Usable input range (Vin − V3P3)
    value: −250 to +250 mV peak, which is 176.78 mV RMS for a sine wave
  - label: Common-mode voltage
    value: Less than ±25 mV is recommended to use the full range
  - label: THD (first 10 harmonics, 65 Hz)
    value: −85 dB typical
  - label: Input impedance (65 Hz)
    value: 30 kΩ minimum, 90 kΩ maximum
  - label: Input impedance temperature coefficient
    value: 1.7 Ω/°C typical (guaranteed by design, not tested)
  - label: ADC gain error against supply
    value: 50 ppm/% maximum (200 mV peak, 65 Hz, V3P3 = 3.0 to 3.6 V)
  - label: Input offset (Vin − V3P3)
    value: −10 to +10 mV
  - label: Reference and temperature sensor
    value: Trimmed bandgap with auto-zero, digitally compensated over temperature; the die-temperature sensor is used for that compensation and can be reported
- title: Clock, reset and start-up
  items:
  - label: Internal RC oscillator
    value: 20.000 MHz nominal at 3.3 V and 25 °C, ±1.5% typical accuracy, trimmed and temperature compensated
  - label: External clock
    value: Optional 20.000 MHz crystal on XIN and XOUT (SY7T611 and SY7T612) with an 18 pF capacitor from each pin to ground, and no resistor across the crystal. The part starts on the RC oscillator, switches after 1024 RC cycles if it sees a valid clock, and falls back if the clock fails
  - label: RESETB pin (SY7T611 and SY7T612)
    value: Active low. Must be held low for at least 1 µs; the part leaves reset 4096 clock cycles after RESETB goes high and the processor starts from address 0. If unused, connect it to V3P3D directly or through a pull-up
  - label: Watchdog timer
    value: Internal. A time-out resets the part
  - label: Interface selection delay
    value: Allow at least 10 ms after a power-on reset for the interface choice to be latched; DIO8 must not change during that time
- title: Serial interfaces
  items:
  - label: Interface select
    value: "DIO8 is sampled after power-on or reset: low selects SPI, high selects UART or I2C. The firmware chooses between UART and I2C. Only one interface is active at a time"
  - label: SPI
    value: Slave only, mode 3 (CPOL = 1, CPHA = 1), most significant bit first, 24-bit words, register numbers 0x00 to 0x3F, SCK cycle 1 µs minimum
  - label: UART
    value: 8 data bits, one start bit, one stop bit, no parity; 2400 to 115200 baud; no handshake lines
  - label: I2C
    value: Slave, 7-bit address, up to 400 kHz (Fast-mode); a 256-word area of 24-bit registers; separate data-in (SDAi) and data-out (SDAo) pins
  - label: Digital I/O
    value: Configurable. A free-running PWM with set period and pulse width can come out on DIO7 or DIO8
  - label: Pin warning
    value: Several pins can become outputs after start-up, so use pull-up and pull-down resistors and never tie them straight to a supply or ground
- title: Absolute maximum ratings
  items:
  - label: V3P3D and V3P3A
    value: −0.5 to 4.6 V
  - label: GNDD and GNDA
    value: −0.5 to +0.5 V
  - label: Analog input pins (AIN1 to AIN4)
    value: −10 to +10 mA, and −0.5 V to V3P3 + 0.5 V
  - label: Digital pins (DIO1 to DIO15)
    value: −30 to +30 mA, and −0.5 V to V3P3D + 0.5 V
  - label: Junction temperature
    value: 125 °C continuous, 140 °C peak (100 ms)
  - label: Storage temperature
    value: −45 to +165 °C
  - label: Soldering temperature (10 s)
    value: 250 °C
  - label: ESD on all pins
    value: ±4 kV
- title: Temperature, package and ordering
  items:
  - label: Operating temperature
    value: −40 to +85 °C; −40 to +105 °C for the E versions
  - label: SY7T609 (TSSOP-14)
    value: SY7T609B (bulk), SY7T609T (tape and reel), SY7T609E+B, SY7T609E+T
  - label: SY7T610 (TSSOP-16)
    value: SY7T610B, SY7T610T, SY7T610E+T
  - label: SY7T611 (TQFN-24)
    value: SY7T611B, SY7T611T (no E version listed)
  - label: SY7T612 (TQFN-32, 5 × 5 mm)
    value: SY7T612B, SY7T612T, SY7T612E+T
  - label: Firmware
    value: None on the standard numbers. A plus sign and a code after the number, as in SY7T612B+ABC123, is a part pre-programmed with that firmware. The top marking is the same for programmed and blank parts
datasheet: https://www.silergy.com/download/downloadFile?id=6413&type=product&ftype=note
datasheet_revision: Rev. 1.1 (January 2026)
verified: true
draft: true
tags:
- energy-measurement
- metering
- processor
- i2c
- spi
- uart
- arduino
- esp32
- delta-sigma
- tssop-16
- tqfn-32
---

## How it works

The SY7T6xx is a power measurement chip in one package. A multiplexer feeds the sense inputs, one at a time, to a second-order delta-sigma ADC, with a trimmed voltage reference and a die-temperature sensor beside it. A 24-bit energy measurement processor (EMP) with its own flash and RAM runs firmware that does the arithmetic: measurement, compensation, calibration, alarms and the serial protocols. The chip runs from 3.3 V on an internal 20 MHz oscillator, and the SY7T611 and SY7T612 have pins for a crystal.

**The datasheet describes the hardware only.** Its section 2 sends the reader to the firmware documentation for the signal processing and measurement outputs, the fault detection and alarms, the calibration and commands, and the serial communication protocols. So the register map, the I2C address and the choice between I2C and UART all come from the firmware on your device. The standard ordering numbers list the firmware as "None". A number with a plus sign and a code, such as SY7T612B+ABC123, is pre-programmed with that firmware, and the datasheet says the flash can be reprogrammed. We found no public firmware document on the Silergy product pages for pre-programmed versions such as SY7T610+P1 and SY7T612+P3 (November 2026); they link the same datasheet and nothing else. The datasheet's contact for questions is support.em@silergy.com.

### Serial interfaces

Only one interface is active at a time. The chip samples DIO8 after a power-on reset: low selects SPI, and high selects UART or I2C, with the firmware choosing between those two. The datasheet asks for at least 10 ms after the reset for the choice to be latched, with DIO8 held steady. Its warning is that several pins can become outputs after start-up, so they should be set with pull-up or pull-down resistors and never tied straight to a supply or ground.

| Pin | SPI | UART | I2C |
| --- | --- | --- | --- |
| DIO5 | SSB (chip select, active low) | DIO5 (the SY7T612 pin table adds TXEN) | SCL |
| DIO3 | MISO | TX | SDAo (data out) |
| DIO2 | MOSI | RX | SDAi (data in) |
| DIO1 | SCK | DIO1 | DIO1 |
| DIO8 | Interface select | Interface select | Interface select |

- **SPI** is slave only, in mode 3 (CPOL = 1, CPHA = 1), most significant bit first. A read or write is one four-byte transaction with chip select held low: a command byte that holds the register number and the command, then three data bytes. Register numbers stop at 0x3F, and the shortest SCK cycle is 1 µs.
- **UART** is 8 data bits, one start bit, one stop bit and no parity, from 2400 to 115200 baud, with no handshake lines. The baud rates come from the 20 MHz clock; the datasheet's table gives the error, which is −0.22% at 57600 and 115200 and under 0.2% for the others. The frame format is in the firmware documentation.
- **I2C** is a slave with a 7-bit address at up to 400 kHz, over a 256-word area of 24-bit registers. The data-in and data-out pins are separate so that an opto-isolator can sit in the SDA path. The [Arduino section](#talk-to-it-from-an-esp32-s3) below covers it in detail.

## Variants and pins

| Part | Package | Analog inputs | Digital I/O | I2C in the pin table | RESETB | Crystal pins |
| --- | --- | --- | --- | --- | --- | --- |
| SY7T609 | TSSOP-14 | AIN1, AIN2P and AIN2N, and MFIO (analog input or digital I/O) | DIO1, 2, 3, 5, 7, 8 | No: SPI and UART only | None | None |
| SY7T610 | TSSOP-16 | AIN1P and N, AIN2P and N, AIN3 (single-ended) | DIO1, 2, 3, 4, 5, 7, 8 | Yes | None | None |
| SY7T611 | TQFN-24 | AIN1P and N, AIN2P and N, AIN3P and N | DIO0 to DIO10 | Yes | Pin 18 | XIN 9, XOUT 10 |
| SY7T612 | TQFN-32, 5 × 5 mm | AIN1 to AIN4, each P and N | DIO0 to DIO15 | Yes | Pin 23 | XIN 12, XOUT 13 |

The E versions differ only in temperature range, −40 to +105 °C instead of −40 to +85 °C. The ordering table lists E versions of the SY7T609, SY7T610 and SY7T612, and none of the SY7T611.

## Talk to it from an ESP32-S3

This section wires an ESP32-S3 dev board to an SY7T610, SY7T611 or SY7T612 over I2C. The sketch scans the bus, reads and writes 24-bit registers, and can pulse the reset pin. It is built from the [Arduino interface template](site:contribute/arduino/). It can't say what any register means, because the datasheet doesn't: that and the I2C address come with your firmware. The SY7T609 isn't covered, because its pin table lists no I2C pins.

> **Status:** Compile-checked for the ESP32-S3 (arduino-esp32 3.3.12, board ESP32S3 Dev Module), with no warnings. The console logic was also run on a PC against a simulated slave that follows the datasheet's transaction format. Not yet run on a real ESP32-S3 or a real SY7T6xx.

### What the datasheet gives

| Item | Value | Where |
| --- | --- | --- |
| Bus | I2C slave, 7-bit address, up to 400 kHz (Fast-mode) | Section 4.6.3 |
| Selecting it | DIO8 high at reset; the firmware picks I2C rather than UART | Section 4.6 |
| Pins | SCL on DIO5, SDA in on DIO2 (SDAi), SDA out on DIO3 (SDAo). Tie DIO2 and DIO3 together for a normal bus | Section 4.6.3, Figure 4-7 |
| Registers | A 256-word area of 24-bit registers. The register address is one byte, and each register is three bytes, most significant byte first | Section 4.6.3 |
| Write | Start, address and write bit, register, three data bytes, Stop. More registers can follow in the same transaction | Figures 4-8 and 4-9 |
| Read | Start, address and write bit, register, repeated Start, address and read bit, three bytes, no ACK on the last byte, Stop. Reading on returns the following registers | Figure 4-11 and text |
| Address pointer | Incremented when a Stop arrives. A current-address read continues from where the last access left it | Section 4.6.3 |
| Clock stretching | The acknowledge figure notes that the slave may hold SCL low to service interrupts | Page 19 |
| Timing | Table 5-1, below | Section 5.4.2 |
| Not in the datasheet | The 7-bit address, the register addresses and what they mean, and whether your firmware uses I2C or UART | Firmware documentation |

### Wiring

![ESP32-S3 dev board wired to an SY7T610, SY7T611 or SY7T612 over I2C. Our own design, not a datasheet circuit. RESETB is on the SY7T611 and SY7T612 only.](schematic:sy7t6xx-esp32s3-i2c-wiring.svg)

| Signal | ESP32-S3 | SY7T610 | SY7T611 | SY7T612 |
| --- | --- | --- | --- | --- |
| 3.3 V | 3V3 | 8, 13 | 8, 21 | 11, 24 |
| Ground | GND | 9, 3 | 11, 2 | 14 or 15, 1 |
| SCL | GPIO9 | 6 | 6 | 8 |
| SDA | GPIO8 | 10, 11 | 12, 13 | 16, 17 |
| DIO8 | none | 4 | 3 | 3 |
| RESETB | GPIO4 | none | 18 | 23 |

- **Use both supply pins and both ground pins.** The supply pins are V3P3D then V3P3A, and the grounds are GNDD then GNDA, in the order shown. The SY7T612 has two GNDD pins (14 and 15). Its exposed pad can go to ground, but the datasheet says it doesn't replace the ground pins.
- **SCL and SDA each have a pull-up to 3.3 V**, R3 and R4. Both chips run at 3.3 V, so the bus connects straight across with nothing in between. SDA is two pins on one net: DIO3 (SDAo) then DIO2 (SDAi), in the order shown.
- **GPIO8 and GPIO9** are the default I2C pins of the ESP32S3 Dev Module package. The sketch sets them itself, so they can move to other free pins.
- **DIO8 and RESETB** each have a resistor to 3.3 V (R1 and R2). GPIO4 only ever pulls RESETB low.
- **R1 and R2 are 10 kΩ by our choice.** The datasheet gives no value; it asks only for resistors rather than direct connections on pins that can become outputs, and says an unused RESETB can go to V3P3D directly or through a pull-up.
- **Keep DIO8 high for the first 10 ms after power-up or reset.** That is when the chip latches the interface. The sketch waits 100 ms after start-up before it talks to the part.
- **The SY7T610 has no reset pin.** To make it sample DIO8 again, cycle its 3.3 V supply. The dev board's 3V3 pin can't be switched, so power the part from a switchable supply if you need that.
- **The analog inputs** are left to your sensor circuit. For a bus test with nothing attached, the datasheet gives no advice. Its input range is measured against V3P3, ±250 mV, so we tie unused inputs to V3P3A (our reading; ask Silergy).
- **Decoupling** is not specified in the datasheet. Put the usual 100 nF capacitor close to each supply pin.

### Level and pull-up check

Both chips are 3.3 V devices, so the bus needs no shifting. These are the checks behind that, with the ESP32-S3 figures taken at VDD = 3.3 V from the DC characteristics in the [ESP32-S3 datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf).

| Check | Numbers | Result |
| --- | --- | --- |
| Voltage | The part's digital pins are rated to V3P3D + 0.5 V, which is 4.1 V at most. The ESP32-S3's pins are 3.3 V only | Safe to connect directly. Don't connect anything that drives 5 V to either chip |
| Bus high | Pull-ups put the bus at 3.3 V. The part needs VIH of 2 V minimum and the ESP32-S3 needs 0.75 × VDD, which is about 2.5 V | Both are met |
| Bus low, pulled by the ESP32-S3 | VOL is 0.1 × VDD maximum, 0.33 V. The part needs VIL of 0.8 V maximum | Met |
| Bus low, pulled by the part | VOL is 0.4 V maximum at 1 mA and 0.5 V at 10 mA. The ESP32-S3 needs VIL of 0.25 × VDD maximum, which is about 0.83 V | Met |
| Pull-up value | The datasheet's maximum rise time is 300 ns, depending on bus capacitance. Rise time is about 0.85 × R × C | 4.7 kΩ allows about 75 pF of bus capacitance, 2.2 kΩ about 160 pF and 10 kΩ only about 35 pF. The ESP32-S3's internal pull-ups, about 45 kΩ, allow only about 8 pF, so use real resistors |
| Pull-up current | 3.3 V across 2.2 kΩ is 1.5 mA, between the part's 1 mA and 10 mA output-low test points (0.4 V and 0.5 V maximum) | Fine down to about 2.2 kΩ |
| Supply | The part draws 10.3 mA at most | Small next to what a dev board's 3.3 V regulator is rated for. Check yours |

### The sketch

Paste it into a new sketch, choose the board *ESP32S3 Dev Module* (or your own ESP32-S3 board), and open the Serial Monitor at 115200 baud with line ending *Newline*. The first block is the only one to edit.

```cpp
/*
  SY7T6xx register console for an ESP32-S3, over I2C.

  Status: compiles for the ESP32-S3 (arduino-esp32 3.3.12). Not yet run against
  a real device.
  Wiring: see the table and drawing above. Everything is 3.3 V, so SDA and SCL
  connect straight across, each with its own pull-up to 3.3 V.

  Tools > Board: ESP32S3 Dev Module (or your board). Serial Monitor: 115200
  baud, line ending Newline.
*/
#include <Wire.h>

// ===== 1. DEVICE CONFIG: edit this block ==================================

// 7-bit I2C address. The datasheet doesn't give it: it comes from your
// firmware's documentation. 0 means not set, so use the 'scan' command.
const uint8_t  DEVICE_ADDR = 0x00;

// Register width on the bus: 24 bits, most significant byte first.
const uint8_t  WORD_BYTES  = 3;

// Highest register number: a 256-word register space.
const uint16_t REG_MAX     = 0xFF;

// I2C clock. 100 kHz to start; the datasheet allows up to 400 kHz.
const uint32_t BUS_HZ      = 100000;

// ESP32-S3 pins for SDA and SCL: the board package's default I2C pins. Any
// free GPIO works.
const int8_t   I2C_SDA_PIN = 8;
const int8_t   I2C_SCL_PIN = 9;

// ESP32-S3 pin wired to RESETB (SY7T611 and SY7T612 only), or -1 if none.
// GPIO4 is the pin the wiring table uses.
const int8_t   RESET_PIN   = -1;

// Wait after power-up or reset. The datasheet asks for at least 10 ms.
const uint16_t BOOT_MS     = 100;

// Registers the 't' command reads. These are EXAMPLES: word addresses from
// the SY7T609+S1 firmware's register map (a UART and SPI firmware).
// Replace them with your firmware's map.
struct NamedReg { const char *name; uint8_t reg; };
const NamedReg REGS[] = {
  {"FW_VERSION", 0x01}, {"CTEMP", 0x0D}, {"VRMS", 0x11}, {"IRMS", 0x12},
  {"POWER", 0x13}, {"VAR", 0x14}, {"VA", 0x15}, {"FREQUENCY", 0x16},
};

bool parseNum(const char *s, uint32_t &out);
void printHex(uint32_t v, uint8_t digits);

// ===== 2. BUS LAYER: I2C (Wire library) ===================================
// A register read is a "random read": write the register address, then a
// repeated START and read WORD_BYTES bytes, most significant byte first.
// The address pointer is set before every read, so nothing depends on where
// an earlier access left it. On the ESP32 the Wire library sends the address
// write and the read as one transaction, with the repeated START between them.

// Changed at run time by the 'addr' and 'scan' commands.
uint8_t devAddr = DEVICE_ADDR;
// Wire's endTransmission() code, kept for messages.
static uint8_t lastErr = 0;

bool busBegin() {
  if (!Wire.begin(I2C_SDA_PIN, I2C_SCL_PIN, BUS_HZ)) return false;
  // Give up after 25 ms instead of the default 50 ms if the bus is stuck.
  Wire.setTimeOut(25);
  return true;
}

bool busReady() { return devAddr != 0; }

bool devRead(uint16_t reg, uint32_t &value) {
  Wire.beginTransmission(devAddr);
  Wire.write((uint8_t)reg);
  lastErr = Wire.endTransmission(false);   // false: repeated START, no STOP
  if (lastErr) return false;
  if (Wire.requestFrom(devAddr, (size_t)WORD_BYTES) != WORD_BYTES) {
    lastErr = 4;
    return false;
  }
  value = 0;
  for (uint8_t i = 0; i < WORD_BYTES; i++) {
    value = (value << 8) | (uint8_t)Wire.read();
  }
  return true;
}

bool devWrite(uint16_t reg, uint32_t value) {
  Wire.beginTransmission(devAddr);
  Wire.write((uint8_t)reg);
  for (int8_t i = WORD_BYTES - 1; i >= 0; i--) {
    Wire.write((uint8_t)(value >> (8 * i)));
  }
  lastErr = Wire.endTransmission();        // the STOP starts the write
  return lastErr == 0;
}

const __FlashStringHelper *busError() {
  switch (lastErr) {
    case 2:  return F("no ACK on the address: nothing answered there");
    case 3:  return F("no ACK on a data byte");
    case 4:  return F("no data back: no ACK on the address, or SDA or SCL stuck?");
    case 5:  return F("bus timeout: SDA or SCL stuck low?");
    default: return F("I2C error");
  }
}

// I2C-only console commands. 'scan' lists the addresses that answer and
// 'addr 0x..' sets the address.
bool busCommand(const char *cmd, const char *arg) {
  uint32_t n;
  if (!strcmp(cmd, "scan")) {
    uint8_t found = 0, first = 0;
    for (uint8_t a = 0x08; a < 0x78; a++) {
      Wire.beginTransmission(a);
      if (Wire.endTransmission() == 0) {
        Serial.print(F("  ACK at 0x")); printHex(a, 2); Serial.println();
        if (!found++) first = a;
      }
    }
    if (found == 1) {
      devAddr = first;
      Serial.println(F("One device found; using it."));
    } else if (!found) {
      Serial.println(F("Nothing answered. Check power, wiring, pull-ups."));
    }
    return true;
  }
  if (!strcmp(cmd, "addr")) {
    if (arg && parseNum(arg, n) && n > 0 && n < 0x78) devAddr = n;
    Serial.print(F("device address 0x")); printHex(devAddr, 2); Serial.println();
    return true;
  }
  return false;
}

// ===== 3. CONSOLE (the same for every bus) ================================
// Serial Monitor at 115200 baud, line ending "Newline". Commands:
//   help | scan | addr 0x2A | r <reg> | w <reg> <value> | d <first> <count>
//   | t | reset
// Numbers can be decimal or 0x hex.

bool parseNum(const char *s, uint32_t &out) {
  char *end;
  out = strtoul(s, &end, 0);
  return end != s && *end == 0;
}

void printHex(uint32_t v, uint8_t digits) {
  for (int8_t i = digits - 1; i >= 0; i--) {
    Serial.print((uint8_t)((v >> (4 * i)) & 0xF), HEX);
  }
}

void printWord(uint32_t v) {
  const uint8_t bits = WORD_BYTES * 8;
  int32_t s = (int32_t)v;
  if (bits < 32 && (v & (1UL << (bits - 1)))) {
    s = (int32_t)(v | (0xFFFFFFFFUL << bits));      // sign-extend
  }
  Serial.print(F("0x")); printHex(v, WORD_BYTES * 2);
  Serial.print(F("  unsigned ")); Serial.print(v);
  Serial.print(F("  signed ")); Serial.println(s);
}

void deviceReset() {
  if (RESET_PIN < 0) {
    Serial.println(F("RESET_PIN is not set."));
    return;
  }
  // Only ever pulled LOW. The 3.3 V pull-up on the part makes it high.
  pinMode(RESET_PIN, OUTPUT);
  digitalWrite(RESET_PIN, LOW);
  delay(2);
  pinMode(RESET_PIN, INPUT);
  delay(BOOT_MS);
  Serial.println(F("Reset done."));
}

void showRead(uint16_t reg) {
  uint32_t v;
  if (devRead(reg, v)) printWord(v);
  else Serial.println(busError());
}

void help() {
  Serial.println(F("r <reg>            read one register"));
  Serial.println(F("w <reg> <value>    write one register (this can change"));
  Serial.println(F("                   the device's setup: be careful)"));
  Serial.println(F("d <first> <count>  read a run of registers"));
  Serial.println(F("t                  read the named registers in REGS[]"));
  Serial.println(F("scan / addr <a>    I2C only: find the device / set address"));
  Serial.println(F("reset              pulse the reset pin, if RESET_PIN is set"));
}

void handle(char *ln) {
  char *cmd = strtok(ln, " \t");
  char *a1 = strtok(NULL, " \t");
  char *a2 = strtok(NULL, " \t");
  uint32_t reg, val;
  if (!cmd) return;
  if (busCommand(cmd, a1)) return;
  if (!strcmp(cmd, "help") || !strcmp(cmd, "?")) { help(); return; }
  if (!strcmp(cmd, "reset")) { deviceReset(); return; }
  if (!busReady()) {
    Serial.println(F("No device address yet: type 'scan' or 'addr 0x..'."));
    return;
  }
  if (a1 && parseNum(a1, reg) && reg > REG_MAX) {
    Serial.println(F("Register number is above REG_MAX."));
    return;
  }
  if (!strcmp(cmd, "r") && a1 && parseNum(a1, reg)) {
    showRead(reg);
  } else if (!strcmp(cmd, "w") && a1 && a2 &&
             parseNum(a1, reg) && parseNum(a2, val)) {
    if (devWrite(reg, val)) Serial.println(F("written"));
    else Serial.println(busError());
  } else if (!strcmp(cmd, "d") && a1 && a2 &&
             parseNum(a1, reg) && parseNum(a2, val)) {
    for (uint32_t i = 0; i < val && reg + i <= REG_MAX; i++) {
      Serial.print(F("[0x")); printHex(reg + i, 2); Serial.print(F("]  "));
      showRead(reg + i);
    }
  } else if (!strcmp(cmd, "t")) {
    for (uint8_t i = 0; i < sizeof(REGS) / sizeof(REGS[0]); i++) {
      Serial.print(REGS[i].name);
      Serial.print(F("  [0x")); printHex(REGS[i].reg, 2); Serial.print(F("]  "));
      showRead(REGS[i].reg);
    }
  } else {
    Serial.println(F("?  (type help)"));
  }
}

char lineBuf[40];
uint8_t lineLen = 0;

void setup() {
  Serial.begin(115200);
  // On the native USB port, text sent before the Serial Monitor connects is
  // lost, so wait up to 3 s for it. A UART port is ready at once.
  for (uint32_t t0 = millis(); !Serial && millis() - t0 < 3000; ) delay(10);
  // High-impedance until a reset is asked for.
  if (RESET_PIN >= 0) pinMode(RESET_PIN, INPUT);
  delay(BOOT_MS);                     // let the device finish starting up
  if (!busBegin()) Serial.println(F("The bus did not start. Check the pin numbers."));
  Serial.println(F("Register console ready. Type help."));
  if (!busReady()) Serial.println(F("Type scan to find the device."));
}

void loop() {
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\n' || c == '\r') {
      if (lineLen) {
        lineBuf[lineLen] = 0;
        handle(lineBuf);
        lineLen = 0;
      }
    } else if (lineLen < sizeof(lineBuf) - 1) {
      lineBuf[lineLen++] = c;
    }
  }
}
```

The named registers in `REGS[]` are examples. They are word addresses from the register map in Silergy's [SY7T609+S1 datasheet](https://www.silergy.com/download/downloadFile?id=2712&type=product&ftype=note) (Rev. 1.2): FW Version at 0x01, CTemp at 0x0D, VRMS at 0x11, IRMS at 0x12, Power at 0x13, VAR at 0x14, VA at 0x15 and Frequency at 0x16. That is a UART and SPI firmware with no I2C, and other firmware may lay its registers out differently, so use them as a place to start exploring. The values come back as raw 24-bit words. That firmware scales them with its own scale registers, so nothing here converts them to volts or amps.

### Using it

1. Build the wiring with the power off. Power the part from the board's 3V3 pin and join the grounds.
2. Power up and check for 3.3 V at the supply pins and for about 3.3 V on DIO8.
3. Upload the sketch and open the Serial Monitor.
4. Type `scan`. A part running I2C firmware answers at one address, and the sketch uses it. Put the address in `DEVICE_ADDR` so it is there next time.
5. Type `r 1` to read a register, `d 0 16` to read the first sixteen, and `t` to read the named ones. Your firmware's documentation says what they mean.
6. Be careful with `w`. Registers can hold calibration, configuration and commands, and a wrong write can change the part's setup.

If `scan` finds nothing, check these in order:

- The firmware on your part may use UART rather than I2C, or the part may have no firmware at all.
- DIO8 must be high at reset and stay still for 10 ms. Type `reset` (SY7T611 and SY7T612) or cycle the 3.3 V supply, then scan again.
- SDA must go to both DIO3 and DIO2, and SCL to DIO5.
- SDA and SCL each need a pull-up to 3.3 V.
- A message of "bus timeout" means SDA or SCL is stuck low. Look for a short, or for a missing ground connection.

### Pitfalls with the ESP32-S3

- **Two USB ports.** Many ESP32-S3 dev boards have two. The one marked UART goes through a USB-to-serial chip and works with the default settings. The one marked USB is the chip's own port: set *USB CDC On Boot* to *Enabled* in the Tools menu to make `Serial` use it. The sketch waits up to 3 s for the Serial Monitor on that port, so the first lines aren't lost.
- **The ESP32-S3 may reset when the Serial Monitor opens**, on boards where the USB-to-serial chip drives the reset line. The part doesn't, because it stays powered, so DIO8 is not sampled again. If the part was already running I2C, that is fine.
- **Pick free pins.** Avoid GPIO0, 3, 45 and 46 (boot strapping), GPIO19 and 20 (the USB port) and GPIO26 to 37 (flash and PSRAM on many modules). GPIO8, 9 and 4 are free on the usual dev boards.
- **A missing device shows as a failed read.** The ESP32 `Wire` library sends the register address and the read as one transaction, so the sketch reports "no data back" rather than "no ACK" when the address is wrong. Use `scan` to find the address first.
- **A stuck bus** would otherwise hold the library for its default 50 ms on every call. The sketch sets a 25 ms time-out, so it reports "bus timeout".
- **Start at 100 kHz.** `BUS_HZ` can go up to 400 kHz once things work. The bus-free time between a Stop and the next Start must be at least 1.5 µs (tBUF), which is longer than the 1.3 µs of standard Fast-mode. The part may also hold SCL low to service interrupts (page 19): if reads fail now and then, lower `BUS_HZ`.
- **`Wire` buffers 128 bytes** on the ESP32, which is 42 registers of three bytes. The sketch reads one at a time.

### I2C timing

Datasheet Table 5-1. All values are guaranteed by design and not tested.

| Parameter | Minimum | Maximum | Unit |
| --- | --- | --- | --- |
| tBUF, bus free time between Stop and Start | 1500 | – | ns |
| tICF, input fall time | 20 (depends on bus capacitance) | 300 | ns |
| tICR, input rise time | 20 (depends on bus capacitance) | 300 | ns |
| tSTH, Start or repeated Start hold time | 500 | – | ns |
| tSTS, repeated Start setup time | 600 | – | ns |
| tSCH, SCL high time | 600 | – | ns |
| tSCL, SCL low time | 1300 | – | ns |
| tSDS, data setup time | 100 | – | ns |
| tSDH, data hold time | 10 | – | ns |
| tVDA, SCL low to SDA valid, and to the ACK pulling SDA low | – | 900 | ns |

## Things to watch

- **Check that your part has firmware.** The standard ordering numbers carry none, and the datasheet doesn't say how a blank part behaves on the bus. For I2C you need a part pre-programmed with I2C firmware, or a way to program one, and that firmware's documentation.
- **The SY7T609 has no I2C pins in its pin table**, although section 4.6.3 describes I2C for the family. Treat it as SPI and UART only.
- **Resets differ.** The SY7T609 and SY7T610 have no RESETB pin, so a power cycle is how you re-sample DIO8. The SY7T611 and SY7T612 have one.
- **The input range is small.** Full scale is ±250 mV peak (176.78 mV RMS) around V3P3, and the datasheet recommends a common-mode voltage under ±25 mV. The inputs take scaled sensor signals, never mains. Anything connected to a mains circuit needs proper isolation and scaling.
- **No resistor across the crystal.** The oscillator is self-biasing. If there is no crystal, the datasheet says to connect XOUT to GNDD and leave XIN open.
- **One 3.3 V rail feeds both supply pins.** The power-on reset watches V3P3D.

## Datasheet notes

- The SY7T610 top-view drawing numbers the right-hand pins 14, 13, 12, 14, 11, 13, 12, 11. The pin table numbers them 16 down to 9, and this page uses the table.
- The table of pin multiplexing in section 4.5 gives only the SY7T612's pin numbers (DIO15 on pin 2 down to DIO0 on pin 20). Use each part's own pin table.
- The SY7T609 pin table lists no I2C functions. Sections 4.5 and 4.6.3 describe I2C for the whole family.
- The description says "up to six" analog inputs. The pin tables show up to four differential pairs on the SY7T612, and the datasheet doesn't say how the six is counted.
- Figure 4-7 labels the pull-up supply "V3P3 or 5VDC". The digital pins are rated to V3P3D + 0.5 V and the datasheet doesn't call them 5 V tolerant, so this page pulls the bus up to 3.3 V.
- The SPI command table gives the two low bits of the command byte as "0x0" for a read and "0x02" for a write. Two bits can hold 0 and 2, so we read them as 00 and 10 in binary.
- For an external clock the text says to connect it to XOUT and tie XIN to GNDD. That is the reverse of the usual arrangement, so check it with Silergy before building it.
- Section 4.6.3 says register writes take effect at the Stop, which also increments the address pointer. It doesn't say what a Stop does after an address-only write, so the sketch sets the pointer with a repeated Start and never relies on it.
