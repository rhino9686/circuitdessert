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
import { ldoWithReset } from './designs-sy2a27352.mjs';
import { currentSenseAmp } from './designs-sy24642.mjs';
import { overcurrentComparator } from './designs-sy24640.mjs';
import { esp32s3I2cWiring } from './designs-sy7t6xx.mjs';

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
  'sy2a27352-schematic.svg': ldoWithReset({ id: 'sy2a27352', part: 'SY2A27352' }),
  'sy24642-schematic.svg': currentSenseAmp({ id: 'sy24642', part: 'SY24642' }),
  'sy24640-schematic.svg': overcurrentComparator({ id: 'sy24640', part: 'SY24640' }),
  'sy7t6xx-esp32s3-i2c-wiring.svg': esp32s3I2cWiring({ id: 'sy7t6xx-esp32s3-i2c', part: 'SY7T6xx' }),
  'sy23505b-schematic.svg': pfcLlc({ id: 'sy23505b', part: 'SY23505B' }),
  'sy8113b-schematic.svg': compactBuck({
    id: 'sy8113b', part: 'SY8113B', vin: '4.5–18 V', vout: '3.3 V', enPort: 'EN',
    cin1: null, cin2: '10 µF', couts: ['47 µF'], cbs: '0.1 µF', cff: '22 pF', l: '4.7 µH', rh: '100 kΩ', rl: '22.1 kΩ',
  }),
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
