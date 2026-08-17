import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserRoleProvider, useUserRole } from './UserRoleContext';

const mockStorage: Record<string, any> = {};
vi.mock('../utils/safeStorage', () => ({
  safeStorage: {
    get: vi.fn((key: string) => mockStorage[key] ?? null),
    set: vi.fn((key: string, value: any) => {
      mockStorage[key] = value;
    }),
    remove: vi.fn((key: string) => {
      delete mockStorage[key];
    }),
    getJSON: vi.fn((key: string) => {
      const val = mockStorage[key];
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch {
          return null;
        }
      }
      return val ?? null;
    }),
    setJSON: vi.fn((key: string, value: any) => {
      mockStorage[key] = value;
    }),
  },
}));

const TestComponent = () => {
  const {
    user,
    role,
    accessLevel,
    isAuthenticated,
    isManagingDirector,
    isFounder,
    hasPermission,
    hasMinAccessLevel,
    login,
    logout,
    switchRole,
    setAccessLevel,
  } = useUserRole();

  return (
    <div>
      <span data-testid="user-name">{user?.name}</span>
      <span data-testid="user-role">{role}</span>
      <span data-testid="access-level">{accessLevel}</span>
      <span data-testid="is-authenticated">{String(isAuthenticated)}</span>
      <span data-testid="is-md">{String(isManagingDirector)}</span>
      <span data-testid="is-founder">{String(isFounder)}</span>
      <span data-testid="has-admin-perm">{String(hasPermission('can_admin'))}</span>
      <span data-testid="has-min-l4">{String(hasMinAccessLevel(4))}</span>

      <button
        data-testid="login-broker-btn"
        onClick={() =>
          login({
            id: 'broker_1',
            name: 'Sarah Broker',
            email: 'sarah@whitecaves.com',
            role: 'agent',
            accessLevel: 2,
          })
        }
      >
        Login Broker
      </button>

      <button
        data-testid="login-founder-btn"
        onClick={() =>
          login({
            email: 'arslanmalikgoraha@gmail.com',
            name: 'Arslan Malik Bashir Ahmad',
          })
        }
      >
        Login Founder
      </button>

      <button data-testid="switch-role-btn" onClick={() => switchRole('manager')}>
        Switch To Manager
      </button>

      <button data-testid="set-l3-btn" onClick={() => setAccessLevel(3)}>
        Set Level 3
      </button>

      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

describe('UserRoleContext & Provider', () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
  });

  it('renders default guest user with Level 1 access', () => {
    render(
      <UserRoleProvider>
        <TestComponent />
      </UserRoleProvider>
    );

    expect(screen.getByTestId('user-name').textContent).toBe('Executive Guest');
    expect(screen.getByTestId('user-role').textContent).toBe('guest');
    expect(screen.getByTestId('access-level').textContent).toBe('1');
    expect(screen.getByTestId('is-authenticated').textContent).toBe('false');
    expect(screen.getByTestId('is-md').textContent).toBe('false');
  });

  it('logs in standard broker and updates accessLevel', () => {
    render(
      <UserRoleProvider>
        <TestComponent />
      </UserRoleProvider>
    );

    fireEvent.click(screen.getByTestId('login-broker-btn'));

    expect(screen.getByTestId('user-name').textContent).toBe('Sarah Broker');
    expect(screen.getByTestId('user-role').textContent).toBe('agent');
    expect(screen.getByTestId('access-level').textContent).toBe('2');
    expect(screen.getByTestId('is-authenticated').textContent).toBe('true');
  });

  it('automatically triggers Level 5 Sovereign bypass for Founder email', () => {
    render(
      <UserRoleProvider>
        <TestComponent />
      </UserRoleProvider>
    );

    fireEvent.click(screen.getByTestId('login-founder-btn'));

    expect(screen.getByTestId('user-name').textContent).toBe('Arslan Malik Bashir Ahmad');
    expect(screen.getByTestId('user-role').textContent).toBe('managing_director');
    expect(screen.getByTestId('access-level').textContent).toBe('5');
    expect(screen.getByTestId('is-authenticated').textContent).toBe('true');
    expect(screen.getByTestId('is-md').textContent).toBe('true');
    expect(screen.getByTestId('is-founder').textContent).toBe('true');
    expect(screen.getByTestId('has-admin-perm').textContent).toBe('true');
    expect(screen.getByTestId('has-min-l4').textContent).toBe('true');
  });

  it('allows switching role and setting access level', () => {
    render(
      <UserRoleProvider>
        <TestComponent />
      </UserRoleProvider>
    );

    fireEvent.click(screen.getByTestId('login-broker-btn'));
    fireEvent.click(screen.getByTestId('switch-role-btn'));
    expect(screen.getByTestId('user-role').textContent).toBe('manager');
    expect(screen.getByTestId('access-level').textContent).toBe('4');

    fireEvent.click(screen.getByTestId('set-l3-btn'));
    expect(screen.getByTestId('access-level').textContent).toBe('3');
  });

  it('logs out and restores guest status', () => {
    render(
      <UserRoleProvider>
        <TestComponent />
      </UserRoleProvider>
    );

    fireEvent.click(screen.getByTestId('login-broker-btn'));
    expect(screen.getByTestId('is-authenticated').textContent).toBe('true');

    fireEvent.click(screen.getByTestId('logout-btn'));
    expect(screen.getByTestId('user-name').textContent).toBe('Executive Guest');
    expect(screen.getByTestId('is-authenticated').textContent).toBe('false');
  });
});
