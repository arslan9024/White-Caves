/**
 * White Caves CRM — Domain Route Registry
 * Wave 53/F1: extracted from server/index.ts to honour the Single Purpose File Law.
 *
 * Mount order is behaviour-critical and mirrors the original server/index.ts
 * sequence exactly. All mounts here run AFTER the global /api auth gate that
 * server/index.ts installs before calling mountDomainRoutes(app).
 */

import { Express } from 'express';
import authMiddleware from '../middleware/auth.js';
import { strictLimiter } from '../middleware/rateLimiter.js';

// Route imports (ESM-compatible)
import leadsRoutes from './leads.js';
import propertiesRoutes from './properties.js';
import syndicationRoutes from './syndication.js';
import agentsRoutes from './agents.js';
import transactionsRoutes from './transactions.js';
import financeRoutes from './finance.js';
import tenantsRoutes from './tenants.js';
import communicationsRoutes from './communications.js';
import reportingRoutes from './reporting.js';
import complianceRoutes from './compliance.js';
import crmRoutes from './crm.js';
import nadiaRoutes from './nadia.js';
import lindaRoutes from './linda.js';
import metaWebhookRoutes from './meta-webhook.js';
import favoritesRoutes from './favorites.js';
import orchestratorRoutes from './orchestrator.js';
import aegisRoutes from './aegis.js';
import integrationsRoutes from './integrations.js';
import orchestrationRoutes from './orchestration.js';
import henryRoutes from './henry.js';
import ninaRoutes from './nina.js';
import maryRoutes from './mary.js';
import savedSearchesRoutes from './saved-searches.js';
import viewingsRoutes from './viewings.js';
import offersRoutes from './offers.js';
import leasesRoutes from './leases.js';
import maintenanceRoutes from './maintenance.js';
import campaignsRoutes from './campaigns.js';
import clientsRoutes from './clients.js';
import activitiesRoutes from './activities.js';
import followUpsRoutes from './follow-ups.js';
import documentsRoutes from './documents.js';
import currencyRoutes from './currency.js';
import emailRoutes from './email.js';
import agentAvailabilityRoutes from './agentAvailability.js';
import analyticsRoutes from './analytics.js';
import valuationRoutes from './valuation.js';
import marketRoutes from './market.js';
import departmentsRoutes from './departments.js';
import corporateDepartmentsRoutes from './corporateDepartments.js';
import corporateHierarchyRoutes from './corporateHierarchy.js';
import v1DealsRoutes from './v1Deals.js';
import v1CustomersRoutes from './v1Customers.js';
import v1RelationshipsRoutes from './v1Relationships.js';
import v1DocumentsRoutes from './v1Documents.js';
import v1TasksRoutes from './v1Tasks.js';
import v1AiAssistantsRoutes from './v1AiAssistants.js';
import jobApplicationsRoutes from './jobApplications.js';
import contractsRoutes from './contracts.js';
import appointmentsRoutes from './appointments.js';
import mortgageRoutes from './mortgage.js';
import { roleRequestRouter, adminRoleRequestRouter } from './roleRequests.js';
import landlordPortalRoutes from './landlord.js';
import tenantPortalRoutes from './tenantPortal.js';
import portalWebhooksRoutes from './portalWebhooks.js';
import agentPerformanceRoutes from './agentPerformance.js';
import agentTargetsRoutes from './agentTargets.js';
import kycRoutes from './kyc.js';
import sarRoutes from './sar.js';
import consentRoutes from './consent.js';
import dataExportRoutes from './dataExport.js';
import dataDeleteRoutes from './dataDelete.js';
import financialReportsRoutes from './financialReports.js';
import invoicesLeaseRoutes from './invoicesLease.js';
import usersRoutes from './users.js';
import leasingInventoryRoutes from './leasing-inventory.js';
import secondarySalesRoutes from './secondary-sales.js';
import commissionsRoutes from './commissions.js';
import notificationsRoutes from './notifications.js';
import importHistoryRoutes from './importHistory.routes.js';
import smartImportRoutes from './smartImport.routes.js';
import mediaRoutes from './media.js';
import whatsappRouter from './broadcast.js';
import whatsappEngineRoutes from './whatsapp.js';
import { pushRoutes } from './push.js';
import oqoodRouter from './oqood.js';
import pdcRouter from './pdc.js';

/**
 * Mounts every protected domain route onto the Express app.
 * Must be called at the exact position the inline mounts previously occupied
 * (immediately after the /api auth middleware block in server/index.ts).
 */
export function mountDomainRoutes(app: Express): void {
  // These internal telemetry and statutory workflows must not bypass API authentication.
  app.use('/api/aegis', aegisRoutes);
  app.use('/api/oqood', oqoodRouter);
  app.use('/api/pdc', pdcRouter);

  // Leads API (Clara - Lead Manager)
  app.use('/api/leads', leadsRoutes);

  // Properties API (Mary - Inventory Manager)
  app.use('/api/properties', propertiesRoutes);

  // Portal syndication API (Property Finder / Bayut queueing)
  app.use('/api/syndication', syndicationRoutes);

  // Agents API
  app.use('/api/agents', agentsRoutes);

  // Users API — user management (list all roles, approve/reject, update role/status)
  app.use('/api/users', usersRoutes);

  // Transactions API (Sophia - Pipeline, Theodora - Finance)
  app.use('/api/transactions', transactionsRoutes);

  // Finance API (Theodora - Finance Director)
  app.use('/api/finance', financeRoutes);

  // Tenants API (Daisy - Leasing Manager)
  app.use('/api/tenants', tenantsRoutes);

  // Clients API (Phase 1C - Client/Owner Management)
  app.use('/api/clients', clientsRoutes);

  // Activities API (Phase 1F - Activity Timeline & Audit Trail)
  app.use('/api/activities', activitiesRoutes);

  // Follow-Up Sequences API (Phase 2B - Automated Lead Follow-Up)
  app.use('/api/follow-ups', followUpsRoutes);

  // Documents API (Phase 2C - Document Generation)
  app.use('/api/documents', documentsRoutes);

  // Market Analytics API (Phase 4C - Market Analyst Bot)
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/departments', departmentsRoutes);
  app.use('/api/corporate-departments', corporateDepartmentsRoutes);
  app.use('/api/corporate-hierarchy', corporateHierarchyRoutes);
  app.use('/api/v1/deals', v1DealsRoutes);
  app.use('/api/v1/customers', v1CustomersRoutes);
  app.use('/api/v1/relationships', v1RelationshipsRoutes);
  app.use('/api/v1/documents', v1DocumentsRoutes);
  app.use('/api/v1/tasks', v1TasksRoutes);
  app.use('/api/v1/ai-assistants', v1AiAssistantsRoutes);

  // Currency API (Phase 2E - Multi-Currency Support)
  app.use('/api/currency', currencyRoutes);

  // Email API (Phase 3B - Email Automation)
  app.use('/api/email', emailRoutes);

  // Agent Availability API (Phase 3C - Calendar/Scheduling)
  app.use('/api/agent-availability', agentAvailabilityRoutes);

  // Communications API (Nadia - WhatsApp CRM, Nina - Bot)
  app.use('/api/communications', communicationsRoutes);

  // NADIA WhatsApp CRM API (Conversation management, message handling)
  app.use('/api/nadia', nadiaRoutes);

  // W24-006: Broadcast Campaigns
  app.use('/api/whatsapp', whatsappRouter);
  app.use('/api/whatsapp-engine', whatsappEngineRoutes);

  // Linda LocalAuth WhatsApp Integration (alternative channel)
  app.use('/api/linda', lindaRoutes);

  // AssistantOrchestrator API — cross-assistant event bus status, events, and admin emit
  app.use('/api/orchestrator', orchestratorRoutes);
  app.use('/api/henry', henryRoutes);
  app.use('/api/nina', ninaRoutes);
  app.use('/api/mary', maryRoutes);

  // Meta Business API Webhooks and Sending (production scale channel)
  app.use('/api/webhooks/meta', metaWebhookRoutes);

  // Favorites API (any authenticated user can manage their own favorites)
  app.use('/api/favorites', favoritesRoutes);

  // Notifications API (any authenticated user can manage their own notifications)
  app.use('/api/notifications', notificationsRoutes);

  // Media API — Wave 13 upload/transform/delete pipeline
  app.use('/api/media', mediaRoutes);

  // Saved Searches API (any authenticated user can manage their own saved searches)
  app.use('/api/saved-searches', savedSearchesRoutes);

  // Viewings API (schedule and manage property viewings)
  app.use('/api/viewings', viewingsRoutes);

  // Offers API (buyer offers on properties)
  app.use('/api/offers', offersRoutes);

  // Leases API (lease management for landlords, tenants, leasing agents)
  app.use('/api/leases', leasesRoutes);

  // Lease Invoices API (deposit and rent invoices for leasing workflow)
  app.use('/api/invoices/lease', invoicesLeaseRoutes);

  // Maintenance API (maintenance requests for landlords and tenants)
  app.use('/api/maintenance', maintenanceRoutes);

  // Tenant Portal API — Wave 36 (overview, documents, maintenance request)
  app.use('/api/tenant-portal', authMiddleware, tenantPortalRoutes);

  // Broadcast Campaigns API — Wave 38 (WhatsApp broadcast creation, execution, analytics)
  app.use('/api/campaigns', campaignsRoutes);

  // Portal Webhooks API — Wave 39 (inbound lead capture from PropertyFinder & Bayut)
  app.use('/api/webhooks/portals', portalWebhooksRoutes);

  // Agent Performance API — Wave 40 (metrics, leaderboard, SLA response time)
  app.use('/api/agent-performance', agentPerformanceRoutes);

  // Agent Targets API — Wave 40 (monthly target setting and progress tracking)
  app.use('/api/agent-targets', agentTargetsRoutes);

  // KYC Workflow API — Wave 41 (customer identity verification & document checklist)
  app.use('/api/kyc', authMiddleware, kycRoutes);

  // AML & SAR API — Wave 42 (Suspicious Activity Reports & goAML filing)
  app.use('/api/sar', authMiddleware, sarRoutes);

  // PDPL Consent & Rights API — Wave 42 (consent tracking, data export, right to erasure)
  app.use('/api/consent', consentRoutes);
  app.use('/api/data-export', authMiddleware, dataExportRoutes);
  app.use('/api/data-delete', dataDeleteRoutes);

  // Financial Reports API — Wave 44 (monthly P&L statement, landlord rental income)
  app.use('/api/financial-reports', authMiddleware, financialReportsRoutes);

  // Valuation API — Wave 12 (AVM + manual override + bank request)
  app.use('/api/valuations', authMiddleware, valuationRoutes);

  // Mortgage API — Wave 14 (calculation + FX conversion)
  app.use('/api/mortgage', mortgageRoutes);

  // Market Intelligence API — Wave 12 (price index, transactions, RERA index)
  app.use('/api/market', authMiddleware, marketRoutes);

  // Leasing Inventory API (Mary - Inventory Manager)
  app.use('/api/leasing-inventory', leasingInventoryRoutes);

  // Secondary Sales API
  app.use('/api/secondary-sales', secondarySalesRoutes);

  // Push API (FCM Push Notifications)
  app.use('/api/push', pushRoutes);

  // Commissions API (Phase 35 - Dubai Real Estate Commission Tracker)
  app.use('/api/commissions', commissionsRoutes);

  app.use('/api/inventory/import', smartImportRoutes);
  app.use('/api', importHistoryRoutes);

  // Reporting API (Zoe - Executive Dashboard)
  app.use('/api/dashboard', reportingRoutes);
  app.use('/api/reports', reportingRoutes);

  // Compliance API (Laila - Compliance Officer)
  app.use('/api/compliance', complianceRoutes);

  // CRM General API (Search, Analytics, Dashboard, Export)
  app.use('/api/crm/export', strictLimiter); // Strict rate limit on data export
  app.use('/api/crm', crmRoutes);

  // AI Assistants API (Phase 0.8 — plan management)
  app.use('/api/integrations', integrationsRoutes);
  app.use('/api/orchestration', orchestrationRoutes);

  // Contracts API — full CRUD via contracts router
  app.use('/api/contracts', authMiddleware, contractsRoutes);

  // Job Applications API
  app.use('/api/job-applications', jobApplicationsRoutes);

  // Appointments API — full CRUD via appointments router
  app.use('/api/appointments', authMiddleware, appointmentsRoutes);

  // Tenancy Agreements API — fully delegated to the leases router.
  // /api/tenancy-agreements is an alias for /api/leases: same model, different UI label.
  app.use('/api/tenancy-agreements', authMiddleware, leasesRoutes);

  // Landlord Portal API — stats, properties, maintenance, finances for the portal
  app.use('/api/landlord', authMiddleware, landlordPortalRoutes);

  // Tenant Portal API — lease, payments, documents, maintenance for the tenant portal
  app.use('/api/portal/tenant', authMiddleware, tenantPortalRoutes);

  // Role Request APIs — user self-service requests + admin approval queue
  app.use('/api/users/role-request', authMiddleware, roleRequestRouter);
  app.use('/api/admin/role-requests', authMiddleware, adminRoleRequestRouter);
}
