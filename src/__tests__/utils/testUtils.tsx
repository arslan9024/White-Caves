/**
 * Test Utilities
 * 
 * Helper functions for rendering components and mocking API calls
 */

import React from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';

/**
 * Custom render function with common providers
 */
function render(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  // Add providers here if needed (Redux, Context, etc.)
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
  };

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

/**
 * Mock API responses
 */
export const mockApiResponses = {
  accounts: {
    data: {
      accounts: [
        {
          accountId: '123',
          name: 'Test Account',
          businessName: 'Test Business',
          phoneNumber: '+1234567890',
          isConnected: true,
          linkedAt: new Date(),
        },
      ],
    },
  },

  conversations: {
    data: {
      conversations: [
        {
          conversationId: 'conv-1',
          accountId: '123',
          recipientNumber: '+1234567890',
          recipientName: 'John Doe',
          lastMessage: 'Hello!',
          lastMessageTime: new Date(),
          unreadCount: 0,
        },
      ],
    },
  },

  messages: {
    data: {
      messages: [
        {
          id: 'msg-1',
          text: 'Test message',
          isOwn: false,
          timestamp: new Date(),
          status: 'delivered',
        },
      ],
    },
  },

  analytics: {
    data: {
      totalMessages: 100,
      activeConversations: 5,
      avgResponseTime: '2 min',
      deliveryRate: 98,
      topConversations: [],
    },
  },
};

/**
 * Mock fetch responses
 */
export const mockFetch = (response: unknown) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(response),
    })
  ) as jest.Mock;
};

/**
 * Clear all mocks
 */
export const clearAllMocks = () => {
  jest.clearAllMocks();
};

export * from '@testing-library/react';
export { render };
