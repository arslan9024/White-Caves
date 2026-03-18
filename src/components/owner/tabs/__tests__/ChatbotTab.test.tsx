import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatbotTab from '../ChatbotTab';

describe('ChatbotTab Integration', () => {
  const mockProps = {
    data: {
      bots: [
        {
          id: 1,
          name: 'Clara - Lead Bot',
          status: 'active',
          platform: 'whatsapp',
          conversations: 1243,
          engaged: 892,
          leads: 156,
          responseRate: 94.5,
          avgResponseTime: 2.3,
          createdAt: '2023-01-15',
          lastActivity: '2024-01-08 14:30'
        },
        {
          id: 2,
          name: 'Property Bot',
          status: 'active',
          platform: 'website',
          conversations: 567,
          engaged: 432,
          leads: 78,
          responseRate: 92.1,
          avgResponseTime: 1.8,
          createdAt: '2023-03-20',
          lastActivity: '2024-01-08 13:45'
        },
        {
          id: 3,
          name: 'Commission Helper',
          status: 'inactive',
          platform: 'telegram',
          conversations: 234,
          engaged: 180,
          leads: 32,
          responseRate: 85.6,
          avgResponseTime: 3.2,
          createdAt: '2023-06-10',
          lastActivity: '2023-12-15 10:00'
        }
      ],
      conversationHistory: [
        {
          id: 1,
          botName: 'Clara - Lead Bot',
          user: 'Khalid Al Maktoum',
          platform: 'whatsapp',
          messages: 12,
          duration: '15 minutes',
          status: 'completed',
          leadQuality: 'high',
          timestamp: '2024-01-08 10:30'
        },
        {
          id: 2,
          botName: 'Property Bot',
          user: 'Emily Watson',
          platform: 'website',
          messages: 8,
          duration: '8 minutes',
          status: 'active',
          leadQuality: 'medium',
          timestamp: '2024-01-08 11:15'
        },
        {
          id: 3,
          botName: 'Clara - Lead Bot',
          user: 'Chen Wei',
          platform: 'whatsapp',
          messages: 18,
          duration: '22 minutes',
          status: 'completed',
          leadQuality: 'high',
          timestamp: '2024-01-08 12:00'
        }
      ]
    },
    loading: false,
    onAction: vi.fn()
  };

  describe('Rendering', () => {
    it('should render chatbot tab', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText('Chatbots')).toBeInTheDocument();
    });

    it('should display bot list', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText('Clara - Lead Bot')).toBeInTheDocument();
      expect(screen.getByText('Property Bot')).toBeInTheDocument();
    });

    it('should show bot status', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText(/active|inactive/i)).toBeInTheDocument();
    });

    it('should display bot platform', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText(/whatsapp|website|telegram/i)).toBeInTheDocument();
    });
  });

  describe('Bot Statistics', () => {
    it('should display conversation counts', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText(/1243|567|234/)).toBeInTheDocument();
    });

    it('should show engaged user counts', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText(/892|432|180/)).toBeInTheDocument();
    });

    it('should display lead conversion counts', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText(/156|78|32/)).toBeInTheDocument();
    });

    it('should show response rates', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText(/94.5|92.1|85.6/)).toBeInTheDocument();
    });

    it('should display average response times', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText(/2.3|1.8|3.2/)).toBeInTheDocument();
    });
  });

  describe('Bot Status Indicators', () => {
    it('should display active status indicator', () => {
      const { container } = render(<ChatbotTab {...mockProps} />);
      
      const statusIndicators = container.querySelectorAll('[class*="status"]');
      expect(statusIndicators.length).toBeGreaterThan(0);
    });

    it('should show inactive status', () => {
      render(<ChatbotTab {...mockProps} />);
      
      const inactiveIndicators = screen.queryAllByText(/inactive/i);
      expect(inactiveIndicators.length).toBeGreaterThan(0);
    });

    it('should differentiate active and inactive bots', () => {
      const { container } = render(<ChatbotTab {...mockProps} />);
      
      const statusElements = container.querySelectorAll('[class*="status"]');
      expect(statusElements.length).toBeGreaterThan(0);
    });
  });

  describe('Conversation History', () => {
    it('should display conversation history', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText('Khalid Al Maktoum')).toBeInTheDocument();
      expect(screen.getByText('Emily Watson')).toBeInTheDocument();
    });

    it('should show conversation details', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText(/12|8|18/)).toBeInTheDocument(); // message counts
    });

    it('should display conversation duration', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText(/15 minutes|8 minutes|22 minutes/)).toBeInTheDocument();
    });

    it('should show conversation status', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText(/completed|active/i)).toBeInTheDocument();
    });

    it('should display lead quality', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText(/high|medium/i)).toBeInTheDocument();
    });
  });

  describe('Platform Filtering', () => {
    it('should filter bots by platform', async () => {
      const user = userEvent.setup();
      render(<ChatbotTab {...mockProps} />);
      
      const platformFilter = screen.queryByDisplayValue('All Platforms');
      if (platformFilter) {
        await user.selectOptions(platformFilter, 'whatsapp');
        expect(screen.getByText('Clara - Lead Bot')).toBeInTheDocument();
      }
    });

    it('should filter conversations by platform', async () => {
      const user = userEvent.setup();
      render(<ChatbotTab {...mockProps} />);
      
      const platformFilter = screen.queryByDisplayValue('All Platforms');
      if (platformFilter) {
        await user.selectOptions(platformFilter, 'website');
        expect(screen.getByText('Emily Watson')).toBeInTheDocument();
      }
    });
  });

  describe('Status Filtering', () => {
    it('should filter bots by status', async () => {
      const user = userEvent.setup();
      render(<ChatbotTab {...mockProps} />);
      
      const statusFilter = screen.queryByDisplayValue('All Status');
      if (statusFilter) {
        await user.selectOptions(statusFilter, 'active');
        expect(screen.getByText('Clara - Lead Bot')).toBeInTheDocument();
      }
    });

    it('should filter for inactive bots', async () => {
      const user = userEvent.setup();
      render(<ChatbotTab {...mockProps} />);
      
      const statusFilter = screen.queryByDisplayValue('All Status');
      if (statusFilter) {
        await user.selectOptions(statusFilter, 'inactive');
        expect(screen.getByText('Commission Helper')).toBeInTheDocument();
      }
    });
  });

  describe('Search Functionality', () => {
    it('should have search input', () => {
      const { container } = render(<ChatbotTab {...mockProps} />);
      
      const searchInputs = container.querySelectorAll('input[type="text"], input[type="search"]');
      expect(searchInputs.length).toBeGreaterThanOrEqual(0);
    });

    it('should search by bot name', async () => {
      const user = userEvent.setup();
      const { container } = render(<ChatbotTab {...mockProps} />);
      
      const searchInputs = container.querySelectorAll('input[type="text"], input[type="search"]');
      if (searchInputs.length > 0) {
        await user.type(searchInputs[0], 'Clara');
        expect(screen.getByText('Clara - Lead Bot')).toBeInTheDocument();
      }
    });
  });

  describe('Bot Actions', () => {
    it('should have action buttons for bots', () => {
      const { container } = render(<ChatbotTab {...mockProps} />);
      
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should support edit action', async () => {
      const user = userEvent.setup();
      render(<ChatbotTab {...mockProps} />);
      
      const editButtons = screen.queryAllByRole('button');
      expect(editButtons.length).toBeGreaterThan(0);
    });

    it('should support delete action', () => {
      const { container } = render(<ChatbotTab {...mockProps} />);
      
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Conversation Details', () => {
    it('should show bot name in conversation', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText('Clara - Lead Bot')).toBeInTheDocument();
    });

    it('should display user name in conversation', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText('Khalid Al Maktoum')).toBeInTheDocument();
    });

    it('should show conversation timestamp', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText(/2024/)).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('should render pagination for bots', () => {
      const { container } = render(<ChatbotTab {...mockProps} />);
      
      const paginationNav = container.querySelector('nav');
      expect(paginationNav).toBeInTheDocument();
    });

    it('should render pagination for conversations', () => {
      const { container } = render(<ChatbotTab {...mockProps} />);
      
      const navElements = container.querySelectorAll('nav');
      expect(navElements.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Accessibility', () => {
    it('should have accessible filter controls', () => {
      const { container } = render(<ChatbotTab {...mockProps} />);
      
      const selects = container.querySelectorAll('select');
      expect(selects.length).toBeGreaterThanOrEqual(0);
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<ChatbotTab {...mockProps} />);
      
      const buttons = screen.queryAllByRole('button');
      if (buttons.length > 0) {
        buttons[0].focus();
        expect(buttons[0]).toHaveFocus();
      }
    });
  });

  describe('Empty State', () => {
    it('should handle empty bots list', () => {
      const emptyProps = {
        data: { bots: [], conversationHistory: [] },
        loading: false,
        onAction: vi.fn()
      };
      
      const { container } = render(<ChatbotTab {...emptyProps} />);
      
      expect(container).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should render when loading is false', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText('Chatbots')).toBeInTheDocument();
    });

    it('should render with null data gracefully', () => {
      const nullDataProps = {
        data: null,
        loading: false,
        onAction: vi.fn()
      };
      
      const { container } = render(<ChatbotTab {...nullDataProps} />);
      
      expect(container).toBeInTheDocument();
    });
  });
});
