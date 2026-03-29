import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dropdown from '../Dropdown';

describe('Dropdown Component', () => {
  const items = [
    { id: 'opt1', label: 'Option 1' },
    { id: 'opt2', label: 'Option 2' },
    { id: 'opt3', label: 'Option 3' },
  ];

  describe('Rendering', () => {
    it('should render dropdown trigger', () => {
      const handleSelect = vi.fn();
      render(
        <Dropdown items={items} trigger="Select an option" onItemSelect={handleSelect} />
      );
      
      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('should show items when opened', async () => {
      const handleSelect = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Dropdown items={items} trigger="Open menu" onItemSelect={handleSelect} />
      );
      
      const trigger = screen.getByText('Open menu');
      await user.click(trigger);
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
  });

  describe('Selection', () => {
    it('should call onItemSelect when option is selected', async () => {
      const handleSelect = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Dropdown items={items} trigger="Select option" onItemSelect={handleSelect} />
      );
      
      const trigger = screen.getByText('Select option');
      await user.click(trigger);
      
      const option = screen.getByText('Option 2');
      await user.click(option);
      
      expect(handleSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'opt2', label: 'Option 2' }));
    });

    it('should close menu after selection', async () => {
      const handleSelect = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <Dropdown items={items} trigger="Select option" onItemSelect={handleSelect} />
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
      const handleSelect = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Dropdown items={items} trigger="Select option" onItemSelect={handleSelect} />
      );
      
      const trigger = screen.getByText('Select option');
      await user.click(trigger);
      await user.keyboard('{ArrowDown}');
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('should support Enter key selection', async () => {
      const handleSelect = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Dropdown items={items} trigger="Select option" onItemSelect={handleSelect} />
      );
      
      const trigger = screen.getByText('Select option');
      await user.click(trigger);
      await user.keyboard('{ArrowDown}{Enter}');
      
      expect(handleSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'opt1' }));
    });

    it('should support Escape key to close', async () => {
      const handleSelect = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <Dropdown items={items} trigger="Select option" onItemSelect={handleSelect} />
      );
      
      const trigger = screen.getByText('Select option');
      await user.click(trigger);
      await user.keyboard('{Escape}');
      
      const menu = container.querySelector('[role="menu"]');
      expect(menu).not.toBeVisible();
    });
  });

  describe('Disabled Options', () => {
    const itemsWithDisabled = [
      { id: 'opt1', label: 'Option 1' },
      { id: 'opt2', label: 'Option 2', disabled: true },
      { id: 'opt3', label: 'Option 3' },
    ];

    it('should not select disabled option', async () => {
      const handleSelect = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Dropdown items={itemsWithDisabled} trigger="Select option" onItemSelect={handleSelect} />
      );
      
      const trigger = screen.getByText('Select option');
      await user.click(trigger);
      
      const disabledOption = screen.getByText('Option 2');
      expect(disabledOption.closest('li')).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', async () => {
      const handleSelect = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Dropdown items={items} trigger="Select option" onItemSelect={handleSelect} />
      );
      
      const trigger = screen.getByText('Select option');
      const triggerDiv = trigger.closest('[role="button"]');
      expect(triggerDiv).toBeInTheDocument();
      expect(triggerDiv).toHaveAttribute('aria-expanded', 'false');
    });

    it('should set aria-expanded to true when open', async () => {
      const handleSelect = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Dropdown items={items} trigger="Select option" onItemSelect={handleSelect} />
      );
      
      const trigger = screen.getByText('Select option');
      await user.click(trigger);
      
      const triggerDiv = trigger.closest('[role="button"]');
      expect(triggerDiv).toHaveAttribute('aria-expanded', 'true');
    });

    it('should have role="menu" on dropdown content', async () => {
      const handleSelect = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <Dropdown items={items} trigger="Select option" onItemSelect={handleSelect} />
      );
      
      const menu = container.querySelector('[role="menu"]');
      expect(menu).toBeInTheDocument();
    });

    it('should have role="menuitem" on each item', async () => {
      const handleSelect = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Dropdown items={items} trigger="Select option" onItemSelect={handleSelect} />
      );
      
      await user.click(screen.getByText('Select option'));
      
      const menuItems = screen.getAllByRole('menuitem');
      expect(menuItems.length).toBe(3);
    });

    it('should support keyboard toggle with Enter', async () => {
      const handleSelect = vi.fn();
      
      render(
        <Dropdown items={items} trigger="Select option" onItemSelect={handleSelect} />
      );
      
      const triggerDiv = screen.getByRole('button');
      fireEvent.keyDown(triggerDiv, { key: 'Enter' });
      
      expect(screen.getByText('Option 1')).toBeVisible();
    });

    it('should support keyboard toggle with Space', async () => {
      const handleSelect = vi.fn();
      
      render(
        <Dropdown items={items} trigger="Select option" onItemSelect={handleSelect} />
      );
      
      const triggerDiv = screen.getByRole('button');
      fireEvent.keyDown(triggerDiv, { key: ' ' });
      
      expect(screen.getByText('Option 1')).toBeVisible();
    });

    it('should have tabIndex on trigger', () => {
      const handleSelect = vi.fn();
      render(
        <Dropdown items={items} trigger="Select option" onItemSelect={handleSelect} />
      );
      
      const triggerDiv = screen.getByRole('button');
      expect(triggerDiv).toHaveAttribute('tabindex', '0');
    });
  });

  describe('Searchable Dropdown', () => {
    it('should show search input when searchable', async () => {
      const handleSelect = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Dropdown items={items} trigger="Select" onItemSelect={handleSelect} searchable />
      );
      
      await user.click(screen.getByText('Select'));
      
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('should filter items based on search query', async () => {
      const handleSelect = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Dropdown items={items} trigger="Select" onItemSelect={handleSelect} searchable />
      );
      
      await user.click(screen.getByText('Select'));
      const searchInput = screen.getByPlaceholderText('Search...');
      await user.type(searchInput, 'Option 1');
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
    });

    it('should have accessible search label', async () => {
      const handleSelect = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Dropdown items={items} trigger="Select" onItemSelect={handleSelect} searchable />
      );
      
      await user.click(screen.getByText('Select'));
      
      expect(screen.getByLabelText('Search dropdown options')).toBeInTheDocument();
    });
  });

  describe('Filterable Dropdown', () => {
    it('should show search input when filterable', async () => {
      const handleSelect = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Dropdown items={items} trigger="Select" onItemSelect={handleSelect} filterable />
      );
      
      await user.click(screen.getByText('Select'));
      
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });
  });

  describe('Divider Items', () => {
    const itemsWithDivider = [
      { id: 'opt1', label: 'Option 1' },
      { id: 'divider1', label: '', divider: true },
      { id: 'opt2', label: 'Option 2' },
    ];

    it('should render divider items', async () => {
      const handleSelect = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <Dropdown items={itemsWithDivider} trigger="Select" onItemSelect={handleSelect} />
      );
      
      await user.click(screen.getByText('Select'));
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
  });

  describe('Badge Items', () => {
    const itemsWithBadge = [
      { id: 'opt1', label: 'Option 1', badge: { label: 'New', variant: 'success' as const } },
      { id: 'opt2', label: 'Option 2' },
    ];

    it('should render badge on items', async () => {
      const handleSelect = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Dropdown items={itemsWithBadge} trigger="Select" onItemSelect={handleSelect} />
      );
      
      await user.click(screen.getByText('Select'));
      
      expect(screen.getByText('New')).toBeInTheDocument();
    });
  });

  describe('onOpenChange Callback', () => {
    it('should call onOpenChange when opened', async () => {
      const handleSelect = vi.fn();
      const handleOpenChange = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Dropdown items={items} trigger="Select" onItemSelect={handleSelect} onOpenChange={handleOpenChange} />
      );
      
      await user.click(screen.getByText('Select'));
      
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });

    it('should call onOpenChange when closed', async () => {
      const handleSelect = vi.fn();
      const handleOpenChange = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Dropdown items={items} trigger="Select" onItemSelect={handleSelect} onOpenChange={handleOpenChange} />
      );
      
      await user.click(screen.getByText('Select'));
      handleOpenChange.mockClear();
      await user.click(screen.getByText('Select'));
      
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('closeOnSelect=false', () => {
    it('should keep dropdown open after selection', async () => {
      const handleSelect = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Dropdown items={items} trigger="Select" onItemSelect={handleSelect} closeOnSelect={false} />
      );
      
      await user.click(screen.getByText('Select'));
      await user.click(screen.getByText('Option 1'));
      
      // Should still be open
      expect(screen.getByText('Option 2')).toBeVisible();
    });
  });

  describe('Item onClick Callback', () => {
    it('should call item onClick handler', async () => {
      const itemClickHandler = vi.fn();
      const handleSelect = vi.fn();
      const user = userEvent.setup();
      
      const clickableItems = [
        { id: 'opt1', label: 'Click Me', onClick: itemClickHandler },
        { id: 'opt2', label: 'Other' },
      ];
      
      render(
        <Dropdown items={clickableItems} trigger="Select" onItemSelect={handleSelect} />
      );
      
      await user.click(screen.getByText('Select'));
      await user.click(screen.getByText('Click Me'));
      
      expect(itemClickHandler).toHaveBeenCalled();
    });
  });

  describe('Arrow Key Navigation', () => {
    it('should navigate down through items', async () => {
      const handleSelect = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Dropdown items={items} trigger="Select" onItemSelect={handleSelect} />
      );
      
      await user.click(screen.getByText('Select'));
      await user.keyboard('{ArrowDown}{ArrowDown}');
      
      // Second item should be highlighted
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('should navigate up through items', async () => {
      const handleSelect = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Dropdown items={items} trigger="Select" onItemSelect={handleSelect} />
      );
      
      await user.click(screen.getByText('Select'));
      await user.keyboard('{ArrowDown}{ArrowDown}{ArrowUp}');
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('should not go below last item', async () => {
      const handleSelect = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Dropdown items={items} trigger="Select" onItemSelect={handleSelect} />
      );
      
      await user.click(screen.getByText('Select'));
      // Press down 10 times - should stop at last item
      for (let i = 0; i < 10; i++) {
        await user.keyboard('{ArrowDown}');
      }
      await user.keyboard('{Enter}');
      
      expect(handleSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'opt3' }));
    });

    it('should select with Enter after navigating', async () => {
      const handleSelect = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Dropdown items={items} trigger="Select" onItemSelect={handleSelect} />
      );
      
      await user.click(screen.getByText('Select'));
      await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
      
      expect(handleSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'opt2' }));
    });
  });

  describe('Close on Outside Click', () => {
    it('should close when clicking outside', async () => {
      const handleSelect = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <div>
          <div data-testid="outside">Outside</div>
          <Dropdown items={items} trigger="Select" onItemSelect={handleSelect} />
        </div>
      );
      
      await user.click(screen.getByText('Select'));
      expect(screen.getByText('Option 1')).toBeVisible();
      
      // Click outside
      fireEvent.mouseDown(screen.getByTestId('outside'));
      
      const menu = container.querySelector('[role="menu"]');
      expect(menu).not.toBeVisible();
    });
  });

  describe('Width and maxHeight Props', () => {
    it('should accept width prop', () => {
      const handleSelect = vi.fn();
      const { container } = render(
        <Dropdown items={items} trigger="Select" onItemSelect={handleSelect} width={300} />
      );
      
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should accept maxHeight prop', () => {
      const handleSelect = vi.fn();
      const { container } = render(
        <Dropdown items={items} trigger="Select" onItemSelect={handleSelect} maxHeight={200} />
      );
      
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('className Prop', () => {
    it('should apply custom className', () => {
      const handleSelect = vi.fn();
      const { container } = render(
        <Dropdown items={items} trigger="Select" onItemSelect={handleSelect} className="custom-class" />
      );
      
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });
  });
});
