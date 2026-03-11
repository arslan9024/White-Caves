import React, { ReactNode } from 'react';
import {
  QuickLinksContainerStyled,
  QuickLinksTitle,
  QuickLinksGrid,
  QuickLinkCardLink,
  QuickLinkCardAnchor,
  QuickLinkCardButton,
  QuickLinkIcon,
  QuickLinkTitle,
  QuickLinkDescription,
} from './QuickLinks/QuickLinks.styles';

interface QuickLinkData {
  path?: string;
  icon: string | ReactNode;
  title: string;
  description?: string;
  onClick?: () => void;
  external?: boolean;
  className?: string;
}

interface QuickLinksProps {
  title?: string;
  links: QuickLinkData[];
  columns?: number;
  className?: string;
}

export default function QuickLinks({ title, links, columns = 4, className = '' }: QuickLinksProps) {
  return (
    <QuickLinksContainerStyled className={className}>
      {title && <QuickLinksTitle>{title}</QuickLinksTitle>}
      <QuickLinksGrid $columns={columns}>
        {links.map((link, index) => (
          <QuickLinkCard key={link.path || index} {...link} />
        ))}
      </QuickLinksGrid>
    </QuickLinksContainerStyled>
  );
}

export function QuickLinkCard({
  path,
  icon,
  title,
  description,
  onClick,
  external = false,
  className = '',
}: QuickLinkData) {
  const content = (
    <>
      <QuickLinkIcon>{icon}</QuickLinkIcon>
      <QuickLinkTitle>{title}</QuickLinkTitle>
      {description && <QuickLinkDescription>{description}</QuickLinkDescription>}
    </>
  );

  if (onClick) {
    return (
      <QuickLinkCardButton onClick={onClick} type="button" className={className}>
        {content}
      </QuickLinkCardButton>
    );
  }

  if (external && path) {
    return (
      <QuickLinkCardAnchor href={path} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </QuickLinkCardAnchor>
    );
  }

  if (path) {
    return (
      <QuickLinkCardLink to={path} className={className}>
        {content}
      </QuickLinkCardLink>
    );
  }

  return null;
}
