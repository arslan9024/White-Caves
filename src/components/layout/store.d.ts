declare module '../../store/userSlice' {
  import type { Slice, PayloadAction } from '@reduxjs/toolkit';
  interface AppUser {
    id: string;
    uid?: string;
    email: string;
    name?: string;
    displayName?: string;
    role?: string;
    photoURL?: string;
    [key: string]: unknown;
  }
  export const userSlice: Slice;
  export const setUser: (user: AppUser | null) => PayloadAction<AppUser | null>;
  export default userSlice;
}

declare module '../../store/navigationSlice' {
  import type { Slice, PayloadAction } from '@reduxjs/toolkit';
  export const navigationSlice: Slice;
  export const setActiveRole: (role: string | null) => PayloadAction<string | null>;
  export const closeAllMenus: () => PayloadAction<void>;
  export const setTheme: (theme: string) => PayloadAction<string>;
  export default navigationSlice;
}
