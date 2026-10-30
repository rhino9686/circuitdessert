// Schematic definitions. Each one draws a reference circuit from the values it is given, so the
// drawing and the recipe's bill of materials can be generated from the same numbers.
import { Sheet, refMarkup } from './lib.mjs';

/**
 * The small Silergy buck circuit: IN, EN, LX, FB and GND, with the pins that vary by part switched on by options.
 *   bs   (default true)  a BS pin with a bootstrap capacitor to LX (SY81152 / SY81153 / SY81153C / SY81154U).
 *                        Pass false for parts with no BS pin (SY20031, SY80082x).
 *   rpg  (value string)  adds an open-drain PG pin on top, pulled up to VIN through this resistor (SY80082x).
 * EN is fed from VIN through a divider; the output is set by RH/RL with a feedforward capacitor across RH.
 *   enPort (name string) draws EN as a control input from the system (a net flag with this name) instead of the VIN divider
 *                        (SY8113B); renh and renl are then ignored.
 *   cin1   (null)        leaves out the bulk input capacitor, for circuits that show a single input capacitor.
 */
export function compactBuck({ id, part, vin, vout, cin1, cin2, couts, cbs, cff, l, rh, rl, renh, renl, bs = true, rpg = null, enPort = null }) {
  const GY = 230; // every ground terminal sits on this row
  const X = { cin1: 90, cin2: 150, en: 220, rh: 540, cff: 590, cout1: 670, cout2: 740 };
  const outEnd = couts.length > 1 ? X.cout2 + 50 : X.cout1 + 60;
  const W = outEnd + 56;
  const s = new Sheet(W, 270, {
    id,
    top: bs || rpg ? 0 : 50, // nothing is drawn above the IC when there is no BS or PG pin
    title: `${part} reference circuit`,
    desc:
      `Typical application of the ${part} buck converter. VIN (${vin}) feeds the IN pin through ${cin1 ? `${cin1} and ${cin2} input capacitors` : `a ${cin2} input capacitor`}. ` +
      (enPort ? `The EN pin is driven by a ${enPort} control signal from the system. ` : `A ${renh} / ${renl} divider from VIN sets the enable level on EN. `) +
      (bs ? `The ${cbs} bootstrap capacitor connects BS to LX. ` : '') +
      (rpg ? `The open-drain PG output is pulled up to VIN through ${rpg}. ` : '') +
      `LX drives a ${l} inductor to the ${vout} output, which has ${couts.length} output capacitor${couts.length > 1 ? 's' : ''} of ${couts[0]}. ` +
      `RH (${rh}) and RL (${rl}) form the feedback divider to FB, with a ${cff} feedforward capacitor across RH.`,
  });
  const ic = { x: 290, y: 90, w: 110, h: 100 };
  const pinIN = 120, pinEN = 160;

  // --- IC
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'IN', y: pinIN }, { name: 'EN', y: pinEN }],
    right: [{ name: 'LX', y: pinIN }, { name: 'FB', y: pinEN }],
    top: bs ? [{ name: 'BS', x: 330 }] : rpg ? [{ name: 'PG', x: 330 }] : [],
    bottom: [{ name: 'GND', x: 345 }],
  }, { title: part });
  s.wire([345, ic.y + ic.h + 12], [345, GY]).ground(345, GY);

  // --- input side
  s.port(54, pinIN, 'VIN', 'in').text(10, pinIN + 26, vin, { cls: 'sch-net', anchor: 'start' });
  s.wire([54, pinIN], [X.en, pinIN], [ic.x - 12, pinIN]);
  if (cin1) s.capacitor(X.cin1, pinIN, X.cin1, GY, { polarized: true }).ground(X.cin1, GY).dot(X.cin1, pinIN).label(X.cin1, 178, 'CIN1', cin1);
  s.capacitor(X.cin2, pinIN, X.cin2, GY).ground(X.cin2, GY).dot(X.cin2, pinIN).label(X.cin2, 178, cin1 ? 'CIN2' : 'CIN', cin2);
  if (enPort) {
    s.port(ic.x - 12, pinEN, enPort, 'in');
  } else {
    s.resistor(X.en, pinIN, X.en, pinEN).dot(X.en, pinIN).label(X.en, 140, 'RENH', renh);
    s.wire([X.en, pinEN], [ic.x - 12, pinEN]).dot(X.en, pinEN);
    s.resistor(X.en, pinEN, X.en, GY).ground(X.en, GY).label(X.en, 196, 'RENL', renl);
  }

  // --- bootstrap capacitor, BS to LX
  const lxX = 440;
  if (bs) s.wire([330, ic.y - 12], [330, 50]).capacitor(330, 50, lxX, 50).wire([lxX, 50], [lxX, pinIN]).label(385, 50, 'CBS', cbs, 'above');

  // --- power-good pull-up: from the VIN rail, over the top, down to PG
  if (rpg) {
    s.wire([262, pinIN], [262, 50]).dot(262, pinIN).resistor(262, 50, 330, 50).wire([330, 50], [330, ic.y - 12]).label(296, 50, 'RPG', rpg, 'above');
  }

  // --- LX, inductor and output rail
  s.wire([ic.x + ic.w + 12, pinIN], [lxX, pinIN]);
  if (bs) s.dot(lxX, pinIN);
  s.inductor(lxX, pinIN, 520, pinIN).label(480, pinIN, 'L', l, 'above');
  s.wire([520, pinIN], [outEnd, pinIN]);
  s.port(outEnd, pinIN, 'VOUT', 'out').text(outEnd + 46, pinIN + 26, vout, { cls: 'sch-net', anchor: 'end' });

  // --- feedback divider with feedforward capacitor
  s.dot(X.rh, pinIN).resistor(X.rh, pinIN, X.rh, pinEN).label(X.rh, 140, 'RH', rh, 'left');
  s.wire([ic.x + ic.w + 12, pinEN], [X.rh, pinEN]).dot(X.rh, pinEN);
  s.resistor(X.rh, pinEN, X.rh, GY).ground(X.rh, GY).label(X.rh, 196, 'RL', rl, 'left');
  s.wire([X.rh, pinEN], [X.cff, pinEN]);
  s.capacitor(X.cff, pinIN, X.cff, pinEN).dot(X.cff, pinIN).label(X.cff, 140, 'CFF', cff);

  // --- output capacitors
  couts.forEach((v, i) => {
    const x = i ? X.cout2 : X.cout1;
    s.capacitor(x, pinIN, x, GY).ground(x, GY).dot(x, pinIN).label(x, 178, couts.length > 1 ? `COUT${i + 1}` : 'COUT', v);
  });
  return s;
}

/**
 * Silergy SA25901: IN, PG, EN, MODE on the left; LX, FB, NC on the right; GND below. There is no BS pin.
 * As in the datasheet's circuit, EN and MODE are tied straight to VIN (MODE high = forced PWM), and PG is
 * pulled up to VIN through RPG. The output is set by RTOP/RBOT with a feedforward capacitor across RTOP.
 */
export function modePinBuck({ id, part, vin, vout, cin1, cin2, cout, cff, l, rtop, rbot, rpg }) {
  const GY = 252; // every ground terminal sits on this row
  const X = { cin1: 90, cin2: 146, bus: 202, rpg: 254, rtop: 590, cff: 644, cout: 704 };
  const outEnd = X.cout + 60;
  const s = new Sheet(outEnd + 56, 292, {
    id,
    top: 60, // nothing is drawn above the inductor label
    title: `${part} reference circuit`,
    desc:
      `Typical application of the ${part} buck converter. VIN (${vin}) feeds the IN pin through ${cin1} and ${cin2} input capacitors. ` +
      `The EN and MODE pins are connected directly to VIN, which selects forced PWM. The open-drain PG output is pulled up to VIN through ${rpg}. ` +
      `LX drives a ${l} inductor to the ${vout} output, which has ${cout} of output capacitance. ` +
      `RTOP (${rtop}) and RBOT (${rbot}) form the feedback divider to FB, with a ${cff} feedforward capacitor across RTOP.`,
  });
  const ic = { x: 300, y: 90, w: 150, h: 130 };
  const pinIN = 120, pinPG = 150, pinEN = 180, pinMODE = 210;
  const pinFB = 180;

  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'IN', y: pinIN }, { name: 'PG', y: pinPG }, { name: 'EN', y: pinEN }, { name: 'MODE', y: pinMODE }],
    right: [{ name: 'LX', y: pinIN }, { name: 'FB', y: pinFB }],
    bottom: [{ name: 'GND', x: 395 }],
  }, { title: part });
  s.text(ic.x + ic.w - 8, pinMODE + 4, 'NC', { cls: 'sch-pin', anchor: 'end' }); // not connected: no stub
  s.wire([395, ic.y + ic.h + 12], [395, GY]).ground(395, GY);

  // --- input rail, bulk and ceramic capacitors
  s.port(54, pinIN, 'VIN', 'in').text(10, pinIN + 26, vin, { cls: 'sch-net', anchor: 'start' });
  s.wire([54, pinIN], [ic.x - 12, pinIN]);
  s.capacitor(X.cin1, pinIN, X.cin1, GY, { polarized: true }).ground(X.cin1, GY).dot(X.cin1, pinIN).label(X.cin1, 150, 'CIN1', cin1);
  s.capacitor(X.cin2, pinIN, X.cin2, GY).ground(X.cin2, GY).dot(X.cin2, pinIN).label(X.cin2, 150, 'CIN2', cin2);

  // --- EN and MODE tied to VIN through a short bus
  s.dot(X.bus, pinIN).wire([X.bus, pinIN], [X.bus, pinMODE]);
  s.wire([X.bus, pinEN], [ic.x - 12, pinEN]).dot(X.bus, pinEN);
  s.wire([X.bus, pinMODE], [ic.x - 12, pinMODE]);

  // --- PG pull-up
  s.dot(X.rpg, pinIN).resistor(X.rpg, pinIN, X.rpg, pinPG).label(X.rpg, 140, 'RPG', rpg, 'left');
  s.wire([X.rpg, pinPG], [ic.x - 12, pinPG]);

  // --- LX, inductor and output rail
  const lxEnd = ic.x + ic.w + 12;
  s.inductor(490, pinIN, 570, pinIN).label(530, pinIN, 'L', l, 'above');
  s.wire([lxEnd, pinIN], [490, pinIN]).wire([570, pinIN], [outEnd, pinIN]);
  s.port(outEnd, pinIN, 'VOUT', 'out').text(outEnd + 46, pinIN + 26, vout, { cls: 'sch-net', anchor: 'end' });

  // --- feedback divider with feedforward capacitor across RTOP
  s.dot(X.rtop, pinIN).resistor(X.rtop, pinIN, X.rtop, pinFB).label(X.rtop, 150, 'RTOP', rtop, 'left');
  s.wire([lxEnd, pinFB], [X.cff, pinFB]).dot(X.rtop, pinFB);
  s.resistor(X.rtop, pinFB, X.rtop, GY).ground(X.rtop, GY).label(X.rtop, 216, 'RBOT', rbot, 'left');
  s.dot(X.cff, pinIN).capacitor(X.cff, pinIN, X.cff, pinFB).dot(X.cff, pinFB).label(X.cff, 150, 'CFF', cff);

  // --- output capacitance
  s.capacitor(X.cout, pinIN, X.cout, GY).ground(X.cout, GY).dot(X.cout, pinIN).label(X.cout, 178, 'COUT', cout);
  return s;
}

/**
 * Silergy SY21219: a 6 A, 30 V buck. IN and EN on the left; PG and BS on top; LX, FB and VCC on the right;
 * GND and AGND below. CVCC decouples the internal 3.3 V supply, and AGND connects to its negative side.
 * RFF in series with CFF sits across RH to speed up the load-transient response.
 */
export function vccBuck({ id, part, vin, vout, cin1, cin2, cin3, couts, cbs, cvcc, cff, rff, l, rh, rl, renh, renl, rpg }) {
  const GY = 262; // every ground terminal except AGND sits on this row
  const X = { cin1: 80, cin2: 136, cin3: 192, en: 258, rpg: 304, cvcc: 540, rff: 590, rh: 650 };
  X.couts = couts.map((_, i) => 720 + i * 64);
  const outEnd = X.couts[couts.length - 1] + 50;
  const s = new Sheet(outEnd + 56, 302, {
    id,
    title: `${part} reference circuit`,
    desc:
      `Typical application of the ${part} buck converter. VIN (${vin}) feeds the IN pin through ${cin1}, ${cin2} and ${cin3} input capacitors. ` +
      `A ${renh} / ${renl} divider from VIN sets the enable level on EN. The open-drain PG output is pulled up to VIN through ${rpg}. ` +
      `The ${cbs} bootstrap capacitor connects BS to LX, and ${cvcc} on the VCC pin returns to AGND. ` +
      `LX drives a ${l} inductor to the ${vout} output, which has ${couts.length} output capacitors of ${couts[0]}. ` +
      `RH (${rh}) and RL (${rl}) form the feedback divider to FB, with ${rff} in series with ${cff} across RH.`,
  });
  const ic = { x: 330, y: 90, w: 120, h: 140 };
  const pinIN = 120, pinEN = 190, pinFB = 190, pinVCC = 210;
  const pinBS = 410, pinPG = 350;

  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'IN', y: pinIN }, { name: 'EN', y: pinEN }],
    right: [{ name: 'LX', y: pinIN }, { name: 'FB', y: pinFB }, { name: 'VCC', y: pinVCC }],
    top: [{ name: 'PG', x: pinPG }, { name: 'BS', x: pinBS }],
    bottom: [{ name: 'GND', x: 352 }, { name: 'AGND', x: 392 }],
  }, { title: part });
  s.wire([352, ic.y + ic.h + 12], [352, GY]).ground(352, GY);

  // --- input rail, three capacitors, enable divider
  s.port(54, pinIN, 'VIN', 'in').text(10, pinIN + 26, vin, { cls: 'sch-net', anchor: 'start' });
  s.wire([54, pinIN], [ic.x - 12, pinIN]);
  s.capacitor(X.cin1, pinIN, X.cin1, GY, { polarized: true }).ground(X.cin1, GY).dot(X.cin1, pinIN).label(X.cin1, 150, 'CIN1', cin1);
  s.capacitor(X.cin2, pinIN, X.cin2, GY).ground(X.cin2, GY).dot(X.cin2, pinIN).label(X.cin2, 150, 'CIN2', cin2);
  s.capacitor(X.cin3, pinIN, X.cin3, GY).ground(X.cin3, GY).dot(X.cin3, pinIN).label(X.cin3, 150, 'CIN3', cin3);
  s.resistor(X.en, pinIN, X.en, pinEN).dot(X.en, pinIN).label(X.en, 150, 'RENH', renh);
  s.wire([X.en, pinEN], [ic.x - 12, pinEN]).dot(X.en, pinEN);
  s.resistor(X.en, pinEN, X.en, GY).ground(X.en, GY).label(X.en, 226, 'RENL', renl);

  // --- power-good pull-up: from the VIN rail, over the top, down to PG
  s.wire([X.rpg, pinIN], [X.rpg, 50]).dot(X.rpg, pinIN).resistor(X.rpg, 50, pinPG, 50).wire([pinPG, 50], [pinPG, ic.y - 12]).label((X.rpg + pinPG) / 2, 50, 'RPG', rpg, 'above');

  // --- bootstrap capacitor, BS to LX
  const lxX = 490;
  s.wire([pinBS, ic.y - 12], [pinBS, 50]).capacitor(pinBS, 50, lxX, 50).wire([lxX, 50], [lxX, pinIN]).label(450, 50, 'CBS', cbs, 'above');
  s.wire([ic.x + ic.w + 12, pinIN], [lxX, pinIN]).dot(lxX, pinIN);

  // --- inductor and output rail
  s.inductor(lxX, pinIN, lxX + 80, pinIN).label(lxX + 40, pinIN, 'L', l, 'above');
  s.wire([lxX + 80, pinIN], [outEnd, pinIN]);
  s.port(outEnd, pinIN, 'VOUT', 'out').text(outEnd + 46, pinIN + 26, vout, { cls: 'sch-net', anchor: 'end' });

  // --- VCC capacitor, returned to AGND
  const vccEnd = ic.x + ic.w + 12;
  s.wire([vccEnd, pinVCC], [X.cvcc, pinVCC]).capacitor(X.cvcc, pinVCC, X.cvcc, 258).label(X.cvcc, 236, 'CVCC', cvcc);
  s.wire([392, ic.y + ic.h + 12], [392, 258], [X.cvcc, 258]);

  // --- feedback: RFF + CFF in series across RH, with RH/RL to ground
  s.dot(X.rff, pinIN).resistor(X.rff, pinIN, X.rff, 152).label(X.rff, 140, 'RFF', rff, 'left');
  s.capacitor(X.rff, 152, X.rff, pinFB).label(X.rff, 168, 'CFF', cff, 'left');
  s.wire([vccEnd, pinFB], [X.rh, pinFB]).dot(X.rff, pinFB).dot(X.rh, pinFB);
  s.dot(X.rh, pinIN).resistor(X.rh, pinIN, X.rh, pinFB).label(X.rh, 150, 'RH', rh);
  s.resistor(X.rh, pinFB, X.rh, GY).ground(X.rh, GY).label(X.rh, 226, 'RL', rl);

  // --- output capacitors
  couts.forEach((v, i) => {
    const x = X.couts[i];
    s.capacitor(x, pinIN, x, GY).ground(x, GY).dot(x, pinIN).label(x, 178, `COUT${i + 1}`, v);
  });
  return s;
}

/** Kept so older recipes that name the original six-pin drawing still work. */
export const sixPinBuck = compactBuck;

/**
 * Silergy SY20718C: a single-cell power bank regulator. One half-bridge works as a buck charger (SYS to battery) and as a boost
 * (battery to SYS). VIN reaches SYS through blocking FETs inside the chip. Resistors on IIN, ICHG and ISYS set the input, charge and
 * boost current limits; R2/R3 set the input-voltage threshold (VDPM); CV1 picks the cell voltage; STAT drives a status LED.
 * Drawn from the datasheet's application schematic; the footprints it leaves unpopulated are not drawn.
 */
export function chargerBoost({ id, part, vin, v = {} }) {
  const val = {
    c1: '10 µF', c3: '1 µF', c4: '22 µF', c5: '22 µF', c6: '10 µF', c8: '10 nF', l1: '1.5 µH',
    r1: '5.1 kΩ', r2: '36 kΩ', r3: '13 kΩ', r4: '0.75 kΩ', r5: '2.55 kΩ', r6: '2.2 kΩ', r7: '0 Ω', r8: '100 kΩ', r10: '2.2 Ω', r12: '0 Ω', r19: '10 kΩ',
    ...v,
  };
  const s = new Sheet(960, 490, {
    id,
    title: `${part} reference circuit`,
    desc:
      `Application circuit of the ${part} bidirectional power bank regulator. The adapter input VIN (${vin}) has a ${val.c1} capacitor and a ${val.r2} / ${val.r3} divider that sets the VDPM input-voltage threshold. ` +
      `${val.r4}, ${val.r5} and ${val.r6} resistors from IIN, ICHG and ISYS to ground set the input, charge and boost current limits. ` +
      `The CV1 jumper selects the cell voltage: ground for 4.2 V, or ${val.r19} to SYS for 4.35 V. STAT drives an LED through ${val.r1}, powered from the higher of SYS and BAT through the D2 diode pair. ` +
      `The SYS pin has two ${val.c4} capacitors and is the 5.15 V output. LX drives a ${val.l1} inductor to the battery node BAT, which has ${val.c6} and ${val.c3} capacitors. ` +
      `OTGB is pulled up to BAT through ${val.r8}; pulling it low enables boost. DP and DM reach the output port through ${val.r7} resistors with 5.1 V zener diodes to ground. ` +
      `A ${val.c8} capacitor and ${val.r10} resistor in series from LX to ground form a snubber.`,
  });
  const ic = { x: 300, y: 90, w: 220, h: 360 };
  const R = { VIN: 135, VDPM: 170, CV: 245, STAT: 300 };
  const Q = { SYS: 135, LX: 190, BAT: 245, OTGB: 300, DP: 360, DM: 430 };
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'VIN', y: R.VIN }, { name: 'VDPM', y: R.VDPM }, { name: 'CV', y: R.CV }, { name: 'STAT', y: R.STAT }],
    right: Object.entries(Q).map(([name, y]) => ({ name: name === 'OTGB' ? 'OTGB(NTC)' : name, y })),
    top: [{ name: 'IIN', x: 330 }, { name: 'ICHG', x: 410 }, { name: 'ISYS', x: 490 }],
    bottom: [{ name: 'GND', x: 410 }],
  }, { title: part });
  s.wire([410, ic.y + ic.h + 12], [410, 462]).ground(410, 462);
  const lx = ic.x - 12; // left pin stubs end here
  const rx = ic.x + ic.w + 12; // right pin stubs end here

  // --- input: VIN port, C1, and the R2/R3 divider that sets the VDPM threshold
  s.port(54, R.VIN, 'VIN', 'in').text(10, R.VIN - 14, vin, { cls: 'sch-net', anchor: 'start' });
  s.wire([54, R.VIN], [lx, R.VIN]);
  s.capacitor(70, R.VIN, 70, 195).ground(70, 195).dot(70, R.VIN).label(70, 165, 'C1', val.c1, 'left');
  s.dot(130, R.VIN).resistor(130, R.VIN, 130, R.VDPM).label(130, 152, 'R2', val.r2);
  s.dot(130, R.VDPM).resistor(130, R.VDPM, 130, 225).ground(130, 225).label(130, 198, 'R3', val.r3);
  s.wire([130, R.VDPM], [lx, R.VDPM]);

  // --- CV: jumper to ground (4.2 V) or to SYS through R19 (4.35 V)
  const jx = 226;
  s.wire([lx, R.CV], [262, R.CV]);
  s.add(`<circle class="sch-w" cx="262" cy="${R.CV}" r="2.5"/>`).add(`<circle class="sch-w" cx="${jx}" cy="${R.CV + 17}" r="2.5"/>`).add(`<circle class="sch-w" cx="${jx}" cy="${R.CV - 13}" r="2.5"/>`);
  s.wire([260, R.CV + 1], [jx + 2, R.CV + 16]); // the blade, shown closed to ground
  s.ground(jx, R.CV + 19.5);
  s.resistor(jx, R.CV - 46, jx, R.CV - 15.5).label(jx, R.CV - 31, 'R19', val.r19, 'right');
  s.text(jx, R.CV - 52, 'SYS', { cls: 'sch-net', anchor: 'middle' });
  s.text(272, R.CV + 36, 'CV1', { cls: 'sch-ref', anchor: 'start' });

  // --- STAT: LED and its resistor, powered from the higher of SYS and BAT through the D2 pair
  s.wire([lx, R.STAT], [262, R.STAT]);
  s.resistor(206, R.STAT, 262, R.STAT);
  s.text(234, R.STAT + 24, 'R1', { cls: 'sch-ref', anchor: 'middle' }).text(234, R.STAT + 37, val.r1, { cls: 'sch-val', anchor: 'middle' });
  s.wire([190, R.STAT], [206, R.STAT]);
  s.diode(142, R.STAT, 190, R.STAT, { kind: 'led', side: -1 });
  s.text(166, R.STAT + 24, 'D1', { cls: 'sch-ref', anchor: 'middle' }).text(166, R.STAT + 37, 'LED', { cls: 'sch-val', anchor: 'middle' });
  s.wire([100, R.STAT], [142, R.STAT]).dot(100, R.STAT);
  s.diode(100, R.STAT - 48, 100, R.STAT).diode(100, R.STAT + 48, 100, R.STAT);
  s.text(100, R.STAT - 54, 'SYS', { cls: 'sch-net', anchor: 'middle' }).text(100, R.STAT + 64, 'BAT', { cls: 'sch-net', anchor: 'middle' });
  s.text(90, R.STAT + 32, 'D2', { cls: 'sch-ref', anchor: 'end' }).text(90, R.STAT + 45, 'BAT54C', { cls: 'sch-val', anchor: 'end' });

  // --- current-setting resistors on the top pins (they run up the page to ground)
  const top = [['R4', val.r4, 330], ['R5', val.r5, 410], ['R6', val.r6, 490]];
  for (const [ref, v, x] of top) s.wire([x, ic.y - 12], [x, 78]).resistor(x, 78, x, 36).groundUp(x, 36).label(x, 57, ref, v);

  // --- SYS rail with two output capacitors, and the SYS port
  s.wire([rx, Q.SYS], [860, Q.SYS]);
  s.capacitor(720, Q.SYS, 720, 185).ground(720, 185).dot(720, Q.SYS).label(720, 160, 'C4', val.c4);
  s.capacitor(800, Q.SYS, 800, 185).ground(800, 185).dot(800, Q.SYS).label(800, 160, 'C5', val.c5);
  s.port(860, Q.SYS, 'SYS', 'out').text(906, Q.SYS + 26, '5.15 V', { cls: 'sch-net', anchor: 'end' });

  // --- LX, inductor, battery node
  s.wire([rx, Q.LX], [580, Q.LX]).inductor(580, Q.LX, 660, Q.LX).label(620, Q.LX, 'L1', val.l1, 'above');
  s.wire([660, Q.LX], [690, Q.LX], [690, Q.BAT]).dot(690, Q.LX);
  s.wire([rx, Q.BAT], [830, Q.BAT]).dot(690, Q.BAT);
  s.capacitor(690, Q.BAT, 690, 305).ground(690, 305).label(690, 275, 'C6', val.c6, 'left');
  s.dot(750, Q.BAT).capacitor(750, Q.BAT, 750, 305).ground(750, 305).label(750, 275, 'C3', val.c3);
  s.port(830, Q.BAT, 'BAT', 'out').text(876, Q.BAT + 26, 'Li-Ion cell', { cls: 'sch-net', anchor: 'end' });

  // --- OTGB: pulled up to the battery node (pull low to enable boost)
  s.wire([rx, Q.OTGB], [600, Q.OTGB]).dot(600, Q.BAT).resistor(600, Q.BAT, 600, Q.OTGB).label(600, 272, 'R8', val.r8, 'left');

  // --- USB data lines: zener clamp to ground, then a series resistor to the port
  for (const [pin, zref, rref, rval, port] of [[Q.DP, 'D4', 'R7', val.r7, 'DO+'], [Q.DM, 'D3', 'R12', val.r12, 'DO−']]) {
    s.wire([rx, pin], [560, pin]).dot(560, pin);
    s.diode(560, pin + 26, 560, pin, { kind: 'zener' }).ground(560, pin + 26).label(560, pin + 17, zref, '5.1 V');
    s.resistor(560, pin, 640, pin).label(600, pin, rref, rval, 'above');
    s.wire([640, pin], [680, pin]).port(680, pin, port, 'out');
  }

  // --- LX snubber, drawn apart from the main circuit as in the datasheet
  s.text(40, 444, 'LX', { cls: 'sch-net', anchor: 'start' });
  s.wire([58, 440], [68, 440]).capacitor(68, 440, 108, 440).label(88, 440, 'C8', val.c8, 'above');
  s.resistor(108, 440, 170, 440).label(139, 440, 'R10', val.r10, 'above');
  s.ground(170, 440);
  return s;
}

/**
 * SY20757: single-cell power bank regulator with two USB-A output ports and one micro-USB input port, redrawn from the
 * datasheet's typical application (Figure 1). The datasheet gives no values for most parts, so only the labels it uses
 * are drawn; the few values it does state are passed in `v`.
 * Each output port switches its ground return through a MOSFET and a 10 mΩ sense resistor, so VBUS goes straight to the
 * BUS net. BUS is drawn as a net label to keep the left side free of long wires.
 */
export function usbPowerBank({ id, part, v = {} }) {
  const val = { cin: '10 µF', cbus: '≥ 20 µF', cbat: '≥ 20 µF', lb: '2.2 µH', cbst: '0.1 µF', cvdd: '1 µF', rs: '10 mΩ', rntcUp: '10 kΩ', rntc: '10 kΩ, 103-AT', ...v };
  const s = new Sheet(960, 900, {
    id,
    top: 40,
    title: `${part} typical application`,
    desc:
      `Typical application of the ${part} power bank regulator, redrawn from the datasheet. The micro-USB input port connects VBUS to the IN pin, which has a ${val.cin} capacitor, and its D+ and D- lines to DPB and DMB. ` +
      `Two USB Type-A output ports, A1 and A2, take VBUS from the BUS net, which has a ${val.cbus} capacitor, and their D+ and D- lines go to DPA and DMA pins. ` +
      `Each port's ground pin returns through a ${val.rs} sense resistor (RS1, RS2), with the SRP and SRN pins on either side of it, to an N-channel MOSFET (Q1, Q2) driven from the GA1/ITERM or GA2/VOCOM pin. ` +
      `A resistor and a diode, with no designator or value in the datasheet, sit across each MOSFET. RITERM on GA1/ITERM and RO_COMP on GA2/VOCOM are resistors to ground. ` +
      `LX drives a ${val.lb} inductor to the battery, with a ${val.cbst} bootstrap capacitor from BST to LX and a ${val.cbat} capacitor on the battery. BAT connects to the inductor's battery end. ` +
      `A 3.3 V regulator output VDD has a ${val.cvdd} capacitor and feeds the NTC divider, RNTC_UP (${val.rntcUp}) above the thermistor RNTC (${val.rntc}). ` +
      `The CV pin is left open, pulled low or pulled high to choose the charge voltage. RF from BAT to the KEY/FSW pin sets the boost frequency, and a key switch pulls the pin to ground. ` +
      `RCHG sets the charge current, RPEAK1 and RPEAK2 set the boost peak current and the battery resistance compensation, and four LEDs on LED1 to LED4 each have a resistor, RLED1 to RLED4, in parallel.`,
  });
  const IC = { x: 340, y: 165, w: 280, h: 575 };
  const lx = IC.x - 12;
  const rx = IC.x + IC.w + 12;
  const icBottom = IC.y + IC.h;

  // Rows of one output port, measured from its VBUS terminal y0.
  const port = (y0) => ({ vbus: y0, dp: y0 + 22, dm: y0 + 44, srp: y0 + 76, srn: y0 + 98, chain: y0 + 128, gate: y0 + 150, bot: y0 + 172 });
  const A1 = port(205);
  const A2 = port(505);
  const busY = 455;
  const R = { VDD: 215, NTC: 275, CV: 335, BST: 385, LX: 425, BAT: 475, KEY: 530, ICHG: 585, IPEAK: 630, RCOM: 665 };
  const ledX = [370, 440, 510, 580];
  const botX = { IN: 370, DPB: 430, DMB: 490, SGND: 550, GND: 595 };

  s.ic(IC.x, IC.y, IC.w, IC.h, {
    left: [
      { name: 'DPA1', y: A1.dp }, { name: 'DMA1', y: A1.dm }, { name: 'SRPA1', y: A1.srp }, { name: 'SRNA1', y: A1.srn }, { name: 'GA1/ITERM', y: A1.gate },
      { name: 'BUS', y: busY },
      { name: 'DPA2', y: A2.dp }, { name: 'DMA2', y: A2.dm }, { name: 'SRPA2', y: A2.srp }, { name: 'SRNA2', y: A2.srn }, { name: 'GA2/VOCOM', y: A2.gate },
    ],
    right: Object.entries(R).map(([k, y]) => ({ name: k === 'KEY' ? 'KEY/FSW' : k, y })),
    top: ledX.map((x, i) => ({ name: `LED${i + 1}`, x })),
    bottom: Object.entries(botX).map(([name, x]) => ({ name, x })),
  }, { title: part });

  // ---- the two output ports, on the left
  const outPort = (g, n, gateRes, gateVal) => {
    const bx = 16, bw = 72;
    s.add(`<rect class="sch-ic" x="${bx}" y="${g.vbus - 18}" width="${bw}" height="${g.chain + 22 - (g.vbus - 18)}" rx="3"/>`);
    for (const [name, y] of [['VBUS', g.vbus], ['D+', g.dp], ['D−', g.dm], ['GND', g.chain]]) s.text(bx + bw - 6, y + 4, name, { cls: 'sch-pin', anchor: 'end' });
    s.text(bx + bw / 2, g.chain + 40, `Port A${n}`, { cls: 'sch-ref', anchor: 'middle' }).text(bx + bw / 2, g.chain + 53, 'USB-A', { cls: 'sch-val', anchor: 'middle' });
    // VBUS to the BUS net
    s.wire([bx + bw, g.vbus], [118, g.vbus]).text(124, g.vbus + 4, 'BUS', { cls: 'sch-net' });
    // data lines straight across
    s.wire([bx + bw, g.dp], [lx, g.dp]).wire([bx + bw, g.dm], [lx, g.dm]);
    // ground return: P node, sense resistor, N node, drain rail
    s.wire([bx + bw, g.chain], [112, g.chain]).dot(112, g.chain);
    s.wire([112, g.chain], [112, g.srp], [lx, g.srp]);
    s.resistor(112, g.chain, 160, g.chain).label(136, g.chain, `RS${n}`, val.rs, 'above');
    s.dot(160, g.chain).wire([160, g.chain], [160, g.srn], [lx, g.srn]);
    s.wire([160, g.chain], [276, g.chain]);
    // across the MOSFET: resistor and diode (unlabelled in the datasheet), then the MOSFET itself
    s.dot(200, g.chain).resistor(200, g.chain, 200, g.bot);
    s.dot(238, g.chain).diode(238, g.bot, 238, g.chain);
    s.nmosV(276, g.chain, g.bot);
    s.text(290, g.gate - 18, `Q${n}`, { cls: 'sch-ref' });
    s.wire([200, g.bot], [276, g.bot]).dot(238, g.bot).ground(238, g.bot);
    // gate to GAn, with the resistor to ground that the datasheet reads at start-up
    s.wire([298, g.gate], [lx, g.gate]).dot(314, g.gate);
    s.resistor(314, g.gate, 314, g.gate + 40).ground(314, g.gate + 40).text(322, g.gate + 76, refMarkup(gateRes), { cls: 'sch-ref', anchor: 'end', raw: true });
  };
  outPort(A1, 1, 'RITERM', '');
  outPort(A2, 2, 'RO_COMP', '');

  // ---- BUS pin and its capacitor
  s.wire([lx, busY], [236, busY]).text(230, busY + 4, 'BUS', { cls: 'sch-net', anchor: 'end' });
  s.dot(270, busY).capacitor(270, busY, 270, busY + 36).ground(270, busY + 36).label(270, busY + 18, 'CBUS', val.cbus, 'left');

  // ---- LEDs along the top, each with a resistor in parallel; all return to a ground bar
  const ly = { bot: 135, top: 87, bus: 70 };
  ledX.forEach((x, i) => {
    s.wire([x, IC.y - 12], [x, ly.bot]).dot(x, ly.bot);
    s.diode(x, ly.bot, x, ly.top, { kind: 'led', side: 1 });
    s.resistor(x - 26, ly.bot, x - 26, ly.top);
    s.wire([x - 26, ly.bot], [x, ly.bot]).wire([x - 26, ly.top], [x, ly.top]).dot(x, ly.top);
    s.wire([x, ly.top], [x, ly.bus]);
    s.text(x - 32, ly.bot + 14, refMarkup(`RLED${i + 1}`), { cls: 'sch-ref', anchor: 'end', raw: true });
  });
  s.wire([ledX[0], ly.bus], [ledX[3], ly.bus]).groundUp(ledX[3] + 20, ly.bus).wire([ledX[3], ly.bus], [ledX[3] + 20, ly.bus]);

  // ---- VDD, its capacitor, and the thermistor divider on NTC
  s.wire([rx, R.VDD], [710, R.VDD]).dot(670, R.VDD).dot(710, R.VDD);
  s.capacitor(670, R.VDD, 670, R.VDD - 34).groundUp(670, R.VDD - 34).label(670, R.VDD - 17, 'CVDD', val.cvdd, 'right');
  s.resistor(710, R.VDD, 710, R.NTC).label(710, (R.VDD + R.NTC) / 2, 'RNTC_UP', val.rntcUp, 'right');
  s.wire([rx, R.NTC], [830, R.NTC]).dot(710, R.NTC);
  s.resistor(830, R.NTC, 830, R.CV).ground(830, R.CV).label(830, (R.NTC + R.CV) / 2, 'RNTC', val.rntc, 'right');
  s.wire([rx, R.CV], [670, R.CV]).text(676, R.CV + 4, 'open / low / high', { cls: 'sch-val' });

  // ---- BST, LX, inductor, battery node
  s.wire([rx, R.BST], [670, R.BST]).dot(670, R.BST).capacitor(670, R.BST, 670, R.LX).label(670, (R.BST + R.LX) / 2, 'CBST', val.cbst, 'right');
  s.wire([rx, R.LX], [690, R.LX]).dot(670, R.LX).inductor(690, R.LX, 780, R.LX);
  s.text(735, R.LX + 22, refMarkup('LB'), { cls: 'sch-ref', anchor: 'middle', raw: true }).text(735, R.LX + 35, val.lb, { cls: 'sch-val', anchor: 'middle' });
  s.wire([780, R.LX], [900, R.LX]).dot(790, R.LX);
  s.wire([790, R.LX], [790, R.BAT], [rx, R.BAT]).dot(790, R.LX);
  s.dot(840, R.LX).capacitor(840, R.LX, 840, R.LX + 60).ground(840, R.LX + 60).text(840, R.LX + 92, refMarkup('CBAT'), { cls: 'sch-ref', anchor: 'middle', raw: true }).text(840, R.LX + 105, val.cbat, { cls: 'sch-val', anchor: 'middle' });
  // battery symbol at the right-hand end
  s.wire([900, R.LX], [900, R.LX + 44]);
  s.wire([888, R.LX + 44], [912, R.LX + 44]).wire([894, R.LX + 50], [906, R.LX + 50]).wire([900, R.LX + 50], [900, R.LX + 76]).ground(900, R.LX + 76);
  s.text(916, R.LX + 40, 'Li-Ion', { cls: 'sch-val' }).text(916, R.LX + 53, 'cell', { cls: 'sch-val' });

  // ---- RF and the key switch on KEY/FSW
  s.dot(700, R.BAT).resistor(700, R.BAT, 700, R.KEY).label(700, (R.BAT + R.KEY) / 2, 'RF', '', 'right');
  s.wire([rx, R.KEY], [730, R.KEY]).dot(700, R.KEY);
  s.add(`<circle class="sch-w" cx="730" cy="${R.KEY}" r="2.5"/>`).add(`<circle class="sch-w" cx="766" cy="${R.KEY}" r="2.5"/>`);
  s.wire([731, R.KEY - 2], [762, R.KEY - 16]).wire([768, R.KEY], [790, R.KEY]).ground(790, R.KEY);
  s.text(748, R.KEY - 26, 'KEY', { cls: 'sch-ref', anchor: 'middle' });

  // ---- ICHG: charge-current resistor to ground
  s.wire([rx, R.ICHG], [670, R.ICHG]).resistor(670, R.ICHG, 740, R.ICHG).text(705, R.ICHG + 24, refMarkup('RCHG'), { cls: 'sch-ref', anchor: 'middle', raw: true });
  s.wire([740, R.ICHG], [770, R.ICHG]).ground(770, R.ICHG);

  // ---- IPEAK and RCOM: two resistors in series to ground, tapped by RCOM
  s.wire([rx, R.IPEAK], [690, R.IPEAK]).resistor(690, R.IPEAK, 690, R.RCOM).label(690, (R.IPEAK + R.RCOM) / 2, 'RPEAK1', '', 'right');
  s.wire([rx, R.RCOM], [690, R.RCOM]).dot(690, R.RCOM).resistor(690, R.RCOM, 690, R.RCOM + 60).ground(690, R.RCOM + 60).label(690, R.RCOM + 30, 'RPEAK2', '', 'right');

  // ---- grounds and the micro-USB input port on the bottom edge
  s.ground(botX.SGND, icBottom + 12).ground(botX.GND, icBottom + 12);
  const by = 800;
  s.wire([botX.IN, icBottom + 12], [botX.IN, by]).dot(botX.IN, icBottom + 30);
  s.wire([botX.IN, icBottom + 30], [320, icBottom + 30]).capacitor(320, icBottom + 30, 320, icBottom + 72).ground(320, icBottom + 72).label(320, icBottom + 51, 'CIN', val.cin, 'left');
  s.wire([botX.DPB, icBottom + 12], [botX.DPB, by]).wire([botX.DMB, icBottom + 12], [botX.DMB, by]);
  s.add(`<rect class="sch-ic" x="350" y="${by}" width="170" height="60" rx="3"/>`);
  for (const [name, x] of [['VBUS', botX.IN], ['D+', botX.DPB], ['D−', botX.DMB]]) s.text(x, by + 16, name, { cls: 'sch-pin', anchor: 'middle' });
  s.text(435, by + 44, 'Port B: micro-USB input', { cls: 'sch-ref', anchor: 'middle' });
  s.wire([505, by + 60], [505, by + 66]).ground(505, by + 66);
  return s;
}
