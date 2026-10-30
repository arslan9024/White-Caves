/**
 * Department Common Utilities, Constants & Types
 */

import { Request } from 'express';

export type RouteRequest = Request<Record<string, string>>;

export interface DepartmentMeta {
  code: string;
  name: string;
  icon: string;
}

export const DEPARTMENTS: DepartmentMeta[] = [
  { code: 'SALES', name: 'Sales & Leasing', icon: '📈' },
  { code: 'FINANCE', name: 'Finance', icon: '💰' },
  { code: 'HR', name: 'Human Resources', icon: '👥' },
];

export const COLORS = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c'];

export const routeParamToString = (value: string | string[] | undefined): string | null => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
    const first = value[0].trim();
    return first.length > 0 ? first : null;
  }
  return null;
};

export interface MonthPeriod {
  label: string;
  start: Date;
  end: Date;
}

export function lastNMonths(n: number): MonthPeriod[] {
  const months: MonthPeriod[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
    const label = d.toLocaleString('en-GB', { month: 'short' });
    months.push({ label, start, end });
  }
  return months;
}

