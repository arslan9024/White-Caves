/**
 * useFormValidation — Schema-driven real-time form validation hook
 *
 * Usage:
 *   const { values, errors, touched, handleChange, handleBlur, handleSubmit, isValid, reset } =
 *     useFormValidation(signInSchema, { email: '', password: '' });
 *
 * Validates on blur (per-field) and on submit (all fields).
 */

import { useState, useCallback, useMemo, type ChangeEvent, type FormEvent } from 'react';
import {
  type ValidationSchema,
  type ValidationErrors,
  validate,
  validateField,
  hasErrors,
} from '@/utils/validation';

/* ──────────────────── Types ──────────────────── */

export interface UseFormValidation<T extends Record<string, unknown>> {
  /** Current field values */
  values: T;
  /** Current validation errors (only dirty/touched fields shown) */
  errors: ValidationErrors;
  /** Map of fields that have been blurred at least once */
  touched: Record<keyof T, boolean>;
  /** Handle input change — syncs value + clears its error if field was touched */
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  /** Handle input blur — triggers single-field validation */
  handleBlur: (e: { target: { name: string } }) => void;
  /** Wrap your submit callback — validates all fields first, calls `onValid` only if clean */
  handleSubmit: (onValid: (values: T) => void | Promise<void>) => (e: FormEvent) => void;
  /** Set a specific field's value programmatically */
  setFieldValue: (name: keyof T, value: unknown) => void;
  /** Whether the entire form currently passes validation */
  isValid: boolean;
  /** Reset form to initial values (or override with new ones) */
  reset: (newValues?: Partial<T>) => void;
}

/* ──────────────────── Hook ──────────────────── */

export function useFormValidation<T extends Record<string, unknown>>(
  schema: ValidationSchema,
  initialValues: T,
): UseFormValidation<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  /* ── Derived ── */

  const isValid = useMemo(() => {
    const allErrors = validate(schema, values as Record<string, unknown>);
    return !hasErrors(allErrors);
  }, [schema, values]);

  /* ── Handlers ── */

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const newValue =
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

      setValues((prev: any) => ({ ...prev, [name]: newValue }));

      // If already touched or submit was attempted, re-validate this field immediately
      if (touched[name] || submitAttempted) {
        const fieldValidators = schema[name];
        if (fieldValidators) {
          const error = validateField(fieldValidators, newValue);
          setErrors((prev: any) => {
            if (error) return { ...prev, [name]: error };
            const next = { ...prev };
            delete next[name];
            return next;
          });
        }
      }
    },
    [schema, touched, submitAttempted],
  );

  const handleBlur = useCallback(
    (e: { target: { name: string } }) => {
      const { name } = e.target;
      setTouched((prev: any) => ({ ...prev, [name]: true }));

      const fieldValidators = schema[name];
      if (fieldValidators) {
        const error = validateField(fieldValidators, (values as Record<string, unknown>)[name]);
        setErrors((prev: any) => {
          if (error) return { ...prev, [name]: error };
          const next = { ...prev };
          delete next[name];
          return next;
        });
      }
    },
    [schema, values],
  );

  const handleSubmit = useCallback(
    (onValid: (vals: T) => void | Promise<void>) => {
      return (e: FormEvent) => {
        e.preventDefault();
        setSubmitAttempted(true);

        // Mark all fields as touched
        const allTouched: Record<string, boolean> = {};
        for (const key of Object.keys(schema)) {
          allTouched[key] = true;
        }
        setTouched(allTouched as any);

        // Validate all
        const allErrors = validate(schema, values as Record<string, unknown>);
        setErrors(allErrors);

        if (!hasErrors(allErrors)) {
          onValid(values);
        }
      };
    },
    [schema, values],
  );

  const setFieldValue = useCallback(
    (name: keyof T, value: unknown) => {
      setValues((prev: any) => ({ ...prev, [name]: value }));

      if (touched[name as string] || submitAttempted) {
        const fieldValidators = schema[name as string];
        if (fieldValidators) {
          const error = validateField(fieldValidators, value);
          setErrors((prev: any) => {
            if (error) return { ...prev, [name as string]: error };
            const next = { ...prev };
            delete next[name as string];
            return next;
          });
        }
      }
    },
    [schema, touched, submitAttempted],
  );

  const reset = useCallback(
    (newValues?: Partial<T>) => {
      setValues(newValues ? { ...initialValues, ...newValues } : initialValues);
      setErrors({});
      setTouched({} as any);
      setSubmitAttempted(false);
    },
    [initialValues],
  );

  return { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isValid, reset };
}
