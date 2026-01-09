require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const { errorHandler, notFound, logger } = require('./middleware');
const {
  authRoutes,
  userRoutes,
  deviceRoutes,
  alertRoutes,
  sosRoutes,
} = require('./routes');

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Health Check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Women Safety API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      devices: '/api/devices',
      sos: '/api/sos',
      alerts: '/api/alerts',
    },
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/alerts', alertRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;

function startServer(port, triedFallback = false) {
  const server = app.listen(port, () => {
    console.log(`\n🚀 Server running on http://localhost:${port}`);
    console.log('\n📡 Endpoints:');
    console.log('');
    console.log('   AUTH');
    console.log('   POST   /api/auth/register');
    console.log('   POST   /api/auth/login');
    console.log('');
    console.log('   USERS');
    console.log('   GET    /api/users/me');
    console.log('   PATCH  /api/users/me');
    console.log('   POST   /api/users/me/contacts');
    console.log('   PATCH  /api/users/me/contacts/:contactId  [NEW]');
    console.log('   DELETE /api/users/me/contacts/:contactId');
    console.log('');
    console.log('   DEVICES');
    console.log('   POST   /api/devices');
    console.log('   GET    /api/devices/me');
    console.log('   PATCH  /api/devices/:id');
    console.log('');
    console.log('   SOS');
    console.log('   POST   /api/sos');
    console.log('');
    console.log('   ALERTS');
    console.log('   GET    /api/alerts/me');
    console.log('   GET    /api/alerts/active               [NEW]');
    console.log('   GET    /api/alerts/for-contact          [NEW]');
    console.log('   GET    /api/alerts/:id                  [NEW]');
    console.log('   PATCH  /api/alerts/:id/acknowledge      [NEW]');
    console.log('   PATCH  /api/alerts/:id/resolve');
    console.log('');
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(`\n⚠️ Port ${port} is already in use.`);
      if (!triedFallback) {
        const alt = parseInt(port, 10) + 1;
        console.log(`Trying port ${alt} instead...`);
        startServer(alt, true);
      } else {
        console.error('Port conflict persists. Please stop the process using the port or set the PORT environment variable to a free port.');
        process.exit(1);
      }
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}

startServer(PORT);

