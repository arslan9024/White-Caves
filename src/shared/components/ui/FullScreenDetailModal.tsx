import React, { useCallback, useEffect, useState, ReactNode } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Share2,
  Heart,
  Download,
  type LucideIcon,
} from 'lucide-react';
import './FullScreenDetailModal.css';

interface ModalTab {
  label: string;
  icon?: LucideIcon;
  content: ReactNode;
}

interface ModalAction {
  label: string;
  onClick: () => void;
  primary?: boolean;
  danger?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
}

interface FullScreenDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  images?: string[];
  children?: ReactNode;
  actions?: ModalAction[];
  sidebar?: ReactNode;
  tabs?: ModalTab[];
  defaultTab?: number;
}

const FullScreenDetailModal: React.FC<FullScreenDetailModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  images = [],
  children,
  actions = [],
  sidebar,
  tabs = [],
  defaultTab = 0,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isFavorite, setIsFavorite] = useState(false);
  const safeActiveTab = tabs.length > 0 ? Math.min(Math.max(activeTab, 0), tabs.length - 1) : 0;
  const safeCurrentImageIndex =
    images.length > 0 ? Math.min(Math.max(currentImageIndex, 0), images.length - 1) : 0;
  const currentImage = images.at(safeCurrentImageIndex);
  const activeTabContent = tabs.length > 0 ? tabs.at(safeActiveTab)?.content : children;

  const nextImage = useCallback(() => {
    if (images.length > 0) {
      setCurrentImageIndex(prev => (prev + 1) % images.length);
    }
  }, [images.length]);

  const prevImage = useCallback(() => {
    if (images.length > 0) {
      setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
    }
  }, [images.length]);

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
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, prevImage, nextImage]);

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
    <div
      className="fullscreen-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Detail modal'}
    >
      <div className="fullscreen-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-section">
            <h1 className="modal-title">{title}</h1>
            {subtitle && <span className="modal-subtitle">{subtitle}</span>}
          </div>

          <div className="modal-header-actions">
            <button
              className="header-action-btn"
              onClick={() => setIsFavorite(!isFavorite)}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-pressed={isFavorite}
            >
              <Heart
                size={20}
                fill={isFavorite ? '#E31E24' : 'none'}
                color={isFavorite ? '#E31E24' : 'currentColor'}
              />
            </button>
            <button className="header-action-btn" aria-label="Share">
              <Share2 size={20} />
            </button>
            <button className="header-action-btn" aria-label="Download">
              <Download size={20} />
            </button>
            <button
              className="header-action-btn"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            <button className="close-btn" onClick={onClose} aria-label="Close modal">
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
                  src={currentImage ?? ''}
                  alt={`${title || 'Property'} — image ${safeCurrentImageIndex + 1} of ${images.length}`}
                  className="gallery-main-image"
                  loading="lazy"
                  width={400}
                  height={300}
                />

                {images.length > 1 && (
                  <>
                    <button
                      className="gallery-nav prev"
                      onClick={prevImage}
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      className="gallery-nav next"
                      onClick={nextImage}
                      aria-label="Next image"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                <div className="gallery-counter">
                  {safeCurrentImageIndex + 1} / {images.length}
                </div>
              </div>

              {images.length > 1 && (
                <div className="gallery-thumbnails">
                  {images.map((img, idx) => (
                    <button
                      key={img ?? `thumb-${idx}`}
                      className={`thumbnail ${idx === safeCurrentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(idx)}
                    >
                      <img
                        src={img}
                        alt={`${title || 'Property'} thumbnail ${idx + 1}`}
                        loading="lazy"
                        width={80}
                        height={80}
                      />
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
                    key={tab.label ?? `tab-${idx}`}
                    className={`modal-tab ${idx === safeActiveTab ? 'active' : ''}`}
                    onClick={() => setActiveTab(idx)}
                  >
                    {tab.icon && <tab.icon size={16} />}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Tab Content or Children */}
            <div className="modal-content">{activeTabContent}</div>
          </div>

          {/* Sidebar */}
          {sidebar && <div className="modal-sidebar">{sidebar}</div>}
        </div>

        {/* Footer Actions */}
        {actions.length > 0 && (
          <div className="modal-footer">
            {actions.map((action, idx) => (
              <button
                key={action.label ?? `action-${idx}`}
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
