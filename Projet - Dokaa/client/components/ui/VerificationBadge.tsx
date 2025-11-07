import { Restaurant, Review } from '@/lib/api';

interface VerificationBadgeProps {
  item: Restaurant | Review;
  size?: 'sm' | 'md' | 'lg';
}

export default function VerificationBadge({ item, size = 'md' }: VerificationBadgeProps) {
  if (!item._validation) {
    return null;
  }

  const validation = item._validation;
  
  if ('address' in item) {
    const restaurant = item as Restaurant;
    const reliabilityScore = validation.reliabilityScore || 0;
    const isVerified = !validation.needsVerification && reliabilityScore >= 80;
    const hasDeliverooUrl = validation.verified?.deliverooUrl;

    const sizeClasses = {
      sm: 'text-xs px-2 py-0.5',
      md: 'text-sm px-2.5 py-1',
      lg: 'text-base px-3 py-1.5'
    };

    if (isVerified && hasDeliverooUrl) {
      return (
        <div className="flex items-center gap-1">
          <span className={`inline-flex items-center gap-1 bg-green-100 text-green-700 rounded-full font-medium ${sizeClasses[size]}`}>
            <span>✓</span>
            <span>Vérifié Deliveroo</span>
          </span>
          {reliabilityScore >= 90 && (
            <span className={`inline-flex items-center bg-blue-100 text-blue-700 rounded-full font-medium ${sizeClasses[size]}`}>
              {reliabilityScore}% fiable
            </span>
          )}
        </div>
      );
    }

    if (validation.needsVerification) {
      return (
        <span className={`inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 rounded-full font-medium ${sizeClasses[size]}`}>
          <span>⚠</span>
          <span>À vérifier</span>
        </span>
      );
    }

    if (reliabilityScore < 80) {
      return (
        <span className={`inline-flex items-center gap-1 bg-orange-100 text-orange-700 rounded-full font-medium ${sizeClasses[size]}`}>
          <span>!</span>
          <span>Fiabilité: {reliabilityScore}%</span>
        </span>
      );
    }
  }

  if ('source' in validation && validation.source) {
    const source = validation.source;
    const sourceLabels = {
      deliveroo: 'Deliveroo',
      google: 'Google',
      tripadvisor: 'TripAdvisor',
      unknown: 'Source inconnue'
    };

    const sourceColors = {
      deliveroo: 'bg-purple-100 text-purple-700',
      google: 'bg-blue-100 text-blue-700',
      tripadvisor: 'bg-green-100 text-green-700',
      unknown: 'bg-gray-100 text-gray-700'
    };

    const sizeClasses = {
      sm: 'text-xs px-2 py-0.5',
      md: 'text-sm px-2.5 py-1',
      lg: 'text-base px-3 py-1.5'
    };

    return (
      <span className={`inline-flex items-center gap-1 rounded-full font-medium ${sourceColors[source]} ${sizeClasses[size]}`}>
        {source === 'deliveroo' && '✓'}
        <span>{sourceLabels[source]}</span>
      </span>
    );
  }

  return null;
}
