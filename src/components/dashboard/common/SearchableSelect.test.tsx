import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import SearchableSelect, { SearchableOption } from './SearchableSelect';

describe('SearchableSelect', () => {
  const options: SearchableOption[] = [
    { id: 'opt-1', name: 'Option One', icon: '🏢' },
    { id: 'opt-2', name: 'Option Two', icon: '💎' },
  ];

  it('renders selected option and opens dropdown on click', () => {
    const onSelect = vi.fn();
    render(
      <SearchableSelect
        options={options}
        selectedId="opt-1"
        onSelect={onSelect}
        accentColor="#EF4444"
      />
    );

    expect(screen.getByText('Option One')).toBeInTheDocument();
    
    const trigger = screen.getByText('Option One');
    fireEvent.click(trigger);

    expect(screen.getByText('Option Two')).toBeInTheDocument();
  });
});
