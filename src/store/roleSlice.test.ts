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

describe('roleSlice', () => {
  const initialState = {
    availableRoles: [],
    userRoles: [],
    activeRole: null,
    pendingRequests: [],
    userRoleRequest: {
      isRequesting: false,
      lastRequestStatus: 'idle',
      errorMessage: null,
    },
    statusHistory: [],
  };

  it('should return the initial state', () => {
    expect(roleReducer(undefined, { type: 'unknown' })).toMatchObject({
      userRoles: [],
      activeRole: null,
    });
  });

  it('should handle setUserRoles', () => {
    const state = roleReducer(initialState, setUserRoles(['buyer', 'tenant']));
    expect(state.userRoles).toEqual(['buyer', 'tenant']);
  });

  it('should handle setActiveRole', () => {
    const state = roleReducer(initialState, setActiveRole('buyer'));
    expect(state.activeRole).toBe('buyer');
  });

  it('should handle addUserRole', () => {
    const state = roleReducer(initialState, addUserRole('seller'));
    expect(state.userRoles).toContain('seller');
  });

  it('should not duplicate roles when adding', () => {
    const stateWithRole = { ...initialState, userRoles: ['buyer'] };
    const state = roleReducer(stateWithRole, addUserRole('buyer'));
    expect(state.userRoles.filter(r => r === 'buyer')).toHaveLength(1);
  });

  it('should handle removeUserRole', () => {
    const stateWithRoles = { ...initialState, userRoles: ['buyer', 'seller'] };
    const state = roleReducer(stateWithRoles, removeUserRole('seller'));
    expect(state.userRoles).toEqual(['buyer']);
  });

  it('should handle setPendingRequests', () => {
    const requests = [
      { id: 'req1', status: 'pending', requestedRole: 'agent' },
    ];
    const state = roleReducer(initialState, setPendingRequests(requests));
    expect(state.pendingRequests).toEqual(requests);
  });

  it('should handle approveRoleRequest', () => {
    const stateWithRequests = {
      ...initialState,
      pendingRequests: [
        { id: 'req1', status: 'pending', requestedRole: 'agent' },
      ],
    };
    
    const state = roleReducer(
      stateWithRequests,
      approveRoleRequest({ requestId: 'req1', reviewedBy: 'admin1' })
    );
    
    expect(state.pendingRequests[0].status).toBe('approved');
    expect(state.pendingRequests[0].reviewedBy).toBe('admin1');
  });

  it('should handle rejectRoleRequest', () => {
    const stateWithRequests = {
      ...initialState,
      pendingRequests: [
        { id: 'req1', status: 'pending', requestedRole: 'agent' },
      ],
    };
    
    const state = roleReducer(
      stateWithRequests,
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
