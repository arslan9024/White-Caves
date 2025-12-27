import React, { useState } from 'react';
import './VirtualTourGallery.css';

const VirtualTourGallery = () => {
  const [selectedTour, setSelectedTour] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const virtualTours = [
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

  const featuredTours = virtualTours.filter(t => t.featured);

  const openTour = (tour) => {
    setSelectedTour(tour);
  };

  const closeTour = () => {
    setSelectedTour(null);
  };

  return (
    <div className="virtual-tour-gallery">
      <div className="gallery-header">
        <div className="header-content">
          <h2>Virtual Property Tours</h2>
          <p>Experience luxury properties with immersive 360 walkthroughs</p>
        </div>
        <div className="view-controls">
          <button
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            Grid
          </button>
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            List
          </button>
        </div>
      </div>

      <div className="featured-tours">
        <h3>Featured Virtual Tours</h3>
        <div className="featured-slider">
          {featuredTours.map((tour) => (
            <div key={tour.id} className="featured-tour-card" onClick={() => openTour(tour)}>
              <div className="tour-thumbnail">
                <img src={tour.thumbnail} alt={tour.title} />
                <div className="tour-overlay">
                  <div className="play-button">
                    <span>360</span>
                  </div>
                </div>
                <div className="tour-badges">
                  {tour.hasDrone && <span className="badge drone">Drone View</span>}
                  {tour.hasVideo && <span className="badge video">Video Tour</span>}
                </div>
              </div>
              <div className="tour-info">
                <h4>{tour.title}</h4>
                <p className="tour-location">{tour.location}</p>
                <div className="tour-details">
                  <span>{tour.beds} Beds</span>
                  <span>{tour.baths} Baths</span>
                  <span>{tour.sqft.toLocaleString()} sqft</span>
                </div>
                <div className="tour-footer">
                  <span className="tour-price">AED {tour.price.toLocaleString()}</span>
                  <span className="tour-views">{tour.views} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`all-tours ${viewMode}`}>
        <h3>All Virtual Tours</h3>
        <div className="tours-container">
          {virtualTours.map((tour) => (
            <div key={tour.id} className="tour-card" onClick={() => openTour(tour)}>
              <div className="tour-thumbnail">
                <img src={tour.thumbnail} alt={tour.title} />
                <div className="tour-overlay">
                  <div className="play-button">
                    <span>360</span>
                  </div>
                </div>
                <div className="tour-badges">
                  {tour.hasDrone && <span className="badge drone">Drone</span>}
                  {tour.hasVideo && <span className="badge video">Video</span>}
                </div>
                <div className="tour-type">{tour.type}</div>
              </div>
              <div className="tour-content">
                <h4>{tour.title}</h4>
                <p className="tour-location">{tour.location}</p>
                <div className="tour-specs">
                  <span>{tour.beds} Beds</span>
                  <span>{tour.baths} Baths</span>
                  <span>{tour.sqft.toLocaleString()} sqft</span>
                </div>
                <div className="tour-footer">
                  <span className="tour-price">AED {tour.price.toLocaleString()}</span>
                  <span className="tour-views">{tour.views} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedTour && (
        <div className="tour-modal">
          <div className="modal-overlay" onClick={closeTour}></div>
          <div className="modal-content">
            <button className="close-modal" onClick={closeTour}>x</button>
            <div className="modal-header">
              <h3>{selectedTour.title}</h3>
              <p>{selectedTour.location} | {selectedTour.type}</p>
            </div>
            <div className="tour-viewer">
              <div className="viewer-placeholder">
                <img src={selectedTour.thumbnail} alt={selectedTour.title} />
                <div className="viewer-controls">
                  <div className="control-icon">
                    <span className="icon-360">360</span>
                  </div>
                  <p>Click to start virtual tour</p>
                  <a 
                    href={selectedTour.tourUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="start-tour-btn"
                  >
                    Launch Full Tour
                  </a>
                </div>
              </div>
            </div>
            <div className="modal-info">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Bedrooms</span>
                  <span className="info-value">{selectedTour.beds}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Bathrooms</span>
                  <span className="info-value">{selectedTour.baths}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Area</span>
                  <span className="info-value">{selectedTour.sqft.toLocaleString()} sqft</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Price</span>
                  <span className="info-value price">AED {selectedTour.price.toLocaleString()}</span>
                </div>
              </div>
              <div className="modal-actions">
                <button className="action-btn primary">Schedule Viewing</button>
                <button className="action-btn secondary">Contact Agent</button>
                <button className="action-btn outline">Download Brochure</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualTourGallery;
