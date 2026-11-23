// Schematics for three-terminal fixed LDOs (input, output, ground) and for a fixed LDO with enable and power-good.
// Used by the TPS7B69xx-Q1, L5150BN and TDA3664 pages (three pins) and the TPS745-Q1 page (enable and power-good).
// Each datasheet figure is redrawn; the part pages say which values are the datasheet's and which are not.
import { Sheet } from './lib.mjs';

/**
 * Three-terminal LDO: input pin on the left, output pin on the right, ground below.
 * `cin` is a list of input capacitors ({ ref, val, dashed }); `cout` a list of output capacitors.
 * A `dashed` capacitor hangs from the input rail on a dashed connection (an optional part).
 */
export function ldoThreePin({ id, part, pins, ports, cin, cout, desc }) {
  const s = new Sheet(760, 330, { top: 70, id, title: `${part} typical application circuit`, desc });
  const ic = { x: 290, y: 110, w: 140, h: 130 };
  const lx = ic.x - 12;
  const rx = ic.x + ic.w + 12;
  const y = 160; // input and output pin row
  const gx = 360;
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: pins.in, y }],
    right: [{ name: pins.out, y }],
    bottom: [{ name: pins.gnd, x: gx }],
  }, { title: part });

  // input rail with its capacitors
  s.port(60, y, ports.in, 'in');
  s.wire([60, y], [lx, y]);
  const inX = [130, 220];
  cin.forEach((c, i) => {
    const x = inX[i];
    s.dot(x, y);
    if (c.dashed) {
      s.add(`<path class="sch-w" stroke-dasharray="4 3" d="M${x} ${y} L${x} 190"/>`);
      s.capacitor(x, 190, x, 250).ground(x, 250).label(x, 220, c.ref, c.val, i === 0 ? 'left' : 'right');
    } else {
      s.capacitor(x, y, x, 250).ground(x, 250).label(x, 205, c.ref, c.val, i === 0 ? 'left' : 'right');
    }
  });

  // output rail with its capacitors
  const portX = 700;
  s.wire([rx, y], [portX, y]);
  s.port(portX, y, ports.out, 'out');
  const outX = [510, 600];
  cout.forEach((c, i) => {
    const x = outX[i];
    s.dot(x, y).capacitor(x, y, x, 250).ground(x, 250).label(x, 205, c.ref, c.val, i === 0 ? 'left' : 'right');
  });

  // ground pin
  s.wire([gx, ic.y + ic.h + 12], [gx, 280]).ground(gx, 280);
  return s;
}

/**
 * TPS745-Q1 fixed version, redrawn from the datasheet's "Typical Application: Fixed Voltage Version":
 * EN tied to IN, an open-drain PG with its pull-up to VOUT, and one capacitor each on IN and OUT.
 */
export function ldoEnablePg({ id, part, v = {} }) {
  const val = { cin: '2.2 µF', cout: '2.2 µF', rpg: '10–100 kΩ', vout: '1.2 V', ...v };
  const s = new Sheet(800, 360, {
    top: 70,
    id,
    title: `${part} typical application circuit`,
    desc:
      `Typical application circuit of the ${part} fixed-voltage LDO with power-good, redrawn from the datasheet. ` +
      `The input VIN feeds the IN pin and is also wired to the EN pin, so the regulator is always enabled. An input capacitor CIN (${val.cin}) goes to ground. ` +
      `The OUT pin is the output VOUT (${val.vout}) with an output capacitor COUT (${val.cout}) to ground. ` +
      `The open-drain PG pin has a pull-up resistor RPG (${val.rpg}) to VOUT and is also brought out as the power-good signal. The GND pin goes to ground.`,
  });
  const ic = { x: 260, y: 110, w: 150, h: 170 };
  const lx = ic.x - 12;
  const rx = ic.x + ic.w + 12;
  const yIN = 150, yEN = 230; // left pins
  const yOUT = 150, yPG = 230; // right pins
  const gx = 335;
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'IN', y: yIN }, { name: 'EN', y: yEN }],
    right: [{ name: 'OUT', y: yOUT }, { name: 'PG', y: yPG }],
    bottom: [{ name: 'GND', x: gx }],
  }, { title: part });

  // input: VIN flag, CIN, and EN tied to the input rail
  const cinX = 130, tapX = 215;
  s.port(50, yIN, 'VIN', 'in');
  s.wire([50, yIN], [lx, yIN]);
  s.dot(cinX, yIN).capacitor(cinX, yIN, cinX, 260).ground(cinX, 260).label(cinX, 205, 'CIN', val.cin, 'left');
  s.dot(tapX, yIN).wire([tapX, yIN], [tapX, yEN], [lx, yEN]);

  // output: VOUT flag, COUT, and the PG pull-up to VOUT
  const rpgX = 510, coutX = 630, portX = 740;
  s.wire([rx, yOUT], [portX, yOUT]);
  s.port(portX, yOUT, 'VOUT', 'out');
  s.dot(rpgX, yOUT).dot(coutX, yOUT);
  s.capacitor(coutX, yOUT, coutX, 260).ground(coutX, 260).label(coutX, 205, 'COUT', val.cout, 'right');
  s.resistor(rpgX, yOUT, rpgX, yPG).label(rpgX, 190, 'RPG', val.rpg, 'left');
  s.dot(rpgX, yPG).wire([rx, yPG], [portX, yPG]);
  s.port(portX, yPG, 'PG', 'out');

  // ground pin
  s.wire([gx, ic.y + ic.h + 12], [gx, 320]).ground(gx, 320);
  return s;
}

/**
 * Adjustable LDO with an enable pin and, optionally, a separate bias pin (NCP133, RT9081A).
 * Left pins: input, enable, bias; right pins: output, ADJ; ground below.
 * `en` is 'tied' (EN wired to the input rail) or a port name. `bias` is a port name or absent.
 * R1 runs from the output to ADJ and R2 from ADJ to ground, as in the datasheet figures.
 */
export function ldoAdjustable({ id, part, pins, ports, en, bias, cin, cout, cbias, r1, r2, desc, hopEn = false }) {
  const hasBias = !!bias;
  const w = 800;
  const h = hasBias ? 430 : 370;
  const s = new Sheet(w, h, { top: 70, id, title: `${part} typical application circuit`, desc });
  const ic = { x: 280, y: 100, w: 150, h: hasBias ? 210 : 150 };
  const lx = ic.x - 12;
  const rx = ic.x + ic.w + 12;
  const yIN = 140, yEN = 210, yBIAS = 280, yADJ = 210;
  const gx = 360;
  const gndY = ic.y + ic.h + 50; // ground rail of the capacitors and R2
  const left = [{ name: pins.in, y: yIN }, { name: pins.en, y: yEN }];
  if (hasBias) left.push({ name: pins.bias, y: yBIAS });
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left,
    right: [{ name: pins.out, y: yIN }, { name: pins.adj, y: yADJ }],
    bottom: [{ name: pins.gnd, x: gx }],
  }, { title: part });

  // input rail and CIN
  const cinX = 130;
  s.port(60, yIN, ports.in, 'in');
  s.wire([60, yIN], [lx, yIN]);
  s.dot(cinX, yIN).capacitor(cinX, yIN, cinX, gndY).ground(cinX, gndY).label(cinX, gndY - 40, cin.ref, cin.val, 'left');

  // enable: tied to the input rail, or its own port
  if (en === 'tied') {
    s.dot(215, yIN).wire([215, yIN], [215, yEN], [lx, yEN]);
  } else {
    s.port(60, yEN, en, 'in');
    if (hopEn) s.hwire(yEN, 60, lx, [cinX]);
    else s.wire([60, yEN], [lx, yEN]);
  }

  // bias pin and CBIAS
  if (hasBias) {
    const cbX = 215;
    s.port(60, yBIAS, bias, 'in');
    s.wire([60, yBIAS], [lx, yBIAS]);
    s.dot(cbX, yBIAS).capacitor(cbX, yBIAS, cbX, gndY).ground(cbX, gndY).label(cbX, gndY - 40, cbias.ref, cbias.val, 'left');
  }

  // output rail, feedback divider and COUT
  const rX = 520, coutX = 640, portX = 720;
  s.wire([rx, yIN], [portX, yIN]);
  s.port(portX, yIN, ports.out, 'out');
  s.dot(rX, yIN).dot(coutX, yIN);
  s.resistor(rX, yIN, rX, yADJ).label(rX, (yIN + yADJ) / 2, r1.ref, r1.val, 'right');
  s.dot(rX, yADJ).wire([rx, yADJ], [rX, yADJ]);
  s.resistor(rX, yADJ, rX, gndY).ground(rX, gndY).label(rX, (yADJ + gndY) / 2, r2.ref, r2.val, 'right');
  s.capacitor(coutX, yIN, coutX, gndY).ground(coutX, gndY).label(coutX, gndY - 40, cout.ref, cout.val, 'right');

  // ground pin
  s.wire([gx, ic.y + ic.h + 12], [gx, gndY + 20]).ground(gx, gndY + 20);
  return s;
}

/**
 * TPS7A92 typical application (Figure 7-2 of the datasheet): 2.0 V in, 1.2 V out.
 * EN and SS_CTRL tied to IN, CNR/SS on the NR/SS pin, R1/R2 with CFF across R1, and an open-drain PG with its pull-up to VOUT.
 */
export function ldoLowNoise({ id, part, v = {} }) {
  const val = {
    cin: '22 µF', cout: '22 µF', cnr: '100 nF', cff: '10 nF', r1: '5.9 kΩ', r2: '11.8 kΩ', rpg: '20 kΩ', ...v,
  };
  const s = new Sheet(840, 430, {
    top: 70,
    id,
    title: `${part} typical application circuit`,
    desc:
      `Typical application circuit of the ${part} 2 A low-noise LDO, redrawn from the datasheet's Figure 7-2 for a 1.2 V output from a 2.0 V input. ` +
      `The input VIN feeds the IN pin with an input capacitor CIN (${val.cin}) to ground, and the EN and SS_CTRL pins are both wired to the input rail. ` +
      `A noise-reduction and soft-start capacitor CNR/SS (${val.cnr}) goes from the NR/SS pin to ground. ` +
      `The OUT pin is the output VOUT with an output capacitor COUT (${val.cout}) to ground. The feedback divider is R1 (${val.r1}) from VOUT to the FB pin and R2 (${val.r2}) from FB to ground, ` +
      `with a feed-forward capacitor CFF (${val.cff}) across R1. The open-drain PG pin has a pull-up resistor RPG (${val.rpg}) to VOUT and is brought out as the power-good signal. The GND pin goes to ground.`,
  });
  const ic = { x: 280, y: 100, w: 150, h: 230 };
  const lx = ic.x - 12;
  const rx = ic.x + ic.w + 12;
  const yIN = 140, yEN = 190, ySS = 240, yNR = 290;
  const yOUT = 140, yFB = 190, yPG = 300;
  const gx = 360, gnd = 370;
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'IN', y: yIN }, { name: 'EN', y: yEN }, { name: 'SS_CTRL', y: ySS }, { name: 'NR/SS', y: yNR }],
    right: [{ name: 'OUT', y: yOUT }, { name: 'FB', y: yFB }, { name: 'PG', y: yPG }],
    bottom: [{ name: 'GND', x: gx }],
  }, { title: part });

  // input rail, CIN, EN and SS_CTRL tied to IN, CNR/SS
  const cinX = 130, tapX = 215;
  s.port(60, yIN, 'VIN', 'in');
  s.wire([60, yIN], [lx, yIN]);
  s.dot(cinX, yIN).capacitor(cinX, yIN, cinX, gnd).ground(cinX, gnd).label(cinX, gnd - 40, 'CIN', val.cin, 'left');
  s.dot(tapX, yIN).wire([tapX, yIN], [tapX, ySS]);
  s.dot(tapX, yEN).wire([tapX, yEN], [lx, yEN]);
  s.wire([tapX, ySS], [lx, ySS]);
  s.wire([lx, yNR], [tapX, yNR]);
  s.capacitor(tapX, yNR, tapX, gnd).ground(tapX, gnd).label(tapX, gnd - 40, 'CNR/SS', val.cnr, 'left');

  // output rail: R1 with CFF across it, R2 to ground, COUT, RPG to the PG node
  const r1X = 500, cffX = 560, coutX = 640, rpgX = 710, portX = 780;
  s.wire([rx, yOUT], [portX, yOUT]);
  s.port(portX, yOUT, 'VOUT', 'out');
  s.dot(r1X, yOUT).dot(cffX, yOUT).dot(coutX, yOUT).dot(rpgX, yOUT);
  s.resistor(r1X, yOUT, r1X, yFB).label(r1X, 165, 'R1', val.r1, 'left');
  s.capacitor(cffX, yOUT, cffX, yFB).label(cffX, 165, 'CFF', val.cff, 'right');
  s.wire([rx, yFB], [cffX, yFB]);
  s.dot(r1X, yFB).dot(cffX, yFB);
  s.resistor(r1X, yFB, r1X, 255).ground(r1X, 255).label(r1X, 222, 'R2', val.r2, 'left');
  s.capacitor(coutX, yOUT, coutX, gnd).ground(coutX, gnd).label(coutX, gnd - 40, 'COUT', val.cout, 'right');
  s.resistor(rpgX, yOUT, rpgX, yPG).label(rpgX, 225, 'RPG', val.rpg, 'left');
  s.wire([rx, yPG], [portX, yPG]);
  s.dot(rpgX, yPG);
  s.port(portX, yPG, 'PG', 'out');

  s.wire([gx, ic.y + ic.h + 12], [gx, gnd + 20]).ground(gx, gnd + 20);
  return s;
}
