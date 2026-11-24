// Schematics for the second batch of part pages: DDR termination regulators (TPS51200, RT2568, TPS51206),
// a low-dropout regulator with a bypass pin (SPX3819), a linear battery charger (BQ25171-Q1), an 8 A buck converter
// (TPS51393/TPS51395) and a user-configurable LDO (TPS7A7200-EP). Each datasheet figure is redrawn; the part pages say
// which values are the datasheet's.
import { Sheet } from './lib.mjs';

/** Ground at the bottom of a vertical capacitor hanging from a rail at (x, y), `len` units long. */
function capDown(s, x, y, len, ref, val, side = 'right') {
  s.dot(x, y).capacitor(x, y, x, y + len).ground(x, y + len).label(x, y + len / 2, ref, val, side);
}
/** Capacitor from a rail at (x, y) up to a ground symbol above it. */
function capUp(s, x, y, ref, val, side = 'left') {
  s.dot(x, y).capacitor(x, y, x, y - 40).groundUp(x, y - 40).label(x, y - 20, ref, val, side);
}

/**
 * TPS51200 Figure 7-1: 3.3 V input, DDR3 (VDDQ = 1.5 V, VTT = 0.75 V).
 */
export function ddrTps51200({ id, part, desc: descOverride }) {
  const s = new Sheet(890, 570, {
    top: 50,
    id,
    title: `${part} typical application circuit`,
    desc: descOverride ??
      `Typical application circuit of the ${part} DDR termination regulator, redrawn from the datasheet's Figure 7-1 for a 3.3 V input and DDR3 memory. ` +
      `The VIN pin is fed from the 3.3 V rail with a 4.7 µF capacitor C6 to ground, and the same rail pulls up the open-drain PGOOD pin through a 100 kΩ resistor R3. ` +
      `The VDDQ rail (1.5 V) reaches REFIN through R1 (10 kΩ), with R2 (10 kΩ) and C4 (1000 pF) from REFIN to ground, and also feeds VLDOIN, which has two 10 µF capacitors C7 and C8 to ground. ` +
      `The enable pin EN is driven by the sleep signal. VO is the 0.75 V termination output with three 10 µF capacitors C1 to C3 to ground, and VOSNS is wired to VO. ` +
      `REFOUT is the buffered reference output with a 0.1 µF capacitor C5 to ground. PGND and GND are tied to ground.`,
  });
  const ic = { x: 380, y: 100, w: 170, h: 360 };
  const lx = ic.x - 12, rx = ic.x + ic.w + 12;
  const yVIN = 130, yREFIN = 200, yVLD = 330, yEN = 430;
  const yPG = 130, yVO = 230, ySNS = 265, yREF = 380;
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'VIN', y: yVIN }, { name: 'REFIN', y: yREFIN }, { name: 'VLDOIN', y: yVLD }, { name: 'EN', y: yEN }],
    right: [{ name: 'PGOOD', y: yPG }, { name: 'VO', y: yVO }, { name: 'VOSNS', y: ySNS }, { name: 'REFOUT', y: yREF }],
    bottom: [{ name: 'PGND', x: 440 }, { name: 'GND', x: 490 }],
  }, { title: part });

  // VIN with C6 and the PGOOD pull-up tap
  s.port(60, yVIN, 'VIN', 'in');
  s.wire([60, yVIN], [lx, yVIN]);
  capUp(s, 180, yVIN, 'C6', '4.7 µF');
  s.dot(300, yVIN).wire([300, yVIN], [300, 70], [640, 70]);

  // REFIN divider
  s.port(60, yREFIN, 'VDDQ', 'in');
  s.wire([60, yREFIN], [110, yREFIN]);
  s.resistor(110, yREFIN, 190, yREFIN).label(150, yREFIN, 'R1', '10 kΩ', 'above');
  s.wire([190, yREFIN], [lx, yREFIN]);
  s.dot(240, yREFIN).resistor(240, yREFIN, 240, yREFIN + 60).ground(240, yREFIN + 60).label(240, yREFIN + 30, 'R2', '10 kΩ', 'left');
  capDown(s, 300, yREFIN, 60, 'C4', '1000 pF');

  // VLDOIN
  s.port(60, yVLD, 'VDDQ', 'in');
  s.wire([60, yVLD], [lx, yVLD]);
  capDown(s, 200, yVLD, 60, 'C7', '10 µF', 'left');
  capDown(s, 270, yVLD, 60, 'C8', '10 µF');

  // EN
  s.port(60, yEN, 'EN', 'in');
  s.wire([60, yEN], [lx, yEN]);

  // PGOOD with R3 to the VIN tap
  s.wire([rx, yPG], [830, yPG]);
  s.port(830, yPG, 'PG', 'out');
  s.dot(640, yPG).resistor(640, 70, 640, yPG).label(640, 100, 'R3', '100 kΩ', 'right');

  // VO with C1..C3, VOSNS tied to VO
  s.wire([rx, yVO], [830, yVO]);
  s.port(830, yVO, 'VTT', 'out');
  s.wire([rx, ySNS], [590, ySNS], [590, yVO]).dot(590, yVO);
  capDown(s, 660, yVO, 60, 'C1', '10 µF', 'left');
  capDown(s, 720, yVO, 60, 'C2', '10 µF', 'left');
  capDown(s, 780, yVO, 60, 'C3', '10 µF', 'left');

  // REFOUT
  s.wire([rx, yREF], [830, yREF]);
  s.port(830, yREF, 'VREF', 'out');
  capDown(s, 660, yREF, 60, 'C5', '0.1 µF');

  // PGND and GND to ground
  const gy = ic.y + ic.h + 12;
  s.wire([440, gy], [490, gy]).dot(465, gy).ground(465, gy);
  return s;
}

/**
 * RT2568 typical application circuit (page 7 of the datasheet).
 */
export function ddrRt2568({ id, part }) {
  const s = new Sheet(890, 570, {
    top: 50,
    id,
    title: `${part} typical application circuit`,
    desc:
      `Typical application circuit of the ${part} DDR termination regulator, redrawn from the datasheet. ` +
      `The VIN pin is the termination supply, with two 10 µF capacitors C1 and C2 to ground; a 10 kΩ resistor R1 runs from that supply to REFIN, which has a 10 kΩ resistor R2 and a 1 nF capacitor C3 to ground. ` +
      `The enable pin EN is driven by a chip-enable signal. The VCNTL pin is the control supply with a 4.7 µF capacitor C5 to ground, and a 100 kΩ pull-up R3 from VCNTL to the open-drain PGOOD pin. ` +
      `VOUT is the termination output with three 10 µF capacitors C6 to C8 to ground, and SENSE is wired to VOUT. REFOUT is the buffered reference output with a 0.1 µF capacitor C4 to ground. PGND and GND are tied to ground.`,
  });
  const ic = { x: 380, y: 100, w: 170, h: 370 };
  const lx = ic.x - 12, rx = ic.x + ic.w + 12;
  const yVIN = 130, yREFIN = 200, yEN = 330;
  const yVC = 130, yPG = 190, yVO = 260, ySNS = 300, yREF = 390;
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'VIN', y: yVIN }, { name: 'REFIN', y: yREFIN }, { name: 'EN', y: yEN }],
    right: [{ name: 'VCNTL', y: yVC }, { name: 'PGOOD', y: yPG }, { name: 'VOUT', y: yVO }, { name: 'SENSE', y: ySNS }, { name: 'REFOUT', y: yREF }],
    bottom: [{ name: 'PGND', x: 440 }, { name: 'GND', x: 490 }],
  }, { title: part });

  s.port(60, yVIN, 'VIN', 'in');
  s.wire([60, yVIN], [lx, yVIN]);
  capUp(s, 130, yVIN, 'C1', '10 µF');
  capUp(s, 190, yVIN, 'C2', '10 µF', 'right');
  s.dot(300, yVIN).resistor(300, yVIN, 300, yREFIN).label(300, 165, 'R1', '10 kΩ', 'right');

  s.wire([210, yREFIN], [lx, yREFIN]);
  s.dot(300, yREFIN);
  capDown(s, 210, yREFIN, 60, 'C3', '1 nF', 'left');
  s.dot(255, yREFIN).resistor(255, yREFIN, 255, yREFIN + 60).ground(255, yREFIN + 60).label(255, yREFIN + 30, 'R2', '10 kΩ', 'right');

  s.port(60, yEN, 'EN', 'in');
  s.wire([60, yEN], [lx, yEN]);

  s.wire([rx, yVC], [830, yVC]);
  s.port(830, yVC, 'VCC', 'out');
  capUp(s, 700, yVC, 'C5', '4.7 µF', 'right');
  s.dot(640, yVC).resistor(640, yVC, 640, yPG).label(640, 160, 'R3', '100 kΩ', 'left');
  s.wire([rx, yPG], [830, yPG]).dot(640, yPG);
  s.port(830, yPG, 'PG', 'out');

  s.wire([rx, yVO], [830, yVO]);
  s.port(830, yVO, 'VOUT', 'out');
  s.wire([rx, ySNS], [590, ySNS], [590, yVO]).dot(590, yVO);
  capDown(s, 660, yVO, 60, 'C6', '10 µF', 'left');
  capDown(s, 720, yVO, 60, 'C7', '10 µF', 'left');
  capDown(s, 780, yVO, 60, 'C8', '10 µF', 'left');

  s.wire([rx, yREF], [830, yREF]);
  s.port(830, yREF, 'VREF', 'out');
  capDown(s, 660, yREF, 60, 'C4', '0.1 µF');

  const gy = ic.y + ic.h + 12;
  s.wire([440, gy], [490, gy]).dot(465, gy).ground(465, gy);
  return s;
}

/**
 * TPS51206 Figure 24: VLDOIN = VDDQ = 1.5 V.
 */
export function ddrTps51206({ id, part }) {
  const s = new Sheet(890, 560, {
    top: 70,
    id,
    title: `${part} typical application circuit`,
    desc:
      `Typical application circuit of the ${part} DDR termination regulator with VLDOIN tied to VDDQ, redrawn from the datasheet's Figure 24. ` +
      `The VDDQ rail feeds both VLDOIN and VDDQSNS, with a 10 µF capacitor C1 to ground. The S3 and S5 pins take the sleep-state signals, and the VDD pin takes a 5 V or 3.3 V supply with a 0.1 µF capacitor C2 to ground. ` +
      `VTT is the termination output with a 10 µF capacitor C3 to ground, and VTTSNS is wired to VTT. VTTREF is the buffered reference output with a 0.22 µF capacitor C4 to ground. PGND and GND, with the thermal pad, are tied to ground.`,
  });
  const ic = { x: 380, y: 100, w: 170, h: 360 };
  const lx = ic.x - 12, rx = ic.x + ic.w + 12;
  const yQ = 130, yLD = 190, yS3 = 300, yS5 = 350, yVDD = 410;
  const yVTT = 130, ySNS = 180, yREF = 330;
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'VDDQSNS', y: yQ }, { name: 'VLDOIN', y: yLD }, { name: 'S3', y: yS3 }, { name: 'S5', y: yS5 }, { name: 'VDD', y: yVDD }],
    right: [{ name: 'VTT', y: yVTT }, { name: 'VTTSNS', y: ySNS }, { name: 'VTTREF', y: yREF }],
    bottom: [{ name: 'PGND', x: 440 }, { name: 'GND', x: 490 }],
  }, { title: part });

  s.port(60, yLD, 'VDDQ', 'in');
  s.wire([60, yLD], [lx, yLD]);
  s.dot(300, yLD).wire([300, yLD], [300, yQ], [lx, yQ]);
  capDown(s, 200, yLD, 60, 'C1', '10 µF');

  s.port(60, yS3, 'S3', 'in');
  s.wire([60, yS3], [lx, yS3]);
  s.port(60, yS5, 'S5', 'in');
  s.wire([60, yS5], [lx, yS5]);
  s.port(60, yVDD, 'VDD', 'in');
  s.wire([60, yVDD], [lx, yVDD]);
  capDown(s, 200, yVDD, 50, 'C2', '0.1 µF', 'left');

  s.wire([rx, yVTT], [830, yVTT]);
  s.port(830, yVTT, 'VTT', 'out');
  s.wire([rx, ySNS], [590, ySNS], [590, yVTT]).dot(590, yVTT);
  capDown(s, 680, yVTT, 60, 'C3', '10 µF', 'left');

  s.wire([rx, yREF], [830, yREF]);
  s.port(830, yREF, 'VREF', 'out');
  capDown(s, 680, yREF, 60, 'C4', '0.22 µF', 'left');

  const gy = ic.y + ic.h + 12;
  s.wire([440, gy], [490, gy]).dot(465, gy).ground(465, gy);
  return s;
}

/**
 * SPX3819 Figure 18: standard application with an optional bypass capacitor on BYP.
 */
export function ldoBypass({ id, part }) {
  const s = new Sheet(800, 360, {
    top: 70,
    id,
    title: `${part} typical application circuit`,
    desc:
      `Standard application circuit of the ${part} 500 mA low-noise LDO, redrawn from the datasheet's Figure 18. ` +
      `The input VIN feeds the VIN pin with an input capacitor CIN to ground. The EN pin is driven by an enable signal and can be tied to VIN. ` +
      `The VOUT pin is the output with an output capacitor COUT to ground, and the optional bypass capacitor CBYP goes from the BYP pin to ground. The GND pin goes to ground.`,
  });
  const ic = { x: 290, y: 100, w: 150, h: 150 };
  const lx = ic.x - 12, rx = ic.x + ic.w + 12;
  const yIN = 140, yEN = 210, yOUT = 140, yBYP = 210;
  const gx = 365, gndY = 300;
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'VIN', y: yIN }, { name: 'EN', y: yEN }],
    right: [{ name: 'VOUT', y: yOUT }, { name: 'BYP', y: yBYP }],
    bottom: [{ name: 'GND', x: gx }],
  }, { title: part });
  s.port(60, yIN, 'VIN', 'in');
  s.wire([60, yIN], [lx, yIN]);
  capDown(s, 130, yIN, gndY - yIN, 'CIN', '', 'left');
  s.port(60, yEN, 'EN', 'in');
  s.hwire(yEN, 60, lx, [130]);
  s.wire([rx, yOUT], [720, yOUT]);
  s.port(720, yOUT, 'VOUT', 'out');
  capDown(s, 600, yOUT, gndY - yOUT, 'COUT', '', 'right');
  // optional CBYP, drawn dashed
  s.wire([rx, yBYP], [510, yBYP]);
  s.add(`<path class="sch-w" stroke-dasharray="4 3" d="M510 ${yBYP} L510 240"/>`);
  s.capacitor(510, 240, 510, gndY).ground(510, gndY).label(510, 270, 'CBYP', '(optional)', 'left');
  s.wire([gx, ic.y + ic.h + 12], [gx, gndY + 20]).ground(gx, gndY + 20);
  return s;
}

/**
 * BQ25171-Q1 Figure 8-1: 1s LiFePO4 charging at 500 mA from 5 V.
 */
export function chargerBq25171({ id, part }) {
  const s = new Sheet(880, 500, {
    top: 50,
    id,
    title: `${part} typical application circuit`,
    desc:
      `Typical application circuit of the ${part} standalone linear battery charger, redrawn from the datasheet's Figure 8-1 for single-cell LiFePO4 charging at 500 mA from a 5 V input. ` +
      `The input VIN feeds the IN pin with a 1 µF capacitor CIN to ground. Three pull-down resistors set the charger: 100 kΩ from CHM_TMR to ground (5 hour safety timer), 82 kΩ from VSET to ground (3.6 V charge voltage) and 600 Ω from ISET to ground (500 mA). ` +
      `The OUT pin is the battery and system rail with a 1 µF capacitor COUT to ground. The open-drain STAT1 and STAT2 pins each drive an LED, with a 10 kΩ resistor from the LED to the OUT rail. ` +
      `A 10 kΩ NTC thermistor goes from the TS pin to ground, and the active-low CE pin is driven by an open-drain host output. The GND pin goes to ground.`,
  });
  const ic = { x: 330, y: 100, w: 190, h: 320 };
  const lx = ic.x - 12, rx = ic.x + ic.w + 12;
  const yIN = 130, yTMR = 190, yVSET = 250, yISET = 310, yGND = 370;
  const yOUT = 130, yS1 = 190, yS2 = 250, yTS = 310, yCE = 370;
  const busY = 410;
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'IN', y: yIN }, { name: 'CHM_TMR', y: yTMR }, { name: 'VSET', y: yVSET }, { name: 'ISET', y: yISET }, { name: 'GND', y: yGND }],
    right: [{ name: 'OUT', y: yOUT }, { name: 'STAT1', y: yS1 }, { name: 'STAT2', y: yS2 }, { name: 'TS', y: yTS }, { name: '/CE', y: yCE }],
  }, { title: part });

  s.port(60, yIN, 'VIN', 'in');
  s.wire([60, yIN], [lx, yIN]);
  capUp(s, 150, yIN, 'CIN', '1 µF');

  // pull-down resistors on CHM_TMR, VSET and ISET
  const set = [[150, yTMR, 'RTMR', '100 kΩ'], [210, yVSET, 'RVSET', '82 kΩ'], [270, yISET, 'RISET', '600 Ω']];
  for (const [x, y, ref, val] of set) {
    s.wire([x, y], [lx, y]);
    s.resistor(x, y, x, busY).label(x, (y + busY) / 2, ref, val, 'left');
  }
  s.dot(210, busY).dot(270, busY).dot(300, busY);
  s.wire([150, busY], [300, busY]).wire([lx, yGND], [300, yGND], [300, busY]);
  s.ground(300, busY);
  // right side
  s.wire([rx, yOUT], [830, yOUT]);
  s.port(830, yOUT, 'OUT', 'out');
  capUp(s, 570, yOUT, 'COUT', '1 µF', 'right');
  s.dot(740, yOUT);
  for (const [y, ref] of [[yS1, 'RS1'], [yS2, 'RS2']]) {
    s.wire([rx, y], [590, y]);
    s.diode(650, y, 590, y, { kind: 'led', side: -1 });
    s.resistor(650, y, 740, y).label(695, y, ref, '10 kΩ', 'above');
  }
  s.wire([740, yOUT], [740, yS2]).dot(740, yS1);
  s.wire([rx, yTS], [640, yTS]);
  s.resistor(640, yTS, 640, yTS + 60).ground(640, yTS + 60).label(640, yTS + 30, 'RNTC', '10 kΩ NTC', 'right');
  s.wire([rx, yCE], [700, yCE]);
  s.text(712, yCE + 4, '/CE from host', { cls: 'sch-net' });
  return s;
}

/**
 * TPS51393/TPS51395 Figure 11: 4.5 V to 24 V in, 5.1 V out at 8 A.
 */
export function buckTps5139x({ id, part, icTitle = 'TPS5139x' }) {
  const s = new Sheet(1030, 570, {
    top: 50,
    id,
    title: `${part} typical application circuit`,
    desc:
      `Typical application circuit of the ${part} 8 A synchronous buck converter, redrawn from the datasheet's Figure 11 (the TPS51395, 5.1 V output). ` +
      `The input rail feeds the VIN pins, with two 22 µF capacitors C3 and C4 and a 0.1 µF capacitor C5 to ground. The EN and ENLDO pins are driven by enable signals. A 1 µF capacitor C1 sits on the VCC pin. ` +
      `The SW pin drives a 1.5 µH inductor L1 to the output, and a bootstrap capacitor C12 (0.1 µF) with a 0 Ω resistor R2 in series connects BOOT to SW. ` +
      `The VOUT pin senses the output, which has four 22 µF capacitors (C8 to C11) and a 0.1 µF capacitor C6 to ground. The FB pin connects to the output through a 240 kΩ resistor R13 in parallel with a 470 pF capacitor C13. ` +
      `The open-drain PGOOD pin has a 100 kΩ pull-up R1 to VCC. The 100 mA LDO output has a 4.7 µF capacitor C16 to ground, and PGND is tied to ground.`,
  });
  const ic = { x: 330, y: 100, w: 190, h: 400 };
  const lx = ic.x - 12, rx = ic.x + ic.w + 12;
  const yVIN = 130, yEN = 260, yENL = 310, yVCC = 380;
  const yBOOT = 130, ySW = 180, yVO = 250, yFB = 310, yPG = 370, yLDO = 430;
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'VIN', y: yVIN }, { name: 'EN', y: yEN }, { name: 'ENLDO', y: yENL }, { name: 'VCC', y: yVCC }],
    right: [{ name: 'BOOT', y: yBOOT }, { name: 'SW', y: ySW }, { name: 'VOUT', y: yVO }, { name: 'FB', y: yFB }, { name: 'PGOOD', y: yPG }, { name: 'LDO', y: yLDO }],
    bottom: [{ name: 'PGND', x: 430 }],
  }, { title: icTitle });

  s.port(60, yVIN, 'VIN', 'in');
  s.wire([60, yVIN], [lx, yVIN]);
  capDown(s, 120, yVIN, 60, 'C3', '22 µF', 'left');
  capDown(s, 190, yVIN, 60, 'C4', '22 µF', 'left');
  capDown(s, 260, yVIN, 60, 'C5', '0.1 µF', 'left');
  s.port(60, yEN, 'EN', 'in');
  s.wire([60, yEN], [lx, yEN]);
  s.port(60, yENL, 'ENLDO', 'in');
  s.wire([60, yENL], [lx, yENL]);
  s.wire([200, yVCC], [lx, yVCC]);
  capDown(s, 200, yVCC, 60, 'C1', '1 µF', 'left');

  // BOOT / SW / inductor
  s.wire([rx, yBOOT], [550, yBOOT]);
  s.resistor(550, yBOOT, 610, yBOOT).label(580, yBOOT, 'R2', '0 Ω', 'above');
  s.wire([610, yBOOT], [630, yBOOT]);
  s.capacitor(630, yBOOT, 630, ySW).label(630, 155, 'C12', '0.1 µF', 'right');
  s.wire([rx, ySW], [650, ySW]).dot(630, ySW);
  s.inductor(650, ySW, 760, ySW);
  s.label(705, ySW, 'L1', '1.5 µH', 'above');
  s.wire([760, ySW], [960, ySW]);
  s.port(960, ySW, 'VOUT', 'out');
  s.dot(770, ySW).wire([770, ySW], [770, yVO]);
  s.wire([760, ySW], [770, ySW]);
  capDown(s, 810, ySW, 60, 'C8–C11', '4×22 µF', 'right');
  capDown(s, 890, ySW, 60, 'C6', '0.1 µF', 'right');

  // VOUT sense and feedback network
  s.wire([rx, yVO], [770, yVO]).dot(700, yVO).dot(740, yVO);
  s.resistor(700, yVO, 700, yFB).label(700, 280, 'R13', '240 kΩ', 'left');
  s.capacitor(740, yVO, 740, yFB).label(740, 280, 'C13', '470 pF', 'right');
  s.wire([rx, yFB], [740, yFB]).dot(700, yFB);

  // PGOOD pull-up to VCC
  s.wire([rx, yPG], [960, yPG]);
  s.port(960, yPG, 'PG', 'out');
  s.dot(850, yPG).resistor(850, yPG, 850, 320).label(850, 345, 'R1', '100 kΩ', 'right');
  s.wire([850, 320], [850, 300]);
  s.text(850, 292, 'VCC', { cls: 'sch-net', anchor: 'middle' });

  // LDO output
  s.wire([rx, yLDO], [960, yLDO]);
  s.port(960, yLDO, 'LDO', 'out');
  capDown(s, 700, yLDO, 60, 'C16', '4.7 µF', 'right');

  s.wire([430, ic.y + ic.h + 12], [430, ic.y + ic.h + 28]).ground(430, ic.y + ic.h + 28);
  return s;
}

/**
 * TPS7A7200-EP typical application: 1.5 V in, 1.2 V out with the 100 mV, 200 mV and 400 mV pins grounded.
 */
export function ldoUserSet({ id, part }) {
  const s = new Sheet(900, 480, {
    top: 50,
    id,
    title: `${part} typical application circuit`,
    desc:
      `Typical application circuit of the ${part} 2 A fast-transient LDO, redrawn from the datasheet's front-page typical application for a 1.5 V input and a 1.2 V output. ` +
      `The input feeds the IN pin with an input capacitor CIN to ground; the EN pin takes the enable signal, and an optional soft-start capacitor CSS goes from the SS pin to ground. ` +
      `The output voltage is set by tying pins to ground: the 100 mV, 200 mV and 400 mV pins are grounded, which adds up to 0.5 V plus 0.7 V, or 1.2 V, and the 50 mV, 800 mV and 1.6 V pins are left open. ` +
      `OUT is the output with an output capacitor COUT to ground. SNS is wired to OUT, and a feed-forward capacitor CFF goes from FB to OUT. PG is the open-drain power-good output. GND goes to ground.`,
  });
  const ic = { x: 300, y: 100, w: 330, h: 260 };
  const lx = ic.x - 12, rx = ic.x + ic.w + 12;
  const yIN = 130, yEN = 200, ySS = 270;
  const yOUT = 130, ySNS = 190, yFB = 250, yPG = 320;
  const pinX = [330, 375, 420, 465, 510, 555];
  const names = ['50mV', '100mV', '200mV', '400mV', '800mV', '1.6V'];
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'IN', y: yIN }, { name: 'EN', y: yEN }, { name: 'SS', y: ySS }],
    right: [{ name: 'OUT', y: yOUT }, { name: 'SNS', y: ySNS }, { name: 'FB', y: yFB }, { name: 'PG', y: yPG }],
    bottom: [...pinX.map((x, i) => ({ name: names[i], x })), { name: 'GND', x: 600 }],
  }, { title: part });

  s.port(60, yIN, 'VIN', 'in');
  s.wire([60, yIN], [lx, yIN]);
  capUp(s, 150, yIN, 'CIN', '', 'left');
  s.port(60, yEN, 'EN', 'in');
  s.wire([60, yEN], [lx, yEN]);
  s.wire([200, ySS], [lx, ySS]);
  s.add(`<path class="sch-w" stroke-dasharray="4 3" d="M200 ${ySS} L200 ${ySS + 20}"/>`);
  s.capacitor(200, ySS + 20, 200, ySS + 70).ground(200, ySS + 70).label(200, ySS + 45, 'CSS', '(optional)', 'left');

  s.wire([rx, yOUT], [850, yOUT]);
  s.port(850, yOUT, 'VOUT', 'out');
  s.wire([rx, ySNS], [680, ySNS], [680, yOUT]).dot(680, yOUT);
  s.dot(730, yOUT).capacitor(730, yOUT, 730, yFB).label(730, 220, 'CFF', '', 'right');
  s.wire([rx, yFB], [730, yFB]);
  s.wire([rx, yPG], [850, yPG]);
  s.port(850, yPG, 'PG', 'out');
  capDown(s, 790, yOUT, 60, 'COUT', '', 'right');

  // setting pins: 100mV, 200mV and 400mV grounded; GND joins them
  const busY = ic.y + ic.h + 44;
  for (const x of [375, 420, 465, 600]) s.wire([x, ic.y + ic.h + 12], [x, busY]);
  s.dot(420, busY).dot(465, busY);
  s.wire([375, busY], [600, busY]);
  s.ground(420, busY);
  s.text(640, ic.y + ic.h + 34, 'unused setting pins left open', { cls: 'sch-val' });
  return s;
}
