---
manufacturer: Silergy
family: SA21340IAAT
part: SA21340IAAT
category: ldo
summary: 'Automotive 150 mA LDO, fixed 3.3 V ±2%: 4–36 V in (40 V absolute maximum), 150 mV dropout at 150 mA, 15 µA quiescent, short-circuit hiccup, over-temperature protection, AEC-Q100 grade 1. SOT23-5.'
abstract: A 150 mA linear regulator with a fixed 3.3 V output for automotive 12 V and 24 V systems. It takes 4 to 36 V in (40 V absolute maximum) and holds the output to ±2% over temperature (3.234 to 3.366 V). Dropout is 150 mV typical at 150 mA, and quiescent current is 15 µA typical. It limits output current at 900 mA typical, and if the output falls below about 0.53 V it shuts down for about 16 ms and restarts with a soft start, repeating until the fault clears or the die reaches 150 °C. It is AEC-Q100 grade 1 and comes in a 5-pin SOT23-5 with two unused pins. The package has no enable pin. The datasheet is a revision 1.0 initial release.
status: active
packages:
- SOT23-5 (SA21340IAAT)
specs:
  vin_min_v: 4
  vin_max_v: 36
  vout_min_v: 3.3
  vout_max_v: 3.3
  iout_max_a: 0.15
  iq_ua: 15
  topology: Low-dropout regulator (LDO), fixed 3.3 V, with short-circuit hiccup protection and no enable pin
  extra:
  - label: Output voltage
    value: 3.3 V fixed; 3.234–3.366 V (±2%) over −40 to 125 °C junction; no tighter 25 °C figure is given
  - label: Dropout voltage
    value: 10 mV typical (20 mV maximum) at 10 mA; 150 mV typical (300 mV maximum) at 150 mA
  - label: Quiescent current
    value: 15 µA typical, 22 µA maximum at no load
  - label: Current limit
    value: 600 mA minimum, 900 mA typical, 1200 mA maximum (output forced to 3 V)
  - label: Qualification
    value: AEC-Q100 grade 1
  - label: Absolute maximum
    value: IN 40 V, OUT 8 V
features:
- Wide input voltage range, 4 V to 36 V
- Fixed 3.3 V output, ±2%
- Low dropout voltage, 150 mV at 150 mA
- Ultra-low quiescent current
- Stable with tantalum or ceramic capacitors
- Over-current limit, output short-circuit protection (hiccup mode) and over-temperature protection
- Fixed 1 ms soft start; output discharge (product page and block diagram)
- AEC-Q100 grade 1
- SOT23-5 package, MSL 1, RoHS compliant and halogen free
spec_groups:
- title: Input
  items:
  - label: Input voltage range
    value: 4–36 V
  - label: Absolute maximum, IN
    value: 40 V
  - label: UVLO threshold, rising
    value: 2.9 V minimum, 3.3 V typical, 4 V maximum
  - label: UVLO hysteresis
    value: 200 mV typical
  - label: Quiescent current, no load
    value: 15 µA typical, 22 µA maximum (VIN from VOUT + 1 V to 36 V)
- title: Output and regulation
  items:
  - label: Output voltage, −40 to 125 °C
    value: 3.234 V minimum, 3.3 V typical, 3.366 V maximum
  - label: Line regulation (10 mA, 4–36 V)
    value: 1 mV/V typical, 1.5 mV/V maximum
  - label: Load regulation (VIN 5 V, 10–150 mA)
    value: 0.25% typical, 0.5% maximum
  - label: Dropout, 10 mA
    value: 10 mV typical, 20 mV maximum
  - label: Dropout, 150 mA
    value: 150 mV typical, 300 mV maximum
  - label: Soft-start time
    value: 1 ms typical
  - label: PSRR, 100 Hz
    value: 60 dB typical (COUT 4.7 µF, 10 mA, 25 °C)
  - label: PSRR, 100 kHz
    value: 35 dB typical (COUT 4.7 µF, 10 mA, 25 °C)
- title: Protection
  items:
  - label: Current limit (VOUT forced to 3 V)
    value: 600 mA minimum, 900 mA typical, 1200 mA maximum
  - label: Output short threshold
    value: 0.264 V minimum, 0.528 V typical, 0.99 V maximum (VOUT forced from 3.3 V to 0 V)
  - label: Output short off time
    value: 16 ms typical
  - label: Thermal shutdown
    value: 150 °C typical, 20 °C hysteresis
- title: Thermal and package
  items:
  - label: Junction to ambient (θJA)
    value: 210 °C/W (JEDEC 51-3, single-layer low-conductivity board)
  - label: Junction to case (θJC)
    value: 38.4 °C/W
  - label: Power dissipation at 25 °C ambient
    value: 0.47 W
  - label: Junction temperature
    value: −40 to 150 °C
  - label: Ambient temperature range
    value: −40 to 125 °C
  - label: Ordering
    value: SA21340IAAT, SOT23-5, top mark 2fxyz, 3000 per 7-inch reel (8 mm tape)
design_tables:
- title: Largest continuous load current from the power limit (calculated)
  note: 'Calculated here as (125 °C − TA) ÷ θJA ÷ (VIN − 3.3 V) with the datasheet''s θJA of 210 °C/W, capped at the 150 mA rating. Quiescent current is ignored (at most 22 µA, under 1 mW). The 0.47 W the datasheet gives at 25 °C is this same calculation for a 125 °C junction (our check: 100 °C ÷ 210 °C/W is 0.476 W). A better board than the datasheet''s changes the result.'
  columns:
  - VIN
  - At 25 °C ambient
  - At 85 °C ambient
  rows:
  - - 5 V
    - 150 mA (the 150 mA rating)
    - 112 mA
  - - 8 V
    - 101 mA
    - 41 mA
  - - 12 V
    - 55 mA
    - 22 mA
  - - 24 V
    - 23 mA
    - 9 mA
  - - 36 V
    - 15 mA
    - 6 mA
datasheet: https://www.silergy.com/download/downloadFile?id=6281&type=product&ftype=note
datasheet_revision: Rev. 1.0 (May 29, 2025), initial release
kicad_symbol: SA21340IAAT.kicad_sym
verified: true
draft: true
tags:
- sa21340iaat
- sa21340i
- automotive
- aec-q100
- fixed-3v3
- high-voltage-ldo
---

## How it works

The SA21340I is a high-input-voltage linear regulator with a fixed 3.3 V output and a 150 mA load rating. The block diagram shows a PMOS pass device, an under-voltage lockout, a soft-start controller, an output current limit, short-circuit protection, an over-temperature block and an output discharge switch. There is no enable pin.

**Short-circuit hiccup.** If VOUT falls below 16% of the set point (the datasheet's threshold is 0.528 V typical, 0.264 to 0.99 V over the part), the regulator shuts down for about 16 ms and then restarts with a full soft-start cycle. If the short is still there it repeats, until the over-temperature protection trips instead (150 °C, with about 20 °C of hysteresis).

**Under-voltage lockout.** The input must rise above a threshold between 2.9 and 4 V (3.3 V typical) before the regulator starts, and it drops out 200 mV lower.

**Capacitors.** 1 µF X7R or better on IN, close to the pins, and a 4.7 µF low-ESR ceramic on OUT. The datasheet says a larger output capacitor such as 22 µF can reduce noise and improve transient response and PSRR, and that some ceramic dielectrics change a lot with temperature.

**Heat.** Dropout is small, but the drop from a 12 V or 24 V supply to 3.3 V is not: see the calculated table. The datasheet's own rating of 0.47 W at 25 °C ambient is the limit.

### Pins

| Pin | Name | Function |
| --- | --- | --- |
| 1 | IN | Supply input; bypass to ground with a 1 µF capacitor |
| 2 | GND | Ground |
| 3, 4 | NC | No connection |
| 5 | OUT | Output; bypass to ground with a low-ESR 4.7 µF capacitor |

## Example application

The datasheet gives the circuit twice: Figure 1 on the front page, with 1 µF on the input and 4.7 µF on the output, and the "Schematic" on page 8, which adds voltage ratings and a bill of materials.

### Reference circuit

![Typical application redrawn from Figure 1 of the SA21340IAAT datasheet: VIN of 4 V to 36 V in, 3.3 V out, with a 1 µF input capacitor C1 and a 4.7 µF output capacitor C2. The two no-connect pins are not drawn. The figure has no net names on its open terminals; VIN and VOUT are ours.](schematic:sa21340iaat-schematic.svg)

| Ref | Part | Description | Maker |
| --- | --- | --- | --- |
| U1 | SA21340IAAT | 150 mA fixed 3.3 V automotive LDO, SOT23-5 | Silergy |
| C1 | GCM188R71H105K | 1 µF, 50 V, 0603, X7R (page 8) | Murata |
| C2 | GCJ188C70J475K | 4.7 µF, 0603, X7R; the page 8 drawing says 25 V, its BOM says 16 V (see Things to watch) | Murata |

> **About the source.** Built from the SA21340IAAT datasheet, Rev. 1.0 (May 29, 2025), the initial release, as attached by the user. The PDF footer on every page reads "Silergy Corp. Confidential - Prepared for Customer Use Only", so the file may not be the public datasheet. Pages 1, 2, 3 and 8 were compared with rendered images (cover and Figure 1, ordering and pins and block diagram, the ratings and electrical tables, the schematic and BOM); the rest was read from the text layer. The status "active" comes from the Silergy product page, which lists the lifecycle as "Production" (read November 25, 2026). The product page also lists auto-discharge and a fixed soft start; the datasheet's text mentions neither, but its block diagram shows a discharge block and soft-start control.

### Worked example: 12 V in, 3.3 V at 150 mA

1. **Dissipation.** (12 − 3.3) × 0.15 is 1.305 W, plus the 15 µA quiescent current times 12 V, which is under 0.2 mW (calculated).
2. **Against the rating.** That is nearly three times the 0.47 W the datasheet gives at 25 °C ambient. With θJA of 210 °C/W the junction would rise about 274 °C, far past the 150 °C thermal shutdown, so the part could not hold 150 mA from 12 V even at 25 °C (calculated).
3. **What works.** At 12 V in and 25 °C ambient the calculated table gives about 55 mA, and at 24 V in about 23 mA. The full 150 mA is practical only at inputs up to about 6.4 V at 25 °C on the datasheet's board ((125 − 25) ÷ 210 ÷ 0.15 = 3.17 V of drop above 3.3 V).

## Layout

The datasheet says to place the input and output capacitors as close to the device as possible, keep all power traces short and wide, and use a 2-layer or 4-layer board for heat. Its layout drawing (Figure 3) puts C1 beside IN and GND (pins 1 and 2) and C2 beside OUT, with ground pours below. It also gives a package outline and a "recommended PCB pad layout (reference only)". Pin 1 is IN. The KiCad symbol is ours, built from the pin table; its pins 3 and 4 are the two no-connects. The footprint, on its own package page, is built from this datasheet's recommended pad layout (page 9), which differs from the pads on the other SOT-23-5 pages on this site: the AP2202's are 0.10 mm wider and its rows 0.20 mm further apart.

## What the datasheet shows

The typical characteristics (quiescent current and output voltage against input voltage, output voltage and dropout against load, start-up and shutdown waveforms at no load and 150 mA, load and line transients, short-circuit protection and PSRR) are plots. No values were read from them.

## Things to watch

- **Power, not current, sets the limit.** At 12 V in the part can supply only about 55 mA at 25 °C on the datasheet's board, and about 23 mA at 24 V. The 210 °C/W figure is for a single-layer board with low thermal conductivity; a better board helps.
- **There is no enable pin.** The electrical table is headed "VIN = VEN = 12 V", and the feature list says "extremely low shutdown current", but the pin table has only IN, GND, OUT and two NC pins, and there is no shutdown-current row. The regulator runs whenever the input is above the UVLO threshold. The phrases look carried over from an enabled sibling datasheet.
- **UVLO against the operating range.** The rising threshold is 2.9 to 4 V and the operating range starts at 4 V, so a slowly rising supply may not start until close to 4 V.
- **C2's voltage rating is inconsistent.** The page 8 drawing says 4.7 µF / 25 V, the BOM on the same page says 4.7 µF / 16 V, and the BOM part number GCJ188C70J475K reads, by our understanding of Murata's numbering, as a 6.3 V X7S part (not checked against Murata's catalogue). Check the part and its DC-bias derating at 3.3 V before copying the BOM.
- **The plots use a 10 µF input capacitor.** The typical characteristics are measured with CIN = 10 µF, while the recommendation and the figure say 1 µF. Silergy's 5 V sibling recommends 10 µF.
- **Output tolerance is ±2% over temperature only.** No separate 25 °C figure is given (the 5 V sibling's page lists ±1% at 25 °C).
- **Hiccup restart.** A short produces repeating 16 ms shutdowns with soft-start restarts, not a steady current limit.
- **Two NC pins.** They are not connected inside, so they can be left open.
- **Preliminary document.** Rev. 1.0 is an initial release and the limits are guaranteed by design or statistical correlation.
- **Related part.** The [SA21345G](site:parts/silergy/sa21345g/) is the 5 V version of the same idea in an 8-pin SO8 with a 108 °C/W thermal resistance, with its own datasheet. The product page also lists an SA21345D in SOT23-5 with a 5 V output; it has no page here.
- **The KiCad files are ours and not yet opened in KiCad.** The symbol and footprint were generated by script and checked against the pin table and the printed dimensions, but nobody has loaded them in KiCad. The footprint is generated from this datasheet's recommended pads (see Layout). The pin types and the symbol layout are our choices.

## Datasheet notes

- **Test-condition header.** "VIN = VEN = 12 V" refers to an enable pin that the package does not have.
- **Ambient or junction.** The recommended operating range gives a −40 to 125 °C ambient temperature, while the electrical table heading gives a junction range of the same −40 to 125 °C, and the absolute maximum table gives a 150 °C junction.
- **Dropout formula.** The text says dropout is the on-resistance of the main PMOS times the load current, and gives no on-resistance value.
- **Figure 1 against page 8.** Figure 1 gives values only (1 µF, 4.7 µF); page 8 adds 50 V and 25 V, and the BOM says 16 V.
- **What was compared.** The electrical table was compared with page 3 as rendered, and the numbers match; the performance plots, the package outline and the tape-and-reel drawings were not read.
