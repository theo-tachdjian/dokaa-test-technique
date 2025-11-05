require('dotenv').config();
const express = require('express');
const cors = require('cors');


try {
  require('./services/dataEnricher');
} catch (error) {
  console.warn('⚠️  Erreur lors de l\'enrichissement des données:', error.message);
}


let rateLimit;
try {
  rateLimit = require('express-rate-limit');
} catch (e) {
  rateLimit = null;
}

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

if (rateLimit) {
  const limiter = rateLimit({
    windowMs: 60 * 1000, 
    max: 60, 
    standardHeaders: true,
    legacyHeaders: false
  });
  app.use(limiter);
}


app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Backend is running'
  });
});


app.use('/api/restaurants', require('./routes/restaurants'));


const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;


