/**
 * Responsive Breakpoints
 * Media query breakpoints for responsive design
 */

export const breakpoints = {
  mobile: '480px',
  mobileLg: '576px',
  tablet: '768px',
  desktop: '1024px',
  desktopMd: '1200px',
  desktopLg: '1920px',
  desktopXl: '2560px',
};

export const mediaQueries = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  mobileLg: `@media (max-width: ${breakpoints.mobileLg})`,
  tablet: `@media (max-width: ${breakpoints.tablet})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  desktopMd: `@media (min-width: ${breakpoints.desktopMd})`,
  desktopLg: `@media (min-width: ${breakpoints.desktopLg})`,
  desktopXl: `@media (min-width: ${breakpoints.desktopXl})`,

  // Mobile first
  tabletUp: `@media (min-width: ${breakpoints.tablet})`,
  desktopUp: `@media (min-width: ${breakpoints.desktop})`,
  desktopMdUp: `@media (min-width: ${breakpoints.desktopMd})`,
};

export type Breakpoints = typeof breakpoints;
export type MediaQueries = typeof mediaQueries;
