// Schematic of the Silergy SY70201 SSD PMIC, redrawn from the "Application Schematic" (page 21) in its datasheet.
// Designators and values follow the figure and its BOM list.
//
// Netlist read from the rendered page (pin -> parts -> net); the drawing below must agree with it:
//   VIN rail ........ PVIN1, PVIN2, PVIN3, PVIN5 (each with 10 µF to its own PGND pin: C1, C2, C3, C5),
//                     the left end of L6 and the top of C4, and, through RIN (0 Ω), AVIN
//   Boost (CH6) ..... VIN -> L6 (1 µH) -> SW6.  C4 (2.2 µF) from the VIN/L6 node to PGND6.
//                     POUT6 and VOUT6 tied together = the 8 to 15 V output; C6 (5 × 4.7 µF/16 V) from it to PGND6.
//   Bucks 1, 2, 3, 5  SWn -> Ln -> output node; VOUTn from the output node; output capacitors to ground
//                     (C7, C8 | C9, C10 | C11, C12 | C13, C14, C18). L1 0.47 µH, L2, L3, L5 0.22 µH.
//   PVIN4, PGND4, SW4, VOUT4 are drawn in the figure with nothing on them (and are not in the 36-pin table).
//   LSW ............. output terminal "LSW: VIN, 300mA", C17 (1 µF) to ground
//   AVIN ............ RIN (0 Ω) to VIN; C15 (2.2 µF) to AGND
//   LDO ............. C16 (1 µF) to ground only; the "1.8/3.3Vcc" node is separate and feeds R1/R2
//   SCL, SDA ........ R1, R2 = NC, each from the pin to the 1.8/3.3Vcc node
//   OTP_R ........... input arrow, nothing else
//   EN, PG, RSTO .... output arrows with R5, R4, R3 (100 kΩ) to VIN
//   VSLT, Gate, BK2SEL  input arrows with R6, R7, R8 (100 kΩ) to ground
// Not in the figure and so not drawn: pins 12, 13 (NC), 14 (PGND), the exposed pad, and what the host connects to SCL and SDA.
import { Sheet, refMarkup } from './lib.mjs';

export function ssdPmic70201({ id = 'sy70201', part = 'SY70201' } = {}) {
  const s = new Sheet(990, 990, {
    top: 14,
    id,
    title: `${part} application schematic`,
    desc:
      `Application schematic of the ${part} PMIC (four synchronous bucks, one boost, one load switch), redrawn from the datasheet's page-21 figure. ` +
      `The 3.3 V or 5 V input VIN feeds PVIN1, PVIN2, PVIN3 and PVIN5, each with a 10 µF capacitor (C1, C2, C3, C5) to its own PGND pin. ` +
      `Each buck switch pin SW1, SW2, SW3 and SW5 goes through an inductor (L1 0.47 µH; L2, L3 and L5 0.22 µH) to its output node, which returns to the matching VOUT pin; ` +
      `the outputs have 2 × 47 µF (Buck1 to Buck3: C7 to C12) and 3 × 22 µF (Buck5: C13, C14, C18). ` +
      `The boost runs from VIN through L6 (1 µH) to SW6, with C4 (2.2 µF) from the VIN side of L6 to PGND6; POUT6 and VOUT6 join at the 12 V output with C6 (5 × 4.7 µF) to PGND6. ` +
      `The LSW pin is an output with C17 (1 µF) to ground. AVIN takes VIN through RIN (0 Ω) with C15 (2.2 µF) to AGND, and the LDO pin has C16 (1 µF) to ground. ` +
      `R1 and R2 on SCL and SDA are not fitted (NC) and go to a separate 1.8 or 3.3 V Vcc node. R3, R4 and R5 pull RSTO, PG and EN up to VIN; R6, R7 and R8 pull VSLT, Gate and BK2SEL down to ground. OTP_R has no parts on it.`,
  });

  const ic = { x: 280, y: 30, w: 190, h: 880 };
  const lx = ic.x - 12, rx = ic.x + ic.w + 12;

  // pin rows
  const L = [
    ['PVIN1', 70], ['PGND1', 100], ['PVIN2', 140], ['PGND2', 170], ['PVIN3', 210], ['PGND3', 240], ['PVIN4', 280], ['PGND4', 310],
    ['PVIN5', 350], ['PGND5', 380], ['SW6', 440], ['PGND6', 480], ['POUT6', 530], ['VOUT6', 560],
    ['VSLT', 640], ['Gate', 720], ['RSTO', 800], ['BK2SEL', 880],
  ];
  const R = [
    ['SW1', 70], ['VOUT1', 100], ['SW2', 140], ['VOUT2', 170], ['SW3', 210], ['VOUT3', 240], ['SW4', 280], ['VOUT4', 310],
    ['SW5', 350], ['VOUT5', 380], ['LSW', 440], ['AVIN', 500], ['AGND', 540], ['LDO', 580],
    ['SCL', 640], ['SDA', 680], ['OTP_R', 720], ['EN', 770], ['PG', 840],
  ];
  s.ic(ic.x, ic.y, ic.w, ic.h, { left: L.map(([name, y]) => ({ name, y })), right: R.map(([name, y]) => ({ name, y })) }, { title: part, subtitle: 'U1' });

  const term = (x, y) => s.add(`<circle class="sch-w" cx="${x}" cy="${y}" r="3.5"/>`);
  // a flag wide enough for six characters; dir 'in' puts the tag left of (x, y), 'out' right of it
  const flag = (x, y, name, dir) => {
    const w = 62, sgn = dir === 'in' ? -1 : 1, x0 = x + sgn * w;
    s.add(`<path class="sch-flag" d="M${x} ${y} L${x + sgn * 8} ${y - 8} L${x0} ${y - 8} L${x0} ${y + 8} L${x + sgn * 8} ${y + 8} Z"/>`);
    s.text(x + sgn * (w + 8) / 2 + (sgn > 0 ? 0 : 0), y + 4, name, { cls: 'sch-net', anchor: 'middle' });
  };
  const vinBar = (x, y) => {
    s.wire([x - 7, y], [x + 7, y]);
    s.text(x + 11, y + 4, 'VIN', { cls: 'sch-net' });
  };

  // ---- left: VIN rail and the input capacitors
  const xr = 80, xc = 210;
  s.wire([xr, 40], [xr, 440]).port(xr, 40, 'VIN', 'in');
  for (const [ref, yv] of [['C1', 70], ['C2', 140], ['C3', 210], ['C5', 350]]) {
    s.dot(xr, yv).wire([xr, yv], [lx, yv]).dot(xc, yv);
    s.capacitor(xc, yv, xc, yv + 30).dot(xc, yv + 30).wire([xc, yv + 30], [lx, yv + 30]).ground(xc, yv + 30).label(xc, yv + 17, ref, '10 µF', 'left');
  }

  // ---- left: boost input. VIN -> L6 -> SW6; C4 from the VIN/L6 node to PGND6; C6 from PGND6 to the POUT6/VOUT6 node
  const xa = 140;
  s.dot(xr, 440).wire([xr, 440], [xa, 440]).dot(xa, 440);
  s.inductor(xa, 440, lx, 440);
  s.text(xa + 56, 430, refMarkup('L6'), { cls: 'sch-ref', anchor: 'end', raw: true });
  s.text(xa + 60, 430, '1 µH', { cls: 'sch-val' });
  s.capacitor(xa, 440, xa, 480).dot(xa, 480).wire([xa, 480], [lx, 480]);
  s.label(xa, 463, 'C4', '2.2 µF', 'left');
  s.dot(190, 480).ground(190, 480);
  s.capacitor(xa, 480, xa, 530).dot(xa, 530).wire([xa, 530], [lx, 530]).label(xa, 508, 'C6', '5 × 4.7 µF', 'left');
  s.wire([lx, 560], [xa, 560], [xa, 530]);
  s.wire([xa, 530], [44, 530]);
  term(40.5, 530);
  s.text(20, 548, 'Boost CH6', { cls: 'sch-ref' });
  s.text(20, 561, '8 V to 15 V', { cls: 'sch-val' });
  s.text(20, 574, '12 V / 0.4 A', { cls: 'sch-val' });

  // ---- left: strap and control pins
  const lines = [['VSLT', 640, 'R6'], ['Gate', 720, 'R7'], ['BK2SEL', 880, 'R8']];
  for (const [name, y, ref] of lines) {
    s.wire([lx, y], [120, y]);
    flag(120, y, name, 'in');
    s.dot(240, y).resistor(240, y, 240, y + 40).ground(240, y + 40).label(240, y + 22, ref, '100 kΩ', 'left');
  }
  // RSTO is an output with R3 to VIN
  s.wire([lx, 800], [120, 800]);
  flag(120, 800, 'RSTO', 'in');
  s.dot(150, 800).resistor(150, 800, 150, 760);
  vinBar(150, 760);
  s.label(150, 782, 'R3', '100 kΩ', 'right');

  // ---- right: bucks
  const xo = rx + 90;
  const bucks = [
    ['L1', '0.47 µH', 70, [['C7', '47 µF'], ['C8', '47 µF']], 'Buck1 CH1', '0.725 V to 1.825 V', '1.2 V / 3.5 A'],
    ['L2', '0.22 µH', 140, [['C9', '47 µF'], ['C10', '47 µF']], 'Buck2 CH2', '0.5 V to 1.2 V', '1.2 V / 3.8 A'],
    ['L3', '0.22 µH', 210, [['C11', '47 µF'], ['C12', '47 µF']], 'Buck3 CH3', '0.7 V to 1.9 V', '1.8 V / 3.0 A'],
    ['L5', '0.22 µH', 350, [['C13', '22 µF'], ['C14', '22 µF'], ['C18', '22 µF']], 'Buck5 CH5', '1.5 V to 2.75 V', '2.5 V / 4.0 A'],
  ];
  const xt = rx + 320;
  for (const [ind, lval, y, caps, name, range, nom] of bucks) {
    s.wire([rx, y], [rx + 12, y]).inductor(rx + 12, y, rx + 72, y).wire([rx + 72, y], [xt, y]);
    s.dot(xo, y);
    s.wire([rx, y + 30], [xo, y + 30], [xo, y]);
    s.text(rx + 42, y - 10, refMarkup(ind), { cls: 'sch-ref', anchor: 'end', raw: true });
    s.text(rx + 46, y - 10, lval, { cls: 'sch-val' });
    caps.forEach(([ref, val], i) => {
      const x = rx + 130 + i * 62;
      s.dot(x, y).capacitor(x, y, x, y + 22).ground(x, y + 22).label(x, y + 14, ref, val, 'right');
    });
    term(xt, y);
    s.text(xt + 10, y - 3, name, { cls: 'sch-ref' });
    s.text(xt + 10, y + 10, range, { cls: 'sch-val' });
    s.text(xt + 10, y + 23, nom, { cls: 'sch-val' });
  }
  s.text(rx + 6, 296, 'SW4, VOUT4, PVIN4, PGND4: nothing connected', { cls: 'sch-val' });

  // ---- right: LSW, AVIN, AGND, LDO
  const xn = rx + 40;
  s.wire([rx, 440], [xt, 440]).dot(xn, 440).capacitor(xn, 440, xn, 462).ground(xn, 462).label(xn, 454, 'C17', '1 µF', 'right');
  term(xt, 440);
  s.text(xt + 10, 444, 'LSW: VIN, 300 mA', { cls: 'sch-ref' });
  s.wire([rx, 500], [rx + 130, 500]).dot(xn, 500).resistor(rx + 80, 500, rx + 130, 500).wire([rx + 130, 500], [rx + 150, 500]).port(rx + 150, 500, 'VIN', 'out');
  s.label(rx + 105, 500, 'RIN', '0 Ω', 'above');
  s.capacitor(xn, 500, xn, 540).label(xn, 523, 'C15', '2.2 µF', 'right');
  s.wire([rx, 540], [rx + 150, 540]).dot(xn, 540).ground(rx + 150, 540);
  s.capacitor(xn, 540, xn, 580).dot(xn, 580).wire([rx, 580], [xn, 580]).label(xn, 563, 'C16', '1 µF', 'right');

  // ---- right: SCL, SDA with R1, R2 (not fitted) to a separate Vcc node
  const xs = rx + 70, xd = rx + 150;
  s.wire([xs, 600], [xd, 600]);
  s.text(xd + 10, 604, '1.8 / 3.3 V Vcc', { cls: 'sch-net' });
  s.dot(xs, 600).dot(xd, 600);
  s.resistor(xs, 600, xs, 640).label(xs, 622, 'R1', 'NC', 'left');
  s.resistor(xd, 600, xd, 680).label(xd, 640, 'R2', 'NC', 'right');
  s.wire([rx, 640], [xs, 640]).dot(xs, 640);
  s.wire([rx, 680], [xd, 680]).dot(xd, 680);

  // ---- right: OTP_R, EN, PG
  s.wire([rx, 720], [rx + 50, 720]);
  flag(rx + 50, 720, 'OTP_R', 'out');
  s.wire([rx, 770], [rx + 200, 770]).port(rx + 200, 770, 'EN', 'out');
  s.dot(rx + 140, 770).resistor(rx + 140, 770, rx + 140, 730);
  vinBar(rx + 140, 730);
  s.label(rx + 140, 752, 'R5', '100 kΩ', 'right');
  s.wire([rx, 840], [rx + 290, 840]).port(rx + 290, 840, 'PG', 'out');
  s.dot(rx + 230, 840).resistor(rx + 230, 840, rx + 230, 800);
  vinBar(rx + 230, 800);
  s.label(rx + 230, 822, 'R4', '100 kΩ', 'right');

  // ---- notes
  s.text(20, 976, 'SW6 is two pins (3, 4) and drawn once, as in the datasheet. Pins 12, 13 (NC), 14 (PGND) and the exposed pad are not in the figure.', { cls: 'sch-val' });
  return s;
}
