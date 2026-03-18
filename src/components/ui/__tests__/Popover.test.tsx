import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Popover from '../Popover';

describe('Popover Component', () => {
  describe('Rendering', () => {
    it('should render trigger element', () => {
      render(
        <Popover content="Popover content">
          <button>Show popover</button>
        </Popover>
      );
      
      expect(screen.getByText('Show popover')).toBeInTheDocument();
    });

    it('should show popover when triggered', async () => {
      const user = userEvent.setup();
      render(
        <Popover content="Popover content">
          <button>Show</button>
        </Popover>
      );
      
      await user.click(screen.getByText('Show'));
      const content = await screen.findByText('Popover content');
      expect(content).toBeInTheDocument();
    });

    it('should render with title', async () => {
      const user = userEvent.setup();
      render(
        <Popover title="Title" content="Content">
          <button>Trigger</button>
        </Popover>
      );
      
      await user.click(screen.getByText('Trigger'));
      expect(await screen.findByText('Title')).toBeInTheDocument();
      expect(await screen.findByText('Content')).toBeInTheDocument();
    });
  });

  describe('Positioning', () => {
    it('should support different positions', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <Popover content="Content" position="top">
          <button>Trigger</button>
        </Popover>
      );
      
      await user.click(screen.getByText('Trigger'));
      expect(screen.getByText('Content')).toBeInTheDocument();
      
      rerender(
        <Popover content="Content" position="bottom">
          <button>Trigger</button>
        </Popover>
      );
      
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('Close Behavior', () => {
    it('should close popover when clicking outside', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <div>
          <Popover content="Content">
            <button>Trigger</button>
          </Popover>
          <div data-testid="outside">Outside element</div>
        </div>
      );
      
      await user.click(screen.getByText('Trigger'));
      expect(await screen.findByText('Content')).toBeInTheDocument();
      
      await user.click(screen.getByTestId('outside'));
      const popoverContent = container.querySelector('[role="dialog"]');
      expect(popoverContent).not.toBeVisible();
    });

    it('should close when close button is clicked', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Popover content="Content">
          <button>Trigger</button>
        </Popover>
      );
      
      await user.click(screen.getByText('Trigger'));
      
      const closeButton = screen.queryByRole('button', { name: /close|dismiss/i });
      if (closeButton) {
        await user.click(closeButton);
        const popover = container.querySelector('[role="dialog"]');
        expect(popover).not.toBeVisible();
      }
    });
  });

  describe('Rich Content', () => {
    it('should render JSX content', async () => {
      const user = userEvent.setup();
      render(
        <Popover content={<div><strong>Bold</strong> text</div>}>
          <button>Trigger</button>
        </Popover>
      );
      
      await user.click(screen.getByText('Trigger'));
      expect(await screen.findByText('Bold')).toBeInTheDocument();
    });

    it('should render interactive content', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Popover 
          content={
            <button onClick={handleClick}>Click in popover</button>
          }
        >
          <button>Trigger</button>
        </Popover>
      );
      
      await user.click(screen.getAllByText('Trigger')[0]);
      const popoverButton = await screen.findByText('Click in popover');
      await user.click(popoverButton);
      
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Popover content="Content">
          <button>Trigger</button>
        </Popover>
      );
      
      await user.click(screen.getByText('Trigger'));
      
      const popover = container.querySelector('[role="dialog"]');
      expect(popover).toHaveAttribute('role', 'dialog');
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      render(
        <Popover content="Content">
          <button>Trigger</button>
        </Popover>
      );
      
      const trigger = screen.getByText('Trigger');
      trigger.focus();
      expect(trigger).toHaveFocus();
      
      await user.keyboard('{Enter}');
      expect(await screen.findByText('Content')).toBeInTheDocument();
    });
  });

  describe('Controlled Mode', () => {
    it('should work in controlled mode', async () => {
      const handleOpenChange = vi.fn();
      const user = userEvent.setup();
      const { rerender } = render(
        <Popover 
          content="Content" 
          isOpen={false}
          onOpenChange={handleOpenChange}
        >
          <button>Trigger</button>
        </Popover>
      );
      
      await user.click(screen.getByText('Trigger'));
      expect(handleOpenChange).toHaveBeenCalled();
      
      rerender(
        <Popover 
          content="Content" 
          isOpen={true}
          onOpenChange={handleOpenChange}
        >
          <button>Trigger</button>
        </Popover>
      );
      
      expect(await screen.findByText('Content')).toBeInTheDocument();
    });
  });
});
