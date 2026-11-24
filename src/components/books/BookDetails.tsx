import type { BookDetailsData } from '@/types/book';

type BookDetailsProps = {
  book: BookDetailsData;
};

export default function BookDetails({ book }: BookDetailsProps) {
  return (
    <div className="grid gap-10 md:grid-cols-[280px_1fr]">
      {/* Book cover */}
      <div className="mx-auto w-full max-w-70">
        <div className="flex aspect-2/3 items-center justify-center overflow-hidden rounded-xl bg-slate-100 shadow-md">
          {book.cover_i ? (
            <img
              src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`}
              alt={`Cover of ${book.title}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="px-4 text-center text-sm text-slate-400">
              No cover available
            </span>
          )}
        </div>
      </div>

      {/* Book information */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {book.title}
        </h1>

        <p className="mt-3 text-lg text-slate-500">
          {book.author_name?.join(', ') ?? 'Unknown author'}
        </p>

        {book.description && (
          <div className="mt-8 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-semibold text-slate-900">
              About this book
            </h2>

            <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
              {book.description ?? 'No description'}
            </p>
          </div>
        )}

        <div className="mt-8 grid gap-5 border-y border-slate-200 py-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-400">First published</p>
            <p className="mt-1 font-medium text-slate-800">
              {book.first_publish_year ?? 'Unknown'}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-400">Editions</p>
            <p className="mt-1 font-medium text-slate-800">
              {book.edition_count ?? 'Unknown'}
            </p>
          </div>
        </div>

        {book.subject && book.subject.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">Subjects</h2>

            <div className="mt-3 flex flex-wrap gap-2">
              {book.subject.slice(0, 12).map((subject) => (
                <span
                  key={subject}
                  className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
