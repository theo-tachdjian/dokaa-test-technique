


function isValidReview(comment) {
  if (!comment || typeof comment !== 'string') return false;
  
  const commentLower = comment.toLowerCase().trim();
  
  
  if (commentLower.length < 30) return false;
  
  
  const excludePatterns = [
    
    'function', 'var ', 'window', 'document', 'script', 'javascript',
    'use strict', 'attribute', 'data-noaft', 'visible',
    
    'aria-label', 'jsname', 'class=', 'div', 'span', 'input type',
    'quot;', '&quot;', '<', '>', 'href=', 'src=',
    
    'http', 'https', 'www.', '.com', '.fr', 'url', 'encode',
    'restaurant25', 'restaurant20', '%20', '%26', 'u0026', 'u003d',
    
    'cookie', 'cookies', 'confidentialité', 'privacy', 'politique',
    'conditions', 'données', 'paramètres', 'settings', 'consent',
    'accepter', 'refuser', 'tout refuser', 'tout accepter',
    
    'services_cb', 'gm_grey', 'd4r55', 'jftief', 'myened', 'wi7pd',
    'mj7q1b', 'mulwjd', 'mypbod', 'nlolef', 'a0gyw',
    
    'gaeu003d', 'glu003d', 'hlu003d', 'cmu003d', 'pcu003d',
    'set_sc', 'set_ytc', 'set_aps', 'boq identity',
    'identityfrontenduiserver'
  ];
  
  
  for (const pattern of excludePatterns) {
    if (commentLower.includes(pattern)) {
      return false;
    }
  }
  
  
  const specialCharRatio = (comment.match(/[%&<>"=;:]/g) || []).length / comment.length;
  if (specialCharRatio > 0.1) { // Plus de 10% de caractères spéciaux = probablement du code
    return false;
  }
  
  // Exclure les textes qui sont juste des URLs encodées
  if (comment.match(/^[a-z0-9%&\-]+$/i) && comment.length > 50) {
    return false;
  }
  
  // Exclure les textes qui contiennent beaucoup de caractères techniques
  const techCharMatches = comment.match(/[a-z]+[0-9]+[a-z]+/gi);
  if (techCharMatches && techCharMatches.length > 3) {
    return false;
  }
  
  // DOIT contenir des mots liés à la restauration (OBLIGATOIRE)
  const restaurantWords = [
    'restaurant', 'plat', 'plats', 'repas', 'manger', 'délicieux',
    'bon', 'excellent', 'service', 'cuisine', 'goût', 'goûteux',
    'qualité', 'recommand', 'reviendrai', 'satisfait', 'satisfaction',
    'personnel', 'ambiance', 'prix', 'commande', 'livraison',
    'sushi', 'pizza', 'burger', 'pâtes', 'salade', 'dessert',
    'rapide', 'chaud', 'froid', 'frais', 'savoureux', 'copieux',
    'client', 'je', 'nous', 'très', 'vraiment', 'parfait'
  ];
  
  const hasRestaurantWords = restaurantWords.some(word => commentLower.includes(word));
  
  // DOIT avoir une structure de phrase valide (OBLIGATOIRE)
  const hasPunctuation = comment.includes('.') || comment.includes('!') || comment.includes('?');
  const hasWords = comment.split(' ').length >= 5;
  const hasStructure = hasPunctuation && hasWords;
  
  // Les deux conditions doivent être remplies
  return hasRestaurantWords && hasStructure;
}

function cleanReview(comment) {
  if (!comment) return '';
  
  // Nettoyer les espaces multiples
  comment = comment.replace(/\s+/g, ' ').trim();
  
  // Supprimer les caractères étranges
  comment = comment.replace(/[^\w\s.,!?;:'"àâäéèêëïîôùûüÿçÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ-]/g, '');
  
  return comment;
}

module.exports = {
  isValidReview,
  cleanReview
};

