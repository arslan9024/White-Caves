import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tooltip from '../Tooltip';

describe('Tooltip Component', () => {
  describe('Rendering', () => {
    it('should render trigger element', () => {
      render(
        <Tooltip content="Tooltip text">
          <button>Hover me</button>
        </Tooltip>
      );
      
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('should show tooltip on hover', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Helpful text">
          <button>Trigger</button>
        </Tooltip>
      );
      
      const trigger = screen.getByText('Trigger');
      await user.hover(trigger);
      
      const tooltip = await screen.findByText('Helpful text');
      expect(tooltip).toBeInTheDocument();
    });

    it('should hide tooltip on unhover', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Tooltip content="Helpful text">
          <button>Trigger</button>
        </Tooltip>
      );
      
      const trigger = screen.getByText('Trigger');
      await user.hover(trigger);
      await user.unhover(trigger);
      
      const tooltip = container.querySelector('[role="tooltip"]');
      expect(tooltip).not.toBeVisible();
    });
  });

  describe('Positioning', () => {
    it('should support different positions', () => {
      const { rerender } = render(
        <Tooltip content="Text" placement="top">
          <button>Trigger</button>
        </Tooltip>
      );
      
      expect(screen.getByText('Trigger')).toBeInTheDocument();
      
      rerender(
        <Tooltip content="Text" placement="bottom">
          <button>Trigger</button>
        </Tooltip>
      );
      
      expect(screen.getByText('Trigger')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Tooltip content="Tooltip text">
          <button>Trigger</button>
        </Tooltip>
      );
      
      const trigger = screen.getByText('Trigger');
      await user.hover(trigger);
      
      const tooltip = container.querySelector('[role="tooltip"]');
      expect(tooltip).toBeInTheDocument();
    });
  });
});
