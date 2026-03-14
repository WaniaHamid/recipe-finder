// 'use client'
// import { useState, useEffect } from 'react'

// export default function FavoritesPage() {
//   const [favorites, setFavorites] = useState([])
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     // Check if user is logged in
//     const userData = localStorage.getItem('user')
//     if (userData) {
//       setUser(JSON.parse(userData))
//       loadFavorites()
//     }
//     setLoading(false)
//   }, [])

//   const loadFavorites = () => {
//     const savedFavorites = localStorage.getItem('favoriteRecipes')
//     if (savedFavorites) {
//       setFavorites(JSON.parse(savedFavorites))
//     }
//   }

//   const removeFavorite = (recipeId) => {
//     const updatedFavorites = favorites.filter(recipe => recipe.id !== recipeId)
//     setFavorites(updatedFavorites)
//     localStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites))
//   }

//   const generateGroceryList = (recipe) => {
//     // Save recipe data to localStorage for grocery list
//     localStorage.setItem('groceryList', JSON.stringify(recipe.ingredients || []))
//     localStorage.setItem('selectedRecipeName', recipe.title || recipe.name)
//     window.location.href = '/grocery-list'
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
//       </div>
//     )
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
//         <div className="text-center max-w-md mx-auto px-4">
//           <div className="text-6xl mb-6">🔒</div>
//           <h1 className="text-3xl font-bold text-gray-800 mb-4">Login Required</h1>
//           <p className="text-gray-600 mb-8">
//             Please log in to view your favorite recipes
//           </p>
//           <a
//             href="/login"
//             className="inline-flex items-center px-6 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
//           >
//             Login to Continue
//           </a>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-12">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <div className="text-5xl mb-4">❤️</div>
//           <h1 className="text-4xl font-bold text-gray-800 mb-4">
//             My Favorite Recipes
//           </h1>
//           <p className="text-lg text-gray-600">
//             Your saved recipes collection
//           </p>
//           <div className="mt-4">
//             <span className="px-4 py-2 bg-rose-100 text-rose-700 rounded-full text-sm">
//               {favorites.length} favorite{favorites.length !== 1 ? 's' : ''}
//             </span>
//           </div>
//         </div>

//         {favorites.length === 0 ? (
//           <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center border border-rose-200">
//             <div className="text-6xl mb-6">💔</div>
//             <h3 className="text-2xl font-semibold text-gray-800 mb-4">
//               No Favorites Yet
//             </h3>
//             <p className="text-gray-600 mb-8 max-w-md mx-auto">
//               Start exploring recipes and click the heart icon to save your favorites here!
//             </p>
//             <a
//               href="/search-recipe"
//               className="inline-flex items-center px-6 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
//             >
//               🔍 Search Recipes
//             </a>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {favorites.map((recipe) => (
//               <div
//                 key={recipe.id}
//                 className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-rose-200 hover:shadow-xl transition-all duration-300"
//               >
//                 {/* Recipe Image */}
//                 <div className="h-48 bg-gradient-to-r from-rose-200 to-pink-200 flex items-center justify-center relative">
//                   {recipe.image ? (
//                     <img
//                       src={recipe.image}
//                       alt={recipe.title || recipe.name}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="text-4xl">🍽️</div>
//                   )}
//                   <button
//                     onClick={() => removeFavorite(recipe.id)}
//                     className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
//                     title="Remove from favorites"
//                   >
//                     ×
//                   </button>
//                 </div>

//                 {/* Recipe Content */}
//                 <div className="p-6">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
//                     {recipe.title || recipe.name}
//                   </h3>
                  
//                   {recipe.summary && (
//                     <p className="text-sm text-gray-600 mb-4 line-clamp-3">
//                       {recipe.summary.replace(/<[^>]*>/g, '')}
//                     </p>
//                   )}

//                   {/* Recipe Stats */}
//                   <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
//                     {recipe.readyInMinutes && (
//                       <span className="flex items-center">
//                         ⏱️ {recipe.readyInMinutes} min
//                       </span>
//                     )}
//                     {recipe.servings && (
//                       <span className="flex items-center">
//                         👥 {recipe.servings} servings
//                       </span>
//                     )}
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => generateGroceryList(recipe)}
//                       className="flex-1 px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
//                     >
//                       🛒 Grocery List
//                     </button>
//                     {recipe.sourceUrl && (
//                       <a
//                         href={recipe.sourceUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors text-center"
//                       >
//                         👁️ View Recipe
//                       </a>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Quick Actions */}
//         <div className="mt-12 flex justify-center gap-4">
//           <a
//             href="/search-recipe"
//             className="px-6 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
//           >
//             Search More Recipes
//           </a>
//           <a
//             href="/meal-planning"
//             className="px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
//           >
//             Plan Your Meals
//           </a>
//         </div>
//       </div>
//     </div>
//   )
// }