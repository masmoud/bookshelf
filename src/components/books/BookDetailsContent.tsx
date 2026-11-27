'use client';

import { useBookDetails } from '@/hooks/useBookDetails';

import BookDetails from '@/components/books/BookDetails';
import Loader from '@/components/ui/Loader';
import ErrorMessage from '@/components/ui/ErrorMessage';

type BookDetailsContentProps = {
  id: string;
};

export default function BookDetailsContent({ id }: BookDetailsContentProps) {
  const { book, loading, error, retry } = useBookDetails(id);

  if (loading) {
    return (
      <div role="status" aria-live="polite">
        <Loader message="Loading book details..." />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={retry} />;
  }

  if (!book) {
    return (
      <p className="py-10 text-center text-slate-500" role="status">
        Book not found.
      </p>
    );
  }

  return (
    <section aria-label="Book details">
      <BookDetails book={book} />
    </section>
  );
}
