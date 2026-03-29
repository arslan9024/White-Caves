import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatbotTab from '../ChatbotTab';
import type { ChatbotTabProps } from '../types';

describe('ChatbotTab Integration', () => {
  const mockProps: ChatbotTabProps = {
    data: {
      chatbotStats: {
        totalConversations: 1243,
        successfulLeads: 156,
        avgResponseTime: 2.3,
        satisfactionRate: 94.5,
        activeChats: 5,
        messagesProcessed: 8920
      }
    } as ChatbotTabProps['data'],
    loading: false,
    onAction: vi.fn()
  };

  describe('Rendering', () => {
    it('should render chatbot tab', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText('AI Chatbot Management')).toBeInTheDocument();
    });

    it('should display stat cards', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText('Total Conversations')).toBeInTheDocument();
      expect(screen.getByText('Leads Generated')).toBeInTheDocument();
    });

    it('should show section headers', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText('Intent Recognition Performance')).toBeInTheDocument();
      expect(screen.getByText('Recent Conversations')).toBeInTheDocument();
    });

    it('should display quick actions section', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    });
  });

  describe('Bot Statistics', () => {
    it('should display conversation counts', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText('1,243')).toBeInTheDocument();
    });

    it('should show lead generation count', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText('156')).toBeInTheDocument();
    });

    it('should display average response time', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText('2.3s')).toBeInTheDocument();
    });

    it('should show satisfaction rate', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText('94.5%')).toBeInTheDocument();
    });

    it('should display active chats count', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should show messages processed count', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText('8,920')).toBeInTheDocument();
    });
  });

  describe('Stat Labels', () => {
    it('should display all stat labels', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText('Total Conversations')).toBeInTheDocument();
      expect(screen.getByText('Leads Generated')).toBeInTheDocument();
      expect(screen.getByText('Avg Response Time')).toBeInTheDocument();
    });

    it('should show satisfaction and active chat labels', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText('Satisfaction Rate')).toBeInTheDocument();
      expect(screen.getByText('Active Chats')).toBeInTheDocument();
      expect(screen.getByText('Messages Processed')).toBeInTheDocument();
    });

    it('should render stat grid with 6 cards', () => {
      const { container } = render(<ChatbotTab {...mockProps} />);
      
      const statCards = container.querySelectorAll('.chatbot-stat');
      expect(statCards.length).toBe(6);
    });
  });

  describe('Default Stats', () => {
    it('should show zero values when no chatbot stats provided', () => {
      const emptyDataProps: ChatbotTabProps = {
        data: {} as ChatbotTabProps['data'],
        loading: false,
        onAction: vi.fn()
      };
      
      render(<ChatbotTab {...emptyDataProps} />);
      
      expect(screen.getByText('0s')).toBeInTheDocument();
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('should render stat icons', () => {
      render(<ChatbotTab {...mockProps} />);
      
      // Component uses emoji icons
      expect(screen.getByText('💬')).toBeInTheDocument();
      expect(screen.getByText('🎯')).toBeInTheDocument();
      expect(screen.getByText('⚡')).toBeInTheDocument();
    });

    it('should highlight live active chats card', () => {
      const { container } = render(<ChatbotTab {...mockProps} />);
      
      const liveCard = container.querySelector('.chatbot-stat.live');
      expect(liveCard).toBeInTheDocument();
    });

    it('should display zero conversations when no data', () => {
      const nullDataProps: ChatbotTabProps = {
        data: null as unknown as ChatbotTabProps['data'],
        loading: false,
        onAction: vi.fn()
      };
      
      render(<ChatbotTab {...nullDataProps} />);
      
      expect(screen.getByText('0s')).toBeInTheDocument();
    });
  });

  describe('Quick Actions', () => {
    it('should have action buttons', () => {
      const { container } = render(<ChatbotTab {...mockProps} />);
      
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBe(6); // 2 header + 4 action cards
    });

    it('should display training data action', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText('Training Data')).toBeInTheDocument();
      expect(screen.getByText('View and edit training examples')).toBeInTheDocument();
    });

    it('should display response templates action', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText('Response Templates')).toBeInTheDocument();
    });

    it('should display conversation logs action', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText('Conversation Logs')).toBeInTheDocument();
    });

    it('should display rules engine action', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText('Rules Engine')).toBeInTheDocument();
    });
  });

  describe('Header Actions', () => {
    it('should have analytics button', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText('Analytics')).toBeInTheDocument();
    });

    it('should have training center button', () => {
      render(<ChatbotTab {...mockProps} />);
      
      expect(screen.getByText('Training Center')).toBeInTheDocument();
    });

    it('should call onAction for analytics', async () => {
      const user = userEvent.setup();
      const onActionMock = vi.fn();
      const propsWithAction: ChatbotTabProps = {
        ...mockProps,
        onAction: onActionMock
      };
      
      render(<ChatbotTab {...propsWithAction} />);
      
      const analyticsBtn = screen.getByText('Analytics').closest('button')!;
      await user.click(analyticsBtn);
      expect(onActionMock).toHaveBeenCalledWith('viewAnalytics');
    });

    it('should call onAction for training', async () => {
      const user = userEvent.setup();
      const onActionMock = vi.fn();
      const propsWithAction: ChatbotTabProps = {
        ...mockProps,
        onAction: onActionMock
      };
      
      render(<ChatbotTab {...propsWithAction} />);
      
      const trainingBtn = screen.getByText('Training Center').closest('button')!;
      await user.click(trainingBtn);
      expect(onActionMock).toHaveBeenCalledWith('trainChatbot');
    });
  });

  describe('Accessibility', () => {
    it('should have accessible buttons', () => {
      render(<ChatbotTab {...mockProps} />);
      
      const buttons = screen.queryAllByRole('button');
      expect(buttons.length).toBe(6);
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
    it('should handle empty data', () => {
      const emptyProps: ChatbotTabProps = {
        data: {} as ChatbotTabProps['data'],
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
      
      expect(screen.getByText('AI Chatbot Management')).toBeInTheDocument();
    });

    it('should render with null data gracefully', () => {
      const nullDataProps: ChatbotTabProps = {
        data: null as unknown as ChatbotTabProps['data'],
        loading: false,
        onAction: vi.fn()
      };
      
      const { container } = render(<ChatbotTab {...nullDataProps} />);
      
      expect(container).toBeInTheDocument();
    });
  });
});
