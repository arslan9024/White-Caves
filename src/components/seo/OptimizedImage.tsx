import React from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  altText: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  altText,
  width = 800,
  height = 600,
  priority = false,
  className = '',
  ...props
}) => {
  // Cloudinary optimization: auto-format (WebP), auto-quality, specific dimensions
  const getOptimizedUrl = (url: string, w: number, h: number) => {
    if (url.includes('res.cloudinary.com')) {
      return url.replace('/upload/', `/upload/c_fill,w_${w},h_${h},q_auto,f_webp/`);
    }
    return url;
  };

  const optimizedSrc = getOptimizedUrl(src, width, height);

  return (
    <img
      src={optimizedSrc}
      alt={altText}
      loading={priority ? 'eager' : 'lazy'} // W25-016: lazy loading below fold
      className={`object-cover ${className}`}
      width={width}
      height={height}
      {...props}
    />
  );
};
