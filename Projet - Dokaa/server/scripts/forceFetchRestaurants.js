const deliverooGraphQL = require('../services/deliverooGraphQL');
const cache = require('../services/cache');

async function forceFetchRestaurants() {
  console.log('🚀 Démarrage de la récupération forcée des restaurants...\n');
  
  deliverooGraphQL.lastRateLimitError = null;
  
  const cities = ['Marseille', 'Paris', 'Lyon'];
  
  for (const city of cities) {
    try {
      console.log(`\n📍 Tentative récupération restaurants pour ${city}...`);
      
      const restaurants = await deliverooGraphQL.getAllRestaurants(city, null, 0, true);
      
      if (restaurants && restaurants.length > 0) {
        const restaurantsWithCity = restaurants.map(r => ({ ...r, city }));
        const cacheKey = `city:${city}`;
        cache.set(cacheKey, restaurantsWithCity, 'restaurants');
        console.log(`✅ ${restaurants.length} restaurants récupérés et mis en cache pour ${city}`);
      } else {
        console.log(`⚠️  Aucun restaurant récupéré pour ${city}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ Erreur pour ${city}:`, error.message);
      if (error.message.includes('Rate limiting')) {
        console.log(`   ⏳ Rate limiting détecté - Passage à la ville suivante...`);
      }
    }
  }
  
  console.log('\n✅ Récupération terminée');
  console.log(`📊 Cache actuel: ${cache.cache.size} entrées`);
  
  const cacheKeys = Array.from(cache.cache.keys());
  console.log(`📋 Clés du cache:`, cacheKeys);
  
  process.exit(0);
}

forceFetchRestaurants().catch(error => {
  console.error('Erreur fatale:', error);
  process.exit(1);
});
