import { describe, expect, it } from 'vitest';
import { getLegacyCrmRoute, getPostLoginRoute } from './routing';

describe('getPostLoginRoute', () => {
  it('routes staff roles to /profile first', () => {
    expect(getPostLoginRoute('admin')).toBe('/profile');
    expect(getPostLoginRoute('managing_director')).toBe('/profile');
    expect(getPostLoginRoute('leasing-agent')).toBe('/profile');
  });

  it('routes customer roles to /profile first', () => {
    expect(getPostLoginRoute('tenant')).toBe('/profile');
    expect(getPostLoginRoute('landlord')).toBe('/profile');
    expect(getPostLoginRoute('buyer')).toBe('/profile');
  });

  it('routes superuser aliases and creator email to /profile', () => {
    expect(getPostLoginRoute('md')).toBe('/profile');
    expect(getPostLoginRoute('unknown-role', 'arslanmalikgoraha@gmail.com')).toBe('/profile');
    expect(getPostLoginRoute(undefined, 'arslanmalikgoraha@gmail.com')).toBe('/profile');
  });

  it('routes unknown/missing roles to role selection', () => {
    expect(getPostLoginRoute('unknown-role')).toBe('/select-role');
    expect(getPostLoginRoute('')).toBe('/select-role');
    expect(getPostLoginRoute(undefined)).toBe('/select-role');
    expect(getPostLoginRoute(null)).toBe('/select-role');
  });
});

describe('getLegacyCrmRoute', () => {
  it('keeps legacy CRM fallback behavior intact', () => {
    expect(getLegacyCrmRoute('admin')).toBe('/crm');
    expect(getLegacyCrmRoute('landlord')).toBe('/landlord-portal');
    expect(getLegacyCrmRoute('tenant')).toBe('/tenant-portal');
    expect(getLegacyCrmRoute(undefined)).toBe('/signin');
  });
});
