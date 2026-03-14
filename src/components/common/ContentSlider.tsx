import React, { useState, useEffect, useRef, useCallback, type ReactNode, type CSSProperties } from 'react';
import {
  ContentSliderContainer,
  SliderHeader,
  SliderTitle,
  SliderSubtitle,
  SliderWrapper,
  SliderContainerElement,
  SliderTrack,
  SliderSlide,
  SliderControl,
  ControlIcon,
  SliderDots,
  SliderDot,
  SliderPlayPause,
  DefaultSlideCard,
  SlideImageContainer,
  SlideImage,
  SlideBadge,
  SlideContent,
  SlideTitle,
  SlideLocation,
  LocationIcon,
  SlideDescription,
  SlideFeatures,
  Feature,
  FeatureIcon,
  SlidePrice,
} from './ContentSlider.styles';

interface SlidesPerView {
  mobile?: number;
  tablet?: number;
  desktop?: number;
}

interface SliderItem {
  id?: string | number;
  title?: string;
  location?: string;
  description?: string;
  images?: string[];
  type?: 'sale' | 'rent' | string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  priceFormatted?: string;
  [key: string]: unknown;
}

interface ContentSliderProps {
  items?: SliderItem[];
  renderItem?: (item: SliderItem, index: number) => ReactNode;
  title?: string;
  subtitle?: string;
  showControls?: boolean;
  showDots?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  slidesPerView?: SlidesPerView;
  gap?: number;
  className?: string;
}

export default function ContentSlider({
  items = [],
  renderItem,
  title,
  subtitle,
  showControls = true,
  showDots = true,
  autoPlay = true,
  autoPlayInterval = 5000,
  slidesPerView = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 20,
  className = ''
}: ContentSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [slidesToShow, setSlidesToShow] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  const updateSlidesToShow = useCallback(() => {
    const width = window.innerWidth;
    if (width >= 1024) {
      setSlidesToShow(slidesPerView.desktop || 3);
    } else if (width >= 768) {
      setSlidesToShow(slidesPerView.tablet || 2);
    } else {
      setSlidesToShow(slidesPerView.mobile || 1);
    }
  }, [slidesPerView]);

  useEffect(() => {
    updateSlidesToShow();
    window.addEventListener('resize', updateSlidesToShow);
    return () => window.removeEventListener('resize', updateSlidesToShow);
  }, [updateSlidesToShow]);

  const maxIndex = Math.max(0, items.length - slidesToShow);

  useEffect(() => {
    if (!isPlaying || !autoPlay || items.length <= slidesToShow) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPlaying, autoPlay, autoPlayInterval, maxIndex, items.length, slidesToShow]);

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  };

  const goToPrev = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setIsPlaying(false);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = currentX - startX;
    setTranslateX(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 50;
    if (translateX > threshold) {
      goToPrev();
    } else if (translateX < -threshold) {
      goToNext();
    }
    
    setTranslateX(0);
    setTimeout(() => setIsPlaying(autoPlay), 1000);
  };

  const containerStyle: CSSProperties = {
    transform: `translateX(calc(-${currentIndex * (100 / slidesToShow)}% - ${currentIndex * gap}px + ${translateX}px))`,
    transition: isDragging ? 'none' : 'transform 0.5s ease-out',
    gap: `${gap}px`
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <ContentSliderContainer className={className}>
      {(title || subtitle) && (
        <SliderHeader>
          {title && <SliderTitle>{title}</SliderTitle>}
          {subtitle && <SliderSubtitle>{subtitle}</SliderSubtitle>}
        </SliderHeader>
      )}

      <SliderWrapper>
        {showControls && items.length > slidesToShow && (
          <SliderControl 
            $position="prev"
            onClick={goToPrev}
            aria-label="Previous slide"
          >
            <ControlIcon>‹</ControlIcon>
          </SliderControl>
        )}

        <SliderContainerElement 
          ref={sliderRef}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          <SliderTrack style={containerStyle}>
            {items.map((item, index) => (
              <SliderSlide 
                key={item.id || index}
                style={{ 
                  flex: `0 0 calc(${100 / slidesToShow}% - ${gap * (slidesToShow - 1) / slidesToShow}px)`,
                  minWidth: `calc(${100 / slidesToShow}% - ${gap * (slidesToShow - 1) / slidesToShow}px)`
                }}
              >
                {renderItem ? renderItem(item, index) : (
                  <DefaultSlideCardComponent item={item} />
                )}
              </SliderSlide>
            ))}
          </SliderTrack>
        </SliderContainerElement>

        {showControls && items.length > slidesToShow && (
          <SliderControl 
            $position="next"
            onClick={goToNext}
            aria-label="Next slide"
          >
            <ControlIcon>›</ControlIcon>
          </SliderControl>
        )}
      </SliderWrapper>

      {showDots && items.length > slidesToShow && (
        <SliderDots>
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <SliderDot
              key={index}
              $isActive={currentIndex === index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </SliderDots>
      )}

      {autoPlay && (
        <SliderPlayPause 
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </SliderPlayPause>
      )}
    </ContentSliderContainer>
  );
}

interface DefaultSlideCardComponentProps {
  item: SliderItem;
}

function DefaultSlideCardComponent({ item }: DefaultSlideCardComponentProps) {
  return (
    <DefaultSlideCard>
      {item.images && item.images.length > 0 && (
        <SlideImageContainer>
          <SlideImage 
            src={item.images[0]} 
            alt={item.title || 'Slide image'}
            loading="lazy"
          />
          {item.type && (
            <SlideBadge $type={item.type as 'sale' | 'rent'}>
              {item.type === 'sale' ? 'For Sale' : 'For Rent'}
            </SlideBadge>
          )}
        </SlideImageContainer>
      )}
      
      <SlideContent>
        {item.title && <SlideTitle>{item.title}</SlideTitle>}
        {item.location && (
          <SlideLocation>
            <LocationIcon>📍</LocationIcon>
            {item.location}
          </SlideLocation>
        )}
        {item.description && (
          <SlideDescription>{item.description}</SlideDescription>
        )}
        
        {(item.bedrooms || item.bathrooms || item.area) && (
          <SlideFeatures>
            {item.bedrooms && (
              <Feature>
                <FeatureIcon>🛏️</FeatureIcon>
                {item.bedrooms} Beds
              </Feature>
            )}
            {item.bathrooms && (
              <Feature>
                <FeatureIcon>🚿</FeatureIcon>
                {item.bathrooms} Baths
              </Feature>
            )}
            {item.area && (
              <Feature>
                <FeatureIcon>📐</FeatureIcon>
                {item.area.toLocaleString()} sqft
              </Feature>
            )}
          </SlideFeatures>
        )}
        
        {item.priceFormatted && (
          <SlidePrice>{item.priceFormatted}</SlidePrice>
        )}
      </SlideContent>
    </DefaultSlideCard>
  );
}

export { DefaultSlideCardComponent };
