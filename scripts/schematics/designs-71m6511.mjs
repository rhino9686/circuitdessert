// Basic connections for the Teridian 71M6511 / 71M6511H, assembled from several figures of the V2.7 data sheet (November 2010).
// The data sheet has no complete application circuit. This drawing puts together what it does give: the "Recommended External Components" table
// (page 91), Figures 27 and 28 (sensors, page 77), Figure 32 (LCD boost, page 81), Figure 36 (V1 divider, page 83) and Figure 37 (RESETZ, page 84),
// plus the pin descriptions (page 94 to 95) for VREF, V2P5, VBAT and TEST. The pin arrangement is ours (pins grouped by function, not by package position).
// Not drawn: the LCD segment and common pins, the DIO pins, the UART, optical and emulator pins, CKTEST and TMUXOUT, and the second current input IB.
import { Sheet } from './lib.mjs';

export function meterBasics({ id = '71m6511', part = '71M6511' } = {}) {
  const s = new Sheet(960, 770, {
    top: 30,
    id,
    title: `${part} basic connections`,
    desc:
      `A basic-connections drawing for the ${part}, put together from several figures of its data sheet because the data sheet has no complete application circuit. ` +
      `V3P3A, V3P3D and VBAT are on one 3.3 V rail; V3P3A and V3P3D each have 0.1 µF to ground, and VBAT goes to the same rail when no battery is used. ` +
      `A current sensor (a current transformer with a burden resistor, a shunt or a Rogowski coil) connects to IA with its return on V3P3. A resistive divider, Rin from the line voltage and Rout to V3P3, connects to VA. ` +
      `V1 is fed from a divider: R1 from the supply to be monitored, R2 to ground, then 10 kΩ in series and 100 pF to ground at the pin, with a header jumper across R1 for debugging. ` +
      `RESETZ has 200 Ω to 3.3 V, 1 nF to ground, and a pushbutton through 10 Ω to ground. TEST goes to ground. ` +
      `A 32.768 kHz crystal sits between XIN and XOUT with 22 pF from each pin to ground. VBIAS has 1000 pF, VREF 0.1 µF and V2P5 0.1 µF to ground. ` +
      `For a 5 V LCD, VDRV drives a 33 nF coupling capacitor and two diodes from 3.3 V that charge a reservoir capacitor of 0.22 µF or more on VLCD. ` +
      `GNDA and GNDD join at one ground. The LCD, DIO, UART, optical and emulator pins and IB are not drawn.`,
  });

  const ic = { x: 390, y: 130, w: 220, h: 540 };
  const lx = ic.x - 12;
  const rx = ic.x + ic.w + 12;

  const left = [
    { name: 'IA', y: 160 }, { name: 'IB', y: 235 }, { name: 'VA', y: 300 },
    { name: 'V1', y: 410 }, { name: 'RESETZ', y: 545 }, { name: 'TEST', y: 620 },
  ];
  const right = [
    { name: 'XIN', y: 160 }, { name: 'XOUT', y: 225 },
    { name: 'VBIAS', y: 290 }, { name: 'VREF', y: 360 }, { name: 'V2P5', y: 430 },
    { name: 'VDRV', y: 520 }, { name: 'VLCD', y: 580 },
  ];
  const top = [{ name: 'V3P3A', x: 450 }, { name: 'V3P3D', x: 520 }, { name: 'VBAT', x: 590 }];
  const bottom = [{ name: 'GNDA', x: 440 }, { name: 'GNDD', x: 500 }];
  s.ic(ic.x, ic.y, ic.w, ic.h, { left, right, top, bottom });
  s.text(ic.x + ic.w / 2, ic.y + ic.h / 2, part, { cls: 'sch-ictitle', anchor: 'middle' });
  s.text(ic.x + ic.w / 2, ic.y + ic.h / 2 + 16, 'GNDA is two pins', { cls: 'sch-val', anchor: 'middle' });

  const open = (x, y) => s.add(`<circle class="sch-w" cx="${x}" cy="${y}" r="3.5"/>`);
  const val = (x, y, t, anchor = 'start') => s.text(x, y, t, { cls: 'sch-val', anchor });
  const net = (x, y, t) => s.text(x, y, t, { cls: 'sch-net', anchor: 'middle' });

  // ---- supply: one 3.3 V rail on V3P3A, V3P3D and VBAT (no battery)
  const bus = 84;
  s.wire([370, bus], [640, bus]);
  val(362, bus + 4, '3.3 V', 'end');
  for (const x of [450, 520, 590]) s.wire([x, ic.y - 12], [x, bus]).dot(x, bus);
  s.capacitor(450, bus, 450, 54).groundUp(450, 54);
  val(464, 72, '0.1 µF');
  s.capacitor(520, bus, 520, 54).groundUp(520, 54);
  val(534, 72, '0.1 µF');
  val(604, 108, 'no battery', 'start');

  // ---- IA: current sensor box, return on V3P3
  s.add('<rect class="sch-ic" x="110" y="136" width="150" height="76" rx="2"/>');
  val(185, 162, 'Current sensor:', 'middle');
  val(185, 176, 'CT and burden R,', 'middle');
  val(185, 190, 'shunt or Rogowski coil', 'middle');
  s.wire([260, 160], [lx, 160]);
  s.wire([260, 200], [300, 200]);
  net(300, 216, 'V3P3');
  // ---- IB: not drawn, open terminal and a note
  s.wire([lx, 235], [320, 235]); open(316.5, 235);
  val(110, 231, 'IB: second sensor,', 'start');
  val(110, 245, 'or tie to V3P3A or IA', 'start');
  // ---- VA: Rin from the line voltage, Rout to V3P3
  s.wire([lx, 300], [210, 300]);
  s.resistor(130, 300, 210, 300);
  s.wire([123.5, 300], [130, 300]); open(120, 300);
  val(112, 304, 'line voltage', 'end');
  val(170, 286, 'Rin', 'middle');
  s.dot(300, 300);
  s.resistor(300, 300, 300, 340);
  s.wire([300, 340], [300, 350]);
  net(300, 364, 'V3P3');
  val(312, 324, 'Rout');

  // ---- V1: Figure 36 (R1 with a debug jumper, R2, R3 10 kΩ, C1 100 pF)
  const yv = 410;
  s.wire([lx, yv], [330, yv]);
  s.resistor(130, yv, 210, yv);
  s.wire([123.5, yv], [130, yv]); open(120, yv);
  val(112, yv + 4, 'supply', 'end');
  s.wire([210, yv], [230, yv]).dot(230, yv);
  s.resistor(230, yv, 310, yv);
  s.wire([310, yv], [330, yv]);
  s.dot(330, yv);
  s.resistor(230, yv, 230, yv + 40).wire([230, yv + 40], [230, yv + 40]).ground(230, yv + 40);
  s.capacitor(330, yv, 330, yv + 40).ground(330, yv + 40);
  s.add(`<path class="sch-w" d="M130 ${yv} L130 ${yv - 26} L210 ${yv - 26} L210 ${yv}" stroke-dasharray="4 3" fill="none"/>`);
  s.dot(130, yv).dot(210, yv);
  val(170, yv - 32, 'debug jumper', 'middle');
  val(170, yv + 22, 'R1', 'middle');
  val(218, yv + 26, 'R2', 'end');
  val(270, yv + 22, '10 kΩ', 'middle');
  val(348, yv + 26, '100 pF');

  // ---- RESETZ: Figure 37 (200 Ω to 3.3 V, 1 nF, pushbutton through 10 Ω)
  const yr = 545;
  s.wire([lx, yr], [240, yr]);
  s.dot(300, yr).dot(240, yr);
  s.resistor(300, yr, 300, yr - 40);
  net(300, yr - 50, 'V3P3');
  val(312, yr - 14, '200 Ω');
  s.capacitor(240, yr, 240, yr + 40).ground(240, yr + 40);
  val(258, yr + 26, '1 nF');
  s.resistor(160, yr, 240, yr);
  s.wire([130, yr], [160, yr]);
  s.wire([130, yr], [130, yr + 26]); open(130, yr + 30);
  open(130, yr + 52);
  s.add(`<line class="sch-w" x1="130" y1="${yr + 30}" x2="146" y2="${yr + 42}"/>`);
  s.wire([130, yr + 56], [130, yr + 62]).ground(130, yr + 62);
  val(200, yr - 10, '10 Ω', 'middle');
  val(146, yr + 62, 'pushbutton', 'start');

  // ---- TEST to ground
  s.wire([lx, 620], [330, 620]).ground(330, 620);
  val(372, 650, 'TEST: ground in normal operation', 'end');

  // ---- crystal on XIN and XOUT, 22 pF each
  s.wire([rx, 160], [720, 160]).dot(720, 160);
  s.wire([rx, 225], [720, 225]).dot(720, 225);
  s.wire([720, 160], [720, 180]).wire([708, 180], [732, 180]);
  s.add('<rect class="sch-ic" x="713" y="186" width="14" height="14" rx="1"/>');
  s.wire([708, 206], [732, 206]).wire([720, 206], [720, 225]);
  val(742, 197, '32.768 kHz');
  s.capacitor(720, 160, 764, 160).ground(764, 160);
  val(742, 142, '22 pF', 'middle');
  s.capacitor(720, 225, 764, 225).ground(764, 225);
  val(742, 258, '22 pF', 'middle');

  // ---- VBIAS, VREF, V2P5 bypass
  const byp = (y, text) => {
    s.wire([rx, y], [680, y]);
    s.capacitor(680, y, 680, y + 36).ground(680, y + 36);
    val(694, y + 22, text);
  };
  byp(290, '1000 pF or more');
  byp(360, '0.1 µF');
  byp(430, '0.1 µF');

  // ---- LCD boost (Figure 32): V3P3 > diode > node, VDRV > 33 nF > node, node > diode > VLCD with a reservoir capacitor
  net(780, 462, 'V3P3');
  s.diode(780, 468, 780, 520);
  s.wire([rx, 520], [700, 520]);
  s.capacitor(700, 520, 750, 520);
  s.wire([750, 520], [780, 520]).dot(780, 520);
  val(725, 504, '33 nF', 'middle');
  s.diode(780, 520, 780, 580);
  s.wire([rx, 580], [780, 580]).dot(780, 580);
  s.dot(700, 580);
  s.capacitor(700, 580, 700, 616).ground(700, 616);
  val(714, 602, '0.22 µF or more');
  val(796, 584, 'VLCD (5 V) to the LCD');

  // ---- grounds
  const yb = 704;
  s.wire([440, 682], [440, yb]).wire([500, 682], [500, yb]).wire([440, yb], [500, yb]);
  s.dot(470, yb).ground(470, yb);

  val(30, 746, 'Not drawn: LCD SEG and COM pins, DIO, UART, optical and emulator pins, CKTEST, TMUXOUT.', 'start');
  val(30, 760, 'Parts from the recommended-components table and Figures 27, 32, 36 and 37; no values are given for R1, R2, Rin, Rout or the diodes.', 'start');

  return s;
}
