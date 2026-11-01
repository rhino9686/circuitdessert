---
title: Add a recipe
description: "Write up a reference design or tutorial as a recipe."
sidebar:
  order: 2
---

A recipe is a Markdown file with a short block of structured details at the top and your write-up below. The site lays it out as numbered section cards, with a contents panel on the right.

## Steps

1. Copy `src/content/recipes/_template.md` to `src/content/recipes/<short-id>.md`. Use a lowercase, hyphenated name such as `my-buck-boost.md`; it becomes the page address.
2. Fill in the details at the top (see below).
3. Write the body: start it with a `##` heading. Each `##` heading becomes a numbered section card, and each `###` a numbered subsection.
4. Run `npm run dev` to see it, and `npm run validate` before you push.

## What the page shows

| Section | Where it comes from |
| --- | --- |
| 1 Overview | The hero illustration, `abstract` (or `summary`), `stats` tiles and the `source` button |
| 2 Reference circuit | The `schematic` drawing and `components` as a bill of materials. Without a `schematic` this section is called *Key components* and shows the table alone. Parts that have a [part page](../part/) are linked automatically |
| 3 and later | Your Markdown body, such as *Design requirements*, *How it works*, *Choosing the components*, *Layout* and *Documents* |
| Last | Community build notes (generated) |

## The details at the top

| Field | What goes in it |
| --- | --- |
| `title` | A descriptive title. |
| `design_id` | The manufacturer's ID, if there is one (optional). |
| `manufacturer` | For published reference designs (optional). |
| `kind` | `reference-design` or `tutorial`. |
| `category` | Free text for now, for example `Power / DC-DC`. |
| `summary` | One or two sentences, under 300 characters. Used on cards and in search. |
| `abstract` | A longer intro shown under the title, in plain text (optional). |
| `source` | A link to the original (required for reference designs). |
| `stats` | Up to four headline numbers, each with a label. |
| `source_revision` | The revision of the source document your numbers were checked against, such as `Rev 1.0 (May 2026)` (optional). |
| `draft` | `true` while the prose still needs a human review or a build to confirm it. The page shows a "Draft notes" tag. |
| `components` | The parts, each with `part` and a short `description` of its role. Add `ref` (the reference designator on the schematic) and `maker` to make a full bill of materials. For a generic part, put its value in `part`, such as `100 kΩ, 1%, 0603`. |
| `schematic` and `schematic_caption` | A drawing in `src/assets/recipes/` and its caption (optional). See *Schematic drawings* below. |
| `author` and `license` | Who made it, and the license of the design files they share (optional). The write-up itself is CC BY 4.0; see [Licenses](site:licenses/). |
| `hero` and `hero_caption` | An illustration file in `src/assets/recipes/` and its caption (optional). |

## Writing the body

The body is ordinary Markdown with a few extras:

- **Tables** are styled automatically and scroll sideways on a narrow screen.
- **Callouts:** start a paragraph with `>` to make it a note, for a warning or a point you want to stand out.
- **Links to other pages on this site** use the `site:` prefix, so they work wherever the site is hosted: `[the SY21219 recipe](site:recipes/sy21219/)` or `[SY21219](site:parts/silergy/sy21219/)`. `npm run validate` checks that the target exists.
- **Calculated values:** if a number comes from your own calculation rather than the source document, say so, and show the formula or inputs.

## Schematic drawings

The reference circuit section can show a schematic. Drawings are SVG files in `src/assets/recipes/` that use classes (`sch-w`, `sch-ic`, `sch-ref` and so on) instead of colors, so they follow the light and dark themes. You can draw one in any editor that lets you set classes, or generate it:

1. Open `scripts/schematics/designs.mjs`. It holds drawing functions built on a small kit in `lib.mjs` (resistors, capacitors, inductors, grounds, IC boxes, net flags).
2. Add your drawing function, then list it in `scripts/schematics/build.mjs`.
3. Run `npm run schematics`. It writes the SVG into `src/assets/recipes/`, and the generated file is committed with the rest.
4. Set `schematic: your-file.svg` in the recipe.

## Tips

- **Credit the maker.** A manufacturer's reference design stays credited to them, with a link to the original source. Write your own words; don't paste their documents.
- **Be upfront about status.** Say what's been built and measured, and what hasn't.
- **Quote values with a colon.** If a value contains a colon followed by a space, wrap the whole value in double quotes, or the page won't build. `npm run validate` catches this.
- **Don't type section numbers** into headings; they're added automatically.
- **Pictures:** see [Images](../images/).
