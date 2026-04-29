/**
 * @file useBotData.test.ts
 * @description Comprehensive tests for useBotData hook — WhatsApp bot management
 * Tests: add/delete/toggle bots, filtering, status colors, aggregate stats, QR code, modules
 */

import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the data modules
vi.mock('../../data/bots', () => ({
  DUMMY_BOTS: [
    { id: 'bot-1', name: 'Lion0', number: '+971501234567', status: 'connected', qrCode: null, messagesProcessed: 1247, responseRate: 98.5, avgResponseTime: '2.3s', lastActive: '2 min ago', uptime: '99.8%', features: ['Auto-Reply'] },
    { id: 'bot-2', name: 'Lion1', number: '+971502345678', status: 'disconnected', qrCode: null, messagesProcessed: 543, responseRate: 92.1, avgResponseTime: '3.1s', lastActive: '1 hr ago', uptime: '95.2%', features: [] },
    { id: 'bot-3', name: 'Lion2', number: '+971503456789', status: 'pending', qrCode: 'qr-url', messagesProcessed: 0, responseRate: 0, avgResponseTime: '-', lastActive: 'Never', uptime: '0%', features: [] },
  ],
  CODE_MODULES: [
    { name: 'WhatsAppBot', expanded: true, files: [{ name: 'Client.js', type: 'js', lines: 45 }] },
    { name: 'MessageHandler', expanded: false, files: [{ name: 'Handler.js', type: 'js', lines: 178 }] },
  ],
  Bot: undefined,
  CodeModule: undefined,
}));

vi.mock('../../data/features', () => ({
  NINA_BOT_FEATURES: [
    { id: 'f1', name: 'Auto-Reply', description: 'Auto reply', category: 'Automation', status: 'active' },
  ],
}));

import { useBotData } from '../useBotData';

describe('useBotData', () => {
  beforeEach(() => vi.clearAllMocks());

  // ── Initial State ──────────────────────────────────────
  describe('Initial State', () => {
    it('returns bots array from dummy data', () => {
      const { result } = renderHook(() => useBotData());
      expect(result.current.bots).toHaveLength(3);
      expect(result.current.bots[0].name).toBe('Lion0');
    });

    it('selectedBot starts as null', () => {
      const { result } = renderHook(() => useBotData());
      expect(result.current.selectedBot).toBeNull();
    });

    it('returns code modules', () => {
      const { result } = renderHook(() => useBotData());
      expect(result.current.codeModules).toHaveLength(2);
    });

    it('expanded module defaults to WhatsAppBot', () => {
      const { result } = renderHook(() => useBotData());
      expect(result.current.expandedModule).toBe('WhatsAppBot');
    });

    it('filter status defaults to all', () => {
      const { result } = renderHook(() => useBotData());
      expect(result.current.filterStatus).toBe('all');
    });

    it('QR code is hidden by default', () => {
      const { result } = renderHook(() => useBotData());
      expect(result.current.showQRCode).toBe(false);
      expect(result.current.qrCodeBot).toBeNull();
    });

    it('settings are hidden by default', () => {
      const { result } = renderHook(() => useBotData());
      expect(result.current.showSettings).toBe(false);
    });

    it('features dialog hidden by default', () => {
      const { result } = renderHook(() => useBotData());
      expect(result.current.showFeatures).toBe(false);
    });

    it('returns features from data', () => {
      const { result } = renderHook(() => useBotData());
      expect(result.current.features).toHaveLength(1);
      expect(result.current.features[0].name).toBe('Auto-Reply');
    });
  });

  // ── Add Bot ────────────────────────────────────────────
  describe('handleAddBot', () => {
    it('adds a new bot to the list', () => {
      const { result } = renderHook(() => useBotData());
      act(() => result.current.handleAddBot());
      expect(result.current.bots).toHaveLength(4);
    });

    it('new bot has pending status', () => {
      const { result } = renderHook(() => useBotData());
      act(() => result.current.handleAddBot());
      const newBot = result.current.bots[3];
      expect(newBot.status).toBe('pending');
    });

    it('new bot has zero messages processed', () => {
      const { result } = renderHook(() => useBotData());
      act(() => result.current.handleAddBot());
      expect(result.current.bots[3].messagesProcessed).toBe(0);
    });

    it('new bot name includes array length', () => {
      const { result } = renderHook(() => useBotData());
      act(() => result.current.handleAddBot());
      // Name is Lion{prev.length} where prev.length = 3
      expect(result.current.bots[3].name).toBe('Lion3');
    });

    it('new bot has unique id based on timestamp', () => {
      const { result } = renderHook(() => useBotData());
      act(() => result.current.handleAddBot());
      expect(result.current.bots[3].id).toMatch(/^bot-\d+$/);
    });
  });

  // ── Delete Bot ─────────────────────────────────────────
  describe('handleDeleteBot', () => {
    it('removes the bot with given id', () => {
      const { result } = renderHook(() => useBotData());
      act(() => result.current.handleDeleteBot('bot-2'));
      expect(result.current.bots).toHaveLength(2);
      expect(result.current.bots.find(b => b.id === 'bot-2')).toBeUndefined();
    });

    it('clears selectedBot if deleted bot was selected', () => {
      const { result } = renderHook(() => useBotData());
      act(() => result.current.setSelectedBot(result.current.bots[1]));
      expect(result.current.selectedBot?.id).toBe('bot-2');
      act(() => result.current.handleDeleteBot('bot-2'));
      expect(result.current.selectedBot).toBeNull();
    });

    it('preserves selectedBot if different bot is deleted', () => {
      const { result } = renderHook(() => useBotData());
      act(() => result.current.setSelectedBot(result.current.bots[0]));
      act(() => result.current.handleDeleteBot('bot-2'));
      expect(result.current.selectedBot?.id).toBe('bot-1');
    });

    it('does nothing for non-existent id', () => {
      const { result } = renderHook(() => useBotData());
      act(() => result.current.handleDeleteBot('bot-999'));
      expect(result.current.bots).toHaveLength(3);
    });
  });

  // ── Toggle Bot Status ──────────────────────────────────
  describe('handleToggleBotStatus', () => {
    it('toggles connected bot to disconnected', () => {
      const { result } = renderHook(() => useBotData());
      act(() => result.current.handleToggleBotStatus('bot-1'));
      expect(result.current.bots[0].status).toBe('disconnected');
    });

    it('toggles disconnected bot to connected', () => {
      const { result } = renderHook(() => useBotData());
      act(() => result.current.handleToggleBotStatus('bot-2'));
      expect(result.current.bots[1].status).toBe('connected');
    });

    it('updates lastActive timestamp on toggle', () => {
      const { result } = renderHook(() => useBotData());
      act(() => result.current.handleToggleBotStatus('bot-1'));
      expect(result.current.bots[0].lastActive).not.toBe('2 min ago');
    });

    it('does not affect other bots', () => {
      const { result } = renderHook(() => useBotData());
      act(() => result.current.handleToggleBotStatus('bot-1'));
      expect(result.current.bots[1].status).toBe('disconnected');
      expect(result.current.bots[2].status).toBe('pending');
    });
  });

  // ── Toggle Module ──────────────────────────────────────
  describe('handleToggleModule', () => {
    it('toggles module expanded state', () => {
      const { result } = renderHook(() => useBotData());
      // WhatsAppBot starts expanded: true
      act(() => result.current.handleToggleModule('WhatsAppBot'));
      expect(result.current.codeModules[0].expanded).toBe(false);
    });

    it('toggles collapsed module to expanded', () => {
      const { result } = renderHook(() => useBotData());
      // MessageHandler starts expanded: false
      act(() => result.current.handleToggleModule('MessageHandler'));
      expect(result.current.codeModules[1].expanded).toBe(true);
    });
  });

  // ── Filtering ──────────────────────────────────────────
  describe('Filtering', () => {
    it('shows all bots when filter is all', () => {
      const { result } = renderHook(() => useBotData());
      expect(result.current.filteredBots).toHaveLength(3);
    });

    it('filters to connected bots only', () => {
      const { result } = renderHook(() => useBotData());
      act(() => result.current.setFilterStatus('connected'));
      expect(result.current.filteredBots).toHaveLength(1);
      expect(result.current.filteredBots[0].status).toBe('connected');
    });

    it('filters to disconnected bots only', () => {
      const { result } = renderHook(() => useBotData());
      act(() => result.current.setFilterStatus('disconnected'));
      expect(result.current.filteredBots).toHaveLength(1);
      expect(result.current.filteredBots[0].name).toBe('Lion1');
    });

    it('filters to pending bots only', () => {
      const { result } = renderHook(() => useBotData());
      act(() => result.current.setFilterStatus('pending'));
      expect(result.current.filteredBots).toHaveLength(1);
      expect(result.current.filteredBots[0].name).toBe('Lion2');
    });

    it('returns empty for non-matching filter', () => {
      const { result } = renderHook(() => useBotData());
      act(() => result.current.setFilterStatus('unknown'));
      expect(result.current.filteredBots).toHaveLength(0);
    });
  });

  // ── Status Colors ──────────────────────────────────────
  describe('getStatusColor', () => {
    it('returns green for connected', () => {
      const { result } = renderHook(() => useBotData());
      expect(result.current.getStatusColor('connected')).toBe('#10b981');
    });

    it('returns red for disconnected', () => {
      const { result } = renderHook(() => useBotData());
      expect(result.current.getStatusColor('disconnected')).toBe('#ef4444');
    });

    it('returns amber for pending', () => {
      const { result } = renderHook(() => useBotData());
      expect(result.current.getStatusColor('pending')).toBe('#f59e0b');
    });

    it('returns gray for unknown status', () => {
      const { result } = renderHook(() => useBotData());
      expect(result.current.getStatusColor('anything')).toBe('#6b7280');
    });
  });

  // ── Aggregate Stats ────────────────────────────────────
  describe('Aggregate Stats', () => {
    it('getTotalMessagesProcessed sums all bots', () => {
      const { result } = renderHook(() => useBotData());
      // 1247 + 543 + 0 = 1790
      expect(result.current.getTotalMessagesProcessed()).toBe(1790);
    });

    it('getAverageResponseRate calculates average of non-zero rates', () => {
      const { result } = renderHook(() => useBotData());
      // bots with responseRate > 0: 98.5, 92.1 → avg = 95.3
      expect(result.current.getAverageResponseRate()).toBe('95.3');
    });

    it('getConnectedBotCount returns count of connected bots', () => {
      const { result } = renderHook(() => useBotData());
      expect(result.current.getConnectedBotCount()).toBe(1);
    });

    it('aggregates update after adding a bot', () => {
      const { result } = renderHook(() => useBotData());
      act(() => result.current.handleAddBot());
      expect(result.current.getTotalMessagesProcessed()).toBe(1790); // new bot has 0
      expect(result.current.getConnectedBotCount()).toBe(1); // new bot is pending
    });

    it('aggregates update after toggling bot status', () => {
      const { result } = renderHook(() => useBotData());
      act(() => result.current.handleToggleBotStatus('bot-2'));
      // bot-2 was disconnected → now connected (2 connected total)
      expect(result.current.getConnectedBotCount()).toBe(2);
    });
  });

  // ── State Setters ──────────────────────────────────────
  describe('State Setters', () => {
    it('setSelectedBot updates selectedBot', () => {
      const { result } = renderHook(() => useBotData());
      act(() => result.current.setSelectedBot(result.current.bots[0]));
      expect(result.current.selectedBot?.id).toBe('bot-1');
    });

    it('setShowQRCode toggles QR code visibility', () => {
      const { result } = renderHook(() => useBotData());
      act(() => result.current.setShowQRCode(true));
      expect(result.current.showQRCode).toBe(true);
    });

    it('setQRCodeBot sets the bot for QR display', () => {
      const { result } = renderHook(() => useBotData());
      act(() => result.current.setQRCodeBot(result.current.bots[0]));
      expect(result.current.qrCodeBot?.id).toBe('bot-1');
    });

    it('setShowSettings toggles settings', () => {
      const { result } = renderHook(() => useBotData());
      act(() => result.current.setShowSettings(true));
      expect(result.current.showSettings).toBe(true);
    });

    it('setShowFeatures toggles features', () => {
      const { result } = renderHook(() => useBotData());
      act(() => result.current.setShowFeatures(true));
      expect(result.current.showFeatures).toBe(true);
    });

    it('setExpandedModule changes active module', () => {
      const { result } = renderHook(() => useBotData());
      act(() => result.current.setExpandedModule('MessageHandler'));
      expect(result.current.expandedModule).toBe('MessageHandler');
    });
  });
});
