import React, { useState, useEffect, useRef } from 'react';

export default function LazyImage({ 
  src, 
  alt, 
  className = '', 
  placeholder = null,
  aspectRatio = '16/9',
  objectFit = 'cover',
  onLoad = null,
  onError = null,
  ...props 
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setHasError(true);
    if (onError) onError(e);
  };

  const containerStyle = {
    position: 'relative',
    overflow: 'hidden',
    aspectRatio: aspectRatio,
    backgroundColor: 'var(--bg-tertiary, #e0e0e0)'
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: objectFit,
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease'
  };

  const placeholderStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: isLoaded ? 0 : 1,
    transition: 'opacity 0.3s ease'
  };

  return (
    <div ref={imgRef} style={containerStyle} className={`lazy-image-container ${className}`}>
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          style={imageStyle}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
          {...props}
        />
      )}
      
      {!isLoaded && (
        <div style={placeholderStyle}>
          {placeholder || (
            <div className="lazy-image-skeleton">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--text-muted, #999)">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
            </div>
          )}
        </div>
      )}
      
      {hasError && (
        <div style={placeholderStyle}>
          <div className="lazy-image-error">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--text-muted, #999)">
              <path d="M21 5v6.59l-3-3.01-4 4.01-4-4-4 4-3-3.01V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2zm-3 6.42l3 3.01V19c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-6.58l3 2.99 4-4 4 4 4-3.99z"/>
            </svg>
            <span>Image unavailable</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function LazyBackgroundImage({ 
  src, 
  children, 
  className = '', 
  fallbackColor = 'var(--bg-tertiary, #e0e0e0)',
  ...props 
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '100px 0px',
        threshold: 0.01
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isInView && src) {
      const img = new Image();
      img.onload = () => setIsLoaded(true);
      img.src = src;
    }
  }, [isInView, src]);

  const style = {
    backgroundImage: isLoaded ? `url(${src})` : 'none',
    backgroundColor: isLoaded ? 'transparent' : fallbackColor,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'background-image 0.3s ease'
  };

  return (
    <div ref={containerRef} className={className} style={style} {...props}>
      {children}
    </div>
  );
}
