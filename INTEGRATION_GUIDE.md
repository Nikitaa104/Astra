# Frontend-Backend Integration Guide

## ✅ Integration Complete

Your Women Safety application frontend and backend are now fully integrated! Here's what was done:

### Changes Made

#### 1. **Real API Service Layer** (`frontend/Astra/services/api.ts`)
- Created a new `api.ts` file replacing the mock API
- Implements all endpoints:
  - **Auth**: register, login, logout
  - **Users**: getProfile, updateProfile
  - **Contacts**: getContacts, addContact, updateContact, removeContact
  - **Devices**: getDevices, pairDevice, updateDevice, removeDevice
  - **SOS & Alerts**: triggerSOS, getActiveAlert, updateCrowdAnalysis, resolveAlert, cancelAlert, getAlertHistory, updateLocation
- Includes JWT token management in localStorage
- Error handling with proper HTTP status checks

#### 2. **Frontend Environment Configuration** (`.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GEMINI_API_KEY=AIzaSyB-wB7WNMZkLVqej6o4AXGC_BlJTA6d4wA
```

#### 3. **Updated All Page Components**
Replaced `mockApi` with `api` in:
- ✅ `App.tsx` - Authentication and routing
- ✅ `Settings.tsx` - User profile
- ✅ `Onboarding.tsx` - Device pairing
- ✅ `LiveAlert.tsx` - Active SOS handling
- ✅ `History.tsx` - Alert history
- ✅ `Dashboard.tsx` - Device list and active alerts
- ✅ `Contacts.tsx` - Emergency contacts management

#### 4. **Backend Verification**
- ✅ CORS already configured in `backend/server.js`
- ✅ API routes properly structured
- ✅ MongoDB connection configured
- ✅ All middleware in place

### Backend Setup

Before running, ensure your backend is configured:

1. **Backend Dependencies** (Already in `package.json`)
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables** (`.env` already set up)
   - `MONGO_URI` - MongoDB connection
   - `PORT` - Server port (5000)
   - `NODE_ENV` - development
   - `JWT_SECRET` - Authentication secret
   - `JWT_EXPIRES_IN` - Token expiration (7d)

3. **Start Backend Server**
   ```bash
   cd backend
   npm start
   # Server runs on http://localhost:5000
   ```

### Frontend Setup

1. **Frontend Dependencies** (Already in `package.json`)
   ```bash
   cd frontend/Astra
   npm install
   ```

2. **Start Frontend Dev Server**
   ```bash
   cd frontend/Astra
   npm run dev
   # Frontend typically runs on http://localhost:5173
   ```

### API Endpoints Reference

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

#### Users (Protected)
- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update user profile
- `POST /api/users/me/contacts` - Add emergency contact
- `PATCH /api/users/me/contacts/:contactId` - Update emergency contact
- `DELETE /api/users/me/contacts/:contactId` - Remove emergency contact

#### Devices (Protected)
- `GET /api/devices` - Get user's devices
- `POST /api/devices` - Pair new device
- `PATCH /api/devices/:deviceId` - Update device
- `DELETE /api/devices/:deviceId` - Remove device

#### SOS & Alerts (Protected)
- `POST /api/sos/trigger` - Trigger SOS alert
- `GET /api/sos/active` - Get active SOS alert
- `PATCH /api/sos/:alertId/crowd-analysis` - Update crowd analysis
- `POST /api/sos/:alertId/resolve` - Resolve alert
- `POST /api/sos/:alertId/cancel` - Cancel alert
- `POST /api/sos/:alertId/location` - Update location
- `GET /api/alerts` - Get all alerts history

### How to Test

1. **Start both servers** (in separate terminals):
   ```bash
   # Terminal 1: Backend
   cd backend && npm start
   
   # Terminal 2: Frontend
   cd frontend/Astra && npm run dev
   ```

2. **Login in Frontend**
   - Use credentials configured in backend user database
   - JWT token will be automatically stored in localStorage

3. **Test API Calls**
   - Navigate to Dashboard - should fetch devices from backend
   - Go to Contacts - should load emergency contacts from backend
   - Create a new contact - should save to backend
   - Trigger SOS - will call `/api/sos/trigger`

### Key Features

✅ **Authentication** - JWT-based with automatic token management
✅ **Error Handling** - Try-catch blocks on all API calls with console logging
✅ **Token Persistence** - Tokens stored in localStorage between sessions
✅ **CORS Support** - Frontend can communicate with backend
✅ **Real-time Data** - All data from MongoDB via backend
✅ **Device Pairing** - Wearable device management
✅ **SOS Alerts** - Real emergency alert system
✅ **Crowd Analysis** - Integration with Gemini AI for safety insights

### Troubleshooting

**Backend Connection Error?**
- Ensure backend is running on `http://localhost:5000`
- Check `VITE_API_BASE_URL` in `.env`
- Look for CORS errors in browser console

**Login Not Working?**
- Verify MongoDB is connected (check backend console)
- Ensure JWT_SECRET in backend `.env` is set
- Check user credentials in database

**Device Pairing Fails?**
- Backend must have device controller implemented
- Check device routes in backend

**API Timeout?**
- Increase timeout in `api.ts` if needed
- Check backend server logs

### Next Steps

1. Customize API responses based on your data model
2. Add proper error handling UI in frontend
3. Implement real geolocation tracking
4. Add push notifications for SOS alerts
5. Deploy backend to cloud (Azure, AWS, etc.)
6. Build and deploy frontend

---

**Integration Date**: January 9, 2026
**Status**: ✅ Ready for Development
