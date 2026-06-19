import { afterEach, describe, expect, it, vi } from 'vitest';
import { getLegacyCrmRoute, getPostLoginRoute } from './routing';

describe('getPostLoginRoute', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('routes staff roles to /crm by default', () => {
    expect(getPostLoginRoute('admin')).toBe('/crm');
    expect(getPostLoginRoute('managing_director')).toBe('/crm');
    expect(getPostLoginRoute('leasing-agent')).toBe('/crm');
  });

  it('routes staff roles with incomplete profile to /profile', () => {
    expect(getPostLoginRoute('admin', null, { profileCompleted: false })).toBe('/profile');
    expect(getPostLoginRoute('leasing-agent', null, { profileCompleted: false })).toBe('/profile');
  });

  it('routes pending users to /pending-approval regardless of role', () => {
    expect(getPostLoginRoute('admin', null, { status: 'pending' })).toBe('/pending-approval');
    expect(getPostLoginRoute('buyer', null, { status: 'pending' })).toBe('/pending-approval');
  });

  it('routes customer roles to the correct portal or crm fallback', () => {
    expect(getPostLoginRoute('tenant')).toBe('/tenant-portal');
    expect(getPostLoginRoute('landlord')).toBe('/landlord-portal');
    expect(getPostLoginRoute('buyer')).toBe('/crm');
  });

  it('routes CRM customer roles with incomplete profile to /profile', () => {
    expect(getPostLoginRoute('buyer', null, { profileCompleted: false })).toBe('/profile');
    expect(getPostLoginRoute('seller', null, { profileCompleted: false })).toBe('/profile');
  });

  it('routes rank-1 users to /profile unless profile is complete', () => {
    expect(getPostLoginRoute('user')).toBe('/profile');
    expect(getPostLoginRoute('user', null, { profileCompleted: true })).toBe('/crm');
  });

  it('routes superuser aliases and creator email to /crm', () => {
    expect(getPostLoginRoute('md')).toBe('/crm');
    expect(getPostLoginRoute('unknown-role', 'arslanmalikgoraha@gmail.com')).toBe('/crm');
    expect(getPostLoginRoute(undefined, 'arslanmalikgoraha@gmail.com')).toBe('/crm');
  });

  it('routes missing roles to role selection', () => {
    expect(getPostLoginRoute('')).toBe('/select-role');
    expect(getPostLoginRoute(undefined)).toBe('/select-role');
    expect(getPostLoginRoute(null)).toBe('/select-role');
  });

  it('hard-fails unauthorized mapped roles to pending approval with audit signal', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(getPostLoginRoute('unknown-role')).toBe('/pending-approval');
    expect(warnSpy).toHaveBeenCalledWith(
      '[AuthRouting]',
      'Unauthorized role mapping hard-failed to safe fallback route',
      expect.objectContaining({
        role: 'unknown-role',
        auditEvent: 'AUTH_UNAUTHORIZED_ROLE_MAPPING',
      })
    );
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
