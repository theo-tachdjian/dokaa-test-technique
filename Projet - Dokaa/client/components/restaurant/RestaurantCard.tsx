import Link from 'next/link';
import Image from 'next/image';
import { Restaurant } from '@/lib/api';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurants/${restaurant.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative w-full h-48">
          <Image
            src={restaurant.imageUrl}
            alt={restaurant.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{restaurant.address}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">⭐</span>
              <span className="font-medium">{restaurant.rating}</span>
            </div>
            <span className={`px-2 py-1 rounded text-sm ${
              restaurant.status === 'open' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {restaurant.status === 'open' ? 'Ouvert' : 'Fermé'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

