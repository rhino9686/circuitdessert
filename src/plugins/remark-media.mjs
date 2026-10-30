// Rewrites two kinds of special Markdown URLs.
//
//   media:<file>  ->  the media host (Cloudflare R2 on media.circuitdessert.org)
//     ![Scope capture of the switch node](media:sy21219-switch-node.webp)
//     Set MEDIA_BASE_URL to point somewhere else (for example a local preview server).
//
//   site:<path>   ->  a page on this site, with the site's base path added, so the link works on a
//                     custom domain and on a GitHub Pages project URL alike
//     [the SY21219 recipe](site:recipes/sy21219/)
//     [SY21219 part page](site:parts/silergy/sy21219/)
const MEDIA = (process.env.MEDIA_BASE_URL || 'https://media.circuitdessert.org').replace(/\/$/, '');
const BASE = (process.env.BASE_PATH || '/').replace(/\/$/, '');

function walk(node, fn) {
  fn(node);
  if (Array.isArray(node.children)) for (const child of node.children) walk(child, fn);
}

export default function remarkMedia() {
  return (tree) =>
    walk(tree, (node) => {
      if ((node.type !== 'image' && node.type !== 'link') || typeof node.url !== 'string') return;
      if (node.url.startsWith('media:')) node.url = `${MEDIA}/${node.url.slice('media:'.length)}`;
      else if (node.url.startsWith('site:')) node.url = `${BASE}/${node.url.slice('site:'.length).replace(/^\/+/, '')}`;
    });
}
