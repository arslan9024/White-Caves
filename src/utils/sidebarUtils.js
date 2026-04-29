/**
 * sidebarUtils.js
 * Utility functions for sidebar filtering, defaults, and history management
 */

import {
  getAllDepartments,
  getDepartmentById,
  getServicesByDepartment,
  getSubitemsByService,
  filterDepartmentsByPermissions,
  filterServicesByPermissions,
  filterSubitemsByPermissions,
  getDefaultDepartmentForRole,
} from '../config/departmentContentMap';

/**
 * Get default department for user
 * Uses user role to determine default, then falls back to selection history
 */
export const getDefaultDepartment = (userRole, selectionHistory) => {
  // First check if user has recent selection
  if (selectionHistory && selectionHistory.length > 0) {
    const lastEntry = selectionHistory[0];
    if (lastEntry.dept) {
      return lastEntry.dept;
    }
  }

  // Fall back to role-based default
  return getDefaultDepartmentForRole(userRole);
};

/**
 * Get default service for department
 * Uses most common/popular service from that department
 */
export const getDefaultService = (deptId, selectionHistory) => {
  const dept = getDepartmentById(deptId);
  if (!dept) return null;

  // Check if user recently used this department
  if (selectionHistory && selectionHistory.length > 0) {
    for (const entry of selectionHistory) {
      if (entry.dept === deptId && entry.service) {
        return entry.service;
      }
    }
  }

  // Return default service from department config
  return dept.defaultService;
};

/**
 * Get default subitem for service
 * Uses first subitem or based on selection history
 */
export const getDefaultSubitem = (deptId, serviceId, selectionHistory) => {
  const subitems = getSubitemsByService(deptId, serviceId);
  if (!subitems || subitems.length === 0) return null;

  // Check if user recently used this service
  if (selectionHistory && selectionHistory.length > 0) {
    for (const entry of selectionHistory) {
      if (entry.dept === deptId && entry.service === serviceId && entry.subitem) {
        return entry.subitem;
      }
    }
  }

  // Return first subitem as default
  return subitems[0]?.id;
};

/**
 * Get top N most-used services for a department
 * Used in left sidebar to show quick access services
 */
export const getTopServices = (deptId, selectionHistory, limit = 3) => {
  const services = getServicesByDepartment(deptId);
  if (!services || services.length === 0) return [];

  // Count usage of each service from history
  const usageMap = {};
  if (selectionHistory && selectionHistory.length > 0) {
    for (const entry of selectionHistory) {
      if (entry.dept === deptId && entry.service) {
        usageMap[entry.service] = (usageMap[entry.service] || 0) + 1;
      }
    }
  }

  // Sort by usage, then return top N
  const sorted = services.sort((a, b) => {
    const usageA = usageMap[a.id] || 0;
    const usageB = usageMap[b.id] || 0;
    return usageB - usageA;
  });

  return sorted.slice(0, limit);
};

/**
 * Generate breadcrumb navigation
 * Shows max 5 items with history navigation
 */
export const generateBreadcrumbs = (dept, service, subitem, departments) => {
  const breadcrumbs = [];
  const deptObj = getDepartmentById(dept);
  const serviceObj = deptObj?.services?.[service];
  const subitemObj = serviceObj?.subitems?.find((s) => s.id === subitem);

  if (deptObj) {
    breadcrumbs.push({
      label: deptObj.label,
      id: dept,
      type: 'department',
      active: !service && !subitem,
    });
  }

  if (serviceObj) {
    breadcrumbs.push({
      label: serviceObj.label,
      id: service,
      type: 'service',
      active: !subitem,
    });
  }

  if (subitemObj) {
    breadcrumbs.push({
      label: subitemObj.label,
      id: subitem,
      type: 'subitem',
      active: true,
    });
  }

  // Limit to 5 max
  return breadcrumbs.slice(-5);
};

/**
 * Check if user has permission for department
 */
export const hasPermissionForDepartment = (deptId, userPermissions) => {
  const dept = getDepartmentById(deptId);
  if (!dept) return false;
  return dept.permissions.some((perm) => userPermissions.includes(perm));
};

/**
 * Check if user has permission for service
 */
export const hasPermissionForService = (deptId, serviceId, userPermissions) => {
  const service = getDepartmentById(deptId)?.services?.[serviceId];
  if (!service) return false;
  return service.permissions.some((perm) => userPermissions.includes(perm));
};

/**
 * Check if user has permission for subitem
 */
export const hasPermissionForSubitem = (deptId, serviceId, subitemId, userPermissions) => {
  const subitem = getSubitemsByService(deptId, serviceId)?.find((s) => s.id === subitemId);
  if (!subitem) return false;
  return subitem.permissions.some((perm) => userPermissions.includes(perm));
};

/**
 * Get all available departments for user
 */
export const getAvailableDepartments = (userPermissions) => {
  return filterDepartmentsByPermissions(userPermissions);
};

/**
 * Get all available services for department and user
 */
export const getAvailableServices = (deptId, userPermissions) => {
  return filterServicesByPermissions(deptId, userPermissions);
};

/**
 * Get all available subitems for service and user
 */
export const getAvailableSubitems = (deptId, serviceId, userPermissions) => {
  return filterSubitemsByPermissions(deptId, serviceId, userPermissions);
};

/**
 * Validate selection tuple (dept, service, subitem)
 * Ensures all selections are valid and user has permissions
 */
export const validateSelection = (dept, service, subitem, userPermissions) => {
  // Check department
  if (!hasPermissionForDepartment(dept, userPermissions)) {
    return {
      valid: false,
      error: 'Access denied to this department',
    };
  }

  // Check service
  if (service && !hasPermissionForService(dept, service, userPermissions)) {
    return {
      valid: false,
      error: 'Access denied to this service',
    };
  }

  // Check subitem
  if (subitem && !hasPermissionForSubitem(dept, service, subitem, userPermissions)) {
    return {
      valid: false,
      error: 'Access denied to this subitem',
    };
  }

  return {
    valid: true,
    error: null,
  };
};

/**
 * Sanitize selection to valid state based on permissions
 * Downgrades to last valid selection if necessary
 */
export const sanitizeSelection = (dept, service, subitem, userPermissions) => {
  const validation = validateSelection(dept, service, subitem, userPermissions);

  if (validation.valid) {
    return { dept, service, subitem };
  }

  // Try to find valid state by removing deepest level
  if (subitem) {
    const serviceValid = validateSelection(dept, service, null, userPermissions);
    if (serviceValid.valid) {
      return { dept, service, subitem: null };
    }
  }

  if (service) {
    const deptValid = validateSelection(dept, null, null, userPermissions);
    if (deptValid.valid) {
      return { dept, service: null, subitem: null };
    }
  }

  // If department also invalid, return null
  return { dept: null, service: null, subitem: null };
};

export default {
  getDefaultDepartment,
  getDefaultService,
  getDefaultSubitem,
  getTopServices,
  generateBreadcrumbs,
  hasPermissionForDepartment,
  hasPermissionForService,
  hasPermissionForSubitem,
  getAvailableDepartments,
  getAvailableServices,
  getAvailableSubitems,
  validateSelection,
  sanitizeSelection,
};
