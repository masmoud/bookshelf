'use client';

import Link from 'next/link';

const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Favorites', href: '/favorites' }
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          onClick={() =>
            window.dispatchEvent(new Event('bookshelf:reset-search'))
          }
          className="text-2xl font-bold tracking-tight text-slate-900"
        >
          Book<span className="text-blue-600">Shelf</span>
        </Link>

        <div className="flex items-center gap-6">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={
                item.href === '/'
                  ? () =>
                      window.dispatchEvent(new Event('bookshelf:reset-search'))
                  : undefined
              }
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
