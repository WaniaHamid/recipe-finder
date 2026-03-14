'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

export default function SearchBar({ onSearch, onFilter, filters = {} }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    category: '',
    difficulty: '',
    maxCookingTime: '',
    tags: '',
    ...filters
  });

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleFilterChange = (filterName, value) => {
    const updatedFilters = {
      ...localFilters,
      [filterName]: value
    };
    setLocalFilters(updatedFilters);
    onFilter(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      difficulty: '',
      maxCookingTime: '',
      tags: ''
    };
    setLocalFilters(clearedFilters);
    onFilter(clearedFilters);
  };

  const hasActiveFilters = Object.values(localFilters).some(value => value !== '');

  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search recipes by name, ingredients, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                showFilters || hasActiveFilters
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
            <div className="flex gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={localFilters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Categories</option>
                <option value="Italian">Italian</option>
                <option value="Asian">Asian</option>
                <option value="Mexican">Mexican</option>
                <option value="American">American</option>
                <option value="Indian">Indian</option>
                <option value="Mediterranean">Mediterranean</option>
                <option value="Dessert">Dessert</option>
                <option value="Salad">Salad</option>
                <option value="Soup">Soup</option>
                <option value="Breakfast">Breakfast</option>
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={localFilters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Any Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Cooking Time Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Cooking Time
              </label>
              <select
                value={localFilters.maxCookingTime}
                onChange={(e) => handleFilterChange('maxCookingTime', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Any Duration</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
            </div>

            {/* Tags Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                placeholder="e.g. healthy, quick, vegetarian"
                value={localFilters.tags}
                onChange={(e) => handleFilterChange('tags', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {localFilters.category && (
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    Category: {localFilters.category}
                    <button
                      onClick={() => handleFilterChange('category', '')}
                      className="hover:bg-orange-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {localFilters.difficulty && (
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    Difficulty: {localFilters.difficulty}
                    <button
                      onClick={() => handleFilterChange('difficulty', '')}
                      className="hover:bg-orange-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {localFilters.maxCookingTime && (
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    Max Time: {localFilters.maxCookingTime} min
                    <button
                      onClick={() => handleFilterChange('maxCookingTime', '')}
                      className="hover:bg-orange-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {localFilters.tags && (
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    Tags: {localFilters.tags}
                    <button
                      onClick={() => handleFilterChange('tags', '')}
                      className="hover:bg-orange-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}