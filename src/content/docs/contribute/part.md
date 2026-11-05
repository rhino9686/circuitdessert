---
title: Add a part
description: "Add a part page with specs checked against the datasheet."
sidebar:
  order: 3
---

A part page has two layers: facts at the top (specs checked against the manufacturer's datasheet) and your own notes below. The site lays them out as numbered section cards, with a contents panel on the right.

## Steps

1. Copy `src/content/parts/_template/_part.md` to `src/content/parts/<manufacturer>/<family>/<part>.md`. Use lowercase, hyphenated folder names, for example `silergy/sy21219/sy21219.md`.
2. Fill in the details at the top, taking every value from the datasheet.
3. Write your notes in the body.
4. Run `npm run dev`, then `npm run validate`.

Every part gets its own page. Parts that share a `family` value are also compared on a family page.

## What the page shows

| Section | Where it comes from |
| --- | --- |
| 1 Overview | `abstract`, plus tiles built from `specs` and `packages` |
| 2 Features | `features` |
| 3 Specifications | A generated "Key specifications" table, then one table per entry in `spec_groups` |
| 4 Recommended components | `design_tables` (optional) |
| 5 and later | Your Markdown body: each `##` heading becomes a numbered section, each `###` a numbered subsection. Typical sections are *How it works*, *Example application*, *Layout* and *Things to watch* |
| Last sections | Related parts in the family, ordering and documents, and the recipes that use the part (all generated) |

## The details at the top

- **`summary`** is one sentence, used on cards and in search. **`abstract`** is a short paragraph shown under the title.
- **`specs`** holds the headline numbers (`vin_min_v`, `vin_max_v`, `vout_min_v`, `vout_max_v`, `iout_max_a`, `fsw_khz`, `iq_ua`, `topology`). Leave out any that don't apply.
- **`features`** is the datasheet's headline features, in your own words.
- **`spec_groups`** are the other specifications, each group a titled table. Typical groups are *Input, output and reference*, *Switching and power stage*, *Protection and monitoring* and *Package, ratings and thermal*, but use whatever fits the part.
- **`design_tables`** hold recommended component values and other lookup tables, with a `columns` list and a `rows` list.
- **`datasheet`** is the link, and **`datasheet_revision`** names the revision you checked, for example `Rev 1.0 (June 2025)`.

## Checking the specs

- **Read the table columns.** Datasheet tables have min, typ and max columns, and plain text copies often lose which is which. Current limits in particular are often minimums, not typical values.
- **Set `verified: true` only when every spec above was checked against the datasheet** you linked. Leave it `false` otherwise; the page then shows a notice.
- **Leave out what you can't confirm.** An empty field is better than a guess.
- **Link the datasheet; don't upload it.**
- **LCSC:** add the `lcsc` part number (for example `C78989`) if you can confirm a listing. It's optional.

## Your notes

The body must start with a `##` heading. A good set of sections is **How it works**, **Example application**, **Layout** and **Things to watch**. Keep each fact in one place: the specs are already in the tables above, so the notes say what the datasheet doesn't.

## Example application

If the datasheet gives a typical or reference circuit, add it to the part page as a `##` section called **Example application**, with `###` subsections. A good one has:

- **The circuit:** a drawing and a parts table (ref, part, description, maker), plus the conditions it was built for.
- **How each value was chosen,** and a worked example. Say which numbers you calculated yourself and which came from the datasheet.
- **Variants,** such as other output voltages. Point to the *Recommended components* tables instead of copying them, and add only what you calculated.

To show a drawing, put an image line on its own line:

```md
![Reference circuit redrawn from the datasheet (VOUT = 5 V)](schematic:my-circuit-schematic.svg)
```

The file is an SVG in `src/assets/recipes/`, and the text in the brackets becomes the caption. The drawing is inlined, so it follows the light and dark themes. `npm run validate` checks that the file exists. See [Schematic drawings](site:contribute/recipe/) in the recipe guide for how to draw or generate one, and the [SY21219 page](site:parts/silergy/sy21219/) for a finished example.

Write what the datasheet doesn't say: where this part shines, gotchas, layout tips, good alternatives. Use your own words. Mention datasheet errors you've spotted, such as a pin table that contradicts the layout section. Keep `draft: true` until a human has rewritten the prose, then set it to `false`.

## Gotchas

- A value with a colon followed by a space must be wrapped in double quotes.
- Related parts belong in the same `family` only if they're close variants. Different datasheets with different frequencies or packages usually mean different families.
- Section numbers are automatic. Don't type them into headings.
