/**
 * PushNotificationService — Wave 23 Enhanced
 *
 * Handles FCM push notifications for CRM events:
 *  - Lead assigned
 *  - Viewing reminder (30 min before)
 *  - Rent due reminder
 *  - Maintenance update
 *  - Offer received
 *  - Lease expiry alert
 *
 * Uses Firebase Admin SDK if initialized; falls back to console logging.
 * Automatically cleans up stale (unregistered) FCM tokens.
 *
 * @agent @Mira — Wave 23 (W23-005, W23-006, W23-007)
 */

import admin from 'firebase-admin';
import { prisma } from '../database.js';

interface PushPayload {
  title: string;
  body: string;
  url?: string;
}

interface CRMNotificationData {
  type: string;
  entityId?: string;
  url: string;
  phone?: string;
  lat?: string;
  lng?: string;
  tag?: string;
}

export class PushNotificationService {
  /**
   * Send a push notification to a specific user (all their registered devices)
   */
  static async sendToUser(userId: string, payload: PushPayload) {
    try {
      const tokens = await prisma.userPushToken.findMany({
        where: { userId },
      });

      if (tokens.length === 0) return;

      const messages = tokens.map((t: { token: string }) => ({
        token: t.token,
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: {
          url: payload.url || '/',
        },
      }));

      try {
        const response = await admin.messaging().sendEach(messages);

        // Remove stale tokens
        const staleTokens: string[] = [];
        response.responses.forEach((res, idx) => {
          if (!res.success && res.error?.code === 'messaging/registration-token-not-registered') {
            staleTokens.push(tokens[idx].token);
          }
        });

        if (staleTokens.length > 0) {
          await prisma.userPushToken.deleteMany({
            where: { token: { in: staleTokens } },
          });
        }
      } catch (err: any) {
        if (err.code === 'app/no-app') {
          console.warn('[Push] Firebase Admin not initialized. Logging push:', payload.title);
        } else {
          throw err;
        }
      }
    } catch (error) {
      console.error('[Push] Error sending notification:', error);
    }
  }

  /**
   * Send CRM-aware push with additional data fields
   */
  static async sendCRMNotification(userId: string, payload: PushPayload, data: CRMNotificationData) {
    try {
      const tokens = await prisma.userPushToken.findMany({
        where: { userId },
      });

      if (tokens.length === 0) return;

      const messages = tokens.map((t: { token: string }) => ({
        token: t.token,
        notification: {
          title: payload.title,
          body: payload.body,
          icon: '/generated-icon.png',
        },
        data: {
          type: data.type,
          entityId: data.entityId || '',
          url: data.url,
          phone: data.phone || '',
          lat: data.lat || '',
          lng: data.lng || '',
          tag: data.tag || data.type,
        },
      }));

      try {
        const response = await admin.messaging().sendEach(messages);

        const staleTokens: string[] = [];
        response.responses.forEach((res, idx) => {
          if (!res.success && res.error?.code === 'messaging/registration-token-not-registered') {
            staleTokens.push(tokens[idx].token);
          }
        });

        if (staleTokens.length > 0) {
          await prisma.userPushToken.deleteMany({
            where: { token: { in: staleTokens } },
          });
        }

        console.log(`[Push] CRM notification '${data.type}' sent to user ${userId} (${tokens.length} devices)`);
      } catch (err: any) {
        if (err.code === 'app/no-app') {
          console.warn(`[Push] Firebase Admin not initialized. Would send '${data.type}' to user ${userId}:`, payload.title);
        } else {
          throw err;
        }
      }
    } catch (error) {
      console.error(`[Push] Error sending CRM notification '${data.type}':`, error);
    }
  }

  // ─── CRM-Specific Notification Senders ──────────────────────────────────

  /**
   * W23-006: New lead assigned — fires within 30s of assignment
   * Action buttons: "View Lead" / "Call Now"
   */
  static async sendLeadAssignedNotification(
    agentUserId: string,
    lead: { id: string; name: string; area?: string; budget?: string; phone?: string }
  ) {
    const budgetText = lead.budget ? ` | Budget: ${lead.budget}` : '';
    const areaText = lead.area || 'Dubai';

    await PushNotificationService.sendCRMNotification(
      agentUserId,
      {
        title: '🆕 New Lead Assigned',
        body: `${lead.name} — ${areaText}${budgetText}`,
        url: `/crm/leads/${lead.id}`,
      },
      {
        type: 'lead_assigned',
        entityId: lead.id,
        url: `/crm/leads/${lead.id}`,
        phone: lead.phone || '',
        tag: `lead-${lead.id}`,
      }
    );
  }

  /**
   * W23-007: Viewing reminder — 30 minutes before scheduled viewing
   * Action button: "Get Directions"
   */
  static async sendViewingReminderNotification(
    agentUserId: string,
    viewing: {
      id: string;
      propertyTitle: string;
      clientName: string;
      scheduledAt: Date;
      lat?: string;
      lng?: string;
    }
  ) {
    const timeStr = viewing.scheduledAt.toLocaleTimeString('en-AE', {
      hour: '2-digit',
      minute: '2-digit',
    });

    await PushNotificationService.sendCRMNotification(
      agentUserId,
      {
        title: '📅 Viewing in 30 Minutes',
        body: `${viewing.propertyTitle} with ${viewing.clientName} at ${timeStr}`,
        url: `/crm/viewings/${viewing.id}`,
      },
      {
        type: 'viewing_reminder',
        entityId: viewing.id,
        url: `/crm/viewings/${viewing.id}`,
        lat: viewing.lat || '',
        lng: viewing.lng || '',
        tag: `viewing-${viewing.id}`,
      }
    );
  }

  /**
   * Rent due reminder — 3 days before nextPaymentDue
   */
  static async sendRentDueReminder(
    agentUserId: string,
    lease: { id: string; tenantName: string; amount: string; dueDate: string }
  ) {
    await PushNotificationService.sendCRMNotification(
      agentUserId,
      {
        title: '💰 Rent Due in 3 Days',
        body: `${lease.tenantName} — ${lease.amount} AED due ${lease.dueDate}`,
        url: `/crm/leases/${lease.id}`,
      },
      {
        type: 'rent_due',
        entityId: lease.id,
        url: `/crm/leases/${lease.id}`,
        tag: `rent-${lease.id}`,
      }
    );
  }

  /**
   * Maintenance status update
   */
  static async sendMaintenanceUpdate(
    targetUserId: string,
    ticket: { id: string; title: string; newStatus: string }
  ) {
    await PushNotificationService.sendCRMNotification(
      targetUserId,
      {
        title: `🔧 Maintenance ${ticket.newStatus === 'completed' ? 'Completed' : 'Updated'}`,
        body: `${ticket.title} → ${ticket.newStatus}`,
        url: `/crm/maintenance/${ticket.id}`,
      },
      {
        type: 'maintenance_update',
        entityId: ticket.id,
        url: `/crm/maintenance/${ticket.id}`,
        tag: `maintenance-${ticket.id}`,
      }
    );
  }

  /**
   * Offer received on agent's listed property
   */
  static async sendOfferReceived(
    agentUserId: string,
    offer: { id: string; propertyTitle: string; buyerName: string; amount: string }
  ) {
    await PushNotificationService.sendCRMNotification(
      agentUserId,
      {
        title: '💎 New Offer Received',
        body: `${offer.buyerName} offered ${offer.amount} AED on ${offer.propertyTitle}`,
        url: `/crm/offers/${offer.id}`,
      },
      {
        type: 'offer_received',
        entityId: offer.id,
        url: `/crm/offers/${offer.id}`,
        tag: `offer-${offer.id}`,
      }
    );
  }

  /**
   * Lease expiry alert — 30 days before lease end
   */
  static async sendLeaseExpiryAlert(
    agentUserId: string,
    lease: { id: string; tenantName: string; propertyTitle: string; expiryDate: string }
  ) {
    await PushNotificationService.sendCRMNotification(
      agentUserId,
      {
        title: '⚠️ Lease Expiring Soon',
        body: `${lease.tenantName} at ${lease.propertyTitle} — expires ${lease.expiryDate}`,
        url: `/crm/leases/${lease.id}`,
      },
      {
        type: 'lease_expiry',
        entityId: lease.id,
        url: `/crm/leases/${lease.id}`,
        tag: `lease-${lease.id}`,
      }
    );
  }
}
