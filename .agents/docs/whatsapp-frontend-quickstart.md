# WhatsApp Frontend Quick Start Guide

## Phase 4 Quick Test

Get the WhatsApp Dashboard up and running in minutes.

## Prerequisites

✅ Node.js installed
✅ Backend API running (from Phase 3)
✅ Project dependencies installed

## Quick Setup (5 minutes)

### 1. Verify Backend is Running

```powershell
# Check if backend API is accessible
curl http://localhost:5000/api/whatsapp/accounts

# Should return: {"success": true, "data": {"accounts": []}}
```

### 2. Start Frontend Dev Server

```powershell
npm run dev

# You should see output like:
# VITE v4.x.x  ready in 200 ms
# ➜  Local:   http://localhost:5173/
```

### 3. Open WhatsApp Dashboard

Visit: **http://localhost:5173/whatsapp**

(Or navigate from your app's sidebar once integrated)

## What You'll See

### First Load
- Account linking screen (if no accounts linked)
- OR chat interface (if account already linked)

### Account Linking Flow
1. **Select Account** - Choose from available accounts
2. **Enter Phone Number** - Your WhatsApp phone
3. **Scan QR Code** - Use WhatsApp Web
4. **Verify Code** - 6-digit authentication code
5. **Success** - Account linked and ready!

### Chat Interface
- **Left Sidebar** - List of conversations
- **Main Area** - Selected conversation messages
- **Bottom** - Message composer
- **Top Buttons** - Phone, video, settings

### Navigation Tabs
- **💬 Chat** - Main messaging interface
- **📊 Analytics** - Message statistics
- **⚙️ Settings** - Account settings
- **👤 Account** - Account information

## Testing Workflows

### Test 1: Account Linking (10 minutes)

```
1. Click "Start Linking" button
   ✅ Should show "Generating QR Code..."
   
2. Wait for QR code to appear
   ✅ Should display QR code image
   
3. Click "Enter Auth Code"
   ✅ Should show auth code input
   
4. Enter 6-digit code
   ✅ Should accept numeric input only
   
5. Click "Confirm Linking"
   ✅ Should show "Account linked successfully!"
   ✅ Should redirect to chat interface
```

### Test 2: View Conversations (5 minutes)

```
1. Go to 💬 Chat tab
   ✅ Should show conversation list
   
2. Search for a contact
   ✅ Should filter conversations
   
3. Click a conversation
   ✅ Should load message history
   ✅ Should show contact details
```

### Test 3: Send Message (5 minutes)

```
1. Select a conversation
   ✅ Should show chat window
   
2. Type a message
   ✅ Input should appear in composer
   
3. Click send button
   ✅ Should show "Sending..." indicator
   ✅ Message should appear in chat
   ✅ Should show timestamp
```

### Test 4: View Analytics (5 minutes)

```
1. Go to 📊 Analytics tab
   ✅ Should show metrics cards
   
2. Select date range
   ✅ Should show date pickers
   
3. Click "Apply Filter"
   ✅ Should load new data
   
4. Click "Export CSV"
   ✅ Should download CSV file
```

### Test 5: Switch Accounts (5 minutes)

```
1. Go to 👤 Account tab
   ✅ Should show account info
   
2. (If multiple accounts)
   ✅ Should show account switcher
   ✅ Should load conversations for selected account
```

## Common Issues & Fixes

### Issue: "Failed to connect"
```
❌ Backend not running
✅ Solution: Start backend with: npm run backend

❌ Wrong API URL
✅ Solution: Check VITE_API_BASE_URL in .env

❌ CORS error
✅ Solution: Backend CORS config in Phase 3
```

### Issue: "QR Code not showing"
```
❌ Session expired
✅ Solution: Click "Try Again"

❌ Browser cache
✅ Solution: Press Ctrl+Shift+R (hard refresh)

❌ Backend error
✅ Solution: Check backend logs
```

### Issue: "Messages not loading"
```
❌ Wrong conversation selected
✅ Solution: Select valid conversation

❌ Network timeout
✅ Solution: Check internet connection

❌ Account not connected
✅ Solution: Check account status in Account tab
```

### Issue: "Can't send message"
```
❌ Message is empty
✅ Solution: Type message first

❌ Account disconnected
✅ Solution: Reconnect account

❌ Recipient offline
✅ Solution: Wait for recipient to come online
```

## Environment Variables

Create or update `.env` in project root:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000
VITE_WS_BASE_URL=ws://localhost:5000

# Optional: API Key (if required)
VITE_WHATSAPP_API_KEY=your_api_key

# Optional: Debug mode
VITE_DEBUG=false
```

## Browser Console Debugging

### View API Calls
```javascript
// Open DevTools (F12)
// Go to Network tab
// Look for requests to /api/whatsapp/
```

### Check Component State
```javascript
// Use React DevTools extension
// Inspect component props and hooks
```

### View Errors
```javascript
// Go to Console tab
// Look for error messages and stack traces
```

## Performance Checklist

- ✅ Conversations load in < 1 second
- ✅ Messages load in < 2 seconds
- ✅ Sending message: < 1 second
- ✅ Analytics load in < 2 seconds
- ✅ Search results appear as you type
- ✅ No console errors
- ✅ Memory usage stable (< 100MB)

## Feature Checklist

### Core Features
- ✅ Account linking and unlinking
- ✅ View conversations
- ✅ Send messages
- ✅ View message history
- ✅ Search conversations
- ✅ Mark as read
- ✅ View analytics
- ✅ Export data

### UI Features
- ✅ Responsive design
- ✅ Error messages
- ✅ Loading states
- ✅ Empty states
- ✅ Success confirmations
- ✅ Input validation
- ✅ Character limits
- ✅ Timestamp formatting

## Next Steps

### If Everything Works ✅
1. Integration test with app router
2. Run full test suite
3. Performance testing
4. Deployment testing

### If Issues Found ❌
1. Check backend logs
2. Verify API endpoints responding
3. Check browser console for errors
4. Verify data format matches expectations

## Useful Commands

```powershell
# Start development server
npm run dev

# Build for production
npm run build

# Run tests (when available)
npm run test

# Type check
npm run type-check

# Lint code
npm run lint

# Start backend (from backend folder)
npm start

# View backend logs
npm run logs
```

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Testing with Production Build

```powershell
# Build production version
npm run build

# Preview build locally
npm run preview

# Should be available at http://localhost:4173/whatsapp
```

## Quick Reference

| Feature | Path | Status |
|---------|------|--------|
| Account Link | `/whatsapp` (no account) | ✅ |
| Chat | `/whatsapp?tab=chat` | ✅ |
| Analytics | `/whatsapp?tab=analytics` | ✅ |
| Settings | `/whatsapp?tab=settings` | ⚙️ |
| Account | `/whatsapp?tab=account` | ✅ |

## API Endpoints Tested

### Account Endpoints
- [x] GET /api/whatsapp/accounts
- [x] POST /api/whatsapp/accounts/:id/link/initiate
- [x] POST /api/whatsapp/accounts/:id/link/confirm
- [x] POST /api/whatsapp/accounts/:id/connect
- [x] POST /api/whatsapp/accounts/:id/disconnect

### Conversation Endpoints
- [x] GET /api/whatsapp/accounts/:id/conversations
- [x] GET /api/whatsapp/accounts/:id/conversations/:cid/messages
- [x] POST /api/whatsapp/accounts/:id/messages
- [x] PUT /api/whatsapp/accounts/:id/conversations/:cid/read

### Analytics Endpoints
- [x] GET /api/whatsapp/accounts/:id/analytics
- [x] GET /api/whatsapp/accounts/:id/export

## Support & Documentation

- Full Guide: `WHATSAPP_FRONTEND_GUIDE.md`
- Phase Summary: `PHASE4_COMPLETION_SUMMARY.md`
- Backend Guide: `WHATSAPP_SETUP_GUIDE.md`

## Quick Troubleshooting Tree

```
Is backend running?
├─ No → Start backend (npm run backend)
└─ Yes ↓

Can you access API?
├─ No → Check API_BASE_URL in .env
└─ Yes ↓

Do you see account linking?
├─ No → No accounts linked (normal first time)
└─ Yes ↓

Can you link account?
├─ No → Check QR code display, try auth code
└─ Yes ↓

Can you see conversations?
├─ No → Check backend has conversations
└─ Yes ↓

Can you send messages?
├─ No → Check account connected, try reconnect
└─ Yes → ✅ Everything working!
```

---

**Phase 4 Frontend**: Ready for testing! 🚀

**Status**: All components scaffolded and ready
**Time to full integration**: 2-4 hours
**Support**: Check documentation or backend logs
