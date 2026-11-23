// Supporting circuit of the Silergy SY7M713J (LQFP-100): supply bypass, 32.768 kHz crystal, backup batteries and the
// pins that are tied low when unused. The datasheet draws only system block diagrams (pages 3 and 36), so this drawing
// is ours: every part and value comes from its "Recommended External Components" table, the pin descriptions, the
// "Battery Connection Options" table and the "Unused Pins" table. The current and voltage sensor inputs are not drawn.
// U1 and the battery names are ours; the capacitor names are the datasheet's.
import { Sheet } from './lib.mjs';

function crystal(s, x, y1, y2) {
  const mid = (y1 + y2) / 2;
  s.wire([x, y1], [x, mid - 14]).wire([x, mid + 14], [x, y2]);
  s.wire([x - 14, mid - 14], [x + 14, mid - 14]).wire([x - 14, mid + 14], [x + 14, mid + 14]);
  s.add(`<rect class="sch-w" x="${x - 8}" y="${mid - 10}" width="16" height="20"/>`);
}

function battery(s, x, y1, y2) {
  // a long plate (+) on top, a short plate below, then ground
  s.wire([x, y1], [x, y1 + 12]);
  s.wire([x - 14, y1 + 12], [x + 14, y1 + 12]);
  s.wire([x - 8, y1 + 20], [x + 8, y1 + 20]);
  s.wire([x, y1 + 20], [x, y2]);
  s.text(x + 20, y1 + 14, '+', { cls: 'sch-ref' });
  s.ground(x, y2);
}

export function essentialConnections({ id }) {
  const s = new Sheet(840, 650, {
    id,
    title: 'SY7M713J supply, crystal and battery connections',
    desc:
      'Supporting circuit of the SY7M713J metering SoC in its 100-pin package, built from the datasheet tables. ' +
      'V3P3A and V3P3SYS come from the same 3.3 V supply and each has a 1.0 microfarad ceramic capacitor to ground. ' +
      'V3P3D has 0.1 microfarad, VDD 1.0 microfarad, V3P3RTC 1.0 microfarad and VLCD 0.1 microfarad, each to ground. ' +
      'A 32.768 kilohertz crystal sits between XIN and XOUT with a 22 picofarad capacitor from XIN and a 33 picofarad capacitor from XOUT to ground. ' +
      'Battery 1 is on VBAT and battery 2 on VBAT_RTC. RST, TEST and WAKE_COMP are tied to ground, and GNDA and GNDD join one ground. ' +
      'The current and voltage sensor inputs are not drawn.',
  });

  const ic = { x: 330, y: 40, w: 240, h: 500 };
  const lx = ic.x - 12;
  const rx = ic.x + ic.w + 12;
  const L = { V3P3A: 80, V3P3SYS: 160, V3P3D: 240, VDD: 320, V3P3RTC: 400, VLCD: 480 };
  const R = { XIN: 80, XOUT: 160, VBAT: 240, VBAT_RTC: 335, RST: 430, TEST: 470, WAKE_COMP: 510 };
  const xGNDA = 400, xGNDD = 500;

  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: Object.entries(L).map(([name, y]) => ({ name, y })),
    right: Object.entries(R).map(([name, y]) => ({ name, y })),
    bottom: [{ name: 'GNDA', x: xGNDA }, { name: 'GNDD', x: xGNDD }],
  }, { title: 'SY7M713J', subtitle: 'U1 (LQFP-100)' });

  // ---- left side: one 3.3 V supply into V3P3A and V3P3SYS, then the bypass capacitors
  const bx = 230;
  s.port(60, 120, '3.3 V', 'in').text(14, 104, '3.0–3.6 V', { cls: 'sch-net', anchor: 'start' });
  s.wire([60, 120], [100, 120]).dot(100, 120);
  s.wire([100, 120], [100, L.V3P3A], [lx, L.V3P3A]);
  s.wire([100, 120], [100, L.V3P3SYS], [lx, L.V3P3SYS]);
  const caps = [
    ['V3P3A', 'CV3P3A', '1.0 µF'],
    ['V3P3SYS', 'CV3P3S', '1.0 µF'],
    ['V3P3D', 'CV3P3D', '0.1 µF'],
    ['VDD', 'CVDD', '1.0 µF'],
    ['V3P3RTC', 'CVRTC', '1.0 µF'],
    ['VLCD', 'CVLCD', '0.1 µF'],
  ];
  for (const [pin, ref, val] of caps) {
    const y = L[pin];
    s.wire([bx, y], [lx, y]);
    s.dot(bx, y).capacitor(bx, y, bx, y + 40).ground(bx, y + 40).label(bx, y + 20, ref, val, 'left');
  }
  s.text(bx + 14, L.V3P3D - 8, 'not for loads', { cls: 'sch-val', anchor: 'start' });
  s.text(bx - 28, L.V3P3D + 66, '10 µF if low-power modes are used', { cls: 'sch-val', anchor: 'end' });

  // ---- crystal on XIN / XOUT, each side with its load capacitor
  const cxn = 620, xtal = 690;
  s.wire([rx, R.XIN], [xtal, R.XIN]).wire([rx, R.XOUT], [xtal, R.XOUT]);
  crystal(s, xtal, R.XIN, R.XOUT);
  s.dot(cxn, R.XIN).capacitor(cxn, R.XIN, cxn, R.XIN + 36).ground(cxn, R.XIN + 36).label(cxn, R.XIN + 18, 'CXS', '22 pF', 'left');
  s.dot(cxn, R.XOUT).capacitor(cxn, R.XOUT, cxn, R.XOUT + 36).ground(cxn, R.XOUT + 36).label(cxn, R.XOUT + 18, 'CXL', '33 pF', 'left');
  s.text(xtal + 20, (R.XIN + R.XOUT) / 2 + 4, 'XTAL', { cls: 'sch-ref' });
  s.text(xtal + 20, (R.XIN + R.XOUT) / 2 + 17, '32.768 kHz', { cls: 'sch-val' });

  // ---- batteries: 1 on VBAT (brownout mode), 2 on VBAT_RTC (sleep mode, RTC and NV-RAM)
  const bt = 690;
  s.wire([rx, R.VBAT], [bt, R.VBAT]);
  battery(s, bt, R.VBAT, R.VBAT + 52);
  s.text(bt + 22, R.VBAT + 30, 'BT1', { cls: 'sch-ref' });
  s.text(bt + 22, R.VBAT + 43, 'battery 1', { cls: 'sch-val' });
  s.wire([rx, R.VBAT_RTC], [bt, R.VBAT_RTC]);
  battery(s, bt, R.VBAT_RTC, R.VBAT_RTC + 52);
  s.text(bt + 22, R.VBAT_RTC + 30, 'BT2', { cls: 'sch-ref' });
  s.text(bt + 22, R.VBAT_RTC + 43, 'battery 2', { cls: 'sch-val' });

  // ---- pins tied low
  for (const pin of ['RST', 'TEST', 'WAKE_COMP']) {
    const y = R[pin];
    s.wire([rx, y], [rx + 40, y]).ground(rx + 40, y);
  }
  s.text(rx + 62, R.RST + 4, 'tied low in production', { cls: 'sch-val' });
  s.text(rx + 62, R.TEST + 4, 'high only to program', { cls: 'sch-val' });
  s.text(rx + 62, R.WAKE_COMP + 4, 'tied low when unused', { cls: 'sch-val' });

  // ---- grounds
  const gy = ic.y + ic.h + 36;
  s.wire([xGNDA, ic.y + ic.h + 12], [xGNDA, gy], [xGNDD, gy]).wire([xGNDD, ic.y + ic.h + 12], [xGNDD, gy]);
  s.dot(xGNDA, gy).dot(xGNDD, gy).ground(450, gy).wire([xGNDA, gy], [xGNDD, gy]);

  s.text(14, 628, 'Pin names are the LQFP-100 pins. Sensor inputs, serial ports, LCD and the programming header are not drawn.', { cls: 'sch-net', anchor: 'start' });
  return s;
}
