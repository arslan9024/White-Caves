import React from 'react';
import { Link } from 'react-router-dom';
import './PageHeroBanner.css';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface PageHeroBannerProps {
  /** Main page heading */
  title: string;
  /** Optional subtitle / description */
  subtitle?: string;
  /** Small pill label above the title (e.g. "Real Estate Services") */
  badge?: string;
  /** Override background image URL */
  backgroundImage?: string;
  /** Colour theme for the overlay: 'dark' | 'navy' | 'charcoal' */
  theme?: 'dark' | 'navy' | 'charcoal';
  /** Breadcrumb trail — last item is current page (no link needed) */
  breadcrumbs?: BreadcrumbItem[];
  /** Optional right-side highlight card */
  stat?: { value: string; label: string };
}

const DEFAULT_BG =
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';

const OVERLAY_CLASSES: Record<NonNullable<PageHeroBannerProps['theme']>, string> = {
  dark:     'phb__overlay--dark',
  navy:     'phb__overlay--navy',
  charcoal: 'phb__overlay--charcoal',
};

const PageHeroBanner: React.FC<PageHeroBannerProps> = ({
  title,
  subtitle,
  badge,
  backgroundImage = DEFAULT_BG,
  theme = 'dark',
  breadcrumbs,
  stat,
}) => {
  return (
    <section className="phb" aria-label={`${title} page hero`}>
      {/* Background */}
      <div
        className="phb__bg"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        aria-hidden="true"
      />
      <div className={`phb__overlay ${OVERLAY_CLASSES[theme]}`} aria-hidden="true" />

      {/* Decorative shapes */}
      <div className="phb__shapes" aria-hidden="true">
        <div className="phb__shape phb__shape--1" />
        <div className="phb__shape phb__shape--2" />
      </div>

      <div className="phb__inner">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="phb__breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="phb__breadcrumb-link">Home</Link>
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                <span className="phb__breadcrumb-sep" aria-hidden="true">›</span>
                {crumb.path ? (
                  <Link to={crumb.path} className="phb__breadcrumb-link">{crumb.label}</Link>
                ) : (
                  <span className="phb__breadcrumb-current" aria-current="page">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className="phb__content">
          <div className="phb__text">
            {badge && (
              <span className="phb__badge">{badge}</span>
            )}
            <h1 className="phb__title">{title}</h1>
            {subtitle && (
              <p className="phb__subtitle">{subtitle}</p>
            )}
          </div>

          {stat && (
            <div className="phb__stat">
              <span className="phb__stat-value">{stat.value}</span>
              <span className="phb__stat-label">{stat.label}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="phb__wave" aria-hidden="true">
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,32 C360,0 1080,64 1440,32 L1440,56 L0,56 Z"
            fill="var(--bg-primary, #ffffff)"
          />
        </svg>
      </div>
    </section>
  );
};

export default PageHeroBanner;
