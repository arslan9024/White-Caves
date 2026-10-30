/**
 * Agent Dashboard — LeasingPipeline, LeasingProperties, LeaseContracts, LeasingViewings,
 *                   TenantApplications, LeaseRenewals, SalesPipeline, SalesLeads, ActiveDeals, AgentPerformance
 * ─────────────────────────────────────────────────────────────────────────────────────
 * Modular sub-tab components complying with Single Purpose File Law (< 350 lines).
 */

// Leasing sub-tabs
export { LeasingPipeline, type LeasingPipelineProps } from './agent/leasing/LeasingPipeline';
export { LeasingProperties } from './agent/leasing/LeasingProperties';
export { LeaseContracts } from './agent/leasing/LeaseContracts';
export { LeasingViewings } from './agent/leasing/LeasingViewings';
export { TenantApplications } from './agent/leasing/TenantApplications';
export { LeaseRenewals } from './agent/leasing/LeaseRenewals';

// Sales sub-tabs
export { SalesPipeline } from './agent/sales/SalesPipeline';
export { SalesLeads } from './agent/sales/SalesLeads';
export { ActiveDeals } from './agent/sales/ActiveDeals';
export { AgentPerformance } from './agent/sales/AgentPerformance';
