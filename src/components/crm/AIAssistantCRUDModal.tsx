/**
 * AI Assistant CRUD Modal Component
 * =================================
 * Modal dialog for creating, editing, viewing, and deleting AI Assistants
 * with form integration and state management
 */

import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import AIAssistantCRUDForm from './AIAssistantCRUDForm';
import {
  AIAssistantFormData,
  AIAssistantCRUDModalProps,
} from './AIAssistantCRUD.types';
import {
  useAIAssistantFormState,
  useAIAssistantFormValidation,
  useAIAssistantCRUDAPI,
  useFormPersistence,
} from './aiAssistantCRUDHooks';

// ============================================================================
// STYLES
// ============================================================================

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? 'visible' : 'hidden')};
  transition: all 0.3s ease;
`;

const Modal = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  max-height: 90vh;
  max-width: 700px;
  width: 90%;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    max-height: 95vh;
    width: 95%;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
    color: #333;
  }
`;

const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const MessageContainer = styled.div<{ $type: 'success' | 'error' }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 15px;
  border-radius: 8px;
  background: ${(props) => (props.$type === 'success' ? '#e8f5e9' : '#ffebee')};
  border: 1px solid ${(props) => (props.$type === 'success' ? '#a5d6a7' : '#ef9a9a')};
  color: ${(props) => (props.$type === 'success' ? '#2e7d32' : '#c62828')};

  p {
    margin: 0;
    font-size: 14px;
  }
`;

const DeleteConfirmation = styled.div`
  padding: 20px;
  background: #fff3e0;
  border: 1px solid #ffe0b2;
  border-radius: 8px;
  margin-bottom: 15px;

  h4 {
    margin: 0 0 8px 0;
    color: #e65100;
    font-size: 14px;
  }

  p {
    margin: 0 0 15px 0;
    color: #bf360c;
    font-size: 13px;
  }
`;

const DeleteButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const Button = styled.button<{ $variant?: 'danger' | 'secondary' }>`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  background: ${(props) =>
    props.$variant === 'danger' ? '#d32f2f' : '#e0e0e0'};
  color: ${(props) => (props.$variant === 'danger' ? 'white' : '#333')};

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

// ============================================================================
// COMPONENT
// ============================================================================

const AIAssistantCRUDModal: FC<AIAssistantCRUDModalProps> = ({
  isOpen,
  mode,
  assistantId,
  onClose,
  onSuccess,
  onError,
}) => {
  const { validate } = useAIAssistantFormValidation();
  const formState = useAIAssistantFormState();
  const api = useAIAssistantCRUDAPI();
  const { getSavedData, clearSavedData } = useFormPersistence(
    `assistant-form-${assistantId || 'new'}`,
    formState.formData
  );

  const [message, setMessage] = React.useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  // Load existing assistant data
  useEffect(() => {
    if (isOpen && (mode === 'edit' || mode === 'view') && assistantId) {
      const loadAssistant = async () => {
        formState.setIsSubmitting(true);
        try {
          const response = await api.read(assistantId);
          if (response.success && response.data) {
            formState.updateFormData(response.data);
          } else {
            setMessage({
              type: 'error',
              text: response.error || 'Failed to load assistant',
            });
          }
        } catch (error) {
          setMessage({
            type: 'error',
            text: error instanceof Error ? error.message : 'Failed to load assistant',
          });
        } finally {
          formState.setIsSubmitting(false);
        }
      };

      loadAssistant();
    }

    if (isOpen && mode === 'create') {
      // Check for saved draft
      const savedData = getSavedData();
      if (savedData) {
        formState.updateFormData(savedData);
      }
    }
  }, [isOpen, mode, assistantId]);

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [message]);

  const handleFormSubmit = async (data: AIAssistantFormData) => {
    // Validate
    const validation = validate(data);
    if (!validation.isValid) {
      formState.setValidationErrors(validation.errors);
      return;
    }

    formState.setValidationErrors([]);
    formState.setIsSubmitting(true);

    try {
      let response;

      if (mode === 'create') {
        response = await api.create(data);
      } else if (mode === 'edit' && assistantId) {
        response = await api.update({ ...data, id: assistantId });
      } else {
        throw new Error('Invalid operation');
      }

      if (response.success) {
        setMessage({
          type: 'success',
          text: `Assistant ${mode === 'create' ? 'created' : 'updated'} successfully`,
        });

        clearSavedData(); // Clear draft on success
        formState.resetForm();

        if (onSuccess) {
          setTimeout(() => {
            onSuccess(response.data || data, mode);
            onClose();
          }, 1500);
        } else {
          setTimeout(() => {
            onClose();
          }, 1500);
        }
      } else {
        setMessage({
          type: 'error',
          text: response.error || 'Operation failed',
        });
        if (onError) {
          onError(response.error || 'Operation failed');
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setMessage({
        type: 'error',
        text: errorMessage,
      });
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      formState.setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!assistantId) return;

    setIsDeleting(true);
    try {
      const response = await api.delete(assistantId);

      if (response.success) {
        setMessage({
          type: 'success',
          text: 'Assistant deleted successfully',
        });

        if (onSuccess) {
          setTimeout(() => {
            onSuccess(formState.formData, mode);
            onClose();
          }, 1500);
        } else {
          setTimeout(() => {
            onClose();
          }, 1500);
        }
      } else {
        setMessage({
          type: 'error',
          text: response.error || 'Failed to delete assistant',
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete';
      setMessage({
        type: 'error',
        text: errorMessage,
      });
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Create New AI Assistant';
      case 'edit':
        return 'Edit AI Assistant';
      case 'view':
        return 'View AI Assistant';
      case 'delete':
        return 'Delete AI Assistant';
      default:
        return 'AI Assistant';
    }
  };

  return (
    <Overlay $isOpen={isOpen} onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{getTitle()}</ModalTitle>
          <CloseButton onClick={onClose} disabled={formState.isSubmitting}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalContent>
          {/* Messages */}
          {message && (
            <MessageContainer $type={message.type}>
              {message.type === 'success' ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <p>{message.text}</p>
            </MessageContainer>
          )}

          {/* Delete Confirmation */}
          {mode === 'delete' && !isDeleting && (
            <>
              <DeleteConfirmation>
                <h4>⚠️ Confirm Deletion</h4>
                <p>
                  Are you sure you want to delete
                  {' '}
                  <strong>{formState.formData.name}</strong>
                  ?
                </p>
                <p>This action cannot be undone and may affect dependent systems.</p>
              </DeleteConfirmation>

              <DeleteButtonGroup>
                <Button
                  $variant="secondary"
                  onClick={onClose}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  $variant="danger"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                </Button>
              </DeleteButtonGroup>
            </>
          )}

          {/* Form */}
          {mode !== 'delete' && (mode === 'create' || mode === 'edit' || mode === 'view') && (
            <AIAssistantCRUDForm
              initialData={formState.formData}
              mode={mode}
              onSubmit={handleFormSubmit}
              onCancel={onClose}
              isLoading={formState.isSubmitting}
              validationErrors={formState.validationErrors}
            />
          )}
        </ModalContent>
      </Modal>
    </Overlay>
  );
};

export default AIAssistantCRUDModal;
