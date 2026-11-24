// Ball-grid packages (DSBGA / WCSP): pads, footprint and package illustration.
// Used by build.mjs for packages whose data.mjs entry has layout: 'bga'.
//
// Orientation (KiCad footprint, top view, looking down through the body at the balls): ball A1 top left, rows A, B, C ... down the page,
// columns 1, 2, 3 ... left to right. Pad names are the row letter plus the column number ("A1"). The ball array is centred on the body.
// Every ball gets one copper pad (circle, with the mask opening the drawing gives) and one unnamed paste-only aperture
// (rounded square) because the datasheet's stencil aperture is not the same shape as its pad.
const n = (v) => String(+v.toFixed(4));
const mid = (r) => (r.min + r.max) / 2;
const rng = (r, d = 2) => `${r.min.toFixed(d)}–${r.max.toFixed(d)}`;
const ROWS = 'ABCDEFGHJKLMNPRTUVWY'; // as many rows as any package here will need

export function padListBga(pk) {
  const pads = [];
  for (let r = 0; r < pk.rows; r++) {
    for (let c = 0; c < pk.cols; c++) {
      pads.push({ num: `${ROWS[r]}${c + 1}`, x: (c - (pk.cols - 1) / 2) * pk.pitch, y: (r - (pk.rows - 1) / 2) * pk.pitch, row: r, col: c });
    }
  }
  return pads;
}

export function footprintBga(pk) {
  const pads = padListBga(pk);
  const bw = mid(pk.body.width) / 2, bl = mid(pk.body.length) / 2; // half sizes: across (columns), along (rows)
  const padX = ((pk.cols - 1) / 2) * pk.pitch + pk.pad.metal / 2 + pk.pad.maskMargin;
  const padY = ((pk.rows - 1) / 2) * pk.pitch + pk.pad.metal / 2 + pk.pad.maskMargin;
  const cx = Math.ceil((Math.max(bw, padX) + pk.courtyardMargin) * 20) / 20;
  const cy = Math.ceil((Math.max(bl, padY) + pk.courtyardMargin) * 20) / 20;
  const sx = bw + 0.11, sy = bl + 0.11; // silkscreen just outside the body edge
  const arm = 0.5;
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
  // silkscreen: an L at each corner of the body, plus a dot outside the pin 1 corner
  for (const a of [-1, 1]) for (const b of [-1, 1]) {
    L.push(line(a * sx, b * sy, a * (sx - arm), b * sy, 'F.SilkS', 0.12));
    L.push(line(a * sx, b * sy, a * sx, b * (sy - arm), 'F.SilkS', 0.12));
  }
  L.push(`  (fp_circle (center ${n(-sx - 0.25)} ${n(-sy - 0.25)}) (end ${n(-sx - 0.15)} ${n(-sy - 0.25)}) (stroke (width 0.2) (type solid)) (fill solid) (layer "F.SilkS"))`);
  // fab outline with the pin 1 chamfer
  const pts = [[-bw, -bl + ch], [-bw + ch, -bl], [bw, -bl], [bw, bl], [-bw, bl]];
  pts.forEach((p, i) => { const q = pts[(i + 1) % pts.length]; L.push(line(p[0], p[1], q[0], q[1], 'F.Fab', 0.1)); });
  // courtyard
  const c = [[-cx, -cy], [cx, -cy], [cx, cy], [-cx, cy]];
  c.forEach((p, i) => { const q = c[(i + 1) % 4]; L.push(line(p[0], p[1], q[0], q[1], 'F.CrtYd', 0.05)); });
  for (const p of pads) {
    L.push(`  (pad "${p.num}" smd circle (at ${n(p.x)} ${n(p.y)}) (size ${n(pk.pad.metal)} ${n(pk.pad.metal)}) (layers "F.Cu" "F.Mask") (solder_mask_margin ${n(pk.pad.maskMargin)}))`);
  }
  for (const p of pads) {
    L.push(`  (pad "" smd roundrect (at ${n(p.x)} ${n(p.y)}) (size ${n(pk.pad.paste)} ${n(pk.pad.paste)}) (layers "F.Paste") (roundrect_rratio ${n(pk.pad.pasteRadius / pk.pad.paste)}))`);
  }
  L.push(')');
  return L.join('\n') + '\n';
}

export function illustrationBga(pk) {
  const S = pk.illustration?.scale ?? 80; // px per mm
  const bw = mid(pk.body.width) / 2, bl = mid(pk.body.length) / 2;
  const pads = padListBga(pk);
  const ax = 165, bx = 440, cy = 175; // panel centres
  const X = (c, v) => n(c + v * S), Y = (v) => n(cy + v * S);
  const rb = (mid(pk.ball) / 2) * S, rp = (pk.pad.metal / 2) * S, rm = (pk.pad.metal / 2 + pk.pad.maskMargin) * S;
  const o = [];
  o.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 365" role="img" aria-label="${pk.name} package, balls seen from above, and footprint">`);
  o.push(`<style>
.pk-body{fill:var(--cd-surface-2);stroke:var(--cd-border-strong);stroke-width:2}
.pk-lead{fill:var(--cd-muted);fill-opacity:.55}
.pk-pad{fill:var(--cd-accent);fill-opacity:.85}
.pk-out{fill:none;stroke:var(--cd-faint);stroke-width:1.5;stroke-dasharray:6 4}
.pk-mask{fill:none;stroke:var(--cd-faint);stroke-width:1;stroke-dasharray:3 2}
.pk-dot{fill:var(--cd-text)}
.pk-t{fill:var(--cd-text);font:600 13px system-ui,sans-serif}
.pk-n{fill:var(--cd-muted);font:12.5px system-ui,sans-serif}
.pk-h{fill:var(--cd-text);font:600 15px system-ui,sans-serif}
</style>`);
  // row letters on the left and column numbers above each panel
  const axes = (c) => {
    for (let r = 0; r < pk.rows; r++) o.push(`<text class="pk-t" x="${n(c - bw * S - 12)}" y="${n(cy + ((r - (pk.rows - 1) / 2) * pk.pitch) * S + 5)}" text-anchor="end">${ROWS[r]}</text>`);
    for (let k = 0; k < pk.cols; k++) o.push(`<text class="pk-t" x="${n(c + ((k - (pk.cols - 1) / 2) * pk.pitch) * S)}" y="${n(cy - bl * S - 10)}" text-anchor="middle">${k + 1}</text>`);
  };
  // panel A: package top view, balls underneath
  o.push(`<text class="pk-h" x="${ax}" y="24" text-anchor="middle">Package, balls seen from above</text>`);
  o.push(`<rect class="pk-body" x="${X(ax, -bw)}" y="${Y(-bl)}" width="${n(bw * 2 * S)}" height="${n(bl * 2 * S)}" rx="4"/>`);
  o.push(`<circle class="pk-dot" cx="${X(ax, -bw + 0.16)}" cy="${Y(-bl + 0.16)}" r="4"/>`);
  for (const p of pads) o.push(`<circle class="pk-lead" cx="${X(ax, p.x)}" cy="${Y(p.y)}" r="${n(rb)}"/>`);
  axes(ax);
  const ty = cy + bl * S + 28;
  o.push(`<text class="pk-n" x="${ax}" y="${n(ty)}" text-anchor="middle">body ${rng(pk.body.width, 3)} × ${rng(pk.body.length, 3)}</text>`);
  o.push(`<text class="pk-n" x="${ax}" y="${n(ty + 18)}" text-anchor="middle">${pk.cols} × ${pk.rows} balls, ${pk.pitch.toFixed(2)} pitch</text>`);
  o.push(`<text class="pk-n" x="${ax}" y="${n(ty + 36)}" text-anchor="middle">ball ⌀${rng(pk.ball)}, height ${rng(pk.ballHeight)}</text>`);
  // panel B: footprint
  o.push(`<text class="pk-h" x="${bx}" y="24" text-anchor="middle">Footprint (recommended land pattern)</text>`);
  o.push(`<rect class="pk-out" x="${X(bx, -bw)}" y="${Y(-bl)}" width="${n(bw * 2 * S)}" height="${n(bl * 2 * S)}" rx="4"/>`);
  for (const p of pads) {
    o.push(`<circle class="pk-mask" cx="${X(bx, p.x)}" cy="${Y(p.y)}" r="${n(rm)}"/>`);
    o.push(`<circle class="pk-pad" cx="${X(bx, p.x)}" cy="${Y(p.y)}" r="${n(rp)}"/>`);
  }
  o.push(`<circle class="pk-dot" cx="${X(bx, -bw - 0.12)}" cy="${Y(-bl - 0.12)}" r="4"/>`); // the silkscreen pin 1 dot
  axes(bx);
  o.push(`<text class="pk-n" x="${bx}" y="${n(ty)}" text-anchor="middle">pads ⌀${pk.pad.metal.toFixed(2)}, mask opening up to ⌀${(pk.pad.metal + 2 * pk.pad.maskMargin).toFixed(2)}</text>`);
  o.push(`<text class="pk-n" x="${bx}" y="${n(ty + 18)}" text-anchor="middle">paste ${pk.pad.paste.toFixed(2)} square, R${pk.pad.pasteRadius.toFixed(2)} (0.1 mm stencil)</text>`);
  o.push(`<text class="pk-n" x="${bx}" y="${n(ty + 36)}" text-anchor="middle">non-solder-mask-defined pads</text>`);
  o.push('</svg>');
  return o.join('\n') + '\n';
}
