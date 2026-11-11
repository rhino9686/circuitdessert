// Drawing for the Silergy SY6862F USB PD power mux: Figure 1 / section 18 ("Application Schematic") of the datasheet.
// VCHG, V5V and VBAT each have a decoupling capacitor; VBUS has a capacitor and a TVS; each CONN_CC line has a 330 pF capacitor and a TVS;
// SDA, SCL and ALERT_L have pull-ups to VIO; EN and FRS_EN have 1 MΩ pull-downs; ADDR is tied to ground through 0 Ω.
// Simplification, stated in the page caption: the datasheet draws EN and FRS_EN with a switch (K1, K2) to VIO; here they are plain control inputs.
import { Sheet } from './lib.mjs';

export function powerMux({ id, part = 'SY6862F' }) {
  const GY = 700; // the IC's own ground row
  const s = new Sheet(880, 740, {
    top: 50,
    id,
    title: `${part} reference circuit`,
    desc:
      `Application circuit for the ${part} two-to-one USB PD power mux, redrawn from the datasheet. ` +
      `VCHG comes from the charger path through a 10 µF capacitor C1, V5V from the 5 V rail through a 10 µF capacitor C3, and VBAT through a 1 µF capacitor C6. ` +
      `VBUS goes to the Type-C connector with a 10 µF capacitor C2 and a TVS diode D1 to ground. ` +
      `HOST_CC1 and HOST_CC2 go to the PD controller, and CONN_CC1 and CONN_CC2 go to the connector, each with a 330 pF capacitor (C4, C5) and a TVS diode (D2, D3) to ground. ` +
      `SDA, SCL and ALERT_L have pull-up resistors R4, R3 and R5 to VIO, EN and FRS_EN have 1 MΩ pull-down resistors R1 and R2, and a 0 Ω resistor R6 ties ADDR to ground.`,
  });
  const GYB = 660; // ground row for the control-pin resistors
  const ic = { x: 330, y: 70, w: 260, h: 540 };
  const row = { vchg: 100, v5v: 170, vbat: 240, h1: 310, h2: 350, alert: 440, sda: 470, scl: 500, frs: 530, en: 560 };
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [
      { name: 'VCHG', y: row.vchg }, { name: 'V5V', y: row.v5v }, { name: 'VBAT', y: row.vbat },
      { name: 'HOST_CC1', y: row.h1 }, { name: 'HOST_CC2', y: row.h2 },
      { name: 'ALERT_L', y: row.alert }, { name: 'SDA', y: row.sda }, { name: 'SCL', y: row.scl },
      { name: 'FRS_EN', y: row.frs }, { name: 'EN', y: row.en },
    ],
    right: [{ name: 'VBUS', y: row.vchg }, { name: 'CONN_CC1', y: 250 }, { name: 'CONN_CC2', y: 330 }, { name: 'ADDR', y: 500 }],
    bottom: [{ name: 'GND', x: 460 }],
  }, { title: part });
  s.wire([460, ic.y + ic.h + 12], [460, GY - 18]).ground(460, GY - 18);

  const term = (x, y, name) => { s.add(`<circle class="sch-w" cx="${x}" cy="${y}" r="2.5"/>`); s.text(x - 8, y + 4, name, { cls: 'sch-net', anchor: 'end' }); };
  const L = ic.x - 12; // left end of the IC pin stubs
  const TX = 96; // terminals on the left

  // ---------------------------------------------------------------- left: the three supply pins, each with a capacitor
  const supply = (y, name, cx, ref, val) => {
    term(TX, y, name);
    s.wire([TX + 2, y], [L, y]).dot(cx, y).capacitor(cx, y, cx, y + 40).ground(cx, y + 40).label(cx, y + 20, ref, val, 'right');
  };
  supply(row.vchg, 'charger', 220, 'C1', '10 µF');
  supply(row.v5v, '5 V', 220, 'C3', '10 µF');
  supply(row.vbat, 'VBAT', 220, 'C6', '1 µF');

  // ---------------------------------------------------------------- left: CC lines to the PD controller
  term(TX, row.h1, 'PD ctrl CC1'); s.wire([TX + 2, row.h1], [L, row.h1]);
  term(TX, row.h2, 'PD ctrl CC2'); s.wire([TX + 2, row.h2], [L, row.h2]);

  // ---------------------------------------------------------------- left: ALERT_L, SDA and SCL with pull-ups to VIO
  const vioY = 390;
  const pu = [{ x: 130, y: row.alert, ref: 'R5', val: '100 kΩ' }, { x: 190, y: row.sda, ref: 'R4', val: '10 kΩ' }, { x: 250, y: row.scl, ref: 'R3', val: '10 kΩ' }];
  s.wire([pu[0].x, vioY], [pu[2].x, vioY]).text(pu[0].x - 8, vioY + 4, 'VIO', { cls: 'sch-net', anchor: 'end' });
  [{ y: row.alert, name: 'ALERT_L' }, { y: row.sda, name: 'SDA' }, { y: row.scl, name: 'SCL' }].forEach((sg, i) => {
    term(TX, sg.y, sg.name);
    s.hwire(sg.y, TX + 2, L, pu.slice(i + 1).map((q) => q.x)); // later pull-ups run down past this row
    const p = pu[i];
    s.wire([p.x, vioY], [p.x, vioY + 10]).resistor(p.x, vioY + 10, p.x, vioY + 50).wire([p.x, vioY + 50], [p.x, sg.y]).dot(p.x, sg.y);
    s.label(p.x, vioY + 31, p.ref, p.val, 'right');
  });

  // ---------------------------------------------------------------- left: EN and FRS_EN with 1 MΩ pull-downs
  term(TX, row.frs, 'FRS_EN'); s.wire([TX + 2, row.frs], [L, row.frs]);
  term(TX, row.en, 'EN'); s.hwire(row.en, TX + 2, L, [130]);
  [{ x: 130, y: row.frs, ref: 'R2' }, { x: 190, y: row.en, ref: 'R1' }].forEach((p) => {
    s.wire([p.x, p.y], [p.x, GYB - 60]).dot(p.x, p.y).resistor(p.x, GYB - 60, p.x, GYB - 20).wire([p.x, GYB - 20], [p.x, GYB]).ground(p.x, GYB);
    s.label(p.x, GYB - 38, p.ref, '1 MΩ', 'right');
  });

  // ---------------------------------------------------------------- right: VBUS with capacitor and TVS, then the connector
  const R = ic.x + ic.w + 12;
  const outX = 800;
  s.wire([R, row.vchg], [outX, row.vchg]).dot(650, row.vchg).dot(710, row.vchg);
  s.capacitor(650, row.vchg, 650, row.vchg + 40).ground(650, row.vchg + 40).label(650, row.vchg + 20, 'C2', '10 µF', 'left');
  s.diode(710, row.vchg + 40, 710, row.vchg, { kind: 'zener' }).ground(710, row.vchg + 40).label(710, row.vchg + 20, 'D1', 'TVS', 'right');
  s.port(outX, row.vchg, 'VBUS', 'out');

  // ---------------------------------------------------------------- right: CONN_CC1 and CONN_CC2 with 330 pF and a TVS each
  const cc = (y, name, c, d) => {
    s.wire([R, y], [outX, y]).dot(650, y).dot(710, y);
    s.capacitor(650, y, 650, y + 40).ground(650, y + 40).label(650, y + 20, c, '330 pF', 'left');
    s.diode(710, y + 40, 710, y, { kind: 'zener' }).ground(710, y + 40).label(710, y + 20, d, 'TVS', 'right');
    s.port(outX, y, name, 'out');
  };
  cc(250, 'CC1', 'C4', 'D2');
  cc(330, 'CC2', 'C5', 'D3');

  // ---------------------------------------------------------------- right: ADDR through 0 Ω to ground
  s.wire([R, 500], [740, 500]).resistor(740, 500, 740, 560).ground(740, 560).label(740, 530, 'R6', '0 Ω', 'right');
  return s;
}
