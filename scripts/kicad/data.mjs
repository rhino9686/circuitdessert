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
  // Two-row no-lead package with an exposed pad (TI DSJ, R-PVSON-N14). Pin 1 top left, pins 1-7 down the left side, 8-14 up the right
  // side (the datasheet's land pattern turned 90 degrees). x is across the body, y along it.
  'vson-14': {
    kind: 'dual-nolead',
    name: 'VSON-14',
    file: 'VSON-14',
    descr: 'VSON-14 (TI DSJ, R-PVSON-N14), 0.5 mm pitch, 4 x 3 mm body, comb-shaped exposed pad; land pattern from the TPS63020 datasheet (SLVS916I, page 33)',
    tags: 'VSON-14 DSJ R-PVSON-N14 SON-14',
    source: { part: 'TPS63020', revision: 'SLVS916I', page: 33 },
    pitch: 0.5,
    pinsPerSide: 7,
    // Example board layout, page 33: the two rows of pads are 2.8 apart centre to centre. Each pad is 0.24 wide by 0.60 long with full round ends (R0.12).
    rowCentres: 2.8,
    pad: { long: 0.6, wide: 0.24 },
    // Package outline, page 31. Ranges as printed; the midpoint is used for drawing only (ours). Length runs along the pad rows.
    body: { length: { min: 3.85, max: 4.15 }, width: { min: 2.85, max: 3.15 }, height: { min: 0.8, max: 1.0 } },
    leadWidth: { min: 0.18, max: 0.3 },
    leadLength: { min: 0.3, max: 0.5 },
    // Exposed thermal pad, from the via-layout figure on page 33 (the land pattern): 4.4 long by 1.58 across, a 2.85 long centre block with
    // four fingers (0.20 wide, 0.26 gaps) at each end. Package pad on page 32: 2.85 +/- 0.10 by 1.58 +/- 0.10 with the same fingers out to the body edge.
    thermal: { num: '15', along: 4.4, across: 1.58, centre: 2.85, finger: 0.2, gap: 0.26, fingers: 4 },
    // Our additions, not from the datasheet: courtyard margin, silkscreen and fab-layer conventions.
    courtyardMargin: 0.25,
  },
  // Two-row no-lead package with an exposed pad (TI DRB0008A, the drawing is titled VSON). KiCad orientation: pin 1 top left, pins 1-4 down the left
  // side, 5-8 up the right side, which is the datasheet's land-pattern view as drawn. x is across the body, y along it.
  'son-8': {
    kind: 'dual-nolead',
    name: 'SON-8',
    file: 'SON-8',
    descr: 'SON-8 (TI DRB0008A, titled VSON), 0.65 mm pitch, 3 x 3 mm body, comb-shaped exposed pad; land pattern from the TPS7A8101-Q1 datasheet (SLVSCK0A, PDF page 28)',
    tags: 'SON-8 VSON-8 DRB DRB0008A',
    source: { part: 'TPS7A8101-Q1', revision: 'SLVSCK0A', page: 28 },
    pitch: 0.65,
    pinsPerSide: 4,
    // Example board layout, PDF page 28 (checked against the PDF's vector paths): rows of pads 2.80 apart centre to centre, eight pads 0.31 wide
    // (along the row) by 0.60 long with R0.05 corners.
    rowCentres: 2.8,
    pad: { long: 0.6, wide: 0.31 },
    padRadius: 0.05,
    // Package outline, PDF page 27. Ranges as printed; the midpoint is used for drawing only (ours). Length runs along the pad rows.
    body: { length: { min: 2.9, max: 3.1 }, width: { min: 2.9, max: 3.1 }, height: { max: 1.0 } },
    leadWidth: { min: 0.25, max: 0.37 },
    leadLength: { min: 0.3, max: 0.5 },
    // Exposed thermal pad, land pattern on PDF page 28: a 1.5 wide by 1.75 long centre block with two 0.23 wide fingers (0.42 gap, centred)
    // at each end, 3.4 long overall (0.825 beyond the block). The package pad (page 27) is 1.5 +/- 0.1 by 1.75 +/- 0.1 with the same fingers out to the body edge.
    thermal: { num: '9', along: 3.4, across: 1.5, centre: 1.75, finger: 0.23, gap: 0.42, fingers: 2, centred: true },
    // Our additions, not from the datasheet: courtyard margin, silkscreen and fab-layer conventions.
    courtyardMargin: 0.25,
  },
  // Four-sided leadless package (QFN family) with an exposed pad. KiCad orientation: pin 1 top left, pins 1-10 down the left side,
  // 11-20 along the bottom left to right, 21-30 up the right side, 31-40 along the top right to left, exposed pad numbered 41 (ours).
  'lfcsp-40': {
    layout: 'quad',
    name: 'LFCSP-40',
    file: 'LFCSP-40_6x6mm_P0.5mm_EP4.6x4.6mm',
    descr: 'LFCSP-40 (CP-40-7), 6 x 6 mm body, 0.5 mm pitch, 4.6 x 4.6 mm exposed pad; outline from the ADE9078 datasheet (Rev. A, page 106), pad sizes are ours',
    tags: 'LFCSP-40 CP-40-7 QFN-40 MO-220',
    source: { part: 'ADE9078', revision: 'Rev. A', page: 106 },
    pitch: 0.5,
    padsPerSide: 10,
    // Package outline, datasheet page 106 (Figure 114, CP-40-7, JEDEC MO-220-WJJD-5). Ranges as printed; the body is square.
    body: { length: { min: 5.9, max: 6.1 }, width: { min: 5.9, max: 6.1 }, height: { min: 0.7, max: 0.8 } },
    leadWidth: { min: 0.18, max: 0.3 },
    leadLength: { min: 0.35, max: 0.45 },
    epSquare: { min: 4.5, max: 4.7 },
    epClearance: 0.2, // minimum from the exposed pad to the leads, printed as "0.20 MIN"
    // The datasheet has no recommended land pattern, so these are ours (IPC-style, from the outline above): pads reach 0.30 past the
    // largest body edge (3.05 from the centre) and start 0.40 in from the nominal body edge, leaving 0.25 to the exposed pad.
    pad: { long: 0.8, wide: 0.3, centre: 2.95 },
    ep: { size: 4.6 },
    courtyardMargin: 0.3,
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
  TPS63020: {
    package: 'vson-14',
    half: 7.62, // body 15.24 mm square (the default is 10.16), so 5 pins fit on a side with the pin ends on the 2.54 grid
    description: '2.4 MHz four-switch buck-boost converter, 1.8-5.5 V input, adjustable 1.2-5.5 V output, 2 A, 4 A switch limit, VSON-14',
    keywords: 'buck-boost converter dc-dc 2.4MHz TPS63021',
    datasheet: 'https://www.ti.com/lit/ds/symlink/tps63020.pdf',
    // Pins 4/5, 6/7, 8/9 and 10/11 are two package pins on one net each. Pin 15 is the exposed pad, which the datasheet says is
    // connected to PGND; it has no pin number there, so 15 is ours. VOUT, L1 and L2 are passive so that the two pins of one net do not trip the ERC.
    pins: [
      { number: '10', name: 'VIN', type: 'power_in', side: 'left', pos: 5.08 },
      { number: '11', name: 'VIN', type: 'power_in', side: 'left', pos: 2.54 },
      { number: '1', name: 'VINA', type: 'power_in', side: 'left', pos: 0 },
      { number: '12', name: 'EN', type: 'input', side: 'left', pos: -2.54 },
      { number: '13', name: 'PS/SYNC', type: 'input', side: 'left', pos: -5.08 },
      { number: '4', name: 'VOUT', type: 'passive', side: 'right', pos: 5.08 },
      { number: '5', name: 'VOUT', type: 'passive', side: 'right', pos: 2.54 },
      { number: '3', name: 'FB', type: 'input', side: 'right', pos: 0 },
      { number: '14', name: 'PG', type: 'open_collector', side: 'right', pos: -2.54 },
      { number: '8', name: 'L1', type: 'passive', side: 'top', pos: -5.08 },
      { number: '9', name: 'L1', type: 'passive', side: 'top', pos: -2.54 },
      { number: '6', name: 'L2', type: 'passive', side: 'top', pos: 2.54 },
      { number: '7', name: 'L2', type: 'passive', side: 'top', pos: 5.08 },
      { number: '2', name: 'GND', type: 'power_in', side: 'bottom', pos: -2.54 },
      { number: '15', name: 'PGND', type: 'power_in', side: 'bottom', pos: 2.54 },
    ],
  },
  // Pin numbers and names are from the pin table (SLVSCK0A, page 3). The thermal pad has no number there ("-"); 9 is ours (the footprint's
  // exposed pad). OUT and IN each exist on two package pins; OUT is passive so that the two pins of one net do not trip the ERC. Layout and pin types are ours.
  'TPS7A8101-Q1': {
    package: 'son-8',
    half: 7.62,
    description: '1 A adjustable low-noise LDO, 2.2-6.5 V input, 0.8-6 V output, PMOS pass device, 23.5 uVRMS noise, AEC-Q100 Grade 1, SON-8',
    keywords: 'ldo linear regulator low-noise adjustable automotive TPS7A8101',
    datasheet: 'https://www.ti.com/lit/ds/symlink/tps7a8101-q1.pdf',
    pins: [
      { number: '7', name: 'IN', type: 'power_in', side: 'left', pos: 5.08 },
      { number: '8', name: 'IN', type: 'power_in', side: 'left', pos: 2.54 },
      { number: '5', name: 'EN', type: 'input', side: 'left', pos: -2.54 },
      { number: '1', name: 'OUT', type: 'passive', side: 'right', pos: 5.08 },
      { number: '2', name: 'OUT', type: 'passive', side: 'right', pos: 2.54 },
      { number: '3', name: 'FB/SNS', type: 'input', side: 'right', pos: 0 },
      { number: '6', name: 'NR', type: 'passive', side: 'right', pos: -2.54 },
      { number: '4', name: 'GND', type: 'power_in', side: 'bottom', pos: -2.54 },
      { number: '9', name: 'EP', type: 'passive', side: 'bottom', pos: 2.54 },
    ],
  },
  ADE9078: {
    package: 'lfcsp-40',
    description: 'Polyphase energy metering AFE, seven 24-bit sigma-delta ADCs, DSP core, 10 MHz SPI, 2.7-3.63 V, LFCSP-40 6x6 mm',
    keywords: 'energy metering polyphase afe current transformer rogowski spi',
    datasheet: 'https://www.analog.com/media/en/technical-documentation/data-sheets/ADE9078.pdf',
    body: { halfW: 12.7, halfH: 27.94 },
    // Our layout: analog inputs and power-mode/reset on the left, serial, pulse, interrupt, reference and clock on the right,
    // supplies on top, grounds and no-connects on the bottom. Pin numbers and names are from the datasheet pin function table;
    // overbars only on the pins the datasheet calls active low (RESET, IRQ0, IRQ1). Pin types are our reading.
    pins: [
      { number: '7', name: 'IAP', type: 'input', side: 'left', pos: 22.86 },
      { number: '8', name: 'IAN', type: 'input', side: 'left', pos: 20.32 },
      { number: '9', name: 'IBP', type: 'input', side: 'left', pos: 17.78 },
      { number: '10', name: 'IBN', type: 'input', side: 'left', pos: 15.24 },
      { number: '11', name: 'ICP', type: 'input', side: 'left', pos: 12.7 },
      { number: '12', name: 'ICN', type: 'input', side: 'left', pos: 10.16 },
      { number: '13', name: 'INP', type: 'input', side: 'left', pos: 7.62 },
      { number: '14', name: 'INN', type: 'input', side: 'left', pos: 5.08 },
      { number: '20', name: 'VAP', type: 'input', side: 'left', pos: 2.54 },
      { number: '19', name: 'VAN', type: 'input', side: 'left', pos: 0 },
      { number: '22', name: 'VBP', type: 'input', side: 'left', pos: -2.54 },
      { number: '21', name: 'VBN', type: 'input', side: 'left', pos: -5.08 },
      { number: '24', name: 'VCP', type: 'input', side: 'left', pos: -7.62 },
      { number: '23', name: 'VCN', type: 'input', side: 'left', pos: -10.16 },
      { number: '4', name: 'PM0', type: 'input', side: 'left', pos: -15.24 },
      { number: '5', name: 'PM1', type: 'input', side: 'left', pos: -17.78 },
      { number: '6', name: '~{RESET}', type: 'input', side: 'left', pos: -20.32 },
      { number: '40', name: 'SS', type: 'input', side: 'right', pos: 22.86 },
      { number: '37', name: 'SCLK', type: 'input', side: 'right', pos: 20.32 },
      { number: '39', name: 'MOSI', type: 'input', side: 'right', pos: 17.78 },
      { number: '38', name: 'MISO', type: 'output', side: 'right', pos: 15.24 },
      { number: '33', name: 'CF1', type: 'output', side: 'right', pos: 10.16 },
      { number: '34', name: 'CF2', type: 'output', side: 'right', pos: 7.62 },
      { number: '35', name: 'CF3/ZX', type: 'output', side: 'right', pos: 5.08 },
      { number: '36', name: 'CF4/EVENT/DREADY', type: 'output', side: 'right', pos: 2.54 },
      { number: '31', name: '~{IRQ0}', type: 'output', side: 'right', pos: -2.54 },
      { number: '32', name: '~{IRQ1}', type: 'output', side: 'right', pos: -5.08 },
      { number: '16', name: 'REF', type: 'bidirectional', side: 'right', pos: -10.16 },
      { number: '29', name: 'CLKIN', type: 'input', side: 'right', pos: -15.24 },
      { number: '30', name: 'CLKOUT', type: 'output', side: 'right', pos: -17.78 },
      { number: '1', name: 'PULL_HIGH', type: 'input', side: 'top', pos: -7.62 },
      { number: '3', name: 'DVDDOUT', type: 'power_out', side: 'top', pos: -2.54 },
      { number: '25', name: 'AVDDOUT', type: 'power_out', side: 'top', pos: 2.54 },
      { number: '27', name: 'VDD', type: 'power_in', side: 'top', pos: 7.62 },
      { number: '28', name: 'GND', type: 'power_in', side: 'bottom', pos: -7.62 },
      { number: '26', name: 'AGND', type: 'power_in', side: 'bottom', pos: -5.08 },
      { number: '2', name: 'DGND', type: 'power_in', side: 'bottom', pos: -2.54 },
      { number: '15', name: 'REFGND', type: 'power_in', side: 'bottom', pos: 0 },
      { number: '17', name: 'NC1', type: 'passive', side: 'bottom', pos: 2.54 },
      { number: '18', name: 'NC2', type: 'passive', side: 'bottom', pos: 5.08 },
      { number: '41', name: 'EP', type: 'passive', side: 'bottom', pos: 7.62 },
    ],
  },
};
