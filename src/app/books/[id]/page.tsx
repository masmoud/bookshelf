import Link from 'next/link';
import { Suspense } from 'react';

import BookDetailsContent from '@/components/books/BookDetailsContent';
import Loader from '@/components/ui/Loader';

type BookDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function BookDetailsPage({ params }: BookDetailsPageProps) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <Link
        href="/"
        className="mb-8 inline-flex items-center text-sm font-medium text-slate-500 transition hover:text-blue-600"
      >
        ← Back to books
      </Link>

      <Suspense fallback={<Loader message="Loading book details..." />}>
        <BookDetailsRoute params={params} />
      </Suspense>
    </div>
  );
}

async function BookDetailsRoute({ params }: BookDetailsPageProps) {
  const { id } = await params;

  return <BookDetailsContent id={id} />;
}
