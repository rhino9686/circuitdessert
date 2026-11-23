// Schematic of the Silergy SY7M212H / SY7T231H dual-phase application with current transformers, redrawn from the "Typical Application Circuit
// (SY7M212H with CTs)" on page 2 and the "Dual-Phase CT Configuration" on page 32 of the Rev. 1.1 data sheet.
// The figure is a block diagram: it shows two CTs, resistor dividers, a power-supply block, two batteries, the 32 kHz crystal and the LCD,
// serial, GPIO and pulse blocks, but prints no values and no part numbers. The values drawn here come from the datasheet's
// "Recommended External Components" table (page 13); the pins are the LQFP-100 pin names. Not drawn: the serial ports, the LCD, GPIO, PWM,
// pulse outputs, the debug port and RST/TEST (the figure draws them as blocks), the RSPIPD pull-downs, and any burden resistor or filter.
import { Sheet } from './lib.mjs';

export function dualPhaseCt({ id = 'sy7m212h-ct' } = {}) {
  const s = new Sheet(1000, 880, {
    top: 14,
    id,
    title: 'SY7M212H dual-phase application with current transformers',
    desc:
      'The "Typical Application Circuit (SY7M212H with CTs)" of the SY7M212H / SY7T231H data sheet, redrawn with the values of its Recommended External Components table. ' +
      'Phase A and phase B each pass through a current transformer whose secondary goes to IAP and IAN, or IBP and IBN. A resistor divider from each phase to neutral goes to VA or VB. ' +
      'Neutral is the circuit ground and is joined to GNDA and GNDD. A power-supply block feeds V3P3A and V3P3SYS, which are tied together, with 1.0 µF at each. V3P3D has 0.1 µF. ' +
      'A 32.768 kHz crystal sits across XIN and XOUT with 20 pF from each pin to ground. VBAT goes to a battery and VBAT_RTC to an RTC battery. ' +
      'VDD has 1.0 µF, VLCD 0.1 µF and V3P3RTC 1.0 µF. WAKE_COMP is an open terminal. The data sheet draws no burden resistor, no filter and no divider values.',
  });

  const ic = { x: 380, y: 190, w: 260, h: 580 };
  const lx = ic.x - 12;
  const rx = ic.x + ic.w + 12;
  const left = [
    { name: 'IAP', y: 230 }, { name: 'IAN', y: 258 }, { name: 'VA', y: 300 },
    { name: 'IBP', y: 400 }, { name: 'IBN', y: 428 }, { name: 'VB', y: 470 },
  ];
  const right = [
    { name: 'XIN', y: 230 }, { name: 'XOUT', y: 292 },
    { name: 'VBAT', y: 350 }, { name: 'VBAT_RTC', y: 450 }, { name: 'WAKE_COMP', y: 540 },
    { name: 'V3P3RTC', y: 590 }, { name: 'VLCD', y: 640 }, { name: 'VDD', y: 690 },
  ];
  const top = [{ name: 'V3P3A', x: 430 }, { name: 'V3P3SYS', x: 510 }, { name: 'V3P3D', x: 610 }];
  const bottom = [{ name: 'GNDA', x: 450 }, { name: 'GNDD', x: 520 }];
  s.ic(ic.x, ic.y, ic.w, ic.h, { left, right, top, bottom });
  s.text(ic.x + ic.w / 2, ic.y + ic.h / 2 - 6, 'SY7M212H', { cls: 'sch-ictitle', anchor: 'middle' });
  s.text(ic.x + ic.w / 2, ic.y + ic.h / 2 + 10, 'LQFP-100 pin names', { cls: 'sch-val', anchor: 'middle' });
  s.text(ic.x + ic.w / 2, ic.y + ic.h / 2 + 24, '(SY7T231H: QFN-68, no WAKE_COMP)', { cls: 'sch-val', anchor: 'middle' });

  const open = (x, y) => s.add(`<circle class="sch-w" cx="${x}" cy="${y}" r="3.5"/>`);
  const val = (x, y, t, anchor = 'start') => s.text(x, y, t, { cls: 'sch-val', anchor });

  // ---- current transformers: the phase conductor enters on the left and leaves at the bottom; the two secondary leads leave on the right
  const ct = (name, yLine, yp, yn) => {
    s.text(36, yLine - 10, `Phase ${name}`, { cls: 'sch-ref' });
    open(36.5, yLine);
    s.wire([40, yLine], [120, yLine]);
    s.add(`<rect class="sch-ic" x="120" y="${yLine - 30}" width="80" height="60" rx="3"/>`);
    s.text(160, yLine + 4, `CT ${name}`, { cls: 'sch-ictitle', anchor: 'middle' });
    s.wire([160, yLine + 30], [160, yLine + 48]);
    open(160, yLine + 51.5);
    val(172, yLine + 55, 'to load');
    s.wire([200, yp], [lx, yp]).wire([200, yn], [lx, yn]);
  };
  ct('A', 244, 230, 258);
  ct('B', 414, 400, 428);
  val(36, 188, 'No burden resistor, filter or values');
  val(36, 201, 'are drawn in the data sheet figure');

  // ---- resistor dividers to neutral: the tap of each goes to VA or VB
  const yN = 540;
  // phase A divider at x = 70 (crosses the phase B line with a hop)
  s.dot(70, 244);
  s.resistor(70, 244, 70, 300);
  s.dot(70, 300).wire([70, 300], [lx, 300]);
  s.resistor(70, 300, 70, 380);
  s.hwire(414, 40, 120, [70]);
  s.wire([70, 380], [70, yN]).dot(70, yN);
  // phase B divider at x = 110
  s.dot(110, 414);
  s.resistor(110, 414, 110, 470);
  s.dot(110, 470).wire([110, 470], [lx, 470]);
  s.resistor(110, 470, 110, 520);
  s.wire([110, 520], [110, yN]).dot(110, yN);
  s.wire([70, yN], [300, yN]);
  s.text(120, yN - 8, 'NEUTRAL', { cls: 'sch-ref' });
  s.ground(300, yN);
  val(212, 340, 'Resistor dividers');
  val(212, 353, '(values not given)');

  // ---- supply: power-supply block feeds V3P3A and V3P3SYS (tied), 1.0 µF on each; V3P3D 0.1 µF
  s.add(`<rect class="sch-ic" x="200" y="116" width="124" height="48" rx="3"/>`);
  s.text(262, 144, 'POWER SUPPLY', { cls: 'sch-pin', anchor: 'middle' });
  s.wire([324, 140], [510, 140]);
  s.wire([430, 178], [430, 140]).dot(430, 140);
  s.wire([510, 178], [510, 140]).dot(510, 140);
  s.capacitor(430, 140, 430, 106).groundUp(430, 106);
  s.capacitor(510, 140, 510, 106).groundUp(510, 106);
  s.label(430, 123, 'CV3P3A', '1.0 µF ±30%', 'left');
  s.label(510, 123, 'CV3P3S', '1.0 µF ±30%');
  val(336, 158, '3.0 to 3.6 V');
  s.wire([610, 178], [610, 150]);
  s.capacitor(610, 150, 610, 116).groundUp(610, 116);
  s.label(610, 133, 'CV3P3D', '0.1 µF ±20%');
  val(672, 164, '10 µF if low-power modes are used.');
  val(672, 177, 'Do not load this pin.');

  // ---- crystal on XIN / XOUT with 20 pF to ground on each pin
  s.wire([rx, 230], [720, 230]).dot(720, 230);
  s.wire([rx, 292], [720, 292]).dot(720, 292);
  s.wire([720, 230], [720, 253]).wire([708, 253], [732, 253]);
  s.add(`<rect class="sch-ic" x="713" y="259" width="14" height="14" rx="1"/>`);
  s.wire([708, 279], [732, 279]).wire([720, 279], [720, 292]);
  val(744, 262, '32.768 kHz');
  s.text(744, 275, 'XTAL', { cls: 'sch-ref' });
  s.capacitor(720, 230, 800, 230).ground(800, 230);
  s.capacitor(720, 292, 800, 292).ground(800, 292);
  s.label(760, 230, 'CXS', '20 pF ±10%', 'above');
  s.text(760, 316, 'CXL', { cls: 'sch-ref', anchor: 'middle' });
  val(760, 329, '20 pF ±10%', 'middle');

  // ---- batteries on VBAT and VBAT_RTC
  const battery = (y, name, note) => {
    s.wire([rx, y], [730, y]);
    s.wire([730, y], [730, y + 16]);
    s.wire([716, y + 16], [744, y + 16]);
    s.add(`<rect class="sch-dot" x="722" y="${y + 23}" width="16" height="4"/>`);
    s.wire([730, y + 27], [730, y + 46]).ground(730, y + 46);
    s.text(750, y + 18, '+', { cls: 'sch-val' });
    s.text(762, y + 30, name, { cls: 'sch-ref' });
    val(762, y + 44, note);
  };
  battery(350, 'BATTERY', 'BRN mode supply');
  battery(450, 'RTC BATTERY', 'RTC and NV-RAM backup');

  // ---- WAKE_COMP: open terminal
  s.wire([rx, 540], [700, 540]);
  open(703.5, 540);
  val(716, 544, 'Wake input; ground it if unused');

  // ---- bypass capacitors on V3P3RTC, VLCD and VDD
  const byp = (y, ref, v) => {
    s.wire([rx, y], [700, y]).dot(700, y);
    s.capacitor(700, y, 752, y).ground(752, y);
    s.label(752, y, ref, v, 'right');
  };
  byp(590, 'CVRTC', '1.0 µF ±30%');
  byp(640, 'CVLCD', '0.1 µF ±20%');
  byp(690, 'CVDD', '1.0 µF ±20%');

  // ---- ground pins join neutral
  s.wire([450, ic.y + ic.h + 12], [450, 800]).wire([520, ic.y + ic.h + 12], [520, 800]);
  s.wire([450, 800], [520, 800]).dot(485, 800).ground(485, 800);

  // ---- notes
  val(36, 850, 'Neutral is drawn as the circuit ground, joined to GNDA and GNDD (our reading of the figure).');
  val(36, 864, 'Not drawn: UART0 to UART5, SPI, I²C, LCD, GPIO, PWM, pulse outputs, SWD, RST, TEST.');
  return s;
}
