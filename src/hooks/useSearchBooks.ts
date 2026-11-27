'use client';

import { useCallback, useRef, useState } from 'react';

import { BOOKS_PAGE_SIZE } from '@/constants/book';
import { searchBooks, searchBooksByAuthor } from '@/lib/open-library';
import type { Book } from '@/types/book';

function removeDuplicateBooks(books: Book[]): Book[] {
  const seen = new Set<string>();

  return books.filter((book) => {
    if (seen.has(book.key)) return false;

    seen.add(book.key);
    return true;
  });
}

export function useSearchBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [offset, setOffset] = useState(0);
  const [currentQuery, setCurrentQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'author' | 'books'>('books');

  const searchId = useRef(0);

  const hasMore = offset < total;

  const search = useCallback(async (query: string) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) return;

    const isAuthorSearch = /^author:\s*/i.test(trimmedQuery);
    const searchTerm = isAuthorSearch
      ? trimmedQuery.replace(/^author:\s*/i, '').trim()
      : trimmedQuery;

    if (!searchTerm) return;

    const currentSearchId = ++searchId.current;

    setLoading(true);
    setLoadingMore(false);
    setError(null);
    setHasSearched(true);
    setCurrentQuery(searchTerm);
    setOffset(0);
    setTotal(0);
    setBooks([]);
    setSearchMode(isAuthorSearch ? 'author' : 'books');

    try {
      const authorResults = isAuthorSearch
        ? await searchBooksByAuthor(searchTerm, BOOKS_PAGE_SIZE, 0)
        : null;

      const data =
        authorResults ?? (await searchBooks(searchTerm, BOOKS_PAGE_SIZE, 0));

      if (currentSearchId !== searchId.current) return;

      setSearchMode(authorResults ? 'author' : 'books');
      setBooks(removeDuplicateBooks(data.books));
      setTotal(data.total);
      setOffset(data.books.length);
    } catch (err) {
      if (currentSearchId !== searchId.current) return;

      setError(err instanceof Error ? err.message : 'Unable to fetch books.');
      setBooks([]);
    } finally {
      if (currentSearchId === searchId.current) {
        setLoading(false);
      }
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore || loading || !hasMore || !currentQuery) return;

    const currentSearchId = searchId.current;

    setLoadingMore(true);
    setError(null);

    try {
      const data =
        searchMode === 'author'
          ? await searchBooksByAuthor(currentQuery, BOOKS_PAGE_SIZE, offset)
          : await searchBooks(currentQuery, BOOKS_PAGE_SIZE, offset);

      if (currentSearchId !== searchId.current || !data) return;

      setBooks((current) => removeDuplicateBooks([...current, ...data.books]));
      setTotal(data.total);
      setOffset((current) => current + data.books.length);
    } catch (err) {
      if (currentSearchId !== searchId.current) return;

      setError(
        err instanceof Error ? err.message : 'Unable to load more books.'
      );
    } finally {
      if (currentSearchId === searchId.current) {
        setLoadingMore(false);
      }
    }
  }, [loadingMore, loading, hasMore, currentQuery, offset, searchMode]);

  const resetSearch = useCallback(() => {
    searchId.current += 1;

    setBooks([]);
    setTotal(0);
    setError(null);
    setHasSearched(false);
    setLoading(false);
    setLoadingMore(false);
    setOffset(0);
    setCurrentQuery('');
    setSearchMode('books');
  }, []);

  return {
    books,
    total,
    loading,
    loadingMore,
    error,
    hasSearched,
    hasMore,
    search,
    loadMore,
    resetSearch
  };
}
