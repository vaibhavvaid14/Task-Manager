require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db');
const path = require('path');

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route / Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Task Manager API is running' });
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

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
