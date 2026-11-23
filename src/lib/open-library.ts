import type { Book, OpenLibrarySearchResponse } from '@/types/book';

const API_URL = 'https://openlibrary.org';

const BOOK_FIELDS = [
  'key',
  'title',
  'author_name',
  'first_publish_year',
  'cover_i',
  'edition_count',
  'subject'
].join(',');

/**
 * Fetch books from Open Library.
 */
async function fetchBooks(params: Record<string, string>): Promise<Book[]> {
  const searchParams = new URLSearchParams({
    ...params,
    fields: BOOK_FIELDS
  });

  const response = await fetch(
    `${API_URL}/search.json?${searchParams.toString()}`
  );

  if (!response.ok) {
    throw new Error('Unable to fetch books.');
  }

  const data: OpenLibrarySearchResponse = await response.json();

  return data.docs;
}

/**
 * Get a selection of popular books.
 */
export async function getPopularBooks(limit = 12): Promise<Book[]> {
  return fetchBooks({
    q: 'bestseller',
    limit: String(limit)
  });
}

/**
 * Search books by title or author.
 */
export async function searchBooks(query: string, limit = 12): Promise<Book[]> {
  if (!query.trim()) {
    return [];
  }

  return fetchBooks({
    q: query.trim(),
    limit: String(limit)
  });
}
