import Link from 'next/link';
import Image from 'next/image';
import { Restaurant } from '@/lib/api';
import VerificationBadge from '@/components/ui/VerificationBadge';

interface RestaurantCardProps {
  restaurant: Restaurant;
  hasMultipleLocations?: boolean;
  city?: string;
}

export default function RestaurantCard({ restaurant, hasMultipleLocations = false, city }: RestaurantCardProps) {
  const href = hasMultipleLocations 
    ? `/restaurants/select/${encodeURIComponent(restaurant.name)}${city ? `?city=${encodeURIComponent(city)}` : ''}`
    : `/restaurants/${restaurant.id}`;
  
  return (
    <Link href={href}>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:scale-[1.02] border border-gray-100 group">
        <div className="relative w-full h-56 overflow-hidden">
          <Image
            src={restaurant.imageUrl || '/placeholder-restaurant.jpg'}
            alt={restaurant.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {restaurant.cuisine && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
              {restaurant.cuisine}
            </div>
          )}
          {hasMultipleLocations && (
            <div className="absolute top-3 left-3 bg-primary-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
              📍 Plusieurs emplacements
            </div>
          )}
          <div className="absolute bottom-3 left-3 right-3">
            {restaurant.distance && (
              <div className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium text-gray-700 shadow-md">
                <span>📍</span>
                <span>{restaurant.distance}</span>
              </div>
            )}
            {restaurant.deliveryTime && (
              <div className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium text-gray-700 shadow-md ml-2">
                <span>⏱️</span>
                <span>{restaurant.deliveryTime}</span>
              </div>
            )}
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors flex-1 pr-2 line-clamp-2">
              {restaurant.name}
            </h3>
            <VerificationBadge item={restaurant} size="sm" />
          </div>
          {restaurant.address && (
            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{restaurant.address}</p>
          )}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full">
                <span className="text-yellow-500 text-lg">⭐</span>
                <span className="font-bold text-gray-900">
                  {restaurant.rating ? restaurant.rating.toFixed(1) : 'N/A'}
                </span>
                {restaurant.ratingCount && (
                  <span className="text-gray-500 text-xs ml-1">
                    ({restaurant.ratingCount})
                  </span>
                )}
              </div>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
              restaurant.status === 'open' 
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
            }`}>
              {restaurant.status === 'open' ? '✓ Ouvert' : '✗ Fermé'}
            </span>
          </div>
          
          {/* Section des avis */}
          {restaurant.reviews && restaurant.reviews.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                  <span>💬</span>
                  <span>Derniers avis ({restaurant.reviews.length})</span>
                </h4>
              </div>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {restaurant.reviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-xs ${
                              i < review.rating
                                ? 'text-yellow-500'
                                : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      {review.author && (
                        <span className="text-xs text-gray-500 font-medium">
                          {review.author}
                        </span>
                      )}
                    </div>
                    {review.comment && (
                      <p className="text-xs text-gray-700 line-clamp-2 mt-1">
                        {review.comment}
                      </p>
                    )}
                    {review.date && (
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(review.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                ))}
                {restaurant.reviews.length > 3 && (
                  <p className="text-xs text-gray-500 text-center pt-1">
                    +{restaurant.reviews.length - 3} autre{restaurant.reviews.length - 3 > 1 ? 's' : ''} avis
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
