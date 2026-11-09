import React from 'react';
import { AlertTriangle, X, Check, Save } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export interface UnsavedChangesModalProps {
  isOpen: boolean;
  onProceed: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  onProceed,
  onCancel,
  title = 'Unsaved Changes Detected',
  description = 'You have modified fields that have not been saved. Leaving or closing now will discard these changes permanently.',
  confirmLabel = 'Discard Changes',
  cancelLabel = 'Keep Editing',
}) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="unsaved-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '1rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
          borderRadius: 16,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
          border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #FEE2E2',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
          <div
            style={{
              padding: '0.5rem',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <h3
              id="unsaved-modal-title"
              style={{
                margin: 0,
                fontSize: '1.125rem',
                fontWeight: 700,
                color: isDark ? '#F8FAFC' : '#0F172A',
              }}
            >
              {title}
            </h3>
            <p
              style={{
                margin: '0.5rem 0 0',
                fontSize: '0.875rem',
                color: isDark ? '#94A3B8' : '#64748B',
                lineHeight: 1.45,
              }}
            >
              {description}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 8,
              fontSize: '0.875rem',
              fontWeight: 600,
              backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
              color: isDark ? '#F1F5F9' : '#334155',
              border: isDark ? '1px solid #334155' : '1px solid #CBD5E1',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onProceed}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 8,
              fontSize: '0.875rem',
              fontWeight: 600,
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export interface TaskActionBarProps {
  isDirty?: boolean;
  isSaving?: boolean;
  onSave: () => void;
  onSaveAndClose?: () => void;
  onCancel: () => void;
  saveLabel?: string;
  saveAndCloseLabel?: string;
  cancelLabel?: string;
}

export const TaskActionBar: React.FC<TaskActionBarProps> = ({
  isDirty = true,
  isSaving = false,
  onSave,
  onSaveAndClose,
  onCancel,
  saveLabel = 'Save Changes',
  saveAndCloseLabel = 'Save & Close',
  cancelLabel = 'Cancel',
}) => {
  const { isDark } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.875rem 1.25rem',
        backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
        borderTop: isDark ? '1px solid #1E293B' : '1px solid #E2E8F0',
        gap: '0.75rem',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {isDirty && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              fontSize: '0.75rem',
              color: '#F59E0B',
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#F59E0B',
              }}
            />
            Unsaved changes
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          style={{
            padding: '0.5rem 0.875rem',
            borderRadius: 8,
            fontSize: '0.8125rem',
            fontWeight: 600,
            backgroundColor: 'transparent',
            color: isDark ? '#94A3B8' : '#64748B',
            border: isDark ? '1px solid #334155' : '1px solid #CBD5E1',
            cursor: isSaving ? 'not-allowed' : 'pointer',
          }}
        >
          {cancelLabel}
        </button>

        {onSaveAndClose && (
          <button
            type="button"
            onClick={onSaveAndClose}
            disabled={isSaving}
            style={{
              padding: '0.5rem 0.875rem',
              borderRadius: 8,
              fontSize: '0.8125rem',
              fontWeight: 600,
              backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
              color: isDark ? '#F1F5F9' : '#0F172A',
              border: isDark ? '1px solid #475569' : '1px solid #CBD5E1',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
            }}
          >
            <Check size={14} />
            {saveAndCloseLabel}
          </button>
        )}

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 8,
            fontSize: '0.8125rem',
            fontWeight: 600,
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
            border: 'none',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            boxShadow: '0 2px 4px rgba(239, 68, 68, 0.25)',
          }}
        >
          <Save size={14} />
          {isSaving ? 'Saving...' : saveLabel}
        </button>
      </div>
    </div>
  );
};
