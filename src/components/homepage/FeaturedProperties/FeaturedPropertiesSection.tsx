/**
 * FeaturedPropertiesSection — @Lea (UI Engineer)
 * Replaces the static HOME_PROPERTIES display with live Redux-connected cards.
 * Live data from homepageSlice.featuredProperties (fetched via /api/homepage/data).
 * Static fallback: gracefully renders skeleton cards while loading.
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VirtualTourModal from '../../properties/VirtualTourModal';
import PropertyComparisonDrawer, { ComparableProperty } from '../../properties/PropertyComparisonDrawer';
import './FeaturedPropertiesSection.css';

// ─── Props ────────────────────────────────────────────────────────────────────

interface FeaturedPropertiesSectionProps {
  featuredProperties: HomepageProperty[];
  isLoading?: boolean;
}

// ─── Skeleton Card (@Una shimmer pattern) ─────────────────────────────────────

const SkeletonCard: React.FC = () => (
  <div className="fp-skeleton-card" aria-hidden="true">
    <div className="fp-skeleton-image" />
    <div className="fp-skeleton-body">
      <div className="fp-skeleton-line fp-skeleton-line--title" />
      <div className="fp-skeleton-line fp-skeleton-line--location" />
      <div className="fp-skeleton-line fp-skeleton-line--price" />
      <div className="fp-skeleton-specs">
        <div className="fp-skeleton-spec" />
        <div className="fp-skeleton-spec" />
        <div className="fp-skeleton-spec" />
      </div>
    </div>
  </div>
);

// ─── Property Card (inline luxury variant for featured section) ───────────────

interface FeaturedCardProps {
  property: HomepageProperty;
  index: number;
  onOpenTour: (property: HomepageProperty) => void;
  onToggleCompare: (property: HomepageProperty) => void;
  isCompared: boolean;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({
  property,
  index,
  onOpenTour,
  onToggleCompare,
  isCompared,
}) => {
  const navigate = useNavigate();
  const fallbackImage = '/images/dubai-skyline.jpg';
  const image = property.images?.[0] ?? fallbackImage;

  const formattedPrice = new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: property.currency ?? 'AED',
    maximumFractionDigits: 0,
    notation: property.price >= 1_000_000 ? 'compact' : 'standard',
  }).format(property.price);

  return (
    <motion.article
      className="fp-card"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -8 }}
      onClick={() => navigate(`/property/${property.id}`)}
      role="button"
      tabIndex={0}
      aria-label={`View ${property.title}`}
      onKeyDown={e => e.key === 'Enter' && navigate(`/property/${property.id}`)}
    >
      {/* Image */}
      <div className="fp-card__image-wrapper">
        <img
          src={image}
          alt={property.title}
          className="fp-card__image"
          loading="lazy"
          onError={e => {
            const target = e.currentTarget;
            if (target.src !== fallbackImage) {
              target.src = fallbackImage;
            }
          }}
        />
        <div className="fp-card__image-overlay" />

        {/* Badges */}
        <div className="fp-card__badges">
          {property.featured && (
            <span className="fp-badge fp-badge--featured">
              <Sparkles size={11} />
              Featured
            </span>
          )}
          <span className="fp-badge fp-badge--trucheck">
            <CheckCircle2 size={11} />
            TruCheck™
          </span>
          <span className="fp-badge fp-badge--trakheesi">
            <ShieldCheck size={11} />
            DLD Validated
          </span>
          <span className={`fp-badge fp-badge--status fp-badge--${property.status}`}>
            {property.status}
          </span>
        </div>

        {/* Price overlay */}
        <div className="fp-card__price-overlay">
          <span className="fp-card__price">{formattedPrice}</span>
        </div>
      </div>

      {/* Content */}
      <div className="fp-card__content">
        <h3 className="fp-card__title">{property.title}</h3>
        <p className="fp-card__location">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          {property.location}
        </p>

        {/* Specs */}
        <div className="fp-card__specs">
          {property.bedrooms > 0 && (
            <span className="fp-spec">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />
              </svg>
              {property.bedrooms} Bed{property.bedrooms !== 1 ? 's' : ''}
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="fp-spec">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M7 6c0-1.1.9-2 2-2s2 .9 2 2v1h2V6c0-2.21-1.79-4-4-4S5 3.79 5 6v2H3v8c0 1.1.9 2 2 2h.28l-.94 3H6l.94-3h10.12l.94 3h1.66l-.94-3H19c1.1 0 2-.9 2-2v-8h-2V6z" />
              </svg>
              {property.bathrooms} Bath{property.bathrooms !== 1 ? 's' : ''}
            </span>
          )}
          {property.sqft > 0 && (
            <span className="fp-spec">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              {property.sqft.toLocaleString()} sqft
            </span>
          )}
        </div>

        {/* Quick action hover bar with 3D Tour & Compare */}
        <div className="fp-card__actions" style={{ display: 'flex', gap: '6px' }}>
          <button
            className="fp-action-btn"
            style={{ flex: 1 }}
            onClick={e => {
              e.stopPropagation();
              navigate(`/property/${property.id}`);
            }}
          >
            View Details
          </button>
          <button
            className="fp-action-btn"
            style={{
              background: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              padding: '6px 8px',
              fontSize: '0.72rem',
              fontWeight: 800,
            }}
            onClick={e => {
              e.stopPropagation();
              onOpenTour(property);
            }}
            title="Launch 3D WebGL Virtual Tour"
          >
            🕶️ 3D
          </button>
          <button
            className="fp-action-btn"
            style={{
              background: isCompared ? '#EF4444' : '#F1F5F9',
              color: isCompared ? '#FFFFFF' : '#0F172A',
              border: '1px solid #CBD5E1',
              padding: '6px 8px',
              fontSize: '0.72rem',
              fontWeight: 800,
            }}
            onClick={e => {
              e.stopPropagation();
              onToggleCompare(property);
            }}
            title="Compare property specifications"
          >
            {isCompared ? '✓ Added' : '⚖️ Compare'}
          </button>
        </div>
      </div>
    </motion.article>
  );
};

// ─── Empty State ───────────────────────────────────────────────────────────────

const EmptyState: React.FC = () => (
  <div className="fp-empty">
    <div className="fp-empty__icon" aria-hidden="true">
      🏛️
    </div>
    <p className="fp-empty__text">Featured listings coming soon</p>
    <p className="fp-empty__sub">Check back for our handpicked luxury selection</p>
  </div>
);

// ─── Main Section ─────────────────────────────────────────────────────────────

const FeaturedPropertiesSection: React.FC<FeaturedPropertiesSectionProps> = ({
  featuredProperties,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const [selectedTourProperty, setSelectedTourProperty] = useState<HomepageProperty | null>(null);
  const [comparedProperties, setComparedProperties] = useState<ComparableProperty[]>([]);
  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = useState(false);

  const handleToggleCompare = (property: HomepageProperty) => {
    if (comparedProperties.some(p => p.id === property.id)) {
      setComparedProperties(prev => prev.filter(p => p.id !== property.id));
    } else {
      if (comparedProperties.length >= 4) {
        alert('You can compare a maximum of 4 properties.');
        return;
      }
      const newProp: ComparableProperty = {
        id: property.id,
        title: property.title,
        price: property.price,
        location: property.location,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        sqft: property.sqft,
        type: property.type || 'Luxury Residence',
        image: property.images?.[0],
        projectedYield: '8.5% Net ROI',
      };
      setComparedProperties(prev => [...prev, newProp]);
      setIsCompareDrawerOpen(true);
    }
  };

  return (
    <section className="fp-section" id="featured-properties">
      {/* 3D Virtual Tour Viewer Modal */}
      <VirtualTourModal
        isOpen={Boolean(selectedTourProperty)}
        onClose={() => setSelectedTourProperty(null)}
        propertyTitle={selectedTourProperty?.title}
        propertyLocation={selectedTourProperty?.location}
        tourUrl={selectedTourProperty?.images?.[0]}
      />

      {/* Property Comparison Drawer */}
      <PropertyComparisonDrawer
        isOpen={isCompareDrawerOpen}
        onClose={() => setIsCompareDrawerOpen(false)}
        properties={comparedProperties}
        onRemoveProperty={id => setComparedProperties(prev => prev.filter(p => p.id !== id))}
        onClearAll={() => {
          setComparedProperties([]);
          setIsCompareDrawerOpen(false);
        }}
      />

      <div className="container">
        {/* Header */}
        <motion.div
          className="fp-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">Hand-Picked for You</span>
          <h2 className="section-title">Featured Properties</h2>
          <p className="section-subtitle">
            Exclusive listings curated from Dubai&apos;s most prestigious addresses
          </p>
          <div className="divider" />
        </motion.div>

        {/* Grid */}
        {isLoading ? (
          <div className="fp-grid" aria-busy="true" aria-label="Loading featured properties">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : featuredProperties.length > 0 ? (
          <div className="fp-grid">
            {featuredProperties.map((property, i) => (
              <FeaturedCard
                key={property.id}
                property={property}
                index={i}
                onOpenTour={prop => setSelectedTourProperty(prop)}
                onToggleCompare={prop => handleToggleCompare(prop)}
                isCompared={comparedProperties.some(p => p.id === property.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}

        {/* CTA */}
        <motion.div
          className="fp-cta"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.button
            className="btn btn-primary fp-cta__btn"
            onClick={() => navigate('/properties')}
            whileHover={{ scale: 1.04, boxShadow: '0 10px 30px rgba(227, 30, 36,0.35)' }}
            whileTap={{ scale: 0.98 }}
          >
            View All Properties
            <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedPropertiesSection;
