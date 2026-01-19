import React from 'react';
import styled from 'styled-components';

interface MediaPreviewProps {
  file: File;
  onRemove: () => void;
  isUploading?: boolean;
  progress?: number;
}

const PreviewContainer = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f5f5f5;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0e0e0;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FileIcon = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #666;

  svg {
    width: 32px;
    height: 32px;
  }

  span {
    font-size: 12px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    padding: 0 8px;
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background-color: rgba(0, 0, 0, 0.1);
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background-color: #4caf50;
  width: ${(props) => props.progress}%;
  transition: width 0.3s ease;
`;

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) {
    return 'image';
  }
  if (type.startsWith('audio/')) {
    return 'music';
  }
  if (type.startsWith('video/')) {
    return 'video';
  }
  return 'file';
};

export const MediaPreview: React.FC<MediaPreviewProps> = ({
  file,
  onRemove,
  isUploading = false,
  progress = 0,
}) => {
  const [preview, setPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  const iconType = getFileIcon(file.type);

  return (
    <PreviewContainer>
      {preview ? (
        <PreviewImage src={preview} alt={file.name} />
      ) : (
        <FileIcon>
          {iconType === 'music' && (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v9.28c-.47-.46-1.12-.75-1.85-.75C7.82 11.53 6 13.35 6 15.5S7.82 19.47 9.15 19.47c1.23 0 2.29-.68 2.82-1.69.32.04.65.06.99.06 3.59 0 6.5-2.91 6.5-6.5V7h4V3h-7z" />
            </svg>
          )}
          {iconType === 'video' && (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
            </svg>
          )}
          {iconType === 'image' && (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
          )}
          {iconType === 'file' && (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-8-6z" />
            </svg>
          )}
          <span>{file.name.split('.').pop()?.toUpperCase()}</span>
        </FileIcon>
      )}

      <RemoveButton onClick={onRemove} disabled={isUploading}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </RemoveButton>

      {(isUploading || progress > 0) && (
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>
      )}
    </PreviewContainer>
  );
};

export default MediaPreview;
