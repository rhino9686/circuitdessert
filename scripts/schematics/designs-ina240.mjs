// Schematics of the TI INA240-Q1 current-sense amplifier, redrawn from the two application circuits in its datasheet
// (SBOS808E): Figure 9-3, the inline motor current-sense circuit, and Figure 9-5, the solenoid drive circuit.
// The datasheet gives values for the shunt resistors and the supplies only, no designators and no part numbers, so none are drawn.
// The IC is drawn with the pins the figures show (IN+, IN-, VS, GND, OUT, REF1, REF2). Neither figure shows the 0.1 µF
// supply bypass capacitor that Section 10.1 recommends, so it is left out and a note in the drawing says so.
import { Sheet } from './lib.mjs';

const f = (v) => Math.round(v * 100) / 100;

/**
 * A bipolar-style switch as the datasheet's Figure 9-3 draws the bridge transistors: collector at (x, ytop), emitter at
 * (x, ybot), base lead leaving to the left and left open (the figure draws no drive). The arrow is on the emitter.
 */
function switchSymbol(s, x, ytop, ybot) {
  const yc = (ytop + ybot) / 2;
  const bx = x - 10;
  s.wire([x, ytop], [x, yc - 18], [bx, yc - 7]);
  s.wire([bx, yc + 7], [x, yc + 18], [x, ybot]);
  s.wire([bx, yc - 13], [bx, yc + 13]);
  s.wire([bx, yc], [x - 28, yc]);
  // arrow head at the emitter end, pointing along the lower diagonal
  const dx = x - bx, dy = 11;
  const len = Math.hypot(dx, dy);
  const ux = dx / len, uy = dy / len;
  const tip = [x - 1, yc + 17];
  const back = [tip[0] - 8 * ux, tip[1] - 8 * uy];
  const px = -uy * 3.2, py = ux * 3.2;
  s.add(`<path class="sch-w" d="M${f(tip[0])} ${f(tip[1])} L${f(back[0] + px)} ${f(back[1] + py)} L${f(back[0] - px)} ${f(back[1] - py)} Z"/>`);
}

/** The amplifier block with the pins and the reference connection of the figures: REF1 to GND, REF2 to VS, so the output rests at VS / 2. */
function amplifier(s, { x, y, w, h, rows, flagX, subtitle }) {
  const vsx = x + w / 2;
  s.ic(x, y, w, h, {
    left: [{ name: 'IN+', y: rows.inp }, { name: 'IN–', y: rows.inn }],
    right: [{ name: 'OUT', y: rows.out }, { name: 'REF2', y: rows.ref2 }, { name: 'REF1', y: rows.ref1 }],
    top: [{ name: 'VS', x: vsx }],
    bottom: [{ name: 'GND', x: vsx }],
  }, { title: 'INA240-Q1', subtitle });
  const rx = x + w + 12;
  const top = y - 12 - 18; // supply rail, 18 above the VS pin end
  const gy = y + h + 12 + 14; // ground node, 14 below the GND pin end
  // VS: flag, rail, REF2 loop
  s.port(vsx - 46, top, '5 V', 'in').wire([vsx - 46, top], [vsx, top]).dot(vsx, top).wire([vsx, top], [vsx, y - 12]);
  s.wire([vsx, top], [flagX.ref2, top], [flagX.ref2, rows.ref2], [rx, rows.ref2]);
  // OUT
  s.port(rx, rows.out, 'OUT', 'out');
  // GND and REF1 tied, grounded
  s.wire([rx, rows.ref1], [flagX.ref1, rows.ref1], [flagX.ref1, gy], [vsx, gy]).wire([vsx, y + h + 12], [vsx, gy]).dot(vsx, gy).ground(vsx, gy);
  return { vsx, gy, top, rx };
}

/** Figure 9-3: inline motor current sense. One shunt in one phase of a three-phase bridge. */
export function inlineMotorSense({ id }) {
  const s = new Sheet(860, 470, {
    id,
    top: 10,
    title: 'INA240-Q1 inline motor current-sense circuit',
    desc:
      'Inline motor current-sense circuit redrawn from the INA240-Q1 datasheet, Figure 9-3. A 40 V supply feeds a three-phase bridge of six switches, one pair per phase, with the switches drawn as transistor symbols and no drive shown. ' +
      'The first phase reaches the motor through a 100 milliohm shunt resistor, and the other two phases go straight to the motor. ' +
      'The shunt end nearest the bridge goes to the IN+ pin of the INA240-Q1 and the end nearest the motor to the IN- pin. ' +
      'The VS pin takes 5 V. REF2 is tied to VS and REF1 to ground, so the output rests at half the supply and can follow current in both directions. The OUT pin is the output. GND is grounded.',
  });
  const legs = [160, 260, 360];
  const yN = [230, 260, 290]; // phase nodes, staggered so each phase wire leaves on its own row
  const yRail = 60, yGnd = 420;
  // supply rail and ground rail
  s.port(60, yRail, '40 V', 'in').wire([60, yRail], [legs[2], yRail]).dot(legs[0], yRail).dot(legs[1], yRail);
  s.wire([legs[0], yGnd], [legs[2], yGnd]).dot(legs[1], yGnd).ground(legs[1], yGnd);
  legs.forEach((x, i) => {
    s.wire([x, yRail], [x, 90]);
    switchSymbol(s, x, 90, 150);
    s.wire([x, 150], [x, 320]);
    switchSymbol(s, x, 320, 380);
    s.wire([x, 380], [x, yGnd]);
    s.dot(x, yN[i]);
  });
  // phase wires to the motor; A carries the shunt
  const mx = 690;
  s.hwire(yN[0], legs[0], 450, [legs[1], legs[2]]);
  s.dot(450, yN[0]).resistor(450, yN[0], 540, yN[0]).dot(540, yN[0]);
  s.text(495, yN[0] - 18, '100 mΩ', { cls: 'sch-val', anchor: 'middle' });
  s.wire([540, yN[0]], [mx, yN[0]]);
  s.hwire(yN[1], legs[1], mx, [legs[2]]);
  s.wire([legs[2], yN[2]], [mx, yN[2]]);
  // motor
  s.add(`<rect class="sch-ic" x="${mx}" y="200" width="80" height="120" rx="3"/>`);
  s.text(mx + 40, yN[1] + 6, 'Motor', { cls: 'sch-ictitle', anchor: 'middle' });
  // amplifier
  const ic = { x: 580, y: 60, w: 170, h: 100 };
  const rows = { inp: 90, inn: 130, out: 90, ref2: 120, ref1: 145 };
  const a = amplifier(s, { ...ic, rows, flagX: { ref2: 830, ref1: 790 }, subtitle: 'A1, 20 V/V' });
  // sense lines: IN+ from the bridge side of the shunt, IN- from the motor side
  s.wire([ic.x - 12, rows.inp], [450, rows.inp], [450, yN[0]]);
  s.wire([ic.x - 12, rows.inn], [540, rows.inn], [540, yN[0]]);
  // notes
  s.text(450, 360, 'Not drawn in the datasheet figure: the drive for the six', { cls: 'sch-net', anchor: 'start' });
  s.text(450, 376, 'switches, and the 0.1 µF supply bypass the text recommends.', { cls: 'sch-net', anchor: 'start' });
  s.text(450, 400, 'The gain version (A1) is from the text, not the figure.', { cls: 'sch-net', anchor: 'start' });
  return s;
}

/** Figure 9-5: solenoid drive current sense. High-side switch, shunt, solenoid, and a freewheeling diode that returns to the switch side of the shunt. */
export function solenoidSense({ id }) {
  const s = new Sheet(790, 440, {
    id,
    top: 20,
    title: 'INA240-Q1 solenoid drive current-sense circuit',
    desc:
      'Solenoid drive current-sense circuit redrawn from the INA240-Q1 datasheet, Figure 9-5. A 12 V supply, as the figure prints it, feeds the drain of a high-side N-channel MOSFET whose gate is the Control input. ' +
      'The source goes through a 10 milliohm shunt resistor to the solenoid, whose other end is grounded. A freewheeling diode runs from ground to the MOSFET source, which is the top end of the shunt, so the solenoid current keeps flowing down through the shunt after the switch opens. ' +
      'The top end of the shunt goes to the IN+ pin and the bottom end to the IN- pin of the INA240-Q1. The VS pin takes 5 V. REF2 is tied to VS and REF1 to ground, so the output rests at half the supply. The OUT pin is the output. GND is grounded.',
  });
  const x0 = 300;
  s.port(130, 40, '12 V', 'in').wire([130, 40], [x0, 40], [x0, 70]);
  s.text(84, 62, 'as printed in the figure;', { cls: 'sch-net', anchor: 'start' });
  s.text(84, 75, 'the text and curve use 24 V', { cls: 'sch-net', anchor: 'start' });
  s.nmosV(x0, 70, 150, { flip: true });
  s.wire([x0 - 22, 110], [240, 110]).add('<circle class="sch-w" cx="240" cy="110" r="3"/>');
  s.text(232, 114, 'Control', { cls: 'sch-val', anchor: 'end' });
  s.dot(x0, 150).wire([x0, 150], [200, 150]);
  s.resistor(x0, 150, x0, 260).dot(x0, 260);
  s.text(x0 + 16, 210, '10 mΩ', { cls: 'sch-val' });
  s.inductor(x0, 260, x0, 360);
  s.text(x0 + 24, 316, 'Solenoid', { cls: 'sch-val' });
  s.wire([x0, 360], [x0, 370], [200, 370]).dot(200, 370).ground(200, 370);
  s.diode(200, 370, 200, 150);
  // amplifier
  const ic = { x: 470, y: 100, w: 180, h: 130 };
  const rows = { inp: 130, inn: 190, out: 130, ref2: 170, ref1: 195 };
  amplifier(s, { ...ic, rows, flagX: { ref2: 750, ref1: 725 }, subtitle: 'A4, 200 V/V' });
  s.wire([ic.x - 12, rows.inp], [390, rows.inp], [390, 150], [x0, 150]);
  s.wire([ic.x - 12, rows.inn], [420, rows.inn], [420, 260], [x0, 260]);
  s.text(60, 408, 'Not drawn in the datasheet figure: the 0.1 µF supply bypass the text recommends.', { cls: 'sch-net', anchor: 'start' });
  s.text(60, 424, 'The gain version (A4) is from the text, not the figure.', { cls: 'sch-net', anchor: 'start' });
  return s;
}
