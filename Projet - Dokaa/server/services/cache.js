
const fs = require('fs');
const path = require('path');

const CACHE_FILE = path.join(__dirname, '../data/cache.json');

class Cache {
  constructor() {
    this.cache = new Map();
    this.ttl = {
      restaurants: 7 * 24 * 60 * 60 * 1000, 
      reviews: 24 * 60 * 60 * 1000 
    };
    this.loadFromDisk();
  }

  loadFromDisk() {
    try {
      if (fs.existsSync(CACHE_FILE)) {
        const data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
        const now = Date.now();
        let loadedCount = 0;
        let expiredCount = 0;
        
        for (const [key, item] of Object.entries(data)) {
          if (item && item.value !== undefined) {
            this.cache.set(key, item);
            if (item.expiry && now < item.expiry) {
              loadedCount++;
            } else {
              expiredCount++;
            }
          }
        }
        console.log(`✅ Cache chargé depuis le disque: ${loadedCount} valides, ${expiredCount} expirés (${this.cache.size} total)`);
      } else {
        const dataDir = path.dirname(CACHE_FILE);
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }
        console.log('ℹ️  Aucun cache trouvé sur le disque');
      }
    } catch (error) {
      console.warn('⚠️  Erreur chargement cache:', error.message);
    }
  }

  saveToDisk() {
    try {
      const data = {};
      for (const [key, item] of this.cache.entries()) {
        data[key] = item;
      }
      const dataDir = path.dirname(CACHE_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), 'utf8');
      console.log(`💾 Cache sauvegardé sur le disque: ${Object.keys(data).length} entrées`);
    } catch (error) {
      console.warn('⚠️  Erreur sauvegarde cache:', error.message);
    }
  }

  set(key, value, type = 'reviews') {
    const expiry = Date.now() + this.ttl[type];
    this.cache.set(key, { value, expiry, type });
    setImmediate(() => this.saveToDisk());
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      this.saveToDisk();
      return null;
    }

    return item.value;
  }

  getStale(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    return item.value; 
  }

  clear() {
    this.cache.clear();
    this.saveToDisk();
  }

  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

module.exports = new Cache();
