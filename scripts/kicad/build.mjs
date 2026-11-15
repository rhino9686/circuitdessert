// Generates KiCad footprints, KiCad symbols and package illustrations from scripts/kicad/data.mjs.
//   public/kicad/footprints/circuitdessert.pretty/<name>.kicad_mod   (KiCad 7 file format; opens in 7, 8 and 9)
//   public/kicad/symbols/<PART>.kicad_sym
//   src/assets/packages/<slug>.svg
import { mkdirSync, writeFileSync } from 'node:fs';
import { LIB, PACKAGES, SYMBOLS } from './data.mjs';

const root = new URL('../../', import.meta.url).pathname;
const out = (rel, text) => { const p = root + rel; mkdirSync(p.replace(/\/[^/]*$/, ''), { recursive: true }); writeFileSync(p, text); };
const n = (v) => String(+v.toFixed(4));
const mid = (r) => (r.min + r.max) / 2;
const rng = (r, d = 2) => `${r.min.toFixed(d)}–${r.max.toFixed(d)}`;

// ---------------------------------------------------------------- footprint
export function padList(pk) {
  // pin 1 top left, down the left side, then up the right side
  const x = pk.rowCentres / 2, y = pk.pitch;
  return [
    ['1', -x, -y], ['2', -x, 0], ['3', -x, y],
    ['4', x, y], ['5', x, 0], ['6', x, -y],
  ].map(([num, px, py]) => ({ num, x: px, y: py, w: pk.pad.long, h: pk.pad.wide }));
}

function footprint(pk) {
  const pads = padList(pk);
  const bw = mid(pk.body.width) / 2, bl = mid(pk.body.length) / 2; // half sizes: across, along
  const padTop = Math.max(...pads.map((p) => Math.abs(p.y) + p.h / 2));
  const padOuter = Math.max(...pads.map((p) => Math.abs(p.x) + p.w / 2));
  const cx = Math.ceil((padOuter + pk.courtyardMargin) * 20) / 20;
  const cy = Math.ceil((Math.max(padTop, bl) + pk.courtyardMargin) * 20) / 20;
  const silkY = bl + 0.11, silkX = bw; // silkscreen over the body ends, clear of the pads
  const line = (x1, y1, x2, y2, layer, w) => `  (fp_line (start ${n(x1)} ${n(y1)}) (end ${n(x2)} ${n(y2)}) (stroke (width ${w}) (type solid)) (layer "${layer}"))`;
  const ch = 0.5; // pin 1 chamfer on the fab outline (ours)
  const L = [];
  L.push(`(footprint "${pk.file}" (version 20221018) (generator pcbnew)`);
  L.push(`  (layer "F.Cu")`);
  L.push(`  (descr "${pk.descr}")`);
  L.push(`  (tags "${pk.tags}")`);
  L.push(`  (attr smd)`);
  L.push(`  (fp_text reference "REF**" (at 0 ${n(-(cy + 0.7))}) (layer "F.SilkS")\n    (effects (font (size 1 1) (thickness 0.15)))\n  )`);
  L.push(`  (fp_text value "${pk.file}" (at 0 ${n(cy + 0.7)}) (layer "F.Fab")\n    (effects (font (size 1 1) (thickness 0.15)))\n  )`);
  L.push(`  (fp_text user "\${REFERENCE}" (at 0 0) (layer "F.Fab")\n    (effects (font (size 0.5 0.5) (thickness 0.075)))\n  )`);
  // silkscreen: over the two body ends, the top one reaching out to pin 1's side as the pin 1 marker
  L.push(line(-padOuter, -silkY, silkX, -silkY, 'F.SilkS', 0.12));
  L.push(line(-silkX, silkY, silkX, silkY, 'F.SilkS', 0.12));
  // fab outline with the pin 1 chamfer
  const pts = [[-bw, -bl + ch], [-bw + ch, -bl], [bw, -bl], [bw, bl], [-bw, bl]];
  pts.forEach((p, i) => { const q = pts[(i + 1) % pts.length]; L.push(line(p[0], p[1], q[0], q[1], 'F.Fab', 0.1)); });
  // courtyard
  const c = [[-cx, -cy], [cx, -cy], [cx, cy], [-cx, cy]];
  c.forEach((p, i) => { const q = c[(i + 1) % 4]; L.push(line(p[0], p[1], q[0], q[1], 'F.CrtYd', 0.05)); });
  for (const p of pads) {
    L.push(`  (pad "${p.num}" smd roundrect (at ${n(p.x)} ${n(p.y)}) (size ${n(p.w)} ${n(p.h)}) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.25))`);
  }
  L.push(')');
  return L.join('\n') + '\n';
}

// ---------------------------------------------------------------- symbol
function symbol(name, s) {
  const pk = PACKAGES[s.package];
  const half = 5.08, plen = 2.54;
  const place = (p) => { // p.pos: position along the side in KiCad symbol units (mm, on the 2.54 grid)
    if (p.side === 'left') return { x: -(half + plen), y: p.pos, a: 0 };
    if (p.side === 'right') return { x: half + plen, y: p.pos, a: 180 };
    if (p.side === 'top') return { x: p.pos, y: half + plen, a: 270 };
    return { x: p.pos, y: -(half + plen), a: 90 }; // bottom
  };
  const fx = `(effects (font (size 1.27 1.27)))`;
  const hid = `(effects (font (size 1.27 1.27)) hide)`;
  const L = [];
  L.push(`(kicad_symbol_lib (version 20220914) (generator kicad_symbol_editor)`);
  L.push(`  (symbol "${name}" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)`);
  L.push(`    (property "Reference" "U" (id 0) (at 0 ${n(half + plen + 1.27)} 0) ${fx})`);
  L.push(`    (property "Value" "${name}" (id 1) (at 0 ${n(-(half + plen + 1.27))} 0) ${fx})`);
  L.push(`    (property "Footprint" "${LIB}:${pk.file}" (id 2) (at 0 0 0) ${hid})`);
  L.push(`    (property "Datasheet" "${s.datasheet}" (id 3) (at 0 0 0) ${hid})`);
  L.push(`    (property "Description" "${s.description}" (id 4) (at 0 0 0) ${hid})`);
  L.push(`    (property "ki_keywords" "${s.keywords}" (id 5) (at 0 0 0) ${hid})`);
  L.push(`    (property "ki_fp_filters" "${pk.file}*" (id 6) (at 0 0 0) ${hid})`);
  L.push(`    (symbol "${name}_0_1"`);
  L.push(`      (rectangle (start ${n(-half)} ${n(half)}) (end ${n(half)} ${n(-half)}) (stroke (width 0.254) (type default)) (fill (type background)))`);
  L.push(`    )`);
  L.push(`    (symbol "${name}_1_1"`);
  for (const p of [...s.pins].sort((a, b) => Number(a.number) - Number(b.number))) {
    const q = place(p);
    L.push(`      (pin ${p.type} line (at ${n(q.x)} ${n(q.y)} ${q.a}) (length ${plen}) (name "${p.name}" ${fx}) (number "${p.number}" ${fx}))`);
  }
  L.push(`    )`);
  L.push(`  )`);
  L.push(`)`);
  return L.join('\n') + '\n';
}

// ---------------------------------------------------------------- illustration
function illustration(pk) {
  const S = 72; // px per mm
  const bw = mid(pk.body.width) / 2, bl = mid(pk.body.length) / 2;
  const span = mid(pk.leadSpan) / 2, lw = mid(pk.leadWidth) / 2;
  const pads = padList(pk);
  const ax = 165, bx = 440, cy = 160; // panel centres
  const X = (c, v) => n(c + v * S), Y = (v) => n(cy + v * S);
  const o = [];
  o.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 362" role="img" aria-label="${pk.name} package top view and footprint">`);
  o.push(`<style>
.pk-body{fill:var(--cd-surface-2);stroke:var(--cd-border-strong);stroke-width:2}
.pk-lead{fill:var(--cd-muted)}
.pk-pad{fill:var(--cd-accent);fill-opacity:.85}
.pk-out{fill:none;stroke:var(--cd-faint);stroke-width:1.5;stroke-dasharray:6 4}
.pk-dim{stroke:var(--cd-muted);stroke-width:1.2;fill:none}
.pk-dot{fill:var(--cd-text)}
.pk-t{fill:var(--cd-text);font:600 14px system-ui,sans-serif}
.pk-n{fill:var(--cd-muted);font:12.5px system-ui,sans-serif}
.pk-h{fill:var(--cd-text);font:600 15px system-ui,sans-serif}
</style>`);
  // panel A: package top view
  o.push(`<text class="pk-h" x="${ax}" y="24" text-anchor="middle">Package, top view</text>`);
  o.push(`<rect class="pk-body" x="${X(ax, -bw)}" y="${Y(-bl)}" width="${n(bw * 2 * S)}" height="${n(bl * 2 * S)}" rx="4"/>`);
  for (const [i, y] of [-pk.pitch, 0, pk.pitch].entries()) {
    for (const side of [-1, 1]) {
      const x0 = side < 0 ? -span : bw;
      o.push(`<rect class="pk-lead" x="${X(ax, x0)}" y="${Y(y - lw)}" width="${n((span - bw) * S)}" height="${n(lw * 2 * S)}"/>`);
    }
    o.push(`<text class="pk-t" x="${X(ax, -span - 0.12)}" y="${n(cy + y * S + 5)}" text-anchor="end">${i + 1}</text>`);
    o.push(`<text class="pk-t" x="${X(ax, span + 0.12)}" y="${n(cy + y * S + 5)}">${6 - i}</text>`);
  }
  o.push(`<circle class="pk-dot" cx="${X(ax, -bw + 0.3)}" cy="${Y(-bl + 0.3)}" r="9"/>`);
  o.push(`<text class="pk-n" x="${X(ax, -bw + 0.3 + 0.2)}" y="${n(cy + (-bl + 0.3) * S + 5)}">pin 1</text>`);
  // length dimension (along the body) on the left
  const dx = ax - (span + 0.62) * S;
  o.push(`<path class="pk-dim" d="M${n(dx)} ${Y(-bl)}V${Y(bl)}M${n(dx - 5)} ${Y(-bl)}h10M${n(dx - 5)} ${Y(bl)}h10"/>`);
  o.push(`<text class="pk-n" transform="translate(${n(dx - 8)} ${cy}) rotate(-90)" text-anchor="middle">${rng(pk.body.length)}</text>`);
  // width and lead span below
  const by = cy + (bl + 0.3) * S;
  o.push(`<path class="pk-dim" d="M${X(ax, -bw)} ${n(by)}H${X(ax, bw)}M${X(ax, -bw)} ${n(by - 5)}v10M${X(ax, bw)} ${n(by - 5)}v10"/>`);
  o.push(`<text class="pk-n" x="${ax}" y="${n(by + 18)}" text-anchor="middle">body ${rng(pk.body.width)}</text>`);
  o.push(`<text class="pk-n" x="${ax}" y="${n(by + 36)}" text-anchor="middle">lead tip to tip ${rng(pk.leadSpan)}</text>`);
  o.push(`<text class="pk-n" x="${ax}" y="${n(by + 54)}" text-anchor="middle">lead width ${rng(pk.leadWidth)}</text>`);
  // panel B: footprint
  o.push(`<text class="pk-h" x="${bx}" y="24" text-anchor="middle">Footprint (recommended pads)</text>`);
  o.push(`<rect class="pk-out" x="${X(bx, -bw)}" y="${Y(-bl)}" width="${n(bw * 2 * S)}" height="${n(bl * 2 * S)}" rx="4"/>`);
  for (const p of pads) {
    o.push(`<rect class="pk-pad" x="${X(bx, p.x - p.w / 2)}" y="${Y(p.y - p.h / 2)}" width="${n(p.w * S)}" height="${n(p.h * S)}" rx="${n(p.h * S * 0.25)}"/>`);
    o.push(`<text class="pk-t" x="${X(bx, p.x)}" y="${n(cy + p.y * S + 5)}" text-anchor="middle" style="fill:var(--cd-on-accent)">${p.num}</text>`);
  }
  const rx = pk.rowCentres / 2, ry = cy + (pk.pitch + 0.62) * S;
  o.push(`<path class="pk-dim" d="M${X(bx, -rx)} ${n(ry)}H${X(bx, rx)}M${X(bx, -rx)} ${n(ry - 5)}v10M${X(bx, rx)} ${n(ry - 5)}v10"/>`);
  o.push(`<text class="pk-n" x="${bx}" y="${n(ry + 18)}" text-anchor="middle">${pk.rowCentres.toFixed(2)} between pad centres</text>`);
  // pitch dimension between the two pad columns, on the centre line
  o.push(`<path class="pk-dim" d="M${n(bx)} ${Y(0)}V${Y(pk.pitch)}M${n(bx - 5)} ${Y(0)}h10M${n(bx - 5)} ${Y(pk.pitch)}h10"/>`);
  o.push(`<text class="pk-n" x="${n(bx + 8)}" y="${n(cy + pk.pitch * S / 2 + 4)}">${pk.pitch.toFixed(2)}</text>`);
  o.push(`<text class="pk-n" x="${bx}" y="${n(ry + 36)}" text-anchor="middle">pads ${pk.pad.long.toFixed(2)} × ${pk.pad.wide.toFixed(2)} mm</text>`);
  o.push('</svg>');
  return o.join('\n') + '\n';
}

// ---------------------------------------------------------------- write
for (const [slug, pk] of Object.entries(PACKAGES)) {
  out(`public/kicad/footprints/${LIB}.pretty/${pk.file}.kicad_mod`, footprint(pk));
  out(`src/assets/packages/${slug}.svg`, illustration(pk));
}
for (const [name, s] of Object.entries(SYMBOLS)) out(`public/kicad/symbols/${name}.kicad_sym`, symbol(name, s));
console.log(`Wrote ${Object.keys(PACKAGES).length} footprint(s), ${Object.keys(SYMBOLS).length} symbol(s) and ${Object.keys(PACKAGES).length} illustration(s).`);
