import React, { useMemo } from 'react';
import PropertyCard from '../PropertyCard';
import { Grid, Flex } from '../../layout';
import { Button } from '../../ui';
import './PropertyList.css';

const PropertyList = React.memo(({
  properties = [],
  viewMode = 'grid',
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'medium',
  showActions = true,
  emptyMessage = 'No properties found',
  loading = false,
  loadingCount = 6,
  onSave,
  onContact,
  onView,
  onViewModeChange,
  showViewToggle = false,
  className = ''
}) => {
  const baseClass = 'wc-property-list';
  const classes = [
    baseClass,
    `${baseClass}--${viewMode}`,
    className
  ].filter(Boolean).join(' ');

  const LoadingSkeleton = useMemo(() => (
    <div className={`${baseClass}__skeleton`}>
      <div className={`${baseClass}__skeleton-image`} />
      <div className={`${baseClass}__skeleton-content`}>
        <div className={`${baseClass}__skeleton-line ${baseClass}__skeleton-line--price`} />
        <div className={`${baseClass}__skeleton-line ${baseClass}__skeleton-line--title`} />
        <div className={`${baseClass}__skeleton-line ${baseClass}__skeleton-line--location`} />
      </div>
    </div>
  ), []);

  if (loading) {
    return (
      <div className={classes}>
        <Grid columns={viewMode === 'list' ? { mobile: 1, tablet: 1, desktop: 1 } : columns} gap={gap}>
          {Array.from({ length: loadingCount }).map((_, index) => (
            <React.Fragment key={index}>{LoadingSkeleton}</React.Fragment>
          ))}
        </Grid>
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className={`${baseClass}__empty`}>
        <div className={`${baseClass}__empty-icon`}>🏠</div>
        <p className={`${baseClass}__empty-message`}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={classes}>
      {showViewToggle && (
        <Flex justify="flex-end" gap="small" className={`${baseClass}__controls`}>
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
            size="small"
            onClick={() => onViewModeChange?.('grid')}
            aria-label="Grid view"
          >
            ⊞
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'ghost'}
            size="small"
            onClick={() => onViewModeChange?.('list')}
            aria-label="List view"
          >
            ☰
          </Button>
        </Flex>
      )}

      <Grid 
        columns={viewMode === 'list' ? { mobile: 1, tablet: 1, desktop: 1 } : columns} 
        gap={gap}
      >
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            viewMode={viewMode}
            showActions={showActions}
            onSave={onSave}
            onContact={onContact}
            onView={onView}
          />
        ))}
      </Grid>
    </div>
  );
});

PropertyList.displayName = 'PropertyList';

export default PropertyList;
