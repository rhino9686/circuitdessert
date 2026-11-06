// Schematic of the Silergy SY2A27352 LDO, redrawn from the "Application Schematic" (3.3 V output) in its datasheet.
// Designators follow the datasheet's BOM list. The datasheet's drawing shows R1 = 123 kΩ and R5 = 1 MΩ while its BOM
// gives 124 kΩ and 100 kΩ; this drawing uses R1 from the BOM (124 kΩ, for 3.3 V) and R5 from the drawing (1 MΩ),
// and the part page explains the difference.
import { Sheet } from './lib.mjs';

export function ldoWithReset({ id, part, v = {} }) {
  const val = {
    vin: '4–36 V', vout: '3.3 V', c1: '10 µF, 50 V', c2: '4.7 µF, 50 V', c3: '100 nF', r1: '124 kΩ', r2: '27.4 kΩ', r3: '10 kΩ', r5: '1 MΩ', ...v,
  };
  const s = new Sheet(800, 450, {
    top: 50,
    id,
    title: `${part} reference circuit`,
    desc:
      `Application schematic of the ${part} adjustable LDO with reset output, redrawn from the datasheet for a ${val.vout} output. ` +
      `The input VIN (${val.vin}) has a ${val.c1} capacitor C1 to ground and feeds the IN pin. ` +
      `A switch K1 connects VIN to the EN pin, and a ${val.r5} resistor R5 pulls EN to ground when the switch is open. ` +
      `A ${val.c3} capacitor C3 from the TO pin to ground sets the reset timeout. ` +
      `The OUT pin is the output VOUT (${val.vout}), which has a ${val.c2} capacitor C2 to ground. ` +
      `The feedback divider is R1 (${val.r1}) from VOUT to the ADJ pin and R2 (${val.r2}) from ADJ to ground. ` +
      `The open-drain /RESET pin has a ${val.r3} pull-up resistor R3 to VOUT and is also brought out as the /RESET signal. The GND pin goes to ground.`,
  });

  const ic = { x: 320, y: 150, w: 170, h: 230 };
  const lx = ic.x - 12; // left edge of the pin stubs
  const rx = ic.x + ic.w + 12;
  const rail = 100; // VIN rail
  const yIN = 180, yEN = 240, yTO = 300; // left pins
  const yRST = 180, yOUT = 240, yADJ = 300; // right pins
  const gx = 405; // GND pin
  const gy = ic.y + ic.h + 40; // ground symbol under the IC

  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'IN', y: yIN }, { name: 'EN', y: yEN }, { name: 'TO', y: yTO }],
    right: [{ name: '/RESET', y: yRST }, { name: 'OUT', y: yOUT }, { name: 'ADJ', y: yADJ }],
    bottom: [{ name: 'GND', x: gx }],
  }, { title: part });

  // ---- input: VIN flag, C1, and the tap that feeds IN
  const c1x = 100, kx = 190, tapX = 250;
  s.port(54, rail, 'VIN', 'in').text(10, rail - 14, val.vin, { cls: 'sch-net', anchor: 'start' });
  s.wire([54, rail], [tapX, rail]);
  s.dot(c1x, rail).capacitor(c1x, rail, c1x, 200).ground(c1x, 200).label(c1x, 150, 'C1', val.c1, 'left');
  s.dot(tapX, rail).wire([tapX, rail], [tapX, yIN], [lx, yIN]);

  // ---- enable: switch K1 from VIN to EN, R5 from EN to ground
  s.dot(kx, rail).wire([kx, rail], [kx, 148]);
  s.add(`<circle class="sch-w" cx="${kx}" cy="151" r="3"/>`).add(`<circle class="sch-w" cx="${kx}" cy="189" r="3"/>`);
  s.wire([kx, 186], [kx + 14, 158]).wire([kx, 192], [kx, yEN]).wire([kx, yEN], [lx, yEN]);
  s.dot(kx, yEN).resistor(kx, yEN, kx, 340).ground(kx, 340);
  s.label(kx, 212, 'K1', 'ON / OFF', 'right');
  s.label(kx, 295, 'R5', val.r5, 'right');

  // ---- reset timeout: C3 from TO to ground
  const c3x = 270;
  s.wire([lx, yTO], [c3x, yTO]).dot(c3x, yTO).capacitor(c3x, yTO, c3x, 410).ground(c3x, 410).label(c3x, 370, 'C3', val.c3, 'left');

  // ---- output: OUT node with R3, R1 and C2 hanging off it, and the VOUT flag
  const r3x = 580, r1x = 640, c2x = 710, portX = 730;
  s.wire([rx, yOUT], [portX, yOUT]);
  s.dot(r3x, yOUT).dot(r1x, yOUT).dot(c2x, yOUT);
  s.port(portX, yOUT, 'VOUT', 'out').text(portX + 56, yOUT - 14, val.vout, { cls: 'sch-net', anchor: 'end' });
  s.capacitor(c2x, yOUT, c2x, 400).ground(c2x, 400).label(c2x, 310, 'C2', val.c2, 'right');

  // ---- /RESET: open drain, R3 pulls it up to VOUT, and the signal leaves on the right
  s.wire([rx, yRST], [portX, yRST]).dot(r3x, yRST).resistor(r3x, yRST, r3x, yOUT).label(r3x, 215, 'R3', val.r3, 'left');
  s.port(portX, yRST, '/RESET', 'out').text(portX + 56, yRST - 14, 'open drain', { cls: 'sch-net', anchor: 'end' });

  // ---- feedback divider: R1 from VOUT to ADJ, R2 from ADJ to ground
  s.resistor(r1x, yOUT, r1x, yADJ).label(r1x, 275, 'R1', val.r1, 'left');
  s.dot(r1x, yADJ).wire([rx, yADJ], [r1x, yADJ]);
  s.resistor(r1x, yADJ, r1x, 420).ground(r1x, 420).label(r1x, 365, 'R2', val.r2, 'left');

  // ---- ground (the title sits between the pin rows, so it never meets a pin name)
  s.wire([gx, ic.y + ic.h + 12], [gx, gy]).ground(gx, gy);
  return s;
}
