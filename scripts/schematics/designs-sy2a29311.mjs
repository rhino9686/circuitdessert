// Schematic of the Silergy SY2A29311 four-switch buck-boost converter, redrawn from the "Typical Schematic Diagram"
// (Figure 1) in its datasheet. The datasheet has no bill of materials; the values are the ones printed in Figure 1.
// The datasheet leaves PG unterminated and SYNC/MODE on a "control signal", and so does this drawing.
import { Sheet, refMarkup } from './lib.mjs';

export function buckBoost({ id, part, v = {} }) {
  const val = {
    vin: '4–36 V', vout: '12 V', cin: '22 µF', cout: '3 × 22 µF', l1: '2.2 µH', cbs: '100 nF', cvcc: '2.2 µF', css: '10 nF',
    rsense: '20 mΩ', rfb1: '110 kΩ', rfb2: '10 kΩ', rfs: '100 kΩ', ren1: '10 kΩ', ren2: '1 MΩ', rz: '82 kΩ', cz: '2.2 nF', cp: '10 pF', ...v,
  };
  const s = new Sheet(900, 500, {
    top: 50,
    id,
    title: `${part} reference circuit`,
    desc:
      `Typical schematic of the ${part} buck-boost converter, redrawn from the datasheet. The input VIN (${val.vin}) has a ${val.cin} capacitor CIN to ground and feeds the IN pin. ` +
      `A divider of REN1 (${val.ren1}) from VIN and REN2 (${val.ren2}) to ground drives EN. RFS (${val.rfs}) from FS to ground sets the switching frequency, and SYNC/MODE goes to a control signal. PG is an open-drain output. ` +
      `The inductor L1 (${val.l1}) connects LX1 and LX2, with a ${val.cbs} bootstrap capacitor from BS1 to LX1 (CBS1) and from BS2 to LX2 (CBS2). ` +
      `The OUT pin has COUT (${val.cout}) to ground and connects through the current-sense resistor RSENSE (${val.rsense}) to the output VOUT (${val.vout}). ISP connects to the OUT side of RSENSE and ISN to the VOUT side. ` +
      `The feedback divider is RFB1 (${val.rfb1}) from VOUT to FB and RFB2 (${val.rfb2}) from FB to ground. ` +
      `COMP has CP (${val.cp}) to ground in parallel with RZ (${val.rz}) in series with CZ (${val.cz}). VCC has CVCC (${val.cvcc}) to ground, SS has CSS (${val.css}) to ground, and GND goes to ground.`,
  });

  const ic = { x: 320, y: 150, w: 240, h: 240 };
  const lx = ic.x - 12;
  const rx = ic.x + ic.w + 12;
  const by = ic.y + ic.h + 12; // ends of the bottom pin stubs
  const ty = ic.y - 12; // ends of the top pin stubs
  const yPG = 185, yIN = 215, yEN = 260, yFS = 300, ySYNC = 345; // left pins
  const yISN = 185, yISP = 215, yOUT = 245, yFB = 330, yCOMP = 365; // right pins
  const xBS1 = 350, xLX1 = 400, xLX2 = 480, xBS2 = 530; // top pins
  const xVCC = 370, xGND = 440, xSS = 510; // bottom pins

  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'PG', y: yPG }, { name: 'IN', y: yIN }, { name: 'EN', y: yEN }, { name: 'FS', y: yFS }, { name: 'SYNC/MODE', y: ySYNC }],
    right: [{ name: 'ISN', y: yISN }, { name: 'ISP', y: yISP }, { name: 'OUT', y: yOUT }, { name: 'FB', y: yFB }, { name: 'COMP', y: yCOMP }],
    top: [{ name: 'BS1', x: xBS1 }, { name: 'LX1', x: xLX1 }, { name: 'LX2', x: xLX2 }, { name: 'BS2', x: xBS2 }],
    bottom: [{ name: 'VCC', x: xVCC }, { name: 'GND', x: xGND }, { name: 'SS', x: xSS }],
  }, { title: part });

  // ---- input: VIN flag, CIN, IN
  const cinX = 100, renX = 180, rfsX = 240, syncX = 290;
  s.port(60, yIN, 'VIN', 'in').text(10, yIN - 14, val.vin, { cls: 'sch-net', anchor: 'start' });
  s.wire([60, yIN], [lx, yIN]);
  s.dot(cinX, yIN).capacitor(cinX, yIN, cinX, 280).ground(cinX, 280).label(cinX, 250, 'CIN', val.cin, 'left');

  // ---- enable divider: REN1 from VIN to EN, REN2 from EN to ground
  s.dot(renX, yIN).resistor(renX, yIN, renX, yEN).label(renX, 240, 'REN1', val.ren1, 'left');
  s.dot(renX, yEN).wire([renX, yEN], [lx, yEN]);
  s.resistor(renX, yEN, renX, 320).ground(renX, 320).label(renX, 292, 'REN2', val.ren2, 'left');

  // ---- PG (left unterminated in the datasheet), FS resistor, SYNC/MODE control signal
  s.wire([lx, yPG], [240, yPG]).text(234, yPG + 4, 'PG, open drain', { cls: 'sch-net', anchor: 'end' });
  s.wire([lx, yFS], [rfsX, yFS]).resistor(rfsX, yFS, rfsX, 400).ground(rfsX, 400).label(rfsX, 362, 'RFS', val.rfs, 'left');
  s.wire([lx, ySYNC], [syncX, ySYNC], [syncX, 440]).text(syncX, 458, 'control signal', { cls: 'sch-net', anchor: 'middle' });

  // ---- switch nodes: L1 between LX1 and LX2, bootstrap capacitors from BS1 and BS2
  const top = 100;
  s.wire([xLX1, ty], [xLX1, top]).wire([xLX2, ty], [xLX2, top]);
  s.inductor(xLX1, top, xLX2, top).label((xLX1 + xLX2) / 2, top, 'L1', val.l1, 'above');
  s.capacitor(xBS1, ty, xBS1, top).wire([xBS1, top], [xLX1, top]).dot(xLX1, top).label(xBS1, 122, 'CBS1', val.cbs, 'left');
  s.capacitor(xBS2, ty, xBS2, top).wire([xBS2, top], [xLX2, top]).dot(xLX2, top).label(xBS2, 122, 'CBS2', val.cbs, 'right');

  // ---- output: COUT on OUT, RSENSE from OUT to VOUT, ISP and ISN across it
  const coutX = 630, rsA = 700, rsB = 800, voutX = 850;
  s.wire([rx, yOUT], [rsA, yOUT]).dot(coutX, yOUT).capacitor(coutX, yOUT, coutX, 285).ground(coutX, 285).label(coutX, 268, 'COUT', val.cout, 'right');
  s.resistor(rsA, yOUT, rsB, yOUT);
  s.text((rsA + rsB) / 2, yOUT + 22, refMarkup('RSENSE'), { cls: 'sch-ref', anchor: 'middle', raw: true }).text((rsA + rsB) / 2, yOUT + 35, val.rsense, { anchor: 'middle' });
  s.wire([rx, yISP], [rsA, yISP], [rsA, yOUT]).dot(rsA, yOUT);
  s.wire([rx, yISN], [rsB, yISN], [rsB, yOUT]).dot(rsB, yOUT);
  s.wire([rsB, yOUT], [voutX, yOUT]).port(voutX, yOUT, 'VOUT', 'out').text(voutX + 46, yOUT - 14, val.vout, { cls: 'sch-net', anchor: 'end' });

  // ---- feedback divider on the VOUT side of RSENSE
  s.resistor(rsB, yOUT, rsB, yFB).label(rsB, 292, 'RFB1', val.rfb1, 'right');
  s.dot(rsB, yFB).wire([rx, yFB], [rsB, yFB]);
  s.resistor(rsB, yFB, rsB, 400).ground(rsB, 400).label(rsB, 370, 'RFB2', val.rfb2, 'right');

  // ---- compensation on COMP: CP to ground, and RZ in series with CZ to ground
  const cpX = 610, rzX = 700;
  s.wire([rx, yCOMP], [rzX, yCOMP]).dot(cpX, yCOMP);
  s.capacitor(cpX, yCOMP, cpX, 440).ground(cpX, 440).label(cpX, 405, 'CP', val.cp, 'right');
  s.resistor(rzX, yCOMP, rzX, 420).label(rzX, 395, 'RZ', val.rz, 'right');
  s.capacitor(rzX, 420, rzX, 470).ground(rzX, 470).label(rzX, 447, 'CZ', val.cz, 'right');

  // ---- bottom pins: CVCC, GND, CSS
  s.wire([xVCC, by], [xVCC, 405]).capacitor(xVCC, 405, xVCC, 450).ground(xVCC, 450).label(xVCC, 430, 'CVCC', val.cvcc, 'left');
  s.ground(xGND, by);
  s.wire([xSS, by], [xSS, 405]).capacitor(xSS, 405, xSS, 450).ground(xSS, 450).label(xSS, 430, 'CSS', val.css, 'right');
  return s;
}
