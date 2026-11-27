'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  addFavorite,
  getFavorites,
  removeFavorite,
  type Favorite
} from '@/lib/supabase/favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestId = useRef(0);

  // Fetch the authenticated user's favorites
  const fetchFavorites = useCallback(async () => {
    const currentRequestId = ++requestId.current;

    setLoading(true);
    setError(null);

    try {
      const data = await getFavorites();

      if (currentRequestId === requestId.current) {
        setFavorites(data);
      }
    } catch (err) {
      if (currentRequestId === requestId.current) {
        setError(
          err instanceof Error ? err.message : 'Unable to fetch favorites.'
        );
      }
    } finally {
      if (currentRequestId === requestId.current) {
        setLoading(false);
      }
    }
  }, []);

  // Fetch favorites when the hook is first mounted
  useEffect(() => {
    let active = true;
    const currentRequestId = ++requestId.current;

    async function loadFavorites() {
      try {
        const data = await getFavorites();

        if (active && currentRequestId === requestId.current) {
          setFavorites(data);
          setError(null);
        }
      } catch (err) {
        if (active && currentRequestId === requestId.current) {
          setError(
            err instanceof Error ? err.message : 'Unable to fetch favorites.'
          );
        }
      } finally {
        if (active && currentRequestId === requestId.current) {
          setLoading(false);
        }
      }
    }

    void loadFavorites();

    return () => {
      active = false;
      requestId.current += 1;
    };
  }, []);

  // Add a book to favorites
  const add = useCallback(async (bookId: string): Promise<boolean> => {
    requestId.current += 1;
    setError(null);

    try {
      const favorite = await addFavorite(bookId);

      requestId.current += 1;

      setFavorites((current) => {
        if (current.some((item) => item.book_id === bookId)) {
          return current;
        }

        return [favorite, ...current];
      });

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to add favorite.');

      return false;
    }
  }, []);

  // Remove a book from favorites
  const remove = useCallback(async (bookId: string): Promise<boolean> => {
    requestId.current += 1;
    setError(null);

    try {
      await removeFavorite(bookId);

      requestId.current += 1;

      setFavorites((current) =>
        current.filter((favorite) => favorite.book_id !== bookId)
      );

      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to remove favorite.'
      );

      return false;
    }
  }, []);

  // Check whether a book is already a favorite
  const isFavorite = useCallback(
    (bookId: string) =>
      favorites.some((favorite) => favorite.book_id === bookId),
    [favorites]
  );

  return {
    favorites,
    loading,
    error,
    add,
    remove,
    isFavorite,
    refresh: fetchFavorites
  };
}
