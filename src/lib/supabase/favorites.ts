import { createClient } from '@/lib/supabase/client';

export type Favorite = {
  id: string;
  user_id: string;
  book_id: string;
  created_at: string;
};

// Retrieve all favorites for the authenticated user
export async function getFavorites(): Promise<Favorite[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('favorites')
    .select('id, user_id, book_id, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('Unable to load your favorites.');
  }

  return data ?? [];
}

// Add a book to favorites
export async function addFavorite(bookId: string): Promise<Favorite> {
  const normalizedBookId = bookId.trim();
  if (!normalizedBookId) {
    throw new Error('A valid book ID is required.');
  }

  const supabase = createClient();

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('You must be logged in to add favorites.');
  }

  const { data, error } = await supabase
    .from('favorites')
    .insert({
      book_id: bookId,
      user_id: user.id
    })
    .select('id, user_id, book_id, created_at')
    .single();

  if (error) {
    throw new Error('Unable to add this book to your favorites.');
  }

  return data;
}

// Remove a book from favorites
export async function removeFavorite(bookId: string): Promise<void> {
  const normalizedBookId = bookId.trim();
  if (!normalizedBookId) {
    throw new Error('A valid book ID is required.');
  }

  const supabase = createClient();

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('book_id', bookId);

  if (error) {
    throw new Error('Unable to remove this book from your favorites.');
  }
}
