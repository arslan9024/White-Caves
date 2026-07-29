/**
 * White Caves Real Estate — Canonical Contact Constants
 * AEGIS 2.0: Single Source of Truth for all company contact details.
 * Import from here instead of hardcoding anywhere in the codebase.
 *
 * @module constants/contact
 */

/** Primary company phone — used for tel: links and display */
export const WC_PHONE = '+971563616136';

/** Formatted display version (human-readable) */
export const WC_PHONE_DISPLAY = '+971 56 361 6136';

/** WhatsApp number (same line, no spaces) */
export const WC_WHATSAPP = '+971563616136';

/** Pre-filled WhatsApp message URL */
export const WC_WHATSAPP_URL = (message?: string): string =>
  `https://wa.me/${WC_WHATSAPP}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

/** Primary company email */
export const WC_EMAIL = 'admin@whitecaves.com';

/** Office address */
export const WC_ADDRESS = 'Office D-72, El-Shaye-4, Port Saeed, Deira, Dubai, UAE';

/** Company name */
export const WC_COMPANY_NAME = 'White Caves Real Estate LLC';

/** RERA License */
export const WC_RERA_LICENSE = 'DED-1234567';
