// Schematics of the Silergy SQ52201 and SQ52212 I2C power monitors, redrawn from the typical applications in their datasheets.
// Neither datasheet has a bill of materials: the SQ52201 figures give no component values at all, and the SQ52212 figure gives only the
// 2k pull-ups. The drawings show only values the datasheet states. The address pins are drawn strapped to ground (address 1000000);
// the datasheet figures draw A0 and A1 running off the sheet, with the strapping options in its address table.
import { Sheet } from './lib.mjs';

/** SQ52201QDQ: one channel, high-side shunt, VBUS pin on the load side of the shunt (the datasheet's Figure 4: 12 V, 2 mΩ, 10 A). */
export function powerMonitor1Ch({ id, part = 'SQ52201QDQ' }) {
  const s = new Sheet(1000, 470, {
    top: 30,
    id,
    title: `${part} reference circuit`,
    desc:
      `Typical application of the ${part} I2C power monitor, redrawn from the datasheet (Figures 1 and 4). A high-side shunt resistor RSHUNT, 2 mΩ in the datasheet's example, sits between a +12 V supply and the load. ` +
      `The supply side of the shunt goes to the IN+ pin and the load side to the IN- pin, and the VBUS pin is tied to the load side as well, so the bus voltage is read at the load. ` +
      `The VS pin takes 2.7 to 5.5 V and has a bypass capacitor CBYPASS to ground. SDA, SCL and ALERT are open-drain lines that each have a pull-up resistor (RSDA, RSCL, RALERT) to the VS rail and go to the host microcontroller. ` +
      `The A0 and A1 address pins and the GND pin are tied to ground, which gives the I2C address 1000000.`,
  });

  const ic = { x: 420, y: 110, w: 190, h: 240 };
  const lx = ic.x - 12;
  const rx = ic.x + ic.w + 12;
  const yP = 170, yN = 230, yB = 290; // IN+, IN-, VBUS
  const ySda = 170, ySc = 230, yAl = 290;
  const xA1 = 465, xA0 = 515, xG = 565;
  const by = ic.y + ic.h + 12;

  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'IN+', y: yP }, { name: 'IN−', y: yN }, { name: 'VBUS', y: yB }],
    right: [{ name: 'SDA', y: ySda }, { name: 'SCL', y: ySc }, { name: 'ALERT', y: yAl }],
    top: [{ name: 'VS', x: 515 }],
    bottom: [{ name: 'A1', x: xA1 }, { name: 'A0', x: xA0 }, { name: 'GND', x: xG }],
  }, { title: part, subtitle: 'U1' });

  // ---- high-side shunt between the +12 V bus and the load
  const xs = 180;
  s.port(60, yP, '+12 V', 'in').wire([60, yP], [xs, yP]).text(66, yP - 14, 'bus 0–36 V', { cls: 'sch-net', anchor: 'start' });
  s.port(60, yN, 'LOAD', 'in').wire([60, yN], [xs, yN]);
  s.dot(xs, yP).dot(xs, yN).resistor(xs, yP, xs, yN).label(xs, 205, 'RSHUNT', '2 mΩ', 'right');
  s.wire([xs, yP], [lx, yP]).wire([xs, yN], [lx, yN]);
  // VBUS to the load side (Figure 4)
  s.dot(330, yN).wire([330, yN], [330, yB], [lx, yB]);
  s.text(324, yB - 8, 'VBUS at the load', { cls: 'sch-val', anchor: 'end' });

  // ---- VS rail with the bypass capacitor and the three pull-ups
  const rail = 62, xR = 920;
  s.wire([515, ic.y - 12], [515, rail]).wire([360, rail], [xR - 20, rail]).dot(515, rail);
  s.dot(360, rail).capacitor(360, rail, 360, 100).ground(360, 100);
  s.label(360, 84, 'CBYPASS', '', 'left');
  s.text(560, rail - 10, 'VS = 2.7–5.5 V', { cls: 'sch-net', anchor: 'start' });
  const xp = [700, 760, 820];
  s.hwire(ySda, rx, xR, [xp[1], xp[2]]);
  s.hwire(ySc, rx, xR, [xp[2]]);
  s.wire([rx, yAl], [xR, yAl]);
  [[xp[0], ySda, 'RSDA'], [xp[1], ySc, 'RSCL'], [xp[2], yAl, 'RALERT']].forEach(([x, y, name]) => {
    s.dot(x, y).wire([x, y], [x, 130]).resistor(x, 130, x, rail).dot(x, rail);
    s.label(x, 100, name, '', 'right');
  });
  s.port(xR, ySda, 'SDA', 'out').port(xR, ySc, 'SCL', 'out').port(xR, yAl, 'ALERT', 'out');
  s.text(xR + 52, ySda - 14, 'to the host', { cls: 'sch-net', anchor: 'end' });

  // ---- address pins and ground
  const gy = 400;
  s.wire([xA1, by], [xA1, gy], [xG, gy], [xG, by]).wire([xA0, by], [xA0, gy]).dot(xA0, gy).ground(xA0, gy);
  s.text(xA0 + 70, gy + 24, 'A0 and A1 low: address 1000000', { cls: 'sch-val', anchor: 'start' });
  return s;
}

/** SQ52212XFS: two channels, each a high-side shunt with its VBUS pin on the supply side (the datasheet's Figure 1); 2k pull-ups as printed. */
export function powerMonitor2Ch({ id, part = 'SQ52212XFS' }) {
  const s = new Sheet(1000, 580, {
    top: 30,
    id,
    title: `${part} reference circuit`,
    desc:
      `Typical application of the ${part} dual-channel I2C monitor, redrawn from the datasheet (Figure 1). Each channel has a high-side shunt resistor between its bus (0 to 70 V) and its load. ` +
      `The supply side of each shunt goes to the IN+ pin of that channel and the load side to its IN- pin, and each channel's VBUS pin is tied to the bus on the supply side of its shunt. ` +
      `The VS pin takes 2.7 to 5.5 V and has a bypass capacitor to ground. SDA, SCL and ALERT are open-drain lines with 2 kΩ pull-ups to the VS rail, going to the host. ` +
      `The EN pin comes from the host (high enables the part), and the A0 and A1 address pins and the GND pin are tied to ground, which gives the I2C address 1000000.`,
  });

  const ic = { x: 430, y: 110, w: 200, h: 370 };
  const lx = ic.x - 12;
  const rx = ic.x + ic.w + 12;
  const ch = [
    { n: 1, yP: 160, yN: 210, yB: 260 },
    { n: 2, yP: 340, yN: 390, yB: 440 },
  ];
  const ySda = 160, ySc = 210, yAl = 260, yEn = 340;
  const xA1 = 480, xA0 = 540, xG = 600;
  const by = ic.y + ic.h + 12;

  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [
      { name: 'IN+1', y: ch[0].yP }, { name: 'IN−1', y: ch[0].yN }, { name: 'VBUS1', y: ch[0].yB },
      { name: 'IN+2', y: ch[1].yP }, { name: 'IN−2', y: ch[1].yN }, { name: 'VBUS2', y: ch[1].yB },
    ],
    right: [{ name: 'SDA', y: ySda }, { name: 'SCL', y: ySc }, { name: 'ALERT', y: yAl }, { name: 'EN', y: yEn }],
    top: [{ name: 'VS', x: 530 }],
    bottom: [{ name: 'A1', x: xA1 }, { name: 'A0', x: xA0 }, { name: 'GND', x: xG }],
  }, { title: part, subtitle: 'U1' });

  // ---- two high-side shunts
  const xs = 180, xv = 310;
  for (const c of ch) {
    s.port(60, c.yP, `BUS${c.n}`, 'in').wire([60, c.yP], [xs, c.yP]).text(66, c.yP - 14, '0–70 V', { cls: 'sch-net', anchor: 'start' });
    s.port(60, c.yN, `LOAD${c.n}`, 'in');
    s.dot(xs, c.yP).dot(xs, c.yN).resistor(xs, c.yP, xs, c.yN).label(xs, c.yP + 30, `RSHUNT${c.n}`, '', 'right');
    s.wire([xs, c.yP], [lx, c.yP]);
    s.hwire(c.yN, 60, lx, [xv]);
    s.dot(xs, c.yN);
    s.dot(xv, c.yP).wire([xv, c.yP], [xv, c.yB], [lx, c.yB]);
  }

  // ---- VS rail with bypass capacitor and the three 2 kΩ pull-ups
  const rail = 62, xR = 920;
  s.wire([530, ic.y - 12], [530, rail]).wire([380, rail], [xR - 20, rail]).dot(530, rail);
  s.dot(380, rail).capacitor(380, rail, 380, 100).ground(380, 100);
  s.label(380, 84, 'CBYPASS', '', 'left');
  s.text(590, rail - 10, 'VS = 2.7–5.5 V', { cls: 'sch-net', anchor: 'start' });
  const xp = [700, 760, 820];
  s.hwire(ySda, rx, xR, [xp[1], xp[2]]);
  s.hwire(ySc, rx, xR, [xp[2]]);
  s.wire([rx, yAl], [xR, yAl]);
  [[xp[0], ySda, 'RSDA'], [xp[1], ySc, 'RSCL'], [xp[2], yAl, 'RALERT']].forEach(([x, y, name]) => {
    s.dot(x, y).wire([x, y], [x, 130]).resistor(x, 130, x, rail).dot(x, rail);
    s.label(x, 100, name, '2 kΩ', 'right');
  });
  s.port(xR, ySda, 'SDA', 'out').port(xR, ySc, 'SCL', 'out').port(xR, yAl, 'ALERT', 'out');
  s.text(xR + 52, ySda - 14, 'to the host', { cls: 'sch-net', anchor: 'end' });
  s.wire([rx, yEn], [xR, yEn]).port(xR, yEn, 'EN', 'out').text(xR + 52, yEn - 14, 'from the host', { cls: 'sch-net', anchor: 'end' });

  // ---- address pins and ground
  const gy = 520;
  s.wire([xA1, by], [xA1, gy], [xG, gy], [xG, by]).wire([xA0, by], [xA0, gy]).dot(xA0, gy).ground(xA0, gy);
  s.text(xA0 + 70, gy + 24, 'A0 and A1 low: address 1000000', { cls: 'sch-val', anchor: 'start' });
  return s;
}
