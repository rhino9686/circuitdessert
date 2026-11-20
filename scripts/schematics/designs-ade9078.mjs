// Schematic of the Analog Devices ADE9078 test circuit, redrawn from Figure 27 ("Test Circuit") on page 20 of the Rev. A data sheet.
// The figure carries values but no designators, so none are drawn. It draws the three supply pins with their decoupling, the reset network,
// the filters on one current channel and on the voltage inputs, a pulse-output LED, the reference and crystal networks and the ground pins,
// and nothing else. "SAME AS" boxes stand for channels the figure does not repeat. Pins 1, 17 and 18 (PULL_HIGH, NC1, NC2) are not in the figure.
// The 10 kΩ and 1 µF parts on RESET are drawn as the figure draws them: both run between the 3.3 V node and the RESET line.
import { Sheet } from './lib.mjs';

export function testCircuit({ id = 'ade9078', part = 'ADE9078' } = {}) {
  const s = new Sheet(940, 975, {
    top: 30,
    id,
    title: `${part} test circuit`,
    desc:
      `Figure 27 of the ${part} data sheet, redrawn. The VDD pin is on 3.3 V with 10 µF and 0.1 µF to ground. The AVDDOUT pin and the DVDDOUT pin each have 4.7 µF and 0.1 µF to ground. ` +
      `RESET has a 10 kΩ resistor and a 1 µF capacitor, both from 3.3 V to the RESET line. Current channel A has a 1 kΩ resistor in each input line, and a 22 nF capacitor from each side to ground; ` +
      `channels B, C and N are marked "same as" channel A. On voltage channel A, VAN and VAP each have 1 kΩ in parallel with 22 nF to ground; channels B and C are marked "same as". ` +
      `CF2 drives an LED from a 3.3 V supply through 1 kΩ, and CF1 is marked "same as CF2". The REF pin has 4.7 µF and 0.1 µF to ground. A 12.288 MHz crystal sits between CLKIN and CLKOUT with 18 pF from each pin to ground. ` +
      `DGND, REFGND, AGND and GND join at one point that is grounded. PM0, PM1 and the SPI, pulse and interrupt pins are open terminals.`,
  });

  const ic = { x: 420, y: 170, w: 220, h: 736 };
  const lx = ic.x - 12;
  const rx = ic.x + ic.w + 12;

  const left = [
    { name: 'PM0', y: 200 }, { name: 'PM1', y: 228 }, { name: 'RESET', y: 270 },
    { name: 'IAP', y: 325 }, { name: 'IAN', y: 385 },
    { name: 'IBP', y: 425 }, { name: 'IBN', y: 453 },
    { name: 'ICP', y: 493 }, { name: 'ICN', y: 521 },
    { name: 'INP', y: 561 }, { name: 'INN', y: 589 },
    { name: 'VAN', y: 650 }, { name: 'VAP', y: 710 },
    { name: 'VBN', y: 780 }, { name: 'VBP', y: 808 },
    { name: 'VCN', y: 848 }, { name: 'VCP', y: 876 },
  ];
  const right = [
    { name: 'SS', y: 205 }, { name: 'MOSI', y: 233 }, { name: 'MISO', y: 261 }, { name: 'SCLK', y: 289 },
    { name: 'CF4/EVENT/DREADY', y: 335 }, { name: 'CF3/ZX', y: 363 }, { name: 'CF2', y: 418 }, { name: 'CF1', y: 458 },
    { name: 'IRQ1', y: 505 }, { name: 'IRQ0', y: 533 },
    { name: 'REF', y: 580 }, { name: 'CLKOUT', y: 660 }, { name: 'CLKIN', y: 725 },
  ];
  const top = [{ name: 'AVDDOUT', x: 460 }, { name: 'VDD', x: 530 }, { name: 'DVDDOUT', x: 600 }];
  const bottom = [{ name: 'DGND', x: 450 }, { name: 'REFGND', x: 505 }, { name: 'AGND', x: 560 }, { name: 'GND', x: 615 }];
  s.ic(ic.x, ic.y, ic.w, ic.h, { left, right, top, bottom });
  s.text(ic.x + ic.w / 2, ic.y + ic.h / 2, part, { cls: 'sch-ictitle', anchor: 'middle' });

  const open = (x, y) => s.add(`<circle class="sch-w" cx="${x}" cy="${y}" r="3.5"/>`);
  const val = (x, y, t, anchor = 'start') => s.text(x, y, t, { cls: 'sch-val', anchor });

  // ---- note on pins the figure leaves out (from the pin table, not the figure)
  val(24, 96, 'Not in the figure; the pin table says:', 'start');
  val(24, 110, 'PM0 and PM1 to ground for normal operation;', 'start');
  val(24, 124, 'PULL_HIGH (pin 1) to VDD; NC1, NC2 to ground.', 'start');

  // ---- supply pins (top)
  // VDD: 3.3 V on a node at y = 92, bypass capacitors hang upward to ground
  s.wire([530, 158], [530, 92]).dot(530, 92);
  s.wire([530, 92], [440, 92]);
  val(432, 96, '3.3 V', 'end');
  s.wire([530, 92], [700, 92]);
  s.capacitor(610, 92, 610, 62, { polarized: true }).groundUp(610, 62);
  s.dot(610, 92);
  val(582, 72, '10 µF', 'end');
  s.capacitor(690, 92, 690, 62).groundUp(690, 62);
  val(704, 80, '0.1 µF');

  // AVDDOUT: bus at y = 130 running left, capacitors hang down
  s.wire([460, 158], [460, 130], [330, 130]);
  s.capacitor(330, 130, 330, 164, { polarized: true }).ground(330, 164);
  val(316, 150, '4.7 µF', 'end');
  s.dot(385, 130).capacitor(385, 130, 385, 164).ground(385, 164);
  val(399, 150, '0.1 µF');

  // DVDDOUT: bus at y = 130 running right, capacitors hang down
  s.wire([600, 158], [600, 130], [770, 130]);
  s.capacitor(680, 130, 680, 164, { polarized: true }).ground(680, 164);
  s.dot(680, 130);
  val(666, 150, '4.7 µF', 'end');
  s.capacitor(770, 130, 770, 164).ground(770, 164);
  val(784, 150, '0.1 µF');

  // ---- PM0, PM1: open terminals
  for (const y of [200, 228]) { s.wire([lx, y], [376, y]); open(372.5, y); }

  // ---- RESET: terminal, 10 kΩ and 1 µF both from 3.3 V to the RESET line
  s.wire([lx, 270], [64, 270]); open(60.5, 270);
  s.wire([200, 228], [250, 228]).dot(200, 228);
  s.wire([200, 228], [200, 214]);
  s.text(200, 206, '3.3 V', { cls: 'sch-net', anchor: 'middle' });
  s.resistor(200, 228, 200, 270);
  s.capacitor(250, 228, 250, 270);
  s.dot(200, 270).dot(250, 270);
  val(190, 252, '10 kΩ', 'end');
  val(262, 252, '1 µF');

  // ---- current channel A: 1 kΩ in each leg, 22 nF from each side to ground
  const ia = (yp, yn) => {
    s.wire([lx, yp], [200, yp]).resistor(90, yp, 170, yp).wire([64, yp], [90, yp]);
    open(60.5, yp);
    val(130, yp - 10, '1 kΩ', 'middle');
    s.wire([lx, yn], [200, yn]).resistor(90, yn, 170, yn).wire([64, yn], [90, yn]);
    open(60.5, yn);
    val(130, yn + 20, '1 kΩ', 'middle');
    s.dot(200, yp).dot(200, yn);
  };
  ia(325, 385);
  s.capacitor(200, 325, 200, 350).capacitor(200, 385, 200, 360);
  s.wire([200, 350], [200, 360]).dot(200, 355);
  s.wire([200, 355], [236, 355]).ground(236, 355);
  val(188, 343, '22 nF', 'end');
  val(188, 371, '22 nF', 'end');

  // ---- "same as" boxes
  const same = (y1, y2, l1, l2) => {
    const top = y1 - 14;
    s.add(`<rect class="sch-ic" x="308" y="${top}" width="90" height="${y2 - y1 + 28}" rx="2"/>`);
    s.wire([lx, y1], [398, y1]).wire([lx, y2], [398, y2]);
    s.text(353, top + (y2 - y1 + 28) / 2 - 2, l1, { cls: 'sch-pin', anchor: 'middle' });
    s.text(353, top + (y2 - y1 + 28) / 2 + 12, l2, { cls: 'sch-pin', anchor: 'middle' });
  };
  same(425, 453, 'SAME AS', 'IAP, IAN');
  same(493, 521, 'SAME AS', 'IAP, IAN');
  same(561, 589, 'SAME AS', 'IAP, IAN');
  same(780, 808, 'SAME AS', 'VAP, VAN');
  same(848, 876, 'SAME AS', 'VAP, VAN');

  // ---- voltage channel A: 1 kΩ in parallel with 22 nF to ground on each input
  // VAN: network hangs upward to ground
  s.wire([lx, 650], [64, 650]); open(60.5, 650);
  s.dot(235, 650).dot(280, 650);
  s.resistor(235, 650, 235, 610).capacitor(280, 650, 280, 610);
  s.wire([235, 610], [280, 610]).dot(235, 610).groundUp(235, 610);
  val(227, 634, '1 kΩ', 'end');
  val(292, 634, '22 nF');
  // VAP: network hangs downward to ground
  s.wire([lx, 710], [64, 710]); open(60.5, 710);
  s.dot(235, 710).dot(280, 710);
  s.resistor(235, 710, 235, 750).capacitor(280, 710, 280, 750);
  s.wire([235, 750], [280, 750]).dot(235, 750).ground(235, 750);
  val(227, 734, '1 kΩ', 'end');
  val(292, 734, '22 nF');

  // ---- digital pins: open terminals
  for (const y of [205, 233, 261, 289, 335, 363, 505, 533]) { s.wire([rx - 12 + 12, y], [696, y]); open(699.5, y); }

  // ---- CF2: LED from 3.3 V through 1 kΩ; CF1 same as CF2
  s.wire([rx, 418], [790, 418]);
  s.text(790, 322, '3.3 V', { cls: 'sch-net', anchor: 'middle' });
  s.wire([790, 326], [790, 335]);
  s.resistor(790, 335, 790, 375);
  val(778, 359, '1 kΩ', 'end');
  s.diode(790, 375, 790, 418, { kind: 'led' });
  s.add(`<rect class="sch-ic" x="690" y="444" width="100" height="28" rx="2"/>`);
  s.wire([rx, 458], [690, 458]);
  s.text(740, 462, 'SAME AS CF2', { cls: 'sch-pin', anchor: 'middle' });

  // ---- reference: 4.7 µF and 0.1 µF to ground
  s.wire([rx, 580], [850, 580]).dot(790, 580);
  s.capacitor(790, 580, 790, 612, { polarized: true }).ground(790, 612);
  val(776, 600, '4.7 µF', 'end');
  s.capacitor(850, 580, 850, 612).ground(850, 612);
  val(864, 600, '0.1 µF');

  // ---- crystal with 18 pF on each pin
  s.wire([rx, 660], [720, 660]).dot(720, 660);
  s.wire([rx, 725], [720, 725]).dot(720, 725);
  s.wire([720, 660], [720, 680]).wire([708, 680], [732, 680]);
  s.add(`<rect class="sch-ic" x="713" y="686" width="14" height="14" rx="1"/>`);
  s.wire([708, 706], [732, 706]).wire([720, 706], [720, 725]);
  val(742, 697, '12.288 MHz');
  s.capacitor(720, 660, 764, 660).ground(764, 660);
  val(742, 640, '18 pF', 'middle');
  s.capacitor(720, 725, 764, 725).ground(764, 725);
  val(742, 758, '18 pF', 'middle');

  // ---- ground pins join at one point
  const yb = 936;
  s.wire([450, 918], [450, yb]).wire([505, 918], [505, yb]).wire([560, 918], [560, yb]).wire([615, 918], [615, yb]);
  s.wire([450, yb], [615, yb]);
  s.dot(505, yb).dot(560, yb).dot(532, yb);
  s.ground(532, yb);

  return s;
}
