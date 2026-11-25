// Schematics for the AP2202 150 mA RF ULDO (Diodes Incorporated), redrawn from the two figures under
// "Typical Applications Circuit" on page 2 of the datasheet: the fixed 2.8 V version and the adjustable version.
// In both, EN is wired to VIN. The datasheet's designators are kept (CIN, COUT, CBYP, R1, R2).
import { Sheet } from './lib.mjs';

/**
 * Fixed-output circuit (the datasheet draws the AP2202-2.8 with VIN = 3.8 V): CIN on the input, EN tied to VIN,
 * COUT on the output and a 100 pF CBYP from BYP to ground.
 */
export function ap2202Fixed({ id }) {
  const s = new Sheet(800, 360, {
    top: 70,
    id,
    title: 'AP2202-2.8 typical application circuit',
    desc:
      'Typical application circuit of the AP2202 fixed-output 150 mA LDO, redrawn from the datasheet for the 2.8 V version with a 3.8 V input. ' +
      'The input VIN feeds the VIN pin with a 1.0 microfarad capacitor CIN to ground, and the EN pin is wired to the input rail so the regulator is always enabled. ' +
      'The VOUT pin is the 2.8 V output with a 2.2 microfarad capacitor COUT to ground. A 100 picofarad capacitor CBYP goes from the BYP pin to ground. The GND pin goes to ground.',
  });
  const ic = { x: 290, y: 100, w: 150, h: 150 };
  const lx = ic.x - 12, rx = ic.x + ic.w + 12;
  const yIN = 140, yEN = 210, yOUT = 140, yBYP = 210;
  const gx = 365, gndY = 300;
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'VIN', y: yIN }, { name: 'EN', y: yEN }],
    right: [{ name: 'VOUT', y: yOUT }, { name: 'BYP', y: yBYP }],
    bottom: [{ name: 'GND', x: gx }],
  }, { title: 'AP2202-2.8' });

  // input rail, CIN, and EN tied to the rail
  const cinX = 130, tapX = 215;
  s.port(60, yIN, 'VIN', 'in');
  s.text(42, yIN - 18, 'VIN = 3.8 V', { anchor: 'middle' });
  s.wire([60, yIN], [lx, yIN]);
  s.dot(cinX, yIN).capacitor(cinX, yIN, cinX, gndY).ground(cinX, gndY).label(cinX, 215, 'CIN', '1.0 µF', 'left');
  s.dot(tapX, yIN).wire([tapX, yIN], [tapX, yEN], [lx, yEN]);

  // output rail and COUT
  const coutX = 640, portX = 720;
  s.wire([rx, yOUT], [portX, yOUT]);
  s.port(portX, yOUT, 'VOUT', 'out');
  s.text(portX + 27, yOUT - 18, 'VOUT = 2.8 V', { anchor: 'middle' });
  s.dot(coutX, yOUT).capacitor(coutX, yOUT, coutX, gndY).ground(coutX, gndY).label(coutX, 215, 'COUT', '2.2 µF', 'right');

  // CBYP from BYP to ground
  const cbX = 520;
  s.wire([rx, yBYP], [cbX, yBYP]);
  s.capacitor(cbX, yBYP, cbX, gndY).ground(cbX, gndY).label(cbX, 265, 'CBYP', '100 pF', 'right');

  // ground pin
  s.wire([gx, ic.y + ic.h + 12], [gx, gndY + 20]).ground(gx, gndY + 20);
  return s;
}

/**
 * Adjustable circuit: EN tied to VIN, R1 from VOUT to the ADJ node and R2 from that node to ground as the figure labels them,
 * COUT on the output and an optional CBYP from the ADJ wire to ground. The figure's own equation, VOUT = 1.25 × (1 + R2/R1),
 * is printed under it.
 */
export function ap2202Adjustable({ id }) {
  const s = new Sheet(800, 390, {
    top: 70,
    id,
    title: 'AP2202-ADJ typical application circuit',
    desc:
      'Typical application circuit of the AP2202 adjustable 150 mA LDO, redrawn from the datasheet. ' +
      'The input VIN feeds the VIN pin with a 1.0 microfarad capacitor CIN to ground, and the EN pin is wired to the input rail so the regulator is always enabled. ' +
      'The VOUT pin is the output with a 2.2 microfarad capacitor COUT to ground. R1 runs from VOUT to the ADJ pin and R2 from ADJ to ground. ' +
      'An optional capacitor CBYP goes from the ADJ node to ground. The GND pin goes to ground. The datasheet prints the equation VOUT = 1.25 times (1 + R2 / R1) under the figure, ' +
      'which does not match the way the resistors are labelled in the drawing.',
  });
  const ic = { x: 290, y: 100, w: 150, h: 150 };
  const lx = ic.x - 12, rx = ic.x + ic.w + 12;
  const yIN = 140, yEN = 210, yOUT = 140, yADJ = 210;
  const gx = 365, gndY = 300;
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'VIN', y: yIN }, { name: 'EN', y: yEN }],
    right: [{ name: 'VOUT', y: yOUT }, { name: 'ADJ', y: yADJ }],
    bottom: [{ name: 'GND', x: gx }],
  }, { title: 'AP2202-ADJ' });

  // input rail, CIN, EN tied to the rail
  const cinX = 130, tapX = 215;
  s.port(60, yIN, 'VIN', 'in');
  s.wire([60, yIN], [lx, yIN]);
  s.dot(cinX, yIN).capacitor(cinX, yIN, cinX, gndY).ground(cinX, gndY).label(cinX, 215, 'CIN', '1.0 µF', 'left');
  s.dot(tapX, yIN).wire([tapX, yIN], [tapX, yEN], [lx, yEN]);

  // ADJ wire: optional CBYP, then the R1/R2 node
  const cbX = 490, rX = 570;
  s.wire([rx, yADJ], [rX, yADJ]);
  s.dot(cbX, yADJ);
  s.add(`<path class="sch-w" stroke-dasharray="4 3" d="M${cbX} ${yADJ} L${cbX} 240"/>`);
  s.capacitor(cbX, 240, cbX, gndY).ground(cbX, gndY).label(cbX, 270, 'CBYP', 'optional', 'left');

  // output rail, R1, R2, COUT
  const coutX = 650, portX = 720;
  s.wire([rx, yOUT], [portX, yOUT]);
  s.port(portX, yOUT, 'VOUT', 'out');
  s.dot(rX, yOUT).dot(coutX, yOUT).dot(rX, yADJ);
  s.resistor(rX, yOUT, rX, yADJ).label(rX, 175, 'R1', '', 'right');
  s.resistor(rX, yADJ, rX, gndY).ground(rX, gndY).label(rX, 255, 'R2', '', 'right');
  s.capacitor(coutX, yOUT, coutX, gndY).ground(coutX, gndY).label(coutX, 215, 'COUT', '2.2 µF', 'right');

  // ground pin
  s.wire([gx, ic.y + ic.h + 12], [gx, gndY + 20]).ground(gx, gndY + 20);

  s.text(560, 370, 'VOUT = 1.25 × (1 + R2 / R1), as printed in the datasheet', { anchor: 'middle' });
  return s;
}
