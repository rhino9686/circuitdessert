---
manufacturer: Texas Instruments
family: TPS7A7200-EP
part: TPS7A7200-EP
category: ldo
summary: "Enhanced-product 2 A LDO: 1.425–6.5 V in, 0.9–5.0 V out (pin-set in 50 mV steps or resistor-set), 180 mV dropout, 40.65 µVRMS noise, soft-start and power good. 5 × 5 mm VQFN-20."
abstract: "A 2 A low-dropout regulator in the enhanced-product (-EP) flow, for inputs from 1.425 V to 6.5 V. The output is either set to any of 53 values from 0.9 to 3.5 V in 50 mV steps by grounding six setting pins (50mV, 100mV, 200mV, 400mV, 800mV, 1.6V), or set from 0.9 to 5.0 V with a conventional resistor divider. Dropout is 180 mV maximum at 2 A for outputs up to 3.3 V. It has an adjustable soft start (SS pin), a power-good output, an enable input, current limiting at 2.4 to 3.1 A and thermal shutdown at 160 °C. Output noise is 40.65 µVRMS from 100 Hz to 100 kHz. It needs a 4.7 to 47 µF ceramic output capacitor. The package is a 5 × 5 mm 20-pin VQFN (RGW). The TPS7A7100 (1 A) and TPS7A7300 (3 A) are the same family."
status: active
packages:
- VQFN-20 (RGW, 5 × 5 mm)
specs:
  vin_min_v: 1.425
  vin_max_v: 6.5
  vout_min_v: 0.9
  vout_max_v: 5
  iout_max_a: 2
  iq_ua: 2600
  topology: Low-dropout regulator (LDO), pin-programmable or resistor-adjustable output, with soft start, enable and power good
  extra:
  - label: Output setting
    value: Pin-set 0.9–3.5 V in 50 mV steps (six setting pins, starting from 0.5 V), or adjustable 0.9–5.0 V with external resistors
  - label: Dropout voltage
    value: 180 mV maximum at 2 A for VOUT up to 3.3 V; 470 mV for VOUT above 3.3 V; not defined below 1.2 V
  - label: Accuracy
    value: ±2% adjustable, ±3% fixed (the datasheet also states 1.5% and "better than 2%")
  - label: Ground current (iq_ua)
    value: 2.6 mA at full load; 4 mA maximum at minimum load; 0.1 µA typical (5 µA maximum) in shutdown
  - label: Output noise
    value: 40.65 µVRMS (100 Hz to 100 kHz; VIN 1.5 V, VOUT 1.2 V, 2 A)
  - label: Current limit
    value: 2.4–3.1 A
features:
- Enhanced product (-EP) variant
- 1.425 to 6.5 V input range
- 2 A output
- 180 mV maximum dropout at 2 A (VOUT up to 3.3 V)
- 53 output voltages from 0.9 to 3.5 V by grounding setting pins, or adjustable to 5.0 V
- Adjustable soft start
- Power-good output and enable input
- "Low noise: 40.65 µVRMS"
- Stable with 4.7 to 47 µF ceramic output capacitors
- 5 × 5 mm 20-pin VQFN
spec_groups:
- title: Input and enable
  items:
  - label: Input voltage range
    value: 1.425–6.5 V (the text says 1.5 V as the lower limit)
  - label: Ground current, full load
    value: 2.6 mA
  - label: Ground current, minimum load
    value: 4 mA maximum
  - label: Shutdown current
    value: 0.1 µA typical, 5 µA maximum
  - label: EN high
    value: 1.1–6.5 V
  - label: EN low
    value: 0–0.5 V
  - label: Soft-start charging current (SS)
    value: 5.1 µA (3.5–7.2 µA)
- title: Output and regulation
  items:
  - label: Output voltage range
    value: 0.9–5.0 V adjustable; 0.9–3.5 V pin-set
  - label: Dropout, VOUT up to 3.3 V
    value: 180 mV maximum at 2 A
  - label: Dropout, VOUT above 3.3 V
    value: 470 mV maximum at 2 A
  - label: Line regulation
    value: 0.01 %/V
  - label: Load regulation
    value: 0.1 %/A
  - label: Current limit
    value: 2.4–3.1 A
  - label: Output noise
    value: 40.65 µVRMS (100 Hz to 100 kHz)
  - label: Output capacitor
    value: 4.7–47 µF ceramic, ESR below 1 Ω
- title: Power good and protection
  items:
  - label: PG threshold
    value: 90% of VOUT (85–96%), 2% hysteresis
  - label: PG output low
    value: 0.4 V at 1 mA
  - label: PG leakage
    value: 1 µA; about 200 Ω on-resistance
  - label: Thermal shutdown
    value: 160 °C, resets at 140 °C
  - label: ESD
    value: HBM 2 kV, CDM 500 V
- title: Thermal and package
  items:
  - label: Junction to ambient (θJA)
    value: 35.7 °C/W
  - label: Junction to case, top (θJCtop)
    value: 33.6 °C/W
  - label: Junction to board (θJB)
    value: 15.2 °C/W
  - label: Junction to case, bottom (θJCbot)
    value: 3.8 °C/W
  - label: Junction temperature range
    value: −40 to 125 °C
  - label: Orderable part numbers
    value: TPS7A7200QRGWREP and V62/13612-01XE; VQFN RGW-20, 3000 per reel, active, production
design_tables:
- title: Setting-pin combinations for common outputs (selected rows of datasheet Table 1)
  note: "The pins listed are tied to ground; the others stay open. The target is 0.5 V plus the sum of the grounded pins' weights (50 mV, 100 mV, 200 mV, 400 mV, 800 mV, 1.6 V). The datasheet table lists all 53 settings from 0.90 to 3.50 V."
  columns: [VOUT, Pins tied to GND]
  rows:
  - ["0.90 V", "400mV"]
  - ["1.00 V", "100mV, 400mV"]
  - ["1.20 V", "100mV, 200mV, 400mV"]
  - ["1.50 V", "200mV, 800mV"]
  - ["1.80 V", "100mV, 400mV, 800mV"]
  - ["2.50 V", "400mV, 1.6V"]
  - ["3.30 V", "400mV, 800mV, 1.6V"]
  - ["3.50 V", "200mV, 400mV, 800mV, 1.6V"]
- title: Feedback resistors for adjustable output (datasheet Table 2, E96 series)
  note: "R1 runs from OUT to FB and R2 from FB to ground; the datasheet says to keep R2 between 27 kΩ and 33 kΩ to maintain the specified accuracy."
  columns: [VOUT, R1, R2]
  rows:
  - ["1.00 V", "30.1 kΩ", "30.1 kΩ"]
  - ["1.20 V", "39.2 kΩ", "28.0 kΩ"]
  - ["1.50 V", "61.9 kΩ", "30.9 kΩ"]
  - ["1.80 V", "80.6 kΩ", "30.9 kΩ"]
  - ["1.90 V", "86.6 kΩ", "30.9 kΩ"]
  - ["2.50 V", "115 kΩ", "28.7 kΩ"]
  - ["3.00 V", "147 kΩ", "29.4 kΩ"]
  - ["3.30 V", "165 kΩ", "29.4 kΩ"]
  - ["5.00 V", "280 kΩ", "30.9 kΩ"]
datasheet: https://www.ti.com/lit/ds/symlink/tps7a7200-ep.pdf
datasheet_revision: "SBVS224A (June 2013), with a packaging addendum"
verified: false
draft: true
tags:
- tps7a7200-ep
- tps7a7200
- enhanced-product
- pin-programmable
- soft-start
- power-good
---

## How it works

The TPS7A7200-EP is a 2 A LDO for low-voltage rails, with an input as low as 1.425 V and an output as low as 0.9 V. The -EP part is TI's enhanced-product version of the TPS7A7200; the datasheet supplied is for that variant.

**Setting the output.** Six pins (50mV, 100mV, 200mV, 400mV, 800mV and 1.6V) each add their weight to a 0.5 V base when grounded, giving 0.9 to 3.5 V in 50 mV steps without external resistors. The datasheet says settings not in its Table 1 are not covered by the electrical specifications. For anything else, including up to 5.0 V, the part is used as a conventional adjustable regulator with R1 and R2 from OUT to FB and to ground; R2 stays between 27 and 33 kΩ.

**Sense and feedback.** SNS is the sense input that goes with OUT. A 220 pF capacitor from FB to OUT is highly recommended in the adjustable configuration.

**Soft start.** A capacitor on SS sets the start-up ramp, charged by a 5.1 µA current through an internal 50 kΩ, with a 700 µs delay. Leaving SS open uses the default start-up.

**Enable and power good.** EN above 1.1 V turns the regulator on. PG is an open-drain output that goes low when the output falls below about 90% of its target, with 2% hysteresis. A pull-up above 10 kΩ works; for fixed settings below 1.8 V the datasheet advises pulling PG up to IN.

**Capacitors.** The output capacitor is 4.7 to 47 µF ceramic with ESR under 1 Ω (tested with a 10 µF X5R). For the input the datasheet says to use up to 1 µF with a good layout, because a larger capacitor with wire inductance can resonate (a 5 nH inductance and 10 µF resonates at 712 kHz).

**Protection.** Current limit at 2.4 to 3.1 A and thermal shutdown at 160 °C, resetting at 140 °C.

### Pins

| Pin | Name | Function |
| --- | --- | --- |
| 1, 19, 20 | OUT | Regulator output |
| 2 | SNS | Output sense |
| 3 | FB | Feedback input for the adjustable configuration |
| 4 | PG | Open-drain power good |
| 5, 6, 7, 9, 10, 11 | 50mV, 100mV, 200mV, 400mV, 800mV, 1.6V | Output-voltage setting pins; ground to add that amount |
| 8, 18 | GND | Ground |
| 12 | NC | Not connected |
| 13 | SS | Soft-start capacitor |
| 14 | EN | Enable |
| 15, 16, 17 | IN | Supply input |
| Pad | | Thermal pad; connect to a large ground plane |

## Example application

The datasheet's front-page circuit takes 1.5 V in and makes 1.2 V, with the 100mV, 200mV and 400mV pins grounded. It gives no values for the capacitors.

### Reference circuit

![1.5 V to 1.2 V circuit redrawn from the front page of the TPS7A7200-EP datasheet. The 100mV, 200mV and 400mV setting pins are grounded; the capacitors have no values in the datasheet. The thermal pad is not drawn.](schematic:tps7a7200-ep-schematic.svg)

| Ref | Part | Description | Maker |
| --- | --- | --- | --- |
| U1 | TPS7A7200QRGWREP | 2 A LDO, enhanced product, VQFN-20 | Texas Instruments |
| CIN | Not given | Input capacitor, up to 1 µF per the text | |
| CSS | Not given | Soft-start capacitor, optional | |
| COUT | Not given | 4.7–47 µF ceramic from the text; 10 µF X5R was evaluated | |

> **About the source.** Built from SBVS224A (June 2013). The addendum lists both ordering numbers as active in production. The page is for the -EP variant that was supplied; the standard TPS7A7200 has its own datasheet.

### Worked example: 1.5 V to 1.2 V at 2 A

1. **Setting.** 0.5 V + 0.1 V + 0.2 V + 0.4 V = 1.2 V, so the 100mV, 200mV and 400mV pins go to ground.
2. **Headroom.** 1.5 V − 1.2 V = 0.3 V, above the 180 mV maximum dropout for outputs up to 3.3 V.
3. **Heat.** PD = (1.5 − 1.2) × 2 A = 0.6 W, and with θJA 35.7 °C/W the die runs about 21 °C above ambient (calculated). The datasheet's θJA is for its test board, so a different layout changes this.

## Layout

Connect the thermal pad and the GND pins to a large-area ground plane, and attach a floating thermal plane to the pad if one is available. Keep the input wiring short so that a small input capacitor works. This site has no KiCad symbol or footprint for this part yet. Pin 1 is OUT.

## What the datasheet shows

Figures 31 to 33 show how the soft-start capacitor sets the start-up time. No values were read from the plots. Figures 34 to 39 show how to program 0.9, 1.2, 1.8, 2.5, 3.3 and 3.5 V.

## Things to watch

- **Settings outside Table 1** aren't covered by the electrical specifications.
- **Dropout is not defined below 1.2 V** output.
- **A large input capacitor can hurt.** It can resonate with the supply wiring inside the loop bandwidth.
- **PG with low fixed settings.** Below 1.8 V, pull PG up to IN as the datasheet advises.
- **FB capacitor.** The adjustable circuit wants 220 pF from FB to OUT.
- **Variant.** This is the -EP part; confirm the ordering number against the addendum.

## Datasheet notes

- **Accuracy.** The datasheet states 1.5% in the features, "better than 2%" in the description, ±2% (adjustable) and ±3% (fixed) in the electrical table.
- **Input range.** The electrical table starts at 1.425 V; the text says 1.5 V.
- **Siblings.** The TPS7A7100 (1 A) and TPS7A7300 (3 A) are in the same family and are not on this site.
- **What was compared.** The front-page circuit was compared with a rendered image; everything else came from the text layer, so the page stays unverified.
