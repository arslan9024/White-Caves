/**
 * propertySearchSlice tests — W18.1-P0-001
 */

import { describe, it, expect } from 'vitest';
import propertySearchReducer, {
  setIntentProfile,
  setFilters,
  setViewportBounds,
  setActivePropertyId,
  resetFilters,
} from './propertySlice';
import type { PropertySearchState, PropertyFilters, ViewportBounds } from './propertySlice';

const getInitialState = (): PropertySearchState =>
  propertySearchReducer(undefined, { type: '@@INIT' });

describe('propertySearchSlice', () => {
  it('returns correct initial state shape', () => {
    const state = getInitialState();
    expect(state.intentProfile).toBeNull();
    expect(state.activePropertyId).toBeNull();
    expect(state.viewportBounds).toBeNull();
    expect(state.filters.furnishing).toBe('all');
    expect(state.filters.handoverStage).toBe('all');
    expect(state.filters.permitStatus).toBe('all');
    expect(state.filters.feeBand).toBe('all');
    expect(state.filters.minPrice).toBeNull();
    expect(state.filters.beds).toBeNull();
  });

  // setIntentProfile
  it('setIntentProfile — sets buy', () => {
    expect(propertySearchReducer(getInitialState(), setIntentProfile('buy')).intentProfile).toBe(
      'buy'
    );
  });

  it('setIntentProfile — sets rent', () => {
    expect(propertySearchReducer(getInitialState(), setIntentProfile('rent')).intentProfile).toBe(
      'rent'
    );
  });

  it('setIntentProfile — sets invest', () => {
    expect(propertySearchReducer(getInitialState(), setIntentProfile('invest')).intentProfile).toBe(
      'invest'
    );
  });

  it('setIntentProfile — can be reset to null', () => {
    let state = propertySearchReducer(getInitialState(), setIntentProfile('buy'));
    state = propertySearchReducer(state, setIntentProfile(null));
    expect(state.intentProfile).toBeNull();
  });

  // setFilters
  it('setFilters — merges partial without clobbering other fields', () => {
    const state = propertySearchReducer(
      getInitialState(),
      setFilters({ furnishing: 'furnished', beds: 3 })
    );
    expect(state.filters.furnishing).toBe('furnished');
    expect(state.filters.beds).toBe(3);
    expect(state.filters.handoverStage).toBe('all');
    expect(state.filters.feeBand).toBe('all');
  });

  it('setFilters — updates feeBand', () => {
    const state = propertySearchReducer(getInitialState(), setFilters({ feeBand: 'no-fee' }));
    expect(state.filters.feeBand).toBe('no-fee');
  });

  it('setFilters — updates handoverStage', () => {
    const state = propertySearchReducer(
      getInitialState(),
      setFilters({ handoverStage: 'off-plan' })
    );
    expect(state.filters.handoverStage).toBe('off-plan');
  });

  it('setFilters — updates permitStatus', () => {
    const state = propertySearchReducer(getInitialState(), setFilters({ permitStatus: 'active' }));
    expect(state.filters.permitStatus).toBe('active');
  });

  it('setFilters — updates price range', () => {
    const state = propertySearchReducer(
      getInitialState(),
      setFilters({ minPrice: 500_000, maxPrice: 5_000_000 })
    );
    expect(state.filters.minPrice).toBe(500_000);
    expect(state.filters.maxPrice).toBe(5_000_000);
  });

  // resetFilters
  it('resetFilters — restores all defaults', () => {
    let state = propertySearchReducer(
      getInitialState(),
      setFilters({
        furnishing: 'furnished',
        handoverStage: 'ready',
        feeBand: 'no-fee',
        permitStatus: 'active',
        beds: 4,
        minPrice: 500_000,
        type: 'villa',
      })
    );
    state = propertySearchReducer(state, resetFilters());

    const expected: PropertyFilters = {
      type: '',
      status: '',
      minPrice: null,
      maxPrice: null,
      beds: null,
      location: '',
      area: '',
      furnishing: 'all',
      handoverStage: 'all',
      permitStatus: 'all',
      feeBand: 'all',
    };
    expect(state.filters).toEqual(expected);
  });

  it('resetFilters — does not touch intentProfile or activePropertyId', () => {
    let state = propertySearchReducer(getInitialState(), setIntentProfile('invest'));
    state = propertySearchReducer(state, setActivePropertyId('prop-99'));
    state = propertySearchReducer(state, resetFilters());
    expect(state.intentProfile).toBe('invest');
    expect(state.activePropertyId).toBe('prop-99');
  });

  // setViewportBounds
  it('setViewportBounds — stores bounds object', () => {
    const bounds: ViewportBounds = { north: 25.3, south: 25.1, east: 55.4, west: 55.1 };
    const state = propertySearchReducer(getInitialState(), setViewportBounds(bounds));
    expect(state.viewportBounds).toEqual(bounds);
  });

  it('setViewportBounds — can be cleared to null', () => {
    let state = propertySearchReducer(
      getInitialState(),
      setViewportBounds({ north: 25.3, south: 25.1, east: 55.4, west: 55.1 })
    );
    state = propertySearchReducer(state, setViewportBounds(null));
    expect(state.viewportBounds).toBeNull();
  });

  // setActivePropertyId
  it('setActivePropertyId — stores the id', () => {
    const state = propertySearchReducer(getInitialState(), setActivePropertyId('prop-123'));
    expect(state.activePropertyId).toBe('prop-123');
  });

  it('setActivePropertyId — can be cleared to null', () => {
    let state = propertySearchReducer(getInitialState(), setActivePropertyId('prop-123'));
    state = propertySearchReducer(state, setActivePropertyId(null));
    expect(state.activePropertyId).toBeNull();
  });
});
