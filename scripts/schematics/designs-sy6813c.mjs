// Drawing for the Silergy SY6813C load switch: Figure 1 ("Schematic Diagram") of the datasheet. VIN (1.2–5.5 V) feeds IN through a 1 µF
// input capacitor, ON is the control input, and OUT has a 1 µF output capacitor. The datasheet gives no other parts.
import { Sheet } from './lib.mjs';

export function loadSwitchApplication({ id, part = 'SY6813C' }) {
  const GY = 220; // every ground terminal sits on this row
  const s = new Sheet(560, 260, {
    top: 50,
    id,
    title: `${part} reference circuit`,
    desc:
      `Typical application of the ${part} load switch, redrawn from Figure 1 of the datasheet. ` +
      `VIN (1.2–5.5 V) feeds the IN pin, with a 1 µF input capacitor CIN to ground. ` +
      `ON is a control input that is driven high to turn the switch on and must not float. ` +
      `OUT feeds the load at VOUT, with a 1 µF output capacitor COUT to ground. The GND pin is connected to ground.`,
  });
  const ic = { x: 240, y: 70, w: 110, h: 110 };
  const pinIN = 100, pinON = 150;
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'IN', y: pinIN }, { name: 'ON', y: pinON }],
    right: [{ name: 'OUT', y: pinIN }],
    bottom: [{ name: 'GND', x: 295 }],
  }, { title: part });
  s.wire([295, ic.y + ic.h + 12], [295, GY]).ground(295, GY);

  // input side
  s.port(54, pinIN, 'VIN', 'in').text(10, pinIN + 26, '1.2–5.5 V', { cls: 'sch-net', anchor: 'start' });
  s.wire([54, pinIN], [ic.x - 12, pinIN]);
  s.dot(140, pinIN).capacitor(140, pinIN, 140, GY).ground(140, GY).label(140, 170, 'CIN', '1 µF');

  // control input
  s.port(ic.x - 12, pinON, 'ON', 'in');

  // output side
  const outEnd = 500;
  s.wire([ic.x + ic.w + 12, pinIN], [outEnd, pinIN]);
  s.dot(430, pinIN).capacitor(430, pinIN, 430, GY).ground(430, GY).label(430, 170, 'COUT', '1 µF');
  s.port(outEnd, pinIN, 'VOUT', 'out');
  return s;
}
