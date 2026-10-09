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

  it('supports keyboard option selection and returns focus to the trigger', () => {
    const onSelect = vi.fn();
    render(
      <SearchableSelect
        options={options}
        selectedId="opt-1"
        onSelect={onSelect}
        accentColor="#EF4444"
      />
    );

    fireEvent.click(screen.getByRole('button'));
    const search = screen.getByRole('textbox', { name: 'Search options' });
    fireEvent.change(search, { target: { value: 'Option Two' } });
    fireEvent.keyDown(search, { key: 'ArrowDown' });

    const option = screen.getByRole('option', { name: /Option Two/ });
    expect(option).toHaveFocus();
    fireEvent.keyDown(option, { key: 'Enter' });

    expect(onSelect).toHaveBeenCalledWith(options[1]);
    expect(screen.getByRole('button')).toHaveFocus();
  });

  it('closes on Escape and returns focus to the trigger', () => {
    render(
      <SearchableSelect
        options={options}
        selectedId="opt-1"
        onSelect={vi.fn()}
        accentColor="#EF4444"
      />
    );

    fireEvent.click(screen.getByRole('button'));
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Search options' }), { key: 'Escape' });

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveFocus();
  });
});
