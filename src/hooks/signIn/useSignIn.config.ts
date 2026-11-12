export interface PendingUser {
  id: string;
  email: string;
  name: string;
  photo?: string;
  fromSocialProvider?: string;
}
export interface ConfirmationResult {
  confirm: (otp: string) => Promise<{
    user: {
      uid: string;
      email: string | null;
      displayName: string | null;
      photoURL: string | null;
    };
  }>;
}
export interface SocialSyncRecovery {
  provider: 'google' | 'facebook' | 'apple';
  reason: string;
}
export type SupportedSocialProvider = 'google' | 'facebook' | 'apple';
export interface SocialAuthErrorLike {
  code?: string;
  message?: string;
}
export interface UserCategory {
  id: string;
  label: string;
  icon: string;
  desc: string;
  color: string;
}
export interface UserRole {
  id: string;
  label: string;
  icon: string;
  desc: string;
}
