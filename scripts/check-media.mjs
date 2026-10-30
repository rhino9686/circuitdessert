// Checks images and media: references. Runs as part of `npm run validate` (and so in CI).
//  - new images live in media-incoming/, are WebP / AVIF / SVG, and are small
//  - file names are lowercase-hyphenated and never reuse a name that is already uploaded
//  - every media:<file> reference in the content points at a file that exists
//  - every Markdown image has alt text
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const incomingDir = join(root, 'media-incoming');
const manifestFile = join(root, 'src/data/media-manifest.txt');
const contentDir = join(root, 'src/content');

const MAX_RASTER = 500 * 1024;
const MAX_SVG = 100 * 1024;
const ALLOWED = new Set(['.webp', '.avif', '.svg']);
const IGNORE = new Set(['.gitkeep', 'README.md']);

let errors = 0;
let warnings = 0;
const err = (m) => { errors++; console.error(`ERROR   ${m}`); };
const warn = (m) => { warnings++; console.warn(`warning ${m}`); };

const manifest = new Set(
  existsSync(manifestFile)
    ? readFileSync(manifestFile, 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))
    : [],
);

const incoming = existsSync(incomingDir) ? readdirSync(incomingDir).filter((f) => !IGNORE.has(f)) : [];
for (const f of incoming) {
  const full = join(incomingDir, f);
  const ext = extname(f).toLowerCase();
  if (!ALLOWED.has(ext)) err(`media-incoming/${f}: use WebP, AVIF or SVG (found "${ext || 'no extension'}")`);
  if (!/^[a-z0-9][a-z0-9._-]*$/.test(f)) err(`media-incoming/${f}: use a lowercase file name with hyphens, no spaces`);
  const size = statSync(full).size;
  const max = ext === '.svg' ? MAX_SVG : MAX_RASTER;
  if (size > max) err(`media-incoming/${f}: ${(size / 1024).toFixed(0)} KB is over the ${max / 1024} KB limit`);
  if (manifest.has(f)) err(`media-incoming/${f}: a file with this name is already on the media host; choose a new name`);
}

function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const files = walk(contentDir).filter((f) => /\.(md|mdx)$/.test(f) && !/(^|\/)_/.test(relative(contentDir, f)));
const referenced = new Set();
for (const f of files) {
  const rel = relative(root, f);
  // Ignore code: examples in fenced blocks and `inline code` are documentation, not real references.
  const text = readFileSync(f, 'utf8')
    .replace(/^[ \t]*```[\s\S]*?^[ \t]*```/gm, '')
    .replace(/`[^`\n]*`/g, '');
  for (const m of text.matchAll(/media:([^\s)"'\]]+)/g)) {
    referenced.add(m[1]);
    if (!incoming.includes(m[1]) && !manifest.has(m[1])) {
      err(`${rel}: references media:${m[1]}, but it is neither in media-incoming/ nor already uploaded`);
    }
  }
  for (const m of text.matchAll(/!\[([^\]]*)\]\(/g)) {
    if (!m[1].trim()) err(`${rel}: an image has no alt text - describe it inside the [ ]`);
  }
}
for (const f of incoming) if (!referenced.has(f)) warn(`media-incoming/${f}: not referenced by any page yet`);

console.log(`${incoming.length} incoming images, ${manifest.size} uploaded, ${referenced.size} referenced: ${errors} errors, ${warnings} warnings.`);
process.exit(errors ? 1 : 0);
