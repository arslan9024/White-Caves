import React, { memo, useState, useCallback } from 'react';
import { 
  ChevronLeft, ChevronRight, Maximize2, X, Grid, 
  Image, MapPin, Bed, Bath, Square, Tag
} from 'lucide-react';
import * as S from './PropertyComponents.styles';

interface MediaImage {
  url?: string;
}

/** Extract URL string from a MediaImage or plain string */
const getImageUrl = (image: MediaImage | string): string => {
  if (typeof image === 'string') return image;
  return image?.url || '';
};

interface PropertyMediaGalleryProps {
  images?: (MediaImage | string)[];
  title?: string;
  onImageClick?: (index: number) => void;
  showThumbnails?: boolean;
  maxThumbnails?: number;
}

const PropertyMediaGallery = memo(({ 
  images = [],
  title = '',
  onImageClick,
  showThumbnails = true,
  maxThumbnails = 5
}: PropertyMediaGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const handlePrev = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
  }, [images.length]);
  
  const handleNext = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
  }, [images.length]);
  
  const handleThumbnailClick = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);
  
  if (images.length === 0) {
    return (
      <S.PropertyGallery $isEmpty>
        <Image size={48} />
        <span>No images available</span>
      </S.PropertyGallery>
    );
  }
  
  return (
    <>
      <S.PropertyGallery>
        <S.GalleryMain>
          <S.GalleryImage
            src={getImageUrl(images[currentIndex])} 
            alt={`${title} - Image ${currentIndex + 1}`}
            onClick={() => setIsFullscreen(true)}
          />
          
          {images.length > 1 && (
            <>
              <S.GalleryNav $position="prev" onClick={handlePrev}>
                <ChevronLeft size={20} />
              </S.GalleryNav>
              <S.GalleryNav $position="next" onClick={handleNext}>
                <ChevronRight size={20} />
              </S.GalleryNav>
            </>
          )}
          
          <S.FullscreenBtn 
            onClick={() => setIsFullscreen(true)}
          >
            <Maximize2 size={16} />
          </S.FullscreenBtn>
          
          <S.ImageCounter>
            {currentIndex + 1} / {images.length}
          </S.ImageCounter>
        </S.GalleryMain>
        
        {showThumbnails && images.length > 1 && (
          <S.GalleryThumbnails>
            {images.slice(0, maxThumbnails).map((image, index) => (
              <S.Thumbnail
                key={getImageUrl(image) || `thumbnail-${index}`}
                $active={index === currentIndex}
                onClick={() => handleThumbnailClick(index)}
              >
                <img 
                  src={getImageUrl(image)} 
                  alt={`Thumbnail ${index + 1}`}
                  loading="lazy"
                  width={120}
                  height={80}
                />
              </S.Thumbnail>
            ))}
            {images.length > maxThumbnails && (
              <S.Thumbnail $isMore>
                <Grid size={16} />
                <span>+{images.length - maxThumbnails}</span>
              </S.Thumbnail>
            )}
          </S.GalleryThumbnails>
        )}
      </S.PropertyGallery>
      
      {isFullscreen && (
        <S.FullscreenOverlay onClick={() => setIsFullscreen(false)} role="dialog" aria-modal="true" aria-label={`${title} - Fullscreen gallery`} onKeyDown={(e) => { if (e.key === 'Escape') setIsFullscreen(false); }}>
          <S.CloseFullscreenBtn onClick={() => setIsFullscreen(false)}>
            <X size={24} />
          </S.CloseFullscreenBtn>
          <img 
            src={getImageUrl(images[currentIndex])} 
            alt={`${title} - Fullscreen`}
            loading="lazy"
            width={400}
            height={300}
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <>
              <S.FullscreenNav 
                $position="prev" 
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              >
                <ChevronLeft size={32} />
              </S.FullscreenNav>
              <S.FullscreenNav 
                $position="next"
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
              >
                <ChevronRight size={32} />
              </S.FullscreenNav>
            </>
          )}
        </S.FullscreenOverlay>
      )}
    </>
  );
});

PropertyMediaGallery.displayName = 'PropertyMediaGallery';

interface PropertyData {
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  type?: string;
  location?: string;
  address?: string;
  title?: string;
  unitNumber?: string;
  purpose?: string;
  price?: number;
  commission?: number;
  serviceCharge?: number;
  description?: string;
  images?: (MediaImage | string)[];
  owner?: {
    avatar?: string;
    name?: string;
    phone?: string;
    email?: string;
  };
  [key: string]: unknown;
}

interface PropertySpecsGridProps {
  property?: PropertyData | null;
}

const PropertySpecsGrid = memo(({ property }: PropertySpecsGridProps) => {
  if (!property) return null;
  
  const specs = [
    { icon: Bed, label: 'Bedrooms', value: property.bedrooms },
    { icon: Bath, label: 'Bathrooms', value: property.bathrooms },
    { icon: Square, label: 'Area', value: `${property.area?.toLocaleString()} sqft` },
    { icon: Tag, label: 'Type', value: property.type },
    { icon: MapPin, label: 'Location', value: property.location }
  ].filter(spec => spec.value);
  
  return (
    <S.PropertySpecsGrid>
      {specs.map((spec) => (
        <S.SpecItem key={spec.label}>
          <spec.icon size={18} />
          <S.SpecContent>
            <S.SpecValue>{spec.value}</S.SpecValue>
            <S.SpecLabel>{spec.label}</S.SpecLabel>
          </S.SpecContent>
        </S.SpecItem>
      ))}
    </S.PropertySpecsGrid>
  );
});

PropertySpecsGrid.displayName = 'PropertySpecsGrid';

interface PropertyDetailContainerProps {
  property?: PropertyData | null;
  onClose?: () => void;
  showOwnerInfo?: boolean;
  showFinancials?: boolean;
}

const PropertyDetailContainer = memo(({ 
  property,
  onClose,
  showOwnerInfo = true,
  showFinancials = true
}: PropertyDetailContainerProps) => {
  if (!property) return null;
  
  return (
    <S.PropertyDetailContainer>
      <S.DetailHeader>
        <S.HeaderInfo>
          <h2>{property.title || property.unitNumber}</h2>
          <S.PropertyAddress>
            <MapPin size={14} />
            {property.location || property.address}
          </S.PropertyAddress>
        </S.HeaderInfo>
        <S.HeaderPrice>
          <S.PriceLabel>{property.purpose || 'Price'}</S.PriceLabel>
          <S.PriceValue>
            AED {property.price?.toLocaleString()}
          </S.PriceValue>
        </S.HeaderPrice>
        {onClose && (
          <S.CloseBtn onClick={onClose}>
            <X size={20} />
          </S.CloseBtn>
        )}
      </S.DetailHeader>
      
      <PropertyMediaGallery 
        images={property.images || []}
        title={property.title}
      />
      
      <PropertySpecsGrid property={property} />
      
      {showOwnerInfo && property.owner && (
        <S.DetailSection>
          <h4>Owner Information</h4>
          <S.OwnerCard>
            <S.OwnerAvatar>
              {property.owner.avatar || property.owner.name?.charAt(0)}
            </S.OwnerAvatar>
            <S.OwnerDetails>
              <S.OwnerName>{property.owner.name}</S.OwnerName>
              <S.OwnerContact>{property.owner.phone}</S.OwnerContact>
              <S.OwnerContact>{property.owner.email}</S.OwnerContact>
            </S.OwnerDetails>
          </S.OwnerCard>
        </S.DetailSection>
      )}
      
      {showFinancials && (
        <S.DetailSection>
          <h4>Financial Details</h4>
          <S.FinancialGrid>
            <S.FinancialItem>
              <S.FinLabel>List Price</S.FinLabel>
              <S.FinValue>AED {property.price?.toLocaleString()}</S.FinValue>
            </S.FinancialItem>
            {property.commission && (
              <S.FinancialItem>
                <S.FinLabel>Commission</S.FinLabel>
                <S.FinValue>{property.commission}%</S.FinValue>
              </S.FinancialItem>
            )}
            {property.serviceCharge && (
              <S.FinancialItem>
                <S.FinLabel>Service Charge</S.FinLabel>
                <S.FinValue>AED {property.serviceCharge?.toLocaleString()}/yr</S.FinValue>
              </S.FinancialItem>
            )}
          </S.FinancialGrid>
        </S.DetailSection>
      )}
      
      {property.description && (
        <S.DescriptionSection>
          <h4>Description</h4>
          <p>{property.description}</p>
        </S.DescriptionSection>
      )}
    </S.PropertyDetailContainer>
  );
});

PropertyDetailContainer.displayName = 'PropertyDetailContainer';

export default PropertyMediaGallery;
export { PropertySpecsGrid, PropertyDetailContainer };
