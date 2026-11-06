// Schematic of the Silergy SY24640 current-sense comparator, redrawn from the "Typical Application" (Figure 1) in its
// datasheet. The datasheet gives no component values, so the drawing shows none except the 10 kΩ ALERT pull-up that
// its text recommends. Pin names follow the datasheet's pin table. DELAY and HYS are left open as in Figure 1.
import { Sheet } from './lib.mjs';

export function overcurrentComparator({ id, part, v = {} }) {
  const val = { vs: '2.7–5.5 V', supply: '0–36 V', pullup: '10 kΩ', ...v };
  const s = new Sheet(800, 410, {
    top: 40,
    id,
    title: `${part} reference circuit`,
    desc:
      `Typical application of the ${part} current-sense comparator, redrawn from the datasheet. ` +
      `A shunt resistor RSENSE sits between the supply (${val.supply}) and the load. The supply side goes to the IN+ pin and the load side to the IN− pin. ` +
      `The VS pin takes ${val.vs} with a bypass capacitor to ground. ` +
      `The open-drain ALERT output has a ${val.pullup} pull-up resistor to VS and goes to a processor input. The ENABLE and LATCH pins are driven by processor outputs. ` +
      `The LIMIT pin has a resistor RLIMIT to ground, which sets the alert threshold with the pin's 20 µA current source, or it can instead be driven by a DAC. ` +
      `DELAY and HYS are left open, which selects the 10 µs response time and 2 mV of hysteresis. The GND pin goes to ground.`,
  });

  const ic = { x: 320, y: 100, w: 180, h: 240 };
  const lx = ic.x - 12;
  const rx = ic.x + ic.w + 12;
  const yIN1 = 160, yIN2 = 280; // IN+ and IN−
  const yALERT = 140, yEN = 180, yLATCH = 220, yLIMIT = 260, yDELAY = 300;
  const xVS = 410, xHYS = 370, xGND = 450;
  const rail = 70;
  const by = ic.y + ic.h + 12;

  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'IN+', y: yIN1 }, { name: 'IN−', y: yIN2 }],
    right: [
      { name: 'ALERT', y: yALERT }, { name: 'ENABLE', y: yEN }, { name: 'LATCH', y: yLATCH },
      { name: 'LIMIT', y: yLIMIT }, { name: 'DELAY', y: yDELAY },
    ],
    top: [{ name: 'VS', x: xVS }],
    bottom: [{ name: 'HYS', x: xHYS }, { name: 'GND', x: xGND }],
  }, { title: part });

  // ---- shunt between the supply and the load
  const rs = 150;
  s.port(60, yIN1, 'SUPPLY', 'in').wire([60, yIN1], [lx, yIN1]).text(66, yIN1 - 14, val.supply, { cls: 'sch-net', anchor: 'start' });
  s.dot(rs, yIN1).dot(rs, yIN2).resistor(rs, yIN1, rs, yIN2).label(rs, 220, 'RSENSE', 'shunt', 'right');
  s.wire([rs, yIN2], [lx, yIN2]).wire([rs, yIN2], [rs, 330]).text(rs, 348, 'to the load', { cls: 'sch-net', anchor: 'middle' });

  // ---- VS rail: supply flag, bypass capacitor, and the ALERT pull-up
  const cvx = 250, rpx = 570;
  s.port(60, rail, 'VS', 'in').text(10, rail - 14, val.vs, { cls: 'sch-net', anchor: 'start' });
  s.wire([60, rail], [rpx, rail]).dot(xVS, rail).wire([xVS, rail], [xVS, ic.y - 12]);
  s.dot(cvx, rail).capacitor(cvx, rail, cvx, 120).ground(cvx, 120).label(cvx, 98, 'CBYPASS', 'value not given', 'right');

  // ---- right-hand pins
  const xEnd = 650;
  s.wire([rx, yEN], [xEnd, yEN]).text(xEnd + 8, yEN + 4, 'from a GPIO', { cls: 'sch-net', anchor: 'start' });
  s.wire([rx, yLATCH], [xEnd, yLATCH]).text(xEnd + 8, yLATCH + 4, 'from a GPIO', { cls: 'sch-net', anchor: 'start' });
  s.wire([rx, yALERT], [xEnd, yALERT]).text(xEnd + 8, yALERT + 4, 'to a GPIO', { cls: 'sch-net', anchor: 'start' });
  s.dot(rpx, rail).resistor(rpx, rail, rpx, yALERT).dot(rpx, yALERT).label(rpx, 104, 'RPULLUP', val.pullup, 'left');
  const rlx = 610;
  s.wire([rx, yLIMIT], [xEnd, yLIMIT]).dot(rlx, yLIMIT).text(xEnd + 8, yLIMIT + 4, 'or a DAC', { cls: 'sch-net', anchor: 'start' });
  s.resistor(rlx, yLIMIT, rlx, 340).ground(rlx, 340).label(rlx, 308, 'RLIMIT', 'sets the limit', 'right');
  s.text(rx + 8, yDELAY + 4, 'open: 10 µs', { cls: 'sch-net', anchor: 'start' });
  s.text(xHYS, by + 20, 'open: 2 mV', { cls: 'sch-net', anchor: 'middle' });

  // ---- ground
  s.wire([xGND, by], [xGND, 372]).ground(xGND, 372);
  return s;
}
