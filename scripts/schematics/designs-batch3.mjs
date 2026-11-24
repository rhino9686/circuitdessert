// Schematics for the third batch of part pages (Silergy): an 8 A buck converter with a 3.3 V LDO (SY8388B).
// The other Silergy figures reuse the shared LDO and DDR termination generators.
import { Sheet } from './lib.mjs';

function capDown(s, x, y, len, ref, val, side = 'right') {
  s.dot(x, y).capacitor(x, y, x, y + len).ground(x, y + len).label(x, y + len / 2, ref, val, side);
}

/**
 * SY8388B Figure 1: 4.5 V to 24 V in, fixed 3.338 V out at 8 A, with the 3.3 V LDO.
 */
export function buckSy8388b({ id, part }) {
  const s = new Sheet(1030, 660, {
    top: 50,
    id,
    title: `${part} typical application circuit`,
    desc:
      `Typical application circuit of the ${part} 8 A synchronous buck converter with a 3.3 V LDO, redrawn from the datasheet's Figure 1. ` +
      `The input rail VIN (4.5 V to 24 V) feeds the IN pins, with a 10 µF capacitor CIN and a 0.1 µF capacitor to ground. The EN1 and EN2 pins are driven by ON/OFF signals. ` +
      `The LX pin drives a 1.5 µH inductor L1 to the 3.338 V output, and a 0.1 µF bootstrap capacitor CBS connects BS to LX. ` +
      `The output has three 22 µF capacitors to ground. The OUT pin senses the output, and the FF pin connects to the output through a 1 kΩ resistor RFF in series with a 220 pF capacitor CFF. ` +
      `The open-drain PG output is brought out as a signal. The LDO pin is the 3.3 V LDO output with a 4.7 µF capacitor CLDO to ground. GND is tied to ground. The TEST pin is left floating or connected to ground and is not drawn.`,
  });
  const ic = { x: 330, y: 100, w: 190, h: 470 };
  const lx = ic.x - 12, rx = ic.x + ic.w + 12;
  const yIN = 130, yEN1 = 260, yEN2 = 310;
  const yBS = 130, yLX = 180, yOUT = 250, yFF = 380, yPG = 440, yLDO = 500;
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'IN', y: yIN }, { name: 'EN1', y: yEN1 }, { name: 'EN2', y: yEN2 }],
    right: [{ name: 'BS', y: yBS }, { name: 'LX', y: yLX }, { name: 'OUT', y: yOUT }, { name: 'FF', y: yFF }, { name: 'PG', y: yPG }, { name: 'LDO', y: yLDO }],
    bottom: [{ name: 'GND', x: 430 }],
  }, { title: part });

  // input
  s.port(60, yIN, 'VIN', 'in');
  s.wire([60, yIN], [lx, yIN]);
  capDown(s, 130, yIN, 60, 'CIN', '10 µF', 'left');
  capDown(s, 220, yIN, 60, 'C2', '0.1 µF', 'left');
  s.port(60, yEN1, 'EN1', 'in');
  s.wire([60, yEN1], [lx, yEN1]);
  s.port(60, yEN2, 'EN2', 'in');
  s.wire([60, yEN2], [lx, yEN2]);

  // BS / LX / inductor
  s.wire([rx, yBS], [630, yBS]);
  s.capacitor(630, yBS, 630, yLX).label(630, 155, 'CBS', '0.1 µF', 'right');
  s.wire([rx, yLX], [650, yLX]).dot(630, yLX);
  s.inductor(650, yLX, 760, yLX);
  s.label(705, yLX, 'L1', '1.5 µH', 'above');
  s.wire([760, yLX], [960, yLX]);
  s.port(960, yLX, 'VOUT', 'out');
  s.dot(770, yLX).wire([770, yLX], [770, yOUT]);
  capDown(s, 830, yLX, 60, 'COUT', '3×22 µF', 'right');

  // OUT sense and RFF / CFF to FF
  s.wire([rx, yOUT], [770, yOUT]).dot(700, yOUT);
  s.resistor(700, yOUT, 700, 310).label(700, 280, 'RFF', '1 kΩ', 'left');
  s.capacitor(700, 320, 700, yFF).label(700, 350, 'CFF', '220 pF', 'left');
  s.wire([700, 310], [700, 320]);
  s.wire([rx, yFF], [700, yFF]);

  // PG
  s.wire([rx, yPG], [960, yPG]);
  s.port(960, yPG, 'PG', 'out');

  // LDO
  s.wire([rx, yLDO], [960, yLDO]);
  s.port(960, yLDO, 'VLDO', 'out');
  capDown(s, 700, yLDO, 60, 'CLDO', '4.7 µF', 'right');

  s.wire([430, ic.y + ic.h + 12], [430, ic.y + ic.h + 28]).ground(430, ic.y + ic.h + 28);
  return s;
}
