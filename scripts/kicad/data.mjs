// Source data for the KiCad files and the package illustrations. Run `npm run kicad` after changing it.
// Every number here is read from the datasheet named in `source`, or marked "ours".

export const LIB = 'circuitdessert'; // KiCad library nickname used in symbol Footprint fields

// Two-row gull-wing packages with 3 pins per side (SOT23-6 family). KiCad orientation: pin 1 top left,
// pins 1-3 down the left side, 4-6 up the right side. x is across the body, y along it.
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
};
