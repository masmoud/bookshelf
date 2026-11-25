'use client';

import { useCallback, useState } from 'react';

import { BOOKS_PAGE_SIZE } from '@/constants/book';
import { searchBooks, searchBooksByAuthor } from '@/lib/open-library';
import type { Book } from '@/types/book';

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

  const hasMore = offset < total;

  const search = useCallback(async (query: string) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) return;

    const isAuthorSearch = /^author:\s*/i.test(trimmedQuery);
    const searchTerm = isAuthorSearch
      ? trimmedQuery.replace(/^author:\s*/i, '').trim()
      : trimmedQuery;

    if (!searchTerm) return;

    setLoading(true);
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

      if (!authorResults && isAuthorSearch) {
        setSearchMode('books');
      }

      setBooks(data.books);
      setTotal(data.total);
      setOffset(data.books.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to fetch books.');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore || loading || !hasMore || !currentQuery) return;

    setLoadingMore(true);
    setError(null);

    try {
      const data =
        searchMode === 'author'
          ? await searchBooksByAuthor(currentQuery, BOOKS_PAGE_SIZE, offset)
          : await searchBooks(currentQuery, BOOKS_PAGE_SIZE, offset);

      if (!data) return;

      setBooks((current) => [...current, ...data.books]);
      setTotal(data.total);
      setOffset((current) => current + data.books.length);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to load more books.'
      );
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, loading, hasMore, currentQuery, offset, searchMode]);

  const resetSearch = useCallback(() => {
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
