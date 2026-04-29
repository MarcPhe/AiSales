# System Architecture Overview

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     AI Sales Bot System                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────┐      ┌──────────────┐
│   React App      │◄────────┤  Express API │◄─────┤  Supabase    │
│  (Frontend)      │  HTTP   │  (Backend)   │      │  (Database)  │
│                  │         │              │      │              │
│ • Login Page     │         │ • Auth API   │      │ • Users      │
│ • Register Page  │         │ • Chat API   │      │ • Comms      │
│ • Dashboard      │         │ • Msg API    │      │ • Messages   │
│ • Chat Widget    │         │              │      │ • Leads      │
└──────────────────┘         └──────┬───────┘      └──────────────┘
                                    │
                            ┌───────┴────────┐
                            │    OpenAI      │
                            │  GPT-4 mini    │
                            │    (Chat AI)   │
                            └────────────────┘
```

## Data Flow Diagram

### Registration Flow
```
User Input (Email, Password, Company)
        ↓
Browser → POST /register
        ↓
Backend: Hash password with bcryptjs
        ↓
Insert into users table
        ↓
Generate JWT token
        ↓
Return token + user data
        ↓
Store in localStorage
        ↓
Redirect to Dashboard
```

### Login Flow
```
User Input (Email, Password)
        ↓
Browser → POST /login
        ↓
Backend: Find user by email
        ↓
Verify password hash matches
        ↓
Generate JWT token
        ↓
Return token + user data
        ↓
Store in localStorage
        ↓
Redirect to Dashboard
```

### Communication Flow
```
User on Dashboard
        ↓
Wants to interact with customers
        ↓
Chat Widget (on external site) → POST /start-communication
        ↓
Backend: Creates communication record linked to user
        ↓
Returns communication_id
        ↓
Chat widget uses ID for future messages
```

### Chat Flow
```
Customer types message in widget
        ↓
Browser → POST /message
        ↓
Backend: Saves user message to DB
        ↓
Detects lead (email or "price" keyword)
        ↓
Calls OpenAI API with message history
        ↓
Gets AI response
        ↓
Saves AI response to DB
        ↓
Returns response to customer
        ↓
Dashboard auto-refreshes to show new messages
```

## Component Hierarchy

```
App.jsx (Main Router)
├── Login.jsx (Authentication Page)
├── Register.jsx (Registration Page)
└── Dashboard.jsx (User Dashboard)
    ├── Header
    │   ├── User Info
    │   └── Logout Button
    └── Content
        ├── Communications List
        │   └── Communication Items
        └── Communication Details
            ├── Conversation Info
            └── Messages List
                └── Individual Messages

External Websites
├── ChatWidget.jsx (Standalone Widget)
└── EmbedWidget.jsx (Floating Button)
    └── ChatWidget.jsx (Opens on click)
```

## Authentication Flow

```
┌─────────────────────────────────────────────────────────┐
│              JWT Token Authentication                    │
└─────────────────────────────────────────────────────────┘

1. Login/Register:
   User sends email/password → Backend generates JWT → Sent to client

2. Token Storage:
   Client stores JWT in localStorage: { token: 'eyJhbGc...' }

3. API Requests:
   Client sends: Authorization: Bearer eyJhbGc...
   
4. Backend Verification:
   Middleware verifies token signature
   If valid: allows request
   If invalid: returns 401 Unauthorized

5. Token Expiration:
   Default: 7 days
   After expiration: User must login again

6. Logout:
   Client removes token from localStorage
   All subsequent requests will be 401
   User redirected to login page
```

## Database Schema

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (UUID) ✓     │
│ email (str) ✓   │
│ password_hash   │
│ company_name    │
│ created_at      │
└────────┬────────┘
         │
         │1:N
         ↓
┌─────────────────────────┐
│   communications        │
├─────────────────────────┤
│ id (UUID) ✓             │
│ user_id (UUID) ✓ FK     │
│ client_id (str)         │
│ created_at              │
│ updated_at              │
└────────┬────────────────┘
         │
         │1:N          1:N
         ├──────┬──────┤
         ↓      ↓
    ┌────────────────┐  ┌────────────┐
    │    messages    │  │   leads    │
    ├────────────────┤  ├────────────┤
    │ id (UUID) ✓    │  │ id (UUID)  │
    │ comm_id ✓ FK   │  │ comm_id FK │
    │ role (str)     │  │ email      │
    │ content (txt)  │  │ created_at │
    │ created_at     │  └────────────┘
    └────────────────┘

✓ = Primary Key
FK = Foreign Key
```

## Security Architecture

```
┌──────────────────────────────────────┐
│      Security Layers                 │
└──────────────────────────────────────┘

Layer 1: Password Security
  ├── Hashed with bcryptjs (10 salt rounds)
  ├── Never stored in plaintext
  └── Verified on login

Layer 2: Token Security
  ├── JWT with HS256 algorithm
  ├── Signed with JWT_SECRET
  ├── Includes user ID and email
  └── Expires after 7 days

Layer 3: API Authentication
  ├── All routes require valid token
  ├── Token verified middleware
  ├── Returns 401 if invalid
  └── User isolated data access

Layer 4: Database Security
  ├── Supabase Row Level Security
  ├── Communications linked to users
  ├── Users can only see own data
  └── Foreign key constraints

Layer 5: Communication Security
  ├── HTTPS recommended for production
  ├── CORS enabled for trusted domains
  ├── No sensitive data in URLs
  └── Tokens only in Authorization header
```

## Request/Response Examples

### Register Request
```json
POST /register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "company_name": "Acme Corp"
}

Response (201):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "company_name": "Acme Corp"
  }
}
```

### Send Message Request
```json
POST /message
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "client_id": "website-client-123",
  "communication_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "What is your pricing?"
}

Response (200):
{
  "reply": "Our pricing starts at $99/month for the basic plan..."
}
```

## State Management

```
Redux (Not Used - Simple State)

Component State (React Hooks):
├── App.jsx
│   ├── page (login/register/dashboard)
│   ├── user (user data)
│   └── loading
│
├── Dashboard.jsx
│   ├── communications (list)
│   ├── selectedCommunication
│   ├── messages (of selected)
│   ├── loading
│   └── error
│
├── ChatWidget.jsx
│   ├── messages
│   ├── input
│   ├── communicationId
│   ├── loading
│   └── error
│
├── Login.jsx
│   ├── email
│   ├── password
│   ├── error
│   └── loading
│
└── Register.jsx
    ├── email
    ├── password
    ├── confirmPassword
    ├── companyName
    ├── error
    └── loading
```

## Performance Considerations

```
Optimization Strategies:

Frontend:
  ├── Lazy loading components (React.lazy)
  ├── Memoization (useMemo, useCallback)
  ├── Code splitting with Vite
  ├── CSS-in-JS for dynamic styles
  └── Responsive images

Backend:
  ├── Message pagination (limit 5 for context)
  ├── Database indexing on foreign keys
  ├── JWT token validation (fast)
  ├── OpenAI API caching (store responses)
  └── Connection pooling

Database:
  ├── Composite indexes
  ├── Partitioning by user_id
  ├── Archive old messages
  └── Regular backups

Caching:
  ├── localStorage for auth tokens
  ├── Session storage for temp data
  ├── Browser cache for static assets
  └── Supabase query caching
```

## Scalability Path

```
Current Architecture → Scalable Architecture

Basic (Current):
  Single Node.js server
  Single Supabase instance
  Single OpenAI API account
  
Growth Stage 1 (100-1000 users):
  ├── Load balancer (multiple servers)
  ├── Database read replicas
  ├── Redis caching layer
  ├── API rate limiting
  └── Message queue for async tasks

Growth Stage 2 (1000+ users):
  ├── Kubernetes deployment
  ├── Database sharding
  ├── CDN for static assets
  ├── Microservices architecture
  └── Separate analytics service
```

This architecture diagram shows how all components work together to create a scalable, secure AI sales bot system.
