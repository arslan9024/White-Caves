# WhatsApp Frontend Implementation Guide

## Overview

This document details the complete frontend implementation for the WhatsApp Web integration dashboard. The frontend is built with React, TypeScript, and styled-components, providing a modern, responsive UI for managing WhatsApp conversations.

## Architecture

### Component Hierarchy

```
WhatsAppDashboard (Main Page)
├── Sidebar (Navigation)
├── MainContent
│   ├── Chat View
│   │   ├── ConversationList
│   │   └── ChatInterface
│   ├── Analytics View
│   │   └── Analytics
│   ├── Settings View
│   └── Account View
└── AccountLink (Modal/Full Page)
```

### Custom Hooks

All WhatsApp-related state management is handled through custom React hooks:

#### 1. `useWhatsAppIntegration`
- **Purpose**: Manage account linking and device connection
- **Key Methods**:
  - `linkDevice()` - Initiate device linking with phone number
  - `confirmLink()` - Complete linking with authentication code
  - `connectAccount()` - Establish WebSocket connection
  - `disconnectAccount()` - Close connection to device

#### 2. `useWhatsAppConversations`
- **Purpose**: Manage conversations and messages
- **Key Methods**:
  - `loadConversations()` - Fetch conversation list
  - `loadMessages()` - Get message history
  - `sendMessage()` - Send new message
  - `markAsRead()` - Mark conversation as read

#### 3. `useWhatsAppAnalytics`
- **Purpose**: Fetch and manage analytics data
- **Key Methods**:
  - `loadAnalytics()` - Get analytics for date range
  - `exportAnalytics()` - Export data as CSV/JSON

## Components

### 1. AccountLink Component

**File**: `src/components/WhatsApp/AccountLink/AccountLink.tsx`

**Features**:
- Account selection dropdown
- Phone number input with validation
- QR code generation and display
- Authentication code verification
- Multi-step UI with progress indicators

**Props**:
```typescript
interface AccountLinkProps {
  onSuccess?: (accountId: string) => void;
  onCancel?: () => void;
}
```

**Workflow**:
1. User selects account and enters phone number
2. System generates QR code
3. User can scan QR or enter auth code
4. Confirmation of device linking

### 2. ConversationList Component

**File**: `src/components/WhatsApp/ChatInterface/ConversationList.tsx`

**Features**:
- Searchable conversation list
- Unread message badges
- Recent message preview
- Contact avatar generation
- Timestamp formatting

**Props**:
```typescript
interface ConversationListProps {
  accountId: string;
  onSelectConversation: (conversationId: string, recipientNumber: string, name: string) => void;
  selectedConversationId?: string;
}
```

### 3. ChatInterface Component

**File**: `src/components/WhatsApp/ChatInterface/ChatInterface.tsx`

**Features**:
- Message list with auto-scroll
- Message composer with send button
- Contact header with online status
- Message timestamps
- Loading and empty states

**Props**:
```typescript
interface ChatInterfaceProps {
  accountId: string;
  conversationId?: string;
  recipientNumber?: string;
  recipientName?: string;
  onBack?: () => void;
}
```

### 4. Analytics Component

**File**: `src/components/WhatsApp/Analytics/Analytics.tsx`

**Features**:
- Date range filtering
- Key metrics cards (total messages, conversations, response time)
- Message volume chart
- Top conversations list
- Export to CSV/JSON

**Props**:
```typescript
interface AnalyticsProps {
  accountId: string;
}
```

### 5. WhatsAppDashboard Page

**File**: `src/pages/WhatsApp/WhatsAppDashboard.tsx`

**Features**:
- Multi-tab navigation (Chat, Analytics, Settings, Account)
- Account management
- Integrated conversation and chat views
- Responsive layout

## API Service

**File**: `src/services/whatsapp/whatsapp.service.ts`

The service provides a client-side wrapper for all WhatsApp backend API endpoints.

### Methods

#### Account Management
```typescript
listAccounts(): Promise<{ data: { accounts: Account[] } }>
initiateDeviceLink(accountId: string, phoneNumber: string): Promise<{ data: { qrCode: string; sessionId: string } }>
confirmDeviceLink(sessionId: string, authToken: string, phoneNumber: string): Promise<void>
connectAccount(accountId: string): Promise<{ data: Account }>
disconnectAccount(accountId: string): Promise<{ data: Account }>
unlinkAccount(accountId: string): Promise<void>
```

#### Conversation Management
```typescript
listConversations(accountId: string): Promise<{ data: { conversations: Conversation[] } }>
searchConversations(query: string): Promise<{ data: { conversations: Conversation[] } }>
getConversationHistory(accountId: string, recipientNumber: string, limit: number): Promise<{ data: { messages: Message[] } }>
sendMessage(accountId: string, recipientNumber: string, message: string): Promise<{ data: { message: Message } }>
markConversationAsRead(accountId: string, conversationId: string): Promise<void>
```

#### Analytics
```typescript
getAnalytics(accountId: string, startDate: string, endDate: string): Promise<{ data: AnalyticsData }>
getMessageStats(accountId: string, startDate: string, endDate: string): Promise<{ data: AnalyticsData }>
getConversationStats(accountId: string, startDate: string, endDate: string): Promise<{ data: AnalyticsData }>
exportAnalytics(accountId: string, startDate: string, endDate: string, format: 'csv' | 'json'): Promise<{ data: string }>
```

## Data Types

### Account
```typescript
interface Account {
  accountId: string;
  name?: string;
  businessName?: string;
  phoneNumber?: string;
  isConnected: boolean;
  linkedAt?: Date;
  lastActivityAt?: Date;
}
```

### Conversation
```typescript
interface Conversation {
  conversationId: string;
  accountId?: string;
  recipientNumber?: string;
  recipientName?: string;
  lastMessage?: string;
  lastMessageTime?: Date | string;
  unreadCount: number;
}
```

### Message
```typescript
interface Message {
  id: string;
  text: string;
  isOwn: boolean;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}
```

### AnalyticsData
```typescript
interface AnalyticsData {
  totalMessages: number;
  activeConversations: number;
  avgResponseTime: string | number;
  deliveryRate: number;
  topConversations?: Array<{
    recipientName?: string;
    recipientNumber?: string;
    messageCount: number;
  }>;
}
```

## Styling

All components use `styled-components` for CSS-in-JS styling. The color scheme follows WhatsApp's branding:

- **Primary Green**: `#25d366`
- **Dark Text**: `#1a1a1a`
- **Light Gray**: `#f5f5f5`
- **Border Color**: `#e0e0e0`

## Integration with App Router

To integrate the WhatsApp Dashboard into your app:

### 1. Add Route in Main Router
```typescript
import { WhatsAppDashboard } from './pages/WhatsApp';

// In your router configuration
{
  path: '/whatsapp',
  element: <WhatsAppDashboard />,
  name: 'WhatsApp Dashboard'
}
```

### 2. Add Navigation Link
```typescript
<Link to="/whatsapp">
  <span>📱 WhatsApp</span>
</Link>
```

### 3. Ensure Backend is Running
The frontend expects the backend API to be running on:
- Default: `http://localhost:5000`
- Can be configured in environment variables

## State Management

### Hook-Based State
- All component state is managed through custom React hooks
- No Redux needed for WhatsApp functionality
- Hooks encapsulate API calls and data transformations

### Error Handling
- All hooks include error states
- Error messages are displayed in UI components
- `clearError()` method available on all hooks

### Loading States
- `isLoading` flag indicates data fetching
- `isSending` flag for message sending
- `isLinking` flag for account linking

## Performance Optimizations

1. **Message Virtualization**: For large conversation histories
2. **Conversation Caching**: In-memory caching of recent conversations
3. **Lazy Loading**: Components load on demand
4. **Debounced Search**: Search input debounced to reduce API calls
5. **Auto-scroll**: Efficient scrolling to bottom on new messages

## Security Considerations

1. **API Key Management**: Store in environment variables
2. **CORS**: Backend configured to accept frontend requests
3. **Session Validation**: Backend validates all requests
4. **Input Sanitization**: All user input validated before sending
5. **Error Messages**: Avoid exposing sensitive information

## Testing

### Unit Tests
- Test each hook independently
- Mock API service responses
- Test error handling

### Integration Tests
- Test component interactions
- Test full user workflows
- Test API integration

### E2E Tests
- Test complete user journeys
- Test across different browsers
- Test responsive behavior

## Troubleshooting

### Common Issues

#### "Failed to connect to account"
- Ensure backend is running
- Check account is properly linked
- Verify network connectivity

#### "Messages not loading"
- Check conversation ID is valid
- Verify recipient number format
- Check unread count updates

#### "QR code not displaying"
- Clear browser cache
- Check session ID is valid
- Verify backend API response

## Future Enhancements

1. **Media Support**: Images, videos, documents
2. **Group Messaging**: Multi-recipient conversations
3. **Message Templates**: Pre-defined message sets
4. **Automated Responses**: Bot integration
5. **Advanced Analytics**: Sentiment analysis, trends
6. **Push Notifications**: Real-time message alerts
7. **Multi-account Support**: Switch between accounts seamlessly
8. **Message Scheduling**: Schedule messages for later

## File Structure

```
src/
├── components/
│   └── WhatsApp/
│       ├── index.ts
│       ├── AccountLink/
│       │   ├── index.ts
│       │   └── AccountLink.tsx
│       ├── ChatInterface/
│       │   ├── index.ts
│       │   ├── ChatInterface.tsx
│       │   └── ConversationList.tsx
│       └── Analytics/
│           ├── index.ts
│           └── Analytics.tsx
├── hooks/
│   └── whatsapp/
│       ├── index.ts
│       ├── useWhatsAppIntegration.ts
│       ├── useWhatsAppConversations.ts
│       └── useWhatsAppAnalytics.ts
├── services/
│   └── whatsapp/
│       └── whatsapp.service.ts
└── pages/
    └── WhatsApp/
        ├── index.ts
        └── WhatsAppDashboard.tsx
```

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_WS_BASE_URL=ws://localhost:5000
VITE_WHATSAPP_API_KEY=your_api_key_here
```

## Dependencies

- React 18+
- TypeScript 4.9+
- styled-components 5.3+
- Axios (for HTTP requests)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend logs
3. Check browser console for errors
4. Contact development team
