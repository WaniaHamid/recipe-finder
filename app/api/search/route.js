import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Recipe from '@/models/Recipe';

export async function GET(req) {
  try {
    console.log('Search API called');
    await connectDB();

    const { searchParams } = new URL(req.url);

    const ingredientsQuery = searchParams.get('ingredients');
    const maxCalories = searchParams.get('maxCalories');
    const diet = searchParams.get('diet');
    const maxTime = searchParams.get('maxTime');
    const mealType = searchParams.get('mealType');

    console.log('Search params:', {
      ingredientsQuery,
      maxCalories,
      diet,
      maxTime,
      mealType
    });

    const query = {};

    // Ingredients filter - try multiple approaches
    if (ingredientsQuery) {
      const ingredients = ingredientsQuery
        .split(',')
        .map(i => i.trim().toLowerCase());

      console.log('Searching for ingredients:', ingredients);

      // Try exact match first, then partial match
      // query.$or = [
      //   { 'ingredients': { $in: ingredients } },
      //   { 'ingredients': { $in: ingredients.map(ing => new RegExp(ing, 'i')) } },
      //   { 'title': { $in: ingredients.map(ing => new RegExp(ing, 'i')) } }
      // ];
      query.$or = [
        { 'ingredients.name': { $in: ingredients.map(ing => new RegExp(ing, 'i')) } },
        { 'title': { $in: ingredients.map(ing => new RegExp(ing, 'i')) } }
      ];

      
    }

    // Calories filter
    if (maxCalories) {
      query['nutrition.calories'] = { $lte: parseInt(maxCalories) };
    }

    // Diet filter
    if (diet) {
      query.diets = { $in: [diet.toLowerCase()] };
    }

    // Time filter
    if (maxTime) {
      query.readyInMinutes = { $lte: parseInt(maxTime) };
    }

    // Meal type (dishTypes)
    if (mealType) {
      query.dishTypes = { $in: [mealType.toLowerCase()] };
    }

    console.log('MongoDB query:', JSON.stringify(query, null, 2));

    const recipes = await Recipe.find(query).limit(50);
    console.log(`Found ${recipes.length} recipes`);

    // If no recipes found with filters, try just ingredients
    if (recipes.length === 0 && ingredientsQuery) {
      console.log('No recipes found with filters, trying ingredients only...');
      const ingredients = ingredientsQuery
        .split(',')
        .map(i => i.trim().toLowerCase());
      
      // const fallbackQuery = {
      //   $or: [
      //     { 'ingredients': { $in: ingredients.map(ing => new RegExp(ing, 'i')) } },
      //     { 'title': { $in: ingredients.map(ing => new RegExp(ing, 'i')) } }
      //   ]
      // };
      
      const fallbackQuery = {
        $or: [
          { 'ingredients.name': { $in: ingredients.map(ing => new RegExp(ing, 'i')) } },
          { 'title': { $in: ingredients.map(ing => new RegExp(ing, 'i')) } }
        ]
      };


      
      const fallbackRecipes = await Recipe.find(fallbackQuery).limit(50);
      console.log(`Fallback search found ${fallbackRecipes.length} recipes`);
      
      return NextResponse.json({ 
        success: true, 
        recipes: fallbackRecipes,
        message: fallbackRecipes.length === 0 ? 'No recipes found' : `Found ${fallbackRecipes.length} recipes`
      });
    }

    return NextResponse.json({ 
      success: true, 
      recipes,
      message: recipes.length === 0 ? 'No recipes found' : `Found ${recipes.length} recipes`
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}