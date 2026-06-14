/**
 * Returns the localized version of a field on an item.
 * Falls back to the original (Arabic) value when the translation isn't available yet.
 *
 * Example:  localize(project, 'title', 'fr')  → project.titleFr || project.title
 */
export function localize(item, field, lang) {
  if (!item) return '';
  if (lang === 'ar') return item[field] ?? '';
  const key = lang === 'fr' ? `${field}Fr` : `${field}En`;
  return item[key] || item[field] || '';
}
