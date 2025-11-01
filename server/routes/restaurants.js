const express = require('express');
const router = express.Router();
const { mockRestaurants, mockReviews } = require('../services/mockData');

// Recherche de restaurants
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Le paramètre de recherche "q" est requis' 
      });
    }

    // Pour l'instant, recherche simple dans les données mockées
    // Plus tard, ça sera du scraping
    const searchTerm = q.toLowerCase().trim();
    const results = mockRestaurants.filter(restaurant => 
      restaurant.name.toLowerCase().includes(searchTerm) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm) ||
      restaurant.address.toLowerCase().includes(searchTerm)
    );

    res.json(results);
  } catch (error) {
    console.error('Erreur recherche:', error);
    res.status(500).json({ error: 'Erreur lors de la recherche' });
  }
});

// Détails d'un restaurant
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = mockRestaurants.find(r => r.id === id);
    
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant introuvable' });
    }

    res.json(restaurant);
  } catch (error) {
    console.error('Erreur récupération restaurant:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Avis d'un restaurant
router.get('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = mockReviews[id] || [];
    
    // Retourner les 10 derniers (déjà triés par date décroissante)
    const last10Reviews = reviews.slice(0, 10);

    res.json(last10Reviews);
  } catch (error) {
    console.error('Erreur récupération avis:', error);
    res.status(500).json({ 
      error: 'Impossible de récupérer les avis',
      details: error.message 
    });
  }
});

module.exports = router;

