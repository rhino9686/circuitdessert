// Regenerates the schematic drawings in src/assets/recipes/. Run with `npm run schematics`.
// The generated .svg files are committed, so the site build never needs to run this.
//
// One entry per recipe: the key is the file name the recipe's `schematic:` field names, and the value is
// one of the drawing functions in designs.mjs (or a new one you build from the kit in lib.mjs).
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { vccBuck } from './designs.mjs';

const out = (name) => fileURLToPath(new URL(`../../src/assets/recipes/${name}`, import.meta.url));

const designs = {
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
