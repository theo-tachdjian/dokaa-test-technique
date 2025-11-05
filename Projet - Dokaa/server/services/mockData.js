// Données mockées pour le développement
// À remplacer par le scraping plus tard

// Liste des villes disponibles
const cities = [
  'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux', 
  'Nice', 'Nantes', 'Strasbourg', 'Lille', 'Montpellier'
];

const mockRestaurants = [
  // PARIS - 15 restaurants
  {
    id: '1',
    name: 'Restaurant Italien',
    slug: 'restaurant-italien',
    city: 'Paris',
    address: '15 Rue de la Paix, 75001 Paris',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    cuisine: 'Italienne',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/paris/restaurant-italien'
  },
  {
    id: '2',
    name: 'Sushi Express',
    slug: 'sushi-express',
    city: 'Paris',
    address: '15 Rue de la Paix, 75002 Paris', // Adresse réaliste
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    cuisine: 'Japonaise',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/paris/sushi-express'
  },
  {
    id: '3',
    name: 'Burger House',
    slug: 'burger-house',
    city: 'Paris',
    address: '8 Rue du Faubourg Saint-Antoine, 75011 Paris',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    cuisine: 'Américaine',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/paris/burger-house'
  },
  {
    id: '4',
    name: 'La Brasserie',
    slug: 'la-brasserie',
    city: 'Paris',
    address: '22 Boulevard Saint-Germain, 75005 Paris',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    cuisine: 'Française',
    status: 'closed',
    url: 'https://deliveroo.fr/fr/restaurants/paris/la-brasserie'
  },
  {
    id: '5',
    name: 'Pizza Napoletana',
    city: 'Paris',
    address: '30 Rue de la République, 75011 Paris',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    cuisine: 'Italienne',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/paris/pizza-napoletana'
  },
  {
    id: '6',
    name: 'Le Wok Chinois',
    city: 'Paris',
    address: '18 Rue de Rivoli, 75004 Paris',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400',
    cuisine: 'Chinoise',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/paris/le-wok-chinois'
  },
  {
    id: '7',
    name: 'Tacos Factory',
    city: 'Paris',
    address: '55 Boulevard de Belleville, 75020 Paris',
    rating: 4.1,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    cuisine: 'Fast-Food',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/paris/tacos-factory'
  },
  {
    id: '8',
    name: 'Sushi Time',
    city: 'Paris',
    address: '12 Rue de Montmartre, 75001 Paris',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    cuisine: 'Japonaise',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/paris/sushi-time'
  },
  {
    id: '9',
    name: 'Bistro Français',
    city: 'Paris',
    address: '28 Rue du Faubourg Poissonnière, 75010 Paris',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    cuisine: 'Française',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/paris/bistro-francais'
  },
  {
    id: '10',
    name: 'Kebab Corner',
    city: 'Paris',
    address: '9 Boulevard de la Villette, 75019 Paris',
    rating: 4.0,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    cuisine: 'Turque',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/paris/kebab-corner'
  },
  {
    id: '11',
    name: 'Indian Curry House',
    city: 'Paris',
    address: '45 Rue de la Roquette, 75011 Paris',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400',
    cuisine: 'Indienne',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/paris/indian-curry-house'
  },
  {
    id: '12',
    name: 'Le Comptoir Thai',
    city: 'Paris',
    address: '33 Avenue de la République, 75011 Paris',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400',
    cuisine: 'Thaïlandaise',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/paris/le-comptoir-thai'
  },
  {
    id: '13',
    name: 'Crêperie Bretonne',
    city: 'Paris',
    address: '14 Rue de la Bûcherie, 75005 Paris',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    cuisine: 'Bretonne',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/paris/creperie-bretonne'
  },
  {
    id: '14',
    name: 'Pasta & Co',
    city: 'Paris',
    address: '20 Rue des Rosiers, 75004 Paris',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    cuisine: 'Italienne',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/paris/pasta-co'
  },
  {
    id: '15',
    name: 'Fish & Chips',
    city: 'Paris',
    address: '67 Rue de Vaugirard, 75006 Paris',
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    cuisine: 'Britannique',
    status: 'closed',
    url: 'https://deliveroo.fr/fr/restaurants/paris/fish-chips'
  },

  // LYON - 10 restaurants
  {
    id: '16',
    name: 'Bouchon Lyonnais',
    city: 'Lyon',
    address: '15 Rue des Marronniers, 69002 Lyon',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    cuisine: 'Lyonnaise',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/lyon/bouchon-lyonnais'
  },
  {
    id: '17',
    name: 'Sushi Lyon',
    city: 'Lyon',
    address: '28 Rue de la République, 69002 Lyon',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    cuisine: 'Japonaise',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/lyon/sushi-lyon'
  },
  {
    id: '18',
    name: 'Burger Factory Lyon',
    city: 'Lyon',
    address: '42 Cours Lafayette, 69003 Lyon',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    cuisine: 'Américaine',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/lyon/burger-factory'
  },
  {
    id: '19',
    name: 'Pizzeria Bella Vista',
    city: 'Lyon',
    address: '18 Rue de l\'Annonciade, 69001 Lyon',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    cuisine: 'Italienne',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/lyon/pizzeria-bella-vista'
  },
  {
    id: '20',
    name: 'Le Wok Asiatique',
    city: 'Lyon',
    address: '55 Rue Victor Hugo, 69002 Lyon',
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400',
    cuisine: 'Asiatique',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/lyon/le-wok-asiatique'
  },
  {
    id: '21',
    name: 'Tacos Lyon',
    city: 'Lyon',
    address: '12 Place Bellecour, 69002 Lyon',
    rating: 4.1,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    cuisine: 'Fast-Food',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/lyon/tacos-lyon'
  },
  {
    id: '22',
    name: 'Restaurant Indien',
    city: 'Lyon',
    address: '33 Rue de la Charité, 69002 Lyon',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400',
    cuisine: 'Indienne',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/lyon/restaurant-indien'
  },
  {
    id: '23',
    name: 'Le Bistrot',
    city: 'Lyon',
    address: '22 Rue Mercière, 69002 Lyon',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    cuisine: 'Française',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/lyon/le-bistrot'
  },
  {
    id: '24',
    name: 'Pasta & More',
    city: 'Lyon',
    address: '17 Rue du Plat, 69002 Lyon',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    cuisine: 'Italienne',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/lyon/pasta-more'
  },
  {
    id: '25',
    name: 'Sushi Express Lyon',
    city: 'Lyon',
    address: '40 Rue Garibaldi, 69001 Lyon',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    cuisine: 'Japonaise',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/lyon/sushi-express'
  },

  // MARSEILLE - 9 restaurants
  {
    id: '26',
    name: 'Le Panier',
    city: 'Marseille',
    address: '25 Rue du Panier, 13002 Marseille',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    cuisine: 'Provençale',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/marseille/le-panier'
  },
  {
    id: '27',
    name: 'Sushi Marseille',
    city: 'Marseille',
    address: '18 La Canebière, 13001 Marseille',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    cuisine: 'Japonaise',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/marseille/sushi-marseille'
  },
  {
    id: '28',
    name: 'Burger King Marseille',
    city: 'Marseille',
    address: '55 Rue de la République, 13001 Marseille',
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    cuisine: 'Fast-Food',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/marseille/burger-king'
  },
  {
    id: '29',
    name: 'Pizzeria Napolitaine',
    city: 'Marseille',
    address: '12 Cours Julien, 13006 Marseille',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    cuisine: 'Italienne',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/marseille/pizzeria-napolitaine'
  },
  {
    id: '30',
    name: 'Le Wok',
    city: 'Marseille',
    address: '30 Rue Paradis, 13006 Marseille',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400',
    cuisine: 'Asiatique',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/marseille/le-wok'
  },
  {
    id: '31',
    name: 'Tacos Marseille',
    city: 'Marseille',
    address: '22 Rue d\'Aubagne, 13001 Marseille',
    rating: 4.1,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    cuisine: 'Fast-Food',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/marseille/tacos-marseille'
  },
  {
    id: '32',
    name: 'Restaurant Indien Curry',
    city: 'Marseille',
    address: '45 Boulevard Longchamp, 13001 Marseille',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400',
    cuisine: 'Indienne',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/marseille/restaurant-indien-curry'
  },
  {
    id: '33',
    name: 'Le Bistrot du Port',
    city: 'Marseille',
    address: '33 Quai des Belges, 13001 Marseille',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    cuisine: 'Française',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/marseille/le-bistrot-du-port'
  },
  {
    id: '34',
    name: 'Sushi Time Marseille',
    city: 'Marseille',
    address: '15 Rue de la République, 13001 Marseille',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    cuisine: 'Japonaise',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/marseille/sushi-time'
  },

  // TOULOUSE - 8 restaurants
  {
    id: '35',
    name: 'Le Capitole',
    city: 'Toulouse',
    address: '20 Place du Capitole, 31000 Toulouse',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    cuisine: 'Toulousaine',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/toulouse/le-capitole'
  },
  {
    id: '36',
    name: 'Sushi Toulouse',
    city: 'Toulouse',
    address: '35 Rue de Metz, 31000 Toulouse',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    cuisine: 'Japonaise',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/toulouse/sushi-toulouse'
  },
  {
    id: '37',
    name: 'Burger Toulouse',
    city: 'Toulouse',
    address: '12 Rue Alsace-Lorraine, 31000 Toulouse',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    cuisine: 'Américaine',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/toulouse/burger-toulouse'
  },
  {
    id: '38',
    name: 'Pizza Roma',
    city: 'Toulouse',
    address: '28 Rue du Taur, 31000 Toulouse',
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    cuisine: 'Italienne',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/toulouse/pizza-roma'
  },
  {
    id: '39',
    name: 'Le Wok Asiatique',
    city: 'Toulouse',
    address: '45 Boulevard Carnot, 31000 Toulouse',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400',
    cuisine: 'Asiatique',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/toulouse/le-wok-asiatique'
  },
  {
    id: '40',
    name: 'Tacos Toulouse',
    city: 'Toulouse',
    address: '18 Rue de la République, 31000 Toulouse',
    rating: 4.1,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    cuisine: 'Fast-Food',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/toulouse/tacos-toulouse'
  },
  {
    id: '41',
    name: 'Restaurant Indien',
    city: 'Toulouse',
    address: '33 Rue des Filatiers, 31000 Toulouse',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400',
    cuisine: 'Indienne',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/toulouse/restaurant-indien'
  },
  {
    id: '42',
    name: 'Le Bistrot',
    city: 'Toulouse',
    address: '22 Rue des Trois-Frères, 31000 Toulouse',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    cuisine: 'Française',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/toulouse/le-bistrot'
  },

  // BORDEAUX - 7 restaurants
  {
    id: '43',
    name: 'Le Bordelais',
    city: 'Bordeaux',
    address: '15 Place de la Comédie, 33000 Bordeaux',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    cuisine: 'Bordelaise',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/bordeaux/le-bordelais'
  },
  {
    id: '44',
    name: 'Sushi Bordeaux',
    city: 'Bordeaux',
    address: '28 Rue Sainte-Catherine, 33000 Bordeaux',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    cuisine: 'Japonaise',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/bordeaux/sushi-bordeaux'
  },
  {
    id: '45',
    name: 'Burger Bordeaux',
    city: 'Bordeaux',
    address: '42 Cours de l\'Intendance, 33000 Bordeaux',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    cuisine: 'Américaine',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/bordeaux/burger-bordeaux'
  },
  {
    id: '46',
    name: 'Pizza Margherita',
    city: 'Bordeaux',
    address: '18 Rue des Trois-Conils, 33000 Bordeaux',
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    cuisine: 'Italienne',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/bordeaux/pizza-margherita'
  },
  {
    id: '47',
    name: 'Le Wok',
    city: 'Bordeaux',
    address: '35 Rue Porte-Dijeaux, 33000 Bordeaux',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400',
    cuisine: 'Asiatique',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/bordeaux/le-wok'
  },
  {
    id: '48',
    name: 'Tacos Bordeaux',
    city: 'Bordeaux',
    address: '22 Rue de la Porte-Dijeaux, 33000 Bordeaux',
    rating: 4.1,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    cuisine: 'Fast-Food',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/bordeaux/tacos-bordeaux'
  },
  {
    id: '49',
    name: 'Restaurant Indien',
    city: 'Bordeaux',
    address: '40 Cours Victor-Hugo, 33000 Bordeaux',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400',
    cuisine: 'Indienne',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/bordeaux/restaurant-indien'
  },

  // NICE - 7 restaurants
  {
    id: '50',
    name: 'Le Niçois',
    city: 'Nice',
    address: '25 Promenade des Anglais, 06000 Nice',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    cuisine: 'Niçoise',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/nice/le-nicois'
  },
  {
    id: '51',
    name: 'Sushi Nice',
    city: 'Nice',
    address: '30 Avenue Jean-Médecin, 06000 Nice',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    cuisine: 'Japonaise',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/nice/sushi-nice'
  },
  {
    id: '52',
    name: 'Burger Nice',
    city: 'Nice',
    address: '15 Rue Masséna, 06000 Nice',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    cuisine: 'Américaine',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/nice/burger-nice'
  },
  {
    id: '53',
    name: 'Pizza Nice',
    city: 'Nice',
    address: '22 Rue de France, 06000 Nice',
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    cuisine: 'Italienne',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/nice/pizza-nice'
  },
  {
    id: '54',
    name: 'Le Wok',
    city: 'Nice',
    address: '45 Avenue de la Victoire, 06000 Nice',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400',
    cuisine: 'Asiatique',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/nice/le-wok'
  },
  {
    id: '55',
    name: 'Tacos Nice',
    city: 'Nice',
    address: '18 Rue Barla, 06300 Nice',
    rating: 4.1,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    cuisine: 'Fast-Food',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/nice/tacos-nice'
  },
  {
    id: '56',
    name: 'Restaurant Indien',
    city: 'Nice',
    address: '33 Rue de la Buffa, 06000 Nice',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400',
    cuisine: 'Indienne',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/nice/restaurant-indien'
  },

  // NANTES - 6 restaurants
  {
    id: '57',
    name: 'Le Nantais',
    city: 'Nantes',
    address: '20 Place Royale, 44000 Nantes',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    cuisine: 'Française',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/nantes/le-nantais'
  },
  {
    id: '58',
    name: 'Sushi Nantes',
    city: 'Nantes',
    address: '35 Rue Crébillon, 44000 Nantes',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    cuisine: 'Japonaise',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/nantes/sushi-nantes'
  },
  {
    id: '59',
    name: 'Burger Nantes',
    city: 'Nantes',
    address: '12 Rue de Strasbourg, 44000 Nantes',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    cuisine: 'Américaine',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/nantes/burger-nantes'
  },
  {
    id: '60',
    name: 'Pizza Nantes',
    city: 'Nantes',
    address: '28 Rue Kervégan, 44000 Nantes',
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    cuisine: 'Italienne',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/nantes/pizza-nantes'
  },
  {
    id: '61',
    name: 'Le Wok',
    city: 'Nantes',
    address: '45 Rue de la Fosse, 44000 Nantes',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400',
    cuisine: 'Asiatique',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/nantes/le-wok'
  },
  {
    id: '62',
    name: 'Tacos Nantes',
    city: 'Nantes',
    address: '18 Allée Baco, 44000 Nantes',
    rating: 4.1,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    cuisine: 'Fast-Food',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/nantes/tacos-nantes'
  },

  // STRASBOURG - 6 restaurants
  {
    id: '63',
    name: 'L\'Alsacien',
    city: 'Strasbourg',
    address: '15 Place Kléber, 67000 Strasbourg',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    cuisine: 'Alsacienne',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/strasbourg/lalsacien'
  },
  {
    id: '64',
    name: 'Sushi Strasbourg',
    city: 'Strasbourg',
    address: '28 Rue des Grandes Arcades, 67000 Strasbourg',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    cuisine: 'Japonaise',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/strasbourg/sushi-strasbourg'
  },
  {
    id: '65',
    name: 'Burger Strasbourg',
    city: 'Strasbourg',
    address: '12 Rue de la Krutenau, 67000 Strasbourg',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    cuisine: 'Américaine',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/strasbourg/burger-strasbourg'
  },
  {
    id: '66',
    name: 'Pizza Strasbourg',
    city: 'Strasbourg',
    address: '35 Rue du 22 Novembre, 67000 Strasbourg',
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    cuisine: 'Italienne',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/strasbourg/pizza-strasbourg'
  },
  {
    id: '67',
    name: 'Le Wok',
    city: 'Strasbourg',
    address: '22 Rue des Orfèvres, 67000 Strasbourg',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400',
    cuisine: 'Asiatique',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/strasbourg/le-wok'
  },
  {
    id: '68',
    name: 'Tacos Strasbourg',
    city: 'Strasbourg',
    address: '18 Rue des Serruriers, 67000 Strasbourg',
    rating: 4.1,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    cuisine: 'Fast-Food',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/strasbourg/tacos-strasbourg'
  },

  // LILLE - 6 restaurants
  {
    id: '69',
    name: 'Le Lillois',
    city: 'Lille',
    address: '25 Place du Général-de-Gaulle, 59000 Lille',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    cuisine: 'Française',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/lille/le-lillois'
  },
  {
    id: '70',
    name: 'Sushi Lille',
    city: 'Lille',
    address: '30 Rue de Béthune, 59000 Lille',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    cuisine: 'Japonaise',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/lille/sushi-lille'
  },
  {
    id: '71',
    name: 'Burger Lille',
    city: 'Lille',
    address: '15 Rue de la Monnaie, 59000 Lille',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    cuisine: 'Américaine',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/lille/burger-lille'
  },
  {
    id: '72',
    name: 'Pizza Lille',
    city: 'Lille',
    address: '22 Rue Esquermoise, 59000 Lille',
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    cuisine: 'Italienne',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/lille/pizza-lille'
  },
  {
    id: '73',
    name: 'Le Wok',
    city: 'Lille',
    address: '45 Rue de la Barre, 59000 Lille',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400',
    cuisine: 'Asiatique',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/lille/le-wok'
  },
  {
    id: '74',
    name: 'Tacos Lille',
    city: 'Lille',
    address: '18 Rue Masséna, 59000 Lille',
    rating: 4.1,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    cuisine: 'Fast-Food',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/lille/tacos-lille'
  },

  // MONTPELLIER - 6 restaurants
  {
    id: '75',
    name: 'Le Montpellierain',
    city: 'Montpellier',
    address: '20 Place de la Comédie, 34000 Montpellier',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    cuisine: 'Française',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/montpellier/le-montpellierain'
  },
  {
    id: '76',
    name: 'Sushi Montpellier',
    city: 'Montpellier',
    address: '28 Rue du Faubourg du Courreau, 34000 Montpellier',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    cuisine: 'Japonaise',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/montpellier/sushi-montpellier'
  },
  {
    id: '77',
    name: 'Burger Montpellier',
    city: 'Montpellier',
    address: '35 Rue de la Loge, 34000 Montpellier',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    cuisine: 'Américaine',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/montpellier/burger-montpellier'
  },
  {
    id: '78',
    name: 'Pizza Montpellier',
    city: 'Montpellier',
    address: '15 Rue de l\'Ancien Courrier, 34000 Montpellier',
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    cuisine: 'Italienne',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/montpellier/pizza-montpellier'
  },
  {
    id: '79',
    name: 'Le Wok',
    city: 'Montpellier',
    address: '22 Rue des Écoles Laïques, 34000 Montpellier',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400',
    cuisine: 'Asiatique',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/montpellier/le-wok'
  },
  {
    id: '80',
    name: 'Tacos Montpellier',
    city: 'Montpellier',
    address: '18 Rue du Bras de Fer, 34000 Montpellier',
    rating: 4.1,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    cuisine: 'Fast-Food',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/montpellier/tacos-montpellier'
  }
];

// IMPORTANT : Les avis doivent être récupérés depuis Deliveroo via scraping
// Les avis mockés ci-dessous sont UNIQUEMENT TEMPORAIRES pour le développement frontend
// ATTENTION : Ces avis sont FAUX et seront remplacés par les vrais avis une fois le scraping configuré
// En production, les vrais avis seront scrapés depuis les pages Deliveroo

// Fonction pour générer des avis mockés réalistes (10 avis par restaurant)
function generateMockReviews(restaurantId, restaurantName, cuisine) {
  const firstNames = ['Marie', 'Pierre', 'Sophie', 'Thomas', 'Emma', 'Lucas', 'Julie', 'Antoine', 'Camille', 'Nicolas', 'Laura', 'Maxime', 'Clara', 'Alexandre', 'Sarah', 'Paul', 'Léa', 'Hugo', 'Chloé', 'Benjamin'];
  const lastNames = ['Dupont', 'Martin', 'Bernard', 'Dubois', 'Moreau', 'Laurent', 'Simon', 'Michel', 'Lefebvre', 'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier', 'Morel', 'Girard', 'André', 'Lefevre', 'Mercier'];
  
  const comments = {
    'Italienne': [
      'Excellent restaurant ! Les pâtes sont délicieuses et bien cuites.',
      'Très bonne cuisine italienne, je recommande vivement.',
      'Service rapide et plats savoureux. Parfait !',
      'Les pizzas sont excellentes, vraiment authentiques.',
      'Restaurant de qualité, on y reviendra avec plaisir.',
      'Très bon rapport qualité/prix, je recommande.',
      'Délicieux ! Les plats sont copieux et bien préparés.',
      'Excellent service et cuisine goûteuse. À essayer !',
      'Très satisfait de la commande, tout était parfait.',
      'Restaurant à ne pas manquer, cuisine authentique.'
    ],
    'Japonaise': [
      'Sushis frais et délicieux ! Qualité au rendez-vous.',
      'Très bon restaurant japonais, je recommande.',
      'Excellent, les sushis sont vraiment frais.',
      'Service rapide et produits de qualité. Parfait !',
      'Très satisfait, les plats sont excellents.',
      'Délicieux ! Je recommande vivement ce restaurant.',
      'Très bon rapport qualité/prix, je reviendrai.',
      'Excellent restaurant, cuisine authentique et savoureuse.',
      'Service impeccable et plats délicieux. À essayer !',
      'Très bon, les sushis sont frais et bien préparés.'
    ],
    'Américaine': [
      'Excellent burger ! Les frites sont parfaites.',
      'Très bon restaurant, les burgers sont délicieux.',
      'Service rapide et qualité au rendez-vous. Parfait !',
      'Très satisfait, les plats sont copieux et goûteux.',
      'Excellent rapport qualité/prix, je recommande.',
      'Délicieux ! Je reviendrai avec plaisir.',
      'Très bon restaurant, burgers savoureux et bien préparés.',
      'Service impeccable et plats délicieux. À essayer !',
      'Très satisfait de la commande, tout était parfait.',
      'Excellent, les burgers sont vraiment bons.'
    ],
    'Française': [
      'Excellent restaurant ! Cuisine française authentique.',
      'Très bon, les plats sont savoureux et bien préparés.',
      'Service impeccable et cuisine de qualité. Parfait !',
      'Très satisfait, je recommande vivement.',
      'Excellent rapport qualité/prix, je reviendrai.',
      'Délicieux ! Les plats sont copieux et goûteux.',
      'Très bon restaurant, cuisine traditionnelle et savoureuse.',
      'Service rapide et plats délicieux. À essayer !',
      'Très satisfait de la commande, tout était parfait.',
      'Excellent, la cuisine est vraiment bonne.'
    ],
    'Asiatique': [
      'Excellent restaurant asiatique ! Les plats sont délicieux.',
      'Très bon, je recommande vivement.',
      'Service rapide et cuisine savoureuse. Parfait !',
      'Très satisfait, les plats sont excellents.',
      'Excellent rapport qualité/prix, je reviendrai.',
      'Délicieux ! Les plats sont bien préparés.',
      'Très bon restaurant, cuisine authentique et goûteuse.',
      'Service impeccable et plats délicieux. À essayer !',
      'Très satisfait de la commande, tout était parfait.',
      'Excellent, la cuisine est vraiment savoureuse.'
    ],
    'Fast-Food': [
      'Service rapide et efficace. Parfait !',
      'Très bon rapport qualité/prix, je recommande.',
      'Excellent, livraison rapide et plats chauds.',
      'Très satisfait, je reviendrai avec plaisir.',
      'Service rapide et plats délicieux. Parfait !',
      'Très bon, je recommande vivement.',
      'Excellent rapport qualité/prix, je reviendrai.',
      'Service impeccable et livraison rapide. À essayer !',
      'Très satisfait de la commande, tout était parfait.',
      'Excellent, service rapide et efficace.'
    ]
  };
  
  const defaultComments = comments[cuisine] || comments['Italienne'];
  
  // Générer 10 avis avec des dates récentes (du plus récent au plus ancien)
  const reviews = [];
  const now = new Date();
  
  for (let i = 0; i < 10; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const author = `${firstName} ${lastName.charAt(0)}.`;
    
    // Générer une date entre aujourd'hui et 30 jours en arrière
    const daysAgo = Math.floor(Math.random() * 30);
    const reviewDate = new Date(now);
    reviewDate.setDate(reviewDate.getDate() - daysAgo);
    
    // Générer une note entre 3 et 5 (majoritairement positives)
    const rating = Math.random() < 0.7 ? 
      (Math.random() < 0.5 ? 5 : 4) : 
      (Math.random() < 0.5 ? 4.5 : 3.5);
    
    reviews.push({
      id: `${restaurantId}-${i + 1}`,
      rating: Math.round(rating * 10) / 10, // Arrondir à 1 décimale
      comment: defaultComments[i] || defaultComments[Math.floor(Math.random() * defaultComments.length)],
      date: reviewDate.toISOString().split('T')[0],
      author: author
    });
  }
  
  // Trier par date décroissante (plus récent en premier)
  return reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Générer les avis mockés pour tous les restaurants (10 avis par restaurant)
const mockReviews = {};
mockRestaurants.forEach(restaurant => {
  mockReviews[restaurant.id] = generateMockReviews(
    restaurant.id,
    restaurant.name,
    restaurant.cuisine || 'Italienne'
  );
});

// Note : Les vrais avis viendront du scraping Deliveroo une fois les sélecteurs CSS identifiés
// Pour l'instant, chaque restaurant a 10 avis mockés générés automatiquement

module.exports = {
  mockRestaurants,
  mockReviews,
  cities
};
