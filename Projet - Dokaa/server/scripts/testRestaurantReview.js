
const deliverooGraphQL = require('../services/deliverooGraphQL');
const cache = require('../services/cache');

async function testRestaurant(restaurantId) {
  console.log('🧪 TEST DE RÉCUPÉRATION À LA DEMANDE\n');
  console.log('='.repeat(60));
  
  cache.loadFromDisk();
  
  let restaurant = null;
  const allKeys = Array.from(cache.cache.keys());
  
  for (const key of allKeys) {
    if (key.startsWith('city:') || key.startsWith('all:') || key.startsWith('search:')) {
      const restaurants = cache.getStale(key) || [];
      const found = restaurants.find(r => 
        r.id === restaurantId || 
        r.id === parseInt(restaurantId) || 
        r.id?.toString() === restaurantId
      );
      if (found) {
        restaurant = found;
        break;
      }
    }
  }
  
  if (!restaurant) {
    console.log(`❌ Restaurant avec ID ${restaurantId} non trouvé dans le cache`);
    console.log('\n💡 Essayez avec un ID de restaurant existant');
    return;
  }
  
  console.log(`📋 Restaurant trouvé: ${restaurant.name}`);
  console.log(`   ID: ${restaurant.id}`);
  console.log(`   Slug: ${restaurant.slug || 'N/A'}`);
  console.log(`   URL: ${restaurant.url || 'N/A'}`);
  console.log(`   City: ${restaurant.city || 'N/A'}`);
  console.log(`   partner_drn_id actuel: ${restaurant.partner_drn_id || restaurant.partnerDrnId || 'NON TROUVÉ'}`);
  console.log(`   Format: ${(restaurant.partner_drn_id || restaurant.partnerDrnId)?.includes('-') ? '✅ UUID' : '❌ Nombre ou absent'}\n`);
  
  let partnerDrnId = restaurant.partner_drn_id || restaurant.partnerDrnId;
  
  if (!partnerDrnId || !partnerDrnId.includes('-')) {
    console.log('🔍 OPTION 3: Tentative récupération via getRestaurantDetails...\n');
    
    try {
      const slugOrUrl = restaurant.slug || restaurant.url;
      if (slugOrUrl) {
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
          if (city.includes('-')) city = city.split('-')[0];
          if (city.includes(' ')) city = city.split(' ')[0];
          
          let slug = slugParts[slugParts.length - 1];
          slug = slug.split('?')[0];
          
          if (restaurant.city) {
            city = restaurant.city.toLowerCase();
            if (city.includes('-')) city = city.split('-')[0];
            if (city.includes(' ')) city = city.split(' ')[0];
          }
          
          console.log(`   Slug extrait: ${slug}`);
          console.log(`   City extraite: ${city}`);
          
          if (!deliverooGraphQL.lastRateLimitError || Date.now() - deliverooGraphQL.lastRateLimitError > 60000) {
            const detailsResult = await deliverooGraphQL.getRestaurantDetails(slug, city);
            if (detailsResult?.restaurant) {
              const foundPartnerDrnId = detailsResult.restaurant.partner_drn_id || detailsResult.restaurant.partnerDrnId;
              if (foundPartnerDrnId && foundPartnerDrnId.includes('-')) {
                partnerDrnId = foundPartnerDrnId;
                console.log(`   ✅ SUCCÈS: partner_drn_id récupéré: ${partnerDrnId}\n`);
              } else {
                console.log(`   ⚠️  partner_drn_id trouvé mais format invalide: ${foundPartnerDrnId}\n`);
              }
            } else {
              console.log(`   ⚠️  Aucun restaurant dans la réponse\n`);
            }
          } else {
            const timeSince = Math.round((Date.now() - deliverooGraphQL.lastRateLimitError) / 1000);
            console.log(`   ⏳ Rate limiting actif (détecté il y a ${timeSince}s) - Méthode ignorée\n`);
          }
        } else {
          console.log(`   ⚠️  Impossible d'extraire slug/city depuis le slug\n`);
        }
      } else {
        console.log(`   ⚠️  Pas de slug ou URL disponible\n`);
      }
    } catch (error) {
      console.log(`   ❌ ERREUR: ${error.message}\n`);
    }
  } else {
    console.log('✅ partner_drn_id déjà présent (UUID valide)\n');
  }
  
  if (!partnerDrnId || !partnerDrnId.includes('-')) {
    console.log('🔍 OPTION 4: Tentative extraction depuis l\'URL (scraping HTML)...\n');
    
    try {
      const restaurantUrl = restaurant.url || (restaurant.slug ? `https:
      if (restaurantUrl) {
        console.log(`   URL utilisée: ${restaurantUrl}`);
        const extractedId = await deliverooGraphQL.extractPartnerDrnIdFromUrl(restaurantUrl);
        if (extractedId && extractedId.includes('-')) {
          partnerDrnId = extractedId;
          console.log(`   ✅ SUCCÈS: partner_drn_id extrait: ${partnerDrnId}\n`);
        } else {
          console.log(`   ⚠️  Aucun UUID trouvé dans la page HTML\n`);
        }
      } else {
        console.log(`   ⚠️  Pas d'URL disponible pour le scraping\n`);
      }
    } catch (error) {
      console.log(`   ❌ ERREUR: ${error.message}\n`);
    }
  }
  
  console.log('='.repeat(60));
  console.log('📝 TEST DE RÉCUPÉRATION DES AVIS\n');
  
  if (partnerDrnId && partnerDrnId.includes('-')) {
    console.log(`   partner_drn_id utilisé: ${partnerDrnId}`);
    console.log(`   Format: ✅ UUID (correct)\n`);
    
    try {
      if (deliverooGraphQL.lastRateLimitError && Date.now() - deliverooGraphQL.lastRateLimitError < 60000) {
        const timeSince = Math.round((Date.now() - deliverooGraphQL.lastRateLimitError) / 1000);
        console.log(`   ⏳ Rate limiting actif (détecté il y a ${timeSince}s) - Impossible de récupérer les avis pour l'instant`);
      } else {
        console.log(`   🔍 Tentative récupération des avis...`);
        const reviews = await deliverooGraphQL.getRestaurantReviews(partnerDrnId);
        
        if (reviews && reviews.length > 0) {
          console.log(`   ✅ SUCCÈS: ${reviews.length} avis récupérés !\n`);
          console.log('   Exemples d\'avis:');
          reviews.slice(0, 3).forEach((review, i) => {
            console.log(`   ${i + 1}. ${review.author || 'Anonyme'} - ${review.rating}★`);
            if (review.comment) {
              console.log(`      "${review.comment.substring(0, 60)}${review.comment.length > 60 ? '...' : ''}"`);
            }
          });
        } else {
          console.log(`   ⚠️  Aucun avis trouvé pour ce restaurant`);
        }
      }
    } catch (error) {
      console.log(`   ❌ ERREUR lors de la récupération des avis: ${error.message}`);
    }
  } else {
    console.log(`   ❌ Pas de partner_drn_id UUID valide - Impossible de récupérer les avis`);
    console.log(`   partner_drn_id actuel: ${partnerDrnId || 'N/A'}`);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Test terminé');
}

const restaurantId = process.argv[2];

if (!restaurantId) {
  console.log('❌ Usage: node scripts/testRestaurantReview.js [restaurant-id]');
  console.log('\n💡 Exemple: node scripts/testRestaurantReview.js 694350');
  process.exit(1);
}

if (require.main === module) {
  testRestaurant(restaurantId).catch(console.error);
}

module.exports = { testRestaurant };
