import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

const httpsUrl = z.url().refine((u) => u.startsWith('https://') || u.startsWith('http://'), {
  message: 'Must be an http(s) URL',
});

/**
 * PARTS: one Markdown file per part at
 *   src/content/parts/<manufacturer>/<family>/<part>.md
 * The site renders one page per family, with a variants table built from these files.
 * Frontmatter holds facts (checked against the datasheet); the body is hand-written prose.
 * Files and folders starting with "_" are ignored by the build (templates live there).
 */
const parts = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/parts' }),
  schema: z.object({
    manufacturer: z.string(),
    family: z.string(),
    part: z.string(),
    category: z.enum([
      'buck-converter',
      'boost-converter',
      'buck-boost-converter',
      'battery-charger',
      'ldo',
      'ac-dc-controller',
      'gate-driver',
      'power-stage',
      'other',
    ]),
    summary: z.string().max(200),
    status: z.enum(['active', 'nrnd', 'obsolete', 'unknown']).default('unknown'),
    packages: z.array(z.string()).min(1),
    // Common power-IC specs. All optional; omit what doesn't apply.
    specs: z
      .object({
        vin_min_v: z.number().optional(),
        vin_max_v: z.number().optional(),
        vout_min_v: z.number().optional(),
        vout_max_v: z.number().optional(),
        iout_max_a: z.number().optional(),
        fsw_khz: z.string().optional(), // e.g. "500" or "200-2200"
        iq_ua: z.number().optional(),
        topology: z.string().optional(),
        // Anything category-specific that doesn't have its own field.
        extra: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
      })
      .default({ extra: [] }),
    // A short paragraph under the title (like an application note's abstract). Plain text.
    abstract: z.string().optional(),
    // Headline features from the datasheet, in your own words.
    features: z.array(z.string()).default([]),
    // Specifications grouped into titled tables, e.g. "Switching and power stage".
    spec_groups: z
      .array(z.object({ title: z.string(), items: z.array(z.object({ label: z.string(), value: z.string() })) }))
      .default([]),
    // Recommended component values and other lookup tables from the datasheet.
    design_tables: z
      .array(
        z.object({
          title: z.string(),
          note: z.string().optional(),
          columns: z.array(z.string()),
          rows: z.array(z.array(z.string())),
        }),
      )
      .default([]),
    // Which datasheet revision the specs were checked against, e.g. "Rev 1.0 (June 2025)".
    datasheet_revision: z.string().optional(),
    datasheet: httpsUrl,
    lcsc: z.string().regex(/^C\d+$/, 'LCSC part numbers look like C123456').optional(),
    // `verified` means every spec above was checked against the datasheet linked above.
    verified: z.boolean().default(false),
    // `draft` marks prose that still needs a human rewrite.
    draft: z.boolean().default(true),
    tags: z.array(z.string()).default([]),
  }),
});

/** RECIPES: reference designs and tutorials, mostly prose. src/content/recipes/<id>.md */
const recipes = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/recipes' }),
  schema: z.object({
    title: z.string(),
    design_id: z.string().optional(), // manufacturer's ID, e.g. SY21219-DS
    manufacturer: z.string().optional(),
    kind: z.enum(['reference-design', 'tutorial']).default('reference-design'),
    category: z.string(), // free text for now, e.g. "Power / DC-DC"
    summary: z.string().max(300),
    // Longer intro shown under the title (plain text). Falls back to the summary.
    abstract: z.string().optional(),
    source: httpsUrl.optional(),
    // Which revision of the source document the numbers were checked against, e.g. "Rev 1.0 (May 2026)".
    source_revision: z.string().optional(),
    // `draft` marks prose that still needs a human rewrite or a build to confirm it.
    draft: z.boolean().default(false),
    stats: z.array(z.object({ value: z.string(), label: z.string() })).max(4).default([]),
    // Components, shown as the bill of materials. If a matching part page exists, it is linked automatically.
    //   ref:   reference designator on the schematic (CIN1, RH, L, ...)
    //   part:  manufacturer part number, or the value for a generic part ("100 kΩ, 1%, 0603")
    //   maker: manufacturer name, when `part` is a manufacturer part number
    components: z
      .array(
        z.object({
          ref: z.string().optional(),
          part: z.string(),
          description: z.string(),
          maker: z.string().optional(),
        }),
      )
      .default([]),
    // Reference circuit: filename of a schematic drawing in src/assets/recipes/ (see scripts/schematics/).
    schematic: z.string().optional(),
    schematic_caption: z.string().optional(),
    // Credit: who made the design (a person, or a manufacturer for published reference designs).
    author: z.string().optional(),
    // License of the design files the author shares (CERN-OHL, TAPR, MIT, CC BY, ...). The write-up itself is CC BY 4.0.
    license: z.string().optional(),
    // Filename of an illustration in src/assets/recipes/ (optional).
    hero: z.string().optional(),
    hero_caption: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

const docs = defineCollection({ loader: docsLoader(), schema: docsSchema() });
const i18n = defineCollection({ loader: i18nLoader(), schema: i18nSchema() });

export const collections = { docs, i18n, parts, recipes };
