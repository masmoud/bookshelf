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
    return <Loader message="Loading book details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={retry} />;
  }

  if (!book) {
    return <p className="py-10 text-center text-slate-500">Book not found.</p>;
  }

  return <BookDetails book={book} />;
}
