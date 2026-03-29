import React, { FC, ReactNode, useState, useRef, useEffect } from 'react';
import {
  TooltipWrapper,
  TooltipContent,
  TooltipArrow,
  TooltipPortal,
} from './Tooltip.styles';

export type TooltipPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end';

interface TooltipProps {
  title?: ReactNode;
  content?: ReactNode;
  placement?: TooltipPlacement;
  children: ReactNode;
  delayShow?: number;
  delayHide?: number;
  className?: string;
  style?: React.CSSProperties;
  popperClassName?: string;
}

export const Tooltip: FC<TooltipProps> = ({
  title,
  content,
  placement = 'top',
  children,
  delayShow = 200,
  delayHide = 0,
  className = '',
  style,
  popperClassName = '',
}) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // Cleanup timer on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    clearTimeout(timerRef.current);
    const rect = e.currentTarget.getBoundingClientRect();

    timerRef.current = setTimeout(() => {
      const offset = 8;

      let top = 0;
      let left = 0;

      switch (placement) {
        case 'top':
          top = rect.top - offset;
          left = rect.left + rect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + offset;
          left = rect.left + rect.width / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2;
          left = rect.left - offset;
          break;
        case 'right':
          top = rect.top + rect.height / 2;
          left = rect.right + offset;
          break;
      }

      setPosition({ top, left });
      setVisible(true);
    }, delayShow);
  };

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setVisible(false);
    }, delayHide);
  };

  return (
    <TooltipWrapper
      className={className}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {visible && (
        <TooltipPortal $placement={placement} $position={position} className={popperClassName}>
          {title && <div style={{ fontWeight: 600, marginBottom: '4px' }}>{title}</div>}
          <TooltipContent>{content}</TooltipContent>
          <TooltipArrow $placement={placement} />
        </TooltipPortal>
      )}
    </TooltipWrapper>
  );
};

interface TooltipSimpleProps {
  text?: string;
  children: ReactNode;
  placement?: TooltipPlacement;
}

export const TooltipSimple: FC<TooltipSimpleProps> = ({
  text,
  children,
  placement = 'top',
}) => {
  return (
    <Tooltip content={text} placement={placement}>
      {children}
    </Tooltip>
  );
};

export default Tooltip;
