const deliverooGraphQL = require('../services/deliverooGraphQL');
const cache = require('../services/cache');

async function extractSlugFromUrl(url) {
  let match = url.match(/\/restaurants\/[^\/]+\/([^\/\?]+)/);
  if (!match) {
    match = url.match(/\/menu\/[^\/]+\/[^\/]+\/([^\/\?]+)/);
  }
  return match ? match[1] : null;
}

async function extractCityFromUrl(url) {
  let match = url.match(/\/restaurants\/([^\/]+)\
  if (!match) {
    match = url.match(/\/menu\/([^\/]+)\
  }
  return match ? match[1].toLowerCase() : null;
}

async function getRestaurantFromUrl(url, city) {
  const slug = await extractSlugFromUrl(url);
  if (!slug) {
    throw new Error(`Impossible d'extraire le slug depuis l'URL: ${url}`);
  }
  console.log(`📋 Slug extrait: ${slug}`);
  const result = await deliverooGraphQL.getRestaurantDetails(slug, city);
  return result?.restaurant || result;
}

async function getRestaurantFromSlug(slug, city) {
  const result = await deliverooGraphQL.getRestaurantDetails(slug, city);
  return result?.restaurant || result;
}

function parseRestaurantJson(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.resolve(jsonString);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    throw new Error(`Impossible de parser le JSON: ${jsonString}`);
  }
}

function createRestaurantFromWebData(url, webData) {
  const slug = extractSlugFromUrl(url);
  const city = extractCityFromUrl(url);
  
  const restaurant = {
    id: slug, 
    name: webData.name || 'Restaurant',
    slug: `/fr/menu/${city}/${slug}`,
    city: city,
    address: webData.address || null,
    rating: webData.rating ? parseFloat(webData.rating) : null,
    ratingCount: webData.ratingCount || null,
    cuisine: webData.cuisine || null,
    status: webData.status || 'open',
    url: url,
    imageUrl: webData.imageUrl || null,
    deliveryTime: webData.deliveryTime || null,
    distance: webData.distance || null,
    partner_drn_id: webData.partner_drn_id || null
  };
  
  return restaurant;
}

async function addRestaurantToCity(restaurant, city) {
  const cityLower = city.toLowerCase();
  const cacheKey = `city:${cityLower}`;
  
  cache.loadFromDisk();
  let existingRestaurants = cache.getStale(cacheKey) || [];
  
  if (!Array.isArray(existingRestaurants)) {
    existingRestaurants = [];
  }
  
  const existingIndex = existingRestaurants.findIndex(r => 
    r.id === restaurant.id || 
    r.partner_drn_id === restaurant.partner_drn_id ||
    (r.slug && restaurant.slug && r.slug === restaurant.slug)
  );
  
  if (existingIndex >= 0) {
    console.log(`⚠️  Restaurant déjà présent dans le cache, mise à jour...`);
    existingRestaurants[existingIndex] = { ...restaurant, city: cityLower };
  } else {
    console.log(`➕ Ajout du nouveau restaurant au cache...`);
    existingRestaurants.push({ ...restaurant, city: cityLower });
  }
  
  cache.set(cacheKey, existingRestaurants, 'restaurants');
  cache.saveToDisk();
  
  console.log(`✅ Restaurant ajouté/mis à jour dans le cache pour ${city}`);
  console.log(`📊 Total restaurants pour ${city}: ${existingRestaurants.length}`);
  
  return existingRestaurants;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('❌ Usage: node scripts/addRestaurant.js <city> <url|slug|json>');
    console.error('');
    console.error('Exemples:');
    console.error('  node scripts/addRestaurant.js marseille "https://deliveroo.fr/fr/restaurants/marseille/l-authentique"');
    console.error('  node scripts/addRestaurant.js marseille "l-authentique"');
    console.error('  node scripts/addRestaurant.js marseille restaurant-data.json');
    process.exit(1);
  }
  
  const city = args[0];
  const input = args[1];
  
  console.log(`🏙️  Ville: ${city}`);
  console.log(`📥 Input: ${input}`);
  console.log('');
  
  let restaurant;
  
  try {
    if (input.startsWith('http://') || input.startsWith('https://')) {
      console.log('🔗 Détection: URL Deliveroo');
      const urlCity = await extractCityFromUrl(input) || city;
      restaurant = await getRestaurantFromUrl(input, urlCity);
    } else if (input.startsWith('{') || input.endsWith('.json') || input.includes('"name"')) {
      console.log('📄 Détection: Données JSON');
      restaurant = parseRestaurantJson(input);
    } else {
      console.log('🏷️  Détection: Slug');
      restaurant = await getRestaurantFromSlug(input, city);
    }
    
    if (!restaurant) {
      throw new Error('Aucun restaurant trouvé');
    }
    
    console.log('');
    console.log('📋 Restaurant trouvé:');
    console.log(`   Nom: ${restaurant.name}`);
    console.log(`   ID: ${restaurant.id || restaurant.partner_drn_id || 'N/A'}`);
    console.log(`   Slug: ${restaurant.slug || 'N/A'}`);
    console.log(`   Adresse: ${restaurant.address || 'N/A'}`);
    console.log('');
    
    await addRestaurantToCity(restaurant, city);
    
    console.log('');
    console.log('✅ Terminé avec succès!');
    
  } catch (error) {
    console.error('');
    console.error('❌ Erreur:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { addRestaurantToCity, getRestaurantFromUrl, getRestaurantFromSlug };
