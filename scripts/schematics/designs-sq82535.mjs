// Drawings for the Silergy SQ82535 series voltage reference:
// 1. the "Application Schematic" (page 14 of the datasheet), with the values from its bill of materials;
// 2. the "Output Voltage Adjustment Application Circuit" (Figure 3), with the values printed in it.
import { Sheet } from './lib.mjs';

function terminal(s, x, y, text) {
  s.add(`<circle class="sch-w" cx="${x + 4}" cy="${y}" r="3.5"/>`);
  s.text(x + 14, y + 4, text, { cls: 'sch-net', anchor: 'start' });
}

export function seriesRefApplication({ id, part = 'SQ82535' }) {
  const s = new Sheet(720, 300, {
    top: 30,
    id,
    title: `${part} application schematic`,
    desc:
      `Application schematic of the ${part} series voltage reference, redrawn from the datasheet with the values from its bill of materials. ` +
      `The input VIN feeds the VIN pin, with a 1 µF capacitor C1 to ground. GND goes to ground. The VOUT pin is the reference output, with a 10 µF capacitor C2 and a 0.1 µF capacitor C3 to ground. ` +
      `The TRIM/NR pin has a 0.1 µF noise-reduction capacitor C4 to ground. The TEMP pin is not used.`,
  });
  const ic = { x: 240, y: 70, w: 220, h: 170 };
  const lx = ic.x - 12;
  const rx = ic.x + ic.w + 12;
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'VIN', y: 110 }, { name: 'TEMP', y: 160 }, { name: 'GND', y: 210 }],
    right: [{ name: 'VOUT', y: 110 }, { name: 'TRIM/NR', y: 210 }],
  }, { title: part });

  s.port(80, 110, 'VIN', 'in');
  s.wire([80, 110], [lx, 110]).dot(150, 110).capacitor(150, 110, 150, 175).ground(150, 175).label(150, 142, 'C1', '1 µF', 'left');
  s.wire([lx, 210], [200, 210]).ground(200, 210);
  s.text(lx - 8, 164, 'open', { cls: 'sch-val', anchor: 'end' });

  s.wire([rx, 110], [630, 110]);
  terminal(s, 630, 110, 'VOUT');
  s.dot(530, 110).capacitor(530, 110, 530, 175).ground(530, 175).label(530, 142, 'C2', '10 µF', 'left');
  s.dot(590, 110).capacitor(590, 110, 590, 175).ground(590, 175).label(590, 142, 'C3', '0.1 µF', 'right');
  s.wire([rx, 210], [530, 210]).capacitor(530, 210, 530, 255).ground(530, 255).label(530, 232, 'C4', '0.1 µF', 'right');
  return s;
}

export function seriesRefTrim({ id, part = 'SQ82535' }) {
  const s = new Sheet(600, 330, {
    top: 30,
    id,
    title: `${part} output trim circuit`,
    desc:
      `Output voltage adjustment circuit of the ${part}, redrawn from the datasheet (Figure 3). A 10 kΩ potentiometer R1 in series with a 30 kΩ resistor R2 runs from VOUT to ground. ` +
      `The potentiometer's wiper connects through a 1 MΩ resistor R3 to the TRIM/NR pin. VIN feeds the VIN pin and GND goes to ground.`,
  });
  const ic = { x: 150, y: 70, w: 150, h: 150 };
  const lx = ic.x - 12;
  const rx = ic.x + ic.w + 12;
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'VIN', y: 110 }, { name: 'GND', y: 190 }],
    right: [{ name: 'VOUT', y: 110 }, { name: 'TRIM/NR', y: 170 }],
  }, { title: part });
  s.port(70, 110, 'VIN', 'in').wire([70, 110], [lx, 110]);
  s.wire([lx, 190], [110, 190]).ground(110, 190);

  const px = 450;
  s.wire([rx, 110], [520, 110]);
  terminal(s, 520, 110, 'VOUT');
  s.dot(px, 110).resistor(px, 110, px, 200).label(px, 140, 'R1', '10 kΩ', 'right');
  s.resistor(px, 200, px, 280).ground(px, 280).label(px, 240, 'R2', '30 kΩ', 'right');
  // wiper arrow at the middle of R1, fed from R3
  s.wire([rx, 170], [350, 170]).resistor(350, 170, 420, 170).wire([420, 170], [436, 155]);
  s.add(`<path class="sch-dot" d="M440 155 L432 152 L436 160 Z"/>`);
  s.label(385, 170, 'R3', '1 MΩ', 'above');
  s.text(px + 16, 172, 'wiper', { cls: 'sch-val', anchor: 'start' });
  return s;
}
