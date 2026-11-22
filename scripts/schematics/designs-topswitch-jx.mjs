// Drawings for the Power Integrations TOPSwitch-JX family (TOP264-271): the two application examples of the datasheet,
// Figure 25 (19 V, 65 W adapter with a TOP269EG) and Figure 26 (12 V, 30 W open-frame supply with a TOP266VG).
// Designators are the datasheet's own. Both drawings are simplified, and the page captions say how:
//   - the fuse and the EMI filter at the AC input are one dashed box;
//   - capacitor voltage ratings are left to the parts tables, except for the bulk capacitor and the Y capacitor;
//   - the dual Schottky rectifier is drawn as one diode, and transformer pin numbers are shown but not winding polarity dots;
//   - in Figure 25 the optocoupler receiver (U3B with Q1, Q2, VR1, D3, R10, R12 and C9) is a labelled box, because its wiring
//     is too dense to redraw faithfully. The box connects the bias rail to the CONTROL pin through R25.
import { Sheet, refMarkup } from './lib.mjs';

const circle = (s, x, y) => s.add(`<circle class="sch-w" cx="${x}" cy="${y}" r="2.5"/>`);

/** Diode bridge on a 10-unit grid, after the SY23565 drawing: AC rows at yA and yB, bridge top at yT, bottom at yBot. */
function bridge(s, { xA = 100, xB = 150, yT, yA, yB, yBot, label, val }) {
  s.wire([xA, yA], [xA - 20, yA]);
  s.hwire(yB, xA - 20, xB, [xA]);
  s.diode(xA, yA, xA, yT).diode(xA, yBot, xA, yA).diode(xB, yB, xB, yT).diode(xB, yBot, xB, yB);
  s.dot(xA, yA).dot(xB, yB).dot(xB, yT).dot(xB, yBot);
  s.add(`<rect class="sch-w" stroke-dasharray="2 4" x="${xA - 18}" y="${yT - 22}" width="${xB - xA + 36}" height="${yBot - yT + 44}"/>`);
  s.text((xA + xB) / 2, yBot + 38, label, { cls: 'sch-ref', anchor: 'middle' });
  s.text((xA + xB) / 2, yBot + 51, val, { cls: 'sch-val', anchor: 'middle' });
}

/** AC terminals L and N, and the dashed box standing for the fuse and EMI filter, joined to the bridge's AC leads at x = 80. */
function acInput(s, yA, yB) {
  circle(s, 12, yA); circle(s, 12, yB);
  s.text(6, yA - 14, 'L', { cls: 'sch-net' }).text(6, yB - 14, 'N', { cls: 'sch-net' });
  s.wire([14, yA], [30, yA]).wire([14, yB], [30, yB]).wire([70, yA], [80, yA]).wire([70, yB], [80, yB]);
  s.add(`<rect class="sch-w" stroke-dasharray="2 4" x="30" y="${yA - 22}" width="40" height="${yB - yA + 44}"/>`);
  s.text(50, (yA + yB) / 2 - 4, 'EMI', { cls: 'sch-val', anchor: 'middle' }).text(50, (yA + yB) / 2 + 9, 'filter', { cls: 'sch-val', anchor: 'middle' });
}

/** Phototransistor, collector up. Collector terminal at (x + 14, yc - 30), emitter at (x + 14, yc + 30); two light arrows arrive from the left. */
function phototransistor(s, x, yc) {
  const xt = x + 14;
  s.wire([x, yc - 14], [x, yc + 14]);
  s.wire([xt, yc - 30], [xt, yc - 18], [x + 2, yc - 6]);
  s.wire([x + 2, yc + 6], [xt, yc + 18], [xt, yc + 30]);
  s.add(`<path class="sch-dot" d="M${xt - 1} ${yc + 18} L${xt - 9} ${yc + 15} L${xt - 5} ${yc + 10} Z"/>`);
  for (const dy of [-10, 4]) s.wire([x - 22, yc + dy - 6], [x - 8, yc + dy + 4]).wire([x - 14, yc + dy + 5], [x - 8, yc + dy + 4], [x - 11, yc + dy - 2]);
}

/** Small helpers bound to a sheet. */
function kit(s) {
  return {
    vres(x, y1, y2, name, val, side = 'right') {
      s.resistor(x, y1, x, y2);
      s.label(x, (y1 + y2) / 2, name, val, side);
    },
    vcap(x, y1, y2, name, val, side = 'right', polarized = false) {
      s.capacitor(x, y1, x, y2, { polarized });
      s.label(x, (y1 + y2) / 2, name, val, side);
    },
    /** One-line "REF value" label, left-aligned at (x, y). */
    line(x, y, name, val, w = 28) {
      s.text(x, y, refMarkup(name), { cls: 'sch-ref', raw: true });
      s.text(x + w, y, val, { cls: 'sch-val' });
    },
  };
}

// =====================================================================================================================
// Figure 25: 90-265 VAC in, 19 V / 3.42 A out, TOP269EG
// =====================================================================================================================
export function adapter65w({ id = 'top269-fig25' } = {}) {
  const s = new Sheet(1620, 660, {
    id,
    top: 20,
    minWidth: 1300,
    title: 'TOP269EG 19 V, 65 W adapter',
    desc:
      'Redrawn from Figure 25 of the TOPSwitch-JX datasheet: a 90 to 265 VAC input, 19 V at 3.42 A output flyback adapter built around a TOP269EG (U1). ' +
      'An EMI filter feeds the diode bridge D1 and the bulk capacitor C2. The bus feeds the top of the transformer T1 primary, whose bottom is the DRAIN pin. ' +
      'Resistors R3 and R4 in series from the bus feed the VOLTAGE-MONITOR pin V, and a 191 kΩ resistor R20 joins V to the CONTROL pin. ' +
      'Resistors R7 and R8 in series from the bus feed the EXTERNAL CURRENT LIMIT pin X, with R9 from X to the source. ' +
      'A clamp of the Zener VR2 with R5, the resistors R11 and R29, the capacitor C4 with R6 and R28, and the diode D2 limits the drain spike. ' +
      'A bias winding charges C10 through D4. A box stands for the optocoupler receiver U3B and its transistors, between the bias rail and the CONTROL pin through R25. ' +
      'The secondary has the dual Schottky diode D5 with an R15 and C12 snubber and output capacitors C13, C14 and C21. ' +
      'The output feedback uses the optocoupler LED U3A, the shunt regulator U2 with its divider R17 and R18, and compensation parts R16, R22, C19, R19, C16 and C22.',
  });
  const { vres, vcap, line } = kit(s);
  const yT = 110; // bus rail
  const yR = 600; // primary return

  // ------------------------------------------------------------ AC input, bridge, bulk capacitor
  acInput(s, 150, 230);
  bridge(s, { yT, yA: 150, yB: 230, yBot: 270, label: 'D1', val: 'GBU8J' });
  s.wire([100, yT], [860, yT]);
  s.wire([100, 270], [240, 270]).dot(200, 270);
  s.dot(200, yT).capacitor(200, yT, 200, 270, { polarized: true });
  s.label(200, 190, 'C2', '120 µF 400 V', 'right');
  s.wire([240, 270], [240, yR]);

  // ------------------------------------------------------------ the controller
  const ic = { x: 520, y: 400, w: 250, h: 110 };
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    top: [{ name: 'D', x: 560 }, { name: 'V', x: 620 }],
    right: [{ name: 'C', y: 440 }],
    bottom: [{ name: 'S', x: 560 }, { name: 'X', x: 620 }, { name: 'F', x: 740 }],
  }, { title: 'TOP269EG', subtitle: 'U1' });
  s.wire([240, yR], [1010, yR]);
  s.wire([560, 522], [560, yR]).dot(560, yR);
  s.wire([740, 522], [740, yR]).dot(740, yR);

  // line sense: R3, R4 to V
  s.dot(280, yT);
  vres(280, yT, 200, 'R3', '5.1 MΩ', 'left');
  vres(280, 200, 290, 'R4', '5.1 MΩ', 'left');
  s.wire([280, 290], [280, 350]);
  s.hwire(350, 280, 620, [370, 560]);
  s.wire([620, 350], [620, 388]).dot(620, 350);
  // external current limit: R7, R8 to X, R9 to the return
  s.dot(370, yT);
  vres(370, yT, 200, 'R7', '10 MΩ', 'left');
  vres(370, 200, 290, 'R8', '10 MΩ', 'left');
  s.wire([370, 290], [370, 540]);
  s.hwire(540, 370, 620, [560]);
  s.wire([620, 522], [620, 540]).dot(620, 540);
  vres(620, 540, yR, 'R9', '11 kΩ 1 %', 'right');
  s.dot(620, yR);
  // R20 from V to C
  s.resistor(620, 350, 800, 350);
  s.text(710, 376, refMarkup('R20'), { cls: 'sch-ref', anchor: 'middle', raw: true }).text(710, 389, '191 kΩ 1 %', { cls: 'sch-val', anchor: 'middle' });
  s.wire([800, 350], [800, 440]);
  // CONTROL pin: bypass C6 and the R13 / C7 pair
  s.wire([782, 440], [860, 440]).dot(800, 440).dot(860, 440);
  s.capacitor(800, 440, 800, yR).dot(800, yR);
  s.label(800, 520, 'C6', '100 nF', 'left');
  s.resistor(860, 440, 860, 490);
  s.capacitor(860, 490, 860, yR).dot(860, yR);
  s.label(860, 465, 'R13', '6.8 Ω', 'right');
  s.label(860, 545, 'C7', '47 µF', 'right');

  // ------------------------------------------------------------ primary and drain
  s.wire([860, yT], [860, 150]).inductor(860, 150, 860, 230);
  s.wire([860, 230], [860, 330]).hwire(330, 860, 560, []).wire([560, 330], [560, 388]).dot(560, 330);
  s.text(844, 140, '3', { cls: 'sch-val', anchor: 'end' }).text(844, 322, '1', { cls: 'sch-val', anchor: 'end' });
  line(858, 428, 'T1', 'RM10', 18);

  // ------------------------------------------------------------ clamp: R11, R29, VR2 + R5, C4 + (R6 || R28), D2
  for (const x of [450, 510, 610]) s.dot(x, yT);
  vres(450, yT, 210, 'R11', '300 Ω', 'left');
  vres(510, yT, 210, 'R29', '300 Ω', 'right');
  s.diode(610, 165, 610, yT, { kind: 'zener' }).resistor(610, 165, 610, 210);
  s.label(610, 138, 'VR2', 'SMAJ250A', 'right');
  s.label(610, 190, 'R5', '300 Ω', 'right');
  s.wire([720, 210], [450, 210]).dot(510, 210).dot(610, 210);
  s.dot(720, yT).capacitor(720, yT, 720, 150);
  s.label(720, 130, 'C4', '1000 pF 630 V', 'right');
  s.dot(720, 150).resistor(720, 150, 720, 210).wire([720, 150], [780, 150]).resistor(780, 150, 780, 210).wire([780, 210], [720, 210]);
  s.dot(720, 210);
  s.label(720, 180, 'R6', '150 Ω', 'left');
  s.label(780, 180, 'R28', '300 Ω', 'right');
  s.diode(720, 330, 720, 210).dot(720, 330);
  s.label(720, 270, 'D2', 'RS1K', 'right');

  // ------------------------------------------------------------ Y capacitor, core, secondary, snubber, output
  s.dot(830, yT).wire([830, yT], [830, 60]).capacitor(830, 60, 936, 60).wire([936, 60], [936, 230]);
  s.label(883, 60, 'C11', '1 nF 250 VAC', 'above');
  s.wire([883, 130], [883, 410]).wire([888, 130], [888, 410]);
  s.inductor(911, 150, 911, 230, { flip: true });
  s.hwire(150, 911, 960, [936]);
  s.dot(960, 150).diode(960, 150, 1040, 150).dot(1040, 150);
  s.text(1000, 124, 'D5', { cls: 'sch-ref', anchor: 'middle' }).text(1000, 137, 'V30100C', { cls: 'sch-val', anchor: 'middle' });
  s.wire([960, 150], [960, 100]).capacitor(960, 100, 1000, 100).resistor(1000, 100, 1040, 100).wire([1040, 100], [1040, 150]);
  s.label(980, 100, 'C12', '1 nF', 'above');
  s.label(1020, 100, 'R15', '33 Ω', 'above');
  s.wire([1040, 150], [1570, 150]);
  for (const [x, nm, v] of [[1080, 'C13', '470 µF'], [1165, 'C14', '470 µF'], [1250, 'C21', '10 nF']]) {
    s.dot(x, 150).capacitor(x, 150, x, 230, { polarized: nm !== 'C21' }).dot(x, 230);
    s.label(x, 192, nm, v, 'right');
  }
  s.dot(936, 230).hwire(230, 936, 1560, [1310, 1390]);
  circle(s, 1570, 150); circle(s, 1570, 230);
  s.wire([1560, 230], [1570, 230]);
  s.text(1604, 136, '19 V, 3.42 A', { cls: 'sch-net', anchor: 'end' });
  s.text(1604, 252, 'RTN', { cls: 'sch-net', anchor: 'end' });

  // ------------------------------------------------------------ bias winding, C10, D4 with its snubber
  s.inductor(911, 285, 911, 365, { flip: true });
  s.text(927, 281, '5', { cls: 'sch-val' }).text(927, 381, '4', { cls: 'sch-val' });
  s.wire([911, 285], [1155, 285]).dot(1010, 285);
  s.capacitor(1010, 285, 1010, 365, { polarized: true });
  s.label(1010, 325, 'C10', '56 µF 35 V', 'right');
  s.dot(1010, 365).wire([1010, 365], [1010, yR]);
  s.diode(1010, 365, 911, 365).dot(936, 365);
  s.label(960, 365, 'D4', 'BAV21WS-7-F', 'above');
  s.wire([936, 365], [936, 395]).resistor(936, 395, 972, 395).capacitor(972, 395, 1010, 395).dot(1010, 395);
  line(936, 414, 'R14', '20 Ω');
  line(936, 427, 'C15', '470 pF');

  // optocoupler receiver box, then R25 into the CONTROL pin
  s.add('<rect class="sch-ic" x="1100" y="315" width="110" height="76" rx="3" stroke-dasharray="3 3"/>');
  s.text(1155, 337, 'U3B, Q1, Q2', { cls: 'sch-pin', anchor: 'middle' });
  s.text(1155, 353, 'VR1, D3, R10', { cls: 'sch-val', anchor: 'middle' });
  s.text(1155, 369, 'R12, C9', { cls: 'sch-val', anchor: 'middle' });
  s.wire([1155, 285], [1155, 315]).wire([1155, 391], [1155, 440]);
  s.hwire(440, 860, 1030, [1010]).resistor(1030, 440, 1110, 440).wire([1110, 440], [1155, 440]);
  s.text(1070, 462, refMarkup('R25'), { cls: 'sch-ref', anchor: 'middle', raw: true }).text(1070, 475, '20 Ω', { cls: 'sch-val', anchor: 'middle' });
  s.text(1165, 281, 'bias rail', { cls: 'sch-val' });

  // ------------------------------------------------------------ feedback network (secondary)
  const yS = 600;
  s.dot(1310, 150).dot(1390, 150);
  s.wire([1390, 150], [1390, 260]);
  // R16 with R22 + C19 across it
  s.dot(1390, 260).resistor(1390, 260, 1390, 350).dot(1390, 350);
  s.label(1390, 305, 'R16', '20 kΩ', 'left');
  s.wire([1390, 260], [1440, 260]).resistor(1440, 260, 1440, 300).capacitor(1440, 300, 1440, 350).wire([1440, 350], [1390, 350]);
  s.label(1440, 280, 'R22', '1.6 kΩ', 'right');
  s.label(1440, 325, 'C19', '6.8 nF', 'right');
  // optocoupler LED with R27 across it
  s.wire([1390, 350], [1390, 370]).dot(1390, 370).diode(1390, 370, 1390, 450, { kind: 'led', side: -1 }).dot(1390, 450);
  s.wire([1390, 370], [1440, 370]).resistor(1440, 370, 1440, 450).wire([1440, 450], [1390, 450]);
  s.label(1440, 410, 'R27', '10 kΩ', 'right');
  s.text(1372, 405, 'U3A', { cls: 'sch-ref', anchor: 'end' });
  // shunt regulator U2, its cathode capacitor C22 and the reference divider
  s.wire([1390, 450], [1390, 530]).dot(1390, 490).dot(1390, 505);
  s.diode(1390, 590, 1390, 530, { kind: 'zener' });
  s.text(1406, 566, 'U2', { cls: 'sch-ref' }).text(1406, 579, 'LMV431AIMF', { cls: 'sch-val' });
  s.wire([1390, 590], [1390, yS]).dot(1390, yS);
  s.wire([1390, 505], [1480, 505]);
  s.capacitor(1480, 505, 1480, yS).dot(1480, yS);
  s.label(1480, 552, 'C22', '100 nF', 'right');
  s.wire([1310, 150], [1310, 380]);
  vres(1310, 380, 470, 'R17', '147 kΩ 1 %', 'left');
  s.wire([1310, 470], [1310, 552]).dot(1310, 552).dot(1310, 490);
  s.wire([1310, 552], [1382, 552]);
  vres(1310, 552, yS, 'R18', '10 kΩ 1 %', 'left');
  // compensation: R19 and C16 from the U2 cathode to the reference
  s.resistor(1390, 490, 1350, 490).capacitor(1350, 490, 1310, 490);
  s.text(1370, 458, refMarkup('R19'), { cls: 'sch-ref', anchor: 'middle', raw: true }).text(1370, 483, '20 kΩ', { cls: 'sch-val', anchor: 'middle' });
  s.text(1330, 512, refMarkup('C16'), { cls: 'sch-ref', anchor: 'middle', raw: true }).text(1330, 525, '22 nF', { cls: 'sch-val', anchor: 'middle' });
  // secondary return column and bottom row
  s.wire([1310, yS], [1560, yS]);
  s.wire([1560, 230], [1560, yS]).dot(1560, 230);
  return s;
}

// =====================================================================================================================
// Figure 26: 85-264 VAC in, 12 V / 2.5 A out, TOP266VG
// =====================================================================================================================
export function openFrame30w({ id = 'top266-fig26' } = {}) {
  const s = new Sheet(1580, 660, {
    id,
    top: 20,
    minWidth: 1300,
    title: 'TOP266VG 12 V, 30 W open-frame supply',
    desc:
      'Redrawn from Figure 26 of the TOPSwitch-JX datasheet: an 85 to 264 VAC input, 12 V at 2.5 A output open-frame flyback supply built around a TOP266VG (U1). ' +
      'An EMI filter feeds the diode bridge D1 to D4 and the bulk capacitor C3. The bus feeds the top of the transformer T1 primary, whose bottom is the DRAIN pin. ' +
      'Resistors R1 and R2 in series from the bus feed the VOLTAGE-MONITOR pin V, and a 191 kΩ resistor R12 joins V to the CONTROL pin. ' +
      'Resistors R3 and R4 in series from the bus feed the EXTERNAL CURRENT LIMIT pin X, with R15 from X to the source. ' +
      'A clamp of the Zener VR1 in series with R5, in parallel with C4, and the diode D5 limits the drain spike. ' +
      'A bias winding charges C7 through D7. The phototransistor U2B connects the bias rail to the CONTROL pin. ' +
      'A path of R9, the Zener VR3 and the diode D6 from the bias rail to the V pin shuts the supply down on an output overvoltage. ' +
      'The secondary has the Schottky diodes D8 and D9 with an R17 and C12 snubber, output capacitors C14 and C15, an inductor L2 and C16. ' +
      'The output feedback uses the optocoupler LED U2A and the shunt regulator U3 with its divider R21 and R23.',
  });
  const { vres, line } = kit(s);
  const yT = 110;
  const yR = 600;

  // ------------------------------------------------------------ AC input, bridge, bulk capacitor
  acInput(s, 150, 230);
  bridge(s, { yT, yA: 150, yB: 230, yBot: 270, label: 'D1–D4', val: '1N4007' });
  s.wire([100, yT], [860, yT]);
  s.wire([100, 270], [240, 270]).dot(200, 270);
  s.dot(200, yT).capacitor(200, yT, 200, 270, { polarized: true });
  s.label(200, 190, 'C3', '82 µF 400 V', 'right');
  s.wire([240, 270], [240, yR]);

  // ------------------------------------------------------------ controller
  const ic = { x: 520, y: 400, w: 250, h: 110 };
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    top: [{ name: 'D', x: 560 }, { name: 'V', x: 620 }],
    right: [{ name: 'C', y: 440 }],
    bottom: [{ name: 'S', x: 560 }, { name: 'X', x: 620 }, { name: 'F', x: 740 }],
  }, { title: 'TOP266VG', subtitle: 'U1' });
  s.wire([240, yR], [1030, yR]);
  s.wire([560, 522], [560, yR]).dot(560, yR);
  s.wire([740, 522], [740, yR]).dot(740, yR);

  // line sense R1, R2 to V
  s.dot(280, yT);
  vres(280, yT, 200, 'R1', '5.1 MΩ', 'left');
  vres(280, 200, 290, 'R2', '5.1 MΩ', 'left');
  s.wire([280, 290], [280, 350]);
  s.hwire(350, 280, 620, [370, 560]);
  s.wire([620, 350], [620, 388]).dot(620, 350);
  // external current limit R3, R4 to X, R15 to the return
  s.dot(370, yT);
  vres(370, yT, 200, 'R3', '10 MΩ', 'left');
  vres(370, 200, 290, 'R4', '10 MΩ', 'left');
  s.wire([370, 290], [370, 540]);
  s.hwire(540, 370, 620, [560]);
  s.wire([620, 522], [620, 540]).dot(620, 540);
  vres(620, 540, yR, 'R15', '14.3 kΩ 1 %', 'right');
  s.dot(620, yR);
  // R12 from V to C
  s.resistor(620, 350, 800, 350);
  s.text(740, 376, refMarkup('R12'), { cls: 'sch-ref', anchor: 'middle', raw: true }).text(740, 389, '191 kΩ 1 %', { cls: 'sch-val', anchor: 'middle' });
  s.wire([800, 350], [800, 440]);
  // CONTROL pin: bypass C9 and the R16 / C10 pair
  s.wire([782, 440], [860, 440]).dot(800, 440).dot(860, 440);
  s.capacitor(800, 440, 800, yR).dot(800, yR);
  s.label(800, 520, 'C9', '100 nF', 'left');
  s.resistor(860, 440, 860, 490);
  s.capacitor(860, 490, 860, yR).dot(860, yR);
  s.label(860, 465, 'R16', '6.8 Ω', 'right');
  s.label(860, 545, 'C10', '47 µF', 'right');

  // ------------------------------------------------------------ primary and drain
  s.wire([860, yT], [860, 150]).inductor(860, 150, 860, 230);
  s.wire([860, 230], [860, 330]).hwire(330, 860, 560, [680]).wire([560, 330], [560, 388]).dot(560, 330);
  s.text(844, 140, '6', { cls: 'sch-val', anchor: 'end' }).text(844, 322, '4', { cls: 'sch-val', anchor: 'end' });
  s.label(860, 190, 'T1', 'EF25', 'left');

  // ------------------------------------------------------------ clamp: VR1 + R5 in parallel with C4, then D5
  s.dot(610, yT).dot(720, yT);
  s.diode(610, 165, 610, yT, { kind: 'zener' }).resistor(610, 165, 610, 210);
  s.label(610, 138, 'VR1', 'P6KE180A', 'left');
  s.label(610, 190, 'R5', '10 kΩ ½ W', 'left');
  s.capacitor(720, yT, 720, 210);
  s.label(720, 160, 'C4', '4.7 nF', 'right');
  s.wire([610, 210], [720, 210]).dot(720, 210);
  s.diode(720, 330, 720, 290).wire([720, 290], [720, 210]).dot(720, 330);
  s.label(720, 310, 'D5', 'FR107', 'right');

  // ------------------------------------------------------------ Y capacitor, core, secondary, snubber, output filter
  s.dot(830, yT).wire([830, yT], [830, 60]).capacitor(830, 60, 936, 60).wire([936, 60], [936, 230]);
  s.label(883, 60, 'C11', '1 nF 250 VAC', 'above');
  s.wire([883, 130], [883, 410]).wire([888, 130], [888, 410]);
  s.inductor(911, 150, 911, 230, { flip: true });
  s.hwire(150, 911, 960, [936]);
  s.dot(960, 150).diode(960, 150, 1040, 150).dot(1040, 150);
  s.text(1000, 176, 'D8, D9', { cls: 'sch-ref', anchor: 'middle' }).text(1000, 189, 'SB560', { cls: 'sch-val', anchor: 'middle' });
  s.wire([960, 150], [960, 100]).capacitor(960, 100, 1000, 100).resistor(1000, 100, 1040, 100).wire([1040, 100], [1040, 150]);
  s.label(980, 100, 'C12', '1 nF', 'above');
  s.label(1020, 100, 'R17', '22 Ω', 'above');
  for (const [x, nm, v] of [[1090, 'C14', '680 µF'], [1150, 'C15', '680 µF']]) {
    s.dot(x, 150).capacitor(x, 150, x, 230, { polarized: true }).dot(x, 230);
    s.label(x, 192, nm, v, 'right');
  }
  s.wire([1040, 150], [1210, 150]);
  s.dot(1190, 150);
  s.inductor(1210, 150, 1290, 150);
  s.label(1250, 150, 'L2', '3.3 µH', 'above');
  s.wire([1290, 150], [1530, 150]);
  s.dot(1300, 150).capacitor(1300, 150, 1300, 230, { polarized: true }).dot(1300, 230);
  s.label(1300, 192, 'C16', '100 µF', 'right');
  s.dot(936, 230).hwire(230, 936, 1500, [1190, 1380, 1470]);
  circle(s, 1530, 150); circle(s, 1530, 230);
  s.wire([1500, 230], [1530, 230]).dot(1500, 230);
  s.text(1540, 136, '12 V, 2.5 A', { cls: 'sch-net', anchor: 'end' });
  s.text(1540, 252, 'RTN', { cls: 'sch-net', anchor: 'end' });

  // ------------------------------------------------------------ bias winding, D7, C7; opto phototransistor; overvoltage path
  s.inductor(911, 320, 911, 400, { flip: true });
  s.text(927, 316, '1', { cls: 'sch-val' }).text(927, 416, '2', { cls: 'sch-val' });
  s.diode(911, 320, 1030, 320).wire([1030, 320], [1100, 320]).dot(1030, 320);
  s.text(938, 342, refMarkup('D7'), { cls: 'sch-ref', anchor: 'middle', raw: true }).text(970, 355, 'BAV21WS-7-F', { cls: 'sch-val', anchor: 'middle' });
  s.capacitor(1030, 320, 1030, 400, { polarized: true });
  s.label(1030, 360, 'C7', '47 µF', 'right');
  s.wire([911, 400], [1030, 400]).dot(1030, 400).wire([1030, 400], [1030, yR]);
  s.wire([1100, 320], [1100, 380]);
  phototransistor(s, 1086, 410);
  s.text(1130, 470, refMarkup('U2B'), { cls: 'sch-ref', anchor: 'middle', raw: true }).text(1130, 483, 'LTV817D', { cls: 'sch-val', anchor: 'middle' });
  s.hwire(440, 860, 1100, [1030]);
  // output-overvoltage path: bias rail -> R9 -> VR3 -> D6 -> V pin
  s.dot(1100, 320).wire([1100, 320], [1100, 262]);
  s.resistor(1100, 262, 1040, 262);
  s.diode(930, 262, 990, 262, { kind: 'zener' }).wire([990, 262], [1040, 262]);
  s.hwire(262, 930, 680, [885.5, 860, 720]);
  s.diode(680, 262, 680, 318).wire([680, 318], [680, 350]).dot(680, 350);
  s.text(1070, 284, refMarkup('R9'), { cls: 'sch-ref', anchor: 'middle', raw: true }).text(1070, 297, '10 Ω', { cls: 'sch-val', anchor: 'middle' });
  s.text(960, 284, refMarkup('VR3'), { cls: 'sch-ref', anchor: 'middle', raw: true }).text(960, 297, 'ZMM5245B-7', { cls: 'sch-val', anchor: 'middle' });
  s.text(664, 286, refMarkup('D6'), { cls: 'sch-ref', anchor: 'end', raw: true }).text(664, 299, 'BAV19WS', { cls: 'sch-val', anchor: 'end' });

  // ------------------------------------------------------------ feedback network (secondary)
  const yS = 600;
  s.dot(1380, 150).dot(1470, 150);
  s.wire([1190, 150], [1190, 260]);
  // R19 with R18 + C18 across it
  s.dot(1190, 260).resistor(1190, 260, 1190, 330).dot(1190, 330);
  s.label(1190, 295, 'R19', '470 Ω', 'left');
  s.wire([1190, 260], [1240, 260]).resistor(1240, 260, 1240, 300).capacitor(1240, 300, 1240, 330).wire([1240, 330], [1190, 330]);
  s.label(1240, 280, 'R18', '110 Ω', 'right');
  s.label(1240, 315, 'C18', '47 nF', 'right');
  // optocoupler LED, then the cathode node K
  s.wire([1190, 330], [1190, 380]).diode(1190, 380, 1190, 460, { kind: 'led', side: -1 });
  s.text(1172, 420, 'U2A', { cls: 'sch-ref', anchor: 'end' });
  s.wire([1190, 460], [1190, 530]).dot(1190, 500);
  // D10 from K up to the output, and C20 from K to the reference
  s.wire([1190, 500], [1380, 500]);
  s.diode(1380, 500, 1380, 330);
  s.wire([1380, 330], [1380, 150]);
  s.label(1380, 415, 'D10', 'LL4148', 'left');
  s.dot(1300, 500).capacitor(1300, 500, 1300, 552).dot(1300, 552);
  s.label(1300, 526, 'C20', '33 nF', 'left');
  // shunt regulator U3 and the divider R21 / R23
  s.diode(1190, 590, 1190, 530, { kind: 'zener' });
  s.text(1206, 566, 'U3', { cls: 'sch-ref' }).text(1206, 579, 'LMV431A', { cls: 'sch-val' });
  s.wire([1190, 590], [1190, yS]).dot(1190, yS);
  s.wire([1198, 552], [1470, 552]);
  s.wire([1470, 150], [1470, 420]);
  vres(1470, 420, 510, 'R21', '86.6 kΩ 1 %', 'left');
  s.wire([1470, 510], [1470, 552]).dot(1470, 552);
  vres(1470, 552, yS, 'R23', '10 kΩ 1 %', 'left');
  s.wire([1190, yS], [1500, yS]).dot(1470, yS);
  s.wire([1500, 230], [1500, yS]);
  return s;
}
