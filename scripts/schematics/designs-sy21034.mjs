// Drawing for the Silergy SY21034 100 V asynchronous buck converter: the "Application Schematic (VOUT = 5V)" on page 10 of the
// datasheet, with the values from its bill of materials. The rectifier D is external (a Schottky diode from ground to the LX node);
// EN is fed from VIN through the Jump_EN jumper and a 10 kΩ / 1 MΩ divider; a 10 Ω resistor sits in series with the bootstrap capacitor.
import { Sheet } from './lib.mjs';

export function highVoltageAsyncBuck({ id, part = 'SY21034' }) {
  const GY = 270; // every ground terminal sits on this row, except the diode's
  const s = new Sheet(806, 300, {
    id,
    title: `${part} reference circuit`,
    desc:
      `Application schematic of the ${part} asynchronous buck converter for a 5 V output, redrawn from the datasheet with the values from its bill of materials. ` +
      `VIN (4.5–100 V) feeds the IN pin, with a 22 µF electrolytic capacitor CIN1 and a 2.2 µF ceramic CIN2 to ground. ` +
      `EN is fed from VIN through a jumper (Jump_EN) and 10 kΩ (RENH), with 1 MΩ (RENL) from EN to ground. ` +
      `A 100 nF capacitor CBS in series with a 10 Ω resistor RBS connects BS to LX. ` +
      `LX drives a 47 µH inductor to the 5 V output, and a Schottky diode D (SS320) runs from ground up to the LX node. The output has a 22 µF capacitor COUT. ` +
      `RH (100 kΩ) from the output and RL (13.7 kΩ) to ground form the feedback divider to FB, with a 47 pF feedforward capacitor CFF across RH.`,
  });
  const ic = { x: 290, y: 90, w: 110, h: 130 };
  const L = ic.x - 12; // left pin stubs end here
  const R = ic.x + ic.w + 12; // right pin stubs end here
  const pinIN = 120, pinEN = 190;
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'IN', y: pinIN }, { name: 'EN', y: pinEN }],
    right: [{ name: 'LX', y: pinIN }, { name: 'FB', y: pinEN }],
    top: [{ name: 'BS', x: 330 }],
    bottom: [{ name: 'GND', x: 345 }],
  }, { title: part });
  s.wire([345, ic.y + ic.h + 12], [345, GY]).ground(345, GY);

  // input side: VIN port, bulk and ceramic input capacitors
  s.port(54, pinIN, 'VIN', 'in').text(10, pinIN + 26, '4.5–100 V', { cls: 'sch-net', anchor: 'start' });
  s.wire([54, pinIN], [L, pinIN]);
  s.dot(90, pinIN).capacitor(90, pinIN, 90, GY, { polarized: true }).ground(90, GY).label(90, 200, 'CIN1', '22 µF');
  s.dot(160, pinIN).capacitor(160, pinIN, 160, GY).ground(160, GY).label(160, 200, 'CIN2', '2.2 µF');

  // EN: VIN through the Jump_EN jumper (drawn as a switch, as in the datasheet) and RENH, with RENL to ground
  const xe = 230;
  s.dot(xe, pinIN).wire([xe, pinIN], [xe, 130.5]);
  s.add(`<circle class="sch-w" cx="${xe}" cy="133" r="2.5"/>`).add(`<circle class="sch-w" cx="${xe}" cy="149" r="2.5"/>`);
  s.wire([xe, 146.5], [xe + 7, 135]); // the blade
  s.wire([xe, 151.5], [xe, 155]);
  s.text(xe - 12, 144, 'Jump_EN', { cls: 'sch-ref', anchor: 'end' });
  s.resistor(xe, 155, xe, pinEN).label(xe, 168, 'RENH', '10 kΩ');
  s.dot(xe, pinEN).wire([xe, pinEN], [L, pinEN]);
  s.resistor(xe, pinEN, xe, GY).ground(xe, GY).label(xe, 235, 'RENL', '1 MΩ');

  // bootstrap: BS, CBS and RBS in series, to the LX node
  const lxX = 440;
  s.wire([330, ic.y - 12], [330, 50]).capacitor(330, 50, 385, 50).resistor(385, 50, lxX, 50).wire([lxX, 50], [lxX, pinIN]);
  s.label(357, 50, 'CBS', '100 nF', 'above').label(412, 50, 'RBS', '10 Ω', 'above');

  // LX node: the rectifier to ground, then the inductor to the output
  s.wire([R, pinIN], [lxX, pinIN]).dot(lxX, pinIN);
  s.diode(lxX, 152, lxX, pinIN).ground(lxX, 152).label(lxX, 140, 'D', 'SS320');
  s.inductor(lxX, pinIN, 520, pinIN).label(480, pinIN, 'L', '47 µH', 'above');
  const X = { rh: 560, cff: 610, cout: 690 };
  const outEnd = 750;
  s.wire([520, pinIN], [outEnd, pinIN]);
  s.port(outEnd, pinIN, 'VOUT', 'out').text(outEnd + 46, pinIN + 26, '5 V', { cls: 'sch-net', anchor: 'end' });

  // feedback divider with feedforward capacitor
  s.dot(X.rh, pinIN).resistor(X.rh, pinIN, X.rh, pinEN).label(X.rh, 140, 'RH', '100 kΩ', 'left');
  s.wire([R, pinEN], [X.rh, pinEN]).dot(X.rh, pinEN);
  s.resistor(X.rh, pinEN, X.rh, GY).ground(X.rh, GY).label(X.rh, 235, 'RL', '13.7 kΩ', 'left');
  s.wire([X.rh, pinEN], [X.cff, pinEN]);
  s.capacitor(X.cff, pinIN, X.cff, pinEN).dot(X.cff, pinIN).label(X.cff, 140, 'CFF', '47 pF');

  // output capacitor
  s.dot(X.cout, pinIN).capacitor(X.cout, pinIN, X.cout, GY).ground(X.cout, GY).label(X.cout, 200, 'COUT', '22 µF');
  return s;
}
