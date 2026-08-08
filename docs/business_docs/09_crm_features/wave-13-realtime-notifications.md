# Wave 13 — Real-Time Notifications: Socket.io + NotificationService

<!-- markdownlint-disable MD032 MD040 MD060 -->

**Drafted by:** @Socket  
**Model:** Llama 3.1 70B via Groq  
**Status:** ✅ READY (retrospective spec for implemented Wave 13)  
**Last Updated:** 2026-05-25  
**Next Review:** 2026-08-21  
**Source of Truth:** CRM Wave 13 real-time notifications feature specification (business layer)

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/non-functional-requirements.md`](../05_requirements/non-functional-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend notifications/reliability lanes in `docs/plans/waves/WAVE_39_*` and `WAVE_40_*`

CONSUMES←@Mira: `server/services/NotificationService.ts`, `server/services/socketServer.ts`  
FEEDS→@Katherine: `business_docs/09_crm_features/wave-13-realtime-notifications.md#acceptance-criteria`  
FEEDS_ACK←@Katherine: accepted | `business_docs/09_crm_features/wave-13-realtime-notifications.md`

---

## 1. Overview

Wave 13 adds real-time push notifications to the White Caves CRM using Socket.io. The architecture combines a persistent WebSocket connection with a database-backed notification store, so notifications survive page refreshes and are available to clients that were offline when the event occurred.

---

## 2. Architecture

```
CRM Event (lead created, payment received, etc.)
  → notificationService.pushToUser(input)
     → Prisma: INSERT into notifications table
     → getSocketServer()?.emitNotification(payload)
        → Socket.io: emit to room `user:{userId}`
           → Frontend: toast popup + notification bell badge
```

---

## 3. SocketServer (`server/services/socketServer.ts`)

### 3.1 Initialisation

```typescript
initSocketServer(httpServer: http.Server): SocketServer
getSocketServer(): SocketServer | null
```

The socket server is initialised once at Express startup and stored in a module-level singleton. `getSocketServer()` returns `null` if not yet initialised (safe to call anywhere).

### 3.2 Authentication

Every socket connection must present a valid JWT in the handshake query:

```
ws://host/socket.io?token={JWT}
```

The auth middleware decodes the token, extracts `userId`, and joins the socket to the room `user:{userId}`. Connections with invalid/missing tokens are disconnected immediately.

### 3.3 Room Strategy

| Room Name | Members | Purpose |
|-----------|---------|---------|
| `user:{userId}` | Single user's sockets | Personal notifications |
| `role:{roleName}` | All sockets with that role | Broadcast to a role group (future) |

### 3.4 `emitNotification` Payload

```typescript
interface NotificationPayload {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
}
```

---

## 4. NotificationService (`server/services/NotificationService.ts`)

### 4.1 `pushToUser`

```typescript
interface PushNotificationInput {
  userId: string;
  title: string;
  message: string;
  type?: NotificationKind;       // default 'info'
  channel?: 'in_app' | 'email' | 'whatsapp';  // default 'in_app'
  metadata?: Record<string, unknown> | null;
}
```

**Flow:**
1. `prisma.notification.create(...)` — persists to database
2. `getSocketServer()?.emitNotification(...)` — live push to connected socket(s)
3. If Socket.io emit fails, the database record still exists; client fetches on next poll/load

### 4.2 NotificationKind

```typescript
type NotificationKind =
  | 'info' | 'success' | 'warning' | 'error'
  | 'lead' | 'property' | 'commission' | 'system';
```

---

## 5. Database Schema

```
notifications
  id          String   @id @default(cuid())
  userId      String
  title       String
  message     String
  type        String   // NotificationKind
  channel     String   // 'in_app' | 'email' | 'whatsapp'
  read        Boolean  @default(false)
  metadata    Json?
  createdAt   DateTime @default(now())
```

---

## 6. HTTP REST Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/notifications` | authenticated | List user's notifications (paginated) |
| `PATCH` | `/api/notifications/:id/read` | authenticated | Mark one as read |
| `PATCH` | `/api/notifications/read-all` | authenticated | Mark all as read |
| `DELETE` | `/api/notifications/:id` | authenticated | Delete one notification |

---

## 7. Frontend Integration Points

| Event | Socket Event Name | Handler |
|-------|------------------|---------|
| New notification | `notification` | Show toast + increment bell badge |
| System broadcast | `system_alert` | Full-screen alert modal (future) |
| Connection status | `connect` / `disconnect` | Show/hide "live" indicator |

---

## 8. Failure Handling

| Scenario | Behaviour |
|----------|-----------|
| Socket server not initialised | `getSocketServer()` returns `null`; notification saved to DB only |
| User has no active socket | Notification persisted; delivered on next page load via REST |
| Prisma insert fails | Logged at `warn`; no socket emit attempted |
| Invalid JWT on connect | Socket disconnected; `401` event emitted |

---

## 9. Acceptance Criteria

- [x] JWT-authenticated socket connections join `user:{userId}` room
- [x] `pushToUser` persists notification + emits to socket room
- [x] REST endpoints return notifications for authenticated user only
- [x] `read` / `read-all` updates reflected immediately in REST response
- [x] No crash when socket server is not yet initialised
- [x] Notification type colours map correctly in frontend (`success` = green, `error` = red, etc.)
