// Four-sided leadless packages (QFN / LFCSP family): pads, footprint and package illustration.
// Used by build.mjs for packages whose data.mjs entry has layout: 'quad'. The two-row packages stay in build.mjs.
//
// Orientation (KiCad footprint, top view): pin 1 top left, then counter-clockwise: down the left side, along the bottom
// left to right, up the right side, along the top right to left. The exposed pad is numbered after the last lead.
const n = (v) => String(+v.toFixed(4));
const mid = (r) => (r.min + r.max) / 2;
const rng = (r, d = 2) => `${r.min.toFixed(d)}–${r.max.toFixed(d)}`;

export function padListQuad(pk) {
  const k = pk.padsPerSide, c = pk.pad.centre, p = pk.pitch;
  const off = (i) => (i - (k - 1) / 2) * p; // pad position along a side, centred
  const { long, wide } = pk.pad;
  const pads = [];
  for (let i = 0; i < k; i++) pads.push({ num: String(i + 1), x: -c, y: off(i), w: long, h: wide, side: 'left' });
  for (let i = 0; i < k; i++) pads.push({ num: String(k + i + 1), x: off(i), y: c, w: wide, h: long, side: 'bottom' });
  for (let i = 0; i < k; i++) pads.push({ num: String(2 * k + i + 1), x: c, y: -off(i), w: long, h: wide, side: 'right' });
  for (let i = 0; i < k; i++) pads.push({ num: String(3 * k + i + 1), x: -off(i), y: -c, w: wide, h: long, side: 'top' });
  return pads;
}

export function footprintQuad(pk) {
  const pads = padListQuad(pk);
  const b = mid(pk.body.length) / 2;
  const padOuter = pk.pad.centre + pk.pad.long / 2;
  const cy = Math.ceil((padOuter + pk.courtyardMargin) * 20) / 20;
  const sk = b + 0.11; // silkscreen just outside the body edge
  const k = pk.padsPerSide, p = pk.pitch;
  const armStart = ((k - 1) / 2) * p + pk.pad.wide / 2 + 0.2; // corner marks start 0.2 clear of the outermost pad on each side
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
  L.push(`  (fp_text user "\${REFERENCE}" (at 0 0) (layer "F.Fab")\n    (effects (font (size 1 1) (thickness 0.15)))\n  )`);
  // silkscreen: an L at each corner of the body, plus a dot outside the pin 1 corner
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    L.push(line(sx * sk, sy * armStart, sx * sk, sy * sk, 'F.SilkS', 0.12));
    L.push(line(sx * sk, sy * sk, sx * armStart, sy * sk, 'F.SilkS', 0.12));
  }
  const dot = padOuter + 0.07; // clear of the pads, in the pin 1 corner
  L.push(`  (fp_circle (center ${n(-dot)} ${n(-dot)}) (end ${n(-dot + 0.1)} ${n(-dot)}) (stroke (width 0.2) (type solid)) (fill solid) (layer "F.SilkS"))`);
  // fab outline with the pin 1 chamfer
  const pts = [[-b, -b + ch], [-b + ch, -b], [b, -b], [b, b], [-b, b]];
  pts.forEach((q, i) => { const r = pts[(i + 1) % pts.length]; L.push(line(q[0], q[1], r[0], r[1], 'F.Fab', 0.1)); });
  // courtyard
  const c = [[-cy, -cy], [cy, -cy], [cy, cy], [-cy, cy]];
  c.forEach((q, i) => { const r = c[(i + 1) % 4]; L.push(line(q[0], q[1], r[0], r[1], 'F.CrtYd', 0.05)); });
  for (const q of pads) {
    L.push(`  (pad "${q.num}" smd roundrect (at ${n(q.x)} ${n(q.y)}) (size ${n(q.w)} ${n(q.h)}) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.25))`);
  }
  const ep = String(4 * k + 1);
  L.push(`  (pad "${ep}" smd roundrect (at 0 0) (size ${n(pk.ep.size)} ${n(pk.ep.size)}) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.05))`);
  L.push(')');
  return L.join('\n') + '\n';
}

export function illustrationQuad(pk) {
  const S = 33; // px per mm
  const b = mid(pk.body.length) / 2;
  const k = pk.padsPerSide, p = pk.pitch;
  const lw = mid(pk.leadWidth) / 2, ll = mid(pk.leadLength);
  const ep = mid(pk.epSquare) / 2;
  const pads = padListQuad(pk);
  const ax = 165, bx = 440, cy = 165; // panel centres
  const X = (c, v) => n(c + v * S), Y = (v) => n(cy + v * S);
  const edge = (k - 1) / 2 * p; // position of the first and last lead on a side
  const o = [];
  o.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 362" role="img" aria-label="${pk.name} package top view and footprint">`);
  o.push(`<style>
.pk-body{fill:var(--cd-surface-2);stroke:var(--cd-border-strong);stroke-width:2}
.pk-lead{fill:var(--cd-muted);fill-opacity:.55}
.pk-pad{fill:var(--cd-accent);fill-opacity:.85}
.pk-out{fill:none;stroke:var(--cd-faint);stroke-width:1.5;stroke-dasharray:6 4}
.pk-dot{fill:var(--cd-text)}
.pk-t{fill:var(--cd-text);font:600 13px system-ui,sans-serif}
.pk-n{fill:var(--cd-muted);font:12.5px system-ui,sans-serif}
.pk-h{fill:var(--cd-text);font:600 15px system-ui,sans-serif}
</style>`);
  // corner pin numbers around a panel: first and last lead of each side
  const labels = (c, r) => {
    const t = (txt, x, y, anchor) => o.push(`<text class="pk-t" x="${n(x)}" y="${n(y)}" text-anchor="${anchor}">${txt}</text>`);
    const m = (v) => cy + v * S + 5; // baseline for a label centred on v
    t('1', c - r * S - 6, m(-edge), 'end'); t(String(k), c - r * S - 6, m(edge), 'end');
    t(String(k + 1), c - edge * S, cy + r * S + 17, 'middle'); t(String(2 * k), c + edge * S, cy + r * S + 17, 'middle');
    t(String(2 * k + 1), c + r * S + 6, m(edge), 'start'); t(String(3 * k), c + r * S + 6, m(-edge), 'start');
    t(String(3 * k + 1), c + edge * S, cy - r * S - 8, 'middle'); t(String(4 * k), c - edge * S, cy - r * S - 8, 'middle');
  };
  // panel A: package top view, leads and exposed pad underneath
  o.push(`<text class="pk-h" x="${ax}" y="24" text-anchor="middle">Package, top view</text>`);
  o.push(`<rect class="pk-body" x="${X(ax, -b)}" y="${Y(-b)}" width="${n(b * 2 * S)}" height="${n(b * 2 * S)}" rx="4"/>`);
  for (const q of pads) {
    const horiz = q.side === 'left' || q.side === 'right';
    const len = ll, wid = lw * 2;
    const lx = q.side === 'left' ? -b : q.side === 'right' ? b - len : q.x - lw;
    const ly = q.side === 'top' ? -b : q.side === 'bottom' ? b - len : q.y - lw;
    o.push(`<rect class="pk-lead" x="${X(ax, lx)}" y="${Y(ly)}" width="${n((horiz ? len : wid) * S)}" height="${n((horiz ? wid : len) * S)}"/>`);
  }
  o.push(`<rect class="pk-out" x="${X(ax, -ep)}" y="${Y(-ep)}" width="${n(ep * 2 * S)}" height="${n(ep * 2 * S)}"/>`);
  o.push(`<text class="pk-n" x="${ax}" y="${n(cy + 4)}" text-anchor="middle">exposed pad</text>`);
  o.push(`<circle class="pk-dot" cx="${X(ax, -b + 0.4)}" cy="${Y(-b + 0.4)}" r="6"/>`);
  labels(ax, b);
  const ty = cy + (pk.pad.centre + pk.pad.long / 2) * S + 38; // text lines start below the larger panel
  o.push(`<text class="pk-n" x="${ax}" y="${n(ty)}" text-anchor="middle">body ${rng(pk.body.length)} square, ${pk.pitch.toFixed(2)} pitch</text>`);
  o.push(`<text class="pk-n" x="${ax}" y="${n(ty + 18)}" text-anchor="middle">leads ${rng(pk.leadWidth)} wide, ${rng(pk.leadLength)} long</text>`);
  o.push(`<text class="pk-n" x="${ax}" y="${n(ty + 36)}" text-anchor="middle">exposed pad ${rng(pk.epSquare)} square</text>`);
  // panel B: footprint
  o.push(`<text class="pk-h" x="${bx}" y="24" text-anchor="middle">Footprint (our pads)</text>`);
  o.push(`<rect class="pk-out" x="${X(bx, -b)}" y="${Y(-b)}" width="${n(b * 2 * S)}" height="${n(b * 2 * S)}" rx="4"/>`);
  for (const q of pads) {
    o.push(`<rect class="pk-pad" x="${X(bx, q.x - q.w / 2)}" y="${Y(q.y - q.h / 2)}" width="${n(q.w * S)}" height="${n(q.h * S)}" rx="${n(Math.min(q.w, q.h) * S * 0.25)}"/>`);
  }
  const e = pk.ep.size / 2;
  o.push(`<rect class="pk-pad" x="${X(bx, -e)}" y="${Y(-e)}" width="${n(e * 2 * S)}" height="${n(e * 2 * S)}" rx="${n(0.05 * e * 2 * S)}"/>`);
  o.push(`<text class="pk-t" x="${bx}" y="${n(cy + 5)}" text-anchor="middle" style="fill:var(--cd-on-accent)">${4 * k + 1}</text>`);
  labels(bx, pk.pad.centre + pk.pad.long / 2);
  o.push(`<text class="pk-n" x="${bx}" y="${n(ty)}" text-anchor="middle">pads ${pk.pad.long.toFixed(2)} × ${pk.pad.wide.toFixed(2)} mm</text>`);
  o.push(`<text class="pk-n" x="${bx}" y="${n(ty + 18)}" text-anchor="middle">exposed pad ${pk.ep.size.toFixed(2)} square, number ${4 * k + 1}</text>`);
  o.push(`<text class="pk-n" x="${bx}" y="${n(ty + 36)}" text-anchor="middle">pad sizes are ours, not ADI's</text>`);
  o.push('</svg>');
  return o.join('\n') + '\n';
}
