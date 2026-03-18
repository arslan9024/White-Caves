import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dropdown from '../Dropdown';

describe('Dropdown Component', () => {
  const options = [
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' },
    { value: 'opt3', label: 'Option 3' },
  ];

  describe('Rendering', () => {
    it('should render dropdown trigger', () => {
      const handleChange = vi.fn();
      render(
        <Dropdown options={options} onChange={handleChange}>
          Select an option
        </Dropdown>
      );
      
      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('should show options when opened', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Dropdown options={options} onChange={handleChange}>
          Open menu
        </Dropdown>
      );
      
      const trigger = screen.getByText('Open menu');
      await user.click(trigger);
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
  });

  describe('Selection', () => {
    it('should call onChange when option is selected', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Dropdown options={options} onChange={handleChange}>
          Select option
        </Dropdown>
      );
      
      const trigger = screen.getByText('Select option');
      await user.click(trigger);
      
      const option = screen.getByText('Option 2');
      await user.click(option);
      
      expect(handleChange).toHaveBeenCalledWith('opt2');
    });

    it('should close menu after selection', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <Dropdown options={options} onChange={handleChange}>
          Select option
        </Dropdown>
      );
      
      const trigger = screen.getByText('Select option');
      await user.click(trigger);
      
      const option = screen.getByText('Option 1');
      await user.click(option);
      
      const menu = container.querySelector('[role="menu"]');
      expect(menu).not.toBeVisible();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support arrow key navigation', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Dropdown options={options} onChange={handleChange}>
          Select option
        </Dropdown>
      );
      
      const trigger = screen.getByText('Select option');
      await user.click(trigger);
      await user.keyboard('{ArrowDown}');
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('should support Enter key selection', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Dropdown options={options} onChange={handleChange}>
          Select option
        </Dropdown>
      );
      
      const trigger = screen.getByText('Select option');
      await user.click(trigger);
      await user.keyboard('{ArrowDown}{Enter}');
      
      expect(handleChange).toHaveBeenCalledWith('opt1');
    });

    it('should support Escape key to close', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <Dropdown options={options} onChange={handleChange}>
          Select option
        </Dropdown>
      );
      
      const trigger = screen.getByText('Select option');
      await user.click(trigger);
      await user.keyboard('{Escape}');
      
      const menu = container.querySelector('[role="menu"]');
      expect(menu).not.toBeVisible();
    });
  });

  describe('Disabled Options', () => {
    const optionsWithDisabled = [
      { value: 'opt1', label: 'Option 1' },
      { value: 'opt2', label: 'Option 2', disabled: true },
      { value: 'opt3', label: 'Option 3' },
    ];

    it('should not select disabled option', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Dropdown options={optionsWithDisabled} onChange={handleChange}>
          Select option
        </Dropdown>
      );
      
      const trigger = screen.getByText('Select option');
      await user.click(trigger);
      
      const disabledOption = screen.getByText('Option 2');
      expect(disabledOption.closest('li')).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Dropdown options={options} onChange={handleChange}>
          Select option
        </Dropdown>
      );
      
      const trigger = screen.getByText('Select option');
      expect(trigger.closest('button')).toHaveAttribute('aria-haspopup', 'menu');
    });
  });
});
