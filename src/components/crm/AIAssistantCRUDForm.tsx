/**
 * AI Assistant CRUD Form Component
 * ================================
 * Comprehensive form for creating, editing, and viewing AI Assistants
 * with validation, field management, and user-friendly interface
 */

import React, { FC, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import {
  X, Plus, Trash2, AlertCircle, Save, Eye, EyeOff,
} from 'lucide-react';
import {
  AIAssistantFormData,
  AIAssistantCRUDFormProps,
  DEPARTMENTS,
  CAPABILITIES_PREDEFINED,
  FormValidationError,
} from './AIAssistantCRUD.types';

// ============================================================================
// STYLES
// ============================================================================

const FormContainer = styled.div<{ $disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 600px;
  opacity: ${(props) => (props.$disabled ? 0.6 : 1)};
  pointer-events: ${(props) => (props.$disabled ? 'none' : 'auto')};
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  border-left: 3px solid #0066cc;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label<{ $error?: boolean }>`
  font-weight: 600;
  font-size: 14px;
  color: ${(props) => (props.$error ? '#d32f2f' : '#333')};
`;

const Input = styled.input<{ $error?: boolean }>`
  padding: 10px 12px;
  border: 2px solid ${(props) => (props.$error ? '#d32f2f' : '#ddd')};
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea<{ $error?: boolean }>`
  padding: 10px 12px;
  border: 2px solid ${(props) => (props.$error ? '#d32f2f' : '#ddd')};
  border-radius: 6px;
  font-size: 14px;
  min-height: 80px;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const Select = styled.select<{ $error?: boolean }>`
  padding: 10px 12px;
  border: 2px solid ${(props) => (props.$error ? '#d32f2f' : '#ddd')};
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  font-size: 12px;
  color: #d32f2f;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CapabilityTagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const CapabilityTag = styled.div<{ $selected?: boolean }>`
  padding: 6px 12px;
  background: ${(props) => (props.$selected ? '#0066cc' : '#e0e0e0')};
  color: ${(props) => (props.$selected ? 'white' : '#333')};
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: ${(props) => (props.$selected ? '#005cb3' : '#d0d0d0')};
  }
`;

const CustomCapabilityInput = styled.div`
  display: flex;
  gap: 8px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 10px;
  border-top: 1px solid #ddd;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  background: ${(props) => {
    switch (props.$variant) {
      case 'danger':
        return '#d32f2f';
      case 'secondary':
        return '#f5f5f5';
      default:
        return '#0066cc';
    }
  }};

  color: ${(props) => (props.$variant === 'secondary' ? '#333' : 'white')};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const PermissionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const PermissionItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  input {
    cursor: pointer;
  }

  &:hover {
    background: #f5f5f5;
  }
`;

// ============================================================================
// COMPONENT
// ============================================================================

interface AIAssistantCRUDFormInternalProps extends AIAssistantCRUDFormProps {
  mode: 'create' | 'edit' | 'view';
}

const AIAssistantCRUDForm: FC<AIAssistantCRUDFormInternalProps> = ({
  initialData,
  mode,
  onSubmit,
  onCancel,
  isLoading = false,
  validationErrors = [],
}) => {
  const [formData, setFormData] = React.useState<AIAssistantFormData>(
    initialData || {
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
    }
  );

  const [newCapability, setNewCapability] = React.useState('');
  const [newEndpoint, setNewEndpoint] = React.useState('');
  const isReadOnly = mode === 'view';

  const errorsByField = useMemo(
    () =>
      validationErrors.reduce(
        (acc, error) => {
          acc[error.field] = error;
          return acc;
        },
        {} as Record<string, FormValidationError>
      ),
    [validationErrors]
  );

  const handleFieldChange = useCallback(
    (field: keyof AIAssistantFormData, value: unknown) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handlePermissionChange = useCallback(
    (roleOrLevel: string, type: 'viewableBy' | 'accessibleBy' | 'dataAccessLevel') => {
      setFormData((prev) => {
        if (type === 'dataAccessLevel') {
          return {
            ...prev,
            permissions: {
              ...prev.permissions,
              [type]: roleOrLevel as 'full' | 'departmental' | 'limited',
            },
          };
        }

        const currentArray = prev.permissions[type];
        const newArray = currentArray.includes(roleOrLevel)
          ? currentArray.filter((r) => r !== roleOrLevel)
          : [...currentArray, roleOrLevel];

        return {
          ...prev,
          permissions: {
            ...prev.permissions,
            [type]: newArray,
          },
        };
      });
    },
    []
  );

  const addCapability = useCallback(() => {
    if (newCapability.trim() && !formData.capabilities.includes(newCapability)) {
      setFormData((prev) => ({
        ...prev,
        capabilities: [...prev.capabilities, newCapability],
      }));
      setNewCapability('');
    }
  }, [newCapability, formData.capabilities]);

  const removeCapability = useCallback((capability: string) => {
    setFormData((prev) => ({
      ...prev,
      capabilities: prev.capabilities.filter((c) => c !== capability),
    }));
  }, []);

  const addEndpoint = useCallback(() => {
    if (newEndpoint.trim() && !formData.apiEndpoints.includes(newEndpoint)) {
      setFormData((prev) => ({
        ...prev,
        apiEndpoints: [...prev.apiEndpoints, newEndpoint],
      }));
      setNewEndpoint('');
    }
  }, [newEndpoint, formData.apiEndpoints]);

  const removeEndpoint = useCallback((endpoint: string) => {
    setFormData((prev) => ({
      ...prev,
      apiEndpoints: prev.apiEndpoints.filter((e) => e !== endpoint),
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isReadOnly) {
        await onSubmit(formData);
      }
    },
    [formData, onSubmit, isReadOnly]
  );

  return (
    <FormContainer $disabled={isLoading}>
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <FormSection>
          <h3>Basic Information</h3>

          <FormGroup>
            <Label $error={!!errorsByField.name}>Name *</Label>
            <Input
              type="text"
              disabled={isReadOnly || isLoading}
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              $error={!!errorsByField.name}
              placeholder="e.g., Linda WhatsApp"
            />
            {errorsByField.name && (
              <ErrorMessage>
                <AlertCircle size={14} />
                {errorsByField.name.message}
              </ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label $error={!!errorsByField.title}>Title *</Label>
            <Input
              type="text"
              disabled={isReadOnly || isLoading}
              value={formData.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              $error={!!errorsByField.title}
              placeholder="Assistant's professional title"
            />
            {errorsByField.title && (
              <ErrorMessage>
                <AlertCircle size={14} />
                {errorsByField.title.message}
              </ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label $error={!!errorsByField.department}>Department *</Label>
            <Select
              disabled={isReadOnly || isLoading}
              value={formData.department}
              onChange={(e) => handleFieldChange('department', e.target.value)}
              $error={!!errorsByField.department}
            >
              <option value="">Select a department...</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept.charAt(0).toUpperCase() + dept.slice(1)}
                </option>
              ))}
            </Select>
            {errorsByField.department && (
              <ErrorMessage>
                <AlertCircle size={14} />
                {errorsByField.department.message}
              </ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label $error={!!errorsByField.description}>Description *</Label>
            <TextArea
              disabled={isReadOnly || isLoading}
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              $error={!!errorsByField.description}
              placeholder="Detailed description of this assistant's role and responsibilities"
            />
            {errorsByField.description && (
              <ErrorMessage>
                <AlertCircle size={14} />
                {errorsByField.description.message}
              </ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Color Scheme</Label>
            <Select
              disabled={isReadOnly || isLoading}
              value={formData.colorScheme}
              onChange={(e) => handleFieldChange('colorScheme', e.target.value)}
            >
              <option value="primary">Primary Blue</option>
              <option value="secondary">Secondary Gray</option>
              <option value="success">Success Green</option>
              <option value="danger">Danger Red</option>
              <option value="warning">Warning Orange</option>
            </Select>
          </FormGroup>
        </FormSection>

        {/* Dashboard & URLs */}
        <FormSection>
          <h3>Dashboard & Integration</h3>

          <FormGroup>
            <Label $error={!!errorsByField.dashboardUrl}>Dashboard URL *</Label>
            <Input
              type="url"
              disabled={isReadOnly || isLoading}
              value={formData.dashboardUrl}
              onChange={(e) => handleFieldChange('dashboardUrl', e.target.value)}
              $error={!!errorsByField.dashboardUrl}
              placeholder="https://dashboard.example.com"
            />
            {errorsByField.dashboardUrl && (
              <ErrorMessage>
                <AlertCircle size={14} />
                {errorsByField.dashboardUrl.message}
              </ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label>API Endpoints</Label>
            <CustomCapabilityInput>
              <Input
                type="text"
                disabled={isReadOnly || isLoading}
                value={newEndpoint}
                onChange={(e) => setNewEndpoint(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isReadOnly) {
                    e.preventDefault();
                    addEndpoint();
                  }
                }}
                placeholder="e.g., /api/v1/messages"
              />
              <Button
                type="button"
                disabled={isReadOnly || isLoading || !newEndpoint.trim()}
                onClick={addEndpoint}
              >
                <Plus size={16} />
              </Button>
            </CustomCapabilityInput>
            {formData.apiEndpoints.length > 0 && (
              <CapabilityTagsContainer>
                {formData.apiEndpoints.map((endpoint) => (
                  <CapabilityTag key={endpoint}>
                    {endpoint}
                    {!isReadOnly && (
                      <X
                        size={12}
                        style={{ cursor: 'pointer' }}
                        onClick={() => removeEndpoint(endpoint)}
                      />
                    )}
                  </CapabilityTag>
                ))}
              </CapabilityTagsContainer>
            )}
          </FormGroup>
        </FormSection>

        {/* Capabilities */}
        <FormSection>
          <h3>Capabilities</h3>

          <FormGroup>
            <Label $error={!!errorsByField.capabilities}>Capabilities *</Label>

            <CustomCapabilityInput>
              <Input
                type="text"
                disabled={isReadOnly || isLoading}
                value={newCapability}
                onChange={(e) => setNewCapability(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isReadOnly) {
                    e.preventDefault();
                    addCapability();
                  }
                }}
                placeholder="Add custom capability or select from below"
              />
              <Button
                type="button"
                $variant="secondary"
                disabled={isReadOnly || isLoading || !newCapability.trim()}
                onClick={addCapability}
              >
                <Plus size={16} />
              </Button>
            </CustomCapabilityInput>

            {/* Selected Capabilities */}
            {formData.capabilities.length > 0 && (
              <CapabilityTagsContainer>
                {formData.capabilities.map((cap) => (
                  <CapabilityTag key={cap} $selected>
                    {cap}
                    {!isReadOnly && (
                      <X
                        size={12}
                        style={{ cursor: 'pointer' }}
                        onClick={() => removeCapability(cap)}
                      />
                    )}
                  </CapabilityTag>
                ))}
              </CapabilityTagsContainer>
            )}

            {/* Predefined Capabilities */}
            <div style={{ marginTop: '10px' }}>
              <small style={{ color: '#666' }}>
                Click to add predefined capability:
              </small>
              <CapabilityTagsContainer style={{ marginTop: '8px' }}>
                {CAPABILITIES_PREDEFINED.map((cap) => (
                  <CapabilityTag
                    key={cap}
                    $selected={formData.capabilities.includes(cap)}
                    onClick={() => {
                      if (!isReadOnly) {
                        if (formData.capabilities.includes(cap)) {
                          removeCapability(cap);
                        } else {
                          setFormData((prev) => ({
                            ...prev,
                            capabilities: [...prev.capabilities, cap],
                          }));
                        }
                      }
                    }}
                  >
                    {cap}
                  </CapabilityTag>
                ))}
              </CapabilityTagsContainer>
            </div>

            {errorsByField.capabilities && (
              <ErrorMessage>
                <AlertCircle size={14} />
                {errorsByField.capabilities.message}
              </ErrorMessage>
            )}
          </FormGroup>
        </FormSection>

        {/* Permissions */}
        <FormSection>
          <h3>Access Permissions</h3>

          <FormGroup>
            <Label>Viewable By</Label>
            <PermissionsGrid>
              {['owner', 'admin', 'manager', 'team_member'].map((role) => (
                <PermissionItem key={role}>
                  <input
                    type="checkbox"
                    disabled={isReadOnly || isLoading}
                    checked={formData.permissions.viewableBy.includes(role)}
                    onChange={() => handlePermissionChange(role, 'viewableBy')}
                  />
                  {role.replace('_', ' ').toUpperCase()}
                </PermissionItem>
              ))}
            </PermissionsGrid>
          </FormGroup>

          <FormGroup>
            <Label>Access By</Label>
            <PermissionsGrid>
              {['owner', 'admin', 'manager', 'team_member'].map((role) => (
                <PermissionItem key={role}>
                  <input
                    type="checkbox"
                    disabled={isReadOnly || isLoading}
                    checked={formData.permissions.accessibleBy.includes(role)}
                    onChange={() => handlePermissionChange(role, 'accessibleBy')}
                  />
                  {role.replace('_', ' ').toUpperCase()}
                </PermissionItem>
              ))}
            </PermissionsGrid>
          </FormGroup>

          <FormGroup>
            <Label>Data Access Level</Label>
            <Select
              disabled={isReadOnly || isLoading}
              value={formData.permissions.dataAccessLevel}
              onChange={(e) =>
                handlePermissionChange(
                  e.target.value,
                  'dataAccessLevel'
                )
              }
            >
              <option value="full">Full Access</option>
              <option value="departmental">Departmental Only</option>
              <option value="limited">Limited Access</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>
              <input
                type="checkbox"
                disabled={isReadOnly || isLoading}
                checked={formData.isActive}
                onChange={(e) => handleFieldChange('isActive', e.target.checked)}
              />
              {' '}Active
            </Label>
          </FormGroup>
        </FormSection>

        {/* Buttons */}
        <ButtonGroup>
          <Button
            type="button"
            $variant="secondary"
            disabled={isLoading}
            onClick={onCancel}
          >
            <X size={16} />
            Cancel
          </Button>
          {!isReadOnly && (
            <Button
              type="submit"
              $variant="primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Eye size={16} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {mode === 'create' ? 'Create' : 'Update'}
                </>
              )}
            </Button>
          )}
        </ButtonGroup>
      </form>
    </FormContainer>
  );
};

export default AIAssistantCRUDForm;
