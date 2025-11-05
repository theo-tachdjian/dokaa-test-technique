'use client';

import { useState } from 'react';
import { Restaurant } from '@/lib/api';

interface ReliabilityInfoProps {
  restaurant: Restaurant;
}

export default function ReliabilityInfo({ restaurant }: ReliabilityInfoProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!restaurant._validation) {
    return null;
  }

  const validation = restaurant._validation;
  const reliabilityScore = validation.reliabilityScore || 0;

  if (reliabilityScore >= 90 && !validation.needsVerification) {
    return null; 
  }

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
      >
        <span>ℹ️</span>
        <span>Informations de fiabilité</span>
        <span className="ml-1">{isOpen ? '▼' : '▶'}</span>
      </button>

      {isOpen && (
        <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Score de fiabilité</span>
              <span className={`text-sm font-semibold ${
                reliabilityScore >= 90 ? 'text-green-600' :
                reliabilityScore >= 70 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {reliabilityScore}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  reliabilityScore >= 90 ? 'bg-green-500' :
                  reliabilityScore >= 70 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${reliabilityScore}%` }}
              />
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700">Vérifications :</span>
              <ul className="mt-1 space-y-1">
                <li className={`flex items-center gap-2 ${validation.verified?.deliverooUrl ? 'text-green-600' : 'text-red-600'}`}>
                  {validation.verified?.deliverooUrl ? '✓' : '✗'} URL Deliveroo valide
                </li>
                <li className={`flex items-center gap-2 ${validation.verified?.address ? 'text-green-600' : 'text-red-600'}`}>
                  {validation.verified?.address ? '✓' : '✗'} Adresse valide
                </li>
                <li className={`flex items-center gap-2 ${validation.verified?.rating ? 'text-green-600' : 'text-orange-600'}`}>
                  {validation.verified?.rating ? '✓' : '⚠'} Note disponible
                </li>
                <li className={`flex items-center gap-2 ${validation.verified?.image ? 'text-green-600' : 'text-orange-600'}`}>
                  {validation.verified?.image ? '✓' : '⚠'} Image disponible
                </li>
              </ul>
            </div>

            {validation.warnings && validation.warnings.length > 0 && (
              <div className="mt-3">
                <span className="font-medium text-orange-700">Avertissements :</span>
                <ul className="mt-1 space-y-1">
                  {validation.warnings.map((warning, index) => (
                    <li key={index} className="text-orange-600 text-xs">• {warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {validation.errors && validation.errors.length > 0 && (
              <div className="mt-3">
                <span className="font-medium text-red-700">Erreurs :</span>
                <ul className="mt-1 space-y-1">
                  {validation.errors.map((error, index) => (
                    <li key={index} className="text-red-600 text-xs">• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {validation.needsVerification && (
              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-xs text-yellow-800">
                  ⚠ Ce restaurant nécessite une vérification manuelle avant utilisation.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

