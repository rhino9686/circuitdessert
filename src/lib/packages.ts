import { getCollection, type CollectionEntry } from 'astro:content';
import { url } from './url';
import type { Part } from './parts';

export type Pkg = CollectionEntry<'packages'>;

/** "QFN3×3-16", "qfn3x3-16" and "QFN-3x3-16" all become "qfn3x316", so spellings of one package match. */
export const normalizePackage = (s: string) => s.toLowerCase().replace(/×/g, 'x').replace(/[^a-z0-9]+/g, '');

export const packageUrl = (id: string) => url(`packages/${id}/`);
export const footprintUrl = (file: string) => url(`kicad/footprints/circuitdessert.pretty/${file}`);
export const symbolUrl = (file: string) => url(`kicad/symbols/${file}`);

const names = (p: Pkg) => [p.data.name, ...p.data.aliases].map(normalizePackage);

export async function getPackages(): Promise<Pkg[]> {
  return (await getCollection('packages')).sort((a, b) => a.data.name.localeCompare(b.data.name));
}

/** The package page for a package name as written in a part's `packages:` list, if there is one. */
export function findPackage(all: Pkg[], name: string): Pkg | undefined {
  const key = normalizePackage(name);
  return all.find((p) => names(p).includes(key));
}

/** Parts that list this package. */
export async function partsUsing(pkg: Pkg): Promise<Part[]> {
  const mine = names(pkg);
  const parts = await getCollection('parts');
  return parts
    .filter((p) => p.data.packages.some((n) => mine.includes(normalizePackage(n))))
    .sort((a, b) => a.data.manufacturer.localeCompare(b.data.manufacturer) || a.data.part.localeCompare(b.data.part));
}
