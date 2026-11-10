// Schematic of the Silergy SY20516A four-switch buck-boost converter (DFN33-14), redrawn from the "Application Schematic
// (VOUT = 3.3V)" and its BOM list on page 12 of the datasheet (DS_SY20516A Rev 1.0). Figure 1 on page 1 shows the same circuit.
//
// Notes on how the drawing follows the datasheet:
//  - C1 (100 µF/16 V electrolytic) is in the BOM but not on the schematic, so it is not drawn.
//  - K1 (a switch from VIN to EN) is on the schematic but not in the BOM; it is drawn open, as in the datasheet, with the
//    terminal on its VIN side labelled VIN. R4 (1 MΩ) pulls EN to ground.
//  - R7 (0 Ω) joins VIN to SVIN, with C11 (1 µF) from SVIN to ground.
//  - The inductor L1 is between LX1 and LX2; PGND, SGND and the exposed pad all go to ground.
import { Sheet } from './lib.mjs';

export function buckBoost1MHz({ id, part = 'SY20516A' }) {
  const s = new Sheet(810, 560, {
    id,
    top: 50,
    title: `${part} application schematic, 3.3 V output`,
    desc:
      `Application schematic of the ${part} buck-boost converter with a 3.3 V output, redrawn from the datasheet. ` +
      `VIN (2.6 to 5.5 V) feeds the PVIN pin and has two 22 µF capacitors, C2 and C3, to ground. R7 (0 Ω) joins VIN to the SVIN pin, which has C11 (1 µF) to ground. ` +
      `The OUT pin is the output VOUT (2.6 to 3.8 V) with two 22 µF capacitors, C4 and C5, to ground. The feedback divider R1 (100 kΩ) from VOUT to FB and R2 (22.1 kΩ) from FB to ground sets 3.3 V. ` +
      `EN has R4 (1 MΩ) to ground and a switch K1 to VIN. COMP has R3 (20 kΩ) in series with C8 (2.2 nF) to ground. SGND and the exposed GND pad go to ground. ` +
      `The 2.2 µH inductor L1 connects LX1 to LX2. PGND goes to ground. PG, an open-drain output, has R6 (100 kΩ) to VIN. ` +
      `ISET has R5 (150 kΩ) and C7 (10 nF) in parallel to ground, SS has C6 (20 nF) to ground, and NC is not connected.`,
  });

  const ic = { x: 400, y: 100, w: 150, h: 412 };
  const lx = ic.x - 12;
  const rx = ic.x + ic.w + 12;
  const rows = [140, 196, 252, 308, 364, 420, 476]; // seven pins down each side
  const [r1, r2, r3, r4, r5, r6, r7] = rows;
  const padX = ic.x + ic.w / 2;

  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [
      { name: 'PVIN', y: r1 }, { name: 'SVIN', y: r2 }, { name: 'OUT', y: r3 }, { name: 'EN', y: r4 },
      { name: 'FB', y: r5 }, { name: 'COMP', y: r6 }, { name: 'SGND', y: r7 },
    ],
    right: [
      { name: 'LX1', y: r1 }, { name: 'PGND', y: r2 }, { name: 'LX2', y: r3 }, { name: 'PG', y: r4 },
      { name: 'ISET', y: r5 }, { name: 'SS', y: r6 }, { name: 'NC', y: r7 },
    ],
    bottom: [{ name: 'GND', x: padX }],
  }, { title: part });
  s.ground(padX, ic.y + ic.h + 12);

  // ---- input: VIN rail on PVIN, C2 and C3 hanging up to ground, R7 down to SVIN, C11 from SVIN to ground
  s.port(70, r1, 'VIN', 'in').text(24, r1 - 20, '2.6–5.5 V', { cls: 'sch-net', anchor: 'start' });
  s.wire([70, r1], [lx, r1]);
  s.dot(120, r1).capacitor(120, r1, 120, r1 - 40).groundUp(120, r1 - 40).label(120, r1 - 20, 'C2', '22 µF', 'left');
  s.dot(190, r1).capacitor(190, r1, 190, r1 - 40).groundUp(190, r1 - 40).label(190, r1 - 20, 'C3', '22 µF', 'right');
  s.dot(250, r1).resistor(250, r1, 250, r2).label(250, r1 + 28, 'R7', '0 Ω', 'right');
  s.dot(250, r2).wire([250, r2], [lx, r2]);
  s.capacitor(250, r2, 200, r2).ground(200, r2).label(225, r2, 'C11', '1 µF', 'above');

  // ---- output: OUT rail with C5, C4 and the feedback divider; VOUT is an open terminal on the left
  s.wire([lx, r3], [44, r3]);
  s.add(`<circle class="sch-w" cx="40" cy="${r3}" r="3.5"/>`);
  s.text(40, r3 - 14, 'VOUT 2.6–3.8 V', { cls: 'sch-net', anchor: 'start' });
  s.dot(80, r3).capacitor(80, r3, 80, r3 + 60).ground(80, r3 + 60).label(80, r3 + 18, 'C5', '22 µF', 'left');
  s.dot(140, r3).capacitor(140, r3, 140, r3 + 60).ground(140, r3 + 60).label(140, r3 + 18, 'C4', '22 µF', 'left');
  s.dot(200, r3).resistor(200, r3, 200, r5).label(200, r4 - 10, 'R1', '100 kΩ', 'left');
  s.dot(200, r5).wire([200, r5], [lx, r5]);
  s.resistor(200, r5, 200, r5 + 56).ground(200, r5 + 56).label(200, r5 + 22, 'R2', '22.1 kΩ', 'right');

  // ---- enable: R4 to ground, K1 (drawn open) to VIN
  s.wire([lx, r4], [300, r4]).dot(300, r4);
  s.resistor(300, r4, 250, r4).ground(250, r4);
  s.text(275, r4 + 28, 'R4', { cls: 'sch-ref', anchor: 'middle' });
  s.text(275, r4 + 41, '1 MΩ', { cls: 'sch-val', anchor: 'middle' });
  s.wire([300, r4], [300, r4 - 12]);
  s.add(`<circle class="sch-w" cx="300" cy="${r4 - 16}" r="3.5"/>`);
  s.wire([300, r4 - 19.5], [312, r4 - 38]);
  s.add(`<circle class="sch-w" cx="300" cy="${r4 - 42}" r="3.5"/>`);
  s.text(290, r4 - 38, 'VIN', { cls: 'sch-net', anchor: 'end' });
  s.text(322, r4 - 26, 'K1', { cls: 'sch-ref', anchor: 'start' });

  // ---- compensation: R3 in series with C8 to ground, drawn along the pin's row
  s.wire([lx, r6], [372, r6]).resistor(372, r6, 332, r6).wire([332, r6], [316, r6]);
  s.capacitor(316, r6, 292, r6).ground(292, r6);
  s.label(352, r6, 'R3', '20 kΩ', 'above').label(304, r6, 'C8', '2.2 nF', 'above');

  // ---- signal ground
  s.wire([lx, r7], [360, r7]).ground(360, r7);

  // ---- right side: inductor L1 from LX1 round to LX2, PGND to ground
  s.wire([rx, r1], [600, r1]).inductor(600, r1, 700, r1).label(650, r1, 'L1', '2.2 µH', 'above');
  s.wire([700, r1], [740, r1], [740, r3], [rx, r3]);
  s.wire([rx, r2], [610, r2]).ground(610, r2);

  // ---- PG: R6 pull-up to VIN
  s.wire([rx, r4], [610, r4]).resistor(610, r4, 700, r4).label(655, r4, 'R6', '100 kΩ', 'above');
  s.wire([700, r4], [726, r4]);
  s.add(`<circle class="sch-w" cx="730" cy="${r4}" r="3.5"/>`);
  s.text(742, r4 + 4, 'VIN', { cls: 'sch-net', anchor: 'start' });

  // ---- ISET: R5 and C7 to ground; SS: C6 to ground; NC left open
  s.wire([rx, r5], [720, r5]).dot(660, r5);
  s.resistor(660, r5, 660, r5 + 72).ground(660, r5 + 72).label(660, r5 + 34, 'R5', '150 kΩ', 'left');
  s.capacitor(720, r5, 720, r5 + 72).ground(720, r5 + 72).label(720, r5 + 34, 'C7', '10 nF', 'right');
  s.wire([rx, r6], [600, r6]);
  s.capacitor(600, r6, 600, r6 + 70).ground(600, r6 + 70).label(600, r6 + 36, 'C6', '20 nF', 'right');
  return s;
}
