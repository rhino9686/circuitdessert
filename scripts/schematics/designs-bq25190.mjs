// Schematic of the TI BQ25190 charger / power-path PMIC, redrawn from Figure 8-1 of its datasheet (SLUSF40A),
// "BQ25190 Typical Application Diagram". Netlist read from the page rendered at 300 dpi (PDF page 83):
//   VBUS -> IN (2.2 uF to ground)             SDA, SCL, INT -> host and one resistor each to BKOUT (values not printed)
//   GPIO1, GPIO2 open                         GPIO3 and GPIO4 tied together to ground
//   /CE -> host                               VPU -> BKOUT              ADCIN -> ground
//   VINLS1 -> SYS (2.2 uF)  LSLDO1 (1 uF)     BKSW -> 1 uH -> BKOUT node (10 uF to ground), BKOUT pin to that node, BKGND to ground
//   SYS (one 10 uF) -> system load            /MR -> push-button to ground
//   BAT (1 uF) -> battery +                   TS -> 10 kOhm to ground and the pack NTC to ground    GND -> ground
//   VINLS2 -> SYS (2.2 uF)  LSLDO2 (1 uF)     BBSW1 - 2.2 uH - BBSW2     BBOUT (22 uF)     BBGND to ground
// The figure draws one SYS terminal for the three SYS balls (A5, D5, F5) and one GND terminal for the two GND balls (A1, B5); so does this drawing.
// Not drawn: the internal FETs Q1, Q2 and Q3, the host box, the VBUS source box, the battery and the system load (flags stand in for them).
// Pull-up values come from the pin table (SDA, SCL 10 kOhm; INT 1 to 20 kOhm), not from the figure.
import { Sheet } from './lib.mjs';

export function pmicChargerBq25190({ id, part = 'BQ25190' }) {
  const s = new Sheet(840, 1070, {
    id,
    top: 60,
    title: `${part} charger and power-path PMIC, typical application`,
    desc:
      `Typical application of the ${part} redrawn from the datasheet's Figure 8-1. VBUS feeds IN, which has a 2.2 microfarad capacitor to ground. ` +
      'SDA, SCL and INT go to the host and are pulled up to BKOUT through three resistors; VPU is also connected to BKOUT. CE goes to the host. GPIO1 and GPIO2 are left open, and GPIO3 and GPIO4 are tied together and to ground. ADCIN is grounded. ' +
      'VINLS1 and VINLS2 are fed from SYS, each with a 2.2 microfarad capacitor; LSLDO1 and LSLDO2 each have a 1 microfarad output capacitor. ' +
      'The buck switch node BKSW goes through a 1 microhenry inductor to the BKOUT node, which has a 10 microfarad capacitor to ground and is wired back to the BKOUT pin. BKGND is grounded. ' +
      'The buck-boost has a 2.2 microhenry inductor between BBSW1 and BBSW2, a 22 microfarad capacitor on BBOUT, and BBGND is grounded. ' +
      'SYS has a 10 microfarad capacitor and feeds the system load. MR goes to a push-button to ground. BAT has a 1 microfarad capacitor and goes to the battery positive terminal. TS has a 10 kilohm resistor to ground in parallel with the battery pack thermistor. GND is grounded.',
  });

  const ic = { x: 360, y: 120, w: 190, h: 910 };
  const px = ic.x - 12, qx = ic.x + ic.w + 12; // pin ends on the left and right
  // pin rows
  const L = {
    in: 150, sda: 250, scl: 286, int: 322, gpio1: 358, gpio2: 394, gpio3: 430, gpio4: 466, ce: 502, vpu: 538, adcin: 574,
    vinls1: 650, lsldo1: 740, bksw: 870, bkout: 910, bkgnd: 1000,
  };
  const R = { sys: 150, mr: 230, bat: 330, ts: 410, gnd: 540, vinls2: 610, lsldo2: 700, bbsw1: 790, bbsw2: 850, bbout: 930, bbgnd: 1010 };
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [
      { name: 'IN', y: L.in }, { name: 'SDA', y: L.sda }, { name: 'SCL', y: L.scl }, { name: '/INT', y: L.int },
      { name: 'GPIO1', y: L.gpio1 }, { name: 'GPIO2', y: L.gpio2 }, { name: 'GPIO3', y: L.gpio3 }, { name: 'GPIO4', y: L.gpio4 },
      { name: '/CE', y: L.ce }, { name: 'VPU', y: L.vpu }, { name: 'ADCIN', y: L.adcin },
      { name: 'VINLS1', y: L.vinls1 }, { name: 'LSLDO1', y: L.lsldo1 },
      { name: 'BKSW', y: L.bksw }, { name: 'BKOUT', y: L.bkout }, { name: 'BKGND', y: L.bkgnd },
    ],
    right: [
      { name: 'SYS', y: R.sys }, { name: '/MR', y: R.mr }, { name: 'BAT', y: R.bat }, { name: 'TS', y: R.ts }, { name: 'GND', y: R.gnd },
      { name: 'VINLS2', y: R.vinls2 }, { name: 'LSLDO2', y: R.lsldo2 },
      { name: 'BBSW1', y: R.bbsw1 }, { name: 'BBSW2', y: R.bbsw2 }, { name: 'BBOUT', y: R.bbout }, { name: 'BBGND', y: R.bbgnd },
    ],
  });
  s.text(ic.x + ic.w / 2, ic.y + 26, part, { cls: 'sch-ictitle', anchor: 'middle' });
  s.text(ic.x + ic.w / 2, ic.y + 86, 'SYS = A5, D5, F5', { cls: 'sch-val', anchor: 'middle' });
  s.text(ic.x + ic.w / 2, ic.y + 100, 'GND = A1, B5', { cls: 'sch-val', anchor: 'middle' });
  s.text(ic.x + ic.w / 2, ic.y + 114, '(each drawn once)', { cls: 'sch-val', anchor: 'middle' });

  // ---------------------------------------------------------------- left side
  // IN: VBUS in, 2.2 uF to ground (drawn upward, clear of the host lines below)
  s.wire([90, L.in], [px, L.in]);
  s.port(90, L.in, 'VBUS', 'in');
  s.dot(270, L.in);
  s.capacitor(270, L.in, 270, 104).groundUp(270, 104);
  s.label(270, 127, 'CIN', '2.2 µF', 'right');

  // BKOUT rail with the three pull-ups. SDA's resistor is nearest the IC, so it crosses nothing; the others hop over the rows below their tap.
  const yRail = 190;
  const xr = { int: 150, scl: 220, sda: 290 };
  s.wire([110, yRail], [xr.sda, yRail]);
  s.text(104, yRail + 4, 'BKOUT', { cls: 'sch-net', anchor: 'end' });
  s.dot(xr.int, yRail).dot(xr.scl, yRail);
  s.resistor(xr.sda, yRail, xr.sda, L.sda);
  // R2 and R3 sit in the band above the SDA row and continue down as plain wire, so no resistor body crosses a host line
  s.resistor(xr.scl, yRail, xr.scl, L.sda).wire([xr.scl, L.sda], [xr.scl, L.scl]);
  s.resistor(xr.int, yRail, xr.int, L.sda).wire([xr.int, L.sda], [xr.int, L.int]);
  s.label(xr.sda, 218, 'R1', '10 kΩ', 'right');
  s.label(xr.scl, 218, 'R2', '10 kΩ', 'left');
  s.label(xr.int, 218, 'R3', '1–20 kΩ', 'left');
  s.hwire(L.sda, px, 90, [xr.scl, xr.int]);
  s.hwire(L.scl, px, 90, [xr.int]);
  s.hwire(L.int, px, 90);
  s.dot(xr.sda, L.sda).dot(xr.scl, L.scl).dot(xr.int, L.int);
  s.port(90, L.sda, 'SDA', 'in');
  s.port(90, L.scl, 'SCL', 'in');
  s.port(90, L.int, 'INT', 'in');

  // GPIO1 and GPIO2 are left open in the figure
  for (const y of [L.gpio1, L.gpio2]) s.wire([px, y], [px - 30, y]);
  s.text(px - 36, L.gpio1 + 4, 'open', { cls: 'sch-net', anchor: 'end' });
  s.text(px - 36, L.gpio2 + 4, 'open', { cls: 'sch-net', anchor: 'end' });
  // GPIO3 and GPIO4 tied together and to ground
  s.wire([px, L.gpio3], [270, L.gpio3], [270, L.gpio4]);
  s.wire([px, L.gpio4], [270, L.gpio4]);
  s.dot(270, L.gpio4).ground(270, L.gpio4);
  // /CE to the host, VPU to BKOUT
  s.wire([90, L.ce], [px, L.ce]);
  s.port(90, L.ce, '/CE', 'in');
  s.wire([110, L.vpu], [px, L.vpu]);
  s.text(104, L.vpu + 4, 'BKOUT', { cls: 'sch-net', anchor: 'end' });
  // ADCIN to ground
  s.wire([px, L.adcin], [300, L.adcin]);
  s.ground(300, L.adcin);

  // VINLS1 from SYS with 2.2 uF; LSLDO1 with 1 uF and an output flag
  s.wire([90, L.vinls1], [px, L.vinls1]);
  s.port(90, L.vinls1, 'SYS', 'in');
  s.dot(270, L.vinls1);
  s.capacitor(270, L.vinls1, 270, L.vinls1 + 50).ground(270, L.vinls1 + 50);
  s.label(270, L.vinls1 + 25, 'CVINLS1', '2.2 µF', 'left');
  s.wire([90, L.lsldo1], [px, L.lsldo1]);
  s.port(90, L.lsldo1, 'LDO1', 'in');
  s.dot(270, L.lsldo1);
  s.capacitor(270, L.lsldo1, 270, L.lsldo1 + 50).ground(270, L.lsldo1 + 50);
  s.label(270, L.lsldo1 + 25, 'CLSLDO1', '1 µF', 'left');

  // buck: BKSW - 1 uH - node with 10 uF to ground, wired back to the BKOUT pin
  s.wire([px, L.bksw], [310, L.bksw]);
  s.inductor(310, L.bksw, 210, L.bksw);
  s.label(260, L.bksw, 'LBK', '1 µH', 'above');
  s.wire([210, L.bksw], [210, L.bkout]);
  s.wire([px, L.bkout], [210, L.bkout]);
  s.dot(210, L.bkout);
  s.capacitor(210, L.bkout, 210, L.bkout + 50).ground(210, L.bkout + 50);
  s.label(210, L.bkout + 25, 'CBKOUT', '10 µF', 'left');
  s.wire([px, L.bkgnd], [300, L.bkgnd]);
  s.ground(300, L.bkgnd);

  // ---------------------------------------------------------------- right side
  const xc = 620; // column of the capacitors
  const xo = 760; // output flags
  // SYS: one 10 uF, then the system load
  s.wire([qx, R.sys], [xo, R.sys]);
  s.dot(xc, R.sys);
  s.capacitor(xc, R.sys, xc, R.sys + 46).ground(xc, R.sys + 46);
  s.label(xc, R.sys + 23, 'CSYS', '10 µF', 'right');
  s.port(xo, R.sys, 'SYS', 'out');
  // /MR to a push-button
  const xm = 690;
  s.wire([qx, R.mr], [xm, R.mr], [xm, R.mr + 19]);
  s.add(`<circle class="sch-w" cx="${xm}" cy="${R.mr + 22}" r="3"/>`);
  s.add(`<circle class="sch-w" cx="${xm}" cy="${R.mr + 46}" r="3"/>`);
  s.wire([xm, R.mr + 46], [xm + 12, R.mr + 24]);
  s.wire([xm, R.mr + 49], [xm, R.mr + 58]);
  s.ground(xm, R.mr + 58);
  s.text(xm + 22, R.mr + 38, 'push-button', { cls: 'sch-val', anchor: 'start' });
  // BAT: 1 uF and the battery
  s.wire([qx, R.bat], [xo, R.bat]);
  s.dot(xc, R.bat);
  s.capacitor(xc, R.bat, xc, R.bat + 46).ground(xc, R.bat + 46);
  s.label(xc, R.bat + 23, 'CBAT', '1 µF', 'right');
  s.port(xo, R.bat, 'BAT+', 'out');
  // TS: 10 kOhm and the pack NTC, both to ground
  const xn = 700;
  s.wire([qx, R.ts], [xn, R.ts]);
  s.dot(xc, R.ts);
  s.resistor(xc, R.ts, xc, R.ts + 60).ground(xc, R.ts + 60);
  s.label(xc, R.ts + 30, 'R4', '10 kΩ', 'left');
  s.resistor(xn, R.ts, xn, R.ts + 60).ground(xn, R.ts + 60);
  s.text(xn + 16, R.ts + 28, 'NTC', { cls: 'sch-ref', anchor: 'start' });
  s.text(xn + 16, R.ts + 41, 'in the pack', { cls: 'sch-val', anchor: 'start' });
  // GND
  s.wire([qx, R.gnd], [xc, R.gnd]);
  s.ground(xc, R.gnd);
  // VINLS2 from SYS with 2.2 uF; LSLDO2 with 1 uF and an output flag
  s.wire([qx, R.vinls2], [xo, R.vinls2]);
  s.dot(xc, R.vinls2);
  s.capacitor(xc, R.vinls2, xc, R.vinls2 + 46).ground(xc, R.vinls2 + 46);
  s.label(xc, R.vinls2 + 23, 'CVINLS2', '2.2 µF', 'right');
  s.port(xo, R.vinls2, 'SYS', 'out');
  s.wire([qx, R.lsldo2], [xo, R.lsldo2]);
  s.dot(xc, R.lsldo2);
  s.capacitor(xc, R.lsldo2, xc, R.lsldo2 + 46).ground(xc, R.lsldo2 + 46);
  s.label(xc, R.lsldo2 + 23, 'CLSLDO2', '1 µF', 'right');
  s.port(xo, R.lsldo2, 'LDO2', 'out');
  // buck-boost: 2.2 uH between BBSW1 and BBSW2, 22 uF on BBOUT
  const xl = 650;
  s.wire([qx, R.bbsw1], [xl, R.bbsw1]);
  s.wire([qx, R.bbsw2], [xl, R.bbsw2]);
  s.inductor(xl, R.bbsw1, xl, R.bbsw2);
  s.label(xl, (R.bbsw1 + R.bbsw2) / 2, 'LBB', '2.2 µH', 'right');
  s.wire([qx, R.bbout], [xo, R.bbout]);
  s.dot(xc, R.bbout);
  s.capacitor(xc, R.bbout, xc, R.bbout + 46).ground(xc, R.bbout + 46);
  s.label(xc, R.bbout + 23, 'CBBOUT', '22 µF', 'right');
  s.text(xo + 8, R.bbout + 4, 'BBOUT', { cls: 'sch-net', anchor: 'start' });
  s.wire([qx, R.bbgnd], [700, R.bbgnd]);
  s.ground(700, R.bbgnd);

  // ---------------------------------------------------------------- notes
  s.text(40, 1050, 'Not drawn: Q1, Q2 and Q3 inside the IC, the host, the VBUS source, the battery and the system load (flags stand in).', { cls: 'sch-net', anchor: 'start' });
  s.text(40, 1066, 'The figure prints no values for the three pull-ups; those drawn are from the pin table.', { cls: 'sch-net', anchor: 'start' });
  return s;
}
