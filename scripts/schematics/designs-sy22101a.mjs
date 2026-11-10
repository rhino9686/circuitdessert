// Drawing for the Silergy SY22101A boost LED driver: the "Schematic Diagram" (Figure 1) on page 1 of the datasheet,
// with only the values it prints (1 µF in, 10 µH, 1 µF out). The datasheet has no bill of materials: the Schottky diode D
// and the sense resistor R1 carry no value, and R1 sets the LED current as 0.2 V ÷ R1.
import { Sheet } from './lib.mjs';

export function boostLedDriver({ id, part = 'SY22101A' }) {
  const GY = 330;
  const RAIL = 80;
  const s = new Sheet(820, 360, {
    id,
    top: 30,
    title: `${part} typical application`,
    desc:
      `Typical application of the ${part} boost LED driver, redrawn from the datasheet's Figure 1. VIN feeds the IN pin and a 10 µH inductor, with a 1 µF capacitor to ground. ` +
      `The inductor's other end is the LX pin, which drives a Schottky diode D to the output. The output has a 1 µF capacitor to ground and connects to the OVP pin. ` +
      `A series string of LEDs runs from the output down to the FB pin, and a sense resistor R1 from FB to ground sets the LED current. A PWM dimming signal drives the EN/PWM pin.`,
  });
  const ic = { x: 330, y: 140, w: 150, h: 140 };
  const L = ic.x - 12;
  const R = ic.x + ic.w + 12;
  const pin = { in: 170, en: 250, ovp: 200, fb: 250 };
  const lxX = 455;
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'IN', y: pin.in }, { name: 'EN/PWM', y: pin.en }],
    right: [{ name: 'OVP', y: pin.ovp }, { name: 'FB', y: pin.fb }],
    top: [{ name: 'LX', x: lxX }],
    bottom: [{ name: 'GND', x: 405 }],
  }, { title: part });
  s.wire([405, ic.y + ic.h + 12], [405, GY]).ground(405, GY);

  // input rail, input capacitor, IN pin
  s.port(54, RAIL, 'VIN', 'in').text(10, RAIL + 26, '2.5–5.5 V', { cls: 'sch-net', anchor: 'start' });
  s.wire([54, RAIL], [330, RAIL]);
  s.dot(130, RAIL).capacitor(130, RAIL, 130, GY).ground(130, GY).label(130, 210, 'CIN', '1 µF');
  s.dot(280, RAIL).wire([280, RAIL], [280, pin.in], [L, pin.in]);

  // inductor to LX, diode to the output
  s.inductor(330, RAIL, 410, RAIL).label(370, RAIL, 'L', '10 µH', 'above');
  s.wire([410, RAIL], [lxX, RAIL], [lxX, ic.y - 12]).dot(lxX, RAIL);
  s.wire([lxX, RAIL], [490, RAIL]).diode(490, RAIL, 540, RAIL).label(515, RAIL, 'D', '', 'above');
  s.wire([540, RAIL], [760, RAIL]);
  s.add(`<circle class="sch-w" cx="764" cy="${RAIL}" r="3.5"/>`);
  s.text(774, RAIL + 4, 'VOUT', { cls: 'sch-net', anchor: 'start' });

  // OVP senses the output
  const xo = 570;
  s.dot(xo, RAIL).wire([xo, RAIL], [xo, pin.ovp], [R, pin.ovp]);

  // LED string from the output down to FB, with a gap for the LEDs not drawn
  const xl = 630;
  s.dot(xl, RAIL).wire([xl, RAIL], [xl, 95]);
  s.diode(xl, 95, xl, 125, { kind: 'led' }).diode(xl, 125, xl, 155, { kind: 'led' });
  s.wire([xl, 155], [xl, 162]);
  s.add(`<path class="sch-w" stroke-dasharray="2 5" d="M${xl} 166 L${xl} 186"/>`);
  s.wire([xl, 190], [xl, 197]);
  s.diode(xl, 197, xl, 227, { kind: 'led' }).wire([xl, 227], [xl, pin.fb]);
  s.text(xl - 14, 180, 'LEDs', { cls: 'sch-val', anchor: 'end' });

  // FB and the sense resistor
  s.wire([R, pin.fb], [xl, pin.fb]).dot(xl, pin.fb);
  s.resistor(xl, pin.fb, xl, GY).ground(xl, GY).label(xl, 292, 'R1', '0.2 V ÷ ILED');

  // output capacitor
  s.dot(720, RAIL).capacitor(720, RAIL, 720, GY).ground(720, GY).label(720, 210, 'COUT', '1 µF');

  // dimming input
  s.port(270, pin.en, 'PWM', 'in').wire([270, pin.en], [L, pin.en]);
  return s;
}
