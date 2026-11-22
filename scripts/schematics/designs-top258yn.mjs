// Drawings for the Power Integrations TOP252-262 (TOPSwitch-HX) datasheet, Rev. N, pages 1, 6 and 22 (the TOP258YN page).
//  - flybackTypical: Figure 1 "Typical Flyback Application" (V, X and F pins: the Y, E and L package pin set).
//  - lineSense: Figure 5 (V pin line sense and X pin current limit).
//  - figure42: Figure 42, the 150 W, 19 V supply using the TOP258YN, with the designators and values the figure prints.
// Figures 1 and 5 print no designators and almost no values, so none are drawn except the ones Figure 5 prints (RLS 4 MΩ, RIL 12 kΩ).
// Figure 42 prints every designator and value, and the drawing carries them.
// Simplifications, stated in the page captions: the MOSFET and CONTROL box inside the package are drawn as one block with pin names;
// the optocoupler is its phototransistor with light arrows and the plain diode in the output stack (as in the figure);
// winding polarity dots are drawn as in the figure.
import { Sheet } from './lib.mjs';

const dashed = (s, x1, y1, x2, y2) => s.add(`<line class="sch-w" stroke-dasharray="4 3" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`);
const openTerm = (s, x, y) => s.add(`<circle class="sch-w" cx="${x}" cy="${y}" r="3.5" fill="none"/>`);
const polDot = (s, x, y) => s.add(`<circle class="sch-dot" cx="${x}" cy="${y}" r="2.5"/>`);

export function flybackTypical({ id, part = 'TOPSwitch-HX' }) {
  const s = new Sheet(980, 600, {
    id,
    top: 60,
    minWidth: 900,
    title: `${part} typical flyback application`,
    desc:
      `Typical flyback supply, redrawn from Figure 1 on page 1 of the TOP252-262 datasheet (the V, X and F pin version). ` +
      `The AC input goes through a four-diode bridge to a bulk capacitor across the bus. The bus feeds the top of the transformer primary and, ` +
      `through a resistor, the V pin. A clamp of a zener diode in series with a diode runs from the bus to the drain node, where the primary's bottom end and the D pin meet. ` +
      `The S pin and the F pin go to the bridge's negative rail, and the X pin goes to it through a resistor. ` +
      `On the output winding a diode and a capacitor make the DC output. A zener diode, a resistor and a diode in series across the output feed back through an optocoupler. ` +
      `A bias winding feeds the C pin: a diode charges a capacitor, the optocoupler's phototransistor connects that capacitor to the C pin, and a capacitor from the C pin goes to the negative rail.`,
  });
  const yT = 110; // bus
  const yG = 570; // primary ground rail
  const xA = 100, xB = 150, yA = 150, yB = 230, yBot = 270;
  const xP = 480; // primary
  const xS = 530; // secondary windings

  // ---------------------------------------------------------------- AC input and bridge
  openTerm(s, 28, yA); openTerm(s, 28, yB);
  s.text(6, 195, 'AC IN', { cls: 'sch-net' });
  s.wire([31.5, yA], [xA, yA]).hwire(yB, 31.5, xB, [xA]);
  s.diode(xA, yA, xA, yT).diode(xA, yBot, xA, yA).diode(xB, yB, xB, yT).diode(xB, yBot, xB, yB);
  s.dot(xA, yA).dot(xB, yB).dot(xB, yT).dot(xB, yBot);
  s.dot(xA, yT).dot(xA, yBot);

  // ---------------------------------------------------------------- bus and bulk capacitor
  s.wire([xA, yT], [xP, yT]);
  s.wire([60, yBot], [200, yBot]).wire([60, yBot], [60, yG]);
  s.dot(200, yT).capacitor(200, yT, 200, yBot).dot(200, yBot);

  // ---------------------------------------------------------------- clamp: zener (anode on the bus) in series with a diode (anode on the drain node)
  s.dot(300, yT).diode(300, yT, 300, 200, { kind: 'zener' }).diode(300, 290, 300, 200);
  s.dot(300, 290).wire([300, 290], [300, 328]);

  // ---------------------------------------------------------------- V pin resistor, crossing the primary's bottom lead
  s.dot(400, yT).resistor(400, yT, 400, 200).wire([400, 200], [400, 328]);

  // ---------------------------------------------------------------- transformer: primary, output winding, bias winding
  s.dot(xP, yT).wire([xP, yT], [xP, 150]).inductor(xP, 150, xP, 270).wire([xP, 270], [xP, 290]);
  s.hwire(290, xP, 300, [400]);
  s.wire([xP + 23, 140], [xP + 23, 350]).wire([xP + 28, 140], [xP + 28, 350]);
  s.inductor(xS, 150, xS, 230, { flip: true });
  s.inductor(xS, 270, xS, 350, { flip: true });
  polDot(s, xP - 12, 246); polDot(s, xS + 12, 176); polDot(s, xS + 12, 296);

  // ---------------------------------------------------------------- controller
  const ic = { x: 270, y: 340, w: 200, h: 170 };
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    top: [{ name: 'D', x: 300 }, { name: 'V', x: 400 }],
    right: [{ name: 'C', y: 475 }],
    bottom: [{ name: 'S', x: 300 }, { name: 'X', x: 370 }, { name: 'F', x: 440 }],
  }, { title: part });
  s.wire([300, 522], [300, yG]).dot(300, yG);
  s.wire([370, 522], [370, 530]).resistor(370, 530, 370, 570).dot(370, yG);
  s.wire([440, 522], [440, yG]).dot(440, yG);
  s.wire([60, yG], [660, yG]);

  // ---------------------------------------------------------------- bias winding, bias capacitor, optocoupler phototransistor, C pin
  s.diode(xS, 270, 620, 270).wire([620, 270], [660, 270]);
  s.wire([xS, 350], [590, 350]).wire([590, 350], [590, yG]).dot(590, yG);
  s.dot(590, 380).capacitor(590, 380, 660, 380).dot(660, 380);
  s.wire([660, 270], [660, 405]);
  // phototransistor, light arriving from the right
  s.wire([660, 405], [660, 425], [678, 435]).wire([678, 425], [678, 455]).wire([678, 445], [660, 455], [660, 475]);
  s.add('<path class="sch-dot" d="M660 455 L668 454.5 L662.5 449 Z"/>');
  for (const y of [427, 443]) s.wire([712, y], [694, y + 10]).wire([702, y + 11], [694, y + 10], [697, y + 3]);
  s.hwire(475, 482, 660, [590]).dot(660, 475);
  s.capacitor(660, 475, 660, 545).wire([660, 545], [660, yG]).dot(660, yG);

  // ---------------------------------------------------------------- output: diode, capacitor, DC terminals
  s.diode(xS, 150, 620, 150);
  s.wire([620, 150], [880, 150]);
  s.hwire(230, xS, 880, [760]);
  s.dot(680, 150).capacitor(680, 150, 680, 230).dot(680, 230);
  openTerm(s, 884, 150); openTerm(s, 884, 230);
  s.text(900, 154, '+', { cls: 'sch-ref' }).text(900, 234, '−', { cls: 'sch-ref' });
  s.text(900, 198, 'DC', { cls: 'sch-net' }).text(900, 212, 'OUT', { cls: 'sch-net' });

  // ---------------------------------------------------------------- output sense stack: zener, resistor, diode (the optocoupler's LED), back to the negative output
  s.dot(760, 150).diode(760, 200, 760, 150, { kind: 'zener' });
  s.wire([760, 200], [760, 290]).resistor(760, 290, 760, 350).wire([760, 350], [760, 380]);
  s.diode(760, 380, 760, 440);
  s.wire([760, 440], [760, 460], [860, 460], [860, 230]).dot(860, 230);
  return s;
}

/**
 * Figure 5: V pin line sense with RLS, X pin current limit with RIL.
 * The drain and C pins are drawn dashed, as in the figure: what they connect to is not shown.
 */
export function lineSense({ id, part = 'TOPSwitch-HX' }) {
  const s = new Sheet(480, 340, {
    id,
    top: 30,
    title: `${part} line sense and external current limit`,
    desc:
      `Line sense and external current limit, redrawn from Figure 5 of the TOP252-262 datasheet. The DC input voltage's positive terminal goes through the 4 megohm resistor RLS to the V pin. ` +
      `The X pin goes through the 12 kilohm resistor RIL to the negative rail, and the S pin goes straight to the negative rail. The D and C pins are drawn dashed: nothing is shown on them.`,
  });
  const yR = 320;
  openTerm(s, 40, 60);
  s.text(30, 48, '+', { cls: 'sch-ref' });
  s.wire([43.5, 60], [240, 60]).dot(240, 60);
  s.resistor(240, 60, 240, 150).label(240, 105, 'RLS', '4 MΩ', 'right');
  s.wire([240, 150], [240, 178]);
  s.ic(160, 190, 160, 70, {
    top: [{ name: 'D', x: 190 }, { name: 'V', x: 240 }],
    right: [{ name: 'C', y: 219 }],
    bottom: [{ name: 'S', x: 190 }, { name: 'X', x: 240 }],
  }, { title: part });
  dashed(s, 190, 178, 190, 140);
  dashed(s, 332, 219, 390, 219);
  s.wire([190, 272], [190, yR]).dot(190, yR);
  s.wire([240, 272], [240, 276]).resistor(240, 276, 240, yR).label(240, 298, 'RIL', '12 kΩ', 'right').dot(240, yR);
  s.wire([43.5, yR], [300, yR]);
  openTerm(s, 40, yR);
  s.text(30, yR + 18, '−', { cls: 'sch-ref' });
  s.text(30, 190, 'DC input', { cls: 'sch-net' }).text(30, 204, 'voltage', { cls: 'sch-net' });
  return s;
}

// ------------------------------------------------------------------------------------------------ Figure 42 helpers

/** Multi-line label: designator, then one line per value. side: 'right' | 'left' | 'above' | 'below'; (x, y) is the part's centre. */
function lab(s, x, y, ref, vals = [], side = 'right') {
  const anchor = side === 'left' ? 'end' : side === 'right' ? 'start' : 'middle';
  const dx = side === 'left' ? -16 : side === 'right' ? 16 : 0;
  const n = 1 + vals.length;
  let y0;
  if (side === 'above') y0 = y - 18 - 13 * (n - 1);
  else if (side === 'below') y0 = y + 24;
  else y0 = y + 4 - 6.5 * (n - 1);
  s.text(x + dx, y0, ref, { cls: 'sch-ref', anchor });
  vals.forEach((v, i) => s.text(x + dx, y0 + 13 * (i + 1), v, { cls: 'sch-val', anchor }));
}

/** Schottky diode on a shared row: the plain diode plus an S-shaped cathode bar. */
function schottky(s, x1, y1, x2, y2) {
  s.diode(x1, y1, x2, y2);
  const dir = Math.sign(x2 - x1) || 1;
  const k = x1 + dir * (Math.abs(x2 - x1) / 2 + 8);
  s.add(`<path class="sch-w" d="M${k - 4 * dir} ${y1 - 8} L${k} ${y1 - 8} M${k} ${y1 + 8} L${k + 4 * dir} ${y1 + 8}"/>`);
}

/** Phototransistor with light arriving from the right; collector terminal at (x, yTop), emitter terminal 70 units lower. */
function photoTransistor(s, x, yTop) {
  s.wire([x, yTop], [x, yTop + 20], [x + 18, yTop + 30]);
  s.wire([x + 18, yTop + 20], [x + 18, yTop + 50]);
  s.wire([x + 18, yTop + 40], [x, yTop + 50], [x, yTop + 70]);
  s.add(`<path class="sch-dot" d="M${x} ${yTop + 50} L${x + 8} ${yTop + 49.5} L${x + 2.5} ${yTop + 44} Z"/>`);
  for (const dy of [22, 38]) {
    const y = yTop + dy;
    s.wire([x + 52, y], [x + 34, y + 10]).wire([x + 42, y + 11], [x + 34, y + 10], [x + 37, y + 3]);
  }
}

/** Horizontal polarized capacitor: straight plate (+) on the x1 side, curved plate on the x2 side. */
function polarizedH(s, x1, x2, y) {
  const dir = Math.sign(x2 - x1) || 1;
  const cx = (x1 + x2) / 2;
  const p1 = cx - 4 * dir;
  const p2 = cx + 4 * dir;
  s.wire([x1, y], [p1, y]).wire([x2, y], [p2, y]);
  s.wire([p1, y - 11], [p1, y + 11]);
  s.add(`<path class="sch-w" d="M${p2 + 4 * dir} ${y - 11} Q${p2 - 5 * dir} ${y} ${p2 + 4 * dir} ${y + 11}"/>`);
  s.text(p1 - 4 * dir, y - 14, '+', { cls: 'sch-ref', anchor: 'middle' });
}

const dashedBox = (s, x, y, w, h) =>
  s.add(`<rect class="sch-w" stroke-dasharray="4 3" fill="none" x="${x}" y="${y}" width="${w}" height="${h}"/>`);

/**
 * Figure 42: "150 W, 19 V Power Supply using TOP258YN" (Rev. N, page 22; drawing PI-4795-092007).
 * Every designator and value is the one the figure prints. Not drawn: the mid-point stub on the primary winding.
 * The optocoupler is drawn as its two halves (U2A's LED and U2B's phototransistor), each in a dashed box, as in the figure.
 */
export function figure42({ id }) {
  const s = new Sheet(1740, 960, {
    id,
    top: 20,
    minWidth: 1500,
    title: 'TOP258YN 150 W, 19 V power supply (Figure 42)',
    desc:
      `150 W, 19 V flyback supply with the TOP258YN, redrawn from Figure 42 on page 22 of the TOP252-262 datasheet. ` +
      `A 250 to 380 volt DC input goes through fuse F1 and thermistor RT1 to the bus, with bulk capacitor C1 across it. ` +
      `Two 4.7 megohm resistors R6 and R7 in series from the bus, with 8.06 kilohm R3 to the negative rail, set the X pin. ` +
      `Two 2 megohm resistors R4 and R5 in series feed the V pin, which also takes the bias voltage through R19 and the 36 volt zener VR2. ` +
      `The primary winding of transformer T1 runs from the bus to the drain node. A clamp from the bus to the drain node has two P6KE100A suppressors in series, ` +
      `two 68 kilohm resistors and C3 in parallel, and the BYV26C diode D1. A snubber of three 1.5 kilohm resistors in series, diode D5 and 120 picofarad C18 also sits on the drain node. ` +
      `The TOP258YN has its S and F pins on the negative rail. The C pin has 100 nanofarad C11 to the negative rail and 6.8 ohm R10 in series with 47 microfarad C10, ` +
      `and the phototransistor U2B connects it to the bias node. A bias winding feeds that node through diode D4 and resistor R8, with 10 microfarad C9 to the winding's return. ` +
      `The secondary has two windings with a centre tap that is the RTN return. Each winding feeds a pair of MBR20100CT Schottky diodes with an RC snubber, and both land on the +19 volt rail. ` +
      `Y capacitor C4 goes from the bus to the centre tap. Output capacitors C5 to C8, inductor L1 and capacitors C15 and C16 filter the 19 volt, 7.7 amp output. ` +
      `Feedback: R16, R17 and R15 divide the output into a TL431, U3, whose cathode drives the LED of optocoupler U2A through R12 with C20, R24 and R11. ` +
      `A compensation network of R13, C12 and C13 runs from the TL431 cathode to the divider node. D6, R23 and C19 form a soft-finish branch.`,
  });
  const yB = 130; // bus
  const yG = 930; // negative rail

  // ---------------------------------------------------------------- input, fuse, thermistor, bus
  openTerm(s, 40, yB); openTerm(s, 40, yG);
  s.text(40, 160, '250 – 380', { cls: 'sch-net', anchor: 'middle' }).text(40, 174, 'VDC', { cls: 'sch-net', anchor: 'middle' });
  s.wire([43.5, yB], [70, yB]);
  s.add(`<rect class="sch-w" x="70" y="${yB - 5}" width="30" height="10"/>`).wire([70, yB], [100, yB]);
  s.wire([100, yB], [120, yB]).resistor(120, yB, 170, yB);
  lab(s, 85, yB, 'F1', ['4 A'], 'above');
  lab(s, 145, yB, 'RT1', ['5 Ω t°'], 'above');
  s.wire([170, yB], [930, yB]);
  for (const x of [190, 215, 465, 560, 640, 700, 760, 930]) s.dot(x, yB);
  s.wire([43.5, yG], [1010, yG]);

  // ---------------------------------------------------------------- C1 and the X pin divider (R6, R7, R3)
  s.capacitor(190, yB, 190, yG, { polarized: true }).dot(190, yG);
  lab(s, 190, 440, 'C1', ['22 µF', '400 V'], 'left');
  s.resistor(215, yB, 215, 220).resistor(215, 220, 215, 310);
  lab(s, 215, 175, 'R6', ['4.7 MΩ']); lab(s, 215, 265, 'R7', ['4.7 MΩ']);
  s.wire([215, 310], [215, 700]).dot(215, 700);
  s.resistor(215, 700, 215, yG).dot(215, yG);
  lab(s, 215, 815, 'R3', ['8.06 kΩ', '1%']);

  // ---------------------------------------------------------------- V pin divider (R4, R5) and the bias branch (R19, VR2)
  s.resistor(465, yB, 465, 220).resistor(465, 220, 465, 310);
  lab(s, 465, 175, 'R4', ['2.0 MΩ']); lab(s, 465, 265, 'R5', ['2.0 MΩ']);
  s.wire([465, 310], [465, 578]).dot(465, 540);
  s.resistor(465, 540, 565, 540).wire([565, 540], [600, 540]);
  s.diode(600, 540, 760, 540, { kind: 'zener' });
  s.hwire(540, 760, 1040, [1010]);
  lab(s, 515, 540, 'R19', ['4.7 Ω'], 'above');
  lab(s, 680, 540, 'VR2', ['1N5258B', '36 V'], 'above');

  // ---------------------------------------------------------------- clamp: VR1 and VR3 in series (anode on the bus), R1 and R2, C3, D1
  s.diode(560, yB, 560, 200, { kind: 'zener' }).diode(560, 200, 560, 270, { kind: 'zener' });
  s.wire([560, 270], [760, 270]);
  for (const x of [640, 700]) s.resistor(x, yB, x, 270).dot(x, 270);
  s.capacitor(760, yB, 760, 270).dot(760, 270).dot(560, 270);
  lab(s, 640, yB, 'R1', ['68 kΩ', '2 W'], 'above');
  lab(s, 700, yB, 'R2', ['68 kΩ', '2 W'], 'above');
  lab(s, 760, yB, 'C3', ['4.7 nF', '1 kV'], 'above');
  s.text(566, 298, 'VR1, VR3', { cls: 'sch-ref' }).text(566, 311, 'P6KE100A', { cls: 'sch-val' });
  s.diode(840, 270, 760, 270); // anode on the drain node, cathode on the clamp node
  lab(s, 800, 270, 'D1', ['BYV26C'], 'below');

  // ---------------------------------------------------------------- drain node: D pin, snubber (R20-R22, D5, C18)
  s.dot(840, 270).wire([840, 270], [840, 350]).dot(840, 350);
  s.hwire(350, 290, 840, [465]);
  s.dot(290, 350).dot(370, 350).dot(415, 350);
  s.resistor(290, 350, 290, 440).resistor(290, 440, 290, 530).resistor(290, 530, 290, 620);
  lab(s, 290, 395, 'R20', ['1.5 kΩ', '2 W'], 'left');
  lab(s, 290, 485, 'R21', ['1.5 kΩ', '2 W'], 'left');
  lab(s, 290, 575, 'R22', ['1.5 kΩ', '2 W'], 'left');
  s.wire([290, 620], [290, 650], [370, 650]).dot(370, 650);
  s.diode(370, 350, 370, 650); // anode on the drain node
  lab(s, 370, 500, 'D5', ['1N4937'], 'left');
  s.capacitor(370, 650, 370, yG).dot(370, yG);
  lab(s, 370, 790, 'C18', ['120 pF', '1 kV'], 'left');

  // ---------------------------------------------------------------- U1
  s.ic(385, 590, 130, 90, {
    top: [{ name: 'D', x: 415 }, { name: 'V', x: 465 }],
    right: [{ name: 'C', y: 650 }],
    bottom: [{ name: 'S', x: 415 }, { name: 'X', x: 465 }, { name: 'F', x: 495 }],
  }, { title: 'TOP258YN', subtitle: 'U1' });
  s.wire([415, 578], [415, 350]);
  s.wire([415, 692], [415, yG]).dot(415, yG);
  s.wire([495, 692], [495, yG]).dot(495, yG);
  s.wire([465, 692], [465, 700]);
  s.hwire(700, 215, 465, [370, 415]).dot(215, 700);

  // ---------------------------------------------------------------- C pin: C11, R10 + C10, U2B
  s.hwire(650, 527, 1040, [1010]);
  s.dot(570, 650).capacitor(570, 650, 570, yG).dot(570, yG);
  lab(s, 570, 790, 'C11', ['100 nF', '50 V'], 'left');
  s.dot(630, 650).resistor(630, 650, 630, 780).capacitor(630, 780, 630, yG, { polarized: true }).dot(630, yG);
  lab(s, 630, 715, 'R10', ['6.8 Ω']);
  lab(s, 630, 855, 'C10', ['47 µF', '10 V']);

  // ---------------------------------------------------------------- transformer T1
  s.wire([930, yB], [930, 150]).inductor(930, 150, 930, 250).wire([930, 250], [930, 270]);
  s.wire([840, 270], [930, 270]);
  s.wire([953, 120], [953, 480]).wire([958, 120], [958, 480]);
  s.inductor(980, yB, 980, 230, { flip: true }).inductor(980, 230, 980, 310, { flip: true }).inductor(980, 400, 980, 470, { flip: true });
  polDot(s, 945, 256); polDot(s, 992, 146); polDot(s, 990, 296); polDot(s, 992, 414);
  s.text(922, 143, '1', { cls: 'sch-pin', anchor: 'end' }).text(922, 264, '4', { cls: 'sch-pin', anchor: 'end' });
  s.text(1000, 124, '13,14', { cls: 'sch-pin' }).text(1000, 224, '11,12', { cls: 'sch-pin' });
  s.text(1000, 304, '9,10', { cls: 'sch-pin' }).text(1000, 394, '7', { cls: 'sch-pin' }).text(996, 464, '5', { cls: 'sch-pin' });
  lab(s, 930, 440, 'T1', ['EI35'], 'left');

  // ---------------------------------------------------------------- Y capacitor C4: bus to the centre tap
  s.dot(930, yB).wire([930, yB], [930, 80], [965, 80]).capacitor(965, 80, 1005, 80).wire([1005, 80], [1040, 80], [1040, 230]);
  lab(s, 985, 80, 'C4', ['2.2 nF', '250 VAC'], 'above');

  // ---------------------------------------------------------------- bias winding: D4, R8, C9, U2B
  s.wire([980, 400], [1040, 400]).diode(1040, 400, 1040, 450).resistor(1040, 450, 1040, 510);
  lab(s, 1040, 425, 'D4', ['1N4148']);
  lab(s, 1040, 480, 'R8', ['4.7 Ω']);
  s.dot(1040, 510).wire([1040, 510], [1040, 580]).dot(1040, 540);
  polarizedH(s, 1040, 1010, 510);
  s.text(1000, 497, 'C9', { cls: 'sch-ref', anchor: 'end' }).text(1000, 510, '10 µF', { cls: 'sch-val', anchor: 'end' }).text(1000, 523, '50 V', { cls: 'sch-val', anchor: 'end' });
  s.wire([980, 470], [1010, 470]).wire([1010, 470], [1010, yG]).dot(1010, yG).dot(1010, 510);
  photoTransistor(s, 1040, 580);
  dashedBox(s, 1018, 592, 76, 48);
  s.text(1050, 668, 'U2', { cls: 'sch-ref' }).text(1050, 681, 'PC817B', { cls: 'sch-val' });

  // ---------------------------------------------------------------- secondary: centre tap (RTN), D2, D3, snubbers
  s.hwire(130, 980, 1080, [1040]).dot(1080, 130);
  s.wire([980, 230], [1040, 230]).dot(1040, 230);
  s.wire([980, 310], [1080, 310]).dot(1080, 310);
  // D2: two Schottky diodes in parallel, with the R14 / C14 snubber across them
  s.wire([1080, 130], [1080, 80]).resistor(1080, 80, 1170, 80).capacitor(1170, 80, 1260, 80).wire([1260, 80], [1260, 130]);
  lab(s, 1125, 80, 'R14', ['22 Ω', '0.5 W'], 'above');
  lab(s, 1215, 80, 'C14', ['47 pF', '1 kV'], 'above');
  schottky(s, 1080, 130, 1260, 130);
  s.wire([1080, 130], [1080, 170]);
  schottky(s, 1080, 170, 1260, 170);
  lab(s, 1170, 170, 'D2', ['MBR20100CT'], 'below');
  // D3: the same, with the R18 / C17 snubber below
  schottky(s, 1080, 310, 1260, 310);
  s.wire([1080, 310], [1080, 350]);
  schottky(s, 1080, 350, 1260, 350);
  lab(s, 1170, 310, 'D3', ['MBR20100CT'], 'above');
  s.wire([1080, 350], [1080, 400]).resistor(1080, 400, 1170, 400).capacitor(1170, 400, 1260, 400);
  lab(s, 1125, 400, 'R18', ['22 Ω', '0.5 W'], 'below');
  lab(s, 1215, 400, 'C17', ['47 pF', '1 kV'], 'below');

  // ---------------------------------------------------------------- +19 V rail, output filter, RTN
  s.wire([1260, 130], [1260, 450]);
  for (const y of [130, 170, 310, 350, 400, 450]) s.dot(1260, y);
  s.wire([1260, 130], [1440, 130]).inductor(1440, 130, 1510, 130).wire([1510, 130], [1676.5, 130]);
  s.hwire(230, 1040, 1630, [1260, 1610]);
  s.wire([1630, 230], [1676.5, 230]).dot(1630, 230);
  for (const x of [1300, 1336, 1372, 1408, 1540, 1576]) {
    s.dot(x, 130).capacitor(x, 130, x, 230, { polarized: true }).dot(x, 230);
  }
  lab(s, 1354, 130, 'C5–C8', ['820 µF', '25 V'], 'above');
  lab(s, 1475, 130, 'L1', ['3.3 µH'], 'above');
  lab(s, 1558, 130, 'C15–C16', ['820 µF', '25 V'], 'above');
  openTerm(s, 1680, 130); openTerm(s, 1680, 230);
  s.text(1680, 106, '+19 V, 7.7 A', { cls: 'sch-net', anchor: 'middle' });
  s.text(1680, 256, 'RTN', { cls: 'sch-net', anchor: 'middle' });
  s.wire([1630, 230], [1630, yG]).dot(1630, yG);

  // ---------------------------------------------------------------- LED supply: R12 / C20, R24, U2A, R11
  s.resistor(1260, 450, 1260, 530);
  lab(s, 1260, 490, 'R12', ['240 Ω', '0.125 W'], 'left');
  s.wire([1260, 450], [1300, 450]).capacitor(1300, 450, 1300, 530).wire([1300, 530], [1260, 530]).dot(1260, 530);
  lab(s, 1300, 490, 'C20', ['1.0 µF', '50 V']);
  s.wire([1260, 530], [1260, 610]).resistor(1260, 610, 1260, 680).dot(1260, 680);
  lab(s, 1260, 645, 'R24', ['30 Ω', '0.125 W'], 'left');
  s.diode(1260, 680, 1260, 760, { kind: 'led', side: -1 });
  dashedBox(s, 1190, 692, 84, 56);
  lab(s, 1190, 720, 'U2', ['PC817A'], 'left');
  s.wire([1260, 680], [1320, 680]).resistor(1320, 680, 1320, 760).wire([1320, 760], [1260, 760]).dot(1260, 760);
  lab(s, 1320, 720, 'R11', ['1 kΩ', '0.125 W']);

  // ---------------------------------------------------------------- soft finish: R23 from the +19 V rail, C19, D6
  s.hwire(570, 1610, 1120, [1260]);
  s.dot(1610, 570);
  s.resistor(1120, 570, 1120, 650).wire([1120, 650], [1120, 760]).dot(1120, 760);
  lab(s, 1120, 610, 'R23', ['15 kΩ', '0.125 W']);
  s.diode(1260, 760, 1120, 760); // anode on the LED's cathode node
  lab(s, 1190, 760, 'D6', ['1N4148'], 'below');
  s.capacitor(1120, 760, 1120, yG, { polarized: true }).dot(1120, yG);
  lab(s, 1120, 845, 'C19', ['10 µF', '50 V']);

  // ---------------------------------------------------------------- TL431 (U3), compensation and the output divider
  s.wire([1260, 760], [1260, 826]).dot(1260, 800);
  s.diode(1260, yG, 1260, 826, { kind: 'zener' }).dot(1260, yG);
  s.wire([1268, 870], [1610, 870]).dot(1610, 870);
  s.text(1276, 888, 'U3', { cls: 'sch-ref' }).text(1276, 901, 'TL431', { cls: 'sch-val' }).text(1276, 914, '2%', { cls: 'sch-val' });
  s.wire([1260, 800], [1380, 800]).dot(1380, 800);
  s.wire([1380, 800], [1380, 760]).capacitor(1380, 760, 1480, 760).wire([1480, 760], [1480, 800]);
  s.resistor(1380, 800, 1480, 800).dot(1480, 800);
  s.wire([1480, 800], [1530, 800]).capacitor(1530, 800, 1590, 800).wire([1590, 800], [1610, 800]).dot(1610, 800);
  lab(s, 1430, 760, 'C12', ['4.7 nF', '50 V'], 'above');
  lab(s, 1430, 800, 'R13', ['56 kΩ', '0.125 W'], 'below');
  lab(s, 1560, 800, 'C13', ['100 nF', '50 V'], 'above');
  s.wire([1610, 130], [1610, 570]);
  s.resistor(1610, 570, 1610, 660).resistor(1610, 660, 1610, 750).wire([1610, 750], [1610, 870]);
  s.resistor(1610, 870, 1610, yG).dot(1610, yG);
  lab(s, 1610, 615, 'R16', ['31.6 kΩ', '1%'], 'left');
  lab(s, 1610, 705, 'R17', ['562 Ω', '1%'], 'left');
  lab(s, 1610, 900, 'R15', ['4.75 kΩ', '1%'], 'left');
  s.dot(1610, 130);
  s.wire([1120, yG], [1630, yG]);
  s.dot(1260, yG);
  return s;
}
