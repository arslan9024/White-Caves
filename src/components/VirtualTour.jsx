import { useState, useRef, useEffect, useCallback } from 'react';
import './VirtualTour.css';

const VirtualTour = ({ 
  images = [], 
  initialIndex = 0,
  onClose,
  propertyTitle = 'Property Tour'
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [showHotspots, setShowHotspots] = useState(true);
  const containerRef = useRef(null);
  const autoRotateRef = useRef(null);

  const currentImage = images[currentIndex] || {};
  const hotspots = currentImage.hotspots || [];

  useEffect(() => {
    if (isAutoRotate) {
      autoRotateRef.current = setInterval(() => {
        setRotation(prev => ({ ...prev, y: prev.y + 0.5 }));
      }, 50);
    } else {
      clearInterval(autoRotateRef.current);
    }
    return () => clearInterval(autoRotateRef.current);
  }, [isAutoRotate]);

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('.tour-hotspot')) return;
    setIsDragging(true);
    setIsAutoRotate(false);
    setStartPos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    setRotation(prev => ({
      x: Math.max(-85, Math.min(85, prev.x - deltaY * 0.3)),
      y: prev.y + deltaX * 0.3
    }));
    setStartPos({ x: e.clientX, y: e.clientY });
  }, [isDragging, startPos]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e) => {
    if (e.target.closest('.tour-hotspot')) return;
    setIsDragging(true);
    setIsAutoRotate(false);
    const touch = e.touches[0];
    setStartPos({ x: touch.clientX, y: touch.clientY });
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.x;
    const deltaY = touch.clientY - startPos.y;
    setRotation(prev => ({
      x: Math.max(-85, Math.min(85, prev.x - deltaY * 0.3)),
      y: prev.y + deltaX * 0.3
    }));
    setStartPos({ x: touch.clientX, y: touch.clientY });
  }, [isDragging, startPos]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    setZoom(prev => Math.max(0.5, Math.min(3, prev - e.deltaY * 0.001)));
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const navigateToRoom = useCallback((roomIndex) => {
    setCurrentIndex(roomIndex);
    setRotation({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  const handleHotspotClick = useCallback((hotspot) => {
    if (hotspot.targetRoom !== undefined) {
      navigateToRoom(hotspot.targetRoom);
    } else if (hotspot.action) {
      hotspot.action();
    }
  }, [navigateToRoom]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch(e.key) {
        case 'Escape':
          if (isFullscreen) {
            document.exitFullscreen();
          } else if (onClose) {
            onClose();
          }
          break;
        case 'ArrowLeft':
          setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
          break;
        case 'ArrowRight':
          setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
          break;
        case '+':
        case '=':
          setZoom(prev => Math.min(3, prev + 0.2));
          break;
        case '-':
          setZoom(prev => Math.max(0.5, prev - 0.2));
          break;
        case 'r':
          setIsAutoRotate(prev => !prev);
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, onClose, images.length]);

  if (!images.length) {
    return (
      <div className="virtual-tour-empty">
        <div className="empty-icon">🏠</div>
        <h3>Virtual Tour Coming Soon</h3>
        <p>360° tour images are being prepared for this property</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`virtual-tour-container ${isFullscreen ? 'fullscreen' : ''}`}
    >
      <div className="tour-header">
        <div className="tour-title">
          <span className="tour-badge">360° Tour</span>
          <h3>{propertyTitle}</h3>
        </div>
        <div className="tour-controls-header">
          <button 
            className={`tour-btn ${isAutoRotate ? 'active' : ''}`}
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            title="Auto Rotate (R)"
          >
            🔄
          </button>
          <button 
            className={`tour-btn ${showHotspots ? 'active' : ''}`}
            onClick={() => setShowHotspots(!showHotspots)}
            title="Toggle Hotspots"
          >
            📍
          </button>
          <button 
            className="tour-btn"
            onClick={toggleFullscreen}
            title="Fullscreen"
          >
            {isFullscreen ? '⬜' : '⛶'}
          </button>
          {onClose && (
            <button className="tour-btn close-btn" onClick={onClose}>
              ✕
            </button>
          )}
        </div>
      </div>

      <div 
        className="tour-viewport"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div 
          className="tour-panorama"
          style={{
            backgroundImage: `url(${currentImage.url || currentImage})`,
            backgroundPosition: `${50 + (rotation.y % 360) * (100/360)}% ${50 - rotation.x * (50/90)}%`,
            backgroundSize: `${300 * zoom}% ${200 * zoom}%`
          }}
        >
          {showHotspots && hotspots.map((hotspot, index) => {
            const adjustedX = ((hotspot.x - (rotation.y % 360) * (100/360) + 150) % 100);
            const adjustedY = hotspot.y + rotation.x * (50/90);
            const isVisible = adjustedX >= 10 && adjustedX <= 90 && adjustedY >= 10 && adjustedY <= 90;
            
            if (!isVisible) return null;
            
            return (
              <button
                key={index}
                className={`tour-hotspot ${hotspot.type || 'navigation'}`}
                style={{
                  left: `${adjustedX}%`,
                  top: `${adjustedY}%`
                }}
                onClick={() => handleHotspotClick(hotspot)}
                title={hotspot.label}
              >
                <span className="hotspot-icon">
                  {hotspot.type === 'info' ? 'ℹ️' : '→'}
                </span>
                <span className="hotspot-label">{hotspot.label}</span>
              </button>
            );
          })}
        </div>

        <div className="tour-compass">
          <div 
            className="compass-needle"
            style={{ transform: `rotate(${-rotation.y}deg)` }}
          />
          <span className="compass-label">N</span>
        </div>
      </div>

      <div className="tour-footer">
        <div className="zoom-controls">
          <button 
            className="zoom-btn"
            onClick={() => setZoom(prev => Math.max(0.5, prev - 0.2))}
          >
            −
          </button>
          <div className="zoom-level">{Math.round(zoom * 100)}%</div>
          <button 
            className="zoom-btn"
            onClick={() => setZoom(prev => Math.min(3, prev + 0.2))}
          >
            +
          </button>
        </div>

        <div className="room-navigator">
          {images.map((img, index) => (
            <button
              key={index}
              className={`room-thumb ${index === currentIndex ? 'active' : ''}`}
              onClick={() => navigateToRoom(index)}
            >
              <img 
                src={img.thumbnail || img.url || img} 
                alt={img.name || `Room ${index + 1}`}
              />
              <span className="room-name">{img.name || `Room ${index + 1}`}</span>
            </button>
          ))}
        </div>

        <div className="tour-info">
          <span className="current-room">
            {currentImage.name || `Room ${currentIndex + 1}`}
          </span>
          <span className="room-count">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      </div>

      <div className="tour-instructions">
        <p>Drag to look around • Scroll to zoom • Press R for auto-rotate</p>
      </div>
    </div>
  );
};

export default VirtualTour;
