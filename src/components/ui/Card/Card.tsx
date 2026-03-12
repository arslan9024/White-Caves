import React, { type ReactNode, type CSSProperties } from 'react';
import * as S from './Card.styles';

type CardVariant = 'default' | 'stat' | 'property' | 'agent' | string;
type CardPadding = 'none' | 'tight' | 'normal' | 'loose' | string;
type CardShadow = 'none' | 'default' | 'hover' | string;

interface CardProps {
  children?: ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  hoverable?: boolean;
  bordered?: boolean;
  shadow?: CardShadow;
  className?: string;
  onClick?: () => void;
  [key: string]: unknown;
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
  [key: string]: unknown;
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
  [key: string]: unknown;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
  [key: string]: unknown;
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string | number;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: ReactNode;
  iconColor?: string;
  className?: string;
  [key: string]: unknown;
}

interface PropertyCardProps {
  image?: string;
  title: string;
  price: string;
  priceLabel?: string;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  status?: string;
  statusLabel?: string;
  onFavorite?: () => void;
  isFavorite?: boolean;
  onClick?: () => void;
  className?: string;
  [key: string]: unknown;
}

interface AgentStat {
  value: string | number;
  label: string;
}

interface AgentCardProps {
  avatar?: string;
  name: string;
  role?: string;
  department?: string;
  departmentColor?: string;
  stats?: AgentStat[];
  actions?: ReactNode;
  className?: string;
  [key: string]: unknown;
}

interface CardComponent extends React.FC<CardProps> {
  Header: React.FC<CardHeaderProps>;
  Body: React.FC<CardBodyProps>;
  Footer: React.FC<CardFooterProps>;
  Stat: React.FC<StatCardProps>;
  Property: React.FC<PropertyCardProps>;
  Agent: React.FC<AgentCardProps>;
}

const Card: CardComponent = ({
  children,
  variant = 'default',
  padding = 'normal',
  hoverable = false,
  bordered = true,
  shadow = 'default',
  className = '',
  onClick,
  ...props
}) => {
  return (
    <S.CardContainer 
      variant={variant}
      padding={padding}
      hoverable={hoverable}
      bordered={bordered}
      shadow={shadow}
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </S.CardContainer>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '', ...props }) => (
  <S.CardHeader className={className} {...props}>
    {children}
  </S.CardHeader>
);

const CardBody: React.FC<CardBodyProps> = ({ children, className = '', ...props }) => (
  <S.CardBody className={className} {...props}>
    {children}
  </S.CardBody>
);

const CardFooter: React.FC<CardFooterProps> = ({ children, className = '', ...props }) => (
  <S.CardFooter className={className} {...props}>
    {children}
  </S.CardFooter>
);

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  iconColor,
  className = '',
  ...props
}) => (
  <Card variant="stat" className={className} {...props}>
    <S.StatCardContent>
      <S.StatCardInfo>
        <S.StatCardTitle>{title}</S.StatCardTitle>
        <S.StatCardValue>{value}</S.StatCardValue>
        {change !== undefined && (
          <S.StatCardChange type={changeType}>
            {changeType === 'positive' && '+'}{change}
          </S.StatCardChange>
        )}
      </S.StatCardInfo>
      {icon && (
        <S.StatCardIcon style={{ backgroundColor: iconColor ? `${iconColor}15` : undefined, color: iconColor }}>
          {icon}
        </S.StatCardIcon>
      )}
    </S.StatCardContent>
  </Card>
);

const PropertyCard: React.FC<PropertyCardProps> = ({
  image,
  title,
  price,
  priceLabel = '',
  location,
  bedrooms,
  bathrooms,
  area,
  status,
  statusLabel,
  onFavorite,
  isFavorite,
  onClick,
  className = '',
  ...props
}) => (
  <Card variant="property" hoverable onClick={onClick} className={className} {...props}>
    <S.PropertyCardImage>
      {image && <img src={image} alt={title} />}
      {status && (
        <S.PropertyCardStatus status={status}>
          {statusLabel || status}
        </S.PropertyCardStatus>
      )}
      {onFavorite && (
        <S.PropertyCardFavorite 
          onClick={(e: React.MouseEvent) => { e.stopPropagation(); onFavorite(); }}
        >
          ♥
        </S.PropertyCardFavorite>
      )}
    </S.PropertyCardImage>
    <S.PropertyCardContent>
      <S.PropertyCardTitle>{title}</S.PropertyCardTitle>
      <S.PropertyCardLocation>{location}</S.PropertyCardLocation>
      <S.PropertyCardFeatures>
        {bedrooms !== undefined && <S.PropertyCardFeature>{bedrooms} Beds</S.PropertyCardFeature>}
        {bathrooms !== undefined && <S.PropertyCardFeature>{bathrooms} Baths</S.PropertyCardFeature>}
        {area && <S.PropertyCardFeature>{area}</S.PropertyCardFeature>}
      </S.PropertyCardFeatures>
      <S.PropertyCardPrice>
        <S.PropertyCardPriceValue>{price}</S.PropertyCardPriceValue>
        {priceLabel && <S.PropertyCardPriceLabel>{priceLabel}</S.PropertyCardPriceLabel>}
      </S.PropertyCardPrice>
    </S.PropertyCardContent>
  </Card>
);

const AgentCard: React.FC<AgentCardProps> = ({
  avatar,
  name,
  role,
  department,
  departmentColor,
  stats = [],
  actions,
  className = '',
  ...props
}) => (
  <Card variant="agent" className={className} {...props}>
    <div className="wc-agent-card-header">
      <div className="wc-agent-card-avatar">
        {avatar ? <img src={avatar} alt={name} /> : <span>{name?.charAt(0)}</span>}
      </div>
      <div className="wc-agent-card-info">
        <h3 className="wc-agent-card-name">{name}</h3>
        <p className="wc-agent-card-role">{role}</p>
        {department && (
          <span 
            className="wc-agent-card-department" 
            style={{ backgroundColor: departmentColor ? `${departmentColor}20` : undefined, color: departmentColor }}
          >
            {department}
          </span>
        )}
      </div>
    </div>
    {stats.length > 0 && (
      <div className="wc-agent-card-stats">
        {stats.map((stat, index) => (
          <div key={index} className="wc-agent-card-stat">
            <span className="wc-agent-card-stat-value">{stat.value}</span>
            <span className="wc-agent-card-stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    )}
    {actions && <div className="wc-agent-card-actions">{actions}</div>}
  </Card>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Stat = StatCard;
Card.Property = PropertyCard;
Card.Agent = AgentCard;

export default Card;
