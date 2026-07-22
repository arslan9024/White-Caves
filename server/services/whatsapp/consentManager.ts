import { prisma } from '../../database.js';

/**
 * Checks if a phone number has opted in/out of WhatsApp communications.
 * Defaults to true if no consent record exists.
 */
export async function hasWhatsAppConsent(phone: string): Promise<boolean> {
  const consentRecord = await prisma.whatsAppConsent.findUnique({
    where: { phone },
  });

  return consentRecord ? consentRecord.consent : true;
}

/**
 * Sets the WhatsApp consent status for a phone number.
 */
export async function setWhatsAppConsent(phone: string, consent: boolean): Promise<void> {
  await prisma.whatsAppConsent.upsert({
    where: { phone },
    update: {
      consent,
      optedOutAt: consent ? null : new Date(),
      updatedAt: new Date(),
    },
    create: {
      phone,
      consent,
      optedOutAt: consent ? null : new Date(),
    },
  });

  // Audit log in Activity
  await prisma.activity.create({
    data: {
      type: 'system',
      action: consent ? 'opt_in' : 'opt_out',
      description: `WhatsApp communication ${consent ? 'opt-in' : 'opt-out'} logged for ${phone}`,
      metadata: { phone },
    },
  });
}
