/**
 * Clients API Routes — Full CRUD + Property Linking + Communication Logs
 * Endpoints: /api/clients
 * Phase 1C: Client/Owner Management
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requirePermission } from '../middleware/rbac.js';
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getClientProperties,
  linkClientProperty,
  updateClientPropertyLink,
  unlinkClientProperty,
  getClientCommunications,
  createClientCommunication,
  convertLeadToClient,
} from '../controllers/clients/index.js';

const router = Router();

// ─── CLIENT CRUD ─────────────────────────────────────────────────────────────
router.get('/', requirePermission('view_leads'), asyncHandler(getClients));
router.get('/:id', requirePermission('view_leads'), asyncHandler(getClientById));
router.post('/', requirePermission('manage_leads'), asyncHandler(createClient));
router.patch('/:id', requirePermission('manage_leads'), asyncHandler(updateClient));
router.delete('/:id', requirePermission('manage_leads'), asyncHandler(deleteClient));

// ─── CLIENT ↔ PROPERTY LINKING ───────────────────────────────────────────────
router.get('/:id/properties', requirePermission('view_leads'), asyncHandler(getClientProperties));
router.post(
  '/:id/properties',
  requirePermission('manage_leads'),
  asyncHandler(linkClientProperty)
);
router.patch(
  '/:id/properties/:propertyId',
  requirePermission('manage_leads'),
  asyncHandler(updateClientPropertyLink)
);
router.delete(
  '/:id/properties/:propertyId',
  requirePermission('manage_leads'),
  asyncHandler(unlinkClientProperty)
);

// ─── COMMUNICATION LOGS & CONVERSIONS ────────────────────────────────────────
router.get(
  '/:id/communications',
  requirePermission('view_leads'),
  asyncHandler(getClientCommunications)
);
router.post(
  '/:id/communications',
  requirePermission('manage_leads'),
  asyncHandler(createClientCommunication)
);
router.post(
  '/convert-lead/:leadId',
  requirePermission('manage_leads'),
  asyncHandler(convertLeadToClient)
);

export default router;
