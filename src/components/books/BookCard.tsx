'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';

import type { Book } from '@/types/book';

type BookCardProps = {
  book: Book;
  favorite: boolean;
  onToggleFavorite: () => void;
  disabled?: boolean;
};

export default function BookCard({
  book,
  favorite,
  onToggleFavorite,
  disabled = false
}: BookCardProps) {
  const bookId = book.key.split('/').filter(Boolean).pop();

  if (!bookId) return null;

  const favoriteLabel = favorite ? 'Remove from favorites' : 'Add to favorites';

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/books/${bookId}`}>
        <div className="relative flex aspect-2/3 items-center justify-center overflow-hidden bg-slate-100">
          {book.cover_i ? (
            <Image
              src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
              alt={`Cover of ${book.title}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <span className="px-4 text-center text-sm text-slate-400">
              No cover available
            </span>
          )}
        </div>

        <div className="p-3">
          <h3 className="line-clamp-2 text-sm font-semibold text-slate-800">
            {book.title}
          </h3>

          <p className="mt-2 line-clamp-1 text-xs text-slate-500">
            {book.author_name?.[0] ?? 'Unknown author'}
          </p>

          {book.first_publish_year && (
            <p className="mt-1 text-xs text-slate-400">
              {book.first_publish_year}
            </p>
          )}
        </div>
      </Link>

      <button
        type="button"
        onClick={onToggleFavorite}
        disabled={disabled}
        title={favoriteLabel}
        aria-label={favoriteLabel}
        aria-pressed={favorite}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow transition hover:text-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Heart
          size={19}
          className={favorite ? 'fill-red-500 text-red-500' : ''}
        />
      </button>
    </div>
  );
}
