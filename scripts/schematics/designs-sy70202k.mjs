// Schematic of the Silergy SY70202K SSD PMIC, redrawn from the "Application Schematic" in its datasheet.
// Designators and values follow its BOM list. R0 (in series with the AVIN pin) is drawn but missing from the BOM.
import { Sheet, refMarkup } from './lib.mjs';

export function ssdPmicApplication({ id = 'sy70202k', part = 'SY70202K' } = {}) {
  const s = new Sheet(850, 650, {
    top: 14,
    id,
    title: `${part} application schematic`,
    desc:
      `Application schematic of the ${part} PMIC (four buck converters and two LDOs), redrawn from the datasheet. ` +
      `The 2.8 to 3.7 V input VIN feeds the VIN_B1 to VIN_B4 and VIN_LDO1 pins, each with its own capacitor (10 µF for the bucks, 1 µF for the LDO) to the PGND pin beside it, ` +
      `and the AVIN pin through a series resistor R0 with a 1 µF capacitor C0 to ground. ` +
      `Each buck switch pin SW_B1 to SW_B4 goes through a 0.47 µH inductor to the output, which also returns to the matching FB_B pin; each output has two 22 µF capacitors. ` +
      `LDO1 and LDO2 have 1 µF output capacitors. GPIO1 and GPIO3 to GPIO8 are pulled up to VIN through 100 kΩ resistors, SCL and SDA through 4.7 kΩ resistors, and AGND is grounded.`,
  });

  const ic = { x: 320, y: 30, w: 210, h: 580 };
  const lx = ic.x - 12, rx = ic.x + ic.w + 12;
  const L = [
    ['VIN_B1', 60], ['PGND12', 90], ['VIN_B2', 120], ['PGND12', 150], ['VIN_B3', 180], ['PGND34', 210], ['VIN_B4', 240], ['PGND34', 270],
    ['VIN_LDO1', 300], ['AVIN', 350], ['GPIO3', 450], ['GPIO4', 478], ['GPIO5', 506], ['GPIO6', 534], ['GPIO7', 562], ['GPIO8', 590],
  ];
  const R = [
    ['SW_B1', 60], ['FB_B1', 90], ['SW_B2', 120], ['FB_B2', 150], ['SW_B3', 180], ['FB_B3', 210], ['SW_B4', 240], ['FB_B4', 270],
    ['LDO1', 300], ['LDO2', 350], ['GPIO1', 464], ['SCL', 504], ['SDA', 544], ['AGND', 584],
  ];
  s.ic(ic.x, ic.y, ic.w, ic.h, { left: L.map(([name, y]) => ({ name, y })), right: R.map(([name, y]) => ({ name, y })) }, { title: part, subtitle: 'U1' });
  for (const [t, y] of [['delay', 450], ['Buck4 / LDO1', 478], ['DPSLP', 506], ['LDO2 mode', 534], ['I2C IO', 562], ['SLEEP', 590]]) {
    s.text(ic.x + 62, y + 4, t, { cls: 'sch-val' });
  }
  s.text(ic.x + ic.w - 58, 468, 'Buck3', { cls: 'sch-val', anchor: 'end' });

  // ---- input rail and the decoupling capacitors on the left
  const xr = 110, xc = 250;
  s.wire([xr, 40], [xr, 410]).port(xr, 40, 'VIN', 'in');
  const caps = [['C1', 60, 90], ['C2', 120, 150], ['C3', 180, 210], ['C4', 240, 270]];
  for (const [ref, yv, yp] of caps) {
    s.dot(xr, yv).wire([xr, yv], [lx, yv]).dot(xc, yv);
    s.capacitor(xc, yv, xc, yp).dot(xc, yp).wire([xc, yp], [lx, yp]).ground(xc, yp).label(xc, (yv + yp) / 2 + 2, ref, '10 µF', 'left');
  }
  s.dot(xr, 300).wire([xr, 300], [lx, 300]).dot(xc, 300).capacitor(xc, 300, xc, 324).ground(xc, 324).label(xc, 314, 'C5', '1 µF', 'left');
  // AVIN through R0, with C0 to ground
  s.dot(xr, 350).wire([xr, 350], [125, 350]).resistor(125, 350, 155, 350).wire([155, 350], [lx, 350]).dot(xc, 350);
  s.label(140, 350, 'R0', '', 'above');
  s.capacitor(xc, 350, xc, 374).ground(xc, 374).label(xc, 364, 'C0', '1 µF', 'left');

  // ---- GPIO pull-ups to VIN
  s.wire([xr, 410], [290, 410]).dot(xr, 410);
  const pu = [['R9', 130, 590], ['R8', 162, 562], ['R7', 194, 534], ['R6', 226, 506], ['R5', 258, 478], ['R4', 290, 450]];
  for (const [ref, x, y] of pu) {
    s.dot(x, 410).resistor(x, 410, x, y).wire([x, y], [lx, y]).dot(x, y);
    s.text(x - 9, (410 + y) / 2 + 4, ref, { cls: 'sch-ref', anchor: 'end' });
  }
  s.text(xr, 626, 'R4 to R9: 100 kΩ pull-ups to VIN', { cls: 'sch-val' });

  // ---- bucks: inductor, feedback, output capacitors
  const outs = [['L1', 'C7, C8', 'VOUT1', 60], ['L2', 'C9, C10', 'VOUT2', 120], ['L3', 'C11, C12', 'VOUT3', 180], ['L4', 'C13, C14', 'VOUT4', 240]];
  const xo = rx + 108, xk = rx + 158, xp = rx + 248;
  for (const [ind, cap, net, y] of outs) {
    s.wire([rx, y], [rx + 18, y]).inductor(rx + 18, y, rx + 78, y).wire([rx + 78, y], [xk, y]).dot(xo, y).dot(xk, y);
    s.wire([rx, y + 30], [xo, y + 30], [xo, y]);
    s.text(rx + 46, y + 22, refMarkup(ind), { cls: 'sch-ref', anchor: 'end', raw: true });
    s.text(rx + 52, y + 22, '0.47 µH', { cls: 'sch-val' });
    s.capacitor(xk, y, xk, y + 22).ground(xk, y + 22).label(xk, y + 14, cap, '2 × 22 µF', 'right');
    s.wire([xk, y], [xp, y]).text(xp + 4, y + 4, net, { cls: 'sch-net' });
  }
  // ---- LDOs
  for (const [cap, net, y] of [['C15', 'VOUT5', 300], ['C16', 'VOUT6', 350]]) {
    s.wire([rx, y], [xp, y]).dot(xk, y).capacitor(xk, y, xk, y + 22).ground(xk, y + 22).label(xk, y + 14, cap, '1 µF', 'right');
    s.text(xp + 4, y + 4, net, { cls: 'sch-net' });
  }

  // ---- GPIO1, SCL, SDA pull-ups and ports
  const yRail = 420, x1 = rx + 38, x2 = rx + 108, x3 = rx + 178;
  s.wire([x1, yRail], [x3, yRail]).dot(x2, yRail).text(x2 + 30, yRail - 8, 'VIN', { cls: 'sch-net', anchor: 'start' });
  s.hwire(464, rx, xp, [x2, x3]).hwire(504, rx, xp, [x3]).wire([rx, 544], [xp, 544]);
  s.dot(x1, 464).resistor(x1, yRail, x1, 464).label(x1, 442, 'R1', '100 kΩ', 'right');
  s.dot(x2, 504).wire([x2, yRail], [x2, 468]).resistor(x2, 468, x2, 504).label(x2, 488, 'R2', '4.7 kΩ', 'right');
  s.dot(x3, 544).wire([x3, yRail], [x3, 507]).resistor(x3, 507, x3, 544).label(x3, 527, 'R3', '4.7 kΩ', 'right');
  s.port(xp, 464, 'GPIO1', 'out').port(xp, 504, 'SCL', 'out').port(xp, 544, 'SDA', 'out');
  s.wire([rx, 584], [rx + 18, 584]).ground(rx + 18, 584);
  return s;
}
