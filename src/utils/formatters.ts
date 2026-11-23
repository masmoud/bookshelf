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
