




const cities = [
  "Paris",
  "Lyon",
  "Marseille",
  "Toulouse",
  "Bordeaux",
  "Nice",
  "Nantes",
  "Strasbourg",
  "Lille",
  "Montpellier"
];

const mockRestaurants = [
  {
    "id": "1",
    "name": "Restaurant Italien",
    "slug": "restaurant-italien",
    "city": "Paris",
    "address": "L'italien,  Rue de Ponthieu, 75008",
    "rating": 4.5,
    "imageUrl": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
    "cuisine": "Italienne",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/paris/restaurant-italien"
  },
  {
    "id": "4",
    "name": "La Brasserie",
    "slug": "la-brasserie",
    "city": "Paris",
    "address": "Route de la Brasserie,  Quartier de Picpus, 75012",
    "rating": 4.3,
    "imageUrl": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
    "cuisine": "Française",
    "status": "closed",
    "url": "https://deliveroo.fr/fr/restaurants/paris/la-brasserie"
  },
  {
    "id": "5",
    "name": "Pizza Napoletana",
    "city": "Paris",
    "address": "La Vera Pizza Napoletana - Guillaume grasso,  45, 75015",
    "rating": 4.6,
    "imageUrl": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
    "cuisine": "Italienne",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/paris/pizza-napoletana"
  },
  {
    "id": "7",
    "name": "Tacos Factory",
    "city": "Paris",
    "address": "Tacos Factory,  Rue du Champ Gaillard, 71100",
    "rating": 4.1,
    "imageUrl": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
    "cuisine": "Fast-Food",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/paris/tacos-factory"
  },
  {
    "id": "8",
    "name": "Sushi Time",
    "city": "Paris",
    "address": "Earn Time Sushi,  Rue de la Tombe Issoire, 75014",
    "rating": 4.3,
    "imageUrl": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
    "cuisine": "Japonaise",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/paris/sushi-time"
  },
  {
    "id": "10",
    "name": "Kebab Corner",
    "city": "Paris",
    "address": "Kebab Corner,  Rue du Départ, 75014",
    "rating": 4,
    "imageUrl": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400",
    "cuisine": "Turque",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/paris/kebab-corner"
  },
  {
    "id": "13",
    "name": "Crêperie Bretonne",
    "city": "Paris",
    "address": "Crêperie Bretonne,  Rue de Patay, 75013",
    "rating": 4.5,
    "imageUrl": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
    "cuisine": "Bretonne",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/paris/creperie-bretonne"
  },
  {
    "id": "14",
    "name": "Pasta & Co",
    "city": "Paris",
    "address": "Pasta & Co,  75, 75009",
    "rating": 4.3,
    "imageUrl": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
    "cuisine": "Italienne",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/paris/pasta-co"
  },
  {
    "id": "15",
    "name": "Fish & Chips",
    "city": "Paris",
    "address": "Johana's Fish & Chips,  Rue Saint-Sauveur, 75002",
    "rating": 4.2,
    "imageUrl": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400",
    "cuisine": "Britannique",
    "status": "closed",
    "url": "https://deliveroo.fr/fr/restaurants/paris/fish-chips"
  },
  {
    "id": "16",
    "name": "Bouchon Lyonnais",
    "city": "Lyon",
    "address": "L’Antr’Opotes - Bouchon Lyonnais,  118, 69006",
    "rating": 4.7,
    "imageUrl": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
    "cuisine": "Lyonnaise",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/lyon/bouchon-lyonnais"
  },
  {
    "id": "17",
    "name": "Sushi Lyon",
    "city": "Lyon",
    "address": "Sushi Hand,  Rue du Dauphiné, 69100",
    "rating": 4.4,
    "imageUrl": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
    "cuisine": "Japonaise",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/lyon/sushi-lyon"
  },
  {
    "id": "21",
    "name": "Tacos Lyon",
    "city": "Lyon",
    "address": "Tacos World Lyon 8,  Avenue des Frères Lumière, 69008",
    "rating": 4.1,
    "imageUrl": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400",
    "cuisine": "Fast-Food",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/lyon/tacos-lyon"
  },
  {
    "id": "22",
    "name": "Restaurant Indien",
    "city": "Lyon",
    "address": "Le Taj Indien,  27, 69001",
    "rating": 4.6,
    "imageUrl": "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400",
    "cuisine": "Indienne",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/lyon/restaurant-indien"
  },
  {
    "id": "23",
    "name": "Le Bistrot",
    "city": "Lyon",
    "address": "Le Bistrot,  Rue Lannes, 69006",
    "rating": 4.4,
    "imageUrl": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
    "cuisine": "Française",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/lyon/le-bistrot"
  },
  {
    "id": "26",
    "name": "Le Panier",
    "city": "Marseille",
    "address": "Le Panier,  Marseille, France métropolitaine",
    "rating": 4.5,
    "imageUrl": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
    "cuisine": "Provençale",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/marseille/le-panier"
  },
  {
    "id": "27",
    "name": "Sushi Marseille",
    "city": "Marseille",
    "address": "Sushi Room,  52, 13001",
    "rating": 4.3,
    "imageUrl": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
    "cuisine": "Japonaise",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/marseille/sushi-marseille"
  },
  {
    "id": "28",
    "name": "Burger King Marseille",
    "city": "Marseille",
    "address": "Burger King,  Zone industrielle des Paluds (ASL des Paluds), 13400",
    "rating": 4.2,
    "imageUrl": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400",
    "cuisine": "Fast-Food",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/marseille/burger-king"
  },
  {
    "id": "31",
    "name": "Tacos Marseille",
    "city": "Marseille",
    "address": "New School Tacos,  Rue Vacon, 13001",
    "rating": 4.1,
    "imageUrl": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400",
    "cuisine": "Fast-Food",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/marseille/tacos-marseille"
  },
  {
    "id": "35",
    "name": "Le Capitole",
    "city": "Toulouse",
    "address": "Le Capitole,  10, 35000",
    "rating": 4.5,
    "imageUrl": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
    "cuisine": "Toulousaine",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/toulouse/le-capitole"
  },
  {
    "id": "36",
    "name": "Sushi Toulouse",
    "city": "Toulouse",
    "address": "Eat Sushi,  Rue des Frères Lion, 31000",
    "rating": 4.3,
    "imageUrl": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
    "cuisine": "Japonaise",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/toulouse/sushi-toulouse"
  },
  {
    "id": "37",
    "name": "Burger Toulouse",
    "city": "Toulouse",
    "address": "Toulouse Burger,  Rue Gabriel Péri, 31000",
    "rating": 4.4,
    "imageUrl": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400",
    "cuisine": "Américaine",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/toulouse/burger-toulouse"
  },
  {
    "id": "40",
    "name": "Tacos Toulouse",
    "city": "Toulouse",
    "address": "Tacos plana,  Rue Louis Plana, 31500",
    "rating": 4.1,
    "imageUrl": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400",
    "cuisine": "Fast-Food",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/toulouse/tacos-toulouse"
  },
  {
    "id": "42",
    "name": "Le Bistrot",
    "city": "Toulouse",
    "address": "Le Bistrot,  Rue des Usines, 31150",
    "rating": 4.4,
    "imageUrl": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
    "cuisine": "Française",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/toulouse/le-bistrot"
  },
  {
    "id": "43",
    "name": "Le Bordelais",
    "city": "Bordeaux",
    "address": "Le Comptoir Bordelais,  1, 33000",
    "rating": 4.6,
    "imageUrl": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
    "cuisine": "Bordelaise",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/bordeaux/le-bordelais"
  },
  {
    "id": "44",
    "name": "Sushi Bordeaux",
    "city": "Bordeaux",
    "address": "Sushi Thon,  159, 33800",
    "rating": 4.4,
    "imageUrl": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
    "cuisine": "Japonaise",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/bordeaux/sushi-bordeaux"
  },
  {
    "id": "45",
    "name": "Burger Bordeaux",
    "city": "Bordeaux",
    "address": "Burger King,  170, 33000",
    "rating": 4.3,
    "imageUrl": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400",
    "cuisine": "Américaine",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/bordeaux/burger-bordeaux"
  },
  {
    "id": "47",
    "name": "Le Wok",
    "city": "Bordeaux",
    "address": "Le Petit Wok,  3, 33000",
    "rating": 4.3,
    "imageUrl": "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400",
    "cuisine": "Asiatique",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/bordeaux/le-wok"
  },
  {
    "id": "48",
    "name": "Tacos Bordeaux",
    "city": "Bordeaux",
    "address": "Newschool Tacos Bordeaux Rive droite,  74, 33150",
    "rating": 4.1,
    "imageUrl": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400",
    "cuisine": "Fast-Food",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/bordeaux/tacos-bordeaux"
  },
  {
    "id": "49",
    "name": "Restaurant Indien",
    "city": "Bordeaux",
    "address": "Royal Indien,  31, 33000",
    "rating": 4.5,
    "imageUrl": "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400",
    "cuisine": "Indienne",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/bordeaux/restaurant-indien"
  },
  {
    "id": "50",
    "name": "Le Niçois",
    "city": "Nice",
    "address": "Le Petit Niçois,  Rue Diderot, 06000",
    "rating": 4.5,
    "imageUrl": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
    "cuisine": "Niçoise",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/nice/le-nicois"
  },
  {
    "id": "51",
    "name": "Sushi Nice",
    "city": "Nice",
    "address": "Eat Sushi,  Rue Trachel, 06000",
    "rating": 4.4,
    "imageUrl": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
    "cuisine": "Japonaise",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/nice/sushi-nice"
  },
  {
    "id": "52",
    "name": "Burger Nice",
    "city": "Nice",
    "address": "Coralie's burger,  Place du Général Goiran, 06100",
    "rating": 4.3,
    "imageUrl": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400",
    "cuisine": "Américaine",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/nice/burger-nice"
  },
  {
    "id": "53",
    "name": "Pizza Nice",
    "city": "Nice",
    "address": "Pizza 24 Nice,  Rue Saint-François de Paule, 06000",
    "rating": 4.2,
    "imageUrl": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
    "cuisine": "Italienne",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/nice/pizza-nice"
  },
  {
    "id": "55",
    "name": "Tacos Nice",
    "city": "Nice",
    "address": "Chek Tacos,  Rue Barla, 06300",
    "rating": 4.1,
    "imageUrl": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400",
    "cuisine": "Fast-Food",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/nice/tacos-nice"
  },
  {
    "id": "56",
    "name": "Restaurant Indien",
    "city": "Nice",
    "address": "New Indien,  9, 06240",
    "rating": 4.5,
    "imageUrl": "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400",
    "cuisine": "Indienne",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/nice/restaurant-indien"
  },
  {
    "id": "57",
    "name": "Le Nantais",
    "city": "Nantes",
    "address": "Le Pas Nantais,  Gétigné, 44190",
    "rating": 4.5,
    "imageUrl": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
    "cuisine": "Française",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/nantes/le-nantais"
  },
  {
    "id": "58",
    "name": "Sushi Nantes",
    "city": "Nantes",
    "address": "Sushi design,  Rue Francis Picabia, 44700",
    "rating": 4.3,
    "imageUrl": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
    "cuisine": "Japonaise",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/nantes/sushi-nantes"
  },
  {
    "id": "59",
    "name": "Burger Nantes",
    "city": "Nantes",
    "address": "House 44 Burger,  Rue Marmontel, 44007",
    "rating": 4.4,
    "imageUrl": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400",
    "cuisine": "Américaine",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/nantes/burger-nantes"
  },
  {
    "id": "60",
    "name": "Pizza Nantes",
    "city": "Nantes",
    "address": "Home Pizza,  Boulevard Ernest Dalby, 44021",
    "rating": 4.2,
    "imageUrl": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
    "cuisine": "Italienne",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/nantes/pizza-nantes"
  },
  {
    "id": "62",
    "name": "Tacos Nantes",
    "city": "Nantes",
    "address": "O'Tacos,  Allée Duguay Trouin, 44007",
    "rating": 4.1,
    "imageUrl": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400",
    "cuisine": "Fast-Food",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/nantes/tacos-nantes"
  },
  {
    "id": "64",
    "name": "Sushi Strasbourg",
    "city": "Strasbourg",
    "address": "Lady Sushi Strasbourg,  74, 67085",
    "rating": 4.4,
    "imageUrl": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
    "cuisine": "Japonaise",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/strasbourg/sushi-strasbourg"
  },
  {
    "id": "65",
    "name": "Burger Strasbourg",
    "city": "Strasbourg",
    "address": "Burger's Abwaender,  Vendenheim, 67550",
    "rating": 4.3,
    "imageUrl": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400",
    "cuisine": "Américaine",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/strasbourg/burger-strasbourg"
  },
  {
    "id": "66",
    "name": "Pizza Strasbourg",
    "city": "Strasbourg",
    "address": "Pizza de Gino,  Route de Schirmeck, 67380",
    "rating": 4.2,
    "imageUrl": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
    "cuisine": "Italienne",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/strasbourg/pizza-strasbourg"
  },
  {
    "id": "68",
    "name": "Tacos Strasbourg",
    "city": "Strasbourg",
    "address": "O'Tacos,  Place Saint-Étienne, 67000",
    "rating": 4.1,
    "imageUrl": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400",
    "cuisine": "Fast-Food",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/strasbourg/tacos-strasbourg"
  },
  {
    "id": "69",
    "name": "Le Lillois",
    "city": "Lille",
    "address": "Le Palais Lillois L'Automobile,  Rue Anatole France, 59800",
    "rating": 4.5,
    "imageUrl": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
    "cuisine": "Française",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/lille/le-lillois"
  },
  {
    "id": "70",
    "name": "Sushi Lille",
    "city": "Lille",
    "address": "Sushi Shop,  Place de Béthune, 59800",
    "rating": 4.3,
    "imageUrl": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
    "cuisine": "Japonaise",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/lille/sushi-lille"
  },
  {
    "id": "71",
    "name": "Burger Lille",
    "city": "Lille",
    "address": "Be Burger Lille,  39, 59043",
    "rating": 4.4,
    "imageUrl": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400",
    "cuisine": "Américaine",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/lille/burger-lille"
  },
  {
    "id": "72",
    "name": "Pizza Lille",
    "city": "Lille",
    "address": "Pizza Pasta,  Rue des Postes, 59046",
    "rating": 4.2,
    "imageUrl": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
    "cuisine": "Italienne",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/lille/pizza-lille"
  },
  {
    "id": "74",
    "name": "Tacos Lille",
    "city": "Lille",
    "address": "Chamas Tacos Lille Fives,  Rue Pierre Legrand, 59260",
    "rating": 4.1,
    "imageUrl": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400",
    "cuisine": "Fast-Food",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/lille/tacos-lille"
  },
  {
    "id": "75",
    "name": "Le Montpellierain",
    "city": "Montpellier",
    "address": "Le Montpelliérain,  Résidence Le Montpelliérain, 34000",
    "rating": 4.5,
    "imageUrl": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
    "cuisine": "Française",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/montpellier/le-montpellierain"
  },
  {
    "id": "76",
    "name": "Sushi Montpellier",
    "city": "Montpellier",
    "address": "Sushi Kawaii,  58, 34000",
    "rating": 4.3,
    "imageUrl": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
    "cuisine": "Japonaise",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/montpellier/sushi-montpellier"
  },
  {
    "id": "77",
    "name": "Burger Montpellier",
    "city": "Montpellier",
    "address": "32bits. burger,  15, 34000",
    "rating": 4.4,
    "imageUrl": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400",
    "cuisine": "Américaine",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/montpellier/burger-montpellier"
  },
  {
    "id": "78",
    "name": "Pizza Montpellier",
    "city": "Montpellier",
    "address": "Pizza,  Avenue Jean Jaurès, 34170",
    "rating": 4.2,
    "imageUrl": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
    "cuisine": "Italienne",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/montpellier/pizza-montpellier"
  },
  {
    "id": "79",
    "name": "Le Wok",
    "city": "Montpellier",
    "address": "Le Wok d'Asie,  Rue Carrière, 34250",
    "rating": 4.3,
    "imageUrl": "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400",
    "cuisine": "Asiatique",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/montpellier/le-wok"
  },
  {
    "id": "80",
    "name": "Tacos Montpellier",
    "city": "Montpellier",
    "address": "Tacos Family,  Rue Lejzer Zamenhof, 34185",
    "rating": 4.1,
    "imageUrl": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400",
    "cuisine": "Fast-Food",
    "status": "open",
    "url": "https://deliveroo.fr/fr/restaurants/montpellier/tacos-montpellier"
  }
];

const mockReviews = {
  "1": [
    {
      "id": "direct-0-1762326303454",
      "rating": 5,
      "comment": "Nous y avons dîné avec des amies samedi soir. Le cocktail était très frais et léger. Rien a redire sur les plats de lasagnes et le tiramisu qui était un délice.  Plus",
      "date": "2025-11-05",
      "author": "Charleene Enchantée",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762326303454",
      "rating": 5,
      "comment": "Nous y avons dîné avec des amies samedi soir. Le cocktail était très frais et léger. Rien a redire sur les plats de lasagnes et le tiramisu qui était un délice.  Plus",
      "date": "2025-11-05",
      "author": "Charleene Enchantée",
      "source": "google-direct"
    },
    {
      "id": "direct-9-1762326303454",
      "rating": 5,
      "comment": "Excellentissimo! Cétait vraiment très très bon. Les serveuses, serveurs sont très sympas. Les plats sont servis rapidement et toujours avec soins. Je recommande ce restaurant chaudement! Grazie mile Plus",
      "date": "2025-11-05",
      "author": "Cyril Le Cam",
      "source": "google-direct"
    }
  ],
  "4": [
    {
      "id": "direct-0-1762326326661",
      "rating": 4,
      "comment": "La salle est bien décorée, design très esthétique Personnel accueillant et souriant Les plats étaient bons mais rien d'extraordinaire non plus Les prix étaient corrects Plus",
      "date": "2025-11-05",
      "author": "Thea FunTraveler2000",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762326326661",
      "rating": 4,
      "comment": "La salle est bien décorée, design très esthétique Personnel accueillant et souriant Les plats étaient bons mais rien d'extraordinaire non plus Les prix étaient corrects Plus",
      "date": "2025-11-05",
      "author": "Thea FunTraveler2000",
      "source": "google-direct"
    }
  ],
  "5": [
    {
      "id": "direct-0-1762326346567",
      "rating": 5,
      "comment": "Étant tous les deux de grands fans de pizza comparaison de pizzas dans plus de 15 pays, cette adresse nous semblait un incontournable à Paris.  Plus",
      "date": "2025-11-05",
      "author": "Jenn Pz Pro",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762326346567",
      "rating": 5,
      "comment": "Étant tous les deux de grands fans de pizza comparaison de pizzas dans plus de 15 pays, cette adresse nous semblait un incontournable à Paris.  Plus",
      "date": "2025-11-05",
      "author": "Jenn Pz Pro",
      "source": "google-direct"
    }
  ],
  "7": [
    {
      "id": "direct-0-1762326367803",
      "rating": 1,
      "comment": "Jai commandé 2 kebab avec frites boissons seulement un des deux avait la boisson et les frites et ils osent me dire au téléphone quil nont pas eu ma commande. Kebab littéralement dégueulasse, livré une demi-heure en retard. Si il y'a une notation des pires kebab de France celui ci est en haut de la liste. Fuyez ! Plus",
      "date": "2025-11-05",
      "author": "Guillaume Thiberge",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762326367803",
      "rating": 1,
      "comment": "Jai commandé 2 kebab avec frites boissons seulement un des deux avait la boisson et les frites et ils osent me dire au téléphone quil nont pas eu ma commande. Kebab littéralement dégueulasse, livré une demi-heure en retard. Si il y'a une notation des pires kebab de France celui ci est en haut de la liste. Fuyez ! Plus",
      "date": "2025-11-05",
      "author": "Guillaume Thiberge",
      "source": "google-direct"
    },
    {
      "id": "direct-8-1762326367803",
      "rating": 1,
      "comment": "Même avec un tacos L 2 viandes, cest quoi ce manque total de viande ? Je vois rien dautre que des frites. sans goût et fade!!!! !  Plus",
      "date": "2025-11-05",
      "author": "Nawell Achi",
      "source": "google-direct"
    },
    {
      "id": "direct-9-1762326367803",
      "rating": 1,
      "comment": "Même avec un tacos L 2 viandes, cest quoi ce manque total de viande ? Je vois rien dautre que des frites. sans goût et fade!!!! !  Plus",
      "date": "2025-11-05",
      "author": "Nawell Achi",
      "source": "google-direct"
    }
  ],
  "8": [
    {
      "id": "direct-0-1762326387490",
      "rating": 5,
      "comment": "Excellente adresse, client fidèle depuis des années et jamais déçu. La qualité est toujours au top et les prix sont très raisonnable en comparaison à ce que l'on peux trouver ailleurs.. Plus",
      "date": "2025-11-05",
      "author": "lemjed BT",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762326387490",
      "rating": 5,
      "comment": "Excellente adresse, client fidèle depuis des années et jamais déçu. La qualité est toujours au top et les prix sont très raisonnable en comparaison à ce que l'on peux trouver ailleurs.. Plus",
      "date": "2025-11-05",
      "author": "lemjed BT",
      "source": "google-direct"
    },
    {
      "id": "direct-9-1762326387490",
      "rating": 5,
      "comment": "Excellent restaurant Japonais. Client fidèle depuis plus de 10 ans.. viens en plus d ajouter un tasty crousty super bon Plus",
      "date": "2025-11-05",
      "author": "Zoubair Bt",
      "source": "google-direct"
    }
  ],
  "10": [
    {
      "id": "direct-0-1762326409459",
      "rating": 5,
      "comment": "Tres bon rapport qualité prix bon repas Seul point negatif la viande pas assez chaude une fois servis Plus",
      "date": "2025-11-05",
      "author": "Luka Rodiel",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762326409459",
      "rating": 5,
      "comment": "Tres bon rapport qualité prix bon repas Seul point negatif la viande pas assez chaude une fois servis Plus",
      "date": "2025-11-05",
      "author": "Luka Rodiel",
      "source": "google-direct"
    },
    {
      "id": "direct-9-1762326409459",
      "rating": 5,
      "comment": "Je suis venu manger, on était 5 et on a été servis en moins de 5 minutes. Le kebab était vraiment bon et bien rempli pour le prix 11 . Plus",
      "date": "2025-11-05",
      "author": "Nassim",
      "source": "google-direct"
    }
  ],
  "13": [
    {
      "id": "direct-0-1762326431342",
      "rating": 4,
      "comment": "La Crêperie Bretonne 4,52 691  Crêperie    56 Rue du MontparnasseCadre pittoresque avec galettes, crêpes et cidreFermé  Ouvre à 11:45 \"Super bonnes crêpes, service très sympa, vraiment rien à redire\"",
      "date": "2025-11-05",
      "author": "Client 1",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762326431342",
      "rating": 4,
      "comment": "La Crêperie Bretonne 4,52 691  Crêperie    56 Rue du MontparnasseCadre pittoresque avec galettes, crêpes et cidreFermé  Ouvre à 11:45 \"Super bonnes crêpes, service très sympa, vraiment rien à redire\"",
      "date": "2025-11-05",
      "author": "Client 2",
      "source": "google-direct"
    },
    {
      "id": "direct-2-1762326431342",
      "rating": 4,
      "comment": "La Crêperie Bretonne 4,52 691  Crêperie    56 Rue du MontparnasseCadre pittoresque avec galettes, crêpes et cidreFermé  Ouvre à 11:45 \"Super bonnes crêpes, service très sympa, vraiment rien à redire\"",
      "date": "2025-11-05",
      "author": "Client 3",
      "source": "google-direct"
    },
    {
      "id": "direct-3-1762326431342",
      "rating": 4,
      "comment": "\"Super bonnes crêpes, service très sympa, vraiment rien à redire\"",
      "date": "2025-11-05",
      "author": "Client 4",
      "source": "google-direct"
    },
    {
      "id": "direct-4-1762326431342",
      "rating": 4,
      "comment": "\"Super bonnes crêpes, service très sympa, vraiment rien à redire\"",
      "date": "2025-11-05",
      "author": "Client 5",
      "source": "google-direct"
    },
    {
      "id": "direct-5-1762326431342",
      "rating": 4,
      "comment": "\"Super bonnes crêpes, service très sympa, vraiment rien à redire\"",
      "date": "2025-11-05",
      "author": "Client 6",
      "source": "google-direct"
    },
    {
      "id": "direct-6-1762326431342",
      "rating": 4,
      "comment": "\"Super bonnes crêpes, service très sympa, vraiment rien à redire\"",
      "date": "2025-11-05",
      "author": "Client 7",
      "source": "google-direct"
    },
    {
      "id": "direct-7-1762326431342",
      "rating": 4,
      "comment": "\"Super bonnes crêpes, service très sympa, vraiment rien à redire\"",
      "date": "2025-11-05",
      "author": "Client 8",
      "source": "google-direct"
    },
    {
      "id": "direct-8-1762326431343",
      "rating": 4,
      "comment": "La Petite Bretonne 4,51 448  Crêperie  48 Rue MouffetardCrêperie au cadre rustique traditionnelFermé  Ouvre à 12:00 \"Très bonnes crêpes bretonnes, service sympathique et poli",
      "date": "2025-11-05",
      "author": "Client 9",
      "source": "google-direct"
    },
    {
      "id": "direct-9-1762326431343",
      "rating": 4,
      "comment": "La Petite Bretonne 4,51 448  Crêperie  48 Rue MouffetardCrêperie au cadre rustique traditionnelFermé  Ouvre à 12:00 \"Très bonnes crêpes bretonnes, service sympathique et poli",
      "date": "2025-11-05",
      "author": "Client 10",
      "source": "google-direct"
    }
  ],
  "14": [
    {
      "id": "direct-0-1762326452231",
      "rating": 5,
      "comment": "Moi qui travail a côté cest un restaurant que je fréquente chaque semaine les pâtes et les pizzas sont délicieuses, le temps dattentes extrêmement court, des prix défiant toute concurrence 9,50 le plats de pâtes avec boisson et dessert  Plus",
      "date": "2025-11-05",
      "author": "Nordine BAITICHE",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762326452231",
      "rating": 5,
      "comment": "Moi qui travail a côté cest un restaurant que je fréquente chaque semaine les pâtes et les pizzas sont délicieuses, le temps dattentes extrêmement court, des prix défiant toute concurrence 9,50 le plats de pâtes avec boisson et dessert  Plus",
      "date": "2025-11-05",
      "author": "Nordine BAITICHE",
      "source": "google-direct"
    },
    {
      "id": "direct-9-1762326452232",
      "rating": 5,
      "comment": "Les pâtes sont très bonnes, grand choix de sauces, quantité parfaite. Possibilité de rajouter du gruyère ou du parmesan, le tout pour un prix très abordable moins de 10 avec boissondessert. D'ailleurs, grand choix de desserts.  Plus",
      "date": "2025-11-05",
      "author": "Paul Montesinos",
      "source": "google-direct"
    }
  ],
  "15": [
    {
      "id": "direct-0-1762326472323",
      "rating": 5,
      "comment": "Excellente expérience ! On sent la passion du service dès quon rentre et on nen sort pas déçu. Le poisson était très bon, la panure valait un 1010, la sauce tartare pouvait être un peu plus herbacée mais restait pleine de goût. Le  Plus",
      "date": "2025-11-05",
      "author": "Halima Zaghbib",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762326472323",
      "rating": 5,
      "comment": "Excellente expérience ! On sent la passion du service dès quon rentre et on nen sort pas déçu. Le poisson était très bon, la panure valait un 1010, la sauce tartare pouvait être un peu plus herbacée mais restait pleine de goût. Le  Plus",
      "date": "2025-11-05",
      "author": "Halima Zaghbib",
      "source": "google-direct"
    },
    {
      "id": "direct-9-1762326472323",
      "rating": 5,
      "comment": "Endroit discret et chaleureux, où l'on est accueilli par le chef, présent à la fois dans la salle et aux fourneaux. Nous étions arrivés avec une pulsion quasi régressive, nostalgique de séjours londoniens. Nous n'avons pas été déçus, car la  Plus",
      "date": "2025-11-05",
      "author": "Julien Ezanno",
      "source": "google-direct"
    }
  ],
  "16": [
    {
      "id": "direct-0-1762326492156",
      "rating": 5,
      "comment": "Très bon moment au Bouchon des Cordeliers ! De passage à Lyon avec un collègue anglais, jétais ravi de lui faire découvrir la gastronomie lyonnaise et nous navons pas été déçus.  Plus",
      "date": "2025-11-05",
      "author": "Maxime A",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762326492156",
      "rating": 5,
      "comment": "Très bon moment au Bouchon des Cordeliers ! De passage à Lyon avec un collègue anglais, jétais ravi de lui faire découvrir la gastronomie lyonnaise et nous navons pas été déçus.  Plus",
      "date": "2025-11-05",
      "author": "Maxime A",
      "source": "google-direct"
    }
  ],
  "17": [
    {
      "id": "direct-0-1762326514184",
      "rating": 1,
      "comment": "C'était nul! Jai commandé un plateau de 20 pièces et 24 pièces via leur site, en espérant  Plus",
      "date": "2025-11-05",
      "author": "Maryo Nakhoul",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762326514184",
      "rating": 1,
      "comment": "C'était nul! Jai commandé un plateau de 20 pièces et 24 pièces via leur site, en espérant  Plus",
      "date": "2025-11-05",
      "author": "Maryo Nakhoul",
      "source": "google-direct"
    }
  ],
  "21": [
    {
      "id": "direct-0-1762326537282",
      "rating": 1,
      "comment": "Jétais venu quelques jours avant ils avaient oublier la sauce et là jai pris un deux viandes, ils respectent pas les quantités, et ça cest inacceptable. Quand on paye on veut lintégralité de la commande. La taille du tacos M est ridicule. Plus",
      "date": "2025-11-05",
      "author": "S. Alexandre",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762326537282",
      "rating": 1,
      "comment": "Jétais venu quelques jours avant ils avaient oublier la sauce et là jai pris un deux viandes, ils respectent pas les quantités, et ça cest inacceptable. Quand on paye on veut lintégralité de la commande. La taille du tacos M est ridicule. Plus",
      "date": "2025-11-05",
      "author": "S. Alexandre",
      "source": "google-direct"
    },
    {
      "id": "direct-9-1762326537283",
      "rating": 5,
      "comment": "Super snack, Nous avons super bien mangé ! Des tacos qui sortent de l'ordinaire et très bien garnis. Le restaurant est très propre, spacieux, joliment décoré. Rapport qualité prix excellent par rapport à l'emplacement. Plus",
      "date": "2025-11-05",
      "author": "Nanou",
      "source": "google-direct"
    }
  ],
  "22": [
    {
      "id": "direct-0-1762326557218",
      "rating": 5,
      "comment": "Génial, ambiance au top, service au top.. je regrette juste que l'assaisonnement ait été ajusté aux palais français j'aurais aimé plus de sel et d epices Plus",
      "date": "2025-11-05",
      "author": "Mehdi HAMIDA",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762326557218",
      "rating": 5,
      "comment": "Génial, ambiance au top, service au top.. je regrette juste que l'assaisonnement ait été ajusté aux palais français j'aurais aimé plus de sel et d epices Plus",
      "date": "2025-11-05",
      "author": "Mehdi HAMIDA",
      "source": "google-direct"
    }
  ],
  "23": [
    {
      "id": "direct-0-1762326576847",
      "rating": 4,
      "comment": "Restaurant très sympathique, avec des produits de qualité et un rapport qualité  prix excellent. Cest toujours un régal. Idéal pour un déjeuner professionnel. Le cadre est moderne, quelques fois bruyant si la salle est remplie mais cela  Plus",
      "date": "2025-11-05",
      "author": "Margot Michaud",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762326576847",
      "rating": 4,
      "comment": "Restaurant très sympathique, avec des produits de qualité et un rapport qualité  prix excellent. Cest toujours un régal. Idéal pour un déjeuner professionnel. Le cadre est moderne, quelques fois bruyant si la salle est remplie mais cela  Plus",
      "date": "2025-11-05",
      "author": "Margot Michaud",
      "source": "google-direct"
    }
  ],
  "26": [
    {
      "id": "parsed-0-1762326622820",
      "rating": 4,
      "comment": "services_cb_v2_2_gm_grey_700.",
      "date": "2025-11-05",
      "author": "Client 1",
      "source": "parsed"
    }
  ],
  "27": [
    {
      "id": "direct-0-1762326643332",
      "rating": 3,
      "comment": "je n'ai fais que des commandes en livraison et il manque toujours quelque chose. de plus j'ai l'impression que plus le temps passe et moins il y a de saumon dans les produits que je commande. Plus",
      "date": "2025-11-05",
      "author": "mani mani",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762326643332",
      "rating": 3,
      "comment": "je n'ai fais que des commandes en livraison et il manque toujours quelque chose. de plus j'ai l'impression que plus le temps passe et moins il y a de saumon dans les produits que je commande. Plus",
      "date": "2025-11-05",
      "author": "mani mani",
      "source": "google-direct"
    }
  ],
  "28": [
    {
      "id": "direct-0-1762326663498",
      "rating": 3,
      "comment": "De passage dans le secteur, j'ai testé ce burger king en commande a emporter par l'option \"clic n collect\" de l'application. Le système fonctionne bien en passant par le drive du restaurant,  Plus",
      "date": "2025-11-05",
      "author": "Pier",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762326663498",
      "rating": 3,
      "comment": "De passage dans le secteur, j'ai testé ce burger king en commande a emporter par l'option \"clic n collect\" de l'application. Le système fonctionne bien en passant par le drive du restaurant,  Plus",
      "date": "2025-11-05",
      "author": "Pier",
      "source": "google-direct"
    }
  ],
  "31": [
    {
      "id": "direct-0-1762326685716",
      "rating": 1,
      "comment": "Très déçu par la commande. Les portions sont ridiculement petites pour le prix. Un tacos une viande à 9,90  sans frites ni boisson, les frites à 2,90  en supplément, et un dessert tiramisu à 3,90  vraiment minuscule.  Plus",
      "date": "2025-11-05",
      "author": "Louane Mascle",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762326685716",
      "rating": 1,
      "comment": "Très déçu par la commande. Les portions sont ridiculement petites pour le prix. Un tacos une viande à 9,90  sans frites ni boisson, les frites à 2,90  en supplément, et un dessert tiramisu à 3,90  vraiment minuscule.  Plus",
      "date": "2025-11-05",
      "author": "Louane Mascle",
      "source": "google-direct"
    },
    {
      "id": "direct-8-1762326685717",
      "rating": 2,
      "comment": "Vue les avis et plus que 2000 très bon avis Jai essayer tacos double viande simple franchement je le donne 610 Plus",
      "date": "2025-11-05",
      "author": "Marwan Ben Aribi",
      "source": "google-direct"
    },
    {
      "id": "direct-9-1762326685717",
      "rating": 2,
      "comment": "Vue les avis et plus que 2000 très bon avis Jai essayer tacos double viande simple franchement je le donne 610 Plus",
      "date": "2025-11-05",
      "author": "Marwan Ben Aribi",
      "source": "google-direct"
    }
  ],
  "35": [
    {
      "id": "parsed-0-1762326733393",
      "rating": 4,
      "comment": "services_cb_v2_2_gm_grey_700.",
      "date": "2025-11-05",
      "author": "Client 1",
      "source": "parsed"
    }
  ],
  "36": [
    {
      "id": "direct-0-1762326753826",
      "rating": 4,
      "comment": "Très bon restaurant de spécialité asiatique avec de nombreux choix parfois originaux et toujours très bon . Pour le nombre de fois où nous y sommes allés, nous navons jamais été déçu. Les plats sont toujours très copieux et excellents. Un  Plus",
      "date": "2025-11-05",
      "author": "Anaya",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762326753826",
      "rating": 4,
      "comment": "Très bon restaurant de spécialité asiatique avec de nombreux choix parfois originaux et toujours très bon . Pour le nombre de fois où nous y sommes allés, nous navons jamais été déçu. Les plats sont toujours très copieux et excellents. Un  Plus",
      "date": "2025-11-05",
      "author": "Anaya",
      "source": "google-direct"
    }
  ],
  "37": [
    {
      "id": "direct-0-1762326773805",
      "rating": 4,
      "comment": "Des hamburgers originaux très délicieux à deguster. Le prix est assez cher mais bo ! Une fois par hasard ca vaut le détour.  Plus",
      "date": "2025-11-05",
      "author": "Youghy Ch (Mister Jug)",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762326773805",
      "rating": 4,
      "comment": "Des hamburgers originaux très délicieux à deguster. Le prix est assez cher mais bo ! Une fois par hasard ca vaut le détour.  Plus",
      "date": "2025-11-05",
      "author": "Youghy Ch (Mister Jug)",
      "source": "google-direct"
    }
  ],
  "40": [
    {
      "id": "direct-0-1762326795812",
      "rating": 5,
      "comment": "Service très rapide, menu étudiant pas chère 7 le tacos deux viandes avec un bon emplacement proche du capitole. Je recommande fortement Plus",
      "date": "2025-11-05",
      "author": "Lansana Diallo",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762326795812",
      "rating": 5,
      "comment": "Service très rapide, menu étudiant pas chère 7 le tacos deux viandes avec un bon emplacement proche du capitole. Je recommande fortement Plus",
      "date": "2025-11-05",
      "author": "Lansana Diallo",
      "source": "google-direct"
    }
  ],
  "42": [
    {
      "id": "direct-0-1762326816692",
      "rating": 5,
      "comment": "Super bistrot français ! On y mange très bien pour un prix raisonnable. Ambiance conviviale, plats gourmands et Agnès, la serveuse, est adorable On se sent comme à la maison ! Plus",
      "date": "2025-11-05",
      "author": "Clémence",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762326816692",
      "rating": 5,
      "comment": "Super bistrot français ! On y mange très bien pour un prix raisonnable. Ambiance conviviale, plats gourmands et Agnès, la serveuse, est adorable On se sent comme à la maison ! Plus",
      "date": "2025-11-05",
      "author": "Clémence",
      "source": "google-direct"
    }
  ],
  "43": [
    {
      "id": "direct-0-1762326836589",
      "rating": 5,
      "comment": "Très jolie table de plats cuisinés avec attention. Le service est attentif et convivial, l'ambiance agréable et décontractée. Salle un peu bruyante qui incitera à rester dehors, même si la terrasse manque  Plus",
      "date": "2025-11-05",
      "author": "Eric Gérona",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762326836589",
      "rating": 5,
      "comment": "Très jolie table de plats cuisinés avec attention. Le service est attentif et convivial, l'ambiance agréable et décontractée. Salle un peu bruyante qui incitera à rester dehors, même si la terrasse manque  Plus",
      "date": "2025-11-05",
      "author": "Eric Gérona",
      "source": "google-direct"
    }
  ],
  "44": [
    {
      "id": "direct-0-1762326856923",
      "rating": 3,
      "comment": "Personnel agréable et prix abordables. Il y a pas mal de choix sur la carte notamment plusieurs végétariens mais malheureusement j'ai commandé un poké végétarien et j'y ai trouvé un gyoza au poulet dedans. Pour tout ce qui a été commandé  Plus",
      "date": "2025-11-05",
      "author": "Maëna Phan",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762326856923",
      "rating": 3,
      "comment": "Personnel agréable et prix abordables. Il y a pas mal de choix sur la carte notamment plusieurs végétariens mais malheureusement j'ai commandé un poké végétarien et j'y ai trouvé un gyoza au poulet dedans. Pour tout ce qui a été commandé  Plus",
      "date": "2025-11-05",
      "author": "Maëna Phan",
      "source": "google-direct"
    }
  ],
  "45": [
    {
      "id": "direct-0-1762326877673",
      "rating": 1,
      "comment": "Alors je suis tres déçu du service et de la cuisine. J'ai commandé en livraison via delivroo bw pour faire plaisir a mon filleul car il voulais tester.  Plus",
      "date": "2025-11-05",
      "author": "Damien Santos",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762326877673",
      "rating": 1,
      "comment": "Alors je suis tres déçu du service et de la cuisine. J'ai commandé en livraison via delivroo bw pour faire plaisir a mon filleul car il voulais tester.  Plus",
      "date": "2025-11-05",
      "author": "Damien Santos",
      "source": "google-direct"
    }
  ],
  "47": [
    {
      "id": "direct-0-1762326898630",
      "rating": 4,
      "comment": "Influence Wok 4,5457  2030 Fondue chinoise    3 Rue MartignacSpécialités asiatiques  décor zenFermé  Ouvre à 12:00 \"Plats copieux, délicieux et options végétariennes sur tous les woks",
      "date": "2025-11-05",
      "author": "Client 1",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762326898631",
      "rating": 4,
      "comment": "Influence Wok 4,5457  2030 Fondue chinoise    3 Rue MartignacSpécialités asiatiques  décor zenFermé  Ouvre à 12:00 \"Plats copieux, délicieux et options végétariennes sur tous les woks",
      "date": "2025-11-05",
      "author": "Client 2",
      "source": "google-direct"
    },
    {
      "id": "direct-2-1762326898631",
      "rating": 4,
      "comment": "Influence Wok 4,5457  2030 Fondue chinoise    3 Rue MartignacSpécialités asiatiques  décor zenFermé  Ouvre à 12:00 \"Plats copieux, délicieux et options végétariennes sur tous les woks",
      "date": "2025-11-05",
      "author": "Client 3",
      "source": "google-direct"
    },
    {
      "id": "direct-3-1762326898631",
      "rating": 4,
      "comment": "\"Plats copieux, délicieux et options végétariennes sur tous les woks",
      "date": "2025-11-05",
      "author": "Client 4",
      "source": "google-direct"
    },
    {
      "id": "direct-4-1762326898631",
      "rating": 4,
      "comment": "\"Plats copieux, délicieux et options végétariennes sur tous les woks",
      "date": "2025-11-05",
      "author": "Client 5",
      "source": "google-direct"
    },
    {
      "id": "direct-5-1762326898631",
      "rating": 4,
      "comment": "\"Plats copieux, délicieux et options végétariennes sur tous les woks",
      "date": "2025-11-05",
      "author": "Client 6",
      "source": "google-direct"
    },
    {
      "id": "direct-6-1762326898631",
      "rating": 4,
      "comment": "\"Plats copieux, délicieux et options végétariennes sur tous les woks",
      "date": "2025-11-05",
      "author": "Client 7",
      "source": "google-direct"
    },
    {
      "id": "direct-7-1762326898631",
      "rating": 4,
      "comment": "\"Plats copieux, délicieux et options végétariennes sur tous les woks",
      "date": "2025-11-05",
      "author": "Client 8",
      "source": "google-direct"
    },
    {
      "id": "direct-8-1762326898631",
      "rating": 4,
      "comment": "Le Petit Wok 4,5231  1020 Restaurant  3 Rue du Palais GallienFermé  Ouvre à 12:00 \"Le Petit Wok propose des plats asiatiques authentiques et délicieux",
      "date": "2025-11-05",
      "author": "Client 9",
      "source": "google-direct"
    },
    {
      "id": "direct-9-1762326898631",
      "rating": 4,
      "comment": "Le Petit Wok 4,5231  1020 Restaurant  3 Rue du Palais GallienFermé  Ouvre à 12:00 \"Le Petit Wok propose des plats asiatiques authentiques et délicieux",
      "date": "2025-11-05",
      "author": "Client 10",
      "source": "google-direct"
    }
  ],
  "48": [
    {
      "id": "direct-0-1762326918421",
      "rating": 5,
      "comment": "Passé ce matin pour un simple café au cosy Tacos bastide , super accueil. Léquipe est polie, souriante, lendroit est propre, spacieux et agréable. Même juste pour un café, on se sent bienvenu  ça donne clairement envie de revenir à midi pour manger. Merci pour laccueil, ça fait plaisir. Plus",
      "date": "2025-11-05",
      "author": "Noé AC",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762326918421",
      "rating": 5,
      "comment": "Passé ce matin pour un simple café au cosy Tacos bastide , super accueil. Léquipe est polie, souriante, lendroit est propre, spacieux et agréable. Même juste pour un café, on se sent bienvenu  ça donne clairement envie de revenir à midi pour manger. Merci pour laccueil, ça fait plaisir. Plus",
      "date": "2025-11-05",
      "author": "Noé AC",
      "source": "google-direct"
    }
  ],
  "49": [
    {
      "id": "direct-0-1762326938307",
      "rating": 5,
      "comment": "Nous y avons déjeuné hier midi et ce fut un régal. Le personnel est vraiment gentil et prévenant. Les naams sont excellents, le poulet tikka et la raïta, de belles découvertes pleines de saveurs et le poulet tikka masala était très bon et parfumé. Plus",
      "date": "2025-11-05",
      "author": "Audrey Sandra",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762326938307",
      "rating": 5,
      "comment": "Nous y avons déjeuné hier midi et ce fut un régal. Le personnel est vraiment gentil et prévenant. Les naams sont excellents, le poulet tikka et la raïta, de belles découvertes pleines de saveurs et le poulet tikka masala était très bon et parfumé. Plus",
      "date": "2025-11-05",
      "author": "Audrey Sandra",
      "source": "google-direct"
    }
  ],
  "50": [
    {
      "id": "direct-0-1762326958189",
      "rating": 4,
      "comment": "Laccueil est sans  chichi  mais agréable et Disons le tout de suite la cuisine est de bonne facture car derrière ces bons plats se cache un vrai cuisinier ce qui nest pas toujours le cas. Nos choix se sont porté sur Un carpaccio de buf  Plus",
      "date": "2025-11-05",
      "author": "Titi Malo",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762326958189",
      "rating": 4,
      "comment": "Laccueil est sans  chichi  mais agréable et Disons le tout de suite la cuisine est de bonne facture car derrière ces bons plats se cache un vrai cuisinier ce qui nest pas toujours le cas. Nos choix se sont porté sur Un carpaccio de buf  Plus",
      "date": "2025-11-05",
      "author": "Titi Malo",
      "source": "google-direct"
    },
    {
      "id": "direct-8-1762326958189",
      "rating": 5,
      "comment": "Très bonne pizza à pâte fine. Accueil agréable et rapport qualité-prix excellent.Type de repas Plus",
      "date": "2025-11-05",
      "author": "Marcin ULAŃSKI",
      "source": "google-direct"
    },
    {
      "id": "direct-9-1762326958189",
      "rating": 5,
      "comment": "Très bonne pizza à pâte fine. Accueil agréable et rapport qualité-prix excellent.Type de repas Plus",
      "date": "2025-11-05",
      "author": "Marcin ULAŃSKI",
      "source": "google-direct"
    }
  ],
  "51": [
    {
      "id": "direct-0-1762326978792",
      "rating": 5,
      "comment": "Sushis excellents, originaux et exclusifs à cette enseigne. Nous avons été très bien reçu et avons très bien mangé. Ça change des restos de sushis classiques ! Service top et rapide. On y retournera. Ouvrez à Menton !!",
      "date": "2025-11-05",
      "author": "Pokop",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762326978792",
      "rating": 5,
      "comment": "Sushis excellents, originaux et exclusifs à cette enseigne. Nous avons été très bien reçu et avons très bien mangé. Ça change des restos de sushis classiques ! Service top et rapide. On y retournera. Ouvrez à Menton !!",
      "date": "2025-11-05",
      "author": "Pokop",
      "source": "google-direct"
    },
    {
      "id": "direct-9-1762326978792",
      "rating": 1,
      "comment": "Nous avons été déçu par le manque de professionnalisme de léquipe de ce soir. Nous navons pas eu le bon plat commandé, cela arrive mais nous navons reçu aucune excuse et la serveuse nous a même tutoyé  Plus",
      "date": "2025-11-05",
      "author": "Castejon Agathe",
      "source": "google-direct"
    }
  ],
  "52": [
    {
      "id": "direct-0-1762327000516",
      "rating": 5,
      "comment": "Une expérience incroyable du début à la fin !  La nourriture est absolument délicieuse, avec des produits frais, des assaisonnements parfaits, des options végé et sans gluten ! Chaque plat est un vrai régal  Plus",
      "date": "2025-11-05",
      "author": "Sophie Kardous",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762327000516",
      "rating": 5,
      "comment": "Une expérience incroyable du début à la fin !  La nourriture est absolument délicieuse, avec des produits frais, des assaisonnements parfaits, des options végé et sans gluten ! Chaque plat est un vrai régal  Plus",
      "date": "2025-11-05",
      "author": "Sophie Kardous",
      "source": "google-direct"
    },
    {
      "id": "direct-9-1762327000516",
      "rating": 4,
      "comment": "Personnel très accueillant et service irréprochable. Les frites sont délicieuses. Je ne me suis pas régalé avec le burger que jai choisi en revanche. Plus",
      "date": "2025-11-05",
      "author": "David Borja",
      "source": "google-direct"
    }
  ],
  "53": [
    {
      "id": "direct-0-1762327020395",
      "rating": 5,
      "comment": "Jai déjà pris plusieurs pizzas à emporter chez Mama Pizza, et franchement, jamais déçu. La pâte est bonne, les pizzas sont bien garnies, et ça sent quils font les choses sérieusement sans se prendre la tête.  Plus",
      "date": "2025-11-05",
      "author": "Nicolas",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762327020395",
      "rating": 5,
      "comment": "Jai déjà pris plusieurs pizzas à emporter chez Mama Pizza, et franchement, jamais déçu. La pâte est bonne, les pizzas sont bien garnies, et ça sent quils font les choses sérieusement sans se prendre la tête.  Plus",
      "date": "2025-11-05",
      "author": "Nicolas",
      "source": "google-direct"
    },
    {
      "id": "direct-9-1762327020395",
      "rating": 5,
      "comment": "Un accueil et un service irréprochable, ils sont la seul adresse de pizza pour laquelle je ne cesserai de commander, qualité prix très satisfaisante, je les recommande à tous mon entourage et personne ne cest plein au contraire que des compliments. Merci à toute léquipe pour le travail effectué avec le sourire et remplie damour. Plus",
      "date": "2025-11-05",
      "author": "Sophia Bkt",
      "source": "google-direct"
    }
  ],
  "55": [
    {
      "id": "direct-0-1762327041229",
      "rating": 1,
      "comment": "Pr commencer la borne ne marche pas elle mets 20 ans à enregistrer ma commande tout ça pr que au final le personnel ne soit même pas capable de respecter ma commande jai bien commandé un Spacy mais jai reçu un chèvre miel on ma donc  Plus",
      "date": "2025-11-05",
      "author": "Kaïs Esseghir",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762327041229",
      "rating": 1,
      "comment": "Pr commencer la borne ne marche pas elle mets 20 ans à enregistrer ma commande tout ça pr que au final le personnel ne soit même pas capable de respecter ma commande jai bien commandé un Spacy mais jai reçu un chèvre miel on ma donc  Plus",
      "date": "2025-11-05",
      "author": "Kaïs Esseghir",
      "source": "google-direct"
    },
    {
      "id": "direct-9-1762327041229",
      "rating": 1,
      "comment": "Commande incomplète et mélanger - javais commandé deux tacos un cordon bleu sauce burger et un autre nuggets mayo. Je me suis retrouvé avec un seul tacos merguez sauce samurai rien à voir. De plus, personne a pu manger car nous ne consommons point de merguez Létablissement est injoignable Plus",
      "date": "2025-11-05",
      "author": "WilIiam Fernandes",
      "source": "google-direct"
    }
  ],
  "56": [
    {
      "id": "direct-0-1762327061454",
      "rating": 5,
      "comment": "Seulement un mot !!!! J'adore !!!! C'est la première fois que je mange indien et au début j'étais un peu septique et enfaite adorablement surprise . La personne qui nous a servi adorable et la nourriture... pfff il y a pas de mot pour  Plus",
      "date": "2025-11-05",
      "author": "Angélique De Haro",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762327061454",
      "rating": 5,
      "comment": "Seulement un mot !!!! J'adore !!!! C'est la première fois que je mange indien et au début j'étais un peu septique et enfaite adorablement surprise . La personne qui nous a servi adorable et la nourriture... pfff il y a pas de mot pour  Plus",
      "date": "2025-11-05",
      "author": "Angélique De Haro",
      "source": "google-direct"
    },
    {
      "id": "direct-9-1762327061454",
      "rating": 2,
      "comment": "Franchement cétait pas mauvais mais ce nétait pas non plus incroyable, 18 pour un plat de butter chicken minuscule  un naan cramé, huileux et tout petit, je ny retournerai pas dommage.  Plus",
      "date": "2025-11-05",
      "author": "Oceane Nahle",
      "source": "google-direct"
    }
  ],
  "57": [
    {
      "id": "direct-0-1762327081609",
      "rating": 5,
      "comment": "Merciiiiii à toute l'équipe pour leur accueil et leurs trop bons cocktails et bonne humeur . Spécial clin d'il à fred, pour cette merveilleuse soirée inoubliable !!! Quel plaisir d'avoir pu être accompagnés tout au long de notre repas.  Plus",
      "date": "2025-11-05",
      "author": "Nathalie S",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762327081609",
      "rating": 5,
      "comment": "Merciiiiii à toute l'équipe pour leur accueil et leurs trop bons cocktails et bonne humeur . Spécial clin d'il à fred, pour cette merveilleuse soirée inoubliable !!! Quel plaisir d'avoir pu être accompagnés tout au long de notre repas.  Plus",
      "date": "2025-11-05",
      "author": "Nathalie S",
      "source": "google-direct"
    }
  ],
  "58": [
    {
      "id": "direct-0-1762327102010",
      "rating": 5,
      "comment": "Un de mes restaurants de sushis préférés, sans hésiter. La fraîcheur des poissons est irréprochable, les découpes sont nettes, précises, et chaque bouchée révèle un vrai respect du produit. On sent la passion et le souci du détail derrière  Plus",
      "date": "2025-11-05",
      "author": "Taevane",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762327102010",
      "rating": 5,
      "comment": "Un de mes restaurants de sushis préférés, sans hésiter. La fraîcheur des poissons est irréprochable, les découpes sont nettes, précises, et chaque bouchée révèle un vrai respect du produit. On sent la passion et le souci du détail derrière  Plus",
      "date": "2025-11-05",
      "author": "Taevane",
      "source": "google-direct"
    },
    {
      "id": "direct-9-1762327102010",
      "rating": 5,
      "comment": "Nous avons passé un excellent moment dans ce restaurant. Les sushis étaient délicieux ! Avec une qualité et variété de poissons présente sur le menu.  Plus",
      "date": "2025-11-05",
      "author": "Célia Audinot",
      "source": "google-direct"
    }
  ],
  "59": [
    {
      "id": "direct-0-1762327122777",
      "rating": 5,
      "comment": "Excellent restaurant de burger avec des classiques et quelques choix originaux, pareil pour les boissons avec classiques et club maté, et le service est très sympa ! Bien meilleur que de nombreuses chaînes   Plus",
      "date": "2025-11-05",
      "author": "Vincent Joumel",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762327122777",
      "rating": 5,
      "comment": "Excellent restaurant de burger avec des classiques et quelques choix originaux, pareil pour les boissons avec classiques et club maté, et le service est très sympa ! Bien meilleur que de nombreuses chaînes   Plus",
      "date": "2025-11-05",
      "author": "Vincent Joumel",
      "source": "google-direct"
    }
  ],
  "60": [
    {
      "id": "direct-0-1762327144294",
      "rating": 5,
      "comment": "Un vrai coup de cur au centre de Nantes ! Les pizzas sont excellentes et le service chaleureux et attentionné : on se sent bien accueillis dès larrivée. Le cadre est agréable, avec un emplacement idéal  Plus",
      "date": "2025-11-05",
      "author": "Lucio Molinari",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762327144294",
      "rating": 5,
      "comment": "Un vrai coup de cur au centre de Nantes ! Les pizzas sont excellentes et le service chaleureux et attentionné : on se sent bien accueillis dès larrivée. Le cadre est agréable, avec un emplacement idéal  Plus",
      "date": "2025-11-05",
      "author": "Lucio Molinari",
      "source": "google-direct"
    }
  ],
  "62": [
    {
      "id": "direct-0-1762327165530",
      "rating": 1,
      "comment": "les gars qui gère la franchise, ajoutez au moins un cuistot ou deux, le resto marche bien il est bien noté, alors pourquoi vous embauchez pas plus de personnel, ils étaient dépassé par les commandes.  Plus",
      "date": "2025-11-05",
      "author": "Benjamin Fv",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762327165530",
      "rating": 1,
      "comment": "les gars qui gère la franchise, ajoutez au moins un cuistot ou deux, le resto marche bien il est bien noté, alors pourquoi vous embauchez pas plus de personnel, ils étaient dépassé par les commandes.  Plus",
      "date": "2025-11-05",
      "author": "Benjamin Fv",
      "source": "google-direct"
    },
    {
      "id": "direct-8-1762327165531",
      "rating": 5,
      "comment": "Le bunch est le meilleur tacos de Nantes sans conteste. Moi et mes copains sommes complètement accros. Donnez nous plus de tacos ! Plus",
      "date": "2025-11-05",
      "author": "Arthur Dufresne",
      "source": "google-direct"
    },
    {
      "id": "direct-9-1762327165531",
      "rating": 5,
      "comment": "Le bunch est le meilleur tacos de Nantes sans conteste. Moi et mes copains sommes complètement accros. Donnez nous plus de tacos ! Plus",
      "date": "2025-11-05",
      "author": "Arthur Dufresne",
      "source": "google-direct"
    }
  ],
  "64": [
    {
      "id": "direct-0-1762327186744",
      "rating": 5,
      "comment": "Jai adoré manger au Sushi Show ! Tout était super frais et vraiment délicieux. Jai apprécié que le chef sadapte à ce que je voulais. Et la serveuse était adorable, souriante et attentionnée. Une adresse où je reviendrai vraiment avec  Plus",
      "date": "2025-11-05",
      "author": "Mimi",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762327186744",
      "rating": 5,
      "comment": "Jai adoré manger au Sushi Show ! Tout était super frais et vraiment délicieux. Jai apprécié que le chef sadapte à ce que je voulais. Et la serveuse était adorable, souriante et attentionnée. Une adresse où je reviendrai vraiment avec  Plus",
      "date": "2025-11-05",
      "author": "Mimi",
      "source": "google-direct"
    }
  ],
  "65": [
    {
      "id": "direct-0-1762327208468",
      "rating": 5,
      "comment": "Quel régal, meilleur smach burger de la ville. Tout est fait maison, laccueil est top et le patron super gentil. Obligé de revenir pour goûter celui au poulet Je recommande 1000 fois vous pouvez y aller les yeux fermés Plus",
      "date": "2025-11-05",
      "author": "ben",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762327208468",
      "rating": 5,
      "comment": "Quel régal, meilleur smach burger de la ville. Tout est fait maison, laccueil est top et le patron super gentil. Obligé de revenir pour goûter celui au poulet Je recommande 1000 fois vous pouvez y aller les yeux fermés Plus",
      "date": "2025-11-05",
      "author": "ben",
      "source": "google-direct"
    },
    {
      "id": "direct-9-1762327208468",
      "rating": 5,
      "comment": "Jai découvert cet endroit sur Instagram par hasard et cétait incroyable!! Les burgers étaient vraiment à la hauteur et les patates douces dans mon top 3 de Strasbourg! Les prix super intéressants avec une petite réduction pour les  Plus",
      "date": "2025-11-05",
      "author": "Sara B.",
      "source": "google-direct"
    }
  ],
  "66": [
    {
      "id": "direct-0-1762327230492",
      "rating": 5,
      "comment": "Je suis venue dîner ici avec des amis dont une personne Vegan. Elle était absolument ravie du choix et du goût. Pour ma part pas la grande fan de pizza en général, j'ai trouvé la mienne délicieuse et cela m'a redonné envie d'en manger !!! Plus",
      "date": "2025-11-05",
      "author": "Ophelie Heck",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762327230492",
      "rating": 5,
      "comment": "Je suis venue dîner ici avec des amis dont une personne Vegan. Elle était absolument ravie du choix et du goût. Pour ma part pas la grande fan de pizza en général, j'ai trouvé la mienne délicieuse et cela m'a redonné envie d'en manger !!! Plus",
      "date": "2025-11-05",
      "author": "Ophelie Heck",
      "source": "google-direct"
    }
  ],
  "68": [
    {
      "id": "direct-0-1762327251793",
      "rating": 1,
      "comment": "26.08.25 Nous sommes déçus  Nous sommes en séjour dune semaine à Strasbourg et avons commandé via UberEats.  Plus",
      "date": "2025-11-05",
      "author": "Lucy Germanier",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762327251793",
      "rating": 1,
      "comment": "26.08.25 Nous sommes déçus  Nous sommes en séjour dune semaine à Strasbourg et avons commandé via UberEats.  Plus",
      "date": "2025-11-05",
      "author": "Lucy Germanier",
      "source": "google-direct"
    }
  ],
  "69": [
    {
      "id": "parsed-0-1762327295453",
      "rating": 4,
      "comment": "services_cb_v2_2_gm_grey_700.",
      "date": "2025-11-05",
      "author": "Client 1",
      "source": "parsed"
    }
  ],
  "70": [
    {
      "id": "direct-0-1762327316421",
      "rating": 1,
      "comment": "Commande passée ce soir sur Uber Eats pour un montant de 50 euros pour 2. En sachant ce que nous allions recevoir, on aurait mieux fait daller au restaurant !! Et dans un bon !!  Plus",
      "date": "2025-11-05",
      "author": "Mary P",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762327316421",
      "rating": 1,
      "comment": "Commande passée ce soir sur Uber Eats pour un montant de 50 euros pour 2. En sachant ce que nous allions recevoir, on aurait mieux fait daller au restaurant !! Et dans un bon !!  Plus",
      "date": "2025-11-05",
      "author": "Mary P",
      "source": "google-direct"
    }
  ],
  "71": [
    {
      "id": "direct-0-1762327336177",
      "rating": 5,
      "comment": "Le rendez du burger! Très bonne adresse pour manger un bon burger installé confortablemt. Bon rapport qualité prix.  Plus",
      "date": "2025-11-05",
      "author": "Sylvie Sylvie",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762327336177",
      "rating": 5,
      "comment": "Le rendez du burger! Très bonne adresse pour manger un bon burger installé confortablemt. Bon rapport qualité prix.  Plus",
      "date": "2025-11-05",
      "author": "Sylvie Sylvie",
      "source": "google-direct"
    }
  ],
  "72": [
    {
      "id": "direct-0-1762327357313",
      "rating": 5,
      "comment": "4eme fois dans ce restaurant, je nai jamais été déçue. Cest notre restaurant préféré de la ville avec mon copain. Les pizzas sont excellentes peu importe laquelle vous prenez. La pâte est aérienne et moelleuse, la garniture généreuse. En tant que végétarienne, je trouve toujours mon bonheur. Je recommande a 100 ! Plus",
      "date": "2025-11-05",
      "author": "capucine t",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762327357314",
      "rating": 5,
      "comment": "4eme fois dans ce restaurant, je nai jamais été déçue. Cest notre restaurant préféré de la ville avec mon copain. Les pizzas sont excellentes peu importe laquelle vous prenez. La pâte est aérienne et moelleuse, la garniture généreuse. En tant que végétarienne, je trouve toujours mon bonheur. Je recommande a 100 ! Plus",
      "date": "2025-11-05",
      "author": "capucine t",
      "source": "google-direct"
    }
  ],
  "74": [
    {
      "id": "direct-0-1762327379586",
      "rating": 1,
      "comment": "À savoir, jaurais aimé mettre 0 si cétait possible. Le 22 octobre 2025, je descendais dune correspondance et jai décidé daller commander quelque chose ici. À mon arrivée, exactement à 23 h 14, lensemble du  Plus",
      "date": "2025-11-05",
      "author": "Fournisseurs",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762327379586",
      "rating": 1,
      "comment": "À savoir, jaurais aimé mettre 0 si cétait possible. Le 22 octobre 2025, je descendais dune correspondance et jai décidé daller commander quelque chose ici. À mon arrivée, exactement à 23 h 14, lensemble du  Plus",
      "date": "2025-11-05",
      "author": "Fournisseurs",
      "source": "google-direct"
    },
    {
      "id": "direct-9-1762327379586",
      "rating": 1,
      "comment": "Bonjours , jai commandé wrap vegan il mon mis une une petit galette lsmtb la honte pour 9 Jv au kebab qui ce situe a 150 mètres Plus",
      "date": "2025-11-05",
      "author": "Niask Niasko",
      "source": "google-direct"
    }
  ],
  "75": [
    {
      "id": "parsed-0-1762327421678",
      "rating": 4,
      "comment": "services_cb_v2_2_gm_grey_700.",
      "date": "2025-11-05",
      "author": "Client 1",
      "source": "parsed"
    }
  ],
  "76": [
    {
      "id": "direct-0-1762327442351",
      "rating": 5,
      "comment": "Lieu très propre, avec du personnel très souriant et sympathique, et qui arrive à bien gérer le restaurant malgré toutes les commandes passées par Uber eats ou autre. Une troisième personne serait tout de même utile. Une carte énorme pour qu'il y en ai pour tous les goûts pour des prix plutôt raisonnables. Plus",
      "date": "2025-11-05",
      "author": "Ondine",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762327442351",
      "rating": 5,
      "comment": "Lieu très propre, avec du personnel très souriant et sympathique, et qui arrive à bien gérer le restaurant malgré toutes les commandes passées par Uber eats ou autre. Une troisième personne serait tout de même utile. Une carte énorme pour qu'il y en ai pour tous les goûts pour des prix plutôt raisonnables. Plus",
      "date": "2025-11-05",
      "author": "Ondine",
      "source": "google-direct"
    }
  ],
  "77": [
    {
      "id": "direct-0-1762327463386",
      "rating": 5,
      "comment": "Trop bon, j'ai pris le burger yonko et des frites de patates douces. Jai adoré ! Les plats étaient vraiment bons, les portions sont généreuses et la présentation originale. Jai trouvé super sympa que les plats soient servis dans des paniers vapeur en bambou, Je recommande vivement ! Plus",
      "date": "2025-11-05",
      "author": "Inès Derouin",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762327463386",
      "rating": 5,
      "comment": "Trop bon, j'ai pris le burger yonko et des frites de patates douces. Jai adoré ! Les plats étaient vraiment bons, les portions sont généreuses et la présentation originale. Jai trouvé super sympa que les plats soient servis dans des paniers vapeur en bambou, Je recommande vivement ! Plus",
      "date": "2025-11-05",
      "author": "Inès Derouin",
      "source": "google-direct"
    }
  ],
  "78": [
    {
      "id": "direct-0-1762327483409",
      "rating": 4,
      "comment": "En tous cas on se soucie de votre bien être, puisque j'ai répondu 5 fois que ça allait bien. J'ai pris une regina, un peu trop originale pour moi. La posse de petit pois est trop prononcé à mon goût et m'a dérangé. Le tiramisu est  Plus",
      "date": "2025-11-05",
      "author": "Pereira Carlos",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762327483409",
      "rating": 4,
      "comment": "En tous cas on se soucie de votre bien être, puisque j'ai répondu 5 fois que ça allait bien. J'ai pris une regina, un peu trop originale pour moi. La posse de petit pois est trop prononcé à mon goût et m'a dérangé. Le tiramisu est  Plus",
      "date": "2025-11-05",
      "author": "Pereira Carlos",
      "source": "google-direct"
    }
  ],
  "79": [
    {
      "id": "direct-0-1762327503147",
      "rating": 2,
      "comment": "Bon accueil. Je ne vous dirais pas, de ne pas y aller et ny dy aller. Cuisine asiatique en buffet, les entrées sont principalement surgelées, donc un  Plus",
      "date": "2025-11-05",
      "author": "Fabrice JURESIC",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762327503147",
      "rating": 2,
      "comment": "Bon accueil. Je ne vous dirais pas, de ne pas y aller et ny dy aller. Cuisine asiatique en buffet, les entrées sont principalement surgelées, donc un  Plus",
      "date": "2025-11-05",
      "author": "Fabrice JURESIC",
      "source": "google-direct"
    }
  ],
  "80": [
    {
      "id": "direct-0-1762327523049",
      "rating": 5,
      "comment": "Les tacos sont vraiment délicieux, bien garnis et pleins de saveurs. Le personnel est très sympathique et accueillant, toujours avec le sourire. Lambiance est agréable Je recommande à 100  Plus",
      "date": "2025-11-05",
      "author": "Myriam El Ghadraoui",
      "source": "google-direct"
    },
    {
      "id": "direct-1-1762327523049",
      "rating": 5,
      "comment": "Les tacos sont vraiment délicieux, bien garnis et pleins de saveurs. Le personnel est très sympathique et accueillant, toujours avec le sourire. Lambiance est agréable Je recommande à 100  Plus",
      "date": "2025-11-05",
      "author": "Myriam El Ghadraoui",
      "source": "google-direct"
    }
  ]
};

module.exports = {
  mockRestaurants,
  mockReviews,
  cities
};
