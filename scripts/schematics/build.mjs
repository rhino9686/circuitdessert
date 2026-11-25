// Regenerates the schematic drawings in src/assets/recipes/. Run with `npm run schematics`.
// The generated .svg files are committed, so the site build never needs to run this.
//
// One entry per recipe: the key is the file name the recipe's `schematic:` field names, and the value is
// one of the drawing functions in designs.mjs (or a new one you build from the kit in lib.mjs).
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chargerBoost, compactBuck, modePinBuck, usbPowerBank, vccBuck } from './designs.mjs';
import { pfcLlc } from './designs-sy23505.mjs';
import { hBridge } from './designs-sy2a58215.mjs';
import { boostConverter } from './designs-sy26533.mjs';
import { buckBoost } from './designs-sy2a29311.mjs';
import { inInHBridge } from './designs-sy67134.mjs';
import { sy67134TankDrive } from './designs-sy67134-tank-drive.mjs';
import { esp32s3BoardPower, esp32s3BoardModule } from './designs-esp32s3-test-board.mjs';
import { syncBoostDisconnect } from './designs-sy2a29117.mjs';
import { adcApplication, esp32s3SpiWiringSa59401 } from './designs-sa59401.mjs';
import { sa8985xApplication, esp32s3SpiWiringSa8985x } from './designs-sa89853.mjs';
import { seriesRefApplication, seriesRefTrim } from './designs-sq82535.mjs';
import { shuntRefApplication } from './designs-sq82550.mjs';
import { lowIqBuckStb } from './designs-sy20011.mjs';
import { highVoltageAsyncBuck } from './designs-sy21034.mjs';
import { boostLedDriver } from './designs-sy22101a.mjs';
import { bypassBoostApplication, esp32s3I2cWiringSy87004a } from './designs-sy87004a.mjs';
import { bypassBoostFigure1 } from './designs-sy87004.mjs';
import { buckBoost1MHz } from './designs-sy20516a.mjs';
import { lowVoltageBoostFixed } from './designs-sy7070b.mjs';
import { ldoWithReset } from './designs-sy2a27352.mjs';
import { currentSenseAmp } from './designs-sy24642.mjs';
import { midSupplySenseAmp } from './designs-sa59131.mjs';
import { esp32s3I2cWiring } from './designs-sy7t6xx.mjs';
import { loadSwitchApplication } from './designs-sy6813c.mjs';
import { flybackSsr } from './designs-sy23565.mjs';
import { powerMux } from './designs-sy6862f.mjs';
import { gaNFlyback } from './designs-sy50307.mjs';
import { ssrFlybackDip7 } from './designs-sq38576.mjs';
import { ssrFlyback24w } from './designs-sy50328.mjs';
import { srLowSide } from './designs-sy52542.mjs';
import { pdInterface } from './designs-sy23435.mjs';
import { supplyPoweredSenseAmp } from './designs-sq52104.mjs';
import { powerMonitor1Ch, powerMonitor2Ch } from './designs-sq5220x.mjs';
import { dimmingInterface } from './designs-sy5867z.mjs';
import { ssdPmicApplication } from './designs-sy70202k.mjs';
import { ssdPmic70201 } from './designs-sy70201.mjs';
import { usbEsdApplication, pinConnections } from './designs-sy205229awc.mjs';
import { classDAmpTypical } from './designs-sy6045b.mjs';
import { singleInductorBuckBoost } from './designs-tps63020.mjs';
import { inlineMotorSense, solenoidSense } from './designs-ina240.mjs';
import { testCircuit as ade9078TestCircuit } from './designs-ade9078.mjs';
import { meterBasics as meter71m6511Basics } from './designs-71m6511.mjs';
import { ldoNoiseReduction } from './designs-tps7a8101.mjs';
import { ldoThreePin, ldoEnablePg, ldoAdjustable, ldoLowNoise } from './designs-ldo-basic.mjs';
import { buckSy8388b } from './designs-batch3.mjs';
import { ddrTps51200, ddrRt2568, ddrTps51206, ldoBypass, chargerBq25171, buckTps5139x, ldoUserSet } from './designs-batch2.mjs';
import { fuelGaugeHighSide } from './designs-bq27426.mjs';
import { pmicChargerBq25190 } from './designs-bq25190.mjs';
import { fuelGauge } from './designs-max17048.mjs';
import { adapter65w, openFrame30w } from './designs-topswitch-jx.mjs';
import { flybackTypical, lineSense as top252LineSense, figure42 } from './designs-top258yn.mjs';
import { dualPhaseCt } from './designs-sy7m212h.mjs';
import { essentialConnections as sy7m7xxjConnections } from './designs-sy7m7xxj.mjs';
import { ap2202Fixed, ap2202Adjustable } from './designs-ap2202.mjs';
import { sy6340Typical } from './designs-sy6340.mjs';

const out = (name) => fileURLToPath(new URL(`../../src/assets/recipes/${name}`, import.meta.url));

const OUT_5 = (n) => ({ cin1: '47 µF', cin2: '10 µF', couts: n, cbs: '0.1 µF', rh: '100 kΩ', rl: '22.1 kΩ', renh: '10 kΩ', renl: '1 MΩ' });

const designs = {
  'sy81152-schematic.svg': compactBuck({ id: 'sy81152', part: 'SY81152', vin: '4.5–18 V', vout: '3.3 V', ...OUT_5(['22 µF']), cff: '22 pF', l: '4.7 µH' }),
  'sy81153-schematic.svg': compactBuck({ id: 'sy81153', part: 'SY81153', vin: '4.5–18 V', vout: '3.3 V', ...OUT_5(['22 µF']), cff: '22 pF', l: '4.7 µH' }),
  'sy81153c-schematic.svg': compactBuck({ id: 'sy81153c', part: 'SY81153C', vin: '4–18 V', vout: '3.3 V', ...OUT_5(['22 µF', '22 µF']), cff: '220 pF', l: '2.2 µH' }),
  'sy81154u-schematic.svg': compactBuck({ id: 'sy81154u', part: 'SY81154U', vin: '4.5–18 V', vout: '3.3 V', ...OUT_5(['22 µF', '22 µF']), cff: '220 pF', l: '2.2 µH' }),
  'sy20031-schematic.svg': compactBuck({
    id: 'sy20031', part: 'SY20031', vin: '2.5–5.5 V', vout: '1.8 V', bs: false,
    cin1: '47 µF', cin2: '10 µF', couts: ['10 µF'], cff: '22 pF', l: '2.2 µH', rh: '100 kΩ', rl: '49.9 kΩ', renh: '10 kΩ', renl: '1 MΩ',
  }),
  'sa25901-schematic.svg': modePinBuck({
    id: 'sa25901', part: 'SA25901BAT', vin: '2.8–6.0 V', vout: '1.2 V',
    cin1: '47 µF', cin2: '10 µF', cout: '2 × 10 µF', cff: '22 pF', l: '1.0 µH', rtop: '51 kΩ', rbot: '51 kΩ', rpg: '10 kΩ',
  }),
  'sy80082x-schematic.svg': compactBuck({
    id: 'sy80082x', part: 'SY80082x', vin: '2.5–5.5 V', vout: '1.8 V', bs: false, rpg: '100 kΩ',
    cin1: '47 µF', cin2: '10 µF', couts: ['10 µF'], cff: '22 pF', l: '1.0 µH', rh: '30 kΩ', rl: '15 kΩ', renh: '10 kΩ', renl: '1 MΩ',
  }),
  'sy20718c-schematic.svg': chargerBoost({ id: 'sy20718c', part: 'SY20718C', vin: '4.5–5.35 V' }),
  'sy20757-schematic.svg': usbPowerBank({ id: 'sy20757', part: 'SY20757' }),
  'sy2a58215-schematic.svg': hBridge({ id: 'sy2a58215', part: 'SY2A58215' }),
  'sy26533-schematic.svg': boostConverter({ id: 'sy26533', part: 'SY26533' }),
  'sy2a29311-schematic.svg': buckBoost({ id: 'sy2a29311', part: 'SY2A29311' }),
  'sy67134-schematic.svg': inInHBridge({ id: 'sy67134', part: 'SY67134' }),
  'sy67134-tank-drive-schematic.svg': sy67134TankDrive({ id: 'sy67134-tank-drive', part: 'SY67134' }),
  'esp32-s3-test-board-schematic.svg': esp32s3BoardModule({ id: 'esp32-s3-test-board' }),
  'esp32-s3-test-board-power-schematic.svg': esp32s3BoardPower({ id: 'esp32-s3-test-board-power' }),
  'sy2a29117-schematic.svg': syncBoostDisconnect({ id: 'sy2a29117', part: 'SY2A29117' }),
  'sa59401-schematic.svg': adcApplication({ id: 'sa59401', part: 'SA59401' }),
  'sa59401-esp32s3-spi-wiring.svg': esp32s3SpiWiringSa59401({ id: 'sa59401-esp32s3-spi', part: 'SA59401' }),
  'sa89853-schematic.svg': sa8985xApplication({ id: 'sa89853', part: 'SA89853' }),
  'sa89853-esp32s3-spi-wiring.svg': esp32s3SpiWiringSa8985x({ id: 'sa89853-esp32s3-spi', part: 'SA89853' }),
  'sq82535-schematic.svg': seriesRefApplication({ id: 'sq82535', part: 'SQ82535' }),
  'sq82535-trim.svg': seriesRefTrim({ id: 'sq82535-trim', part: 'SQ82535' }),
  'sq82550-schematic.svg': shuntRefApplication({ id: 'sq82550', part: 'SQ82550' }),
  'sy20011-schematic.svg': lowIqBuckStb({ id: 'sy20011', part: 'SY20011' }),
  'sy21034-schematic.svg': highVoltageAsyncBuck({ id: 'sy21034', part: 'SY21034' }),
  'sy22101a-schematic.svg': boostLedDriver({ id: 'sy22101a', part: 'SY22101A' }),
  'sy87004a-schematic.svg': bypassBoostApplication({ id: 'sy87004a', part: 'SY87004A' }),
  'sy87004a-esp32s3-i2c-wiring.svg': esp32s3I2cWiringSy87004a({ id: 'sy87004a-esp32s3-i2c', part: 'SY87004A' }),
  'sy87004-schematic.svg': bypassBoostFigure1({ id: 'sy87004', part: 'SY87004' }),
  'sy87004-esp32s3-i2c-wiring.svg': esp32s3I2cWiringSy87004a({ id: 'sy87004-esp32s3-i2c', part: 'SY87004' }),
  'sy20516a-schematic.svg': buckBoost1MHz({ id: 'sy20516a', part: 'SY20516A' }),
  'sy7070b-schematic.svg': lowVoltageBoostFixed({ id: 'sy7070b', part: 'SY7070B' }),
  'sy2a27352-schematic.svg': ldoWithReset({ id: 'sy2a27352', part: 'SY2A27352' }),
  'tps7a8101-q1-schematic.svg': ldoNoiseReduction({ id: 'tps7a8101-q1', part: 'TPS7A8101-Q1' }),
  'tps7b6950-q1-schematic.svg': ldoThreePin({
    id: 'tps7b6950-q1',
    part: 'TPS7B6950-Q1',
    pins: { in: 'IN', out: 'OUT', gnd: 'GND' },
    ports: { in: 'VI', out: 'VO' },
    cin: [{ ref: 'CIN', val: '10 µF' }],
    cout: [{ ref: 'COUT', val: '4.7 µF' }],
    desc:
      'Typical application circuit of the TPS7B6950-Q1 5 V LDO, redrawn from the datasheet. The input VI (the battery, Vbat in the datasheet) feeds the IN pin and has a 10 µF capacitor CIN to ground. ' +
      'The OUT pin is the output VO (Vreg in the datasheet), with a 4.7 µF capacitor COUT to ground. The GND pin goes to ground; the SOT-23 package has two GND pins, drawn once, as in the datasheet.',
  }),
  'l5150bn-schematic.svg': ldoThreePin({
    id: 'l5150bn',
    part: 'L5150BN',
    pins: { in: 'VS', out: 'Vo', gnd: 'GND' },
    ports: { in: 'VBATT', out: 'Vo' },
    cin: [{ ref: 'C1', val: '≥ 100 µF' }, { ref: 'C2', val: '≥ 220 nF' }],
    cout: [{ ref: 'CO', val: '220 nF' }],
    desc:
      'Application schematic of the L5150BN 5 V LDO, redrawn from the datasheet. The battery VBATT feeds the VS pin through two parallel input capacitors to ground, C1 (100 µF or more, the backup for negative pulses) and C2 (220 nF or more, for line disturbances). ' +
      'The Vo pin is the 5 V output with a ceramic output capacitor CO (220 nF suggested, ESR of 100 mΩ or more) to ground. The GND pin goes to ground.',
  }),
  'tda3664-schematic.svg': ldoThreePin({
    id: 'tda3664',
    part: 'TDA3664',
    pins: { in: 'VP', out: 'REG', gnd: 'GND' },
    ports: { in: 'VP', out: 'VREG' },
    cin: [{ ref: 'C1', val: '1 µF', dashed: true }],
    cout: [{ ref: 'C2', val: '10 µF' }],
    desc:
      'Test circuit of the TDA3664 5 V regulator in the SO4 package, redrawn from the datasheet. The supply VP feeds pin 1 (VP). An optional 1 µF capacitor C1 from the supply to ground is drawn on a dashed connection. ' +
      'Pin 3 (REG) is the 5 V output VREG with a 10 µF capacitor C2 to ground. Pins 2 and 4 are both ground and are drawn once.',
  }),
  'tps74512-q1-schematic.svg': ldoEnablePg({ id: 'tps74512-q1', part: 'TPS74512-Q1' }),
  'tps7a92-schematic.svg': ldoLowNoise({ id: 'tps7a92', part: 'TPS7A92' }),
  'mic29302a-schematic.svg': ldoAdjustable({
    id: 'mic29302a', part: 'MIC29302A',
    pins: { in: 'IN', out: 'OUT', adj: 'ADJ', en: 'EN', gnd: 'GND' }, ports: { in: 'VIN', out: 'VOUT' }, en: 'tied',
    cin: { ref: 'CIN', val: '' }, cout: { ref: 'COUT', val: '10 µF' }, r1: { ref: 'R1', val: '191 Ω' }, r2: { ref: 'R2', val: '187 Ω' },
    desc: 'Typical application circuit of the MIC29302A adjustable 3 A LDO, redrawn from the front page of the datasheet for a 2.5 V output from 3.3 V. The input VIN feeds the IN pin and is also wired to the EN pin, so the regulator is always enabled. An input capacitor CIN, with no value given in the datasheet, goes to ground. The OUT pin is the output VOUT with a 10 µF output capacitor COUT to ground. The feedback divider is R1 (191 ohms) from VOUT to the ADJ pin and R2 (187 ohms) from ADJ to ground. The GND pin goes to ground.',
  }),
  'sc1565-schematic.svg': ldoAdjustable({
    id: 'sc1565', part: 'SC1565',
    pins: { in: 'VIN', out: 'VO', adj: 'ADJ', en: 'EN', gnd: 'GND' }, ports: { in: 'VIN', out: 'VO' }, en: 'EN',
    cin: { ref: 'C1', val: '4.7 µF' }, cout: { ref: 'C2', val: '2.2 µF' }, r1: { ref: 'R1', val: '' }, r2: { ref: 'R2', val: '' },
    desc: 'Typical application circuit of the SC1565 adjustable 1.5 A LDO in its five-lead TO-220 or TO-263 package, redrawn from the datasheet. The input VIN feeds the VIN pin with an input capacitor C1 to ground, and the enable pin EN is driven by a separate ENABLE signal. The VO pin is the output with an output capacitor C2 to ground. The feedback divider is R1 from VO to the ADJ pin and R2 from ADJ to ground, which set VO = 1.200 times (R1 + R2) divided by R2. The GND pin goes to ground. The datasheet figure has no component values; the capacitor values are the ones its text recommends.',
  }),
  'ncp133-schematic.svg': ldoAdjustable({
    id: 'ncp133', part: 'NCP133',
    pins: { in: 'IN', out: 'OUT', adj: 'ADJ', en: 'EN', bias: 'BIAS', gnd: 'GND' }, ports: { in: 'VIN', out: 'VOUT' }, en: 'EN', bias: 'VBIAS',
    cin: { ref: 'CIN', val: '1 µF' }, cout: { ref: 'COUT', val: '2.2 µF' }, cbias: { ref: 'CBIAS', val: '100 nF' }, r1: { ref: 'R1', val: '19.6 kΩ' }, r2: { ref: 'R2', val: '78.7 kΩ' },
    desc: 'Typical application circuit of the NCP133 adjustable version, redrawn from the datasheet with the resistor values of its Table 1 for a 1.0 V output. The input VIN feeds the IN pin with a 1 microfarad capacitor CIN to ground. A separate bias supply VBIAS feeds the BIAS pin with a 100 nanofarad capacitor CBIAS to ground, and the enable pin EN is driven by a separate signal. The OUT pin is the output VOUT with a 2.2 microfarad capacitor COUT to ground. The feedback divider is R1 (19.6 kilohms) from VOUT to ADJ and R2 (78.7 kilohms) from ADJ to ground. The GND pin goes to ground.',
  }),
  'rt9081a-schematic.svg': ldoAdjustable({
    id: 'rt9081a', part: 'RT9081A',
    pins: { in: 'VIN', out: 'VOUT', adj: 'ADJ', en: 'EN', bias: 'BIAS', gnd: 'GND' }, ports: { in: 'VIN', out: 'VOUT' }, en: 'EN', bias: 'VBIAS',
    cin: { ref: 'CIN', val: '1 µF' }, cout: { ref: 'COUT', val: '4.7 µF' }, cbias: { ref: 'CBIAS', val: '0.1 µF' }, r1: { ref: 'R1', val: '10 kΩ' }, r2: { ref: 'R2', val: '20 kΩ' },
    desc: 'Typical application circuit of the RT9081A adjustable version (Figure 2 of the datasheet), for a 1.2 V output at 500 mA from a 1.5 V input. The input VIN feeds the VIN pin with a 1 microfarad capacitor CIN to ground. A 3.3 V bias supply VBIAS feeds the BIAS pin with a 0.1 microfarad capacitor CBIAS to ground, and the enable pin EN is driven by a separate signal. The VOUT pin is the output with a 4.7 microfarad capacitor COUT to ground. The feedback divider is R1 (10 kilohms) from VOUT to ADJ and R2 (20 kilohms) from ADJ to ground. The GND pin and exposed pad go to ground.',
  }),
  'sc4215-schematic.svg': ldoAdjustable({
    id: 'sc4215', part: 'SC4215',
    pins: { in: 'VIN', out: 'VO', adj: 'ADJ', en: 'EN', gnd: 'GND' }, ports: { in: 'VIN', out: 'VO' }, en: 'EN',
    cin: { ref: 'C1', val: '≥ 4.7 µF' }, cout: { ref: 'C2', val: '≥ 10 µF' }, r1: { ref: 'R1', val: '' }, r2: { ref: 'R2', val: '' },
    desc: 'Typical application circuit of the SC4215 adjustable 2 A LDO, redrawn from the front page of the datasheet. The input VIN feeds the VIN pin with an input capacitor C1 to ground, and the enable pin EN is driven by a separate ENABLE signal. The VO pin is the output with an output capacitor C2 to ground. The feedback divider is R1 from VO to the ADJ pin and R2 from ADJ to ground, which set VO = 0.8 times (R1 + R2) divided by R2. The GND pin and exposed pad go to ground. The datasheet figure has no component values; the capacitors are the minimums its pin descriptions give.',
  }),
  'rt2515a-schematic.svg': ldoAdjustable({
    id: 'rt2515a', part: 'RT2515A',
    pins: { in: 'VIN', out: 'VOUT', adj: 'ADJ', en: 'EN', gnd: 'GND' }, ports: { in: 'VIN', out: 'VOUT' }, en: 'EN',
    cin: { ref: 'C1', val: '10 µF' }, cout: { ref: 'C2', val: '10 µF' }, r1: { ref: 'R1', val: '' }, r2: { ref: 'R2', val: '' },
    desc: 'Typical application circuit of the RT2515A adjustable 2 A LDO (Figure 1 of the datasheet). The input VIN feeds the VIN pin with a 10 microfarad capacitor C1 to ground, and the enable pin EN is driven by a separate Chip Enable signal. The VOUT pin is the output with a 10 microfarad capacitor C2 to ground. The feedback divider is R1 from VOUT to the ADJ pin and R2 from ADJ to ground, which set VOUT = 0.5 times (R1 + R2) divided by R2. The GND pin and exposed pad go to ground. The datasheet figure gives no resistor values.',
  }),
  'tps51200-schematic.svg': ddrTps51200({ id: 'tps51200', part: 'TPS51200' }),
  'rt2568-schematic.svg': ddrRt2568({ id: 'rt2568', part: 'RT2568' }),
  'tps51206-schematic.svg': ddrTps51206({ id: 'tps51206', part: 'TPS51206' }),
  'ncv57152-schematic.svg': ldoAdjustable({
    id: 'ncv57152', part: 'NCV57152', hopEn: true,
    pins: { in: 'VIN', out: 'VOUT', adj: 'ADJ', en: 'EN', gnd: 'GND' }, ports: { in: 'VIN', out: 'VOUT' }, en: 'EN',
    cin: { ref: 'CIN', val: '' }, cout: { ref: 'COUT', val: '47 µF' }, r1: { ref: 'R1', val: '' }, r2: { ref: 'R2', val: '' },
    desc: 'Adjustable-voltage application circuit of the NCP57152 and NCV57152 1.5 A LDO, redrawn from the datasheet\'s Figure 22. The input VIN feeds the VIN pin with an input capacitor CIN to ground, and the enable pin EN is driven by a separate signal. The VOUT pin is the output with a 47 microfarad ceramic output capacitor COUT to ground. The feedback divider is R1 from VOUT to the ADJ pin and R2 from ADJ to ground, which set VOUT = 1.24 times (1 + R1 / R2). The GND pin goes to ground. The datasheet figure gives no resistor values or CIN value.',
  }),
  'spx3819-schematic.svg': ldoBypass({ id: 'spx3819', part: 'SPX3819' }),
  'spx3819-adj-schematic.svg': ldoAdjustable({
    id: 'spx3819-adj', part: 'SPX3819', hopEn: true,
    pins: { in: 'VIN', out: 'VOUT', adj: 'ADJ', en: 'EN', gnd: 'GND' }, ports: { in: 'VIN', out: 'VOUT' }, en: 'EN',
    cin: { ref: 'CIN', val: '' }, cout: { ref: 'COUT', val: '' }, r1: { ref: 'R1', val: '' }, r2: { ref: 'R2', val: '' },
    desc: 'Adjustable-output application circuit of the SPX3819 500 mA LDO, redrawn from the datasheet\'s Figure 19. The input VIN feeds the VIN pin with an input capacitor CIN to ground, and the enable pin EN is driven by a separate signal. The VOUT pin is the output with an output capacitor COUT to ground. The feedback divider is R1 from VOUT to the ADJ pin and R2 from ADJ to ground, which set VOUT = 1.235 times (1 + R1 / R2). The GND pin goes to ground. The datasheet figure gives no component values.',
  }),
  'bq25171-q1-schematic.svg': chargerBq25171({ id: 'bq25171-q1', part: 'BQ25171-Q1' }),
  'tps5139x-schematic.svg': buckTps5139x({ id: 'tps5139x', part: 'TPS51393 and TPS51395' }),
  'tps7a7200-ep-schematic.svg': ldoUserSet({ id: 'tps7a7200-ep', part: 'TPS7A7200-EP' }),
  'sa21345g-schematic.svg': ldoThreePin({
    id: 'sa21345g',
    part: 'SA21345G',
    pins: { in: 'IN', out: 'OUT', gnd: 'GND' },
    ports: { in: 'VIN', out: 'VOUT' },
    cin: [{ ref: 'CIN', val: '10 µF' }],
    cout: [{ ref: 'COUT', val: '4.7 µF' }],
    desc:
      'Typical application circuit of the SA21345G 5 V LDO, redrawn from Figure 1 of the datasheet. The input VIN (4 V to 36 V) feeds the IN pin and has a 10 µF capacitor CIN to ground. ' +
      'The OUT pin is the 5 V output VOUT, with a 4.7 µF capacitor COUT to ground. The GND pin goes to ground. The SO8 package has five no-connect pins, which are not drawn.',
  }),
  'sa21340iaat-schematic.svg': ldoThreePin({
    id: 'sa21340iaat',
    part: 'SA21340I',
    pins: { in: 'IN', out: 'OUT', gnd: 'GND' },
    ports: { in: 'VIN', out: 'VOUT' },
    cin: [{ ref: 'C1', val: '1 µF' }],
    cout: [{ ref: 'C2', val: '4.7 µF' }],
    desc:
      'Typical application circuit of the SA21340I 3.3 V LDO, redrawn from Figure 1 of the datasheet. The input VIN (4 V to 36 V) feeds the IN pin and has a 1 microfarad capacitor C1 to ground. ' +
      'The OUT pin is the 3.3 V output VOUT, with a 4.7 microfarad capacitor C2 to ground. The GND pin goes to ground. The two no-connect pins of the SOT23-5 package are not drawn.',
  }),
  'ap2202-schematic.svg': ap2202Fixed({ id: 'ap2202' }),
  'ap2202-adj-schematic.svg': ap2202Adjustable({ id: 'ap2202-adj' }),
  'sy6340-schematic.svg': sy6340Typical({ id: 'sy6340' }),
  'sa21308a-schematic.svg': ldoAdjustable({
    id: 'sa21308a', part: 'SA21308A',
    pins: { in: 'IN', out: 'OUT', adj: 'FB', en: 'EN', gnd: 'GND' }, ports: { in: 'VIN', out: 'VOUT' }, en: 'tied',
    cin: { ref: 'CIN', val: '1 µF' }, cout: { ref: 'COUT', val: '2.2 µF' }, r1: { ref: 'RH', val: '100 kΩ' }, r2: { ref: 'RL', val: '20 kΩ' },
    desc: 'Typical application circuit of the SA21308A adjustable 500 mA LDO, redrawn from Figure 1 of the datasheet, which gives 3.3 V out. The input VIN feeds the IN pin with a 1 µF capacitor CIN to ground, and the EN pin is wired to the input so the regulator is always on. The OUT pin is the output VOUT with a 2.2 µF capacitor COUT to ground. The feedback divider is RH (100 kilohms) from VOUT to the FB pin and RL (20 kilohms) from FB to ground. The GND pin goes to ground. The datasheet figure also shows the optional 100 pF feedforward capacitor CFF across RH, the power-good pull-up RPG (100 kilohms) and an enable resistor REN (1 megohm) with a jumper; none of these is drawn here.',
  }),
  'sy6103-schematic.svg': ldoAdjustable({
    id: 'sy6103', part: 'SY6103',
    pins: { in: 'IN', out: 'OUT', adj: 'FB', en: 'EN', gnd: 'GND' }, ports: { in: 'VIN', out: 'VOUT' }, en: 'EN',
    cin: { ref: 'CIN', val: '' }, cout: { ref: 'COUT', val: '' }, r1: { ref: 'R1', val: '' }, r2: { ref: 'R2', val: '' },
    desc: 'Adjustable-output application circuit of the SY6103 3 A LDO, redrawn from Figure 1 of the datasheet. The input VIN feeds the IN pin with an input capacitor CIN to ground, and the enable pin EN is driven by a separate signal. The OUT pin is the output VOUT with an output capacitor COUT to ground. The feedback divider is R1 from VOUT to the FB pin and R2 from FB to ground, which set VOUT = 1.24 times (1 + R1 / R2). The GND pin goes to ground. The datasheet figure gives no component values.',
  }),
  'sq24333-schematic.svg': ldoAdjustable({
    id: 'sq24333', part: 'SQ24333',
    pins: { in: 'IN', out: 'OUT', adj: 'FB', en: 'EN', gnd: 'GND' }, ports: { in: 'VIN', out: 'VOUT' }, en: 'EN',
    cin: { ref: 'CIN', val: '' }, cout: { ref: 'COUT', val: '' }, r1: { ref: 'R1', val: '' }, r2: { ref: 'R2', val: '' },
    desc: 'Adjustable-output application circuit of the SQ24333 3 A LDO, redrawn from Figure 1 of the datasheet. The input VIN feeds the IN pin with an input capacitor CIN to ground, and the enable pin EN is driven by a separate signal. The OUT pin is the output VOUT with an output capacitor COUT to ground. The feedback divider is R1 from VOUT to the FB pin and R2 from FB to ground, which set VOUT = 1.24 times (1 + R1 / R2). The GND pin goes to ground. The datasheet figure gives no component values.',
  }),
  'sy6307b-schematic.svg': ldoAdjustable({
    id: 'sy6307b', part: 'SY6307B', hopEn: true,
    pins: { in: 'IN', out: 'OUT', adj: 'ADJ', en: 'EN', bias: 'Bias', gnd: 'GND' }, ports: { in: 'VIN', out: 'VOUT' }, en: 'EN', bias: 'VBIAS',
    cin: { ref: 'CIN', val: '1 µF' }, cout: { ref: 'COUT', val: '2.2 µF' }, cbias: { ref: 'CBIAS', val: '0.1 µF' }, r1: { ref: 'RH', val: '49.9 kΩ' }, r2: { ref: 'RL', val: '200 kΩ' },
    desc: 'Typical application circuit of the SY6307B 500 mA bias-rail LDO, redrawn from Figure 1 of the datasheet for a 1.0 V output from a 1.2 V input. The input VIN feeds the IN pin with a 1 µF capacitor CIN to ground. A separate bias supply VBIAS (above 2.4 V) feeds the Bias pin with a 0.1 µF capacitor CBIAS to ground, and the enable pin EN is driven by a separate signal. The OUT pin is the output VOUT with a 2.2 µF capacitor COUT to ground. The feedback divider is RH (49.9 kilohms) from VOUT to the ADJ pin and RL (200 kilohms) from ADJ to ground, which set VOUT = 0.8 times (1 + RH / RL). The GND pin goes to ground.',
  }),
  'sq24345h-schematic.svg': ldoAdjustable({
    id: 'sq24345h', part: 'SQ24345H',
    pins: { in: 'IN', out: 'OUT', adj: 'ADJ', en: 'EN', gnd: 'GND' }, ports: { in: 'VIN', out: 'VOUT' }, en: 'EN',
    cin: { ref: 'CIN', val: '' }, cout: { ref: 'COUT', val: '' }, r1: { ref: 'R1', val: '' }, r2: { ref: 'R2', val: '' },
    desc: 'Adjustable-output application circuit of the SQ24345H 36 V, 500 mA LDO, redrawn from Figure 1 of the datasheet. The input VIN feeds the IN pin with an input capacitor CIN to ground, and the enable pin EN is driven by a separate signal. The OUT pin is the output VOUT with an output capacitor COUT to ground. The feedback divider is R1 from VOUT to the ADJ pin and R2 from ADJ to ground, which set VOUT = 1.235 times (1 + R1 / R2). The GND pin goes to ground. The datasheet figure gives no component values.',
  }),
  'sq24302dac-schematic.svg': ldoAdjustable({
    id: 'sq24302dac', part: 'SQ24302DAC',
    pins: { in: 'IN', out: 'OUT', adj: 'ADJ', en: 'EN', gnd: 'GND' }, ports: { in: 'VIN', out: 'VOUT' }, en: 'EN',
    cin: { ref: 'C1', val: '10 µF' }, cout: { ref: 'C2', val: '22 µF' }, r1: { ref: 'R3', val: '' }, r2: { ref: 'R2', val: '' },
    desc: 'Adjustable-output application circuit of the SQ24302DAC 2 A low-input LDO, redrawn from Figure 1 of the datasheet. The input VIN feeds the IN pin with a 10 µF capacitor C1 to ground, and the enable pin EN is driven by a separate signal. The OUT pin is the output VOUT with a 22 µF capacitor C2 to ground. The feedback divider is R3 from VOUT to the ADJ pin and R2 from ADJ to ground, which set VOUT = 0.5 times (R3 + R2) / R2. The GND pin and exposed pad go to ground. The datasheet figure also shows a resistor R1 on the EN pin and a capacitor C3 across R3, which are not drawn, and gives no resistor values. The capacitor values are the ones the datasheet text recommends.',
  }),
  'sy6355-schematic.svg': ddrTps51200({
    id: 'sy6355', part: 'SY6355',
    desc:
      'Typical application circuit of the SY6355 DDR termination regulator, redrawn from Figure 1 of the datasheet. The VIN pin is fed from the 3.3 V rail with a 4.7 µF capacitor C6 to ground, and the same rail pulls up the open-drain PGOOD pin through a 100 kΩ resistor R3. ' +
      'The VDDQ rail reaches REFIN through R1 (10 kΩ), with R2 (10 kΩ) and C4 (1 nF) from REFIN to ground, and also feeds VLDOIN, which has two 10 µF capacitors C7 and C8 to ground. The enable pin EN is driven by the chip-enable signal; the figure also shows a 1 MΩ resistor R6 and a jumper K1 from the supply to EN, which are not drawn. ' +
      'VO is the termination output with three 10 µF capacitors C1 to C3 to ground, and VOSNS is wired to VO. REFOUT is the buffered reference output with a 0.1 µF capacitor C5 to ground. PGND and GND are tied to ground.',
  }),
  'sq24335-schematic.svg': ddrTps51200({
    id: 'sq24335', part: 'SQ24335',
    desc:
      'Typical application circuit of the SQ24335 DDR termination regulator, redrawn from Figure 1 of the datasheet. The VIN pin is fed from the 3.3 V rail with a 4.7 µF capacitor C6 to ground, and the same rail pulls up the open-drain PGOOD pin through a 100 kΩ resistor R3. ' +
      'The VDDQ rail reaches REFIN through R1 (10 kΩ), with R2 (10 kΩ) and C4 (1 nF) from REFIN to ground, and also feeds VLDOIN, which has two 10 µF capacitors C7 and C8 to ground. The enable pin EN is driven by the chip-enable signal; the figure also shows a 1 MΩ resistor R6 and a jumper K1 from the supply to EN, which are not drawn. ' +
      'VO is the termination output with three 10 µF capacitors C1 to C3 to ground, and VOSNS is wired to VO. REFOUT is the buffered reference output with a 0.1 µF capacitor C5 to ground. PGND and GND are tied to ground.',
  }),
  'sy8388b-schematic.svg': buckSy8388b({ id: 'sy8388b', part: 'SY8388B' }),
  'bq27426-schematic.svg': fuelGaugeHighSide({ id: 'bq27426', part: 'BQ27426' }),
  'bq25190-schematic.svg': pmicChargerBq25190({ id: 'bq25190', part: 'BQ25190' }),
  'max17048-schematic.svg': fuelGauge({ id: 'max17048', part: 'MAX17048', cells: 1 }),
  'max17049-schematic.svg': fuelGauge({ id: 'max17049', part: 'MAX17049', cells: 2 }),
  'top264-271-fig25-schematic.svg': adapter65w({ id: 'top264-271-fig25' }),
  'top264-271-fig26-schematic.svg': openFrame30w({ id: 'top264-271-fig26' }),
  'sy24642-schematic.svg': currentSenseAmp({ id: 'sy24642', part: 'SY24642' }),
  'sa59131-schematic.svg': midSupplySenseAmp({ id: 'sa59131', part: 'SA59131' }),
  'sy7t6xx-esp32s3-i2c-wiring.svg': esp32s3I2cWiring({ id: 'sy7t6xx-esp32s3-i2c', part: 'SY7T6xx' }),
  'sy23505b-schematic.svg': pfcLlc({ id: 'sy23505b', part: 'SY23505B' }),
  'sy8113b-schematic.svg': compactBuck({
    id: 'sy8113b', part: 'SY8113B', vin: '4.5–18 V', vout: '3.3 V', enPort: 'EN',
    cin1: null, cin2: '10 µF', couts: ['47 µF'], cbs: '0.1 µF', cff: '22 pF', l: '4.7 µH', rh: '100 kΩ', rl: '22.1 kΩ',
  }),
  'sy6813c-schematic.svg': loadSwitchApplication({ id: 'sy6813c', part: 'SY6813C' }),
  'sy23565-schematic.svg': flybackSsr({ id: 'sy23565', part: 'SY23565' }),
  'sy81058c-schematic.svg': compactBuck({
    id: 'sy81058c', part: 'SY81058C', vin: '4.5–18 V', vout: '3.3 V',
    cin1: '47 µF', cin2: '10 µF', couts: ['10 µF'], cbs: '0.1 µF', cff: '47 pF', l: '2.2 µH', rh: '100 kΩ', rl: '22.1 kΩ', renh: '10 kΩ', renl: '1 MΩ',
  }),
  'sy6862f-schematic.svg': powerMux({ id: 'sy6862f', part: 'SY6862F' }),
  'sy50307-schematic.svg': gaNFlyback({ id: 'sy50307', part: 'SY50307' }),
  'sq38576a-schematic.svg': ssrFlybackDip7({ id: 'sq38576a', part: 'SQ38576A' }),
  'sq38576b-schematic.svg': ssrFlybackDip7({ id: 'sq38576b', part: 'SQ38576B' }),
  'sy50328-schematic.svg': ssrFlyback24w({ id: 'sy50328', part: 'SY50328/9' }),
  'sy52542-schematic.svg': srLowSide({ id: 'sy52542' }),
  'sy23435-schematic.svg': pdInterface({ id: 'sy23435' }),
  'sq52104e-schematic.svg': supplyPoweredSenseAmp({ id: 'sq52104e', part: 'SQ52104E', gain: '200 V/V' }),
  'sy70202k-schematic.svg': ssdPmicApplication({ id: 'sy70202k' }),
  'sy70201-schematic.svg': ssdPmic70201({ id: 'sy70201' }),
  'sy205229awc-schematic.svg': usbEsdApplication({ id: 'sy205229awc', part: 'SY205229AWC' }),
  'sy205229awc-pin-connections.svg': pinConnections({ id: 'sy205229awc-pin-connections', part: 'SY205229AWC' }),
  'sy5867z-schematic.svg': dimmingInterface({ id: 'sy5867z' }),
  'sy6045b-schematic.svg': classDAmpTypical({ id: 'sy6045b' }),
  'ade9078-schematic.svg': ade9078TestCircuit({ id: 'ade9078', part: 'ADE9078' }),
  '71m6511-schematic.svg': meter71m6511Basics({ id: '71m6511', part: '71M6511' }),
  'sq52201qdq-schematic.svg': powerMonitor1Ch({ id: 'sq52201qdq' }),
  'sq52212xfs-schematic.svg': powerMonitor2Ch({ id: 'sq52212xfs' }),
  'ina240-motor-schematic.svg': inlineMotorSense({ id: 'ina240-motor' }),
  'ina240-solenoid-schematic.svg': solenoidSense({ id: 'ina240-solenoid' }),
  'tps63020-schematic.svg': singleInductorBuckBoost({ id: 'tps63020' }),
  'tps63020-2a-schematic.svg': singleInductorBuckBoost({ id: 'tps63020-2a', fast: true }),
  'top252-262-schematic.svg': flybackTypical({ id: 'top252-262' }),
  'top252-262-line-sense-schematic.svg': top252LineSense({ id: 'top252-262-line-sense' }),
  'top258yn-150w-schematic.svg': figure42({ id: 'top258yn-150w' }),
  'sy7m212h-sy7t231h-schematic.svg': dualPhaseCt({ id: 'sy7m212h-sy7t231h' }),
  'sy7m7xxj-schematic.svg': sy7m7xxjConnections({ id: 'sy7m7xxj' }),
  'sy21219-schematic.svg': vccBuck({
    id: 'sy21219', part: 'SY21219', vin: '4.5–30 V', vout: '5 V',
    cin1: '47 µF', cin2: '10 µF', cin3: '0.1 µF', couts: ['22 µF', '22 µF', '22 µF'], cbs: '0.1 µF', cvcc: '2.2 µF', cff: '220 pF', rff: '1 kΩ',
    l: '4.7 µH', rh: '100 kΩ', rl: '13.7 kΩ', renh: '10 kΩ', renl: '1 MΩ', rpg: '100 kΩ',
  }),
};

for (const [name, sheet] of Object.entries(designs)) {
  writeFileSync(out(name), sheet.toString() + '\n');
  console.log('wrote', name);
}
