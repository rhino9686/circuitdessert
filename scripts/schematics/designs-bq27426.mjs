// Schematic of the TI BQ27426 fuel gauge, redrawn from Figure 8-1 of its datasheet (SLUSC91G),
// "Typical Application with High-Side Current Sense Resistor".
// Netlist read from the rendered page 15 (PDF page 15):
//   EXT_VCC -> JP1 -> R4 10.0k -> SDA     EXT_VCC -> JP2 -> R5 10.0k -> SCL     EXT_VCC -> R3 5.1k -> GPOUT
//   VDD -> R2 1.8 Meg -> BIN              VDD -> C3 0.47 uF and C1 2.2 uF -> PGND
//   BAT -> Pack+ (C2 1 uF to PGND)        SRP -> Pack+ side of R1 0.01        SRN -> load side of R1
//   Pack- = PGND = VSS = Load-
// The figure puts BAT at the top of the left side; here the pins are regrouped so that BAT, the sense pins and
// the supply path sit at the bottom and nothing has to cross the three host lines. The header connectors J1 to J7,
// the test points and the jumpers JP1 and JP2 (in series with R4 and R5) are not drawn.
import { Sheet } from './lib.mjs';

export function fuelGaugeHighSide({ id, part = 'BQ27426' }) {
  const s = new Sheet(900, 560, {
    id,
    top: 30,
    title: `${part} fuel gauge with a high-side sense resistor`,
    desc:
      `Typical application of the ${part} single-cell fuel gauge redrawn from the datasheet's Figure 8-1. ` +
      'The host supply EXT_VCC feeds three pull-up resistors: 10 kilohm to SDA, 10 kilohm to SCL and 5.1 kilohm to GPOUT. ' +
      'The BIN pin goes to the battery pack thermistor and also has a 1.8 megohm resistor to the 1.8 volt VDD output. ' +
      'VDD is decoupled with 0.47 and 2.2 microfarad capacitors. The BAT pin connects to the pack positive terminal, with a 1 microfarad capacitor to ground. ' +
      'A 10 milliohm sense resistor sits in the positive path between the pack and the load: SRP connects on the pack side and SRN on the load side. VSS and the pack negative terminal are ground.',
  });

  // IC body. Left pins top to bottom: SCL, SDA, GPOUT, BIN, BAT. Right: VDD, SRP, SRN. Bottom: VSS.
  const ic = { x: 360, y: 165, w: 160, h: 190 };
  const L = { scl: 205, sda: 230, gpout: 260, bin: 290, bat: 330 };
  const R = { vdd: 205, srp: 290, srn: 315 };
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [
      { name: 'SCL', y: L.scl },
      { name: 'SDA', y: L.sda },
      { name: 'GPOUT', y: L.gpout },
      { name: 'BIN', y: L.bin },
      { name: 'BAT', y: L.bat },
    ],
    right: [
      { name: 'VDD', y: R.vdd },
      { name: 'SRP', y: R.srp },
      { name: 'SRN', y: R.srn },
    ],
    bottom: [{ name: 'VSS', x: 440 }],
  });
  s.text(ic.x + ic.w / 2, ic.y + 22, part, { cls: 'sch-ictitle', anchor: 'middle' });
  const px = ic.x - 12; // left pin ends
  const qx = ic.x + ic.w + 12; // right pin ends

  // --- host supply and the three pull-ups -----------------------------------------------------------------------
  const yTop = 70;
  s.add('<circle class="sch-w" cx="160" cy="70" r="3"/>');
  s.wire([163, yTop], [320, yTop]);
  s.text(160, yTop - 12, 'EXT_VCC (host I/O supply)', { cls: 'sch-net', anchor: 'start' });
  const xr = { scl: 200, sda: 260, gpout: 320 };
  s.dot(xr.sda, yTop);
  // R5 to SCL, R4 to SDA, R3 to GPOUT
  s.wire([xr.scl, yTop], [xr.scl, yTop + 20]).resistor(xr.scl, yTop + 20, xr.scl, L.scl - 20).wire([xr.scl, L.scl - 20], [xr.scl, L.scl]);
  s.wire([xr.sda, yTop], [xr.sda, yTop + 20]).resistor(xr.sda, yTop + 20, xr.sda, L.sda - 20).wire([xr.sda, L.sda - 20], [xr.sda, L.sda]);
  s.wire([xr.gpout, yTop], [xr.gpout, yTop + 20]).resistor(xr.gpout, yTop + 20, xr.gpout, L.gpout - 20).wire([xr.gpout, L.gpout - 20], [xr.gpout, L.gpout]);
  s.label(xr.scl, (yTop + L.scl) / 2, 'R5', '10 kΩ', 'left');
  s.label(xr.sda, (yTop + L.sda) / 2, 'R4', '10 kΩ', 'right');
  s.label(xr.gpout, 118, 'R3', '5.1 kΩ', 'right');
  // host lines run left to flags; the pull-ups of the lines below cross the ones above (hops)
  s.hwire(L.scl, 130, px, [xr.sda, xr.gpout]);
  s.hwire(L.sda, 130, px, [xr.gpout]);
  s.hwire(L.gpout, 130, px);
  s.dot(xr.scl, L.scl).dot(xr.sda, L.sda).dot(xr.gpout, L.gpout);
  s.port(130, L.scl, 'SCL', 'in');
  s.port(130, L.sda, 'SDA', 'in');
  s.port(130, L.gpout, 'GPOUT', 'in');

  // --- BIN: pack thermistor, with the pull-up to VDD drawn on the right --------------------------------------------
  s.wire([130, L.bin], [px, L.bin]);
  s.port(130, L.bin, 'BIN', 'in');

  // --- supply rails ------------------------------------------------------------------------------------------------
  const yP = 430; // pack positive
  const yG = 490; // ground, pack negative
  s.port(100, yP, 'Pack+', 'in');
  s.wire([100, yP], [660, yP]);
  s.port(100, yG, 'Pack–', 'in');
  s.wire([100, yG], [820, yG]);
  s.dot(400, yG).ground(400, yG);
  s.port(820, yG, 'Load–', 'out');

  // BAT to the pack, with C2
  s.wire([px, L.bat], [300, L.bat], [300, yP]).dot(300, yP);
  s.capacitor(300, yP, 300, yG);
  s.dot(300, yG);
  s.label(300, (yP + yG) / 2, 'C2', '1 µF', 'right');

  // VSS to ground
  s.wire([440, ic.y + ic.h + 12], [440, ic.y + ic.h + 18]).ground(440, ic.y + ic.h + 18);

  // --- VDD: decoupling and the pull-up resistor to BIN ----------------------------------------------------------------
  const x3 = 600, x1 = 670, x2 = 760;
  s.wire([qx, R.vdd], [x2, R.vdd]);
  s.dot(x3, R.vdd).dot(x1, R.vdd);
  s.capacitor(x3, R.vdd, x3, 255).ground(x3, 255);
  s.capacitor(x1, R.vdd, x1, 255).ground(x1, 255);
  s.label(x3, 230, 'C3', '0.47 µF', 'left');
  s.label(x1, 230, 'C1', '2.2 µF', 'right');
  s.resistor(x2, R.vdd, x2, 275);
  s.label(x2, 240, 'R2', '1.8 MΩ', 'right');
  s.port(x2, 275, 'BIN', 'out');
  s.text(x2 - 8, R.vdd - 10, 'VDD (1.8 V)', { cls: 'sch-net', anchor: 'end' });

  // --- sense resistor in the positive path: SRP on the pack side, SRN on the load side ------------------------------------
  const xs = 620, xn = 800;
  s.wire([qx, R.srp], [xs, R.srp], [xs, yP]).dot(xs, yP);
  s.hwire(R.srn, qx, xn, [xs]);
  s.wire([xn, R.srn], [xn, yP]);
  s.resistor(660, yP, 760, yP);
  s.wire([760, yP], [xn, yP]).dot(xn, yP);
  s.label(710, yP, 'R1', '10 mΩ', 'above');
  s.wire([xn, yP], [820, yP]);
  s.port(820, yP, 'Load+', 'out');

  // --- notes -------------------------------------------------------------------------------------------------------------
  s.text(100, 530, 'Not drawn: header connectors, test points, and jumpers JP1 and JP2 in series with R4 and R5.', { cls: 'sch-net', anchor: 'start' });
  s.text(100, 546, 'Pins regrouped from the figure. The figure prints R1 as 0.01; the text says 10 mΩ, 1%.', { cls: 'sch-net', anchor: 'start' });
  return s;
}
