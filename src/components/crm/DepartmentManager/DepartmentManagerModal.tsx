import React, { FC } from 'react';
import {
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Users,
  Layers,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useDepartmentManagerLogic } from './DepartmentManager.logic';
import {
  ManagerOverlay,
  ManagerModal,
  ModalHeader,
  ModalBody,
  ActionToolbar,
  DepartmentCardGrid,
  DeptCard,
  FormCard,
} from './DepartmentManager.styles';

export interface DepartmentManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDepartmentChanged?: () => void;
}

export const DepartmentManagerModal: FC<DepartmentManagerModalProps> = ({
  isOpen,
  onClose,
  onDepartmentChanged,
}) => {
  const {
    departments,
    loading,
    error,
    setError,
    searchTerm,
    setSearchTerm,
    isFormOpen,
    editingNodeId,
    formData,
    isSubmitting,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    handleFormChange,
    handleSubmit,
    handleDelete,
  } = useDepartmentManagerLogic();

  if (!isOpen) return null;

  const onFormSubmit = async (e: React.FormEvent) => {
    await handleSubmit(e);
    if (onDepartmentChanged) onDepartmentChanged();
  };

  const onDeleteConfirm = async (id: string, name: string) => {
    await handleDelete(id, name);
    if (onDepartmentChanged) onDepartmentChanged();
  };

  return (
    <ManagerOverlay onClick={onClose}>
      <ManagerModal onClick={e => e.stopPropagation()}>
        {/* Header */}
        <ModalHeader>
          <div className="brand-group">
            <Building2 size={24} color="#EF4444" />
            <div>
              <h3>Corporate Departments Management</h3>
              <span>Level 5 Sovereign Founder Hub · 1-12-108 Protocol</span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </ModalHeader>

        {/* Body */}
        <ModalBody>
          {error && (
            <div
              style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#DC2626',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={() => setError(null)}
                style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Action Toolbar */}
          <ActionToolbar>
            <div className="search-wrap">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search departments by code, title, or slug..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            {!isFormOpen && (
              <button className="add-btn" onClick={handleOpenCreate}>
                <Plus size={16} /> Add Corporate Department
              </button>
            )}
          </ActionToolbar>

          {/* Add / Edit Form Card */}
          {isFormOpen && (
            <FormCard onSubmit={onFormSubmit}>
              <h4>
                {editingNodeId ? (
                  <>
                    <Edit2 size={16} color="#EF4444" /> Edit Department
                  </>
                ) : (
                  <>
                    <Plus size={16} color="#EF4444" /> Create New Corporate Department
                  </>
                )}
              </h4>
              <div className="form-grid">
                <div className="form-field">
                  <label>Department Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Asset Management & ESG"
                    value={formData.title}
                    onChange={e => handleFormChange('title', e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label>Code *</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingNodeId}
                    placeholder="e.g. DEPT-13"
                    value={formData.code}
                    onChange={e => handleFormChange('code', e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label>Slug *</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingNodeId}
                    placeholder="e.g. asset-management"
                    value={formData.slug}
                    onChange={e => handleFormChange('slug', e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label>Accent Color</label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={e => handleFormChange('color', e.target.value)}
                    style={{ height: '38px', padding: '2px', cursor: 'pointer' }}
                  />
                </div>
              </div>
              <div className="form-field">
                <label>Description & Mission</label>
                <textarea
                  rows={2}
                  placeholder="Outline core responsibilities and multi-agent directives..."
                  value={formData.description}
                  onChange={e => handleFormChange('description', e.target.value)}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleCloseForm}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting
                    ? 'Saving...'
                    : editingNodeId
                      ? 'Update Department'
                      : 'Create Department'}
                </button>
              </div>
            </FormCard>
          )}

          {/* Department Cards Grid */}
          {loading && !departments.length ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
              Loading corporate department nodes...
            </div>
          ) : !departments.length ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
              No corporate departments found matching "{searchTerm}".
            </div>
          ) : (
            <DepartmentCardGrid>
              {departments.map(dept => (
                <DeptCard key={dept._id} $accentColor={dept.color}>
                  <div className="card-top">
                    <div className="title-group">
                      <span className="code-badge">{dept.code}</span>
                      <h4>{dept.title}</h4>
                      <p>{dept.description || 'Corporate department node'}</p>
                    </div>
                  </div>

                  <div className="card-stats">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Layers size={13} color="#64748B" />
                      <span>{dept.subDeptsCount || 0} Sub-Depts</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={13} color="#64748B" />
                      <span>{dept.headcount || 0} Personnel</span>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button type="button" onClick={() => handleOpenEdit(dept)} title="Edit Details">
                      <Edit2 size={12} /> Edit
                    </button>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => onDeleteConfirm(dept._id, dept.title)}
                      title="Delete Department"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </DeptCard>
              ))}
            </DepartmentCardGrid>
          )}
        </ModalBody>
      </ManagerModal>
    </ManagerOverlay>
  );
};

export default DepartmentManagerModal;
