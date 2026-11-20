---
name: SON-8
aliases: [DRB, DRB0008A, VSON-8]
summary: "Eight-contact no-lead package, 0.65 mm pitch, 2.9–3.1 mm square body, with a comb-shaped exposed pad. KiCad footprint from the TPS7A8101-Q1 datasheet's land pattern (TI outline DRB0008A)."
pins: 8
pitch_mm: 0.65
dimensions:
- label: Contacts
  value: "8, four on each of two sides, plus an exposed thermal pad"
- label: Pitch
  value: "0.65 mm"
- label: Body
  value: "2.9–3.1 mm × 2.9–3.1 mm"
- label: Height
  value: "1.0 mm maximum (the drawing is titled VSON, 1 mm max height)"
- label: Standoff
  value: "0.00–0.05 mm"
- label: Contact length
  value: "0.3–0.5 mm"
- label: Contact width
  value: "0.25–0.37 mm"
- label: Outer contact centres in one row
  value: "1.95 mm (three pitches)"
- label: Exposed pad on the package
  value: "1.5 ± 0.1 mm across, 1.75 ± 0.1 mm centre block, with four 0.23 mm fingers reaching the body edge"
- label: Recommended pads
  value: "8, each 0.31 × 0.6 mm with R0.05 corners, rows 2.8 mm apart centre to centre"
- label: Recommended exposed pad
  value: "1.5 mm across, 3.4 mm long: a 1.75 mm centre block and four 0.23 mm fingers (two at each end, 0.65 mm apart centre to centre)"
- label: Stencil example
  value: "0.125 mm thick, 84% solder coverage on the exposed pad"
- label: Via example
  value: "four 0.2 mm vias, optional"
footprint: SON-8.kicad_mod
source:
  part: TPS7A8101-Q1
  revision: "SLVSCK0A"
  page: 28
  datasheet: https://www.ti.com/lit/ds/symlink/tps7a8101-q1.pdf
checked_against: [TPS7A8101-Q1]
opened_in_kicad: false
draft: true
---

## How the footprint was made

The footprint is the land pattern in the TPS7A8101-Q1 datasheet (SLVSCK0A, PDF page 28, "Example Board Layout"). Eight pads of 0.31 × 0.60 mm with R0.05 corners sit on a 0.65 mm pitch in two rows 2.80 mm apart. The exposed pad is not a rectangle. It is a 1.5 mm wide and 1.75 mm long centre block with two 0.23 mm fingers at each end, which bring its length to 3.40 mm. The fingers are 0.65 mm apart centre to centre, which leaves 0.42 mm between them (our subtraction; the drawing prints the 0.23 and the 0.65), and each reaches 0.825 mm past the block.

The datasheet's figures are vector drawings, so we measured the pad outlines in the PDF itself rather than by eye. They agree with the printed numbers: 0.65 pitch, 0.31 and 0.60 for the pads, 2.8 between the rows, and 1.5, 1.75 and 0.23 for the exposed pad, with the whole pattern centred. In KiCad the exposed pad is a custom-shaped pad (a rectangle anchor with the comb outline as a polygon). The R0.05 corners of the pads are in the footprint, but the corners of the exposed pad are square, where the drawing rounds them (our simplification).

Everything else is ours, not the datasheet's: the 0.25 mm courtyard, the silkscreen along the two sides with a tick at pin 1, the body outline on the fab layer (drawn at the midpoint of the datasheet's size ranges, 3.00 × 3.00 mm, with a pin 1 chamfer), and the exposed pad's number, 9. The datasheet's drawings also give an example solder-mask opening (the preferred layout has the mask opening up to 0.07 mm larger than the metal; the alternative covers the metal by at least 0.07 mm), a stencil design and four optional 0.2 mm vias. They are examples for the board maker to adjust, so the footprint leaves mask and paste at KiCad's defaults and has no vias.

## Orientation

The footprint uses KiCad's usual orientation for a two-row package: pin 1 at top left, pins 1 to 4 down the left side and pins 5 to 8 up the right side. This is the datasheet's land-pattern drawing exactly as it is drawn, and it is also the pinout figure (top view). The outline drawing is a bottom view turned 180°, with pin 1 at bottom left and pins 1 to 4 running up the left side.

## Things to watch

- **This is TI's DRB0008A outline, not every SON-8.** The page matches parts by the name "SON-8", but other makers' eight-pad SON and DFN packages have other pad sizes and exposed pads. Only the TPS7A8101-Q1 has been compared with this drawing.
- **The exposed pad is for heat.** The datasheet says to connect it to GND, and its package outline says it must be soldered to the board for thermal and mechanical performance. On the part page it is numbered 9 in the symbol, which is our number.
- **The exposed pad sticks out past the body.** The land pattern is 3.40 mm long and the body is 2.9 to 3.1 mm, so the fingers extend about 0.2 mm beyond each end of the fab outline. The courtyard covers them.
- **One paste opening for the whole exposed pad.** KiCad's default prints the full pad. The datasheet's stencil example covers about 84% of the pad with a pattern of openings, so check the paste layer with your assembly house.
- **No thermal vias in the file.** The datasheet shows four 0.2 mm vias as optional and says vias under paste should be filled, plugged or tented. Add them to suit your board.
- **A reference dimension we did not use.** The outline has a small table labelled DIM A, with 0.1 mm for option 1 and 0.2 mm for option 2, next to a side view of the contacts. The values are in parentheses, which the drawing says are for reference only.
- **Not yet opened in KiCad.** The file was generated by script and checked against the datasheet's drawing by an independent parse and by comparing the pad positions with the PDF's vector paths, but it has not been loaded in KiCad.
