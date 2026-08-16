/**
 * custom-sw.js — White Caves CRM Service Worker (Wave 23)
 *
 * Imported by the Workbox-generated SW via importScripts.
 * Handles:
 *  - FCM push events with CRM-aware notification payloads
 *  - notificationclick with focus-existing-window + deep-link routing
 *  - Action button handling (View Lead, Call Now, Get Directions)
 */

/* eslint-env serviceworker */
/* global self, clients */

// ─── Push Event ─────────────────────────────────────────────────────────────

self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};

  // CRM notification type → customize icon + actions
  const notificationType = data.data?.type || data.type || 'generic';

  const actionMap = {
    lead_assigned: [
      { action: 'view', title: 'View Lead' },
      { action: 'call', title: 'Call Now' },
    ],
    viewing_reminder: [
      { action: 'directions', title: 'Get Directions' },
      { action: 'view', title: 'View Details' },
    ],
    rent_due: [
      { action: 'view', title: 'View Payment' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
    maintenance_update: [
      { action: 'view', title: 'View Ticket' },
    ],
    offer_received: [
      { action: 'view', title: 'Review Offer' },
    ],
    lease_expiry: [
      { action: 'view', title: 'View Lease' },
    ],
    generic: [
      { action: 'view', title: 'View' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };

  const options = {
    body: data.notification?.body || data.body || 'New update from White Caves CRM',
    icon: data.notification?.icon || '/generated-icon.png',
    badge: '/favicon.svg',
    vibrate: [100, 50, 100],
    tag: data.data?.tag || notificationType,
    renotify: true,
    data: {
      url: data.data?.url || '/',
      type: notificationType,
      entityId: data.data?.entityId || null,
      phone: data.data?.phone || null,
      lat: data.data?.lat || null,
      lng: data.data?.lng || null,
    },
    actions: actionMap[notificationType] || actionMap.generic,
  };

  const title = data.notification?.title || data.title || 'White Caves CRM';

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// ─── Notification Click ─────────────────────────────────────────────────────

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const { url, type, phone, lat, lng } = event.notification.data || {};
  const action = event.action;

  // Handle action buttons
  if (action === 'call' && phone) {
    event.waitUntil(clients.openWindow(`tel:${phone}`));
    return;
  }

  if (action === 'directions' && lat && lng) {
    // Prefer Google Maps on Android, Apple Maps on iOS
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    event.waitUntil(clients.openWindow(mapsUrl));
    return;
  }

  if (action === 'dismiss') {
    return; // Just close the notification
  }

  // Default: navigate to the CRM page
  const targetUrl = url || '/crm/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Try to focus an existing window with the same origin
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          // Navigate the existing window to the target URL
          client.navigate(targetUrl);
          return;
        }
      }
      // No existing window — open a new one
      return clients.openWindow(targetUrl);
    })
  );
});

// ─── Notification Close (analytics) ────────────────────────────────────────

self.addEventListener('notificationclose', (event) => {
  const { type } = event.notification.data || {};
});

// ─── Offline Portal Pre-Caching & Stale-While-Revalidate ────────────────────

const CACHE_NAME = 'white-caves-portals-v2026.08';
const OFFLINE_URLS = [
  '/',
  '/landlord',
  '/tenant',
  '/properties',
  '/offline.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS).catch((err) => {
        // Soft error fallback for dynamic assets
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || caches.match('/offline.html');
        });
      })
    );
  }
});

