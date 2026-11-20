---
name: SO8E
aliases: []
summary: "Eight-lead small-outline package with an exposed pad, 1.27 mm pitch, 4.8–5.0 × 3.8–4.0 mm body. KiCad footprint from the pin-compatible DRV8870's DDA0008B drawing."
pins: 8
pitch_mm: 1.27
dimensions:
- label: Pins
  value: "8, four on each long side, plus an exposed pad (pad 9)"
- label: Pitch
  value: "1.27 mm"
- label: Body length (along the pins)
  value: "4.80–5.00 mm"
- label: Body width (across the pins)
  value: "3.80–4.00 mm"
- label: Lead tip to lead tip
  value: "5.80–6.20 mm"
- label: Lead width
  value: "0.31–0.51 mm"
- label: Foot length
  value: "0.40–1.27 mm"
- label: Height
  value: "1.70 mm maximum"
- label: Standoff
  value: "0.00–0.15 mm"
- label: Foot angle
  value: "0–8°"
- label: Exposed pad on the package
  value: "2.11–2.71 mm across × 2.80–3.40 mm along"
- label: Recommended pads
  value: "Eight, each 1.55 × 0.60 mm, rows 5.40 mm apart centre to centre"
- label: Recommended exposed pad
  value: "2.71 × 3.40 mm (solder mask opening and 100% paste aperture for a 0.125 mm stencil)"
footprint: SO8E.kicad_mod
source:
  part: DRV8870
  revision: "Rev. B"
  page: 26
  datasheet: https://www.ti.com/lit/ds/symlink/drv8870.pdf
checked_against: []
assumed_for: [SY67134]
opened_in_kicad: false
draft: true
---

## Where this drawing comes from

The numbers on this page are from the package drawing of the Texas Instruments DRV8870, which TI calls DDA0008B, "PowerPAD SOIC, 1.7 mm max height" (outline on page 25 of the Rev. B datasheet PDF, example board layout and stencil on pages 26 and 27, JEDEC MS-012). We used it because the Silergy SY67134 is pin-compatible with the DRV8870: the two pin tables agree pin for pin (1 GND, 2 IN2, 3 IN1, 4 VREF, 5 VM, 6 OUT1, 7 ISEN, 8 OUT2, with the exposed pad connected to ground), and both parts are eight-lead packages with an exposed pad.

That is an assumption about the package, not a check of it. Pin-compatible parts often share a footprint, but the SY67134 is not listed here as compared: the SO8E drawing in its own datasheet could not be read from the text copy we had, so it is marked "Assumed".

## How the footprint was made

The pads are the DDA0008B "Example Board Layout": eight pads, each 1.55 mm long across the body and 0.60 mm wide, on a 1.27 mm pitch, with the two rows 5.40 mm apart centre to centre, and an exposed pad (pad 9) of 2.71 × 3.40 mm in the middle. We read the numbers from the drawing and checked them by measuring the pad outlines in a 200 dpi render of the page. The pad length, width, pitch and row spacing agreed with the printed values to within 1%, and the exposed pad to within the thickness of the drawn line.

Everything else is ours, not the datasheet's: the corner radius of pads 1 to 8 (25% of the shorter side; the drawing shows R0.05 on its pad corners, which we use only for pad 9), the 0.25 mm courtyard, the silkscreen over the two body ends with its extension on the pin 1 side, and the body outline on the fab layer at the midpoint of the size ranges. Solder mask and paste are left at KiCad's defaults, which for pad 9 means the paste covers the whole pad.

## Orientation

The footprint uses KiCad's usual orientation: pin 1 at top left, pins 1 to 4 down the left side and 5 to 8 up the right side. The datasheet's drawings are in the same orientation. The exposed pad is pad 9, the number the drawing gives it.

## Things to watch

- **The SY67134's own drawing has not been compared.** Silergy's SO8E outline and recommended pads could differ from TI's, especially the exposed pad. Check them before ordering boards.
- **The other parts listed below are not compared either.** They name the same package, but their drawings have not been compared with this page.
- **The exposed pad is at the large end of the range.** The package's own pad is printed as 2.11–2.71 × 2.80–3.40 mm, and the footprint pad is 2.71 × 3.40 mm, the drawing's recommended size.
- **The footprint has no thermal vias.** The drawing shows optional 0.2 mm vias on a 1.3 mm grid under the pad and recommends filled, plugged or tented vias under the paste. Add them for your board if you need them.
- **Other stencil thicknesses.** The 2.71 × 3.40 mm paste aperture is for a 0.125 mm stencil. TI's table gives 3.03 × 3.80 mm for 0.100 mm, 2.47 × 3.10 mm for 0.150 mm and 2.29 × 2.87 mm for 0.175 mm.
- **Copper beyond the pad is up to you.** The drawing shows 2.95 × 4.90 mm of metal under a smaller mask opening and notes that the size may vary with creepage requirements. The footprint has only the 2.71 × 3.40 mm pad.
