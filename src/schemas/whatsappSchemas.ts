import { z } from 'zod';

export const WhatsAppSenderEnum = z.enum(['client', 'nina', 'arslan', 'system']);

export const WhatsAppMessageStatusEnum = z.enum(['sent', 'delivered', 'read', 'failed', 'pending']);

export const WhatsAppMessageSchema = z.object({
  id: z.string().min(1),
  sender: WhatsAppSenderEnum,
  senderName: z.string().min(1),
  text: z.string(),
  timestamp: z.string(),
  status: WhatsAppMessageStatusEnum,
  intent: z.string().optional(),
  leadScore: z.number().min(0).max(100).optional(),
});

export const WhatsAppContactSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  phone: z.string().regex(/^\+?[0-9\s\-()]{7,20}$/, 'Invalid phone number format'),
  lastMessage: z.string().default(''),
  unreadCount: z.number().int().nonnegative().default(0),
  timestamp: z.string(),
  avatar: z.string().optional(),
  leadScore: z.number().min(0).max(100).default(50),
  status: z.enum(['HOT', 'WARM', 'COLD', 'CLIENT', 'VIP']).default('WARM'),
  assignedAgent: z.string().optional(),
});

export const WhatsAppSessionStatusSchema = z.object({
  status: z.enum(['DISCONNECTED', 'PAIRING', 'CONNECTED', 'AUTHENTICATING', 'ERROR']),
  pairedPhone: z.string().optional(),
  pairingCode: z.string().optional(),
  batteryLevel: z.number().min(0).max(100).optional(),
  lastSeen: z.string().optional(),
});

export type WhatsAppMessage = z.infer<typeof WhatsAppMessageSchema>;
export type WhatsAppContact = z.infer<typeof WhatsAppContactSchema>;
export type WhatsAppSessionStatus = z.infer<typeof WhatsAppSessionStatusSchema>;
