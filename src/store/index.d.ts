declare module './userSlice' {
  export const userSlice: any;
  export const setUser: (user: any) => any;
  export default userSlice;
}

declare module './navigationSlice' {
  export const navigationSlice: any;
  export const setActiveRole: (role: any) => any;
  export const closeAllMenus: () => any;
  export const setTheme: (theme: string) => any;
  export default navigationSlice;
}
