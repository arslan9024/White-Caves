/**
 * usePropertyManagement — Custom hook for Property CRUD operations
 * Extracts all business logic, state, and Redux interactions from PropertyManagementPage.
 * Makes the page component a pure rendering layer and this hook independently testable.
 */
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { formatCurrency as formatCurrencyUtil } from '../../../utils';
import { MAX_PRICE, MAX_BEDROOMS, MAX_BATHROOMS, MAX_SQFT } from '../../../utils/validation';
import { createLogger } from '../../../utils/logger';

const log = createLogger('usePropertyManagement');
import type { AppDispatch } from '../../../store/store';
import {
  selectAllProperties,
  selectPropertiesLoading,
  selectPropertiesError,
  fetchPropertiesFromAPI,
  createPropertyAPI,
  updatePropertyAPI,
  deletePropertyAPI,
  addActivity,
} from '../../../store/crmDataSlice';

// ─── Types ──────────────────────────────────────────────────────────────

export interface Property {
  id: string | number;
  title: string;
  type: string;
  status: string;
  location: string;
  area?: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  description?: string;
  amenities?: string[];
  images?: string[];
  agent_id?: string;
  agent_name?: string;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PropertyFormData {
  title: string;
  type: string;
  status: string;
  location: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  description: string;
  agent_name: string;
  featured: boolean;
}

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

// ─── Constants ──────────────────────────────────────────────────────────

export const STATUS_MAP: Record<string, { label: string; variant: BadgeVariant; color: string }> = {
  available: { label: 'Available', variant: 'success', color: '#10B981' },
  reserved: { label: 'Reserved', variant: 'warning', color: '#F59E0B' },
  sold: { label: 'Sold', variant: 'error', color: '#EF4444' },
  rented: { label: 'Rented', variant: 'info', color: '#3B82F6' },
  off_market: { label: 'Off Market', variant: 'secondary', color: '#6B7280' },
};

export const TYPE_MAP: Record<string, { label: string; icon: string }> = {
  villa: { label: 'Villa', icon: '🏡' },
  apartment: { label: 'Apartment', icon: '🏢' },
  penthouse: { label: 'Penthouse', icon: '🏙️' },
  commercial: { label: 'Commercial', icon: '🏗️' },
  land: { label: 'Land', icon: '🌍' },
  townhouse: { label: 'Townhouse', icon: '🏘️' },
};

// Mock data removed — all property data is fetched from the API via Redux

const ITEMS_PER_PAGE = 9;

const EMPTY_FORM: PropertyFormData = {
  title: '',
  type: 'apartment',
  status: 'available',
  location: '',
  price: '',
  bedrooms: '',
  bathrooms: '',
  sqft: '',
  description: '',
  agent_name: '',
  featured: false,
};

// ─── Hook ───────────────────────────────────────────────────────────────

export function usePropertyManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const allProperties = useSelector(selectAllProperties) as unknown as Property[];
  const loading = useSelector(selectPropertiesLoading);
  const error = useSelector(selectPropertiesError);

  // Fetch on mount
  useEffect(() => {
    const promise = dispatch(fetchPropertiesFromAPI({}));
    return () => { promise.abort?.(); };
  }, [dispatch]);

  // Use API data exclusively — no hardcoded fallback
  const properties = allProperties;

  // ─── Local state ────────────────────────────────────────────────

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, typeFilter]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState<PropertyFormData>({ ...EMPTY_FORM });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ─── Derived data ───────────────────────────────────────────────

  const stats = useMemo(() => {
    const totalValue = properties.reduce((sum, p) => sum + (p.price || 0), 0);
    return {
      total: properties.length,
      available: properties.filter(p => p.status === 'available').length,
      reserved: properties.filter(p => p.status === 'reserved').length,
      sold: properties.filter(p => p.status === 'sold').length,
      totalValue,
    };
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesSearch = !search || [
        p.title, p.location, p.area, p.agent_name, p.description,
      ].some(f => f?.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchesType = typeFilter === 'all' || p.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [properties, search, statusFilter, typeFilter]);

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);

  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // ─── Actions ────────────────────────────────────────────────────

  const resetForm = useCallback(() => {
    setFormData({ ...EMPTY_FORM });
  }, []);

  const openCreateModal = useCallback(() => {
    resetForm();
    setShowCreateModal(true);
  }, [resetForm]);

  const closeCreateModal = useCallback(() => {
    setShowCreateModal(false);
    resetForm();
  }, [resetForm]);

  const closeEditModal = useCallback(() => {
    setShowEditModal(false);
    setSelectedProperty(null);
    resetForm();
  }, [resetForm]);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteConfirm(false);
    setSelectedProperty(null);
  }, []);

  const handleCreate = useCallback(() => {
    if (!formData.title.trim() || !formData.location.trim()) return;
    const price = Number(formData.price);
    if (!price || price <= 0 || price > MAX_PRICE) return;
    const bedrooms = Number(formData.bedrooms) || 0;
    const bathrooms = Number(formData.bathrooms) || 0;
    const sqft = Number(formData.sqft) || 0;
    if (bedrooms < 0 || bedrooms > MAX_BEDROOMS || bathrooms < 0 || bathrooms > MAX_BATHROOMS || sqft < 0 || sqft > MAX_SQFT) return;

    const propertyData = {
      title: formData.title.trim(),
      type: formData.type,
      status: formData.status,
      location: formData.location.trim(),
      price,
      bedrooms,
      bathrooms,
      sqft,
      description: formData.description.trim(),
      agent_name: formData.agent_name.trim(),
      featured: formData.featured,
      created_at: new Date().toISOString(),
    };

    dispatch(createPropertyAPI(propertyData)).then((result) => {
      if (createPropertyAPI.fulfilled.match(result)) {
        dispatch(addActivity({
          id: Date.now(),
          type: 'property',
          description: `New property listed: ${formData.title}`,
          timestamp: new Date().toISOString(),
        }));
        setShowCreateModal(false);
        resetForm();
      } else if (createPropertyAPI.rejected.match(result)) {
        const msg = (result.payload as string) || 'Failed to create property. Please try again.';
        setErrorMessage(msg);
      }
    }).catch((error: unknown) => {
      log.error('Failed to create property:', error instanceof Error ? error.message : String(error));
      setErrorMessage('An unexpected error occurred. Please try again.');
    });
  }, [dispatch, formData, resetForm]);

  const handleEdit = useCallback((property: Property) => {
    setSelectedProperty(property);
    setFormData({
      title: property.title,
      type: property.type,
      status: property.status,
      location: property.location,
      price: property.price?.toString() || '',
      bedrooms: property.bedrooms?.toString() || '',
      bathrooms: property.bathrooms?.toString() || '',
      sqft: property.sqft?.toString() || '',
      description: property.description || '',
      agent_name: property.agent_name || '',
      featured: property.featured || false,
    });
    setShowEditModal(true);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!formData.title.trim() || !formData.location.trim()) {
      setErrorMessage('Title and location are required.');
      return;
    }
    if (selectedProperty) {
      const titleSnapshot = formData.title;
      dispatch(updatePropertyAPI({
        id: selectedProperty.id,
        ...formData,
        price: Number(formData.price) || 0,
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        sqft: Number(formData.sqft) || 0,
        updated_at: new Date().toISOString(),
      })).then((result) => {
        if (updatePropertyAPI.fulfilled.match(result)) {
          dispatch(addActivity({
            id: Date.now(),
            type: 'property',
            description: `Property updated: ${titleSnapshot}`,
            timestamp: new Date().toISOString(),
          }));
          setShowEditModal(false);
          setSelectedProperty(null);
          resetForm();
        } else if (updatePropertyAPI.rejected.match(result)) {
          const msg = (result.payload as string) || 'Failed to update property. Please try again.';
          setErrorMessage(msg);
        }
      }).catch((error: unknown) => {
        log.error('Failed to update property:', error instanceof Error ? error.message : String(error));
        setErrorMessage('An unexpected error occurred. Please try again.');
      });
    }
  }, [dispatch, selectedProperty, formData, resetForm]);

  const handleDelete = useCallback(() => {
    if (selectedProperty) {
      dispatch(deletePropertyAPI(selectedProperty.id)).then((result) => {
        if (deletePropertyAPI.fulfilled.match(result)) {
          dispatch(addActivity({
            id: Date.now(),
            type: 'property',
            description: `Property removed: ${selectedProperty.title}`,
            timestamp: new Date().toISOString(),
          }));
          setShowDeleteConfirm(false);
          setSelectedProperty(null);
        } else if (deletePropertyAPI.rejected.match(result)) {
          const msg = (result.payload as string) || 'Failed to delete property. Please try again.';
          setErrorMessage(msg);
        }
      }).catch((error: unknown) => {
        log.error('Failed to delete property:', error instanceof Error ? error.message : String(error));
        setErrorMessage('An unexpected error occurred. Please try again.');
      });
    }
  }, [dispatch, selectedProperty]);

  const confirmDelete = useCallback((property: Property) => {
    setSelectedProperty(property);
    setShowDeleteConfirm(true);
  }, []);

  const formatCurrency = useCallback((amount: number) => formatCurrencyUtil(amount), []);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  }, []);

  const handleTypeFilterChange = useCallback((value: string) => {
    setTypeFilter(value);
    setCurrentPage(1);
  }, []);

  const retryFetch = useCallback(() => {
    dispatch(fetchPropertiesFromAPI({}));
  }, [dispatch]);

  const goBack = useCallback(() => {
    navigate('/owner/crm');
  }, [navigate]);

  return {
    // Data
    properties, filteredProperties, paginatedProperties, stats, totalPages,
    loading, error,
    // State
    search, statusFilter, typeFilter, viewMode, currentPage,
    showCreateModal, showEditModal, showDeleteConfirm, selectedProperty,
    formData, setFormData, setViewMode,
    errorMessage, setErrorMessage,
    // Page constants
    ITEMS_PER_PAGE,
    // Actions
    openCreateModal, closeCreateModal, closeEditModal, closeDeleteModal,
    handleCreate, handleEdit, handleSaveEdit, handleDelete, confirmDelete,
    handleSearchChange, handleStatusFilterChange, handleTypeFilterChange,
    setCurrentPage, retryFetch, goBack,
    // Formatters
    formatCurrency,
  };
}
