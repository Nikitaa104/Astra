# 🏗️ Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT BROWSER                              │
│                  (http://localhost:5173)                         │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         React Frontend (React 19 + TypeScript)           │   │
│  │                                                           │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │   │
│  │  │ Landing  │  │Dashboard │  │ Settings │ ...         │   │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘              │   │
│  │       └───────────┬──────────────┬─────────┘             │   │
│  │                   ▼              ▼                        │   │
│  │         ┌─────────────────────────────┐                 │   │
│  │         │   API Service Layer (api.ts)│                 │   │
│  │         │  - JWT Token Management     │                 │   │
│  │         │  - Error Handling           │                 │   │
│  │         │  - HTTP Requests            │                 │   │
│  │         └────────────┬────────────────┘                 │   │
│  │                      │                                   │   │
│  └──────────────────────┼───────────────────────────────────┘   │
│                         │                                         │
│                         │ HTTP/HTTPS                             │
│                         │ JWT Bearer Token                       │
│                         │ CORS Enabled                           │
│                         │                                         │
└────────────────────────┼─────────────────────────────────────────┘
                         │
                         │ http://localhost:5000
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NODE.JS BACKEND                               │
│                  (http://localhost:5000)                         │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Express.js API Server                       │   │
│  │                                                           │   │
│  │  ┌─────────────────────────────────────────────┐         │   │
│  │  │ Middleware Layer                            │         │   │
│  │  │ - CORS Handling                             │         │   │
│  │  │ - JWT Verification                          │         │   │
│  │  │ - Request Logging                           │         │   │
│  │  │ - Error Handling                            │         │   │
│  │  └──────────────┬───────────────────────────────┘         │   │
│  │                 ▼                                          │   │
│  │  ┌─────────────────────────────────────────────┐         │   │
│  │  │ Routes Layer                                │         │   │
│  │  │ - /api/auth/*                               │         │   │
│  │  │ - /api/users/*                              │         │   │
│  │  │ - /api/devices/*                            │         │   │
│  │  │ - /api/sos/*                                │         │   │
│  │  │ - /api/alerts/*                             │         │   │
│  │  └──────────────┬───────────────────────────────┘         │   │
│  │                 ▼                                          │   │
│  │  ┌─────────────────────────────────────────────┐         │   │
│  │  │ Controllers Layer                           │         │   │
│  │  │ - AuthController                            │         │   │
│  │  │ - UserController                            │         │   │
│  │  │ - DeviceController                          │         │   │
│  │  │ - SOSController                             │         │   │
│  │  │ - AlertController                           │         │   │
│  │  └──────────────┬───────────────────────────────┘         │   │
│  │                 ▼                                          │   │
│  │  ┌─────────────────────────────────────────────┐         │   │
│  │  │ Models Layer (Mongoose Schemas)             │         │   │
│  │  │ - User Model                                │         │   │
│  │  │ - Device Model                              │         │   │
│  │  │ - Alert Model                               │         │   │
│  │  └──────────────┬───────────────────────────────┘         │   │
│  │                 │                                          │   │
│  └─────────────────┼──────────────────────────────────────────┘   │
│                    │                                              │
│                    │ Database Queries                            │
│                    │ (Mongoose)                                  │
│                    ▼                                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │          MongoDB Database                                │   │
│  │                                                           │   │
│  │  Collections:                                            │   │
│  │  - users (authentication & profiles)                     │   │
│  │  - devices (paired wearables)                            │   │
│  │  - alerts (SOS events)                                   │   │
│  │  - contacts (emergency contacts)                         │   │
│  │                                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: User Login

```
1. User enters email/password
   └─ Frontend Component (Landing.tsx)
   
2. Calls api.login(email, password)
   └─ api.ts makes POST request to /api/auth/login
   
3. Backend receives request
   ├─ Middleware verifies CORS
   ├─ AuthController handles request
   ├─ Queries User model in MongoDB
   └─ Compares password with bcrypt
   
4. Server returns JWT token + user data
   └─ api.ts receives response
   
5. Frontend stores token
   ├─ Save to localStorage (astra_token)
   ├─ Save user data (astra_user)
   └─ Set Auth state
   
6. Frontend redirects to Dashboard
   └─ All subsequent requests include JWT in header
```

---

## Data Flow: Get Contacts

```
1. Contacts page loads (useEffect)
   └─ Calls api.getContacts()
   
2. api.ts makes HTTP GET request
   ├─ URL: http://localhost:5000/api/users/me/contacts
   ├─ Headers: {Authorization: "Bearer <JWT>"}
   └─ Method: GET
   
3. Backend receives request
   ├─ CORS middleware allows request
   ├─ JWT middleware verifies token
   ├─ Gets userId from token
   ├─ UserController queries MongoDB
   ├─ Mongoose finds user's contacts
   └─ Returns JSON array
   
4. Frontend receives response
   ├─ HTTP status 200
   ├─ JSON body: [{id, name, phone, ...}]
   └─ api.ts returns data
   
5. Component updates state
   ├─ setContacts(data)
   └─ React re-renders UI
```

---

## API Call Pattern

```
Frontend Component
    ↓
    try {
        const data = await api.getContacts();
        setContacts(data);
    } catch (error) {
        console.error('Failed:', error);
    }
    ↓
api.ts (HTTP Layer)
    ↓
    fetch(
        url: string,
        method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
        headers: { Authorization, Content-Type },
        body: JSON (if needed)
    )
    ↓
HTTP Request
    ↓ (Network)
    ↓
Backend Express Server
    ↓
    CORS Middleware → JWT Middleware → Route Handler
    ↓
    Controller
    ↓
    MongoDB Query
    ↓
    Response
    ↓ (Network)
    ↓
HTTP Response
    ↓
api.ts (Parse & Handle)
    ↓
Frontend Component (Update UI)
```

---

## Authentication Flow

```
┌─────────────────────┐
│   User Not Login    │
│   (Landing Page)    │
└──────────┬──────────┘
           │
           │ user clicks "Login"
           ▼
┌─────────────────────────────────────┐
│ POST /api/auth/login                │
│ {email, password}                   │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ Backend Verification                │
│ 1. Find user by email               │
│ 2. Compare password (bcrypt)        │
│ 3. Generate JWT token               │
└──────────┬──────────────────────────┘
           │
           ▼ Success
┌─────────────────────────────────────┐
│ Return {user, token}                │
│ Status 200 OK                       │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ Frontend Stores Token               │
│ localStorage.setItem('astra_token') │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ User Logged In                      │
│ (Dashboard)                         │
│ All requests now include JWT        │
└─────────────────────────────────────┘
```

---

## Protected API Request Pattern

```
┌──────────────────────────┐
│  Frontend Component      │
│  Calls api.getProfile()  │
└───────────┬──────────────┘
            │
            ▼
┌──────────────────────────────────────┐
│ api.ts Creates Headers               │
│ {                                    │
│   "Content-Type": "application/json",│
│   "Authorization": "Bearer <token>"  │
│ }                                    │
└───────────┬───────────────────────────┘
            │
            ▼ HTTP GET
┌──────────────────────────────────────┐
│ Backend Routes                       │
│ GET /api/users/me                    │
└───────────┬───────────────────────────┘
            │
            ▼
┌──────────────────────────────────────┐
│ Middleware Chain                     │
│ 1. CORS Check                        │
│ 2. JWT Verification                  │
│    ├─ Extract token from header      │
│    ├─ Verify signature               │
│    ├─ Get userId from token          │
│    └─ Attach to request object       │
│ 3. Route handler                     │
└───────────┬───────────────────────────┘
            │
            ▼ No token or invalid?
┌──────────────────────────────────────┐
│ Return 401 Unauthorized              │
│ Frontend redirects to login          │
└──────────────────────────────────────┘
            │
            ▼ Valid token
┌──────────────────────────────────────┐
│ UserController.getProfile()          │
│ ├─ MongoDB query for user            │
│ └─ Return user data                  │
└───────────┬───────────────────────────┘
            │
            ▼
┌──────────────────────────────────────┐
│ Response {user}                      │
│ Status 200 OK                        │
└───────────┬───────────────────────────┘
            │
            ▼ HTTP Response
┌──────────────────────────────────────┐
│ Frontend receives & parses JSON      │
│ ├─ Check status (200?)               │
│ ├─ Parse response body               │
│ └─ Update component state            │
└──────────────────────────────────────┘
```

---

## Error Handling Flow

```
Frontend Component
    ↓
    try {
        const data = await api.callEndpoint();
    } catch (error) {
        // Error handling here
    }
    ↓
HTTP Request fails or
Server returns error (4xx, 5xx)
    ↓
api.ts handleResponse()
    ↓
    if (!response.ok) {
        throw new Error(...)
    }
    ↓
Frontend catch block
    ↓
    console.error('API Error', error);
    ├─ Display user-friendly message
    ├─ Log error for debugging
    └─ Retry or show fallback UI
```

---

## File Organization

```
FRONTEND (React + TypeScript)
├── Components (Reusable UI)
│   └── Layout.tsx (Header, Navigation)
│
├── Pages (Full Page Views)
│   ├── Landing.tsx (Public)
│   ├── Dashboard.tsx (Protected)
│   ├── Contacts.tsx (Protected)
│   ├── Settings.tsx (Protected)
│   ├── History.tsx (Protected)
│   ├── Onboarding.tsx (Protected)
│   ├── LiveAlert.tsx (Protected)
│   └── CrowdMonitor.tsx (Protected)
│
├── Services (API & External)
│   ├── api.ts ⭐ (Backend API calls)
│   ├── geminiService.ts (AI/ML)
│   └── mockApi.ts (Deprecated)
│
└── Types (TypeScript)
    └── types.ts (Interface definitions)


BACKEND (Node.js + Express)
├── server.js (Express app entry)
│
├── Config (Configuration)
│   └── database.js (MongoDB connection)
│
├── Models (Mongoose Schemas)
│   ├── User.js
│   ├── Device.js
│   ├── Alert.js
│   └── index.js
│
├── Controllers (Request Handlers)
│   ├── authController.js
│   ├── userController.js
│   ├── deviceController.js
│   ├── sosController.js
│   ├── alertController.js
│   └── index.js
│
├── Routes (API Endpoints)
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── deviceRoutes.js
│   ├── sosRoutes.js
│   ├── alertRoutes.js
│   └── index.js
│
├── Middleware (Request Processing)
│   ├── auth.js (JWT verification)
│   ├── authorize.js (Role-based)
│   ├── errorHandler.js (Error catching)
│   ├── logger.js (Request logging)
│   └── index.js
│
└── Services (Business Logic)
    └── notificationService.js
```

---

## Technology Stack Details

### Frontend
```
React 19.2.3
├─ Concurrent rendering
├─ Automatic batching
└─ New hooks system

TypeScript 5.8.2
├─ Strict mode enabled
├─ Type safety
└─ IntelliSense support

Vite 6.2.0
├─ Lightning-fast builds
├─ Hot module replacement
└─ Optimized bundles

Tailwind CSS
├─ Utility-first styling
├─ Responsive design
└─ Dark mode support

React Router v7.12.0
├─ Client-side routing
├─ Nested routes
└─ Lazy loading

Lucide Icons
├─ Beautiful SVG icons
├─ 1000+ icons
└─ Customizable
```

### Backend
```
Express 4.18.2
├─ Minimalist framework
├─ Middleware support
└─ RESTful API routing

MongoDB 8.0.3 (via Mongoose)
├─ Document database
├─ Schema validation
└─ Query builder

JWT (jsonwebtoken)
├─ Token generation
├─ Token verification
└─ Expiration handling

bcrypt 5.1.1
├─ Password hashing
├─ Salt rounds
└─ Secure comparison

CORS
├─ Cross-origin requests
├─ Preflight handling
└─ Credentials support

Nodemon (Dev)
├─ Auto-restart on changes
├─ Watch mode
└─ Development convenience
```

---

## Environment Configuration

```
Backend (.env)
├─ MONGO_URI (MongoDB Atlas)
├─ PORT (Server port: 5000)
├─ NODE_ENV (development/production)
├─ JWT_SECRET (Token signing)
└─ JWT_EXPIRES_IN (Token lifespan)

Frontend (.env)
├─ VITE_API_BASE_URL (Backend API: http://localhost:5000/api)
└─ VITE_GEMINI_API_KEY (AI/ML API key)
```

---

## Deployment Architecture (Production)

```
┌─────────────────────────────────────────────┐
│          Client Machine (Browser)            │
│    (User accesses deployed frontend URL)     │
└────────────────────┬────────────────────────┘
                     │
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
┌─────────────────┐      ┌──────────────────┐
│ CDN/Static Web  │      │ Backend Server   │
│ Host            │      │ (Azure, AWS, etc)│
│ (Vercel,        │      │                  │
│  Netlify, etc)  │      │ Node.js          │
│                 │      │ Express          │
│ Built React App │      │ MongoDB          │
│ (dist/)         │      │                  │
└────────┬────────┘      └────────┬─────────┘
         │                        │
         │                        │
         │ HTTPS                  │ HTTPS
         │                        │
         │                        │
    End User               API Calls
    Sees App               with JWT
```

---

This architecture ensures:
✅ **Separation of Concerns** - Clear frontend/backend division
✅ **Security** - JWT authentication, CORS protection
✅ **Scalability** - Modular design, database-backed
✅ **Maintainability** - Well-organized structure
✅ **Performance** - Optimized builds, efficient APIs

**Happy coding!** 🚀
