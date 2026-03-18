/**
 * AI Assistant CRUD Module Exports
 * ================================
 * Central export point for all CRUD-related components and hooks
 */

// Components
export { default as AIAssistantCRUDManager } from './AIAssistantCRUDManager';
export { default as AIAssistantCRUDModal } from './AIAssistantCRUDModal';
export { default as AIAssistantCRUDForm } from './AIAssistantCRUDForm';

// Hooks
export {
  useAIAssistantFormValidation,
  useAIAssistantFormState,
  useAIAssistantCRUDModal,
  useAIAssistantCRUDAPI,
  useAIAssistantCRUDSearch,
  useFormPersistence,
} from './aiAssistantCRUDHooks';

// Types
export type {
  AIAssistantFormData,
  FormValidationError,
  FormValidationResult,
  CreateAssistantRequest,
  UpdateAssistantRequest,
  DeleteAssistantRequest,
  CRUDResponse,
  CRUDModalState,
  CRUDModalMode,
  CRUDFormState,
  AIAssistantAPIEndpoint,
  AIAssistantCRUDAPI,
  BatchCRUDRequest,
  BatchCRUDResponse,
  CRUDAuditEntry,
  CRUDHistory,
  AIAssistantCRUDModalProps,
  AIAssistantCRUDFormProps,
  AIAssistantCRUDManagerProps,
  CRUDNotification,
  CRUDSearchFilters,
  CRUDSearchResult,
} from './AIAssistantCRUD.types';

// Constants
export {
  DEFAULT_ASSISTANT_FORM_DATA,
  DEPARTMENTS,
  CAPABILITIES_PREDEFINED,
  FORM_VALIDATION_RULES,
} from './AIAssistantCRUD.types';
