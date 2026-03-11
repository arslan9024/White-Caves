import React, { useState, useRef, forwardRef } from 'react';
import * as S from './FileUpload.styles';

interface FileUploadProps {
  label?: string;
  helperText?: string;
  error?: string | boolean;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in bytes
  onFilesSelected?: (files: File[]) => void;
  className?: string;
}

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  ({
    label,
    helperText,
    error,
    required = false,
    disabled = false,
    multiple = false,
    accept = '*',
    maxSize,
    onFilesSelected,
    className = '',
  }, ref) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragActive, setIsDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isError = !!error;

    const handleFiles = (newFiles: FileList | null) => {
      if (!newFiles) return;

      const filesArray = Array.from(newFiles);
      const validFiles = filesArray.filter(file => {
        if (maxSize && file.size > maxSize) {
          return false;
        }
        return true;
      });

      if (multiple) {
        const updatedFiles = [...files, ...validFiles];
        setFiles(updatedFiles);
        onFilesSelected?.(updatedFiles);
      } else {
        setFiles(validFiles.slice(0, 1));
        onFilesSelected?.(validFiles.slice(0, 1));
      }
    };

    const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);
      handleFiles(e.dataTransfer.files);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
    };

    const handleRemoveFile = (index: number) => {
      const updatedFiles = files.filter((_, i) => i !== index);
      setFiles(updatedFiles);
      onFilesSelected?.(updatedFiles);
    };

    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    return (
      <S.Container className={className}>
        {label && (
          <S.Label required={required}>
            {label}
            {required && <S.Required>*</S.Required>}
          </S.Label>
        )}

        <S.DropZone
          isDragActive={isDragActive}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragEnter}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label="File upload area"
        >
          <S.FileInput
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={accept}
            onChange={handleInputChange}
            disabled={disabled}
            aria-invalid={isError}
          />
          <S.UploadIcon>📁</S.UploadIcon>
          <S.UploadText>
            {isDragActive ? 'Drop files here' : 'Drag and drop files here'}
          </S.UploadText>
          <S.UploadHint>or click to select files</S.UploadHint>
        </S.DropZone>

        {files.length > 0 && (
          <S.FileList>
            {files.map((file, index) => (
              <S.FileItem key={`${file.name}-${index}`}>
                <S.FileInfo>
                  <span>📄</span>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    <S.FileName>{file.name}</S.FileName>
                    <S.FileSize>{formatFileSize(file.size)}</S.FileSize>
                  </div>
                </S.FileInfo>
                <S.RemoveButton
                  onClick={() => handleRemoveFile(index)}
                  aria-label={`Remove ${file.name}`}
                >
                  ✕
                </S.RemoveButton>
              </S.FileItem>
            ))}
          </S.FileList>
        )}

        {(helperText || isError) && (
          <S.HelperText error={isError}>
            {error && typeof error === 'string' ? error : helperText}
          </S.HelperText>
        )}
      </S.Container>
    );
  }
);

FileUpload.displayName = 'FileUpload';

export default FileUpload;
