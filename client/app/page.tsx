'use client';

import { useState } from 'react';
import SearchBar from '@/components/search/SearchBar';
import SearchResults from '@/components/search/SearchResults';
import { useSearch } from '@/hooks/useSearch';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const { results, loading, error } = useSearch(searchQuery);

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
        <SearchBar onSearch={setSearchQuery} loading={loading} />
        <SearchResults results={results} loading={loading} error={error} />
      </div>
    </main>
  );
}

