export type HomepageEventName =
  | 'homepage_hero_cta_click'
  | 'homepage_leasing_search_submit'
  | 'homepage_whatsapp_start'
  | 'homepage_viewing_request_submit';

type EventPayload = Record<string, unknown>;

interface HomepageTrackedEvent {
  event: HomepageEventName;
  timestamp: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    dataLayer?: HomepageTrackedEvent[];
  }
}

/**
 * Phase 33 conversion tracking helper.
 * Pushes a normalized event payload to dataLayer and broadcasts a browser custom event.
 */
export function trackHomepageEvent(event: HomepageEventName, payload: EventPayload = {}): void {
  const eventData: HomepageTrackedEvent = {
    event,
    timestamp: new Date().toISOString(),
    ...payload,
  };

  if (typeof window === 'undefined') return;

  if (!Array.isArray(window.dataLayer)) {
    window.dataLayer = [];
  }

  window.dataLayer.push(eventData);
  window.dispatchEvent(new CustomEvent('wc-homepage-event', { detail: eventData }));
}
