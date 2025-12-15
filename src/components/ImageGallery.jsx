import React, { useState, useRef, useEffect } from 'react';
import './ImageGallery.css';

const neighborhoodData = {
  'Palm Jumeirah': {
    description: 'Iconic man-made island known for luxury villas and apartments with private beach access.',
    walkScore: 45,
    transitScore: 35,
    schools: ['GEMS Wellington International', 'Raffles International School'],
    restaurants: ['Nobu', 'Ossiano', 'Bread Street Kitchen'],
    shopping: ['Nakheel Mall', 'The Pointe'],
    nearbyAttractions: ['Atlantis The Palm', 'Aquaventure Waterpark'],
    avgRent: 'AED 180,000 - 500,000/year',
    priceGrowth: '+8.5% YoY'
  },
  'Downtown Dubai': {
    description: 'The vibrant heart of Dubai featuring Burj Khalifa and Dubai Mall.',
    walkScore: 85,
    transitScore: 90,
    schools: ['GEMS Modern Academy', 'Dubai International Academy'],
    restaurants: ['Atmosphere', 'Tresind Studio', 'La Petite Maison'],
    shopping: ['Dubai Mall', 'Souk Al Bahar'],
    nearbyAttractions: ['Burj Khalifa', 'Dubai Fountain', 'Dubai Opera'],
    avgRent: 'AED 120,000 - 350,000/year',
    priceGrowth: '+12.3% YoY'
  },
  'Emirates Hills': {
    description: 'Ultra-exclusive gated community with palatial villas on the golf course.',
    walkScore: 25,
    transitScore: 15,
    schools: ['Dubai British School', 'Emirates International School'],
    restaurants: ['Rivington Grill', 'BiCE'],
    shopping: ['Emirates Hills Club', 'Meadows Town Centre'],
    nearbyAttractions: ['Montgomerie Golf Club', 'Dubai Marina (nearby)'],
    avgRent: 'AED 400,000 - 1,500,000/year',
    priceGrowth: '+15.2% YoY'
  },
  'Dubai Marina': {
    description: 'Dynamic waterfront community with stunning high-rise towers and vibrant nightlife.',
    walkScore: 82,
    transitScore: 85,
    schools: ['Dubai British School Marina', 'Kings School Dubai'],
    restaurants: ['Pier 7', 'Toro Toro', 'Asia Asia'],
    shopping: ['Dubai Marina Mall', 'JBR The Walk'],
    nearbyAttractions: ['Marina Walk', 'JBR Beach', 'Ain Dubai'],
    avgRent: 'AED 80,000 - 250,000/year',
    priceGrowth: '+10.1% YoY'
  },
  'Arabian Ranches': {
    description: 'Premier family community with villa clusters and world-class golf course.',
    walkScore: 30,
    transitScore: 20,
    schools: ['JESS Arabian Ranches', 'Ranches Primary School'],
    restaurants: ['The Ranches Souk', 'Carluccio\'s'],
    shopping: ['Arabian Ranches Community Centre'],
    nearbyAttractions: ['Arabian Ranches Golf Club', 'Dubai Polo Club'],
    avgRent: 'AED 150,000 - 400,000/year',
    priceGrowth: '+9.8% YoY'
  },
  'Jumeirah Village Circle': {
    description: 'Affordable family-friendly community with parks and easy access to major roads.',
    walkScore: 55,
    transitScore: 45,
    schools: ['JSS International School', 'Sunmarke School'],
    restaurants: ['Circle Mall Dining', 'Various community cafes'],
    shopping: ['Circle Mall', 'Al Khail Avenue'],
    nearbyAttractions: ['JVC Parks', 'Dubai Sports City (nearby)'],
    avgRent: 'AED 45,000 - 120,000/year',
    priceGrowth: '+7.2% YoY'
  },
  'Business Bay': {
    description: 'Central business district with mixed-use towers and Dubai Canal waterfront.',
    walkScore: 75,
    transitScore: 80,
    schools: ['Nearby Downtown schools'],
    restaurants: ['Zuma', 'CÉ LA VI', 'Clap'],
    shopping: ['Bay Avenue', 'Dubai Mall (nearby)'],
    nearbyAttractions: ['Dubai Canal', 'Burj Khalifa views'],
    avgRent: 'AED 70,000 - 200,000/year',
    priceGrowth: '+11.5% YoY'
  },
  'Jumeirah Beach Residence': {
    description: 'Beachfront community with direct beach access and The Walk promenade.',
    walkScore: 88,
    transitScore: 75,
    schools: ['Dubai British School Marina', 'Horizon International School'],
    restaurants: ['BiCE Mare', 'Bla Bla', 'The Maine Oyster Bar'],
    shopping: ['The Beach JBR', 'JBR The Walk'],
    nearbyAttractions: ['JBR Beach', 'Bluewaters Island', 'Ain Dubai'],
    avgRent: 'AED 85,000 - 220,000/year',
    priceGrowth: '+9.3% YoY'
  },
  'Dubai Hills Estate': {
    description: 'Master-planned community with golf course, parks, and Dubai Hills Mall.',
    walkScore: 60,
    transitScore: 50,
    schools: ['GEMS Wellington Academy', 'Kings School Dubai'],
    restaurants: ['Dubai Hills Mall dining', 'Various cafes'],
    shopping: ['Dubai Hills Mall'],
    nearbyAttractions: ['Dubai Hills Golf Club', 'Dubai Hills Park'],
    avgRent: 'AED 100,000 - 350,000/year',
    priceGrowth: '+13.7% YoY'
  },
  'City Walk': {
    description: 'Urban lifestyle destination with boutique shops, art galleries, and green spaces.',
    walkScore: 90,
    transitScore: 70,
    schools: ['Nearby Al Safa schools'],
    restaurants: ['Sum of Us', 'Clinton Street Baking', 'Reif Japanese Kushiyaki'],
    shopping: ['City Walk retail', 'Hub Zero'],
    nearbyAttractions: ['Green Planet', 'Coca-Cola Arena', 'Box Park'],
    avgRent: 'AED 90,000 - 200,000/year',
    priceGrowth: '+8.9% YoY'
  },
  'Mohammed Bin Rashid City': {
    description: 'Prestigious development featuring crystal lagoons and luxury waterfront living.',
    walkScore: 35,
    transitScore: 25,
    schools: ['North London Collegiate School', 'Hartland International School'],
    restaurants: ['District One cafes', 'Nearby Meydan dining'],
    shopping: ['Meydan One Mall (upcoming)'],
    nearbyAttractions: ['Crystal Lagoon', 'Meydan Racecourse', 'Ras Al Khor Sanctuary'],
    avgRent: 'AED 200,000 - 800,000/year',
    priceGrowth: '+18.5% YoY'
  },
  'The Springs': {
    description: 'Established community with lakes, parks, and family-oriented townhouses.',
    walkScore: 40,
    transitScore: 30,
    schools: ['The Meadows School', 'Regent International School'],
    restaurants: ['Springs Souk cafes', 'Town Centre dining'],
    shopping: ['Springs Town Centre', 'Springs Souk'],
    nearbyAttractions: ['Springs Lakes', 'Emirates Golf Club (nearby)'],
    avgRent: 'AED 80,000 - 180,000/year',
    priceGrowth: '+6.5% YoY'
  }
};

export default function ImageGallery({ property, isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNeighborhood, setShowNeighborhood] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const galleryRef = useRef(null);

  const images = property?.images || [
    `https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80`,
    `https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80`,
    `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80`,
    `https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80`
  ];

  const neighborhood = neighborhoodData[property?.location] || neighborhoodData['Downtown Dubai'];

  const minSwipeDistance = 50;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const onTouchMove = (e) => {
    if (!isDragging) return;
    setTouchEnd(e.targetTouches[0].clientX);
    const diff = e.targetTouches[0].clientX - touchStart;
    setDragOffset(diff);
  };

  const onTouchEnd = () => {
    setIsDragging(false);
    setDragOffset(0);
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrev();
  };

  const onMouseDown = (e) => {
    setTouchEnd(null);
    setTouchStart(e.clientX);
    setIsDragging(true);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    setTouchEnd(e.clientX);
    const diff = e.clientX - touchStart;
    setDragOffset(diff);
  };

  const onMouseUp = () => {
    setIsDragging(false);
    setDragOffset(0);
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrev();
  };

  const onMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragOffset(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="image-gallery-overlay" onClick={onClose}>
      <div className="image-gallery-container" onClick={(e) => e.stopPropagation()}>
        <button className="gallery-close-btn" onClick={onClose}>×</button>
        
        <div className="gallery-header">
          <h2>{property?.title || 'Property Gallery'}</h2>
          <div className="gallery-tabs">
            <button 
              className={`gallery-tab ${!showNeighborhood ? 'active' : ''}`}
              onClick={() => setShowNeighborhood(false)}
            >
              Photos
            </button>
            <button 
              className={`gallery-tab ${showNeighborhood ? 'active' : ''}`}
              onClick={() => setShowNeighborhood(true)}
            >
              Neighborhood
            </button>
          </div>
        </div>

        {!showNeighborhood ? (
          <div className="gallery-content">
            <div 
              className="gallery-main"
              ref={galleryRef}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseLeave}
            >
              <button className="gallery-nav prev" onClick={goToPrev}>‹</button>
              <div 
                className="gallery-image-wrapper"
                style={{ transform: `translateX(${dragOffset}px)` }}
              >
                <img 
                  src={images[currentIndex]} 
                  alt={`Property view ${currentIndex + 1}`}
                  className="gallery-main-image"
                  draggable={false}
                />
              </div>
              <button className="gallery-nav next" onClick={goToNext}>›</button>
              
              <div className="gallery-counter">
                {currentIndex + 1} / {images.length}
              </div>
            </div>

            <div className="gallery-thumbnails">
              {images.map((img, index) => (
                <button
                  key={index}
                  className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                >
                  <img src={img} alt={`Thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>

            <div className="gallery-dots">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`gallery-dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>

            <div className="swipe-hint">
              <span>← Swipe or drag to navigate →</span>
            </div>
          </div>
        ) : (
          <div className="neighborhood-content">
            <div className="neighborhood-header">
              <h3>{property?.location || 'Downtown Dubai'}</h3>
              <p className="neighborhood-description">{neighborhood.description}</p>
            </div>

            <div className="neighborhood-scores">
              <div className="score-card">
                <div className="score-circle walk">
                  <span className="score-value">{neighborhood.walkScore}</span>
                </div>
                <span className="score-label">Walk Score</span>
              </div>
              <div className="score-card">
                <div className="score-circle transit">
                  <span className="score-value">{neighborhood.transitScore}</span>
                </div>
                <span className="score-label">Transit Score</span>
              </div>
              <div className="score-card price-growth">
                <span className="growth-value">{neighborhood.priceGrowth}</span>
                <span className="score-label">Price Growth</span>
              </div>
            </div>

            <div className="neighborhood-grid">
              <div className="neighborhood-section">
                <h4>🏫 Nearby Schools</h4>
                <ul>
                  {neighborhood.schools.map((school, i) => (
                    <li key={i}>{school}</li>
                  ))}
                </ul>
              </div>

              <div className="neighborhood-section">
                <h4>🍽️ Dining</h4>
                <ul>
                  {neighborhood.restaurants.map((restaurant, i) => (
                    <li key={i}>{restaurant}</li>
                  ))}
                </ul>
              </div>

              <div className="neighborhood-section">
                <h4>🛍️ Shopping</h4>
                <ul>
                  {neighborhood.shopping.map((shop, i) => (
                    <li key={i}>{shop}</li>
                  ))}
                </ul>
              </div>

              <div className="neighborhood-section">
                <h4>🎯 Attractions</h4>
                <ul>
                  {neighborhood.nearbyAttractions.map((attraction, i) => (
                    <li key={i}>{attraction}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="neighborhood-footer">
              <div className="rent-info">
                <span className="rent-label">Average Rent</span>
                <span className="rent-value">{neighborhood.avgRent}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
