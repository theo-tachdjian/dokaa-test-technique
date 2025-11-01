'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { api, Restaurant, Review } from '@/lib/api';

export default function RestaurantDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [restaurantData, reviewsData] = await Promise.all([
          api.getRestaurant(id),
          api.getReviews(id)
        ]);
        setRestaurant(restaurantData);
        setReviews(reviewsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Restaurant introuvable'}</p>
          <Link href="/" className="text-primary-500 hover:underline">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-primary-500 hover:underline">
            ← Retour
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            <div className="relative w-full md:w-1/3 h-64 md:h-auto">
              <Image
                src={restaurant.imageUrl}
                alt={restaurant.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 md:w-2/3">
              <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
              <p className="text-gray-600 mb-4">{restaurant.address}</p>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-1">⭐</span>
                  <span className="font-semibold text-lg">{restaurant.rating}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  restaurant.status === 'open' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {restaurant.status === 'open' ? 'Ouvert' : 'Fermé'}
                </span>
                {restaurant.cuisine && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {restaurant.cuisine}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Avis ({reviews.length})</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Aucun avis disponible pour ce restaurant.
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-l-4 border-primary-500 pl-4 py-2">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                          >
                            ⭐
                          </span>
                        ))}
                        <span className="ml-2 font-semibold">{review.rating}/5</span>
                      </div>
                      <p className="text-sm text-gray-600">{review.author}</p>
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700 mt-2">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

