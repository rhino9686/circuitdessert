// Schematics for the "ESP32-S3 starter board" recipe: a hypothetical setup guide, not a datasheet figure.
// Two sheets: the USB-C power input, 3.3 V regulator and USB ESD protection (esp32s3BoardPower), and the module with its
// buttons, strapping pull-ups, programming header, I2C sensor and Qwiic port, SPI header and RGB LED (esp32s3BoardModule).
// The regulator, ESD part and sensor are drawn as generic boxes so they can be swapped; the recipe names the parts.
import { Sheet } from './lib.mjs';

/** +3V3 (or another rail) supply symbol: a short stub up from (x, y) with a bar and the rail name. */
function rail(s, x, y, name = '+3V3') {
  s.wire([x, y], [x, y - 10]).wire([x - 8, y - 10], [x + 8, y - 10]);
  s.text(x, y - 15, name, { cls: 'sch-net', anchor: 'middle' });
}

/** Push button between (x, y1) and (x, y2), vertical, y2 below y1. */
function button(s, x, y1, y2) {
  const m = (y1 + y2) / 2;
  const a = m - 9, b = m + 9;
  s.wire([x, y1], [x, a - 3]).wire([x, b + 3], [x, y2]);
  s.add(`<circle class="sch-w" cx="${x}" cy="${a}" r="3"/>`).add(`<circle class="sch-w" cx="${x}" cy="${b}" r="3"/>`);
  s.wire([x - 10, a - 6], [x - 10, b + 6]); // the moving contact
  s.wire([x - 10, m], [x - 18, m]); // the push rod
}

/** Polyfuse: a small box with a line through it, horizontal between x1 and x2. */
function fuse(s, x1, x2, y) {
  const c = (x1 + x2) / 2;
  s.wire([x1, y], [c - 15, y]).wire([c + 15, y], [x2, y]);
  s.add(`<rect class="sch-w" x="${c - 15}" y="${y - 6}" width="30" height="12" fill="none"/>`);
  s.wire([c - 15, y], [c + 15, y]);
}

export function esp32s3BoardPower({ id }) {
  const s = new Sheet(960, 412, {
    id,
    top: 30,
    title: 'ESP32-S3 starter board: USB-C power input, 3.3 V regulator and USB protection',
    desc:
      'A USB-C receptacle J1. Its VBUS pin runs through a 1 A polyfuse F1, a ferrite bead FB1 and a series diode D1 to the +5V rail. ' +
      'The +5V rail feeds the input of a 3.3 V linear regulator U2 with a 22 µF capacitor C1 to ground; the regulator output is the +3V3 rail with a 22 µF capacitor C2 to ground, ' +
      'and a green power LED D2 with a 1 kΩ resistor R3 from +3V3 to ground. CC1 and CC2 each go to ground through a 5.1 kΩ resistor (R1, R2). ' +
      'The D+ and D− pins go through the two pass-through channels of a USB ESD protection IC U3 to the nets D+ and D−, which continue on the module sheet. ' +
      'U3 has its VBUS pin on +5V with a 100 nF capacitor C3 to ground. The connector ground and shield go to ground.',
  });

  // ---- J1 USB-C receptacle
  const jx = 70, jw = 110;
  s.ic(jx, 60, jw, 290, {
    right: [{ name: 'VBUS', y: 100 }, { name: 'CC1', y: 170 }, { name: 'CC2', y: 210 }, { name: 'D+', y: 270 }, { name: 'D−', y: 310 }],
    bottom: [{ name: 'GND', x: 125 }],
  });
  s.text(jx + 8, 52, 'J1  USB-C', { cls: 'sch-ref' });
  s.text(jx + 8, 140, 'receptacle', { cls: 'sch-val' });
  s.text(125, 402, 'GND and shield', { cls: 'sch-val', anchor: 'middle' });
  s.ground(125, 362);
  const jr = jx + jw + 12;

  // ---- VBUS → F1 → FB1 → D1 → +5V
  fuse(s, jr, 270, 100);
  s.label(240, 100, 'F1', '1 A', 'above');
  s.inductor(270, 100, 340, 100);
  s.text(305, 69, 'FB1', { cls: 'sch-ref', anchor: 'middle' }).text(305, 82, 'bead', { cls: 'sch-val', anchor: 'middle' });
  s.diode(340, 100, 400, 100);
  s.label(370, 100, 'D1', '', 'above');
  s.wire([400, 100], [470, 100]).dot(470, 100);
  s.text(470, 86, '+5V', { cls: 'sch-net', anchor: 'middle' });

  // ---- C1 on +5V, U2 regulator, C2 on +3V3
  s.wire([470, 100], [548, 100]);
  s.dot(510, 100).capacitor(510, 100, 510, 150).ground(510, 150).label(510, 132, 'C1', '22 µF', 'right');
  s.ic(560, 70, 120, 80, { left: [{ name: 'IN', y: 100 }], right: [{ name: 'OUT', y: 100 }], bottom: [{ name: 'GND', x: 620 }] });
  s.text(620, 62, 'U2  3.3 V LDO', { cls: 'sch-ref', anchor: 'middle' });
  s.ground(620, 162);
  s.wire([692, 100], [880, 100]);
  s.dot(730, 100).capacitor(730, 100, 730, 150).ground(730, 150).label(730, 132, 'C2', '22 µF', 'right');
  // power LED
  s.dot(810, 100).resistor(810, 100, 810, 150).label(810, 128, 'R3', '1 kΩ', 'right');
  s.diode(810, 150, 810, 200, { kind: 'led', side: 1 }).ground(810, 200).label(810, 180, 'D2', 'green', 'left');
  s.port(880, 100, '+3V3', 'out');

  // ---- CC pull-downs
  for (const [y, ref] of [[170, 'R1'], [210, 'R2']]) {
    s.resistor(jr, y, 262, y).ground(262, y);
    s.text(222, y - 10, ref, { cls: 'sch-ref', anchor: 'middle' });
  }
  s.text(222, 242, '5.1 kΩ each', { cls: 'sch-val', anchor: 'middle' });

  // ---- U3 USB ESD protection, pass-through
  const ex = 340, ew = 120;
  s.ic(ex, 250, ew, 90, {
    left: [{ name: 'I/O1', y: 270 }, { name: 'I/O2', y: 310 }],
    right: [{ name: 'I/O1', y: 270 }, { name: 'I/O2', y: 310 }],
    top: [{ name: 'VBUS', x: 400 }],
    bottom: [{ name: 'GND', x: 400 }],
  });
  s.text(ex + ew + 4, 352, 'U3  USB ESD', { cls: 'sch-ref' });
  s.wire([jr, 270], [ex - 12, 270]).wire([jr, 310], [ex - 12, 310]);
  s.ground(400, 352);
  s.wire([ex + ew + 12, 270], [540, 270]).wire([ex + ew + 12, 310], [540, 310]);
  s.port(540, 270, 'D+', 'out').port(540, 310, 'D−', 'out');
  // U3 VBUS from +5V, with C3
  s.wire([470, 100], [470, 210], [400, 210], [400, 238]);
  s.dot(470, 210).wire([470, 210], [640, 210]);
  s.capacitor(640, 210, 640, 260).ground(640, 260).label(640, 242, 'C3', '100 nF', 'right');
  return s;
}

export function esp32s3BoardModule({ id, part = 'ESP32-S3-WROOM-1-N8' }) {
  const s = new Sheet(1260, 900, {
    id,
    top: 10,
    minWidth: 1000,
    title: `${part} starter board: module, buttons, headers, I2C sensor, Qwiic port and RGB LED`,
    desc:
      `The ${part} module U1. Its 3V3 pin is on the +3V3 rail with a 10 µF capacitor C4 and a 100 nF capacitor C5 to ground, and its ground pins go to ground. ` +
      'EN has a 10 kΩ pull-up R4 to +3V3, a 1 µF capacitor C6 to ground, a RESET button SW1 to ground and an ESD diode D3 to ground. ' +
      'IO0 has a 10 kΩ pull-up R5, a BOOT button SW2 to ground and an ESD diode D4. IO3 has a 10 kΩ pull-up R6. IO48 has a 10 kΩ pull-up R7, a USER button SW3 to ground and an ESD diode D5. ' +
      'TXD0 (IO43) and RXD0 (IO44) go to nets TXD0 and RXD0, and with EN, IO0, +3V3 and ground they reach the 2 × 3 programming header J2 (pin 1 EN, 2 +3V3, 3 TXD0, 4 GND, 5 RXD0, 6 IO0). ' +
      'IO19 and IO20 are the nets D− and D+ from the USB sheet. IO8 is SDA and IO9 is SCL, each with a 2.2 kΩ pull-up (R8, R9) to +3V3; the bus goes to the temperature and humidity sensor U4 ' +
      '(with a 100 nF capacitor C7 on its supply) and to the 4-pin Qwiic connector J3 (pin 1 GND, 2 +3V3, 3 SDA, 4 SCL). ' +
      'IO10 to IO15 go to the SPI header J4 as CS, MOSI, SCK, MISO, RST and IRQ, with +3V3 and ground. IO39, IO40 and IO41 drive the red, green and blue cathodes of a common-anode RGB LED D6 through 1 kΩ resistors R10 to R12; the anode is on +3V3.',
  });

  // ---- U1
  const ux = 520, uy = 100, uw = 200, uh = 640;
  const L = { v33: 140, en: 210, io0: 330, io3: 430, txd: 480, rxd: 510, dm: 560, dp: 590, io48: 650 };
  const R = { sda: 140, scl: 180, cs: 400, mosi: 430, sck: 460, miso: 490, rst: 520, irq: 550, r: 650, g: 680, b: 710 };
  s.ic(ux, uy, uw, uh, {
    left: [
      { name: '3V3', y: L.v33 }, { name: 'EN', y: L.en }, { name: 'IO0', y: L.io0 }, { name: 'IO3', y: L.io3 },
      { name: 'TXD0', y: L.txd }, { name: 'RXD0', y: L.rxd }, { name: 'IO19', y: L.dm }, { name: 'IO20', y: L.dp }, { name: 'IO48', y: L.io48 },
    ],
    right: [
      { name: 'IO8', y: R.sda }, { name: 'IO9', y: R.scl }, { name: 'IO10', y: R.cs }, { name: 'IO11', y: R.mosi }, { name: 'IO12', y: R.sck },
      { name: 'IO13', y: R.miso }, { name: 'IO14', y: R.rst }, { name: 'IO15', y: R.irq }, { name: 'IO39', y: R.r }, { name: 'IO40', y: R.g }, { name: 'IO41', y: R.b },
    ],
    bottom: [{ name: 'GND', x: ux + uw / 2 }],
  });
  s.text(ux + uw / 2, uy + 250, 'U1', { cls: 'sch-ictitle', anchor: 'middle' });
  s.text(ux + uw / 2, uy + 268, part, { cls: 'sch-val', anchor: 'middle' });
  s.ground(ux + uw / 2, uy + uh + 12);
  s.text(ux + uw / 2, uy + uh + 52, 'IO35–IO37, IO45, IO46 and all other pins not connected', { cls: 'sch-val', anchor: 'middle' });
  const lp = ux - 12, rp = ux + uw + 12;

  // ---- 3V3 pin decoupling
  s.wire([430, L.v33], [lp, L.v33]);
  rail(s, 430, L.v33);
  for (const [x, ref, val] of [[460, 'C4', '10 µF'], [495, 'C5', '100 nF']]) {
    s.dot(x, L.v33).capacitor(x, L.v33, x, L.v33 + 50).ground(x, L.v33 + 50);
    s.text(x, L.v33 + 92, ref, { cls: 'sch-ref', anchor: 'middle' });
    s.text(x, L.v33 + 105, val, { cls: 'sch-val', anchor: 'middle' });
  }

  // ---- a strapping/button network on a left-side pin: pull-up, optional cap, optional button and ESD diode, then a net flag
  function leftNet(y, { pull, cap, btn, esd, flag }) {
    const xEnd = flag ? 140 : esd ? 200 : btn ? 270 : cap ? 330 : 380;
    s.wire([xEnd, y], [lp, y]);
    if (pull) { s.dot(380, y).resistor(380, y, 380, y - 50); rail(s, 380, y - 50); s.label(380, y - 22, pull, '10 kΩ', 'right'); }
    if (cap) { s.dot(330, y).capacitor(330, y, 330, y + 50).ground(330, y + 50).label(330, y + 30, cap, '1 µF', 'right'); }
    if (btn) { s.dot(270, y); button(s, 270, y, y + 60); s.ground(270, y + 60); s.text(250, y + 46, btn[0], { cls: 'sch-ref', anchor: 'end' }); s.text(250, y + 60, btn[1], { cls: 'sch-val', anchor: 'end' }); }
    if (esd) { s.dot(200, y); s.diode(200, y + 50, 200, y, { kind: 'zener' }); s.ground(200, y + 50); s.text(188, y + 30, esd, { cls: 'sch-ref', anchor: 'end' }); }
    if (flag) s.port(140, y, flag, 'in');
  }
  leftNet(L.en, { pull: 'R4', cap: 'C6', btn: ['SW1', 'RESET'], esd: 'D3', flag: 'EN' });
  leftNet(L.io0, { pull: 'R5', btn: ['SW2', 'BOOT'], esd: 'D4', flag: 'IO0' });
  leftNet(L.io3, { pull: 'R6' });
  leftNet(L.io48, { pull: 'R7', btn: ['SW3', 'USER'], esd: 'D5' });
  s.text(100, 120, 'D3–D5: 3.3 V TVS (ESD) diodes', { cls: 'sch-val', anchor: 'start' });
  for (const [y, name] of [[L.txd, 'TXD0'], [L.rxd, 'RXD0'], [L.dm, 'D−'], [L.dp, 'D+']]) s.port(460, y, name, 'in').wire([460, y], [lp, y]);

  // ---- J2 programming header (ESP-PROG pin order)
  const hx = 200, hy = 760, hw = 150;
  s.ic(hx, hy, hw, 110, {
    left: [{ name: '1 EN', y: 790 }, { name: '3 TXD0', y: 820 }, { name: '5 RXD0', y: 850 }],
    right: [{ name: '2 3V3', y: 790 }, { name: '4 GND', y: 820 }, { name: '6 IO0', y: 850 }],
  });
  s.text(hx + hw / 2, hy - 8, 'J2  programming header, 2 × 3', { cls: 'sch-ref', anchor: 'middle' });
  for (const [y, name] of [[790, 'EN'], [820, 'TXD0'], [850, 'RXD0']]) s.port(hx - 12, y, name, 'in');
  s.wire([hx + hw + 12, 790], [400, 790]); rail(s, 400, 790);
  s.wire([hx + hw + 12, 820], [440, 820]).ground(440, 820);
  s.port(hx + hw + 12, 850, 'IO0', 'out');

  // ---- I2C: pull-ups, U4 sensor, J3 Qwiic
  const busEnd = 1110;
  s.hwire(R.sda, rp, busEnd, [840]);
  s.hwire(R.scl, rp, busEnd, [900]);
  s.text(rp + 8, R.sda - 6, 'SDA', { cls: 'sch-net' }).text(rp + 8, R.scl - 6, 'SCL', { cls: 'sch-net' });
  s.dot(800, R.sda).wire([800, R.sda], [800, 125]).resistor(800, 125, 800, 80); rail(s, 800, 80);
  s.dot(840, R.scl).wire([840, R.scl], [840, 125]).resistor(840, 125, 840, 80); rail(s, 840, 80);
  s.text(820, 42, 'R8, R9  2.2 kΩ', { cls: 'sch-ref', anchor: 'middle' });
  // U4 sensor below the bus
  s.dot(900, R.sda).wire([900, R.sda], [900, 228]);
  s.dot(950, R.scl).wire([950, R.scl], [950, 228]);
  s.ic(880, 240, 140, 80, { top: [{ name: 'SDA', x: 900 }, { name: 'SCL', x: 950 }], right: [{ name: 'VDD', y: 270 }], bottom: [{ name: 'GND', x: 950 }] });
  s.text(868, 284, 'U4', { cls: 'sch-ref', anchor: 'end' }).text(868, 298, 'temp. + humidity', { cls: 'sch-val', anchor: 'end' });
  s.ground(950, 332);
  s.wire([1032, 270], [1080, 270]); rail(s, 1080, 270);
  s.dot(1060, 270).capacitor(1060, 270, 1060, 320).ground(1060, 320).label(1060, 302, 'C7', '100 nF', 'right');
  // J3 Qwiic
  const qx = 1122;
  s.ic(qx, 40, 110, 160, { left: [{ name: '1 GND', y: 60 }, { name: '2 3V3', y: 100 }, { name: '3 SDA', y: R.sda }, { name: '4 SCL', y: R.scl }] });
  s.text(qx + 55, 214, 'J3  Qwiic', { cls: 'sch-ref', anchor: 'middle' });
  s.wire([qx - 12, 60], [1100, 60]).ground(1100, 60);
  s.wire([qx - 12, 100], [1060, 100]); rail(s, 1060, 100);

  // ---- SPI header J4
  const spi = [[R.cs, 'CS'], [R.mosi, 'MOSI'], [R.sck, 'SCK'], [R.miso, 'MISO'], [R.rst, 'RST'], [R.irq, 'IRQ']];
  for (const [y, name] of spi) { s.wire([rp, y], [948, y]); s.text(rp + 8, y - 5, name, { cls: 'sch-net' }); }
  s.ic(960, 370, 130, 240, { left: [...spi.map(([y, name]) => ({ name, y })), { name: '3V3', y: 580 }], bottom: [{ name: 'GND', x: 1025 }] });
  s.text(1025, 362, 'J4  SPI header, 2 × 5', { cls: 'sch-ref', anchor: 'middle' });
  s.wire([948, 580], [900, 580]); rail(s, 900, 580);
  s.ground(1025, 622);

  // ---- RGB LED D6 (common anode) through R10–R12
  const ax = 940;
  for (const [y, ref, col] of [[R.r, 'R10', 'R'], [R.g, 'R11', 'G'], [R.b, 'R12', 'B']]) {
    s.resistor(rp, y, 820, y);
    s.text(778, y - 9, ref, { cls: 'sch-ref', anchor: 'middle' });
    s.diode(ax, y, 860, y, { kind: 'led', side: -1 });
    s.wire([820, y], [860, y]);
    s.text(840, y - 6, col, { cls: 'sch-val', anchor: 'middle' });
  }
  s.text(778, R.b + 28, '1 kΩ each', { cls: 'sch-val', anchor: 'middle' });
  s.wire([ax, R.r], [ax, 740], [990, 740]).dot(ax, R.g).dot(ax, R.b);
  rail(s, 990, 740);
  s.text(ax - 60, 768, 'D6  RGB, common anode', { cls: 'sch-ref' });
  return s;
}
