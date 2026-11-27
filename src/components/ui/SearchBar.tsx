'use client';

import { SubmitEvent } from 'react';

type SearchBarProps = {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  query,
  onQueryChange,
  onSearch,
  placeholder = 'Search for a book or an author...'
}: SearchBarProps) {
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    onSearch(trimmedQuery);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <input
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search books"
        autoComplete="off"
        className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      <button
        type="submit"
        disabled={!query.trim()}
        className="rounded-xl bg-blue-600 px-6 py-4 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Search
      </button>
    </form>
  );
}
