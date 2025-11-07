const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ValidationMetadata {
  reliabilityScore?: number;
  verified?: {
    address?: boolean;
    deliverooUrl?: boolean;
    rating?: boolean;
    image?: boolean;
  };
  needsVerification?: boolean;
  warnings?: string[];
  errors?: string[];
  source?: 'deliveroo' | 'google' | 'tripadvisor' | 'unknown';
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  city: string;
  address: string;
  rating: number;
  imageUrl: string;
  cuisine?: string;
  status: 'open' | 'closed';
  url: string;
  partner_drn_id?: string;
  reviews?: Review[];
  _validation?: ValidationMetadata;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  date: string;
  author: string;
  _validation?: ValidationMetadata;
}

export const api = {
  async getCities(): Promise<string[]> {
    const response = await fetch(`${API_URL}/api/restaurants/cities`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des villes');
    return response.json();
  },

  async searchRestaurants(query: string, city?: string): Promise<Restaurant[]> {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (city) params.append('city', city);
    const response = await fetch(`${API_URL}/api/restaurants/search?${params.toString()}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 503) {
        const minutes = errorData.retryAfter || '15';
        throw new Error(`Service temporairement indisponible. Rate limiting actif. Réessayez dans ${minutes} minute(s).`);
      }
      if (errorData.details?.includes('Cloudflare') || errorData.details?.includes('Cookie')) {
        throw new Error('Cookie Cloudflare expiré. Le serveur doit être mis à jour.');
      }
      throw new Error(errorData.error || errorData.details || 'Erreur lors de la recherche');
    }
    return response.json();
  },

  async getRestaurantsByCity(city: string): Promise<Restaurant[]> {
    const response = await fetch(`${API_URL}/api/restaurants/city/${encodeURIComponent(city)}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 503) {
        const minutes = errorData.retryAfter || '15';
        throw new Error(`Service temporairement indisponible. Rate limiting actif. Réessayez dans ${minutes} minute(s).`);
      }
      if (errorData.details?.includes('Cloudflare') || errorData.details?.includes('Cookie')) {
        throw new Error('Cookie Cloudflare expiré. Le serveur doit être mis à jour.');
      }
      throw new Error(errorData.error || errorData.details || 'Erreur lors de la récupération');
    }
    return response.json();
  },

  async getAllRestaurants(): Promise<Restaurant[]> {
    const response = await fetch(`${API_URL}/api/restaurants/all`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 503) {
        const minutes = errorData.retryAfter || '15';
        throw new Error(`Service temporairement indisponible. Rate limiting actif. Réessayez dans ${minutes} minute(s).`);
      }
      if (errorData.details?.includes('Cloudflare') || errorData.details?.includes('Cookie')) {
        throw new Error('Cookie Cloudflare expiré. Le serveur doit être mis à jour.');
      }
      throw new Error(errorData.error || errorData.details || 'Erreur lors de la récupération de tous les restaurants');
    }
    return response.json();
  },

  async getRestaurant(id: string): Promise<Restaurant> {
    const response = await fetch(`${API_URL}/api/restaurants/${id}`);
    if (!response.ok) throw new Error('Restaurant introuvable');
    return response.json();
  },

  async getReviews(id: string, bypassCircuitBreaker = false): Promise<Review[]> {
    const url = bypassCircuitBreaker 
      ? `${API_URL}/api/restaurants/${id}/reviews?bypass=true`
      : `${API_URL}/api/restaurants/${id}/reviews`;
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 503 && !bypassCircuitBreaker) {
        console.log('⚠️ Circuit breaker actif, tentative avec bypass...');
        return this.getReviews(id, true);
      }
      
      if (response.status === 503) {
        const minutes = errorData.retryAfter || '15';
        throw new Error(`Service temporairement indisponible. Rate limiting actif. Réessayez dans ${minutes} minute(s).`);
      }
      if (errorData.details?.includes('Cloudflare') || errorData.details?.includes('Cookie')) {
        throw new Error('Cookie Cloudflare expiré. Le serveur doit être mis à jour.');
      }
      throw new Error(errorData.error || errorData.details || 'Impossible de récupérer les avis');
    }
    return response.json();
  }
};
