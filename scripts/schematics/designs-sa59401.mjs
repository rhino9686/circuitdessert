// Drawings for the Silergy SA59401 16-bit ADC:
// 1. the "Application Schematic" (page 15 of the datasheet), with the values from its bill of materials;
// 2. the wiring for the "Talk to it from an ESP32-S3" section: our bench setup, with the datasheet's 50 Ω
//    series resistors and 0.1 µF bypass capacitor.
import { Sheet, refMarkup } from './lib.mjs';

function terminal(s, x, y, text) {
  s.add(`<circle class="sch-w" cx="${x + 4}" cy="${y}" r="3.5"/>`);
  s.text(x + 14, y + 4, text, { cls: 'sch-net', anchor: 'start' });
}

export function adcApplication({ id, part = 'SA59401' }) {
  const s = new Sheet(820, 450, {
    top: 10,
    id,
    title: `${part} application schematic`,
    desc:
      `Application schematic of the ${part} ADC, redrawn from the datasheet with the values from its bill of materials. VDD (2.7–5.5 V) feeds the VDD pin, with a 0.1 µF bypass capacitor CBYPASS to ground. ` +
      `Each analog input comes in through a 100 Ω series resistor (R1 on AIN0, R2 on AIN1, R3 on AIN2, R4 on AIN3). A 1 µF capacitor C1 connects across AIN0 and AIN1, and C4 across AIN2 and AIN3. ` +
      `Each input also has a 0.1 µF capacitor to ground: C2 on AIN0, C3 on AIN1, C5 on AIN2 and C6 on AIN3. ` +
      `SCLK, CS_N, DOUT/DRDY_N and DIN each connect to the controller through a 50 Ω series resistor (RSCLK, RCS_N, RDOUT and RDIN). GND goes to ground.`,
  });

  const ic = { x: 330, y: 80, w: 170, h: 330 };
  const lx = ic.x - 12;
  const rx = ic.x + ic.w + 12;
  const rows = { AIN0: 130, AIN1: 190, AIN2: 320, AIN3: 380 };
  const rRows = { SCLK: 120, CS_N: 180, 'DOUT/DRDY_N': 310, DIN: 370 };
  const xV = 415;

  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: Object.entries(rows).map(([name, y]) => ({ name, y })),
    right: Object.entries(rRows).map(([name, y]) => ({ name, y })),
    top: [{ name: 'VDD', x: xV }],
    bottom: [{ name: 'GND', x: xV }],
  }, { title: part, subtitle: '16-bit ΔΣ ADC' });

  // ---- supply
  const rail = 30;
  s.port(60, rail, 'VDD', 'in').text(76, rail + 18, '2.7–5.5 V', { cls: 'sch-net', anchor: 'start' });
  s.wire([60, rail], [xV, rail], [xV, ic.y - 12]);
  s.dot(xV, rail).wire([xV, rail], [600, rail]).capacitor(600, rail, 600, 75).ground(600, 75).label(600, 55, 'CBYPASS', '0.1 µF', 'right');
  s.ground(xV, ic.y + ic.h + 12);

  // ---- input filters: 100 Ω in series, 1 µF across each pair, 0.1 µF from each input to ground
  const nx = 245;
  const series = [['AIN0', 'R1'], ['AIN1', 'R2'], ['AIN2', 'R3'], ['AIN3', 'R4']];
  for (const [name, ref] of series) {
    const y = rows[name];
    s.port(60, y, name, 'in').wire([60, y], [120, y]).resistor(120, y, 190, y).wire([190, y], [lx, y]).dot(nx, y);
    s.label(155, y, ref, '100 Ω', 'above');
  }
  const pair = (top, bot, cd, ct, cb) => {
    s.capacitor(nx, top, nx, top - 45).groundUp(nx, top - 45).label(nx, top - 22, ct, '0.1 µF', 'right');
    s.capacitor(nx, top, nx, bot).label(nx, (top + bot) / 2, cd, '1 µF', 'right');
    s.capacitor(nx, bot, nx, bot + 40).ground(nx, bot + 40).label(nx, bot + 22, cb, '0.1 µF', 'right');
  };
  pair(rows.AIN0, rows.AIN1, 'C1', 'C2', 'C3');
  pair(rows.AIN2, rows.AIN3, 'C4', 'C5', 'C6');

  // ---- digital lines: 50 Ω in series to the controller
  const refs = { SCLK: 'RSCLK', CS_N: 'RCS_N', 'DOUT/DRDY_N': 'RDOUT', DIN: 'RDIN' };
  for (const [name, y] of Object.entries(rRows)) {
    s.wire([rx, y], [580, y]).resistor(580, y, 650, y).wire([650, y], [690, y]);
    s.text(615, y + 20, refMarkup(refs[name]), { cls: 'sch-ref', anchor: 'middle', raw: true }).text(615, y + 33, '50 Ω', { anchor: 'middle' });
    terminal(s, 690, y, name);
  }
  return s;
}

export function esp32s3SpiWiringSa59401({ id, part = 'SA59401' }) {
  const s = new Sheet(720, 430, {
    top: 20,
    id,
    title: `${part} wired to an ESP32-S3 over SPI`,
    desc:
      `Wiring for talking to an ${part} from an ESP32-S3 dev board. Everything runs at 3.3 V, so no level shifter is needed. The board's 3V3 pin feeds VDD, with a 0.1 µF bypass capacitor to ground. ` +
      `GPIO12 (SCK) goes to SCLK, GPIO11 (MOSI) to DIN and GPIO10 to CS_N, each through a 50 Ω resistor near the ESP32-S3. DOUT/DRDY_N goes to GPIO13 (MISO) through a 50 Ω resistor near the ${part}. ` +
      `The signal to measure connects to AIN0 (positive) and AIN1 (negative). AIN2 and AIN3 are left open. The grounds are joined.`,
  });

  const rail = 50;
  const mcu = { x: 10, y: 90, w: 130, h: 290 };
  const rows = { sck: 140, mosi: 200, miso: 270, cs: 330 };
  s.ic(mcu.x, mcu.y, mcu.w, mcu.h, {
    right: [
      { name: 'GPIO12 (SCK)', y: rows.sck }, { name: 'GPIO11 (MOSI)', y: rows.mosi },
      { name: 'GPIO13 (MISO)', y: rows.miso }, { name: 'GPIO10 (CS)', y: rows.cs }, { name: 'GND', y: 360 },
    ],
    top: [{ name: '3V3', x: 75 }],
  }, { title: 'ESP32-S3', subtitle: 'dev board, 3.3 V' });
  s.ground(152, 360);
  s.text(10, rail - 8, '3.3 V', { cls: 'sch-net', anchor: 'start' });
  s.wire([75, mcu.y - 12], [75, rail], [620, rail]);

  const ic = { x: 420, y: 90, w: 150, h: 290 };
  const xV = 495;
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'SCLK', y: rows.sck }, { name: 'DIN', y: rows.mosi }, { name: 'DOUT/DRDY_N', y: rows.miso }, { name: 'CS_N', y: rows.cs }],
    right: [{ name: 'AIN0', y: 150 }, { name: 'AIN1', y: 200 }, { name: 'AIN2', y: 290 }, { name: 'AIN3', y: 340 }],
    top: [{ name: 'VDD', x: xV }],
    bottom: [{ name: 'GND', x: xV }],
  }, { title: part });
  s.dot(xV, rail).wire([xV, rail], [xV, ic.y - 12]);
  s.dot(620, rail).capacitor(620, rail, 620, 95).ground(620, 95).label(620, 72, 'CBYPASS', '0.1 µF', 'right');
  s.ground(xV, ic.y + ic.h + 12);

  // ---- SPI lines, 50 Ω each: three near the ESP32-S3, RDOUT near the SA59401
  const lines = [['sck', 'RSCLK', 180], ['mosi', 'RDIN', 180], ['miso', 'RDOUT', 320], ['cs', 'RCS_N', 180]];
  for (const [k, ref, x0] of lines) {
    const y = rows[k];
    s.wire([152, y], [x0, y]).resistor(x0, y, x0 + 70, y).wire([x0 + 70, y], [408, y]);
    s.label(x0 + 35, y, ref, '50 Ω', 'above');
  }

  // ---- analog side
  s.wire([582, 150], [640, 150]); terminal(s, 640, 150, 'input +');
  s.wire([582, 200], [640, 200]); terminal(s, 640, 200, 'input −');
  s.text(594, 319, 'AIN2, AIN3 open', { cls: 'sch-val', anchor: 'start' });
  return s;
}
