// Writes a spreadsheet-friendly index of every part page, generated from the frontmatter.
//
//   npm run parts-index              writes parts-index.csv in the repository root (git-ignored)
//   npm run parts-index -- --stdout  prints the CSV instead
//   npm run parts-index -- --out some/file.csv
//
// The file is never edited by hand: the part pages are the source of truth, so rerun the script
// and reopen the file in Excel or Google Sheets. It reads only the frontmatter fields listed in
// COLUMNS and has no dependencies.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const partsDir = join(root, 'src/content/parts');

// [column heading, where it comes from]. A "specs." prefix means a key under `specs:`.
const COLUMNS = [
  ['manufacturer', 'manufacturer'],
  ['family', 'family'],
  ['part', 'part'],
  ['category', 'category'],
  ['status', 'status'],
  ['verified', 'verified'],
  ['draft', 'draft'],
  ['packages', 'packages'],
  ['vin_min_v', 'specs.vin_min_v'],
  ['vin_max_v', 'specs.vin_max_v'],
  ['vout_min_v', 'specs.vout_min_v'],
  ['vout_max_v', 'specs.vout_max_v'],
  ['iout_max_a', 'specs.iout_max_a'],
  ['fsw_khz', 'specs.fsw_khz'],
  ['iq_ua', 'specs.iq_ua'],
  ['topology', 'specs.topology'],
  ['datasheet_revision', 'datasheet_revision'],
  ['datasheet', 'datasheet'],
  ['lcsc', 'lcsc'],
  ['kicad_symbol', 'kicad_symbol'],
  ['tags', 'tags'],
  ['summary', 'summary'],
  ['file', 'file'],
];

function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

// One YAML scalar: plain, 'single quoted' ('' is a quote) or "double quoted".
function scalar(raw) {
  const v = raw.trim();
  if (v.startsWith("'") && v.endsWith("'") && v.length >= 2) return v.slice(1, -1).replace(/''/g, "'");
  if (v.startsWith('"') && v.endsWith('"') && v.length >= 2) {
    try { return JSON.parse(v); } catch { return v.slice(1, -1); }
  }
  return v;
}
function list(raw) {
  // flow list: [a, 'b, c']
  const items = [];
  let cur = '', quote = '';
  for (const ch of raw.trim().replace(/^\[|\]$/g, '')) {
    if (quote) { cur += ch; if (ch === quote) quote = ''; }
    else if (ch === '"' || ch === "'") { quote = ch; cur += ch; }
    else if (ch === ',') { items.push(cur); cur = ''; }
    else cur += ch;
  }
  if (cur.trim()) items.push(cur);
  return items.map(scalar);
}

// The part frontmatter is regular enough to read without a YAML library: top-level scalars, the
// `packages` and `tags` lists, and the scalar keys under `specs:`.
function readFront(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  const out = { specs: {} };
  if (!m) return out;
  const lines = m[1].split('\n');
  for (let i = 0; i < lines.length; i++) {
    const top = lines[i].match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!top) continue;
    const [, key, rest] = top;
    if (key === 'specs') {
      for (let j = i + 1; j < lines.length && /^\s/.test(lines[j]); j++) {
        const sub = lines[j].match(/^  ([A-Za-z_][\w-]*):\s*(.*)$/);
        if (sub && sub[2] !== '') out.specs[sub[1]] = scalar(sub[2]);
      }
    } else if (key === 'packages' || key === 'tags') {
      if (rest.startsWith('[')) out[key] = list(rest);
      else {
        out[key] = [];
        for (let j = i + 1; j < lines.length && /^\s*- /.test(lines[j]); j++) out[key].push(scalar(lines[j].replace(/^\s*- /, '')));
      }
    } else if (rest !== '' && !/^[|>]/.test(rest)) {
      out[key] = scalar(rest);
    }
  }
  return out;
}

const csvCell = (v) => {
  const s = v == null ? '' : Array.isArray(v) ? v.join('; ') : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const files = walk(partsDir)
  .filter((f) => f.endsWith('.md') && !/(^|\/)_/.test(relative(partsDir, f)))
  .sort();

const rows = files.map((f) => {
  const fm = readFront(readFileSync(f, 'utf8'));
  fm.file = relative(root, f);
  return COLUMNS.map(([, src]) => csvCell(src.startsWith('specs.') ? fm.specs[src.slice(6)] : fm[src]));
});

const csv = [COLUMNS.map(([h]) => h).join(','), ...rows.map((r) => r.join(','))].join('\n') + '\n';

const args = process.argv.slice(2);
if (args.includes('--stdout')) {
  process.stdout.write(csv);
} else {
  const i = args.indexOf('--out');
  const out = i >= 0 && args[i + 1] ? args[i + 1] : join(root, 'parts-index.csv');
  writeFileSync(out, '﻿' + csv); // BOM so Excel reads µ and Ω as UTF-8
  console.log(`wrote ${files.length} parts to ${relative(process.cwd(), out) || out}`);
}
