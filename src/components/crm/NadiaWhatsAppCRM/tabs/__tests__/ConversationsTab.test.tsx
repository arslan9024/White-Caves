import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock scrollIntoView (not supported in jsdom)
beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

// Mock lucide-react
vi.mock('lucide-react', () => ({
  MessageCircle: (props: any) => <svg data-testid="icon-message-circle" {...props} />,
  Send: (props: any) => <svg data-testid="icon-send" {...props} />,
  Paperclip: (props: any) => <svg data-testid="icon-paperclip" {...props} />,
  Smile: (props: any) => <svg data-testid="icon-smile" {...props} />,
  Search: (props: any) => <svg data-testid="icon-search" {...props} />,
  Filter: (props: any) => <svg data-testid="icon-filter" {...props} />,
  Plus: (props: any) => <svg data-testid="icon-plus" {...props} />,
}));

import { ConversationsTab } from '../ConversationsTab';

const mockConversation = (overrides = {}) => ({
  id: 'conv-1',
  contact: {
    avatar: 'https://example.com/avatar1.jpg',
    name: 'John Smith',
    status: 'online',
  },
  time: '10:30 AM',
  lastMessage: 'Hello, I am interested in the property.',
  unread: 2,
  priority: 'hot',
  tags: ['VIP', 'Buyer'],
  messages: [
    { id: 'msg-1', text: 'Hi there!', sender: 'John', time: '10:00 AM', type: 'received' as const, status: 'read' as const },
    { id: 'msg-2', text: 'How can I help?', sender: 'Agent', time: '10:05 AM', type: 'sent' as const, status: 'delivered' as const },
  ],
  ...overrides,
});

const createMockData = (overrides = {}) => ({
  filteredConversations: [mockConversation()],
  selectedConversation: null as any,
  setSelectedConversation: vi.fn(),
  messageInput: '',
  setMessageInput: vi.fn(),
  searchQuery: '',
  setSearchQuery: vi.fn(),
  filterPriority: 'all',
  setFilterPriority: vi.fn(),
  handleSendMessage: vi.fn(),
  getPriorityColor: vi.fn((priority: string) => {
    const colors: Record<string, string> = { hot: '#EF4444', warm: '#F59E0B', cold: '#3B82F6' };
    return colors[priority] || '#6B7280';
  }),
  ...overrides,
});

describe('ConversationsTab', () => {
  describe('Conversation List', () => {
    it('should render conversation list with contact info', () => {
      const data = createMockData();
      render(<ConversationsTab data={data} />);

      expect(screen.getByText('John Smith')).toBeInTheDocument();
      expect(screen.getByText('10:30 AM')).toBeInTheDocument();
      expect(screen.getByText('Hello, I am interested in the property.')).toBeInTheDocument();
    });

    it('should render unread badge when unread > 0', () => {
      const data = createMockData();
      render(<ConversationsTab data={data} />);

      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should not render unread badge when unread is 0', () => {
      const conv = mockConversation({ unread: 0 });
      const data = createMockData({ filteredConversations: [conv] });
      render(<ConversationsTab data={data} />);

      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    it('should render priority badge', () => {
      const data = createMockData();
      render(<ConversationsTab data={data} />);

      expect(screen.getByText('hot')).toBeInTheDocument();
    });

    it('should render tags', () => {
      const data = createMockData();
      render(<ConversationsTab data={data} />);

      expect(screen.getByText('VIP')).toBeInTheDocument();
      expect(screen.getByText('Buyer')).toBeInTheDocument();
    });

    it('should handle conversations with no tags (null-safe)', () => {
      const conv = mockConversation({ tags: undefined });
      const data = createMockData({ filteredConversations: [conv] });
      render(<ConversationsTab data={data} />);

      expect(screen.getByText('John Smith')).toBeInTheDocument();
    });

    it('should call setSelectedConversation on click', () => {
      const data = createMockData();
      render(<ConversationsTab data={data} />);

      fireEvent.click(screen.getByText('John Smith'));
      expect(data.setSelectedConversation).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'conv-1' })
      );
    });

    it('should show selected state for active conversation', () => {
      const conv = mockConversation();
      const data = createMockData({
        filteredConversations: [conv],
        selectedConversation: conv,
      });
      const { container } = render(<ConversationsTab data={data} />);

      const selectedItem = container.querySelector('.conversation-item.selected');
      expect(selectedItem).toBeInTheDocument();
    });
  });

  describe('Search', () => {
    it('should render search input', () => {
      const data = createMockData();
      render(<ConversationsTab data={data} />);

      expect(screen.getByPlaceholderText('Search conversations...')).toBeInTheDocument();
    });

    it('should call setSearchQuery on input change', () => {
      const data = createMockData();
      render(<ConversationsTab data={data} />);

      const input = screen.getByPlaceholderText('Search conversations...');
      fireEvent.change(input, { target: { value: 'test' } });
      expect(data.setSearchQuery).toHaveBeenCalledWith('test');
    });
  });

  describe('Filter Buttons', () => {
    it('should render all filter buttons', () => {
      const data = createMockData();
      render(<ConversationsTab data={data} />);

      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Hot')).toBeInTheDocument();
      expect(screen.getByText('Warm')).toBeInTheDocument();
      expect(screen.getByText('Cold')).toBeInTheDocument();
    });

    it('should call setFilterPriority when filter button clicked', () => {
      const data = createMockData();
      render(<ConversationsTab data={data} />);

      fireEvent.click(screen.getByText('Hot'));
      expect(data.setFilterPriority).toHaveBeenCalledWith('hot');
    });

    it('should mark active filter button', () => {
      const data = createMockData({ filterPriority: 'hot' });
      const { container } = render(<ConversationsTab data={data} />);

      const activeBtn = container.querySelector('.filter-btn.active');
      expect(activeBtn).toBeInTheDocument();
      expect(activeBtn?.textContent).toBe('Hot');
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no conversation selected', () => {
      const data = createMockData({ selectedConversation: null });
      render(<ConversationsTab data={data} />);

      expect(screen.getByText('Select a conversation to start messaging')).toBeInTheDocument();
    });
  });

  describe('Chat Area', () => {
    it('should render chat header with contact info', () => {
      const conv = mockConversation();
      const data = createMockData({ selectedConversation: conv });
      render(<ConversationsTab data={data} />);

      // Two occurrences of name (list + header)
      const names = screen.getAllByText('John Smith');
      expect(names.length).toBeGreaterThanOrEqual(2);
    });

    it('should render messages', () => {
      const conv = mockConversation();
      const data = createMockData({ selectedConversation: conv });
      render(<ConversationsTab data={data} />);

      expect(screen.getByText('Hi there!')).toBeInTheDocument();
      expect(screen.getByText('How can I help?')).toBeInTheDocument();
    });

    it('should handle conversation with no messages (null-safe)', () => {
      const conv = mockConversation({ messages: undefined });
      const data = createMockData({ selectedConversation: conv });
      render(<ConversationsTab data={data} />);

      // Should render chat area without crashing
      const names = screen.getAllByText('John Smith');
      expect(names.length).toBeGreaterThanOrEqual(2);
    });

    it('should render message status for sent messages', () => {
      const conv = mockConversation();
      const data = createMockData({ selectedConversation: conv });
      const { container } = render(<ConversationsTab data={data} />);

      const statusIndicator = container.querySelector('.message-status.delivered');
      expect(statusIndicator).toBeInTheDocument();
    });

    it('should render message input', () => {
      const conv = mockConversation();
      const data = createMockData({ selectedConversation: conv });
      render(<ConversationsTab data={data} />);

      expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
    });

    it('should call setMessageInput on typing', () => {
      const conv = mockConversation();
      const data = createMockData({ selectedConversation: conv });
      render(<ConversationsTab data={data} />);

      const input = screen.getByPlaceholderText('Type a message...');
      fireEvent.change(input, { target: { value: 'Hey!' } });
      expect(data.setMessageInput).toHaveBeenCalledWith('Hey!');
    });

    it('should call handleSendMessage on Enter key', () => {
      const conv = mockConversation();
      const data = createMockData({ selectedConversation: conv });
      render(<ConversationsTab data={data} />);

      const input = screen.getByPlaceholderText('Type a message...');
      fireEvent.keyPress(input, { key: 'Enter', charCode: 13 });
      expect(data.handleSendMessage).toHaveBeenCalled();
    });

    it('should call handleSendMessage on send button click', () => {
      const conv = mockConversation();
      const data = createMockData({ selectedConversation: conv });
      render(<ConversationsTab data={data} />);

      const sendBtn = screen.getByTestId('icon-send').closest('button');
      fireEvent.click(sendBtn!);
      expect(data.handleSendMessage).toHaveBeenCalled();
    });
  });

  describe('Multiple Conversations', () => {
    it('should render multiple conversations', () => {
      const conv1 = mockConversation({ id: 'c1', contact: { avatar: 'a.jpg', name: 'Alice', status: 'online' } });
      const conv2 = mockConversation({ id: 'c2', contact: { avatar: 'b.jpg', name: 'Bob', status: 'offline' } });
      const data = createMockData({ filteredConversations: [conv1, conv2] });
      render(<ConversationsTab data={data} />);

      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });

    it('should render empty list when no conversations match', () => {
      const data = createMockData({ filteredConversations: [] });
      render(<ConversationsTab data={data} />);

      expect(screen.getByText('Select a conversation to start messaging')).toBeInTheDocument();
    });
  });
});
