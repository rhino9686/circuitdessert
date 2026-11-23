---
title: "ESP32-S3 starter board: USB-C power, a 3.3 V regulator, an I2C sensor and a Qwiic port on a 50 × 50 mm four-layer board (setup guide)"
kind: tutorial
category: Digital / Microcontroller board
summary: "A 50 × 50 mm four-layer board around an ESP32-S3-WROOM-1-N8: USB-C power and native USB, a 3.3 V linear regulator, reset, boot and user buttons, an I2C temperature and humidity sensor, a Qwiic port, SPI and programming headers and an RGB LED. Calculated checks included; never built."
abstract: "A first board for the ESP32-S3: everything a module needs to run, program and talk to sensors, on a 50 × 50 mm four-layer PCB. Power and data both come in on one USB-C connector. A polyfuse, a ferrite bead and a series diode protect the 5 V input, a linear regulator makes 3.3 V, and the module's own USB pins carry programming and a serial console, so no USB-to-serial chip is needed. The board adds the reset network and boot button the module datasheet asks for, a user button, an RGB LED, an I2C temperature and humidity sensor on the same bus as a Qwiic connector, a 2 × 5 SPI header and a 2 × 3 header for Espressif's ESP-Prog. The module's PCB antenna hangs past the board edge. This guide goes block by block, with calculated checks on the regulator headroom and heat, the USB pair impedance, the I2C rise time, the LED currents and the current budget, and lists what to look for when you swap in other parts. It is a setup guide, not a tested design: nothing here was built or measured."
draft: true
stats:
  - { value: "ESP32-S3-WROOM-1-N8", label: "module, 8 MB flash, PCB antenna" }
  - { value: "USB-C, 5 V", label: "power, programming and console" }
  - { value: "50 × 50 mm", label: "four layers, 1.6 mm" }
  - { value: "90 Ω", label: "USB differential pair" }
schematic: esp32-s3-test-board-schematic.svg
schematic_caption: "The module and everything around it. Net flags with the same name are one net; D+ and D− come from the USB sheet under Power input, and +3V3 is the regulator output there. The temperature and humidity sensor U4 is drawn as a box with its I2C, supply and ground pins only (its two unused pins and its thermal pad are in the text). J4's pin order isn't fixed by this guide. Every pin of the module not drawn is left unconnected. Reference designators and the drawing are ours."
components:
  - ref: "U1"
    part: "ESP32-S3-WROOM-1-N8"
    description: "Wi-Fi and Bluetooth LE module, 8 MB quad flash, no PSRAM, PCB antenna, 18.0 × 25.5 × 3.1 mm"
    maker: "Espressif"
  - ref: "U2"
    part: "LM1117-3.3"
    description: "3.3 V linear regulator, 800 mA, SOT-223. To swap: at least 0.5 A, a dropout well under 1 V at 0.5 A (see The 3.3 V regulator), stable with ceramic capacitors, in a package that can shed about 0.5 W"
    maker: "Texas Instruments"
  - ref: "U3"
    part: "USBLC6-2SC6"
    description: "USB 2.0 ESD protection, two pass-through lines and a VBUS clamp, SOT-23-6. To swap: low capacitance (a few pF per line), 5 V working voltage on VBUS"
    maker: "STMicroelectronics"
  - ref: "U4"
    part: "Si7021"
    description: "I2C temperature and humidity sensor, 3 × 3 mm DFN-6 with a thermal pad (pin 7) to ground; pins 3 and 4 not connected. To swap: any 3.3 V I2C sensor whose address doesn't clash with your Qwiic boards"
    maker: "Silicon Labs"
  - ref: "J1"
    part: "USB-C receptacle, USB 2.0, surface mount"
    description: "Power and USB 2.0 data. Both D+ pads and both D− pads joined; SBU pins (if any) not connected; shield to ground"
  - ref: "J2"
    part: "2 × 3 pin header, 2.54 mm"
    description: "Programming header in Espressif ESP-Prog order: 1 EN, 2 VDD (+3V3), 3 TXD0, 4 GND, 5 RXD0, 6 IO0"
  - ref: "J3"
    part: "SM04B-SRSS-TB"
    description: "Qwiic connector, JST SH 1.0 mm, 4 pins, horizontal: 1 GND, 2 +3V3, 3 SDA, 4 SCL"
    maker: "JST"
  - ref: "J4"
    part: "2 × 5 pin header, 2.54 mm"
    description: "SPI expansion: CS, MOSI, SCK, MISO, RST, IRQ, +3V3 and ground; pin order is your choice"
  - ref: "F1"
    part: "Polyfuse, 1 A hold, 1206"
    description: "Resettable fuse in VBUS"
  - ref: "FB1"
    part: "BLM21PG220SN1"
    description: "Ferrite bead in VBUS, 0805, 22 Ω at 100 MHz, rated for power lines"
    maker: "Murata"
  - ref: "D1"
    part: "Schottky diode, 1 A or more"
    description: "Series diode from the bead to the +5V rail: stops a supply on the 3.3 V or 5 V side from feeding back into the USB host. See Power input for its cost in headroom"
  - ref: "D2"
    part: "Green LED, 0603"
    description: "Power indicator on +3V3"
  - ref: "D3, D4, D5"
    part: "TVS diode, 3.3 V working voltage"
    description: "ESD protection on EN, IO0 and IO48, where the buttons are"
  - ref: "D6"
    part: "RGB LED, common anode"
    description: "Status LED on IO39 (red), IO40 (green) and IO41 (blue); a GPIO driven low lights its colour"
  - ref: "SW1, SW2"
    part: "Tactile switch, surface mount"
    description: "RESET on EN and BOOT on IO0, both to ground"
  - ref: "SW3"
    part: "Tactile switch, right angle, through hole"
    description: "USER button on IO48, pressed from the board edge"
  - ref: "R1, R2"
    part: "5.1 kΩ, 1%, 0402"
    description: "CC1 and CC2 to ground: tells a USB-C source that a sink is attached, so it turns on 5 V"
  - ref: "R3, R10, R11, R12"
    part: "1 kΩ, 0402"
    description: "Power LED and RGB LED series resistors (see SPI header and RGB LED for the green and blue values)"
  - ref: "R4, R5, R6, R7"
    part: "10 kΩ, 0402"
    description: "Pull-ups to +3V3 on EN, IO0, IO3 and IO48"
  - ref: "R8, R9"
    part: "2.2 kΩ, 0402"
    description: "I2C pull-ups on SDA and SCL"
  - ref: "C1, C2"
    part: "22 µF, 10 V, 0805"
    description: "Regulator input (+5V) and output (+3V3)"
  - ref: "C3, C5, C7"
    part: "100 nF, 0402"
    description: "ESD part VBUS pin, module 3V3 pin (closest to the pin) and sensor supply"
  - ref: "C4"
    part: "10 µF, 0603"
    description: "Module 3V3 pin, next to C5"
  - ref: "C6"
    part: "1 µF, 0603"
    description: "EN delay with R4"
  - ref: "H1–H4"
    part: "M3 mounting hole, 3.2 mm"
    description: "One in each corner"
tags: [esp32-s3, starter-board, dev-board, usb-c, ldo, i2c, qwiic, spi, four-layer, usb-differential-pair, pcb-antenna, hypothetical, setup-guide]
---

## Design requirements

| What | The design |
| --- | --- |
| Module | ESP32-S3-WROOM-1-N8: 8 MB flash, no PSRAM, PCB antenna, 3.0–3.6 V, at least 0.5 A from its supply |
| Input | USB-C, 5 V from any USB port or charger, as a USB 2.0 sink with 5.1 kΩ on CC1 and CC2 |
| Input protection | 1 A polyfuse, ferrite bead and a series diode in VBUS; ESD protection on D+, D− and VBUS |
| 3.3 V rail | Linear regulator from the 5 V rail, 22 µF in and out |
| Programming | Native USB (USB Serial/JTAG on IO19 and IO20), or UART0 through a 2 × 3 ESP-Prog header |
| User interface | RESET, BOOT and USER buttons, a green power LED and an RGB status LED |
| Expansion | I2C on IO8 (SDA) and IO9 (SCL) to an on-board temperature and humidity sensor and a Qwiic connector; SPI on IO10 to IO13 plus two control lines on a 2 × 5 header |
| Board | 50 × 50 mm, 4 mm corner radii, four M3 holes, four layers, 1.6 mm, antenna past the top edge |

> **About this guide.** This is a setup guide for a hypothetical board: nothing in it was built or measured. It is modelled on a published four-layer ESP32-S3 test board, and the parts named in the bill of materials are the ones that design used; the regulator, the USB ESD part and the sensor are meant to be swapped, so each has its own section saying what the replacement has to do. The module figures come from the [ESP32-S3-WROOM-1-N8 part page](site:parts/espressif/esp32-s3-wroom-1-n8/). Values marked "ours" are assumptions or choices of this guide, and every number in the calculated tables was worked out for this page.

## How it works

The board is a carrier for the module. The module already holds the processor, the flash, the crystal, the radio and the antenna, so the board only has to give it a clean 3.3 V supply, drive its EN pin, set its strapping pins, and bring its pins out to something useful.

Power and data share one USB-C connector. The 5 V from the cable passes a fuse, a ferrite bead and a diode to become the board's +5V rail, and a linear regulator turns that into +3V3 for everything else. USB data goes straight to the module's own USB pins through an ESD protection chip, and the ESP32-S3's built-in USB Serial/JTAG controller appears on the computer as a serial port and a JTAG debugger at once. That is why the board has no USB-to-serial chip and no auto-reset transistors: the USB controller can reset the chip into download mode by itself. The BOOT button and the ESP-Prog header are there for when it can't, such as after firmware that turns USB off.

![USB-C input, protection and 3.3 V regulator. D+ and D− continue on the module sheet. The regulator and the ESD part are drawn as boxes because they are meant to be swapped. The connector's two D+ and two D− pads are drawn once. Drawing ours.](schematic:esp32-s3-test-board-power-schematic.svg)

## Power input

**USB-C as a sink.** A USB-C port puts no voltage on VBUS until it sees a sink. R1 and R2, 5.1 kΩ from CC1 and CC2 to ground, are what it looks for; with them the port turns on 5 V at its default USB 2.0 current, 500 mA. Each CC pin needs its own resistor, because the cable connects only one of them. Leave out the resistors and a USB-C charger or a C-to-C cable gives no power at all, while an A-to-C cable still works, which makes the fault confusing.

**The protection chain.** F1, a 1 A polyfuse, opens on a short and resets once it cools. FB1, a ferrite bead, keeps the module's switching noise off the cable. D1, a diode in series, stops current flowing back into the computer when the board is powered from the 3.3 V pin of the ESP-Prog header or from a supply on the SPI header. All three cost voltage, and a linear regulator needs that voltage.

**Headroom at the regulator.** The table works out the regulator's input at a Wi-Fi transmit burst (0.4 A, our round figure for the module's 355 mA peak plus the rest of the board) and compares it with what an LM1117-3.3 needs: 3.3 V plus its 1.25 V maximum dropout at 500 mA, and the 4.75 V input from which its output accuracy is specified. The last column is the same check for a regulator with 0.3 V of dropout. The diode drops are ours: 0.40 V for a Schottky and 0.80 V for a silicon diode at 0.4 A. The margin columns are the regulator input minus what each regulator needs. The cable, fuse and bead are taken as 0.37 Ω in total (ours: 0.20 Ω of cable, 0.15 Ω of fuse, 0.02 Ω of bead), a drop of 0.15 V at 0.4 A.

| VBUS | Diode | LDO input | LM1117 vs dropout | LM1117 vs 4.75 V | 0.3 V part |
| --- | --- | --- | --- | --- | --- |
| 5.00 V | Schottky | 4.45 V | −0.10 V | −0.30 V | 0.85 V |
| 5.00 V | Silicon | 4.05 V | −0.50 V | −0.70 V | 0.45 V |
| 5.00 V | None | 4.85 V | 0.30 V | 0.10 V | 1.25 V |
| 4.75 V | Schottky | 4.20 V | −0.35 V | −0.55 V | 0.60 V |
| 4.75 V | Silicon | 3.80 V | −0.75 V | −0.95 V | 0.20 V |
| 4.75 V | None | 4.60 V | 0.05 V | −0.15 V | 1.00 V |

A negative margin means the regulator is out of regulation at that point. **With a Schottky diode in series, the LM1117 runs out of headroom during a Wi-Fi burst even from a full 5.00 V port**, and with an ordinary silicon diode it never has enough. What it does then is let 3.3 V sag: by about the shortfall in the table, which stays above the module's 3.0 V minimum in most rows, but it removes the margin you were counting on, and a weak port or long cable takes it lower. A regulator with a few hundred millivolts of dropout keeps a margin in every row.

The fix is in the swap: use a low-dropout regulator (see the next section). If you keep a 1117-type regulator, drop D1 or replace it with a P-channel MOSFET wired as an ideal diode, and accept that the ESP-Prog's 3.3 V will then back-feed the regulator's output.

## The 3.3 V regulator

U2 takes the +5V rail down to +3V3 for the module, the sensor, the LEDs and the headers. A linear regulator is the simple choice: no inductor, no switching noise next to the radio, and an output capacitor is all it needs. The cost is heat, since everything between the input and 3.3 V is burnt in the regulator.

**Heat.** The table assumes the regulator input from the headroom table at a 5.00 V port with a Schottky diode (4.45 V) and adds the LM1117's 5 mA quiescent current. The temperature rise is for three thermal resistances (ours, covering a SOT-223 on a good copper area, a smaller package, and a SOT-23).

| Load current | Regulator loss (W) | Rise at 60 °C/W | Rise at 100 °C/W | Rise at 200 °C/W |
| --- | --- | --- | --- | --- |
| 100 mA | 0.14 | 8 °C | 14 °C | 27 °C |
| 250 mA | 0.31 | 19 °C | 31 °C | 62 °C |
| 400 mA | 0.48 | 29 °C | 48 °C | 97 °C |
| 500 mA | 0.60 | 36 °C | 60 °C | 120 °C |

The 400 mA row is a transmit burst, which lasts milliseconds, so the average heat is set by the average current, which is much lower for most firmware. Still, **the published design assigned a SOT-23 footprint to the LM1117**, and TI's LM1117 is offered in SOT-223 and WSON, not SOT-23; a SOT-23 regulator at 200 °C/W would run near 100 °C above ambient at a sustained 400 mA. Check the footprint against the exact part number you order.

**What the replacement needs.**

- At least 0.5 A output, because the module datasheet asks the supply for 0.5 A. A 300 mA regulator, such as the site's [SY2A27352](site:parts/silergy/sy2a27352/), is too small here.
- A dropout well under 1 V at 0.5 A, so it keeps regulating with the diode and the cable drop in front of it (see the headroom table).
- Stable with the 22 µF ceramic output capacitor. The LM1117's own datasheet asks for at least 10 µF of tantalum at the output for stability, which older 1117 designs need and newer regulators don't.
- A package that can shed about 0.5 W: SOT-223 or a part with an exposed pad, with copper under it.
- A fixed 3.3 V version saves the two feedback resistors.

## The module, strapping and buttons

The module takes 3.3 V on pin 2, with C4 (10 µF) and C5 (100 nF) beside the pin, C5 closest. Every pin the board doesn't use is left unconnected, including the strapping pins GPIO45 and GPIO46, whose internal pull-downs give the default boot and the 3.3 V flash supply, and IO35 to IO37, which stay free so the footprint can take an octal-PSRAM module later.

| Module pin | Signal | Connects to |
| --- | --- | --- |
| 2 (3V3) | +3V3 | U2 output, C4, C5 |
| 3 (EN) | EN | R4 to +3V3, C6 to ground, SW1 (RESET), D3, J2 pin 1 |
| 27 (IO0) | Boot | R5 to +3V3, SW2 (BOOT), D4, J2 pin 6 |
| 15 (IO3) | JTAG source strap | R6 to +3V3 |
| 37 (TXD0, IO43) | UART0 TX | J2 pin 3 |
| 36 (RXD0, IO44) | UART0 RX | J2 pin 5 |
| 13 (IO19) | USB D− | U3, J1 |
| 14 (IO20) | USB D+ | U3, J1 |
| 12 (IO8) | SDA | R8, U4, J3 pin 3 |
| 17 (IO9) | SCL | R9, U4, J3 pin 4 |
| 18, 19, 20, 21 (IO10 to IO13) | CS, MOSI, SCK, MISO | J4 |
| 22, 8 (IO14, IO15) | RST, IRQ | J4 |
| 32, 33, 34 (IO39 to IO41) | Red, green, blue | R10 to R12, D6 |
| 25 (IO48) | User button | R7 to +3V3, SW3 (USER), D5 |
| 1, 40, 41 (GND, EPAD) | Ground | Ground planes |

The I2C and SPI pins are the ones the ESP32-S3 Arduino core uses by default, so libraries work without pin settings, and IO10 to IO13 are also the pins of the chip's general-purpose SPI controller (FSPI), which reaches its highest clock on them (our reading). IO39 to IO41 are JTAG pins, but the chip takes JTAG through USB by default, so they are free for the LED (our reading of the chip datasheet).

**EN delay.** R4 (10 kΩ) and C6 (1 µF) are the values the module datasheet suggests. Once +3V3 is up, EN crosses the chip's 0.75 × VDD threshold after 14 ms (τ × ln 4, calculated), far more than the 50 µs the datasheet asks the supply to be stable first. SW1 discharges C6 to reset the chip.

**Boot.** Hold BOOT, press and release RESET, then release BOOT, and the chip starts in download mode; GPIO46 is already low from its internal pull-down. R5 duplicates the chip's own weak pull-up on IO0 so the pin doesn't pick up noise from the button wiring. R6 pulls IO3 high; IO3 only selects the JTAG source when an eFuse is set, so R6 just gives the pin a defined level.

**ESD on the buttons.** D3 to D5 clamp static from a finger on the button caps. Use 3.3 V working-voltage parts with low leakage: a few microamps of leakage on EN is enough to change the delay.

**The ESP-Prog header.** J2 follows Espressif's ESP-Prog program-interface pin order: 1 EN, 2 VDD, 3 TXD, 4 GND, 5 RXD, 6 IO0. The ESP-Prog's TXD pin goes to the module's TXD0 (the names are from the target's side), and it resets the chip into download mode through EN and IO0 by itself.

## USB data and the 90 Ω pair

USB 2.0 full speed (12 Mbps) is forgiving, but the ESP32-S3 guidelines still ask for a 90 Ω ±10% differential pair, and holding it costs nothing on a four-layer board. The pair runs on the top layer over the solid ground of the first inner layer, from J1 through U3 to the module.

**Trace width.** The design uses 0.24 mm traces 0.15 mm apart, on the 0.196 mm prepreg of a common 1.6 mm four-layer stackup. The table checks that with the IPC-2141A formulas for an edge-coupled microstrip, for 35 µm (1 oz) copper and a range of prepreg dielectric constants (Dk, also written εr). These formulas are approximations (a field solver is more accurate) and ignore the solder mask, which lowers the result by a few ohms.

| Trace width | Dk 4.0 | Dk 4.2 | Dk 4.4 | Dk 4.6 |
| --- | --- | --- | --- | --- |
| 0.20 mm | 103.3 Ω | 101.4 Ω | 99.7 Ω | 98.0 Ω |
| 0.24 mm | 94.5 Ω | 92.8 Ω | 91.2 Ω | 89.7 Ω |
| 0.28 mm | 86.9 Ω | 85.4 Ω | 83.9 Ω | 82.5 Ω |

At 0.24 mm the pair lands near 90 Ω across the whole range (single-ended about 59 Ω at a Dk of 4.4). With 48 µm finished copper it drops to about 88 Ω at a Dk of 4.4, still inside ±10%. **Use your fabricator's own stackup and calculator before ordering**: the prepreg thickness and Dk differ between fabricators and between their stackup options, and the trace width follows them.

**Routing.**

- Place U3 right at J1, so a static discharge meets the clamp before it reaches a trace.
- U3's I/O pins pass straight through, so you can choose which pin pair carries D+. If D+ and D− cross between J1 and U3, swap the two nets on U3's pass-through pins in the schematic rather than adding vias.
- J1 has two D+ and two D− pads, one for each plug orientation. Join each pair with a short link close to the connector.
- Keep the pair together, the same length within a millimetre or so, over unbroken ground, with no vias if possible, and away from the antenna end.

## I2C bus: sensor and Qwiic

The sensor U4 and the Qwiic connector J3 share one bus on IO8 and IO9, with R8 and R9 (2.2 kΩ) to +3V3. The Qwiic convention is pin 1 ground (black wire), pin 2 3.3 V (red), pin 3 SDA (blue) and pin 4 SCL (yellow), and it is a 3.3 V bus, so a Qwiic board needs no level shifting.

**Pull-ups and rise time.** Most Qwiic breakout boards carry their own pull-ups, often 4.7 kΩ (ours; check each board), which end up in parallel with R8 and R9. The table gives the rise time (0.8473 × R × C, from 30% to 70% of the supply) for a range of bus capacitances, for the board's own pull-ups alone and with one, two or three 4.7 kΩ breakouts added, and the current a pin has to sink to pull the bus to 0.4 V. The I2C specification allows 1000 ns in standard mode (100 kHz), 300 ns in fast mode (400 kHz) and 3 mA of sink current at 0.4 V, which sets a minimum pull-up of 967 Ω.

| | Board only | Plus one breakout | Plus two | Plus three |
| --- | --- | --- | --- | --- |
| Total pull-up | 2200 Ω | 1499 Ω | 1136 Ω | 915 Ω |
| Rise time at 50 pF | 93 ns | 63 ns | 48 ns | 39 ns |
| Rise time at 100 pF | 186 ns | 127 ns | 96 ns | 78 ns |
| Rise time at 200 pF | 373 ns | 254 ns | 193 ns | 155 ns |
| Rise time at 400 pF | 746 ns | 508 ns | 385 ns | 310 ns |
| Sink current at 0.4 V | 1.3 mA | 1.9 mA | 2.6 mA | 3.2 mA |

With only the board's own 2.2 kΩ, 400 kHz works up to about 160 pF of bus (wiring, cable and every device's pins). Each breakout with its own pull-ups speeds the edges up, and by the third the sink current passes 3 mA: cut the pull-up jumper on the extra boards. A long Qwiic chain or a long cable adds capacitance, so drop to 100 kHz if the bus gets flaky.

**The sensor.** U4 sits on the bus with a 100 nF capacitor (C7) on its supply. In the published design it is a DFN-6 part whose pins 3 and 4 are not connected and whose thermal pad (pin 7) goes to ground. A humidity sensor reads the board's own heat, so keep it away from the regulator and the module, ideally near an edge with a slot or cut-out around it, and keep solder flux and conformal coating off its opening. When you swap it, check its I2C address against the Qwiic boards you plan to use: many temperature, humidity and power-monitor parts share the same few addresses.

## SPI header and RGB LED

**SPI header.** J4 brings out CS (IO10), MOSI (IO11), SCK (IO12) and MISO (IO13), plus a reset (IO14) and an interrupt (IO15) line for an add-on board, and +3V3 and ground. Print the pin names next to the header on the silkscreen, because the pin order is your choice.

**RGB LED.** D6 is a common-anode LED: its anode is on +3V3 and each colour turns on when its GPIO goes low, so the firmware logic is inverted. With 1 kΩ on every channel, the colours come out very uneven, because green and blue LEDs drop about 3 V and leave only 0.3 V across the resistor. The table uses forward voltages typical of each colour (ours; check the LED's datasheet) and gives the current with the 1 kΩ resistor in the drawing and the resistor for 2 mA.

| LED | Current with the drawn resistor | Resistor for about 2 milliamps |
| --- | --- | --- |
| Power LED, green (GaP-type, VF 2.1 V) | 1.2 mA | 600 Ω |
| Power LED, green (InGaN, VF 3.0 V) | 0.3 mA | 150 Ω |
| RGB red (VF 2.0 V) | 1.3 mA | 650 Ω |
| RGB green (VF 3.0 V) | 0.3 mA | 150 Ω |
| RGB blue (VF 3.0 V) | 0.3 mA | 150 Ω |

So with 1 kΩ throughout, red runs at over four times the current of green and blue. Use about 680 Ω for red and 150 Ω for green and blue to bring them to about 2 mA each, or check the brightness on the real LED, since the eye's response and the LED's efficiency differ by colour too. A 3 V LED on a 3.3 V rail is also sensitive to the rail and the LED's tolerance: at 3.1 V forward drop it barely lights. The same applies to the power LED D2 if it is an InGaN green. Each GPIO can sink far more than these currents (28 mA typical at full drive).

## Current budget

The 3.3 V rail at a transmit burst, with allowances (ours) for what the headers might feed.

| Load | Current | Where the figure comes from |
| --- | --- | --- |
| ESP32-S3-WROOM-1-N8, Wi-Fi TX peak (802.11b, 20.5 dBm) | 355.0 mA | Module datasheet |
| Power LED | 1.2 mA | Table above, GaP-type green |
| RGB LED, all three on | 1.9 mA | Table above |
| Pull-ups, EN and strapping resistors, sensor | 2.0 mA | Allowance (ours) |
| Qwiic port | 100.0 mA | Allowance for external boards (ours) |
| SPI header 3.3 V pin | 50.0 mA | Allowance (ours) |

The board alone peaks at about 360 mA, under the module datasheet's 0.5 A supply rating. With the header allowances it reaches about 510 mA, which is past the 500 mA a USB-C port gives at its default current with 5.1 kΩ pull-downs. Most ports tolerate a short burst over that, but if you plan to power motors, displays or radios from the headers, give them their own supply. The 1 A polyfuse leaves room for either case.

## Board, stackup and placement

**Outline.** A 50 × 50 mm square with 4 mm radius corners and four M3 holes (3.2 mm), one near each corner. Draw it on a 1 mm grid, and place parts on a 0.1 mm grid.

**Stackup.** Four layers, 1.6 mm, as a fabricator's standard stackup: top copper, 0.196 mm prepreg, inner layer 1, a 1.03 mm core, inner layer 2, 0.196 mm prepreg, bottom copper. The prepreg thickness between the top layer and inner layer 1 is what sets the USB trace width (see USB data).

| Layer | Use |
| --- | --- |
| Top | Parts, the USB pair, short signal routes, ground fill |
| Inner 1 | Solid ground, unbroken under the USB pair and the module |
| Inner 2 | +3V3 fill |
| Bottom | Signal routes where they cross, ground fill |

**Placement.**

- **Module at the top edge, centred, with its antenna end hanging fully outside the board outline.** That is the placement Espressif's guidelines recommend, and it needs no keep-out zone on the board itself. Nothing on any layer goes past the module's shield towards the antenna.
- **USB-C at the bottom edge, centred,** its front edge slightly past the outline so a plug reaches it through an enclosure wall. U3 right behind it.
- **Regulator and its capacitors** between the connector and the module, away from the sensor.
- **C5, then C4,** at the module's 3V3 pin, C5 closest; each decoupling capacitor as close to its pin as the parts allow.
- **RESET and BOOT** near an edge with silkscreen labels; **USER** (right-angle) on an edge so it is pressed from the side.
- **Qwiic, SPI and programming headers** along the edges, clear of the antenna.
- **Sensor** near an edge, away from the regulator and the module.

## Routing and planes

- **Power.** Route VBUS and +5V with 0.5–0.6 mm tracks; the +3V3 fill on inner 2 carries the 3.3 V rail, with short vias at each load.
- **Signals.** I2C, SPI, UART, LEDs and buttons on the top layer, dropping to the bottom layer where they cross. Keep the bottom-layer routes short so they don't cut up the bottom ground fill.
- **Ground fills.** Ground on the top layer, inner 1 and the bottom layer, +3V3 on inner 2, with 0.2 mm clearance. Refill all zones after every change (B in KiCad).
- **Stitching vias.** Ground vias around the board edge, along the module's antenna end, next to the USB pair and beside every decoupling capacitor's ground pad, tying the three ground layers together. Espressif's guidelines ask for plenty of ground copper and dense ground vias near the antenna.
- **Module ground pad.** Ground vias in the gaps of the pad's grid, with paste only on the squares; too much paste can lift the module.
- **Checks.** Run the design rule check against your fabricator's limits (0.2 mm drills are standard at most) and fix every unconnected item before export. Export the four copper layers, both paste, mask and silkscreen layers, the outline and the drill files.

## Things to watch

- **Regulator headroom.** An LM1117 behind a series diode runs out of headroom during Wi-Fi bursts (see Power input). Use a low-dropout regulator or remove the diode.
- **Regulator footprint.** The published design gave the regulator a SOT-23 footprint. Match the footprint to the exact part number, and give a linear regulator enough copper for about 0.5 W.
- **ESP-Prog supply jumper.** The ESP-Prog can put 3.3 V or 5 V on its VDD pin, set by a jumper. J2 pin 2 is the board's +3V3 rail, so **set the jumper to 3.3 V**: 5 V there is over the module's 3.6 V absolute maximum. With USB-C plugged in as well, two supplies meet on +3V3; D1 keeps the ESP-Prog from feeding the USB host, but the two still fight through the regulator, so use one at a time.
- **No CC resistors, no power from USB-C chargers.** R1 and R2 must be separate resistors on CC1 and CC2.
- **Antenna.** Copper, parts or a mounting screw near the antenna end cut range, and so does a metal enclosure. Keep the antenna past the board edge and at least 15 mm from the housing, as Espressif's guidelines recommend.
- **Strapping pins.** Leave GPIO45 and GPIO46 unconnected. A pull-up on GPIO45 changes the flash supply voltage, and GPIO46 high blocks download mode.
- **USB download after bad firmware.** Firmware that reconfigures IO19 and IO20 or turns USB off removes the USB serial port; hold BOOT through a reset to get it back, or use the ESP-Prog header.
- **RGB LED brightness.** Green and blue at 1 kΩ from 3.3 V are very dim (see SPI header and RGB LED), and the outputs are active low.
- **I2C pull-ups add up.** Several Qwiic boards with their own pull-ups can push the sink current past 3 mA.
- **Humidity readings.** The sensor reads the board's heat; keep it away from the regulator and the module.
- **Changing module variant.** The footprint takes the N8R2 and N8R8, but the R8 parts use IO35 to IO37 and are rated to 65 °C. This board leaves those pins free.

## Bring-up checklist

1. Before fitting the module, plug in USB-C through a current-limited supply or a USB power meter. Check +5V (about 4.4–4.8 V at light load, depending on the diode and the port) and +3V3 (3.3 V), and that the power LED is on.
2. Check the resistance from +3V3 to ground with the board unplugged: a dead short means a solder bridge or a reversed part.
3. Fit the module, plug in again and check that the idle current is in the tens of milliamps once it has booted.
4. The computer should find a USB serial/JTAG device. If not, hold BOOT, press RESET, release BOOT, and look again.
5. Flash a test program that prints to the USB serial console, cycles the RGB LED through its colours (writing low to turn each on) and reads the USER button.
6. Scan the I2C bus: the sensor should answer at its address, and any Qwiic board you plug in at its own.
7. Connect to Wi-Fi and check the signal strength at a few distances, with the board in its enclosure if it has one.
8. If the board resets during Wi-Fi start-up, look at +3V3 with an oscilloscope during a transmit burst: a dip below 3.0 V means the regulator is out of headroom.

## Documents and related parts

- [ESP32-S3-WROOM-1-N8](site:parts/espressif/esp32-s3-wroom-1-n8/): the module this board is built on, with its pins, strapping, current and layout notes.
- [ESP32-S3-WROOM-1U-N8R8](site:parts/espressif/esp32-s3-wroom-1u-n8r8/): the connector-antenna version with 8 MB of PSRAM, if the board has to sit inside a metal enclosure.
- [ESP32-S3 hardware design guidelines](https://docs.espressif.com/projects/esp-hardware-design-guidelines/en/latest/esp32s3/index.html) (Espressif): module placement, antenna keep-out, power and USB layout.
- [ESP-Prog user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/other/esp-prog/user_guide.html) (Espressif): the programming-header pin order and the supply jumper.
- [Talking to a part from an ESP32-S3](site:contribute/arduino/): the site's guide for the I2C and SPI parts that could plug into this board.
