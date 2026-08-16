import { useState, useCallback } from 'react';

export function useAvatarUploadCropModalLogic() {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, []);

  return {
    zoomLevel,
    setZoomLevel,
    previewUrl,
    handleFileSelect,
  };
}
