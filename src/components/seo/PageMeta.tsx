import type { FC } from 'react';
import { useSEO, getCanonicalUrl } from '../../hooks/useSEO';
import type { SEOConfig } from '../../utils/seo';

interface PageMetaProps extends Omit<SEOConfig, 'canonicalUrl'> {
  title: string;
  canonicalPath?: string;
}

const PageMeta: FC<PageMetaProps> = ({
  title,
  canonicalPath,
  description,
  keywords,
  ogType,
  ogImage,
  noIndex,
  jsonLd,
}) => {
  useSEO({
    title,
    description,
    keywords,
    canonicalUrl: canonicalPath ? getCanonicalUrl(canonicalPath) : undefined,
    ogType,
    ogImage,
    noIndex,
    jsonLd,
  });

  return null;
};

export default PageMeta;
