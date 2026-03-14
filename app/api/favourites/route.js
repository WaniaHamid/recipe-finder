// import { NextResponse } from 'next/server'
// import jwt from 'jsonwebtoken'
// import { connectDB } from '@/lib/mongodb'
// import User from '@/models/User'

// async function verifyToken(request) {
//   const authHeader = request.headers.get('authorization')
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     throw new Error('No token provided')
//   }

//   const token = authHeader.substring(7)
//   const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
//   return decoded
// }

// // GET /api/favorites - Get user's favorite recipes
// export async function GET(request) {
//   try {
//     const decoded = await verifyToken(request)
//     await connectDB()

//     const user = await User.findById(decoded.userId).select('favoriteRecipes')
//     if (!user) {
//       return NextResponse.json({ message: 'User not found' }, { status: 404 })
//     }

//     return NextResponse.json({
//       favorites: user.favoriteRecipes || []
//     })

//   } catch (error) {
//     console.error('Get favorites error:', error)
//     return NextResponse.json(
//       { message: 'Unauthorized' },
//       { status: 401 }
//     )
//   }
// }

// // POST /api/favorites - Add recipe to favorites
// export async function POST(request) {
//   try {
//     const decoded = await verifyToken(request)
//     const recipeData = await request.json()

//     await connectDB()

//     const user = await User.findById(decoded.userId)
//     if (!user) {
//       return NextResponse.json({ message: 'User not found' }, { status: 404 })
//     }

//     // Initialize favoriteRecipes if it doesn't exist
//     if (!user.favoriteRecipes) {
//       user.favoriteRecipes = []
//     }

//     // Check if recipe is already in favorites
//     const existingFavorite = user.favoriteRecipes.find(
//       recipe => recipe.id === recipeData.id
//     )

//     if (existingFavorite) {
//       return NextResponse.json(
//         { message: 'Recipe already in favorites' },
//         { status: 409 }
//       )
//     }

//     // Add recipe to favorites
//     user.favoriteRecipes.push({
//       id: recipeData.id,
//       title: recipeData.title,
//       image: recipeData.image,
//       readyInMinutes: recipeData.readyInMinutes,
//       servings: recipeData.servings,
//       summary: recipeData.summary,
//       sourceUrl: recipeData.sourceUrl,
//       ingredients: recipeData.ingredients,
//       addedAt: new Date()
//     })

//     await user.save()

//     return NextResponse.json({
//       message: 'Recipe added to favorites',
//       favorite: user.favoriteRecipes[user.favoriteRecipes.length - 1]
//     })

//   } catch (error) {
//     console.error('Add favorite error:', error)
//     return NextResponse.json(
//       { message: 'Unauthorized' },
//       { status: 401 }
//     )
//   }
// }

// // DELETE /api/favorites - Remove recipe from favorites
// export async function DELETE(request) {
//   try {
//     const decoded = await verifyToken(request)
//     const { searchParams } = new URL(request.url)
//     const recipeId = searchParams.get('recipeId')

//     if (!recipeId) {
//       return NextResponse.json(
//         { message: 'Recipe ID is required' },
//         { status: 400 }
//       )
//     }

//     await connectDB()

//     const user = await User.findById(decoded.userId)
//     if (!user) {
//       return NextResponse.json({ message: 'User not found' }, { status: 404 })
//     }

//     // Remove recipe from favorites
//     user.favoriteRecipes = user.favoriteRecipes.filter(
//       recipe => recipe.id.toString() !== recipeId.toString()
//     )

//     await user.save()

//     return NextResponse.json({
//       message: 'Recipe removed from favorites'
//     })

//   } catch (error) {
//     console.error('Remove favorite error:', error)
//     return NextResponse.json(
//       { message: 'Unauthorized' },
//       { status: 401 }
//     )
//   }
// }