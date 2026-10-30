// Schematic of the Silergy SY23505B PFC + LLC controller, redrawn from Figure 1 of its datasheet.
// Kept apart from designs.mjs because it is by far the largest drawing. Designators follow the datasheet; the datasheet gives
// no component values, so none are drawn.
import { Sheet, refMarkup } from './lib.mjs';

export function pfcLlc({ id, part }) {
  const s = new Sheet(1230, 710, {
    id,
    top: 60,
    minWidth: 980,
    title: `${part} PFC and LLC reference circuit`,
    desc:
      `Typical application of the ${part} PFC and LLC controller, redrawn from the datasheet. ` +
      `AC line and neutral pass through a fuse F1 and an EMI filter to the bridge BD1. Diodes D1 and D2 take the AC input to a divider R1 and R2, with C1 across R2, that feeds the LNS pin. ` +
      `The boost PFC stage is the inductor L1, the MOSFET Q3 and the diode D3, with a bypass diode D4 from the bridge output to the bulk capacitor C3. ` +
      `C2 filters the bridge output. R4 is the PFC current-sense resistor in the bridge return, and R3 feeds it to the CS pin. R5 from the Q3 gate to ground, with the GATEB pin on the gate, doubles as a configuration resistor. ` +
      `R12 from the Q3 drain node feeds the HV pin, and R6 and R7 across C3 feed the FBB pin. ` +
      `The LLC stage is the half bridge Q1 and Q2 across C3, driven from the GATEH and GATEL pins, with C6 and D5 as the bootstrap supply between the HS and HB pins. ` +
      `From the switching node, the resonant inductor L2 feeds the transformer T1, whose primary has the magnetizing inductance Lm and whose return goes through the resonant capacitor C4. ` +
      `C5 and R11 tap the resonant current, and R8 carries it to the ISEN pin. T1 has a centre-tapped secondary with rectifier diodes DS1 and DS2 and output capacitor CS1, and an auxiliary winding. ` +
      `The auxiliary winding feeds VCC through D6 and C7, and a divider R9 and R10 from it feeds the VSEN pin. ` +
      `On the secondary, a divider RS1 and RS2 sets the reference of a shunt regulator QS1, with CS2 and RS3 in its compensation. QS1 sinks the current of the optocoupler LED in US1, which has the series resistor RS4. The optocoupler transistor pulls the FBL pin down.`,
  });

  const ref = (x, y, name, anchor = 'start') => s.text(x, y, refMarkup(name), { cls: 'sch-ref', anchor, raw: true });
  const circle = (x, y) => s.add(`<circle class="sch-w" cx="${x}" cy="${y}" r="2.5"/>`);

  // ---------------------------------------------------------------- AC input, fuse, EMI filter
  circle(26, 220); circle(26, 260);
  s.text(8, 224, 'L', { cls: 'sch-net' }).text(8, 264, 'N', { cls: 'sch-net' });
  s.wire([28, 220], [36, 220]).wire([66, 220], [80, 220]).wire([28, 260], [80, 260]);
  s.add('<rect class="sch-w" x="36" y="214" width="30" height="12"/>').wire([36, 220], [66, 220]);
  ref(51, 207, 'F1', 'middle');
  s.add('<rect class="sch-ic" x="80" y="190" width="60" height="100" rx="3"/>');
  s.text(110, 236, 'EMI', { cls: 'sch-val', anchor: 'middle' }).text(110, 250, 'filter', { cls: 'sch-val', anchor: 'middle' });

  // ---------------------------------------------------------------- bridge BD1 (two columns of two diodes)
  const xA = 240, xB = 285, yT = 150, yBot = 330, yA = 220, yB = 260;
  s.wire([140, yA], [xA, yA]).hwire(yB, 140, xB, [195, xA]);
  s.diode(xA, yA, xA, yT).diode(xA, yBot, xA, yA).diode(xB, yB, xB, yT).diode(xB, yBot, xB, yB);
  s.dot(xA, yA).dot(xB, yB).dot(195, yA).dot(160, yB);
  s.wire([xA, yT], [330, yT]).dot(xB, yT).dot(330, yT);
  s.wire([xA, yBot], [330, yBot]).dot(xB, yBot).dot(330, yBot);
  s.add('<rect class="sch-w" stroke-dasharray="2 4" x="224" y="128" width="86" height="222"/>');
  s.text(267, 368, 'BD1', { cls: 'sch-ref', anchor: 'middle' });

  // ---------------------------------------------------------------- D1/D2, R1/R2 and C1 to the LNS pin
  s.wire([195, yA], [195, 290]).diode(195, 290, 195, 330).wire([195, 330], [195, 350], [160, 350]);
  s.wire([160, yB], [160, 290]).diode(160, 290, 160, 330).wire([160, 330], [160, 350]).dot(160, 350);
  s.resistor(160, 350, 160, 510).dot(160, 510).resistor(160, 510, 160, 590).ground(160, 590);
  s.dot(210, 510).capacitor(210, 510, 210, 570).ground(210, 570);
  s.wire([160, 510], [548, 510]);
  ref(206, 314, 'D1'); ref(144, 314, 'D2', 'end'); ref(176, 432, 'R1'); ref(176, 555, 'R2'); ref(226, 543, 'C1');

  // ---------------------------------------------------------------- boost PFC: C2, L1, Q3, R4, D3, D4, C3
  s.capacitor(330, yT, 330, yBot);
  ref(346, 243, 'C2');
  s.wire([330, yT], [340, yT]).inductor(340, yT, 388, yT).wire([388, yT], [410, yT]).dot(410, yT);
  ref(364, 136, 'L1', 'middle');
  s.wire([410, yT], [410, 200]).nmosV(410, 200, 300).wire([410, 300], [410, yBot]).dot(410, yBot).ground(410, yBot);
  ref(424, 218, 'Q3');
  s.wire([340, yBot], [330, yBot]).resistor(340, yBot, 400, yBot).wire([400, yBot], [410, yBot]);
  ref(370, 316, 'R4', 'middle');
  // R3 from the bridge return to the CS pin
  s.resistor(330, yBot, 330, 440).wire([330, 440], [330, 480], [548, 480]);
  ref(346, 388, 'R3');
  // Q3 gate: R5 to ground, GATEB lane
  s.wire([432, 250], [448, 250]).dot(448, 250).resistor(448, 250, 448, 330).ground(448, 330);
  ref(432, 293, 'R5', 'end');
  s.wire([448, 250], [464, 250], [464, 450], [548, 450]);
  // D4 bypass and the rail to the bulk capacitor
  s.wire([330, yT], [330, 100], [440, 100]).diode(440, 100, 500, 100).wire([500, 100], [640, 100], [640, yT]);
  ref(470, 88, 'D4', 'middle');
  s.wire([410, yT], [520, yT]).dot(486, yT).diode(520, yT, 570, yT).wire([570, yT], [830, yT]);
  ref(545, 136, 'D3', 'middle');
  // R12 to HV
  s.resistor(486, yT, 486, 260).wire([486, 260], [486, 420], [548, 420]);
  ref(502, 206, 'R12');
  // R6/R7 divider to FBB; C3
  s.dot(600, yT).resistor(600, yT, 600, 240).dot(600, 240).resistor(600, 240, 600, 300).ground(600, 300);
  s.wire([600, 240], [508, 240], [508, 390], [548, 390]);
  ref(616, 198, 'R6'); ref(616, 276, 'R7');
  s.dot(640, yT).capacitor(640, yT, 640, 300).ground(640, 300);
  ref(656, 228, 'C3');
  s.text(700, 140, 'VBULK', { cls: 'sch-net' });

  // ---------------------------------------------------------------- the controller
  s.ic(550, 360, 140, 240, {
    left: [{ name: 'FBB', y: 390 }, { name: 'HV', y: 420 }, { name: 'GATEB', y: 450 }, { name: 'CS', y: 480 }, { name: 'LNS', y: 510 }, { name: 'FBL', y: 540 }],
    right: [{ name: 'GATEH', y: 390 }, { name: 'HB', y: 420 }, { name: 'HS', y: 450 }, { name: 'VCC', y: 480 }, { name: 'GATEL', y: 510 }, { name: 'ISEN', y: 540 }, { name: 'VSEN', y: 570 }],
    bottom: [{ name: 'GND', x: 620 }],
  });
  s.text(620, 350, part, { cls: 'sch-ictitle', anchor: 'middle' });
  s.ground(620, 612);

  // ---------------------------------------------------------------- LLC half bridge Q1/Q2, drive, bootstrap
  s.wire([830, yT], [830, 190]).nmosV(830, 190, 250, { flip: true }).wire([830, 250], [830, 290]).nmosV(830, 290, 350, { flip: true });
  s.wire([830, 350], [830, 410]).dot(830, 270).dot(830, 370).dot(830, 410).ground(830, 410);
  ref(842, 214, 'Q1'); ref(842, 314, 'Q2');
  s.wire([702, 390], [716, 390], [716, 220], [808, 220]);                  // GATEH to Q1
  s.wire([702, 420], [750, 420], [750, 270], [830, 270]).dot(750, 420);    // HB to the switching node
  s.wire([702, 510], [776, 510], [776, 320], [808, 320]);                  // GATEL to Q2
  s.capacitor(750, 420, 750, 450).wire([702, 450], [750, 450]).dot(750, 450);
  s.diode(750, 480, 750, 450);
  ref(734, 438, 'C6', 'end'); ref(734, 468, 'D5', 'end');
  // VCC: from the pin to D5, over the GATEL lane, to C7 and D6
  s.wire([702, 480], [750, 480]).dot(750, 480).hwire(480, 750, 800, [776]).dot(800, 480);
  s.capacitor(800, 480, 800, 430).groundUp(800, 430);
  ref(816, 452, 'C7');
  s.wire([800, 480], [810, 480]).diode(850, 480, 810, 480).hwire(480, 850, 932, [890]).dot(932, 480).wire([932, 480], [960, 480]);
  ref(830, 466, 'D6', 'middle');

  // ---------------------------------------------------------------- resonant tank, current sense, transformer
  s.wire([830, 270], [850, 270]).inductor(850, 270, 898, 270).wire([898, 270], [960, 270]);
  ref(874, 254, 'L2', 'middle');
  s.inductor(960, 270, 960, 350).wire([960, 350], [960, 410]).dot(960, 370).dot(960, 410);
  ref(950, 314, 'Lm', 'end');
  s.capacitor(830, 370, 960, 370);
  ref(895, 356, 'C4', 'middle');
  s.resistor(830, 410, 880, 410).wire([880, 410], [890, 410]).dot(890, 410).capacitor(890, 410, 960, 410);
  ref(855, 396, 'R11', 'middle'); ref(925, 396, 'C5', 'middle');
  // R8 from the sense node to ISEN
  s.wire([890, 410], [890, 500]).resistor(890, 500, 890, 540).wire([702, 540], [890, 540]);
  ref(874, 523, 'R8', 'end');
  // transformer
  s.wire([974, 250], [974, 560]);
  ref(974, 240, 'T1', 'middle');
  s.inductor(960, 480, 960, 560).ground(960, 560);
  s.inductor(988, 250, 988, 330, { flip: true }).inductor(988, 330, 988, 410, { flip: true }).dot(988, 330);
  // R9/R10 from the auxiliary winding to VSEN
  s.resistor(932, 480, 932, 570).dot(932, 570).resistor(932, 570, 932, 640).ground(932, 640).wire([702, 570], [932, 570]);
  ref(916, 527, 'R9', 'end'); ref(916, 610, 'R10', 'end');

  // ---------------------------------------------------------------- secondary: rectifiers, output, return
  s.wire([988, 250], [1010, 250]).diode(1010, 250, 1050, 250).wire([1050, 250], [1200, 250]);
  s.wire([988, 410], [1010, 410]).diode(1010, 410, 1050, 410).wire([1050, 410], [1060, 410], [1060, 250]);
  s.dot(1060, 250).dot(1090, 250).dot(1170, 250);
  s.capacitor(1090, 250, 1090, 330).hwire(330, 988, 1200, [1060, 1170]).dot(1090, 330).ground(1090, 330);
  ref(1030, 236, 'DS1', 'middle'); ref(1030, 396, 'DS2', 'middle'); ref(1106, 293, 'CS1');
  circle(1200, 250); circle(1200, 330);
  s.text(1200, 238, 'Vout', { cls: 'sch-net', anchor: 'middle' }).text(1200, 350, 'return', { cls: 'sch-net', anchor: 'middle' });

  // ---------------------------------------------------------------- secondary feedback: RS1/RS2, QS1 (shunt regulator), US1 (optocoupler), RS4
  s.wire([1170, 250], [1170, 380]).dot(1170, 380).resistor(1170, 380, 1170, 595).dot(1170, 595).resistor(1170, 595, 1170, 660).ground(1170, 660);
  ref(1186, 490, 'RS1'); ref(1186, 632, 'RS2');
  s.wire([1170, 380], [1096, 380]).resistor(1096, 380, 1096, 440);
  ref(1112, 414, 'RS4');
  s.add('<rect class="sch-ic" x="1040" y="440" width="80" height="80" rx="3"/>');
  s.wire([1096, 440], [1096, 455]).diode(1096, 455, 1096, 505).wire([1096, 505], [1096, 560]).dot(1096, 555);
  for (const y of [468, 488]) s.wire([1086, y], [1074, y]).wire([1078, y - 3], [1074, y], [1078, y + 3]);
  s.wire([1062, 462], [1062, 498]);
  s.wire([1062, 472], [1054, 464], [1054, 455], [1030, 455], [1030, 690], [520, 690], [520, 540], [548, 540]);
  s.wire([1062, 488], [1054, 496], [1054, 520]).ground(1054, 520);
  s.add('<path class="sch-dot" d="M1054.5 495.5 L1061.3 493.4 L1057.1 489.2 Z"/>');
  s.text(1080, 513, 'US1', { cls: 'sch-ref', anchor: 'middle' });
  s.diode(1096, 630, 1096, 560, { kind: 'zener' }).ground(1096, 630);
  ref(1080, 598, 'QS1', 'end');
  s.capacitor(1096, 555, 1140, 555).resistor(1140, 555, 1140, 595).dot(1140, 595);
  s.wire([1101, 595], [1170, 595]);
  ref(1118, 541, 'CS2', 'middle'); ref(1124, 578, 'RS3', 'end');
  return s;
}
