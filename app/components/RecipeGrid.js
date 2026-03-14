'use client';

import RecipeCard from './RecipeCard';
import LoadingSpinner from './LoadingSpinner';

export default function RecipeGrid({ 
  recipes = [], 
  loading = false, 
  error = null,
  onFavorite,
  favoriteRecipes = [],
  emptyMessage = "No recipes found"
}) {
  
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-red-600 text-lg font-semibold mb-2">
            Oops! Something went wrong
          </div>
          <p className="text-red-500 text-sm">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">
          {emptyMessage}
        </div>
        <p className="text-gray-400 text-sm">
          Try adjusting your search criteria or browse all recipes
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe._id}
          recipe={recipe}
          onFavorite={onFavorite}
          isFavorite={favoriteRecipes.includes(recipe._id)}
        />
      ))}
    </div>
  );
}