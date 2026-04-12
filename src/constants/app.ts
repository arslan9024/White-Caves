/**
 * Application-wide timing and limit constants
 *
 * Centralizes magic numbers used across the codebase for easier
 * maintenance, team readability, and consistent UX behaviour.
 *
 * Usage:
 *   import { TIMING, LIMITS } from '@/constants/app';
 *   setTimeout(onClose, TIMING.TOAST_EXIT_ANIMATION);
 */

// ─── Timing Constants (ms) ───────────────────────────────────────────────

export const TIMING = {
  /** Toast exit fade-out animation before removing from DOM */
  TOAST_EXIT_ANIMATION: 300,

  /** Map skeleton → real content delay */
  MAP_LOAD_DELAY: 500,

  /** Focus delay after dropdown opens */
  FOCUS_DELAY: 100,

  /** Loading spinner minimum display time */
  LOADING_SPINNER_MIN: 1000,

  /** Simulated API call duration (contact form, publisher, etc.) */
  SIMULATED_API_DELAY: 1500,

  /** Copy-to-clipboard "Copied!" feedback duration */
  COPY_FEEDBACK: 2000,

  /** Success message auto-dismiss (e.g. form submit confirmation) */
  SUCCESS_DISMISS: 3000,

  /** Notification banner auto-dismiss */
  NOTIFICATION_DISMISS: 4000,

  /** Testimonial carousel autoplay interval */
  CAROUSEL_AUTOPLAY: 5000,

  /** Resume autoplay after user interaction */
  CAROUSEL_RESUME: 10000,

  /** Brief delay before page navigation after auth success */
  NAVIGATION_DELAY: 1000,

  /** Form success state auto-reset (longer dismiss) */
  FORM_RESET_DELAY: 5000,

  /** Session timeout (30 minutes) */
  SESSION_TIMEOUT: 1_800_000,
} as const;

// ─── Input / Validation Limits ───────────────────────────────────────────

export const LIMITS = {
  /** Platform / company name max characters */
  PLATFORM_NAME_MAX: 100,

  /** Email address max length (RFC 5321) */
  EMAIL_MAX: 254,

  /** Phone number max digits */
  PHONE_MAX: 15,

  /** Message / textarea max characters */
  MESSAGE_MAX: 2000,

  /** File upload max size (10 MB) */
  FILE_UPLOAD_MAX_BYTES: 10 * 1024 * 1024,

  /** Notification dropdown max visible items */
  NOTIFICATION_DISPLAY_MAX: 5,

  /** Notification badge cap (displays "9+") */
  NOTIFICATION_BADGE_CAP: 9,

  /** Backup interval minimum (hours) */
  BACKUP_INTERVAL_MIN_HOURS: 1,

  /** Minimum password length */
  PASSWORD_MIN: 8,
} as const;

// ─── UI Dimensions ───────────────────────────────────────────────────────

export const DIMENSIONS = {
  /** TopBar fixed height */
  TOPBAR_HEIGHT: 56,

  /** Sidebar icon rail width */
  SIDEBAR_RAIL_WIDTH: 64,

  /** Sidebar flyout panel width */
  SIDEBAR_FLYOUT_WIDTH: 240,

  /** Mobile breakpoint (px) */
  MOBILE_BREAKPOINT: 768,

  /** Tablet breakpoint (px) */
  TABLET_BREAKPOINT: 1024,
} as const;

// ─── Type exports for strict usage ───────────────────────────────────────

export type TimingKey = keyof typeof TIMING;
export type LimitsKey = keyof typeof LIMITS;
export type DimensionsKey = keyof typeof DIMENSIONS;
