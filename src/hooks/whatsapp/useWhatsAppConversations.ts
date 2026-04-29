/**
 * useWhatsAppConversations Hook
 * 
 * Hook for managing WhatsApp conversations
 * Handles conversation list, message history, and real-time updates
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { whatsappService, Conversation, Message } from '../../services/whatsapp/whatsapp.service';

interface UseWhatsAppConversationsReturn {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  
  // Conversation methods
  loadConversations: (accountId: string) => Promise<void>;
  selectConversation: (conversationId: string) => void;
  searchConversations: (query: string) => Promise<void>;
  
  // Message methods
  loadMessages: (accountId: string, recipientNumber: string, limit?: number) => Promise<void>;
  sendMessage: (accountId: string, recipientNumber: string, message: string) => Promise<void>;
  markAsRead: (accountId: string, conversationId: string) => Promise<void>;
  
  // Utility methods
  clearError: () => void;
  refresh: () => Promise<void>;
}

export const useWhatsAppConversations = (): UseWhatsAppConversationsReturn => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadConversations = useCallback(async (accountId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await whatsappService.listConversations(accountId);
      setConversations(response.data.conversations);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load conversations';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectConversation = useCallback((conversationId: string) => {
    const conversation = conversations.find(c => c.conversationId === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
      setMessages([]); // Clear previous messages
    }
  }, [conversations]);

  const searchConversations = useCallback(async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await whatsappService.searchConversations(query);
      setConversations(response.data.conversations);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to search conversations';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async (accountId: string, recipientNumber: string, limit = 50) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await whatsappService.getConversationHistory(
        accountId,
        recipientNumber,
        limit
      );
      setMessages(response.data.messages);
      
      // Auto-scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load messages';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (accountId: string, recipientNumber: string, messageText: string) => {
    try {
      setError(null);
      
      const response = await whatsappService.sendMessage(
        accountId,
        recipientNumber,
        messageText
      );
      
      // Add sent message to the list
      setMessages(prev => [...prev, response.data.message]);
      
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send message';
      setError(message);
      throw err;
    }
  }, []);

  const markAsRead = useCallback(async (accountId: string, conversationId: string) => {
    try {
      setError(null);
      
      await whatsappService.markConversationAsRead(accountId, conversationId);
      
      // Update conversation in list
      setConversations(prev =>
        prev.map(c =>
          c.conversationId === conversationId
            ? { ...c, unreadCount: 0 }
            : c
        )
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to mark as read';
      setError(message);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refresh = useCallback(async () => {
    if (currentConversation) {
      await loadMessages(
        currentConversation.accountId || '',
        currentConversation.recipientNumber || ''
      );
    }
  }, [currentConversation, loadMessages]);

  return {
    conversations,
    currentConversation,
    messages,
    isLoading,
    error,
    loadConversations,
    selectConversation,
    searchConversations,
    loadMessages,
    sendMessage,
    markAsRead,
    clearError,
    refresh,
  };
};
