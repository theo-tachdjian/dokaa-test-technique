'use client';

import { useState, useEffect } from 'react';
import { api, Restaurant } from '@/lib/api';

export function useSearch(query: string) {
  const [results, setResults] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const searchTimer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      
      try {
        const restaurants = await api.searchRestaurants(query);
        setResults(restaurants);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300); // Debounce 300ms

    return () => clearTimeout(searchTimer);
  }, [query]);

  return { results, loading, error };
}

