import type { Auth } from 'firebase/auth';

declare module './firebase' {
  export const auth: Auth | null;
}
