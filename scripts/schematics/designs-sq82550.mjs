// Drawing for the Silergy SQ82550 shunt voltage reference: the "Application Schematic" (page 14 of the datasheet),
// with the values from its bill of materials. C2 and R1 are marked DNC (not fitted) there and here.
import { Sheet } from './lib.mjs';

function terminal(s, x, y, text, side = 'right') {
  const cx = side === 'right' ? x + 4 : x - 4;
  s.add(`<circle class="sch-w" cx="${cx}" cy="${y}" r="3.5"/>`);
  if (side === 'right') s.text(x + 14, y + 4, text, { cls: 'sch-net', anchor: 'start' });
  else s.text(x - 14, y + 4, text, { cls: 'sch-net', anchor: 'end' });
}

export function shuntRefApplication({ id, part = 'SQ82550' }) {
  const s = new Sheet(720, 290, {
    top: 30,
    id,
    title: `${part} application schematic`,
    desc:
      `Application schematic of the ${part} shunt voltage reference, redrawn from the datasheet with the values from its bill of materials. ` +
      `The input has a 1 µF capacitor C3 to ground and feeds the CATHODE pin through a 510 Ω resistor R2. ANODE goes to ground. ` +
      `The CATHODE is also the output, with a 10 µF capacitor C1 to ground and a position for a second capacitor C2, not fitted. ` +
      `The NC pin has a position for a resistor R1 to ground, not fitted.`,
  });
  const ic = { x: 300, y: 90, w: 150, h: 120 };
  const lx = ic.x - 12;
  const rx = ic.x + ic.w + 12;
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'CATHODE', y: 120 }, { name: 'ANODE', y: 180 }],
    right: [{ name: 'NC', y: 150 }],
  }, { title: part });

  // input, C3, R2 to the cathode
  terminal(s, 60, 120, 'Input', 'left');
  s.wire([60, 120], [180, 120]).dot(110, 120).capacitor(110, 120, 110, 180, { polarized: true }).ground(110, 180).label(110, 160, 'C3', '1 µF', 'left');
  s.resistor(180, 120, 250, 120).label(215, 120, 'R2', '510 Ω', 'above').wire([250, 120], [lx, 120]);
  s.wire([lx, 180], [270, 180]).ground(270, 180);

  // output taken from the cathode, over the top of the package
  s.dot(270, 120).wire([270, 120], [270, 60], [640, 60]);
  terminal(s, 640, 60, 'Output');
  s.dot(540, 60).capacitor(540, 60, 540, 130).ground(540, 130).label(540, 95, 'C1', '10 µF', 'left');
  s.dot(600, 60).capacitor(600, 60, 600, 130).ground(600, 130).label(600, 95, 'C2', 'not fitted', 'right');

  // NC pin with an unfitted R1 to ground
  s.wire([rx, 150], [490, 150]).resistor(490, 150, 490, 220).ground(490, 220).label(490, 185, 'R1', 'not fitted', 'right');
  return s;
}
