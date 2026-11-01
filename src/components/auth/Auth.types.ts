/**
 * Auth.types.ts
 * Single-purpose: Type definitions for the Auth component module.
 */

export type AuthMode = 'phone' | 'email';

export interface AuthUser {
  id: string;
  email: string | null;
  name: string;
  phone?: string | null;
  photoUrl: string | null;
  provider: 'google' | 'facebook' | 'apple' | 'email' | 'phone';
}

export interface AuthFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  otp: string;
}

export interface AuthProps {
  onLogin: (user: AuthUser) => void;
}

