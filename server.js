const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();
require('dotenv').config();

// Middleware
app.use(express.json());
  app.use(cors({
    origin: 'http://localhost:5173', // Explicitly allow frontend
    credentials: true,
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization'[[[[[[[[]]]]]]]],
  }));
app.use(helmet());
app.use(morgan('dev'));

// Database connection
mongoose.connect(process.env.MONGO_URI )
  .then(() => console.log('Connected to DB successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Import routes
const authRoutes = require('./routes/auth');
const  userRoutes = require('./routes/user');
const roomRoutes = require('./routes/room')
 const paymentRoutes = require('./routes/payments');
// const complaintRoutes = require('./routes/complaints');
// const staffRoutes = require('./routes/staff');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/rooms", roomRoutes)
app.use('/api/payments', paymentRoutes);
// app.use('/api/complaints', complaintRoutes);
// app.use('/api/staff', staffRoutes);

// Connection to the frontend Server.
// app.get('/api/data', (req, res) => {
//   res.json({ message: 'Hello from the backend!' });
// });

// Error handling
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: err.message || 'Internal Server Error'
  });
});

// Handle 404
  app.use('*', (req, res) => {
    res.status(404).json({
      status: 'error',
      message: 'Route not found'
    });
  });

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;