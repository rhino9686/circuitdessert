# Circuit Dessert

An open repository of reference designs and parts, plated like recipes. Built with
[Astro Starlight](https://starlight.astro.build), hosted on GitHub Pages, with images on
Cloudflare R2.

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
npm run validate   # extra content checks (also runs in CI)
npm run build      # full build + search index
npm run schematics # regenerate the schematic drawings in src/assets/recipes/
```

## Content

| What | Where | Rendered as |
| --- | --- | --- |
| Recipes (reference designs, tutorials) | `src/content/recipes/<id>.md` | `/recipes/<id>/` |
| Parts | `src/content/parts/<manufacturer>/<family>/<part>.md` | one page per family: `/parts/<manufacturer>/<family>/` |
| The Pantry (manufacturer design listing) | `src/data/pantry.yaml` | `/pantry/` |
| Guides and contribution docs | `src/content/docs/` | Starlight pages |
| New images (merged, then moved to R2) | `media-incoming/` | `media:` links in Markdown |

Templates live next to the content (`_template.md`, `_part.md`); files starting with `_` are
ignored by the build. Frontmatter is validated against the schemas in `src/content.config.ts`,
so a PR with missing or malformed fields fails CI.

## Page layout and theme

Part and recipe pages are numbered section cards with a contents panel on the right. Each `##` heading in
a page body becomes a numbered section (`###` becomes a numbered subsection), and the rest of the page is
built from the frontmatter: see the Contribute guides for what feeds each section. The site has a light and
a dark theme: it follows the visitor's system setting, and the header button switches and remembers the
choice. Colors live in `src/styles/circuit-dessert.css`.

## Images

Images are hosted on Cloudflare R2, not in the repository. Contributors drop files in `media-incoming/` and
reference them as `![Alt text](media:file-name.webp)`. `npm run validate` checks format, size, names and
references. After a PR is merged, `.github/workflows/upload-media.yml` uploads the files, removes them from
the repo and records them in `src/data/media-manifest.txt`.

## Taking it live

See **[SETUP.md](SETUP.md)** for the full checklist (GitHub Pages, R2, branch protection, licenses).

## License

Code is MIT (`LICENSE`). Written content and drawings are CC BY 4.0 (`LICENSE-CONTENT.md`). Manufacturers' datasheets,
figures, names and logos belong to their owners and are linked, not relicensed. The plain-English version is on the
site at `/licenses/`.

## Deploying

`.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every push to `main`.
Until `circuitdessert.org` is registered, set repository variables `SITE_URL`
(e.g. `https://YOUR-ORG.github.io`) and `BASE_PATH` (e.g. `/circuit-dessert`). After the custom
domain is set up, delete both variables.


## Size limits

GitHub Pages: published site ≤ 1 GB, soft 100 GB/month bandwidth, 10-minute deploy timeout.
The deploy workflow prints the built size and warns above 700 MB.
