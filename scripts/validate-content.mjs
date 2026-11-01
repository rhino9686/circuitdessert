// Extra checks beyond schema validation. Run with `npm run validate`.
// Exits non-zero on errors; prints warnings for things worth a second look.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('../src/content/', import.meta.url).pathname;
let errors = 0;
let warnings = 0;
const err = (f, m) => { errors++; console.error(`ERROR   ${f}: ${m}`); };
const warn = (f, m) => { warnings++; console.warn(`warning ${f}: ${m}`); };

function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}
const content = (f) => readFileSync(f, 'utf8');
const front = (s) => (s.match(/^---\n([\s\S]*?)\n---/) ?? [, ''])[1];
// YAML hazard: an unquoted top-level value containing ": " breaks the frontmatter (the build fails).
function checkYamlHazards(rel, fm) {
  for (const line of fm.split('\n')) {
    const m = line.match(/^([A-Za-z_][\w-]*):\s+(.*)$/);
    if (!m) continue;
    const v = m[2].trim();
    if (v && !/^["'\[{|>&*!%@`]/.test(v) && /: /.test(v)) {
      err(rel, `unquoted value for "${m[1]}" contains ": " - wrap the whole value in double quotes`);
    }
  }
}
// The body is rendered as numbered section cards, one per "## " heading, so it has to start with one.
function checkBodyStartsWithSection(rel, text) {
  const body = text.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
  if (body && !body.startsWith('## ')) err(rel, 'the body must start with a "## " heading (each ## becomes a numbered section card)');
}
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const field = (fm, key) => (fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm')) ?? [, null])[1]?.trim().replace(/^["']|["']$/g, '') ?? null;

// ---- Parts ----
const partFiles = walk(join(root, 'parts')).filter((f) => f.endsWith('.md') && !/(^|\/)_/.test(relative(join(root, 'parts'), f)));
const seen = new Map();
const partPages = new Set(); // "<manufacturer>/<part>" slugs, for checking site: links
const familyCount = new Map(); // "<manufacturer>/<family>" -> number of parts; a family with 2+ parts gets its own comparison page
for (const f of partFiles) {
  const rel = relative(root, f);
  const fm = front(content(f));
  checkYamlHazards(rel, fm);
  checkBodyStartsWithSection(rel, content(f));
  if (!/^abstract:/m.test(fm)) warn(rel, 'no abstract: add a short paragraph that introduces the part');
  if (!/^features:/m.test(fm)) warn(rel, 'no features list');
  const part = field(fm, 'part');
  const mfr = field(fm, 'manufacturer');
  const family = field(fm, 'family');
  const parts = rel.split('/'); // parts/<mfr>/<family>/<part>.md
  if (parts.length !== 4) err(rel, 'expected path parts/<manufacturer>/<family>/<part>.md');
  const key = `${mfr}/${part}`.toLowerCase();
  if (seen.has(key)) err(rel, `duplicate of ${seen.get(key)}`);
  seen.set(key, rel);
  partPages.add(`${slug(mfr ?? '')}/${slug(part ?? '')}`);
  const famKey = `${slug(mfr ?? '')}/${slug(family ?? '')}`;
  familyCount.set(famKey, (familyCount.get(famKey) ?? 0) + 1);
  if (parts.length === 4) {
    if (parts[1] !== slug(mfr ?? '')) warn(rel, `folder "${parts[1]}" doesn't match manufacturer slug "${slug(mfr ?? '')}"`);
    if (parts[2] !== slug(family ?? '')) warn(rel, `folder "${parts[2]}" doesn't match family slug "${slug(family ?? '')}"`);
    if (parts[3].replace(/\.md$/, '') !== slug(part ?? '')) warn(rel, `filename doesn't match part slug "${slug(part ?? '')}"`);
  }
}

for (const [key, n] of familyCount) if (n > 1) partPages.add(key); // family comparison pages are linkable too

// ---- Recipes ----
const recipeFiles = walk(join(root, 'recipes')).filter((f) => f.endsWith('.md') && !/(^|\/)_/.test(relative(join(root, 'recipes'), f)));
const recipeIds = new Set(recipeFiles.map((f) => relative(join(root, 'recipes'), f).replace(/\.md$/, '')));
const assetExists = (name) => { try { statSync(new URL(`../src/assets/recipes/${name}`, import.meta.url)); return true; } catch { return false; } };

// Links written as site:<path> must point at a recipe or part page that exists.
function checkSiteLinks(rel, text) {
  for (const m of text.matchAll(/\]\(site:([^)\s]+)\)/g)) {
    const target = m[1].replace(/^\/+|\/+$/g, '');
    const [kind, ...rest] = target.split('/');
    if (kind === 'recipes' && rest.length === 1) {
      if (!recipeIds.has(rest[0])) err(rel, `link site:${m[1]} points at a recipe that doesn't exist`);
    } else if (kind === 'parts' && rest.length === 2) {
      if (!partPages.has(rest.join('/'))) err(rel, `link site:${m[1]} points at a part page that doesn't exist`);
    } else if (!['recipes', 'parts', 'about', 'licenses', 'contribute'].includes(kind)) {
      warn(rel, `link site:${m[1]}: can't check this kind of link`);
    }
  }
}
for (const f of partFiles) checkSiteLinks(relative(root, f), content(f));

for (const f of recipeFiles) {
  const rel = relative(root, f);
  const fm = front(content(f));
  checkYamlHazards(rel, fm);
  checkBodyStartsWithSection(rel, content(f));
  checkSiteLinks(rel, content(f));
  const hero = field(fm, 'hero');
  if (hero && !assetExists(hero)) err(rel, `hero file src/assets/recipes/${hero} not found`);
  const schematic = field(fm, 'schematic');
  if (schematic && !assetExists(schematic)) err(rel, `schematic file src/assets/recipes/${schematic} not found (run npm run schematics?)`);
  if (/^components:/m.test(fm)) {
    const refs = [...fm.matchAll(/(?<![\w-])ref:\s*["']?([^"',}\n]+)/g)].map((m) => m[1].trim());
    const dup = refs.find((r, i) => refs.indexOf(r) !== i);
    if (dup) err(rel, `reference designator "${dup}" appears twice in components`);
  }
}

console.log(`${partFiles.length} part files, ${recipeFiles.length} recipe files checked: ${errors} errors, ${warnings} warnings.`);
process.exit(errors ? 1 : 0);
