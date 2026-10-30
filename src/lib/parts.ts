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

export const CATEGORY_LABELS: Record<string, string> = {
  'buck-converter': 'Buck converter',
  'boost-converter': 'Boost converter',
  'buck-boost-converter': 'Buck-boost converter',
  'battery-charger': 'Battery charger',
  ldo: 'LDO',
  'ac-dc-controller': 'AC-DC controller',
  'gate-driver': 'Gate driver',
  'power-stage': 'Power stage',
  other: 'Other',
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
