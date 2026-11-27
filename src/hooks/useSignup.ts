'use client';

import { useState } from 'react';

import { signUp } from '@/lib/supabase/auth';

type SignupResult = 'success' | 'confirmation_required' | 'error';

export function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function signup(
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<SignupResult> {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return 'error';
      }

      if (password.length < 8) {
        setError('Password must contain at least 8 characters.');
        return 'error';
      }

      const { data, error } = await signUp(normalizedEmail, password);

      if (error) {
        if (
          error.message.toLowerCase().includes('already registered') ||
          error.code === 'user_already_exists' ||
          error.code === 'email_exists'
        ) {
          setError('An account with this email address already exists.');
        } else {
          setError('Unable to create your account. Please try again.');
        }

        return 'error';
      }

      if (data.user && data.user.identities?.length === 0) {
        setError('An account with this email address already exists.');
        return 'error';
      }

      if (data.session) {
        return 'success';
      }

      setSuccessMessage(
        'Account created! Please check your email to confirm your account.'
      );

      return 'confirmation_required';
    } catch {
      setError('Something went wrong. Please try again.');
      return 'error';
    } finally {
      setLoading(false);
    }
  }

  return {
    signup,
    loading,
    error,
    successMessage
  };
}
