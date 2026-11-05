// Schematic of the Silergy SY26533 boost converter, redrawn from the "Typical Schematic" in its datasheet.
// Designators and values follow the datasheet's BOM list. The datasheet draws only the GND pin; the SOT23-6 package also has
// a PGND pin (its charge-pump example ties the two together), so both are drawn here and joined at one ground symbol.
import { Sheet } from './lib.mjs';

export function boostConverter({ id, part, v = {} }) {
  const val = {
    vin: '5–12 V', vout: '12 V', c1: '10 µF, 25 V', c4: '10 µF, 25 V', l1: '22 µH', d1: 'SS34, 3 A, 40 V',
    r1: '105 kΩ', r2: '12 kΩ', r3: '1 MΩ', ...v,
  };
  const s = new Sheet(800, 396, {
    top: 50,
    id,
    title: `${part} reference circuit`,
    desc:
      `Typical schematic of the ${part} boost converter, redrawn from the datasheet. The input VIN (${val.vin}) has a ${val.c1} capacitor C1 to ground and feeds the IN pin. ` +
      `A switch K connects VIN to the EN pin, and a ${val.r3} resistor R3 pulls EN to ground when the switch is open. ` +
      `The inductor L1 (${val.l1}) runs from VIN to the LX pin and to the anode of the Schottky diode D1 (${val.d1}). ` +
      `The cathode of D1 is the output VOUT (${val.vout}), which has a ${val.c4} capacitor C4 to ground. ` +
      `The feedback divider is R1 (${val.r1}) from VOUT to the FB pin and R2 (${val.r2}) from FB to ground. The GND and PGND pins go to ground.`,
  });

  const ic = { x: 330, y: 170, w: 140, h: 160 };
  const lx = ic.x - 12; // left edge of the pin stubs
  const rx = ic.x + ic.w + 12;
  const rail = 100; // the VIN / VOUT rail
  const yIN = 200, yEN = 260; // left pins
  const yLX = 200, yFB = 260; // right pins
  const gx = [370, 430]; // GND and PGND pins
  const gy = ic.y + ic.h + 30; // ground bus under the IC

  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'IN', y: yIN }, { name: 'EN', y: yEN }],
    right: [{ name: 'LX', y: yLX }, { name: 'FB', y: yFB }],
    bottom: [{ name: 'GND', x: gx[0] }, { name: 'PGND', x: gx[1] }],
  }, { title: part });

  // ---- input: VIN flag, C1, and the tap that feeds IN
  const c1x = 100, kx = 190, tapX = 250;
  s.port(54, rail, 'VIN', 'in').text(10, rail - 14, val.vin, { cls: 'sch-net', anchor: 'start' });
  s.wire([54, rail], [tapX, rail]);
  s.dot(c1x, rail).capacitor(c1x, rail, c1x, 200).ground(c1x, 200).label(c1x, 150, 'C1', val.c1, 'left');
  s.dot(tapX, rail).wire([tapX, rail], [tapX, yIN], [lx, yIN]);

  // ---- enable: switch K from VIN to EN, R3 from EN to ground
  s.dot(kx, rail).wire([kx, rail], [kx, 148]);
  s.add(`<circle class="sch-w" cx="${kx}" cy="151" r="3"/>`).add(`<circle class="sch-w" cx="${kx}" cy="189" r="3"/>`);
  s.wire([kx, 186], [kx + 14, 158]).wire([kx, 192], [kx, yEN]).wire([kx, yEN], [lx, yEN]);
  s.dot(kx, yEN).resistor(kx, yEN, kx, 340).ground(kx, 340);
  s.label(kx, 222, 'K', 'ON / OFF', 'right');
  s.label(kx, 300, 'R3', val.r3, 'right');

  // ---- power path: L1 from VIN to the LX node, D1 from the LX node to VOUT
  const nodeX = 520, outX = 660, c4x = 720;
  s.inductor(tapX, rail, nodeX, rail).label(385, rail, 'L1', val.l1, 'above');
  s.dot(nodeX, rail).wire([rx, yLX], [nodeX, yLX], [nodeX, rail]);
  s.diode(nodeX, rail, outX, rail).label(590, rail, 'D1', val.d1, 'above');

  // ---- output: R1/R2 feedback divider, C4, VOUT flag
  s.dot(outX, rail).resistor(outX, rail, outX, yFB).label(outX, 180, 'R1', val.r1, 'left');
  s.dot(outX, yFB).wire([rx, yFB], [outX, yFB]);
  s.resistor(outX, yFB, outX, 350).ground(outX, 350).label(outX, 305, 'R2', val.r2, 'left');
  s.wire([outX, rail], [c4x + 20, rail]).dot(c4x, rail).capacitor(c4x, rail, c4x, 260).ground(c4x, 260).label(c4x, 180, 'C4', val.c4, 'right');
  s.port(c4x + 20, rail, 'VOUT', 'out').text(c4x + 76, rail - 14, val.vout, { cls: 'sch-net', anchor: 'end' });

  // ---- ground: GND and PGND share one ground symbol
  s.wire([gx[0], ic.y + ic.h + 12], [gx[0], gy], [gx[1], gy], [gx[1], ic.y + ic.h + 12]).dot((gx[0] + gx[1]) / 2, gy).ground((gx[0] + gx[1]) / 2, gy);
  return s;
}
