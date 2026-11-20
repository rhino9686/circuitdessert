// Generates KiCad footprints, KiCad symbols and package illustrations from scripts/kicad/data.mjs.
//   public/kicad/footprints/circuitdessert.pretty/<name>.kicad_mod   (KiCad 7 file format; opens in 7, 8 and 9)
//   public/kicad/symbols/<PART>.kicad_sym
//   src/assets/packages/<slug>.svg
import { mkdirSync, writeFileSync } from 'node:fs';
import { LIB, PACKAGES, SYMBOLS } from './data.mjs';
import { padListQuad, footprintQuad, illustrationQuad } from './quad.mjs';

const root = new URL('../../', import.meta.url).pathname;
const out = (rel, text) => { const p = root + rel; mkdirSync(p.replace(/\/[^/]*$/, ''), { recursive: true }); writeFileSync(p, text); };
const n = (v) => String(+v.toFixed(4));
const mid = (r) => (r.min + r.max) / 2;
const rng = (r, d = 2) => `${r.min.toFixed(d)}–${r.max.toFixed(d)}`;

// ---------------------------------------------------------------- footprint
export const pinsPerSide = (pk) => pk.pinsPerSide ?? 3;
// y of the pins on one side, top to bottom
const rowYs = (pk) => Array.from({ length: pinsPerSide(pk) }, (_, i) => (i - (pinsPerSide(pk) - 1) / 2) * pk.pitch);

export function padList(pk) {
  if (pk.layout === 'quad') return padListQuad(pk);
  // pin 1 top left, down the left side, then up the right side; an exposed pad, if any, last
  const x = pk.rowCentres / 2, ys = rowYs(pk), k = ys.length;
  const pads = [
    ...ys.map((y, i) => ({ num: String(i + 1), x: -x, y })),
    ...ys.map((_, j) => ({ num: String(k + 1 + j), x, y: ys[k - 1 - j] })),
  ].map((p) => ({ ...p, w: pk.pad.long, h: pk.pad.wide }));
  if (pk.thermalPad) {
    const t = pk.thermalPad;
    pads.push({ num: t.num, x: 0, y: 0, w: t.across, h: t.along, ratio: t.radius / Math.min(t.across, t.along), thermal: true });
  }
  return pads;
}

function footprint(pk) {
  if (pk.layout === 'quad') return footprintQuad(pk);
  if (pk.kind === 'dual-nolead') return footprintDualNoLead(pk);
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
    L.push(`  (pad "${p.num}" smd roundrect (at ${n(p.x)} ${n(p.y)}) (size ${n(p.w)} ${n(p.h)}) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio ${n(p.ratio ?? 0.25)}))`);
  }
  L.push(')');
  return L.join('\n') + '\n';
}

// ---------------------------------------------------------------- symbol
function symbol(name, s) {
  const pk = s.package ? PACKAGES[s.package] : null; // a symbol can come before its footprint: then Footprint stays empty
  const plen = 2.54;
  // body half width and half height; `body` sets both, `half` sets a square body, the default is the small square body
  const hw = s.body?.halfW ?? s.half ?? 5.08, hh = s.body?.halfH ?? s.half ?? 5.08;
  const place = (p) => { // p.pos: position along the side in KiCad symbol units (mm, on the 2.54 grid)
    if (p.side === 'left') return { x: -(hw + plen), y: p.pos, a: 0 };
    if (p.side === 'right') return { x: hw + plen, y: p.pos, a: 180 };
    if (p.side === 'top') return { x: p.pos, y: hh + plen, a: 270 };
    return { x: p.pos, y: -(hh + plen), a: 90 }; // bottom
  };
  const fx = `(effects (font (size 1.27 1.27)))`;
  const hid = `(effects (font (size 1.27 1.27)) hide)`;
  const L = [];
  L.push(`(kicad_symbol_lib (version 20220914) (generator kicad_symbol_editor)`);
  L.push(`  (symbol "${name}" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)`);
  L.push(`    (property "Reference" "U" (id 0) (at 0 ${n(hh + plen + 1.27)} 0) ${fx})`);
  L.push(`    (property "Value" "${name}" (id 1) (at 0 ${n(-(hh + plen + 1.27))} 0) ${fx})`);
  L.push(`    (property "Footprint" "${pk ? `${LIB}:${pk.file}` : ''}" (id 2) (at 0 0 0) ${hid})`);
  L.push(`    (property "Datasheet" "${s.datasheet}" (id 3) (at 0 0 0) ${hid})`);
  L.push(`    (property "Description" "${s.description}" (id 4) (at 0 0 0) ${hid})`);
  L.push(`    (property "ki_keywords" "${s.keywords}" (id 5) (at 0 0 0) ${hid})`);
  L.push(`    (property "ki_fp_filters" "${pk ? `${pk.file}*` : s.fpFilter}" (id 6) (at 0 0 0) ${hid})`);
  L.push(`    (symbol "${name}_0_1"`);
  L.push(`      (rectangle (start ${n(-hw)} ${n(hh)}) (end ${n(hw)} ${n(-hh)}) (stroke (width 0.254) (type default)) (fill (type background)))`);
  L.push(`    )`);
  L.push(`    (symbol "${name}_1_1"`);
  for (const p of [...s.pins].sort((a, b) => Number(a.number) - Number(b.number) || String(a.number).localeCompare(String(b.number)))) {
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
  if (pk.layout === 'quad') return illustrationQuad(pk);
  if (pk.kind === 'dual-nolead') return illustrationDualNoLead(pk);
  const S = pk.illustration?.scale ?? 72; // px per mm
  const bw = mid(pk.body.width) / 2, bl = mid(pk.body.length) / 2;
  const span = mid(pk.leadSpan) / 2, lw = mid(pk.leadWidth) / 2;
  const pads = padList(pk);
  const il = pk.illustration ?? {};
  const ax = 165, bx = il.bx ?? 440, cy = il.cy ?? 160; // panel centres
  const ys = rowYs(pk), k = ys.length;
  const W = il.width ?? 600, H = Math.ceil(cy + (bl + 0.3) * S + 75);
  const X = (c, v) => n(c + v * S), Y = (v) => n(cy + v * S);
  const o = [];
  o.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${pk.name} package top view and footprint">`);
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
  for (const [i, y] of ys.entries()) {
    for (const side of [-1, 1]) {
      const x0 = side < 0 ? -span : bw;
      o.push(`<rect class="pk-lead" x="${X(ax, x0)}" y="${Y(y - lw)}" width="${n((span - bw) * S)}" height="${n(lw * 2 * S)}"/>`);
    }
    o.push(`<text class="pk-t" x="${X(ax, -span - 0.12)}" y="${n(cy + y * S + 5)}" text-anchor="end">${i + 1}</text>`);
    o.push(`<text class="pk-t" x="${X(ax, span + 0.12)}" y="${n(cy + y * S + 5)}">${2 * k - i}</text>`);
  }
  o.push(`<circle class="pk-dot" cx="${X(ax, -bw + 0.3)}" cy="${Y(-bl + 0.3)}" r="9"/>`);
  o.push(`<text class="pk-n" x="${n(ax + (-bw + 0.3) * S + Math.max(0.2 * S, 14))}" y="${n(cy + (-bl + 0.3) * S + 5)}">pin 1</text>`);
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
    o.push(`<rect class="pk-pad" x="${X(bx, p.x - p.w / 2)}" y="${Y(p.y - p.h / 2)}" width="${n(p.w * S)}" height="${n(p.h * S)}" rx="${n(Math.min(p.w, p.h) * S * (p.ratio ?? 0.25))}"/>`);
    o.push(`<text class="pk-t" x="${X(bx, p.x)}" y="${n(cy + p.y * S + 5)}" text-anchor="middle" style="fill:var(--cd-on-accent)">${p.num}</text>`);
  }
  const rx = pk.rowCentres / 2, ry = cy + (ys[k - 1] + 0.62) * S;
  o.push(`<path class="pk-dim" d="M${X(bx, -rx)} ${n(ry)}H${X(bx, rx)}M${X(bx, -rx)} ${n(ry - 5)}v10M${X(bx, rx)} ${n(ry - 5)}v10"/>`);
  o.push(`<text class="pk-n" x="${bx}" y="${n(ry + 18)}" text-anchor="middle">${pk.rowCentres.toFixed(2)} between pad centres</text>`);
  if (pk.thermalPad) {
    // pitch dimension outside the right-hand pads, between the two lowest ones (the centre line is taken by the exposed pad)
    const dx = bx + (rx + pk.pad.long / 2) * S + 12, y0 = ys[k - 2], y1 = ys[k - 1];
    o.push(`<path class="pk-dim" d="M${n(dx)} ${Y(y0)}V${Y(y1)}M${n(dx - 5)} ${Y(y0)}h10M${n(dx - 5)} ${Y(y1)}h10"/>`);
    o.push(`<text class="pk-n" x="${n(dx + 8)}" y="${n(cy + (y0 + y1) / 2 * S + 4)}">${pk.pitch.toFixed(2)}</text>`);
  } else {
    // pitch dimension between the two pad columns, on the centre line
    o.push(`<path class="pk-dim" d="M${n(bx)} ${Y(0)}V${Y(pk.pitch)}M${n(bx - 5)} ${Y(0)}h10M${n(bx - 5)} ${Y(pk.pitch)}h10"/>`);
    o.push(`<text class="pk-n" x="${n(bx + 8)}" y="${n(cy + pk.pitch * S / 2 + 4)}">${pk.pitch.toFixed(2)}</text>`);
  }
  o.push(`<text class="pk-n" x="${bx}" y="${n(ry + 36)}" text-anchor="middle">pads ${pk.pad.long.toFixed(2)} × ${pk.pad.wide.toFixed(2)} mm</text>`);
  if (pk.thermalPad) o.push(`<text class="pk-n" x="${bx}" y="${n(ry + 54)}" text-anchor="middle">exposed pad ${pk.thermalPad.across.toFixed(2)} × ${pk.thermalPad.along.toFixed(2)} mm</text>`);
  o.push('</svg>');
  return o.join('\n') + '\n';
}

// ---------------------------------------------------------------- two-row no-lead package with an exposed pad (VSON-14)
// Pads 1..pinsPerSide down the left side (x = -rowCentres/2), the rest up the right side. y runs along the rows.
const padRatio = (pk, p) => (pk.padRadius ? pk.padRadius / Math.min(p.w, p.h) : 0.5);
export function padListDual(pk) {
  const x = pk.rowCentres / 2, k = pk.pinsPerSide, pads = [];
  for (let i = 0; i < k; i++) pads.push({ num: String(i + 1), x: -x, y: (i - (k - 1) / 2) * pk.pitch, w: pk.pad.long, h: pk.pad.wide });
  for (let i = 0; i < k; i++) pads.push({ num: String(k + 1 + i), x, y: ((k - 1) / 2 - i) * pk.pitch, w: pk.pad.long, h: pk.pad.wide });
  return pads;
}

// Outline of the comb-shaped exposed pad as a closed list of [x, y] points (x across the body, y along it).
export function thermalOutline(t) {
  const a = t.across / 2, ye = t.along / 2, yc = t.centre / 2;
  // x edges of the fingers, left to right: finger, gap, finger, ...
  // fingers fill the width unless `centred` is set (then they sit in the middle, as on SON-8)
  const xs = [t.centred ? -(t.fingers * t.finger + (t.fingers - 1) * t.gap) / 2 : -a];
  for (let i = 0; i < t.fingers; i++) { xs.push(xs[xs.length - 1] + t.finger); if (i < t.fingers - 1) xs.push(xs[xs.length - 1] + t.gap); }
  const end = (sign, edges) => { // walk one end of the comb: finger tips at sign*ye, gap bottoms at sign*yc
    const o = [];
    for (let i = 0; i < edges.length; i += 2) { o.push([edges[i], sign * ye], [edges[i + 1], sign * ye]); if (i + 2 < edges.length) o.push([edges[i + 1], sign * yc], [edges[i + 2], sign * yc]); }
    return o;
  };
  if (t.centred) { // fingers sit in the middle: add the corners of the centre block on each side of them
    const side = (sign) => [[-a, sign * yc], [xs[0], sign * yc], ...end(sign, xs), [xs[xs.length - 1], sign * yc], [a, sign * yc]];
    const tp = side(-1), bt = side(1).reverse();
    return [...tp, ...bt];
  }
  const top = end(-1, xs), bottom = end(1, xs).reverse();
  return [...top, ...bottom];
}

function footprintDualNoLead(pk) {
  const pads = padListDual(pk), t = pk.thermal;
  const bw = mid(pk.body.width) / 2, bl = mid(pk.body.length) / 2; // half sizes: across, along
  const padOuter = Math.max(...pads.map((p) => Math.abs(p.x) + p.w / 2));
  const padTop = Math.max(...pads.map((p) => Math.abs(p.y) + p.h / 2));
  const cx = Math.ceil((padOuter + pk.courtyardMargin) * 20) / 20;
  const cy = Math.ceil((Math.max(padTop, bl, t.along / 2) + pk.courtyardMargin) * 20) / 20;
  const sx = Math.ceil((padOuter + 0.2) * 20) / 20; // silkscreen lines run along the long sides, 0.2 outside the pads
  const sy = bl;
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
  // silkscreen: a line along each long side; the left one has a tick across the top as the pin 1 marker
  L.push(line(-sx, -sy, -sx, sy, 'F.SilkS', 0.12));
  L.push(line(sx, -sy, sx, sy, 'F.SilkS', 0.12));
  L.push(line(-sx, -sy, -(padOuter - pk.pad.long), -sy, 'F.SilkS', 0.12));
  // fab outline with the pin 1 chamfer
  const pts = [[-bw, -bl + ch], [-bw + ch, -bl], [bw, -bl], [bw, bl], [-bw, bl]];
  pts.forEach((p, i) => { const q = pts[(i + 1) % pts.length]; L.push(line(p[0], p[1], q[0], q[1], 'F.Fab', 0.1)); });
  // courtyard
  const c = [[-cx, -cy], [cx, -cy], [cx, cy], [-cx, cy]];
  c.forEach((p, i) => { const q = c[(i + 1) % 4]; L.push(line(p[0], p[1], q[0], q[1], 'F.CrtYd', 0.05)); });
  for (const p of pads) {
    // roundrect_rratio 0.5 on the shorter side gives full round ends (VSON-14, R0.12); `padRadius` sets a corner radius instead (SON-8, R0.05)
    L.push(`  (pad "${p.num}" smd roundrect (at ${n(p.x)} ${n(p.y)}) (size ${n(p.w)} ${n(p.h)}) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio ${n(padRatio(pk, p))}))`);
  }
  // exposed pad: a custom pad whose shape is the comb outline
  const poly = thermalOutline(t).map(([x, y]) => `(xy ${n(x)} ${n(y)})`).join(' ');
  L.push(`  (pad "${t.num}" smd custom (at 0 0) (size ${n(t.across)} ${n(t.centre)}) (layers "F.Cu" "F.Paste" "F.Mask")\n    (options (clearance outline) (anchor rect))\n    (primitives\n      (gr_poly (pts ${poly}) (width 0) (fill yes))\n    )\n  )`);
  L.push(')');
  return L.join('\n') + '\n';
}

function illustrationDualNoLead(pk) {
  const S = 52; // px per mm
  const bw = mid(pk.body.width) / 2, bl = mid(pk.body.length) / 2;
  const ll = mid(pk.leadLength), lw = mid(pk.leadWidth) / 2;
  const pads = padListDual(pk), t = pk.thermal;
  const ax = 165, bx = 440, cy = 170; // panel centres
  const X = (c, v) => n(c + v * S), Y = (v) => n(cy + v * S);
  const poly = (c, pts) => pts.map(([x, y]) => `${X(c, x)},${Y(y)}`).join(' ');
  // package exposed pad: same fingers, but out to the body edge (page 32)
  const tp = { ...t, along: mid(pk.body.length), centre: t.centre };
  const o = [];
  o.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" role="img" aria-label="${pk.name} package contacts and footprint">`);
  o.push(`<style>
.pk-body{fill:var(--cd-surface-2);stroke:var(--cd-border-strong);stroke-width:2}
.pk-lead{fill:var(--cd-muted)}
.pk-pad{fill:var(--cd-accent);fill-opacity:.85}
.pk-out{fill:none;stroke:var(--cd-faint);stroke-width:1.5;stroke-dasharray:6 4}
.pk-dim{stroke:var(--cd-muted);stroke-width:1.2;fill:none}
.pk-dot{fill:var(--cd-text)}
.pk-t{fill:var(--cd-text);font:600 13px system-ui,sans-serif}
.pk-n{fill:var(--cd-muted);font:12.5px system-ui,sans-serif}
.pk-h{fill:var(--cd-text);font:600 15px system-ui,sans-serif}
</style>`);
  // panel A: the package's contacts, drawn in the footprint's orientation (seen from above through the body)
  o.push(`<text class="pk-h" x="${ax}" y="24" text-anchor="middle">Package contacts, seen from above</text>`);
  o.push(`<rect class="pk-body" x="${X(ax, -bw)}" y="${Y(-bl)}" width="${n(bw * 2 * S)}" height="${n(bl * 2 * S)}" rx="4"/>`);
  o.push(`<polygon class="pk-lead" points="${poly(ax, thermalOutline(tp))}"/>`);
  for (const p of pads) {
    const side = p.x < 0 ? -1 : 1;
    const x0 = side < 0 ? -bw : bw - ll;
    o.push(`<rect class="pk-lead" x="${X(ax, x0)}" y="${Y(p.y - lw)}" width="${n(ll * S)}" height="${n(lw * 2 * S)}"/>`);
    o.push(`<text class="pk-t" x="${X(ax, side * (bw + 0.12))}" y="${n(cy + p.y * S + 4.5)}" text-anchor="${side < 0 ? 'end' : 'start'}">${p.num}</text>`);
  }
  o.push(`<circle class="pk-dot" cx="${X(ax, -bw + 0.3)}" cy="${Y(-bl + 0.3)}" r="7"/>`);
  const dx = ax - (bw + 0.7) * S;
  o.push(`<path class="pk-dim" d="M${n(dx)} ${Y(-bl)}V${Y(bl)}M${n(dx - 5)} ${Y(-bl)}h10M${n(dx - 5)} ${Y(bl)}h10"/>`);
  o.push(`<text class="pk-n" transform="translate(${n(dx - 8)} ${cy}) rotate(-90)" text-anchor="middle">${rng(pk.body.length)}</text>`);
  const by = cy + (bl + 0.3) * S;
  o.push(`<path class="pk-dim" d="M${X(ax, -bw)} ${n(by)}H${X(ax, bw)}M${X(ax, -bw)} ${n(by - 5)}v10M${X(ax, bw)} ${n(by - 5)}v10"/>`);
  o.push(`<text class="pk-n" x="${ax}" y="${n(by + 18)}" text-anchor="middle">body ${rng(pk.body.width)}</text>`);
  o.push(`<text class="pk-n" x="${ax}" y="${n(by + 36)}" text-anchor="middle">contacts ${rng(pk.leadLength)} long, ${rng(pk.leadWidth)} wide</text>`);
  // panel B: footprint
  o.push(`<text class="pk-h" x="${bx}" y="24" text-anchor="middle">Footprint (land pattern)</text>`);
  o.push(`<rect class="pk-out" x="${X(bx, -bw)}" y="${Y(-bl)}" width="${n(bw * 2 * S)}" height="${n(bl * 2 * S)}" rx="4"/>`);
  o.push(`<polygon class="pk-pad" points="${poly(bx, thermalOutline(t))}"/>`);
  o.push(`<text class="pk-t" x="${n(bx)}" y="${n(cy + 4.5)}" text-anchor="middle" style="fill:var(--cd-on-accent)">${t.num}</text>`);
  for (const p of pads) {
    o.push(`<rect class="pk-pad" x="${X(bx, p.x - p.w / 2)}" y="${Y(p.y - p.h / 2)}" width="${n(p.w * S)}" height="${n(p.h * S)}" rx="${n(Math.min(p.w, p.h) * S * padRatio(pk, p))}"/>`);
    const side = p.x < 0 ? -1 : 1;
    o.push(`<text class="pk-t" x="${X(bx, p.x + side * (p.w / 2 + 0.12))}" y="${n(cy + p.y * S + 4.5)}" text-anchor="${side < 0 ? 'end' : 'start'}">${p.num}</text>`);
  }
  const rx = pk.rowCentres / 2, ry = cy + (t.along / 2 + 0.3) * S;
  o.push(`<path class="pk-dim" d="M${X(bx, -rx)} ${n(ry)}H${X(bx, rx)}M${X(bx, -rx)} ${n(ry - 5)}v10M${X(bx, rx)} ${n(ry - 5)}v10"/>`);
  o.push(`<text class="pk-n" x="${bx}" y="${n(ry + 18)}" text-anchor="middle">${pk.rowCentres.toFixed(2)} between pad rows</text>`);
  o.push(`<text class="pk-n" x="${bx}" y="${n(ry + 36)}" text-anchor="middle">pads ${pk.pad.long.toFixed(2)} × ${pk.pad.wide.toFixed(2)}, pitch ${pk.pitch.toFixed(2)}</text>`);
  o.push(`<text class="pk-n" x="${bx}" y="${n(ry + 54)}" text-anchor="middle">exposed pad ${t.along.toFixed(2)} × ${t.across.toFixed(2)}</text>`);
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
