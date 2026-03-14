'use client';

import { useState } from 'react';
import { Heart, Clock, Users, ChefHat } from 'lucide-react';

export default function RecipeCard({ recipe, onFavorite, isFavorite = false }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFavorite = async () => {
    setIsLoading(true);
    try {
      await onFavorite(recipe._id);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Recipe Image Placeholder */}
      <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <ChefHat className="w-16 h-16 text-white opacity-50" />
        </div>
        
        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          disabled={isLoading}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors duration-200 ${
            isFavorite 
              ? 'bg-red-500 text-white' 
              : 'bg-white text-gray-400 hover:text-red-500'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Category Badge */}
        {recipe.category && (
          <div className="absolute top-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
            {recipe.category}
          </div>
        )}
      </div>

      {/* Recipe Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
          {recipe.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {recipe.description}
        </p>

        {/* Recipe Info */}
        <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.cookingTime} min</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{recipe.servings} servings</span>
          </div>
          
          {recipe.difficulty && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </span>
          )}
        </div>

        {/* Nutritional Info */}
        {recipe.nutritionalInfo && (
          <div className="grid grid-cols-4 gap-2 mb-3 text-center text-xs">
            <div className="bg-gray-50 p-2 rounded">
              <div className="font-semibold text-gray-800">{recipe.nutritionalInfo.calories}</div>
              <div className="text-gray-500">Cal</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="font-semibold text-gray-800">{recipe.nutritionalInfo.protein}g</div>
              <div className="text-gray-500">Protein</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="font-semibold text-gray-800">{recipe.nutritionalInfo.carbs}g</div>
              <div className="text-gray-500">Carbs</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="font-semibold text-gray-800">{recipe.nutritionalInfo.fat}g</div>
              <div className="text-gray-500">Fat</div>
            </div>
          </div>
        )}

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
            {recipe.tags.length > 3 && (
              <span className="text-gray-500 text-xs px-2 py-1">
                +{recipe.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* View Recipe Button */}
        <button className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium">
          View Recipe
        </button>
      </div>
    </div>
  );
}