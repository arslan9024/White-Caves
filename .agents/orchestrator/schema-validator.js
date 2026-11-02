#!/usr/bin/env node
import { readFileSync } from 'fs';

function expectedTypes(schema) {
  if (!schema || !schema.type) return [];
  return Array.isArray(schema.type) ? schema.type : [schema.type];
}

function matchesType(value, type) {
  if (type === 'null') return value === null;
  if (type === 'array') return Array.isArray(value);
  if (type === 'integer') return Number.isInteger(value);
  if (type === 'number') return typeof value === 'number' && Number.isFinite(value);
  if (type === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value);
  return typeof value === type;
}

function validateNode(schema, value, path, errors) {
  if (!schema) return;

  const types = expectedTypes(schema);
  if (types.length > 0 && !types.some((type) => matchesType(value, type))) {
    errors.push(`${path} expected ${types.join(' | ')}`);
    return;
  }

  if (value === null || value === undefined) return;

  if (schema.enum && !schema.enum.includes(value)) {
    errors.push(`${path} must be one of: ${schema.enum.join(', ')}`);
  }

  if (typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      errors.push(`${path} must have length >= ${schema.minLength}`);
    }
    if (schema.pattern) {
      const re = new RegExp(schema.pattern);
      if (!re.test(value)) {
        errors.push(`${path} must match ${schema.pattern}`);
      }
    }
  }

  if (typeof value === 'number') {
    if (schema.minimum !== undefined && value < schema.minimum) {
      errors.push(`${path} must be >= ${schema.minimum}`);
    }
    if (schema.maximum !== undefined && value > schema.maximum) {
      errors.push(`${path} must be <= ${schema.maximum}`);
    }
  }

  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      errors.push(`${path} must contain at least ${schema.minItems} item(s)`);
    }
    if (schema.maxItems !== undefined && value.length > schema.maxItems) {
      errors.push(`${path} must contain at most ${schema.maxItems} item(s)`);
    }
    if (schema.items) {
      value.forEach((item, index) => validateNode(schema.items, item, `${path}[${index}]`, errors));
    }
    return;
  }

  if (value && typeof value === 'object') {
    const props = schema.properties ?? {};
    for (const requiredKey of schema.required ?? []) {
      if (!(requiredKey in value)) {
        errors.push(`${path}.${requiredKey} is required`);
      }
    }
    for (const [key, childSchema] of Object.entries(props)) {
      if (key in value) {
        validateNode(childSchema, value[key], `${path}.${key}`, errors);
      }
    }
        if (schema.additionalProperties === false) {
      const allowed = new Set(Object.keys(props));
      for (const key of Object.keys(value)) {
        if (!allowed.has(key)) {
          errors.push(`${path}.${key} is not allowed`);
        }
      }
    }
  }
}

export function validateAgainstSchema(schema, value, rootPath = '$') {
  const errors = [];
  validateNode(schema, value, rootPath, errors);
  return errors;
}

export function loadSchema(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}
