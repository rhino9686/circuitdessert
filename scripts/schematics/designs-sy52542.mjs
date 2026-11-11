// Drawing for the Silergy SY52542 synchronous rectification switcher in its low-side position: the secondary side of the "Typical Application Schematic" (the 65 W PD flyback) in the datasheet.
// Designators and values are the datasheet's. Not drawn, as stated in the page caption: the whole primary side, the output load switch QS1, the current-sense resistor RS3,
// the optocoupler US2 and the protocol IC US3. The four DRAIN pins (5 to 8) are drawn as one and the two SOURCE pins (1 and 2) as one. Winding polarity dots are not drawn.
import { Sheet, refMarkup } from './lib.mjs';

export function srLowSide({ id }) {
  const s = new Sheet(1000, 470, {
    id,
    top: 40,
    minWidth: 760,
    title: 'SY52542 low-side synchronous rectifier circuit',
    desc:
      'Secondary side of a flyback converter with the SY52542 synchronous rectification switcher U1 in the low-side position, redrawn from the datasheet\'s typical application with its designators. ' +
      'The top of the transformer secondary winding T1 goes to the positive output rail VO+. The bottom of the winding goes to the DRAIN pins of U1, and its SOURCE pins go to the negative output rail VO−. ' +
      'An RC snubber, the resistor RS1 in series with the capacitor CS1, is connected from the drain node to the source rail. ' +
      'The VIN pin is connected to VO+ through the resistor RS2, and has the capacitor CS2 to the source rail. The VDD pin has the capacitor CS3 to the source rail. ' +
      'Two output capacitors CS4 and CS5 sit between VO+ and VO−.',
  });
  const ref = (x, y, name, anchor = 'start') => s.text(x, y, refMarkup(name), { cls: 'sch-ref', anchor, raw: true });
  const yP = 80; // positive rail
  const yG = 440; // negative rail

  // ---------------------------------------------------------------- transformer secondary
  s.wire([100, yP], [100, 110]).inductor(100, 110, 100, 190, { flip: true });
  s.label(100, 150, 'T1', '', 'left');
  s.wire([100, 190], [100, 240]).dot(100, 240);

  // ---------------------------------------------------------------- controller
  const ic = { x: 250, y: 190, w: 190, h: 140 };
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'DRAIN', y: 240 }],
    right: [{ name: 'VIN', y: 215 }, { name: 'VDD', y: 255 }, { name: 'SOURCE', y: 295 }],
  }, { title: 'SY52542' });
  ref(ic.x + ic.w / 2, ic.y - 8, 'U1', 'middle');
  s.wire([100, 240], [ic.x - 12, 240]);

  // ---------------------------------------------------------------- RC snubber RS1 and CS1 from the drain node to the source rail
  s.wire([100, 240], [100, 380]).resistor(100, 380, 200, 380).capacitor(200, 380, 300, 380).wire([300, 380], [320, 380], [320, yG]);
  s.label(150, 380, 'RS1', '5.1 Ω', 'above'); s.label(250, 380, 'CS1', '1 nF', 'above');

  // ---------------------------------------------------------------- VIN: RS2 from VO+, CS2 to the source rail; VDD: CS3; SOURCE to the rail
  const xV = 480; // VIN node
  s.wire([ic.x + ic.w + 12, 215], [xV, 215]).dot(xV, 215);
  s.dot(xV, yP).resistor(xV, yP, xV, 215);
  s.label(xV, 148, 'RS2', '10 Ω', 'right');
  s.wire([xV, 215], [560, 215]).capacitor(560, 215, 560, 295);
  s.label(560, 255, 'CS2', '0.1 µF', 'right');
  s.wire([ic.x + ic.w + 12, 255], [520, 255]).dot(520, 255).capacitor(520, 255, 520, 295).dot(520, 295);
  s.label(520, 275, 'CS3', '1 µF', 'left');
  s.wire([ic.x + ic.w + 12, 295], [620, 295]).dot(560, 295).wire([620, 295], [620, yG]);
  s.dot(620, yG).dot(320, yG);

  // ---------------------------------------------------------------- rails, output capacitors and ports
  s.wire([100, yP], [900, yP]);
  s.wire([320, yG], [900, yG]);
  s.ground(620, yG);
  for (const [x, name, side] of [[720, 'CS4', 'left'], [800, 'CS5', 'right']]) {
    s.dot(x, yP).capacitor(x, yP, x, yG, { polarized: true }).dot(x, yG);
    s.label(x, 330, name, '470 µF', side);
  }
  s.port(900, yP, 'VO+', 'out'); s.port(900, yG, 'VO−', 'out');
  return s;
}
