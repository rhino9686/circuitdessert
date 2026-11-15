// Schematic of the Silergy SY6045B stereo Class-D amplifier, redrawn from "Figure 1. Typical Application Circuit" in its datasheet.
// The figure has no designators or BOM, so none are drawn; every value shown is a value printed on the figure.
// The pins are regrouped by function (control on the left, one block per half-bridge on the right), so pin order differs from the package.
import { Sheet } from './lib.mjs';

/** Left-edge net flag. kind: 'in' (arrow points at the circuit), 'out' (arrow points away), 'io' (both ways). */
function flag(s, x, y, name, kind) {
  const W = 88;
  const x0 = x - W;
  const d =
    kind === 'in'
      ? `M${x} ${y} L${x - 8} ${y - 8} L${x0} ${y - 8} L${x0} ${y + 8} L${x - 8} ${y + 8} Z`
      : kind === 'out'
        ? `M${x0} ${y} L${x0 + 8} ${y - 8} L${x} ${y - 8} L${x} ${y + 8} L${x0 + 8} ${y + 8} Z`
        : `M${x0} ${y} L${x0 + 8} ${y - 8} L${x - 8} ${y - 8} L${x} ${y} L${x - 8} ${y + 8} L${x0 + 8} ${y + 8} Z`;
  s.add(`<path class="sch-flag" d="${d}"/>`);
  s.text(x - W / 2, y + 4, name, { cls: 'sch-net', anchor: 'middle' });
}

export function classDAmpTypical({ id = 'sy6045b', part = 'SY6045B' } = {}) {
  const s = new Sheet(1070, 880, {
    top: 14,
    id,
    minWidth: 820,
    title: `${part} typical application circuit`,
    desc:
      `Typical application circuit of the ${part} stereo Class-D amplifier, redrawn from the datasheet's Figure 1 with the pins regrouped by function. ` +
      `The serial audio pins SCLK, SDIN and LRCLK, the I2C pins SDA and SCL (each through 100 Ω and a 33 pF capacitor to ground), the FAULT_B_OD, FAULT_B and MONITOR_0 to MONITOR_2 pins and an active-low reset, which has a 4.7 kΩ resistor and 1 nF capacitor to ground, connect to the host. ` +
      `VDD_IO takes 3.3 V with 100 nF to ground. The VDD_PLL pin has a 1 µF capacitor position marked NC, V1P2D has 1 µF, and TEST, ADDR_SEL and GND_IO are grounded. ` +
      `PVDD_A with PVDD_B, and PVDD_C with PVDD_D, each share one 10 µF 35 V capacitor to ground. GDREG has 1 µF 16 V to ground, and all four PGND pins and AGND are grounded. ` +
      `Each of the four half-bridges has a 22 nF 50 V bootstrap capacitor from VBS to VOUT, a 10 Ω plus 390 pF 50 V snubber to ground, and a 10 µH inductor. ` +
      `Each pair of inductor outputs has 470 nF 50 V across the speaker, plus 100 nF 50 V and 4.7 kΩ from each output to ground, and drives a 6 Ω speaker.`,
  });

  const ic = { x: 300, y: 30, w: 190, h: 840 };
  const lx = ic.x - 12;
  const rx = ic.x + ic.w + 12;
  const L = [
    ['RST_B', 56], ['SCLK', 140], ['SDIN', 168], ['LRCLK', 196], ['SDA', 240], ['SCL', 300],
    ['FAULT_B_OD', 376], ['FAULT_B', 404], ['MONITOR_0', 432], ['MONITOR_1', 460], ['MONITOR_2', 488],
    ['VDD_IO', 530], ['VDD_PLL', 600], ['V1P2D', 670], ['ADDR_SEL', 740], ['TEST', 770], ['GND_IO', 800],
  ];
  const R = [
    ['PVDD_A', 56], ['PVDD_B', 86],
    ['VBS_A', 140], ['VOUT_A', 170], ['PGND_A', 200],
    ['VBS_B', 300], ['VOUT_B', 330], ['PGND_B', 360],
    ['PVDD_C', 440], ['PVDD_D', 470],
    ['VBS_C', 530], ['VOUT_C', 560], ['PGND_C', 590],
    ['VBS_D', 690], ['VOUT_D', 720], ['PGND_D', 750],
    ['GDREG', 782], ['AGND', 820],
  ];
  s.ic(ic.x, ic.y, ic.w, ic.h, { left: L.map(([name, y]) => ({ name, y })), right: R.map(([name, y]) => ({ name, y })) });
  s.text(ic.x + ic.w / 2, 345, part, { cls: 'sch-ictitle', anchor: 'middle' });

  // ---------------- left side: host interface and supplies
  const xp = 120; // flags end here
  // reset, with the 4.7 kΩ and 1 nF to ground
  flag(s, xp, 56, '/RESET', 'in');
  s.wire([xp, 56], [lx, 56]).dot(200, 56).dot(240, 56);
  s.resistor(200, 56, 200, 102).ground(200, 102).text(188, 84, '4.7 kΩ', { cls: 'sch-val', anchor: 'end' });
  s.capacitor(240, 56, 240, 80).ground(240, 80).text(254, 72, '1 nF', { cls: 'sch-val' });
  // serial audio inputs
  for (const [name, y] of [['SCLK', 140], ['SDIN', 168], ['LRCLK', 196]]) {
    flag(s, xp, y, name, 'in');
    s.wire([xp, y], [lx, y]);
  }
  // I2C: 100 Ω in series, 33 pF to ground
  for (const [name, y] of [['SDA', 240], ['SCL', 300]]) {
    flag(s, xp, y, name, 'io');
    s.wire([xp, y], [150, y]).resistor(150, y, 190, y).wire([190, y], [lx, y]).dot(225, y);
    s.text(170, y - 10, '100 Ω', { cls: 'sch-val', anchor: 'middle' });
    s.capacitor(225, y, 225, y + 24).ground(225, y + 24).text(239, y + 20, '33 pF', { cls: 'sch-val' });
  }
  // fault and monitor pins
  for (const [name, y, kind] of [['FAULT_B_OD', 376, 'out'], ['FAULT_B', 404, 'io'], ['MONITOR_0', 432, 'out'], ['MONITOR_1', 460, 'out'], ['MONITOR_2', 488, 'out']]) {
    flag(s, xp, y, name, kind);
    s.wire([xp, y], [lx, y]);
  }
  // VDD_IO: 3.3 V with 100 nF
  flag(s, xp, 530, '+3.3 V', 'in');
  s.wire([xp, 530], [lx, 530]).dot(215, 530).capacitor(215, 530, 215, 554).ground(215, 554).text(229, 548, '100 nF', { cls: 'sch-val' });
  // VDD_PLL and V1P2D bypass
  s.wire([lx, 600], [215, 600]).capacitor(215, 600, 215, 624).ground(215, 624).text(229, 618, 'NC (1 µF)', { cls: 'sch-val' });
  s.wire([lx, 670], [215, 670]).capacitor(215, 670, 215, 694).ground(215, 694).text(229, 688, '1 µF', { cls: 'sch-val' });
  // grounded pins
  for (const y of [740, 770, 800]) s.ground(lx, y);
  s.text(lx - 12, 744, 'I²C address 0x54', { cls: 'sch-val', anchor: 'end' });

  // ---------------- right side: supplies
  for (const [ya, yb] of [[56, 86], [440, 470]]) {
    const ym = (ya + yb) / 2;
    s.wire([rx, ya], [rx + 30, ya, ], [rx + 30, yb], [rx, yb]).dot(rx + 30, ym);
    s.wire([rx + 30, ym], [rx + 110, ym]).dot(rx + 70, ym);
    s.capacitor(rx + 70, ym, rx + 70, ym + 24).ground(rx + 70, ym + 24);
    s.text(rx + 84, ym + 20, '10 µF', { cls: 'sch-val' }).text(rx + 84, ym + 33, '35 V', { cls: 'sch-val' });
    s.port(rx + 110, ym, 'PVDD', 'out');
  }
  // GDREG and the power grounds
  s.wire([rx, 782], [rx + 40, 782]).capacitor(rx + 40, 782, rx + 40, 806).ground(rx + 40, 806);
  s.text(rx + 54, 802, '1 µF', { cls: 'sch-val' }).text(rx + 54, 815, '16 V', { cls: 'sch-val' });
  for (const y of [200, 360, 590, 750, 820]) s.wire([rx, y], [rx + 14, y]).ground(rx + 14, y);

  // ---------------- right side: the four half-bridges and the two speaker filters
  const xs = rx + 130, xi = rx + 175, xo1 = rx + 255, xo2 = rx + 325, xo3 = rx + 395, xgnd = rx + 425, xsp = rx + 465;
  const halfBridge = (y, top) => {
    // bootstrap capacitor between VBS (30 above) and VOUT
    s.wire([rx, y - 30], [rx + 30, y - 30]).capacitor(rx + 30, y - 30, rx + 30, y).dot(rx + 30, y);
    s.text(rx + 44, y - 11, '22 nF / 50 V', { cls: 'sch-val' });
    // snubber: 10 Ω then 390 pF, toward the middle of the pair
    const dir = top ? 1 : -1;
    s.dot(xs, y).resistor(xs, y, xs, y + dir * 46).capacitor(xs, y + dir * 46, xs, y + dir * 74);
    s.text(xs + 12, y + dir * 27 + 4, '10 Ω', { cls: 'sch-val' });
    s.text(xs + 14, y + dir * 60 + 4, '390 pF / 50 V', { cls: 'sch-val' });
    // inductor out to the filter
    s.wire([rx, y], [xi, y]).inductor(xi, y, rx + 235, y).wire([rx + 235, y], [xsp, y]);
    s.text(rx + 205, y - 12, '10 µH', { cls: 'sch-val', anchor: 'middle' });
  };
  for (const [ya, yb] of [[170, 330], [560, 720]]) {
    const ym = (ya + yb) / 2;
    halfBridge(ya, true);
    halfBridge(yb, false);
    // shared ground between the two snubbers
    s.wire([xs, ya + 74], [xs, yb - 74]).dot(xs, ym).wire([xs, ym], [xs - 24, ym]).ground(xs - 24, ym);
    // 470 nF across the speaker
    s.dot(xo1, ya).dot(xo1, yb).capacitor(xo1, ya, xo1, yb);
    s.text(xo1 + 14, ym - 2, '470 nF', { cls: 'sch-val' }).text(xo1 + 14, ym + 11, '50 V', { cls: 'sch-val' });
    // 100 nF and 4.7 kΩ from each output to ground
    s.dot(xo2, ya).dot(xo2, yb).dot(xo2, ym).dot(xo3, ya).dot(xo3, yb).dot(xo3, ym);
    s.capacitor(xo2, ya, xo2, ym).capacitor(xo2, ym, xo2, yb);
    s.resistor(xo3, ya, xo3, ym).resistor(xo3, ym, xo3, yb);
    for (const yc of [(ya + ym) / 2, (ym + yb) / 2]) {
      s.text(xo2 + 14, yc - 2, '100 nF', { cls: 'sch-val' }).text(xo2 + 14, yc + 11, '50 V', { cls: 'sch-val' });
      s.text(xo3 + 12, yc + 4, '4.7 kΩ', { cls: 'sch-val' });
    }
    s.wire([xo2, ym], [xgnd, ym]).ground(xgnd, ym);
    // speaker
    s.wire([xsp, ya], [xsp, ym - 26]).wire([xsp, ym + 26], [xsp, yb]);
    s.add(`<rect class="sch-ic" x="${xsp - 9}" y="${ym - 26}" width="18" height="52" rx="2"/>`);
    s.add(`<path class="sch-w" d="M${xsp + 9} ${ym - 14} L${xsp + 30} ${ym - 30} L${xsp + 30} ${ym + 30} L${xsp + 9} ${ym + 14}"/>`);
    s.text(xsp + 38, ym - 2, 'Speaker', { cls: 'sch-val' }).text(xsp + 38, ym + 11, '6 Ω', { cls: 'sch-val' });
  }
  return s;
}
