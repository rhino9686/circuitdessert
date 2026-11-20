// Schematic of the TI TPS7A8101-Q1 LDO, redrawn from Figure 31 ("Typical Application Circuit") in its datasheet (SLVSCK0A).
// The datasheet's figure carries no values. The values drawn here are the recommended capacitors of its Table 2 and the
// 3.3 V row of its Table 1, and the part page says so. The figure draws the connection of C(IN) to VI as a dashed line.
// Designators are ours (the figure uses C(IN), C(OUT), C(NR), C(BYPASS), R1, R2); IN and OUT are drawn once, as in the figure.
import { Sheet } from './lib.mjs';

export function ldoNoiseReduction({ id, part, v = {} }) {
  const val = {
    vin: '', vout: '3.3 V', cin: '10 µF', cout: '10 µF', cnr: '470 nF', cbp: '470 nF', r1: '30.9 kΩ', r2: '10 kΩ', ...v,
  };
  const s = new Sheet(800, 430, {
    top: 120,
    id,
    title: `${part} typical application circuit`,
    desc:
      `Typical application circuit of the ${part} adjustable LDO, redrawn from the datasheet with the recommended values for a ${val.vout} output. ` +
      `The input VI feeds the IN pin; an input capacitor CIN (${val.cin}) to ground is connected to it by a dashed line, as in the datasheet. ` +
      `The enable pin EN is driven by a separate signal VEN. The OUT pin is the output VO, which has an output capacitor COUT (${val.cout}) to ground. ` +
      `The feedback divider is R1 (${val.r1}) from VO to the FB/SNS pin and R2 (${val.r2}) from FB/SNS to ground, ` +
      `and a bypass capacitor CBYPASS (${val.cbp}) sits across R1. The noise-reduction capacitor CNR (${val.cnr}) connects from the NR pin to ground. The GND pin goes to ground.`,
  });

  const ic = { x: 190, y: 140, w: 160, h: 200 };
  const lx = ic.x - 12; // left edge of the left pin stubs
  const rx = ic.x + ic.w + 12; // right edge of the right pin stubs
  const yIN = 180, yEN = 300; // left pins
  const yOUT = 180, yFB = 260, yNR = 320; // right pins
  const gx = 270; // GND pin

  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'IN', y: yIN }, { name: 'EN', y: yEN }],
    right: [{ name: 'OUT', y: yOUT }, { name: 'FB/SNS', y: yFB }, { name: 'NR', y: yNR }],
    bottom: [{ name: 'GND', x: gx }],
  }, { title: part });

  // ---- input: VI flag, the rail to IN, and C(IN) on a dashed connection (as the datasheet draws it)
  const cinX = 110;
  s.port(50, yIN, 'VI', 'in');
  s.wire([50, yIN], [lx, yIN]);
  s.dot(cinX, yIN);
  s.add(`<path class="sch-w" stroke-dasharray="4 3" d="M${cinX} ${yIN} L${cinX} 200"/>`);
  s.capacitor(cinX, 200, cinX, 250).ground(cinX, 250).label(cinX, 225, 'CIN', val.cin, 'left');

  // ---- enable: driven by its own signal
  s.port(50, yEN, 'VEN', 'in');
  s.wire([50, yEN], [lx, yEN]);

  // ---- output rail with R1, C(BYPASS) and C(OUT) hanging off it, and the VO flag
  const r1x = 500, cbx = 570, coutX = 650, portX = 690;
  s.wire([rx, yOUT], [portX, yOUT]);
  s.dot(r1x, yOUT).dot(cbx, yOUT).dot(coutX, yOUT);
  s.port(portX, yOUT, 'VO', 'out');
  s.capacitor(coutX, yOUT, coutX, 300).ground(coutX, 300).label(coutX, 245, 'COUT', val.cout, 'right');

  // ---- feedback divider: R1 from VO to FB/SNS, R2 from FB/SNS to ground, C(BYPASS) across R1
  s.resistor(r1x, yOUT, r1x, yFB).label(r1x, 225, 'R1', val.r1, 'left');
  s.wire([rx, yFB], [r1x, yFB]).dot(r1x, yFB);
  s.capacitor(cbx, yOUT, cbx, yFB).label(cbx, 225, 'CBYPASS', val.cbp, 'right');
  s.wire([cbx, yFB], [r1x, yFB]);
  s.resistor(r1x, yFB, r1x, 340).ground(r1x, 340).label(r1x, 305, 'R2', val.r2, 'left');

  // ---- noise reduction: C(NR) from NR to ground
  const cnrX = 410;
  s.wire([rx, yNR], [cnrX, yNR]);
  s.capacitor(cnrX, yNR, cnrX, 390).ground(cnrX, 390).label(cnrX, 350, 'CNR', val.cnr, 'right');

  // ---- ground pin (the title sits between the pin rows, so it never meets a pin name)
  s.wire([gx, ic.y + ic.h + 12], [gx, 372]).ground(gx, 372);
  return s;
}
