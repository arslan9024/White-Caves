export function isAuthenticationRequired(): boolean {
  return process.env.NODE_ENV !== 'development' || process.env.DEV_AUTH_BYPASS === 'false';
}
