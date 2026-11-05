---
manufacturer: Silergy
family: SY80082
part: SY80082FABT
category: buck-converter
summary: '2.5–5.5 V input, 2 A synchronous buck at 1.5 MHz with power good, in SOT23-6. SY80082FABT: 1.8 kΩ (slow discharge) output discharge.'
abstract: The latching variant with a slow 1.8 kΩ output discharge. It shares its silicon, ratings and layout rules with SY80082ABT, so see that page for the full notes.
status: unknown
packages:
- SOT23-6
specs:
  vin_min_v: 2.5
  vin_max_v: 5.5
  vout_min_v: 0.6
  vout_max_v: 5.5
  iout_max_a: 2
  fsw_khz: '1500'
  iq_ua: 50
  topology: Synchronous buck, constant off-time, peak current mode
features:
- 2.5–5.5 V input voltage range, up to 2 A output current
- 'Low-resistance internal switches: 130 mΩ top, 85 mΩ bottom'
- ±1.5% 0.6 V reference
- 1.5 MHz switching frequency
- Constant off-time, peak current mode control for fast transient response
- PFM light-load operation for high efficiency
- Internal soft-start limits inrush current
- 100% dropout operation
- Power-good indicator and output auto-discharge
- Cycle-by-cycle peak current limit
- Latch-off output under-voltage protection and latch-off over-temperature protection
- 1.8 kΩ output discharge (slow)
- SOT23-6 package
spec_groups:
- title: Input, output and reference
  items:
  - label: Output discharge resistance
    value: 1.8 kΩ (slow discharge)
  - label: Reference voltage
    value: 0.6 V, ±1.5% (0.591–0.609 V)
  - label: Quiescent current
    value: 50 µA typical, 70 µA max
  - label: Shutdown current
    value: 0.1 µA typical, 1 µA max
  - label: Soft-start time
    value: 1 ms typical
  - label: Turn-on delay after EN
    value: 0.5 ms typical
  - label: Input UVLO
    value: 2.49 V rising max (2.4 V typical), 0.15 V hysteresis
  - label: EN thresholds
    value: 1 V minimum high, 0.4 V maximum low
- title: Switching and power stage
  items:
  - label: Internal switch RDS(on)
    value: 130 mΩ top / 85 mΩ bottom (typical)
  - label: Top switch current limit
    value: 3.5 A minimum
  - label: Minimum on-time
    value: 50 ns; 100% duty in dropout
- title: Protection and monitoring
  items:
  - label: Output short protection
    value: Latches off
  - label: Over-temperature response
    value: Latches off
  - label: Power good
    value: Open drain; goes high at about 92% of VREF and low above about 120% (typical)
  - label: Output short protection threshold
    value: Below 50% of VREF after a 10 µs delay
  - label: Over-temperature protection
    value: 150 °C typical in the table (the text says 160 °C), 15 °C hysteresis
- title: Package, ratings and thermal
  items:
  - label: Orderable part number
    value: SY80082FABT (top mark LDJxyz)
  - label: Absolute max on IN
    value: 6.5 V
  - label: Recommended junction temperature
    value: -40 to 125 °C
  - label: Thermal resistance θJA
    value: 120 °C/W
design_tables:
- title: Recommended values for typical outputs
  columns:
  - Vout (V)
  - RH (kΩ)
  - RL (kΩ)
  - CFF (pF)
  - Inductor
  - COUT
  rows:
  - - '0.9'
    - '10'
    - '20'
    - '22'
    - 0.68 µH, 0420CDMCCDS-R68MC
    - 22 µF / 10 V / X5R, 0805
  - - '1.8'
    - '30'
    - '15'
    - '22'
    - 1.0 µH, 0420CDMCCDS-1R0MC
    - 10 µF / 10 V / X5R, 0805
  - - '2.5'
    - '63.4'
    - '20'
    - '22'
    - 1.0 µH, 0420CDMCCDS-1R0MC
    - 10 µF / 10 V / X5R, 0805
  - - '3.3'
    - '51'
    - '11.3'
    - '22'
    - 1.0 µH, 0420CDMCCDS-1R0MC
    - 10 µF / 10 V / X5R, 0805
  note: Values from the datasheet's recommended-components table.
datasheet: https://www.silergy.com/download/downloadFile?id=6668&type=product&ftype=note
datasheet_revision: Rev 1.0A (December 2025)
verified: true
draft: true
tags:
- synchronous-buck
- 5v
- 2a
- 1-5mhz
- power-good
- sot23-6
---

## How it differs from SY80082ABT

- **Output discharge is a gentle 1.8 kΩ** instead of 50 Ω, so the output falls slowly when the part is disabled. Check this if something downstream needs the rail to collapse quickly.
- **Output short and over-temperature faults latch off** instead of recovering by themselves. The datasheet doesn't describe how to clear a latched fault, so check with Silergy before relying on a particular reset method.
- Everything else, including the 1 kΩ to 1 MΩ resistor on EN, the open-drain power-good pin and the 20 kΩ limit on the lower feedback resistor, is as described on the SY80082ABT page.

## Example application

The datasheet gives one reference circuit for the whole family, and it works with this part: use SY80082FABT as U1. The schematic, parts list, component reasoning, worked example and layout notes are in the Example application section of the [SY80082ABT page](site:parts/silergy/sy80082abt/). The recommended component values above apply to this part unchanged.
