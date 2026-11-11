// Drawing for the Silergy SY50307 GaN flyback controller: Figure 13 ("25W PD Charger Typical Application Circuit") of the datasheet.
// Designators are the datasheet's. Simplifications, stated in the page caption: the fuse FR1, input choke L1, Y capacitor CY1, the output load switch QS1,
// the protocol IC US2 and the small RC parts in the secondary feedback network are not drawn; the R8/R9 pair is drawn as one resistor; the output
// feedback is reduced to the optocoupler LED, its series resistor, the TLV431 and its divider. Winding polarity dots are not drawn.
import { Sheet, refMarkup } from './lib.mjs';

export function gaNFlyback({ id, part = 'SY50307' }) {
  const s = new Sheet(1400, 700, {
    id,
    top: 20,
    minWidth: 1150,
    title: `${part} reference circuit`,
    desc:
      `25 W USB PD charger built around the ${part} GaN flyback controller, redrawn from Figure 13 of the datasheet with its designators. ` +
      `The AC input goes through the diode bridge BD1 to the bus capacitor C1, the filter L2 (with R1 across it) and the capacitor C2. ` +
      `The bus feeds the top of the transformer primary T1. A clamp made of C6 in parallel with R7, a resistor pair R8 and R9, and the diode D2 sits between the bus and the drain node. ` +
      `The controller U1 has its DRAIN pin on the bottom of the primary. Its SOURCE pin goes to ground through R5 in parallel with R6. ` +
      `An auxiliary winding feeds VCC through the diode D1 and the resistor R2, with the capacitors C3 and C4 on VCC. ` +
      `The resistor divider R3 and R4 from the auxiliary winding sets the VSEN pin. The COMP pin has the capacitor C5 and the phototransistor of the optocoupler OPTO1. ` +
      `On the secondary, the synchronous rectifier IC US1 is on the low side of the winding, with a snubber RS1 and CS1 across it. ` +
      `The output capacitor CS4 feeds VBUS. The optocoupler LED, its resistor, the TLV431 shunt regulator QS2 and a divider RS10 and RS8 regulate the output.`,
  });
  const ref = (x, y, name, anchor = 'start') => s.text(x, y, refMarkup(name), { cls: 'sch-ref', anchor, raw: true });
  const circle = (x, y) => s.add(`<circle class="sch-w" cx="${x}" cy="${y}" r="2.5"/>`);
  const xT = 780; // transformer column

  // ---------------------------------------------------------------- AC input and bridge
  const xA = 100, xB = 150, yT = 110, yBot = 270, yA = 150, yB = 230;
  circle(26, yA); circle(26, yB);
  s.text(8, yA + 4, 'L', { cls: 'sch-net' }).text(8, yB + 4, 'N', { cls: 'sch-net' });
  s.wire([28, yA], [xA, yA]).hwire(yB, 28, xB, [xA]);
  s.diode(xA, yA, xA, yT).diode(xA, yBot, xA, yA).diode(xB, yB, xB, yT).diode(xB, yBot, xB, yB);
  s.dot(xA, yA).dot(xB, yB).dot(xB, yT).dot(xB, yBot);
  s.add('<rect class="sch-w" stroke-dasharray="2 4" x="82" y="88" width="86" height="204"/>');
  s.text(125, 310, 'BD1', { cls: 'sch-ref', anchor: 'middle' });

  // ---------------------------------------------------------------- bus: C1, the L2 / R1 filter, C2
  s.wire([xA, yT], [xT, yT]);
  s.wire([xA, yBot], [380, yBot]);
  s.dot(200, yT).capacitor(200, yT, 200, yBot, { polarized: true }).dot(200, yBot);
  s.label(200, 228, 'C1', '18 µF', 'right');
  s.dot(260, yT).dot(330, yT).inductor(260, yT, 330, yT);
  ref(295, 138, 'L2', 'middle'); s.text(295, 151, '4.7 µH', { cls: 'sch-val', anchor: 'middle' });
  s.wire([260, yT], [260, 64]).resistor(260, 64, 330, 64).wire([330, 64], [330, yT]);
  s.label(295, 64, 'R1', '2 kΩ', 'above');
  s.dot(380, yT).capacitor(380, yT, 380, yBot, { polarized: true }).dot(380, yBot).ground(380, yBot);
  s.label(380, 228, 'C2', '18 µF', 'left');

  // ---------------------------------------------------------------- controller
  const ic = { x: 420, y: 380, w: 190, h: 170 };
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'VCC', y: 410 }, { name: 'COMP', y: 480 }],
    right: [{ name: 'DRAIN', y: 410 }, { name: 'VSEN', y: 445 }],
    bottom: [{ name: 'GND', x: 490 }, { name: 'SOURCE', x: 560 }],
  }, { title: part });
  ref(ic.x + ic.w / 2 - 6, ic.y - 8, 'U1', 'middle');
  s.wire([490, ic.y + ic.h + 12], [490, 575]).ground(490, 575);
  s.wire([560, ic.y + ic.h + 12], [560, 590]).dot(560, 590).resistor(560, 590, 560, 640).ground(560, 640);
  s.wire([560, 590], [610, 590]).dot(610, 590).resistor(610, 590, 610, 640).ground(610, 640);
  s.label(560, 615, 'R5', '0.75 Ω', 'left'); s.label(610, 615, 'R6', '0.82 Ω', 'right');

  // ---------------------------------------------------------------- primary, clamp and drain
  s.wire([xT, yT], [xT, 150]).inductor(xT, 150, xT, 230);
  s.label(xT, 195, 'T1', '', 'left');
  s.wire([xT, 230], [xT, 290]).wire([490, 290], [xT, 290]).dot(640, 290);
  s.wire([622, 410], [640, 410], [640, 290]).dot(640, 410);
  // clamp: C6 and R7 in parallel from the bus, then R8 / R9, then the diode D2 down to the drain node
  s.dot(450, yT).capacitor(450, yT, 450, 190).dot(520, yT).resistor(520, yT, 520, 190);
  s.wire([450, 190], [520, 190]).dot(485, 190).resistor(485, 190, 485, 238).diode(485, 290, 485, 238);
  s.label(450, 150, 'C6', '1 nF', 'left'); s.label(520, 150, 'R7', '510 kΩ', 'right'); s.label(485, 214, 'R8, R9', '100 Ω', 'right');
  s.label(485, 266, 'D2', '', 'left');
  s.dot(485, 290);

  // ---------------------------------------------------------------- auxiliary winding: VCC path and VSEN divider
  s.inductor(xT, 340, xT, 420).ground(xT, 420);
  s.wire([xT, 340], [xT - 10, 340]);
  s.hwire(340, xT - 10, 560, [640]);
  s.diode(560, 340, 500, 340).wire([500, 340], [470, 340]).resistor(470, 340, 410, 340).wire([410, 340], [370, 340]).wire([370, 340], [370, 410], [408, 410]);
  s.dot(670, 340).resistor(670, 340, 670, 445).dot(670, 445).wire([622, 445], [670, 445]).resistor(670, 445, 670, 510).ground(670, 510);
  s.label(670, 392, 'R3', '240 kΩ', 'right'); s.label(670, 478, 'R4', '12.7 kΩ', 'right');
  s.label(530, 340, 'D1', '', 'above'); s.label(440, 340, 'R2', '3.3 Ω', 'above');
  s.wire([370, 340], [300, 340]);
  s.dot(335, 340).capacitor(335, 340, 335, 384).ground(335, 384).label(335, 362, 'C4', '', 'right');
  s.dot(300, 340).capacitor(300, 340, 300, 384).ground(300, 384).label(300, 362, 'C3', '10 µF', 'left');

  // ---------------------------------------------------------------- COMP: capacitor and the optocoupler's phototransistor
  s.wire([408, 480], [292, 480]).dot(340, 480);
  s.capacitor(340, 480, 340, 550).ground(340, 550).label(340, 515, 'C5', '100 pF', 'right');
  s.wire([292, 480], [292, 500], [274, 510]).wire([274, 500], [274, 530]).wire([274, 520], [292, 530], [292, 550]).ground(292, 550);
  s.add('<path class="sch-dot" d="M292 530 L284 529.5 L289.5 524 Z"/>');
  for (const y of [502, 518]) s.wire([240, y], [258, y + 10]).wire([250, y + 11], [258, y + 10], [255, y + 3]);
  s.text(228, 552, 'OPTO1', { cls: 'sch-ref', anchor: 'middle' });

  // ---------------------------------------------------------------- core and secondary (low-side synchronous rectifier)
  const yG = 440; // secondary ground
  s.wire([xT + 23, 130], [xT + 23, 440]).wire([xT + 28, 130], [xT + 28, 440]);
  const xS = 830;
  s.inductor(xS, 150, xS, 230, { flip: true });
  s.wire([xS, 150], [1322, 150]);
  s.wire([xS, 230], [xS, 300], [888, 300]).dot(870, 300).wire([870, 300], [870, 320]);
  s.label(xS, 190, 'T1', '', 'right');
  // US1 synchronous rectifier IC
  s.ic(900, 270, 120, 140, { left: [{ name: 'DRAIN', y: 300 }], right: [{ name: 'VDD', y: 300 }], top: [{ name: 'VIN', x: 950 }], bottom: [{ name: 'SOURCE', x: 960 }] }, { title: 'US1' });
  s.wire([960, 422], [960, yG]).dot(960, yG);
  s.wire([950, 258], [950, 214]).resistor(950, 214, 950, 170).wire([950, 170], [950, 150]).dot(950, 150);
  s.label(950, 192, 'RS4', '10 Ω', 'right');
  s.wire([1032, 300], [1050, 300]).dot(1050, 300).capacitor(1050, 300, 1050, yG).dot(1050, yG);
  s.label(1050, 370, 'CS2', '0.47 µF', 'right');
  // snubber across the rectifier
  s.resistor(870, 320, 870, 362).wire([870, 362], [870, 376]).capacitor(870, 376, 870, 424).wire([870, 424], [870, yG]).dot(870, yG);
  s.label(870, 341, 'RS1', '22 Ω', 'left'); s.label(870, 400, 'CS1', '2.2 nF', 'left');
  // ground rail
  s.wire([870, yG], [1322, yG]);
  // output capacitor and the VBUS terminal
  s.dot(1150, 150).capacitor(1150, 150, 1150, yG, { polarized: true }).dot(1150, yG);
  s.label(1150, 330, 'CS4', '560 µF', 'right');
  s.port(1322, 150, 'VBUS', 'out'); s.port(1322, yG, 'PGND', 'out');

  // ---------------------------------------------------------------- output regulation: optocoupler LED, TLV431 and its divider
  s.dot(1230, 150).resistor(1230, 150, 1230, 195).label(1230, 172, 'ROPT', '', 'right');
  s.diode(1230, 195, 1230, 255, { kind: 'led', side: -1 });
  s.text(1196, 236, 'OPTO1', { cls: 'sch-ref', anchor: 'end' });
  s.wire([1230, 255], [1230, 290]).diode(1230, yG, 1230, 290, { kind: 'zener' }).dot(1230, yG);
  s.label(1230, 400, 'QS2', 'TLV431', 'left');
  s.dot(1290, 150).resistor(1290, 150, 1290, 270).dot(1290, 270).resistor(1290, 270, 1290, yG).dot(1290, yG);
  s.label(1290, 215, 'RS10', '100 kΩ', 'right'); s.label(1290, 355, 'RS8', '59 kΩ', 'right');
  s.wire([1290, 270], [1265, 270], [1265, 365], [1238, 365]);
  return s;
}
