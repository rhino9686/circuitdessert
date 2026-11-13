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
import { overcurrentComparator } from './designs-sy24640.mjs';
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
  'sy24642-schematic.svg': currentSenseAmp({ id: 'sy24642', part: 'SY24642' }),
  'sy24640-schematic.svg': overcurrentComparator({ id: 'sy24640', part: 'SY24640' }),
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
  'sy5867z-schematic.svg': dimmingInterface({ id: 'sy5867z' }),
  'sq52201qdq-schematic.svg': powerMonitor1Ch({ id: 'sq52201qdq' }),
  'sq52212xfs-schematic.svg': powerMonitor2Ch({ id: 'sq52212xfs' }),
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
