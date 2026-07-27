import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

/**
 * Tooltip Component
 * Accessible tooltip with auto-positioning to avoid viewport overflow
 * Keyboard accessible and screen reader friendly
 * 
 * @component
 * @param {Object} props
 * @param {string} props.content - Tooltip content text
 * @param {React.ReactNode} props.children - Trigger element
 * @param {string} props.position - Position (top/bottom/left/right)
 * @param {number} props.delay - Delay in ms before showing
 * @param {number} props.maxWidth - Max width in pixels
 * 
 * @example
 * <Tooltip content="Click to edit profile" position="top">
 *   <button>Edit</button>
 * </Tooltip>
 */
const Tooltip = ({
  content,
  children,
  position = 'top',
  delay = 200,
  maxWidth = 200,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, position });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!isVisible || !triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const gap = 8;

    let top = 0;
    let left = 0;
    let finalPosition = position;

    // Calculate position
    const positions = {
      top: {
        top: triggerRect.top - tooltipRect.height - gap,
        left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
      },
      bottom: {
        top: triggerRect.bottom + gap,
        left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
      },
      left: {
        top: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
        left: triggerRect.left - tooltipRect.width - gap,
      },
      right: {
        top: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
        left: triggerRect.right + gap,
      },
    };

    top = positions[position].top;
    left = positions[position].left;

    // Avoid viewport overflow
    if (left < 0) left = gap;
    if (left + tooltipRect.width > window.innerWidth) {
      left = window.innerWidth - tooltipRect.width - gap;
    }
    if (top < 0) {
      finalPosition = 'bottom';
      top = positions.bottom.top;
    }
    if (top + tooltipRect.height > window.innerHeight) {
      finalPosition = 'top';
      top = positions.top.top;
    }

    setCoords({ top, left, position: finalPosition });
  }, [isVisible, position]);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isVisible]);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        role="button"
        tabIndex={0}
      >
        {children}
      </div>

      {isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            className="fixed bg-gray-900 dark:bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none z-50 whitespace-nowrap"
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              maxWidth: `${maxWidth}px`,
              animation: 'fadeIn 0.15s ease-out',
            }}
            role="tooltip"
          >
            {content}
            <div
              className={`absolute w-2 h-2 bg-gray-900 dark:bg-gray-800 transform rotate-45 ${
                coords.position === 'top' 
                  ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2' 
                  : coords.position === 'bottom' 
                  ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2' 
                  : coords.position === 'left' 
                  ? 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2' 
                  : 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2'
              }`}
            />
          </div>,
          document.body
        )}
    </>
  );
};

Tooltip.propTypes = {
  content: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  delay: PropTypes.number,
  maxWidth: PropTypes.number,
};

export default Tooltip;
