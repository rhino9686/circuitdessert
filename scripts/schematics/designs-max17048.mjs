// Schematics of the MAX17048 / MAX17049 fuel gauges, redrawn from Figures 14 and 15 of the datasheet (Rev 7, 11/16).
// Figure 14: MAX17048 on a 1S pack, VDD and CELL both on PACK+, 0.1 µF from that node to ground.
// Figure 15: MAX17049 on a 2S pack, CELL on PACK+ with the 0.1 µF, VDD from a 2.5–4.5 V system output.
// Pin arrangement is ours (the figures group pins the same way). The datasheet gives no designators: U1, C1 are ours.
import { Sheet } from './lib.mjs';

export function fuelGauge({ id, part, cells }) {
  const two = cells === 2;
  const s = new Sheet(780, 380, {
    top: 20,
    id,
    title: `${part} reference circuit`,
    desc:
      `Application circuit of the ${part} fuel gauge on a ${cells}S battery pack, redrawn from the datasheet. ` +
      (two
        ? 'The pack positive terminal goes to the CELL pin with a 0.1 µF capacitor to ground. The VDD pin is fed from a 2.5 V to 4.5 V system output. '
        : 'The pack positive terminal goes to both the VDD and CELL pins, with a 0.1 µF capacitor from that node to ground. ') +
      'CTG, GND and the pack negative terminal are on ground, QSTRT is on ground, and ALRT, SDA and SCL go to the interrupt input and the I2C pins of the system microcontroller.',
  });
  const ic = { x: 300, y: 110, w: 180, h: 200 };
  const lx = ic.x - 12, rx = ic.x + ic.w + 12;
  const yV = 150, yC = 190, yT = 250, yG = 290;
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'VDD', y: yV }, { name: 'CELL', y: yC }, { name: 'CTG', y: yT }, { name: 'GND', y: yG }],
    right: [{ name: 'ALRT', y: yV }, { name: 'SDA', y: yC }, { name: 'SCL', y: yT - 0 }, { name: 'QSTRT', y: yG }],
  }, { title: part, subtitle: 'U1' });

  // battery pack: cell, protection block
  const bx = 70, px = 200;
  s.text(84, 118, 'battery pack', { cls: 'sch-net', anchor: 'start' });
  s.add(`<line class="sch-w" x1="${bx}" y1="70" x2="${bx}" y2="168"/>`);
  s.add(`<line class="sch-w" x1="${bx - 16}" y1="168" x2="${bx + 16}" y2="168"/>`);
  s.add(`<line class="sch-w" x1="${bx - 9}" y1="178" x2="${bx + 9}" y2="178"/>`);
  s.add(`<line class="sch-w" x1="${bx}" y1="178" x2="${bx}" y2="${yG - 18}"/>`);
  s.text(bx + 24, 174, two ? '2S' : '1S', { cls: 'sch-net', anchor: 'start' });
  s.add(`<rect class="sch-ic" x="25" y="${yG - 18}" width="90" height="36"/>`);
  s.text(70, yG + 4, 'PROTECTION', { cls: 'sch-net', anchor: 'middle' });
  s.wire([bx, 70], [px, 70]);
  s.text(bx + 8, 62, 'PACK+', { cls: 'sch-net', anchor: 'start' });

  // PACK+ node, bypass capacitor
  s.wire([px, 70], [px, yC]);
  if (!two) s.dot(px, yV).wire([px, yV], [lx, yV]);
  s.dot(px, yC).wire([px, yC], [lx, yC]);
  s.capacitor(px, 215, px, 255).label(px, 235, 'C1', '0.1 µF', 'left');
  s.wire([px, yC], [px, 215]).wire([px, 255], [px, yG]);

  // ground bus
  s.wire([115, yG], [lx, yG]).dot(px, yG).dot(250, yG).wire([lx - 38, yT], [250, yT], [250, yG]).wire([lx - 38, yT], [lx, yT]);
  s.ground(250, yG);

  if (two) {
    s.wire([lx, yV], [250, yV], [250, 60]);
    s.port(250, 60, 'VSYS', 'in').text(262, 46, 'system 2.5–4.5 V output', { cls: 'sch-net', anchor: 'start' });
  }

  // microcontroller side
  const ox = 620;
  for (const [y, t] of [[yV, 'INTERRUPT'], [yC, 'SDA'], [yT, 'SCL']]) {
    s.wire([rx, y], [ox, y]).text(ox + 8, y + 4, t, { cls: 'sch-net', anchor: 'start' });
  }
  s.text(ox + 8, 120, 'system µP', { cls: 'sch-net', anchor: 'start' });
  s.wire([rx, yG], [560, yG]).ground(560, yG);
  s.text(60, 360, two ? 'The datasheet draws the 0.1 µF on the CELL node, not on VDD.' : 'VDD and CELL are the same node: VDD powers the part and CELL is not connected inside.', { cls: 'sch-net', anchor: 'start' });
  return s;
}
