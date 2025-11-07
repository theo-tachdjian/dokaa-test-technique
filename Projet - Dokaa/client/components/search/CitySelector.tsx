'use client';

interface CitySelectorProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  cities: string[];
}

export default function CitySelector({ selectedCity, onCityChange, cities }: CitySelectorProps) {
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <label htmlFor="city-select" className="block text-sm font-semibold text-gray-700 mb-3 text-center">
        📍 Choisir une ville
      </label>
      <div className="relative">
        <select
          id="city-select"
          value={selectedCity}
          onChange={(e) => onCityChange(e.target.value)}
          className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white shadow-md hover:shadow-lg transition-all duration-200 text-gray-700 font-medium appearance-none cursor-pointer"
        >
          <option value="">🌍 Toutes les villes</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
