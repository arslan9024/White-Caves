/**
 * useFormValidation — Unit tests
 *
 * Follows White Caves Pattern A (no wrapper needed — hook is context-free).
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFormValidation } from './useFormValidation';
import { createSchema, required, minLength, emailValidator, hasErrors } from '@/utils/validation';

// ── Test schema ──────────────────────────────────────────────────────
const testSchema = createSchema({
  name: [required('Name is required'), minLength(2, 'Min 2 chars')],
  email: [required('Email is required'), emailValidator()],
});

const initial = { name: '', email: '' };

// ═══════════════════════════════════════════════════════════════════════
describe('useFormValidation', () => {
  // ── Initial state ──────────────────────────────────────────────────
  it('initializes with provided values', () => {
    const { result } = renderHook(() => useFormValidation(testSchema, initial));
    expect(result.current.values).toEqual({ name: '', email: '' });
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });

  it('reports isValid correctly for empty required fields', () => {
    const { result } = renderHook(() => useFormValidation(testSchema, initial));
    expect(result.current.isValid).toBe(false);
  });

  it('reports isValid=true when all fields are valid', () => {
    const { result } = renderHook(() =>
      useFormValidation(testSchema, { name: 'Ali', email: 'ali@test.com' }),
    );
    expect(result.current.isValid).toBe(true);
  });

  // ── handleChange ───────────────────────────────────────────────────
  it('updates value on change', () => {
    const { result } = renderHook(() => useFormValidation(testSchema, initial));
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Ali', type: 'text' },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.values.name).toBe('Ali');
  });

  it('does not show error before blur (untouched field)', () => {
    const { result } = renderHook(() => useFormValidation(testSchema, initial));
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: '', type: 'text' },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.errors.name).toBeUndefined();
  });

  // ── handleBlur ─────────────────────────────────────────────────────
  it('marks field as touched on blur', () => {
    const { result } = renderHook(() => useFormValidation(testSchema, initial));
    act(() => {
      result.current.handleBlur({ target: { name: 'name' } });
    });
    expect(result.current.touched.name).toBe(true);
  });

  it('shows error on blur when field is invalid', () => {
    const { result } = renderHook(() => useFormValidation(testSchema, initial));
    act(() => {
      result.current.handleBlur({ target: { name: 'name' } });
    });
    expect(result.current.errors.name).toBe('Name is required');
  });

  it('clears error on blur when field becomes valid', () => {
    const { result } = renderHook(() => useFormValidation(testSchema, initial));
    // First blur with empty = error
    act(() => {
      result.current.handleBlur({ target: { name: 'name' } });
    });
    expect(result.current.errors.name).toBeTruthy();
    // Type valid value then blur again
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Ali', type: 'text' },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    act(() => {
      result.current.handleBlur({ target: { name: 'name' } });
    });
    expect(result.current.errors.name).toBeUndefined();
  });

  // ── handleChange after touch → live validation ─────────────────────
  it('re-validates on change after field has been touched', () => {
    const { result } = renderHook(() => useFormValidation(testSchema, initial));
    // Touch the field
    act(() => {
      result.current.handleBlur({ target: { name: 'name' } });
    });
    expect(result.current.errors.name).toBe('Name is required');
    // Type a single char (too short)
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'A', type: 'text' },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.errors.name).toBe('Min 2 chars');
    // Fix it
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Ali', type: 'text' },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.errors.name).toBeUndefined();
  });

  // ── handleSubmit ───────────────────────────────────────────────────
  it('prevents submission when fields are invalid', () => {
    const { result } = renderHook(() => useFormValidation(testSchema, initial));
    const onValid = vi.fn();
    act(() => {
      result.current.handleSubmit(onValid)({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });
    expect(onValid).not.toHaveBeenCalled();
    expect(result.current.errors.name).toBeTruthy();
    expect(result.current.errors.email).toBeTruthy();
  });

  it('calls onValid when all fields pass', () => {
    const { result } = renderHook(() =>
      useFormValidation(testSchema, { name: 'Ali', email: 'ali@test.com' }),
    );
    const onValid = vi.fn();
    act(() => {
      result.current.handleSubmit(onValid)({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });
    expect(onValid).toHaveBeenCalledWith({ name: 'Ali', email: 'ali@test.com' });
  });

  it('marks all fields as touched on submit attempt', () => {
    const { result } = renderHook(() => useFormValidation(testSchema, initial));
    act(() => {
      result.current.handleSubmit(vi.fn())({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });
    expect(result.current.touched.name).toBe(true);
    expect(result.current.touched.email).toBe(true);
  });

  // ── setFieldValue ──────────────────────────────────────────────────
  it('sets field value programmatically', () => {
    const { result } = renderHook(() => useFormValidation(testSchema, initial));
    act(() => {
      result.current.setFieldValue('email', 'test@mail.com');
    });
    expect(result.current.values.email).toBe('test@mail.com');
  });

  // ── reset ──────────────────────────────────────────────────────────
  it('resets to initial values', () => {
    const { result } = renderHook(() => useFormValidation(testSchema, initial));
    // Modify state
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Ali', type: 'text' },
      } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleBlur({ target: { name: 'name' } });
    });
    expect(result.current.values.name).toBe('Ali');
    expect(result.current.touched.name).toBe(true);

    // Reset
    act(() => {
      result.current.reset();
    });
    expect(result.current.values).toEqual(initial);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });

  it('resets with partial override', () => {
    const { result } = renderHook(() => useFormValidation(testSchema, initial));
    act(() => {
      result.current.reset({ name: 'Override' });
    });
    expect(result.current.values.name).toBe('Override');
    expect(result.current.values.email).toBe('');
  });

  // ── Checkbox support ───────────────────────────────────────────────
  it('handles checkbox input via type=checkbox', () => {
    const schema = createSchema({ agree: [required('Must agree')] });
    const { result } = renderHook(() =>
      useFormValidation(schema, { agree: false }),
    );
    act(() => {
      result.current.handleChange({
        target: { name: 'agree', value: '', type: 'checkbox', checked: true },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.values.agree).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// vi import needed for vi.fn() calls
import { vi } from 'vitest';
