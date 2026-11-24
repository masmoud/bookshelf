'use client';

import { useCallback, useEffect, useState } from 'react';

import { getBookById } from '@/lib/open-library';
import type { BookDetailsData } from '@/types/book';

type BookDetailsResult = {
  requestKey: string;
  book?: BookDetailsData;
  error?: string;
};

export function useBookDetails(id: string) {
  const [result, setResult] = useState<BookDetailsResult | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const requestKey = `${id}-${retryCount}`;

  const retry = useCallback(() => {
    setRetryCount((count) => count + 1);
  }, []);

  useEffect(() => {
    let ignore = false;

    async function fetchBookDetails() {
      try {
        const data = await getBookById(id);

        if (!ignore) {
          setResult({
            requestKey,
            book: data
          });
        }
      } catch (err) {
        if (!ignore) {
          setResult({
            requestKey,
            error:
              err instanceof Error
                ? err.message
                : 'Unable to fetch book details.'
          });
        }
      }
    }

    fetchBookDetails();

    return () => {
      ignore = true;
    };
  }, [id, requestKey]);

  const isCurrentResult = result?.requestKey === requestKey;

  return {
    book: isCurrentResult ? (result.book ?? null) : null,
    loading: !isCurrentResult,
    error: isCurrentResult ? (result.error ?? null) : null,
    retry
  };
}
