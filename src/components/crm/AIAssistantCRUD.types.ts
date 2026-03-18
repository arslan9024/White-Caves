/**
 * AI Assistant CRUD Type Definitions
 * =====================================
 * Complete type system for AI Assistant Create, Read, Update, Delete operations
 */

// ============================================================================
// FORM STATE & VALIDATION
// ============================================================================

export interface AIAssistantFormData {
  id?: string;
  name: string;
  title: string;
  department: string;
  description: string;
  icon: string;
  colorScheme: string;
  avatar: string;
  capabilities: string[];
  permissions: {
    viewableBy: string[];
    accessibleBy: string[];
    dataAccessLevel: 'full' | 'departmental' | 'limited';
  };
  dashboardUrl: string;
  apiEndpoints: string[];
  isActive: boolean;
  notes?: string;
}

export interface FormValidationError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: FormValidationError[];
}

// ============================================================================
// CRUD OPERATION TYPES
// ============================================================================

export interface CreateAssistantRequest {
  name: string;
  title: string;
  department: string;
  description: string;
  icon: string;
  colorScheme: string;
  avatar: string;
  capabilities: string[];
  permissions: {
    viewableBy: string[];
    accessibleBy: string[];
    dataAccessLevel: 'full' | 'departmental' | 'limited';
  };
  dashboardUrl: string;
  apiEndpoints: string[];
}

export interface UpdateAssistantRequest extends Partial<CreateAssistantRequest> {
  id: string;
}

export interface DeleteAssistantRequest {
  id: string;
  reason?: string;
}

export interface CRUDResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

// ============================================================================
// MODAL & UI STATE
// ============================================================================

export type CRUDModalMode = 'create' | 'edit' | 'view' | 'delete' | 'closed';

export interface CRUDModalState {
  isOpen: boolean;
  mode: CRUDModalMode;
  selectedAssistantId?: string;
  isLoading: boolean;
  error?: string;
  successMessage?: string;
}

export interface CRUDFormState {
  formData: AIAssistantFormData;
  isSubmitting: boolean;
  isSaving: boolean;
  isDirty: boolean;
  validationErrors: FormValidationError[];
  lastSavedAt?: string;
}

// ============================================================================
// API INTEGRATION
// ============================================================================

export interface AIAssistantAPIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  requiresAuth: boolean;
  rateLimit?: number;
  timeout?: number;
  description?: string;
}

export interface AIAssistantCRUDAPI {
  create: (data: CreateAssistantRequest) => Promise<CRUDResponse<AIAssistantFormData>>;
  read: (id: string) => Promise<CRUDResponse<AIAssistantFormData>>;
  readAll: () => Promise<CRUDResponse<AIAssistantFormData[]>>;
  update: (data: UpdateAssistantRequest) => Promise<CRUDResponse<AIAssistantFormData>>;
  delete: (data: DeleteAssistantRequest) => Promise<CRUDResponse<{ id: string }>>;
}

// ============================================================================
// BATCH OPERATIONS
// ============================================================================

export interface BatchCRUDRequest {
  operations: Array<{
    operation: 'create' | 'update' | 'delete';
    data: CreateAssistantRequest | UpdateAssistantRequest | DeleteAssistantRequest;
  }>;
  transactional?: boolean; // All succeed or all fail
}

export interface BatchCRUDResponse {
  success: boolean;
  results: Array<{
    operation: string;
    success: boolean;
    data?: unknown;
    error?: string;
  }>;
  failureNote?: string;
}

// ============================================================================
// AUDIT & HISTORY
// ============================================================================

export interface CRUDAuditEntry {
  id: string;
  assistantId: string;
  operation: 'create' | 'update' | 'delete' | 'read';
  performedBy: string;
  timestamp: string;
  changes?: Record<string, { from: unknown; to: unknown }>;
  reason?: string;
  ipAddress?: string;
}

export interface CRUDHistory {
  assistantId: string;
  entries: CRUDAuditEntry[];
  lastModified: string;
  createdAt: string;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface AIAssistantCRUDModalProps {
  isOpen: boolean;
  mode: CRUDModalMode;
  assistantId?: string;
  onClose: () => void;
  onSuccess?: (data: AIAssistantFormData, mode: CRUDModalMode) => void;
  onError?: (error: string) => void;
}

export interface AIAssistantCRUDFormProps {
  initialData?: AIAssistantFormData;
  mode: 'create' | 'edit' | 'view';
  onSubmit: (data: AIAssistantFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  validationErrors?: FormValidationError[];
}

export interface AIAssistantCRUDManagerProps {
  onAssistantCreated?: (assistant: AIAssistantFormData) => void;
  onAssistantUpdated?: (assistant: AIAssistantFormData) => void;
  onAssistantDeleted?: (assistantId: string) => void;
  showAuditTrail?: boolean;
}

// ============================================================================
// CONSTANTS & DEFAULTS
// ============================================================================

export const DEFAULT_ASSISTANT_FORM_DATA: AIAssistantFormData = {
  name: '',
  title: '',
  department: '',
  description: '',
  icon: 'Bot',
  colorScheme: 'primary',
  avatar: '',
  capabilities: [],
  permissions: {
    viewableBy: ['owner', 'admin'],
    accessibleBy: ['owner', 'admin'],
    dataAccessLevel: 'departmental',
  },
  dashboardUrl: '',
  apiEndpoints: [],
  isActive: true,
};

export const DEPARTMENTS = [
  'whatsapp',
  'inventory',
  'leads',
  'hr',
  'sales',
  'finance',
  'marketing',
  'compliance',
  'leasing',
  'executive',
  'tech',
  'frontend',
  'backend',
];

export const CAPABILITIES_PREDEFINED = [
  'Lead Generation',
  'Lead Scoring',
  'Property Matching',
  'Message Routing',
  'Analytics',
  'Reporting',
  'Data Integration',
  'Compliance Check',
  'Inventory Management',
  'Financial Tracking',
];

export const FORM_VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\s\-_]+$/,
  },
  title: {
    required: true,
    minLength: 3,
    maxLength: 100,
  },
  department: {
    required: true,
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 500,
  },
  dashboardUrl: {
    required: true,
    pattern: /^https?:\/\/.+/,
  },
};

// ============================================================================
// NOTIFICATION & STATUS
// ============================================================================

export type CRUDNotificationLevel = 'info' | 'success' | 'warning' | 'error';

export interface CRUDNotification {
  id: string;
  level: CRUDNotificationLevel;
  title: string;
  message: string;
  timestamp: string;
  autoDismiss?: boolean;
  dismissAfter?: number; // milliseconds
}

// ============================================================================
// SEARCH & FILTERING
// ============================================================================

export interface CRUDSearchFilters {
  searchQuery?: string;
  department?: string;
  isActive?: boolean;
  sortBy?: 'name' | 'department' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface CRUDSearchResult {
  assistants: AIAssistantFormData[];
  total: number;
  hasMore: boolean;
  query: CRUDSearchFilters;
}
