'use client';

import { useCallback, useEffect, useState } from 'react';

import type { Book } from '@/types/book';
import { getPopularBooks } from '@/lib/open-library';

export function useFetchBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    setRetryCount((count) => count + 1);
  }, []);

  useEffect(() => {
    let ignore = false;

    async function fetchBooks() {
      try {
        const data = await getPopularBooks();

        if (!ignore) {
          setBooks(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err instanceof Error ? err.message : 'An error occurred.'
          );
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

  return {
    books,
    loading,
    error,
    retry
  };
}
