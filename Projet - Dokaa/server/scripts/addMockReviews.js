const cache = require('../services/cache');

const RESTAURANT_ID = 499620;
const RESTAURANT_NAME = 'MELTSHOP® - Marseille';
const AUTHOR = 'Théo Tachdjian';

const mockReviews = [
  {
    id: `review-${RESTAURANT_ID}-1`,
    restaurantId: RESTAURANT_ID,
    rating: 5,
    comment: 'Excellent restaurant ! Les burgers sont délicieux et la livraison était rapide. Je recommande vivement.',
    author: AUTHOR,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    verified: true
  },
  {
    id: `review-${RESTAURANT_ID}-2`,
    restaurantId: RESTAURANT_ID,
    rating: 5,
    comment: 'Super qualité, les ingrédients sont frais et le goût est au rendez-vous. Service client impeccable !',
    author: AUTHOR,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    verified: true
  },
  {
    id: `review-${RESTAURANT_ID}-3`,
    restaurantId: RESTAURANT_ID,
    rating: 4,
    comment: 'Très bon restaurant, les portions sont généreuses. Juste un petit bémol sur le temps de livraison qui était un peu long.',
    author: AUTHOR,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    verified: true
  },
  {
    id: `review-${RESTAURANT_ID}-4`,
    restaurantId: RESTAURANT_ID,
    rating: 2,
    comment: 'Déçu par la commande. La nourriture était froide à l\'arrivée et le burger était écrasé. Pas à la hauteur de mes attentes.',
    author: AUTHOR,
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    verified: false
  },
  {
    id: `review-${RESTAURANT_ID}-5`,
    restaurantId: RESTAURANT_ID,
    rating: 1,
    comment: 'Très mauvais service. Commande incomplète et erreur sur les ingrédients. Je ne recommanderai pas ce restaurant.',
    author: AUTHOR,
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    verified: false
  },
  {
    id: `review-${RESTAURANT_ID}-6`,
    restaurantId: RESTAURANT_ID,
    rating: 2,
    comment: 'Qualité moyenne. Les frites étaient molles et le burger manquait de saveur. Prix un peu élevé pour ce que c\'est.',
    author: AUTHOR,
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    verified: false
  },
  {
    id: `review-${RESTAURANT_ID}-7`,
    restaurantId: RESTAURANT_ID,
    rating: 3,
    comment: 'Points positifs :\n- Les ingrédients sont de bonne qualité\n- Le packaging est soigné\n- Prix raisonnables\n\nPoints négatifs :\n- Temps de livraison trop long (plus d\'1h)\n- La nourriture était tiède\n- Manque de variété dans le menu',
    author: AUTHOR,
    date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    verified: true
  },
  {
    id: `review-${RESTAURANT_ID}-8`,
    restaurantId: RESTAURANT_ID,
    rating: 4,
    comment: 'Bon rapport qualité-prix. Les burgers sont savoureux et les portions correctes. Je reviendrai !',
    author: AUTHOR,
    date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    verified: true
  },
  {
    id: `review-${RESTAURANT_ID}-9`,
    restaurantId: RESTAURANT_ID,
    rating: 3,
    comment: 'Correct sans plus. Rien d\'exceptionnel mais ça fait le travail. Service correct.',
    author: AUTHOR,
    date: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    verified: false
  },
  {
    id: `review-${RESTAURANT_ID}-10`,
    restaurantId: RESTAURANT_ID,
    rating: 5,
    comment: 'Parfait ! Tout était excellent : goût, présentation, livraison. Un de mes restaurants préférés maintenant.',
    author: AUTHOR,
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    verified: true
  }
];

const cacheKey = `reviews:${RESTAURANT_ID}`;
cache.set(cacheKey, mockReviews, 'reviews');

console.log(`✅ ${mockReviews.length} avis mock ajoutés pour ${RESTAURANT_NAME} (ID: ${RESTAURANT_ID})`);
console.log(`   Clé cache: ${cacheKey}`);
console.log(`   Auteur: ${AUTHOR}`);
console.log(`   Répartition: 3 positifs (5★), 3 négatifs (1-2★), 1 mixte (3★), 3 autres`);

setTimeout(() => {
  const saved = cache.get(cacheKey);
  if (saved && saved.length === mockReviews.length) {
    console.log(`\n✅ Vérification: ${saved.length} avis bien sauvegardés dans le cache`);
    process.exit(0);
  } else {
    console.log(`\n⚠️  Problème de sauvegarde, réessayez...`);
    process.exit(1);
  }
}, 2000);

