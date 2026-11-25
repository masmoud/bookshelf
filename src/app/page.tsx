'use client';

import { useEffect, useMemo, useState } from 'react';

import { useFetchBooks } from '@/hooks/useFetchBooks';
import { useSearchBooks } from '@/hooks/useSearchBooks';

import BookFilters from '@/components/books/BookFilters';
import BookList from '@/components/books/BookList';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Loader from '@/components/ui/Loader';
import SearchBar from '@/components/ui/SearchBar';
import { normalizeText } from '@/utils/formatters';

export default function HomePage() {
  const {
    books: popularBooks,
    total: popularTotal,
    loading: popularLoading,
    loadingMore: popularLoadingMore,
    error: popularError,
    hasMore: popularHasMore,
    loadMore: loadMorePopular,
    retry
  } = useFetchBooks();

  const {
    books: searchResults,
    total: searchTotal,
    loading: searchLoading,
    loadingMore: searchLoadingMore,
    error: searchError,
    hasSearched,
    hasMore: searchHasMore,
    search,
    loadMore: loadMoreSearch,
    resetSearch
  } = useSearchBooks();

  const [searchQuery, setSearchQuery] = useState('');

  // Filters
  const [author, setAuthor] = useState('');
  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');
  const [sortBy, setSortBy] = useState('relevance');

  const isSearching = hasSearched;

  const books = isSearching ? searchResults : popularBooks;
  const totalBooks = isSearching ? searchTotal : popularTotal;
  const loading = isSearching ? searchLoading : popularLoading;
  const error = isSearching ? searchError : popularError;

  const loadingMore = isSearching ? searchLoadingMore : popularLoadingMore;

  const hasMore = isSearching ? searchHasMore : popularHasMore;

  const loadMore = isSearching ? loadMoreSearch : loadMorePopular;

  const hasInvalidYearRange =
    minYear !== '' && maxYear !== '' && Number(minYear) > Number(maxYear);

  const filteredBooks = useMemo(() => {
    if (hasInvalidYearRange) return [];
    let result = [...books];

    // Filter by author
    if (author.trim()) {
      const normalizedAuthor = normalizeText(author);

      result = result.filter((book) =>
        book.author_name?.some((name) =>
          normalizeText(name).toLowerCase().includes(normalizedAuthor)
        )
      );
    }

    // Filter by publication year
    if (minYear) {
      result = result.filter(
        (book) =>
          book.first_publish_year !== undefined &&
          book.first_publish_year >= Number(minYear)
      );
    }

    if (maxYear) {
      result = result.filter(
        (book) =>
          book.first_publish_year !== undefined &&
          book.first_publish_year <= Number(maxYear)
      );
    }

    // Sort books
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => {
          if (!a.first_publish_year) return 1;
          if (!b.first_publish_year) return -1;

          return b.first_publish_year - a.first_publish_year;
        });
        break;

      case 'oldest':
        result.sort((a, b) => {
          if (!a.first_publish_year) return 1;
          if (!b.first_publish_year) return -1;

          return a.first_publish_year - b.first_publish_year;
        });
        break;

      case 'editions':
        result.sort((a, b) => (b.edition_count ?? 0) - (a.edition_count ?? 0));
        break;
    }

    return result;
  }, [books, author, minYear, maxYear, sortBy, hasInvalidYearRange]);

  useEffect(() => {
    function handleReset() {
      setSearchQuery('');
      resetSearch();
      resetFilters();
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

  function resetFilters() {
    setAuthor('');
    setMinYear('');
    setMaxYear('');
    setSortBy('relevance');
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

        {/* Book filters */}
        <BookFilters
          author={author}
          minYear={minYear}
          maxYear={maxYear}
          sortBy={sortBy}
          onAuthorChange={setAuthor}
          onMinYearChange={setMinYear}
          onMaxYearChange={setMaxYear}
          onSortChange={setSortBy}
          onReset={resetFilters}
        />

        {hasInvalidYearRange && (
          <p className="mb-4 text-sm text-red-600">
            The starting year cannot be greater than the ending year.
          </p>
        )}

        {/* Loaded books count */}
        {!loading && !error && !hasInvalidYearRange && books.length > 0 && (
          <p className="mb-4 text-sm text-slate-500">
            Showing {filteredBooks.length} of {totalBooks} loaded books
          </p>
        )}

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

        {!loading &&
          !error &&
          books.length > 0 &&
          filteredBooks.length === 0 && (
            <p className="py-10 text-center text-slate-500">
              No books match your filters. Try adjusting your filters.
            </p>
          )}

        {/* Books grid */}
        {!loading && !error && filteredBooks.length > 0 && (
          <BookList books={filteredBooks} />
        )}

        {/* Load more button */}
        {!loading && !error && hasMore && !hasInvalidYearRange && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingMore ? 'Loading...' : 'Load more'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
