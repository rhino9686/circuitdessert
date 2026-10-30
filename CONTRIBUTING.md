# Contributing to Circuit Dessert

Thanks for helping. Everything on the site is a file in this repository, so contributing is a pull request.

The full guide lives on the site under **Contribute** (source: `src/content/docs/contribute/`):

- **Add a recipe**: `src/content/docs/contribute/recipe.md`
- **Add a part**: `src/content/docs/contribute/part.md`
- **Add images**: `src/content/docs/contribute/images.md`

## The short version

1. Fork the repository and create a branch.
2. Copy the template (`src/content/recipes/_template.md` or `src/content/parts/_template/_part.md`) and fill it in.
3. `npm install`, then `npm run dev` to preview and `npm run validate` to check your files.
4. Put new images in `media-incoming/` and reference them as `![Alt text](media:file-name.webp)`.
5. Open a pull request and complete the checklist in the template.

## Ground rules

- **Credit the maker.** Manufacturer reference designs stay credited to the manufacturer, with a link to the original.
- **Write in your own words.** Link datasheets and source documents; don't copy or upload them.
- **Part specs must come from the datasheet.** Set `verified: true` only if you checked every value.
- **Be upfront** about what has been built and measured, and what hasn't.

## Licensing of contributions

By opening a pull request you confirm that you wrote the material (or have the right to share it) and that you license it under the project's licenses: **CC BY 4.0** for written content and drawings (`LICENSE-CONTENT.md`) and **MIT** for code (`LICENSE`). You keep your own copyright. Don't submit text or figures copied from a datasheet, or photos you didn't take. The plain-English version is on the site's Licenses page (`src/content/docs/licenses.md`).
