const express = require('express');
const router = express.Router();
const deliverooGraphQL = require('../services/deliverooGraphQL');
const cache = require('../services/cache');

router.post('/reset-circuit-breaker', (req, res) => {
  try {
    deliverooGraphQL.resetCircuitBreaker();
    res.json({ 
      success: true, 
      message: 'Circuit breaker réinitialisé avec succès' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

router.get('/circuit-breaker-status', (req, res) => {
  try {
    const state = deliverooGraphQL.getCircuitBreakerState();
    res.json(state);
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
});

function extractSlugAndCity(restaurant) {
  const slugOrUrl = restaurant.slug || restaurant.url;
  if (!slugOrUrl) return null;
  
  let cleanSlug = slugOrUrl.split('?')[0];
  cleanSlug = cleanSlug.replace(/^https?:\/\/[^\/]+/, '');
  
  const slugParts = cleanSlug.split('/').filter(p => p);
  
  let menuIndex = -1;
  for (let i = 0; i < slugParts.length; i++) {
    if (slugParts[i] === 'menu' || slugParts[i] === 'restaurants') {
      menuIndex = i;
      break;
    }
  }
  
  if (menuIndex >= 0 && menuIndex + 2 < slugParts.length) {
    let city = slugParts[menuIndex + 1];
    
    city = city.toLowerCase().trim();
    if (city.includes('-')) {
      city = city.split('-')[0];
    }
    if (city.includes(' ')) {
      city = city.split(' ')[0];
    }
    
    let slug = slugParts[slugParts.length - 1];
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
  
  return null;
}

router.get('/cities', async (req, res) => {
  try {
    const cities = [
      'Marseille', 'Paris', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 
      'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille', 'Rennes',
      'Reims', 'Le Havre', 'Saint-Étienne', 'Toulon', 'Angers',
      'Grenoble', 'Dijon', 'Nîmes', 'Villeurbanne', 'Saint-Denis',
      'Le Mans', 'Aix-en-Provence', 'Clermont-Ferrand', 'Brest',
      'Limoges', 'Tours', 'Amiens', 'Perpignan', 'Metz', 'Besançon',
      'Boulogne-Billancourt', 'Orléans', 'Mulhouse', 'Rouen', 'Caen',
      'Nancy', 'Argenteuil', 'Montreuil', 'Roubaix', 'Tourcoing',
      'Nanterre', 'Avignon', 'Créteil', 'Dunkirk', 'Poitiers'
    ];
    res.json(cities);
  } catch (error) {
    console.error('Erreur récupération villes:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

async function fetchRestaurantReviews(restaurant) {
  const partnerDrnId = restaurant.id;
  
  if (!partnerDrnId) {
    return [];
  }
  
  try {
    const reviews = await deliverooGraphQL.getRestaurantReviews(partnerDrnId);
    return reviews.slice(0, 10);
  } catch (error) {
    console.error(`  ⚠️  Erreur avis pour ${restaurant.name}:`, error.message);
    return [];
  }
}

async function processRestaurantsInBatches(restaurants, batchSize = 5, delay = 200) {
  const results = [];
  
  for (let i = 0; i < restaurants.length; i += batchSize) {
    const batch = restaurants.slice(i, i + batchSize);
    const batchPromises = batch.map(async (restaurant) => {
      const reviews = await fetchRestaurantReviews(restaurant);
      return { ...restaurant, reviews };
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    if (i + batchSize < restaurants.length) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return results;
}

router.get('/all', async (req, res) => {
  try {
    const cities = [
      'Marseille', 'Paris', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 
      'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille', 'Rennes',
      'Reims', 'Le Havre', 'Saint-Étienne', 'Toulon', 'Angers',
      'Grenoble', 'Dijon', 'Nîmes', 'Villeurbanne', 'Saint-Denis',
      'Le Mans', 'Aix-en-Provence', 'Clermont-Ferrand', 'Brest',
      'Limoges', 'Tours', 'Amiens', 'Perpignan', 'Metz', 'Besançon',
      'Boulogne-Billancourt', 'Orléans', 'Mulhouse', 'Rouen', 'Caen',
      'Nancy', 'Argenteuil', 'Montreuil', 'Roubaix', 'Tourcoing',
      'Nanterre', 'Avignon', 'Créteil', 'Dunkirk', 'Poitiers'
    ];
    
    const cacheKey = 'all:all-cities';
    const cached = cache.get(cacheKey);
    
    if (cached) {
      console.log(`Retour depuis le cache: ${cached.length} restaurants`);
      return res.json(cached);
    }

    const cachedAll = cache.getStale(cacheKey);
    if (cachedAll && cachedAll.length > 0) {
      console.log(`✅ Retour depuis le cache: ${cachedAll.length} restaurants pour toutes les villes`);
      return res.json(cachedAll);
    }
    
    console.log(`Début récupération de TOUS les restaurants de ${cities.length} villes...`);
    const allRestaurants = [];
    const uniqueRestaurantIds = new Set();
    
    for (const city of cities) {
      const cityCacheKey = `city:${city}`;
      const cityCache = cache.getStale(cityCacheKey);
      if (cityCache && Array.isArray(cityCache) && cityCache.length > 0) {
        for (const restaurant of cityCache) {
          const restaurantId = restaurant.id;
          if (!uniqueRestaurantIds.has(restaurantId)) {
            uniqueRestaurantIds.add(restaurantId);
            allRestaurants.push(restaurant);
          }
        }
        console.log(`  ✓ ${cityCache.length} restaurants depuis le cache pour ${city}`);
      }
    }
    
    for (let i = 0; i < cities.length; i++) {
      const city = cities[i];
      try {
        console.log(`[${i + 1}/${cities.length}] Récupération restaurants de ${city}...`);
        const restaurants = await deliverooGraphQL.getAllRestaurants(city);
        
        for (const restaurant of restaurants) {
          const restaurantId = restaurant.id;
          if (!uniqueRestaurantIds.has(restaurantId)) {
            uniqueRestaurantIds.add(restaurantId);
            allRestaurants.push({ ...restaurant, city });
          }
        }
        
        console.log(`  ✓ ${restaurants.length} restaurants trouvés pour ${city} (Total unique: ${allRestaurants.length})`);
        
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`  ✗ Erreur pour ${city}:`, error.message);
      }
    }
    
    console.log(`\n✅ RÉCUPÉRATION RESTAURANTS TERMINÉE: ${allRestaurants.length} restaurants uniques`);
    
    if (allRestaurants.length > 0) {
      cache.set(cacheKey, allRestaurants, 'restaurants');
    }
    
    res.json(allRestaurants);
  } catch (error) {
    console.error('Erreur récupération tous restaurants:', error);
    const cachedAll = cache.getStale(cacheKey);
    if (cachedAll && cachedAll.length > 0) {
      console.log(`✅ Utilisation du cache de secours (${cachedAll.length} restaurants)`);
      return res.json(cachedAll);
    }
    res.json([]);
  }
});

router.get('/city/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const cityLower = city.toLowerCase();
    
    const cacheKey = `city:${cityLower}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      console.log(`Retour depuis le cache: ${cached.length} restaurants pour ${city}`);
      return res.json(cached);
    }

      try {
        const staleCache = cache.getStale(cacheKey);
        if (staleCache && staleCache.length > 0) {
          console.log(`✅ Utilisation du cache (${staleCache.length} restaurants pour ${city})`);
          return res.json(staleCache);
        }
        
        const allCacheKeys = Array.from(cache.cache.keys());
        const exactCityKey = `city:${cityLower}`;
        const exactCityCache = cache.getStale(exactCityKey);
        if (exactCityCache && Array.isArray(exactCityCache) && exactCityCache.length > 0) {
          console.log(`✅ Utilisation du cache exact depuis ${exactCityKey} (${exactCityCache.length} restaurants)`);
          return res.json(exactCityCache);
        }
        
        for (const key of allCacheKeys) {
          if (key === `city:${cityLower}` || key === `all:${cityLower}`) {
            const cachedData = cache.getStale(key);
            if (cachedData && Array.isArray(cachedData) && cachedData.length > 0) {
              console.log(`✅ Utilisation du cache alternatif depuis ${key} (${cachedData.length} restaurants)`);
              return res.json(cachedData);
            }
          }
        }
        
        console.log(`Récupération restaurants pour ${city}...`);
        try {
          const restaurants = await deliverooGraphQL.getAllRestaurants(city);
          console.log(`✓ ${restaurants.length} restaurants trouvés pour ${city}`);
          
          const restaurantsWithCity = restaurants.map(r => ({ ...r, city }));
          
          cache.set(cacheKey, restaurantsWithCity, 'restaurants');
          
          console.log(`📤 Envoi de ${restaurantsWithCity.length} restaurants au client`);
          return res.json(restaurantsWithCity);
        } catch (error) {
          console.error(`Erreur GraphQL pour ${city}:`, error.message);
          
          const finalCache = cache.getStale(cacheKey);
          if (finalCache && finalCache.length > 0) {
            console.log(`✅ Utilisation du cache après erreur (${finalCache.length} restaurants pour ${city})`);
            return res.json(finalCache);
          }
          
          const cityLower = city.toLowerCase();
          const exactCityKey = `city:${cityLower}`;
          const exactCityCache = cache.getStale(exactCityKey);
          if (exactCityCache && Array.isArray(exactCityCache) && exactCityCache.length > 0) {
            console.log(`✅ Utilisation du cache exact après erreur depuis ${exactCityKey} (${exactCityCache.length} restaurants)`);
            return res.json(exactCityCache);
          }
          
          for (const key of allCacheKeys) {
            if (key === `city:${cityLower}` || key === `all:${cityLower}`) {
              const cachedData = cache.getStale(key);
              if (cachedData && Array.isArray(cachedData) && cachedData.length > 0) {
                console.log(`✅ Utilisation du cache alternatif après erreur depuis ${key} (${cachedData.length} restaurants)`);
                return res.json(cachedData);
              }
            }
          }
          
          console.log(`⚠️  Aucun cache disponible pour ${city} et Deliveroo bloqué - Retour d'un tableau vide`);
          console.log(`💡 Solutions:`);
          console.log(`   1. Attendre 5-10 minutes que le rate limiting se réinitialise`);
          console.log(`   2. Mettre à jour le cookie: npm run update-cookie`);
          console.log(`   3. Les restaurants seront mis en cache lors de la prochaine récupération réussie`);
          return res.json([]);
        }
      } catch (error) {
        console.error(`Erreur récupération restaurants pour ${city}:`, error.message);
        const staleCache = cache.getStale(cacheKey);
        if (staleCache && staleCache.length > 0) {
          return res.json(staleCache);
        }
        res.json([]);
      }
  } catch (error) {
    console.error('Erreur récupération restaurants:', error);
    const staleCache = cache.getStale(cacheKey);
    if (staleCache && staleCache.length > 0) {
      return res.json(staleCache);
    }
    res.json([]);
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q, city } = req.query;
    
    const cityToUse = city || undefined;
    const cityForCache = cityToUse || 'all';

    const cacheKey = q ? `search:${q}:${cityForCache}` : (cityToUse ? `all:${cityToUse}` : 'all:all');
    const cached = cache.get(cacheKey);
    
    if (cached) {
      console.log(`✅ Cache hit pour ${cacheKey} (${cached.length} restaurants)`);
      return res.json(cached);
    }

    try {
      const staleCache = cache.getStale(cacheKey);
      if (staleCache && staleCache.length > 0) {
        console.log(`✅ Utilisation du cache (${staleCache.length} restaurants) - Les données peuvent être obsolètes`);
        return res.json(staleCache);
      }
      
      if (cityToUse) {
        const cityCacheKey = `city:${cityToUse.toLowerCase()}`;
        const cityCache = cache.getStale(cityCacheKey);
        if (cityCache && Array.isArray(cityCache) && cityCache.length > 0) {
          console.log(`✅ Utilisation du cache de ville depuis ${cityCacheKey} (${cityCache.length} restaurants)`);
          if (q && q.trim().length > 0) {
            const queryLower = q.toLowerCase();
            const filtered = cityCache.filter(r => 
              r.name?.toLowerCase().includes(queryLower) ||
              r.cuisine?.toLowerCase().includes(queryLower) ||
              r.address?.toLowerCase().includes(queryLower)
            );
            console.log(`🔍 ${filtered.length} restaurants trouvés après filtrage par "${q}"`);
            return res.json(filtered);
          }
          return res.json(cityCache);
        }
      }
      
      try {
        let restaurants = [];
        if (q && q.trim().length > 0) {
          if (cityToUse) {
            restaurants = await deliverooGraphQL.searchRestaurants(q, cityToUse);
          } else {
            console.log('⚠️  Recherche sans ville spécifiée - retour d\'un tableau vide');
            return res.json([]);
          }
        } else {
          if (cityToUse) {
            restaurants = await deliverooGraphQL.getAllRestaurants(cityToUse);
          } else {
            console.log('⚠️  Aucune ville ni recherche spécifiée - retour d\'un tableau vide');
            return res.json([]);
          }
        }
        
        if (restaurants && restaurants.length > 0) {
          const restaurantsWithCity = restaurants.map(r => ({ ...r, city: cityToUse || r.city || 'unknown' }));
          cache.set(cacheKey, restaurantsWithCity, 'restaurants');
          console.log(`✅ ${restaurantsWithCity.length} restaurants récupérés et mis en cache`);
          return res.json(restaurantsWithCity);
        }
      } catch (error) {
        console.error('\n❌ ERREUR RECHERCHE RESTAURANTS ❌');
        console.error('📋 Message:', error.message);
        
        const finalCache = cache.getStale(cacheKey);
        if (finalCache && finalCache.length > 0) {
          console.log(`✅ Utilisation du cache après erreur (${finalCache.length} restaurants)`);
          return res.json(finalCache);
        }
        
        if (cityToUse) {
          const cityCacheKey = `city:${cityToUse.toLowerCase()}`;
          const cityCache = cache.getStale(cityCacheKey);
          if (cityCache && Array.isArray(cityCache) && cityCache.length > 0) {
            if (q && q.trim().length > 0) {
              const queryLower = q.toLowerCase();
              const filtered = cityCache.filter(r => 
                r.name?.toLowerCase().includes(queryLower) ||
                r.cuisine?.toLowerCase().includes(queryLower) ||
                r.address?.toLowerCase().includes(queryLower)
              );
              console.log(`✅ Utilisation du cache de ville après erreur depuis ${cityCacheKey} (${filtered.length} restaurants après filtrage)`);
              return res.json(filtered);
            }
            console.log(`✅ Utilisation du cache de ville après erreur depuis ${cityCacheKey} (${cityCache.length} restaurants)`);
            return res.json(cityCache);
          }
        }
      }
      
      console.log(`⚠️  Aucun cache disponible et Deliveroo bloqué - Retour d'un tableau vide`);
      return res.json([]);
    } catch (error) {
      console.error('Erreur recherche:', error);
      const allCacheKeys = Array.from(cache.cache.keys());
      for (const key of allCacheKeys) {
        if (key.startsWith('search:') || key.startsWith('city:') || key.startsWith('all:')) {
          const cachedData = cache.getStale(key);
          if (cachedData && Array.isArray(cachedData) && cachedData.length > 0) {
            console.log(`✅ Utilisation du cache de secours depuis ${key} (${cachedData.length} restaurants)`);
            return res.json(cachedData);
          }
        }
      }
      res.json([]);
    }
  } catch (error) {
    console.error('Erreur recherche:', error);
    const allCacheKeys = Array.from(cache.cache.keys());
    for (const key of allCacheKeys) {
      const cachedData = cache.getStale(key);
      if (cachedData && Array.isArray(cachedData) && cachedData.length > 0) {
        return res.json(cachedData);
      }
    }
    res.json([]);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const cacheKey = `restaurant:${id}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return res.json(cached);
    }

    try {
      let restaurant = null;
      
      if (id.includes('--')) {
        try {
          const [slug, city] = id.split('--');
          const result = await deliverooGraphQL.getRestaurantDetails(slug, city);
          restaurant = result?.restaurant || result;
        
          if (restaurant && (restaurant.partnerDrnId || restaurant.partner_drn_id)) {
            restaurant.partner_drn_id = restaurant.partner_drn_id || restaurant.partnerDrnId;
          }
        } catch (error) {
          console.error(`Erreur récupération détails pour ${id}:`, error.message);
        }
      } else {
        const cacheKeys = Array.from(cache.cache.keys());
        for (const key of cacheKeys) {
          if (key.startsWith('all:') || key.startsWith('search:') || key.startsWith('city:')) {
            const restaurants = cache.get(key) || [];
            const found = restaurants.find(r => r.id === id || r.id === parseInt(id));
            if (found) {
              if (found.slug) {
                const slugParts = found.slug.split('/').filter(p => p);
                if (slugParts.length >= 5 && slugParts[1] === 'restaurants') {
                  const city = found.city || slugParts[2];
                  const slug = slugParts.slice(4).join('/');
                  
                  try {
                    const result = await deliverooGraphQL.getRestaurantDetails(slug, city);
                    restaurant = result?.restaurant || result;
                    
                    if (restaurant && (restaurant.partnerDrnId || restaurant.partner_drn_id)) {
                      restaurant.partner_drn_id = restaurant.partner_drn_id || restaurant.partnerDrnId;
                    }
                    
                    if (restaurant) break;
                  } catch (err) {
                    console.error(`Erreur récupération détails pour ${slug}, ${city}:`, err.message);
                  }
                }
              }
              
              if (!restaurant && found.id && found.name) {
                restaurant = found;
                break;
              }
            }
          }
        }
      }
      
      if (!restaurant) {
        const staleRestaurant = cache.getStale(cacheKey);
        if (staleRestaurant) {
          console.log(`⚠️  Utilisation du cache expiré pour le restaurant ${id}`);
          return res.json(staleRestaurant);
        }
        return res.status(404).json({ error: 'Restaurant introuvable' });
      }

      try {
        let partnerDrnId = restaurant.partner_drn_id || restaurant.partnerDrnId;
        
        if (!partnerDrnId || !partnerDrnId.includes('-')) {
          console.log(`🔍 Tentative récupération partner_drn_id à la demande...`);
          
          try {
            const extracted = extractSlugAndCity(restaurant);
            if (extracted && extracted.slug && extracted.city) {
              const { slug, city } = extracted;
              
              console.log(`   Slug extrait: ${slug}`);
              console.log(`   City extraite: ${city}`);
              
              if (!deliverooGraphQL.lastRateLimitError || Date.now() - deliverooGraphQL.lastRateLimitError > 60000) {
                const detailsResult = await deliverooGraphQL.getRestaurantDetails(slug, city);
                if (detailsResult?.restaurant) {
                  const detailsRestaurant = detailsResult.restaurant;
                  const foundPartnerDrnId = detailsRestaurant.partner_drn_id || detailsRestaurant.partnerDrnId;
                  
                  if (foundPartnerDrnId && foundPartnerDrnId.includes('-')) {
                    partnerDrnId = foundPartnerDrnId;
                    restaurant.partner_drn_id = foundPartnerDrnId;
                    console.log(`✅ partner_drn_id récupéré depuis getRestaurantDetails: ${partnerDrnId}`);
                    cache.set(cacheKey, restaurant, 'restaurants');
                  }
                }
              } else {
                const timeSince = Math.round((Date.now() - deliverooGraphQL.lastRateLimitError) / 1000);
                console.log(`   ⏳ Rate limiting actif (détecté il y a ${timeSince}s) - Méthode ignorée`);
              }
            } else {
              console.log(`   ⚠️  Impossible d'extraire slug/city depuis le restaurant`);
            }
          } catch (detailsError) {
            console.log(`⚠️  Impossible de récupérer partner_drn_id depuis getRestaurantDetails:`, detailsError.message);
          }
          
          if (!partnerDrnId || !partnerDrnId.includes('-')) {
            try {
              const restaurantUrl = restaurant.url || (restaurant.slug ? 'https://deliveroo.fr' + restaurant.slug : null);
              if (restaurantUrl) {
                console.log('Tentative extraction partner_drn_id depuis l URL (scraping HTML)...');
                const extractedId = await deliverooGraphQL.extractPartnerDrnIdFromUrl(restaurantUrl);
                if (extractedId && extractedId.includes('-')) {
                  partnerDrnId = extractedId;
                  restaurant.partner_drn_id = extractedId;
                  console.log(`✅ partner_drn_id extrait depuis l'URL: ${partnerDrnId}`);
                  cache.set(cacheKey, restaurant, 'restaurants');
                }
              }
            } catch (urlError) {
              console.log(`⚠️  Impossible d'extraire partner_drn_id depuis l'URL:`, urlError.message);
            }
          }
        }
        
        if (!partnerDrnId || !partnerDrnId.includes('-')) {
          partnerDrnId = restaurant.id;
          console.log(`⚠️  Pas de partner_drn_id UUID trouvé, utilisation de l'ID: ${partnerDrnId}`);
          console.log(`   ⚠️  L'ID est un nombre, mais le partner_drn_id devrait être un UUID`);
          console.log(`   💡 Les avis ne pourront probablement pas être récupérés avec cet ID`);
        }
        
        console.log(`🔍 Tentative récupération avis pour ${restaurant.name}:`);
        console.log(`   - ID restaurant: ${restaurant.id}`);
        console.log(`   - partner_drn_id utilisé: ${partnerDrnId}`);
        console.log(`   - Format: ${partnerDrnId.includes('-') ? '✅ UUID (correct)' : '❌ Nombre (incorrect - devrait être UUID)'}`);
        
        if (partnerDrnId && partnerDrnId.includes('-')) {
          if (deliverooGraphQL.lastRateLimitError && Date.now() - deliverooGraphQL.lastRateLimitError < 60000) {
            console.log(`⚠️  Rate limiting actif (détecté il y a ${Math.round((Date.now() - deliverooGraphQL.lastRateLimitError) / 1000)}s) - Les avis seront récupérés à la demande`);
          } else {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            try {
              const reviews = await deliverooGraphQL.getRestaurantReviews(partnerDrnId);
              if (reviews && reviews.length > 0) {
                restaurant.reviews = reviews;
                console.log(`✅ ${reviews.length} avis récupérés pour ${restaurant.name}`);
                cache.set(`reviews:${restaurant.id}`, reviews, 'reviews', 3600000); 
              } else {
                console.log(`⚠️  Aucun avis trouvé pour ${restaurant.name}`);
              }
            } catch (reviewErr) {
              console.log(`⚠️  Erreur récupération avis (sera récupéré à la demande): ${reviewErr.message}`);
            }
          }
        } else {
          console.log(`⚠️  partner_drn_id invalide - Les avis ne pourront pas être récupérés`);
          console.log(`   💡 Exécutez: npm run fetch-partner-ids pour récupérer les UUIDs`);
        }
      } catch (reviewError) {
        console.error(`❌ Erreur récupération avis pour ${restaurant.name}:`, reviewError.message);
      }

      cache.set(cacheKey, restaurant, 'restaurants');
      res.json(restaurant);
    } catch (error) {
      console.error('Erreur récupération restaurant:', error.message);
      
      const staleRestaurant = cache.getStale(cacheKey);
      if (staleRestaurant) {
        console.log(`⚠️  Utilisation du cache expiré après erreur pour le restaurant ${id}`);
        return res.json(staleRestaurant);
      }
      
      console.error('Erreur GraphQL:', error.message);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération',
        details: error.message 
      });
    }
  } catch (error) {
    console.error('Erreur récupération restaurant:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    
    const cacheKey = `reviews:${id}`;
    const cached = cache.get(cacheKey);
    
    if (cached && cached.length > 0) {
      console.log(`✅ Retour depuis le cache: ${cached.length} avis pour ${id}`);
      return res.json(cached);
    }

    try {
      let slug = null;
      let city = null;
      let restaurant = null;
      
      if (id.includes('--')) {
        [slug, city] = id.split('--');
      } else {
        const cacheKeys = Array.from(cache.cache.keys());
        for (const key of cacheKeys) {
          if (key.startsWith('all:') || key.startsWith('search:') || key.startsWith('city:') || key.startsWith('restaurant:')) {
            let restaurants = cache.get(key);
            if (!restaurants) continue;
            if (!Array.isArray(restaurants)) restaurants = [restaurants];
            const found = restaurants.find(r => r.id === id || r.id === parseInt(id) || r.id?.toString() === id);
            if (found) {
              restaurant = found;
              const extracted = extractSlugAndCity(found);
              if (extracted) {
                slug = extracted.slug;
                city = extracted.city;
                break;
              }
            }
          }
        }
      }
      
      let partnerDrnId = null;
      
      if (restaurant) {
        partnerDrnId = restaurant.partner_drn_id || restaurant.partnerDrnId;
        console.log(`📋 partner_drn_id depuis cache: ${partnerDrnId || 'non trouvé'}`);
      }
      
      if (!partnerDrnId) {
        const cacheKeys = Array.from(cache.cache.keys());
        for (const key of cacheKeys) {
          if (key.startsWith('all:') || key.startsWith('search:') || key.startsWith('city:')) {
            const restaurants = cache.get(key) || [];
            const found = restaurants.find(r => r.id === id || r.id === parseInt(id) || r.id?.toString() === id);
            if (found) {
              partnerDrnId = found.partner_drn_id || found.partnerDrnId;
              if (partnerDrnId) break;
            }
          }
        }
      }
      
      if (!partnerDrnId || !partnerDrnId.includes('-')) {
        if (slug && city) {
          console.log(`🔍 Tentative récupération partner_drn_id depuis getRestaurantDetails (${slug}, ${city})...`);
          try {
            if (!deliverooGraphQL.lastRateLimitError || Date.now() - deliverooGraphQL.lastRateLimitError > 60000) {
              const detailsResult = await deliverooGraphQL.getRestaurantDetails(slug, city);
              if (detailsResult?.restaurant) {
                const foundPartnerDrnId = detailsResult.restaurant.partner_drn_id || detailsResult.restaurant.partnerDrnId;
                if (foundPartnerDrnId && foundPartnerDrnId.includes('-')) {
                  partnerDrnId = foundPartnerDrnId;
                  console.log(`✅ partner_drn_id récupéré depuis getRestaurantDetails: ${partnerDrnId}`);
                  if (restaurant) {
                    restaurant.partner_drn_id = foundPartnerDrnId;
                    const restaurantCacheKey = `restaurant:${id}`;
                    cache.set(restaurantCacheKey, restaurant, 'restaurants');
                  }
                }
              }
            }
          } catch (detailsError) {
            console.log(`⚠️  Impossible de récupérer partner_drn_id depuis getRestaurantDetails:`, detailsError.message);
          }
        }
        
        if (!partnerDrnId || !partnerDrnId.includes('-')) {
          if (restaurant && (restaurant.url || restaurant.slug)) {
            try {
              const restaurantUrl = restaurant.url || (restaurant.slug ? 'https://deliveroo.fr' + restaurant.slug : null);
              if (restaurantUrl) {
                console.log('Tentative extraction partner_drn_id depuis l URL (scraping HTML)...');
                const extractedId = await deliverooGraphQL.extractPartnerDrnIdFromUrl(restaurantUrl);
                if (extractedId && extractedId.includes('-')) {
                  partnerDrnId = extractedId;
                  console.log(`✅ partner_drn_id extrait depuis l'URL: ${partnerDrnId}`);
                  if (restaurant) {
                    restaurant.partner_drn_id = extractedId;
                    const restaurantCacheKey = `restaurant:${id}`;
                    cache.set(restaurantCacheKey, restaurant, 'restaurants');
                  }
                }
              }
            } catch (urlError) {
              console.log(`⚠️  Impossible d'extraire partner_drn_id depuis l'URL:`, urlError.message);
            }
          }
        }
      }
      
      if (!partnerDrnId || !partnerDrnId.includes('-')) {
        partnerDrnId = id;
        console.log(`⚠️  Utilisation de l'ID comme partner_drn_id (peut ne pas fonctionner): ${partnerDrnId}`);
      }
      
      if (!partnerDrnId) {
        console.log(`❌ Impossible de trouver un partner_drn_id pour ${id}`);
        return res.json([]);
      }
      
      console.log(`🔍 Récupération avis pour ID ${id}, partner_drn_id: ${partnerDrnId}`);
      console.log(`   Format: ${partnerDrnId.includes('-') ? '✅ UUID (correct)' : '❌ Nombre (peut ne pas fonctionner)'}`);
      
      const reviews = await deliverooGraphQL.getRestaurantReviews(partnerDrnId, 0, false);
      const last10Reviews = reviews.slice(0, 10);
      
      if (last10Reviews.length > 0) {
        cache.set(cacheKey, last10Reviews, 'reviews');
        console.log(`✅ ${last10Reviews.length} avis récupérés et mis en cache pour ${id}`);
        return res.json(last10Reviews);
      }
      
      const staleReviews = cache.getStale(cacheKey);
      if (staleReviews && staleReviews.length > 0) {
        console.log(`⚠️  Utilisation du cache expiré (${staleReviews.length} avis)`);
        return res.json(staleReviews);
      }
      
      console.log(`⚠️  Aucun avis trouvé pour ${id} avec partner_drn_id ${partnerDrnId}`);
      res.json([]);
    } catch (error) {
      console.error('Erreur GraphQL pour les avis:', error.message);
      
      const staleReviews = cache.getStale(cacheKey);
      if (staleReviews && staleReviews.length > 0) {
        console.log(`⚠️  Utilisation du cache expiré après erreur (${staleReviews.length} avis)`);
        return res.json(staleReviews);
      }
      
      const errorMessage = error.message || 'Erreur inconnue';
      res.status(500).json({ 
        error: 'Erreur lors de la récupération des avis',
        details: errorMessage
      });
    }
  } catch (error) {
    console.error('Erreur récupération avis:', error);
    res.status(500).json({ 
      error: 'Erreur serveur',
      details: error.message || 'Erreur inconnue'
    });
  }
});

module.exports = router;
