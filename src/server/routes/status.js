// src/server/routes/status.js

import express from 'express';
import { requireGmailUser } from '../middleware/authMiddleware.js';
import { enabledServices } from '../config/serviceConfig.js';

const router = express.Router();

/**
 * GET /api/status
 * Returns the list of currently enabled services.
 * Only the primary Gmail user can access.
 */
router.get('/', requireGmailUser, (req, res) => {
  const services = Array.from(enabledServices);
  res.json({ services, user: req.user.email });
});

/**
 * POST /api/status
 * Enable or disable a service at runtime (in‑memory only).
 * Body: { service: string, action: 'enable' | 'disable' }
 * Only the primary Gmail user can perform this operation.
 */
router.post('/', requireGmailUser, (req, res) => {
  const { service, action } = req.body ?? {};
  if (!service || !action) {
    return res.status(400).json({ error: 'Missing service or action' });
  }
  if (!enabledServices.has(service) && action === 'enable') {
    enabledServices.add(service);
  } else if (enabledServices.has(service) && action === 'disable') {
    enabledServices.delete(service);
  } else {
    // No change needed
  }
  res.json({ services: Array.from(enabledServices) });
});

export default router;
