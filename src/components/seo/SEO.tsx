import React, { FC } from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  type?: string;
  name?: string;
}

export const SEO: FC<SEOProps> = ({ title, description, type, name }) => {
  const fullTitle = `${title} | White Caves CRM`;
  const defaultDesc = 'Enterprise Real Estate CRM for the Dubai Market.';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name='description' content={description || defaultDesc} />
      <meta property="og:type" content={type || 'website'} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta name="twitter:creator" content={name || 'WhiteCaves'} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
    </Helmet>
  );
};
export default SEO;
