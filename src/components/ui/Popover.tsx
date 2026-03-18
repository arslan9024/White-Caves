/**
 * Popover Component
 * =================
 * Lightweight popover with positioning options and click-outside handling.
 */

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

export type PopoverPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export type PopoverTrigger = 'click' | 'hover';

export interface PopoverProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: PopoverPlacement;
  trigger?: PopoverTrigger;
  showArrow?: boolean;
  maxWidth?: number;
  onOpen?: () => void;
  onClose?: () => void;
}

const PopoverWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const PopoverTriggerElement = styled.div`
  cursor: pointer;
  display: inline-block;
`;

const PopoverContent = styled.div<{ isVisible: boolean; placement: PopoverPlacement }>`
  position: absolute;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 10px 15px rgba(0, 0, 0, 0.1);
  padding: 12px 16px;
  z-index: 10;
  opacity: ${props => (props.isVisible ? 1 : 0)};
  visibility: ${props => (props.isVisible ? 'visible' : 'hidden')};
  pointer-events: ${props => (props.isVisible ? 'auto' : 'none')};
  transition: opacity 0.2s ease, visibility 0.2s ease;
  max-width: 100%;

  &::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;

    ${props => {
      switch (props.placement) {
        case 'top':
          return `
            bottom: -6px;
            left: 50%;
            transform: translateX(-50%);
            border-width: 6px 6px 0 6px;
            border-color: white transparent transparent transparent;
          `;
        case 'bottom':
          return `
            top: -6px;
            left: 50%;
            transform: translateX(-50%);
            border-width: 0 6px 6px 6px;
            border-color: transparent transparent white transparent;
          `;
        case 'left':
          return `
            right: -6px;
            top: 50%;
            transform: translateY(-50%);
            border-width: 6px 0 6px 6px;
            border-color: transparent transparent transparent white;
          `;
        case 'right':
          return `
            left: -6px;
            top: 50%;
            transform: translateY(-50%);
            border-width: 6px 6px 6px 0;
            border-color: transparent white transparent transparent;
          `;
        default:
          return '';
      }
    }}
  }

  ${props => {
    switch (props.placement) {
      case 'top':
        return 'bottom: 100%; margin-bottom: 12px; left: 50%; transform: translateX(-50%);';
      case 'bottom':
        return 'top: 100%; margin-top: 12px; left: 50%; transform: translateX(-50%);';
      case 'left':
        return 'right: 100%; margin-right: 12px; top: 50%; transform: translateY(-50%);';
      case 'right':
        return 'left: 100%; margin-left: 12px; top: 50%; transform: translateY(-50%);';
      case 'top-left':
        return 'bottom: 100%; margin-bottom: 12px; left: 0;';
      case 'top-right':
        return 'bottom: 100%; margin-bottom: 12px; right: 0;';
      case 'bottom-left':
        return 'top: 100%; margin-top: 12px; left: 0;';
      case 'bottom-right':
        return 'top: 100%; margin-top: 12px; right: 0;';
      default:
        return '';
    }
  }}
`;

/**
 * Popover Component
 * Lightweight popover that appears next to trigger element
 */
export const Popover: React.FC<PopoverProps> = ({
  content,
  children,
  placement = 'bottom',
  trigger = 'click',
  showArrow = true,
  maxWidth = 300,
  onOpen,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    if (!isVisible) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsVisible(false);
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isVisible, onClose]);

  const handleTriggerClick = () => {
    const newState = !isVisible;
    setIsVisible(newState);
    if (newState) {
      onOpen?.();
    } else {
      onClose?.();
    }
  };

  const handleTriggerHover = (hovering: boolean) => {
    if (trigger === 'hover') {
      setIsVisible(hovering);
      if (hovering) {
        onOpen?.();
      } else {
        onClose?.();
      }
    }
  };

  if (trigger === 'click') {
    return (
      <PopoverWrapper ref={wrapperRef}>
        <PopoverTriggerElement onClick={handleTriggerClick}>
          {children}
        </PopoverTriggerElement>
        <PopoverContent isVisible={isVisible} placement={placement} style={{ maxWidth }}>
          {content}
        </PopoverContent>
      </PopoverWrapper>
    );
  }

  return (
    <PopoverWrapper
      ref={wrapperRef}
      onMouseEnter={() => handleTriggerHover(true)}
      onMouseLeave={() => handleTriggerHover(false)}
    >
      <PopoverTriggerElement>{children}</PopoverTriggerElement>
      <PopoverContent isVisible={isVisible} placement={placement} style={{ maxWidth }}>
        {content}
      </PopoverContent>
    </PopoverWrapper>
  );
};

export default Popover;
