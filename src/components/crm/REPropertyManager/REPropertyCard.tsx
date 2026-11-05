/**
 * REPropertyCard.tsx
 * 7-Category Architecture: View Layer (Decomposed Property Card)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { Bed, Bath, Maximize2, MapPin, ShieldCheck, ChevronRight } from 'lucide-react';
import type { REPropertyNode, REPropertyStatus } from './REPropertyManager.types';
import { propStyles as s } from './REPropertyManager.styles';

interface REPropertyCardProps {
  property: REPropertyNode;
  onInspect: (property: REPropertyNode) => void;
  onAdvanceStatus?: (id: string, newStatus: REPropertyStatus) => void;
}

export const REPropertyCard: FC<REPropertyCardProps> = ({
  property,
  onInspect,
  onAdvanceStatus,
}) => {
  const formatPrice = (price: number) => {
    return `AED ${price.toLocaleString()}`;
  };

  return (
    <div className={s.card} data-testid={`property-card-${property.repropertyId}`}>
      {/* Property Hero Image */}
      <div className={s.cardImageWrapper}>
        <img
          src={
            property.images[0] ||
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
          }
          alt={property.title}
          className={s.cardImage}
          loading="lazy"
        />
        <span className={s.cardBadgePurpose(property.purpose)}>
          {property.purpose === 'BUY' ? 'For Sale' : 'For Lease'}
        </span>
        <span
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase backdrop-blur-md ${s.cardBadgeStatus(
            property.status
          )}`}
        >
          {property.status.replace('_', ' ')}
        </span>
        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] font-mono text-emerald-300 border border-emerald-500/20">
          {property.repropertyId}
        </div>
      </div>

      {/* Property Details */}
      <div className={s.cardContent}>
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <span className={s.cardPrice}>
              {formatPrice(property.priceAED)}
              {property.purpose === 'RENT' && (
                <span className="text-xs font-normal text-slate-400"> / yr</span>
              )}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
              {property.propertyType}
            </span>
          </div>
          <h3 className={s.cardTitle} title={property.title}>
            {property.title}
          </h3>
          <p className={s.cardLocation}>
            <MapPin size={12} className="text-amber-400 shrink-0" />
            <span className="truncate">
              {property.location} • {property.subLocation}
            </span>
          </p>
        </div>

        {/* Specs Row */}
        <div className={s.cardChipsRow}>
          {property.bedrooms > 0 && (
            <div className={s.chip}>
              <Bed size={12} className="text-slate-400" />
              <span>{property.bedrooms} Beds</span>
            </div>
          )}
          <div className={s.chip}>
            <Bath size={12} className="text-slate-400" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className={s.chip}>
            <Maximize2 size={12} className="text-slate-400" />
            <span>{property.areaSqft.toLocaleString()} sqft</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
            <ShieldCheck size={12} />
            <span className="truncate max-w-[120px]">{property.trakheesiPermit}</span>
          </div>

          <button
            onClick={() => onInspect(property)}
            className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30 flex items-center gap-1 transition-all cursor-pointer"
            data-testid={`inspect-btn-${property.repropertyId}`}
          >
            <span>Inspect Unit</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
