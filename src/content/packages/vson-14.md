---
name: VSON-14
aliases: [DSJ, R-PVSON-N14, VSON14]
summary: "Fourteen-contact no-lead package, 0.50 mm pitch, 3.85–4.15 × 2.85–3.15 mm body, with a comb-shaped exposed pad. KiCad footprint from the TPS63020 datasheet's land pattern (TI outline DSJ)."
pins: 14
pitch_mm: 0.5
dimensions:
- label: Contacts
  value: "14, seven on each long side, plus an exposed thermal pad"
- label: Pitch
  value: "0.50 mm (reference)"
- label: Body length (along the contact rows)
  value: "3.85–4.15 mm"
- label: Body width
  value: "2.85–3.15 mm"
- label: Height
  value: "0.80–1.00 mm"
- label: Standoff
  value: "0.00–0.05 mm"
- label: Contact length
  value: "0.30–0.50 mm"
- label: Contact width
  value: "0.18–0.30 mm"
- label: Outer contact centres in one row
  value: "3.00 mm (six pitches, reference)"
- label: Exposed pad on the package
  value: "2.85 ± 0.10 mm centre block, 1.58 ± 0.10 mm across, with 0.20 mm fingers reaching the body edge"
- label: Recommended pads
  value: "14, each 0.24 × 0.60 mm with full round ends (R0.12), rows 2.80 mm apart centre to centre"
- label: Recommended exposed pad
  value: "4.40 mm long, 1.58 mm across; 2.85 mm long centre block and four 0.20 mm fingers at each end"
- label: Stencil example
  value: "0.125 mm thick, about 81% solder coverage on the exposed pad"
- label: Thermal via example
  value: "15 vias of 0.2 mm diameter on a 0.5 mm grid (5 × 3)"
footprint: VSON-14.kicad_mod
source:
  part: TPS63020
  revision: "SLVS916I"
  page: 33
  datasheet: https://www.ti.com/lit/ds/symlink/tps63020.pdf
checked_against: [TPS63020]
opened_in_kicad: false
draft: true
---

## How the footprint was made

The footprint is the land pattern in the TPS63020 datasheet (SLVS916I, page 33, "Example Board Layout" and "Example Via Layout Design"). Fourteen pads of 0.24 × 0.60 mm with fully rounded ends sit on a 0.50 mm pitch in two rows 2.80 mm apart. The exposed pad is not a rectangle. It is a 2.85 mm long centre block, 1.58 mm across, with four 0.20 mm fingers at each end that bring its overall length to 4.40 mm. The fingers are 0.46 mm apart, which leaves 0.26 mm gaps (our subtraction; the drawing prints the 0.20 and the 0.46).

The datasheet's figures are vector drawings, so we measured the pad outlines in the PDF itself rather than by eye. They agree with the printed numbers: 0.50 pitch, 0.24 and 0.60 for the pads, 2.8 between the rows, and 4.4, 2.85 and 1.58 for the exposed pad. In KiCad the exposed pad is a custom-shaped pad (a rectangle anchor with the comb outline as a polygon). We drew the footprint over the datasheet's board layout and the pads and the exposed pad line up with it.

Everything else is ours, not the datasheet's: the 0.25 mm courtyard, the silkscreen along the two long sides with a tick at pin 1, the body outline on the fab layer (drawn at the midpoint of the datasheet's size ranges, 4.00 × 3.00 mm, with a pin 1 chamfer), and the exposed pad's number, 15. The datasheet's three drawings also give an example solder-mask opening (0.07 mm around each pad), a stencil design and a thermal-via grid. They are examples for the board maker to adjust, so the footprint leaves mask and paste at KiCad's defaults and has no vias.

## Orientation

The footprint uses KiCad's usual orientation for a two-row package: pin 1 at top left, pins 1 to 7 down the left side and pins 8 to 14 up the right side, which is how the pinout figure in the TPS63020 datasheet looks. The datasheet's drawings are turned from this. The thermal-pad drawing is labelled Bottom View and the outline drawing shows the contacts the same way, with pin 1 at top left and pins 1 to 7 along the top. The land-pattern drawing is a view of the board with pin 1 at bottom left and pins 1 to 7 along the bottom. The footprint is the land pattern turned 90° clockwise.

## Things to watch

- **This is TI's DSJ outline, not every VSON-14.** The page matches parts by the name "VSON-14", but other makers' 14-pad VSON and SON packages have other pad sizes and exposed pads. Only the TPS63020 (and the TPS63021, which shares its datasheet) has been compared with this drawing.
- **The exposed pad carries a power connection.** On the TPS63020 the power ground, PGND, has no pin of its own: the exposed pad is it. The part page numbers it 15 in the symbol, and the pad must be soldered and tied to the power-ground copper.
- **The exposed pad sticks out past the body.** The land pattern is 4.40 mm long and the body 3.85 to 4.15 mm, so the fingers extend about 0.2 mm beyond each end of the fab outline. The courtyard covers them.
- **One paste opening for the whole exposed pad.** KiCad's default prints the full pad. The datasheet's stencil example covers about 81% of the pad with a pattern of openings, so check the paste layer with your assembly house.
- **No thermal vias in the file.** The datasheet shows a grid of fifteen 0.2 mm vias as an example, and says the layout may vary with constraints. Add them to suit your board.
- **Not yet opened in KiCad.** The file was generated by script and checked against the datasheet numbers by an independent parse and an overlay on the drawing, but it has not been loaded in KiCad.
