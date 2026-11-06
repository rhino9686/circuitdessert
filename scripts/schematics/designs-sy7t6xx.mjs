// Wiring drawing for the SY7T6xx Arduino I2C section: an ESP32-S3 dev board and an SY7T610, SY7T611 or SY7T612.
// This is not a datasheet circuit. The datasheet draws only the bus (Figure 4-7); the pull-up values and the
// ESP32-S3 side are our design, described on the part page. Pin names follow the datasheet's pin tables.
import { Sheet } from './lib.mjs';

export function esp32s3I2cWiring({ id, part = 'SY7T6xx', pullup = '4.7 kΩ', modePull = '10 kΩ' }) {
  const s = new Sheet(640, 420, {
    top: 20,
    id,
    title: `${part} wired to an ESP32-S3 over I2C`,
    desc:
      `Wiring for talking to an ${part} part from an ESP32-S3 dev board. Everything runs at 3.3 V, so no level shifter is needed. The board's 3V3 pin feeds the ${part} and the pull-ups. ` +
      `ESP32-S3 GPIO9 (SCL) goes to DIO5 and GPIO8 (SDA) goes to both DIO3 (SDAo) and DIO2 (SDAi), which are tied together. ` +
      `Each of the two bus lines has a ${pullup} pull-up to 3.3 V. DIO8, the interface select pin, has a ${modePull} resistor to 3.3 V so it reads high at reset. ` +
      `RESETB (SY7T611 and SY7T612 only) has a ${modePull} resistor to 3.3 V and can be pulled low by GPIO4. Both supply pins of the part go to 3.3 V and both grounds to ground.`,
  });

  const rail = 50; // 3.3 V rail
  const railEnd = 600;

  // ---- ESP32-S3 dev board (right-hand pins only)
  const mcu = { x: 10, y: 90, w: 120, h: 240 };
  s.ic(mcu.x, mcu.y, mcu.w, mcu.h, {
    right: [{ name: 'GPIO9 (SCL)', y: 150 }, { name: 'GPIO8 (SDA)', y: 180 }, { name: 'GPIO4', y: 270 }, { name: 'GND', y: 300 }],
    top: [{ name: '3V3', x: 70 }],
  }, { title: 'ESP32-S3', subtitle: 'dev board, 3.3 V' });
  s.ground(142, 300);
  s.text(10, rail - 8, '3.3 V', { cls: 'sch-net', anchor: 'start' });
  s.wire([70, mcu.y - 12], [70, rail]).wire([70, rail], [railEnd, rail]);

  // ---- the part
  const ic = { x: 360, y: 90, w: 130, h: 240 };
  s.ic(ic.x, ic.y, ic.w, ic.h, {
    left: [{ name: 'DIO5 (SCL)', y: 150 }, { name: 'DIO3 (SDAo)', y: 180 }, { name: 'DIO2 (SDAi)', y: 250 }],
    right: [{ name: 'DIO8 (select)', y: 130 }, { name: 'RESETB', y: 290 }],
    top: [{ name: 'V3P3D', x: 395 }, { name: 'V3P3A', x: 455 }],
    bottom: [{ name: 'GNDD', x: 395 }, { name: 'GNDA', x: 455 }],
  }, { title: part, subtitle: '610 / 611 / 612' });
  s.wire([395, ic.y - 12], [395, rail]).dot(395, rail);
  s.wire([455, ic.y - 12], [455, rail]).dot(455, rail);
  s.wire([395, ic.y + ic.h + 12], [395, 360], [455, 360], [455, ic.y + ic.h + 12]).dot(425, 360).ground(425, 360);

  // ---- SCL: GPIO9 to DIO5, with a pull-up to 3.3 V (the SDA pull-up's wire hops over it)
  const xScl = 230, xSda = 275;
  s.hwire(150, 142, 348, [xSda]);
  s.dot(xScl, 150).resistor(xScl, 150, xScl, rail).dot(xScl, rail).label(xScl, 100, 'R3', pullup, 'left');
  // ---- SDA: GPIO8 to DIO3, tied to DIO2
  s.wire([142, 180], [348, 180]);
  s.dot(xSda, 180).resistor(xSda, 180, xSda, rail).dot(xSda, rail).label(xSda, 115, 'R4', pullup, 'right');
  s.dot(330, 180).wire([330, 180], [330, 250], [348, 250]);
  s.text(320, 254, 'DIO2, DIO3 tied', { cls: 'sch-val', anchor: 'end' });

  // ---- DIO8 and RESETB pull-ups on the right
  s.wire([502, 130], [540, 130]).dot(540, 130).resistor(540, 130, 540, rail).dot(540, rail).label(540, 90, 'R1', modePull, 'right');
  s.wire([502, 290], [600, 290]).dot(600, 290).resistor(600, 290, 600, rail).dot(600, rail).label(600, 170, 'R2', modePull, 'left');

  // ---- optional reset from GPIO4: only ever pulled low
  s.wire([142, 270], [170, 270], [170, 395], [600, 395], [600, 290]);
  s.text(176, 388, 'optional reset: GPIO4 is only ever pulled low', { cls: 'sch-val', anchor: 'start' });
  return s;
}
