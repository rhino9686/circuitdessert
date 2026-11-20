// Schematic of the Silergy SA59131 current-sense amplifier, redrawn from the "Application Schematic" in its datasheet
// (the SA59131/B/D datasheet draws one circuit for all three gain versions). REF2 is tied to VS and REF1 to ground,
// which is the mid-supply (bidirectional) connection of the datasheet's Figure 6. Designators and values follow its
// BOM list; the datasheet gives the IC no designator, so U1 is ours. The "supply side" and "load side" notes come from
// the datasheet's Figure 1 and pin table, not from the application schematic itself.
import { Sheet } from './lib.mjs';

export function midSupplySenseAmp({ id, part, v = {} }) {
  const val = { vs: '2.7–5.5 V', rsense: '10 mΩ', cbypass: '100 nF', ...v };
  const s = new Sheet(780, 410, {
    top: 40,
    id,
    title: `${part} reference circuit`,
    desc:
      `Application schematic of the ${part} current-sense amplifier, redrawn from the datasheet. ` +
      `A ${val.rsense} sense resistor RSENSE sits in the current path. Its supply-side end goes to the IN+ pin and its load-side end to the IN− pin. ` +
      `The VS pin takes ${val.vs} and has a ${val.cbypass} bypass capacitor CBYPASS to ground. ` +
      `The REF2 pin is tied to VS and the REF1 pin to ground, which puts the output at half the supply when no current flows, so the circuit reads current in both directions. ` +
      `The NC pin and the GND pin are tied to ground. The OUT pin is the output, a voltage of gain times the voltage across RSENSE added to that mid-supply level.`,
  });

  const ic = { x: 300, y: 110, w: 180, h: 200 };
  const lx = ic.x - 12;
  const rx = ic.x + ic.w + 12;
  const yINM = 160, yINP = 250; // IN− and IN+
  const yOUT = 150, yREF2 = 225, yREF1 = 265;
  const xVS = 390, xNC = 350, xGND = 410;
  const by = ic.y + ic.h + 12;
  const rail = 70;

  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'IN−', y: yINM }, { name: 'IN+', y: yINP }],
    right: [{ name: 'OUT', y: yOUT }, { name: 'REF2', y: yREF2 }, { name: 'REF1', y: yREF1 }],
    top: [{ name: 'VS', x: xVS }],
    bottom: [{ name: 'NC', x: xNC }, { name: 'GND', x: xGND }],
  }, { title: part, subtitle: 'U1' });

  // ---- sense resistor between the two input nodes
  const rs = 150;
  s.port(60, yINM, 'IN−', 'in').wire([60, yINM], [lx, yINM]).text(66, yINM - 14, 'load side', { cls: 'sch-net', anchor: 'start' });
  s.port(60, yINP, 'IN+', 'in').wire([60, yINP], [lx, yINP]).text(66, yINP + 22, 'supply side', { cls: 'sch-net', anchor: 'start' });
  s.dot(rs, yINM).dot(rs, yINP).resistor(rs, yINM, rs, yINP).label(rs, 205, 'RSENSE', val.rsense, 'right');

  // ---- VS rail: supply flag, bypass capacitor, VS pin, and the REF2 strap
  const cx = 540, xREF2 = 700;
  s.port(60, rail, 'VS', 'in').text(14, rail - 14, val.vs, { cls: 'sch-net', anchor: 'start' });
  s.wire([60, rail], [xREF2, rail]).dot(xVS, rail).wire([xVS, rail], [xVS, ic.y - 12]);
  s.dot(cx, rail).capacitor(cx, rail, cx, 108).ground(cx, 108).label(cx, 89, 'CBYPASS', val.cbypass, 'right');
  s.wire([rx, yREF2], [xREF2, yREF2], [xREF2, rail]);

  // ---- output: an open terminal, as in the datasheet
  const ox = 606;
  s.wire([rx, yOUT], [ox - 5, yOUT]);
  s.add(`<circle class="sch-w" cx="${ox}" cy="${yOUT}" r="5"/>`);
  s.text(ox + 14, yOUT + 4, 'output', { cls: 'sch-net', anchor: 'start' });

  // ---- NC, GND and REF1 on one ground bus
  const gy = 350, xREF1 = 600;
  s.wire([rx, yREF1], [xREF1, yREF1], [xREF1, gy]);
  s.wire([xNC, by], [xNC, gy], [xREF1, gy]).wire([xGND, by], [xGND, gy]).dot(xGND, gy).ground(xGND, gy);

  s.text(60, 396, 'REF2 on VS and REF1 on ground put OUT at VS/2 with no current: current can flow either way.', { cls: 'sch-net', anchor: 'start' });
  return s;
}
