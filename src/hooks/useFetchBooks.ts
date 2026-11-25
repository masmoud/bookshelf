'use client';

import { useCallback, useEffect, useState } from 'react';

import type { Book } from '@/types/book';
import { getPopularBooks } from '@/lib/open-library';
import { BOOKS_PAGE_SIZE } from '@/constants/book';

export function useFetchBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [offset, setOffset] = useState(0);

  const hasMore = offset < total;

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    setRetryCount((count) => count + 1);
  }, []);

  useEffect(() => {
    let ignore = false;

    async function fetchBooks() {
      try {
        const data = await getPopularBooks(BOOKS_PAGE_SIZE, 0);

        if (!ignore) {
          setBooks(data.books);
          setTotal(data.total);
          setOffset(data.books.length);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'An error occurred.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchBooks();

    return () => {
      ignore = true;
    };
  }, [retryCount]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    setError(null);

    try {
      const data = await getPopularBooks(BOOKS_PAGE_SIZE, offset);

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
  }, [offset, loadingMore, hasMore]);

  return {
    books,
    total,
    loading,
    loadingMore,
    error,
    hasMore,
    retry,
    loadMore
  };
}
