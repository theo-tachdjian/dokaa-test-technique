import { Restaurant } from '@/lib/api';
import RestaurantCard from '@/components/restaurant/RestaurantCard';
import { groupRestaurantsByName, GroupedRestaurant } from '@/lib/restaurantUtils';

interface SearchResultsProps {
  results: Restaurant[];
  loading: boolean;
  error: string | null;
  selectedCity?: string;
  groupByName?: boolean;
}

export default function SearchResults({ results, loading, error, selectedCity, groupByName = false }: SearchResultsProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent mb-4"></div>
        <p className="text-gray-600 font-medium">Recherche en cours...</p>
      </div>
    );
  }

  if (error) {
    const isCloudflareError = error.includes('Cloudflare') || error.includes('Cookie');
    
    return (
      <div className="text-center py-12">
        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-8 max-w-md mx-auto shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-red-800 font-bold text-lg mb-2">Oups, une erreur s'est produite</p>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          {isCloudflareError ? (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-xs font-semibold mb-2">🔧 Solution :</p>
              <p className="text-yellow-700 text-xs">
                Le cookie Cloudflare est expiré. Dans le terminal du serveur, exécutez :
              </p>
              <code className="block mt-2 p-2 bg-yellow-100 rounded text-xs font-mono text-yellow-900">
                npm run update-cookie
              </code>
              <p className="text-yellow-600 text-xs mt-2">
                Puis redémarrez le serveur (Ctrl+C puis npm run dev)
              </p>
            </div>
          ) : (
            <p className="text-gray-600 text-xs">Vérifiez votre connexion ou réessayez dans quelques instants.</p>
          )}
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl p-8 max-w-md mx-auto shadow-lg">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-800 font-bold text-lg mb-2">Aucun restaurant trouvé</p>
          <p className="text-gray-600 text-sm">Essayez une autre ville ou un autre mot-clé.</p>
        </div>
      </div>
    );
  }

  const displayItems = groupByName 
    ? groupRestaurantsByName(results, true) 
    : results.map(r => ({ displayRestaurant: r, count: 1, restaurants: [r] } as GroupedRestaurant));

  return (
    <div className="mt-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-900">{displayItems.length}</span>
          <span className="text-gray-600 font-medium">
            restaurant{displayItems.length > 1 ? 's' : ''} unique{displayItems.length > 1 ? 's' : ''}
          </span>
          {groupByName && results.length > displayItems.length && (
            <span className="text-gray-500 text-sm">
              ({results.length} emplacements au total)
            </span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayItems.map((item) => {
          const restaurant = item.displayRestaurant;
          const hasMultiple = item.count > 1;
          
          return (
            <div key={restaurant.id} className="relative">
              <RestaurantCard 
                restaurant={restaurant} 
                hasMultipleLocations={hasMultiple}
                city={selectedCity}
              />
              {hasMultiple && (
                <div className="absolute top-3 left-3 bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                  {item.count} emplacements
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
