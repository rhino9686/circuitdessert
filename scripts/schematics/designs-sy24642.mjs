// Schematic of the Silergy SY24642 current-sense amplifier, redrawn from the "Application Schematic" in its datasheet
// (the SY24641/2/7 datasheet draws one circuit for all three gain versions). REF is tied to ground, so this is the
// unidirectional connection of the datasheet's Figure 3. Designators and values follow its BOM list.
import { Sheet } from './lib.mjs';

export function currentSenseAmp({ id, part, v = {} }) {
  const val = { vcc: '3–5.5 V', rsense: '10 mΩ', cbypass: '100 nF', ...v };
  const s = new Sheet(720, 400, {
    top: 40,
    id,
    title: `${part} reference circuit`,
    desc:
      `Application schematic of the ${part} current-sense amplifier, redrawn from the datasheet. ` +
      `A ${val.rsense} sense resistor RSENSE sits in the current path. Its supply-side end goes to the CSP pin and its load-side end to the CSN pin. ` +
      `The VCC pin takes ${val.vcc} and has a ${val.cbypass} bypass capacitor CBYPASS to ground. ` +
      `The REF and GND pins are both tied to ground, which makes the output unidirectional: it is 0 V with no current and rises with the current. ` +
      `The OUT pin is the output, a voltage of gain times the voltage across RSENSE.`,
  });

  const ic = { x: 290, y: 90, w: 170, h: 200 };
  const lx = ic.x - 12;
  const rx = ic.x + ic.w + 12;
  const yCSP = 130, yCSN = 250, yVCC = 130, yOUT = 250;
  const xREF = 345, xGND = 405; // bottom pins
  const by = ic.y + ic.h + 12;

  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'CSP', y: yCSP }, { name: 'CSN', y: yCSN }],
    right: [{ name: 'VCC', y: yVCC }, { name: 'OUT', y: yOUT }],
    bottom: [{ name: 'REF', x: xREF }, { name: 'GND', x: xGND }],
  }, { title: part, subtitle: 'U1' });

  // ---- sense resistor between the two input nodes
  const rxs = 150;
  s.port(60, yCSP, 'CSP', 'in').wire([60, yCSP], [lx, yCSP]).text(66, yCSP - 14, 'supply side', { cls: 'sch-net', anchor: 'start' });
  s.port(60, yCSN, 'CSN', 'in').wire([60, yCSN], [lx, yCSN]).text(66, yCSN + 22, 'load side', { cls: 'sch-net', anchor: 'start' });
  s.dot(rxs, yCSP).dot(rxs, yCSN).resistor(rxs, yCSP, rxs, yCSN).label(rxs, 190, 'RSENSE', val.rsense, 'right');

  // ---- VCC with its bypass capacitor
  const cx = 520, vx = 600;
  s.wire([rx, yVCC], [vx, yVCC]).dot(cx, yVCC).capacitor(cx, yVCC, cx, 190).ground(cx, 190).label(cx, 160, 'CBYPASS', val.cbypass, 'right');
  s.port(vx, yVCC, 'VCC', 'out').text(vx + 56, yVCC - 14, val.vcc, { cls: 'sch-net', anchor: 'end' });

  // ---- output
  s.wire([rx, yOUT], [vx, yOUT]).port(vx, yOUT, 'OUT', 'out').text(vx + 56, yOUT - 14, 'to the ADC', { cls: 'sch-net', anchor: 'end' });

  // ---- REF and GND tied together and grounded
  const gy = 350;
  s.wire([xREF, by], [xREF, gy], [xGND, gy], [xGND, by]).dot((xREF + xGND) / 2, gy).ground((xREF + xGND) / 2, gy);
  return s;
}
