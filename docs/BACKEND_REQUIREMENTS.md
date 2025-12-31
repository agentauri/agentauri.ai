# Backend API Requirements

> Document for BE Team - Generated: 2025-12-30

## Current Issue

The frontend dashboard is experiencing **503 Service Unavailable** errors on several endpoints. The frontend is correctly proxying requests to `http://localhost:8080` via Next.js rewrites.

### Investigation Summary

| Endpoint | HTTP Status | Frontend Behavior |
|----------|-------------|-------------------|
| `GET /api/v1/auth/me` | **200 OK** | Working |
| `GET /api/v1/organizations` | **200 OK** | Working |
| `GET /api/v1/organizations/{id}/api-keys` | **200 OK** | Working |
| `GET /api/v1/organizations/{id}/triggers` | **503** | Error displayed |
| `GET /api/v1/events` | **503** | Error displayed |
| `GET /api/v1/organizations/{id}/agents` | **503** | Error displayed |
| `GET /api/v1/organizations/{id}/credits/balance` | **503** | Error displayed |
| `GET /api/v1/organizations/{id}/credits/transactions` | **503** | Error displayed |

---

## Required API Endpoints

All endpoints use base path `/api/v1/`. Authentication is via HTTP-only JWT cookies.

### Authentication (`/auth/*`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/nonce` | Get SIWE nonce for wallet signing |
| POST | `/auth/wallet` | Wallet login (address, signature, message) |
| POST | `/auth/login` | Classic email/password login |
| POST | `/auth/logout` | Logout and clear session |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/exchange` | OAuth code exchange |
| GET | `/auth/me` | Get current user session |

### Organizations (`/organizations/*`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/organizations` | List user's organizations |
| GET | `/organizations/{id}` | Get organization details |
| POST | `/organizations` | Create new organization |
| PATCH | `/organizations/{id}` | Update organization |
| DELETE | `/organizations/{id}` | Delete organization |
| GET | `/organizations/{id}/members` | List organization members |
| POST | `/organizations/{id}/members` | Add member to organization |
| PATCH | `/organizations/{id}/members/{memberId}` | Update member role |
| DELETE | `/organizations/{id}/members/{memberId}` | Remove member |
| POST | `/organizations/{id}/leave` | Leave organization |

### Triggers (`/triggers/*`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/organizations/{orgId}/triggers` | List org triggers (with filters) |
| GET | `/triggers/{triggerId}` | Get trigger details |
| POST | `/organizations/{orgId}/triggers` | Create trigger |
| PATCH | `/triggers/{triggerId}` | Update trigger |
| DELETE | `/triggers/{triggerId}` | Delete trigger |
| POST | `/triggers/{triggerId}/enable` | Enable trigger |
| POST | `/triggers/{triggerId}/disable` | Disable trigger |
| POST | `/triggers/{triggerId}/test` | Test trigger execution |

### Events (`/events/*`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/events` | List blockchain events (with filters) |
| GET | `/events/{eventId}` | Get event details |

**Query Parameters:**
- `page`, `limit` - Pagination
- `chainId` - Filter by chain
- `registry` - Filter by registry (e.g., "agent-registry")
- `eventType` - Filter by event type
- `agentId` - Filter by agent ID
- `search` - Full-text search

### Agents (`/organizations/{orgId}/agents/*`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/organizations/{orgId}/agents` | List linked agents |
| GET | `/organizations/{orgId}/agents/{address}` | Get agent details |
| POST | `/organizations/{orgId}/agents` | Link new agent |
| DELETE | `/organizations/{orgId}/agents/{address}` | Unlink agent |

**Query Parameters:**
- `chainId` - Filter by chain
- `search` - Search by address or ID

### API Keys (`/api-keys/*`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/organizations/{orgId}/api-keys` | List API keys |
| GET | `/organizations/{orgId}/api-keys/stats` | Get API key usage stats |
| GET | `/api-keys/{keyId}` | Get key details |
| POST | `/organizations/{orgId}/api-keys` | Create API key |
| PATCH | `/api-keys/{keyId}` | Update API key |
| DELETE | `/api-keys/{keyId}` | Delete API key |
| POST | `/api-keys/{keyId}/regenerate` | Regenerate key |

### Billing (`/organizations/{orgId}/credits/*`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/organizations/{orgId}/credits/balance` | Get credit balance |
| GET | `/organizations/{orgId}/credits/transactions` | List transactions |
| POST | `/organizations/{orgId}/credits/checkout` | Create checkout session |
| GET | `/organizations/{orgId}/subscriptions` | List subscriptions |
| DELETE | `/subscriptions/{subscriptionId}` | Cancel subscription |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check endpoint |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/me` | Get current user |
| PATCH | `/users/me` | Update current user |

### CSRF

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/csrf-token` | Get CSRF token for mutations |

---

## Response Format

All endpoints should return JSON with this structure:

```json
// Success (list)
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "hasMore": true
  }
}

// Success (single item)
{
  "data": {...}
}

// Error
{
  "message": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": {...}
}
```

---

## Configuration

### Environment Variables

Frontend expects backend at:
- **Development:** `http://localhost:8080`
- **Production:** `https://api.agentauri.ai`

Set via `NEXT_PUBLIC_API_BASE_URL` in `.env`.

### CORS

Backend must allow:
- Origin: `http://localhost:8004` (dev) / `https://agentauri.ai` (prod)
- Credentials: `true`
- Headers: `Content-Type`, `Accept`, `X-CSRF-Token`

### Authentication

- JWT stored in HTTP-only cookie
- Cookie name: `access_token` (assumed)
- Refresh token in separate HTTP-only cookie
- CSRF token required for state-changing requests

---

## Priority Endpoints (Currently Failing)

These endpoints return 503 and need to be implemented/fixed:

1. **`GET /api/v1/organizations/{id}/triggers`** - Triggers list
2. **`GET /api/v1/events`** - Events list
3. **`GET /api/v1/organizations/{id}/agents`** - Agents list
4. **`GET /api/v1/organizations/{id}/credits/balance`** - Credit balance
5. **`GET /api/v1/organizations/{id}/credits/transactions`** - Transaction history

---

## Questions for BE Team

1. Is the backend service running on `localhost:8080`?
2. Are these endpoints implemented but not exposed?
3. Is there a service discovery or routing issue?
4. Are the Ponder indexers running for blockchain data?
5. What is the expected timeline to have these endpoints available?

---

*This document was auto-generated from frontend API client analysis.*
