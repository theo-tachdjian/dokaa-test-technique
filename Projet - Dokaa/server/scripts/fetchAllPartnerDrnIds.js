const deliverooGraphQL = require('../services/deliverooGraphQL');
const cache = require('../services/cache');
const fs = require('fs');
const path = require('path');

async function extractSlugAndCity(restaurant) {
  const slugOrUrl = restaurant.slug || restaurant.url;
  if (!slugOrUrl) return null;
  
  let cleanSlug = slugOrUrl.split('?')[0];
  cleanSlug = cleanSlug.replace(/^https?:\/\/[^\/]+/, '');
  
  const parts = cleanSlug.split('/').filter(p => p);
  
  if (parts.length >= 3) {
    let menuIndex = -1;
    for (let i = 0; i < parts.length; i++) {
      if (parts[i] === 'menu' || parts[i] === 'restaurants') {
        menuIndex = i;
        break;
      }
    }
    
    if (menuIndex >= 0 && menuIndex + 2 < parts.length) {
      let city = parts[menuIndex + 1];
      
      city = city.toLowerCase().trim();
      if (city.includes('-')) {
        city = city.split('-')[0];
      }
      if (city.includes(' ')) {
        city = city.split(' ')[0];
      }
      
      let slug = parts[parts.length - 1];
      slug = slug.split('?')[0];
      
      if (restaurant.city) {
        city = restaurant.city.toLowerCase();
        if (city.includes('-')) {
          city = city.split('-')[0];
        }
        if (city.includes(' ')) {
          city = city.split(' ')[0];
        }
      }
      
      return { slug, city };
    }
  }
  
  if (restaurant.city) {
    let city = restaurant.city.toLowerCase();
    if (city.includes('-')) city = city.split('-')[0];
    if (city.includes(' ')) city = city.split(' ')[0];
    
    if (restaurant.url) {
      const urlParts = restaurant.url.split('/').filter(p => p);
      const lastPart = urlParts[urlParts.length - 1];
      const slug = lastPart.split('?')[0];
      if (slug && slug.length > 0) {
        return { slug, city };
      }
    }
  }
  
  return null;
}

async function fetchPartnerDrnId(restaurant) {
  if (restaurant.partner_drn_id && restaurant.partner_drn_id.includes('-')) {
    return restaurant.partner_drn_id;
  }
  
  let restaurantUrl = restaurant.url;
  if (!restaurantUrl && restaurant.slug) {
    if (restaurant.slug.startsWith('/')) {
      restaurantUrl = `https:
    } else if (restaurant.slug.startsWith('http')) {
      restaurantUrl = restaurant.slug.split('?')[0];
    } else {
      restaurantUrl = `https:
    }
  }
  
  if (restaurantUrl) {
    try {
      console.log(`  🔍 Extraction HTML depuis: ${restaurantUrl.substring(0, 80)}...`);
      const extracted = await deliverooGraphQL.extractPartnerDrnIdFromUrl(restaurantUrl);
      if (extracted && extracted.includes('-')) {
        console.log(`  ✅ UUID extrait: ${extracted}`);
        return extracted;
      } else {
        console.log(`  ⚠️  Aucun UUID trouvé dans la page HTML`);
      }
    } catch (error) {
      const errorMsg = error.message || '';
      console.log(`  ⚠️  Erreur extraction HTML: ${errorMsg}`);
      
      if (errorMsg.includes('réessayer') || 
          errorMsg.includes('Rate limiting') || 
          errorMsg.includes('Cloudflare')) {
        console.log(`  ⏳ Blocage détecté - Attente de 30 secondes...`);
        await new Promise(resolve => setTimeout(resolve, 30000));
        return null;
      }
    }
  } else {
    console.log(`  ⚠️  Pas d'URL disponible pour l'extraction HTML`);
    if (restaurant.slug) console.log(`     Slug: ${restaurant.slug.substring(0, 100)}`);
    if (restaurant.city) console.log(`     City: ${restaurant.city}`);
  }
  
  return null;
}

async function processCity(cityName) {
  const cityLower = cityName.toLowerCase();
  const cacheKey = `city:${cityLower}`;
  
  console.log(`\n🏙️  Traitement de ${cityName}...`);
  cache.loadFromDisk();
  
  const restaurants = cache.getStale(cacheKey);
  if (!restaurants || !Array.isArray(restaurants) || restaurants.length === 0) {
    console.log(`  ⚠️  Aucun restaurant trouvé pour ${cityName}`);
    return { city: cityName, total: 0, updated: 0, failed: 0 };
  }
  
  console.log(`  📊 ${restaurants.length} restaurants à traiter`);
  
  let updated = 0;
  let failed = 0;
  let alreadyValid = 0;
  
  for (let i = 0; i < restaurants.length; i++) {
    const restaurant = restaurants[i];
    const progress = `[${i + 1}/${restaurants.length}]`;
    
    console.log(`\n${progress} ${restaurant.name}`);
    
    if (restaurant.partner_drn_id && restaurant.partner_drn_id.includes('-')) {
      console.log(`  ✅ Déjà valide: ${restaurant.partner_drn_id}`);
      alreadyValid++;
      continue;
    }
    
      try {
      const partnerDrnId = await fetchPartnerDrnId(restaurant);
      if (partnerDrnId) {
        restaurant.partner_drn_id = partnerDrnId;
        updated++;
        console.log(`  ✅ Mis à jour: ${partnerDrnId}`);
        
        cache.set(cacheKey, restaurants, 'restaurants', 86400000); 
      } else {
        failed++;
        console.log(`  ❌ Impossible de récupérer partner_drn_id`);
      }
      
      let delay = 15000; 
      
      if (failed > 0) {
        delay = 15000 + (failed * 3000); 
      }
      
      console.log(`  ⏳ Attente de ${Math.round(delay / 1000)}s avant le prochain restaurant...`);
      
      if (i < restaurants.length - 1) {
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
        console.log(`  ⏳ Blocage détecté - Attente de 30 secondes avant de continuer...`);
        deliverooGraphQL.lastRateLimitError = Date.now();
        await new Promise(resolve => setTimeout(resolve, 30000));
        continue;
      }
    }
  }
  
  if (updated > 0) {
    cache.set(cacheKey, restaurants, 'restaurants');
    cache.saveToDisk();
    console.log(`\n💾 Cache sauvegardé pour ${cityName}`);
  }
  
  return {
    city: cityName,
    total: restaurants.length,
    updated,
    alreadyValid,
    failed
  };
}

async function main() {
  const args = process.argv.slice(2);
  const targetCity = args[0];
  
  console.log('🚀 Début de la récupération des partner_drn_id\n');
  
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
      
      const cityDelay = 5000 + (totalFailed * 500); 
      console.log(`\n⏳ Pause de ${cityDelay}ms avant la prochaine ville...`);
      await new Promise(resolve => setTimeout(resolve, cityDelay));
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSUMÉ');
  console.log('='.repeat(60));
  
  let totalRestaurants = 0;
  let totalUpdated = 0;
  let totalAlreadyValid = 0;
  
  results.forEach(r => {
    console.log(`\n${r.city}:`);
    console.log(`  Total: ${r.total}`);
    console.log(`  Déjà valides: ${r.alreadyValid}`);
    console.log(`  Mis à jour: ${r.updated}`);
    console.log(`  Échecs: ${r.failed}`);
    
    totalRestaurants += r.total;
    totalUpdated += r.updated;
    totalAlreadyValid += r.alreadyValid;
    totalFailed += r.failed;
  });
  
  console.log('\n' + '='.repeat(60));
  console.log(`TOTAL: ${totalRestaurants} restaurants`);
  console.log(`  ✅ Déjà valides: ${totalAlreadyValid}`);
  console.log(`  ✅ Mis à jour: ${totalUpdated}`);
  console.log(`  ❌ Échecs: ${totalFailed}`);
  console.log('='.repeat(60));
  
  if (totalUpdated > 0) {
    console.log('\n💾 Sauvegarde finale du cache...');
    cache.saveToDisk();
    console.log('✅ Cache sauvegardé sur le disque');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { processCity, fetchPartnerDrnId };
