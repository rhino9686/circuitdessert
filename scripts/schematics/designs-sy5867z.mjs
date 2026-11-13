// Schematic of the Silergy SY5867Z dimming interface converter, redrawn from the "Final Circuit" (Fig. 15) of its datasheet design example.
// The ISET pin is a 2.21 V reference, and both clamp dividers (HCLP and VLOW) are fed from it, so their top ends go to the ISET pin.
import { Sheet } from './lib.mjs';

export function dimmingInterface({ id = 'sy5867z', part = 'SY5867Z' } = {}) {
  const s = new Sheet(810, 450, {
    top: 28,
    id,
    title: `${part} final circuit`,
    desc:
      `Final circuit of the ${part} design example in its datasheet, redrawn. ` +
      `The VIN pin is fed from the supply (VSS) through RVIN, 1 kΩ, with CVIN, 1 nF, to ground. ` +
      `The ISET pin, a 2.21 V reference, feeds two dividers: RHCLP_U 13 kΩ and RHCLP_D 24 kΩ with CHCLP 10 nF set the HCLP pin, and RVLOW_U 33 kΩ and RVLOW_D 20 kΩ with CVLOW 10 nF set the VLOW pin. ` +
      `CFSET, 8.2 nF, from the FSET pin to ground sets the output frequency. ` +
      `The DIMO output goes to the net VDIMO. The DIMI pin goes to the dimming input through RDIMI, 100 Ω, with CDIMI, 100 pF, and a 12 V zener diode DDIMI to ground, ` +
      `and a diode DVIN from the DIMI node to the VIN node clamps DIMI to one diode drop above VIN. The GND pin is grounded.`,
  });

  const ic = { x: 370, y: 120, w: 150, h: 180 };
  const lx = ic.x - 12, rx = ic.x + ic.w + 12;
  const yVin = 150, yHclp = 190, yDimo = 230, yDimi = 270;
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'VIN', y: yVin }, { name: 'HCLP', y: yHclp }, { name: 'DIMO', y: yDimo }, { name: 'DIMI', y: yDimi }],
    right: [{ name: 'GND', y: 150 }, { name: 'ISET', y: 190 }, { name: 'VLOW', y: 230 }, { name: 'FSET', y: 270 }],
  }, { title: part, subtitle: 'U1' });

  // ---- supply: VSS -> RVIN -> VIN node, with CVIN to ground
  const xr = 70;
  s.wire([xr - 12, 50], [xr + 12, 50]).text(xr, 40, 'VSS', { cls: 'sch-net', anchor: 'middle' });
  s.resistor(xr, 50, xr, yVin).label(xr, 100, 'RVIN', '1 kΩ', 'left');
  s.dot(xr, yVin).capacitor(xr, yVin, xr, 240).ground(xr, 240).label(xr, 195, 'CVIN', '1 nF', 'left');
  const xb = 328; // DIMI / DVIN bus
  const xh = 190; // HCLP divider column
  s.hwire(yVin, xr, lx, [xh]).dot(xb, yVin);

  // ---- ISET rail (2.21 V) across the top
  const yRail = 50, xIset = 570, xVl = 670;
  s.wire([xh, yRail], [xVl, yRail]).dot(xIset, yRail).text(430, yRail - 8, '2.21 V from the ISET pin', { cls: 'sch-net', anchor: 'middle' });
  s.wire([rx, 190], [xIset, 190], [xIset, yRail]);

  // ---- HCLP divider with its capacitor
  s.resistor(xh, yRail, xh, yHclp).label(xh, 120, 'RHCLP_U', '13 kΩ', 'right');
  s.dot(xh, yHclp).hwire(yHclp, xh, lx, [xb]);
  s.resistor(xh, yHclp, xh, 290).label(xh, 240, 'RHCLP_D', '24 kΩ', 'right');
  s.ground(xh, 290);
  const xc = 140;
  s.wire([xh, 205], [xc, 205]).capacitor(xc, 205, xc, 275).wire([xc, 275], [xh, 275]).dot(xh, 205).dot(xh, 275).label(xc, 240, 'CHCLP', '10 nF', 'left');

  // ---- DIMI / DIMO side
  s.dot(xb, yVin);
  s.wire([xb, yVin], [xb, 194]).diode(xb, 226, xb, 194).label(xb, 210, 'DVIN', '', 'left');
  s.wire([xb, 226], [xb, 350]).dot(xb, yDimi).wire([xb, yDimi], [lx, yDimi]);
  const xv = 270;
  s.hwire(yDimo, lx, xv, [xb]).wire([xv, yDimo], [xv, 340], [96, 340]).text(90, 344, 'VDIMO', { cls: 'sch-net', anchor: 'end' });
  // protection and the input network
  s.dot(xb, 350).diode(xb, 410, xb, 350, { kind: 'zener' }).ground(xb, 410).label(xb, 380, 'DDIMI', '12 V', 'left');
  s.wire([xb, 350], [380, 350]).dot(380, 350).resistor(380, 350, 470, 350).label(425, 350, 'RDIMI', '100 Ω', 'above');
  s.wire([470, 350], [520, 350]).port(520, 350, 'DIM+', 'out');
  s.capacitor(380, 350, 380, 410).dot(380, 410).label(380, 380, 'CDIMI', '100 pF', 'right');
  s.wire([xb, 410], [520, 410]).port(520, 410, 'DIM−', 'out');
  s.text(582, 384, '0/1–10 V, resistor or PWM', { cls: 'sch-net', anchor: 'start' });

  // ---- right side: GND, VLOW divider, FSET
  s.wire([rx, 150], [548, 150]).ground(548, 150);
  s.wire([rx, 230], [xVl, 230]).dot(xVl, 230);
  s.resistor(xVl, yRail, xVl, 230).label(xVl, 140, 'RVLOW_U', '33 kΩ', 'right');
  s.resistor(xVl, 230, xVl, 330).label(xVl, 280, 'RVLOW_D', '20 kΩ', 'left');
  s.ground(xVl, 330);
  const xl = 730;
  s.wire([xVl, 245], [xl, 245]).capacitor(xl, 245, xl, 315).wire([xl, 315], [xVl, 315]).dot(xVl, 245).dot(xVl, 315).label(xl, 280, 'CVLOW', '10 nF', 'right');
  const xf = 575;
  s.wire([rx, 270], [xf, 270]).capacitor(xf, 270, xf, 320).ground(xf, 320).label(xf, 295, 'CFSET', '8.2 nF', 'left');
  return s;
}
