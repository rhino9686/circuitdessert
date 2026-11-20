// Source data for the KiCad files and the package illustrations. Run `npm run kicad` after changing it.
// Every number here is read from the datasheet named in `source`, or marked "ours".

export const LIB = 'circuitdessert'; // KiCad library nickname used in symbol Footprint fields

// Two-row gull-wing packages with `pinsPerSide` pins per side (3 by default: the SOT23-6 family) and an optional exposed pad.
// KiCad orientation: pin 1 top left, pins 1..n down the left side, n+1..2n up the right side. x is across the body, y along it.
// `illustration` (optional) sets the drawing's scale in px per mm, panel centre y, right panel centre x and width.
export const PACKAGES = {
  'sot23-6': {
    name: 'SOT23-6',
    file: 'SOT23-6',
    descr: 'SOT23-6, 0.95 mm pitch, pad layout from the SY26533 datasheet (Rev 1.0, page 13)',
    tags: 'SOT23-6 SOT-23-6',
    source: { part: 'SY26533', revision: 'Rev 1.0', page: 13 },
    pitch: 0.95,
    // Recommended pad layout, datasheet page 13. Rows are 2.40 apart centre to centre; each pad is 1.00 long (across the body) by 0.60 wide.
    rowCentres: 2.4,
    pad: { long: 1.0, wide: 0.6 },
    // Package outline, datasheet page 13. Ranges as printed; `nom` is the midpoint, used for drawing only (ours).
    body: { length: { min: 2.82, max: 3.02 }, width: { min: 1.5, max: 1.7 }, height: { max: 1.3 } },
    leadSpan: { min: 2.7, max: 2.9 },
    leadWidth: { min: 0.3, max: 0.5 },
    footLength: { min: 0.35, max: 0.55 },
    // Our additions, not from the datasheet: courtyard margin, silkscreen and fab-layer conventions.
    courtyardMargin: 0.25,
  },
  // The drawing is TI's DDA0008B for the DRV8870, not the SY67134's own datasheet drawing: see the package page.
  'so8e': {
    name: 'SO8E',
    file: 'SO8E',
    descr: 'SO8E, 8 pins and exposed pad, 1.27 mm pitch, pad layout from the DRV8870 datasheet (TI DDA0008B, Rev. B, PDF page 26)',
    tags: 'SO8E SOIC-8 exposed pad',
    source: { part: 'DRV8870', revision: 'Rev. B', page: 26 },
    pinsPerSide: 4,
    pitch: 1.27,
    // Example board layout, PDF page 26: rows 5.4 apart centre to centre, eight pads 1.55 long (across the body) by 0.6 wide.
    rowCentres: 5.4,
    pad: { long: 1.55, wide: 0.6 },
    // Exposed pad (pad 9): the 2.71 x 3.40 solder mask opening, which is also the 0.125 mm stencil's paste aperture. Corner radius 0.05 as drawn.
    thermalPad: { num: '9', across: 2.71, along: 3.4, radius: 0.05 },
    // Package outline, PDF page 25. Ranges as printed; `nom` is the midpoint, used for drawing only (ours).
    body: { length: { min: 4.8, max: 5.0 }, width: { min: 3.8, max: 4.0 }, height: { max: 1.7 } },
    leadSpan: { min: 5.8, max: 6.2 },
    leadWidth: { min: 0.31, max: 0.51 },
    footLength: { min: 0.4, max: 1.27 },
    courtyardMargin: 0.25,
    illustration: { scale: 40, cy: 150, bx: 470, width: 660 },
  },
};

// Symbols: one per part. Pin numbers and names from the datasheet pin table. `type` is our reading.
export const SYMBOLS = {
  SY26533: {
    package: 'sot23-6',
    description: '1 MHz current-mode boost converter, 3-30 V input, up to 33 V output, 400 mOhm switch, SOT23-6',
    keywords: 'boost converter dc-dc 1MHz',
    datasheet: 'https://www.silergy.com/download/downloadFile?id=4925&type=product&ftype=note',
    // side: left | right | top | bottom; pos: where the pin sits along that side, in mm on the 2.54 grid (our layout choice).
    pins: [
      { number: '1', name: 'PGND', type: 'power_in', side: 'bottom', pos: -2.54 },
      { number: '2', name: 'GND', type: 'power_in', side: 'bottom', pos: 2.54 },
      { number: '3', name: 'FB', type: 'input', side: 'left', pos: -2.54 },
      { number: '4', name: 'EN', type: 'input', side: 'left', pos: 2.54 },
      { number: '5', name: 'IN', type: 'power_in', side: 'top', pos: 0 },
      { number: '6', name: 'LX', type: 'passive', side: 'right', pos: 0 },
    ],
  },
  // Pin numbers and names are from the pin table (Rev 0.9), and match the DRV8870's. The exposed pad is listed there as "Thermal Pad"
  // with no number; 9 is ours (the same number as the footprint's exposed pad). Pin types and layout are ours.
  SY67134: {
    package: 'so8e',
    description: 'H-bridge motor driver for one brushed DC motor, 5-32 V, 3.6 A, PWM inputs, current chopping, SO8E',
    keywords: 'motor driver h-bridge brushed dc',
    datasheet: 'https://www.silergy.com/productsview/SY21634FCC',
    pins: [
      { number: '5', name: 'VM', type: 'power_in', side: 'top', pos: 0 },
      { number: '1', name: 'GND', type: 'power_in', side: 'bottom', pos: -2.54 },
      { number: '9', name: 'EP', type: 'passive', side: 'bottom', pos: 2.54 },
      { number: '3', name: 'IN1', type: 'input', side: 'left', pos: 2.54 },
      { number: '2', name: 'IN2', type: 'input', side: 'left', pos: 0 },
      { number: '4', name: 'VREF', type: 'input', side: 'left', pos: -2.54 },
      { number: '6', name: 'OUT1', type: 'passive', side: 'right', pos: 2.54 },
      { number: '8', name: 'OUT2', type: 'passive', side: 'right', pos: 0 },
      { number: '7', name: 'ISEN', type: 'passive', side: 'right', pos: -2.54 },
    ],
  },
};
