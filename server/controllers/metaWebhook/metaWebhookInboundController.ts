import { Request, Response } from 'express';
import { WebhookEvent } from '../../services/whatsapp/metaAPI.js';
import { verifyWebhookSignature } from '../../services/whatsapp/whatsappUtils.js';
import { getMetaClient } from './metaWebhookCommon.js';
import {
  handleIncomingMessage,
  handleStatusUpdate,
} from './metaWebhookMessageHandler.js';

export const verifyWebhookHandler = (req: Request, res: Response) => {
  try {
    const mode = req.query['hub.mode'] as string;
    const challenge = req.query['hub.challenge'] as string;
    const verifyToken = req.query['hub.verify_token'] as string;

    console.log('[Meta Webhook] Verification request:', { mode, verifyToken: '***' });

    const meta = getMetaClient();
    const result = meta.verifyWebhook(mode, challenge, verifyToken);

    if (result) {
      res.set('Content-Type', 'text/plain');
      res.send(result);
      console.log('[Meta Webhook] Verification successful');
    } else {
      console.warn('[Meta Webhook] Verification failed - invalid token or mode');
      res.status(403).json({
        success: false,
        error: 'Verification failed',
      });
    }
  } catch (error) {
    console.error('[Meta Webhook] Verification error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const inboundWebhookHandler = async (req: Request, res: Response) => {
  try {
    const appSecret = process.env.META_APP_SECRET;
    if (appSecret) {
      const signature = req.headers['x-hub-signature-256'] as string | undefined;
      if (!signature) {
        console.warn('[Meta Webhook] Missing x-hub-signature-256 header — rejecting');
        res.status(403).json({ success: false, error: 'Missing signature header' });
        return;
      }

      const rawBody = (req as Request & { rawBody?: string }).rawBody;
      if (!rawBody) {
        console.warn('[Meta Webhook] Missing rawBody for signature verification — rejecting');
        res.status(500).json({ success: false, error: 'Webhook raw body unavailable' });
        return;
      }

      if (!verifyWebhookSignature(rawBody, signature, appSecret)) {
        console.warn('[Meta Webhook] Invalid signature — rejecting');
        res.status(403).json({ success: false, error: 'Invalid signature' });
        return;
      }
    }

    console.log('[Meta Webhook] Incoming webhook event');
    res.json({ success: true });

    const meta = getMetaClient();
    const event: WebhookEvent = meta.parseWebhookEvent(req.body);

    if (event.entry[0]?.changes[0]?.value?.messaging_product !== 'whatsapp') {
      console.log('[Meta Webhook] Ignoring non-WhatsApp event');
      return;
    }

    const processingTasks: Promise<void>[] = [];
    for (const entry of event.entry) {
      for (const change of entry.changes) {
        const value = change.value;

        if (value.messages) {
          for (const message of value.messages) {
            const contactName =
              value.contacts?.find((c: any) => c.wa_id === message.from)?.profile?.name ||
              value.contacts?.[0]?.profile?.name;
            processingTasks.push(
              handleIncomingMessage(message, value.metadata?.phone_number_id || '', contactName).catch(
                err => console.error(err)
              )
            );
          }
        }

        if (value.statuses) {
          for (const status of value.statuses) {
            processingTasks.push(handleStatusUpdate(status).catch(err => console.error(err)));
          }
        }
      }
    }
  } catch (error) {
    console.error('[Meta Webhook] Error processing event:', error);
    res.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

