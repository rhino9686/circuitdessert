---
manufacturer: Espressif
family: ESP32-S3-WROOM-1 / WROOM-1U
part: ESP32-S3-WROOM-1U-N8R8
category: processor
summary: '2.4 GHz Wi-Fi and Bluetooth LE module: dual-core 240 MHz ESP32-S3R8, 8 MB quad flash, 8 MB octal PSRAM, 36 GPIOs, 3.0–3.6 V, antenna connector, 18.0 × 19.2 × 3.2 mm, 65 °C ambient.'
abstract: 'A ready-made 2.4 GHz Wi-Fi and Bluetooth LE module built around Espressif''s ESP32-S3R8: a dual-core 240 MHz Xtensa LX7 processor with 8 MB of octal PSRAM in the chip package, 8 MB of quad SPI flash and a 40 MHz crystal on the module, 36 GPIOs and the usual peripherals, including full-speed USB. The U in the name means the module has a connector for an external antenna and no antenna of its own, so it needs a 50 Ω antenna and cable, and in return it has no antenna keep-out zone on the base board. In the part number, N8 is 8 MB of flash and R8 is 8 MB of PSRAM, and the R8 parts are rated to 65 °C ambient instead of the 85 °C of most other variants. One datasheet covers the PCB-antenna WROOM-1 and the connector WROOM-1U in 22 part numbers. This page is written for the ESP32-S3-WROOM-1U-N8R8 and tabulates all of them.'
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
    value: 8 MB, Octal SPI, in the chip package
  - label: Wireless
    value: Wi-Fi 802.11 b/g/n up to 150 Mbps; Bluetooth 5 (LE) with Bluetooth mesh
  - label: GPIOs
    value: 36, of which IO35, IO36 and IO37 are used by the PSRAM on this part, leaving 33
  - label: Antenna
    value: External, through a connector (U.FL, MHF I or AMC compatible); no antenna supplied
  - label: Ambient temperature
    value: −40 to 65 °C (85 °C with PSRAM ECC on, which gives up 1/16 of the PSRAM)
  - label: Size
    value: 18.0 × 19.2 × 3.2 mm
features:
- Dual-core 32-bit Xtensa LX7 at up to 240 MHz with a single-precision FPU, plus vector instructions for neural-network and signal-processing work
- 384 KB ROM, 512 KB SRAM and 16 KB RTC SRAM in the chip, with 8 MB of octal PSRAM in the chip package and 8 MB of quad SPI flash on the module
- 802.11 b/g/n Wi-Fi up to 150 Mbps, and Bluetooth 5 LE with Bluetooth mesh and the 125 kbps, 500 kbps, 1 Mbps and 2 Mbps PHYs, sharing one antenna
- 36 GPIOs, four of them strapping pins; IO35 to IO37 are taken by the PSRAM on this variant
- Two I2C, two I2S and three UART ports, two general-purpose SPI ports, LCD and camera interfaces, SD/MMC host, TWAI (CAN 2.0), RMT, pulse counter, LED PWM and two MCPWM units
- Two 12-bit SAR ADCs with 20 channels, 14 touch inputs and a temperature sensor
- Full-speed USB 2.0 OTG and a USB Serial/JTAG controller on IO19 and IO20
- Secure boot, flash encryption, a 4-Kbit one-time-programmable memory, AES, SHA, RSA, HMAC, a digital signature peripheral and a random number generator (from the chip datasheet; the module datasheet does not list them)
- Low-power coprocessors that can watch inputs while the CPU is off; 7 to 8 µA in deep sleep with RTC memory kept
- Connector for an external antenna, so no keep-out zone is needed on the base board
- 41-pin surface-mount module, 18.0 × 19.2 × 3.2 mm, with an exposed ground pad
spec_groups:
- title: Supply and logic levels
  items:
  - label: Supply voltage (3V3 pin, VDD33)
    value: 3.0 V minimum, 3.3 V typical, 3.6 V maximum
  - label: Supply current the external supply must deliver (IVDD)
    value: 0.5 A minimum
  - label: SPI flash and PSRAM supply (VDD_SPI)
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
    value: 240 µA typical, with VDD_SPI and Wi-Fi powered down and the GPIOs high-impedance. The 8 MB octal PSRAM at 3.3 V adds 140 µA
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
  - label: Antenna connection
    value: Connector for an external 50 Ω antenna; U.FL series (Hirose), MHF I (I-PEX) and AMC (Amphenol) are listed as compatible. The module ships without an antenna
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
  - label: PSRAM (in the chip package)
    value: 8 MB, Octal SPI, 80 MHz maximum clock. Turning on ECC raises the ambient limit to 85 °C and removes 1/16 of the usable PSRAM
  - label: SPI
    value: 'Four controllers: SPI0 and SPI1 reach the flash and PSRAM, SPI2 and SPI3 are general purpose'
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
    value: −40 to 65 °C. With PSRAM ECC on, up to 85 °C
  - label: ESD
    value: ±2000 V human body model, ±500 V charged-device model
  - label: Moisture
    value: 'MSL 3: solder within 168 hours of opening the bag at 25 ± 5 °C and 60% RH, otherwise bake. Keep the sealed bag below 40 °C and 90% RH'
  - label: Reflow
    value: SAC305 lead-free, one reflow only. Preheat 150 to 200 °C for 60 to 120 s, 60 to 90 s above 217 °C, peak 235 to 250 °C
  - label: Size
    value: 18.0 × 19.2 × 3.2 mm, tolerances ±0.2 mm and ±0.15 mm (height)
  - label: Pins
    value: 41, including the exposed ground pad (pin 41)
  - label: Antenna the RF certification was made with
    value: A first-generation external monopole, 2.33 dBi maximum gain. Other antennas or gains may need further testing
datasheet: https://documentation.espressif.com/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf
datasheet_revision: v1.8 (2 March 2026)
kicad_symbol: ESP32-S3-WROOM-1U-N8R8.kicad_sym
lcsc: C2980300
verified: true
draft: true
tags:
- esp32-s3
- wifi
- bluetooth-le
- module
- mcu
- xtensa-lx7
- psram
- octal-psram
- external-antenna
- usb-otg
- wroom-1u
- n8r8
---

## How it works

The ESP32-S3-WROOM-1U-N8R8 is an ESP32-S3R8 chip on a small board with a 40 MHz crystal, an 8 MB quad SPI flash chip and the RF matching network, with the antenna connection brought out to a connector. The datasheet's block diagram shows exactly those parts. The 3.3 V supply, the EN pin and the GPIOs come out on 40 edge pins, and a 41st pin is the exposed ground pad underneath.

The PSRAM is not a separate chip. The datasheet says the modules use PSRAM built into the chip's package, and its pin footnote names the ESP32-S3R8 and ESP32-S3R16V as the chips with octal PSRAM. This revision's ordering table doesn't say which chip sits in which part number, but an older revision (v0.6) did, and it lists the ESP32-S3R8 for the WROOM-1-N8R8. We read the N8R8 as an ESP32-S3R8 module.

The processor reaches the flash and the PSRAM over its SPI0 and SPI1 controllers, through a cache. That is why those controllers aren't general-purpose ports, why the flash pins aren't brought out, and why three of the module's GPIOs (IO35 to IO37) belong to the PSRAM on this part.

### The -1U antenna connector

The WROOM-1U has no antenna on board. RF goes to a connector, and you plug in an antenna and cable of your own. In return the base board needs no keep-out zone, which is the main reason to choose it over the PCB-antenna WROOM-1 (18.0 × 25.5 × 3.1 mm, with a keep-out zone). The datasheet's RF certification was made with one specific monopole antenna, so a different antenna or gain may need further testing.

### On Espressif's dev kit

The ESP32-S3-DevKitC-1U-N8R8 board carries this module. Espressif's DevKitC-1 user guide lists the board with 8 MB of quad SPI flash, 8 MB of octal SPI PSRAM and a 3.3 V SPI voltage, and says the same of the PCB-antenna DevKitC-1-N8R8. The guide also says IO35 to IO37 are used for the flash and PSRAM link on boards like this, so they aren't available. The board has a Boot button for download mode, and an addressable RGB LED that is on GPIO48 in board version 1.0 and GPIO38 in version 1.1.

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
| ESP32-S3-WROOM-1-N8 | 8 MB (Quad) | – | −40 to 85 | 18.0 × 25.5 × 3.1 |
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
| **ESP32-S3-WROOM-1U-N8R8** | 8 MB (Quad) | 8 MB (Octal) | −40 to 65 | 18.0 × 19.2 × 3.2 |
| ESP32-S3-WROOM-1U-N16R8 | 16 MB (Quad) | 8 MB (Octal) | −40 to 65 | 18.0 × 19.2 × 3.2 |
| ESP32-S3-WROOM-1U-N16R16VA | 16 MB (Quad) | 16 MB (Octal) | −40 to 65 | 18.0 × 19.2 × 3.2 |

The bold row, the WROOM-1U-N8R8, is the part this page is written for. The notes under the datasheet's tables say, in our words:

- **PSRAM ECC.** For the R8 and R16 parts with octal PSRAM, turning on the PSRAM's error correction raises the ambient limit to 85 °C, and costs 1/16 of the usable PSRAM.
- **Customization.** The WROOM-1-H4, the WROOM-1U-H4 and the WROOM-1U-N16R16VA are listed as customizations, and the datasheet says to contact Espressif for them.
- **Flash speed.** The flash runs at up to 80 MHz and has no auto-suspend by default. 120 MHz or auto-suspend needs a request to Espressif.
- **PSRAM** is built into the chip package, and its specifications are in the datasheet's memory section.
- **Ambient temperature** is the temperature of the air right around the module, not of the chip.
- **VDD_SPI** is 1.8 V on the two N16R16VA parts and 3.3 V on every other part.

### Choosing between the memory options

The memory choice also sets the temperature limit. The R2 parts have 2 MB of quad PSRAM and are rated to 85 °C. The R8 and R16 parts have much more PSRAM, but they are rated to 65 °C unless ECC is on, and then they lose 1/16 of it. If the enclosure can get warmer than 65 °C inside, an N8R2 or a part with no PSRAM avoids that trade.

## Pins and strapping

All 41 pins from the datasheet's pin table, in pin order. The datasheet prints each pin's default function in bold, which this table doesn't reproduce, so check it for the default of a pin you care about.

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
| 28 | IO35 | I/O/T | SPIIO6, GPIO35, FSPID, SUBSPID. **Used by the PSRAM on this part** |
| 29 | IO36 | I/O/T | SPIIO7, GPIO36, FSPICLK, SUBSPICLK. **Used by the PSRAM on this part** |
| 30 | IO37 | I/O/T | SPIDQS, GPIO37, FSPIQ, SUBSPIQ. **Used by the PSRAM on this part** |
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

- **IO35, IO36 and IO37 (pins 28 to 30) are used by the octal PSRAM on this part.** The datasheet says they can't be used for anything else on modules with octal PSRAM, so leave them unconnected.
- **IO47 and IO48 (pins 24 and 25)** run at 1.8 V only on the N16R16VA parts. On this part they are normal 3.3 V pins.
- **USB** is on IO19 (D−, pin 13) and IO20 (D+, pin 14).
- **UART0** is TXD0 on pin 37 (IO43) and RXD0 on pin 36 (IO44).
- **IO15 and IO16** carry the optional 32 kHz crystal as XTAL_32K_P and XTAL_32K_N.
- **The flash pins** (SPICS0, SPICLK, SPID, SPIQ, SPIHD, SPIWP and VDD_SPI) are inside the module and are not in the pin table.
- **GPIO count.** Of the 36 GPIOs, four are strapping pins, and three are the PSRAM's on this part, so 33 are free for your own use, counting the strapping pins and the two UART0 pins.

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

- **Supply.** 3.0 to 3.6 V on pin 2 (3V3), with ground on pins 1, 40 and 41. The supply must be able to deliver at least 0.5 A. The Wi-Fi transmit peak in the current table is 355 mA, so the rail has to hold up during bursts; see the specification tables above for the figures.
- **EN.** Pin 3 must not be left floating. The datasheet suggests an RC delay of about 10 kΩ and 1 µF on it for a stable power-up. The power rails must be stable at least 50 µs before EN goes high, and EN must stay low for at least 50 µs to reset the chip. The strapping pins need a setup time of 0 ms and a hold time of at least 3 ms after EN goes high, before they work as ordinary I/O.
- **Strapping pins at reset.** Whatever is connected to GPIO0, GPIO3, GPIO45 and GPIO46 decides the boot mode, so check any pull resistor, button or peripheral on them against the table above.
- **Getting firmware in.** There are three paths in the datasheet: UART0 on pins 37 and 36, USB Serial/JTAG, and USB OTG on IO19 and IO20. Hold GPIO0 low through a reset to enter download mode. GPIO46 is low by default, and it must be low too.
- **Boot messages.** The ROM prints on UART0 and on USB Serial/JTAG by default. GPIO46 and the registers and eFuse bits can change that.

The datasheet's typical circuit is described under Example application below.

## Example application

The datasheet's typical circuit (Figure 9-1, "Peripheral Schematics") shows the module with a supply capacitor pair, an EN reset network, an optional 32.768 kHz crystal, a USB OTG connector, a JTAG header, a UART header and a boot-option header. It prints values for some parts and "TBD" for others, and gives no bill of materials. We have not redrawn the figure, so the table below lists what it shows, with its own values where it gives them.

| Ref | Part | Description | Maker |
| --- | --- | --- | --- |
| U1 | ESP32-S3-WROOM-1U-N8R8 | Wi-Fi and Bluetooth LE module with antenna connector (the figure is drawn for both the WROOM-1 and the WROOM-1U) | Espressif |
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

> **About the source.** Read from Figure 9-1 of the module datasheet v1.8 (page 41), and from the two notes under it. The figure labels pin functions and values in small type, so the part descriptions above are limited to what is printed on it.

### EN delay (R1, C2)

With R = 10 kΩ and C = 1 µF, the time constant is 10 ms. If EN is pulled up to the 3.3 V rail through R1 and the rail is already stable, EN reaches the chip's high threshold (VIH_nRST, 0.75 × VDD = 2.48 V at 3.3 V) after τ × ln 4, which is about 14 ms. That is calculated here from the datasheet's values, ignoring the 50 nA input leakage, and it is far longer than the 50 µs the datasheet asks for the power rails to be stable (tSTBL). The delay also holds EN low long enough for a power-on reset, and it slows the rise of EN when you press and release a reset button. The datasheet says to adjust R and C to the power-up timing, so treat 10 kΩ and 1 µF as the starting point.

### Supply sizing

The datasheet asks the external supply to deliver at least 0.5 A. The Wi-Fi transmit peak in its table is 355 mA (802.11b, 1 Mbps, 20.5 dBm), so a 3.3 V regulator rated for 0.5 A leaves about 145 mA for the rest of the board at that peak (calculated here). The 22 µF and 0.1 µF capacitors in the figure sit on the same rail as the module's 3V3 pin.

## Layout

- **No keep-out zone** is needed for the -1U, because it has no PCB antenna. The PCB-antenna WROOM-1 does need one; the datasheet sends the reader to Espressif's hardware design guidelines for it.
- **Connector.** The module takes a 50 Ω antenna through a connector. The datasheet lists U.FL (Hirose), MHF I (I-PEX) and AMC (Amphenol) connectors as compatible, and recommends a 2.4 GHz, 50 Ω antenna with no more gain than the certified one (2.33 dBi). It shows the connector it expects in one of its figures.
- **Exposed pad.** Soldering the pad (pin 41) is optional, and it helps the module shed heat. Too much solder paste on it can lift the module and weaken the edge pads.
- **Land pattern.** From the datasheet's WROOM-1U figure: 40 edge pads of 1.5 × 0.9 mm at a 1.27 mm pitch, on a pattern 18 mm wide and 19.2 mm tall. The ground pad is a 3 × 3 array of 0.9 mm squares with 0.5 mm gaps (3.7 × 3.7 mm overall), with vias for heat. The figure has more dimensions than this, and the datasheet links design files with the full pad geometry.
- **Soldering.** One reflow only, with SAC305 solder, at a peak of 235 to 250 °C. The moisture level is MSL 3, with 168 hours from opening the bag.

## Things to watch

- **This part is rated to 65 °C ambient, not 85 °C.** Most variants are rated to 85 °C. Every R8 part is rated to 65 °C. PSRAM ECC raises it to 85 °C and costs 1/16 of the PSRAM.
- **IO35, IO36 and IO37 are gone.** They are wired to the PSRAM inside the module. Don't connect anything to pins 28 to 30.
- **Size the 3.3 V rail for transmit bursts.** The datasheet asks for at least 0.5 A, and the Wi-Fi transmit peak is 355 mA. A supply that sags during a burst can reset the chip, which looks like a random reboot.
- **EN must be driven.** The datasheet says not to leave it floating. Tie it high, or use the RC delay.
- **Strapping pins can break boot.** A pull-up or pull-down on GPIO0, GPIO3, GPIO45 or GPIO46 changes the boot mode, the JTAG source or the VDD_SPI voltage. GPIO45 is the VDD_SPI voltage pin and this module's SPI supply is 3.3 V, so check the datasheet's strapping section before driving it high at reset.
- **Nothing radiates until an antenna is fitted.** The module ships without one, and the RF certification applies to the antenna the datasheet names.
- **Match the firmware to the memory.** This part has quad SPI flash and octal SPI PSRAM. Firmware settings for other memory types, such as quad PSRAM or octal flash, won't match it. The datasheet doesn't cover firmware settings, so check them in your toolchain.
- **Touch inputs have a limit.** The datasheet says the touch sensor has not passed the conducted-susceptibility test and is for limited uses.
- **Check which module you are buying.** The N16R16VA parts have a 1.8 V SPI supply, and the WROOM-2 is a different module with octal flash.
- **The KiCad symbol is ours and not yet opened in KiCad.** It was generated by script and checked against the pin table, but nobody has loaded it in KiCad. The pin types and the symbol layout are our choices.

## Datasheet notes

> **About the source.** This page is built from the ESP32-S3-WROOM-1 and WROOM-1U datasheet v1.8 (2 March 2026), checked table by table against the PDF, including the pin, current, DC, flash and PSRAM, RF, ratings and handling tables and the land-pattern, dimension and typical-circuit figures. The chip features that the module datasheet leaves out (security, timers, RMT and pulse counters, the strapping hold time) come from the ESP32-S3 series datasheet v2.2, which has the chip's own tables. The pin functions were also cross-checked against the header tables in Espressif's ESP32-S3-DevKitC-1 user guide, which agree except for the names noted below. The LCSC part number is from the LCSC listing for the WROOM-1U-N8R8.

- **IO47 and IO48 clock names.** The module datasheet text gives SPICLK_P_DIFF and SPICLK_N_DIFF for pins 24 and 25. The DevKitC-1 user guide's header tables give SPICLK_P and SPICLK_N for the same GPIOs. The SUBSPICLK names have the _DIFF ending in both.
- **"Ordering Code" became "Part Number" in v1.8.** Older copies of the datasheet and most distributor pages still use the old name, and older copies have a different table layout.
- **The N16R16VA name changed.** v1.4 (November 2024) renamed the N16R16V parts to N16R16VA. The datasheet doesn't say what the A stands for.
- **The module datasheet does not name the chip inside each part number.** It lists the chips ESP32-S3, ESP32-S3R2, ESP32-S3R8 and ESP32-S3R16V in its block diagram and says R8 and R16V parts have octal PSRAM. Mapping N8R8 to the ESP32-S3R8 is our reading, backed by the v0.6 ordering table.
- **Chip status.** The ESP32-S3 series datasheet v2.2 lists the ESP32-S3R8 as current and marks the ESP32-S3R8V and the ESP32-S3R2 as end of life, with the R2 upgraded to an ESP32-S3RH2. This module datasheet still lists R2 parts, so check availability before choosing one. The N8R8 is not affected.
