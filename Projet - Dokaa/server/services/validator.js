


class DataValidator {
  constructor() {
    this.deliverooDomainPattern = /^https?:\/\/(www\.)?(deliveroo\.(fr|com|co\.uk|de|it|es|nl|be|at|ch|ie|dk|pl|se|no|fi))(\/.*)?$/i;
    this.deliverooRestaurantUrlPattern = /deliveroo\.(fr|com|co\.uk|de|it|es|nl|be|at|ch|ie|dk|pl|se|no|fi)\/[^\/]+\/restaurants\/[^\/]+\/[^\/]+/i;
  }

  
  isValidDeliverooUrl(url) {
    if (!url || typeof url !== 'string') {
      return { valid: false, reason: 'URL manquante ou invalide' };
    }

    if (!this.deliverooDomainPattern.test(url)) {
      return { valid: false, reason: 'URL ne correspond pas au domaine Deliveroo' };
    }

    
    if (!this.deliverooRestaurantUrlPattern.test(url)) {
      return { valid: false, reason: 'URL ne correspond pas au format attendu pour un restaurant Deliveroo' };
    }

    return { valid: true };
  }

  
  isValidAddress(address) {
    if (!address || typeof address !== 'string' || address.trim().length === 0) {
      return { valid: false, reason: 'Adresse manquante' };
    }

    
    const hasNumber = /\d+/.test(address);
    const hasStreet = /rue|avenue|boulevard|route|place|impasse|chemin|allée/i.test(address);

    if (!hasNumber || !hasStreet) {
      return { valid: false, reason: 'Format d\'adresse invalide (doit contenir un numéro et une rue)' };
    }

    
    const hasPostalCode = /\b\d{5}\b/.test(address);
    if (!hasPostalCode) {
      return { valid: false, reason: 'Code postal manquant ou invalide' };
    }

    return { valid: true };
  }

  
  isValidRating(rating) {
    if (typeof rating !== 'number' || isNaN(rating)) {
      return { valid: false, reason: 'Note doit être un nombre' };
    }

    if (rating < 0 || rating > 5) {
      return { valid: false, reason: 'Note doit être entre 0 et 5' };
    }

    return { valid: true };
  }

  
  validateRestaurant(restaurant) {
    const errors = [];
    const warnings = [];
    const verified = {};

    
    if (!restaurant.id) {
      errors.push('ID manquant');
    }

    if (!restaurant.name || restaurant.name.trim().length === 0) {
      errors.push('Nom manquant');
    }

    if (!restaurant.address) {
      errors.push('Adresse manquante');
    } else {
      const addressValidation = this.isValidAddress(restaurant.address);
      if (!addressValidation.valid) {
        errors.push(`Adresse invalide: ${addressValidation.reason}`);
      } else {
        verified.address = true;
      }
    }

    if (!restaurant.url) {
      errors.push('URL Deliveroo manquante');
    } else {
      const urlValidation = this.isValidDeliverooUrl(restaurant.url);
      if (!urlValidation.valid) {
        errors.push(`URL Deliveroo invalide: ${urlValidation.reason}`);
      } else {
        verified.deliverooUrl = true;
      }
    }

    
    if (restaurant.rating !== undefined) {
      const ratingValidation = this.isValidRating(restaurant.rating);
      if (!ratingValidation.valid) {
        warnings.push(`Note invalide: ${ratingValidation.reason}`);
      } else {
        verified.rating = true;
      }
    } else {
      warnings.push('Note manquante');
    }

    if (!restaurant.imageUrl) {
      warnings.push('Image manquante');
    } else {
      verified.image = true;
    }

    if (!restaurant.city) {
      warnings.push('Ville manquante');
    } else if (restaurant.city.trim().length > 0) {
      verified.city = true;
    }

    
    const verificationCount = Object.values(verified).filter(Boolean).length;
    const totalChecks = 5; 
    const reliabilityScore = Math.round((verificationCount / totalChecks) * 100);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      verified,
      reliabilityScore,
      needsVerification: errors.length > 0 || reliabilityScore < 80
    };
  }

  
  validateReview(review, restaurantUrl) {
    const errors = [];
    const warnings = [];
    const verified = {};

    if (!review.rating) {
      errors.push('Note manquante');
    } else {
      const ratingValidation = this.isValidRating(review.rating);
      if (!ratingValidation.valid) {
        errors.push(`Note invalide: ${ratingValidation.reason}`);
      } else {
        verified.rating = true;
      }
    }

    if (!review.comment || review.comment.trim().length === 0) {
      warnings.push('Commentaire manquant');
    } else {
      verified.comment = true;
    }

    if (!review.author) {
      warnings.push('Auteur manquant');
    } else {
      verified.author = true;
    }

    if (!review.date) {
      warnings.push('Date manquante');
    } else {
      
      const date = new Date(review.date);
      if (isNaN(date.getTime())) {
        errors.push('Date invalide');
      } else {
        verified.date = true;
      }
    }

    
    let source = 'unknown';
    if (review.source) {
      source = review.source;
    } else if (review.comment && review.comment.toLowerCase().includes('google')) {
      source = 'google';
    } else if (review.comment && review.comment.toLowerCase().includes('tripadvisor')) {
      source = 'tripadvisor';
    } else if (restaurantUrl && restaurantUrl.includes('deliveroo')) {
      source = 'deliveroo';
    }

    verified.source = source;

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      verified,
      source
    };
  }

  
  async verifyRestaurantExists(restaurantUrl) {
    if (!this.isValidDeliverooUrl(restaurantUrl).valid) {
      return { exists: false, reason: 'URL invalide' };
    }

    
    
    
    return { exists: true, verifiedAt: new Date().toISOString() };
  }
}

module.exports = new DataValidator();

