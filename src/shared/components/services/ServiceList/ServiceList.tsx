import React from 'react';
import ServiceCard from '../ServiceCard';
import type { ServiceData } from '../ServiceCard/ServiceCard';
import Grid from '../../layout/Grid';
import './ServiceList.css';

export interface GridColumns {
  mobile?: number;
  tablet?: number;
  desktop?: number;
}

export interface ServiceListProps {
  services?: ServiceData[];
  variant?: 'vertical' | 'horizontal';
  columns?: GridColumns;
  gap?: 'small' | 'medium' | 'large';
  showPrice?: boolean;
  showBooking?: boolean;
  emptyMessage?: string;
  loading?: boolean;
  loadingCount?: number;
  onBook?: (service: ServiceData) => void;
  onLearnMore?: (service: ServiceData) => void;
  className?: string;
}

const ServiceList = React.memo<ServiceListProps>(({
  services = [],
  variant = 'vertical',
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'medium',
  showPrice = true,
  showBooking = true,
  emptyMessage = 'No services available',
  loading = false,
  loadingCount = 6,
  onBook,
  onLearnMore,
  className = ''
}) => {
  const baseClass = 'wc-service-list';
  const classes = [baseClass, className].filter(Boolean).join(' ');

  if (loading) {
    return (
      <div className={classes}>
        <Grid columns={variant === 'horizontal' ? { mobile: 1, tablet: 1, desktop: 2 } : columns} gap={gap}>
          {Array.from({ length: loadingCount }).map((_, index) => (
            <div key={`service-skeleton-${index}`} className={`${baseClass}__skeleton`}>
              <div className={`${baseClass}__skeleton-image`} />
              <div className={`${baseClass}__skeleton-content`}>
                <div className={`${baseClass}__skeleton-line ${baseClass}__skeleton-line--title`} />
                <div className={`${baseClass}__skeleton-line ${baseClass}__skeleton-line--text`} />
                <div className={`${baseClass}__skeleton-line ${baseClass}__skeleton-line--text`} />
              </div>
            </div>
          ))}
        </Grid>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className={`${baseClass}__empty`}>
        <div className={`${baseClass}__empty-icon`}>🏢</div>
        <p className={`${baseClass}__empty-message`}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={classes}>
      <Grid 
        columns={variant === 'horizontal' ? { mobile: 1, tablet: 1, desktop: 2 } : columns} 
        gap={gap}
      >
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            variant={variant}
            showPrice={showPrice}
            showBooking={showBooking}
            onBook={onBook}
            onLearnMore={onLearnMore}
          />
        ))}
      </Grid>
    </div>
  );
});

ServiceList.displayName = 'ServiceList';

export default ServiceList;
