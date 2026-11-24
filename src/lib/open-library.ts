import type {
  Book,
  BookDetailsData,
  OpenLibraryAuthorResponse,
  OpenLibrarySearchResponse,
  OpenLibraryWorkResponse
} from '@/types/book';

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
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  return fetchBooks({
    q: trimmedQuery,
    limit: String(limit)
  });
}

/**
 * Get detailed information about a book.
 */
export async function getBookById(id: string): Promise<BookDetailsData> {
  const response = await fetch(
    `${API_URL}/works/${encodeURIComponent(id)}.json`
  );

  if (!response.ok) {
    throw new Error('Unable to fetch book details.');
  }

  const data: OpenLibraryWorkResponse = await response.json();

  // Fetch author names.
  const authors = await Promise.all(
    (data.authors ?? []).map(async ({ author }) => {
      try {
        const authorResponse = await fetch(`${API_URL}${author.key}.json`);

        if (!authorResponse.ok) {
          return null;
        }

        const authorData: OpenLibraryAuthorResponse =
          await authorResponse.json();

        return authorData.name ?? null;
      } catch {
        return null;
      }
    })
  );

  const description =
    typeof data.description === 'string'
      ? data.description
      : data.description?.value;

  const publicationYear = data.first_publish_date
    ? Number(data.first_publish_date.match(/\d{4}/)?.[0])
    : undefined;

  return {
    key: data.key,
    title: data.title,
    author_name: authors.filter((author): author is string => author !== null),
    first_publish_year:
      publicationYear && !Number.isNaN(publicationYear)
        ? publicationYear
        : undefined,
    cover_i: data.covers?.[0],
    subject: data.subjects,
    description
  };
}
