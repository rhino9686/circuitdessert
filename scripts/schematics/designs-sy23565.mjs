// Drawing for the Silergy SY23565 high-input-voltage flyback regulator: Figure 1 ("Typical Application Circuit") of the datasheet.
// The datasheet's figure has no designators and gives one value (the 100 kΩ resistor in series with HV), so the designators here are ours
// and the only value drawn is that one. The design example's values (bus capacitors, turns, current-sense resistor) are in the page's parts table.
// Simplifications, stated in the page caption: the R-C compensation network around the secondary shunt regulator is left out, and winding
// polarity marks are not drawn.
import { Sheet, refMarkup } from './lib.mjs';

export function flybackSsr({ id, part = 'SY23565' }) {
  const s = new Sheet(1040, 600, {
    id,
    top: 70,
    minWidth: 900,
    title: `${part} reference circuit`,
    desc:
      `Typical application of the ${part} secondary-side-regulated flyback regulator, redrawn from Figure 1 of the datasheet with designators added. ` +
      `The AC input goes through a diode bridge BD to two bulk capacitors CBUS1 and CBUS2 in series. ` +
      `A 100 kΩ resistor RHV from the bus feeds the HV pin. The bus also feeds the top of the transformer primary. ` +
      `A snubber made of the capacitor CSN and resistor RSN in parallel, in series with the diode DSN, clamps the drain node across the primary. ` +
      `Both DRAIN pins connect to the bottom of the primary. A resistor RCS from the CS pin to ground senses the primary current. ` +
      `An auxiliary winding feeds VCC through a diode DVCC and a resistor RVCC, with a capacitor CVCC from VCC to ground. ` +
      `On the secondary, the diode DO and the output capacitor COUT produce VO+ and VO−. ` +
      `A resistor RLED, the LED of the optocoupler U1 and the shunt regulator U2 are in series across the output, with a divider R1 and R2 across the output setting the shunt regulator's reference. ` +
      `The optocoupler's phototransistor pulls the COMP pin down, with a capacitor CCOMP from COMP to ground.`,
  });
  const ref = (x, y, name, anchor = 'start') => s.text(x, y, refMarkup(name), { cls: 'sch-ref', anchor, raw: true });
  const circle = (x, y) => s.add(`<circle class="sch-w" cx="${x}" cy="${y}" r="2.5"/>`);

  // ---------------------------------------------------------------- AC input and bridge
  const xA = 100, xB = 150, yT = 110, yBot = 270, yA = 150, yB = 230;
  circle(26, yA); circle(26, yB);
  s.text(8, yA + 4, 'L', { cls: 'sch-net' }).text(8, yB + 4, 'N', { cls: 'sch-net' });
  s.wire([28, yA], [xA, yA]).hwire(yB, 28, xB, [xA]);
  s.diode(xA, yA, xA, yT).diode(xA, yBot, xA, yA).diode(xB, yB, xB, yT).diode(xB, yBot, xB, yB);
  s.dot(xA, yA).dot(xB, yB).dot(xB, yT).dot(xB, yBot);
  s.add('<rect class="sch-w" stroke-dasharray="2 4" x="82" y="88" width="86" height="204"/>');
  s.text(125, 310, 'BD', { cls: 'sch-ref', anchor: 'middle' });

  // ---------------------------------------------------------------- bus rail and the two bulk capacitors in series
  s.wire([xA, yT], [660, yT]);
  s.wire([xA, yBot], [200, yBot]);
  s.dot(200, yT).capacitor(200, yT, 200, 170, { polarized: true }).capacitor(200, 170, 200, 230, { polarized: true }).wire([200, 230], [200, yBot]);
  s.dot(200, yBot).ground(200, yBot);
  s.dot(200, 170);
  s.label(200, 140, 'CBUS1', '');
  s.label(200, 200, 'CBUS2', '');

  // ---------------------------------------------------------------- the controller
  const ic = { x: 400, y: 380, w: 180, h: 180 };
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'VCC', y: 410 }, { name: 'HV', y: 440 }, { name: 'COMP', y: 470 }, { name: 'CS', y: 500 }],
    right: [{ name: 'DRAIN', y: 440 }, { name: 'DRAIN', y: 500 }],
    bottom: [{ name: 'GND', x: 490 }],
  }, { title: part });
  s.ground(490, ic.y + ic.h + 12);

  // HV start-up resistor from the bus
  s.dot(290, yT).resistor(290, yT, 290, 200).wire([290, 200], [290, 440], [388, 440]);
  s.label(290, 155, 'RHV', '100 kΩ');

  // current sense
  s.wire([388, 500], [370, 500]).resistor(370, 500, 370, 550).ground(370, 550).label(370, 525, 'RCS', '', 'left');

  // COMP: filter capacitor and the optocoupler's phototransistor
  s.wire([388, 470], [252, 470]).dot(320, 470);
  s.capacitor(320, 470, 320, 540).ground(320, 540).label(320, 505, 'CCOMP', '', 'left');
  s.wire([252, 470], [252, 490], [234, 500]).wire([234, 490], [234, 520]).wire([234, 510], [252, 520], [252, 540]).ground(252, 540);
  s.add('<path class="sch-dot" d="M252 520 L244 519.5 L249.5 514 Z"/>');
  for (const y of [492, 508]) s.wire([200, y], [218, y + 10]).wire([210, y + 11], [218, y + 10], [215, y + 3]);
  s.text(190, 540, 'U1', { cls: 'sch-ref', anchor: 'middle' });

  // ---------------------------------------------------------------- primary, snubber and drain
  s.wire([660, yT], [660, 150]).inductor(660, 150, 660, 230);
  s.label(660, 195, 'T1', '', 'left');
  s.wire([660, 230], [660, 280]).wire([490, 280], [660, 280]).dot(605, 280);
  s.wire([592, 440], [605, 440], [605, 500], [592, 500]).dot(605, 440).wire([605, 440], [605, 280]);
  // snubber: C and R in parallel, then the diode
  s.dot(470, yT).capacitor(470, yT, 470, 190).dot(510, yT).resistor(510, yT, 510, 190);
  s.wire([470, 190], [510, 190]).dot(490, 190).diode(490, 280, 490, 190);
  s.label(470, 150, 'CSN', '', 'left'); s.label(510, 150, 'RSN', ''); s.label(490, 240, 'DSN', '');

  // ---------------------------------------------------------------- auxiliary winding, VCC path
  s.inductor(660, 340, 660, 420).ground(660, 420);
  s.wire([660, 340], [650, 340]);
  s.hwire(340, 650, 590, [605]);
  s.diode(590, 340, 530, 340).wire([530, 340], [500, 340]).resistor(500, 340, 440, 340).wire([440, 340], [360, 340]).wire([360, 340], [360, 410], [388, 410]);
  s.dot(390, 340).capacitor(390, 340, 390, 300).groundUp(390, 300);
  s.label(560, 340, 'DVCC', '', 'above'); s.label(470, 340, 'RVCC', '', 'above'); s.label(390, 322, 'CVCC', '', 'left');

  // ---------------------------------------------------------------- core and secondary
  s.wire([683, 130], [683, 440]).wire([688, 130], [688, 440]);
  s.inductor(710, 150, 710, 230, { flip: true }).wire([710, 230], [710, 330]).wire([710, 330], [985, 330]);
  s.wire([710, 150], [730, 150]).diode(730, 150, 790, 150).wire([790, 150], [985, 150]);
  s.label(760, 150, 'DO', '', 'above');
  s.dot(830, 150).capacitor(830, 150, 830, 330, { polarized: true }).dot(830, 330);
  s.label(830, 290, 'COUT', '', 'left');
  circle(985, 150); circle(985, 330);
  s.text(985, 138, 'VO+', { cls: 'sch-net', anchor: 'middle' }).text(985, 352, 'VO−', { cls: 'sch-net', anchor: 'middle' });

  // secondary regulation: RLED, the optocoupler LED, the shunt regulator, and the divider
  s.dot(890, 150).resistor(890, 150, 890, 195).label(890, 172, 'RLED', '');
  s.diode(890, 195, 890, 255, { kind: 'led', side: -1 }).label(890, 225, 'U1', '', 'left');
  s.wire([890, 255], [890, 280]).diode(890, 330, 890, 280, { kind: 'zener' }).dot(890, 330);
  s.label(890, 308, 'U2', '', 'left');
  s.dot(950, 150).resistor(950, 150, 950, 240).dot(950, 240).resistor(950, 240, 950, 330).dot(950, 330);
  s.label(950, 195, 'R1', ''); s.label(950, 285, 'R2', '');
  s.wire([950, 240], [925, 240], [925, 305], [898, 305]);
  return s;
}
