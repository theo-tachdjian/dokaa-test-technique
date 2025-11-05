// Parser pour extraire les vrais avis depuis le contenu HTML scrapé
// "Traduit" le contenu brut en avis exploitables

function parseReviewsFromHTML(htmlContent) {
  const reviews = [];
  
  // Méthode 1 : Chercher les patterns d'avis typiques
  // Les avis Google Maps ont souvent des structures comme :
  // - "Excellent restaurant ! Les plats sont..."
  // - "Très bon service, je recommande..."
  // - "Délicieux, je reviendrai..."
  
  const reviewPatterns = [
    // Patterns français communs dans les avis
    /(?:Excellent|Très bon|Délicieux|Parfait|Super|Bon|Génial|Formidable)[^.!?]{10,300}[.!?]/gi,
    /(?:Je recommande|Je reviendrai|À essayer|Très satisfait|Service|Plats|Cuisine)[^.!?]{10,300}[.!?]/gi,
    /(?:Restaurant|Repas|Commande|Livraison|Qualité|Prix|Ambiance)[^.!?]{10,300}[.!?]/gi
  ];
  
  for (const pattern of reviewPatterns) {
    const matches = htmlContent.match(pattern);
    if (matches) {
      matches.forEach((match, idx) => {
        const cleaned = cleanReviewText(match);
        if (isValidReviewText(cleaned)) {
          reviews.push({
            text: cleaned,
            confidence: 0.8
          });
        }
      });
    }
  }
  
  // Méthode 2 : Extraire depuis les structures JSON cachées dans la page
  try {
    const jsonMatches = htmlContent.match(/\[review.*?\]/gi);
    if (jsonMatches) {
      jsonMatches.forEach(match => {
        try {
          const parsed = JSON.parse(match);
          if (Array.isArray(parsed)) {
            parsed.forEach(item => {
              if (item.text || item.comment || item.reviewText) {
                const text = item.text || item.comment || item.reviewText;
                const cleaned = cleanReviewText(text);
                if (isValidReviewText(cleaned)) {
                  reviews.push({
                    text: cleaned,
                    rating: item.rating || item.starRating || 4,
                    author: item.authorName || item.author || 'Client',
                    date: item.date || new Date().toISOString().split('T')[0],
                    confidence: 0.9
                  });
                }
              }
            });
          }
        } catch (e) {
          // Pas du JSON valide, ignorer
        }
      });
    }
  } catch (e) {
    // Ignorer les erreurs de parsing JSON
  }
  
  // Méthode 3 : Extraire depuis les attributs data-*
  const dataReviewMatches = htmlContent.match(/data-review[^>]*>([^<]{20,300})</gi);
  if (dataReviewMatches) {
    dataReviewMatches.forEach(match => {
      const textMatch = match.match(/>([^<]{20,300})</);
      if (textMatch) {
        const cleaned = cleanReviewText(textMatch[1]);
        if (isValidReviewText(cleaned)) {
          reviews.push({
            text: cleaned,
            confidence: 0.7
          });
        }
      }
    });
  }
  
  // Dédupliquer et trier par confiance
  const uniqueReviews = [];
  const seen = new Set();
  
  reviews.forEach(review => {
    const key = review.text.substring(0, 50).toLowerCase();
    if (!seen.has(key) && review.text.length > 20) {
      seen.add(key);
      uniqueReviews.push(review);
    }
  });
  
  return uniqueReviews
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 10)
    .map((review, idx) => ({
      id: `parsed-${idx}-${Date.now()}`,
      rating: review.rating || 4,
      comment: review.text,
      date: review.date || new Date(Date.now() - idx * 86400000).toISOString().split('T')[0],
      author: review.author || `Client ${idx + 1}`,
      source: 'parsed'
    }));
}

function cleanReviewText(text) {
  if (!text) return '';
  
  // Nettoyer le texte
  text = text
    .replace(/\s+/g, ' ') // Espaces multiples
    .replace(/[^\w\s.,!?;:'"àâäéèêëïîôùûüÿçÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ-]/g, '') // Caractères étranges
    .trim();
  
  // Supprimer les préfixes/suffixes non pertinents
  text = text
    .replace(/^(cookie|confidentialité|privacy|function|var|window|document)/i, '')
    .replace(/(cookie|confidentialité|privacy|function|var|window|document)$/i, '')
    .trim();
  
  return text;
}

function isValidReviewText(text) {
  if (!text || text.length < 20) return false;
  
  const textLower = text.toLowerCase();
  
  // Exclure les patterns non pertinents
  const excludePatterns = [
    'cookie', 'cookies', 'confidentialité', 'privacy', 'function',
    'var ', 'window', 'document', 'script', 'attribute',
    'accepter', 'refuser', 'tout refuser', 'cliquez', 'consulter',
    'data-noaft', 'visible', 'use strict', 'page g'
  ];
  
  for (const pattern of excludePatterns) {
    if (textLower.includes(pattern)) return false;
  }
  
  // Doit contenir des mots liés à la restauration
  const restaurantWords = [
    'restaurant', 'plat', 'plats', 'repas', 'manger', 'délicieux',
    'bon', 'excellent', 'service', 'cuisine', 'goût', 'qualité',
    'recommand', 'reviendrai', 'satisfait', 'personnel', 'ambiance',
    'prix', 'commande', 'livraison', 'sushi', 'pizza', 'burger',
    'pâtes', 'salade', 'dessert', 'rapide', 'chaud', 'frais'
  ];
  
  const hasRestaurantWords = restaurantWords.some(word => textLower.includes(word));
  
  // Ou doit avoir une structure de phrase valide
  const hasStructure = text.length > 30 && (
    text.includes('.') || 
    text.includes('!') || 
    text.includes('?') ||
    text.split(' ').length > 5
  );
  
  return hasRestaurantWords || hasStructure;
}

module.exports = {
  parseReviewsFromHTML,
  cleanReviewText,
  isValidReviewText
};

