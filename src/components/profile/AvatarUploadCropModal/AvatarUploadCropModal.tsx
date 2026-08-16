import React, { FC } from 'react';
import { useAvatarUploadCropModalLogic } from './AvatarUploadCropModal.logic';
import {
  ModalOverlay,
  ModalCard,
  CropPreviewArea,
} from './AvatarUploadCropModal.style';

export const AvatarUploadCropModal: FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { zoomLevel, setZoomLevel, previewUrl, handleFileSelect } = useAvatarUploadCropModalLogic();

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen} data-testid="avatar-upload-crop-modal">
      <ModalCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, color: '#EF4444' }}>📷 Executive Avatar Photo Upload</h4>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '1.2rem', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        <CropPreviewArea>
          {previewUrl ? (
            <img src={previewUrl} alt="Crop Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoomLevel})` }} />
          ) : (
            <span style={{ fontSize: '2.5rem' }}>👤</span>
          )}
        </CropPreviewArea>

        <div style={{ margin: '1rem 0' }}>
          <label style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>Circular Zoom Level ({zoomLevel.toFixed(1)}x)</label>
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={zoomLevel}
            onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#EF4444' }}
          />
        </div>

        <input type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} id="avatar-input-file" />
        <label
          htmlFor="avatar-input-file"
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '10px',
            background: '#334155',
            color: '#FFF',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: '10px',
          }}
        >
          Select Image File
        </label>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '10px',
            background: '#EF4444',
            color: '#FFF',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          Apply Crop & Save Avatar
        </button>
      </ModalCard>
    </ModalOverlay>
  );
};

export default AvatarUploadCropModal;
