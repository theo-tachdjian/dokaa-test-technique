'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/components/search/SearchBar';
import SearchResults from '@/components/search/SearchResults';
import CitySelector from '@/components/search/CitySelector';
import SortAndFilter from '@/components/search/SortAndFilter';
import { useSearch } from '@/hooks/useSearch';
import { api, Restaurant } from '@/lib/api';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);
  const [restaurantError, setRestaurantError] = useState<string | null>(null);
  
  const cityForSearch = selectedCity && selectedCity !== '' && selectedCity !== 'Toutes les villes' ? selectedCity : undefined;
  const { results: searchResults, loading: searchLoading, error: searchError } = useSearch(searchQuery, cityForSearch);
  
  const [filteredResults, setFilteredResults] = useState<Restaurant[]>([]);
  
  const isSearching = searchQuery.trim().length >= 2;
  const sourceResults = isSearching ? searchResults : allRestaurants;
  const isLoading = isSearching ? searchLoading : loadingRestaurants;
  const hasError = searchError || restaurantError;
  
  useEffect(() => {
    setFilteredResults(sourceResults);
  }, [sourceResults]);

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

  useEffect(() => {
    if (loadingCities) return;
    
    if (isSearching) return;
    
    if (!selectedCity || selectedCity === '') return;
    
    const loadRestaurantsByCity = async () => {
      console.log(`🔄 Chargement restaurants pour: ${selectedCity}`);
      setLoadingRestaurants(true);
      setRestaurantError(null);
      
      try {
        let restaurants: Restaurant[] = [];
        
        if (selectedCity === 'Toutes les villes') {
          console.log('📋 Chargement de tous les restaurants...');
          restaurants = await api.getAllRestaurants();
        } else {
          console.log(`📋 Chargement restaurants pour ${selectedCity}...`);
          restaurants = await api.getRestaurantsByCity(selectedCity);
        }
        
        console.log(`✅ ${restaurants.length} restaurants chargés`);
        setAllRestaurants(restaurants);
        setFilteredResults(restaurants); 
      } catch (error) {
        console.error('❌ Erreur chargement restaurants:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        setRestaurantError(errorMessage);
        setAllRestaurants([]);
        setFilteredResults([]);
      } finally {
        setLoadingRestaurants(false);
      }
    };
    
    loadRestaurantsByCity();
  }, [selectedCity, loadingCities, isSearching]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 drop-shadow-lg">
              🍽️ Backoffice Deliveroo
            </h1>
            <p className="text-xl text-primary-50 font-medium">
              Recherchez un restaurant et consultez ses avis
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8">
        {!loadingCities && (
          <CitySelector
            selectedCity={selectedCity}
            onCityChange={(city) => {
              setSelectedCity(city);
              setSearchQuery(''); 
            }}
            cities={cities}
          />
        )}
        <SearchBar 
          onSearch={setSearchQuery} 
          loading={searchLoading}
          disabled={!selectedCity || selectedCity === '' || selectedCity === 'Toutes les villes'}
          disabledMessage="📍 Veuillez d'abord sélectionner une ville"
        />
        
        {filteredResults.length > 0 && (
          <SortAndFilter 
            restaurants={sourceResults}
            onFilteredChange={setFilteredResults}
          />
        )}
        
        <SearchResults 
          results={filteredResults} 
          loading={isLoading && filteredResults.length === 0}
          error={hasError}
          selectedCity={selectedCity}
          groupByName={!isSearching && !!selectedCity && selectedCity !== '' && selectedCity !== 'Toutes les villes'}
        />
        
        {!isSearching && filteredResults.length === 0 && isLoading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium text-lg">
              {selectedCity 
                ? `Chargement des restaurants de ${selectedCity}...` 
                : 'Chargement de tous les restaurants...'}
            </p>
          </div>
        )}
        
        {!isSearching && filteredResults.length === 0 && !isLoading && !hasError && selectedCity && selectedCity !== '' && selectedCity !== 'Toutes les villes' && (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl p-8 max-w-md mx-auto shadow-lg">
              <div className="text-5xl mb-4">🍽️</div>
              <p className="text-gray-800 font-bold text-lg mb-2">Aucun restaurant trouvé</p>
              <p className="text-gray-600 text-sm mb-4">Essayez une autre ville.</p>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-xs">
                  💡 Si le problème persiste, vérifiez les logs du serveur. Le cookie Cloudflare peut être expiré.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {!isSearching && (!selectedCity || selectedCity === '' || selectedCity === 'Toutes les villes') && !loadingCities && (
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200 rounded-2xl p-8 max-w-md mx-auto shadow-lg">
              <div className="text-5xl mb-4">📍</div>
              <p className="text-primary-800 font-bold text-lg mb-2">Choisissez une ville</p>
              <p className="text-primary-600">Sélectionnez une ville ci-dessus pour voir les restaurants disponibles</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
