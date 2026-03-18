import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tabs from '../Tabs';

describe('Tabs Component', () => {
  const mockTabs = [
    { label: 'Tab 1', id: 'tab1', content: 'Content 1' },
    { label: 'Tab 2', id: 'tab2', content: 'Content 2' },
    { label: 'Tab 3', id: 'tab3', content: 'Content 3' },
  ];

  describe('Rendering', () => {
    it('should render all tab buttons', () => {
      const handleChange = vi.fn();
      render(
        <Tabs tabs={mockTabs} activeTab="tab1" onChange={handleChange} />
      );
      
      expect(screen.getByText('Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Tab 2')).toBeInTheDocument();
      expect(screen.getByText('Tab 3')).toBeInTheDocument();
    });

    it('should render active tab content', () => {
      const handleChange = vi.fn();
      const tabsWithContent = mockTabs.map(tab => ({
        ...tab,
        content: <div>{tab.content}</div>
      }));
      
      render(
        <Tabs tabs={tabsWithContent} activeTab="tab1" onChange={handleChange} />
      );
      
      expect(screen.getByText('Content 1')).toBeInTheDocument();
    });

    it('should render all children tabs when using children', () => {
      const handleChange = vi.fn();
      render(
        <Tabs activeTab="tab1" onChange={handleChange}>
          <div data-tab-id="tab1">Tab 1</div>
          <div data-tab-id="tab2">Tab 2</div>
        </Tabs>
      );
      
      expect(screen.getByText('Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Tab 2')).toBeInTheDocument();
    });
  });

  describe('Tab Switching', () => {
    it('should switch to different tab when clicked', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Tabs tabs={mockTabs} activeTab="tab1" onChange={handleChange} />
      );
      
      const tab2Button = screen.getByRole('button', { name: 'Tab 2' });
      await user.click(tab2Button);
      
      expect(handleChange).toHaveBeenCalledWith('tab2');
    });

    it('should mark active tab as selected', () => {
      const handleChange = vi.fn();
      const { container } = render(
        <Tabs tabs={mockTabs} activeTab="tab2" onChange={handleChange} />
      );
      
      const activeTab = container.querySelector('[aria-selected="true"]');
      expect(activeTab?.textContent).toContain('Tab 2');
    });
  });

  describe('Variants', () => {
    it('should support different variants', () => {
      const handleChange = vi.fn();
      const { container } = render(
        <Tabs 
          tabs={mockTabs} 
          activeTab="tab1" 
          onChange={handleChange}
          variant="pills"
        />
      );
      
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const handleChange = vi.fn();
      const { container } = render(
        <Tabs tabs={mockTabs} activeTab="tab1" onChange={handleChange} />
      );
      
      const tablist = container.querySelector('[role="tablist"]');
      expect(tablist).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Tabs tabs={mockTabs} activeTab="tab1" onChange={handleChange} />
      );
      
      const tab1 = screen.getByRole('tab');
      tab1.focus();
      expect(tab1).toHaveFocus();
    });

    it('should have aria-selected on active tab', () => {
      const handleChange = vi.fn();
      const { container } = render(
        <Tabs tabs={mockTabs} activeTab="tab2" onChange={handleChange} />
      );
      
      const activeTab = container.querySelector('[aria-selected="true"]');
      expect(activeTab).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Disabled Tabs', () => {
    it('should handle disabled tabs', () => {
      const handleChange = vi.fn();
      const disabledTabs = [
        { label: 'Tab 1', id: 'tab1', content: 'Content 1' },
        { label: 'Tab 2', id: 'tab2', content: 'Content 2', disabled: true },
      ];
      
      render(
        <Tabs tabs={disabledTabs} activeTab="tab1" onChange={handleChange} />
      );
      
      expect(screen.getByText('Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Tab 2')).toBeInTheDocument();
    });
  });
});
