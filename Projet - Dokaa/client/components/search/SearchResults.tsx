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
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-red-600 text-2xl mb-2">⚠️</div>
          <p className="text-red-800 font-medium mb-1">Oups, une erreur s'est produite</p>
          <p className="text-red-600 text-sm">{error}</p>
          <p className="text-gray-500 text-xs mt-3">Vérifiez votre connexion ou réessayez dans quelques instants.</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-gray-700 font-medium mb-1">Aucun restaurant trouvé</p>
          <p className="text-gray-500 text-sm">Essayez une autre ville ou un autre mot-clé.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="mb-4 text-gray-600">
        <span className="font-medium">{results.length}</span> restaurant{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
}

