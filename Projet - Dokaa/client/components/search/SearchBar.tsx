'use client';

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading?: boolean;
  disabled?: boolean;
  disabledMessage?: string;
}

export default function SearchBar({ onSearch, loading, disabled = false, disabledMessage }: SearchBarProps) {
  const isDisabled = disabled || loading;
  
  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="relative">
        <input
          type="text"
          onChange={(e) => onSearch(e.target.value)}
          placeholder={isDisabled && disabledMessage ? disabledMessage : "🔍 Rechercher un restaurant..."}
          className={`w-full px-6 py-4 pl-14 pr-14 rounded-2xl border-2 transition-all duration-200 font-medium ${
            isDisabled 
              ? 'border-gray-200 bg-gray-100 text-gray-400 placeholder-gray-400 cursor-not-allowed' 
              : 'border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white shadow-lg hover:shadow-xl text-gray-700 placeholder-gray-400'
          }`}
          disabled={isDisabled}
        />
        <svg
          className={`absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 ${
            isDisabled ? 'text-gray-300' : 'text-gray-400'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {loading && !disabled && (
          <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-500 border-t-transparent"></div>
          </div>
        )}
      </div>
    </div>
  );
}
