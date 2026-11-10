// Drawing for the Silergy SY20011 400 nA buck converter: the "Application Schematic (VOUT = 1.8V)" on page 11 of the
// datasheet, with the values from its bill of materials. EN and STB are each fed from VIN through a 1 kΩ / 1 MΩ divider,
// so both sit high; the OUT pin senses the output at the capacitor, separately from the inductor's end.
import { Sheet } from './lib.mjs';

export function lowIqBuckStb({ id, part = 'SY20011' }) {
  const GY = 300;
  const s = new Sheet(850, 330, {
    id,
    title: `${part} reference circuit`,
    desc:
      `Application schematic of the ${part} buck converter for a 1.8 V output, redrawn from the datasheet with the values from its bill of materials. ` +
      `VIN (2.5–5.5 V) feeds the IN pin, with a 100 µF electrolytic capacitor CIN1 and a 10 µF ceramic CIN2 to ground. ` +
      `EN is fed from VIN through 1 kΩ (RENH) with 1 MΩ (RENL) to ground, and STB the same way through RSTBH and RSTBL, so both are high. ` +
      `The open-drain PG output is pulled up to VIN through 100 kΩ (RPG). LX drives a 2.2 µH inductor to the 1.8 V output, which has a 10 µF capacitor COUT. ` +
      `The OUT pin connects to the output at the capacitor. RH (10 MΩ) from OUT and RL (20 MΩ) to ground form the feedback divider to FB, with a 10 pF feedforward capacitor CFF across RH.`,
  });
  const ic = { x: 360, y: 90, w: 130, h: 160 };
  const L = ic.x - 12;
  const R = ic.x + ic.w + 12;
  const pin = { in: 110, en: 190, stb: 220, lx: 110, out: 140, fb: 220 };
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'IN', y: pin.in }, { name: 'EN', y: pin.en }, { name: 'STB', y: pin.stb }],
    right: [{ name: 'LX', y: pin.lx }, { name: 'OUT', y: pin.out }, { name: 'FB', y: pin.fb }],
    top: [{ name: 'PG', x: 425 }],
    bottom: [{ name: 'GND', x: 425 }],
  }, { title: part });
  s.wire([425, ic.y + ic.h + 12], [425, GY]).ground(425, GY);

  // input side
  s.port(54, pin.in, 'VIN', 'in').text(10, pin.in + 26, '2.5–5.5 V', { cls: 'sch-net', anchor: 'start' });
  s.wire([54, pin.in], [L, pin.in]);
  s.dot(80, pin.in).capacitor(80, pin.in, 80, GY, { polarized: true }).ground(80, GY).label(80, 222, 'CIN1', '100 µF');
  s.dot(160, pin.in).capacitor(160, pin.in, 160, GY).ground(160, GY).label(160, 222, 'CIN2', '10 µF');

  // EN and STB dividers from VIN; the EN wire hops over the STB column
  const xe = 215, xs = 285;
  s.dot(xe, pin.in).resistor(xe, pin.in, xe, pin.en).label(xe, 155, 'RENH', '1 kΩ', 'left');
  s.dot(xe, pin.en).resistor(xe, pin.en, xe, GY).ground(xe, GY).label(xe, 262, 'RENL', '1 MΩ', 'left');
  s.hwire(pin.en, xe, L, [xs]);
  s.dot(xs, pin.in).resistor(xs, pin.in, xs, pin.stb).label(xs, 150, 'RSTBH', '1 kΩ');
  s.dot(xs, pin.stb).wire([xs, pin.stb], [L, pin.stb]).resistor(xs, pin.stb, xs, GY).ground(xs, GY).label(xs, 268, 'RSTBL', '1 MΩ');

  // PG pull-up from the VIN rail, over the top of the IC
  s.dot(335, pin.in).wire([335, pin.in], [335, 50]).resistor(335, 50, 425, 50).wire([425, 50], [425, ic.y - 12]).label(380, 50, 'RPG', '100 kΩ', 'above');

  // LX, inductor and output rail
  s.wire([R, pin.lx], [540, pin.lx]).inductor(540, pin.lx, 620, pin.lx).label(580, pin.lx, 'L', '2.2 µH', 'above');
  s.wire([620, pin.lx], [790, pin.lx]);
  s.port(790, pin.lx, 'VOUT', 'out').text(836, pin.lx + 26, '1.8 V', { cls: 'sch-net', anchor: 'end' });

  // OUT pin, sensing at the output capacitor; feedback divider and CFF hang from it
  const xh = 590, xf = 640, xo = 690, xc = 745;
  s.wire([R, pin.out], [xo, pin.out], [xo, pin.lx]).dot(xo, pin.lx);
  s.dot(xh, pin.out).resistor(xh, pin.out, xh, pin.fb).label(xh, 185, 'RH', '10 MΩ', 'left');
  s.wire([R, pin.fb], [xf, pin.fb]).dot(xh, pin.fb);
  s.resistor(xh, pin.fb, xh, GY).ground(xh, GY).label(xh, 265, 'RL', '20 MΩ', 'left');
  s.dot(xf, pin.out).capacitor(xf, pin.out, xf, pin.fb).label(xf, 185, 'CFF', '10 pF');
  s.dot(xc, pin.lx).capacitor(xc, pin.lx, xc, GY).ground(xc, GY).label(xc, 210, 'COUT', '10 µF');
  return s;
}
