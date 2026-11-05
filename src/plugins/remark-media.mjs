import { readFileSync } from 'node:fs';

// Rewrites three kinds of special Markdown URLs.
//
//   media:<file>  ->  the media host (Cloudflare R2 on media.circuitdessert.org)
//     ![Scope capture of the switch node](media:sy21219-switch-node.webp)
//     Set MEDIA_BASE_URL to point somewhere else (for example a local preview server).
//
//   site:<path>   ->  a page on this site, with the site's base path added, so the link works on a
//                     custom domain and on a GitHub Pages project URL alike
//     [a recipe](site:recipes/<id>/)
//     [SY21219 part page](site:parts/silergy/sy21219/)
//
//   schematic:<file>.svg  ->  a drawing from src/assets/recipes/, inlined so it follows the light and dark themes.
//                             The text in the brackets becomes the caption. Put it on a line of its own.
//     ![Reference circuit from the datasheet (VOUT = 5 V)](schematic:sy21219-schematic.svg)
const MEDIA = (process.env.MEDIA_BASE_URL || 'https://media.circuitdessert.org').replace(/\/$/, '');
const BASE = (process.env.BASE_PATH || '/').replace(/\/$/, '');
const ASSETS = new URL('../assets/recipes/', import.meta.url);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function schematicHtml(name, caption) {
  if (!/^[\w.-]+\.svg$/.test(name)) throw new Error(`schematic:${name} must be a plain .svg file name from src/assets/recipes/`);
  let svg;
  try { svg = readFileSync(new URL(name, ASSETS), 'utf8'); }
  catch { throw new Error(`schematic:${name} not found in src/assets/recipes/ (run npm run schematics?)`); }
  return '<figure class="cd-schematic">'
    + '<div class="cd-schematic-scroll" tabindex="0" role="region" aria-label="Schematic drawing (scrolls sideways on narrow screens)">' + svg.trim() + '</div>'
    + (caption ? `<figcaption class="cd-caption">${esc(caption)}</figcaption>` : '')
    + '</figure>';
}

function walk(node, fn) {
  fn(node);
  if (Array.isArray(node.children)) for (const child of node.children) walk(child, fn);
}

export default function remarkMedia() {
  return (tree) =>
    walk(tree, (node) => {
      // A paragraph that holds only a schematic: image is replaced by the inlined figure.
      if (Array.isArray(node.children)) {
        node.children = node.children.map((child) => {
          const img = child.type === 'paragraph' && child.children.length === 1 ? child.children[0] : null;
          if (img && img.type === 'image' && typeof img.url === 'string' && img.url.startsWith('schematic:')) {
            return { type: 'html', value: schematicHtml(img.url.slice('schematic:'.length), img.alt ?? '') };
          }
          return child;
        });
      }
      if ((node.type !== 'image' && node.type !== 'link') || typeof node.url !== 'string') return;
      if (node.url.startsWith('media:')) node.url = `${MEDIA}/${node.url.slice('media:'.length)}`;
      else if (node.url.startsWith('site:')) node.url = `${BASE}/${node.url.slice('site:'.length).replace(/^\/+/, '')}`;
    });
}
