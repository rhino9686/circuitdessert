---
name: LFCSP-40
aliases: ["LFCSP-40 (6 × 6 mm)", CP-40-7]
summary: "Forty-lead leadless frame chip-scale package, 6 × 6 mm body, 0.50 mm pitch, 4.5–4.7 mm exposed pad. Outline from the ADE9078 datasheet; the pads are ours."
pins: 41
pitch_mm: 0.5
dimensions:
- label: Pins
  value: "40 leads, ten on each side, plus the exposed pad"
- label: Pitch
  value: "0.50 mm (basic)"
- label: Body
  value: "5.90–6.10 mm square"
- label: Height
  value: "0.70–0.80 mm"
- label: Lead width
  value: "0.18–0.30 mm"
- label: Lead length
  value: "0.35–0.45 mm"
- label: Exposed pad
  value: "4.50–4.70 mm square, at least 0.20 mm from the leads"
- label: Standoff
  value: "0.02 mm nominal, 0.05 mm maximum"
- label: Coplanarity
  value: "0.08 mm"
- label: Outline
  value: "Analog Devices CP-40-7, JEDEC MO-220-WJJD-5"
- label: Pads in our footprint
  value: "Forty, each 0.80 × 0.30 mm, centres 2.95 mm from the middle, plus a 4.60 mm square pad numbered 41"
footprint: LFCSP-40_6x6mm_P0.5mm_EP4.6x4.6mm.kicad_mod
source:
  part: ADE9078
  revision: "Rev. A"
  page: 106
  datasheet: https://www.analog.com/media/en/technical-documentation/data-sheets/ADE9078.pdf
checked_against: [ADE9078]
opened_in_kicad: false
draft: true
---

## How the footprint was made

The datasheet gives the package outline (Figure 114, outline CP-40-7, page 106) but no recommended land pattern. So the pad sizes are ours, not Analog Devices'. We took the ranges printed on the drawing and followed the usual rule for a leadless package: each pad starts 0.45 mm inside the nominal body edge (the longest lead length on the drawing) and reaches 0.30 mm past the largest body edge (3.05 mm from the middle), which makes it 0.80 mm long. The pads are 0.30 mm wide on the 0.50 mm pitch, which leaves 0.20 mm between neighbours.

The exposed-pad land is 4.60 mm square, the middle of the printed 4.50–4.70 mm range. That leaves 0.25 mm between it and the nearest lead pad, against the 0.20 mm minimum on the drawing. The datasheet asks for a matching pad on the board, soldered to the exposed pad, with GND, AGND, DGND and REFGND joined there.

Everything else is also ours: the pad corner radius (25% of the shorter side on the leads, a small radius on the exposed pad), the 0.30 mm courtyard, the silkscreen corner marks and pin 1 dot, and the fab-layer body outline at the middle of the size range with a 0.5 mm chamfer at pin 1. Solder mask and paste openings are KiCad's defaults. The exposed pad gets one paste opening over the whole pad and no thermal vias.

## Orientation

Pin 1 is at the top left of the top view, matching the datasheet's pin 1 indicator. Pins count counter-clockwise: 1 to 10 down the left side, 11 to 20 along the bottom from left to right, 21 to 30 up the right side and 31 to 40 along the top from right to left. The exposed pad is numbered 41 in the footprint and in the ADE9078 symbol. The datasheet gives it no number.

## Things to watch

- **The pads have not been checked against a land pattern.** There is none in the datasheet. Compare them with your fabricator's rules, or with IPC-7351 for a QFN with 0.50 mm pitch, before ordering boards.
- **Paste over the whole exposed pad is usually too much.** A single full-size opening can float the package. Many assemblers prefer a grid of smaller openings that cover roughly half of the pad. The footprint does not do this for you.
- **No thermal vias.** If you want vias under the exposed pad for heat or for the ground join, add them yourself.
- **One datasheet compared so far.** Other 40-lead 6 × 6 mm packages with 0.50 mm pitch have different exposed-pad sizes and lead lengths. Check each part's own drawing before reusing this footprint.
