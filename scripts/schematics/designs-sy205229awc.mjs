// Redrawn figures for the Silergy SY205229AWC low-capacitance TVS (SOT-143), from DS_SY205229AWC Rev 1.0.
//
// Drawing 1, pinConnections: Figure 2 "SY205229AWC Pin Connections in PCB" (PDF page 5).
// Netlist, read from a 600 dpi render of the page (the package is turned so pins 1 and 2 are on the left, 4 and 3 on the right):
//   PIN 1 GND:  left rail (zener anode, bottom ends of the diode columns); lead left, then down to a ground symbol
//   PIN 4 VCC:  right rail (zener cathode, top ends of the diodes); lead right, then up to a supply bar labelled VCC
//   PIN 2 I/O1: node between the lower pair of diodes; lead left, then down to the UPPER line (I/O1), with a dot
//   PIN 3 I/O2: node between the upper pair of diodes; lead right, then down to the LOWER line (I/O2), with a dot;
//               it crosses the I/O1 line with no dot
//   Both lines run the whole width: "To Connector" is printed at the left end and "To Inner IC" at the right end of the pair.
//   Inside the body: zener from the GND rail (anode) to the VCC rail (cathode); each I/O node has one diode up to the
//   VCC rail and one from the GND rail (all arrows point from GND toward VCC). Pin 3's lead crosses the VCC rail and
//   pin 2's lead crosses the GND rail inside the body with no dots.
//
// Drawing 2, usbEsdApplication: the uncaptioned USB application circuit (PDF page 6), drawn as printed, including the
// body, which is turned the other way up from Figure 2 (pins 4 and 3 on top, 1 and 2 below).
// Netlist (4 x crops of the page):
//   PIN 4 VCC:  lead up to the VBUS row (dot)
//   PIN 3 I/O2: lead right, then down to the D- row (dot at D-); crosses nothing
//   PIN 2 I/O1: lead straight down to the D+ row (dot at D+); crosses the D- row with no dot
//   PIN 1 GND:  lead straight down to the GND row (dot); crosses the D- and D+ rows with no dot
//   On each data row, left to right: controller, shunt capacitor C_T to GND, series resistor R_T, the pin tap, the port.
//   The D- capacitor's lead crosses the D+ row with no dot. A ground symbol hangs from the GND row.
//   The figure prints one C_T and one R_T label; both rows carry the same symbols.
//   The VBUS row runs to the port in one piece: right, down, right.
import { Sheet, refMarkup } from './lib.mjs';

/** A box with a pin number in it. */
function pinBox(s, x, y, w, h, num) {
  s.add(`<rect class="sch-ic" x="${x}" y="${y}" width="${w}" height="${h}" rx="2"/>`);
  s.text(x + w / 2, y + h / 2 + 4, num, { cls: 'sch-pin', anchor: 'middle' });
}

/** A vertical capacitor on a lead from (x, y1) to (x, y2), with the plates at py and py + 8 (the kit centres them on the span). */
function capAt(s, x, y1, y2, py) {
  s.wire([x, y1], [x, py]).wire([x - 11, py], [x + 11, py]).wire([x - 11, py + 8], [x + 11, py + 8]).wire([x, py + 8], [x, y2]);
}

export function usbEsdApplication({ id, part = 'SY205229AWC' }) {
  const s = new Sheet(960, 650, {
    id,
    top: 20,
    minWidth: 800,
    title: `${part} USB ESD protection application`,
    desc:
      `USB application circuit of the ${part} low-capacitance TVS, redrawn from the uncaptioned figure on page 6 of the datasheet. ` +
      `A USB controller and a USB port are joined by VBUS, D-, D+ and GND rows. The TVS sits above the D- row: pin 4 (VCC) to the VBUS row, ` +
      `pin 3 (I/O2) to the D- row, pin 2 (I/O1) to the D+ row, pin 1 (GND) to the GND row, with the pin 1 and pin 2 leads crossing the rows above them with no dot. ` +
      `Each data row has a shunt capacitor to GND next to the controller and a series resistor R_T after it. The body's internal network is drawn as printed.`,
  });
  const X = (v) => v + 70; // datasheet-figure coordinates plus a left margin
  const vbus = 63, dm = 422, dp = 500, gnd = 578;

  // controller (left) and port (right)
  s.add(`<rect class="sch-ic" x="${X(-60)}" y="20" width="100" height="609" rx="3"/>`);
  s.text(X(-10), 262, 'USB', { cls: 'sch-ictitle', anchor: 'middle' });
  s.text(X(-10), 280, 'Controller', { cls: 'sch-ictitle', anchor: 'middle' });
  s.add(`<rect class="sch-ic" x="${X(767)}" y="293" width="104" height="336" rx="3"/>`);
  s.text(X(819), 455, 'USB', { cls: 'sch-ictitle', anchor: 'middle' });
  s.text(X(819), 473, 'Port', { cls: 'sch-ictitle', anchor: 'middle' });

  // the TVS: body, pin boxes, internal network
  s.add(`<rect class="sch-ic" x="${X(291)}" y="186" width="289" height="130" rx="2"/>`);
  pinBox(s, X(318), 130, 44, 56, '4');
  pinBox(s, X(509), 130, 44, 56, '3');
  pinBox(s, X(320), 316, 83, 55, '1');
  pinBox(s, X(510), 316, 44, 55, '2');
  s.text(X(424), 252, part, { cls: 'sch-ictitle', anchor: 'middle' });
  s.text(X(424), 268, 'SOT-143', { cls: 'sch-val', anchor: 'middle' });
  const colA = X(508), colB = X(555), zx = X(340), top = 207, bot = 304, node = 256;
  s.wire([zx, 186], [zx, top]).wire([zx, top], [colB, top]);
  s.wire([zx, bot], [zx, 316]).wire([zx, bot], [colB, bot]);
  s.diode(zx, bot, zx, top, { kind: 'zener' }); // anode to the GND rail, cathode to the VCC rail
  for (const cx of [colA, colB]) {
    s.diode(cx, node, cx, top); // I/O node up to the VCC rail
    s.diode(cx, bot, cx, node); // GND rail up to the I/O node
    s.dot(cx, node);
  }
  s.dot(zx, top).dot(zx, bot).dot(colA, top).dot(colA, bot);
  s.wire([X(525), 186], [X(525), node], [colA, node]); // pin 3 to its node; crosses the top rail with no dot
  s.wire([X(541), 316], [X(541), node], [colB, node]); // pin 2 to its node; crosses the bottom rail with no dot

  // VBUS row: controller, a T up to pin 4, then right, down and right to the port
  s.wire([X(40), vbus], [X(664), vbus], [X(664), 346], [X(767), 346]);
  s.wire([zx, 130], [zx, vbus]);
  s.dot(zx, vbus);
  s.text(X(68), vbus - 15, 'VBUS', { cls: 'sch-net' });
  s.text(X(690), 334, 'VBUS', { cls: 'sch-net' });

  // D- row: capacitor to GND, then R_T, then the pin 3 tap
  s.wire([X(40), dm], [X(195), dm]).resistor(X(195), dm, X(255), dm);
  s.wire([X(255), dm], [X(767), dm]);
  s.dot(X(84), dm).dot(X(626), dm);
  capAt(s, X(84), dm, gnd, 450);
  s.wire([X(553), 150], [X(626), 150], [X(626), dm]);
  s.text(X(700), dm - 12, 'D-', { cls: 'sch-net' });

  // D+ row: capacitor to GND, then R_T, then the pin 2 tap
  s.wire([X(40), dp], [X(195), dp]).resistor(X(195), dp, X(255), dp);
  s.wire([X(255), dp], [X(767), dp]);
  s.dot(X(138), dp).dot(X(531), dp);
  capAt(s, X(138), dp, gnd, 535);
  s.wire([X(531), 371], [X(531), dp]);
  s.text(X(700), dp - 12, 'D+', { cls: 'sch-net' });

  // GND row, with the pin 1 tap and a ground symbol
  s.wire([X(40), gnd], [X(767), gnd]);
  s.wire([X(361), 371], [X(361), gnd]);
  s.dot(X(84), gnd).dot(X(138), gnd).dot(X(222), gnd).dot(X(361), gnd);
  s.ground(X(222), gnd);
  s.text(X(700), gnd - 12, 'GND', { cls: 'sch-net' });

  // one C_T and one R_T label, as printed
  s.text(X(100), 460, refMarkup('CT'), { cls: 'sch-ref', raw: true });
  s.text(X(225), 458, refMarkup('RT'), { cls: 'sch-ref', anchor: 'middle', raw: true });
  return s.toString();
}

export function pinConnections({ id, part = 'SY205229AWC' }) {
  const s = new Sheet(840, 540, {
    id,
    top: 20,
    minWidth: 700,
    title: `${part} pin connections in PCB`,
    desc:
      `Pin connections of the ${part} in PCB, redrawn from Figure 2 on page 5 of the datasheet. The package is turned so pins 1 and 2 are on the left and pins 4 and 3 on the right. ` +
      `Two data lines run the full width, I/O1 above I/O2, with "To Connector" at the left end and "To Inner IC" at the right end. Pin 2 taps the I/O1 line and pin 3 crosses it to tap the I/O2 line. ` +
      `Pin 1 goes to a ground symbol and pin 4 to a VCC supply bar. Inside the body a zener diode joins the GND and VCC rails and each I/O node has a diode up to VCC and a diode down to GND.`,
  });
  const X = (v) => v / 2 + 10, Y = (v) => v / 2 + 30; // crop pixels of the 600 dpi render, halved
  const g = X(757), v = X(1012), mid = X(884); // GND rail, VCC rail, I/O nodes
  const r1 = Y(565), r2 = Y(688), zr = Y(125);

  s.add(`<rect class="sch-ic" x="${X(724)}" y="${Y(-7)}" width="${X(1067) - X(724)}" height="${Y(754) - Y(-7)}" rx="2"/>`);
  pinBox(s, X(582), Y(70), X(724) - X(582), Y(288) - Y(70), '1');
  pinBox(s, X(582), Y(570), X(724) - X(582), Y(683) - Y(570), '2');
  pinBox(s, X(1067), Y(67), X(1214) - X(1067), Y(182) - Y(67), '4');
  pinBox(s, X(1067), Y(568), X(1214) - X(1067), Y(682) - Y(568), '3');
  s.text(X(895), Y(300), part, { cls: 'sch-ictitle', anchor: 'middle' });
  s.text(X(895), Y(300) + 16, 'SOT-143', { cls: 'sch-val', anchor: 'middle' });

  // rails and zener
  s.wire([X(724), zr], [g, zr]);
  s.diode(g, zr, v, zr, { kind: 'zener' }); // anode on the GND side, cathode on the VCC side
  s.wire([v, zr], [X(1067), zr]);
  s.dot(g, zr).dot(v, zr);
  s.wire([g, zr], [g, r2]); // GND rail down both rows
  s.wire([v, zr], [v, r2]); // VCC rail down both rows
  // two diode rows: GND rail -> diode -> I/O node -> diode -> VCC rail
  s.diode(g, r1, mid, r1).diode(mid, r1, v, r1);
  s.diode(g, r2, mid, r2).diode(mid, r2, v, r2);
  s.dot(g, r1).dot(v, r1).dot(mid, r1).dot(mid, r2);
  // pin 3 to the upper node (crosses the VCC rail with no dot); pin 2 to the lower node (crosses the GND rail with no dot)
  s.wire([mid, r1], [mid, Y(607)], [X(1067), Y(607)]);
  s.wire([X(724), Y(648)], [mid, Y(648)], [mid, r2]);

  // pin 1 to ground, pin 4 to the supply bar
  s.wire([X(582), Y(188)], [X(400), Y(188)], [X(400), Y(280)]);
  s.ground(X(400), Y(280));
  s.text(X(300), Y(205), 'GND', { cls: 'sch-net', anchor: 'middle' });
  s.wire([X(1214), Y(122)], [X(1364), Y(122)], [X(1364), Y(65)]);
  s.wire([X(1308), Y(65)], [X(1420), Y(65)]);
  s.text(X(1455), Y(85), 'VCC', { cls: 'sch-net' });

  // the two data lines, with the pin 2 and pin 3 taps
  const io1 = Y(793), io2 = Y(905);
  s.wire([X(20), io1], [X(1590), io1]);
  s.wire([X(20), io2], [X(1590), io2]);
  s.wire([X(582), Y(635)], [X(468), Y(635)], [X(468), io1]);
  s.dot(X(468), io1);
  s.wire([X(1214), Y(635)], [X(1308), Y(635)], [X(1308), io2]);
  s.dot(X(1308), io2);
  s.text(X(383), Y(750), 'I/O1', { cls: 'sch-net', anchor: 'middle' });
  s.text(X(383), Y(975), 'I/O2', { cls: 'sch-net', anchor: 'middle' });
  s.text(X(72), Y(862), 'To Connector', { cls: 'sch-val' });
  s.text(X(1605), Y(862), 'To Inner IC', { cls: 'sch-val', anchor: 'end' });
  return s.toString();
}
