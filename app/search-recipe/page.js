'use client';
import { useState } from 'react';
import { useAuth } from '../../hooks/useApi';
import toast from 'react-hot-toast';

export default function SearchRecipe() {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRecipeDetail, setLoadingRecipeDetail] = useState(false);
  const [filters, setFilters] = useState({
    mealType: '',
    maxTime: '',
    maxCalories: '',
    diet: ''
  });
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const { user } = useAuth();

  const handleSearch = async () => {
    if (!ingredients.trim()) {
      toast.error('Please enter some ingredients');
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('ingredients', ingredients);
      if (filters.mealType) params.append('mealType', filters.mealType);
      if (filters.maxTime) params.append('maxTime', filters.maxTime);
      if (filters.maxCalories) params.append('maxCalories', filters.maxCalories);
      if (filters.diet) params.append('diet', filters.diet);

      const response = await fetch(`/api/recipes?${params.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (response.ok && data.recipes) {
        setRecipes(data.recipes);
        data.recipes.length
          ? toast.success(`Found ${data.recipes.length} recipes!`)
          : toast.error('No recipes found');
      } else {
        setRecipes([]);
        toast.error('No recipes found');
      }
    } catch (error) {
      toast.error('Failed to search recipes');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRecipe = async (recipe) => {
    setLoadingRecipeDetail(true);
    try {
      // First, set the basic recipe data
      setSelectedRecipe(recipe);

      // If the recipe already has detailed information, no need to fetch again
      if (recipe.analyzedInstructions && recipe.extendedIngredients) {
        setLoadingRecipeDetail(false);
        return;
      }

      // Fetch detailed recipe information from API
      const response = await fetch(`/api/recipes/${recipe.id || recipe._id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const detailedRecipe = await response.json();
        setSelectedRecipe(detailedRecipe);
      } else {
        // If detailed fetch fails, show the basic recipe data
        toast.error('Could not load detailed recipe information');
      }
    } catch (error) {
      toast.error('Failed to load recipe details');
      // Still show the basic recipe if detailed fetch fails
    } finally {
      setLoadingRecipeDetail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-blue-100 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-gray-800 mb-3">
            Find Your Perfect <span className="bg-gradient-to-r from-pink-400 to-blue-400 text-transparent bg-clip-text">Recipe</span>
          </h1>
          <p className="text-lg text-gray-600">Enter ingredients you have at home and discover amazing recipes.</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 max-w-4xl mx-auto space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter Ingredients (comma separated)
            </label>
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="e.g., chicken, tomatoes, onions"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['mealType', 'maxTime', 'maxCalories', 'diet'].map((key) => {
              const options = {
                mealType: ['', 'breakfast', 'lunch', 'dinner', 'snack', 'dessert'],
                maxTime: ['', '15', '30', '60', '120'],
                maxCalories: ['', '300', '500', '800'],
                diet: ['', 'vegetarian', 'vegan', 'gluten-free', 'keto']
              };
              const labels = {
                mealType: 'Any Meal Type',
                maxTime: 'Any Prep Time',
                maxCalories: 'Any Calories',
                diet: 'Any Diet'
              };
              return (
                <select
                  key={key}
                  value={filters[key]}
                  onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                >
                  <option value="">{labels[key]}</option>
                  {options[key].slice(1).map((val) => (
                    <option key={val} value={val}>{val.charAt(0).toUpperCase() + val.slice(1)}</option>
                  ))}
                </select>
              );
            })}
          </div>

          <div className="text-center">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-gradient-to-r from-pink-400 to-blue-400 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition disabled:opacity-50"
            >
              {loading ? '🔍 Searching...' : '🔍 Search Recipes'}
            </button>
          </div>
        </div>

        {/* Recipes Section */}
        {loading && <p className="text-center text-gray-500">Loading recipes...</p>}

        {recipes.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
              Found {recipes.length} Recipe{recipes.length > 1 ? 's' : ''}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map((recipe) => (
                <div key={recipe._id || recipe.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition">
                  <img
                    src={recipe.image || 'https://via.placeholder.com/400x250'}
                    alt={recipe.title}
                    onError={(e) => e.target.src = 'https://via.placeholder.com/400x250?text=No+Image'}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800">{recipe.title}</h3>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                      {recipe.readyInMinutes && <span>⏱️ {recipe.readyInMinutes} min</span>}
                      {recipe.servings && <span>👥 {recipe.servings} servings</span>}
                      {recipe.healthScore && <span>💚 {recipe.healthScore}% healthy</span>}
                    </div>
                    <div className="flex justify-center mt-4">
                      <button 
                        onClick={() => handleViewRecipe(recipe)} 
                        className="w-full bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition"
                      >
                        View Recipe
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && recipes.length === 0 && ingredients.trim() && (
          <div className="text-center text-gray-500 py-10">
            No recipes found. Try other ingredients or adjust filters.
          </div>
        )}

        {/* Recipe Detail Modal */}
        {selectedRecipe && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white p-6 border-b border-gray-200 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">{selectedRecipe.title}</h2>
                  <button 
                    onClick={() => setSelectedRecipe(null)} 
                    className="text-3xl text-gray-600 hover:text-gray-900 transition"
                  >
                    ×
                  </button>
                </div>
              </div>

              {loadingRecipeDetail ? (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading recipe details...</p>
                </div>
              ) : (
                <div className="p-6">
                  <img
                    src={selectedRecipe.image || 'https://via.placeholder.com/600x300'}
                    alt={selectedRecipe.title}
                    onError={(e) => e.target.src = 'https://via.placeholder.com/600x300?text=No+Image'}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />

                  {/* Recipe Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                    {selectedRecipe.readyInMinutes && (
                      <div className="text-center">
                        <span className="text-2xl">⏱️</span>
                        <p className="text-sm text-gray-600">Prep Time</p>
                        <p className="font-semibold">{selectedRecipe.readyInMinutes} min</p>
                      </div>
                    )}
                    {selectedRecipe.servings && (
                      <div className="text-center">
                        <span className="text-2xl">👥</span>
                        <p className="text-sm text-gray-600">Servings</p>
                        <p className="font-semibold">{selectedRecipe.servings}</p>
                      </div>
                    )}
                    {selectedRecipe.healthScore && (
                      <div className="text-center">
                        <span className="text-2xl">💚</span>
                        <p className="text-sm text-gray-600">Health Score</p>
                        <p className="font-semibold">{selectedRecipe.healthScore}%</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Ingredients */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-gray-800">Ingredients</h3>
                      <ul className="space-y-2">
                        {(selectedRecipe.extendedIngredients || selectedRecipe.ingredients || []).map((ing, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-pink-400 mr-2">•</span>
                            <span className="text-gray-700">
                              {typeof ing === 'string' ? ing : ing.original || `${ing.amount} ${ing.unit} ${ing.name}`}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Instructions */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-gray-800">Instructions</h3>
                      <div className="space-y-3">
                        {(() => {
                          // Handle different instruction formats
                          let instructions = [];
                          
                          if (selectedRecipe.analyzedInstructions && selectedRecipe.analyzedInstructions.length > 0) {
                            instructions = selectedRecipe.analyzedInstructions[0].steps || [];
                          } else if (selectedRecipe.instructions && Array.isArray(selectedRecipe.instructions)) {
                            instructions = selectedRecipe.instructions.map((inst, i) => {
                              // Handle different instruction object formats
                              if (typeof inst === 'string') {
                                return { number: i + 1, step: inst };
                              } else if (typeof inst === 'object' && inst !== null) {
                                return { 
                                  number: i + 1, 
                                  step: inst.step || inst.description || inst.instruction || JSON.stringify(inst)
                                };
                              }
                              return { number: i + 1, step: String(inst) };
                            });
                          } else if (selectedRecipe.instructions && typeof selectedRecipe.instructions === 'string') {
                            instructions = selectedRecipe.instructions.split('.').filter(s => s.trim()).map((inst, i) => ({ number: i + 1, step: inst.trim() }));
                          }

                          return instructions.length > 0 ? instructions.map((instruction, i) => (
                            <div key={i} className="flex">
                              <span className="bg-blue-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-1 flex-shrink-0">
                                {instruction.number || i + 1}
                              </span>
                              <p className="text-gray-700">
                                {typeof instruction.step === 'string' 
                                  ? instruction.step 
                                  : String(instruction.step)
                                }
                              </p>
                            </div>
                          )) : (
                            <p className="text-gray-500 italic">Instructions not available for this recipe.</p>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {selectedRecipe.summary && (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold mb-4 text-gray-800">About This Recipe</h3>
                      <div 
                        className="text-gray-700 prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: selectedRecipe.summary }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}