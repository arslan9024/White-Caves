import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectSliderSettings, updateSliderSettings } from '../../store/contentSlice';
import './ContentSlider.css';

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
}) {
  const sliderRef = useRef(null);
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

  const goToSlide = (index) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  };

  const goToPrev = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    setIsPlaying(false);
    setStartX(e.type === 'touchstart' ? e.touches[0].clientX : e.clientX);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
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

  const slideWidth = sliderRef.current 
    ? (sliderRef.current.offsetWidth - (gap * (slidesToShow - 1))) / slidesToShow
    : 0;

  const containerStyle = {
    transform: `translateX(calc(-${currentIndex * (100 / slidesToShow)}% - ${currentIndex * gap}px + ${translateX}px))`,
    transition: isDragging ? 'none' : 'transform 0.5s ease-out',
    gap: `${gap}px`
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`content-slider ${className}`}>
      {(title || subtitle) && (
        <div className="slider-header">
          {title && <h2 className="slider-title">{title}</h2>}
          {subtitle && <p className="slider-subtitle">{subtitle}</p>}
        </div>
      )}

      <div className="slider-wrapper">
        {showControls && items.length > slidesToShow && (
          <button 
            className="slider-control prev"
            onClick={goToPrev}
            aria-label="Previous slide"
          >
            <span className="control-icon">‹</span>
          </button>
        )}

        <div 
          className="slider-container"
          ref={sliderRef}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          <div className="slider-track" style={containerStyle}>
            {items.map((item, index) => (
              <div 
                key={item.id || index}
                className="slider-slide"
                style={{ 
                  flex: `0 0 calc(${100 / slidesToShow}% - ${gap * (slidesToShow - 1) / slidesToShow}px)`,
                  minWidth: `calc(${100 / slidesToShow}% - ${gap * (slidesToShow - 1) / slidesToShow}px)`
                }}
              >
                {renderItem ? renderItem(item, index) : (
                  <DefaultSlideCard item={item} />
                )}
              </div>
            ))}
          </div>
        </div>

        {showControls && items.length > slidesToShow && (
          <button 
            className="slider-control next"
            onClick={goToNext}
            aria-label="Next slide"
          >
            <span className="control-icon">›</span>
          </button>
        )}
      </div>

      {showDots && items.length > slidesToShow && (
        <div className="slider-dots">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              className={`slider-dot ${currentIndex === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {autoPlay && (
        <button 
          className="slider-play-pause"
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
      )}
    </div>
  );
}

function DefaultSlideCard({ item }) {
  return (
    <div className="default-slide-card">
      {item.images && item.images.length > 0 && (
        <div className="slide-image-container">
          <img 
            src={item.images[0]} 
            alt={item.title || 'Slide image'}
            className="slide-image"
            loading="lazy"
          />
          {item.type && (
            <span className={`slide-badge ${item.type}`}>
              {item.type === 'sale' ? 'For Sale' : 'For Rent'}
            </span>
          )}
        </div>
      )}
      
      <div className="slide-content">
        {item.title && <h3 className="slide-title">{item.title}</h3>}
        {item.location && (
          <p className="slide-location">
            <span className="location-icon">📍</span>
            {item.location}
          </p>
        )}
        {item.description && (
          <p className="slide-description">{item.description}</p>
        )}
        
        {(item.bedrooms || item.bathrooms || item.area) && (
          <div className="slide-features">
            {item.bedrooms && (
              <span className="feature">
                <span className="feature-icon">🛏️</span>
                {item.bedrooms} Beds
              </span>
            )}
            {item.bathrooms && (
              <span className="feature">
                <span className="feature-icon">🚿</span>
                {item.bathrooms} Baths
              </span>
            )}
            {item.area && (
              <span className="feature">
                <span className="feature-icon">📐</span>
                {item.area.toLocaleString()} sqft
              </span>
            )}
          </div>
        )}
        
        {item.priceFormatted && (
          <p className="slide-price">{item.priceFormatted}</p>
        )}
      </div>
    </div>
  );
}

export { DefaultSlideCard };
