// Drawings for the Silergy SQ38576A and SQ38576B secondary-side-regulated flyback switchers: Figure 15 ("11W Auxiliary Power Supply Application Circuit") of each datasheet.
// The B drawing differs from the A in the datasheet's own figure: no CONT pin (pin 5 is NC) and so no brown-in divider, no R10 in the auxiliary supply,
// and a 680 pF / 220 kΩ / 2 × 20 Ω clamp in place of 2.2 nF / 100 kΩ / 2 × 10 Ω, with the clamp capacitor numbered C5.
// Designators and values are the datasheet's. Simplifications, stated in the page caption: the fuse F1, thermistor NTC, X capacitor CX1, common-mode choke LF1,
// the bus-capacitor balancing string R1 to R4, the Y capacitor CY1 and the compensation network RS3 / CS1 around the TL431 are not drawn; R7 and R8 (10 Ω each,
// in parallel) are drawn as one resistor; the two DRAIN pins are drawn as one. Winding polarity dots are not drawn.
import { Sheet, refMarkup } from './lib.mjs';

export function ssrFlybackDip7({ id, part = 'SQ38576A' }) {
  const isB = part === 'SQ38576B';
  const s = new Sheet(1460, 700, {
    id,
    top: 20,
    minWidth: 1200,
    title: `${part} reference circuit`,
    desc:
      `11 W auxiliary power supply built around the ${part} secondary-side-regulated flyback switcher, redrawn from Figure 15 of the datasheet with its designators. ` +
      `The AC input goes through the diode bridge BD1 to two bulk capacitors CE1 and CE2 in series. ` +
      (isB
        ? `The bus feeds the top of the transformer primary T1. Pin 5 of U1 is not connected. `
        : `The bus feeds the top of the transformer primary T1 and, through three 1 MΩ resistors R12, R13 and R14, the CONT pin, which also has the capacitor C5 and the resistor R11 to ground. `) +
      `A clamp made of the capacitor ${isB ? 'C5' : 'C4'} in parallel with the resistor R9, then R7 and R8 in parallel, then the diode D1, sits between the bus and the drain node. ` +
      `The switcher U1 has its DRAIN pins on the bottom of the primary. Its ISEN pin goes to ground through R5 in parallel with R6. ` +
      (isB
        ? `An auxiliary winding feeds VCC through the diode D2, with the capacitors CE3 and C3 on VCC. `
        : `An auxiliary winding feeds VCC through the diode D2 and the resistor R10, with the capacitors CE3 and C3 on VCC. `) +
      `The COMP pin has the capacitor C2 and the phototransistor of the optocoupler PC1. ` +
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

  // ---------------------------------------------------------------- bus rail and the two bulk capacitors in series
  s.wire([xA, yT], [xT, yT]);
  s.wire([xA, yBot], [200, yBot]);
  s.dot(200, yT).capacitor(200, yT, 200, 170, { polarized: true }).capacitor(200, 170, 200, 230, { polarized: true }).wire([200, 230], [200, yBot]);
  s.dot(200, yBot).ground(200, yBot).dot(200, 170);
  s.label(200, 140, 'CE1', '33 µF', 'right');
  s.label(200, 200, 'CE2', '33 µF', 'right');

  // ---------------------------------------------------------------- controller
  const ic = { x: 420, y: 380, w: 190, h: 170 };
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'VCC', y: 410 }, { name: 'COMP', y: 480 }],
    right: [{ name: 'DRAIN', y: 410 }, { name: isB ? 'NC' : 'CONT', y: 445 }],
    bottom: [{ name: 'GND', x: 490 }, { name: 'ISEN', x: 560 }],
  }, { title: part });
  ref(ic.x + ic.w / 2 - 6, ic.y - 8, 'U1', 'middle');
  s.wire([490, ic.y + ic.h + 12], [490, 575]).ground(490, 575);
  s.wire([560, ic.y + ic.h + 12], [560, 590]).dot(560, 590).resistor(560, 590, 560, 640).ground(560, 640);
  s.wire([560, 590], [610, 590]).dot(610, 590).resistor(610, 590, 610, 640).ground(610, 640);
  s.label(560, 615, 'R5', '1.8 Ω', 'left'); s.label(610, 615, 'R6', '1.8 Ω', 'right');

  // ---------------------------------------------------------------- primary, clamp and drain
  s.wire([xT, yT], [xT, 150]).inductor(xT, 150, xT, 230);
  s.label(xT, 195, 'T1', '', 'left');
  s.wire([xT, 230], [xT, 290]).wire([490, 290], [490, 290]).hwire(290, 490, xT, isB ? [] : [730]).dot(640, 290);
  s.wire([622, 410], [640, 410], [640, 290]).dot(640, 410);
  // clamp: C4 and R9 in parallel from the bus, then R7 / R8, then the diode D1 down to the drain node
  s.dot(450, yT).capacitor(450, yT, 450, 190).dot(520, yT).resistor(520, yT, 520, 190);
  s.wire([450, 190], [520, 190]).dot(485, 190).resistor(485, 190, 485, 238).diode(485, 290, 485, 238);
  s.label(450, 150, isB ? 'C5' : 'C4', isB ? '680 pF' : '2.2 nF', 'left'); s.label(520, 150, 'R9', isB ? '220 kΩ' : '100 kΩ', 'right'); s.label(485, 214, 'R7, R8', isB ? '2 × 20 Ω' : '2 × 10 Ω', 'right');
  s.label(485, 266, 'D1', '', 'left');
  s.dot(485, 290);

  // ---------------------------------------------------------------- brown-in divider: R12, R13, R14 from the bus to CONT, R11 and C5 to ground
  if (!isB) {
    s.dot(730, yT).resistor(730, yT, 730, 160).resistor(730, 160, 730, 210).resistor(730, 210, 730, 260);
    s.label(730, 135, 'R12', '1 MΩ', 'left'); s.label(730, 185, 'R13', '1 MΩ', 'left'); s.label(730, 235, 'R14', '1 MΩ', 'left');
    s.wire([730, 260], [730, 445]).wire([622, 445], [730, 445]).dot(730, 445);
    s.resistor(730, 445, 730, 510).ground(730, 510).label(730, 478, 'R11', '15 kΩ', 'right');
    s.dot(680, 445).capacitor(680, 445, 680, 500).ground(680, 500).label(680, 472, 'C5', '10 nF', 'left');
  }

  // ---------------------------------------------------------------- auxiliary winding: D2, R10, then CE3 and C3 on VCC
  s.inductor(xT, 340, xT, 420).ground(xT, 420);
  s.wire([xT, 340], [xT - 10, 340]);
  s.hwire(340, xT - 10, 560, isB ? [640] : [730, 640]);
  s.diode(560, 340, 500, 340).wire([500, 340], [470, 340]);
  if (isB) s.wire([470, 340], [410, 340]);
  else s.resistor(470, 340, 410, 340);
  s.wire([410, 340], [370, 340]).wire([370, 340], [370, 410], [408, 410]);
  s.label(530, 340, 'D2', '', 'above');
  if (!isB) s.label(440, 340, 'R10', '2 Ω', 'above');
  s.wire([370, 340], [250, 340]);
  s.dot(310, 340).capacitor(310, 340, 310, 384).ground(310, 384).label(310, 362, 'C3', '0.1 µF', 'right');
  s.dot(250, 340).capacitor(250, 340, 250, 384, { polarized: true }).ground(250, 384).label(250, 380, 'CE3', '22 µF', 'left');

  // ---------------------------------------------------------------- COMP: capacitor and the optocoupler's phototransistor
  s.wire([408, 480], [292, 480]).dot(340, 480);
  s.capacitor(340, 480, 340, 550).ground(340, 550).label(340, 515, 'C2', '1 nF', 'right');
  s.wire([292, 480], [292, 500], [274, 510]).wire([274, 500], [274, 530]).wire([274, 520], [292, 530], [292, 550]).ground(292, 550);
  s.add('<path class="sch-dot" d="M292 530 L284 529.5 L289.5 524 Z"/>');
  for (const y of [502, 518]) s.wire([240, y], [258, y + 10]).wire([250, y + 11], [258, y + 10], [255, y + 3]);
  s.text(228, 552, 'PC1', { cls: 'sch-ref', anchor: 'middle' });

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
  s.label(965, 100, 'RS7', '10 Ω', 'above'); s.label(1025, 100, 'CS2', '1 nF', 'above');
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
  s.text(1196, 236, 'PC1', { cls: 'sch-ref', anchor: 'end' });
  s.wire([1230, 250], [1230, 290]).diode(1230, yG, 1230, 290, { kind: 'zener' }).dot(1230, yG);
  s.label(1230, 400, 'US1', 'TL431', 'left');
  s.dot(1335, 150).resistor(1335, 150, 1335, 215).resistor(1335, 215, 1335, 280).dot(1335, 280).resistor(1335, 280, 1335, yG).dot(1335, yG);
  s.label(1335, 188, 'RS4', '2.2 kΩ', 'right'); s.label(1335, 253, 'RS5', '36 kΩ', 'right'); s.label(1335, 365, 'RS6', '10 kΩ', 'right');
  s.wire([1335, 280], [1280, 280], [1280, 365], [1238, 365]);
  return s;
}
