// Schematic for the SY6340 150 mA adjustable LDO (Silergy), redrawn from Figure 1 on page 1 of the datasheet (Rev. 1.0).
// The figure's designators are kept (C2, C3, C4, R1, R2). C2 is the input capacitor and C3 the output capacitor, as printed; there is no C1.
import { Sheet } from './lib.mjs';

/**
 * Typical application: C2 (2.2 µF) on IN, EN driven by an enable signal, R1 (100 kΩ) from OUT to the ADJ node with C4 (47 pF)
 * across it, R2 (22.1 kΩ) from the ADJ node to ground, and C3 (2.2 µF) on OUT. The figure does not name VIN and VOUT as
 * ports beyond its labels "VIN" and "VOUT"; the 3.3 V value comes from the application text, which uses these resistors for it.
 */
export function sy6340Typical({ id }) {
  const s = new Sheet(800, 360, {
    top: 70,
    id,
    title: 'SY6340 typical application circuit',
    desc:
      'Typical application circuit of the SY6340 adjustable 150 mA LDO, redrawn from Figure 1 of the datasheet. ' +
      'The input VIN feeds the IN pin with a 2.2 microfarad capacitor C2 to ground. The EN pin is driven by an enable signal. ' +
      'The OUT pin is the output VOUT with a 2.2 microfarad capacitor C3 to ground. A 100 kilohm resistor R1 runs from the output to the ADJ pin, ' +
      'with a 47 picofarad capacitor C4 in parallel with it, and a 22.1 kilohm resistor R2 runs from the ADJ pin to ground. The GND pin goes to ground. ' +
      'The datasheet text says this resistor pair sets 3.3 volts.',
  });
  const ic = { x: 290, y: 100, w: 150, h: 150 };
  const lx = ic.x - 12, rx = ic.x + ic.w + 12;
  const yIN = 140, yEN = 210, yOUT = 140, yADJ = 210;
  const gx = 365, gndY = 300;
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'IN', y: yIN }, { name: 'EN', y: yEN }],
    right: [{ name: 'OUT', y: yOUT }, { name: 'ADJ', y: yADJ }],
    bottom: [{ name: 'GND', x: gx }],
  }, { title: 'SY6340' });

  // input rail and C2; enable signal into EN
  const cinX = 130;
  s.port(60, yIN, 'VIN', 'in');
  s.wire([60, yIN], [lx, yIN]);
  s.dot(cinX, yIN).capacitor(cinX, yIN, cinX, gndY).ground(cinX, gndY).label(cinX, 215, 'C2', '2.2 µF', 'left');
  s.port(215, yEN, 'EN', 'in'); // starts to the right of C2, as in the figure, so the enable wire does not cross the capacitor
  s.text(190, yEN + 22, 'enable signal', { anchor: 'middle' });
  s.wire([215, yEN], [lx, yEN]);

  // output rail: R1 with C4 across it, R2 to ground, C3 on the output
  const r1X = 530, c4X = 600, c3X = 680, portX = 740;
  s.wire([rx, yADJ], [r1X, yADJ]);
  s.wire([rx, yOUT], [portX, yOUT]);
  s.port(portX, yOUT, 'VOUT', 'out');
  s.dot(r1X, yOUT).dot(c4X, yOUT).dot(c3X, yOUT).dot(r1X, yADJ).dot(c4X, yADJ);
  s.resistor(r1X, yOUT, r1X, yADJ).label(r1X, 175, 'R1', '100 kΩ', 'left');
  s.wire([r1X, yADJ], [c4X, yADJ]);
  s.capacitor(c4X, yOUT, c4X, yADJ).label(c4X, 175, 'C4', '47 pF', 'right');
  s.resistor(r1X, yADJ, r1X, gndY).ground(r1X, gndY).label(r1X, 255, 'R2', '22.1 kΩ', 'left');
  s.capacitor(c3X, yOUT, c3X, gndY).ground(c3X, gndY).label(c3X, 215, 'C3', '2.2 µF', 'right');

  // ground pin
  s.wire([gx, ic.y + ic.h + 12], [gx, gndY + 20]).ground(gx, gndY + 20);
  return s;
}
