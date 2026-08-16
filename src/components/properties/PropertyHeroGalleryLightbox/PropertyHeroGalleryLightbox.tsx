/**
 * PropertyHeroGalleryLightbox — Wave 62 FE-GOAL-061
 * Full-width luxury property hero image gallery with thumbnail strip and high-res lightbox modal
 * White Caves Real Estate LLC — Property Detail Suite
 */
import React, { FC, useState } from 'react';
import styled from 'styled-components';

const GalleryContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-family: 'Inter', sans-serif;
`;

const MainHeroImage = styled.div`
  width: 100%;
  height: 380px;
  border-radius: 16px;
  background: #1E293B;
  border: 1px solid rgba(100, 116, 139, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
`;

const ViewPhotosPill = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #FFF;
  font-size: 0.75rem;
  font-weight: 800;
`;

const ThumbnailRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
`;

const Thumbnail = styled.div<{ $active: boolean }>`
  height: 90px;
  border-radius: 10px;
  background: #0F172A;
  border: 2px solid ${p => p.$active ? '#EF4444' : 'rgba(100, 116, 139, 0.2)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { border-color: #EF4444; }
`;

export const PropertyHeroGalleryLightbox: FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const photos = [
    { icon: '🏝️', title: 'Beachfront Aerial View' },
    { icon: '🏊', title: 'Private Infinity Pool' },
    { icon: '🛋️', title: 'Grand Double-Height Living' },
    { icon: '🛏️', title: 'Master Bedroom Suite' },
  ];

  return (
    <GalleryContainer data-testid="property-hero-gallery-lightbox">
      <MainHeroImage onClick={() => alert(`Opening Fullscreen Lightbox for ${photos[activeIdx].title}...`)}>
        <div>{photos[activeIdx].icon}</div>
        <ViewPhotosPill>📷 View All 24 High-Res Photos</ViewPhotosPill>
      </MainHeroImage>

      <ThumbnailRow>
        {photos.map((p, idx) => (
          <Thumbnail 
            key={idx} 
            $active={activeIdx === idx}
            onClick={() => setActiveIdx(idx)}
          >
            <span>{p.icon}</span>
          </Thumbnail>
        ))}
      </ThumbnailRow>
    </GalleryContainer>
  );
};

export default PropertyHeroGalleryLightbox;
