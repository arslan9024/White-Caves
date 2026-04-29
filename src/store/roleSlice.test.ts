import { describe, it, expect } from 'vitest';
import roleReducer, {
  setUserRoles,
  setActiveRole,
  addUserRole,
  removeUserRole,
  setPendingRequests,
  approveRoleRequest,
  rejectRoleRequest,
} from './roleSlice';
import type { RoleRequest } from './roleSlice';

describe('roleSlice', () => {
  // Use undefined to get actual initial state from the reducer
  const getInitialState = () => roleReducer(undefined, { type: 'unknown' });

  const createMockRequest = (overrides: Partial<RoleRequest> = {}): RoleRequest => ({
    id: 'req1',
    userId: 'user1',
    currentRole: 'buyer',
    requestedRole: 'agent',
    reason: 'Test reason',
    status: 'pending',
    requestedAt: new Date().toISOString(),
    reviewedAt: null,
    reviewedBy: null,
    ...overrides,
  });

  it('should return the initial state', () => {
    expect(getInitialState()).toMatchObject({
      userRoles: [],
      activeRole: null,
    });
  });

  it('should handle setUserRoles', () => {
    const state = roleReducer(getInitialState(), setUserRoles(['buyer', 'tenant']));
    expect(state.userRoles).toEqual(['buyer', 'tenant']);
  });

  it('should handle setActiveRole', () => {
    const state = roleReducer(getInitialState(), setActiveRole('buyer'));
    expect(state.activeRole).toBe('buyer');
  });

  it('should handle addUserRole', () => {
    const state = roleReducer(getInitialState(), addUserRole('seller'));
    expect(state.userRoles).toContain('seller');
  });

  it('should not duplicate roles when adding', () => {
    const baseState = roleReducer(getInitialState(), addUserRole('buyer'));
    const state = roleReducer(baseState, addUserRole('buyer'));
    expect(state.userRoles.filter(r => r === 'buyer')).toHaveLength(1);
  });

  it('should handle removeUserRole', () => {
    let state = roleReducer(getInitialState(), addUserRole('buyer'));
    state = roleReducer(state, addUserRole('seller'));
    state = roleReducer(state, removeUserRole('seller'));
    expect(state.userRoles).toEqual(['buyer']);
  });

  it('should handle setPendingRequests', () => {
    const requests = [createMockRequest()];
    const state = roleReducer(getInitialState(), setPendingRequests(requests));
    expect(state.pendingRequests).toEqual(requests);
  });

  it('should handle approveRoleRequest', () => {
    const request = createMockRequest({ id: 'req1', status: 'pending' });
    let state = roleReducer(getInitialState(), setPendingRequests([request]));
    
    state = roleReducer(
      state,
      approveRoleRequest({ requestId: 'req1', reviewedBy: 'admin1' })
    );
    
    expect(state.pendingRequests[0].status).toBe('approved');
    expect(state.pendingRequests[0].reviewedBy).toBe('admin1');
  });

  it('should handle rejectRoleRequest', () => {
    const request = createMockRequest({ id: 'req1', status: 'pending' });
    let state = roleReducer(getInitialState(), setPendingRequests([request]));
    
    state = roleReducer(
      state,
      rejectRoleRequest({ 
        requestId: 'req1', 
        reviewedBy: 'admin1', 
        reason: 'Incomplete profile' 
      })
    );
    
    expect(state.pendingRequests[0].status).toBe('rejected');
    expect(state.statusHistory[0].type).toBe('error');
  });
});
