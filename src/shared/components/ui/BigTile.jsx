import React, { useState } from 'react';
import { ChevronRight, ExternalLink } from 'lucide-react';
import * as S from './BigTile.styles';

const BigTile = ({ 
  icon: Icon,
  title,
  subtitle,
  description,
  stats = [],
  color = '#dc2626',
  onClick,
  onLearnMore,
  badge,
  isActive = false,
  size = 'medium',
  children
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const [isHovered, setIsHovered] = useState(false);

  return (
    <S.BigTileContainer 
      $size={size}
      $isActive={isActive}
      $isHovered={isHovered}
      $tileColor={color}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {badge && (
        <S.TileBadge $backgroundColor={color}>
          {badge}
        </S.TileBadge>
      )}
      
      <S.TileHeader>
        <S.TileIconContainer 
          $backgroundColor={`${color}15`}
          $color={color}
          $size={size}
        >
          {Icon && <Icon size={size === 'large' ? 32 : size === 'small' ? 20 : 24} />}
        </S.TileIconContainer>
        
        <S.TileTitleSection>
          <S.TileTitle $size={size}>{title}</S.TileTitle>
          {subtitle && <S.TileSubtitle>{subtitle}</S.TileSubtitle>}
        </S.TileTitleSection>
      </S.TileHeader>

      {description && (
        <S.TileDescription>{description}</S.TileDescription>
      )}

      {stats.length > 0 && (
        <S.TileStats>
          {stats.map((stat, index) => (
            <S.TileStat key={index}>
              <S.StatValue $color={color}>{stat.value}</S.StatValue>
              <S.StatLabel>{stat.label}</S.StatLabel>
            </S.TileStat>
          ))}
        </S.TileStats>
      )}

      {children && (
        <S.TileContent>
          {children}
        </S.TileContent>
      )}

      <S.TileFooter>
        {onLearnMore && (
          <S.LearnMoreButton 
            $tileColor={color}
            onClick={(e) => {
              e.stopPropagation();
              onLearnMore();
            }}
          >
            <span>Learn More</span>
            <ExternalLink size={14} />
          </S.LearnMoreButton>
        )}
        
        <S.TileArrow $tileColor={color} $isHovered={isHovered}>
          <ChevronRight size={20} />
        </S.TileArrow>
      </S.TileFooter>

      <S.TileGlow 
        $isHovered={isHovered}
        style={{ background: `radial-gradient(circle at center, ${color}20 0%, transparent 70%)` }}
      />
    </S.BigTileContainer>
  );
};

export default BigTile;
