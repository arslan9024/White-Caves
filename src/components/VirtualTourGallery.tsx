import React, { useEffect, useMemo, useState } from 'react';
import type { HomepageProperty } from '../store/slices/homepageSlice';
import {
  ActionButton,
  AllToursSection,
  Badge,
  CloseModalButton,
  ControlIcon,
  FeaturedSlider,
  FeaturedTourCard,
  FeaturedToursSection,
  GalleryHeader,
  HeaderContent,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  ModalActions,
  ModalContent,
  ModalHeader,
  ModalInfo,
  ModalOverlay,
  PlayButton,
  SpecItem,
  StartTourButton,
  TourBadges,
  TourCard,
  TourContent,
  TourInfo,
  TourLocation,
  TourMetaRow,
  TourModal,
  TourOverlay,
  TourPrice,
  ToursGrid,
  ToursList,
  TourSpecs,
  TourThumbnail,
  TourType,
  TourViewer,
  TourViews,
  ViewerControls,
  ViewerPlaceholder,
  ViewBtn,
  ViewControls,
  VirtualTourGalleryContainer,
} from './VirtualTourGallery.styles';

interface VirtualTour {
  id: number;
  title: string;
  location: string;
  price: number;
  type: string;
  beds: number;
  baths: number;
  sqft: number;
  thumbnail: string;
  tourUrl: string;
  hasDrone: boolean;
  hasVideo: boolean;
  views: number;
  featured: boolean;
}

interface VirtualTourGalleryProps {
  featuredProperties?: HomepageProperty[];
}

const STATIC_VIRTUAL_TOURS: VirtualTour[] = [
  {
    id: 1,
    title: 'Luxury Penthouse - Downtown Dubai',
    location: 'Downtown Dubai',
    price: 15000000,
    type: 'Penthouse',
    beds: 4,
    baths: 5,
    sqft: 8500,
    thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    tourUrl: 'https://my.matterport.com/show/?m=SxQL3iGyoDo',
    hasDrone: true,
    hasVideo: true,
    views: 1250,
    featured: true
  },
  {
    id: 2,
    title: 'Beachfront Villa - Palm Jumeirah',
    location: 'Palm Jumeirah',
    price: 45000000,
    type: 'Villa',
    beds: 6,
    baths: 7,
    sqft: 12000,
    thumbnail: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800',
    tourUrl: 'https://my.matterport.com/show/?m=sample2',
    hasDrone: true,
    hasVideo: true,
    views: 2340,
    featured: true
  },
  {
    id: 3,
    title: 'Modern Apartment - Dubai Marina',
    location: 'Dubai Marina',
    price: 3500000,
    type: 'Apartment',
    beds: 2,
    baths: 3,
    sqft: 1800,
    thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    tourUrl: 'https://my.matterport.com/show/?m=sample3',
    hasDrone: false,
    hasVideo: true,
    views: 890,
    featured: false
  },
  {
    id: 4,
    title: 'Golf Course Villa - Emirates Hills',
    location: 'Emirates Hills',
    price: 28000000,
    type: 'Villa',
    beds: 5,
    baths: 6,
    sqft: 9500,
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    tourUrl: 'https://my.matterport.com/show/?m=sample4',
    hasDrone: true,
    hasVideo: true,
    views: 1680,
    featured: true
  },
  {
    id: 5,
    title: 'Waterfront Townhouse - Dubai Creek',
    location: 'Dubai Creek Harbour',
    price: 5800000,
    type: 'Townhouse',
    beds: 4,
    baths: 4,
    sqft: 3200,
    thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    tourUrl: 'https://my.matterport.com/show/?m=sample5',
    hasDrone: false,
    hasVideo: true,
    views: 720,
    featured: false
  },
  {
    id: 6,
    title: 'Sky Collection Apartment - DIFC',
    location: 'DIFC',
    price: 8500000,
    type: 'Apartment',
    beds: 3,
    baths: 4,
    sqft: 3800,
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    tourUrl: 'https://my.matterport.com/show/?m=sample6',
    hasDrone: true,
    hasVideo: true,
    views: 1120,
    featured: true
  }
];

function buildLiveTours(featuredProperties: HomepageProperty[] = []): VirtualTour[] {
  return featuredProperties.slice(0, 6).map((property, index) => ({
    id: Number(property.id) || index + 101,
    title: `${property.title} - ${property.location}`,
    location: property.location,
    price: property.price,
    type: property.type,
    beds: property.bedrooms,
    baths: property.bathrooms,
    sqft: property.sqft,
    thumbnail: property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    tourUrl: `${window.location.origin}/properties/${property.id}`,
    hasDrone: property.price >= 10_000_000 || property.sqft >= 5000,
    hasVideo: true,
    views: 900 + index * 175,
    featured: index < 4,
  }));
}

const VirtualTourGallery = ({ featuredProperties = [] }: VirtualTourGalleryProps) => {
  const [selectedTour, setSelectedTour] = useState<VirtualTour | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const virtualTours = useMemo(
    () => (featuredProperties.length > 0 ? buildLiveTours(featuredProperties) : STATIC_VIRTUAL_TOURS),
    [featuredProperties]
  );

  const featuredTours = virtualTours.filter(t => t.featured);

  const openTour = (tour: VirtualTour) => {
    setSelectedTour(tour);
  };

  const closeTour = () => {
    setSelectedTour(null);
  };

  useEffect(() => {
    if (!selectedTour) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeTour();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedTour]);

  const allToursContainer = viewMode === 'grid' ? ToursGrid : ToursList;
  const AllToursContainer = allToursContainer;

  return (
    <VirtualTourGalleryContainer>
      <GalleryHeader>
        <HeaderContent>
          <h2>Virtual Property Tours</h2>
          <p>Experience luxury properties with immersive 360 walkthroughs</p>
        </HeaderContent>
        <ViewControls>
          <ViewBtn
            $active={viewMode === 'grid'}
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
            aria-pressed={viewMode === 'grid'}
            type="button"
          >
            Grid
          </ViewBtn>
          <ViewBtn
            $active={viewMode === 'list'}
            onClick={() => setViewMode('list')}
            aria-label="List view"
            aria-pressed={viewMode === 'list'}
            type="button"
          >
            List
          </ViewBtn>
        </ViewControls>
      </GalleryHeader>

      <FeaturedToursSection>
        <h3>Featured Virtual Tours</h3>
        <FeaturedSlider>
          {featuredTours.map((tour) => (
            <FeaturedTourCard
              key={tour.id}
              onClick={() => openTour(tour)}
              aria-label={`View virtual tour of ${tour.title}`}
              type="button"
            >
              <TourThumbnail>
                <img src={tour.thumbnail} alt={tour.title} loading="lazy" width={280} height={180} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <TourOverlay>
                  <PlayButton>
                    <span>360</span>
                  </PlayButton>
                </TourOverlay>
                <TourBadges>
                  {tour.hasDrone && <Badge type="drone">Drone View</Badge>}
                  {tour.hasVideo && <Badge type="video">Video Tour</Badge>}
                </TourBadges>
              </TourThumbnail>
              <TourInfo>
                <h4>{tour.title}</h4>
                <TourLocation>{tour.location}</TourLocation>
                <TourSpecs>
                  <SpecItem>{tour.beds} Beds</SpecItem>
                  <SpecItem>{tour.baths} Baths</SpecItem>
                  <SpecItem>{(tour.sqft ?? 0).toLocaleString()} sqft</SpecItem>
                </TourSpecs>
                <TourMetaRow>
                  <TourPrice>AED {(tour.price ?? 0).toLocaleString()}</TourPrice>
                  <TourViews>{tour.views} views</TourViews>
                </TourMetaRow>
              </TourInfo>
            </FeaturedTourCard>
          ))}
        </FeaturedSlider>
      </FeaturedToursSection>

      <AllToursSection>
        <h3>All Virtual Tours</h3>
        <AllToursContainer>
          {virtualTours.map((tour) => (
            <TourCard
              key={tour.id}
              onClick={() => openTour(tour)}
              aria-label={`View virtual tour of ${tour.title}`}
              type="button"
            >
              <TourThumbnail>
                <img src={tour.thumbnail} alt={tour.title} loading="lazy" width={280} height={180} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <TourOverlay>
                  <PlayButton>
                    <span>360</span>
                  </PlayButton>
                </TourOverlay>
                <TourBadges>
                  {tour.hasDrone && <Badge type="drone">Drone</Badge>}
                  {tour.hasVideo && <Badge type="video">Video</Badge>}
                </TourBadges>
                <TourType>{tour.type}</TourType>
              </TourThumbnail>
              <TourContent>
                <h4>{tour.title}</h4>
                <TourLocation>{tour.location}</TourLocation>
                <TourSpecs>
                  <SpecItem>{tour.beds} Beds</SpecItem>
                  <SpecItem>{tour.baths} Baths</SpecItem>
                  <SpecItem>{(tour.sqft ?? 0).toLocaleString()} sqft</SpecItem>
                </TourSpecs>
                <TourMetaRow>
                  <TourPrice>AED {(tour.price ?? 0).toLocaleString()}</TourPrice>
                  <TourViews>{tour.views} views</TourViews>
                </TourMetaRow>
              </TourContent>
            </TourCard>
          ))}
        </AllToursContainer>
      </AllToursSection>

      {selectedTour && (
        <TourModal>
          <ModalOverlay onClick={closeTour} aria-label="Close virtual tour overlay" type="button" />
          <ModalContent role="dialog" aria-modal="true" aria-label={`Virtual tour: ${selectedTour.title}`}>
            <CloseModalButton onClick={closeTour} aria-label="Close virtual tour" type="button">×</CloseModalButton>
            <ModalHeader>
              <h3>{selectedTour.title}</h3>
              <p>{selectedTour.location} | {selectedTour.type}</p>
            </ModalHeader>
            <TourViewer>
              <ViewerPlaceholder>
                <img src={selectedTour.thumbnail} alt={selectedTour.title} loading="lazy" width={600} height={400} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <ViewerControls>
                  <ControlIcon>
                    <span>360</span>
                  </ControlIcon>
                  <p>Click to start virtual tour</p>
                  <StartTourButton
                    href={selectedTour.tourUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Launch Full Tour
                  </StartTourButton>
                </ViewerControls>
              </ViewerPlaceholder>
            </TourViewer>
            <ModalInfo>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Bedrooms</InfoLabel>
                  <InfoValue>{selectedTour.beds}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Bathrooms</InfoLabel>
                  <InfoValue>{selectedTour.baths}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Area</InfoLabel>
                  <InfoValue>{(selectedTour.sqft ?? 0).toLocaleString()} sqft</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Price</InfoLabel>
                  <InfoValue $price>AED {(selectedTour.price ?? 0).toLocaleString()}</InfoValue>
                </InfoItem>
              </InfoGrid>
              <ModalActions>
                <ActionButton $variant="primary" aria-label="Schedule a property viewing" type="button">Schedule Viewing</ActionButton>
                <ActionButton $variant="secondary" aria-label="Contact the listing agent" type="button">Contact Agent</ActionButton>
                <ActionButton $variant="outline" aria-label="Download property brochure" type="button">Download Brochure</ActionButton>
              </ModalActions>
            </ModalInfo>
          </ModalContent>
        </TourModal>
      )}
    </VirtualTourGalleryContainer>
  );
};

export default VirtualTourGallery;
