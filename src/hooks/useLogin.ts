'use client';

import { useState } from 'react';

import { signIn } from '@/lib/supabase/auth';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(email: string, password: string): Promise<boolean> {
    setLoading(true);
    setError(null);

    try {
      const { error } = await signIn(email.trim(), password);

      if (error) {
        setError(
          error.message === 'Invalid login credentials'
            ? 'Invalid email or password.'
            : 'Unable to log in. Please try again.'
        );

        return false;
      }

      return true;
    } catch {
      setError('Something went wrong. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    login,
    loading,
    error
  };
}
