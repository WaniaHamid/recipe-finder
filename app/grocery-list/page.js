// 'use client'
// import { useState, useEffect } from 'react'
// import { useSearchParams } from 'next/navigation'

// export default function GroceryListPage() {
//   const searchParams = useSearchParams()
//   const [groceryList, setGroceryList] = useState([])
//   const [checkedItems, setCheckedItems] = useState({})
//   const [recipeName, setRecipeName] = useState('')

//   useEffect(() => {
//     const recipeData = searchParams.get('recipe')
//     if (recipeData) {
//       try {
//         const recipe = JSON.parse(decodeURIComponent(recipeData))
//         setRecipeName(recipe.title || recipe.name || 'Selected Recipe')
//         setGroceryList(recipe.ingredients || [])
//       } catch (error) {
//         console.error('Error parsing recipe data:', error)
//       }
//     } else {
//       const savedGroceryList = localStorage.getItem('groceryList')
//       const savedRecipeName = localStorage.getItem('selectedRecipeName')
//       if (savedGroceryList) {
//         setGroceryList(JSON.parse(savedGroceryList))
//         setRecipeName(savedRecipeName || 'Selected Recipe')
//       }
//     }
//   }, [searchParams])

//   const handleCheckboxChange = (index) => {
//     setCheckedItems(prev => ({
//       ...prev,
//       [index]: !prev[index]
//     }))
//   }

//   const remainingItems = groceryList.filter((_, index) => !checkedItems[index])

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 py-12">
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
//             🛒 Grocery List
//           </h1>
//           <p className="text-lg text-gray-600">
//             Check off items you already have at home
//           </p>
//         </div>

//         {/* Recipe Info */}
//         {recipeName && (
//           <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-10 border border-emerald-200 text-center">
//             <h2 className="text-2xl font-semibold text-emerald-700 mb-1">
//               🧾 Recipe: {recipeName}
//             </h2>
//             <p className="text-emerald-600">Here’s your custom shopping list:</p>
//           </div>
//         )}

//         {/* No List Message */}
//         {groceryList.length === 0 ? (
//           <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-10 text-center border border-emerald-200">
//             <div className="text-6xl mb-4">🛍️</div>
//             <h3 className="text-2xl font-semibold text-gray-800 mb-2">
//               No Grocery List Yet
//             </h3>
//             <p className="text-gray-600 mb-6">
//               Search for a recipe and click "Generate Grocery List" to begin!
//             </p>
//             <a
//               href="/search-recipe"
//               className="inline-block px-6 py-3 bg-emerald-500 text-white font-medium rounded-full hover:bg-emerald-600 transition"
//             >
//               🔍 Search Recipes
//             </a>
//           </div>
//         ) : (
//           <div className="grid md:grid-cols-2 gap-8">
            
//             {/* All Items */}
//             <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-emerald-200">
//               <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
//                 📝 All Ingredients ({groceryList.length})
//               </h3>
//               <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
//                 {groceryList.map((ingredient, index) => (
//                   <label
//                     key={index}
//                     className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
//                       checkedItems[index]
//                         ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
//                         : 'bg-white border-gray-200 hover:bg-emerald-50 hover:border-emerald-300'
//                     }`}
//                   >
//                     <input
//                       type="checkbox"
//                       checked={checkedItems[index] || false}
//                       onChange={() => handleCheckboxChange(index)}
//                       className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 mr-3"
//                     />
//                     <span className={checkedItems[index] ? 'line-through' : ''}>
//                       {typeof ingredient === 'string' ? ingredient : ingredient.name || ingredient.text}
//                     </span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Items to Buy */}
//             <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-rose-200">
//               <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
//                 🛍️ Need to Buy ({remainingItems.length})
//               </h3>
//               {remainingItems.length === 0 ? (
//                 <div className="text-center py-8">
//                   <div className="text-4xl mb-3">🎉</div>
//                   <p className="text-lg font-semibold text-emerald-700 mb-1">
//                     You’re ready to go!
//                   </p>
//                   <p className="text-gray-600">Everything is checked off. Let’s cook!</p>
//                 </div>
//               ) : (
//                 <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
//                   {remainingItems.map((ingredient, index) => (
//                     <div
//                       key={index}
//                       className="p-3 bg-rose-50 border border-rose-200 rounded-lg"
//                     >
//                       <span className="text-rose-800 font-medium">
//                         {typeof ingredient === 'string' ? ingredient : ingredient.name || ingredient.text}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//               {remainingItems.length > 0 && (
//                 <div className="mt-6 p-4 bg-rose-100 border border-rose-300 rounded-xl text-center">
//                   <p className="text-rose-800 font-medium">
//                     📸 Take a screenshot or jot these down for your next grocery run!
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Footer Buttons */}
//         <div className="mt-12 flex flex-wrap justify-center gap-4">
//           <a
//             href="/search-recipe"
//             className="px-6 py-3 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition"
//           >
//             🔄 Search More Recipes
//           </a>
//           <a
//             href="/meal-planning"
//             className="px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition"
//           >
//             📅 Plan Your Meals
//           </a>
//         </div>
//       </div>
//     </div>
//   )
// }
