# Women Safety - ASTRA Platform

A comprehensive women's safety application featuring real-time SOS alerts, emergency contact management, device pairing, and AI-powered crowd analysis.
<img width="1890" height="919" alt="image" src="https://github.com/user-attachments/assets/376a5e6b-9314-4e76-8908-1f80ab1b878a" />


## 🏗️ Architecture

### Backend (Node.js/Express + MongoDB)
- RESTful API with JWT authentication
- MongoDB data persistence
- Real-time SOS alert management
- Emergency contact handling
- Device pairing system
- Crowd analysis integration

### Frontend (React/TypeScript + Vite)
- Modern React 19 with TypeScript
- Responsive UI with Tailwind CSS
- Real-time emergency alerts
- Geolocation tracking
- Gemini AI integration for safety insights
- Crowd density analysis

## 📋 Prerequisites

- **Node.js** v16+ and npm
- **MongoDB Atlas** account (connection string in `.env`)
- **Gemini API Key** (for AI safety insights)

## 🚀 Quick Start
<img width="1896" height="927" alt="image" src="https://github.com/user-attachments/assets/f11ce5e5-7b71-49f9-83e4-14d468664d74" />


### Option 1: Automated Startup (Windows)
```bash
# Double-click this file from Windows Explorer
START_SERVERS.bat
```

### Option 2: Manual Setup

#### Backend Setup
```bash
cd backend
npm install
npm start
```
Backend will run on `http://localhost:5000`

#### Frontend Setup
```bash
cd frontend/Astra
npm install
npm run dev
```
Frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
Women Safety/
├── backend/
│   ├── server.js              # Express app entry
│   ├── package.json           # Dependencies
│   ├── .env                   # Environment config
│   ├── config/                # Database config
│   ├── controllers/           # Request handlers
│   ├── models/                # MongoDB schemas
│   ├── routes/                # API routes
│   ├── middleware/            # Auth, logging, etc
│   └── services/              # Business logic
│
├── frontend/Astra/
│   ├── index.tsx              # React entry
│   ├── App.tsx                # Main component
│   ├── package.json           # Dependencies
│   ├── .env                   # API configuration
│   ├── components/            # Reusable UI components
│   ├── pages/                 # Page components
│   ├── services/              # API & external services
│   ├── types.ts               # TypeScript types
│   └── vite.config.ts         # Vite configuration
│
├── INTEGRATION_GUIDE.md       # Detailed integration docs
└── START_SERVERS.bat          # Windows startup script
<img width="1902" height="920" alt="image" src="https://github.com/user-attachments/assets/d1c3b364-deb6-4660-8114-d55be88e1d19" />

```

## 🔐 Security

### Authentication
- JWT tokens stored in localStorage
- Bearer token in Authorization header
- 7-day token expiration
- Password encryption with bcrypt

### CORS
- Configured in backend to accept frontend requests
- Automatic token refresh handling

## 🔌 API Endpoints

### Authentication (Public)
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
```

### Users (Protected)
```
GET    /api/users/me           - Get profile
PATCH  /api/users/me           - Update profile
POST   /api/users/me/contacts           - Add contact
PATCH  /api/users/me/contacts/:id       - Update contact
DELETE /api/users/me/contacts/:id       - Remove contact
```

### Devices (Protected)
```
GET    /api/devices            - List devices
POST   /api/devices            - Pair device
PATCH  /api/devices/:id        - Update device
DELETE /api/devices/:id        - Remove device
```

### SOS & Alerts (Protected)
```
POST   /api/sos/trigger        - Trigger SOS
GET    /api/sos/active         - Get active alert
PATCH  /api/sos/:id/crowd-analysis  - Update analysis
POST   /api/sos/:id/resolve    - Resolve alert
POST   /api/sos/:id/cancel     - Cancel alert
POST   /api/sos/:id/location   - Update location
GET    /api/alerts             - Alert history
```

## 🔑 Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb+srv://...   # MongoDB connection
PORT=5000                     # Server port
NODE_ENV=development
JWT_SECRET=...               # Signing secret
JWT_EXPIRES_IN=7d            # Token expiration
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GEMINI_API_KEY=...      # Gemini AI API key
```

## 🧪 Testing

### Test Login
```bash
# Default test credentials
Email: clara@example.com
Password: Depends on your backend implementation
```

### Test SOS
1. Navigate to Dashboard
2. Click "Trigger SOS"
3. Check Live Alert page for active alert
4. View crowd density analysis
5. Resolve or cancel the alert

## 📱 Features

### Core Features
✅ User authentication with JWT  
✅ Emergency contact management  
✅ Device pairing for wearables  
✅ One-tap SOS triggering  
✅ Real-time location tracking  
✅ Alert history and reporting  

### Advanced Features
✅ AI-powered crowd analysis (Gemini)  
✅ Multi-device support  
✅ Alert resolution tracking  
✅ Safety tips and recommendations  
✅ Contact verification  

## 🔧 Development

### Adding New API Endpoints
1. Create controller in `backend/controllers/`
2. Add route in `backend/routes/`
3. Add route to `backend/server.js`
4. Update `frontend/services/api.ts` with new method
5. Use in components

### Frontend Component Template
```tsx
import { api } from '../services/api';

const MyComponent = () => {
  useEffect(() => {
    api.getContacts()
      .then(data => setData(data))
      .catch(error => console.error('Error:', error));
  }, []);

  return <div>{/* Component JSX */}</div>;
};
```

## 🚀 Deployment

### Deploy Backend
1. Push to cloud (Azure App Service, AWS EC2, etc)
2. Set environment variables
3. Connect to MongoDB Atlas
4. Update `VITE_API_BASE_URL` in frontend

### Deploy Frontend
```bash
# Build for production
cd frontend/Astra
npm run build

# Deploy dist folder to hosting service
# (Vercel, Netlify, Azure Static Web Apps, etc)
```

## 📊 Performance Tips

- Frontend uses Vite for fast bundling
- React 19 with concurrent rendering
- Lazy loading for pages
- API response caching in localStorage
- Gzipped API responses

## 🐛 Troubleshooting

### Backend won't start?
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process if needed
taskkill /PID <PID> /F
```

### Frontend can't connect to backend?
- Verify backend is running on `http://localhost:5000`
- Check `VITE_API_BASE_URL` in `.env`
- Look for CORS errors in browser console

### MongoDB connection failed?
- Verify `MONGO_URI` in backend `.env`
- Check MongoDB Atlas whitelist includes your IP
- Ensure credentials are correct

### Import errors?
```bash
# Clear node_modules and reinstall
cd backend && rm -rf node_modules && npm install
cd frontend/Astra && rm -rf node_modules && npm install
```

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Gemini API Documentation](https://ai.google.dev/)
- [Vite Documentation](https://vitejs.dev/)

## 🤝 Contributing

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📄 License

ISC License - See LICENSE file for details

## 👥 Support

For issues or questions:
1. Check INTEGRATION_GUIDE.md
2. Review error messages in console
3. Check backend/frontend logs
4. Create an issue in repository

---

**Last Updated**: January 9, 2026  
**Integration Status**: ✅ Complete  
**Ready for**: Development & Testing

