const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is not defined in environment variables');
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error('FATAL: MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const providerRoutes = require('./routes/providers');
const serviceRoutes = require('./routes/services');
const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');
const categoryRoutes = require('./routes/categories');
const reviewRoutes = require('./routes/reviews');
const notificationRoutes = require('./routes/notifications');
const paymentRoutes = require('./routes/payments');
const providerServicesRoutes = require('./routes/providerServices');
const walletRoutes = require('./routes/wallet');
const serviceApprovalRoutes = require('./routes/serviceApproval');
const supportRoutes = require('./routes/support');
const serviceHighlightRoutes = require('./routes/serviceHighlight');

const app = express();

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/provider-services', providerServicesRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/admin/services', serviceApprovalRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/highlights', serviceHighlightRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Fixora API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
