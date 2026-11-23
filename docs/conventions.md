# Content conventions

How part pages, recipes, schematics, packages and KiCad files are written on this site. These are the rules the existing pages follow; `src/content/parts/_template/_part.md` and `src/content/recipes/_template.md` are the starting points, and `npm run validate` and `npm run build` check the mechanical ones. For the page layout by kind of part, see [page-patterns.md](page-patterns.md). To see what is on the site, run `npm run parts-index` for a CSV of every part page.

## Categories

- Defined in three places that must agree: `CATEGORIES` in `src/lib/parts.ts`, the `category` enum in `src/content.config.ts`, and the comment in `_template/_part.md`.
- A category section appears on the Parts page once a part uses it. The order in `CATEGORIES` is the page order, and a group's categories must be contiguous. Groups: Power, Signal Chain, Digital, Other.
- Keys. Power: `buck-converter`, `boost-converter`, `buck-boost-converter`, `ldo`, `battery-charger`, `ac-dc-controller`, `gate-driver`, `motor-driver`, `led-driver`, `load-switch`, `power-mux`, `pd-controller`, `pmic`. Signal Chain: `amplifier`, `data-converter`, `voltage-reference`. Then `processor` (Digital) and `other`.
- **Keep categories broad.** No sub-type categories (a comparator is `amplifier` with a `comparator` tag). Add a category only when asked for by name, and name it the way the manufacturer does. A part with no match goes in `other`.
- Where common cases go: wireless MCU modules and energy-metering ICs in `processor`; power monitors, current-sense amplifiers and audio amplifiers in `amplifier`; off-line flyback switch ICs in `ac-dc-controller`; multi-rail SSD power ICs in `pmic`; fuel gauges in `other` with the tag `fuel-gauge`.

## Part pages

Path: `src/content/parts/<manufacturer>/<family-folder>/<part>.md`. The folder is the slug of `family:` and the file is the slug of `part:` (lowercase, non-alphanumerics to hyphens). **The folder name is not the URL slug**: `site:` links and built URLs use the part slug (`/parts/silergy/sy24642/` for the folder `sy24641-sy24642-sy24647`), so a link to the folder name fails validate.

New pages are `draft: true`. `verified: true` means every spec was checked against the datasheet in `datasheet:`. Use `verified: false` when the datasheet was only read as text, when part of the specs come from a product page, when figures specific to the part were not read, or when the electrical tables were not compared with rendered pages.

### Structure

How it works (lookups such as pins, versions, register maps and power modes are `###` subsections here, as Markdown tables) → Example application → Layout → What the datasheet shows → Things to watch → Datasheet notes.

- **Example application.** A datasheet's typical or reference circuit goes on the part page, not in a recipe: the schematic (`![caption](schematic:<file>.svg)`), a Ref / Part / Description / Maker table, an "About the source" blockquote, subsections, and a worked example. Recipes are only for designs that are not a single part's datasheet example.
- With **two datasheet circuits**: one subsection each, one shared parts table when the parts are shared, one worked-example subsection. With **two variants of one circuit**: draw the first and say in the caption and the About-the-source note that the other exists and is not drawn.
- **No circuit in the datasheet:** if there is a recommended-components table and connection figures, draw a "Basic connections" schematic from them, labelled ours in the caption and in the About-the-source note (the pin arrangement is ours). With nothing to draw from, leave out Example application and open Datasheet notes with the About-the-source blockquote. A "Test Circuit" counts as the Example application when it is the only circuit.
- **Figure with no values but a table that gives them:** draw the table's values and say so in the caption and the note. Anything the figure leaves out is added only in a worked example labelled ours.
- **Datasheet drawing and BOM disagree:** draw one, say which in the caption, and list every disagreement under Things to watch.
- **Layout** ends with a "Pin 1 is …" sentence. When the part has no package page or symbol, it then says "This site has no KiCad symbol or footprint for this part yet." (Things to watch says it too). When it has them, Layout says where the footprint numbers come from, which pin numbers are ours (an unnumbered exposed pad), and when the pads are ours because the datasheet has no land pattern.
- **Contradictions inside the datasheet** go in Datasheet notes; the design consequences go in Things to watch.
- **Our own calculations** go in `design_tables` with "(calculated)" in the title and a note on the method. Plot readings get "(read by eye)". Datasheet tables keep plain titles. Prose says "our reading" or "our note" for anything the datasheet doesn't state. Don't repeat a design table in the body.
- `design_tables` render under "Recommended components", so lookups (pin tables, versions tables, reference tables) go in the body as Markdown tables. Column headings are upper-cased by the page CSS, so µ and m turn into M: spell units out or put them in row labels. Wide tables scroll sideways inside the card, so keep headings and row labels short.
- `specs.extra` items render under "Other specifications"; "Key specifications" shows topology and package only.

### Specs

- A fixed output sets `vout_min_v` = `vout_max_v`. A switch limit goes in `specs.extra`, not `iout_max_a`.
- Non-power parts put their supply range in `vin_*` (shown as "Input voltage"), and leave it out when the datasheet gives only a nominal supply. `iq_ua` takes fractions; say in `specs.extra` which mode it is. Hysteretic parts leave `fsw_khz` out. Multi-rail parts give extremes with per-rail ranges in `specs.extra`. Modules have `vin_*` but no `iq_ua` or `fsw_khz`.
- Off-line switchers: no `vin_*` (the input is AC); `fsw_khz` is a string ("66 or 132"); output power by package and input goes in two `design_tables` copied from the datasheet's power table.
- Keep `packages` strings short; they form the Package tile.

### Status

`status: active | nrnd | obsolete | unknown`. Use `unknown` when no lifecycle source was found. `obsolete` only from a manufacturer or distributor lifecycle listing, and `active` only from a manufacturer product page ("Production", "Recommended for New Designs") or from the datasheet's own packaging addendum listing the orderables as Active. The page says where the status comes from.

### Names and families

- Use the name on the datasheet the user gave; the other name goes in `specs.extra`, the About-the-source note and tags. A name from a list that differs from the datasheet becomes an alias. When two product names might be the same part and no source ties them, say we can't tell and don't merge them.
- The maker is the name the datasheet or the user gives, even when the company has since been acquired; the datasheet link may point at the current owner and the page says so.
- **Family (a):** one datasheet covering several versions → one page for the requested version plus a versions table; the folder is named for the family, `family: A / B`, the file and `part` for the one version. When no version is named, the page is named for the datasheet title and covers every version side by side. Versions differing only in output voltage → one page named for the family.
- **Family (b):** parts that each have their own datasheet → separate files in one family folder, cross-linked with `site:`, each with a "Differences from the …" table. Same-maker parts that only share a role get separate folders and a related-part bullet on each.
- **(c)** Merge a variant into an existing page only when asked.
- Two part files in one family folder make the site build a family comparison page at `/parts/<maker>/<family-slug>/`.
- A catalogue (non-automotive) twin with its own datasheet is not covered by the page; the page says so.

### Frontmatter gotchas

- `summary` is at most 200 characters for parts and packages and 300 for recipes. `npm run build` checks it; `validate` does not.
- Quote any value containing ": ", including feature lines. An unquoted one fails the build as `features.N: Expected string, received object`, and `validate` doesn't catch it. Spec values, `design_tables` cells and column headings must be strings.
- Build long calculated tables in a script and emit with `yaml.safe_dump(..., allow_unicode=True, sort_keys=False, width=100000)`. Compute every calculated number in the script.
- The body must start with a `## ` heading; each `## ` becomes a numbered section card.
- `site:parts/<maker>/<part-slug>/` and `site:recipes/<id>/` links work in bodies; `site:` reaches only recipes and parts, not package pages.

## Recipes

- `src/content/recipes/<id>.md`, schema in `src/content.config.ts`, template `_template.md`. Fields: `title`, `kind` (`reference-design` | `tutorial`), free-text `category`, `summary`, `abstract`, `stats` (max 4), `components` (BOM; a `part` matching a part page name links to it), `schematic` and `schematic_caption`, `author`, `tags`, `draft`.
- A hypothetical design of our own is a `tutorial` with `draft: true`, the author named, no `source` or `manufacturer`, an "About this guide" callout, our own values marked "ours", and calculated tables in the body.
- Recipes have no `design_tables`; calculated tables are Markdown tables in the body. A recipe body can embed more drawings with `![caption](schematic:<file>.svg)`.
- A recipe modelled on someone else's published design that will be credited later has no `author` or `source`, names no project or author, and marks swappable parts "To swap:" in the BOM.

## Reading datasheets

- Render the electrical-table page (`pdftoppm -r 130` or 200, crop) for Min/Typ/Max columns; text summaries misplace them.
- `pdftotext` maps µ to m and Ω to W, and footnote markers merge into numbers ("4¹/12¹" reads as 41/121). Check units on the rendered pages, and note in Datasheet notes when a value had to be taken as one unit or the other.
- Two-column datasheets interleave columns in `pdftotext`; use `-layout`, or render the page. Wide pin tables lose wrapped rows; patch them by hand.
- A value printed across two columns stays whole in one spec line, and the line says so. A row whose condition cell is blank is kept, and the page says no condition is printed.
- Check application figures against the rendered page: the text layer drops unlabelled parts and never says which node a part connects to. Read block diagrams from a 400 dpi crop. Compare printed designators and values programmatically for large schematics.
- Register bit numbers come from the bit-name row (7 → 0), not memory. The PDF page can differ from the footer page.
- Read the prose for contradictions with the tables. Cross-check every stated ratio or limit against its own arithmetic.
- WebFetch gives a text layer or a small-model summary, never drawings. Treat a fetched summary as unverified and build pages from the PDF itself.

## Schematics

- SVGs live in `src/assets/recipes/`, are committed, and are generated by `npm run schematics` (`scripts/schematics/build.mjs` plus one `designs-*.mjs` per part, registered in `build.mjs`). The tree must stay clean after `npm run schematics`.
- **Export names must be unique** across the `designs-*.mjs` files; alias on import when a name clashes.
- The kit is `scripts/schematics/lib.mjs`: `Sheet`, `wire`, `hwire` (with hops), `dot`, `text`, `label`, `resistor`, `inductor`, `capacitor`, `diode` (incl. led, zener), `nmosV`, `ground`, `groundUp`, `port`, `ic` (pins on four sides), `refMarkup`. Raw shapes go in with `s.add('<circle class="sch-w" …/>')`; a dashed connection is a raw `<line>` with `stroke-dasharray="4 3"`.
- One function can serve near-identical parts via a `part` argument, or two figures of one datasheet via a flag. Reuse an existing drawing when the circuit matches.
- When a drawing shows only one side of a circuit, the caption lists what isn't drawn; drawings that regroup pins by function say so. Pins that exist twice on the package are drawn once, as the figure does, and the caption says so. Pins the figure omits are not drawn, with a note in the drawing saying what the pin table requires. A channel the figure draws but the pinout lacks is drawn with nothing connected, and the page doesn't claim the extra channel.
- Dense figures may be a dashed labelled box with the part names inside; the caption says it is a box and which parts it stands for.
- Layout tips: keep `ic` pin rows off the vertical middle (the title collides) or place the title by hand; `port()` tags are 46 wide, so names over 5 characters need an open terminal with plain text; `Sheet({top})` crops that many units off the top, so draw nothing above it; `label()` subscripts everything after the first letter, so draw two-letter refs with `s.text`; space resistor labels at least 32 apart; a ground symbol hangs 18 below its point, so ground pins need at least 30 spacing; a `resistor()` body is 30 long, so use at least 40 between terminals of a vertical divider; value labels beside a capacitor collide with its plates, so put them above or below; choose the IC's pin order so the pin that must reach a distant rail is the one nearest it, and mark unavoidable crossings with `hwire` hops.
- Check that every divider node is wired to its IC pin. Large sheets take two or three layout passes: render with `rsvg-convert --stylesheet <css>` after each and look for wires through labels, rails that stop short, parts not joined to their net, and a polarity "+" under a label.
- Drawings wider than about 850 units scroll sideways on the page; that is expected.
- To preview: `rsvg-convert` with the `sch-*` colours inlined or passed as a stylesheet and a white background. For the built page, serve `dist` and use headless Chrome. If only an SVG changes, `rm -rf dist .astro node_modules/.astro` before rebuilding.

## Packages, KiCad symbols and footprints

### Package pages

- `src/content/packages/<slug>.md`; the body starts with `## `. Frontmatter: `name`, `aliases`, `summary` (≤ 200), `pins`, `pitch_mm`, `dimensions`, `footprint` (a `.kicad_mod` file name; the stem should equal `name`), `source` (part, revision, page, datasheet URL), `checked_against` (parts whose own drawing was compared), `assumed_for` (parts said to be compatible but not compared), `opened_in_kicad`, `draft`.
- Body sections: How the footprint was made, Orientation, Things to watch. Add "Where this drawing comes from" when the source isn't the listed part's own datasheet.
- A page for one maker's outline says it is that outline, not every package of that name (matching is by name only).
- When there is an outline but no land pattern, the first paragraph says the pads are ours and the illustration labels them "(our pads)". When the datasheet gives positions but no hole or pad size, the page says in bold that those sizes are ours and gives the rule. When pads were read from a rendered page and not measured in the PDF's vector paths, the page says so.
- `pins` counts real pins (11 in 12 positions counts as 11).
- **Matching:** a part's `packages:` strings are matched to package pages by `normalizePackage` (lowercase, `×` → `x`, non-alphanumerics removed) against `name` and `aliases`. Part pages link the package and offer the footprint only when the part is in `checked_against` or `assumed_for` (with a note); the package page lists each part naming it as "Yes", "Assumed" or "Not yet". Add an alias only when the pad layout is the same package.

### Generated files

`npm run kicad` (`scripts/kicad/build.mjs`, data in `scripts/kicad/data.mjs`) writes the footprints (`public/kicad/footprints/circuitdessert.pretty/`), the symbols (`public/kicad/symbols/<PART>.kicad_sym`) and the package illustrations (`src/assets/packages/<slug>.svg`). KiCad 7 formats, all committed, and the tree must stay clean after running it. A part's `kicad_symbol: <PART>.kicad_sym` adds a download row (one file per part, which may hold several symbols). A new layout must leave the other packages' output byte-identical.

Supported layouts: two-row gull-wing (`pinsPerSide`, optional `thermalPad`, `missing`, `pad.ratio`); `kind: 'dual-nolead'` (VSON/SON, comb-shaped exposed pad); `layout: 'quad'` in `quad.mjs` (QFN/LFCSP); `layout: 'dip-th'` and `layout: 'sip-th'` in `tht.mjs`. CSP, SOT563, larger LQFPs and ball-grid packages would each need a new layout.

### Footprint conventions

- KiCad orientation: pin 1 top left; two-row packages numbered down the left and up the right; four-sided packages counter-clockwise from pin 1 top left. A datasheet outline may be turned or mirrored (a bottom view is mirrored).
- Exception: a package whose own top view numbers the pins clockwise keeps the datasheet's top view. **Always check a DIP-style package's numbering against the datasheet's top view, not against the usual DIP order.**
- Pads are `roundrect` ratio 0.25 on F.Cu/F.Paste/F.Mask (stadium pads 0.5); courtyard 0.25; silkscreen over the body with an extension on the pin 1 side; fab outline with a 0.5 mm pin 1 chamfer; mask and paste at KiCad defaults unless the datasheet gives an opening; no thermal vias.
- An exposed pad the datasheet doesn't number is n + 1 (ours), and the page says so. An exposed pad on the top or back face gets no footprint pad.
- With only an outline, derive pads by an IPC-style rule, say so on the page, and keep the rule in `data.mjs` comments. With positions but no hole size, derive drill from the largest lead diagonal plus about 0.17 mm and the pad from a 0.35 mm ring, and check the gap to high-voltage pins.

### Symbol conventions

- Body 10.16 mm square by default (`half` or `body` sets another size, in multiples of 2.54); pins 2.54 long on the 2.54 grid via explicit `pos`; names inside the body.
- Supply on top, grounds on the bottom, inputs left, outputs right. Keep long names off facing sides.
- Pin types are our reading: `power_in` for supply and ground, `power_out` for an on-chip regulator output, `input`, `output`, `bidirectional`, `open_collector` for open-drain, `passive` for switch nodes, motor outputs, sense pins, no-connects and non-supply exposed pads. Overbars (`~{NAME}`) only where the datasheet says active low.
- Footprint property `circuitdessert:<package file>`, or empty with `fpFilter` when the part has no package entry.
- A part whose packages number the pins differently gets one symbol per package in one file, named `<PART>_<package name>`, Value = the part name. Use `packages` with per-pin `numbers` from the start, even when only one package is done, so the file and symbol names don't change later. A pin position that doesn't exist on a package gets no pin. Check that each symbol's pin numbers equal its footprint's pad numbers.
- Say on the part page which version uses which symbol, and when a package page lists the part as "Assumed", say why.

### Checking

Read pad dimensions from the page rendered at 200 dpi. For vector figures convert with `pdftocairo -svg -f N -l N` and read the path coordinates (filter by stroke colour; use printed dimensions for rounded ends; the page transform flips y). Parse the generated files with an independent s-expression parser and assert that pin number/name pairs equal the datasheet pin table, and the pad count, size, pitch and row spacing. Render the footprint and the illustration and look at them. Without `kicad-cli`, label files "not yet opened in KiCad".

### Third-party vendor libraries

Never commit SamacSys, Ultra Librarian, SnapEDA or similar files. Their licences forbid passing the models on. Generate ours from the datasheet and use theirs only to cross-check, saying so on the package page. Vendor libraries have had real errors (mirrored footprints, wrong row spacing, a plated pad at a missing pin).

## Microcontroller (ESP32-S3) sections

- A part with a serial bus and 3.3 V logic can carry a "Talk to it from an ESP32-S3" section. The guide is `src/content/docs/contribute/arduino.md` (`site:contribute/arduino/`); the skeleton is in `_template/_part.md`. 3.3 V boards only.
- Parts with no bus, or whose datasheet gives no protocol, get none.
- For a part with no register addresses, block 2 maps `r`/`w` onto pseudo-registers and adds commands via `busCommand()`; block 3 is pasted unchanged; the sketch stitched on the page must be byte-identical to the compiled file. Fill the config block from the datasheet; say "can't be checked from the datasheet" for levels it omits. Wiring drawings are `<part>-esp32s3-<bus>-wiring.svg`.
- Check sketches by compiling for ESP32-S3 with warnings on, and logic-test them on a PC with mock `Arduino.h`/`SPI.h`/`Wire.h` and a device model, using mutants that must fail. Label sketches "not run on hardware" unless they were.
