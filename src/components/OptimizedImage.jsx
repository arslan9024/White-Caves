import React, { useState, useRef, useEffect } from 'react';
import './OptimizedImage.css';

export default function OptimizedImage({ 
  src, 
  alt, 
  className = '', 
  width, 
  height,
  placeholder = 'blur',
  priority = false,
  onLoad,
  onClick
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
  };

  const placeholderStyle = {
    width: width || '100%',
    height: height || '100%',
    aspectRatio: width && height ? `${width}/${height}` : undefined
  };

  return (
    <div 
      ref={imgRef}
      className={`optimized-image-container ${className} ${isLoaded ? 'loaded' : ''}`}
      style={placeholderStyle}
      onClick={onClick}
    >
      {placeholder === 'blur' && !isLoaded && (
        <div className="image-placeholder blur" />
      )}
      {placeholder === 'skeleton' && !isLoaded && (
        <div className="image-placeholder skeleton" />
      )}
      {error ? (
        <div className="image-error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span>Image unavailable</span>
        </div>
      ) : isInView ? (
        <img
          src={src}
          alt={alt}
          className={`optimized-image ${isLoaded ? 'visible' : ''}`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      ) : null}
    </div>
  );
}

export function LazyBackground({ src, className = '', children, priority = false }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const containerRef = useRef(null);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  useEffect(() => {
    if (isInView && src) {
      const img = new Image();
      img.onload = () => setIsLoaded(true);
      img.src = src;
    }
  }, [isInView, src]);

  return (
    <div
      ref={containerRef}
      className={`lazy-background ${className} ${isLoaded ? 'loaded' : ''}`}
      style={isLoaded ? { backgroundImage: `url(${src})` } : undefined}
    >
      {children}
    </div>
  );
}
