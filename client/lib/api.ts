const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  address: string;
  rating: number;
  imageUrl: string;
  cuisine?: string;
  status: 'open' | 'closed';
  url: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  date: string;
  author: string;
}

export const api = {
  async searchRestaurants(query: string): Promise<Restaurant[]> {
    const response = await fetch(`${API_URL}/api/restaurants/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Erreur lors de la recherche');
    return response.json();
  },

  async getRestaurant(id: string): Promise<Restaurant> {
    const response = await fetch(`${API_URL}/api/restaurants/${id}`);
    if (!response.ok) throw new Error('Restaurant introuvable');
    return response.json();
  },

  async getReviews(id: string): Promise<Review[]> {
    const response = await fetch(`${API_URL}/api/restaurants/${id}/reviews`);
    if (!response.ok) throw new Error('Impossible de récupérer les avis');
    return response.json();
  }
};

