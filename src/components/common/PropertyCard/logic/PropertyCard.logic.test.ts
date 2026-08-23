import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from '../../../../store/dashboardSlice';
import { usePropertyCardLogic } from './PropertyCard.logic';

const createMockStore = () =>
  configureStore({
    reducer: {
      dashboard: dashboardReducer,
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  React.createElement(Provider, { store: createMockStore() }, children)
);

describe('PropertyCard.logic', () => {
  const defaultProps = {
    id: 'prop-101',
    title: 'Luxury Marina Penthouse',
    location: 'Dubai Marina',
    price: 'AED 8,500,000',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
    beds: 4,
    baths: 5,
    area: '4,500',
    type: 'sale' as const,
  };

  it('initializes favorite state and handles toggling favorite', () => {
    const { result } = renderHook(() => usePropertyCardLogic(defaultProps), { wrapper });

    expect(result.current.isFavorite).toBe(false);

    const mockEvent = {
      stopPropagation: vi.fn(),
      preventDefault: vi.fn(),
    } as unknown as React.MouseEvent;

    act(() => {
      result.current.handleFavoriteClick(mockEvent);
    });

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });
});
