'use client';

import BookList from '@/components/books/BookList';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Loader from '@/components/ui/Loader';
import { useFetchBooks } from '@/hooks/useFetchBooks';

export default function HomePage() {
  const { books, loading, error, retry } = useFetchBooks();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Hero section */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Discover your next <span className="text-blue-600">book.</span>
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-slate-500">
          Explore thousands of books, discover new authors and save your
          favorites in one place.
        </p>
      </section>

      {/* Search bar */}
      <div className="mx-auto mb-12 max-w-xl">
        <input
          type="text"
          placeholder="Search for a book or an author..."
          disabled
          className="w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed"
        />

        <p className="mt-2 text-xs text-slate-400">
          Search functionality coming soon.
        </p>
      </div>

      {/* Books section */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Popular books</h2>

          <p className="mt-1 text-sm text-slate-500">
            Discover books selected for you.
          </p>
        </div>

        {/* Loading state */}
        {loading && <Loader message="Loading books..." />}

        {/* Error state */}
        {!loading && error && <ErrorMessage message={error} onRetry={retry} />}

        {/* Empty state */}
        {!loading && !error && books.length === 0 && (
          <p className="py-10 text-center text-slate-500">No books found.</p>
        )}

        {/* Books grid */}
        {!loading && !error && books.length > 0 && <BookList books={books} />}
      </section>
    </div>
  );
}
