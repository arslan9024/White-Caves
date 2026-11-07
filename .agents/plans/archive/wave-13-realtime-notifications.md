# Wave 13: Realtime Notifications

## 1. Socket Authentication
- All WebSocket connections must authenticate using a JWT token attached to the `Authorization` header during the HTTP handshake upgrade.
- The `SocketServer` validates the token against the JWT secret. Invalid connections are rejected with a 401 response.

## 2. Room Strategy
- **Global Broadcasts**: `room:global` (used for system-wide alerts, e.g., maintenance).
- **Role-based Broadcasts**: `room:role:agent`, `room:role:admin` (used for role-specific announcements).
- **User-specific**: `room:user:{userId}` (used for targeted notifications like lead assignments or personal SLA warnings).
- **Entity-specific**: `room:property:{propertyId}` (used for live collaboration on a specific property document).

## 3. Push Event Contracts
| Event Name | Payload | Room Target |
|---|---|---|
| `notification:new` | `{ id, title, message, type, link }` | `user:{userId}` |
| `lead:assigned` | `{ leadId, leadName, source }` | `user:{userId}` |
| `system:alert` | `{ level, message }` | `global` |
