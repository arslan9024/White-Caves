import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { authFetch } from '../../utils/authFetch';

interface ChecklistProperty {
  id: string;
  title?: string;
  unitNumber?: string;
  titleDeedMissing?: boolean;
  landlordPassportMissing?: boolean;
  ejariMissing?: boolean;
  [key: string]: unknown;
}

interface DocumentChecklistProps {
  property: ChecklistProperty;
  onClose: () => void;
  onRefresh: () => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${theme.zIndex.modal};
`;

const Modal = styled.div`
  background: ${theme.colors.background.primary};
  width: 500px;
  max-width: 90%;
  border-radius: ${theme.spacing.md};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.xl};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border};
  padding-bottom: ${theme.spacing.sm};
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  color: ${theme.colors.text.primary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${theme.colors.text.secondary};
`;

const DocRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.md} 0;
  border-bottom: 1px solid ${theme.colors.border};
`;

const DocStatus = styled.div<{ $missing: boolean }>`
  color: ${props => (props.$missing ? theme.colors.error : theme.colors.success)};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UploadLabel = styled.label`
  background: ${theme.colors.primary};
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  &:hover {
    opacity: 0.9;
  }
`;

const ErrorBanner = styled.div`
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: ${theme.spacing.md};
  background: #fdecea;
  border-left: 4px solid #f44336;
  color: #b71c1c;
`;

export const DocumentChecklist: React.FC<DocumentChecklistProps> = ({
  property,
  onClose,
  onRefresh,
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('document', e.target.files[0]);
    formData.append('documentType', docType);

    try {
      const res = await authFetch(`/api/leasing-inventory/${property.id}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.fileUrl) {
          setPreviewUrl(json.data.fileUrl);
        }
        setUploadError(null);
        onRefresh();
      } else {
        setUploadError('Upload failed');
      }
    } catch {
      setUploadError('Upload error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <Title>Document Checklist: {property.unitNumber || property.title}</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Header>
        {uploadError && (
          <ErrorBanner role="alert" data-testid="doc-checklist-error">
            ⚠️ {uploadError}
          </ErrorBanner>
        )}

        <DocRow>
          <DocStatus $missing={!!property.titleDeedMissing}>
            {property.titleDeedMissing ? '❌ Missing Title Deed' : '✅ Title Deed Verified'}
          </DocStatus>
          {property.titleDeedMissing && (
            <>
              <UploadLabel>
                {uploading ? 'Uploading...' : 'Upload'}
                <input
                  type="file"
                  hidden
                  onChange={e => handleUpload(e, 'titleDeed')}
                  disabled={uploading}
                />
              </UploadLabel>
            </>
          )}
        </DocRow>

        <DocRow>
          <DocStatus $missing={!!property.landlordPassportMissing}>
            {property.landlordPassportMissing ? '❌ Missing Passport' : '✅ Passport Verified'}
          </DocStatus>
          {property.landlordPassportMissing && (
            <UploadLabel>
              {uploading ? 'Uploading...' : 'Upload'}
              <input
                type="file"
                hidden
                onChange={e => handleUpload(e, 'passport')}
                disabled={uploading}
              />
            </UploadLabel>
          )}
        </DocRow>

        <DocRow>
          <DocStatus $missing={!!property.ejariMissing}>
            {property.ejariMissing ? '❌ Missing Ejari' : '✅ Ejari Verified'}
          </DocStatus>
          {property.ejariMissing && (
            <UploadLabel>
              {uploading ? 'Uploading...' : 'Upload'}
              <input
                type="file"
                hidden
                onChange={e => handleUpload(e, 'ejari')}
                disabled={uploading}
              />
            </UploadLabel>
          )}
        </DocRow>

        {previewUrl && (
          <div style={{ marginTop: theme.spacing.lg }}>
            <h4 style={{ marginBottom: theme.spacing.sm }}>Document Preview</h4>
            <iframe
              src={previewUrl}
              style={{
                width: '100%',
                height: '300px',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.spacing.sm,
              }}
              title="Document Preview"
            />
          </div>
        )}
      </Modal>
    </Overlay>
  );
};
