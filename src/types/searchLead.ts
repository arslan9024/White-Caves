/**
 * SearchLead — Type definitions for homepage search → CRM lead integration
 * TASK-001: Define SearchLead TypeScript interface
 * Phase 27 — Property Search ↔ CRM Lead Integration
 */

/** Raw search parameters captured from HeroSearchBar on "Find Now" click */
export interface SearchLeadParams {
  /** Search mode: buy or rent */
  mode: 'buy' | 'rent';
  /** Dubai community name, or null if "All Locations" */
  location: string | null;
  /** Property type, or null if "All Types" */
  propertyType: string | null;
  /** Number of bedrooms (0 = any) */
  beds: number;
  /** Minimum price in AED (0 = no minimum) */
  minPrice: number;
  /** Maximum price in AED (0 = no maximum) */
  maxPrice: number;
}

/** Full payload sent to POST /api/leads/from-search */
export interface SearchLeadPayload extends SearchLeadParams {
  /** Browser-generated session identifier for deduplication (optional) */
  sessionId?: string;
  /** ISO timestamp of the search */
  searchedAt: string;
}

/** Lead record returned from the API after creation */
export interface SearchLeadRecord {
  id: string;
  source: 'homepage_search';
  status: 'new';
  score: number;
  tags: string[];
  searchParams: SearchLeadParams;
  createdAt: string;
}

/** Redux state shape for the searchLeads slice */
export interface SearchLeadsState {
  /** Total search leads submitted this session */
  submittedCount: number;
  /** Whether the most recent submission is in-flight */
  submitting: boolean;
  /** ID of the last successfully created lead */
  lastLeadId: string | null;
  /** ISO timestamp of the last successful submission */
  lastSubmittedAt: string | null;
  /** Error message if the last submission failed */
  error: string | null;
}
