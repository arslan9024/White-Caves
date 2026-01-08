import React from 'react';
import './Card.css';

const Card = React.memo(({
  children,
  variant = 'default',
  padding = 'medium',
  hoverable = false,
  clickable = false,
  elevated = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseClass = 'wc-card';
  const classes = [
    baseClass,
    `${baseClass}--${variant}`,
    `${baseClass}--padding-${padding}`,
    hoverable && `${baseClass}--hoverable`,
    clickable && `${baseClass}--clickable`,
    elevated && `${baseClass}--elevated`,
    className
  ].filter(Boolean).join(' ');

  const Component = clickable ? 'button' : 'div';

  return (
    <Component 
      className={classes} 
      onClick={clickable ? onClick : undefined}
      {...props}
    >
      {children}
    </Component>
  );
});

const CardHeader = React.memo(({ children, className = '', ...props }) => (
  <div className={`wc-card__header ${className}`} {...props}>
    {children}
  </div>
));

const CardBody = React.memo(({ children, className = '', ...props }) => (
  <div className={`wc-card__body ${className}`} {...props}>
    {children}
  </div>
));

const CardFooter = React.memo(({ children, className = '', ...props }) => (
  <div className={`wc-card__footer ${className}`} {...props}>
    {children}
  </div>
));

const CardImage = React.memo(({ src, alt = '', aspectRatio = '16/9', className = '', ...props }) => (
  <div className={`wc-card__image ${className}`} style={{ aspectRatio }} {...props}>
    <img src={src} alt={alt} loading="lazy" />
  </div>
));

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardBody.displayName = 'CardBody';
CardFooter.displayName = 'CardFooter';
CardImage.displayName = 'CardImage';

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Image = CardImage;

export default Card;
export { CardHeader, CardBody, CardFooter, CardImage };
