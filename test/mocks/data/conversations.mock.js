export const mockConversations = [
  {
    _id: 'conv-001',
    contactId: '+971501234567',
    contactName: 'Ahmed',
    messages: [
      {
        id: 'msg-001',
        from: '+971501234567',
        body: 'I have a 4BR villa in Dubai Marina for 5000 AED/month',
        timestamp: Date.now() - 3600000,
        hasMedia: false,
      },
      {
        id: 'msg-002',
        from: 'me',
        body: 'Thank you! Can you share more details?',
        timestamp: Date.now() - 3500000,
        hasMedia: false,
      },
    ],
    lastMessageTime: Date.now() - 3500000,
    unreadCount: 0,
  },
  {
    _id: 'conv-002',
    contactId: '+971507654321',
    contactName: 'Sara',
    messages: [
      {
        id: 'msg-003',
        from: '+971507654321',
        body: 'Looking for 2BR apartment in JBR',
        timestamp: Date.now() - 7200000,
        hasMedia: false,
      },
    ],
    lastMessageTime: Date.now() - 7200000,
    unreadCount: 1,
  },
];

export const mockConversation = mockConversations[0];

export const createMockConversation = (overrides = {}) => ({
  _id: `conv-${Date.now()}`,
  contactId: '+971501234567',
  contactName: 'Test Contact',
  messages: [],
  lastMessageTime: Date.now(),
  unreadCount: 0,
  ...overrides,
});
