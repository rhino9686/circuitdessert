/** Helpers for numbered document pages (parts, recipes): the contents panel and section numbers. */
export interface Sec { id: string; title: string; subs?: { id: string; title: string }[] }
export interface Heading { depth: number; slug: string; text: string }

/**
 * Builds the numbered contents list. Section numbers on the page itself come from CSS counters in DOM
 * order, so this mirrors that order: template sections before the body, the body's own ## and ###
 * headings, then template sections after it.
 */
export function buildToc(pre: Sec[], body: Heading[], post: Sec[]): Heading[] {
  const items: Heading[] = [];
  let n = 0;
  const add = (s: Sec) => {
    n++;
    items.push({ depth: 2, slug: s.id, text: `${n} ${s.title}` });
    (s.subs ?? []).forEach((u, i) => items.push({ depth: 3, slug: u.id, text: `${n}.${i + 1} ${u.title}` }));
  };
  pre.forEach(add);
  let sub = 0;
  for (const h of body) {
    if (h.depth === 2) { n++; sub = 0; items.push({ depth: 2, slug: h.slug, text: `${n} ${h.text}` }); }
    else if (h.depth === 3 && n > 0) { sub++; items.push({ depth: 3, slug: h.slug, text: `${n}.${sub} ${h.text}` }); }
  }
  post.forEach(add);
  return items;
}
