/**
 * Utility Functions
 * Common utility functions for formatting, validation, and calculations
 */

/**
 * Format date for display
 */
export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format currency
 */
export const formatCurrency = (amount: number, currency: string = 'AED'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  // Format as (XXX) XXX-XXXX or +XX XXX XXX XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

/**
 * Calculate commission
 */
export const calculateCommission = (transactionAmount: number, percentage: number): number => {
  return (transactionAmount * percentage) / 100;
};

/**
 * Calculate days between dates
 */
export const daysBetween = (date1: Date, date2: Date): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Check if date is in the past
 */
export const isPastDate = (date: Date): boolean => {
  return new Date(date) < new Date();
};

/**
 * Generate random ID
 */
export const generateId = (prefix: string = ''): string => {
  return prefix + Math.random().toString(36).substring(2, 11);
};

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

/**
 * Truncate string
 */
export const truncateString = (str: string, length: number = 50): string => {
  return str.length > length ? str.substring(0, length) + '...' : str;
};

/**
 * Get initials from name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return function debounced(...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
};

/**
 * Group array by property
 */
export const groupBy = <T extends Record<string, any>>(
  array: T[],
  key: keyof T
): Record<string, T[]> => {
  return array.reduce(
    (acc, obj) => {
      const group = obj[key] as string | number;
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(obj);
      return acc;
    },
    {} as Record<string, T[]>
  );
};

/**
 * Sort array by property
 */
export const sortBy = <T extends Record<string, any>>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    const comparison = aVal > bVal ? 1 : -1;
    return order === 'asc' ? comparison : -comparison;
  });
};
