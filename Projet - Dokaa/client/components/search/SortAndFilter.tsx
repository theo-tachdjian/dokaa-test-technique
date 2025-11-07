'use client';

import { useState } from 'react';
import { Restaurant } from '@/lib/api';

export type SortOption = 'rating-desc' | 'rating-asc' | 'name-asc' | 'name-desc';
export type FilterOption = 'all' | 'open' | 'closed';

interface SortAndFilterProps {
  restaurants: Restaurant[];
  onFilteredChange: (filtered: Restaurant[]) => void;
}

export default function SortAndFilter({ restaurants, onFilteredChange }: SortAndFilterProps) {
  const [sortBy, setSortBy] = useState<SortOption>('rating-desc');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [minRating, setMinRating] = useState<number>(0);

  const applyFiltersAndSort = (newSort?: SortOption, newFilter?: FilterOption, newMinRating?: number) => {
    const currentSort = newSort ?? sortBy;
    const currentFilter = newFilter ?? filterBy;
    const currentMinRating = newMinRating ?? minRating;

    let filtered = [...restaurants];

    if (currentFilter === 'open') {
      filtered = filtered.filter(r => r.status === 'open');
    } else if (currentFilter === 'closed') {
      filtered = filtered.filter(r => r.status === 'closed');
    }

    if (currentMinRating > 0) {
      filtered = filtered.filter(r => r.rating >= currentMinRating);
    }

    filtered.sort((a, b) => {
      switch (currentSort) {
        case 'rating-desc':
          return b.rating - a.rating;
        case 'rating-asc':
          return a.rating - b.rating;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    onFilteredChange(filtered);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value as SortOption;
    setSortBy(newSort);
    applyFiltersAndSort(newSort);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = e.target.value as FilterOption;
    setFilterBy(newFilter);
    applyFiltersAndSort(undefined, newFilter);
  };

  const handleMinRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinRating = parseFloat(e.target.value);
    setMinRating(newMinRating);
    applyFiltersAndSort(undefined, undefined, newMinRating);
  };

  if (restaurants.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-1">
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
            Trier par
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={handleSortChange}
            className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="rating-desc">Note (décroissante)</option>
            <option value="rating-asc">Note (croissante)</option>
            <option value="name-asc">Nom (A-Z)</option>
            <option value="name-desc">Nom (Z-A)</option>
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
            Statut
          </label>
          <select
            id="filter"
            value={filterBy}
            onChange={handleFilterChange}
            className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Tous</option>
            <option value="open">Ouverts uniquement</option>
            <option value="closed">Fermés uniquement</option>
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="minRating" className="block text-sm font-medium text-gray-700 mb-1">
            Note minimum : {minRating.toFixed(1)} ⭐
          </label>
          <input
            id="minRating"
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={minRating}
            onChange={handleMinRatingChange}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
