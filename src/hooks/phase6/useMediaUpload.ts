import { useState, useCallback } from 'react';
import type { MediaFile } from '../../types/phase6.types';

interface UploadResponse {
  id: string;
  url: string;
  type: string;
  size: number;
  name: string;
  mimeType: string;
  uploadedAt: string;
}

export const useMediaUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (file: File, conversationId?: string): Promise<MediaFile> => {
      return new Promise((resolve, reject) => {
        setIsUploading(true);
        setError(null);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('file', file);
        if (conversationId) {
          formData.append('conversationId', conversationId);
        }

        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            setUploadProgress(percentComplete);
          }
        });

        // Handle completion
        xhr.addEventListener('load', () => {
          setIsUploading(false);
          setUploadProgress(100);

          if (xhr.status === 200) {
            try {
              const response: UploadResponse = JSON.parse(xhr.responseText);
              const mediaFile: MediaFile = {
                id: response.id,
                url: response.url,
                type: response.type as
                  | 'image'
                  | 'document'
                  | 'audio'
                  | 'video'
                  | 'other',
                size: response.size,
                name: response.name,
                mimeType: response.mimeType,
                uploadedAt: response.uploadedAt,
              };
              resolve(mediaFile);
            } catch (e) {
              const errorMsg = 'Failed to parse upload response';
              setError(errorMsg);
              reject(new Error(errorMsg));
            }
          } else {
            const errorMsg = `Upload failed with status ${xhr.status}`;
            setError(errorMsg);
            reject(new Error(errorMsg));
          }
        });

        // Handle errors
        xhr.addEventListener('error', () => {
          setIsUploading(false);
          const errorMsg = 'Upload error occurred';
          setError(errorMsg);
          reject(new Error(errorMsg));
        });

        xhr.addEventListener('abort', () => {
          setIsUploading(false);
          const errorMsg = 'Upload cancelled';
          setError(errorMsg);
          reject(new Error(errorMsg));
        });

        // Send request
        xhr.open('POST', '/api/phase6/media/upload');
        xhr.send(formData);
      });
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    uploadFile,
    isUploading,
    uploadProgress,
    error,
    clearError,
  };
};

export default useMediaUpload;
