import { Review } from '@/lib/api';
import ReviewCard from './ReviewCard';

interface ReviewsListProps {
  reviews: Review[];
  loading?: boolean;
  error?: string | null;
}

export default function ReviewsList({ reviews, loading, error }: ReviewsListProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    const isCloudflareError = error.includes('Cloudflare') || error.includes('Cookie');
    
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 max-w-md mx-auto">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-800 font-medium mb-2">Erreur lors du chargement des avis</p>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          {isCloudflareError && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-xs font-semibold mb-1">🔧 Solution :</p>
              <p className="text-yellow-700 text-xs">
                Le cookie Cloudflare est expiré. Dans le terminal du serveur :
              </p>
              <code className="block mt-2 p-2 bg-yellow-100 rounded text-xs font-mono text-yellow-900">
                npm run update-cookie
              </code>
              <p className="text-yellow-600 text-xs mt-2">
                Puis redémarrez le serveur (Ctrl+C puis npm run dev)
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
          <div className="text-gray-400 text-4xl mb-4">💬</div>
          <p className="text-gray-700 font-medium mb-2">Aucun avis disponible</p>
          <p className="text-gray-500 text-sm">Ce restaurant n'a pas encore d'avis pour l'instant.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Avis clients</h2>
        <span className="text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-full">
          {reviews.length} {reviews.length === 1 ? 'avis' : 'avis'}
        </span>
      </div>
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
