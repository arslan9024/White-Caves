import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  mockGetLindaClient,
  mockInitialize,
  mockSendMessage,
  mockBroadcastMessage,
  mockGetMessageQueue,
  mockGetConversations,
  mockGetConversationHistory,
  mockGetQRCode,
  mockDisconnect,
  mockGetStatus,
  mockIsConnected,
  mockGetStats,
  mockLoggerInfo,
  mockLoggerDebug,
} = vi.hoisted(() => ({
  mockGetLindaClient: vi.fn(),
  mockInitialize: vi.fn(),
  mockSendMessage: vi.fn(),
  mockBroadcastMessage: vi.fn(),
  mockGetMessageQueue: vi.fn(),
  mockGetConversations: vi.fn(),
  mockGetConversationHistory: vi.fn(),
  mockGetQRCode: vi.fn(),
  mockDisconnect: vi.fn(),
  mockGetStatus: vi.fn(),
  mockIsConnected: vi.fn(),
  mockGetStats: vi.fn(),
  mockLoggerInfo: vi.fn(),
  mockLoggerDebug: vi.fn(),
}));

vi.mock('../../lindaClient.js', () => ({
  LindaStatus: {
    DISCONNECTED: 'DISCONNECTED',
    AUTHENTICATING: 'AUTHENTICATING',
    READY: 'READY',
    RECONNECTING: 'RECONNECTING',
    ERROR: 'ERROR',
  },
  getLindaClient: mockGetLindaClient,
}));

vi.mock('../../../../utils/logger.js', () => ({
  logger: {
    info: mockLoggerInfo,
    debug: mockLoggerDebug,
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

import { getLindaClientForMode, getLindaCoreMode } from './LindaCoreAdapter.js';

const originalMode = process.env.LINDA_CORE_MODE;

function configureBaseClient() {
  mockInitialize.mockResolvedValue(undefined);
  mockSendMessage.mockResolvedValue('msg-1');
  mockBroadcastMessage.mockResolvedValue([{ phone: '971500000001', messageId: 'msg-1' }]);
  mockGetMessageQueue.mockReturnValue([]);
  mockGetConversations.mockResolvedValue([]);
  mockGetConversationHistory.mockResolvedValue([]);
  mockGetQRCode.mockReturnValue(null);
  mockDisconnect.mockResolvedValue(undefined);
  mockGetStatus.mockReturnValue('READY');
  mockIsConnected.mockReturnValue(true);
  mockGetStats.mockReturnValue({
    status: 'READY',
    isConnected: true,
    queuedMessages: 0,
    reconnectAttempts: 0,
    messagesSent: 0,
    messagesReceived: 0,
  });

  mockGetLindaClient.mockReturnValue({
    initialize: mockInitialize,
    sendMessage: mockSendMessage,
    broadcastMessage: mockBroadcastMessage,
    getMessageQueue: mockGetMessageQueue,
    getConversations: mockGetConversations,
    getConversationHistory: mockGetConversationHistory,
    getQRCode: mockGetQRCode,
    disconnect: mockDisconnect,
    getStatus: mockGetStatus,
    isConnected: mockIsConnected,
    getStats: mockGetStats,
  });
}

describe('LindaCoreAdapter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    configureBaseClient();
    delete process.env.LINDA_CORE_MODE;
  });

  it('defaults to legacy mode', () => {
    expect(getLindaCoreMode()).toBe('legacy');
  });

  it('normalizes invalid mode to legacy', () => {
    process.env.LINDA_CORE_MODE = 'invalid-mode';
    expect(getLindaCoreMode()).toBe('legacy');
  });

  it('supports shadow and active modes', () => {
    process.env.LINDA_CORE_MODE = 'shadow';
    expect(getLindaCoreMode()).toBe('shadow');

    process.env.LINDA_CORE_MODE = 'active';
    expect(getLindaCoreMode()).toBe('active');
  });

  it('delegates transport operations to base client contract', async () => {
    process.env.LINDA_CORE_MODE = 'legacy';
    const linda = getLindaClientForMode();

    await linda.initialize();
    await linda.sendMessage('971500000001', 'hello');
    await linda.broadcastMessage(['971500000001'], 'campaign');

    expect(mockInitialize).toHaveBeenCalledTimes(1);
    expect(mockSendMessage).toHaveBeenCalledWith('971500000001', 'hello');
    expect(mockBroadcastMessage).toHaveBeenCalledWith(['971500000001'], 'campaign');
    expect(mockGetLindaClient).toHaveBeenCalledTimes(1);
  });

  it('emits shadow hooks for operations in shadow mode', async () => {
    process.env.LINDA_CORE_MODE = 'shadow';
    const linda = getLindaClientForMode();

    await linda.sendMessage('971500000001', 'hello');

    expect(mockLoggerInfo).toHaveBeenCalledWith(
      '[LindaCoreAdapter] SHADOW mode enabled (legacy transport remains active)'
    );
    expect(mockLoggerDebug).toHaveBeenCalledWith(
      '[LindaCoreAdapter] SHADOW operation: sendMessage',
      { phoneNumber: '971500000001' }
    );
  });
});

afterAll(() => {
  if (originalMode === undefined) {
    delete process.env.LINDA_CORE_MODE;
    return;
  }
  process.env.LINDA_CORE_MODE = originalMode;
});
