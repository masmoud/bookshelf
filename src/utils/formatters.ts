export function formatPublicationYear(year?: number): string {
  return year ? String(year) : 'Unknown publication year';
}

export function formatAuthors(authors?: string[]): string {
  if (!authors || authors.length === 0) {
    return 'Unknown author';
  }

  if (authors.length === 1) {
    return authors[0];
  }

  return authors.join(', ');
}

export function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}]/gu, '');
}
