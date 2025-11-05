import Link from 'next/link';
import Image from 'next/image';
import { Restaurant } from '@/lib/api';
import VerificationBadge from '@/components/ui/VerificationBadge';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurants/${restaurant.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
        <div className="relative w-full h-48">
          <Image
            src={restaurant.imageUrl}
            alt={restaurant.name}
            fill
            className="object-cover"
          />
          {restaurant.cuisine && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-medium">
              {restaurant.cuisine}
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors flex-1">
              {restaurant.name}
            </h3>
            <VerificationBadge item={restaurant} size="sm" />
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{restaurant.address}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 text-lg">⭐</span>
              <span className="font-semibold text-gray-900">{restaurant.rating.toFixed(1)}</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              restaurant.status === 'open' 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {restaurant.status === 'open' ? 'Ouvert' : 'Fermé'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

