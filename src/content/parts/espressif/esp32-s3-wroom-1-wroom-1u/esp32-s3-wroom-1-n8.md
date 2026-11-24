---
manufacturer: Espressif
family: ESP32-S3-WROOM-1 / WROOM-1U
part: ESP32-S3-WROOM-1-N8
category: processor
summary: '2.4 GHz Wi-Fi and Bluetooth LE module: dual-core 240 MHz ESP32-S3, 8 MB quad flash, no PSRAM, 36 GPIOs, 3.0–3.6 V, PCB antenna, 18.0 × 25.5 × 3.1 mm, 85 °C ambient.'
abstract: 'A ready-made 2.4 GHz Wi-Fi and Bluetooth LE module built around Espressif''s ESP32-S3: a dual-core 240 MHz Xtensa LX7 processor with 512 KB of SRAM, 8 MB of quad SPI flash and a 40 MHz crystal on the module, the RF matching network and a PCB antenna under one shield and one certification. It is the plain member of the WROOM-1 range: N8 is 8 MB of flash and there is no R, so no PSRAM, which leaves all 36 GPIOs free and keeps the 85 °C ambient rating that the octal-PSRAM parts lose. The PCB antenna is the trade: the antenna end of the module needs clear space on the base board, best hanging past the board edge. This is the module the site''s ESP32-S3 starter-board recipe is built on. The same datasheet covers the connector version on the ESP32-S3-WROOM-1U-N8R8 page, and both pages tabulate all 22 part numbers.'
status: active
packages:
- Module, 41 pins
specs:
  vin_min_v: 3
  vin_max_v: 3.6
  topology: Dual-core Xtensa LX7 microcontroller module with 2.4 GHz Wi-Fi and Bluetooth LE
  extra:
  - label: CPU
    value: Dual-core Xtensa LX7, up to 240 MHz, single-precision FPU
  - label: On-chip memory
    value: 384 KB ROM, 512 KB SRAM, 16 KB RTC SRAM
  - label: Flash
    value: 8 MB, Quad SPI, on the module
  - label: PSRAM
    value: None
  - label: Wireless
    value: Wi-Fi 802.11 b/g/n up to 150 Mbps; Bluetooth 5 (LE) with Bluetooth mesh
  - label: GPIOs
    value: 36, all available (IO35 to IO37 are free because there is no octal PSRAM)
  - label: Antenna
    value: On-board PCB antenna
  - label: Ambient temperature
    value: −40 to 85 °C
  - label: Size
    value: 18.0 × 25.5 × 3.1 mm
features:
- Dual-core 32-bit Xtensa LX7 at up to 240 MHz with a single-precision FPU, plus vector instructions for neural-network and signal-processing work
- 384 KB ROM, 512 KB SRAM and 16 KB RTC SRAM in the chip, and 8 MB of quad SPI flash on the module; no PSRAM
- 802.11 b/g/n Wi-Fi up to 150 Mbps, and Bluetooth 5 LE with Bluetooth mesh and the 125 kbps, 500 kbps, 1 Mbps and 2 Mbps PHYs, sharing one antenna
- 36 GPIOs, four of them strapping pins, all free for use on this variant
- Two I2C, two I2S and three UART ports, two general-purpose SPI ports, LCD and camera interfaces, SD/MMC host, TWAI (CAN 2.0), RMT, pulse counter, LED PWM and two MCPWM units
- Two 12-bit SAR ADCs with 20 channels, 14 touch inputs and a temperature sensor
- Full-speed USB 2.0 OTG and a USB Serial/JTAG controller on IO19 and IO20
- Secure boot, flash encryption, a 4-Kbit one-time-programmable memory, AES, SHA, RSA, HMAC, a digital signature peripheral and a random number generator (from the chip datasheet; the module datasheet does not list them)
- Low-power coprocessors that can watch inputs while the CPU is off; 7 to 8 µA in deep sleep with RTC memory kept
- On-board PCB antenna, so nothing to fit, at the cost of a clear zone on the base board
- 41-pin surface-mount module, 18.0 × 25.5 × 3.1 mm, with an exposed ground pad, rated −40 to 85 °C ambient
spec_groups:
- title: Supply and logic levels
  items:
  - label: Supply voltage (3V3 pin, VDD33)
    value: 3.0 V minimum, 3.3 V typical, 3.6 V maximum
  - label: Supply current the external supply must deliver (IVDD)
    value: 0.5 A minimum
  - label: SPI flash supply (VDD_SPI)
    value: 3.3 V on this part. Only the N16R16VA parts use 1.8 V
  - label: Digital input high (VIH)
    value: 0.75 × VDD minimum, VDD + 0.3 V maximum
  - label: Digital input low (VIL)
    value: −0.3 V minimum, 0.25 × VDD maximum
  - label: Input leakage (IIH, IIL)
    value: 50 nA maximum
  - label: Digital output high (VOH)
    value: 0.8 × VDD minimum
  - label: Digital output low (VOL)
    value: 0.1 × VDD maximum
  - label: Output drive at maximum pad strength (PAD_DRIVER = 3, 3.3 V)
    value: 40 mA typical source (VOH at least 2.64 V), 28 mA typical sink (VOL at most 0.495 V)
  - label: Internal pull-up and pull-down
    value: 45 kΩ typical each
  - label: EN thresholds (VIH_nRST, VIL_nRST)
    value: High 0.75 × VDD to VDD + 0.3 V; low −0.3 V to 0.25 × VDD
  - label: Pin capacitance
    value: 2 pF typical
- title: Current consumption (3.3 V supply, 25 °C)
  items:
  - label: Wi-Fi TX peak, 802.11b 1 Mbps
    value: 355 mA at 20.5 dBm
  - label: Wi-Fi TX peak, 802.11g 54 Mbps
    value: 297 mA at 18 dBm
  - label: Wi-Fi TX peak, 802.11n HT20 MCS7
    value: 286 mA at 17.5 dBm
  - label: Wi-Fi TX peak, 802.11n HT40 MCS7
    value: 285 mA at 17 dBm
  - label: Wi-Fi RX
    value: 95 mA (802.11b/g/n HT20), 97 mA (HT40)
  - label: Bluetooth LE TX peak
    value: 344 mA at 20 dBm, 202 mA at 9 dBm, 187 mA at 0 dBm, 119 mA at −15 dBm
  - label: Bluetooth LE RX
    value: 93 mA
  - label: Light-sleep
    value: 240 µA typical, with VDD_SPI and Wi-Fi powered down and the GPIOs high-impedance. The datasheet's 140 µA adder for 8 MB octal PSRAM doesn't apply, because this part has no PSRAM
  - label: Deep-sleep, ULP-FSM running
    value: 170 µA typical
  - label: Deep-sleep, ULP-RISC-V running
    value: 190 µA typical
  - label: Deep-sleep, ULP watching a touch sensor at 1% duty
    value: 18 µA typical
  - label: Deep-sleep, RTC memory and RTC peripherals on
    value: 8 µA typical
  - label: Deep-sleep, RTC memory on, RTC peripherals off
    value: 7 µA typical
  - label: Power-off (EN held low)
    value: 1 µA typical
  - label: Test conditions
    value: TX at a 100% duty cycle; RX with the peripherals off and the CPU idle. The datasheet also gives modem-sleep currents at 40, 80, 160 and 240 MHz, not copied here
- title: Wireless
  items:
  - label: Wi-Fi
    value: 802.11 b/g/n, 2.4 GHz, channels 2412 to 2484 MHz, 20 and 40 MHz bandwidth, up to 150 Mbps, A-MPDU and A-MSDU aggregation, 0.4 µs guard interval
  - label: Bluetooth LE
    value: 'Bluetooth 5 LE and Bluetooth mesh, channels 2402 to 2480 MHz, PHYs of 125 kbps, 500 kbps, 1 Mbps and 2 Mbps, advertising extensions, multiple advertising sets, channel selection algorithm #2'
  - label: Bluetooth LE transmit power range
    value: −24 to 20 dBm
  - label: Wi-Fi and Bluetooth coexistence
    value: Built in; the two share one antenna
  - label: Antenna
    value: On-board PCB antenna at one end of the module. No connector and nothing to fit, but the antenna end needs clear space on the base board (see Layout)
  - label: Wi-Fi TX power (typical)
    value: 20.5 dBm at 802.11b 1 and 11 Mbps; 20 dBm at 11g 6 Mbps; 18 dBm at 11g 54 Mbps; 19 dBm at HT20 MCS0 and 17.5 dBm at MCS7; 18.5 dBm at HT40 MCS0 and 17 dBm at MCS7
  - label: Wi-Fi RX sensitivity (typical)
    value: −98.2 dBm at 802.11b 1 Mbps; −88.5 dBm at 11b 11 Mbps; −93 dBm at 11g 6 Mbps; −76.2 dBm at 11g 54 Mbps; −93 dBm at HT20 MCS0 and −74.2 dBm at MCS7; −90 dBm at HT40 MCS0 and −71.2 dBm at MCS7
  - label: Wi-Fi maximum RX level (typical)
    value: 5 dBm at the low rates (11b, 11g 6 Mbps, MCS0); 0 dBm at 11g 54 Mbps and MCS7
  - label: Bluetooth LE RX sensitivity (typical, 30.8% PER)
    value: −96.5 dBm at 1 Mbps; −92 dBm at 2 Mbps; −100 dBm at 500 kbps; −103.5 dBm at 125 kbps
  - label: Other RF tables
    value: TX EVM, adjacent-channel rejection, Bluetooth LE transmitter and C/I tables are in the datasheet and not copied here
- title: Boot and reset
  items:
  - label: Strapping pins, default state
    value: GPIO0 weak pull-up (1); GPIO3 floating; GPIO45 weak pull-down (0); GPIO46 weak pull-down (0)
  - label: Boot mode (GPIO0, GPIO46)
    value: GPIO0 = 1 gives SPI boot (any GPIO46). GPIO0 = 0 with GPIO46 = 0 gives Joint Download boot (USB Serial/JTAG, USB OTG or UART download)
  - label: Other strapping functions
    value: GPIO45 sets the VDD_SPI voltage, GPIO46 also controls ROM message printing (UART0 and USB Serial/JTAG by default), GPIO3 selects the JTAG signal source
  - label: Power rails stable before EN goes high (tSTBL)
    value: 50 µs minimum
  - label: EN held low to reset (tRST)
    value: 50 µs minimum
  - label: Strapping setup time (tSU)
    value: 0 ms minimum
  - label: Strapping hold time (tH)
    value: 3 ms minimum after EN goes high, before the pins act as ordinary I/O
  - label: EN pin
    value: Do not leave it floating. The datasheet suggests an RC delay of about 10 kΩ and 1 µF for a clean power-up
- title: Memory and peripherals
  items:
  - label: Flash (on the module)
    value: 8 MB, Quad SPI. The datasheet's flash table gives an 80 MHz maximum clock, 100,000 program/erase cycles and 20 years of retention. The default flash clock is 80 MHz with no auto-suspend; 120 MHz or auto-suspend needs a request to Espressif
  - label: PSRAM
    value: None on this part. The N8R2 (2 MB quad) and N8R8 (8 MB octal) add it in the same footprint
  - label: SPI
    value: 'Four controllers: SPI0 and SPI1 reach the flash (and the PSRAM on parts that have it), SPI2 and SPI3 are general purpose'
  - label: I2C, I2S, UART
    value: 2, 2 and 3 (UART0, UART1, UART2)
  - label: ADC and touch
    value: Two 12-bit SAR ADCs (20 channels); 14 capacitive touch inputs. The datasheet warns that the touch sensor has not passed the conducted-susceptibility test, which limits where it can be used
  - label: Pulse and motor control
    value: RMT with 4 transmit and 4 receive channels, 4 pulse counters, 2 MCPWM modules, LED PWM
  - label: Timers
    value: Four 54-bit general-purpose timers, one 52-bit system timer and three watchdogs (chip datasheet)
  - label: Other
    value: USB 2.0 full-speed OTG, USB Serial/JTAG, TWAI (CAN 2.0), SD/MMC host, LCD and camera interfaces, GDMA
- title: Ratings, soldering and package
  items:
  - label: Absolute maximum supply (VDD33)
    value: −0.3 to 3.6 V
  - label: Storage temperature
    value: −40 to 105 °C
  - label: Ambient temperature, this part
    value: −40 to 85 °C
  - label: ESD
    value: ±2000 V human body model, ±500 V charged-device model
  - label: Moisture
    value: 'MSL 3: solder within 168 hours of opening the bag at 25 ± 5 °C and 60% RH, otherwise bake. Keep the sealed bag below 40 °C and 90% RH'
  - label: Reflow
    value: SAC305 lead-free, one reflow only. Preheat 150 to 200 °C for 60 to 120 s, 60 to 90 s above 217 °C, peak 235 to 250 °C
  - label: Size
    value: 18.0 × 25.5 × 3.1 mm, tolerances ±0.2 mm and ±0.15 mm (height)
  - label: Pins
    value: 41, including the exposed ground pad (pin 41)
  - label: Antenna the RF certification was made with
    value: The module's own PCB antenna. Its gain is in the datasheet and was not copied to this page
datasheet: https://documentation.espressif.com/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf
datasheet_revision: v1.8 (2 March 2026)
kicad_symbol: ESP32-S3-WROOM-1-N8.kicad_sym
lcsc: C2913198
verified: false
draft: true
tags:
- esp32-s3
- wifi
- bluetooth-le
- module
- mcu
- xtensa-lx7
- pcb-antenna
- usb-otg
- wroom-1
- n8
---

## How it works

The ESP32-S3-WROOM-1-N8 is an ESP32-S3 chip on a small board with a 40 MHz crystal, an 8 MB quad SPI flash chip, the RF matching network and a PCB antenna, under a metal shield. The 3.3 V supply, the EN pin and the GPIOs come out on 40 edge pins, and a 41st pin is the exposed ground pad underneath. The antenna is a copper trace on the module's own board, at the short end beyond the shield, so the module needs no connector and no antenna part.

The processor reaches the flash over its SPI0 and SPI1 controllers, through a cache, which is why those controllers aren't general-purpose ports and why the flash pins aren't brought out. There is no PSRAM on this part, so the three GPIOs (IO35 to IO37) that the octal-PSRAM parts give up are ordinary pins here.

### Module or bare chip

The same ESP32-S3 can be bought as a bare QFN chip, and the difference matters most for a first board. Inside this module, Espressif has already done the parts of the design that are hard to get right without RF test equipment:

| On the module | With the bare ESP32-S3 chip you would design |
| --- | --- |
| 40 MHz crystal and its load capacitors | The crystal, its load capacitance and a layout that keeps the frequency offset in limits |
| 8 MB quad SPI flash, and its 3.3 V VDD_SPI wiring | A flash chip of your choice on the SPI pins, and the VDD_SPI strap set to match its voltage |
| RF matching network and the PCB antenna | A 50 Ω trace, a matching network tuned on your board, and an antenna design or a connector |
| Supply filtering at the chip's analog and RF pins | The filters on the chip's analog and RF supply pins and the decoupling layout |
| A metal shield and a module-level RF certification | Your own radio certification for the product |

Espressif's hardware design guidelines say the chip itself needs only about 20 external resistors, capacitors and inductors, and many of those sit in the RF and clock paths, which is the part a module takes off your hands (our reading). On a carrier board the module needs a 3.3 V supply, decoupling, an EN network and the strapping pins tied the way you want them, and nothing else. This site has no page for the bare chip yet.

The cost is size (25.5 mm long against a 7 × 7 mm chip) and a fixed set of memory options. The module also brings out 36 of the chip's GPIOs; the chip's flash pins stay inside.

### Differences from the WROOM-1U-N8R8

The site's other ESP32-S3 page, the [ESP32-S3-WROOM-1U-N8R8](site:parts/espressif/esp32-s3-wroom-1u-n8r8/), is built from the same datasheet. Everything not in this table is the same on both parts.

| | ESP32-S3-WROOM-1-N8 (this page) | ESP32-S3-WROOM-1U-N8R8 |
| --- | --- | --- |
| Antenna | PCB antenna on the module | Connector for an external antenna |
| Base-board keep-out | Needed at the antenna end | None |
| Size | 18.0 × 25.5 × 3.1 mm | 18.0 × 19.2 × 3.2 mm |
| PSRAM | None | 8 MB octal, in the chip package |
| Free GPIOs | 36 | 33 (IO35 to IO37 go to the PSRAM) |
| Ambient temperature | −40 to 85 °C | −40 to 65 °C (85 °C with PSRAM ECC on) |
| Light-sleep current | 240 µA typical | 380 µA typical (240 µA plus 140 µA for the PSRAM; our sum) |
| LCSC | C2913198 | C2980300 |

## Part numbers and variants

One datasheet covers the PCB-antenna ESP32-S3-WROOM-1 and the connector ESP32-S3-WROOM-1U. Both come in the same eleven memory options, so there are 22 part numbers. In v1.8 the datasheet calls the first column "Part Number"; earlier revisions and many distributors say "Ordering Code".

### Reading the name

| Piece | Meaning |
| --- | --- |
| ESP32-S3 | The chip series |
| WROOM-1 | The module. WROOM is Espressif's general-purpose module name for newer chips, with room for both flash and PSRAM. The datasheet doesn't define the "-1". ESP32-S3-WROOM-2 is a different module with its own datasheet: the DevKitC guide lists a WROOM-2-N32R16V with 32 MB octal flash, 16 MB octal PSRAM and 1.8 V SPI |
| U | External antenna connector. No U means a PCB antenna |
| N8 | 8 MB of flash. N means flash for the standard temperature range, which Espressif's naming article gives as −40 to +85 °C. H means high temperature, −40 to +105 °C, and only a 4 MB H4 exists in this datasheet |
| R8 | 8 MB of PSRAM. In this datasheet's tables R2 is quad SPI PSRAM and R8 and R16 are octal |
| V (in N16R16VA) | The datasheet ties a 1.8 V VDD_SPI to the N16R16VA parts only. Espressif's chip names also use V for 1.8 V parts (ESP32-S3R16V) |
| A (in N16R16VA) | Not defined in the datasheet or in the naming article. Revision v1.4 (November 2024) renamed N16R16V to N16R16VA |

The digits are megabytes: the datasheet's tables give every size in MB.

### ESP32-S3-WROOM-1 (PCB antenna)

| Part number | Flash | PSRAM | Ambient (°C) | Size (mm) |
| --- | --- | --- | --- | --- |
| ESP32-S3-WROOM-1-N4 | 4 MB (Quad) | – | −40 to 85 | 18.0 × 25.5 × 3.1 |
| **ESP32-S3-WROOM-1-N8** | 8 MB (Quad) | – | −40 to 85 | 18.0 × 25.5 × 3.1 |
| ESP32-S3-WROOM-1-N16 | 16 MB (Quad) | – | −40 to 85 | 18.0 × 25.5 × 3.1 |
| ESP32-S3-WROOM-1-H4 | 4 MB (Quad) | – | −40 to 105 | 18.0 × 25.5 × 3.1 |
| ESP32-S3-WROOM-1-N4R2 | 4 MB (Quad) | 2 MB (Quad) | −40 to 85 | 18.0 × 25.5 × 3.1 |
| ESP32-S3-WROOM-1-N8R2 | 8 MB (Quad) | 2 MB (Quad) | −40 to 85 | 18.0 × 25.5 × 3.1 |
| ESP32-S3-WROOM-1-N16R2 | 16 MB (Quad) | 2 MB (Quad) | −40 to 85 | 18.0 × 25.5 × 3.1 |
| ESP32-S3-WROOM-1-N4R8 | 4 MB (Quad) | 8 MB (Octal) | −40 to 65 | 18.0 × 25.5 × 3.1 |
| ESP32-S3-WROOM-1-N8R8 | 8 MB (Quad) | 8 MB (Octal) | −40 to 65 | 18.0 × 25.5 × 3.1 |
| ESP32-S3-WROOM-1-N16R8 | 16 MB (Quad) | 8 MB (Octal) | −40 to 65 | 18.0 × 25.5 × 3.1 |
| ESP32-S3-WROOM-1-N16R16VA | 16 MB (Quad) | 16 MB (Octal) | −40 to 65 | 18.0 × 25.5 × 3.1 |

### ESP32-S3-WROOM-1U (antenna connector)

| Part number | Flash | PSRAM | Ambient (°C) | Size (mm) |
| --- | --- | --- | --- | --- |
| ESP32-S3-WROOM-1U-N4 | 4 MB (Quad) | – | −40 to 85 | 18.0 × 19.2 × 3.2 |
| ESP32-S3-WROOM-1U-N8 | 8 MB (Quad) | – | −40 to 85 | 18.0 × 19.2 × 3.2 |
| ESP32-S3-WROOM-1U-N16 | 16 MB (Quad) | – | −40 to 85 | 18.0 × 19.2 × 3.2 |
| ESP32-S3-WROOM-1U-H4 | 4 MB (Quad) | – | −40 to 105 | 18.0 × 19.2 × 3.2 |
| ESP32-S3-WROOM-1U-N4R2 | 4 MB (Quad) | 2 MB (Quad) | −40 to 85 | 18.0 × 19.2 × 3.2 |
| ESP32-S3-WROOM-1U-N8R2 | 8 MB (Quad) | 2 MB (Quad) | −40 to 85 | 18.0 × 19.2 × 3.2 |
| ESP32-S3-WROOM-1U-N16R2 | 16 MB (Quad) | 2 MB (Quad) | −40 to 85 | 18.0 × 19.2 × 3.2 |
| ESP32-S3-WROOM-1U-N4R8 | 4 MB (Quad) | 8 MB (Octal) | −40 to 65 | 18.0 × 19.2 × 3.2 |
| ESP32-S3-WROOM-1U-N8R8 | 8 MB (Quad) | 8 MB (Octal) | −40 to 65 | 18.0 × 19.2 × 3.2 |
| ESP32-S3-WROOM-1U-N16R8 | 16 MB (Quad) | 8 MB (Octal) | −40 to 65 | 18.0 × 19.2 × 3.2 |
| ESP32-S3-WROOM-1U-N16R16VA | 16 MB (Quad) | 16 MB (Octal) | −40 to 65 | 18.0 × 19.2 × 3.2 |

The bold row, the WROOM-1-N8, is the part this page is written for. Its connector twin is the WROOM-1U-N8 in the second table. The notes under the datasheet's tables say, in our words:

- **PSRAM ECC.** For the R8 and R16 parts with octal PSRAM, turning on the PSRAM's error correction raises the ambient limit to 85 °C, and costs 1/16 of the usable PSRAM.
- **Customization.** The WROOM-1-H4, the WROOM-1U-H4 and the WROOM-1U-N16R16VA are listed as customizations, and the datasheet says to contact Espressif for them.
- **Flash speed.** The flash runs at up to 80 MHz and has no auto-suspend by default. 120 MHz or auto-suspend needs a request to Espressif.
- **PSRAM** is built into the chip package, and its specifications are in the datasheet's memory section.
- **Ambient temperature** is the temperature of the air right around the module, not of the chip.
- **VDD_SPI** is 1.8 V on the two N16R16VA parts and 3.3 V on every other part.

### Choosing between the memory options

The memory choice also sets the temperature limit. The R2 parts have 2 MB of quad PSRAM and are rated to 85 °C. The R8 and R16 parts have much more PSRAM, but they are rated to 65 °C unless ECC is on, and then they lose 1/16 of it. If the enclosure can get warmer than 65 °C inside, an N8R2 or a part with no PSRAM, like this one, avoids that trade. The N8 is the simplest choice for a first board: 512 KB of SRAM is enough for sensors, a web server or MQTT, every GPIO is free, and the same footprint takes an N8R2 or N8R8 later if a project needs PSRAM (keep IO35 to IO37 unconnected if you want that option).

## Pins and strapping

All 41 pins from the datasheet's pin table, in pin order. The WROOM-1 and WROOM-1U share one pin table. The datasheet prints each pin's default function in bold, which this table doesn't reproduce, so check it for the default of a pin you care about.

| Pin | Name | Type | Functions |
| --- | --- | --- | --- |
| 1 | GND | P | Ground |
| 2 | 3V3 | P | Power supply |
| 3 | EN | I | Chip enable: high is on, low is off. Do not leave it floating |
| 4 | IO4 | I/O/T | RTC_GPIO4, GPIO4, TOUCH4, ADC1_CH3 |
| 5 | IO5 | I/O/T | RTC_GPIO5, GPIO5, TOUCH5, ADC1_CH4 |
| 6 | IO6 | I/O/T | RTC_GPIO6, GPIO6, TOUCH6, ADC1_CH5 |
| 7 | IO7 | I/O/T | RTC_GPIO7, GPIO7, TOUCH7, ADC1_CH6 |
| 8 | IO15 | I/O/T | RTC_GPIO15, GPIO15, U0RTS, ADC2_CH4, XTAL_32K_P |
| 9 | IO16 | I/O/T | RTC_GPIO16, GPIO16, U0CTS, ADC2_CH5, XTAL_32K_N |
| 10 | IO17 | I/O/T | RTC_GPIO17, GPIO17, U1TXD, ADC2_CH6 |
| 11 | IO18 | I/O/T | RTC_GPIO18, GPIO18, U1RXD, ADC2_CH7, CLK_OUT3 |
| 12 | IO8 | I/O/T | RTC_GPIO8, GPIO8, TOUCH8, ADC1_CH7, SUBSPICS1 |
| 13 | IO19 | I/O/T | RTC_GPIO19, GPIO19, U1RTS, ADC2_CH8, CLK_OUT2, USB_D− |
| 14 | IO20 | I/O/T | RTC_GPIO20, GPIO20, U1CTS, ADC2_CH9, CLK_OUT1, USB_D+ |
| 15 | IO3 | I/O/T | RTC_GPIO3, GPIO3, TOUCH3, ADC1_CH2 (strapping pin) |
| 16 | IO46 | I/O/T | GPIO46 (strapping pin) |
| 17 | IO9 | I/O/T | RTC_GPIO9, GPIO9, TOUCH9, ADC1_CH8, FSPIHD, SUBSPIHD |
| 18 | IO10 | I/O/T | RTC_GPIO10, GPIO10, TOUCH10, ADC1_CH9, FSPICS0, FSPIIO4, SUBSPICS0 |
| 19 | IO11 | I/O/T | RTC_GPIO11, GPIO11, TOUCH11, ADC2_CH0, FSPID, FSPIIO5, SUBSPID |
| 20 | IO12 | I/O/T | RTC_GPIO12, GPIO12, TOUCH12, ADC2_CH1, FSPICLK, FSPIIO6, SUBSPICLK |
| 21 | IO13 | I/O/T | RTC_GPIO13, GPIO13, TOUCH13, ADC2_CH2, FSPIQ, FSPIIO7, SUBSPIQ |
| 22 | IO14 | I/O/T | RTC_GPIO14, GPIO14, TOUCH14, ADC2_CH3, FSPIWP, FSPIDQS, SUBSPIWP |
| 23 | IO21 | I/O/T | RTC_GPIO21, GPIO21 |
| 24 | IO47 | I/O/T | SPICLK_P_DIFF, GPIO47, SUBSPICLK_P_DIFF (1.8 V on the N16R16VA parts only) |
| 25 | IO48 | I/O/T | SPICLK_N_DIFF, GPIO48, SUBSPICLK_N_DIFF (1.8 V on the N16R16VA parts only) |
| 26 | IO45 | I/O/T | GPIO45 (strapping pin) |
| 27 | IO0 | I/O/T | RTC_GPIO0, GPIO0 (strapping pin) |
| 28 | IO35 | I/O/T | SPIIO6, GPIO35, FSPID, SUBSPID. Free on this part (no PSRAM); used by the PSRAM on R8 and R16 parts |
| 29 | IO36 | I/O/T | SPIIO7, GPIO36, FSPICLK, SUBSPICLK. Free on this part (no PSRAM); used by the PSRAM on R8 and R16 parts |
| 30 | IO37 | I/O/T | SPIDQS, GPIO37, FSPIQ, SUBSPIQ. Free on this part (no PSRAM); used by the PSRAM on R8 and R16 parts |
| 31 | IO38 | I/O/T | GPIO38, FSPIWP, SUBSPIWP |
| 32 | IO39 | I/O/T | MTCK, GPIO39, CLK_OUT3, SUBSPICS1 |
| 33 | IO40 | I/O/T | MTDO, GPIO40, CLK_OUT2 |
| 34 | IO41 | I/O/T | MTDI, GPIO41, CLK_OUT1 |
| 35 | IO42 | I/O/T | MTMS, GPIO42 |
| 36 | RXD0 | I/O/T | U0RXD, GPIO44, CLK_OUT2 |
| 37 | TXD0 | I/O/T | U0TXD, GPIO43, CLK_OUT1 |
| 38 | IO2 | I/O/T | RTC_GPIO2, GPIO2, TOUCH2, ADC1_CH1 |
| 39 | IO1 | I/O/T | RTC_GPIO1, GPIO1, TOUCH1, ADC1_CH0 |
| 40 | GND | P | Ground |
| 41 | EPAD | P | Ground (exposed pad under the module) |

Type P is power, I is input, and I/O/T is bidirectional with a high-impedance state.

- **IO35, IO36 and IO37 (pins 28 to 30) are free on this part.** The datasheet reserves them only on modules with octal PSRAM. If you might fit an N8R8 or N16R8 in the same footprint later, leave them unconnected now.
- **IO47 and IO48 (pins 24 and 25)** run at 1.8 V only on the N16R16VA parts. On this part they are normal 3.3 V pins.
- **USB** is on IO19 (D−, pin 13) and IO20 (D+, pin 14).
- **UART0** is TXD0 on pin 37 (IO43) and RXD0 on pin 36 (IO44).
- **JTAG** is on IO39 to IO42 (pins 32 to 35: MTCK, MTDO, MTDI, MTMS). By default the chip takes JTAG through the USB Serial/JTAG controller on IO19 and IO20, so these four pins are ordinary GPIOs unless an eFuse and the GPIO3 strap switch JTAG to them (our reading of the chip datasheet).
- **IO15 and IO16** carry the optional 32 kHz crystal as XTAL_32K_P and XTAL_32K_N.
- **The flash pins** (SPICS0, SPICLK, SPID, SPIQ, SPIHD, SPIWP and VDD_SPI) are inside the module and are not in the pin table.
- **GPIO count.** All 36 GPIOs are available, counting the four strapping pins and the two UART0 pins.

### Strapping pins

These four pins are sampled just after reset, before they become ordinary I/O.

| Pin | Default | Default bit | What it controls |
| --- | --- | --- | --- |
| GPIO0 (pin 27) | Weak pull-up | 1 | Boot mode |
| GPIO3 (pin 15) | Floating | – | JTAG signal source |
| GPIO45 (pin 26) | Weak pull-down | 0 | VDD_SPI voltage |
| GPIO46 (pin 16) | Weak pull-down | 0 | Boot mode and ROM message printing |

| Boot mode | GPIO0 | GPIO46 |
| --- | --- | --- |
| SPI boot (the default) | 1 | Any |
| Joint Download boot | 0 | 0 |

Joint Download boot accepts a download over USB Serial/JTAG, over USB OTG or over UART.

## Powering and starting it

- **Supply.** 3.0 to 3.6 V on pin 2 (3V3), with ground on pins 1, 40 and 41. The supply must be able to deliver at least 0.5 A. The Wi-Fi transmit peak in the current table is 355 mA, so the rail has to hold up during bursts; see the specification tables above.
- **EN.** Pin 3 must not be left floating. The datasheet suggests an RC delay of about 10 kΩ and 1 µF on it for a stable power-up. The power rails must be stable at least 50 µs before EN goes high, and EN must stay low for at least 50 µs to reset the chip. The strapping pins need a setup time of 0 ms and a hold time of at least 3 ms after EN goes high, before they work as ordinary I/O.
- **Strapping pins at reset.** Whatever is connected to GPIO0, GPIO3, GPIO45 and GPIO46 decides the boot mode, so check any pull resistor, button or peripheral on them against the table above.
- **Getting firmware in.** There are three paths in the datasheet: UART0 on pins 37 and 36, USB Serial/JTAG, and USB OTG on IO19 and IO20. Hold GPIO0 low through a reset to enter download mode; GPIO46 must be low too, which is its default.
- **Boot messages.** The ROM prints on UART0 and on USB Serial/JTAG by default. GPIO46 and the registers and eFuse bits can change that.

## Example application

The datasheet's typical circuit (Figure 9-1, "Peripheral Schematics") is drawn for both the WROOM-1 and the WROOM-1U. It shows the module with a supply capacitor pair, an EN reset network, an optional 32.768 kHz crystal, a USB OTG connector, a JTAG header, a UART header and a boot-option header. It prints values for some parts and "TBD" for others, and gives no bill of materials. We have not redrawn the figure, so the table below lists what it shows, with its own values where it gives them. For a complete board built on this module (USB-C power, a 3.3 V regulator, buttons, an I2C sensor and a Qwiic port), see the [ESP32-S3 starter board recipe](site:recipes/esp32-s3-test-board/).

| Ref | Part | Description | Maker |
| --- | --- | --- | --- |
| U1 | ESP32-S3-WROOM-1-N8 | Wi-Fi and Bluetooth LE module with PCB antenna | Espressif |
| C1 | 22 µF | Bulk capacitor on the 3.3 V supply (VDD33) |  |
| C3 | 0.1 µF | Decoupling capacitor on the 3.3 V supply |  |
| R1, C2 | TBD | RC delay on EN. The text beside the figure says R = 10 kΩ and C = 1 µF is the usual setting, to be adjusted to the power-up timing |  |
| SW1, C8, R7 | button, 0.1 µF, 0 Ω | Reset button from EN to ground, with a 0.1 µF capacitor on EN and a 0 Ω series resistor |  |
| X1, C4, C7, R3, R5 | 32.768 kHz, 12 pF, 12 pF, 0 Ω, 0 Ω | Optional 32 kHz crystal on IO15 and IO16. The figure marks the crystal, capacitors and resistors "NC" (not fitted). The crystal's ESR is given as 70 kΩ maximum |  |
| R4, R6 | 0 Ω | Series resistors on USB D+ (IO20) and D− (IO19) to the USB OTG header JP3 |  |
| C5, C6 | TBD | Capacitors from the USB lines to ground, not fitted |  |
| JP1 | 4-pin header | UART, from TXD0 and RXD0 |  |
| JP2 | 4-pin header | JTAG: TMS on IO42, TDI on IO41, TDO on IO40, TCK on IO39 |  |
| JP4 | 2-pin header | Boot option, on IO0 |  |

> **About the source.** The figure and its two notes were read from the module datasheet v1.8 (page 41) for the ESP32-S3-WROOM-1U-N8R8 page; the figure is shared by both modules, so this table is the same apart from U1. It was not re-read for this page.

### EN delay (R1, C2)

With R = 10 kΩ and C = 1 µF, the time constant is 10 ms. If EN is pulled up to the 3.3 V rail through R1 and the rail is already stable, EN reaches the chip's high threshold (VIH_nRST, 0.75 × VDD = 2.48 V at 3.3 V) after τ × ln 4, which is about 14 ms. That is calculated here from the datasheet's values, ignoring the 50 nA input leakage, and it is far longer than the 50 µs the datasheet asks for the power rails to be stable (tSTBL). The datasheet says to adjust R and C to the power-up timing, so treat 10 kΩ and 1 µF as the starting point. If the rail itself rises slowly (a linear regulator behind a USB cable, say), the delay counts from the moment the rail is up, which is what you want.

### Supply sizing

The datasheet asks the external supply to deliver at least 0.5 A. The Wi-Fi transmit peak in its table is 355 mA (802.11b, 1 Mbps, 20.5 dBm), so a 3.3 V regulator rated for 0.5 A leaves about 145 mA for the rest of the board at that peak (calculated here). The 22 µF and 0.1 µF capacitors in the figure sit on the same rail as the module's 3V3 pin, with the 0.1 µF closest to the pin.

## Layout

- **Put the antenna past the board edge.** Espressif's ESP32-S3 hardware design guidelines suggest placing the module's PCB antenna outside the base board, with the antenna's feed point close to the board edge. If the antenna can't extend past the edge, keep the feed point as close to the edge as possible and cut the base board away on both sides of the antenna and below it. The guidelines also say not to put the module in the middle of the board with a cut-out on all four sides.
- **Keep-out zone.** The guidelines have a keep-out figure for a module whose antenna overlaps the base board. This page doesn't copy its dimensions; check the figure before you put any copper, parts or traces near the antenna end, on any layer.
- **Ground near the antenna.** The guidelines ask for plenty of ground copper and dense ground vias on the base board near the antenna.
- **Enclosure.** The guidelines recommend at least 15 mm of clearance around the PCB antenna in every direction once the board is in its housing, and testing the finished product for range and throughput.
- **Exposed pad.** Soldering the pad (pin 41) is optional, and it helps the module shed heat. The guidelines suggest a square grid on the pad with paste on the squares and ground vias in the gaps, and a wide connection to the ground plane. Too much solder paste on it can lift the module and weaken the edge pads.
- **Land pattern.** The datasheet has a land-pattern figure for each module. The WROOM-1U one (40 edge pads of 1.5 × 0.9 mm at a 1.27 mm pitch, and a 3 × 3 grid of 0.9 mm squares for the ground pad) is on the WROOM-1U-N8R8 page. The WROOM-1 figure adds the antenna area at one end; its numbers have not been read for this page, and this site has no footprint for either module yet.
- **Soldering.** One reflow only, with SAC305 solder, at a peak of 235 to 250 °C. The moisture level is MSL 3, with 168 hours from opening the bag.

## Things to watch

- **Copper under the antenna detunes it.** A ground pour, a trace or a part under or beside the antenna end, on any layer, cuts range. The easiest layout is the antenna hanging past the board edge.
- **Metal and hands nearby.** A metal enclosure, a battery or a ground plane close to the antenna also detunes it. Plan the enclosure with the 15 mm clearance in mind.
- **Size the 3.3 V rail for transmit bursts.** The datasheet asks for at least 0.5 A, and the Wi-Fi transmit peak is 355 mA. A supply that sags during a burst can reset the chip, which looks like a random reboot. A linear regulator from 5 V also needs enough headroom at that current: check its dropout.
- **EN must be driven.** The datasheet says not to leave it floating. Tie it high, or use the RC delay.
- **Strapping pins can break boot.** A pull-up or pull-down on GPIO0, GPIO3, GPIO45 or GPIO46 changes the boot mode, the JTAG source or the VDD_SPI voltage. GPIO45 is the VDD_SPI voltage pin and this module's flash runs at 3.3 V, so leave GPIO45 unconnected or check the datasheet's strapping section before driving it at reset.
- **Leave IO35 to IO37 free if you might change variant.** The footprint takes the PSRAM parts too, but on the octal-PSRAM ones these pins belong to the PSRAM.
- **No PSRAM.** Firmware or libraries that expect PSRAM (large camera frame buffers, some display and audio examples) won't run as configured. Leave PSRAM off in the firmware settings.
- **Touch inputs have a limit.** The datasheet says the touch sensor has not passed the conducted-susceptibility test and is for limited uses.
- **There is no KiCad footprint on this site.** Espressif publishes KiCad libraries for its modules; check any footprint against the datasheet's land-pattern figure, including the antenna area. The KiCad symbol is ours, built from the pin table, and its Footprint field is empty: no footprint on this site has been compared with this part's package drawing.
- **The KiCad symbol is ours and not yet opened in KiCad.** It was generated by script and checked against the pin table, but nobody has loaded it in KiCad. The pin types and the symbol layout are our choices.

## Datasheet notes

> **About the source.** This page shares its datasheet with the ESP32-S3-WROOM-1U-N8R8 page: the ESP32-S3-WROOM-1 and WROOM-1U datasheet v1.8 (2 March 2026). The tables that the two modules share (pins, current, DC levels, flash, RF, ratings and handling) were checked against the PDF for that page and are copied here unchanged. **The figures that apply only to the WROOM-1 (its dimensions drawing, its land pattern and keep-out area, and the PCB antenna's gain) were not read from the PDF for this page**, which is why it is marked as not verified. The size and ambient range are from the datasheet's part-number table, and the antenna placement advice is from Espressif's ESP32-S3 hardware design guidelines. The LCSC part number is from the LCSC listing for the WROOM-1-N8.

- **Shared figures.** Several of the datasheet's drawings are titled for one module but cover both; the WROOM-1 and WROOM-1U have one pin table and one typical-circuit figure.
- **"Ordering Code" became "Part Number" in v1.8.** Older copies of the datasheet and most distributor pages still use the old name.
- **Chip status.** The ESP32-S3 series datasheet v2.2 marks the ESP32-S3R2 as end of life, so check availability before choosing an R2 module. The N8 has no PSRAM and is not affected.
