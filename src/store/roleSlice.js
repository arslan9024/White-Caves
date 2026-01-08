import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  availableRoles: [
    { id: 'buyer', label: 'Buyer', icon: '🏠', description: 'Looking to purchase property' },
    { id: 'seller', label: 'Seller', icon: '💰', description: 'Want to sell your property' },
    { id: 'landlord', label: 'Landlord', icon: '🏢', description: 'Renting out your property' },
    { id: 'tenant', label: 'Tenant', icon: '🔑', description: 'Looking to rent a property' },
    { id: 'leasing-agent', label: 'Leasing Agent', icon: '📋', description: 'Property rental specialist', requiresApproval: true },
    { id: 'secondary-sales-agent', label: 'Sales Agent', icon: '📊', description: 'Property sales specialist', requiresApproval: true },
  ],
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

export const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setUserRoles: (state, action) => {
      state.userRoles = action.payload;
    },
    setActiveRole: (state, action) => {
      state.activeRole = action.payload;
    },
    addUserRole: (state, action) => {
      if (!state.userRoles.includes(action.payload)) {
        state.userRoles.push(action.payload);
      }
    },
    removeUserRole: (state, action) => {
      state.userRoles = state.userRoles.filter(role => role !== action.payload);
    },
    submitRoleChangeRequest: (state, action) => {
      const { userId, currentRole, requestedRole, reason } = action.payload;
      const request = {
        id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        currentRole,
        requestedRole,
        reason: reason || '',
        status: 'pending',
        requestedAt: new Date().toISOString(),
        reviewedAt: null,
        reviewedBy: null,
      };
      state.pendingRequests.push(request);
      state.userRoleRequest.isRequesting = false;
      state.userRoleRequest.lastRequestStatus = 'success';
      state.statusHistory.unshift({
        id: `status_${Date.now()}`,
        type: 'pending',
        title: 'Role Change Request Submitted',
        message: `Your request to change to ${requestedRole} role is pending admin approval.`,
        timestamp: new Date().toISOString(),
        requestId: request.id,
      });
    },
    startRoleRequest: (state) => {
      state.userRoleRequest.isRequesting = true;
      state.userRoleRequest.lastRequestStatus = 'pending';
      state.userRoleRequest.errorMessage = null;
    },
    roleRequestSuccess: (state, action) => {
      state.userRoleRequest.isRequesting = false;
      state.userRoleRequest.lastRequestStatus = 'success';
    },
    roleRequestError: (state, action) => {
      state.userRoleRequest.isRequesting = false;
      state.userRoleRequest.lastRequestStatus = 'error';
      state.userRoleRequest.errorMessage = action.payload;
      state.statusHistory.unshift({
        id: `status_${Date.now()}`,
        type: 'error',
        title: 'Role Change Request Failed',
        message: action.payload || 'An error occurred while submitting your request.',
        timestamp: new Date().toISOString(),
      });
    },
    approveRoleRequest: (state, action) => {
      const { requestId, reviewedBy } = action.payload;
      const request = state.pendingRequests.find(r => r.id === requestId);
      if (request) {
        request.status = 'approved';
        request.reviewedAt = new Date().toISOString();
        request.reviewedBy = reviewedBy;
        if (!state.userRoles.includes(request.requestedRole)) {
          state.userRoles.push(request.requestedRole);
        }
        state.statusHistory.unshift({
          id: `status_${Date.now()}`,
          type: 'success',
          title: 'Role Change Approved',
          message: `Your request to become a ${request.requestedRole} has been approved.`,
          timestamp: new Date().toISOString(),
          requestId,
        });
      }
    },
    rejectRoleRequest: (state, action) => {
      const { requestId, reviewedBy, reason } = action.payload;
      const request = state.pendingRequests.find(r => r.id === requestId);
      if (request) {
        request.status = 'rejected';
        request.reviewedAt = new Date().toISOString();
        request.reviewedBy = reviewedBy;
        request.rejectionReason = reason;
        state.statusHistory.unshift({
          id: `status_${Date.now()}`,
          type: 'error',
          title: 'Role Change Rejected',
          message: reason || `Your request to become a ${request.requestedRole} was not approved.`,
          timestamp: new Date().toISOString(),
          requestId,
        });
      }
    },
    clearRoleRequestStatus: (state) => {
      state.userRoleRequest.lastRequestStatus = 'idle';
      state.userRoleRequest.errorMessage = null;
    },
    dismissStatusItem: (state, action) => {
      state.statusHistory = state.statusHistory.filter(s => s.id !== action.payload);
    },
    clearStatusHistory: (state) => {
      state.statusHistory = [];
    },
    setPendingRequests: (state, action) => {
      state.pendingRequests = action.payload;
    },
  },
});

export const {
  setUserRoles,
  setActiveRole,
  addUserRole,
  removeUserRole,
  submitRoleChangeRequest,
  startRoleRequest,
  roleRequestSuccess,
  roleRequestError,
  approveRoleRequest,
  rejectRoleRequest,
  clearRoleRequestStatus,
  dismissStatusItem,
  clearStatusHistory,
  setPendingRequests,
} = roleSlice.actions;

export const selectAvailableRoles = (state) => state.role.availableRoles;
export const selectUserRoles = (state) => state.role.userRoles;
export const selectActiveRole = (state) => state.role.activeRole;
export const selectPendingRequests = (state) => state.role.pendingRequests;
export const selectRoleRequestStatus = (state) => state.role.userRoleRequest;
export const selectStatusHistory = (state) => state.role.statusHistory;
export const selectHasPendingRequest = (state) => 
  state.role.pendingRequests.some(r => r.status === 'pending');

export default roleSlice.reducer;
