// Schematic of the Silergy SY2A58215 H-bridge motor driver, redrawn from the "Application Schematic" page of its datasheet.
// Designators and values follow the datasheet's BOM list. The pins are drawn as the datasheet draws them: one VCC, one GND,
// OUTA and OUTB, although the SOP16 package has several pins for each (see the pin table in the datasheet).
import { Sheet } from './lib.mjs';

export function hBridge({ id, part, v = {} }) {
  const val = {
    vbat: '4–28 V', e1: '100 µF, 50 V', c13: '3 × 10 µF, 50 V', c45: '100 nF, 50 V', c8: '1 µF, 16 V',
    rin: '1 kΩ', r7: '270 Ω', r8: '270 Ω', r9: '4.7 kΩ', ...v,
  };
  const s = new Sheet(710, 530, {
    id,
    title: `${part} reference circuit`,
    desc:
      `Application schematic of the ${part} H-bridge motor driver, redrawn from the datasheet. The battery supply VBAT (${val.vbat}) feeds the VCC pin, with a ${val.e1} electrolytic capacitor E1 and three ${val.c13.replace('3 × ', '')} ceramic capacitors C1, C2 and C3 in parallel to ground. ` +
      `The four logic inputs PWM, INA, INB and SEL0 each reach their pin through a ${val.rin} series resistor (R4, R1, R2 and R3). ` +
      `The CS pin feeds a current-sense network: R7 (${val.r7}) from CS to a junction, R8 (${val.r8}) from the junction to ground, and R9 (${val.r9}) from the junction to the output that goes to the microcontroller's ADC, which has a ${val.c8} capacitor C8 to ground. ` +
      `The OUTA and OUTB pins connect to a brushed DC motor, and each has a ${val.c45} capacitor to ground (C4 and C5). GND goes to ground.`,
  });

  const ic = { x: 330, y: 110, w: 160, h: 330 };
  const lx = ic.x - 12; // left edge of the pin stubs
  const rx = ic.x + ic.w + 12;
  const row = { PWM: 170, INA: 226, INB: 282, SEL0: 338, CS: 400 };
  const outA = 170, outB = 400;
  const GR = 500; // ground rail under the sense network
  const vccX = 410;

  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: Object.entries(row).map(([name, y]) => ({ name, y })),
    right: [{ name: 'OUTA', y: outA }, { name: 'OUTB', y: outB }],
    top: [{ name: 'VCC', x: vccX }],
    bottom: [{ name: 'GND', x: vccX }],
  }, { title: part, subtitle: '15 A H-bridge' });

  // ---- supply: VBAT flag, rail along the top, E1 and C1-C3 to a short ground bus
  s.port(54, 40, 'VBAT', 'in').text(10, 66, val.vbat, { cls: 'sch-net', anchor: 'start' });
  s.wire([54, 40], [vccX, 40], [vccX, ic.y - 12]);
  for (const [x, ref, v2, polarized] of [[110, 'E1', val.e1, true], [260, 'C1–C3', val.c13, false]]) {
    s.dot(x, 40).capacitor(x, 40, x, 100, { polarized }).dot(x, 100).label(x, 74, ref, v2);
  }
  s.wire([110, 100], [260, 100]).ground(110, 100);

  // ---- logic inputs: flag, series resistor, pin
  const refs = { PWM: 'R4', INA: 'R1', INB: 'R2', SEL0: 'R3' };
  for (const name of ['PWM', 'INA', 'INB', 'SEL0']) {
    const y = row[name];
    s.port(54, y, name, 'in');
    s.wire([54, y], [160, y]).resistor(160, y, 240, y).wire([240, y], [lx, y]);
    s.label(200, y, refs[name], val.rin, 'above');
  }

  // ---- current-sense network: CS -> R7 -> junction; junction -> R8 -> ground; junction -> R9 -> output to the ADC, C8 on the output
  const yCS = row.CS;
  const jx = 250; // the junction
  const tx = 110; // the ADC terminal
  s.resistor(jx, yCS, lx, yCS).label(284, yCS, 'R7', val.r7, 'above');
  s.dot(jx, yCS);
  s.resistor(jx, yCS, jx, GR).label(jx, (yCS + GR) / 2, 'R8', val.r8, 'right');
  s.resistor(tx, yCS, jx, yCS).label(180, yCS, 'R9', val.r9, 'above');
  s.add(`<circle class="sch-w" cx="${tx - 14}" cy="${yCS}" r="3"/>`).wire([tx - 11, yCS], [tx, yCS]);
  s.text(tx - 14, yCS - 12, 'to ADC', { cls: 'sch-net', anchor: 'middle' });
  s.dot(tx, yCS).capacitor(tx, yCS, tx, GR).label(tx, (yCS + GR) / 2, 'C8', val.c8, 'right');
  s.dot(tx, GR).dot(jx, GR);

  // ---- ground: GND pin and the sense network share one rail
  s.wire([vccX, ic.y + ic.h + 12], [vccX, GR]).wire([tx, GR], [vccX, GR]).ground(vccX, GR);

  // ---- motor, with C4 on OUTA and C5 on OUTB
  const mx = 640, my = 285, mr = 30;
  s.wire([rx, outA], [mx, outA], [mx, my - mr]);
  s.wire([rx, outB], [mx, outB], [mx, my + mr]);
  s.add(`<circle class="sch-w" cx="${mx}" cy="${my}" r="${mr}"/>`);
  s.text(mx, my + 5, 'M', { cls: 'sch-ictitle', anchor: 'middle' });
  s.text(mx - 12, my + mr + 20, 'Brushed DC motor', { cls: 'sch-val', anchor: 'end' });
  const cx = 570;
  s.dot(cx, outA).capacitor(cx, outA, cx, 110).groundUp(cx, 110).label(cx, 140, 'C4', val.c45, 'right');
  s.dot(cx, outB).capacitor(cx, outB, cx, outB + 60).ground(cx, outB + 60).label(cx, outB + 30, 'C5', val.c45, 'right');
  return s;
}
