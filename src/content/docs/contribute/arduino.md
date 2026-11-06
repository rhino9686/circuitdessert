---
title: Add an Arduino interface
description: "Add wiring, a level check and a sketch so an ESP32-S3 can talk to a part over I2C, SPI or UART."
sidebar:
  order: 5
---

Many parts have a serial bus that a hobbyist can reach from a microcontroller board. A part page can carry an optional section, **Talk to it from an ESP32-S3**, with the wiring, a check that the voltage levels are safe, and a sketch that reads and writes the part's registers. This page is the template for that section. The [SY7T6xx page](site:parts/silergy/sy7t6xx/) is a finished example.

The template assumes an ESP32-S3 dev board running the Arduino-ESP32 board package, and a part with 3.3 V logic. A board with 5 V logic needs level shifting, which this guide doesn't cover yet. The sketches call a few ESP32-specific functions (`Wire.begin(sda, scl, hz)`, `Wire.setTimeOut()`, and the pin arguments of `SPI.begin()` and `Serial1.begin()`), so another 3.3 V board may need small changes there.

## When to add one

- The part has an I2C, SPI or UART interface, and the datasheet describes enough of it to write one register read and one register write.
- The part's serial pins are 3.3 V logic. For a part with 5 V or lower-voltage logic, leave the section out until this guide covers level shifting.
- If the datasheet leaves something out, such as the I2C address, the register map or the UART frame format, still add the section. Say plainly what is missing, and make the sketch work without it. The SY7T6xx sketch does this with a `scan` command that finds the address.
- Leave it out for parts with no serial bus, and for buses the ESP32-S3 can't speak with these libraries.

## Steps

1. Add the section to the part page, after *How it works* and *Example application* and before *Layout* and *Things to watch*.
2. Fill in the subsections in the order below.
3. Copy the sketch blocks from this page, edit block 1 from the datasheet, and swap block 2 if the bus is SPI or UART.
4. Compile the sketch and set the status line to say what you did, as described under [Checking the sketch](#checking-the-sketch).
5. Draw the wiring if you can. A drawing is a schematic like any other: see [Schematic drawings](site:contribute/recipe/) in the recipe guide.

## The section

Copy this into the part page and fill it in. Section numbers and the contents panel come from the headings, as on the rest of the page.

````md
## Talk to it from an ESP32-S3

Two or three sentences: which bus, what the sketch does, and what it can't do. Say what the datasheet doesn't give.

> **Status:** Compile-checked for the ESP32-S3 (arduino-esp32 3.3.12). Not yet run against a real part.

### What the datasheet gives

| Item | Value | Where |
| --- | --- | --- |
| Bus | I2C slave, 7-bit address, up to 400 kHz | Section 4.6.3 |
| Pins | SCL on pin 6, SDA on pins 10 and 11 | Pin table |
| Register width | 24 bits, most significant byte first | Section 4.6.3 |
| Not in the datasheet | The I2C address and the register map | |

### Wiring

![ESP32-S3 wired to the part over I2C](schematic:<part>-esp32s3-i2c-wiring.svg)

| Signal | ESP32-S3 | Part pin | Notes |
| --- | --- | --- | --- |
| Supply | 3V3 | 8, 13 | Both supply pins |
| Ground | GND | 3, 9 | Both ground pins |

### Level and pull-up check

A table in the form shown under "The level and pull-up check" below, with this part's numbers.

### The sketch

```cpp
// the stitched sketch: block 1 + block 2 + block 3
```

### Using it

Numbered first-run steps, and what to try when nothing answers.

### Pitfalls with the ESP32-S3

Only what matters when you drive this part from an ESP32-S3. The SY7T6xx page has a ready list to start from.
````

Each subsection has a job:

- **What the datasheet gives.** One row for each fact the sketch relies on, with the datasheet section. Add a row, *Not in the datasheet*, for anything missing. Don't fill a gap with a guess: leave the value in the config block at "not set" and say how the user finds it.
- **Wiring.** A table with every connection the bench setup needs: supply, ground, the bus pins, any pin that selects the interface, and reset. Give pin numbers for each package the page covers, and the ESP32-S3 GPIO numbers the sketch uses. A pin that has to go through a resistor, not a wire, says so in the notes.
- **Level and pull-up check.** See below.
- **The sketch.** The stitched sketch, in one code block, so it can be copied in one go.
- **Using it.** What to open, what to type, what a good answer looks like, and what to check first when there is none.
- **Pitfalls with the ESP32-S3.** Board-specific problems only. Quirks of the part itself belong in the page's own *Things to watch*.

## The level and pull-up check

The ESP32-S3's pins are 3.3 V only, and this guide covers parts whose serial pins are 3.3 V logic too. Check the following before the wiring table goes on the page. The ESP32-S3 figures are at VDD = 3.3 V, from the DC characteristics in the [ESP32-S3 datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf).

| Check | What to compare | Rule |
| --- | --- | --- |
| Voltage | The part's logic supply, and its absolute maximum on a digital pin (usually its supply plus 0.3 to 0.5 V). | Both chips must run at 3.3 V. If the part's pins are 5 V logic, or its supply is lower than 3.3 V, stop: the wiring needs level shifting, which this guide doesn't cover yet. |
| Part output into the ESP32-S3 | The part's high output level (VOH) and low output level (VOL) against the ESP32-S3's VIH of 0.75 × VDD (about 2.5 V) and VIL of 0.25 × VDD (about 0.83 V). | The part's high level must be above 2.5 V and its low level below 0.83 V, at the load the pin sees. |
| ESP32-S3 output into the part | The ESP32-S3's VOH of 0.8 × VDD (about 2.64 V) and VOL of 0.1 × VDD (about 0.33 V) against the part's VIH and VIL. | The part's VIH minimum must be at or below 2.64 V and its VIL maximum at or above 0.33 V. This covers SCK, MOSI, chip select, TX, and any reset or enable line. |
| I2C pull-ups | The ESP32-S3's internal pull-ups are about 45 kΩ. Rise time is about 0.85 × R × C, with C the total bus capacitance, against the part's maximum rise time. | Use real resistors to the part's supply, usually 2.2 to 10 kΩ, and work out the result for the one you draw. Write it on the page. |
| Supply | The part's supply current against what the dev board's 3.3 V regulator is rated for. | Enough for most small parts. For more, give the part its own 3.3 V regulator and join the grounds. |

## The sketch

Every sketch has three blocks, and only the first two change from part to part:

1. **Device config.** The numbers from the datasheet: address or chip select, register width, bus speed, the ESP32-S3 pins, reset pin, start-up time, and a short list of named registers for the `t` command.
2. **Bus layer.** The same four functions for every bus: `busBegin()`, `devRead(reg, value)`, `devWrite(reg, value)` and `busError()`, plus `busReady()` and `busCommand()`. This is where I2C, SPI and UART differ.
3. **Console.** A serial console on the board's USB port that works the same for every bus, so a user who has learned it on one part can use it on the next.

The console takes these commands in the Serial Monitor (115200 baud, line ending *Newline*), with numbers in decimal or `0x` hex:

| Command | What it does |
| --- | --- |
| `r <reg>` | Read one register and show it in hex, unsigned and signed |
| `w <reg> <value>` | Write one register |
| `d <first> <count>` | Read a run of registers |
| `t` | Read the named registers in `REGS[]` |
| `scan`, `addr <a>` | I2C only: find the part, or set its 7-bit address |
| `reset` | Pull the reset pin low for 2 ms, if `RESET_PIN` is set |

The ESP32-S3 can route a bus to almost any free pin, so each config block names the pins it uses. Pick pins that aren't GPIO0, 3, 45 or 46 (boot strapping), GPIO19 or 20 (the USB port), or GPIO26 to 37 (flash and PSRAM on many modules).

### Block 1 and 2 for I2C

The config block, filled in with placeholders:

```cpp
/*
  <PART> register console for an ESP32-S3, over I2C.

  Status: <compiles for the ESP32-S3 (arduino-esp32 3.3.12), not yet run
          against a device> or <run on a real <PART>, <date>>
  Wiring: see the wiring table above.

  Tools > Board: ESP32S3 Dev Module (or your board). Serial Monitor: 115200
  baud, line ending Newline.
*/
#include <Wire.h>

// ===== 1. DEVICE CONFIG: edit this block ==================================

// 7-bit I2C address from the datasheet. 0 means not set: use 'scan'.
const uint8_t  DEVICE_ADDR = 0x00;

// Register width on the bus, in bytes (1 to 4), most significant byte first.
const uint8_t  WORD_BYTES  = 1;

// Highest register number.
const uint16_t REG_MAX     = 0xFF;

// I2C clock. Check the datasheet's maximum.
const uint32_t BUS_HZ      = 100000;

// ESP32-S3 pins for SDA and SCL: the board package's default I2C pins. Any
// free GPIO works.
const int8_t   I2C_SDA_PIN = 8;
const int8_t   I2C_SCL_PIN = 9;

// ESP32-S3 pin wired to the part's reset input, or -1 if none.
const int8_t   RESET_PIN   = -1;

// Wait after power-up or reset: the datasheet's start-up time, with margin.
const uint16_t BOOT_MS     = 100;

// Registers the 't' command reads: name and register number.
// Replace the example.
struct NamedReg { const char *name; uint8_t reg; };
const NamedReg REGS[] = {
  {"WHO_AM_I", 0x00},
};

bool parseNum(const char *s, uint32_t &out);
void printHex(uint32_t v, uint8_t digits);
```

The bus layer:

```cpp
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
```

### Block 1 and 2 for SPI

The values in the config block are an example, taken from the SY7T6xx's SPI frame: the command byte is the register number shifted left by two, ORed with the command, and then comes the data. Replace every one of them from your datasheet.

```cpp
/*
  <PART> register console for an ESP32-S3, over SPI.
  Wiring (ESP32-S3): GPIO12 = SCK, GPIO11 = MOSI, GPIO13 = MISO, GPIO10 = chip
  select. Everything is 3.3 V.
*/
#include <SPI.h>

// ===== 1. DEVICE CONFIG: edit this block ==================================
// The values below are an EXAMPLE: the SY7T6xx's SPI frame (command byte =
// register << 2 | command, then 3 data bytes, mode 3). Replace every one of
// them from your part's datasheet.

// ESP32-S3 pins: the board package's default SPI pins. Any free GPIO works.
const int8_t   SCK_PIN       = 12;
const int8_t   MISO_PIN      = 13;
const int8_t   MOSI_PIN      = 11;
const int8_t   CS_PIN        = 10;         // chip select (active low)

const uint32_t BUS_HZ        = 500000;     // at or below the datasheet's maximum
const uint8_t  SPI_DATA_MODE = SPI_MODE3;  // SPI_MODE0 to 3: the CPOL and CPHA
const uint8_t  WORD_BYTES    = 3;          // data bytes after the command byte
const uint16_t REG_MAX       = 0x3F;       // highest register number
const uint8_t  ADDR_SHIFT    = 2;          // command byte = reg << ADDR_SHIFT | cmd
const uint8_t  CMD_READ      = 0x00;
const uint8_t  CMD_WRITE     = 0x02;

// ESP32-S3 pin wired to the part's reset input, or -1 if none.
const int8_t   RESET_PIN     = -1;
// Wait after power-up or reset.
const uint16_t BOOT_MS       = 100;

struct NamedReg { const char *name; uint8_t reg; };
const NamedReg REGS[] = {
  {"EXAMPLE", 0x01},
};

bool parseNum(const char *s, uint32_t &out);
void printHex(uint32_t v, uint8_t digits);
```

```cpp
// ===== 2. BUS LAYER: SPI ==================================================
// One transaction: chip select low, command byte, WORD_BYTES data bytes, chip
// select high. For a read the bytes sent are zeros and the bytes that come
// back are the register. If your part answers in a different byte (after a
// dummy byte, say), change spiFrame().

bool busBegin() {
  pinMode(CS_PIN, OUTPUT);
  digitalWrite(CS_PIN, HIGH);
  SPI.begin(SCK_PIN, MISO_PIN, MOSI_PIN);   // chip select is driven by hand
  return true;
}

bool busReady() { return true; }
bool busCommand(const char *, const char *) { return false; }  // none for SPI
const __FlashStringHelper *busError() {
  return F("SPI has no error codes: check wiring and mode");
}

// data is sent, then replaced by the reply.
static void spiFrame(uint8_t cmd, uint16_t reg, uint8_t *data) {
  SPI.beginTransaction(SPISettings(BUS_HZ, MSBFIRST, SPI_DATA_MODE));
  digitalWrite(CS_PIN, LOW);
  SPI.transfer((uint8_t)((reg << ADDR_SHIFT) | cmd));
  SPI.transfer(data, WORD_BYTES);
  digitalWrite(CS_PIN, HIGH);
  SPI.endTransaction();
}

bool devRead(uint16_t reg, uint32_t &value) {
  uint8_t b[4] = {0, 0, 0, 0};
  spiFrame(CMD_READ, reg, b);
  value = 0;
  for (uint8_t i = 0; i < WORD_BYTES; i++) value = (value << 8) | b[i];
  return true;
}

bool devWrite(uint16_t reg, uint32_t value) {
  uint8_t b[4];
  for (uint8_t i = 0; i < WORD_BYTES; i++) {
    b[i] = (uint8_t)(value >> (8 * (WORD_BYTES - 1 - i)));
  }
  spiFrame(CMD_WRITE, reg, b);
  return true;
}
```

### Block 1 and 2 for UART

The ESP32-S3 has spare hardware UARTs, so this layer talks to the part on `Serial1`, on two free pins. The USB port stays free for the Serial Monitor, and any baud rate up to 115200 is fine. The frame bytes in the config block are placeholders: `buildRead()` and `buildWrite()` are the two functions to rewrite from the datasheet's UART section.

```cpp
/*
  <PART> register console for an ESP32-S3, over a UART.
  The ESP32-S3 has spare hardware UARTs, so the part talks to Serial1 on two
  free pins and the USB port stays free for the Serial Monitor.
  Wiring (ESP32-S3): GPIO18 = RX (from the part's TX), GPIO17 = TX (to the
  part's RX). Everything is 3.3 V.
*/

// ===== 1. DEVICE CONFIG: edit this block ==================================

// ESP32-S3 pins for Serial1. Any free GPIO works.
const int8_t   UART_RX_PIN = 18;
const int8_t   UART_TX_PIN = 17;
const uint32_t UART_BAUD   = 9600;
const uint16_t REPLY_MS    = 100;    // how long to wait for a reply
const uint8_t  WORD_BYTES  = 3;      // data bytes per register
const uint16_t REG_MAX     = 0xFF;   // highest register number

// ESP32-S3 pin wired to the part's reset input, or -1 if none.
const int8_t   RESET_PIN   = -1;
// Wait after power-up or reset.
const uint16_t BOOT_MS     = 100;

// The frame format. These two functions are the part of the sketch that comes
// from the datasheet's UART protocol section. The bytes are placeholders:
// replace them. Each function returns the frame length.
size_t buildRead(uint16_t reg, uint8_t *out) {
  out[0] = 0x52;                     // 'R'
  out[1] = (uint8_t)reg;
  return 2;
}
size_t buildWrite(uint16_t reg, uint32_t value, uint8_t *out) {
  out[0] = 0x57;                     // 'W'
  out[1] = (uint8_t)reg;
  for (uint8_t i = 0; i < WORD_BYTES; i++) {
    out[2 + i] = (uint8_t)(value >> (8 * (WORD_BYTES - 1 - i)));
  }
  return 2 + WORD_BYTES;
}

struct NamedReg { const char *name; uint8_t reg; };
const NamedReg REGS[] = {
  {"EXAMPLE", 0x01},
};

bool parseNum(const char *s, uint32_t &out);
void printHex(uint32_t v, uint8_t digits);
```

```cpp
// ===== 2. BUS LAYER: UART (hardware Serial1) ==============================
HardwareSerial &dev = Serial1;

bool busBegin() {
  dev.begin(UART_BAUD, SERIAL_8N1, UART_RX_PIN, UART_TX_PIN);
  return true;
}
bool busReady() { return true; }
bool busCommand(const char *, const char *) { return false; }  // none for UART
const __FlashStringHelper *busError() {
  return F("no reply: check wiring, baud rate and frame format");
}

static void sendFrame(const uint8_t *frame, size_t n) {
  while (dev.available()) dev.read();   // drop anything left from an earlier reply
  dev.write(frame, n);
}

bool devRead(uint16_t reg, uint32_t &value) {
  uint8_t frame[8];
  sendFrame(frame, buildRead(reg, frame));
  value = 0;
  for (uint8_t i = 0; i < WORD_BYTES; i++) {
    uint32_t t0 = millis();
    while (!dev.available()) {
      if (millis() - t0 > REPLY_MS) return false;
    }
    // Most significant byte first. Swap if your part sends the low byte first.
    value = (value << 8) | (uint8_t)dev.read();
  }
  return true;
}

bool devWrite(uint16_t reg, uint32_t value) {
  uint8_t frame[8];
  sendFrame(frame, buildWrite(reg, value, frame));
  return true;   // add a wait for the part's acknowledge if it sends one
}
```

### Block 3, the console

Paste this after block 2, unchanged.

```cpp
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

Put the blocks in one `.ino` file in the order 1, 2, 3. In the Arduino IDE the file's folder must have the same name as the file.

## Checking the sketch

- **Compile it.** In the Arduino IDE, install the *esp32 by Espressif Systems* board package (version 3) from the Boards Manager, choose the board *ESP32S3 Dev Module* and press Verify. From a terminal, add Espressif's board index to `arduino-cli`, run `arduino-cli core install esp32:esp32`, then `arduino-cli compile --warnings all --fqbn esp32:esp32:esp32s3 <sketch folder>`. In the IDE, set *Compiler warnings* to *All* in the preferences. Fix every warning.
- **Say what you did.** The status line has two forms. *Compile-checked for the ESP32-S3 (arduino-esp32 3.3.12). Not yet run against a real part.* is for a sketch you compiled and didn't run. *Run on a <part> with an ESP32-S3 on <date>: <what it read>.* is for a sketch you ran. Don't write "tested" for a sketch that has only been compiled.
- **Check the pins.** Every GPIO in the config block exists on the board you name, and none of them is a boot-strapping, USB or flash pin.

## Checklist

- Every row in *What the datasheet gives* is checked against the datasheet, with the section.
- Anything the datasheet doesn't give is listed as missing, and the sketch still works without it.
- The level and pull-up check covers every wire between the ESP32-S3 and the part, in both directions.
- The pull-up value is worked out against the part's rise-time limit.
- Pin numbers are checked against the pin table for every package on the page.
- The page warns about writes that can change calibration or configuration.
- The sketch compiles without warnings, and the status line says what was and wasn't done.
