'use client'
import { useState, useEffect } from 'react'

export default function MealPlanningPage() {
  const [mealPlan, setMealPlan] = useState({})
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedMeal, setSelectedMeal] = useState('')
  const [showAddRecipe, setShowAddRecipe] = useState(false)
  const [recipeName, setRecipeName] = useState('')

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ]
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack']

  useEffect(() => {
    const savedMealPlan = localStorage.getItem('mealPlan')
    if (savedMealPlan) setMealPlan(JSON.parse(savedMealPlan))
  }, [])

  const saveMealPlan = (newMealPlan) => {
    localStorage.setItem('mealPlan', JSON.stringify(newMealPlan))
    setMealPlan(newMealPlan)
  }

  const addRecipeToMeal = () => {
    if (!selectedDay || !selectedMeal || !recipeName.trim()) return
    const newMealPlan = { ...mealPlan }
    if (!newMealPlan[selectedDay]) newMealPlan[selectedDay] = {}
    if (!newMealPlan[selectedDay][selectedMeal]) newMealPlan[selectedDay][selectedMeal] = []
    newMealPlan[selectedDay][selectedMeal].push({ name: recipeName, id: Date.now() })
    saveMealPlan(newMealPlan)
    setRecipeName('')
    setShowAddRecipe(false)
    setSelectedDay('')
    setSelectedMeal('')
  }

  const removeRecipe = (day, mealType, recipeId) => {
    const newMealPlan = { ...mealPlan }
    if (newMealPlan[day]?.[mealType]) {
      newMealPlan[day][mealType] = newMealPlan[day][mealType].filter(r => r.id !== recipeId)
      if (!newMealPlan[day][mealType].length) delete newMealPlan[day][mealType]
      if (!Object.keys(newMealPlan[day]).length) delete newMealPlan[day]
      saveMealPlan(newMealPlan)
    }
  }

  const openAddRecipeModal = (day, meal) => {
    setSelectedDay(day)
    setSelectedMeal(meal)
    setShowAddRecipe(true)
  }

  const getTotalMeals = () => {
    let total = 0
    Object.values(mealPlan).forEach(day =>
      Object.values(day).forEach(meals => total += meals.length)
    )
    return total
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-rose-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            📅 Meal Planner
          </h1>
          <p className="text-lg text-gray-600">Plan your meals for the upcoming week</p>
          <div className="mt-4 flex justify-center gap-4 text-sm">
            <span className="px-4 py-1 bg-purple-100 text-purple-700 rounded-full">
              {Object.keys(mealPlan).length} days planned
            </span>
            <span className="px-4 py-1 bg-pink-100 text-pink-700 rounded-full">
              {getTotalMeals()} meals scheduled
            </span>
          </div>
        </div>

        {/* Meal Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          {daysOfWeek.map(day => (
            <div key={day} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 border border-purple-200">
              <h3 className="text-center text-lg font-bold text-gray-800 mb-4">{day}</h3>

              {mealTypes.map(mealType => (
                <div key={mealType} className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-600">
                      {mealType === 'Breakfast' && '🌅'} 
                      {mealType === 'Lunch' && '☀️'} 
                      {mealType === 'Dinner' && '🌙'} 
                      {mealType === 'Snack' && '🍎'}{' '}
                      {mealType}
                    </span>
                    <button
                      onClick={() => openAddRecipeModal(day, mealType)}
                      className="text-purple-500 hover:text-purple-700 text-xs font-semibold"
                    >
                      + Add
                    </button>
                  </div>

                  <div className="space-y-1">
                    {mealPlan[day]?.[mealType]?.length > 0 ? (
                      mealPlan[day][mealType].map(recipe => (
                        <div
                          key={recipe.id}
                          className="text-xs p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex justify-between items-center group"
                        >
                          <span className="text-gray-700 truncate">{recipe.name}</span>
                          <button
                            onClick={() => removeRecipe(day, mealType, recipe.id)}
                            className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-gray-400 italic p-2 border-2 border-dashed border-gray-200 rounded-lg text-center">
                        No meal planned
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-purple-200">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/search-recipe"
                className="px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition"
              >
                🔍 Find Recipes
              </a>
              <button
                onClick={() => {
                  localStorage.removeItem('mealPlan')
                  setMealPlan({})
                }}
                className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
              >
                🗑️ Clear Plan
              </button>
              <a
                href="/grocery-list"
                className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
              >
                🛒 Grocery List
              </a>
            </div>
          </div>
        </div>

        {/* Add Recipe Modal */}
        {showAddRecipe && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Add Recipe to {selectedDay} - {selectedMeal}
              </h3>
              <input
                type="text"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                placeholder="Enter recipe name..."
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={addRecipeToMeal}
                  className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddRecipe(false)
                    setRecipeName('')
                    setSelectedDay('')
                    setSelectedMeal('')
                  }}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
