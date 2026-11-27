'use client';

import { useEffect, useState } from 'react';

type BookFiltersProps = {
  author: string;
  minYear: string;
  maxYear: string;
  sortBy: string;
  onAuthorChange: (value: string) => void;
  onMinYearChange: (value: string) => void;
  onMaxYearChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onReset: () => void;
};

const CURRENT_YEAR = 2026;

export default function BookFilters({
  author,
  minYear,
  maxYear,
  sortBy,
  onAuthorChange,
  onMinYearChange,
  onMaxYearChange,
  onSortChange,
  onReset
}: BookFiltersProps) {
  return (
    <div className="mb-8 rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Filters</h3>

        <button
          type="button"
          onClick={onReset}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Reset filters
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label
            htmlFor="author"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Author
          </label>

          <input
            id="author"
            type="text"
            value={author}
            onChange={(event) => onAuthorChange(event.target.value)}
            placeholder="Search by author"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="minYear"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            From year
          </label>

          <input
            id="minYear"
            type="number"
            min="1"
            max={maxYear || CURRENT_YEAR}
            step="1"
            value={minYear}
            onChange={(event) => onMinYearChange(event.target.value)}
            placeholder="e.g. 1990"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="maxYear"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            To year
          </label>

          <input
            id="maxYear"
            type="number"
            min={minYear || '1'}
            max={CURRENT_YEAR}
            step="1"
            value={maxYear}
            onChange={(event) => onMaxYearChange(event.target.value)}
            placeholder="e.g. 2025"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="sortBy"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Sort by
          </label>

          <select
            id="sortBy"
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="relevance">Relevance</option>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="editions">Most editions</option>
          </select>
        </div>
      </div>
    </div>
  );
}
