import { Review } from '@/lib/api';

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
    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-primary-500">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center mb-1">
            {renderStars(review.rating)}
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
  );
}

