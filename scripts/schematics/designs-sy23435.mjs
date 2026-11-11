// Drawing for the Silergy SY23435 (SY52021TQQ) USB PD / QC interface controller: the secondary side of the datasheet's "25W PD Charger Typical Application Circuit" (Figure 10).
// Designators and values are the datasheet's. Not drawn, as stated in the page caption: the whole primary side (U1 SY22837HZP and its network), the synchronous rectifier US1 SY23421FAP
// with its snubber and supply parts (RS1, CS1, CS2, RS4), the optocoupler's transistor and its filter C7, the EMI parts and the transformer. The five VBUS pins (21 to 25) are drawn as
// one pin and the two VDD pins (27 and 28) as one. Pins 2, 5, 6, 12, 13, 16, 17, 20 and 26 are N/C and are not drawn.
import { Sheet, refMarkup } from './lib.mjs';

export function pdInterface({ id }) {
  const s = new Sheet(1080, 620, {
    id,
    top: 40,
    minWidth: 860,
    title: 'SY23435 secondary-side USB PD and QC circuit',
    desc:
      'Secondary side of a flyback USB PD charger with the SY23435 interface controller US2, redrawn from the datasheet\'s 25 W typical application with its designators. ' +
      'The flyback output VO+ feeds the VDD pins, which are the drain of the internal load switch, and the controller\'s VCC pin, which has the capacitor CS8 to ground. ' +
      'The output has the capacitors CS4 and CS3. The V3P3V pin has the capacitor CS9 to ground. The VBUS pin goes to the connector through the internal load switch, with the capacitor CS10 to the connector ground GNDS. ' +
      'The optocoupler LED OPTO1 is fed from VO+ through RS2, with RS5 in series with CS5 across it, and is driven by the OPTO pin. ' +
      'The OPTO pin has two compensation branches, RS7 in series with CS6 to the VFB pin and RS9 in series with CS7 to the IFB pin. ' +
      'The current-sense resistor RS3 sits in the return path between the output ground and GNDS, and the CS pin connects to the GNDS side. The Rcable pin has the resistor RS8 to ground. ' +
      'The CC1, CC2, DN and DP pins each go to the connector through a 20 ohm series resistor, with a 470 picofarad capacitor to GNDS on the controller side and a Zener diode to GNDS on the connector side.',
  });
  const ref = (x, y, name, anchor = 'start') => s.text(x, y, refMarkup(name), { cls: 'sch-ref', anchor, raw: true });
  // Ground symbol of the connector side: the hatched symbol of the datasheet, GNDS. The plain symbol (s.ground) is the output return.
  const gnds = (x, y) => {
    s.wire([x, y], [x, y + 8]).wire([x - 11, y + 8], [x + 11, y + 8]);
    for (const dx of [-8, 0, 8]) s.wire([x + dx, y + 8], [x + dx - 5, y + 16]);
  };

  const yP = 80; // output rail VO+
  const ic = { x: 560, y: 110, w: 200, h: 360 };
  const xL = ic.x - 12; // left pin ends
  const xR = ic.x + ic.w + 12; // right pin ends
  const yB = ic.y + ic.h + 12; // bottom pin ends

  s.port(100, yP, 'VO+', 'in');
  s.wire([100, yP], [660, yP]);

  // ---------------------------------------------------------------- output capacitors CS4 and CS3
  s.dot(160, yP).capacitor(160, yP, 160, 200, { polarized: true }).ground(160, 200);
  s.label(160, 140, 'CS4', '560 µF', 'left');
  s.dot(230, yP).capacitor(230, yP, 230, 200).ground(230, 200);
  s.label(230, 140, 'CS3', '0.1 µF', 'left');

  // ---------------------------------------------------------------- optocoupler LED: RS2 from VO+, RS5 and CS5 across it
  s.dot(300, yP).resistor(300, yP, 300, 230);
  s.label(300, 155, 'RS2', '5.1 kΩ', 'left');
  s.dot(360, yP).resistor(360, yP, 360, 150).capacitor(360, 150, 360, 230);
  s.label(360, 115, 'RS5', '3.6 kΩ', 'right');
  s.label(360, 190, 'CS5', '6.8 nF', 'right');
  s.wire([360, 230], [300, 230]).dot(300, 230);
  s.wire([300, 230], [300, 320]).diode(300, 320, 300, 400, { kind: 'led', side: -1 });
  s.wire([300, 400], [300, 420], [380, 420]);
  s.text(316, 358, 'OPTO1', { cls: 'sch-ref' });
  s.text(316, 371, 'EL1018', { cls: 'sch-val' });
  s.text(300, 448, 'LED of the opto-coupler', { cls: 'sch-val', anchor: 'middle' });
  s.text(300, 461, 'to the primary-side COMP', { cls: 'sch-val', anchor: 'middle' });

  // ---------------------------------------------------------------- controller
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'VCC', y: 150 }, { name: 'V3P3V', y: 210 }, { name: 'GND', y: 270 }, { name: 'OPTO', y: 360 }, { name: 'VFB', y: 420 }],
    right: [{ name: 'VBUS', y: 150 }, { name: 'CC1', y: 225 }, { name: 'CC2', y: 300 }, { name: 'DN', y: 375 }, { name: 'DP', y: 450 }],
    top: [{ name: 'VDD', x: 660 }],
    bottom: [{ name: 'IFB', x: 600 }, { name: 'CS', x: 650 }, { name: 'Rcable', x: 700 }],
  }, { title: 'SY23435', subtitle: 'load switch + PD/QC' });
  ref(ic.x + ic.w + 24, ic.y - 8, 'US2', 'middle');
  s.wire([660, ic.y - 12], [660, yP]).dot(660, yP);

  // VCC from VO+ with CS8, V3P3V with CS9, GND pin
  s.dot(430, yP).wire([430, yP], [430, 150]).dot(430, 150).wire([430, 150], [xL, 150]);
  s.capacitor(430, 150, 430, 230).ground(430, 230);
  s.label(430, 190, 'CS8', '1 µF', 'right');
  s.wire([xL, 210], [500, 210]).dot(500, 210).capacitor(500, 210, 500, 270).dot(500, 270);
  s.wire([500, 270], [xL, 270]).ground(500, 270);
  s.label(500, 240, 'CS9', '0.1 µF', 'left');

  // OPTO node, CV compensation (RS7, CS6 to VFB) and CC compensation (RS9, CS7 to IFB)
  s.wire([xL, 360], [380, 360], [380, 520]).dot(380, 420);
  s.capacitor(380, 420, 440, 420).resistor(440, 420, xL, 420);
  s.label(410, 420, 'CS6', '47 nF', 'above');
  s.label(494, 420, 'RS7', '2.4 kΩ', 'above');
  s.capacitor(380, 520, 440, 520).resistor(440, 520, 600, 520).wire([600, 520], [600, yB]);
  s.label(410, 520, 'CS7', '6.8 nF', 'above');
  s.label(520, 520, 'RS9', '200 Ω', 'above');

  // current sense: CS pin to the GNDS side of RS3, GND side of RS3 to the output return
  s.wire([650, yB], [650, 570], [320, 570]).dot(320, 570);
  gnds(320, 570);
  s.text(336, 592, 'GNDS', { cls: 'sch-val' });
  s.resistor(320, 570, 240, 570);
  s.ground(240, 570);
  s.label(280, 570, 'RS3', '5 mΩ', 'above');

  // Rcable
  s.resistor(700, yB, 700, 542).ground(700, 542);
  s.label(700, 515, 'RS8', '160 kΩ', 'right');

  // ---------------------------------------------------------------- connector side: VBUS and the CC, DN and DP lines
  s.wire([xR, 150], [1000, 150]).dot(840, 150).capacitor(840, 150, 840, 186);
  gnds(840, 186);
  s.label(840, 168, 'CS10', '0.1 µF', 'left');
  s.port(1000, 150, 'VBUS', 'out');
  const lines = [
    { y: 225, name: 'CC1', r: 'RS10', c: 'CS11', z: 'ZD1', zv: '7.5 V' },
    { y: 300, name: 'CC2', r: 'RS11', c: 'CS12', z: 'ZD2', zv: '7.5 V' },
    { y: 375, name: 'DN', r: 'RS13', c: 'CS14', z: 'ZD4', zv: '5.1 V' },
    { y: 450, name: 'DP', r: 'RS12', c: 'CS13', z: 'ZD3', zv: '5.1 V' },
  ];
  for (const { y, name, r, c, z, zv } of lines) {
    s.wire([xR, y], [840, y]).dot(840, y).resistor(840, y, 960, y).dot(960, y).wire([960, y], [1000, y]);
    s.capacitor(840, y, 840, y + 36);
    gnds(840, y + 36);
    s.diode(960, y + 36, 960, y, { kind: 'zener' });
    gnds(960, y + 36);
    s.label(900, y, r, '20 Ω', 'above');
    s.label(840, y + 18, c, '470 pF', 'left');
    s.label(960, y + 18, z, zv, 'left');
    s.port(1000, y, name, 'out');
  }
  return s;
}
