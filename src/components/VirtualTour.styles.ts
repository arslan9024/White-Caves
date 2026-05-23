import styled from 'styled-components';
import { keyframes } from 'styled-components';
import { colors } from '../styles/theme/colors';
import { typography } from '../styles/theme/typography';
import { transitions } from '../styles/theme/transitions';
import { radius } from '../styles/theme/radius';
import { spacing } from '../styles/theme/spacing';

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(227, 30, 36, 0.4); }
  50% { box-shadow: 0 0 0 15px rgba(227, 30, 36, 0); }
`;

export const VirtualTourContainer = styled.div<{ $fullscreen?: boolean }>`
  position: ${props => (props.$fullscreen ? 'fixed' : 'relative')};
  width: 100%;
  height: ${props => (props.$fullscreen ? '100vh' : '500px')};
  background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
  border-radius: ${props => (props.$fullscreen ? '0' : '16px')};
  overflow: hidden;
  border: 1px solid rgba(227, 30, 36, 0.2);
  ${props =>
    props.$fullscreen
      ? `
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: var(--z-fullscreen, 700);
  `
      : ''}
`;

export const TourHeader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), transparent);
  z-index: 10;
`;

export const TourTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const TourBadge = styled.div`
  background: linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark});
  color: #0a0a0f;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: ${typography.sizes.xs};
  font-weight: ${typography.weights.semibold};
  text-transform: uppercase;
`;

export const TourTitleText = styled.h3`
  color: white;
  margin: 0;
  font-size: ${typography.sizes.lg};
  font-weight: ${typography.weights.medium};
`;

export const TourControlsHeader = styled.div`
  display: flex;
  gap: ${spacing.sm};
`;

export const TourBtn = styled.button<{ $close?: boolean; $active?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${typography.sizes.md};
  transition: ${transitions.all};

  &:hover {
    background: ${props => (props.$close ? 'rgba(255, 100, 100, 0.3)' : 'rgba(227, 30, 36, 0.3)')};
    border-color: ${props => (props.$close ? '#ff6464' : colors.primary)};
  }

  ${props =>
    props.$active &&
    `
    background: rgba(227, 30, 36, 0.4);
    border-color: ${colors.primary};
  `}
`;

export const TourViewport = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  perspective: 1000px;
`;

export const TourPanorama = styled.div<{ $position?: number; $zoom?: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-repeat: repeat-x;
  background-position: ${props => (props.$position ? `${props.$position}% center` : '0% center')};
  background-size: ${props => (props.$zoom ? `${props.$zoom * 100}% 100%` : '100% 100%')};
  transition:
    background-position 0.05s linear,
    background-size 0.1s ease;
`;

export const TourHotspot = styled.button`
  position: absolute;
  transform: translate(-50%, -50%);
  background: rgba(227, 30, 36, 0.9);
  border: 2px solid white;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: ${pulse} 2s infinite;
  z-index: 5;
  transition: ${transitions.all};

  &:hover {
    transform: translate(-50%, -50%) scale(1.2);
    background: ${colors.primary};
  }

  &.info {
    background: rgba(100, 149, 237, 0.9);
  }
`;

export const HotspotIcon = styled.span`
  font-size: ${typography.sizes.lg};
`;

export const HotspotLabel = styled.div`
  position: absolute;
  bottom: -24px;
  white-space: nowrap;
  font-size: ${typography.sizes.xs};
  color: white;
  background: rgba(0, 0, 0, 0.7);
  padding: 2px 8px;
  border-radius: ${radius.sm};
  opacity: 0;
  transition: opacity 0.3s ease;

  ${TourHotspot}:hover & {
    opacity: 1;
  }
`;

export const TourCompass = styled.div`
  position: absolute;
  top: 80px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
`;

export const CompassNeedle = styled.div<{ $rotation?: number }>`
  width: 4px;
  height: 30px;
  background: linear-gradient(to bottom, #ff4444 50%, white 50%);
  border-radius: 2px;
  transform: ${props => (props.$rotation ? `rotate(${props.$rotation}deg)` : 'rotate(0deg)')};
  transition: transform 0.1s linear;
`;

export const CompassLabel = styled.div`
  position: absolute;
  top: 4px;
  font-size: 10px;
  color: #ff4444;
  font-weight: bold;
`;

export const TourFooter = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
`;

export const ZoomControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  padding: ${spacing.xs};
`;

export const ZoomBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: ${typography.sizes.lg};
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(227, 30, 36, 0.4);
  }
`;

export const ZoomLevel = styled.span`
  color: white;
  font-size: ${typography.sizes.base};
  min-width: 50px;
  text-align: center;
`;

export const RoomNavigator = styled.div`
  display: flex;
  gap: ${spacing.sm};
  overflow-x: auto;
  padding: ${spacing.xs};
  max-width: 50%;
`;

export const RoomThumb = styled.button<{ $active?: boolean }>`
  flex-shrink: 0;
  width: 80px;
  height: 50px;
  border-radius: ${radius.lg};
  overflow: hidden;
  border: 2px solid ${props => (props.$active ? colors.primary : 'transparent')};
  cursor: pointer;
  transition: ${transitions.all};
  position: relative;
  background: none;
  padding: 0;
  box-shadow: ${props => (props.$active ? '0 0 10px rgba(227, 30, 36, 0.5)' : 'none')};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    border-color: rgba(227, 30, 36, 0.5);
  }
`;

export const RoomName = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 10px;
  padding: 2px 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TourInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${spacing.xs};
`;

export const TourInfoText = styled.div`
  color: white;
  font-size: ${typography.sizes.xs};
`;

export const ViewsCount = styled.span`
  color: ${colors.primary};
  font-weight: ${typography.weights.semibold};
`;
