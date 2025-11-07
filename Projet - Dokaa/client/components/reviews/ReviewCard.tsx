import { Review } from '@/lib/api';
import VerificationBadge from '@/components/ui/VerificationBadge';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
      >
        ⭐
      </span>
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-5 border-l-4 border-primary-500">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex">{renderStars(review.rating)}</div>
            <span className="font-semibold text-gray-900">{review.rating.toFixed(1)}/5</span>
            <VerificationBadge item={review} size="sm" />
          </div>
          <p className="text-sm font-medium text-gray-700">{review.author}</p>
        </div>
        <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{review.date}</span>
      </div>
      {review.comment && (
        <p className="text-gray-700 mt-3 leading-relaxed">{review.comment}</p>
      )}
    </div>
  );
}
