// Drawings for the Silergy SA89853 (16-channel) 12-bit SAR ADC:
// 1. the "Schematic Diagram (SA89853)" (Figure 16 in the datasheet), with the values from its bill of materials;
// 2. the wiring for the "Talk to it from an ESP32-S3" section: our bench setup.
import { Sheet, refMarkup } from './lib.mjs';

const refMarkupR2 = () => refMarkup('R2');

function terminal(s, x, y, text, side = 'right') {
  const cx = side === 'right' ? x + 4 : x - 4;
  s.add(`<circle class="sch-w" cx="${cx}" cy="${y}" r="3.5"/>`);
  if (side === 'right') s.text(x + 14, y + 4, text, { cls: 'sch-net', anchor: 'start' });
  else s.text(x - 14, y + 4, text, { cls: 'sch-net', anchor: 'end' });
}

export function sa8985xApplication({ id, part = 'SA89853' }) {
  // pin 1 is row 0 on the left, pin 38 row 0 on the right; the channel rows get more room for their filters
  const row = (i) => (i <= 9 ? 70 + i * 40 : 430 + (i - 9) * 52);
  const s = new Sheet(900, row(18) + 60, {
    top: 20,
    id,
    title: `${part} schematic diagram`,
    desc:
      `Schematic of the ${part} 16-channel ADC, redrawn from the datasheet with the values from its bill of materials. ` +
      `GPIO2 and GPIO3 each have a 47 kΩ pull-up (R1) to VBD. REFM goes to ground, the external reference drives REFP, and a 10 µF capacitor C1 connects REFP to REFM. ` +
      `Each VA pin has C1 (10 µF) and C2 (0.1 µF) to the neighbouring AGND pin, which goes to ground; VBD has the same pair to BDGND. MXO connects to AINP, and AINM goes to ground. ` +
      `Every input, CH0 to CH15, comes in through a 33 Ω resistor (R2) with a 270 pF capacitor (C3) to ground at the pin. GPIO0, GPIO1, SDO, SDI, SCLK and CS_N go to the controller.`,
  });

  const ic = { x: 360, y: 40, w: 200, h: row(18) - 40 + 30 };
  const lx = ic.x - 12;
  const rx = ic.x + ic.w + 12;
  const left = ['GPIO2', 'GPIO3', 'REFM', 'REFP', 'VA', 'AGND', 'MXO', 'AINP', 'AINM', 'AGND',
    'CH15', 'CH14', 'CH13', 'CH12', 'CH11', 'CH10', 'CH9', 'CH8', 'AGND'];
  const right = ['GPIO1', 'GPIO0', 'VBD', 'BDGND', 'SDO', 'SDI', 'SCLK', 'CS_N', 'AGND', 'VA',
    'CH0', 'CH1', 'CH2', 'CH3', 'CH4', 'CH5', 'CH6', 'CH7', 'AGND'];
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: left.map((name, i) => ({ name, y: row(i) })),
    right: right.map((name, i) => ({ name, y: row(i) })),
  }, { title: part, subtitle: '12-bit SAR ADC' });

  // ---- left: GPIO2 and GPIO3 pull-ups to VBD
  s.port(150, row(0), 'VBD', 'in').wire([150, row(0)], [240, row(0)]);
  for (const i of [0, 1]) s.resistor(240, row(i), 310, row(i)).wire([310, row(i)], [lx, row(i)]);
  s.dot(210, row(0)).wire([210, row(0)], [210, row(1)], [240, row(1)]);
  s.label(275, row(0), 'R1', '47 kΩ', 'above');

  // ---- reference: REFM to ground, REFP from the reference, C1 across them
  s.wire([lx, row(2)], [230, row(2)]).ground(230, row(2));
  s.port(150, row(3), 'REFP', 'in').text(104, row(3) + 22, '2–3 V reference', { cls: 'sch-net', anchor: 'start' });
  s.wire([150, row(3)], [lx, row(3)]);
  s.dot(300, row(2)).dot(300, row(3)).capacitor(300, row(2), 300, row(3)).label(300, (row(2) + row(3)) / 2, 'C1', '10 µF', 'left');

  // ---- VA with C1 and C2 to AGND, AGND to ground
  s.port(150, row(4), 'VA', 'in').wire([150, row(4)], [lx, row(4)]);
  s.wire([lx, row(5)], [180, row(5)]).ground(180, row(5));
  for (const [x, ref, val] of [[230, 'C1', '10 µF'], [300, 'C2', '0.1 µF']]) {
    s.dot(x, row(4)).dot(x, row(5)).capacitor(x, row(4), x, row(5)).label(x, (row(4) + row(5)) / 2, ref, val, 'left');
  }

  // ---- MXO tied to AINP; AINM and AGND to ground
  s.wire([lx, row(6)], [325, row(6)], [325, row(7)], [lx, row(7)]);
  s.wire([lx, row(8)], [300, row(8)], [300, row(9)]).wire([lx, row(9)], [300, row(9)]).dot(300, row(9)).ground(300, row(9));

  // ---- left channel inputs CH15 to CH8: R2 in series, C3 to ground at the pin
  const filt = (i, name, side) => {
    const y = row(i);
    if (side === 'left') {
      s.wire([150, y], [190, y]).resistor(190, y, 250, y).wire([250, y], [lx, y]).dot(290, y);
      s.capacitor(290, y, 290, y + 24).ground(290, y + 24);
      terminal(s, 150, y, `${name}_IN`, 'left');
      return;
    }
    s.wire([rx, y], [670, y]).resistor(670, y, 730, y).wire([730, y], [770, y]).dot(630, y);
    s.capacitor(630, y, 630, y + 24).ground(630, y + 24);
    terminal(s, 770, y, `${name}_IN`, 'right');
  };
  for (let i = 10; i <= 17; i++) filt(i, left[i], 'left');
  s.label(220, row(10), 'R2', '33 Ω', 'above');
  s.text(304, row(10) + 16, refMarkup('C3'), { cls: 'sch-ref', anchor: 'start', raw: true }).text(304, row(10) + 29, '270 pF', { anchor: 'start' });
  s.wire([lx, row(18)], [320, row(18)]).ground(320, row(18));

  // ---- right: GPIO and SPI to the controller
  for (const i of [0, 1, 4, 5, 6, 7]) { s.wire([rx, row(i)], [770, row(i)]); terminal(s, 770, row(i), right[i], 'right'); }

  // ---- VBD with C2 and C1 to BDGND; VA with C2 and C1 to AGND
  s.wire([rx, row(2)], [750, row(2)]).port(750, row(2), 'VBD', 'out');
  s.wire([rx, row(3)], [750, row(3)]).ground(750, row(3));
  s.wire([rx, row(8)], [750, row(8)]).groundUp(750, row(8));
  s.wire([rx, row(9)], [750, row(9)]).port(750, row(9), 'VA', 'out');
  for (const [a, b] of [[2, 3], [8, 9]]) {
    for (const [x, ref, val] of [[610, 'C2', '0.1 µF'], [680, 'C1', '10 µF']]) {
      s.dot(x, row(a)).dot(x, row(b)).capacitor(x, row(a), x, row(b)).label(x, (row(a) + row(b)) / 2, ref, val, 'right');
    }
  }

  // ---- right channel inputs CH0 to CH7
  for (let i = 10; i <= 17; i++) filt(i, right[i], 'right');
  s.text(700, row(17) + 22, refMarkupR2(), { cls: 'sch-ref', anchor: 'middle', raw: true }).text(700, row(17) + 35, '33 Ω', { anchor: 'middle' });
  s.wire([rx, row(18)], [600, row(18)]).ground(600, row(18));
  return s;
}

export function esp32s3SpiWiringSa8985x({ id, part = 'SA89853' }) {
  const s = new Sheet(780, 470, {
    top: 20,
    id,
    title: `${part} wired to an ESP32-S3 over SPI`,
    desc:
      `Wiring for talking to an ${part} from an ESP32-S3 dev board. The board's 3V3 pin feeds VA and VBD, each with 10 µF and 0.1 µF to ground; all the grounds are joined. ` +
      `A 2.5 V reference drives REFP, with 10 µF from REFP to REFM, and REFM goes to ground. MXO connects to AINP, and AINM goes to ground. ` +
      `GPIO12 (SCK) goes to SCLK, GPIO11 (MOSI) to SDI and GPIO10 to CS_N. SDO goes to GPIO13 (MISO). ` +
      `The voltages to measure connect to CH0, CH1 and the other inputs, each through 33 Ω with 270 pF to ground, and must stay between 0 V and the 2.5 V reference.`,
  });

  const rail = 50;
  const xVBD0 = 450;
  const rows = { sck: 150, mosi: 190, miso: 270, cs: 310 };
  const mcu = { x: 10, y: 100, w: 130, h: 275 };
  s.ic(mcu.x, mcu.y, mcu.w, mcu.h, {
    right: [
      { name: 'GPIO12 (SCK)', y: rows.sck }, { name: 'GPIO11 (MOSI)', y: rows.mosi },
      { name: 'GPIO13 (MISO)', y: rows.miso }, { name: 'GPIO10 (CS)', y: rows.cs }, { name: 'GND', y: 345 },
    ],
    top: [{ name: '3V3', x: 75 }],
  }, { title: 'ESP32-S3', subtitle: 'dev board, 3.3 V' });
  s.ground(152, 345);
  s.text(10, rail - 8, '3.3 V', { cls: 'sch-net', anchor: 'start' });
  s.wire([75, mcu.y - 12], [75, rail], [xVBD0, rail]);

  const ic = { x: 330, y: 100, w: 170, h: 300 };
  const lx = ic.x - 12;
  const rx = ic.x + ic.w + 12;
  const xVA = 380, xVBD = 450;
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'SCLK', y: rows.sck }, { name: 'SDI', y: rows.mosi }, { name: 'SDO', y: rows.miso }, { name: 'CS_N', y: rows.cs }],
    right: [{ name: 'REFP', y: 140 }, { name: 'REFM', y: 190 }, { name: 'MXO', y: 240 }, { name: 'AINP', y: 270 }, { name: 'AINM', y: 300 },
      { name: 'CH0', y: 340 }, { name: 'CH1', y: 375 }],
    top: [{ name: 'VA', x: xVA }, { name: 'VBD', x: xVBD }],
    bottom: [{ name: 'AGND, BDGND', x: 415 }],
  }, { title: part });
  s.dot(xVA, rail).wire([xVA, rail], [xVA, ic.y - 12]).wire([xVBD, rail], [xVBD, ic.y - 12]);
  s.text(470, rail - 8, '10 µF + 0.1 µF to ground at VA and at VBD', { cls: 'sch-val', anchor: 'start' });
  s.ground(415, ic.y + ic.h + 12);

  // ---- SPI lines straight across
  for (const k of ['sck', 'mosi', 'miso', 'cs']) s.wire([152, rows[k]], [lx, rows[k]]);

  // ---- reference: 2.5 V on REFP, 10 µF from REFP to REFM, REFM to ground
  s.wire([rx, 140], [660, 140]); terminal(s, 660, 140, '2.5 V reference', 'right');
  s.dot(570, 140).capacitor(570, 140, 570, 190).dot(570, 190).label(570, 165, 'CREF', '10 µF', 'right');
  s.wire([rx, 190], [600, 190]).ground(600, 190);

  // ---- MXO to AINP, AINM to ground
  s.wire([rx, 240], [545, 240], [545, 270], [rx, 270]);
  s.wire([rx, 300], [560, 300]).ground(560, 300);

  // ---- two of the inputs, with the datasheet's filter
  for (const [y, name] of [[340, 'CH0'], [375, 'CH1']]) {
    s.wire([rx, y], [600, y]).resistor(600, y, 660, y).wire([660, y], [690, y]);
    terminal(s, 690, y, `${name} input`, 'right');
  }
  s.text(630, 420, 'each input: 33 Ω, 270 pF to ground', { cls: 'sch-val', anchor: 'middle' });
  return s;
}
