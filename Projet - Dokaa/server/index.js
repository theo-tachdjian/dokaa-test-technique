const app = require('./app');
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


async function shutdown() {
  console.log('Fermeture des scrapers...');
  try {
    const scraper = require('./services/scraper');
    await scraper.close();
  } catch (error) {
    
  }
  try {
    const tripadvisorScraper = require('./services/tripadvisorScraper');
    await tripadvisorScraper.close();
  } catch (error) {
    
  }
  try {
    const googleMapsScraper = require('./services/googleMapsScraper');
    await googleMapsScraper.close();
  } catch (error) {
    
  }
  try {
    const multiSourceReviewsScraper = require('./services/multiSourceReviewsScraper');
    await multiSourceReviewsScraper.close();
  } catch (error) {
    
  }
  try {
    const googleMapsNetworkInterceptor = require('./services/googleMapsNetworkInterceptor');
    await googleMapsNetworkInterceptor.close();
  } catch (error) {
    
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

