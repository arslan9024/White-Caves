import React from 'react';
import './Card.css';

/* ── Card ─────────────────────────────────────────────── */

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** Card content */
  children?: React.ReactNode;
  /** Visual variant */
  variant?: 'default' | 'outlined' | 'filled' | string;
  /** Padding size */
  padding?: 'none' | 'small' | 'medium' | 'large';
  /** Whether the card highlights on hover */
  hoverable?: boolean;
  /** Whether the card renders as a clickable button */
  clickable?: boolean;
  /** Whether the card has an elevated shadow */
  elevated?: boolean;
  /** Click handler (used when clickable is true) */
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const CardBase = React.memo<CardProps>(({
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
      {...(props as React.HTMLAttributes<HTMLElement>)}
    >
      {children}
    </Component>
  );
});

/* ── Card Sub-components ──────────────────────────────── */

export interface CardSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const CardHeader = React.memo<CardSectionProps>(({ children, className = '', ...props }) => (
  <div className={`wc-card__header ${className}`} {...props}>
    {children}
  </div>
));

const CardBody = React.memo<CardSectionProps>(({ children, className = '', ...props }) => (
  <div className={`wc-card__body ${className}`} {...props}>
    {children}
  </div>
));

const CardFooter = React.memo<CardSectionProps>(({ children, className = '', ...props }) => (
  <div className={`wc-card__footer ${className}`} {...props}>
    {children}
  </div>
));

export interface CardImageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Image source URL */
  src: string;
  /** Image alt text */
  alt?: string;
  /** CSS aspect-ratio value */
  aspectRatio?: string;
}

const CardImage = React.memo<CardImageProps>(({ src, alt = '', aspectRatio = '16/9', className = '', ...props }) => (
  <div className={`wc-card__image ${className}`} style={{ aspectRatio }} {...props}>
    <img src={src} alt={alt} loading="lazy" />
  </div>
));

/* ── Display names ────────────────────────────────────── */

CardBase.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardBody.displayName = 'CardBody';
CardFooter.displayName = 'CardFooter';
CardImage.displayName = 'CardImage';

/* ── Compound component ───────────────────────────────── */

const Card = Object.assign(CardBase, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
  Image: CardImage,
});

export default Card;
export { CardHeader, CardBody, CardFooter, CardImage };
