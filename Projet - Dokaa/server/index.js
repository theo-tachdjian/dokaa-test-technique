const app = require('./app');
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
async function shutdown() {
  console.log('Fermeture des scrapers...');
  try {
    const scraper = require('./services/scraper');
    await scraper.close();
  } catch (error) {
    // Pas de scraper, rien à fermer
  }
  try {
    const tripadvisorScraper = require('./services/tripadvisorScraper');
    await tripadvisorScraper.close();
  } catch (error) {
    // Pas de scraper, rien à fermer
  }
  try {
    const googleMapsScraper = require('./services/googleMapsScraper');
    await googleMapsScraper.close();
  } catch (error) {
    // Pas de scraper, rien à fermer
  }
  try {
    const multiSourceReviewsScraper = require('./services/multiSourceReviewsScraper');
    await multiSourceReviewsScraper.close();
  } catch (error) {
    // Pas de scraper, rien à fermer
  }
  try {
    const googleMapsNetworkInterceptor = require('./services/googleMapsNetworkInterceptor');
    await googleMapsNetworkInterceptor.close();
  } catch (error) {
    // Pas de scraper, rien à fermer
  }
}

process.on('SIGTERM', async () => {
  console.log('Shutting down...');
  await shutdown();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await shutdown();
  process.exit(0);
});

