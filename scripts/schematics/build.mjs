// Regenerates the schematic drawings in src/assets/recipes/. Run with `npm run schematics`.
// The generated .svg files are committed, so the site build never needs to run this.
//
// One entry per recipe: the key is the file name the recipe's `schematic:` field names, and the value is
// one of the drawing functions in designs.mjs (or a new one you build from the kit in lib.mjs).
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { compactBuck, vccBuck } from './designs.mjs';

const out = (name) => fileURLToPath(new URL(`../../src/assets/recipes/${name}`, import.meta.url));

const OUT_5 = (n) => ({ cin1: '47 µF', cin2: '10 µF', couts: n, cbs: '0.1 µF', rh: '100 kΩ', rl: '22.1 kΩ', renh: '10 kΩ', renl: '1 MΩ' });

const designs = {
  'sy81152-schematic.svg': compactBuck({ id: 'sy81152', part: 'SY81152', vin: '4.5–18 V', vout: '3.3 V', ...OUT_5(['22 µF']), cff: '22 pF', l: '4.7 µH' }),
  'sy81153-schematic.svg': compactBuck({ id: 'sy81153', part: 'SY81153', vin: '4.5–18 V', vout: '3.3 V', ...OUT_5(['22 µF']), cff: '22 pF', l: '4.7 µH' }),
  'sy81153c-schematic.svg': compactBuck({ id: 'sy81153c', part: 'SY81153C', vin: '4–18 V', vout: '3.3 V', ...OUT_5(['22 µF', '22 µF']), cff: '220 pF', l: '2.2 µH' }),
  'sy81154u-schematic.svg': compactBuck({ id: 'sy81154u', part: 'SY81154U', vin: '4.5–18 V', vout: '3.3 V', ...OUT_5(['22 µF', '22 µF']), cff: '220 pF', l: '2.2 µH' }),
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
