# 🚀 Quick Start Guide

## Installation (One-Time Setup)

```bash
# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd frontend/Astra
npm install
```

## Running the Application

### Windows
**Double-click:** `START_SERVERS.bat`

### Mac/Linux
```bash
bash start-servers.sh
```

### Manual (Any OS)
**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend/Astra
npm run dev
```

## 🌐 Access Points

| Component | URL | Port |
|-----------|-----|------|
| Frontend | http://localhost:5173 | 5173 |
| Backend API | http://localhost:5000 | 5000 |
| Backend Health | http://localhost:5000/health | 5000 |

## 📝 Key Files Modified

### Created
- ✅ `frontend/Astra/services/api.ts` - Real API service
- ✅ `INTEGRATION_GUIDE.md` - Detailed setup docs
- ✅ `README.md` - Project documentation
- ✅ `START_SERVERS.bat` - Windows startup
- ✅ `start-servers.sh` - Mac/Linux startup

### Updated
- ✅ `frontend/Astra/.env` - Added API base URL
- ✅ `frontend/Astra/App.tsx` - Uses real API
- ✅ `frontend/Astra/pages/Settings.tsx` - Uses real API
- ✅ `frontend/Astra/pages/Onboarding.tsx` - Uses real API
- ✅ `frontend/Astra/pages/LiveAlert.tsx` - Uses real API
- ✅ `frontend/Astra/pages/History.tsx` - Uses real API
- ✅ `frontend/Astra/pages/Dashboard.tsx` - Uses real API
- ✅ `frontend/Astra/pages/Contacts.tsx` - Uses real API

## 🧪 Testing the Integration

1. **Start Backend**
   ```bash
   cd backend && npm start
   ```
   You should see: `🚀 Server running on http://localhost:5000`

2. **Start Frontend**
   ```bash
   cd frontend/Astra && npm run dev
   ```
   You should see: `Local: http://localhost:5173`

3. **Open Browser**
   Navigate to `http://localhost:5173`

4. **Test Login**
   - Try logging in with your credentials
   - If successful, API is connected!

5. **Test API Calls**
   - Go to Contacts → should load from backend
   - Go to Settings → should load user data
   - Dashboard → should show devices
   - All data flows through `/api` endpoints

## 🔧 Common Commands

| Task | Command |
|------|---------|
| Install dependencies | `npm install` (in backend or frontend/Astra) |
| Start backend | `cd backend && npm start` |
| Start frontend | `cd frontend/Astra && npm run dev` |
| Build frontend | `cd frontend/Astra && npm run build` |
| View backend API | `http://localhost:5000` |
| Kill process on port | `lsof -ti:5000 \| xargs kill -9` (Mac/Linux) |
| Kill process on port | `netstat -ano \| findstr :5000` (Windows) |

## 📋 Environment Variables

### Backend (.env) - Already Configured
```
MONGO_URI=mongodb+srv://pandeynikita190_db_user:S3xubD1cQQbXYLfi@womensaftey.varyosc.mongodb.net/?appName=WomenSaftey
PORT=5000
NODE_ENV=development
JWT_SECRET=f8631da67715bbf07903fd8f5974a0c36d11123b8052b441ff8175953190c259327eef8fb425c73b19cc5caa798f44616c420cdb1e81b8246d95e5190cea1cb8
JWT_EXPIRES_IN=7d
```

### Frontend (.env) - Already Configured
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GEMINI_API_KEY=AIzaSyB-wB7WNMZkLVqej6o4AXGC_BlJTA6d4wA
```

## ⚡ First Time Issues?

### Backend won't start?
- [ ] Node.js installed? Run `node --version`
- [ ] Dependencies installed? Run `npm install` in backend folder
- [ ] Port 5000 free? Check `netstat -ano | findstr :5000`

### Frontend won't load?
- [ ] Dependencies installed? Run `npm install` in frontend/Astra
- [ ] Backend running? Check `http://localhost:5000`
- [ ] Check browser console for errors

### API calls failing?
- [ ] Backend running? Check terminal 1
- [ ] MongoDB connected? Check backend logs
- [ ] CORS enabled? Yes, it's configured
- [ ] Correct API URL? Check frontend .env file

## 📞 Support

1. Check [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for detailed setup
2. Check [README.md](./README.md) for project overview
3. Review backend logs in terminal 1
4. Check browser console (F12) for frontend errors

## ✅ Success Indicators

- [ ] Backend logs show "🚀 Server running on http://localhost:5000"
- [ ] Frontend shows "Local: http://localhost:5173"
- [ ] Browser loads the login page without errors
- [ ] Can navigate after login
- [ ] No CORS errors in browser console
- [ ] API calls appear in Network tab (Browser DevTools)

---

**Status**: ✅ Integration Complete  
**Date**: January 9, 2026  
**Next Step**: Start the servers and test!
