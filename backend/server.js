const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config({ path: './.env' });

// Debug: Check if DATABASE_URL is loaded
console.log('DATABASE_URL:', process.env.DATABASE_URL);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // maksimum 100 istek
  message: {
    error: 'Çok fazla istek gönderdiniz, lütfen 15 dakika sonra tekrar deneyin.'
  }
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/products', require('./src/routes/products'));
app.use('/api/categories', require('./src/routes/categories'));
app.use('/api/orders', require('./src/routes/orders'));
app.use('/api/cart', require('./src/routes/cart'));
app.use('/api/reviews', require('./src/routes/reviews'));
app.use('/api/admin', require('./src/routes/admin'));
app.use('/api/branding', require('./src/routes/branding'));
app.use('/api/media', require('./src/routes/media'));
app.use('/api/seo', require('./src/routes/seo'));
app.use('/api/banners', require('./src/routes/banners'));
app.use('/api/coupons', require('./src/routes/coupons'));
// AI features removed - app.use('/api/ai', require('./src/routes/ai'));

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid ID format'
    });
  }
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Database Connection
const mongoUrl = process.env.DATABASE_URL || 'mongodb+srv://samimbaba1_db_user:Samim123.@cluster0.yg0h4rg.mongodb.net/cmtc?retryWrites=true&w=majority&appName=Cluster0';
console.log('Connecting to:', mongoUrl);
mongoose.connect(mongoUrl)
.then(() => {
  console.log('✅ MongoDB bağlantısı başarılı');
})
.catch((err) => {
  console.error('❌ MongoDB bağlantı hatası:', err);
  console.log('MongoDB başlatılıyor...');
  // MongoDB yoksa da devam et
});

// Server Start
app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portunda çalışıyor`);
  console.log(`📱 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3001'}`);
  console.log(`🔗 API: http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
});

module.exports = app;