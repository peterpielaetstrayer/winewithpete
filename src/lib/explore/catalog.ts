import type { Experience, Format, Intent } from '@/data/explore/experiences';

export type CatalogIntent = Intent | 'all';
export type CatalogFormat = Format | 'all';
export type CatalogOrder = 'curated' | 'az';
export type ExploreQuery = {
  term?: string;
  intent?: CatalogIntent;
  format?: CatalogFormat;
  order?: CatalogOrder;
};

export const PAGE_SIZE = 12;

export function normalizeSearch(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('en').trim().replace(/\s+/g, ' ');
}

export function queryExperiences(items: readonly Experience[], filters: ExploreQuery = {}): Experience[] {
  const words = normalizeSearch(filters.term ?? '').split(' ').filter(Boolean);
  const matches = items.filter(item => {
    if (filters.intent && filters.intent !== 'all' && !item.intents.includes(filters.intent)) return false;
    if (filters.format && filters.format !== 'all' && !item.links.some(link => link.format === filters.format)) return false;
    if (!words.length) return true;
    const text = normalizeSearch([
      item.title, item.eyebrow, item.summary, ...item.tags,
      ...item.links.map(link => link.label), item.minutes === undefined ? '' : String(item.minutes),
    ].join(' '));
    return words.every(word => text.includes(word));
  });
  return matches.sort((a, b) => filters.order === 'az'
    ? a.title.localeCompare(b.title, 'en', { sensitivity: 'base' }) || a.id.localeCompare(b.id)
    : a.rank - b.rank || a.title.localeCompare(b.title));
}

export function visiblePage(results: readonly Experience[], count: number): Experience[] {
  return results.slice(0, Math.max(1, count) * PAGE_SIZE);
}

export function validateCatalog(items: readonly Experience[]): string[] {
  const problems: string[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.id)) problems.push('Duplicate experience id: ' + item.id);
    seen.add(item.id);
    if (!item.title.trim()) problems.push('Missing title: ' + item.id);
    if (!item.primaryHref.startsWith('/')) problems.push('Nonlocal primary destination: ' + item.id);
    if (!item.links.some(link => link.href === item.primaryHref)) problems.push('Primary route missing from formats: ' + item.id);
    if (!item.links.length) problems.push('Experience has no readable format: ' + item.id);
    const linked = new Set<string>();
    for (const link of item.links) {
      if (!link.href.startsWith('/')) problems.push('Unapproved external or private link: ' + item.id);
      if (linked.has(link.href)) problems.push('Duplicate resource link: ' + item.id + ' / ' + link.href);
      linked.add(link.href);
    }
  }
  return problems;
}
