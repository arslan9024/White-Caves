import React, { useState, useCallback } from 'react';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import Flex from '../../layout/Flex';
import Grid from '../../layout/Grid';
import './PropertyFilters.css';

const PropertyFilters = React.memo(({
  filters = {},
  onFilterChange,
  onApply,
  onReset,
  showAdvanced = false,
  compact = false,
  className = ''
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(showAdvanced);

  const handleChange = useCallback((field, value) => {
    const updated = { ...localFilters, [field]: value };
    setLocalFilters(updated);
    onFilterChange?.(updated);
  }, [localFilters, onFilterChange]);

  const handleApply = useCallback(() => {
    onApply?.(localFilters);
  }, [localFilters, onApply]);

  const handleReset = useCallback(() => {
    setLocalFilters({});
    onReset?.();
    onFilterChange?.({});
  }, [onFilterChange, onReset]);

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'villa', label: 'Villa' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'penthouse', label: 'Penthouse' },
    { value: 'duplex', label: 'Duplex' },
    { value: 'land', label: 'Land' },
    { value: 'commercial', label: 'Commercial' },
  ];

  const bedroomOptions = [
    { value: 'studio', label: 'Studio' },
    { value: '1', label: '1 Bedroom' },
    { value: '2', label: '2 Bedrooms' },
    { value: '3', label: '3 Bedrooms' },
    { value: '4', label: '4 Bedrooms' },
    { value: '5+', label: '5+ Bedrooms' },
  ];

  const priceRanges = [
    { value: '0-500000', label: 'Up to 500K AED' },
    { value: '500000-1000000', label: '500K - 1M AED' },
    { value: '1000000-2000000', label: '1M - 2M AED' },
    { value: '2000000-5000000', label: '2M - 5M AED' },
    { value: '5000000-10000000', label: '5M - 10M AED' },
    { value: '10000000+', label: '10M+ AED' },
  ];

  const baseClass = 'wc-property-filters';
  const classes = [
    baseClass,
    compact && `${baseClass}--compact`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <Grid 
        columns={compact ? { mobile: 1, tablet: 2, desktop: 4 } : { mobile: 1, tablet: 2, desktop: 3 }} 
        gap="medium"
        className={`${baseClass}__grid`}
      >
        <Select
          label={compact ? undefined : "Property Type"}
          placeholder="Property Type"
          options={propertyTypes}
          value={localFilters.propertyType || ''}
          onChange={(e) => handleChange('propertyType', e.target.value)}
          size={compact ? 'small' : 'medium'}
          fullWidth
        />

        <Select
          label={compact ? undefined : "Bedrooms"}
          placeholder="Bedrooms"
          options={bedroomOptions}
          value={localFilters.bedrooms || ''}
          onChange={(e) => handleChange('bedrooms', e.target.value)}
          size={compact ? 'small' : 'medium'}
          fullWidth
        />

        <Select
          label={compact ? undefined : "Price Range"}
          placeholder="Price Range"
          options={priceRanges}
          value={localFilters.priceRange || ''}
          onChange={(e) => handleChange('priceRange', e.target.value)}
          size={compact ? 'small' : 'medium'}
          fullWidth
        />

        <Input
          label={compact ? undefined : "Location"}
          placeholder="Search location..."
          value={localFilters.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
          size={compact ? 'small' : 'medium'}
          icon={<span>🔍</span>}
          fullWidth
        />
      </Grid>

      {showAdvancedFilters && (
        <Grid 
          columns={{ mobile: 1, tablet: 2, desktop: 4 }} 
          gap="medium"
          className={`${baseClass}__advanced`}
        >
          <Input
            label={compact ? undefined : "Min Area (sqft)"}
            placeholder="Min sqft"
            type="number"
            value={localFilters.minArea || ''}
            onChange={(e) => handleChange('minArea', e.target.value)}
            size={compact ? 'small' : 'medium'}
            fullWidth
          />

          <Input
            label={compact ? undefined : "Max Area (sqft)"}
            placeholder="Max sqft"
            type="number"
            value={localFilters.maxArea || ''}
            onChange={(e) => handleChange('maxArea', e.target.value)}
            size={compact ? 'small' : 'medium'}
            fullWidth
          />

          <Select
            label={compact ? undefined : "Furnishing"}
            placeholder="Furnishing"
            options={[
              { value: 'furnished', label: 'Furnished' },
              { value: 'semi-furnished', label: 'Semi-Furnished' },
              { value: 'unfurnished', label: 'Unfurnished' },
            ]}
            value={localFilters.furnishing || ''}
            onChange={(e) => handleChange('furnishing', e.target.value)}
            size={compact ? 'small' : 'medium'}
            fullWidth
          />

          <Select
            label={compact ? undefined : "Availability"}
            placeholder="Availability"
            options={[
              { value: 'available', label: 'Available Now' },
              { value: 'coming-soon', label: 'Coming Soon' },
            ]}
            value={localFilters.availability || ''}
            onChange={(e) => handleChange('availability', e.target.value)}
            size={compact ? 'small' : 'medium'}
            fullWidth
          />
        </Grid>
      )}

      <Flex 
        justify="space-between" 
        align="center" 
        gap="medium"
        className={`${baseClass}__actions`}
      >
        <Button
          variant="ghost"
          size={compact ? 'small' : 'medium'}
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          {showAdvancedFilters ? 'Less Filters' : 'More Filters'}
        </Button>

        <Flex gap="small">
          <Button
            variant="secondary"
            size={compact ? 'small' : 'medium'}
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            variant="primary"
            size={compact ? 'small' : 'medium'}
            onClick={handleApply}
          >
            Apply Filters
          </Button>
        </Flex>
      </Flex>
    </div>
  );
});

PropertyFilters.displayName = 'PropertyFilters';

export default PropertyFilters;
