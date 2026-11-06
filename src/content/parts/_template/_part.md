---
# Copy this file to src/content/parts/<manufacturer>/<family>/<part>.md
# (lowercase, hyphenated folder names). Files starting with "_" are ignored by the build.
# If a value contains a colon followed by a space (": "), wrap the whole value in double quotes.
manufacturer: Silergy
family: SY8113
part: SY8113B
category: buck-converter      # buck-converter | boost-converter | buck-boost-converter | battery-charger | ldo | ac-dc-controller | gate-driver | power-stage | amplifier | processor | other
summary: "One sentence on what the part is, under 200 characters. Used on cards and in search."
abstract: "A short paragraph shown under the title: what the part is for and what makes it notable. Plain text, your own words."
status: active                # active | nrnd | obsolete | unknown
packages: [SOT-23-6]
specs:                        # headline numbers: they feed the at-a-glance tiles and the Key specifications table
  vin_min_v: 4.5
  vin_max_v: 18
  vout_min_v: 0.6
  iout_max_a: 3
  fsw_khz: "500"
  iq_ua: 50
  topology: Synchronous buck
features:                     # headline features from the datasheet, in your own words
  - 4.5–18 V input voltage range, up to 3 A output current
  - Fixed 500 kHz switching frequency
spec_groups:                  # everything else, grouped into titled tables (one table per group)
  - title: Input, output and reference
    items:
      - { label: Reference voltage, value: "0.6 V, ±1.5%" }
  - title: Protection and monitoring
    items:
      - { label: Over-temperature protection, value: "150 °C, 15 °C hysteresis" }
  - title: Package, ratings and thermal
    items:
      - { label: Absolute max on IN, value: "19 V" }
design_tables:                # optional: recommended component values and other lookup tables
  - title: Recommended values for typical outputs
    note: Values from the datasheet's recommended-components table.
    columns: [Vout (V), RH (kΩ), RL (kΩ), Inductor]
    rows:
      - ["3.3", "100", "22.1", "4.7 µH"]
datasheet: https://example.com/datasheet.pdf
datasheet_revision: "Rev 1.0 (June 2025)"   # the revision you checked the specs against
lcsc: C123456                 # optional
verified: false               # true only after every spec above is checked against the datasheet
draft: true                   # set false once a human has rewritten the prose below
tags: []
---

## Design notes

Write what the datasheet doesn't say: where this part shines, gotchas, good alternatives. Link the datasheet instead of copying it.

### Before you build

- **Enable pin:** a note about it.
- **Parts the datasheet recommends:** input and output capacitors, inductor.

## Layout guidance

- Layout advice from the datasheet and your own experience.

## Datasheet notes

Mention datasheet errors or contradictions you spotted, such as a pin table that disagrees with the layout section. Delete this section if there are none.

<!--
Optional: if the part has an I2C, SPI or UART interface, add a section that lets an ESP32-S3 talk to it.
Copy the skeleton, wiring table, level and pull-up check and sketch blocks from src/content/docs/contribute/arduino.md
(published at /contribute/arduino/), and put the section before "Layout guidance".

## Talk to it from an ESP32-S3

### What the datasheet gives
### Wiring
### Level and pull-up check
### The sketch
### Using it
### Pitfalls with the ESP32-S3
-->
