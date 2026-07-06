const HOMEPAGE_HERO_PRELOAD_ID = 'homepage-hero-preload';
const HOMEPAGE_HERO_IMAGE = '/images/dubai-skyline.jpg';

export const ensureHomepageHeroPreload = (): HTMLLinkElement => {
  let preloadLink = document.querySelector<HTMLLinkElement>(`link#${HOMEPAGE_HERO_PRELOAD_ID}`);

  if (!preloadLink) {
    preloadLink = document.createElement('link');
    preloadLink.id = HOMEPAGE_HERO_PRELOAD_ID;
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = HOMEPAGE_HERO_IMAGE;
    document.head.appendChild(preloadLink);
  }

  return preloadLink;
};

export const cleanupHomepageHeroPreload = (): void => {
  document.querySelector<HTMLLinkElement>(`link#${HOMEPAGE_HERO_PRELOAD_ID}`)?.remove();
};
