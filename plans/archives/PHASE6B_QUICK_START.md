# Phase 6B: Quick Start Guide

## Installation

All Phase 6B components are pre-built and ready to use. No additional installation needed beyond the existing project setup.

## 5-Minute Quick Start

### 1. Import Components

```typescript
import {
  MediaUploadComponent,
  GroupMessagingComponent,
  SearchComponent,
  MessageScheduler,
  Dashboard,
} from '@/components/Phase6';
```

### 2. Use Media Upload

```tsx
<MediaUploadComponent
  onUploadComplete={file => {
    console.log('File uploaded:', file.url);
  }}
  conversationId="conv-123"
/>
```

### 3. Display Messages

```tsx
<GroupMessagingComponent
  conversation={currentConversation}
  messages={messageList}
  currentUserId={userId}
  onSendMessage={async (content, attachments) => {
    // Send to backend
    await fetch('/api/phase6/messages', {
      method: 'POST',
      body: JSON.stringify({
        conversationId: currentConversation.id,
        content,
        mediaAttachments: attachments,
      }),
    });
  }}
/>
```

### 4. Add Search

```tsx
<SearchComponent
  onSearch={async (query, filters) => {
    const response = await fetch(`/api/phase6/search?q=${query}&type=${filters.type}`);
    return response.json();
  }}
  onSelectResult={result => {
    console.log('Selected:', result);
  }}
/>
```

### 5. Show Dashboard

```tsx
<Dashboard
  stats={dashboardStats}
  metrics={conversationMetrics}
  onRefresh={async () => {
    // Fetch fresh data
  }}
/>
```

## Key Files

| File                        | Purpose                        |
| --------------------------- | ------------------------------ |
| `src/components/Phase6/`    | All UI components              |
| `src/hooks/phase6/`         | React hooks for media handling |
| `src/types/phase6.types.ts` | TypeScript type definitions    |

## Component Props Cheat Sheet

### MediaUploadComponent

```typescript
{
  onUploadComplete: (file: MediaFile) => void;
  onError?: (error: string) => void;
  maxSize?: number; // Default: 50MB
  allowedTypes?: string[];
  multiple?: boolean;
  conversationId?: string;
}
```

### GroupMessagingComponent

```typescript
{
  conversation: GroupConversation;
  messages: GroupMessage[];
  currentUserId: string;
  onSendMessage: (content: string, attachments?: MediaFile[]) => Promise<void>;
  onMention?: (userId: string) => void;
  isLoading?: boolean;
}
```

### SearchComponent

```typescript
{
  onSearch: (query: string, filters: SearchFilters) => Promise<SearchResult[]>;
  onSelectResult?: (result: SearchResult) => void;
  placeholder?: string;
}
```

### MessageScheduler

```typescript
{
  onScheduleMessage: (message: ScheduledMessage) => Promise<void>;
  defaultRecipients?: string[];
}
```

### Dashboard

```typescript
{
  stats: DashboardStats;
  metrics: ConversationMetrics[];
  isLoading?: boolean;
  onRefresh?: () => Promise<void>;
}
```

## Common Patterns

### Handling File Uploads

```typescript
const { uploadFile, uploadProgress, isUploading } = useMediaUpload();

const handleUpload = async (file: File) => {
  try {
    const uploaded = await uploadFile(file, conversationId);
    // Use uploaded.url for storage/display
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### Filtering Media Gallery

```typescript
const { files, updateFilter, selectedFiles } = useMediaGallery();

// Filter by type
updateFilter({ type: 'image' });

// Sort by date
updateFilter({ sortBy: 'date' });

// Search
updateFilter({ searchTerm: 'vacation' });
```

### Sending Messages

```typescript
const handleSendMessage = async (content: string, attachments?: MediaFile[]) => {
  const response = await fetch('/api/phase6/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      conversationId: conversation.id,
      senderId: currentUserId,
      content,
      mediaAttachments: attachments,
      timestamp: new Date().toISOString(),
    }),
  });

  if (!response.ok) throw new Error('Failed to send message');
  return response.json();
};
```

## Styling Customization

All components use `styled-components`. To customize:

```typescript
import styled from 'styled-components';
import { MediaUploadComponent as BaseUpload } from '@/components/Phase6';

const CustomContainer = styled.div`
  background-color: #your-color;
  padding: 20px;
`;

export const CustomMediaUpload = () => (
  <CustomContainer>
    <BaseUpload {...props} />
  </CustomContainer>
);
```

## Integration with Redux

Store Phase 6 data in Redux:

```typescript
// slices/phase6Slice.ts
import { createSlice } from '@reduxjs/toolkit';

const phase6Slice = createSlice({
  name: 'phase6',
  initialState: {
    messages: [],
    attachments: [],
    searchResults: [],
    dashboardStats: null,
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addAttachment: (state, action) => {
      state.attachments.push(action.payload);
    },
    // ... more reducers
  },
});

export default phase6Slice.reducer;
```

Use in components:

```typescript
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '@/slices/phase6Slice';

const MyComponent = () => {
  const dispatch = useDispatch();
  const messages = useSelector(state => state.phase6.messages);

  const handleSendMessage = async content => {
    const response = await fetch('/api/phase6/messages', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    dispatch(setMessages(response.json()));
  };
};
```

## API Integration Template

```typescript
// services/phase6.service.ts
export class Phase6Service {
  async uploadMedia(file: File, conversationId?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (conversationId) {
      formData.append('conversationId', conversationId);
    }
    const response = await fetch('/api/phase6/media/upload', {
      method: 'POST',
      body: formData,
    });
    return response.json();
  }

  async sendMessage(conversationId: string, content: string, attachments?: MediaFile[]) {
    return fetch('/api/phase6/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId,
        content,
        mediaAttachments: attachments,
      }),
    }).then(r => r.json());
  }

  async search(query: string, filters?: SearchFilters) {
    const params = new URLSearchParams({ q: query });
    if (filters?.type) params.append('type', filters.type);
    return fetch(`/api/phase6/search?${params}`).then(r => r.json());
  }

  // ... more methods
}

export const phase6Service = new Phase6Service();
```

## Troubleshooting

### Components Not Rendering

- Ensure all imports are correct
- Check that `styled-components` is installed
- Verify file paths match your project structure

### Upload Failures

- Check file size limits (default 50MB)
- Verify MIME type is in allowedTypes
- Check backend API is responding

### Search Not Working

- Verify query parameter is not empty
- Check backend search endpoint is implemented
- Review SearchFilters type for valid filters

### Dashboard Not Showing Data

- Ensure stats object is provided
- Check metrics array is not empty
- Verify refresh handler is implemented

## Performance Tips

1. **Memoize Components**

   ```typescript
   const MemoizedUpload = React.memo(MediaUploadComponent);
   ```

2. **Debounce Search**
   - Already implemented in SearchComponent
   - Default debounce: 300ms

3. **Virtual Scrolling**

   ```typescript
   // For large message lists
   import { FixedSizeList } from 'react-window';
   ```

4. **Image Optimization**
   - Use thumbnails in previews
   - Lazy load media attachments

## Testing Components

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MediaUploadComponent } from '@/components/Phase6';

describe('MediaUploadComponent', () => {
  it('should upload file on drop', async () => {
    const onComplete = jest.fn();
    render(<MediaUploadComponent onUploadComplete={onComplete} />);

    // Simulate drop
    // Assert upload called
  });
});
```

## Examples Repository

Check `/docs` folder for:

- Full integration examples
- API mock responses
- Test data samples
- Styling variations

## Next Features

Coming in Phase 6C:

- Voice recording component
- Emoji reaction system
- Rich text editor
- Message templates
- Auto-reply rules

---

**Ready to integrate?** Start with `MediaUploadComponent`, then add other features gradually!

**Questions?** Check the full guide: `PHASE6B_UI_ENHANCEMENTS_GUIDE.md`
