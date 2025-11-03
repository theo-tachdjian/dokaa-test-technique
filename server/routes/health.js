const express = require('express');
const router = express.Router();
const cache = require('../services/cache');

router.get('/', (req, res) => {
  const cacheStats = cache.getStats();
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    cache: cacheStats
  });
});

module.exports = router;

