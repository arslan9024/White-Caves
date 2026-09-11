import React, { FC, useState, useCallback } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { 
  UploaderWrap, Title, Dropzone, DropzoneText, 
  UploadList, UploadItem, ImagePreview, ItemMeta, ItemName, ItemStatus 
} from './CloudinaryUploader.style';

interface UploadedFile {
  id: string;
  name: string;
  url: string;
}

export const CloudinaryUploader: FC = () => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      simulateUpload(Array.from(e.dataTransfer.files));
    }
  };

  const simulateUpload = (newFiles: File[]) => {
    setUploading(true);
    
    // Simulate network latency and Cloudinary transform API
    setTimeout(() => {
      const uploaded = newFiles.map(f => ({
        id: Math.random().toString(36).substr(2, 9),
        name: f.name,
        // using a placeholder image for demonstration
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&h=200&fit=crop'
      }));
      setFiles(prev => [...prev, ...uploaded]);
      setUploading(false);
    }, 1500);
  };

  return (
    <UploaderWrap>
      <Title><UploadCloud size={20} color="#38BDF8" /> Media Asset Pipeline</Title>
      <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: 24 }}>
        Securely upload high-res property images to Cloudinary. Auto-generates thumbnails and applies watermarks.
      </p>

      <Dropzone 
        $isDragActive={isDragActive}
        onDragEnter={handleDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => alert("File picker dialog would open here.")}
      >
        <UploadCloud size={32} color={isDragActive ? "#38BDF8" : "#64748B"} />
        <DropzoneText>
          {uploading ? 'Uploading to Cloudinary...' : 'Drag & drop high-res property photos here, or click to select files'}
        </DropzoneText>
      </Dropzone>

      {files.length > 0 && (
        <UploadList>
          {files.map(f => (
            <UploadItem key={f.id}>
              <ImagePreview>
                <img src={f.url} alt={f.name} />
              </ImagePreview>
              <ItemMeta>
                <ItemName>{f.name}</ItemName>
                <ItemStatus>✓ Transformed & CDN Cached</ItemStatus>
              </ItemMeta>
            </UploadItem>
          ))}
        </UploadList>
      )}
    </UploaderWrap>
  );
};
