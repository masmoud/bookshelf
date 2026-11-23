import Link from 'next/link';

import type { Book } from '@/types/book';
import { formatAuthors, formatPublicationYear } from '@/utils/formatters';

type BookCardProps = {
  book: Book;
};

export default function BookCard({ book }: BookCardProps) {
  const bookId = book.key.split('/').pop();

  return (
    <Link
      href={`/books/${bookId}`}
      className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Book cover */}
      <div className="flex aspect-2/3 items-center justify-center overflow-hidden bg-slate-100">
        {book.cover_i ? (
          <img
            src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
            alt={`Cover of ${book.title}`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="px-4 text-center text-sm text-slate-400">
            No cover available
          </span>
        )}
      </div>

      {/* Book information */}
      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-800">
          {book.title}
        </h3>

        <p className="mt-2 line-clamp-1 text-xs text-slate-500">
          {formatAuthors(book.author_name)}
        </p>

        {book.first_publish_year && (
          <p className="mt-1 text-xs text-slate-400">
            {formatPublicationYear(book.first_publish_year)}
          </p>
        )}
      </div>
    </Link>
  );
}
