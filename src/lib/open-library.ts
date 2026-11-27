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

function getPublicationYear(date?: string): number | undefined {
  const match = date?.match(/\d{4}/);

  return match ? Number(match[0]) : undefined;
}

function normalizeAuthorName(name: string): string {
  return name.toLowerCase().replace(/[.,]/g, '').replace(/\s+/g, ' ').trim();
}

function validatePagination(limit: number, offset: number) {
  if (
    !Number.isInteger(limit) ||
    !Number.isInteger(offset) ||
    limit <= 0 ||
    offset < 0
  ) {
    throw new Error('Invalid pagination parameters.');
  }
}

type BookSearchResult = {
  books: Book[];
  total: number;
};

/**
 * Fetch books from Open Library.
 */
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
  validatePagination(limit, offset);

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
  validatePagination(limit, offset);

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
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return null;

  const searchParams = new URLSearchParams({ q: trimmedQuery });

  validatePagination(limit, offset);

  const response = await fetch(
    `${API_URL}/search/authors.json?${searchParams.toString()}`
  );

  if (!response.ok) {
    throw new Error('Unable to search for author.');
  }

  const data: OpenLibraryAuthorSearchResponse = await response.json();

  const normalizedQuery = normalizeAuthorName(trimmedQuery);

  const author = data.docs.find(
    (item) => item.name && normalizeAuthorName(item.name) === normalizedQuery
  );

  if (!author) return null;

  const authorName = author?.name;
  if (!authorName) return null;

  const worksParams = new URLSearchParams({
    limit: String(limit),
    offset: String(offset)
  });

  const worksResponse = await fetch(
    `${API_URL}/authors/${author.key}/works.json?${worksParams.toString()}`
  );

  if (!worksResponse.ok) {
    throw new Error("Unable to fetch author's books.");
  }

  const worksData: OpenLibraryAuthorWorksResponse = await worksResponse.json();

  const books: Book[] = worksData.entries.map((work) => ({
    key: work.key,
    title: work.title,
    author_name: [authorName],
    first_publish_year: getPublicationYear(work.first_publish_date),
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

  const publicationYear = getPublicationYear(data.first_publish_date);

  return {
    key: data.key,
    title: data.title,
    author_name: authors.filter((author): author is string => author !== null),
    first_publish_year: publicationYear,
    cover_i: data.covers?.[0],
    subject: data.subjects,
    description
  };
}
