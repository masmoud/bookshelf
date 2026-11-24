'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import type { Book } from '@/types/book';
import BookCard from './BookCard';
import { useFavorites } from '@/hooks/useFavorites';
import { createClient } from '@/lib/supabase/client';

type BookListProps = {
  books: Book[];
};

export default function BookList({ books }: BookListProps) {
  const router = useRouter();

  const {
    add,
    remove,
    isFavorite,
    loading: favoritesLoading,
    error
  } = useFavorites();

  const [userId, setUserId] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [savingBookId, setSavingBookId] = useState<string | null>(null);

  // Check authentication status
  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function checkUser() {
      const { data, error } = await supabase.auth.getUser();

      if (active) {
        setUserId(error ? null : (data.user?.id ?? null));
        setCheckingAuth(false);
      }
    }

    void checkUser();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null);
      setCheckingAuth(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // Toggle a book's favorite status
  async function handleToggleFavorite(bookId: string) {
    if (!userId) {
      router.push('/login');
      return;
    }

    setSavingBookId(bookId);

    if (isFavorite(bookId)) {
      await remove(bookId);
    } else {
      await add(bookId);
    }

    setSavingBookId(null);
  }

  return (
    <div>
      {error && (
        <p role="alert" className="mb-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {books.map((book) => {
          const bookId = book.key.split('/').pop() ?? '';

          return (
            <BookCard
              key={book.key}
              book={book}
              favorite={isFavorite(bookId)}
              onToggleFavorite={() => handleToggleFavorite(bookId)}
              disabled={
                checkingAuth || favoritesLoading || savingBookId === bookId
              }
            />
          );
        })}
      </div>
    </div>
  );
}
