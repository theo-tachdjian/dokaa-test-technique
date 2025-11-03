const app = require('./app');
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down...');
  try {
    const scraper = require('./services/scraper');
    await scraper.close();
  } catch (error) {
    // Pas de scraper, rien à fermer
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  try {
    const scraper = require('./services/scraper');
    await scraper.close();
  } catch (error) {
    // Pas de scraper, rien à fermer
  }
  process.exit(0);
});

