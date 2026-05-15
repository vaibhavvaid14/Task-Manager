require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db');
const path = require('path');

// Initialize express
const app = express();

// Debug Environment
console.log('Environment Check:');
console.log('- DATABASE_URL present:', !!process.env.DATABASE_URL);
console.log('- JWT_SECRET present:', !!process.env.JWT_SECRET);
console.log('- PORT:', process.env.PORT);
console.log('- NODE_ENV:', process.env.NODE_ENV);

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route // Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', database: 'connected' }));

// Serve Static Assets in Production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Database Connection and Server Start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    // Sync database
    // Use { alter: true } in development to update tables without dropping data
    // Use { force: true } only if you want to drop and recreate tables
    await sequelize.sync({ alter: true });
    console.log('Database synced');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
