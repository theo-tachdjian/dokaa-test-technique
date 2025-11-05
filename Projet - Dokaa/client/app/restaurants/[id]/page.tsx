'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { api, Restaurant, Review } from '@/lib/api';
import ReviewsList from '@/components/reviews/ReviewsList';
import VerificationBadge from '@/components/ui/VerificationBadge';
import ReliabilityInfo from '@/components/ui/ReliabilityInfo';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-lg shadow-md p-8 max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error ? 'Erreur de chargement' : 'Restaurant introuvable'}
          </h2>
          <p className="text-gray-600 mb-6">{error || 'Le restaurant que vous recherchez n\'existe pas ou a été supprimé.'}</p>
          <Link 
            href="/" 
            className="inline-block bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
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
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold">{restaurant.name}</h1>
                <VerificationBadge item={restaurant} size="md" />
              </div>
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
            <ReliabilityInfo restaurant={restaurant} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <ReviewsList reviews={reviews} loading={loading} />
        </div>
      </div>
    </div>
  );
}

