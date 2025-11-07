
const deliverooGraphQL = require('../services/deliverooGraphQL');
const cache = require('../services/cache');

async function fetchReviewsForRestaurant(restaurant, cityName) {
  const partnerDrnId = restaurant.partner_drn_id || restaurant.partnerDrnId;
  
  if (!partnerDrnId || !partnerDrnId.includes('-')) {
    console.log(`  ⚠️  Pas de partner_drn_id UUID valide (trouvé: ${partnerDrnId})`);
    return { success: false, reason: 'no_uuid' };
  }
  
  const cacheKey = `reviews:${restaurant.id}`;
  const cachedReviews = cache.get(cacheKey);
  if (cachedReviews && cachedReviews.length > 0) {
    console.log(`  ✅ Avis déjà en cache (${cachedReviews.length} avis)`);
    return { success: true, cached: true, count: cachedReviews.length };
  }
  
  if (deliverooGraphQL.lastRateLimitError && Date.now() - deliverooGraphQL.lastRateLimitError < 60000) {
    const timeSince = Math.round((Date.now() - deliverooGraphQL.lastRateLimitError) / 1000);
    console.log(`  ⏳ Rate limiting actif (détecté il y a ${timeSince}s) - Restaurant ignoré pour l'instant`);
    return { success: false, reason: 'rate_limited' };
  }
  
  try {
    console.log(`  🔍 Récupération avis pour ${restaurant.name}...`);
    const reviews = await deliverooGraphQL.getRestaurantReviews(partnerDrnId);
    
    if (reviews && reviews.length > 0) {
      cache.set(cacheKey, reviews, 'reviews', 3600000);
      console.log(`  ✅ ${reviews.length} avis récupérés et mis en cache`);
      return { success: true, cached: false, count: reviews.length };
    } else {
      console.log(`  ⚠️  Aucun avis trouvé pour ce restaurant`);
      return { success: true, cached: false, count: 0 };
    }
  } catch (error) {
    const errorMsg = error.message || 'Erreur inconnue';
    console.log(`  ❌ Erreur: ${errorMsg}`);
    
    if (errorMsg.includes('réessayer') || 
        errorMsg.includes('Rate limiting') || 
        errorMsg.includes('Cloudflare') ||
        errorMsg.includes('Cookie')) {
      console.log(`  ⚠️  Blocage détecté - Arrêt du traitement de cette ville`);
      throw error; 
    }
    
    return { success: false, reason: errorMsg };
  }
}

async function processCity(cityName) {
  const cityLower = cityName.toLowerCase();
  const cacheKey = `city:${cityLower}`;
  
  console.log(`\n🏙️  Traitement de ${cityName}...`);
  
  cache.loadFromDisk();
  
  const restaurants = cache.get(cacheKey) || cache.getStale(cacheKey) || [];
  
  if (restaurants.length === 0) {
    console.log(`  ⚠️  Aucun restaurant trouvé pour ${cityName}`);
    return {
      city: cityName,
      total: 0,
      withUuid: 0,
      fetched: 0,
      cached: 0,
      failed: 0,
      noUuid: 0
    };
  }
  
  console.log(`  📊 ${restaurants.length} restaurants à traiter`);
  
  let fetched = 0;
  let cached = 0;
  let failed = 0;
  let noUuid = 0;
  let withUuid = 0;
  
  for (let i = 0; i < restaurants.length; i++) {
    const restaurant = restaurants[i];
    
    console.log(`\n[${i + 1}/${restaurants.length}] ${restaurant.name}`);
    
    const partnerDrnId = restaurant.partner_drn_id || restaurant.partnerDrnId;
    if (!partnerDrnId || !partnerDrnId.includes('-')) {
      noUuid++;
      console.log(`  ⚠️  Pas de partner_drn_id UUID - Ignoré`);
      continue;
    }
    
    withUuid++;
    
    try {
      const result = await fetchReviewsForRestaurant(restaurant, cityName);
      
      if (result.success) {
        if (result.cached) {
          cached++;
        } else {
          fetched++;
        }
      } else {
        if (result.reason === 'rate_limited') {
          console.log(`  ⏳ Rate limiting détecté - Arrêt du traitement de ${cityName}`);
          break;
        }
        failed++;
      }
      
      if (i < restaurants.length - 1) {
        const delay = 2000;
        console.log(`  ⏳ Attente de ${delay}ms avant le prochain restaurant...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
      failed++;
      const errorMsg = error.message || 'Erreur inconnue';
      console.log(`  ❌ Erreur: ${errorMsg}`);
      
      if (errorMsg.includes('réessayer') || 
          errorMsg.includes('Rate limiting') || 
          errorMsg.includes('Cloudflare') ||
          errorMsg.includes('Cookie')) {
        console.log(`  ⚠️  Blocage détecté - Arrêt du traitement de cette ville`);
        console.log(`  💡 Attendez 10-15 minutes avant de relancer le script`);
        break; 
      }
    }
  }
  
  cache.saveToDisk();
  
  return {
    city: cityName,
    total: restaurants.length,
    withUuid: withUuid,
    fetched: fetched,
    cached: cached,
    failed: failed,
    noUuid: noUuid
  };
}

async function main() {
  const args = process.argv.slice(2);
  const targetCity = args[0];
  
  console.log('🚀 Début de la récupération des avis pour tous les restaurants\n');
  
  cache.loadFromDisk();
  
  let results = [];
  let totalFailed = 0;
  
  if (targetCity) {
    const result = await processCity(targetCity);
    results.push(result);
    totalFailed += result.failed;
  } else {
    const allKeys = Array.from(cache.cache.keys());
    const cityKeys = allKeys.filter(k => k.startsWith('city:'));
    
    console.log(`📋 ${cityKeys.length} villes trouvées\n`);
    
    for (const key of cityKeys) {
      const cityName = key.replace('city:', '');
      const result = await processCity(cityName);
      results.push(result);
      totalFailed += result.failed;
      
      const cityDelay = 10000 + (totalFailed * 1000); 
      console.log(`\n⏳ Pause de ${cityDelay}ms avant la prochaine ville...`);
      await new Promise(resolve => setTimeout(resolve, cityDelay));
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSUMÉ');
  console.log('='.repeat(60));
  
  let totalRestaurants = 0;
  let totalWithUuid = 0;
  let totalFetched = 0;
  let totalCached = 0;
  let totalNoUuid = 0;
  
  results.forEach(r => {
    console.log(`\n${r.city}:`);
    console.log(`  Total restaurants: ${r.total}`);
    console.log(`  Avec UUID: ${r.withUuid}`);
    console.log(`  Avis récupérés: ${r.fetched}`);
    console.log(`  Avis en cache: ${r.cached}`);
    console.log(`  Sans UUID: ${r.noUuid}`);
    console.log(`  Échecs: ${r.failed}`);
    
    totalRestaurants += r.total;
    totalWithUuid += r.withUuid;
    totalFetched += r.fetched;
    totalCached += r.cached;
    totalNoUuid += r.noUuid;
  });
  
  console.log('\n' + '='.repeat(60));
  console.log(`TOTAL: ${totalRestaurants} restaurants`);
  console.log(`  ✅ Avec UUID: ${totalWithUuid}`);
  console.log(`  ✅ Avis récupérés: ${totalFetched}`);
  console.log(`  ✅ Avis en cache: ${totalCached}`);
  console.log(`  ⚠️  Sans UUID: ${totalNoUuid}`);
  console.log(`  ❌ Échecs: ${totalFailed}`);
  console.log('='.repeat(60));
  
  cache.saveToDisk();
  console.log('\n✅ Cache sauvegardé sur le disque');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { processCity, fetchReviewsForRestaurant };
