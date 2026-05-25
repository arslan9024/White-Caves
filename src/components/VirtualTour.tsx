import { useState, useRef, useEffect, useCallback, useReducer } from 'react';

// Consolidated interaction state to avoid excessive re-renders during drag
interface TourInteractionState {
  rotation: { x: number; y: number };
  zoom: number;
  isDragging: boolean;
  startPos: { x: number; y: number };
}

type TourAction =
  | { type: 'START_DRAG'; payload: { x: number; y: number } }
  | { type: 'DRAG_MOVE'; payload: { clientX: number; clientY: number } }
  | { type: 'STOP_DRAG' }
  | { type: 'AUTO_ROTATE' }
  | { type: 'ZOOM'; payload: number }
  | { type: 'ZOOM_DELTA'; payload: number }
  | { type: 'RESET_VIEW' }
  | { type: 'SET_ROTATION'; payload: { x: number; y: number } };

function tourReducer(state: TourInteractionState, action: TourAction): TourInteractionState {
  switch (action.type) {
    case 'START_DRAG':
      return { ...state, isDragging: true, startPos: action.payload };
    case 'DRAG_MOVE': {
      if (!state.isDragging) return state;
      const deltaX = action.payload.clientX - state.startPos.x;
      const deltaY = action.payload.clientY - state.startPos.y;
      return {
        ...state,
        rotation: {
          x: Math.max(-85, Math.min(85, state.rotation.x - deltaY * 0.3)),
          y: state.rotation.y + deltaX * 0.3,
        },
        startPos: { x: action.payload.clientX, y: action.payload.clientY },
      };
    }
    case 'STOP_DRAG':
      return { ...state, isDragging: false };
    case 'AUTO_ROTATE':
      return { ...state, rotation: { ...state.rotation, y: state.rotation.y + 0.5 } };
    case 'ZOOM':
      return { ...state, zoom: Math.max(0.5, Math.min(3, action.payload)) };
    case 'ZOOM_DELTA':
      return { ...state, zoom: Math.max(0.5, Math.min(3, state.zoom + action.payload)) };
    case 'RESET_VIEW':
      return { ...state, rotation: { x: 0, y: 0 }, zoom: 1 };
    case 'SET_ROTATION':
      return { ...state, rotation: action.payload };
    default:
      return state;
  }
}
import {
  VirtualTourContainer,
  TourHeader,
  TourTitle,
  TourBadge,
  TourTitleText,
  TourControlsHeader,
  TourBtn,
  TourViewport,
  TourPanorama,
  TourHotspot,
  HotspotIcon,
  HotspotLabel,
  TourCompass,
  CompassNeedle,
  TourFooter,
  ZoomControls,
  ZoomBtn,
  ZoomLevel,
  RoomNavigator,
  RoomThumb,
  RoomName,
  TourInfo,
  TourInfoText,
  ViewsCount,
} from './VirtualTour.styles';

interface TourImage {
  url?: string;
  title?: string;
  name?: string;
  thumbnail?: string;
  hotspots?: TourHotspotData[];
  [key: string]: unknown;
}

interface TourHotspotData {
  id?: string;
  x: number;
  y: number;
  label?: string;
  icon?: string;
  type?: 'info' | 'navigation';
  targetRoom?: number;
  action?: () => void;
}

interface VirtualTourProps {
  images?: TourImage[];
  initialIndex?: number;
  onClose?: () => void;
  propertyTitle?: string;
}

const VirtualTour = ({
  images = [],
  initialIndex = 0,
  onClose,
  propertyTitle = 'Property Tour',
}: VirtualTourProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [showHotspots, setShowHotspots] = useState(true);
  const [useImmersiveViewer, setUseImmersiveViewer] = useState(true);

  const [interaction, dispatchTour] = useReducer(tourReducer, {
    rotation: { x: 0, y: 0 },
    zoom: 1,
    isDragging: false,
    startPos: { x: 0, y: 0 },
  });

  const { rotation, zoom, isDragging } = interaction;
  const containerRef = useRef<HTMLDivElement>(null);
  const autoRotateRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentImage: TourImage = Array.isArray(images)
    ? images[currentIndex] || ({} as TourImage)
    : ({} as TourImage);
  const hotspots = currentImage.hotspots || [];
  const isJsDomEnvironment =
    typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent || '');
  const canUsePannellum = useImmersiveViewer && !!currentImage.url && !isJsDomEnvironment;

  useEffect(() => {
    if (isAutoRotate) {
      autoRotateRef.current = setInterval(() => {
        dispatchTour({ type: 'AUTO_ROTATE' });
      }, 50);
    } else if (autoRotateRef.current) {
      clearInterval(autoRotateRef.current);
    }
    return () => {
      if (autoRotateRef.current) clearInterval(autoRotateRef.current);
    };
  }, [isAutoRotate]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest?.('.tour-hotspot')) return;
    setIsAutoRotate(false);
    dispatchTour({ type: 'START_DRAG', payload: { x: e.clientX, y: e.clientY } });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    dispatchTour({ type: 'DRAG_MOVE', payload: { clientX: e.clientX, clientY: e.clientY } });
  }, []);

  const handleMouseUp = useCallback(() => {
    dispatchTour({ type: 'STOP_DRAG' });
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsAutoRotate(false);
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    dispatchTour({ type: 'START_DRAG', payload: { x: touch.clientX, y: touch.clientY } });
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    dispatchTour({
      type: 'DRAG_MOVE',
      payload: { clientX: touch.clientX, clientY: touch.clientY },
    });
  }, []);

  // Use native event listener with { passive: false } so preventDefault() works for wheel zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      dispatchTour({ type: 'ZOOM_DELTA', payload: -e.deltaY * 0.001 });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
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

  const navigateToRoom = useCallback((roomIndex: number) => {
    setCurrentIndex(roomIndex);
    dispatchTour({ type: 'RESET_VIEW' });
  }, []);

  const handleHotspotClick = useCallback(
    (hotspot: TourHotspotData) => {
      if (hotspot.targetRoom !== undefined) {
        navigateToRoom(hotspot.targetRoom);
      } else if (hotspot.action) {
        hotspot.action();
      }
    },
    [navigateToRoom]
  );

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
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
          dispatchTour({ type: 'ZOOM_DELTA', payload: 0.2 });
          break;
        case '-':
          dispatchTour({ type: 'ZOOM_DELTA', payload: -0.2 });
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
            className={`tour-btn ${useImmersiveViewer ? 'active' : ''}`}
            onClick={() => setUseImmersiveViewer(v => !v)}
            title="Toggle Immersive Viewer"
          >
            🧭
          </button>
          <button className="tour-btn" onClick={toggleFullscreen} title="Fullscreen">
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
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div
          className="tour-panorama"
          style={
            canUsePannellum
              ? undefined
              : {
                  backgroundImage: `url(${currentImage.url || ''})`,
                  backgroundPosition: `${50 + (rotation.y % 360) * (100 / 360)}% ${
                    50 - rotation.x * (50 / 90)
                  }%`,
                  backgroundSize: `${300 * zoom}% ${200 * zoom}%`,
                }
          }
        >
          {canUsePannellum ? null : null}
          {showHotspots &&
            hotspots.map((hotspot, index) => {
              const adjustedX = (hotspot.x - (rotation.y % 360) * (100 / 360) + 150) % 100;
              const adjustedY = hotspot.y + rotation.x * (50 / 90);
              const isVisible =
                adjustedX >= 10 && adjustedX <= 90 && adjustedY >= 10 && adjustedY <= 90;

              if (!isVisible) return null;

              return (
                <button
                  key={hotspot.label || `hotspot-${hotspot.x}-${hotspot.y}`}
                  className={`tour-hotspot ${hotspot.type || 'navigation'}`}
                  style={{
                    left: `${adjustedX}%`,
                    top: `${adjustedY}%`,
                  }}
                  onClick={() => handleHotspotClick(hotspot)}
                  title={hotspot.label}
                >
                  <span className="hotspot-icon">{hotspot.type === 'info' ? 'ℹ️' : '→'}</span>
                  <span className="hotspot-label">{hotspot.label}</span>
                </button>
              );
            })}
        </div>

        <div className="tour-compass">
          <div className="compass-needle" style={{ transform: `rotate(${-rotation.y}deg)` }} />
          <span className="compass-label">N</span>
        </div>
      </div>

      <div className="tour-footer">
        <div className="zoom-controls">
          <button
            className="zoom-btn"
            onClick={() => dispatchTour({ type: 'ZOOM', payload: zoom - 0.2 })}
          >
            −
          </button>
          <div className="zoom-level">{Math.round(zoom * 100)}%</div>
          <button
            className="zoom-btn"
            onClick={() => dispatchTour({ type: 'ZOOM', payload: zoom + 0.2 })}
          >
            +
          </button>
        </div>

        <div className="room-navigator">
          {images.map((img, index) => (
            <button
              key={img.url || img.name || `room-${index}`}
              className={`room-thumb ${index === currentIndex ? 'active' : ''}`}
              onClick={() => navigateToRoom(index)}
            >
              <img
                src={img.thumbnail || img.url || ''}
                alt={img.name || `Room ${index + 1}`}
                loading="lazy"
                width={120}
                height={80}
              />
              <span className="room-name">{img.name || `Room ${index + 1}`}</span>
            </button>
          ))}
        </div>

        <div className="tour-info">
          <span className="current-room">{currentImage.name || `Room ${currentIndex + 1}`}</span>
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
