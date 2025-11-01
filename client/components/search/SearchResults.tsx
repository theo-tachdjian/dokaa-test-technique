import { Restaurant } from '@/lib/api';
import RestaurantCard from '@/components/restaurant/RestaurantCard';

interface SearchResultsProps {
  results: Restaurant[];
  loading: boolean;
  error: string | null;
}

export default function SearchResults({ results, loading, error }: SearchResultsProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Erreur : {error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun restaurant trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {results.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
}

