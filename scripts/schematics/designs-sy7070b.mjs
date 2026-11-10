// Schematic of the Silergy SY7070B synchronous boost converter (SOT23-5, fixed 2.8 V output), redrawn from the "Typical
// Application" (Figure 1) on page 1 of the datasheet (SY7070B Rev. 1.0). The datasheet has no bill of materials, so only the
// values printed in Figure 1 are shown: CIN 10 µF, L 4.7 µH, COUT 10 µF. The EN pin is driven by an "Enable Signal".
import { Sheet } from './lib.mjs';

export function lowVoltageBoostFixed({ id, part = 'SY7070B' }) {
  const s = new Sheet(670, 290, {
    id,
    top: 10,
    title: `${part} typical application`,
    desc:
      `Typical application of the ${part} synchronous boost converter with a fixed 2.8 V output, redrawn from the datasheet's Figure 1. ` +
      `The input VIN has a 10 µF capacitor CIN to ground and feeds the IN pin. A 4.7 µH inductor L runs from VIN to the LX pin. ` +
      `The EN pin is driven by an enable signal. The VOUT pin is the 2.8 V output with a 10 µF capacitor COUT to ground, and the GND pin goes to ground.`,
  });
  const ic = { x: 300, y: 100, w: 150, h: 160 };
  const lx = ic.x - 12;
  const rx = ic.x + ic.w + 12;
  const pin = { in: 130, en: 180, gnd: 230 }; // left pins, as in the datasheet's figure
  const right = { lx: 130, vout: 180 };
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'IN', y: pin.in }, { name: 'EN', y: pin.en }, { name: 'GND', y: pin.gnd }],
    right: [{ name: 'LX', y: right.lx }, { name: 'VOUT', y: right.vout }],
  });
  s.text(ic.x + ic.w / 2, 214, part, { cls: 'sch-ictitle', anchor: 'middle' }); // below the EN and VOUT rows, so it clears their pin names

  // input rail, CIN and the ground connection
  s.port(60, pin.in, 'VIN', 'in').text(14, pin.in - 14, '0.7–5 V', { cls: 'sch-net', anchor: 'start' });
  s.wire([60, pin.in], [lx, pin.in]);
  s.dot(100, pin.in).capacitor(100, pin.in, 100, pin.gnd).label(100, 180, 'CIN', '10 µF', 'left');
  s.dot(100, pin.gnd).wire([100, pin.gnd], [lx, pin.gnd]).ground(100, pin.gnd);

  // inductor from VIN up and over to LX
  s.dot(210, pin.in).wire([210, pin.in], [210, 60], [290, 60]).inductor(290, 60, 370, 60).label(330, 60, 'L', '4.7 µH', 'above');
  s.wire([370, 60], [490, 60], [490, pin.in], [rx, pin.in]);

  // enable signal
  s.wire([lx, pin.en], [220, pin.en]);
  s.add(`<circle class="sch-w" cx="216" cy="${pin.en}" r="3.5"/>`);
  s.text(208, pin.en + 4, 'Enable signal', { cls: 'sch-val', anchor: 'end' });

  // output
  s.wire([rx, right.vout], [610, right.vout]);
  s.add(`<circle class="sch-w" cx="614" cy="${right.vout}" r="3.5"/>`);
  s.text(614, right.vout - 14, 'VOUT = 2.8 V', { cls: 'sch-net', anchor: 'end' });
  s.dot(540, right.vout).capacitor(540, right.vout, 540, 240).ground(540, 240).label(540, 214, 'COUT', '10 µF', 'right');
  return s;
}
