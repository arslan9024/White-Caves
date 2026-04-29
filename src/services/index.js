/**
 * Central Services Index
 * Exports all core engines and AI services with singleton instances
 * Fixes module export issues and provides unified access
 */

// Import all engine classes
import { DynamicPricingEngine, ContextPreservationEngine } from './DynamicPricingEngine.js';
import { LeadScoringEngine, AITaskRouterService } from './LeadScoringEngine.js';
import { ServiceRecommendationEngine, AIOrchestrationEngine } from './ServiceRecommendationEngine.js';

// Import NEW Nina-Linda-Mary integration services
import NinaMaryIntelligence from './NinaMaryIntelligence.js';
import PropertyQueryService from './PropertyQueryService.js';
import PropertyStatusEventService from './PropertyStatusEventService.js';
import ComplianceValidationService from './ComplianceValidationService.js';
import NinaLindaMaryIntegration from './NinaLindaMaryIntegration.js';

// Import NEW Phase 2A Sourcing Services
import ConversationAnalyzer from './ConversationAnalyzer.js';
import WhatsAppWebIntegration from './WhatsAppWebIntegration.js';
import PropertySourcingService from './PropertySourcingService.js';

// Create and export singleton instances for backward compatibility
export const dynamicPricingEngine = new DynamicPricingEngine();
export const contextPreservationEngine = new ContextPreservationEngine();
export const leadScoringEngine = new LeadScoringEngine();
export const aiTaskRouterService = new AITaskRouterService();
export const serviceRecommendationEngine = new ServiceRecommendationEngine();
export const aiOrchestrationEngine = new AIOrchestrationEngine();

// NEW: Create singleton instances for Nina-Linda-Mary integration
export const ninaMaryIntelligence = new NinaMaryIntelligence();
export const propertyQueryService = new PropertyQueryService();
export const propertyStatusEventService = new PropertyStatusEventService();
export const complianceValidationService = new ComplianceValidationService();
export const ninaLindaMaryIntegration = new NinaLindaMaryIntegration();

// Also export classes for new instance creation
export {
  DynamicPricingEngine,
  ContextPreservationEngine,
  LeadScoringEngine,
  AITaskRouterService,
  ServiceRecommendationEngine,
  AIOrchestrationEngine,
  // NEW: Export all integration classes
  NinaMaryIntelligence,
  PropertyQueryService,
  PropertyStatusEventService,
  ComplianceValidationService,
  NinaLindaMaryIntegration
};

// Service registry for easy access
export const SERVICE_REGISTRY = {
  // Original services
  pricing: dynamicPricingEngine,
  context: contextPreservationEngine,
  leads: leadScoringEngine,
  routing: aiTaskRouterService,
  recommendations: serviceRecommendationEngine,
  orchestration: aiOrchestrationEngine,
  
  // NEW: Nina-Linda-Mary integration services
  ninaMary: ninaMaryIntelligence,
  propertyQuery: propertyQueryService,
  propertyStatusEvents: propertyStatusEventService,
  compliance: complianceValidationService,
  integration: ninaLindaMaryIntegration
};

