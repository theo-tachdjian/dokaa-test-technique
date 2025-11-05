


const scraper = require('./services/scraper');

async function testScraping() {
  
  const testUrl = 'https://deliveroo.fr/fr/restaurants/paris/test-restaurant';
  
  console.log('Test du scraping...');
  console.log(`URL: ${testUrl}`);
  
  try {
    
    const reviews = await scraper.scrapeRestaurantReviews(testUrl);
    console.log(`\nAvis trouvés: ${reviews.length}`);
    console.log(JSON.stringify(reviews, null, 2));
    
    
    const info = await scraper.scrapeRestaurantInfo(testUrl);
    console.log(`\nInfos restaurant:`, info);
    
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await scraper.close();
    process.exit(0);
  }
}

testScraping();

