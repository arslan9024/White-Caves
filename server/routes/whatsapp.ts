import { Router, Request, Response } from 'express';
import { getLindaClient, LindaStatus } from '../services/whatsapp/lindaClient.js';
import { NinaService } from '../services/NinaService.js';
import qrcode from 'qrcode';

const router = Router();

/**
 * GET /api/whatsapp/status
 * Returns current WhatsApp engine connection status and stats
 */
router.get('/status', (req: Request, res: Response) => {
  const client = getLindaClient();
  const stats = client.getStats();
  return res.json({
    success: true,
    data: {
      ...stats,
      qrAvailable: Boolean(client.getQRCode()),
    },
  });
});

/**
 * GET /api/whatsapp/qr
 * Returns current QR code as Data URL (image/png base64) for frontend scanning
 */
router.get('/qr', async (req: Request, res: Response) => {
  const client = getLindaClient();
  const qrString = client.getQRCode();

  if (!qrString) {
    return res.json({
      success: false,
      message: client.isConnected() ? 'Already authenticated and connected!' : 'QR code not generated yet. Client is initializing...',
      status: client.getStatus(),
    });
  }

  try {
    const qrDataUrl = await qrcode.toDataURL(qrString, { margin: 2, scale: 6 });
    return res.json({
      success: true,
      data: {
        qrCode: qrDataUrl,
        rawQr: qrString,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Failed to render QR code image',
    });
  }
});

interface WhatsAppPairCodePayload {
  phoneNumber: string;
}

interface WhatsAppSendMessagePayload {
  to: string;
  message: string;
}

interface WhatsAppNinaPayload {
  message: string;
  from?: string;
  senderName?: string;
}

function validatePairCodePayload(body: unknown): WhatsAppPairCodePayload {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid request body');
  }
  const { phoneNumber } = body as Record<string, unknown>;
  if (!phoneNumber || typeof phoneNumber !== 'string' || !phoneNumber.trim()) {
    throw new Error('phoneNumber is required and must be a non-empty string');
  }
  return { phoneNumber: phoneNumber.trim() };
}

function validateSendMessagePayload(body: unknown): WhatsAppSendMessagePayload {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid request body');
  }
  const { to, message } = body as Record<string, unknown>;
  if (!to || typeof to !== 'string' || !to.trim() || !message || typeof message !== 'string' || !message.trim()) {
    throw new Error('Both "to" and "message" string parameters are required');
  }
  return { to: to.trim(), message: message.trim() };
}

function validateNinaProcessPayload(body: unknown): WhatsAppNinaPayload {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid request body');
  }
  const { message, from, senderName } = body as Record<string, unknown>;
  if (!message || typeof message !== 'string' || !message.trim()) {
    throw new Error('message string is required');
  }
  return {
    message: message.trim(),
    from: typeof from === 'string' ? from.trim() : undefined,
    senderName: typeof senderName === 'string' ? senderName.trim() : undefined,
  };
}

/**
 * POST /api/whatsapp/pair-code
 * Request an 8-character Pairing Code for Linking Device via Phone Number (No Camera Needed)
 */
router.post('/pair-code', async (req: Request, res: Response) => {
  let validated: WhatsAppPairCodePayload;
  try {
    validated = validatePairCodePayload(req.body);
  } catch (valErr) {
    return res.status(400).json({ success: false, error: valErr instanceof Error ? valErr.message : 'Validation failed' });
  }

  const { phoneNumber } = validated;

  try {
    const client = getLindaClient();
    const code = await client.requestPairingCode(phoneNumber);
    return res.json({
      success: true,
      data: {
        phoneNumber,
        pairingCode: code,
        instructions: 'Open WhatsApp on your phone -> Linked Devices -> Link with phone number -> Enter this code',
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : 'Failed to generate pairing code',
    });
  }
});

/**
 * POST /api/whatsapp/send
 * Outbound WhatsApp message sending endpoint
 */
router.post('/send', async (req: Request, res: Response) => {
  let validated: WhatsAppSendMessagePayload;
  try {
    validated = validateSendMessagePayload(req.body);
  } catch (valErr) {
    return res.status(400).json({ success: false, error: valErr instanceof Error ? valErr.message : 'Validation failed' });
  }

  const { to, message } = validated;

  try {
    const client = getLindaClient();
    if (!client.isConnected()) {
      return res.status(400).json({
        success: false,
        error: 'WhatsApp client is not connected yet. Please link device via QR code or Pairing Code first.',
        status: client.getStatus(),
      });
    }

    const messageId = await client.sendMessage(to, message);
    return res.json({
      success: true,
      data: {
        to,
        messageId,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : 'Failed to send WhatsApp message',
    });
  }
});

/**
 * POST /api/whatsapp/logout
 * Disconnects WhatsApp session and clears local auth tokens
 */
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const client = getLindaClient();
    await client.disconnect();
    return res.json({
      success: true,
      message: 'WhatsApp session disconnected successfully.',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : 'Failed to disconnect WhatsApp',
    });
  }
});

/**
 * POST /api/whatsapp/nina/process
 * Sandbox endpoint to test Nina's NLP intent classification & state machine without sending actual messages
 */
router.post('/nina/process', async (req: Request, res: Response) => {
  let validated: WhatsAppNinaPayload;
  try {
    validated = validateNinaProcessPayload(req.body);
  } catch (valErr) {
    return res.status(400).json({ success: false, error: valErr instanceof Error ? valErr.message : 'Validation failed' });
  }

  const { message, from, senderName } = validated;

  try {
    const result = await NinaService.process({
      message,
      from: from || '971500000000',
      senderName: senderName || 'Sandbox Test User',
    });

    return res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : 'Nina processing failed',
    });
  }
});

export default router;
