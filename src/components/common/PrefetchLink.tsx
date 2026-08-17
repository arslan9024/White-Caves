import React, { FC, AnchorHTMLAttributes, ReactNode, FocusEvent, MouseEvent } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { prefetchRoute } from '../../utils/routePrefetcher';

export interface PrefetchLinkProps extends LinkProps {
  children: ReactNode;
  prefetchOnMount?: boolean;
}

/**
 * Drop-in replacement for React Router's Link that triggers intelligent chunk prefetching on hover & focus
 */
export const PrefetchLink: FC<PrefetchLinkProps> = ({
  to,
  children,
  prefetchOnMount = false,
  onMouseEnter,
  onFocus,
  ...props
}) => {
  const targetPath = typeof to === 'string' ? to : (to as any).pathname || '';

  React.useEffect(() => {
    if (prefetchOnMount && targetPath) {
      prefetchRoute(targetPath);
    }
  }, [prefetchOnMount, targetPath]);

  const handleMouseEnter = (e: MouseEvent<HTMLAnchorElement>) => {
    if (targetPath) {
      prefetchRoute(targetPath);
    }
    onMouseEnter?.(e);
  };

  const handleFocus = (e: FocusEvent<HTMLAnchorElement>) => {
    if (targetPath) {
      prefetchRoute(targetPath);
    }
    onFocus?.(e);
  };

  return (
    <Link
      to={to}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      {...props}
    >
      {children}
    </Link>
  );
};

export default PrefetchLink;
