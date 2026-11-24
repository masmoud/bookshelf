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
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

// Add a book to favorites
export async function addFavorite(bookId: string): Promise<Favorite> {
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
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Remove a book from favorites
export async function removeFavorite(bookId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('book_id', bookId);

  if (error) {
    throw new Error(error.message);
  }
}
