// Drawing for the Silergy SY50328/9 secondary-side-regulated flyback converter: Figure 15 ("24W Auxiliary Power Supply Application Circuit") of the datasheet.
// Designators and values are the datasheet's, except that the shunt regulator is US1 (the BOM's name; the figure says QS1) and the output capacitors are CO1 and CO2 (the BOM's names; the figure says CS1 and CS2).
// Simplifications, stated in the page caption: the fuse F1, thermistor NTC, X capacitor CX1 with its discharge resistors RX1 and RX2, common-mode choke LF1, the Y capacitor CY1 and the
// compensation network RS3 / CS1 around the TL431 are not drawn; R8 and R9 (200 Ω each, in parallel) are drawn as one resistor; the two DRAIN pins are drawn as one. Winding polarity dots are not drawn.
import { Sheet, refMarkup } from './lib.mjs';

export function ssrFlyback24w({ id, part = 'SY50328/9' }) {
  const s = new Sheet(1460, 700, {
    id,
    top: 20,
    minWidth: 1200,
    title: `${part} reference circuit`,
    desc:
      `24 W auxiliary power supply built around the ${part} secondary-side-regulated flyback converter, redrawn from Figure 15 of the datasheet with its designators. ` +
      `The AC input goes through the diode bridge BD1 to the bulk capacitor CE1, then through the inductor L1 with the resistor R11 across it to the second bulk capacitor CE2. ` +
      `The bus feeds the top of the transformer primary T1 and, through three 2 MΩ resistors R1, R2 and R3, the PRT pin, which also has the resistor R4 and the capacitor C1 to ground. ` +
      `A clamp made of the capacitor C4 in parallel with the resistor R10, then R8 and R9 in parallel, then the diode D1, sits between the bus and the drain node. ` +
      `The converter U1 has its DRAIN pins on the bottom of the primary. Its ISEN pin goes to ground through R5 in parallel with R6. ` +
      `An auxiliary winding feeds VCC through the diode D2 and the resistor R7, with the capacitors CE3 and C3 on VCC. ` +
      `The COMP pin has the capacitor C2 and the phototransistor of the optocoupler OPTO. ` +
      `On the secondary, the diode DS1 with a snubber RS7 and CS2 across it feeds the output capacitors CO1 and CO2. ` +
      `The optocoupler LED with RS1 and RS2, the TL431 shunt regulator US1 and a divider RS4, RS5 and RS6 regulate the output.`,
  });
  const ref = (x, y, name, anchor = 'start') => s.text(x, y, refMarkup(name), { cls: 'sch-ref', anchor, raw: true });
  const circle = (x, y) => s.add(`<circle class="sch-w" cx="${x}" cy="${y}" r="2.5"/>`);
  const xT = 820; // transformer column

  // ---------------------------------------------------------------- AC input and bridge
  const xA = 100, xB = 150, yT = 110, yBot = 270, yA = 150, yB = 230;
  circle(26, yA); circle(26, yB);
  s.text(8, yA + 4, 'L', { cls: 'sch-net' }).text(8, yB + 4, 'N', { cls: 'sch-net' });
  s.wire([28, yA], [xA, yA]).hwire(yB, 28, xB, [xA]);
  s.diode(xA, yA, xA, yT).diode(xA, yBot, xA, yA).diode(xB, yB, xB, yT).diode(xB, yBot, xB, yB);
  s.dot(xA, yA).dot(xB, yB).dot(xB, yT).dot(xB, yBot);
  s.add('<rect class="sch-w" stroke-dasharray="2 4" x="82" y="88" width="86" height="204"/>');
  s.text(125, 310, 'BD1', { cls: 'sch-ref', anchor: 'middle' });

  // ---------------------------------------------------------------- bus rail: CE1, the filter L1 with R11 across it, CE2
  s.wire([xA, yT], [240, yT]).wire([330, yT], [xT, yT]);
  s.wire([xA, yBot], [380, yBot]);
  s.dot(200, yT).capacitor(200, yT, 200, yBot, { polarized: true }).dot(200, yBot).ground(200, yBot);
  s.label(200, 200, 'CE1', '22 µF', 'right');
  s.dot(240, yT).wire([240, yT], [240, 70]).resistor(240, 70, 330, 70).wire([330, 70], [330, yT]).dot(330, yT);
  s.inductor(240, yT, 330, yT);
  s.label(285, 70, 'R11', '1 kΩ', 'above');
  s.text(285, yT + 24, refMarkup('L1'), { cls: 'sch-ref', anchor: 'middle', raw: true });
  s.text(285, yT + 38, '220 µH', { cls: 'sch-val', anchor: 'middle' });
  s.dot(380, yT).capacitor(380, yT, 380, yBot, { polarized: true }).dot(380, yBot).ground(380, yBot);
  s.label(380, 200, 'CE2', '22 µF', 'right');

  // ---------------------------------------------------------------- controller
  const ic = { x: 420, y: 380, w: 190, h: 170 };
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'VCC', y: 410 }, { name: 'COMP', y: 480 }],
    right: [{ name: 'DRAIN', y: 410 }, { name: 'PRT', y: 445 }],
    bottom: [{ name: 'GND', x: 490 }, { name: 'ISEN', x: 560 }],
  }, { title: 'SY50328/9' });
  ref(ic.x + ic.w / 2 - 6, ic.y - 8, 'U1', 'middle');
  s.wire([490, ic.y + ic.h + 12], [490, 575]).ground(490, 575);
  s.wire([560, ic.y + ic.h + 12], [560, 590]).dot(560, 590).resistor(560, 590, 560, 640).ground(560, 640);
  s.wire([560, 590], [610, 590]).dot(610, 590).resistor(610, 590, 610, 640).ground(610, 640);
  s.label(560, 615, 'R5', '1.8 Ω', 'left'); s.label(610, 615, 'R6', '1.8 Ω', 'right');

  // ---------------------------------------------------------------- primary, clamp and drain
  s.wire([xT, yT], [xT, 150]).inductor(xT, 150, xT, 230);
  s.label(xT, 195, 'T1', '', 'left');
  s.wire([xT, 230], [xT, 290]).wire([490, 290], [490, 290]).hwire(290, 490, xT, [730]).dot(640, 290);
  s.wire([622, 410], [640, 410], [640, 290]).dot(640, 410);
  // clamp: C4 and R9 in parallel from the bus, then R7 / R8, then the diode D1 down to the drain node
  s.dot(450, yT).capacitor(450, yT, 450, 190).dot(520, yT).resistor(520, yT, 520, 190);
  s.wire([450, 190], [520, 190]).dot(485, 190).resistor(485, 190, 485, 238).diode(485, 290, 485, 238);
  s.label(450, 150, 'C4', '1 nF', 'left'); s.label(520, 150, 'R10', '470 kΩ', 'right'); s.label(485, 214, 'R8, R9', '2 × 200 Ω', 'right');
  s.label(485, 266, 'D1', '', 'left');
  s.dot(485, 290);

  // ---------------------------------------------------------------- PRT divider: R1, R2, R3 from the bus to PRT, R4 and C1 to ground
  s.dot(730, yT).resistor(730, yT, 730, 160).resistor(730, 160, 730, 210).resistor(730, 210, 730, 260);
  s.label(730, 135, 'R1', '2 MΩ', 'left'); s.label(730, 185, 'R2', '2 MΩ', 'left'); s.label(730, 235, 'R3', '2 MΩ', 'left');
  s.wire([730, 260], [730, 445]).wire([622, 445], [730, 445]).dot(730, 445);
  s.resistor(730, 445, 730, 510).ground(730, 510).label(730, 478, 'R4', '30.9 kΩ', 'right');
  s.dot(680, 445).capacitor(680, 445, 680, 500).ground(680, 500).label(680, 472, 'C1', '10 nF', 'left');

  // ---------------------------------------------------------------- auxiliary winding: D2, R10, then CE3 and C3 on VCC
  s.inductor(xT, 340, xT, 420).ground(xT, 420);
  s.wire([xT, 340], [xT - 10, 340]);
  s.hwire(340, xT - 10, 560, [730, 640]);
  s.diode(560, 340, 500, 340).wire([500, 340], [470, 340]).resistor(470, 340, 410, 340);
  s.wire([410, 340], [370, 340]).wire([370, 340], [370, 410], [408, 410]);
  s.label(530, 340, 'D2', '', 'above');
  s.label(440, 340, 'R7', '2 Ω', 'above');
  s.wire([370, 340], [250, 340]);
  s.dot(310, 340).capacitor(310, 340, 310, 384).ground(310, 384).label(310, 362, 'C3', '0.1 µF', 'right');
  s.dot(250, 340).capacitor(250, 340, 250, 384, { polarized: true }).ground(250, 384).label(250, 380, 'CE3', '10 µF', 'left');

  // ---------------------------------------------------------------- COMP: capacitor and the optocoupler's phototransistor
  s.wire([408, 480], [292, 480]).dot(340, 480);
  s.capacitor(340, 480, 340, 550).ground(340, 550).label(340, 515, 'C2', '1 nF', 'right');
  s.wire([292, 480], [292, 500], [274, 510]).wire([274, 500], [274, 530]).wire([274, 520], [292, 530], [292, 550]).ground(292, 550);
  s.add('<path class="sch-dot" d="M292 530 L284 529.5 L289.5 524 Z"/>');
  for (const y of [502, 518]) s.wire([240, y], [258, y + 10]).wire([250, y + 11], [258, y + 10], [255, y + 3]);
  s.text(228, 552, 'OPTO', { cls: 'sch-ref', anchor: 'middle' });

  // ---------------------------------------------------------------- core and secondary: DS1, its snubber, the output capacitors
  const yG = 440; // secondary ground
  s.wire([xT + 23, 130], [xT + 23, 440]).wire([xT + 28, 130], [xT + 28, 440]);
  const xS = 870;
  s.inductor(xS, 150, xS, 230, { flip: true });
  s.label(xS, 190, 'T1', '', 'right');
  s.wire([xS, 150], [940, 150]).dot(940, 150).diode(940, 150, 1010, 150).wire([1010, 150], [1400, 150]).dot(1060, 150);
  s.label(975, 150, 'DS1', '', 'above');
  // snubber RS7 + CS2 across DS1
  s.wire([940, 150], [940, 100]).resistor(940, 100, 990, 100).capacitor(990, 100, 1060, 100).wire([1060, 100], [1060, 150]);
  s.label(965, 100, 'RS7', '20 Ω', 'above'); s.label(1025, 100, 'CS2', '1 nF', 'above');
  // ground rail
  s.wire([xS, 230], [xS, yG], [1400, yG]);
  // output capacitors and the output terminals
  s.dot(1090, 150).capacitor(1090, 150, 1090, yG, { polarized: true }).dot(1090, yG);
  s.dot(1150, 150).capacitor(1150, 150, 1150, yG, { polarized: true }).dot(1150, yG);
  s.label(1090, 335, 'CO1', '470 µF', 'left'); s.label(1150, 335, 'CO2', '470 µF', 'right');
  s.port(1400, 150, 'VO+', 'out'); s.port(1400, yG, 'VO−', 'out');

  // ---------------------------------------------------------------- output regulation: RS1, the optocoupler LED with RS2 across it, TL431 and its divider
  s.dot(1230, 150).resistor(1230, 150, 1230, 190).label(1230, 172, 'RS1', '2 kΩ', 'left');
  s.dot(1230, 190).diode(1230, 190, 1230, 250, { kind: 'led', side: -1 }).dot(1230, 250);
  s.wire([1230, 190], [1262, 190]).resistor(1262, 190, 1262, 250).wire([1262, 250], [1230, 250]);
  s.label(1262, 220, 'RS2', '1 kΩ', 'right');
  s.text(1196, 236, 'OPTO', { cls: 'sch-ref', anchor: 'end' });
  s.wire([1230, 250], [1230, 290]).diode(1230, yG, 1230, 290, { kind: 'zener' }).dot(1230, yG);
  s.label(1230, 400, 'US1', 'TL431', 'left');
  s.dot(1335, 150).resistor(1335, 150, 1335, 215).resistor(1335, 215, 1335, 280).dot(1335, 280).resistor(1335, 280, 1335, yG).dot(1335, yG);
  s.label(1335, 188, 'RS4', '2.2 kΩ', 'right'); s.label(1335, 253, 'RS5', '36 kΩ', 'right'); s.label(1335, 365, 'RS6', '10 kΩ', 'right');
  s.wire([1335, 280], [1280, 280], [1280, 365], [1238, 365]);
  return s;
}
