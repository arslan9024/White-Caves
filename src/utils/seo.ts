export interface SEOConfig {
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogType?: 'website' | 'article' | 'profile';
  ogImage?: string;
  noIndex?: boolean;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const SEO_ATTR = 'data-wc-seo';
const SEO_JSONLD_ID = 'wc-seo-jsonld';

type CleanupFn = () => void;

function upsertMeta(attribute: 'name' | 'property', key: string, content: string): CleanupFn {
  const selector = `meta[${attribute}="${key}"]`;
  const existing = document.head.querySelector<HTMLMetaElement>(selector);

  if (existing) {
    const previous = existing.getAttribute('content');
    existing.setAttribute('content', content);
    existing.setAttribute(SEO_ATTR, 'true');

    return () => {
      if (previous != null) {
        existing.setAttribute('content', previous);
      } else {
        existing.removeAttribute('content');
      }
      existing.removeAttribute(SEO_ATTR);
    };
  }

  const meta = document.createElement('meta');
  meta.setAttribute(attribute, key);
  meta.setAttribute('content', content);
  meta.setAttribute(SEO_ATTR, 'true');
  document.head.appendChild(meta);

  return () => {
    if (meta.parentNode) meta.parentNode.removeChild(meta);
  };
}

function upsertCanonical(href: string): CleanupFn {
  const existing = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (existing) {
    const previous = existing.getAttribute('href');
    existing.setAttribute('href', href);
    existing.setAttribute(SEO_ATTR, 'true');

    return () => {
      if (previous != null) {
        existing.setAttribute('href', previous);
      } else {
        existing.removeAttribute('href');
      }
      existing.removeAttribute(SEO_ATTR);
    };
  }

  const link = document.createElement('link');
  link.setAttribute('rel', 'canonical');
  link.setAttribute('href', href);
  link.setAttribute(SEO_ATTR, 'true');
  document.head.appendChild(link);

  return () => {
    if (link.parentNode) link.parentNode.removeChild(link);
  };
}

function upsertJsonLd(jsonLd: SEOConfig['jsonLd']): CleanupFn {
  const existing = document.getElementById(SEO_JSONLD_ID) as HTMLScriptElement | null;
  const payload = JSON.stringify(jsonLd);

  if (existing) {
    const previous = existing.textContent;
    existing.textContent = payload;
    return () => {
      existing.textContent = previous;
    };
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = SEO_JSONLD_ID;
  script.textContent = payload;
  script.setAttribute(SEO_ATTR, 'true');
  document.head.appendChild(script);

  return () => {
    if (script.parentNode) script.parentNode.removeChild(script);
  };
}

/**
 * Apply runtime SEO tags for SPA pages and return cleanup callback.
 */
export function applySEO(config: SEOConfig): CleanupFn {
  const cleanups: CleanupFn[] = [];

  if (config.description) {
    cleanups.push(upsertMeta('name', 'description', config.description));
    cleanups.push(upsertMeta('property', 'og:description', config.description));
    cleanups.push(upsertMeta('name', 'twitter:description', config.description));
  }

  if (config.keywords && config.keywords.length > 0) {
    cleanups.push(upsertMeta('name', 'keywords', config.keywords.join(', ')));
  }

  if (config.canonicalUrl) {
    cleanups.push(upsertCanonical(config.canonicalUrl));
    cleanups.push(upsertMeta('property', 'og:url', config.canonicalUrl));
  }

  cleanups.push(upsertMeta('property', 'og:type', config.ogType || 'website'));

  if (config.ogImage) {
    cleanups.push(upsertMeta('property', 'og:image', config.ogImage));
    cleanups.push(upsertMeta('name', 'twitter:image', config.ogImage));
    cleanups.push(upsertMeta('name', 'twitter:card', 'summary_large_image'));
  }

  if (config.noIndex) {
    cleanups.push(upsertMeta('name', 'robots', 'noindex, nofollow'));
  }

  if (config.jsonLd) {
    cleanups.push(upsertJsonLd(config.jsonLd));
  }

  return () => {
    for (let i = cleanups.length - 1; i >= 0; i -= 1) {
      cleanups[i]();
    }
  };
}

export default applySEO;
