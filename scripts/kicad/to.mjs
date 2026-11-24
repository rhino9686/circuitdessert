// Five-lead power packages with a metal tab (TO-263-5, TO-252-5): pads, footprint and package illustration.
// Used by build.mjs for packages whose data.mjs entry has layout: 'to-tab'.
//
// Orientation: the datasheet's land-pattern view, as drawn. The tab is at the top and the five lead pads in a row at the bottom, pin 1 at the left.
// y is down, as in KiCad. The land pattern's overall height (`overall`, tab end to lead-pad end) is centred on the origin.
// The tab pad is a custom pad whose shape is the T (or rectangle) from the drawing, and it carries the number the datasheet gives the tab.
const n = (v) => String(+v.toFixed(4));
const mid = (r) => (r.min + r.max) / 2;
const rng = (r, d = 2) => (r.min === r.max ? r.min.toFixed(d) : `${r.min.toFixed(d)}–${r.max.toFixed(d)}`);

export function padListTo(pk) {
  const H = pk.overall, count = pk.leads.count;
  const y = H / 2 - pk.pad.l / 2;
  const pads = [];
  for (let i = 0; i < count; i++) pads.push({ num: String(i + 1), x: (i - (count - 1) / 2) * pk.leads.pitch, y, w: pk.pad.w, h: pk.pad.l });
  return pads;
}

// Outline of the tab pad as a closed list of [x, y] points. `top` is the full-width band at the tab end, `stem` the narrower part below it.
export function tabOutline(pk) {
  const t = pk.tab, y0 = -pk.overall / 2, yb = y0 + t.height;
  const a = t.top.w / 2, s = (t.stem?.w ?? t.top.w) / 2, yt = y0 + t.top.h;
  if (s === a) return [[-a, y0], [a, y0], [a, yb], [-a, yb]];
  return [[-a, y0], [a, y0], [a, yt], [s, yt], [s, yb], [-s, yb], [-s, yt], [-a, yt]];
}

export function footprintTo(pk) {
  const pads = padListTo(pk), H = pk.overall;
  const wTab = pk.tab.top.w / 2;
  const padOuter = Math.max(wTab, mid(pk.body.width) / 2, ...pads.map((p) => Math.abs(p.x) + p.w / 2)); // the courtyard also clears the body
  const cx = Math.ceil((padOuter + pk.courtyardMargin) * 20) / 20;
  const cy = Math.ceil((H / 2 + pk.courtyardMargin) * 20) / 20;
  // Package outline on the fab layer (ours): body width by overall package length, tab end on the tab end of the land pattern.
  const bw = mid(pk.body.width) / 2, plen = mid(pk.packageLength);
  const top = -H / 2, bot = top + plen;
  const line = (x1, y1, x2, y2, layer, w) => `  (fp_line (start ${n(x1)} ${n(y1)}) (end ${n(x2)} ${n(y2)}) (stroke (width ${w}) (type solid)) (layer "${layer}"))`;
  const ch = 0.5; // pin 1 chamfer on the fab outline (ours), at the lower left corner next to pad 1
  const L = [];
  L.push(`(footprint "${pk.file}" (version 20221018) (generator pcbnew)`);
  L.push(`  (layer "F.Cu")`);
  L.push(`  (descr "${pk.descr}")`);
  L.push(`  (tags "${pk.tags}")`);
  L.push(`  (attr smd)`);
  L.push(`  (fp_text reference "REF**" (at 0 ${n(-(cy + 0.7))}) (layer "F.SilkS")\n    (effects (font (size 1 1) (thickness 0.15)))\n  )`);
  L.push(`  (fp_text value "${pk.file}" (at 0 ${n(cy + 0.7)}) (layer "F.Fab")\n    (effects (font (size 1 1) (thickness 0.15)))\n  )`);
  L.push(`  (fp_text user "\${REFERENCE}" (at 0 0) (layer "F.Fab")\n    (effects (font (size 1 1) (thickness 0.15)))\n  )`);
  // silkscreen: a pin 1 marker, a line beside the first lead pad, clear of the pad
  const p1 = pads[0], mx = p1.x - p1.w / 2 - 0.3;
  L.push(line(mx, p1.y - p1.h / 2, mx, p1.y + p1.h / 2, 'F.SilkS', 0.12));
  // fab outline with the pin 1 chamfer
  const pts = [[-bw, top], [bw, top], [bw, bot], [-bw + ch, bot], [-bw, bot - ch]];
  pts.forEach((q, i) => { const r = pts[(i + 1) % pts.length]; L.push(line(q[0], q[1], r[0], r[1], 'F.Fab', 0.1)); });
  // courtyard
  const c = [[-cx, -cy], [cx, -cy], [cx, cy], [-cx, cy]];
  c.forEach((q, i) => { const r = c[(i + 1) % 4]; L.push(line(q[0], q[1], r[0], r[1], 'F.CrtYd', 0.05)); });
  for (const p of pads) {
    L.push(`  (pad "${p.num}" smd roundrect (at ${n(p.x)} ${n(p.y)}) (size ${n(p.w)} ${n(p.h)}) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.25))`);
  }
  L.push(`  (pad "${pk.tab.num}" smd custom (at 0 ${n(top + pk.tab.top.h / 2)}) (size 0.1 0.1) (layers "F.Cu" "F.Paste" "F.Mask")\n    (options (clearance outline) (anchor rect))\n    (primitives\n      (gr_poly (pts ${tabOutline(pk).map(([x, y]) => `(xy ${n(x)} ${n(y - (top + pk.tab.top.h / 2))})`).join(' ')}) (width 0) (fill yes))\n    )\n  )`);
  L.push(')');
  return L.join('\n') + '\n';
}

export function illustrationTo(pk) {
  const S = pk.illustration?.scale ?? 22; // px per mm
  const H = pk.overall;
  const pads = padListTo(pk), count = pk.leads.count;
  const bw = mid(pk.body.width) / 2, bl = mid(pk.body.length), tw = mid(pk.tabWidth) / 2;
  const leadLen = mid(pk.leadLength), lw = mid(pk.leadWidth) / 2, tabExt = pk.tabExt ? mid(pk.tabExt) : 0;
  const il = pk.illustration ?? {};
  const ax = il.ax ?? 175, bx = il.bx ?? 470, cy = il.cy ?? Math.ceil(46 + (H / 2) * S), W = il.width ?? 640; // titles sit above the tab end
  const Hh = Math.ceil(cy + (H / 2) * S + 75);
  const X = (c, v) => n(c + v * S), Y = (v) => n(cy + v * S);
  const poly = (c, pts) => pts.map(([x, y]) => `${X(c, x)},${Y(y)}`).join(' ');
  const top = -H / 2, plen = mid(pk.packageLength);
  const bodyTop = top + tabExt, bodyBot = bodyTop + bl;
  const o = [];
  o.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${Hh}" role="img" aria-label="${pk.name} package top view and footprint">`);
  o.push(`<style>
.pk-body{fill:var(--cd-surface-2);stroke:var(--cd-border-strong);stroke-width:2}
.pk-lead{fill:var(--cd-muted)}
.pk-pad{fill:var(--cd-accent);fill-opacity:.85}
.pk-out{fill:none;stroke:var(--cd-faint);stroke-width:1.5;stroke-dasharray:6 4}
.pk-dim{stroke:var(--cd-muted);stroke-width:1.2;fill:none}
.pk-t{fill:var(--cd-text);font:600 13px system-ui,sans-serif}
.pk-n{fill:var(--cd-muted);font:12.5px system-ui,sans-serif}
.pk-h{fill:var(--cd-text);font:600 15px system-ui,sans-serif}
</style>`);
  // panel A: package top view, tab at the top, leads below (placed on the land pattern's tab end, ours)
  o.push(`<text class="pk-h" x="${ax}" y="24" text-anchor="middle">Package, top view</text>`);
  o.push(`<rect class="pk-lead" x="${X(ax, -tw)}" y="${Y(top)}" width="${n(tw * 2 * S)}" height="${n(Math.max(tabExt, 0.8) * S)}"/>`);
  o.push(`<rect class="pk-body" x="${X(ax, -bw)}" y="${Y(bodyTop)}" width="${n(bw * 2 * S)}" height="${n(bl * S)}" rx="3"/>`);
  for (const p of pads) {
    o.push(`<rect class="pk-lead" x="${X(ax, p.x - lw)}" y="${Y(top + plen - leadLen)}" width="${n(lw * 2 * S)}" height="${n(leadLen * S)}"/>`);
    o.push(`<text class="pk-t" x="${X(ax, p.x)}" y="${n(cy + (top + plen) * S + 16)}" text-anchor="middle">${p.num}</text>`);
  }
  o.push(`<text class="pk-n" x="${ax}" y="${n(cy + (bodyTop + bl / 2) * S + 4)}" text-anchor="middle">tab = pin ${pk.tab.num}</text>`);
  // panel B: footprint
  o.push(`<text class="pk-h" x="${bx}" y="24" text-anchor="middle">Footprint (recommended pads)</text>`);
  o.push(`<polygon class="pk-pad" points="${poly(bx, tabOutline(pk))}"/>`);
  o.push(`<text class="pk-t" x="${bx}" y="${n(cy + (top + pk.tab.height / 2) * S + 5)}" text-anchor="middle" style="fill:var(--cd-on-accent)">${pk.tab.num}</text>`);
  for (const p of pads) {
    o.push(`<rect class="pk-pad" x="${X(bx, p.x - p.w / 2)}" y="${Y(p.y - p.h / 2)}" width="${n(p.w * S)}" height="${n(p.h * S)}" rx="${n(Math.min(p.w, p.h) * S * 0.25)}"/>`);
    o.push(`<text class="pk-t" x="${X(bx, p.x)}" y="${n(cy + p.y * S + 5)}" text-anchor="middle" style="fill:var(--cd-on-accent)">${p.num}</text>`);
  }
  const ty = cy + (H / 2) * S + 24;
  o.push(`<text class="pk-n" x="${bx}" y="${n(ty)}" text-anchor="middle">pads ${pk.pad.w.toFixed(2)} × ${pk.pad.l.toFixed(2)}, pitch ${pk.leads.pitch.toFixed(2)}</text>`);
  o.push(`<text class="pk-n" x="${bx}" y="${n(ty + 18)}" text-anchor="middle">tab pad ${pk.tab.top.w.toFixed(2)} wide, ${pk.tab.height.toFixed(2)} high, ${H.toFixed(2)} overall</text>`);
  o.push(`<text class="pk-n" x="${ax}" y="${n(ty)}" text-anchor="middle">body ${rng(pk.body.width)} × ${rng(pk.body.length)}</text>`);
  o.push(`<text class="pk-n" x="${ax}" y="${n(ty + 18)}" text-anchor="middle">leads ${rng(pk.leadWidth)} wide, pitch ${pk.leads.pitch.toFixed(2)}</text>`);
  o.push('</svg>');
  return o.join('\n') + '\n';
}
