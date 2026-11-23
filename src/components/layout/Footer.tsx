import Link from 'next/link';

const COPYRIGHT_YEAR = 2026;

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        {/* Project information */}
        <div className="text-center sm:text-left">
          <Link href="/" className="text-lg font-bold text-slate-900">
            Book<span className="text-blue-600">Shelf</span>
          </Link>

          <p className="mt-1 text-sm text-slate-500">
            Discover, explore and save your favorite books.
          </p>
        </div>

        {/* API credit */}
        <p className="text-center text-xs text-slate-400">
          Book data provided by{' '}
          <a
            href="https://openlibrary.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-600 transition hover:text-blue-600"
          >
            Open Library
          </a>
        </p>

        <p className="text-xs text-slate-400">© {COPYRIGHT_YEAR} BookShelf</p>
      </div>
    </footer>
  );
}
