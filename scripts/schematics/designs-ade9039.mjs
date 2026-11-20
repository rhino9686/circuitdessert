// Schematic of the Analog Devices ADE9039 three-phase meter, redrawn from Figure 1 ("3-Phase Meter Using Four di/dt Current Sensors Alongside the
// ADE1139 Amplifiers and Voltage Dividers") on page 1 of the Rev. SpB data sheet. The figure is partly a block diagram: it gives no designators and no
// component values, and it draws no supply, decoupling, clock or host connections. This drawing keeps what the figure shows (the seven analog
// input pairs, the four sensor-and-amplifier blocks, the three voltage dividers, the ground pin and the digital pins) and nothing else.
// In the figure each sensor and its ADE1139 are drawn as one block with a 3.3 V supply and a ground, and that is how they are drawn here.
import { Sheet } from './lib.mjs';

export function threePhaseMeter({ id = 'ade9039', part = 'ADE9039' } = {}) {
  const s = new Sheet(860, 740, {
    top: 30,
    id,
    title: `${part} three-phase meter`,
    desc:
      `Figure 1 of the ${part} data sheet, redrawn. Four di/dt current sensors, type ADEMDIDT-DG-DFL0418, each sit in a block with an ADE1139 amplifier that has a 3.3 V supply and a ground. ` +
      `The blocks for phases A, B and C and for the neutral go to the IAP and IAN, IBP and IBN, ICP and ICN, and INP and INN pins. ` +
      `Each phase voltage goes through a resistor divider: the upper resistor runs from the phase line to the VAP, VBP or VCP pin, the lower resistor runs from that pin to the neutral, and the VAN, VBN and VCN pins connect to the neutral. ` +
      `The GND pin is grounded. The clock pins CLKIN and CLKOUT, the RESET pin, the interrupt pins IRQ0 and IRQ1, the pulse pins CF1, CF2, CF3/ZX and CF4/EVENT/DREADY and the SPI pins SS, SCLK, MISO and MOSI have no external parts in the figure.`,
  });

  const ic = { x: 430, y: 70, w: 230, h: 630 };
  const lx = ic.x - 12;
  const rx = ic.x + ic.w + 12;

  // left pins: four blocks of current pair then voltage pair, then the neutral current pair and GND
  const base = { A: 100, B: 260, C: 420 };
  const left = [];
  const rowsOf = (b) => ({ ip: b, in: b + 30, vp: b + 80, vn: b + 120 });
  for (const ph of ['A', 'B', 'C']) {
    const r = rowsOf(base[ph]);
    left.push({ name: `I${ph}P`, y: r.ip }, { name: `I${ph}N`, y: r.in }, { name: `V${ph}P`, y: r.vp }, { name: `V${ph}N`, y: r.vn });
  }
  const yNp = 580, yNn = 610, yGnd = 670;
  left.push({ name: 'INP', y: yNp }, { name: 'INN', y: yNn }, { name: 'GND', y: yGnd });

  const right = [
    { name: 'CLKIN', y: 100 }, { name: 'CLKOUT', y: 130 }, { name: 'RESET', y: 160 },
    { name: 'IRQ0', y: 200 }, { name: 'IRQ1', y: 230 },
    { name: 'CF1', y: 290 }, { name: 'CF2', y: 320 }, { name: 'CF3/ZX', y: 350 }, { name: 'CF4/EVENT/DREADY', y: 380 },
    { name: 'SS', y: 450 }, { name: 'SCLK', y: 480 }, { name: 'MISO', y: 510 }, { name: 'MOSI', y: 540 },
  ];
  s.ic(ic.x, ic.y, ic.w, ic.h, { left, right });
  s.text(ic.x + ic.w / 2, ic.y + 20, part, { cls: 'sch-ictitle', anchor: 'middle' });

  // ---- right side: group notes only, the figure shows no external parts on these pins
  const note = (y, t) => s.text(rx + 14, y + 4, t, { cls: 'sch-net', anchor: 'start' });
  note(115, 'clock');
  note(160, 'reset');
  note(215, 'interrupts');
  note(335, 'pulse outputs');
  note(495, 'SPI port');

  // ---- sensor and amplifier block (drawn as one block, as in the figure)
  const bx = 150, bw = 150;
  const block = (yp, yn, name) => {
    const top = yp - 26;
    s.add(`<rect class="sch-ic" x="${bx}" y="${top}" width="${bw}" height="90" rx="3"/>`);
    // sensor: a ring
    const cx = bx + 36, cy = yp + 18;
    s.add(`<circle class="sch-w" cx="${cx}" cy="${cy}" r="17"/>`);
    s.add(`<circle class="sch-w" cx="${cx}" cy="${cy}" r="7"/>`);
    // amplifier box with its supply and ground
    const ax = bx + 78, aw = 62;
    s.add(`<rect class="sch-ic" x="${ax}" y="${yp}" width="${aw}" height="34" rx="2"/>`);
    s.text(ax + aw / 2, yp + 21, 'ADE1139', { cls: 'sch-pin', anchor: 'middle' });
    s.wire([ax + aw / 2, yp - 4], [ax + aw / 2, yp]).text(ax + aw / 2, yp - 8, '3.3 V', { cls: 'sch-net', anchor: 'middle' });
    s.ground(ax + aw / 2, yp + 34);
    // the two signal lines leave the block
    s.wire([bx + bw, yp], [lx, yp]);
    s.wire([bx + bw, yn], [lx, yn]);
    // sensor name, to the left of the block
    s.text(bx - 8, yp + 8, 'di/dt sensor', { cls: 'sch-val', anchor: 'end' });
    s.text(bx - 8, yp + 22, 'ADEMDIDT-DG-DFL0418', { cls: 'sch-val', anchor: 'end' });
    if (name) s.text(bx - 8, yp - 8, name, { cls: 'sch-net', anchor: 'end' });
  };

  // open terminal with a name to its left
  const term = (x, y, name) => {
    s.add(`<circle class="sch-w" cx="${x}" cy="${y}" r="3.5"/>`);
    s.text(x - 9, y + 4, name, { cls: 'sch-net', anchor: 'end' });
  };

  // ---- the three phases
  const xDiv = 270; // divider node column
  for (const ph of ['A', 'B', 'C']) {
    const r = rowsOf(base[ph]);
    block(r.ip, r.in, `PHASE ${ph}`);
    // divider: phase line -> upper resistor -> VxP node; lower resistor -> neutral node; VxN at the neutral
    term(100, r.vp, `PHASE ${ph}`);
    s.wire([103.5, r.vp], [150, r.vp]).resistor(150, r.vp, 230, r.vp).wire([230, r.vp], [xDiv, r.vp]);
    s.dot(xDiv, r.vp).wire([xDiv, r.vp], [lx, r.vp]);
    s.resistor(xDiv, r.vp, xDiv, r.vn);
    s.dot(xDiv, r.vn).wire([xDiv, r.vn], [lx, r.vn]);
    s.wire([xDiv, r.vn], [103.5, r.vn]);
    term(100, r.vn, 'NEUTRAL');
  }
  s.text(xDiv + 14, rowsOf(base.A).vp + 24, 'divider, values not given', { cls: 'sch-val', anchor: 'start' });

  // ---- neutral current sensor
  block(yNp, yNn, 'NEUTRAL');

  // ---- ground pin
  s.wire([lx, yGnd], [380, yGnd]).ground(380, yGnd);

  return s;
}
