// Drawings for the Silergy SY87004A synchronous boost regulator with bypass mode.
//
// 1. bypassBoostApplication: the "Schematic" on page 13 of the datasheet (DS_SY87004A Rev 1.0), with the BOM values:
//    C7 100 µF, C1 22 µF, C2 0.1 µF on the battery, L1 0.47 µH, C3 to C6 10 µF on the output, and the enable switch k
//    with R4 1 MΩ to ground. The ADDR, SDA and SCL pins go to the I2C address selection and the I2C bus.
// 2. esp32s3I2cWiringSy87004a: our own wiring for the Arduino section. The datasheet draws no host connection, so the
//    pull-up values, the ADDR strap and the EN jumper are our choices, described on the part page.
import { Sheet } from './lib.mjs';

export function bypassBoostApplication({ id, part = 'SY87004A' }) {
  const GY = 395; // ground line of the tall columns
  const RAIL = 150; // battery rail, level with the LX pin
  const s = new Sheet(840, 430, {
    id,
    top: 90,
    title: `${part} typical application`,
    desc:
      `Typical application of the ${part} boost regulator with bypass mode, redrawn from the datasheet's Schematic (page 13). ` +
      `The battery, 1.9 to 5.5 V, has a 100 µF electrolytic, a 22 µF and a 0.1 µF capacitor to ground, feeds the VIN pin, and feeds a 0.47 µH inductor L1 that goes to the LX pin. ` +
      `The EN pin is driven from the battery through a switch k, with a 1 MΩ resistor R4 from EN to ground. ` +
      `The VOUT pin, 2.85 to 5.5 V, has four 10 µF capacitors to ground. The ADDR pin is pulled high, pulled low or left floating to choose the I2C address, and the SDA and SCL pins go to the I2C bus.`,
  });
  const ic = { x: 370, y: 110, w: 170, h: 260 };
  const L = ic.x - 12;
  const R = ic.x + ic.w + 12;
  const pin = { lx: 150, vin: 190, en: 300, vout: 150, addr: 280, sda: 315, scl: 350 };
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'LX', y: pin.lx }, { name: 'VIN', y: pin.vin }, { name: 'EN', y: pin.en }],
    right: [{ name: 'VOUT', y: pin.vout }, { name: 'ADDR', y: pin.addr }, { name: 'SDA', y: pin.sda }, { name: 'SCL', y: pin.scl }],
    bottom: [{ name: 'PGND', x: 455 }],
  }, { title: part });
  s.wire([455, ic.y + ic.h + 12], [455, GY - 12]).ground(455, GY - 12);

  // battery rail with its three capacitors
  s.port(54, RAIL, 'Battery', 'in').text(8, RAIL + 26, '1.9–5.5 V', { cls: 'sch-net', anchor: 'start' });
  s.wire([54, RAIL], [320, RAIL]);
  s.dot(120, RAIL).capacitor(120, RAIL, 120, GY, { polarized: true }).ground(120, GY).label(120, 290, 'C7', '100 µF', 'left');
  s.dot(180, RAIL).capacitor(180, RAIL, 180, GY).ground(180, GY).label(180, 290, 'C1', '22 µF');
  s.dot(240, RAIL).capacitor(240, RAIL, 240, GY).ground(240, GY).label(240, 290, 'C2', '0.1 µF');

  // VIN tap, then the inductor to LX
  s.dot(300, RAIL).wire([300, RAIL], [300, pin.vin], [L, pin.vin]);
  s.inductor(320, RAIL, 368, RAIL).label(344, RAIL, 'L1', '0.47 µH', 'above');

  // enable: switch k from the battery node, R4 to ground
  s.dot(300, pin.vin);
  s.wire([300, pin.vin], [300, 222]);
  s.add(`<circle class="sch-w" cx="300" cy="226" r="3"/>`);
  s.add(`<path class="sch-w" d="M300 250 L312 230"/>`);
  s.add(`<circle class="sch-w" cx="300" cy="254" r="3"/>`);
  s.text(318, 245, 'k', { cls: 'sch-ref', anchor: 'start' });
  s.wire([300, 257], [300, pin.en]).dot(300, pin.en).wire([300, pin.en], [L, pin.en]);
  s.resistor(300, pin.en, 300, GY).ground(300, GY).label(300, 350, 'R4', '1 MΩ');

  // output rail with four capacitors
  s.wire([R, pin.vout], [760, pin.vout]);
  s.add(`<circle class="sch-w" cx="764" cy="${pin.vout}" r="3.5"/>`);
  s.text(764, pin.vout - 14, 'VOUT 2.85–5.5 V', { cls: 'sch-net', anchor: 'end' });
  const cx = [600, 645, 690, 735];
  ['C3', 'C4', 'C5', 'C6'].forEach((ref, i) => {
    s.dot(cx[i], pin.vout).capacitor(cx[i], pin.vout, cx[i], 220).ground(cx[i], 220).label(cx[i], 186, ref, '');
  });
  s.text(667, 256, 'C3 to C6: 10 µF each', { cls: 'sch-val', anchor: 'middle' });

  // I2C pins
  const bx = 640;
  s.wire([R, pin.addr], [bx, pin.addr]);
  s.add(`<circle class="sch-w" cx="${bx + 4}" cy="${pin.addr}" r="3.5"/>`);
  s.text(bx + 14, pin.addr + 4, 'I2C address: H, L or floating', { cls: 'sch-val', anchor: 'start' });
  s.wire([R, pin.sda], [bx, pin.sda]).port(bx, pin.sda, 'SDA', 'out');
  s.wire([R, pin.scl], [bx, pin.scl]).port(bx, pin.scl, 'SCL', 'out');
  return s;
}

export function esp32s3I2cWiringSy87004a({ id, part = 'SY87004A', pullup = '4.7 kΩ' }) {
  const s = new Sheet(680, 440, {
    top: 20,
    id,
    title: `${part} wired to an ESP32-S3 over I2C`,
    desc:
      `Wiring for talking to an ${part} from an ESP32-S3 dev board. The board's 3V3 pin feeds only the two pull-ups. ` +
      `ESP32-S3 GPIO9 (SCL) goes to the SCL pin and GPIO8 (SDA) to the SDA pin, each with a ${pullup} pull-up to 3.3 V. ` +
      `The ADDR pin is tied to ground, which selects the address 0x75. The EN pin is joined to the battery through a jumper and has a 1 MΩ resistor to ground. ` +
      `The regulator's own supply, the battery, goes to VIN and the grounds of the board and the regulator are joined. The inductor and capacitors are as in the application circuit.`,
  });
  const rail = 50; // 3.3 V rail
  const railEnd = 330;

  // ---- ESP32-S3 dev board (right-hand pins only)
  const mcu = { x: 10, y: 90, w: 120, h: 270 };
  s.ic(mcu.x, mcu.y, mcu.w, mcu.h, {
    right: [{ name: 'GPIO9 (SCL)', y: 150 }, { name: 'GPIO8 (SDA)', y: 180 }, { name: 'GND', y: 330 }],
    top: [{ name: '3V3', x: 70 }],
  }, { title: 'ESP32-S3', subtitle: 'dev board, 3.3 V' });
  s.text(10, rail - 8, '3.3 V', { cls: 'sch-net', anchor: 'start' });
  s.wire([70, mcu.y - 12], [70, rail]).wire([70, rail], [railEnd, rail]);

  // ---- the part
  const ic = { x: 400, y: 90, w: 150, h: 270 };
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'SCL', y: 150 }, { name: 'SDA', y: 180 }, { name: 'ADDR', y: 250 }],
    right: [{ name: 'VIN', y: 130 }, { name: 'EN', y: 290 }],
    bottom: [{ name: 'PGND', x: 475 }],
  }, { title: part });

  // ---- SCL and SDA, each with a pull-up to 3.3 V (the SDA pull-up's wire hops over nothing: SCL is above it)
  const xScl = 230, xSda = 290;
  s.hwire(150, 142, 388, [xSda]);
  s.dot(xScl, 150).resistor(xScl, 150, xScl, rail).dot(xScl, rail).label(xScl, 100, 'RPU1', pullup, 'left');
  s.wire([142, 180], [388, 180]);
  s.dot(xSda, 180).resistor(xSda, 180, xSda, rail).dot(xSda, rail).label(xSda, 115, 'RPU2', pullup, 'right');

  // ---- ADDR strapped low: address 0x75
  s.wire([388, 250], [350, 250]).ground(350, 250);
  s.text(340, 242, 'address 0x75', { cls: 'sch-val', anchor: 'end' });

  // ---- common ground: board GND to PGND
  s.wire([142, 330], [200, 330], [200, 400], [475, 400], [475, ic.y + ic.h + 12]);
  s.dot(475, 400).ground(475, 400);
  s.text(206, 393, 'join the grounds', { cls: 'sch-val', anchor: 'start' });

  // ---- supply, enable jumper and R4 on the right
  s.wire([562, 130], [620, 130]).port(620, 130, 'Battery', 'out');
  s.text(560, 100, '1.9–5.5 V', { cls: 'sch-net', anchor: 'start' });
  s.dot(590, 130).wire([590, 130], [590, 205]);
  s.add(`<circle class="sch-w" cx="590" cy="209" r="3"/>`);
  s.add(`<path class="sch-w" d="M590 233 L602 213"/>`);
  s.add(`<circle class="sch-w" cx="590" cy="237" r="3"/>`);
  s.text(608, 228, 'jumper', { cls: 'sch-val', anchor: 'start' });
  s.wire([590, 240], [590, 290]).dot(590, 290).wire([562, 290], [590, 290]);
  s.resistor(590, 290, 590, 400).ground(590, 400).label(590, 350, 'R4', '1 MΩ');

  s.text(10, 425, 'LX, VOUT, the inductor and the capacitors are as in the application circuit.', { cls: 'sch-val', anchor: 'start' });
  return s;
}
