'use client';

import { signOut } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Favorites', href: '/favorites' }
];

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data, error }) => {
      if (!error) {
        setUser(data.user);
      }
      setLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    const { error } = await signOut();

    if (error) {
      console.error('Logout failed:', error.message);
      return;
    }

    setUser(null);
    router.push('/');
    router.refresh();
  }
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
              prefetch={item.href !== '/favorites'}
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

          {!loading &&
            (user ? (
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Sign up
                </Link>
              </>
            ))}
        </div>
      </nav>
    </header>
  );
}
