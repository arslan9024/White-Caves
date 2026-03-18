/**
 * AI Assistant CRUD Hooks
 * =======================
 * Custom React hooks for AI Assistant CRUD operations,
 * form validation, API integration, and state management
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AIAssistantFormData,
  FormValidationError,
  FormValidationResult,
  FORM_VALIDATION_RULES,
  CRUDModalState,
  CRUDFormState,
  DEFAULT_ASSISTANT_FORM_DATA,
  CRUDSearchFilters,
  CRUDSearchResult,
} from './AIAssistantCRUD.types';
import { RootState, AppDispatch } from '../../store/store';

// ============================================================================
// FORM VALIDATION HOOK
// ============================================================================

export const useAIAssistantFormValidation = () => {
  const validate = useCallback(
    (data: AIAssistantFormData): FormValidationResult => {
      const errors: FormValidationError[] = [];

      // Name validation
      if (!data.name || !data.name.trim()) {
        errors.push({ field: 'name', message: 'Name is required' });
      } else if (data.name.length < FORM_VALIDATION_RULES.name.minLength) {
        errors.push({
          field: 'name',
          message: `Name must be at least ${FORM_VALIDATION_RULES.name.minLength} characters`,
        });
      } else if (data.name.length > FORM_VALIDATION_RULES.name.maxLength) {
        errors.push({
          field: 'name',
          message: `Name must not exceed ${FORM_VALIDATION_RULES.name.maxLength} characters`,
        });
      }

      // Title validation
      if (!data.title || !data.title.trim()) {
        errors.push({ field: 'title', message: 'Title is required' });
      } else if (data.title.length < FORM_VALIDATION_RULES.title.minLength) {
        errors.push({
          field: 'title',
          message: `Title must be at least ${FORM_VALIDATION_RULES.title.minLength} characters`,
        });
      }

      // Department validation
      if (!data.department || !data.department.trim()) {
        errors.push({ field: 'department', message: 'Department is required' });
      }

      // Description validation
      if (!data.description || !data.description.trim()) {
        errors.push({ field: 'description', message: 'Description is required' });
      } else if (data.description.length < FORM_VALIDATION_RULES.description.minLength) {
        errors.push({
          field: 'description',
          message: `Description must be at least ${FORM_VALIDATION_RULES.description.minLength} characters`,
        });
      }

      // Dashboard URL validation
      if (!data.dashboardUrl || !data.dashboardUrl.trim()) {
        errors.push({ field: 'dashboardUrl', message: 'Dashboard URL is required' });
      } else if (!FORM_VALIDATION_RULES.dashboardUrl.pattern.test(data.dashboardUrl)) {
        errors.push({
          field: 'dashboardUrl',
          message: 'Dashboard URL must be valid (http/https)',
        });
      }

      // Capabilities validation
      if (!data.capabilities || data.capabilities.length === 0) {
        errors.push({ field: 'capabilities', message: 'At least one capability is required' });
      }

      return {
        isValid: errors.length === 0,
        errors,
      };
    },
    []
  );

  return { validate };
};

// ============================================================================
// FORM STATE HOOK
// ============================================================================

export const useAIAssistantFormState = (initialData?: AIAssistantFormData) => {
  const [formState, setFormState] = useState<CRUDFormState>({
    formData: initialData || { ...DEFAULT_ASSISTANT_FORM_DATA },
    isSubmitting: false,
    isSaving: false,
    isDirty: false,
    validationErrors: [],
  });

  const updateField = useCallback((field: keyof AIAssistantFormData, value: unknown) => {
    setFormState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        [field]: value,
      },
      isDirty: true,
    }));
  }, []);

  const updateFormData = useCallback((data: Partial<AIAssistantFormData>) => {
    setFormState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        ...data,
      },
      isDirty: true,
    }));
  }, []);

  const setValidationErrors = useCallback((errors: FormValidationError[]) => {
    setFormState((prev) => ({
      ...prev,
      validationErrors: errors,
    }));
  }, []);

  const setIsSubmitting = useCallback((value: boolean) => {
    setFormState((prev) => ({
      ...prev,
      isSubmitting: value,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormState({
      formData: initialData || { ...DEFAULT_ASSISTANT_FORM_DATA },
      isSubmitting: false,
      isSaving: false,
      isDirty: false,
      validationErrors: [],
    });
  }, [initialData]);

  return {
    ...formState,
    updateField,
    updateFormData,
    setValidationErrors,
    setIsSubmitting,
    resetForm,
  };
};

// ============================================================================
// MODAL STATE HOOK
// ============================================================================

export const useAIAssistantCRUDModal = () => {
  const [modalState, setModalState] = useState<CRUDModalState>({
    isOpen: false,
    mode: 'closed',
    isLoading: false,
  });

  const openCreate = useCallback(() => {
    setModalState({
      isOpen: true,
      mode: 'create',
      isLoading: false,
    });
  }, []);

  const openEdit = useCallback((assistantId: string) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      selectedAssistantId: assistantId,
      isLoading: false,
    });
  }, []);

  const openView = useCallback((assistantId: string) => {
    setModalState({
      isOpen: true,
      mode: 'view',
      selectedAssistantId: assistantId,
      isLoading: false,
    });
  }, []);

  const openDelete = useCallback((assistantId: string) => {
    setModalState({
      isOpen: true,
      mode: 'delete',
      selectedAssistantId: assistantId,
      isLoading: false,
    });
  }, []);

  const close = useCallback(() => {
    setModalState({
      isOpen: false,
      mode: 'closed',
      isLoading: false,
    });
  }, []);

  const setError = useCallback((error: string) => {
    setModalState((prev) => ({
      ...prev,
      error,
    }));
  }, []);

  const setSuccess = useCallback((message: string) => {
    setModalState((prev) => ({
      ...prev,
      successMessage: message,
    }));
  }, []);

  return {
    ...modalState,
    openCreate,
    openEdit,
    openView,
    openDelete,
    close,
    setError,
    setSuccess,
  };
};

// ============================================================================
// API INTEGRATION HOOK
// ============================================================================

export const useAIAssistantCRUDAPI = () => {
  const baseURL = '/api/ai-assistants';

  const create = useCallback(async (data: AIAssistantFormData) => {
    try {
      const response = await fetch(`${baseURL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create assistant',
        timestamp: new Date().toISOString(),
      };
    }
  }, []);

  const read = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${baseURL}/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to read assistant',
        timestamp: new Date().toISOString(),
      };
    }
  }, []);

  const readAll = useCallback(async () => {
    try {
      const response = await fetch(`${baseURL}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to read assistants',
        timestamp: new Date().toISOString(),
      };
    }
  }, []);

  const update = useCallback(async (data: AIAssistantFormData) => {
    try {
      const response = await fetch(`${baseURL}/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update assistant',
        timestamp: new Date().toISOString(),
      };
    }
  }, []);

  const delete_ = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${baseURL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete assistant',
        timestamp: new Date().toISOString(),
      };
    }
  }, []);

  return {
    create,
    read,
    readAll,
    update,
    delete: delete_,
  };
};

// ============================================================================
// SEARCH & FILTER HOOK
// ============================================================================

export const useAIAssistantCRUDSearch = () => {
  const [searchResult, setSearchResult] = useState<CRUDSearchResult>({
    assistants: [],
    total: 0,
    hasMore: false,
    query: {},
  });

  const [isSearching, setIsSearching] = useState(false);

  const search = useCallback(async (filters: CRUDSearchFilters) => {
    setIsSearching(true);
    try {
      const params = new URLSearchParams();
      if (filters.searchQuery) params.append('q', filters.searchQuery);
      if (filters.department) params.append('department', filters.department);
      if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.offset) params.append('offset', String(filters.offset));

      const response = await fetch(`/api/ai-assistants/search?${params}`);
      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      setSearchResult({
        assistants: data.assistants || [],
        total: data.total || 0,
        hasMore: data.hasMore || false,
        query: filters,
      });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  return {
    ...searchResult,
    isSearching,
    search,
  };
};

// ============================================================================
// LOCAL STORAGE PERSISTENCE HOOK
// ============================================================================

export const useFormPersistence = (key: string, formData: AIAssistantFormData) => {
  const storageRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Save to localStorage after 500ms of inactivity
    storageRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(formData));
      } catch (error) {
        console.error('Failed to save form data:', error);
      }
    }, 500);

    return () => {
      if (storageRef.current) {
        clearTimeout(storageRef.current);
      }
    };
  }, [formData, key]);

  const getSavedData = useCallback(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Failed to retrieve form data:', error);
      return null;
    }
  }, [key]);

  const clearSavedData = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to clear form data:', error);
    }
  }, [key]);

  return {
    getSavedData,
    clearSavedData,
  };
};
