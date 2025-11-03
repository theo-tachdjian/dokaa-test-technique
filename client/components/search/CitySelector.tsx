'use client';

interface CitySelectorProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  cities: string[];
}

export default function CitySelector({ selectedCity, onCityChange, cities }: CitySelectorProps) {
  return (
    <div className="w-full max-w-xs mx-auto mb-6">
      <label htmlFor="city-select" className="block text-sm font-medium text-gray-700 mb-2">
        Choisir une ville
      </label>
      <select
        id="city-select"
        value={selectedCity}
        onChange={(e) => onCityChange(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
      >
        <option value="">Toutes les villes</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
    </div>
  );
}

