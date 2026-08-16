import React, { FC, useState } from 'react';
import styled from 'styled-components';

const GalleryContainer = styled.div`
  position: relative;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid #EF4444;
`;

const MainImageArea = styled.div`
  width: 100%;
  height: 360px;
  background: radial-gradient(circle at center, #1E293B 0%, #0F172A 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
`;

export const PropertyLightboxGallery: FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(1);

  return (
    <GalleryContainer data-testid="property-lightbox-gallery">
      <MainImageArea>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '3rem' }}>🏞️</span>
          <h4 style={{ margin: '8px 0 0', color: '#EF4444' }}>Palm Jumeirah Signature Villa — Photo {selectedIdx} of 4</h4>
        </div>
      </MainImageArea>

      <div style={{ display: 'flex', gap: '8px', padding: '10px', background: '#0F172A' }}>
        {[1, 2, 3, 4].map((idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIdx(idx)}
            style={{
              flex: 1,
              padding: '12px',
              background: selectedIdx === idx ? 'rgba(239,68,68,0.2)' : '#1E293B',
              border: '1.5px solid ' + (selectedIdx === idx ? '#EF4444' : 'transparent'),
              borderRadius: '8px',
              color: '#FFF',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Photo {idx}
          </button>
        ))}
      </div>
    </GalleryContainer>
  );
};

export default PropertyLightboxGallery;
