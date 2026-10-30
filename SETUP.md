# Setup and handoff checklist

Work through these once to take the repository live. Nothing here has been run against a real GitHub
repository, Cloudflare account or domain yet, so treat the workflows as untested until their first run.

## 1. Create the repository

- [ ] Create a GitHub repository (for example `circuit-dessert`) and push this project to `main`.
- [ ] Find and replace the placeholders:
  - `YOUR-ORG` in `.github/CODEOWNERS` and in the commented-out social link in `astro.config.mjs`.
  - `circuitdessert.org` in `astro.config.mjs`, `public/robots.txt` and the default in `src/plugins/remark-media.mjs`, if the real domain differs.
- [ ] Un-comment and fill in the GitHub link in `astro.config.mjs` (`social`).

## 2. Turn on GitHub Pages

- [ ] **Settings → Pages → Source: GitHub Actions.**
- [ ] Until the domain is live, add repository **variables** (Settings → Secrets and variables → Actions → Variables):
  - `SITE_URL` = `https://YOUR-ORG.github.io`
  - `BASE_PATH` = `/circuit-dessert`
  - `MEDIA_BASE_URL` = your R2 public URL (see step 3)
- [ ] When the custom domain is ready: set it under **Settings → Pages**, point a DNS `CNAME` record at `YOUR-ORG.github.io`, enable HTTPS, then **delete** `SITE_URL` and `BASE_PATH`.
- [ ] Push to `main`. The **Deploy to GitHub Pages** workflow builds and publishes. It prints the built size and warns above 700 MB (GitHub's limit is 1 GB).

## 3. Set up image hosting (Cloudflare R2)

- [ ] Create an R2 bucket, for example `circuit-dessert-media`.
- [ ] Make it publicly readable on a custom domain such as `media.circuitdessert.org`. Cloudflare's custom-domain feature for R2 needs the domain's DNS to be on Cloudflare. For early testing you can use the bucket's `r2.dev` URL instead (set it as `MEDIA_BASE_URL`). Check Cloudflare's current documentation for the exact steps.
- [ ] Create an R2 API token with read and write access to that bucket.
- [ ] Add these repository **secrets**: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`.
- [ ] Test the flow with a small PR that adds one image to `media-incoming/` and references it from a page. After merge, the **Upload media to R2** workflow should upload it, delete it from the repo and record it in `src/data/media-manifest.txt`.

## 4. Protect `main`

Use a branch protection rule or ruleset:

- [ ] Require a pull request and at least one approval.
- [ ] Require review from code owners.
- [ ] Require the **CI / build-and-validate** check to pass.
- [ ] **Allow `github-actions[bot]` to bypass** the rule. The media workflow pushes a small cleanup commit to `main`, and it will fail without this. (If the push fails, the image is already uploaded; delete it from `media-incoming/` by hand.)
- [ ] Check **Settings → Actions → General → Workflow permissions** allows workflows to write.

## 5. Decisions only you can make

- [ ] **Licenses.** Drafted: MIT for code (`LICENSE`), CC BY 4.0 for content (`LICENSE-CONTENT.md`), a site page at `/licenses/` (`src/content/docs/licenses.md`) and a footer line on every page. To finish: confirm the copyright line ("Circuit Dessert contributors") in `LICENSE`, optionally paste the verbatim CC BY 4.0 legal code into `LICENSE-CONTENT.md`, and have the wording reviewed by someone qualified before launch. Manufacturer reference designs and datasheet material are not yours to relicense; the site links to them and credits them.
- [ ] **Code of conduct** and issue templates, if you want them.
- [ ] **Contact route** for people who aren't comfortable with Git. The old form was a demo that sent nowhere, so it was dropped.

## 6. Content still to do

- Part pages: all 14 are marked `draft: true`. The specs are checked against datasheets, but the prose is first-draft and wants a human rewrite. Feature lists and component tables were written from the datasheets in the same pass and are worth a second look.
- LCSC part numbers are empty on every part.
- Recipe pages: the body text is carried over from the old site and based on manufacturer material. The Pantry's `category` values are inconsistent (about 45 variants). Normalising them would allow filtering.
- Pantry: the SY82853 entry was removed because that part couldn't be confirmed to exist.
- There is no tutorial recipe yet; the schema supports `kind: tutorial`.

## 7. Known limitations

- GitHub Pages has no per-PR preview sites. Reviewers run `npm run dev` locally, or you can move hosting to Cloudflare Pages, which does offer them.
- Images added in a PR don't render on any preview until they're merged and uploaded.
- The link checker in CI (`lychee`) reports but doesn't fail the build; turn on `fail: true` in `.github/workflows/ci.yml` when the site is stable.
- Astro prints `Could not render /404 from route /[...slug] ...` on every build. It's harmless: the custom 404 page is still used.

## 8. Everyday commands

```bash
npm install
npm run dev        # preview at http://localhost:4321
npm run validate   # content checks (frontmatter, folders, media)
npm run build      # full build + search index
npm run schematics # regenerate the schematic drawings in src/assets/recipes/
```
