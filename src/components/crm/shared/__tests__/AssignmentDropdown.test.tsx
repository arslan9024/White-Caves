import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock lucide-react
vi.mock('lucide-react', () => ({
  ChevronDown: (props: any) => <svg data-testid="icon-chevron" {...props} />,
  Check: (props: any) => <svg data-testid="icon-check" {...props} />,
  Search: (props: any) => <svg data-testid="icon-search" {...props} />,
  User: (props: any) => <svg data-testid="icon-user" {...props} />,
  X: (props: any) => <svg data-testid="icon-x" {...props} />,
}));

// Mock CSS import
vi.mock('../SharedComponents.css', () => ({}));

import AssignmentDropdown from '../AssignmentDropdown';

const mockAgents = [
  { id: 'a1', name: 'Alice Johnson', phone: '+971-555-1111', status: 'active' },
  { id: 'a2', name: 'Bob Smith', phone: '+971-555-2222', status: 'busy' },
  { id: 'a3', name: 'Charlie Davis', phone: '+971-555-3333', status: 'offline' },
];

describe('AssignmentDropdown', () => {
  describe('Closed State', () => {
    it('should render placeholder when no agent selected', () => {
      render(<AssignmentDropdown agents={mockAgents} onSelect={vi.fn()} />);
      expect(screen.getByText('Select Agent')).toBeInTheDocument();
    });

    it('should render custom placeholder', () => {
      render(<AssignmentDropdown agents={mockAgents} onSelect={vi.fn()} placeholder="Assign to..." />);
      expect(screen.getByText('Assign to...')).toBeInTheDocument();
    });

    it('should show selected agent name', () => {
      render(<AssignmentDropdown agents={mockAgents} selectedAgentId="a1" onSelect={vi.fn()} />);
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    });

    it('should not show dropdown menu when closed', () => {
      render(<AssignmentDropdown agents={mockAgents} onSelect={vi.fn()} />);
      expect(screen.queryByPlaceholderText('Search agents...')).not.toBeInTheDocument();
    });
  });

  describe('Open/Close Toggle', () => {
    it('should open dropdown on trigger click', () => {
      render(<AssignmentDropdown agents={mockAgents} onSelect={vi.fn()} />);
      fireEvent.click(screen.getByText('Select Agent'));
      expect(screen.getByPlaceholderText('Search agents...')).toBeInTheDocument();
    });

    it('should show all agents when opened', () => {
      render(<AssignmentDropdown agents={mockAgents} onSelect={vi.fn()} />);
      fireEvent.click(screen.getByText('Select Agent'));
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('Bob Smith')).toBeInTheDocument();
      expect(screen.getByText('Charlie Davis')).toBeInTheDocument();
    });

    it('should close on second click (toggle)', () => {
      render(<AssignmentDropdown agents={mockAgents} onSelect={vi.fn()} />);
      const trigger = screen.getByText('Select Agent');
      fireEvent.click(trigger);
      expect(screen.getByPlaceholderText('Search agents...')).toBeInTheDocument();
      fireEvent.click(trigger);
      expect(screen.queryByPlaceholderText('Search agents...')).not.toBeInTheDocument();
    });
  });

  describe('Agent Selection', () => {
    it('should call onSelect with agent id', () => {
      const onSelect = vi.fn();
      render(<AssignmentDropdown agents={mockAgents} onSelect={onSelect} />);
      fireEvent.click(screen.getByText('Select Agent'));
      fireEvent.click(screen.getByText('Alice Johnson'));
      expect(onSelect).toHaveBeenCalledWith('a1');
    });

    it('should close dropdown after selection', () => {
      render(<AssignmentDropdown agents={mockAgents} onSelect={vi.fn()} />);
      fireEvent.click(screen.getByText('Select Agent'));
      fireEvent.click(screen.getByText('Bob Smith'));
      expect(screen.queryByPlaceholderText('Search agents...')).not.toBeInTheDocument();
    });

    it('should show check icon for selected agent', () => {
      render(<AssignmentDropdown agents={mockAgents} selectedAgentId="a1" onSelect={vi.fn()} />);
      fireEvent.click(screen.getByText('Alice Johnson'));
      expect(screen.getByTestId('icon-check')).toBeInTheDocument();
    });
  });

  describe('Clear Selection', () => {
    it('should show clear button when agent selected', () => {
      render(<AssignmentDropdown agents={mockAgents} selectedAgentId="a1" onSelect={vi.fn()} />);
      expect(screen.getByTestId('icon-x')).toBeInTheDocument();
    });

    it('should call onSelect(null) on clear', () => {
      const onSelect = vi.fn();
      render(<AssignmentDropdown agents={mockAgents} selectedAgentId="a1" onSelect={onSelect} />);
      const clearBtn = screen.getByTestId('icon-x').closest('button');
      fireEvent.click(clearBtn!);
      expect(onSelect).toHaveBeenCalledWith(null);
    });
  });

  describe('Search', () => {
    it('should filter agents by name', () => {
      render(<AssignmentDropdown agents={mockAgents} onSelect={vi.fn()} />);
      fireEvent.click(screen.getByText('Select Agent'));
      const searchInput = screen.getByPlaceholderText('Search agents...');
      fireEvent.change(searchInput, { target: { value: 'Alice' } });
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.queryByText('Bob Smith')).not.toBeInTheDocument();
    });

    it('should filter agents by phone', () => {
      render(<AssignmentDropdown agents={mockAgents} onSelect={vi.fn()} />);
      fireEvent.click(screen.getByText('Select Agent'));
      const searchInput = screen.getByPlaceholderText('Search agents...');
      fireEvent.change(searchInput, { target: { value: '2222' } });
      expect(screen.getByText('Bob Smith')).toBeInTheDocument();
      expect(screen.queryByText('Alice Johnson')).not.toBeInTheDocument();
    });

    it('should show no-results when no agents match', () => {
      render(<AssignmentDropdown agents={mockAgents} onSelect={vi.fn()} />);
      fireEvent.click(screen.getByText('Select Agent'));
      const searchInput = screen.getByPlaceholderText('Search agents...');
      fireEvent.change(searchInput, { target: { value: 'zzzzz' } });
      expect(screen.getByText('No agents found')).toBeInTheDocument();
    });

    it('should hide search when searchable is false', () => {
      render(<AssignmentDropdown agents={mockAgents} onSelect={vi.fn()} searchable={false} />);
      fireEvent.click(screen.getByText('Select Agent'));
      expect(screen.queryByPlaceholderText('Search agents...')).not.toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('should not open when disabled', () => {
      render(<AssignmentDropdown agents={mockAgents} onSelect={vi.fn()} disabled={true} />);
      fireEvent.click(screen.getByText('Select Agent'));
      expect(screen.queryByPlaceholderText('Search agents...')).not.toBeInTheDocument();
    });

    it('should have disabled class', () => {
      const { container } = render(<AssignmentDropdown agents={mockAgents} onSelect={vi.fn()} disabled={true} />);
      expect(container.querySelector('.disabled')).toBeInTheDocument();
    });
  });

  describe('Phone display', () => {
    it('should show agent phone numbers in dropdown', () => {
      render(<AssignmentDropdown agents={mockAgents} onSelect={vi.fn()} />);
      fireEvent.click(screen.getByText('Select Agent'));
      expect(screen.getByText('+971-555-1111')).toBeInTheDocument();
    });
  });

  describe('Click Outside', () => {
    it('should close on click outside', () => {
      render(
        <div>
          <span data-testid="outside">Outside</span>
          <AssignmentDropdown agents={mockAgents} onSelect={vi.fn()} />
        </div>
      );
      fireEvent.click(screen.getByText('Select Agent'));
      expect(screen.getByPlaceholderText('Search agents...')).toBeInTheDocument();
      fireEvent.mouseDown(screen.getByTestId('outside'));
      expect(screen.queryByPlaceholderText('Search agents...')).not.toBeInTheDocument();
    });
  });

  describe('Empty agents', () => {
    it('should show no-results when agents list is empty', () => {
      render(<AssignmentDropdown agents={[]} onSelect={vi.fn()} />);
      fireEvent.click(screen.getByText('Select Agent'));
      expect(screen.getByText('No agents found')).toBeInTheDocument();
    });
  });
});
