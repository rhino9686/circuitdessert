// Schematic of the Silergy SQ52104x current-sense amplifier, redrawn from the "Application Schematic" in its datasheet
// (the SQ52104 / SQ52104E datasheet draws one circuit for both gain versions). The part has no supply pin: IN+ is both
// the positive sense input and the supply, so the 1.8-5.5 V rail being monitored powers it. Designators and values follow its BOM list.
import { Sheet } from './lib.mjs';

export function supplyPoweredSenseAmp({ id, part, gain = '200 V/V', rsense = '10 mΩ', cbypass = '100 nF', vin = '1.8–5.5 V' }) {
  const s = new Sheet(700, 290, {
    top: 40,
    id,
    title: `${part} reference circuit`,
    desc:
      `Application schematic of the ${part} current-sense amplifier (gain ${gain}), redrawn from the datasheet. ` +
      `A ${rsense} sense resistor RSENSE sits in the high-side current path, between the supply (${vin}) and the load. ` +
      `The supply side of RSENSE goes to the IN+ pin and the load side to the IN- pin. ` +
      `A ${cbypass} bypass capacitor CBYPASS from the IN+ node to ground sits next to the pin. The part has no separate supply pin, so the IN+ pin also powers it. ` +
      `The GND pin is grounded. The OUT pin is a voltage of gain times the voltage across RSENSE, referred to ground.`,
  });

  const ic = { x: 300, y: 100, w: 170, h: 140 };
  const lx = ic.x - 12;
  const rx = ic.x + ic.w + 12;
  const yPlus = 130, yMinus = 210;

  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'IN+', y: yPlus }, { name: 'IN−', y: yMinus }],
    right: [{ name: 'OUT', y: yPlus }, { name: 'GND', y: yMinus }],
  }, { title: part, subtitle: 'U1' });

  // ---- sense resistor between the two input nodes
  const rs = 170;
  s.port(60, yPlus, 'IN+', 'in').wire([60, yPlus], [lx, yPlus]).text(66, yPlus - 14, `${vin} supply`, { cls: 'sch-net', anchor: 'start' });
  s.port(60, yMinus, 'IN−', 'in').wire([60, yMinus], [lx, yMinus]).text(66, yMinus + 22, 'to the load', { cls: 'sch-net', anchor: 'start' });
  s.dot(rs, yPlus).dot(rs, yMinus).resistor(rs, yPlus, rs, yMinus).label(rs, 175, 'RSENSE', rsense, 'right');

  // ---- bypass capacitor from the IN+ node to ground, drawn above the line as in the datasheet
  const cx = 240;
  s.dot(cx, yPlus).capacitor(cx, yPlus, cx, 96).groundUp(cx, 96).label(cx, 100, 'CBYPASS', cbypass, 'left');

  // ---- output and ground
  s.wire([rx, yPlus], [560, yPlus]).port(560, yPlus, 'OUT', 'out').text(560 + 52, yPlus - 14, 'to the ADC', { cls: 'sch-net', anchor: 'end' });
  s.wire([rx, yMinus], [520, yMinus]).ground(520, yMinus);
  return s;
}
