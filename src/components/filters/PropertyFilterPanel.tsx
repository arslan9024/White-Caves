/**
 * PropertyFilterPanel — Advanced Search Facets (W18.1-P0-002)
 * Dubai Luxury: gold #C9A84C, near-black #0A0A0A
 */

import React, { type FC } from 'react';
import type { PropertyFilters } from '../../redux/slices/propertySlice';
import type { FacetCounts } from '../../hooks/useFacets';

export interface PropertyFilterPanelProps {
  filters: PropertyFilters;
  facets?: FacetCounts | null;
  onChange: (updated: Partial<PropertyFilters>) => void;
  onReset: () => void;
  className?: string;
}

// ── Internal RadioGroup ──────────────────────────────────────────────────────

interface RadioOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface RadioGroupProps<T extends string> {
  groupLabel: string;
  name: string;
  options: RadioOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

function RadioGroup<T extends string>({
  groupLabel,
  name,
  options,
  value,
  onChange,
}: RadioGroupProps<T>) {
  return (
    <fieldset
      role="radiogroup"
      aria-label={groupLabel}
      style={{ border: 'none', padding: 0, margin: '0 0 20px 0' }}
    >
      <legend
        style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#C9A84C',
          marginBottom: 10,
          display: 'block',
        }}
      >
        {groupLabel}
      </legend>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {options.map(opt => {
          const radioId = `filter-${name}-${opt.value}`;
          const isSelected = value === opt.value;
          return (
            <label
              key={opt.value}
              htmlFor={radioId}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                fontSize: '0.875rem',
                color: isSelected ? '#C9A84C' : '#0A0A0A',
                fontWeight: isSelected ? 600 : 400,
              }}
            >
              <input
                id={radioId}
                type="radio"
                name={name}
                value={opt.value}
                checked={isSelected}
                onChange={() => onChange(opt.value)}
                aria-label={
                  opt.count !== undefined
                    ? `${groupLabel}: ${opt.label} (${opt.count})`
                    : `${groupLabel}: ${opt.label}`
                }
                style={{ accentColor: 'var(--color-c9a84c, #C9A84C)', width: 16, height: 16, cursor: 'pointer', flexShrink: 0 }}
              />
              <span>{opt.label}</span>
              {opt.count !== undefined && (
                <span
                  aria-hidden="true"
                  style={{
                    marginLeft: 'auto',
                    fontSize: '0.75rem',
                    color: '#888',
                    backgroundColor: '#f5f5f0',
                    borderRadius: 12,
                    padding: '1px 8px',
                    minWidth: 28,
                    textAlign: 'center',
                  }}
                >
                  {opt.count}
                </span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export const PropertyFilterPanel: FC<PropertyFilterPanelProps> = ({
  filters,
  facets,
  onChange,
  onReset,
  className,
}) => {
  const furnishingOptions: RadioOption<PropertyFilters['furnishing']>[] = [
    { value: 'all',         label: 'All',         count: facets?.furnishing?.all },
    { value: 'furnished',   label: 'Furnished',   count: facets?.furnishing?.furnished },
    { value: 'unfurnished', label: 'Unfurnished', count: facets?.furnishing?.unfurnished },
  ];

  const handoverOptions: RadioOption<PropertyFilters['handoverStage']>[] = [
    { value: 'all',                label: 'All',                count: facets?.handoverStage?.['all'] },
    { value: 'ready',              label: 'Ready',              count: facets?.handoverStage?.['ready'] },
    { value: 'off-plan',           label: 'Off-Plan',           count: facets?.handoverStage?.['off-plan'] },
    { value: 'under-construction', label: 'Under Construction', count: facets?.handoverStage?.['under-construction'] },
  ];

  const permitOptions: RadioOption<PropertyFilters['permitStatus']>[] = [
    { value: 'all',     label: 'All',     count: facets?.permitStatus?.['all'] },
    { value: 'active',  label: 'Active',  count: facets?.permitStatus?.['active'] },
    { value: 'pending', label: 'Pending', count: facets?.permitStatus?.['pending'] },
  ];

  const feeBandOptions: RadioOption<PropertyFilters['feeBand']>[] = [
    { value: 'all',          label: 'All',                count: facets?.feeBand?.['all'] },
    { value: 'no-fee',       label: 'No Fee',             count: facets?.feeBand?.['no-fee'] },
    { value: 'low-fee',      label: 'Low Fee (≤2%)',      count: facets?.feeBand?.['low-fee'] },
    { value: 'standard-fee', label: 'Standard Fee (>2%)', count: facets?.feeBand?.['standard-fee'] },
  ];

  return (
    <aside
      className={className}
      aria-label="Property filters"
      style={{ padding: 20, backgroundColor: 'var(--white, #fff)', borderRadius: 12, border: '1px solid var(--color-e8e4dc, #e8e4dc)' }}
    >
      <RadioGroup
        groupLabel="Furnishing"
        name="furnishing"
        options={furnishingOptions}
        value={filters.furnishing}
        onChange={val => onChange({ furnishing: val })}
      />
      <RadioGroup
        groupLabel="Handover Stage"
        name="handoverStage"
        options={handoverOptions}
        value={filters.handoverStage}
        onChange={val => onChange({ handoverStage: val })}
      />
      <RadioGroup
        groupLabel="Permit Status"
        name="permitStatus"
        options={permitOptions}
        value={filters.permitStatus}
        onChange={val => onChange({ permitStatus: val })}
      />
      <RadioGroup
        groupLabel="Fee Band"
        name="feeBand"
        options={feeBandOptions}
        value={filters.feeBand}
        onChange={val => onChange({ feeBand: val })}
      />
      <button
        type="button"
        onClick={onReset}
        aria-label="Reset all filters"
        style={{
          width: '100%',
          padding: '10px 16px',
          background: 'transparent',
          border: '1px solid #C9A84C',
          borderRadius: 8,
          color: '#C9A84C',
          fontWeight: 600,
          fontSize: '0.875rem',
          cursor: 'pointer',
          letterSpacing: '0.04em',
        }}
      >
        Reset Filters
      </button>
    </aside>
  );
};
