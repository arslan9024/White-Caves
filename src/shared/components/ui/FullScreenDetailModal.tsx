import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2, Share2, Heart, Download } from 'lucide-react';
import './FullScreenDetailModal.css';

const FullScreenDetailModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  images = [],
  children,
  actions = [],
  sidebar,
  tabs = [],
  defaultTab = 0
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentImageIndex]);

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fullscreen-modal-overlay" onClick={onClose}>
      <div className="fullscreen-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-section">
            <h1 className="modal-title">{title}</h1>
            {subtitle && <span className="modal-subtitle">{subtitle}</span>}
          </div>
          
          <div className="modal-header-actions">
            <button className="header-action-btn" onClick={() => setIsFavorite(!isFavorite)}>
              <Heart size={20} fill={isFavorite ? '#dc2626' : 'none'} color={isFavorite ? '#dc2626' : 'currentColor'} />
            </button>
            <button className="header-action-btn">
              <Share2 size={20} />
            </button>
            <button className="header-action-btn">
              <Download size={20} />
            </button>
            <button className="header-action-btn" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            <button className="close-btn" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="modal-body">
          {/* Image Gallery */}
          {images.length > 0 && (
            <div className="modal-gallery">
              <div className="gallery-main">
                <img 
                  src={images[currentImageIndex]} 
                  alt={`View ${currentImageIndex + 1}`}
                  className="gallery-main-image"
                />
                
                {images.length > 1 && (
                  <>
                    <button className="gallery-nav prev" onClick={prevImage}>
                      <ChevronLeft size={24} />
                    </button>
                    <button className="gallery-nav next" onClick={nextImage}>
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
                
                <div className="gallery-counter">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </div>
              
              {images.length > 1 && (
                <div className="gallery-thumbnails">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      className={`thumbnail ${idx === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(idx)}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Content Area */}
          <div className="modal-content-area">
            {/* Tabs */}
            {tabs.length > 0 && (
              <div className="modal-tabs">
                {tabs.map((tab, idx) => (
                  <button
                    key={idx}
                    className={`modal-tab ${idx === activeTab ? 'active' : ''}`}
                    onClick={() => setActiveTab(idx)}
                  >
                    {tab.icon && <tab.icon size={16} />}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Tab Content or Children */}
            <div className="modal-content">
              {tabs.length > 0 ? tabs[activeTab]?.content : children}
            </div>
          </div>

          {/* Sidebar */}
          {sidebar && (
            <div className="modal-sidebar">
              {sidebar}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {actions.length > 0 && (
          <div className="modal-footer">
            {actions.map((action, idx) => (
              <button
                key={idx}
                className={`footer-action-btn ${action.primary ? 'primary' : ''} ${action.danger ? 'danger' : ''}`}
                onClick={action.onClick}
                disabled={action.disabled}
              >
                {action.icon && <action.icon size={18} />}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FullScreenDetailModal;
