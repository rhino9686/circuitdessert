// Two-row through-hole packages (DIP family), possibly with missing pin positions. Used for the eDIP-12B (Power Integrations V package).
// x is across the body, y along the rows. `pin1` says which column pin 1 heads: 'left' gives the usual DIP order (1..k down the left side,
// k+1..2k up the right side); 'right' gives the mirror (1..k down the right side, k+1..2k up the left side), as on the eDIP-12B, whose leads are
// formed so that the package's numbering runs clockwise when seen from above. Positions listed in `missing` keep their slot but get no pad.
const n = (v) => String(+v.toFixed(4));
const mid = (r) => (r.min + r.max) / 2;
const rng = (r, d = 2) => (r.min === r.max ? r.min.toFixed(d) : `${r.min.toFixed(d)}–${r.max.toFixed(d)}`);

export function padListTht(pk) {
  const k = pk.pinsPerSide, x = pk.rowCentres / 2, s = pk.pin1 === 'right' ? 1 : -1;
  const slots = [];
  for (let i = 0; i < k; i++) slots.push({ num: String(i + 1), x: s * x, y: (i - (k - 1) / 2) * pk.pitch });
  for (let i = 0; i < k; i++) slots.push({ num: String(k + 1 + i), x: -s * x, y: ((k - 1) / 2 - i) * pk.pitch });
  const missing = new Set(pk.missing ?? []);
  // `padNumbers` renames slots whose datasheet number differs from the slot's place in the DIP order (the DIP7 skips a position).
  return slots.filter((p) => !missing.has(p.num)).map((p) => ({ ...p, num: pk.padNumbers?.[p.num] ?? p.num, d: pk.pad.diameter, drill: pk.pad.drill }));
}

export function footprintTht(pk) {
  const pads = padListTht(pk);
  const bw = mid(pk.body.width) / 2, bl = mid(pk.body.length) / 2; // half sizes: across the rows, along them
  const r = pk.pad.diameter / 2;
  const padOuter = Math.max(...pads.map((p) => Math.abs(p.x) + r));
  const padTop = Math.max(...pads.map((p) => Math.abs(p.y) + r));
  const cx = Math.ceil((Math.max(padOuter, bw) + pk.courtyardMargin) * 20) / 20;
  const cy = Math.ceil((Math.max(padTop, bl) + pk.courtyardMargin) * 20) / 20;
  const sy = Math.ceil((Math.max(padTop, bl) + 0.36) * 100) / 100; // silkscreen across the two body ends, clear of the end pads
  const s1 = pk.pin1 === 'right' ? 1 : -1;
  const mask = pk.pad.mask ? ` (solder_mask_margin ${n((pk.pad.mask - pk.pad.diameter) / 2)})` : '';
  const line = (x1, y1, x2, y2, layer, w) => `  (fp_line (start ${n(x1)} ${n(y1)}) (end ${n(x2)} ${n(y2)}) (stroke (width ${w}) (type solid)) (layer "${layer}"))`;
  const ch = 0.5; // pin 1 chamfer on the fab outline (ours)
  const L = [];
  L.push(`(footprint "${pk.file}" (version 20221018) (generator pcbnew)`);
  L.push(`  (layer "F.Cu")`);
  L.push(`  (descr "${pk.descr}")`);
  L.push(`  (tags "${pk.tags}")`);
  L.push(`  (attr through_hole)`);
  L.push(`  (fp_text reference "REF**" (at 0 ${n(-(cy + 0.7))}) (layer "F.SilkS")\n    (effects (font (size 1 1) (thickness 0.15)))\n  )`);
  L.push(`  (fp_text value "${pk.file}" (at 0 ${n(cy + 0.7)}) (layer "F.Fab")\n    (effects (font (size 1 1) (thickness 0.15)))\n  )`);
  L.push(`  (fp_text user "\${REFERENCE}" (at 0 0) (layer "F.Fab")\n    (effects (font (size 1 1) (thickness 0.15)))\n  )`);
  // silkscreen: across both body ends; the top one reaches out over pin 1 as the pin 1 marker
  L.push(line(s1 < 0 ? -padOuter : -bw, -sy, s1 < 0 ? bw : padOuter, -sy, 'F.SilkS', 0.12));
  L.push(line(-bw, sy, bw, sy, 'F.SilkS', 0.12));
  // fab outline with the pin 1 chamfer at pin 1's corner
  const pts = s1 > 0
    ? [[-bw, -bl], [bw - ch, -bl], [bw, -bl + ch], [bw, bl], [-bw, bl]]
    : [[-bw, -bl + ch], [-bw + ch, -bl], [bw, -bl], [bw, bl], [-bw, bl]];
  pts.forEach((p, i) => { const q = pts[(i + 1) % pts.length]; L.push(line(p[0], p[1], q[0], q[1], 'F.Fab', 0.1)); });
  const c = [[-cx, -cy], [cx, -cy], [cx, cy], [-cx, cy]];
  c.forEach((p, i) => { const q = c[(i + 1) % 4]; L.push(line(p[0], p[1], q[0], q[1], 'F.CrtYd', 0.05)); });
  for (const p of pads) {
    // pin 1 is a rounded square (ours, the usual KiCad marker); the others are round, as the datasheet's hole pattern draws them
    const shape = p.num === '1' ? `roundrect` : 'circle';
    const extra = p.num === '1' ? ' (roundrect_rratio 0.25)' : '';
    L.push(`  (pad "${p.num}" thru_hole ${shape} (at ${n(p.x)} ${n(p.y)}) (size ${n(p.d)} ${n(p.d)}) (drill ${n(p.drill)}) (layers "*.Cu" "*.Mask")${extra}${mask})`);
  }
  L.push(')');
  return L.join('\n') + '\n';
}

export function illustrationTht(pk) {
  const S = 24; // px per mm
  const bw = mid(pk.body.width) / 2, bl = mid(pk.body.length) / 2;
  const span = pk.rowCentres / 2, lw = mid(pk.leadWidth) / 2;
  const pads = padListTht(pk), r = pk.pad.diameter / 2;
  const ax = 175, bx = 530, cy = 175;
  const X = (c, v) => n(c + v * S), Y = (v) => n(cy + v * S);
  const o = [];
  o.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 400" role="img" aria-label="${pk.name} package top view and footprint">`);
  o.push(`<style>
.pk-body{fill:var(--cd-surface-2);stroke:var(--cd-border-strong);stroke-width:2}
.pk-ep{fill:var(--cd-muted);fill-opacity:.35;stroke:var(--cd-muted);stroke-width:1}
.pk-lead{fill:var(--cd-muted)}
.pk-pad{fill:var(--cd-accent);fill-opacity:.85}
.pk-hole{fill:var(--cd-surface-2)}
.pk-out{fill:none;stroke:var(--cd-faint);stroke-width:1.5;stroke-dasharray:6 4}
.pk-dim{stroke:var(--cd-muted);stroke-width:1.2;fill:none}
.pk-dot{fill:var(--cd-text)}
.pk-t{fill:var(--cd-text);font:600 13px system-ui,sans-serif}
.pk-n{fill:var(--cd-muted);font:12.5px system-ui,sans-serif}
.pk-h{fill:var(--cd-text);font:600 15px system-ui,sans-serif}
</style>`);
  // panel A: package top view, leads drawn out to the row centres (where they go down through the board)
  o.push(`<text class="pk-h" x="${ax}" y="24" text-anchor="middle">Package, top view</text>`);
  for (const p of pads) {
    const x0 = p.x < 0 ? -span : bw;
    o.push(`<rect class="pk-lead" x="${X(ax, x0)}" y="${Y(p.y - lw)}" width="${n((span - bw) * S)}" height="${n(lw * 2 * S)}"/>`);
    const side = p.x < 0 ? -1 : 1;
    o.push(`<text class="pk-t" x="${X(ax, p.x + side * 0.5)}" y="${n(cy + p.y * S + 4.5)}" text-anchor="${side < 0 ? 'end' : 'start'}">${p.num}</text>`);
  }
  o.push(`<rect class="pk-body" x="${X(ax, -bw)}" y="${Y(-bl)}" width="${n(bw * 2 * S)}" height="${n(bl * 2 * S)}" rx="4"/>`);
  if (pk.exposedPadTop) {
    const e = pk.exposedPadTop; // drawn at its maximum size, centred (the drawing's "Max" includes position tolerance)
    o.push(`<rect class="pk-ep" x="${X(ax, -e.across / 2)}" y="${Y(-e.along / 2)}" width="${n(e.across * S)}" height="${n(e.along * S)}" rx="3"/>`);
    o.push(`<text class="pk-n" x="${ax}" y="${n(cy + 4)}" text-anchor="middle">exposed pad (top)</text>`);
  }
  const s1 = pk.pin1 === 'right' ? 1 : -1;
  o.push(`<circle class="pk-dot" cx="${X(ax, s1 * (bw - 0.6))}" cy="${Y(-bl + 0.6)}" r="6"/>`);
  const by = cy + (bl + 0.45) * S;
  o.push(`<path class="pk-dim" d="M${X(ax, -bw)} ${n(by)}H${X(ax, bw)}M${X(ax, -bw)} ${n(by - 5)}v10M${X(ax, bw)} ${n(by - 5)}v10"/>`);
  o.push(`<text class="pk-n" x="${ax}" y="${n(by + 18)}" text-anchor="middle">body ${rng(pk.body.width)} across, ${rng(pk.body.length)} along the rows</text>`);
  o.push(`<text class="pk-n" x="${ax}" y="${n(by + 36)}" text-anchor="middle">lead width ${rng(pk.leadWidth)}</text>`);
  // panel B: footprint
  o.push(`<text class="pk-h" x="${bx}" y="24" text-anchor="middle">${pk.holeSizeOurs ? "Footprint (hole and pad size ours)" : "Footprint (datasheet hole pattern)"}</text>`);
  o.push(`<rect class="pk-out" x="${X(bx, -bw)}" y="${Y(-bl)}" width="${n(bw * 2 * S)}" height="${n(bl * 2 * S)}" rx="4"/>`);
  for (const p of pads) {
    if (p.num === '1') {
      o.push(`<rect class="pk-pad" x="${X(bx, p.x - r)}" y="${Y(p.y - r)}" width="${n(2 * r * S)}" height="${n(2 * r * S)}" rx="${n(0.25 * 2 * r * S)}"/>`);
    } else {
      o.push(`<circle class="pk-pad" cx="${X(bx, p.x)}" cy="${Y(p.y)}" r="${n(r * S)}"/>`);
    }
    o.push(`<circle class="pk-hole" cx="${X(bx, p.x)}" cy="${Y(p.y)}" r="${n((p.drill / 2) * S)}"/>`);
    const side = p.x < 0 ? -1 : 1;
    o.push(`<text class="pk-t" x="${X(bx, p.x + side * (r + 0.2))}" y="${n(cy + p.y * S + 4.5)}" text-anchor="${side < 0 ? 'end' : 'start'}">${p.num}</text>`);
  }
  for (const m of pk.missing ?? []) {
    const k = pk.pinsPerSide, i = Number(m) - 1, x = (pk.pin1 === 'right' ? 1 : -1) * span * (i < k ? 1 : -1);
    const y = i < k ? (i - (k - 1) / 2) * pk.pitch : ((k - 1) / 2 - (i - k)) * pk.pitch;
    const side = x < 0 ? -1 : 1;
    o.push(`<circle class="pk-out" cx="${X(bx, x)}" cy="${Y(y)}" r="${n(r * S)}"/>`);
    o.push(`<text class="pk-n" x="${X(bx, x + side * (r + 0.2))}" y="${n(cy + y * S + 4.5)}" text-anchor="${side < 0 ? 'end' : 'start'}">${pk.padNumbers ? 'no pad' : 'no pin ' + m}</text>`);
  }
  const ry = cy + (bl + 0.45) * S;
  o.push(`<path class="pk-dim" d="M${X(bx, -span)} ${n(ry)}H${X(bx, span)}M${X(bx, -span)} ${n(ry - 5)}v10M${X(bx, span)} ${n(ry - 5)}v10"/>`);
  o.push(`<text class="pk-n" x="${bx}" y="${n(ry + 18)}" text-anchor="middle">${pk.rowCentres.toFixed(2)} between rows, pitch ${pk.pitch.toFixed(2)}</text>`);
  o.push(`<text class="pk-n" x="${bx}" y="${n(ry + 36)}" text-anchor="middle">pads ${pk.pad.diameter.toFixed(2)} round, drill ${pk.pad.drill.toFixed(2)}</text>`);
  o.push('</svg>');
  return o.join('\n') + '\n';
}

// Single-row package with its leads formed into two staggered rows (eSIP-7C, Power Integrations E package). Each pin gives its slot along
// the package (`slot` × `slotPitch`) and its row: 'back' is the straight row nearer the back face (the exposed pad side), 'front' the row
// formed forward by `rowGap`. x runs along the package, y across it; the back row is at -rowGap/2, the front row at +rowGap/2.
export function padListSip(pk) {
  const x0 = ((pk.slots - 1) * pk.slotPitch) / 2;
  return pk.pins.map((p) => ({
    num: p.num,
    x: p.slot * pk.slotPitch - x0,
    y: (p.row === 'back' ? -1 : 1) * pk.rowGap / 2,
    d: pk.pad.diameter,
    drill: pk.pad.drill,
  }));
}

// body outline in footprint coordinates: along the package ±length/2, across it from the back face to the front face
function sipBody(pk) {
  const back = -pk.rowGap / 2 - pk.backRowToBackFace;
  return { hl: mid(pk.body.length) / 2, back, front: back + mid(pk.body.thickness) };
}

export function footprintSip(pk) {
  const pads = padListSip(pk), r = pk.pad.diameter / 2, b = sipBody(pk);
  const padX = Math.max(...pads.map((p) => Math.abs(p.x) + r));
  const padBottom = Math.max(...pads.map((p) => p.y + r));
  const up = (v) => Math.ceil(v * 20) / 20;
  const cx = up(Math.max(padX, b.hl) + pk.courtyardMargin);
  const cTop = -up(-(b.back) + pk.courtyardMargin), cBottom = up(padBottom + pk.courtyardMargin);
  const sx = b.hl + 0.12, sBack = b.back - 0.12; // silkscreen just outside the body's back face and ends
  const line = (x1, y1, x2, y2, layer, w) => `  (fp_line (start ${n(x1)} ${n(y1)}) (end ${n(x2)} ${n(y2)}) (stroke (width ${w}) (type solid)) (layer "${layer}"))`;
  const ch = 0.5;
  const L = [];
  L.push(`(footprint "${pk.file}" (version 20221018) (generator pcbnew)`);
  L.push(`  (layer "F.Cu")`);
  L.push(`  (descr "${pk.descr}")`);
  L.push(`  (tags "${pk.tags}")`);
  L.push(`  (attr through_hole)`);
  L.push(`  (fp_text reference "REF**" (at 0 ${n(cTop - 0.7)}) (layer "F.SilkS")\n    (effects (font (size 1 1) (thickness 0.15)))\n  )`);
  L.push(`  (fp_text value "${pk.file}" (at 0 ${n(cBottom + 0.7)}) (layer "F.Fab")\n    (effects (font (size 1 1) (thickness 0.15)))\n  )`);
  L.push(`  (fp_text user "\${REFERENCE}" (at 0 ${n((b.back + b.front) / 2)}) (layer "F.Fab")\n    (effects (font (size 0.8 0.8) (thickness 0.12)))\n  )`);
  // silkscreen: the back face and both ends of the body; the end on pin 1's side runs on past the front row as the pin 1 marker
  L.push(line(-sx, sBack, sx, sBack, 'F.SilkS', 0.12));
  L.push(line(sx, sBack, sx, b.front, 'F.SilkS', 0.12));
  L.push(line(-sx, sBack, -sx, padBottom, 'F.SilkS', 0.12));
  // fab: body outline (seen from above, a thin bar) with the pin 1 chamfer at the front corner on pin 1's side
  const pts = [[-b.hl, b.back], [b.hl, b.back], [b.hl, b.front], [-b.hl + ch, b.front], [-b.hl, b.front - ch]];
  pts.forEach((p, i) => { const q = pts[(i + 1) % pts.length]; L.push(line(p[0], p[1], q[0], q[1], 'F.Fab', 0.1)); });
  const c = [[-cx, cTop], [cx, cTop], [cx, cBottom], [-cx, cBottom]];
  c.forEach((p, i) => { const q = c[(i + 1) % 4]; L.push(line(p[0], p[1], q[0], q[1], 'F.CrtYd', 0.05)); });
  for (const p of pads) {
    const shape = p.num === '1' ? 'roundrect' : 'circle';
    const extra = p.num === '1' ? ' (roundrect_rratio 0.25)' : '';
    L.push(`  (pad "${p.num}" thru_hole ${shape} (at ${n(p.x)} ${n(p.y)}) (size ${n(p.d)} ${n(p.d)}) (drill ${n(p.drill)}) (layers "*.Cu" "*.Mask")${extra})`);
  }
  L.push(')');
  return L.join('\n') + '\n';
}

export function illustrationSip(pk) {
  const S = 22, pads = padListSip(pk), r = pk.pad.diameter / 2, b = sipBody(pk);
  const ax = 175, bx = 530;
  const bh = mid(pk.body.height), hl = b.hl, lw = mid(pk.leadWidth) / 2, leadLen = 4.2;
  const X = (c, v) => n(c + v * S);
  const o = [];
  o.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 400" role="img" aria-label="${pk.name} package front view and footprint">`);
  o.push(`<style>
.pk-body{fill:var(--cd-surface-2);stroke:var(--cd-border-strong);stroke-width:2}
.pk-ep{fill:var(--cd-muted);fill-opacity:.35;stroke:var(--cd-muted);stroke-width:1}
.pk-lead{fill:var(--cd-muted)}
.pk-pad{fill:var(--cd-accent);fill-opacity:.85}
.pk-hole{fill:var(--cd-surface-2)}
.pk-out{fill:none;stroke:var(--cd-faint);stroke-width:1.5;stroke-dasharray:6 4}
.pk-dim{stroke:var(--cd-muted);stroke-width:1.2;fill:none}
.pk-dot{fill:var(--cd-text)}
.pk-t{fill:var(--cd-text);font:600 13px system-ui,sans-serif}
.pk-n{fill:var(--cd-muted);font:12.5px system-ui,sans-serif}
.pk-h{fill:var(--cd-text);font:600 15px system-ui,sans-serif}
</style>`);
  // panel A: front view (the face away from the exposed pad), leads hanging down as the datasheet's front view draws them
  const top = 60, base = top + bh * S;
  o.push(`<text class="pk-h" x="${ax}" y="24" text-anchor="middle">Package, front view</text>`);
  for (const p of pads) {
    o.push(`<rect class="pk-lead" x="${X(ax, p.x - lw)}" y="${n(base)}" width="${n(lw * 2 * S)}" height="${n(leadLen * S)}"/>`);
    o.push(`<text class="pk-t" x="${X(ax, p.x)}" y="${n(base + leadLen * S + 17)}" text-anchor="middle">${p.num}</text>`);
  }
  o.push(`<rect class="pk-body" x="${X(ax, -hl)}" y="${top}" width="${n(hl * 2 * S)}" height="${n(bh * S)}" rx="4"/>`);
  o.push(`<circle class="pk-dot" cx="${X(ax, -hl + 0.9)}" cy="${n(base - 0.9 * S)}" r="7"/>`);
  o.push(`<text class="pk-n" x="${ax}" y="${n(base + leadLen * S + 40)}" text-anchor="middle">body ${rng(pk.body.length)} wide, ${rng(pk.body.height)} high</text>`);
  o.push(`<text class="pk-n" x="${ax}" y="${n(base + leadLen * S + 58)}" text-anchor="middle">exposed pad on the back face; no pin 6</text>`);
  // panel B: footprint seen from above
  const cy = 175;
  const Y = (v) => n(cy + v * S);
  o.push(`<text class="pk-h" x="${bx}" y="24" text-anchor="middle">Footprint (datasheet hole positions)</text>`);
  o.push(`<rect class="pk-out" x="${X(bx, -hl)}" y="${Y(b.back)}" width="${n(hl * 2 * S)}" height="${n((b.front - b.back) * S)}"/>`);
  o.push(`<text class="pk-n" x="${bx}" y="${Y(b.back - 0.5)}" text-anchor="middle">back face (exposed pad, heat sink side)</text>`);
  for (const p of pads) {
    if (p.num === '1') {
      o.push(`<rect class="pk-pad" x="${X(bx, p.x - r)}" y="${Y(p.y - r)}" width="${n(2 * r * S)}" height="${n(2 * r * S)}" rx="${n(0.25 * 2 * r * S)}"/>`);
    } else {
      o.push(`<circle class="pk-pad" cx="${X(bx, p.x)}" cy="${Y(p.y)}" r="${n(r * S)}"/>`);
    }
    o.push(`<circle class="pk-hole" cx="${X(bx, p.x)}" cy="${Y(p.y)}" r="${n((p.drill / 2) * S)}"/>`);
    o.push(`<text class="pk-t" x="${X(bx, p.x)}" y="${n(cy + p.y * S + 4.5)}" text-anchor="middle">${p.num}</text>`);
  }
  const ry = cy + (pk.rowGap / 2 + r + 1.9) * S;
  o.push(`<text class="pk-n" x="${bx}" y="${n(ry)}" text-anchor="middle">rows ${pk.rowGap.toFixed(2)} apart, ${(pk.slotPitch * 2).toFixed(2)} pitch in a row, ${pk.slotPitch.toFixed(2)} stagger</text>`);
  o.push(`<text class="pk-n" x="${bx}" y="${n(ry + 18)}" text-anchor="middle">pads ${pk.pad.diameter.toFixed(2)} round, drill ${pk.pad.drill.toFixed(2)} (ours)</text>`);
  o.push('</svg>');
  return o.join('\n') + '\n';
}
