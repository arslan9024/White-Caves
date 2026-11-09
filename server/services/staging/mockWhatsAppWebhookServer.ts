/**
 * mockWhatsAppWebhookServer.ts
 * Lightweight local staging mock service for Meta WhatsApp Cloud API webhooks.
 * Simulates inbound customer messages, delivery receipts, and verification handshakes.
 */

import http from 'http';

const PORT = parseInt(process.env.MOCK_WHATSAPP_PORT || '8085', 10);
const TARGET_API_URL = process.env.TARGET_API_URL || 'http://localhost:5001/api/whatsapp/webhook';
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'white_caves_staging_token';

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${PORT}`);

  // Meta Webhook Verification challenge
  if (req.method === 'GET' && url.pathname === '/webhook') {
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      return res.end(challenge);
    }
    res.writeHead(403);
    return res.end('Verification failed');
  }

  // Health check
  if (req.method === 'GET' && url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok', service: 'mock-whatsapp-webhook-staging' }));
  }

  // Trigger synthetic inbound message to main backend
  if (req.method === 'POST' && url.pathname === '/simulate-inbound') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const phone = parsed.phone || '+971505760056';
        const text = parsed.text || 'Hello, I want to inquire about luxury penthouses in Palm Jumeirah';

        const metaPayload = {
          object: 'whatsapp_business_account',
          entry: [
            {
              id: 'STAGING_WA_BIZ_ID',
              changes: [
                {
                  value: {
                    messaging_product: 'whatsapp',
                    metadata: { display_phone_number: '+971500000000', phone_number_id: 'STAGING_PHONE_ID' },
                    contacts: [{ profile: { name: 'VIP Lead (Staging)' }, wa_id: phone.replace('+', '') }],
                    messages: [
                      {
                        from: phone.replace('+', ''),
                        id: `wamid.staging_${Date.now()}`,
                        timestamp: `${Math.floor(Date.now() / 1000)}`,
                        text: { body: text },
                        type: 'text',
                      },
                    ],
                  },
                  field: 'messages',
                },
              ],
            },
          ],
        };

        // Forward to the backend WhatsApp webhook endpoint
        const targetReq = http.request(
          TARGET_API_URL,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-hub-signature-256': 'sha256=staging_mock_signature',
            },
          },
          targetRes => {
            res.writeHead(targetRes.statusCode || 200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, forwardedTo: TARGET_API_URL, status: targetRes.statusCode }));
          }
        );

        targetReq.on('error', err => {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: err.message }));
        });

        targetReq.write(JSON.stringify(metaPayload));
        targetReq.end();
      } catch (err: any) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`[Mock WhatsApp Webhook Server] Listening on port ${PORT}`);
});
