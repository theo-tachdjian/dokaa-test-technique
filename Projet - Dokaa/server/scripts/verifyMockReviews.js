const cache = require('../services/cache');

const RESTAURANT_ID = 499620;
const cacheKey = `reviews:${RESTAURANT_ID}`;

const reviews = cache.get(cacheKey);

if (reviews && reviews.length > 0) {
  console.log('SUCCES: ' + reviews.length + ' avis trouves dans le cache');
  console.log('');
  console.log('Apercu des avis:');
  reviews.slice(0, 5).forEach((r, i) => {
    console.log((i+1) + '. ' + r.rating + '★ par ' + r.author);
    console.log('   "' + r.comment.substring(0, 80) + '..."');
    console.log('   Date: ' + new Date(r.date).toLocaleDateString('fr-FR'));
    console.log('');
  });
  console.log('Total: ' + reviews.length + ' avis');
  console.log('Auteur: ' + reviews[0].author);
} else {
  console.log('Aucun avis trouve pour ' + cacheKey);
}

process.exit(0);

