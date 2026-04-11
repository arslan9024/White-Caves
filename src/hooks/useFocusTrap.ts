/**
 * useFocusTrap — Traps keyboard focus within a container element.
 *
 * When active, Tab/Shift+Tab cycle through focusable elements
 * inside the container only. Optionally restores focus to the
 * previously focused element on deactivation.
 *
 * Usage:
 *   const ref = useFocusTrap<HTMLDivElement>(isOpen);
 *   <div ref={ref}>...modal content...</div>
 *
 * Focusable elements: buttons, links, inputs, selects, textareas,
 * and elements with tabindex >= 0.
 */

import { useRef, useEffect, useCallback } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]:not([disabled]):not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"]):not([disabled])',
].join(', ');

export function useFocusTrap<T extends HTMLElement = HTMLElement>(
  active: boolean,
  options: {
    /** Restore focus to previously focused element on deactivation. Default true. */
    restoreFocus?: boolean;
    /** Auto-focus the first focusable element when activated. Default true. */
    autoFocus?: boolean;
  } = {},
): React.RefObject<T | null> {
  const { restoreFocus = true, autoFocus = true } = options;
  const containerRef = useRef<T>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Store the element that was focused before the trap activated
  useEffect(() => {
    if (active) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
  }, [active]);

  // Auto-focus first focusable element
  useEffect(() => {
    if (!active || !autoFocus || !containerRef.current) return;

    // Small delay to ensure DOM is ready after render
    const timer = requestAnimationFrame(() => {
      if (!containerRef.current) return;
      const first = containerRef.current.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      first?.focus();
    });

    return () => cancelAnimationFrame(timer);
  }, [active, autoFocus]);

  // Trap focus with Tab / Shift+Tab
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!active || e.key !== 'Tab' || !containerRef.current) return;

    const focusables = containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey) {
      // Shift+Tab: if focus is on first element, wrap to last
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      // Tab: if focus is on last element, wrap to first
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [active]);

  // Attach/detach event listener
  useEffect(() => {
    if (!active) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [active, handleKeyDown]);

  // Restore focus on deactivation
  useEffect(() => {
    if (!active && restoreFocus && previousFocusRef.current) {
      const el = previousFocusRef.current;
      previousFocusRef.current = null;
      // Small delay to avoid focus race conditions
      requestAnimationFrame(() => {
        if (el && typeof el.focus === 'function') {
          el.focus();
        }
      });
    }
  }, [active, restoreFocus]);

  return containerRef;
}

export default useFocusTrap;
