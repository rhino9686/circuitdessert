---
name: SOT-89
aliases: [SOT89, SOT-89-3]
summary: "Three-lead power package with a metal tab joined to the centre lead, 1.5 mm lead pitch, 4.4–4.6 × 2.3–2.6 mm body. KiCad footprint from the AP2202 datasheet's suggested pad layout."
pins: 3
pitch_mm: 1.5
dimensions:
- label: Pins
  value: "3, in a row on one long side; the centre lead (pin 2) is joined to the metal tab"
- label: Pitch
  value: "1.50 mm"
- label: Body length (along the leads)
  value: "4.40–4.60 mm"
- label: Body width (across the leads)
  value: "2.30–2.60 mm"
- label: Overall, tab end to lead tips
  value: "3.95–4.25 mm"
- label: Lead length beyond the body
  value: "0.90–1.20 mm"
- label: Lead width
  value: "0.32–0.54 mm (outer leads), 0.48–0.62 mm (centre lead)"
- label: Height
  value: "1.40–1.60 mm"
- label: Lead thickness
  value: "0.35–0.45 mm"
- label: Suggested pads
  value: "Two outer pads, each 0.55 × 1.30 mm at 1.50 mm from the centre line, and one T-shaped pad for the tab and centre lead, 1.85 mm wide, 4.60 mm overall"
footprint: SOT-89.kicad_mod
source:
  part: AP2202
  revision: "DS38214 Rev. 6-2"
  page: 25
  datasheet: https://www.diodes.com/assets/Datasheets/AP2202.pdf
checked_against: [AP2202]
opened_in_kicad: false
draft: true
---

## Where this drawing comes from

The numbers on this page are from the Diodes AP2202 datasheet (DS38214 Rev. 6-2): the outline on page 23 and the "Suggested Pad Layout" on page 25. This is Diodes' SOT-89 drawing, not every package called SOT-89.

## How the footprint was made

The pads are the datasheet's suggested pad layout, which has three pads:

- Two outer pads, each X = 0.55 mm wide and Y = 1.30 mm long, centred E = 1.50 mm either side of the centre line, with their outer ends on the lead end of the pattern.
- One T-shaped pad for the tab and the centre lead. Its band is X1 = 1.85 mm wide and runs from the tab end for Z − Y1 = 3.125 mm. Its stem is X2 = 0.80 mm wide and runs on for Y1 = 1.475 mm to the lead end of the pattern, Z = 4.60 mm overall.

The tab and the centre lead are the same metal, so the datasheet draws them as one pad and the footprint has one pad for both, numbered 2. There is no separate pad for the centre lead. We read the numbers from the printed dimension table and checked them by measuring the pad outlines on the rendered page, which agree with the printed values to within about 2%. We did not measure the PDF's vector paths.

Everything else is ours, not the datasheet's: the pad corner radius (25% of the shorter side) on the outer pads, the 0.25 mm courtyard, the pin 1 marker beside pad 1, and the body outline on the fab layer, drawn at the midpoint of the datasheet's size ranges and placed on the tab end of the land pattern. The datasheet says nothing about solder mask or paste openings, so the footprint leaves them at KiCad's defaults. The tab pad is a custom-shaped pad with no thermal vias.

## Orientation

The footprint follows the datasheet's pad layout as drawn: the tab at the top and the three leads at the bottom, pin 1 at the left, pin 2 in the middle and pin 3 at the right. That matches the pinout drawings in the AP2202 datasheet (top view, pins 1, 2, 3 left to right, tab at pin 2).

## Things to watch

- **One datasheet.** The footprint comes from the AP2202 drawing only. Other parts listed below say SOT-89, but their own drawings have not been compared with this one.
- **The tab is pin 2.** On the AP2202 the tab is ground, and the metal under the body is the same net as pin 2, so the tab pad is a heat path as well as a connection. The datasheet gives no thermal vias or copper area for it.
- **Two tab drawings.** The datasheet draws the tab two ways, "Option 1" (a tab with cut corners, 1.55 mm at its base) and "Option 2" (a plain tab 1.62–1.83 mm wide). The suggested pad layout is the same for both. The package drawing on this page uses the Option 1 width.
- **The pad layout carries no tolerance.** The datasheet gives ranges for the body and leads but single values for the pads.
