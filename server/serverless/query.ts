import type { Request } from 'express';

export function readStringQuery(query: Request['query']): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;
    if (typeof value !== 'string') throw new TypeError('Query values must be strings');
    result[key] = value;
  }
  return result;
}
