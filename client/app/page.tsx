'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/components/search/SearchBar';
import SearchResults from '@/components/search/SearchResults';
import CitySelector from '@/components/search/CitySelector';
import { useSearch } from '@/hooks/useSearch';
import { api } from '@/lib/api';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [allRestaurants, setAllRestaurants] = useState<any[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const { results, loading, error } = useSearch(searchQuery, selectedCity);

  // Charger la liste des villes au démarrage
  useEffect(() => {
    const loadCities = async () => {
      try {
        const citiesList = await api.getCities();
        setCities(citiesList);
      } catch (error) {
        console.error('Erreur chargement villes:', error);
      } finally {
        setLoadingCities(false);
      }
    };
    loadCities();
  }, []);

  // Charger les restaurants par ville quand la ville change
  useEffect(() => {
    const loadRestaurantsByCity = async () => {
      if (selectedCity && !searchQuery) {
        try {
          const restaurants = await api.getRestaurantsByCity(selectedCity);
          setAllRestaurants(restaurants);
        } catch (error) {
          console.error('Erreur chargement restaurants:', error);
        }
      } else {
        setAllRestaurants([]);
      }
    };
    loadRestaurantsByCity();
  }, [selectedCity, searchQuery]);

  // Afficher les résultats selon le contexte
  const displayResults = searchQuery ? results : allRestaurants;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Backoffice Deliveroo
          </h1>
          <p className="text-gray-600">
            Recherchez un restaurant et consultez ses avis
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!loadingCities && (
          <CitySelector
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
            cities={cities}
          />
        )}
        <SearchBar onSearch={setSearchQuery} loading={loading} />
        <SearchResults 
          results={displayResults} 
          loading={loading && searchQuery.length > 0} 
          error={error}
        />
        {!searchQuery && selectedCity && displayResults.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Chargement des restaurants de {selectedCity}...</p>
          </div>
        )}
      </div>
    </main>
  );
}

