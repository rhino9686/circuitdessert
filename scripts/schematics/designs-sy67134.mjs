// Schematic of the Silergy SY67134 H-bridge motor driver, redrawn from the "Typical Application Circuit" (Figure 1)
// in its datasheet. Figure 1 has no component values. The only values drawn here are the ones the pin table states
// (10 µF ceramic on VM, at least 0.1 µF on VREF) and the limit on RSENSE from the recommended operating conditions.
import { Sheet, refMarkup } from './lib.mjs';

export function inInHBridge({ id, part, v = {} }) {
  const val = { vm: '5–32 V', cbulk: 'electrolytic', cvm: '10 µF', cref: '≥ 0.1 µF', vref: '0.1–3 V', rsense: '< 100 mΩ', ...v };
  const s = new Sheet(760, 410, {
    top: 60,
    id,
    title: `${part} typical application`,
    desc:
      `Typical application of the ${part} H-bridge motor driver, redrawn from the datasheet. The supply VM (${val.vm}) feeds the VM pin, with a bulk electrolytic capacitor CBULK and a ${val.cvm} ceramic capacitor CVM from VM to the GND pin, which goes to ground. ` +
      `IN1 and IN2 are logic inputs from a controller. An external reference voltage (${val.vref}) drives VREF, which has a capacitor CREF (${val.cref}) to ground. ` +
      `A brushed DC motor connects between OUT1 and OUT2. ISEN goes to ground through the current-sense resistor RSENSE (${val.rsense}).`,
  });

  const ic = { x: 300, y: 90, w: 170, h: 250 };
  const lx = ic.x - 12;
  const rx = ic.x + ic.w + 12;
  const yVM = 120, yGND = 170, yIN1 = 225, yIN2 = 260, yVREF = 310; // left pins
  const yOUT1 = 120, yOUT2 = 260, yISEN = 310; // right pins

  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'VM', y: yVM }, { name: 'GND', y: yGND }, { name: 'IN1', y: yIN1 }, { name: 'IN2', y: yIN2 }, { name: 'VREF', y: yVREF }],
    right: [{ name: 'OUT1', y: yOUT1 }, { name: 'OUT2', y: yOUT2 }, { name: 'ISEN', y: yISEN }],
  }, { title: part, subtitle: 'H-bridge' });

  // ---- supply: VM flag, bulk and ceramic capacitors from VM to the GND pin, GND to ground
  const cbX = 150, cvX = 220;
  s.port(50, yVM, 'VM', 'in').text(10, yVM - 14, val.vm, { cls: 'sch-net', anchor: 'start' });
  s.wire([50, yVM], [lx, yVM]);
  s.dot(cbX, yVM).capacitor(cbX, yVM, cbX, yGND, { polarized: true }).label(cbX, 156, 'CBULK', val.cbulk, 'left');
  s.dot(cvX, yVM).capacitor(cvX, yVM, cvX, yGND).label(cvX, 145, 'CVM', val.cvm, 'right');
  s.wire([cbX, yGND], [lx, yGND]).dot(cvX, yGND).ground(cbX, yGND);

  // ---- logic inputs
  for (const [name, y] of [['IN1', yIN1], ['IN2', yIN2]]) s.port(50, y, name, 'in').wire([50, y], [lx, y]);

  // ---- reference: external voltage on VREF, CREF to ground
  const crX = 190;
  s.port(50, yVREF, 'VREF', 'in').text(10, yVREF - 14, val.vref, { cls: 'sch-net', anchor: 'start' });
  s.wire([50, yVREF], [lx, yVREF]).dot(crX, yVREF).capacitor(crX, yVREF, crX, 360).ground(crX, 360).label(crX, 336, 'CREF', val.cref, 'right');

  // ---- motor between OUT1 and OUT2
  const mx = 600, my = 190, mr = 30;
  s.wire([rx, yOUT1], [mx, yOUT1], [mx, my - mr]);
  s.wire([rx, yOUT2], [mx, yOUT2], [mx, my + mr]);
  s.add(`<circle class="sch-w" cx="${mx}" cy="${my}" r="${mr}"/>`);
  s.text(mx, my + 5, 'M', { cls: 'sch-ictitle', anchor: 'middle' });
  s.text(mx + mr + 12, my + 4, 'Brushed DC motor', { cls: 'sch-val', anchor: 'start' });

  // ---- current sense: ISEN through RSENSE to ground
  const rsX = 540;
  s.wire([rx, yISEN], [rsX, yISEN]).resistor(rsX, yISEN, rsX, 370).ground(rsX, 370);
  s.text(rsX + 16, 336, refMarkup('RSENSE'), { cls: 'sch-ref', anchor: 'start', raw: true }).text(rsX + 16, 349, val.rsense, { cls: 'sch-val', anchor: 'start' });
  return s;
}
