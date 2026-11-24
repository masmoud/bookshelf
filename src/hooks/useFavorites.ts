'use client';

import { useCallback, useEffect, useState } from 'react';

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

  // Fetch the authenticated user's favorites
  const fetchFavorites = useCallback(async () => {
    setError(null);

    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to fetch favorites.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch favorites when the hook is first mounted
  useEffect(() => {
    let ignore = false;

    async function loadFavorites() {
      try {
        const data = await getFavorites();

        if (!ignore) {
          setFavorites(data);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err instanceof Error ? err.message : 'Unable to fetch favorites.'
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void loadFavorites();

    return () => {
      ignore = true;
    };
  }, []);

  // Add a book to favorites
  const add = useCallback(async (bookId: string): Promise<boolean> => {
    setError(null);

    try {
      const favorite = await addFavorite(bookId);

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
    setError(null);

    try {
      await removeFavorite(bookId);

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
