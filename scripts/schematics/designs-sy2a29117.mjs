// Schematic of the Silergy SY2A29117 15 A synchronous boost regulator, redrawn from the "Schematic Diagram"
// (Figure 1) in its datasheet. Figure 1 has no component values and the datasheet has no bill of materials. The
// values drawn are the ones the text states: 10 µF CIN, 100 nF CBS, 1 µF CVCC, at least 10 µF CBD (pin table),
// the 200 kΩ R1 of the feedback example and the 1 µH inductor named on the efficiency graph.
import { Sheet } from './lib.mjs';

export function syncBoostDisconnect({ id, part, v = {} }) {
  const val = { l: '1 µH', cin: '10 µF', cbs: '100 nF', cbd: '≥ 10 µF', cvcc: '1 µF', r1: '200 kΩ', ...v };
  const s = new Sheet(880, 460, {
    top: 18,
    id,
    title: `${part} typical application`,
    desc:
      `Typical application of the ${part} synchronous boost regulator, redrawn from the datasheet. The input VIN has a ${val.cin} capacitor CIN to ground, feeds the SVIN pin directly and connects through the ${val.l} inductor L to the LX pin. ` +
      `A ${val.cbs} bootstrap capacitor CBS connects BS to LX. The BD pin, the boost output before the disconnect switch, has a capacitor CBD (${val.cbd}) to ground. ` +
      `The OUT pin, after the disconnect switch, is the output VOUT, with an output capacitor COUT to ground and the feedback divider R1 (${val.r1}) from OUT to FB and R2 from FB to the FGND pin. ` +
      `EN takes an on/off signal and BAT goes to ground. COMP has RZ in series with CZ to ground, VCC has CVCC (${val.cvcc}) to ground, SS has CSS to ground and ILIM has RILMT to ground. PGND and SGND go to ground.`,
  });

  const ic = { x: 330, y: 110, w: 200, h: 290 };
  const lx = ic.x - 12;
  const rx = ic.x + ic.w + 12;
  const ty = ic.y - 12;
  const by = ic.y + ic.h + 12;
  const yLX = 150, ySVIN = 190, yEN = 225, yBAT = 265, yCOMP = 305, yVCC = 345; // left pins
  const yOUT = 150, yFB = 200, yFGND = 250, ySS = 310, yILIM = 350; // right pins
  const xBS = 380, xBD = 480, xPGND = 400, xSGND = 460; // top and bottom pins

  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'LX', y: yLX }, { name: 'SVIN', y: ySVIN }, { name: 'EN', y: yEN }, { name: 'BAT', y: yBAT }, { name: 'COMP', y: yCOMP }, { name: 'VCC', y: yVCC }],
    right: [{ name: 'OUT', y: yOUT }, { name: 'FB', y: yFB }, { name: 'FGND', y: yFGND }, { name: 'SS', y: ySS }, { name: 'ILIM', y: yILIM }],
    top: [{ name: 'BS', x: xBS }, { name: 'BD', x: xBD }],
    bottom: [{ name: 'PGND', x: xPGND }, { name: 'SGND', x: xSGND }],
  }, { title: part });

  // ---- input: VIN, CIN, SVIN tap, inductor to LX, bootstrap capacitor from BS to LX
  const cinX = 100, svX = 140, lA = 170, lB = 250, bsX = 290;
  s.port(50, yLX, 'VIN', 'in');
  s.wire([50, yLX], [lA, yLX]);
  s.dot(cinX, yLX).capacitor(cinX, yLX, cinX, 192).ground(cinX, 192).label(cinX, 172, 'CIN', val.cin, 'left');
  s.dot(svX, yLX).wire([svX, yLX], [svX, ySVIN], [lx, ySVIN]);
  s.inductor(lA, yLX, lB, yLX).label((lA + lB) / 2, yLX, 'L', val.l, 'above');
  s.wire([lB, yLX], [lx, yLX]).dot(bsX, yLX);
  s.wire([xBS, ty], [xBS, 70]).capacitor(xBS, 70, bsX, 70).wire([bsX, 70], [bsX, yLX]).label((xBS + bsX) / 2, 70, 'CBS', val.cbs, 'above');

  // ---- EN and BAT
  s.port(50, yEN, 'EN', 'in').text(10, yEN - 14, 'on/off', { cls: 'sch-net', anchor: 'start' }).wire([50, yEN], [lx, yEN]);
  s.wire([lx, yBAT], [280, yBAT]).ground(280, yBAT);

  // ---- COMP network and VCC capacitor
  const rzX = 200, cvX = 270;
  s.wire([lx, yCOMP], [rzX, yCOMP]).resistor(rzX, yCOMP, rzX, 365).label(rzX, 335, 'RZ', '', 'left');
  s.capacitor(rzX, 365, rzX, 415).ground(rzX, 415).label(rzX, 392, 'CZ', '', 'left');
  s.wire([lx, yVCC], [cvX, yVCC]).capacitor(cvX, yVCC, cvX, 395).ground(cvX, 395).label(cvX, 372, 'CVCC', val.cvcc, 'left');

  // ---- grounds
  s.wire([xPGND, by], [xPGND, 425], [xSGND, 425], [xSGND, by]).ground(430, 425);

  // ---- boost output BD with CBD, and the disconnected output OUT
  const cbdX = 620, r1X = 650, coutX = 730, voutX = 790;
  s.wire([xBD, ty], [xBD, 60], [cbdX, 60]).capacitor(cbdX, 60, cbdX, 110).ground(cbdX, 110).label(cbdX, 85, 'CBD', val.cbd, 'right');
  s.wire([rx, yOUT], [voutX, yOUT]).port(voutX, yOUT, 'VOUT', 'out');
  s.dot(r1X, yOUT).resistor(r1X, yOUT, r1X, yFB).label(r1X, 175, 'R1', val.r1, 'right');
  s.dot(r1X, yFB).wire([rx, yFB], [r1X, yFB]);
  s.resistor(r1X, yFB, r1X, yFGND).label(r1X, 225, 'R2', '', 'right').wire([r1X, yFGND], [rx, yFGND]);
  s.dot(coutX, yOUT).capacitor(coutX, yOUT, coutX, 205).ground(coutX, 205).label(coutX, 180, 'COUT', '', 'right');

  // ---- soft start and current-limit resistor
  const rlX = 620, cssX = 700;
  s.wire([rx, ySS], [cssX, ySS]).capacitor(cssX, ySS, cssX, 365).ground(cssX, 365).label(cssX, 338, 'CSS', '', 'right');
  s.wire([rx, yILIM], [rlX, yILIM]).resistor(rlX, yILIM, rlX, 415).ground(rlX, 415).label(rlX, 385, 'RILMT', '', 'left');
  return s;
}
