// A tiny schematic drawing kit. Every shape gets a CSS class (sch-*) instead of a colour, so the
// drawing picks up the site's light and dark themes when it is inlined into a page.
// All coordinates are in SVG user units; draw on a 10-unit grid so wires meet cleanly.

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const n = (v) => Math.round(v * 100) / 100;

/** "CIN1" -> C with a small subscript "IN1". Single letters stay plain. */
export function refMarkup(ref) {
  const m = /^([A-Z])([A-Za-z0-9_]+)$/.exec(ref);
  return m ? `${m[1]}<tspan class="sch-sub" dy="2.5">${esc(m[2])}</tspan>` : esc(ref);
}

export class Sheet {
  /**
   * `top` crops that many units off the top edge, for drawings with nothing in the top band.
   * `minWidth` (CSS px) raises the width below which the drawing scrolls sideways instead of shrinking; the default is the site's 620 px.
   */
  constructor(width, height, { id = 'sch', title, desc, top = 0, minWidth = null }) {
    this.id = id;
    this.w = width;
    this.h = height;
    this.top = top;
    this.minWidth = minWidth;
    this.title = title;
    this.desc = desc;
    this.parts = [];
  }
  add(s) { this.parts.push(s); return this; }

  /** Polyline wire through the given [x, y] points. */
  wire(...pts) {
    return this.add(`<path class="sch-w" d="M${pts.map(([x, y]) => `${n(x)} ${n(y)}`).join(' L')}"/>`);
  }
  /** Horizontal wire from x1 to x2 on row y that hops (a small bump, no connection) over a crossing wire at each x in `hops`. */
  hwire(y, x1, x2, hops = []) {
    const dir = Math.sign(x2 - x1) || 1;
    let d = `M${n(x1)} ${n(y)}`;
    for (const hx of [...hops].sort((a, b) => dir * (a - b))) {
      d += ` L${n(hx - 5 * dir)} ${n(y)} A5 5 0 0 ${dir > 0 ? 1 : 0} ${n(hx + 5 * dir)} ${n(y)}`;
    }
    d += ` L${n(x2)} ${n(y)}`;
    return this.add(`<path class="sch-w" d="${d}"/>`);
  }
  /** Junction dot where wires connect. */
  dot(x, y) { return this.add(`<circle class="sch-dot" cx="${n(x)}" cy="${n(y)}" r="3"/>`); }

  text(x, y, s, { cls = 'sch-val', anchor = 'start', raw = false } = {}) {
    return this.add(`<text class="${cls}" x="${n(x)}" y="${n(y)}" text-anchor="${anchor}">${raw ? s : esc(s)}</text>`);
  }
  /** Reference designator plus value, stacked. side: 'right' | 'left' | 'above' (horizontal parts). */
  label(x, y, ref, val, side = 'right') {
    const anchor = side === 'left' ? 'end' : side === 'above' ? 'middle' : 'start';
    const dx = side === 'left' ? -16 : side === 'above' ? 0 : 16;
    const dy = side === 'above' ? -31 : -2;
    this.text(x + dx, y + dy, refMarkup(ref), { cls: 'sch-ref', anchor, raw: true });
    if (val) this.text(x + dx, y + dy + 13, val, { cls: 'sch-val', anchor });
    return this;
  }

  /** Resistor between two terminals on a shared row or column. Zig-zag body is 30 units long. */
  resistor(x1, y1, x2, y2) {
    const vert = x1 === x2;
    const len = vert ? y2 - y1 : x2 - x1;
    const dir = Math.sign(len) || 1;
    const mid = Math.abs(len) / 2;
    const a = mid - 15; // start of the body, measured from the first terminal
    const pts = [[0, 0], [a, 0]];
    for (let i = 0; i < 6; i++) pts.push([a + 2.5 + i * 5, i % 2 ? 6 : -6]);
    pts.push([a + 30, 0], [Math.abs(len), 0]);
    const place = ([u, v]) => (vert ? [x1 + v, y1 + u * dir] : [x1 + u * dir, y1 + v]);
    return this.wire(...pts.map(place));
  }

  /** Inductor: four humps, body 48 units long. The humps bulge up (horizontal) or right (vertical); flip: true bulges them the other way. */
  inductor(x1, y1, x2, y2, { flip = false } = {}) {
    const vert = x1 === x2;
    const len = Math.abs(vert ? y2 - y1 : x2 - x1);
    const dir = Math.sign(vert ? y2 - y1 : x2 - x1) || 1;
    const a = len / 2 - 24;
    const P = (u, v) => (vert ? [x1 + v, y1 + u * dir] : [x1 + u * dir, y1 + v]);
    const f = ([x, y]) => `${n(x)} ${n(y)}`;
    let d = `M${f(P(0, 0))} L${f(P(a, 0))}`;
    for (let i = 0; i < 4; i++) {
      const s = a + i * 12;
      d += ` A6 6 0 0 ${(dir > 0) !== flip ? 1 : 0} ${f(P(s + 12, 0))}`;
    }
    d += ` L${f(P(len, 0))}`;
    return this.add(`<path class="sch-w" d="${d}"/>`);
  }

  /** Capacitor between two terminals. `polarized` draws a curved plate on the terminal-2 side and a "+" on terminal 1. */
  capacitor(x1, y1, x2, y2, { polarized = false } = {}) {
    const vert = x1 === x2;
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    const gap = 4; // half the plate spacing
    const half = 11; // half the plate width
    if (vert) {
      const up = y1 < y2 ? 1 : -1; // direction from terminal 1 to terminal 2
      const p1 = cy - gap * up;
      const p2 = cy + gap * up;
      this.wire([x1, y1], [x1, p1]).wire([x2, y2], [x2, p2]);
      this.wire([cx - half, p1], [cx + half, p1]);
      if (polarized) {
        this.add(`<path class="sch-w" d="M${n(cx - half)} ${n(p2 + 4 * up)} Q${n(cx)} ${n(p2 - 5 * up)} ${n(cx + half)} ${n(p2 + 4 * up)}"/>`);
        this.text(cx - half - 4, p1 - 4 * up, '+', { cls: 'sch-ref', anchor: 'end' });
      } else {
        this.wire([cx - half, p2], [cx + half, p2]);
      }
    } else {
      const right = x1 < x2 ? 1 : -1;
      const p1 = cx - gap * right;
      const p2 = cx + gap * right;
      this.wire([x1, y1], [p1, y1]).wire([x2, y2], [p2, y2]);
      this.wire([p1, cy - half], [p1, cy + half]).wire([p2, cy - half], [p2, cy + half]);
    }
    return this;
  }

  /**
   * Diode from terminal 1 (anode) to terminal 2 (cathode), on a shared row or column. kind: 'plain' | 'zener' | 'led'.
   * The body is 16 units long, centred between the terminals; an LED also gets two small arrows leaving it on the `side` (+1 or -1) of the axis.
   */
  diode(x1, y1, x2, y2, { kind = 'plain', side = 1 } = {}) {
    const vert = x1 === x2;
    const len = Math.abs(vert ? y2 - y1 : x2 - x1);
    const dir = Math.sign(vert ? y2 - y1 : x2 - x1) || 1;
    const P = (u, v) => (vert ? [x1 + v, y1 + u * dir] : [x1 + u * dir, y1 + v]);
    const f = ([x, y]) => `${n(x)} ${n(y)}`;
    const a = len / 2 - 8; // anode side of the body
    const k = len / 2 + 8; // cathode bar
    this.wire(P(0, 0), P(a, 0)).wire(P(k, 0), P(len, 0));
    this.add(`<path class="sch-w" d="M${f(P(a, -8))} L${f(P(a, 8))} L${f(P(k, 0))} Z"/>`);
    if (kind === 'zener') {
      this.add(`<path class="sch-w" d="M${f(P(k + 4, -8))} L${f(P(k, -8))} L${f(P(k, 8))} L${f(P(k - 4, 8))}"/>`);
    } else {
      this.wire(P(k, -8), P(k, 8));
    }
    if (kind === 'led') {
      for (const du of [-3, 5]) {
        const s = P(len / 2 + du, 11 * side);
        const e = P(len / 2 + du + 8, 21 * side);
        // arrow shaft plus a two-stroke head
        this.wire(s, e).wire(P(len / 2 + du + 3, 21 * side), e, P(len / 2 + du + 8, 16 * side));
      }
    }
    return this;
  }

  /**
   * N-channel MOSFET, vertical. Drain terminal at (x, y1), source terminal at (x, y2) (y2 below y1); the gate lead leaves
   * to the right and ends at (x + 22, midpoint). The source is tied to the body, with the arrow pointing at the channel.
   * flip: true mirrors the symbol, so the body and gate lead are on the left and the gate ends at (x - 22, midpoint).
   */
  nmosV(x, y1, y2, { flip = false } = {}) {
    const m = flip ? -1 : 1;
    const yc = (y1 + y2) / 2;
    const cx = x + 8 * m;
    this.wire([x, y1], [x, yc - 12], [cx, yc - 12]);
    this.wire([x, y2], [x, yc]).wire([x, yc + 12], [cx, yc + 12]).wire([x, yc], [cx, yc]);
    this.add(`<path class="sch-w" d="M${n(cx - 1 * m)} ${n(yc)} L${n(cx - 6 * m)} ${n(yc - 3)} L${n(cx - 6 * m)} ${n(yc + 3)} Z"/>`);
    this.wire([cx, yc - 14], [cx, yc - 9]).wire([cx, yc - 4], [cx, yc + 4]).wire([cx, yc + 9], [cx, yc + 14]);
    this.wire([cx + 5 * m, yc - 14], [cx + 5 * m, yc + 14]).wire([cx + 5 * m, yc], [x + 22 * m, yc]);
    return this;
  }

  /** Ground symbol standing above (x, y), for a resistor that runs up the page to ground. */
  groundUp(x, y) {
    this.wire([x, y], [x, y - 8]);
    this.wire([x - 11, y - 8], [x + 11, y - 8]).wire([x - 7, y - 13], [x + 7, y - 13]).wire([x - 3, y - 18], [x + 3, y - 18]);
    return this;
  }

  /** Ground symbol hanging below (x, y). */
  ground(x, y) {
    this.wire([x, y], [x, y + 8]);
    this.wire([x - 11, y + 8], [x + 11, y + 8]).wire([x - 7, y + 13], [x + 7, y + 13]).wire([x - 3, y + 18], [x + 3, y + 18]);
    return this;
  }

  /** Net flag at the sheet edge: an arrow-shaped tag with the net name. dir 'in' points into the circuit. */
  port(x, y, name, dir) {
    // anchor point (x, y) is where the wire starts; the tag sits outside it
    const left = dir === 'in';
    const x0 = left ? x - 46 : x + 46;
    this.add(
      `<path class="sch-flag" d="M${n(x)} ${n(y)} L${n(left ? x - 8 : x + 8)} ${n(y - 8)} L${n(x0)} ${n(y - 8)} L${n(x0)} ${n(y + 8)} L${n(left ? x - 8 : x + 8)} ${n(y + 8)} Z"/>`,
    );
    this.text(left ? x - 27 : x + 27, y + 4, name, { cls: 'sch-net', anchor: 'middle' });
    return this;
  }

  /**
   * IC body. pins: { left:[{name, y}], right:[...], top:[{name, x}], bottom:[...] } with absolute coordinates.
   * Returns nothing; the caller draws wires to the pin positions it chose.
   */
  ic(x, y, w, h, pins, { title, subtitle } = {}) {
    this.add(`<rect class="sch-ic" x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="3"/>`);
    for (const p of pins.left ?? []) {
      this.wire([x - 12, p.y], [x, p.y]);
      this.text(x + 8, p.y + 4, p.name, { cls: 'sch-pin' });
    }
    for (const p of pins.right ?? []) {
      this.wire([x + w, p.y], [x + w + 12, p.y]);
      this.text(x + w - 8, p.y + 4, p.name, { cls: 'sch-pin', anchor: 'end' });
    }
    for (const p of pins.top ?? []) {
      this.wire([p.x, y - 12], [p.x, y]);
      this.text(p.x, y + 16, p.name, { cls: 'sch-pin', anchor: 'middle' });
    }
    for (const p of pins.bottom ?? []) {
      this.wire([p.x, y + h], [p.x, y + h + 12]);
      this.text(p.x, y + h - 8, p.name, { cls: 'sch-pin', anchor: 'middle' });
    }
    if (title) this.text(x + w / 2, y + h / 2 - (subtitle ? 2 : -4), title, { cls: 'sch-ictitle', anchor: 'middle' });
    if (subtitle) this.text(x + w / 2, y + h / 2 + 14, subtitle, { cls: 'sch-val', anchor: 'middle' });
    return this;
  }

  toString() {
    return [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 ${this.top} ${this.w} ${this.h - this.top}" role="img" aria-labelledby="${this.id}-t ${this.id}-d"${this.minWidth ? ` style="min-width:${this.minWidth}px"` : ''}>`,
      `<title id="${this.id}-t">${esc(this.title)}</title>`,
      `<desc id="${this.id}-d">${esc(this.desc)}</desc>`,
      ...this.parts,
      `</svg>`,
    ].join('\n');
  }
}
