import React, { FC } from 'react';
import { X, Save } from 'lucide-react';
import type { DepartmentFormData } from './DepartmentManager.types';
import { EditDrawerCard } from './DepartmentManagementWorkspace.styles';

export interface DepartmentEditDrawerProps {
  isOpen: boolean;
  editingNodeId: string | null;
  formData: DepartmentFormData;
  isSubmitting: boolean;
  onClose: () => void;
  onFormChange: (field: keyof DepartmentFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const DepartmentEditDrawer: FC<DepartmentEditDrawerProps> = ({
  isOpen,
  editingNodeId,
  formData,
  isSubmitting,
  onClose,
  onFormChange,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <EditDrawerCard data-testid="department-edit-drawer">
      <div className="drawer-header">
        <h3>{editingNodeId ? 'Edit Corporate Department' : 'Create New Corporate Department'}</h3>
        <button onClick={onClose} title="Close form">
          <X size={18} />
        </button>
      </div>

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Department Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={e => onFormChange('title', e.target.value)}
            placeholder="e.g. VIP Investment & Capital Markets"
            required
          />
        </div>

        <div className="form-group">
          <label>Department Code</label>
          <input
            type="text"
            value={formData.code}
            onChange={e => onFormChange('code', e.target.value)}
            placeholder="e.g. DEPT-CAPITAL"
            required
          />
        </div>

        <div className="form-group">
          <label>URL Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={e => onFormChange('slug', e.target.value)}
            placeholder="e.g. vip-investment-capital"
            required
          />
        </div>

        <div className="form-group">
          <label>Accent Color</label>
          <input
            type="color"
            value={formData.color}
            onChange={e => onFormChange('color', e.target.value)}
            style={{ height: '38px', padding: '2px 4px', cursor: 'pointer' }}
          />
        </div>

        <div className="form-group full-width">
          <label>Mandate & Operational Description</label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={e => onFormChange('description', e.target.value)}
            placeholder="Define department regulatory scope, RERA compliance mandates, and operational targets..."
          />
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="save-btn" disabled={isSubmitting}>
            <Save size={14} style={{ marginRight: '6px' }} />
            {isSubmitting ? 'Saving...' : editingNodeId ? 'Update Department' : 'Create Department'}
          </button>
        </div>
      </form>
    </EditDrawerCard>
  );
};

export default DepartmentEditDrawer;
