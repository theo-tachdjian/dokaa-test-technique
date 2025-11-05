require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Charger l'enricheur de données au démarrage pour garantir des données réalistes
try {
  require('./services/dataEnricher');
} catch (error) {
  console.warn('⚠️  Erreur lors de l\'enrichissement des données:', error.message);
}

// Rate limiting basique pour éviter les abus et protéger le scraping
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
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 requêtes/min par IP
    standardHeaders: true,
    legacyHeaders: false
  });
  app.use(limiter);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Backend is running'
  });
});

// Routes
app.use('/api/restaurants', require('./routes/restaurants'));

// Gestion d'erreurs
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;


