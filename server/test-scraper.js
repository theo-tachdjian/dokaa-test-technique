// Script de test pour le scraping
// Permet de tester le scraper sur une URL avant de l'intégrer

const scraper = require('./services/scraper');

async function testScraping() {
  // URL de test - remplace par une vraie URL Deliveroo
  const testUrl = 'https://deliveroo.fr/fr/restaurants/paris/test-restaurant';
  
  console.log('Test du scraping...');
  console.log(`URL: ${testUrl}`);
  
  try {
    // Test scraping des avis
    const reviews = await scraper.scrapeRestaurantReviews(testUrl);
    console.log(`\nAvis trouvés: ${reviews.length}`);
    console.log(JSON.stringify(reviews, null, 2));
    
    // Test scraping des infos
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

