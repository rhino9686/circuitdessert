import { getCollection, type CollectionEntry } from 'astro:content';
import { slugify, url } from './url';

export type Part = CollectionEntry<'parts'>;

export function familyKey(p: Part['data']): string {
  return `${slugify(p.manufacturer)}/${slugify(p.family)}`;
}

/** Path of a part's own page, relative to /parts/. */
export function partPath(p: Part['data']): string {
  return `${slugify(p.manufacturer)}/${slugify(p.part)}`;
}
export const partUrl = (p: Part['data']) => url(`parts/${partPath(p)}/`);
export const familyUrl = (key: string) => url(`parts/${key}/`);

export async function getFamilies() {
  const parts = await getCollection('parts');
  const families = new Map<string, { key: string; manufacturer: string; family: string; parts: Part[] }>();
  for (const p of parts) {
    const key = familyKey(p.data);
    if (!families.has(key)) families.set(key, { key, manufacturer: p.data.manufacturer, family: p.data.family, parts: [] });
    families.get(key)!.parts.push(p);
  }
  for (const f of families.values()) f.parts.sort((a, b) => a.data.part.localeCompare(b.data.part));
  return [...families.values()].sort((a, b) => a.manufacturer.localeCompare(b.manufacturer) || a.family.localeCompare(b.family));
}

/** Map of lowercase part number -> page URL, for linking recipes to part pages. */
export async function getPartLinks(): Promise<Map<string, string>> {
  const parts = await getCollection('parts');
  return new Map(parts.map((p) => [p.data.part.toLowerCase(), partUrl(p.data)]));
}

/**
 * Part categories, in the order the Parts page lists them. To add one: add it here, add its key to the
 * `category` enum in src/content.config.ts, and use it in a part's frontmatter. `group` only matters once
 * parts span more than one group: then the Parts page adds a heading per group.
 */
export interface CategoryInfo { label: string; plural: string; group: string }
export const CATEGORIES: Record<string, CategoryInfo> = {
  'buck-converter': { label: 'Buck converter', plural: 'Buck converters', group: 'Power' },
  'boost-converter': { label: 'Boost converter', plural: 'Boost converters', group: 'Power' },
  'buck-boost-converter': { label: 'Buck-boost converter', plural: 'Buck-boost converters', group: 'Power' },
  ldo: { label: 'LDO', plural: 'Linear regulators (LDO)', group: 'Power' },
  'voltage-reference': { label: 'Voltage reference', plural: 'Voltage references', group: 'Power' },
  'battery-charger': { label: 'Battery charger', plural: 'Battery chargers', group: 'Power' },
  'ac-dc-controller': { label: 'AC-DC controller', plural: 'AC-DC controllers', group: 'Power' },
  'gate-driver': { label: 'Gate driver', plural: 'Gate drivers', group: 'Power' },
  'motor-driver': { label: 'Motor driver', plural: 'Motor drivers', group: 'Power' },
  'led-driver': { label: 'LED driver', plural: 'LED drivers', group: 'Power' },
  amplifier: { label: 'Amplifier', plural: 'Amplifiers', group: 'Signal Chain' },
  'data-converter': { label: 'Data converter', plural: 'Data converters', group: 'Signal Chain' },
  processor: { label: 'Processor', plural: 'Processors', group: 'Digital' },
  other: { label: 'Other', plural: 'Other parts', group: 'Other' },
};
export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORIES).map(([k, v]) => [k, v.label]),
);
/** Where a category sits on the Parts page. */
export const categoryUrl = (key: string) => url(`parts/#${key}`);

/** Parts grouped by category, in CATEGORIES order. Inside a category: by maker, family, then part number. */
export async function getByCategory() {
  const parts = await getCollection('parts');
  const order = Object.keys(CATEGORIES);
  const byKey = new Map<string, Part[]>();
  for (const p of parts) {
    if (!byKey.has(p.data.category)) byKey.set(p.data.category, []);
    byKey.get(p.data.category)!.push(p);
  }
  return [...byKey.entries()]
    .sort(([a], [b]) => order.indexOf(a) - order.indexOf(b))
    .map(([key, list]) => ({
      key,
      ...CATEGORIES[key],
      parts: list.sort(
        (a, b) =>
          a.data.manufacturer.localeCompare(b.data.manufacturer) ||
          a.data.family.localeCompare(b.data.family) ||
          a.data.part.localeCompare(b.data.part),
      ),
    }));
}

/** Count of parts per family, to tell single parts from families. */
export const familySizes = (parts: Part[]) => {
  const n = new Map<string, number>();
  for (const p of parts) n.set(familyKey(p.data), (n.get(familyKey(p.data)) ?? 0) + 1);
  return n;
};

export function range(min?: number, max?: number, unit = ''): string {
  if (min == null && max == null) return '–';
  if (min != null && max != null && min !== max) return `${min}–${max}${unit}`;
  return `${max ?? min}${unit}`;
}

/** "500" -> "500 kHz", "1500" -> "1.5 MHz", "200-500" -> "200–500 kHz". */
export function formatFreq(v?: string): string | undefined {
  if (!v) return undefined;
  const nums = v.split('-').map((s) => Number(s.trim()));
  if (nums.some(Number.isNaN)) return v;
  const mhz = nums.every((n) => n >= 1000);
  return (mhz ? nums.map((n) => n / 1000) : nums).join('–') + (mhz ? ' MHz' : ' kHz');
}

/** "QFN2x3-14" -> "QFN2×3-14" for display. */
export const formatPackage = (s: string) => s.replace(/(\d)x(\d)/g, '$1×$2');
