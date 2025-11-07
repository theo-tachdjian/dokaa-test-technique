'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { api, Restaurant } from '@/lib/api';
import { normalizeRestaurantName } from '@/lib/restaurantUtils';

export default function RestaurantLocationSelectorPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const restaurantName = decodeURIComponent(params.name as string);
  const city = searchParams.get('city') || '';
  
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [matchingRestaurants, setMatchingRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        let restaurants: Restaurant[] = [];
        
        if (city && city !== 'Toutes les villes') {
          restaurants = await api.getRestaurantsByCity(city);
        } else {
          restaurants = await api.getAllRestaurants();
        }
        
        setAllRestaurants(restaurants);
        
        const normalizedName = normalizeRestaurantName(restaurantName);
        const matching = restaurants.filter(r => 
          normalizeRestaurantName(r.name) === normalizedName
        );
        
        setMatchingRestaurants(matching);
        
        if (matching.length === 0) {
          setError('Aucun restaurant trouvé avec ce nom');
        } else if (matching.length === 1) {
          router.push(`/restaurants/${matching[0].id}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    if (restaurantName) {
      fetchRestaurants();
    }
  }, [restaurantName, city, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || matchingRestaurants.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Restaurant introuvable</h2>
          <p className="text-gray-600 mb-6">{error || 'Aucun restaurant trouvé avec ce nom.'}</p>
          <Link 
            href="/" 
            className="inline-block bg-primary-500 text-white px-6 py-3 rounded-xl hover:bg-primary-600 transition-colors font-medium"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/" className="text-white hover:text-primary-100 mb-4 inline-block">
            ← Retour
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            {restaurantName}
          </h1>
          <p className="text-primary-50 text-lg">
            {matchingRestaurants.length} emplacement{matchingRestaurants.length > 1 ? 's' : ''} disponible{matchingRestaurants.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matchingRestaurants.map((restaurant) => (
            <Link 
              key={restaurant.id} 
              href={`/restaurants/${restaurant.id}`}
              className="block"
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:scale-[1.02] border border-gray-100 group">
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={restaurant.imageUrl || '/placeholder-restaurant.jpg'}
                    alt={restaurant.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {restaurant.city || 'Emplacement'}
                    </h3>
                    {restaurant.distance && (
                      <span className="text-sm text-gray-500">📍 {restaurant.distance}</span>
                    )}
                  </div>
                  {restaurant.address && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{restaurant.address}</p>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      {restaurant.rating && (
                        <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full">
                          <span className="text-yellow-500">⭐</span>
                          <span className="font-bold text-gray-900">
                            {restaurant.rating.toFixed(1)}
                          </span>
                          {restaurant.ratingCount && (
                            <span className="text-gray-500 text-xs ml-1">
                              ({restaurant.ratingCount})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {restaurant.deliveryTime && (
                      <span className="text-sm text-gray-600">⏱️ {restaurant.deliveryTime}</span>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-primary-600 font-medium text-sm group-hover:text-primary-700">
                      Voir les avis →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
