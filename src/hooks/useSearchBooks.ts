'use client';

import { useCallback, useState } from 'react';

import type { Book } from '@/types/book';
import { searchBooks } from '@/lib/open-library';

export function useSearchBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const search = useCallback(async (query: string) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const results = await searchBooks(trimmedQuery);

      setBooks(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to fetch books.');

      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetSearch = useCallback(() => {
    setBooks([]);
    setError(null);
    setHasSearched(false);
    setLoading(false);
  }, []);

  return {
    books,
    loading,
    error,
    hasSearched,
    search,
    resetSearch
  };
}
