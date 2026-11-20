// Schematic of the TI TPS63020 single-inductor buck-boost converter, redrawn from the "Application Circuit" (Figure 7)
// and "Application Circuit for 2 A Load Current" (Figure 28) in its datasheet, with the values printed in those figures.
// The datasheet joins VINA, EN and PS/SYNC at one node with C3 to ground and draws no connection from that node to VIN
// (Rev G removed it). The drawing does the same and says so on the sheet. PG goes to a "Power Good" terminal with R3 to VOUT.
import { Sheet, refMarkup } from './lib.mjs';

export function singleInductorBuckBoost({ id, part = 'TPS63020', fast = false }) {
  const val = fast
    ? { vin: '2.5–5.5 V', vout: '3.3 V at 2 A', l1: '1 µH', cout: '4 × 22 µF' }
    : { vin: '2.5–5.5 V', vout: '3.3 V at 1.5 A', l1: '1.5 µH', cout: '3 × 22 µF' };
  const s = new Sheet(1000, 480, {
    minWidth: 800,
    top: 40,
    id,
    title: `${part} application circuit${fast ? ' for 2 A' : ''}`,
    desc:
      `Application circuit of the ${part} buck-boost converter, redrawn from the datasheet. The input VIN (${val.vin}) feeds the VIN pin and has C1 (2 × 10 µF) to ground. ` +
      `The inductor L1 (${val.l1}) connects the L1 and L2 pins. The VOUT pin feeds the output (${val.vout}), which has C2 (${val.cout}) to ground. ` +
      `The feedback pin FB is the midpoint of a divider: R1 (1 MΩ) from VOUT and R2 (180 kΩ) to ground.` +
      (fast ? ' A branch of R4 (68 kΩ) in series with C4 (4.7 pF) also runs from VOUT to FB, in parallel with R1.' : '') +
      ` The pins VINA, EN and PS/SYNC are joined at one node, which has C3 (100 nF) to ground; the datasheet draws no connection from this node to VIN. ` +
      `The open-drain power-good output PG goes to a Power Good terminal, with R3 (1 MΩ) to VOUT. GND and PGND each go to ground.`,
  });

  const ic = { x: 340, y: 160, w: 200, h: 230 };
  const lx = ic.x - 12, rx = ic.x + ic.w + 12, by = ic.y + ic.h + 12, ty = ic.y - 12;
  const yVIN = 200, yVINA = 285, yEN = 315, yPS = 345; // left pins
  const yVOUT = 200, yFB = 275, yPG = 350; // right pins
  const xL1 = 385, xL2 = 495, xGND = 385, xPGND = 495;

  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'VIN', y: yVIN }, { name: 'VINA', y: yVINA }, { name: 'EN', y: yEN }, { name: 'PS/SYNC', y: yPS }],
    right: [{ name: 'VOUT', y: yVOUT }, { name: 'FB', y: yFB }, { name: 'PG', y: yPG }],
    top: [{ name: 'L1', x: xL1 }, { name: 'L2', x: xL2 }],
    bottom: [{ name: 'GND', x: xGND }, { name: 'PGND', x: xPGND }],
  }, { title: part });

  // ---- inductor between L1 and L2
  const top = 100;
  s.wire([xL1, ty], [xL1, top]).wire([xL2, ty], [xL2, top]);
  s.inductor(xL1, top, xL2, top).label((xL1 + xL2) / 2, top, 'L1', val.l1, 'above');

  // ---- input: VIN flag, C1
  const c1X = 130;
  s.port(60, yVIN, 'VIN', 'in').text(10, yVIN - 14, val.vin, { cls: 'sch-net', anchor: 'start' });
  s.wire([60, yVIN], [lx, yVIN]);
  s.dot(c1X, yVIN).capacitor(c1X, yVIN, c1X, 262).ground(c1X, 262).label(c1X, 240, 'C1', '2 × 10 µF', 'left');

  // ---- VINA, EN and PS/SYNC on one node with C3 (as printed: no link to VIN)
  const nodeX = 220;
  s.wire([lx, yVINA], [nodeX, yVINA], [nodeX, yPS]);
  s.wire([lx, yEN], [nodeX, yEN]).dot(nodeX, yEN);
  s.wire([lx, yPS], [nodeX, yPS]).dot(nodeX, yPS);
  s.capacitor(nodeX, yPS, nodeX, 420).ground(nodeX, 420).label(nodeX, 392, 'C3', '100 nF', 'left');
  s.text(20, 318, 'not tied to VIN', { cls: 'sch-net', anchor: 'start' });
  s.text(20, 331, 'in the datasheet', { cls: 'sch-net', anchor: 'start' });

  // ---- grounds
  s.ground(xGND, by).ground(xPGND, by);

  // ---- output: VOUT rail, R1/R2 divider to FB, C2, R3 pull-up for PG
  const r1X = 600, brX = 660, c2X = 790, r3X = 870, voutX = 940;
  const lastX = fast ? brX : r1X;
  s.wire([rx, yVOUT], [voutX, yVOUT]);
  s.port(voutX, yVOUT, 'VOUT', 'out').text(voutX + 46, yVOUT - 14, val.vout, { cls: 'sch-net', anchor: 'end' });
  s.dot(r1X, yVOUT).resistor(r1X, yVOUT, r1X, yFB).label(r1X, 235, 'R1', '1 MΩ', 'left');
  s.wire([rx, yFB], [lastX, yFB]).dot(r1X, yFB);
  s.resistor(r1X, yFB, r1X, 320).ground(r1X, 320).label(r1X, 300, 'R2', '180 kΩ', 'left');
  if (fast) {
    s.dot(brX, yVOUT).resistor(brX, yVOUT, brX, 237).label(brX, 220, 'R4', '68 kΩ', 'right');
    s.capacitor(brX, 237, brX, yFB).label(brX, 258, 'C4', '4.7 pF', 'right');
    s.wire([brX, yVOUT], [r1X, yVOUT]);
  }
  s.dot(c2X, yVOUT).capacitor(c2X, yVOUT, c2X, 262).ground(c2X, 262).label(c2X, 240, 'C2', val.cout, 'left');
  s.dot(r3X, yVOUT).resistor(r3X, yVOUT, r3X, yPG).label(r3X, 282, 'R3', '1 MΩ', 'left');
  s.wire([rx, yPG], [voutX, yPG]).dot(r3X, yPG);
  s.port(voutX, yPG, 'PG', 'out').text(voutX + 46, yPG - 14, 'Power Good', { cls: 'sch-net', anchor: 'end' });
  return s;
}
