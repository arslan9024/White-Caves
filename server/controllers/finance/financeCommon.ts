import { Request } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import type { AuthRequest } from '../../middleware/auth.js';

export type RouteRequest = AuthRequest & Request<Record<string, string>>;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const EXPENSE_SCHEMA_PATH = path.resolve(__dirname, '../../../data/expenses-master-schema.json');

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

