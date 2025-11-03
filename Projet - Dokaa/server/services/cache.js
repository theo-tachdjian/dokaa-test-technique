// Cache simple en mémoire
// Pas besoin de Redis pour un test technique

class Cache {
  constructor() {
    this.cache = new Map();
    this.ttl = {
      restaurants: 24 * 60 * 60 * 1000, // 24 heures
      reviews: 60 * 60 * 1000 // 1 heure
    };
  }

  set(key, value, type = 'reviews') {
    const expiry = Date.now() + this.ttl[type];
    this.cache.set(key, { value, expiry, type });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  clear() {
    this.cache.clear();
  }

  // Pour debug, voir ce qu'il y a dans le cache
  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

module.exports = new Cache();

