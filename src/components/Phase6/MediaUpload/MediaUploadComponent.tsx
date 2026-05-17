import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { useMediaUpload } from '../../../hooks/phase6/useMediaUpload';
import { MediaPreview } from './MediaPreview';
import { UploadProgress } from './UploadProgress';
import type { MediaFile, UploadStatus } from '../../../types/phase6.types';

interface MediaUploadProps {
  onUploadComplete: (file: MediaFile) => void;
  onError?: (error: string) => void;
  maxSize?: number;
  allowedTypes?: string[];
  multiple?: boolean;
  conversationId?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DropZone = styled.div<{ isDragActive: boolean }>`
  border: 2px dashed ${(props) => (props.isDragActive ? '#4CAF50' : '#ccc')};
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  background-color: ${(props) =>
    props.isDragActive ? 'rgba(76, 175, 80, 0.1)' : '#f9f9f9'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #4caf50;
    background-color: rgba(76, 175, 80, 0.05);
  }

  &:active {
    background-color: rgba(76, 175, 80, 0.1);
  }
`;

const DropZoneContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  svg {
    width: 48px;
    height: 48px;
    color: #4caf50;
  }

  p {
    margin: 0;
    color: #666;
    font-size: 14px;

    strong {
      color: #333;
      display: block;
      font-size: 16px;
      margin-bottom: 4px;
    }
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  ${(props) =>
    props.variant === 'primary'
      ? `
    background-color: #4CAF50;
    color: white;
    &:hover {
      background-color: #45a049;
    }
  `
      : `
    background-color: #f0f0f0;
    color: #333;
    &:hover {
      background-color: #e0e0e0;
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const FileList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
`;

const ErrorMessage = styled.div`
  background-color: #ffebee;
  border-left: 4px solid #f44336;
  padding: 12px;
  border-radius: 4px;
  color: #c62828;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 12px;

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

const SuccessMessage = styled.div`
  background-color: #e8f5e9;
  border-left: 4px solid #4caf50;
  padding: 12px;
  border-radius: 4px;
  color: #2e7d32;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 12px;

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

export const MediaUploadComponent: React.FC<MediaUploadProps> = ({
  onUploadComplete,
  onError,
  maxSize = 52428800, // 50MB
  allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'audio/mpeg',
    'video/mp4',
  ],
  multiple = true,
  conversationId,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, uploadProgress, isUploading } = useMediaUpload();

  // Validation
  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > maxSize) {
        return `File is too large. Maximum size is ${maxSize / 1024 / 1024}MB`;
      }

      if (!allowedTypes.includes(file.type)) {
        return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
      }

      return null;
    },
    [maxSize, allowedTypes]
  );

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const { files } = e.dataTransfer;
      handleFiles(files);
    },
    []
  );

  // Handle file selection
  const handleFiles = useCallback(
    (files: FileList) => {
      setError(null);
      setSuccess(null);

      const newFiles: File[] = [];
      const errors: string[] = [];

      Array.from(files).forEach((file) => {
        const validationError = validateFile(file);
        if (validationError) {
          errors.push(`${file.name}: ${validationError}`);
        } else {
          newFiles.push(file);
        }
      });

      if (errors.length > 0) {
        setError(errors.join('\n'));
        onError?.(errors.join('\n'));
      }

      if (newFiles.length > 0) {
        if (multiple) {
          setSelectedFiles([...selectedFiles, ...newFiles]);
        } else {
          setSelectedFiles(newFiles);
        }
      }
    },
    [validateFile, multiple, selectedFiles, onError]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      handleFiles(files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Upload selected files
  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0) {
      setError('No files selected');
      return;
    }

    setError(null);
    setSuccess(null);

    for (const file of selectedFiles) {
      try {
        const uploadedFile = await uploadFile(file, conversationId);
        onUploadComplete(uploadedFile);
        setSuccess(`${file.name} uploaded successfully`);
        setSelectedFiles(selectedFiles.filter((f) => f !== file));
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Upload failed';
        setError(errorMsg);
        onError?.(errorMsg);
      }
    }
  }, [selectedFiles, uploadFile, conversationId, onUploadComplete, onError]);

  const handleClear = () => {
    setSelectedFiles([]);
    setError(null);
    setSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  return (
    <Container>
      <DropZone
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        isDragActive={isDragActive}
      >
        <DropZoneContent>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p>
            <strong>Drag and drop your files here</strong>
            or click to select
          </p>
          <small>
            Supported: Images, Documents, Audio, Video (Max {maxSize / 1024 / 1024}MB)
          </small>
        </DropZoneContent>
      </DropZone>

      <HiddenInput
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        onChange={handleInputChange}
        accept={allowedTypes.join(',')}
      />

      {error && (
        <ErrorMessage>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <span>{error}</span>
        </ErrorMessage>
      )}

      {success && (
        <SuccessMessage>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          <span>{success}</span>
        </SuccessMessage>
      )}

      {selectedFiles.length > 0 && (
        <>
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>
              Selected Files ({selectedFiles.length})
            </h4>
            <FileList>
              {selectedFiles.map((file, index) => (
                <MediaPreview
                  key={`${file.name}-${index}`}
                  file={file}
                  onRemove={() => removeFile(index)}
                  isUploading={isUploading && uploadProgress > 0 && uploadProgress < 100}
                  progress={uploadProgress}
                />
              ))}
            </FileList>
          </div>

          {isUploading && <UploadProgress progress={uploadProgress} />}

          <ButtonGroup>
            <Button
              variant="primary"
              onClick={handleUpload}
              disabled={isUploading || selectedFiles.length === 0}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
            <Button variant="secondary" onClick={handleClear} disabled={isUploading}>
              Clear
            </Button>
          </ButtonGroup>
        </>
      )}
    </Container>
  );
};

export default MediaUploadComponent;
