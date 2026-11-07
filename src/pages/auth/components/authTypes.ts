/**
 * authTypes.ts
 * Shared types and constants for SignInPage modular components
 */

export type AuthMode = 'signin' | 'signup';
export type AuthTab = 'email' | 'phone';
export type SignupStep = 1 | 2 | 3; // 1=credentials, 2=category, 3=role
export type SocialProvider = 'google' | 'facebook' | 'apple';

export interface FirebaseUserPayload {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  getIdToken?: (forceRefresh?: boolean) => Promise<string>;
}

export interface SocialRecoveryState {
  visible: boolean;
  provider: SocialProvider | null;
  firebaseUser: FirebaseUserPayload | null;
  reason: string;
  retryCount: number;
  isRetrying: boolean;
  maxRetries: number;
}

export interface CategoryOption {
  id: string;
  label: string;
  description: string;
}

export const MAX_SOCIAL_RETRIES = 3;

export const CATEGORIES: CategoryOption[] = [
  { id: 'client', label: 'Client', description: 'Browse and purchase properties' },
  { id: 'staff', label: 'Staff Member', description: 'Internal team member' },
];
