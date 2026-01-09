# Women Safety API

A comprehensive Node.js + Express API for women safety application with MongoDB.

## Features

- 🔐 User authentication with JWT
- 👤 User management with emergency contacts
- 📱 Device tracking and management
- 🚨 SOS alert system with location tracking
- 📧 Email notifications (Nodemailer)
- 📱 SMS notifications (Twilio)
- 👑 Admin dashboard for monitoring
- 🔒 Role-based access control

## Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/women-safety
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Twilio (optional - for SMS)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Email (optional - for email notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

3. Start MongoDB server

4. Run the application:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## Project Structure

```
backend/
├── server.js              # Entry point
├── package.json           # Dependencies
├── middleware/
│   ├── auth.js            # JWT authentication
│   ├── errorHandler.js    # Global error handler
│   └── logger.js          # Request logger
├── models/
│   ├── User.js            # User model
│   ├── Device.js          # Device model
│   └── Alert.js           # Alert model
├── controllers/
│   ├── authController.js  # Auth logic
│   ├── userController.js  # User logic
│   ├── deviceController.js # Device logic
│   ├── alertController.js # Alert/SOS logic
│   └── adminController.js # Admin logic
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   ├── userRoutes.js      # User endpoints
│   ├── deviceRoutes.js    # Device endpoints
│   ├── alertRoutes.js     # Alert endpoints
│   └── adminRoutes.js     # Admin endpoints
└── services/
    └── notificationService.js # SMS/Email service
```

## API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |

### Users
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users/:id` | Get user info | Private |
| PATCH | `/api/users/:id` | Update user info | Private |
| DELETE | `/api/users/:id` | Delete user | Private |
| POST | `/api/users/:id/contacts` | Add emergency contact | Private |
| DELETE | `/api/users/:id/contacts/:contactId` | Remove contact | Private |

### Devices
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/devices` | Add new device | Private |
| PATCH | `/api/devices/:id` | Update device | Private |
| GET | `/api/devices/:userId` | Get user devices | Private |
| DELETE | `/api/devices/:id` | Delete device | Private |

### Alerts & SOS
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/sos/sos` | Trigger SOS alert | Private |
| GET | `/api/alerts` | List all alerts | Private |
| GET | `/api/alerts/:id` | Get single alert | Private |
| PATCH | `/api/alerts/:id` | Update alert status | Private |

### Admin Dashboard
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/stats` | Dashboard statistics | Admin |
| GET | `/api/admin/alerts` | List all alerts | Admin |
| PATCH | `/api/admin/alerts/:id` | Resolve alert | Admin |
| GET | `/api/admin/users` | List all users | Admin |
| DELETE | `/api/admin/users/:id` | Delete user | Admin |

## Example Requests

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "password": "password123",
    "emergencyContacts": [
      {"name": "John Doe", "phone": "+0987654321"}
    ]
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "password123"
  }'
```

### Trigger SOS
```bash
curl -X POST http://localhost:5000/api/sos/sos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "deviceId": "DEVICE_OBJECT_ID",
    "latitude": 40.7128,
    "longitude": -74.0060
  }'
```

## Technologies

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **SMS:** Twilio
- **Email:** Nodemailer
- **Middleware:** CORS, body-parser, dotenv

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token authentication
- Role-based access control (user/admin)
- Request validation
- Error handling middleware

## License

ISC
