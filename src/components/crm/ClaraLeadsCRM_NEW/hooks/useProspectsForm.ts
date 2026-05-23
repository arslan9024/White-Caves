/**
 * useProspectsForm Hook
 * =====================
 * Manages add-lead form state and CRUD handlers for ProspectsTab.
 * Extracted to keep the tab component focused on rendering.
 */

import { useState, useCallback, FormEvent } from 'react';
import { useLeadsData } from './useLeadsData';

const INITIAL_FORM_DATA = {
  name: '',
  type: 'commercial',
  size: 'medium',
  status: 'contacted',
  value: 0,
  stage: 'initial_contact',
  email: '',
  phone: '',
  notes: '',
};

export interface ProspectFormData {
  name: string;
  type: string;
  size: string;
  status: string;
  value: number;
  stage: string;
  email: string;
  phone: string;
  notes: string;
}

export function useProspectsForm() {
  const {
    filteredLeads,
    filterStatus,
    setFilterStatus,
    filterStage,
    setFilterStage,
    filterSource,
    setFilterSource,
    searchQuery,
    setSearchQuery,
    addLead,
    updateLead,
    deleteLead,
    stats,
  } = useLeadsData();

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<ProspectFormData>({ ...INITIAL_FORM_DATA });

  /** Submit the add-lead form and reset state */
  const handleAddLead = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (formData.name.trim()) {
        addLead(formData);
        setFormData({ ...INITIAL_FORM_DATA });
        setShowAddForm(false);
      }
    },
    [formData, addLead]
  );

  /** Confirm-delete a lead by ID */
  const handleDeleteLead = useCallback(
    (id: string) => {
      if (confirm('Delete this lead?')) {
        deleteLead(id);
      }
    },
    [deleteLead]
  );

  /** Toggle the add-lead form visibility */
  const toggleAddForm = useCallback(() => {
    setShowAddForm(prev => !prev);
  }, []);

  /** Set a single form field */
  const setField = useCallback(
    <K extends keyof ProspectFormData>(key: K, value: ProspectFormData[K]) => {
      setFormData(prev => ({ ...prev, [key]: value }));
    },
    []
  );

  return {
    // Leads data
    filteredLeads,
    stats,
    // Filters
    filterStatus,
    setFilterStatus,
    filterStage,
    setFilterStage,
    filterSource,
    setFilterSource,
    searchQuery,
    setSearchQuery,
    // Lead actions
    updateLead,
    // Form state
    showAddForm,
    formData,
    // Form actions
    toggleAddForm,
    setField,
    handleAddLead,
    handleDeleteLead,
  };
}

/** Filter option constants */
export const STATUS_OPTIONS = ['all', 'contacted', 'interested', 'qualified', 'lost'] as const;
export const STAGE_OPTIONS = [
  'all',
  'initial_contact',
  'discovery',
  'proposal',
  'negotiation',
  'contract_review',
  'closed_won',
  'closed_lost',
] as const;
