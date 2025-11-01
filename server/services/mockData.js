// Données mockées pour le développement
// À remplacer par le scraping plus tard

const mockRestaurants = [
  {
    id: '1',
    name: 'Restaurant Italien',
    slug: 'restaurant-italien',
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
    address: '42 Avenue des Champs-Élysées, 75008 Paris',
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    cuisine: 'Japonaise',
    status: 'open',
    url: 'https://deliveroo.fr/fr/restaurants/paris/sushi-express'
  },
  {
    id: '3',
    name: 'Burger House',
    slug: 'burger-house',
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
    address: '22 Boulevard Saint-Germain, 75005 Paris',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    cuisine: 'Française',
    status: 'closed',
    url: 'https://deliveroo.fr/fr/restaurants/paris/la-brasserie'
  }
];

const mockReviews = {
  '1': [
    {
      id: '1-1',
      rating: 5,
      comment: 'Excellent restaurant ! Les pâtes sont délicieuses et le service est top.',
      date: '2024-01-15',
      author: 'Marie D.'
    },
    {
      id: '1-2',
      rating: 4,
      comment: 'Très bon, juste un peu long à arriver mais ça valait le coup.',
      date: '2024-01-12',
      author: 'Pierre M.'
    },
    {
      id: '1-3',
      rating: 5,
      comment: 'Parfait ! Je recommande à 100%.',
      date: '2024-01-10',
      author: 'Sophie L.'
    },
    {
      id: '1-4',
      rating: 4,
      comment: 'Bon rapport qualité/prix, je reviendrai.',
      date: '2024-01-08',
      author: 'Thomas R.'
    },
    {
      id: '1-5',
      rating: 3,
      comment: 'Correct mais rien d\'exceptionnel.',
      date: '2024-01-05',
      author: 'Julie K.'
    },
    {
      id: '1-6',
      rating: 5,
      comment: 'Excellent ! Les portions sont généreuses.',
      date: '2024-01-03',
      author: 'Marc T.'
    },
    {
      id: '1-7',
      rating: 4,
      comment: 'Très bon, je recommande.',
      date: '2024-01-01',
      author: 'Laura B.'
    },
    {
      id: '1-8',
      rating: 5,
      comment: 'Parfait à tous les niveaux !',
      date: '2023-12-28',
      author: 'Nicolas P.'
    },
    {
      id: '1-9',
      rating: 4,
      comment: 'Bon restaurant, service rapide.',
      date: '2023-12-25',
      author: 'Emma S.'
    },
    {
      id: '1-10',
      rating: 4,
      comment: 'Très satisfait, je reviendrai.',
      date: '2023-12-22',
      author: 'David M.'
    }
  ],
  '2': [
    {
      id: '2-1',
      rating: 5,
      comment: 'Sushis frais et délicieux !',
      date: '2024-01-14',
      author: 'Paul L.'
    },
    {
      id: '2-2',
      rating: 4,
      comment: 'Très bon, juste un peu cher.',
      date: '2024-01-11',
      author: 'Claire D.'
    },
    {
      id: '2-3',
      rating: 5,
      comment: 'Excellent, je recommande vivement.',
      date: '2024-01-09',
      author: 'Antoine F.'
    },
    {
      id: '2-4',
      rating: 4,
      comment: 'Bon restaurant japonais.',
      date: '2024-01-07',
      author: 'Sarah M.'
    },
    {
      id: '2-5',
      rating: 3,
      comment: 'Correct mais peut mieux faire.',
      date: '2024-01-04',
      author: 'Luc R.'
    }
  ],
  '3': [
    {
      id: '3-1',
      rating: 5,
      comment: 'Meilleurs burgers de Paris !',
      date: '2024-01-13',
      author: 'Maxime G.'
    },
    {
      id: '3-2',
      rating: 5,
      comment: 'Excellent, je reviendrai !',
      date: '2024-01-10',
      author: 'Camille H.'
    },
    {
      id: '3-3',
      rating: 4,
      comment: 'Très bon burger, frites top.',
      date: '2024-01-08',
      author: 'Alexis C.'
    }
  ],
  '4': [
    {
      id: '4-1',
      rating: 4,
      comment: 'Bonne brasserie classique.',
      date: '2024-01-06',
      author: 'Julien V.'
    },
    {
      id: '4-2',
      rating: 3,
      comment: 'Correct mais service un peu lent.',
      date: '2024-01-02',
      author: 'Céline N.'
    }
  ]
};

module.exports = {
  mockRestaurants,
  mockReviews
};

