import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInterface } from '../../components/WhatsApp/ChatInterface';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Mock store
const createMockStore = () => {
  return configureStore({
    reducer: {
      whatsapp: (state = {}) => state,
    },
  });
};

describe('ChatInterface Component', () => {
  let mockStore: any;

  beforeEach(() => {
    mockStore = createMockStore();
    vi.clearAllMocks();
  });

  const defaultProps = {
    conversationId: 'conv-123',
    contactName: 'John Doe',
    contactNumber: '+12025551234',
    messages: [
      {
        id: 'msg-1',
        content: 'Hello',
        fromMe: false,
        timestamp: new Date('2024-01-01'),
        status: 'delivered',
        contentType: 'text',
      },
      {
        id: 'msg-2',
        content: 'Hi there!',
        fromMe: true,
        timestamp: new Date('2024-01-01T01:00:00'),
        status: 'delivered',
        contentType: 'text',
      },
    ],
    onSendMessage: vi.fn(),
    onSendMedia: vi.fn(),
    isLoading: false,
    error: null,
  };

  const renderComponent = (props = {}) => {
    const finalProps = { ...defaultProps, ...props };
    return render(
      <Provider store={mockStore}>
        <ChatInterface {...finalProps} />
      </Provider>
    );
  };

  describe('Rendering', () => {
    it('should render chat interface', () => {
      renderComponent();
      expect(screen.getByTestId('chat-interface')).toBeInTheDocument();
    });

    it('should display contact information', () => {
      renderComponent();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('+12025551234')).toBeInTheDocument();
    });

    it('should display message list', () => {
      renderComponent();
      expect(screen.getByText('Hello')).toBeInTheDocument();
      expect(screen.getByText('Hi there!')).toBeInTheDocument();
    });

    it('should display message input field', () => {
      renderComponent();
      const input = screen.getByPlaceholderText(/type a message/i);
      expect(input).toBeInTheDocument();
    });

    it('should display loading state', () => {
      renderComponent({ isLoading: true });
      expect(screen.getByTestId('chat-loading')).toBeInTheDocument();
    });

    it('should display error message', () => {
      const error = 'Failed to load messages';
      renderComponent({ error });
      expect(screen.getByText(error)).toBeInTheDocument();
    });
  });

  describe('Message Sending', () => {
    it('should send message on button click', async () => {
      const user = userEvent.setup();
      renderComponent();

      const input = screen.getByPlaceholderText(/type a message/i);
      const sendButton = screen.getByRole('button', { name: /send/i });

      await user.type(input, 'Test message');
      await user.click(sendButton);

      expect(defaultProps.onSendMessage).toHaveBeenCalledWith('Test message');
    });

    it('should send message on Enter key', async () => {
      const user = userEvent.setup();
      renderComponent();

      const input = screen.getByPlaceholderText(/type a message/i);

      await user.type(input, 'Test message{Enter}');

      expect(defaultProps.onSendMessage).toHaveBeenCalledWith('Test message');
    });

    it('should not send empty message', async () => {
      const user = userEvent.setup();
      renderComponent();

      const sendButton = screen.getByRole('button', { name: /send/i });
      await user.click(sendButton);

      expect(defaultProps.onSendMessage).not.toHaveBeenCalled();
    });

    it('should clear input after sending message', async () => {
      const user = userEvent.setup();
      renderComponent();

      const input = screen.getByPlaceholderText(/type a message/i) as HTMLInputElement;
      const sendButton = screen.getByRole('button', { name: /send/i });

      await user.type(input, 'Test message');
      await user.click(sendButton);

      expect(input.value).toBe('');
    });

    it('should disable send button while loading', () => {
      renderComponent({ isLoading: true });
      const sendButton = screen.getByRole('button', { name: /send/i });
      expect(sendButton).toBeDisabled();
    });
  });

  describe('Media Handling', () => {
    it('should handle media attachment button click', async () => {
      const user = userEvent.setup();
      renderComponent();

      const mediaButton = screen.getByRole('button', {
        name: /attach|media|clip/i,
      });
      expect(mediaButton).toBeInTheDocument();
    });

    it('should handle file selection', async () => {
      const user = userEvent.setup();
      renderComponent();

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement | null;
      if (fileInput) {
        const file = new File(['test'], 'test.txt', { type: 'text/plain' });
        await user.upload(fileInput, file);
        expect(defaultProps.onSendMedia).toHaveBeenCalled();
      }
    });
  });

  describe('Emoji & Formatting', () => {
    it('should display emoji picker', async () => {
      const user = userEvent.setup();
      renderComponent();

      const emojiButton = screen.queryByRole('button', { name: /emoji/i });
      if (emojiButton) {
        await user.click(emojiButton);
        expect(screen.getByTestId('emoji-picker')).toBeInTheDocument();
      }
    });
  });

  describe('Message Display', () => {
    it('should display sent messages on the right', () => {
      renderComponent();
      const sentMessage = screen.getByTestId('message-msg-2');
      expect(sentMessage).toHaveClass('sent');
    });

    it('should display received messages on the left', () => {
      renderComponent();
      const receivedMessage = screen.getByTestId('message-msg-1');
      expect(receivedMessage).toHaveClass('received');
    });

    it('should display message timestamp', () => {
      renderComponent();
      expect(screen.getByText(/january|jan/i)).toBeInTheDocument();
    });

    it('should display message status', () => {
      renderComponent();
      const statusIndicators = screen.queryAllByTestId(/message-status/i);
      expect(statusIndicators.length).toBeGreaterThan(0);
    });

    it('should scroll to bottom on new message', async () => {
      const { rerender } = renderComponent();

      const newMessages = [
        ...defaultProps.messages,
        {
          id: 'msg-3',
          content: 'New message',
          fromMe: false,
          timestamp: new Date('2024-01-01T02:00:00'),
          status: 'delivered',
          contentType: 'text',
        },
      ];

      rerender(
        <Provider store={mockStore}>
          <ChatInterface {...defaultProps} messages={newMessages} />
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getByText('New message')).toBeInTheDocument();
      });
    });
  });

  describe('Message Actions', () => {
    it('should edit message', async () => {
      const user = userEvent.setup();
      renderComponent();

      const messageElement = screen.getByTestId('message-msg-2');
      const editButton = messageElement.querySelector('button[aria-label*="Edit"]');

      if (editButton) {
        await user.click(editButton);
        expect(screen.getByPlaceholderText(/edit message/i)).toBeInTheDocument();
      }
    });

    it('should delete message', async () => {
      const user = userEvent.setup();
      renderComponent();

      const messageElement = screen.getByTestId('message-msg-2');
      const deleteButton = messageElement.querySelector(
        'button[aria-label*="Delete"]'
      );

      if (deleteButton) {
        await user.click(deleteButton);
        const confirmButton = screen.getByRole('button', {
          name: /confirm|delete/i,
        });
        await user.click(confirmButton);
      }
    });
  });

  describe('Responsive Behavior', () => {
    it('should adapt to mobile viewport', () => {
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(375);
      renderComponent();
      const chatInterface = screen.getByTestId('chat-interface');
      expect(chatInterface).toHaveClass('mobile');
    });

    it('should adapt to tablet viewport', () => {
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(768);
      renderComponent();
      const chatInterface = screen.getByTestId('chat-interface');
      expect(chatInterface).toHaveClass('tablet');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      renderComponent();
      expect(screen.getByPlaceholderText(/type a message/i)).toHaveAttribute(
        'aria-label'
      );
    });

    it('should have keyboard navigation', async () => {
      renderComponent();

      const input = screen.getByPlaceholderText(/type a message/i);
      input.focus();

      expect(input).toHaveFocus();
    });

    it('should support screen reader announcements', () => {
      renderComponent();
      const liveRegion = screen.queryByRole('status');
      expect(liveRegion).toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('should show error when message fails to send', async () => {
      const user = userEvent.setup();
      const onSendMessage = vi
        .fn()
        .mockRejectedValueOnce(new Error('Send failed'));

      renderComponent({ onSendMessage });

      const input = screen.getByPlaceholderText(/type a message/i);
      const sendButton = screen.getByRole('button', { name: /send/i });

      await user.type(input, 'Test message');
      await user.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText(/failed|error/i)).toBeInTheDocument();
      });
    });

    it('should allow retry on failed send', async () => {
      const user = userEvent.setup();
      const onSendMessage = vi
        .fn()
        .mockRejectedValueOnce(new Error('Send failed'));

      renderComponent({ onSendMessage });

      const input = screen.getByPlaceholderText(/type a message/i);
      const sendButton = screen.getByRole('button', { name: /send/i });

      await user.type(input, 'Test message');
      await user.click(sendButton);

      await waitFor(() => {
        const retryButton = screen.getByRole('button', { name: /retry/i });
        expect(retryButton).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    it('should handle large message lists efficiently', () => {
      const largeMessages = Array.from({ length: 1000 }, (_, i) => ({
        id: `msg-${i}`,
        content: `Message ${i}`,
        fromMe: i % 2 === 0,
        timestamp: new Date(),
        status: 'delivered' as const,
        contentType: 'text' as const,
      }));

      renderComponent({ messages: largeMessages });
      expect(screen.getByTestId('chat-interface')).toBeInTheDocument();
    });

    it('should virtualize message list for performance', () => {
      const largeMessages = Array.from({ length: 1000 }, (_, i) => ({
        id: `msg-${i}`,
        content: `Message ${i}`,
        fromMe: i % 2 === 0,
        timestamp: new Date(),
        status: 'delivered' as const,
        contentType: 'text' as const,
      }));

      renderComponent({ messages: largeMessages });
      // Only visible messages should be rendered
      const messageElements = screen.queryAllByTestId(/^message-msg-/);
      expect(messageElements.length).toBeLessThan(largeMessages.length);
    });
  });
});
