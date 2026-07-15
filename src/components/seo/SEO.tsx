import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  schemas?: object[];
  canonical?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image = 'https://whitecaves.com/og-default.jpg',
  url = 'https://whitecaves.com',
  type = 'website',
  schemas = [],
  canonical,
}) => {
  useEffect(() => {
    // Basic Meta
    document.title = `${title} | White Caves Real Estate`;

    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', description);

    // OG Meta
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:image', image, true);
    setMeta('og:url', url, true);
    setMeta('og:type', type, true);

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image);

    // Canonical
    if (canonical) {
      let canEl = document.querySelector(`link[rel="canonical"]`);
      if (!canEl) {
        canEl = document.createElement('link');
        canEl.setAttribute('rel', 'canonical');
        document.head.appendChild(canEl);
      }
      canEl.setAttribute('href', canonical);
    }

    // Hreflang (W25-014)
    const hreflangs = [
      { lang: 'en', href: url },
      { lang: 'ar', href: url.replace('https://whitecaves.com', 'https://whitecaves.com/ar') },
      { lang: 'x-default', href: url },
    ];

    hreflangs.forEach(({ lang, href }) => {
      let linkEl = document.querySelector(`link[hreflang="${lang}"]`);
      if (!linkEl) {
        linkEl = document.createElement('link');
        linkEl.setAttribute('rel', 'alternate');
        linkEl.setAttribute('hreflang', lang);
        document.head.appendChild(linkEl);
      }
      linkEl.setAttribute('href', href);
    });

    // JSON-LD Schemas (W25-013)
    const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
    existingSchemas.forEach(el => el.remove());

    schemas.forEach(schema => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(schema);
      document.head.appendChild(script);
    });
  }, [title, description, image, url, type, schemas, canonical]);

  return null;
};
