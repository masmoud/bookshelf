'use client';

import { useEffect, useState } from 'react';

import { useFetchBooks } from '@/hooks/useFetchBooks';
import { useSearchBooks } from '@/hooks/useSearchBooks';

import BookList from '@/components/books/BookList';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Loader from '@/components/ui/Loader';
import SearchBar from '@/components/ui/SearchBar';

export default function HomePage() {
  const {
    books: popularBooks,
    loading: popularLoading,
    error: popularError,
    retry
  } = useFetchBooks();

  const {
    books: searchResults,
    loading: searchLoading,
    error: searchError,
    hasSearched,
    search,
    resetSearch
  } = useSearchBooks();

  const [searchQuery, setSearchQuery] = useState('');

  const isSearching = hasSearched;

  const books = isSearching ? searchResults : popularBooks;
  const loading = isSearching ? searchLoading : popularLoading;
  const error = isSearching ? searchError : popularError;

  useEffect(() => {
    function handleReset() {
      setSearchQuery('');
      resetSearch();
    }

    window.addEventListener('bookshelf:reset-search', handleReset);

    return () => {
      window.removeEventListener('bookshelf:reset-search', handleReset);
    };
  }, [resetSearch]);

  function handleSearch(query: string) {
    setSearchQuery(query);
    search(query);
  }

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
        <SearchBar
          query={searchQuery}
          onQueryChange={setSearchQuery}
          onSearch={handleSearch}
        />

        {hasSearched && (
          <p className="mt-3 text-sm text-slate-500">
            Search results for &quot;{searchQuery}&quot;
          </p>
        )}
      </div>

      {/* Books section */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {isSearching ? 'Search results' : 'Popular books'}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {isSearching
              ? 'Books matching your search.'
              : 'Discover books selected for you.'}
          </p>
        </div>

        {/* Loading state */}
        {loading && <Loader message="Loading books..." />}

        {/* Error state */}
        {!loading && error && (
          <ErrorMessage
            message={error}
            onRetry={isSearching ? () => search(searchQuery) : retry}
          />
        )}

        {/* Empty state */}
        {!loading && !error && books.length === 0 && (
          <p className="py-10 text-center text-slate-500">
            {isSearching
              ? 'No books found. Try another search.'
              : 'No books available.'}
          </p>
        )}

        {/* Books grid */}
        {!loading && !error && books.length > 0 && <BookList books={books} />}
      </section>
    </div>
  );
}
