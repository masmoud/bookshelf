import type {
  Book,
  BookDetailsData,
  OpenLibraryAuthorResponse,
  OpenLibraryAuthorSearchResponse,
  OpenLibraryAuthorWorksResponse,
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

type BookSearchResult = {
  books: Book[];
  total: number;
};

async function fetchBooks(
  params: Record<string, string>
): Promise<BookSearchResult> {
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

  return { books: data.docs, total: data.numFound };
}

/**
 * Get a selection of popular books.
 */
export async function getPopularBooks(
  limit = 12,
  offset = 0
): Promise<BookSearchResult> {
  return fetchBooks({
    q: 'bestseller',
    limit: String(limit),
    offset: String(offset)
  });
}

/**
 * Search books by title or author.
 */
export async function searchBooks(
  query: string,
  limit = 12,
  offset = 0
): Promise<BookSearchResult> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return { books: [], total: 0 };
  }

  return fetchBooks({
    q: trimmedQuery,
    limit: String(limit),
    offset: String(offset)
  });
}

/**
 * Search books by author.
 */
export async function searchBooksByAuthor(
  query: string,
  limit = 12,
  offset = 0
): Promise<BookSearchResult | null> {
  const searchParams = new URLSearchParams({ q: query });

  const response = await fetch(
    `${API_URL}/search/authors.json?${searchParams.toString()}`
  );

  if (!response.ok) {
    throw new Error('Unable to search for author.');
  }

  const data: OpenLibraryAuthorSearchResponse = await response.json();

  const normalizedQuery = query
    .toLowerCase()
    .replace(/[.,]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const author = data.docs.find(
    (item) =>
      item.name
        .toLowerCase()
        .replace(/[.,]/g, '')
        .replace(/\s+/g, ' ')
        .trim() === normalizedQuery
  );

  if (!author) return null;

  const worksParams = new URLSearchParams({
    limit: String(limit),
    offset: String(offset)
  });

  const worksResponse = await fetch(
    `${API_URL}${`/authors/${author.key}/works.json`}?${worksParams.toString()}`
  );

  if (!worksResponse.ok) {
    throw new Error("Unable to fetch author's books.");
  }

  const worksData: OpenLibraryAuthorWorksResponse = await worksResponse.json();

  const books: Book[] = worksData.entries.map((work) => ({
    key: work.key,
    title: work.title,
    author_name: [author.name],
    first_publish_year: work.first_publish_date
      ? Number.parseInt(work.first_publish_date.slice(-4), 10)
      : undefined,
    cover_i: work.covers?.[0],
    subject: work.subjects
  }));

  return {
    books,
    total: worksData.size
  };
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
