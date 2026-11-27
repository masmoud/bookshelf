'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { Book } from '@/types/book';
import { getPopularBooks } from '@/lib/open-library';
import { BOOKS_PAGE_SIZE } from '@/constants/book';

function removeDuplicateBooks(books: Book[]): Book[] {
  const seen = new Set<string>();

  return books.filter((book) => {
    if (seen.has(book.key)) return false;
    seen.add(book.key);
    return true;
  });
}

export function useFetchBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [offset, setOffset] = useState(0);

  const requestId = useRef(0);

  const hasMore = offset < total;

  const retry = useCallback(() => {
    requestId.current += 1;
    setLoading(true);
    setLoadingMore(false);
    setError(null);
    setRetryCount((count) => count + 1);
  }, []);

  useEffect(() => {
    const currentRequestId = ++requestId.current;

    async function fetchBooks() {
      try {
        const data = await getPopularBooks(BOOKS_PAGE_SIZE, 0);

        if (currentRequestId !== requestId.current) return;

        setBooks(removeDuplicateBooks(data.books));
        setTotal(data.total);
        setOffset(data.books.length);
      } catch (err) {
        if (currentRequestId !== requestId.current) return;

        setError(err instanceof Error ? err.message : 'An error occurred.');
      } finally {
        if (currentRequestId === requestId.current) {
          setLoading(false);
        }
      }
    }

    void fetchBooks();

    return () => {
      if (currentRequestId === requestId.current) {
        requestId.current += 1;
      }
    };
  }, [retryCount]);

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return;

    const currentRequestId = requestId.current;

    setLoadingMore(true);
    setError(null);

    try {
      const data = await getPopularBooks(BOOKS_PAGE_SIZE, offset);

      if (currentRequestId !== requestId.current) return;

      setBooks((current) => removeDuplicateBooks([...current, ...data.books]));
      setTotal(data.total);
      setOffset((current) => current + data.books.length);
    } catch (err) {
      if (currentRequestId !== requestId.current) return;

      setError(
        err instanceof Error ? err.message : 'Unable to load more books.'
      );
    } finally {
      if (currentRequestId === requestId.current) {
        setLoadingMore(false);
      }
    }
  }, [offset, loading, loadingMore, hasMore]);

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
