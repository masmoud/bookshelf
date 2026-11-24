'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { useFavorites } from '@/hooks/useFavorites';
import { getBookById } from '@/lib/open-library';
import BookCard from '@/components/books/BookCard';
import type { Book } from '@/types/book';

export default function FavoritesPage() {
  const {
    favorites,
    loading: favoritesLoading,
    error: favoritesError,
    remove,
    isFavorite
  } = useFavorites();

  const [books, setBooks] = useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [booksError, setBooksError] = useState<string | null>(null);
  const [removingBookId, setRemovingBookId] = useState<string | null>(null);

  // Fetch book details from Open Library
  useEffect(() => {
    if (favoritesLoading) return;

    let ignore = false;

    async function loadFavoriteBooks() {
      try {
        const results = await Promise.all(
          favorites.map((favorite) => getBookById(favorite.book_id))
        );

        if (!ignore) {
          setBooks(results);
          setBooksError(null);
        }
      } catch {
        if (!ignore) {
          setBooksError('Unable to load your favorite books.');
        }
      } finally {
        if (!ignore) {
          setBooksLoading(false);
        }
      }
    }

    void loadFavoriteBooks();

    return () => {
      ignore = true;
    };
  }, [favorites, favoritesLoading]);

  async function handleRemove(bookId: string) {
    setRemovingBookId(bookId);

    const success = await remove(bookId);

    if (success) {
      setBooks((current) =>
        current.filter((book) => book.key.split('/').pop() !== bookId)
      );
    }

    setRemovingBookId(null);
  }

  if (favoritesLoading || booksLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-slate-500">Loading your favorites...</p>
      </main>
    );
  }

  if (favoritesError || booksError) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <p role="alert" className="text-red-600">
          {favoritesError ?? booksError}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Favorites</h1>
        <p className="mt-2 text-slate-500">
          Your personal collection of saved books.
        </p>
      </div>

      {books.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center">
          <p className="text-lg font-medium text-slate-700">
            You haven&apos;t saved any books yet.
          </p>

          <Link
            href="/"
            className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
          >
            Discover books
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {books.map((book) => {
            const bookId = book.key.split('/').pop() ?? '';

            return (
              <BookCard
                key={book.key}
                book={book}
                favorite={isFavorite(bookId)}
                onToggleFavorite={() => handleRemove(bookId)}
                disabled={removingBookId === bookId}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}
