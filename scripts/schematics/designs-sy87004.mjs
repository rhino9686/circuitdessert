// Drawing for the Silergy SY87004 synchronous boost regulator with bypass mode (the part without the A).
//
// bypassBoostFigure1: Figure 1 on page 1 of the datasheet (DS_SY87004 Rev 1.0A): a 100 µF and a 22 µF capacitor on the
//    input, L1 0.47 µH, COUT 10 µF × 4 on the output, EN driven by an ON/OFF signal, and the ADDR, SDA and SCL pins going to
//    the I2C address selection and the I2C bus. The datasheet has no separate schematic page or bill of materials, so only
//    the values Figure 1 prints are shown (the efficiency plot adds the CSAB0420-R47M part number for L1).
//
// The ESP32-S3 wiring drawing for this part is esp32s3I2cWiringSy87004a in designs-sy87004a.mjs, called with part: 'SY87004'.
import { Sheet } from './lib.mjs';

export function bypassBoostFigure1({ id, part = 'SY87004' }) {
  const GY = 395; // ground line of the tall columns
  const RAIL = 150; // input rail, level with the LX pin
  const s = new Sheet(840, 430, {
    id,
    top: 90,
    title: `${part} typical application`,
    desc:
      `Typical application of the ${part} boost regulator with bypass mode, redrawn from the datasheet's Figure 1. ` +
      `The input, 1.9 to 5.5 V, has a 100 µF and a 22 µF capacitor to ground, feeds the VIN pin, and feeds a 0.47 µH inductor L1 that goes to the LX pin. ` +
      `The EN pin is driven by an ON/OFF signal. The VOUT pin, 2.85 to 5.5 V, has a capacitor COUT drawn as 10 µF times four to ground. ` +
      `The ADDR pin is pulled high, pulled low or left floating to choose the I2C address, and the SDA and SCL pins go to the I2C bus.`,
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

  // input rail with its two capacitors (both labelled CIN in the datasheet)
  s.port(54, RAIL, 'VIN', 'in').text(8, RAIL + 26, '1.9–5.5 V', { cls: 'sch-net', anchor: 'start' });
  s.wire([54, RAIL], [320, RAIL]);
  s.dot(120, RAIL).capacitor(120, RAIL, 120, GY, { polarized: true }).ground(120, GY).label(120, 290, 'CIN', '100 µF', 'left');
  s.dot(190, RAIL).capacitor(190, RAIL, 190, GY).ground(190, GY).label(190, 235, 'CIN', '22 µF');

  // VIN tap, then the inductor to LX
  s.dot(300, RAIL).wire([300, RAIL], [300, pin.vin], [L, pin.vin]);
  s.inductor(320, RAIL, 368, RAIL).label(344, RAIL, 'L1', '0.47 µH', 'above');

  // enable: an ON/OFF signal from the host
  s.wire([262, pin.en], [L, pin.en]);
  s.add(`<circle class="sch-w" cx="258" cy="${pin.en}" r="3.5"/>`);
  s.text(248, pin.en + 4, 'ON/OFF', { cls: 'sch-val', anchor: 'end' });

  // output rail with COUT drawn as one capacitor, 10 µF x 4
  s.wire([R, pin.vout], [760, pin.vout]);
  s.add(`<circle class="sch-w" cx="764" cy="${pin.vout}" r="3.5"/>`);
  s.text(764, pin.vout - 14, 'VOUT 2.85–5.5 V', { cls: 'sch-net', anchor: 'end' });
  s.dot(660, pin.vout).capacitor(660, pin.vout, 660, 240).ground(660, 240).label(660, 190, 'COUT', '10 µF × 4', 'left');

  // I2C pins
  const bx = 640;
  s.wire([R, pin.addr], [bx, pin.addr]);
  s.add(`<circle class="sch-w" cx="${bx + 4}" cy="${pin.addr}" r="3.5"/>`);
  s.text(bx + 14, pin.addr + 4, 'I2C address: H, L or floating', { cls: 'sch-val', anchor: 'start' });
  s.wire([R, pin.sda], [bx, pin.sda]).port(bx, pin.sda, 'SDA', 'out');
  s.wire([R, pin.scl], [bx, pin.scl]).port(bx, pin.scl, 'SCL', 'out');
  return s;
}
