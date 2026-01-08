import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, Heart, Share2, X } from 'lucide-react';
import './PropertyImageSlider.css';

export default function PropertyImageSlider({ 
  images = [], 
  title = '',
  onFavorite,
  onShare,
  isFavorite = false,
  showControls = true,
  showThumbnails = false,
  aspectRatio = '16/10'
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const defaultImages = [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
  ];

  const imageList = images.length > 0 ? images : defaultImages;

  const goToNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % imageList.length);
  };

  const goToPrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleFullscreen = (e) => {
    e?.stopPropagation();
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') goToPrev();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') closeFullscreen();
  };

  return (
    <>
      <div className="property-image-slider" style={{ aspectRatio }}>
        <div className="slider-track">
          {imageList.map((img, index) => (
            <div 
              key={index}
              className={`slide ${index === currentIndex ? 'active' : ''}`}
              style={{ transform: `translateX(${(index - currentIndex) * 100}%)` }}
            >
              <img src={img} alt={`${title} - Image ${index + 1}`} loading="lazy" />
            </div>
          ))}
        </div>

        {imageList.length > 1 && (
          <>
            <button className="nav-btn prev" onClick={goToPrev} aria-label="Previous image">
              <ChevronLeft size={20} />
            </button>
            <button className="nav-btn next" onClick={goToNext} aria-label="Next image">
              <ChevronRight size={20} />
            </button>

            <div className="slide-dots">
              {imageList.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); goToSlide(index); }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {showControls && (
          <div className="slider-controls">
            <button className="control-btn" onClick={handleFullscreen} aria-label="View fullscreen">
              <Expand size={18} />
            </button>
            {onFavorite && (
              <button 
                className={`control-btn ${isFavorite ? 'active' : ''}`} 
                onClick={(e) => { e.stopPropagation(); onFavorite(); }}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart size={18} fill={isFavorite ? '#ef4444' : 'none'} />
              </button>
            )}
            {onShare && (
              <button className="control-btn" onClick={(e) => { e.stopPropagation(); onShare(); }} aria-label="Share">
                <Share2 size={18} />
              </button>
            )}
          </div>
        )}

        <div className="image-counter">
          {currentIndex + 1} / {imageList.length}
        </div>
      </div>

      {showThumbnails && imageList.length > 1 && (
        <div className="thumbnail-strip">
          {imageList.map((img, index) => (
            <button
              key={index}
              className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            >
              <img src={img} alt={`Thumbnail ${index + 1}`} />
            </button>
          ))}
        </div>
      )}

      {isFullscreen && (
        <div 
          className="fullscreen-gallery" 
          onClick={closeFullscreen}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
        >
          <button className="close-fullscreen" onClick={closeFullscreen}>
            <X size={24} />
          </button>
          
          <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={imageList[currentIndex]} 
              alt={`${title} - Image ${currentIndex + 1}`} 
            />
            
            {imageList.length > 1 && (
              <>
                <button className="fs-nav-btn prev" onClick={goToPrev}>
                  <ChevronLeft size={32} />
                </button>
                <button className="fs-nav-btn next" onClick={goToNext}>
                  <ChevronRight size={32} />
                </button>
              </>
            )}
          </div>

          <div className="fullscreen-thumbnails">
            {imageList.map((img, index) => (
              <button
                key={index}
                className={`fs-thumbnail ${index === currentIndex ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); goToSlide(index); }}
              >
                <img src={img} alt={`Thumbnail ${index + 1}`} />
              </button>
            ))}
          </div>

          <div className="fullscreen-counter">
            {currentIndex + 1} / {imageList.length}
          </div>
        </div>
      )}
    </>
  );
}
