const cache = require('../services/cache');

const cuisines = [
  "Français", "Italien", "Japonais", "Chinois", "Thaï", "Indien", "Mexicain", 
  "Libanais", "Turc", "Grec", "Espagnol", "Américain", "Burger", "Pizza",
  "Sushi", "Asiatique", "Provençal", "Marocain", "Vietnamien", "Brunch"
];

const neighborhoods = [
  "centre-ville", "vieux-port", "canebiere", "plage-du-prado", "corniche",
  "calanques", "panier", "noailles", "endoume", "la-joliette"
];

const restaurantNames = [
  "L'Authentique", "Pizza Napoli", "Sushi Zen", "Burger House", "Le Bistrot Provençal",
  "Kebab Express", "La Crêperie Bretonne", "Thai Garden", "Le Comptoir du Marché", "Pasta Fresca",
  "Le Petit Marseillais", "Chez Maman", "La Table du Port", "Le Jardin Secret", "Bella Italia",
  "Sakura Sushi", "Le Wok", "La Paella", "Le Taj Mahal", "Le Couscous Royal",
  "Le Gyros", "La Taverne Grecque", "Le Tapas Bar", "Le Fish & Chips", "Le Steak House",
  "La Brasserie", "Le Bistrot", "Le Café de la Plage", "Le Rooftop", "Le Panorama",
  "Le Marché", "Le Comptoir", "L'Atelier", "Le Garage", "Le Local",
  "Le Terroir", "Le Fromage", "Le Vin", "Le Pain", "Le Chocolat",
  "Le Glace", "Le Café", "Le Thé", "Le Jus", "Le Smoothie",
  "Le Salade", "Le Sandwich", "Le Wrap", "Le Bowl", "Le Poké",
  "Le Tacos", "Le Burrito", "Le Quesadilla", "Le Nachos", "Le Guacamole",
  "Le Pad Thai", "Le Curry", "Le Noodles", "Le Ramen", "Le Pho",
  "Le Dim Sum", "Le Szechuan", "Le Cantonese", "Le Hunan", "Le Beijing",
  "Le Tempura", "Le Teriyaki", "Le Yakitori", "Le Maki", "Le Sashimi",
  "Le Risotto", "Le Carbonara", "Le Bolognese", "Le Margherita", "Le Quattro Stagioni",
  "Le Coq au Vin", "Le Boeuf Bourguignon", "Le Cassoulet", "Le Ratatouille", "Le Bouillabaisse",
  "Le Tagine", "Le Couscous", "Le Pastilla", "Le Mechoui", "Le Harira",
  "Le Shawarma", "Le Falafel", "Le Hummus", "Le Tabbouleh", "Le Fattoush",
  "Le Moussaka", "Le Souvlaki", "Le Gyros", "Le Tzatziki", "Le Feta",
  "Le Paella", "Le Tapas", "Le Gazpacho", "Le Tortilla", "Le Churros"
];

function generateMockRestaurants(count = 100) {
  const restaurants = [];
  const usedNames = new Set();
  
  for (let i = 1; i <= count; i++) {
    let name;
    let attempts = 0;
    do {
      name = restaurantNames[Math.floor(Math.random() * restaurantNames.length)];
      attempts++;
      if (attempts > 50) {
        name = `${name} ${i}`;
        break;
      }
    } while (usedNames.has(name));
    usedNames.add(name);
    
    const cuisine = cuisines[Math.floor(Math.random() * cuisines.length)];
    const neighborhood = neighborhoods[Math.floor(Math.random() * neighborhoods.length)];
    const rating = (Math.random() * 1.5 + 3.5).toFixed(1); 
    const deliveryTime = `${Math.floor(Math.random() * 20 + 15)}-${Math.floor(Math.random() * 20 + 30)} min`;
    const deliveryFee = (Math.random() * 2 + 1).toFixed(2).replace('.', ',') + ' €';
    
    const slug = `/fr/restaurants/marseille/${neighborhood}/${name.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '')}`;
    
    const cuisineImageMap = {
      'Français': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      'Italien': 'https://images.unsplash.com/photo-1516100882582-96c3a05fe590?w=800',
      'Japonais': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
      'Chinois': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
      'Thaï': 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
      'Indien': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
      'Mexicain': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
      'Libanais': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
      'Turc': 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800',
      'Grec': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
      'Espagnol': 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800',
      'Américain': 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800',
      'Burger': 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800',
      'Pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
      'Sushi': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
      'Asiatique': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
      'Provençal': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      'Marocain': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
      'Vietnamien': 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
      'Brunch': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800'
    };
    
    const imageUrl = cuisineImageMap[cuisine] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800';
    
    restaurants.push({
      id: i,
      name: name,
      slug: slug,
      city: "Marseille",
      rating: parseFloat(rating),
      cuisine: cuisine,
      deliveryTime: deliveryTime,
      deliveryFee: deliveryFee,
      imageUrl: imageUrl,
      image: imageUrl, 
      partner_drn_id: `mock-uuid-${i}`
    });
  }
  
  return restaurants;
}

const mockRestaurants = generateMockRestaurants(100);

const cacheKey = 'city:Marseille';
cache.set(cacheKey, mockRestaurants, 'restaurants');

const allCacheKey = 'all:Toutes les villes';
cache.set(allCacheKey, mockRestaurants, 'restaurants');

cache.saveToDisk();

setTimeout(() => {
  console.log(`✅ ${mockRestaurants.length} restaurants mockés créés et mis en cache`);
  console.log(`📋 Clés du cache:`);
  console.log(`   - ${cacheKey}`);
  console.log(`   - ${allCacheKey}`);
  console.log(`\n💡 Les restaurants sont maintenant disponibles dans l'application !`);
  console.log(`💡 Redémarrez le serveur pour voir les restaurants.`);
  process.exit(0);
}, 500);
