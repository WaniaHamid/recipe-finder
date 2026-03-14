import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const cuisine = searchParams.get('cuisine');
    const difficulty = searchParams.get('difficulty');
    const ingredients = searchParams.get('ingredients');
    const mealType = searchParams.get('mealType');
    const maxTime = searchParams.get('maxTime');
    const maxCalories = searchParams.get('maxCalories');
    const diet = searchParams.get('diet');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;
    const skip = (page - 1) * limit;

    let searchQuery = { isPublic: true };

    // Text search across multiple fields
    if (query) {
      searchQuery.$text = { $search: query };
    }

    // Filter by category
    if (category && category !== 'all') {
      searchQuery.category = category;
    }

    // Filter by cuisine
    if (cuisine && cuisine !== 'all') {
      searchQuery.cuisine = new RegExp(cuisine, 'i');
    }

    // Filter by difficulty
    if (difficulty && difficulty !== 'all') {
      searchQuery.difficulty = difficulty;
    }

    // Search by ingredients - FIXED VERSION
    if (ingredients) {
      const ingredientList = ingredients
        .split(',')
        .map(ing => ing.trim())
        .filter(ing => ing.length > 0);

      if (ingredientList.length > 0) {
        searchQuery.$or = [
          {
            'ingredients.name': {
              $in: ingredientList.map(ing => new RegExp(ing, 'i'))
            }
          },
          {
            'title': {
              $regex: ingredientList.join('|'), 
              $options: 'i'
            }
          }
        ];
      }
    }

    // Additional filters for meal type, time, calories, diet
    if (mealType) {
      searchQuery.dishTypes = { $in: [mealType.toLowerCase()] };
    }

    if (maxTime) {
      searchQuery.readyInMinutes = { $lte: parseInt(maxTime) };
    }

    if (maxCalories) {
      searchQuery['nutrition.calories'] = { $lte: parseInt(maxCalories) };
    }

    if (diet) {
      searchQuery.diets = { $in: [diet.toLowerCase()] };
    }

    console.log('Search Query:', JSON.stringify(searchQuery, null, 2));

    const recipes = await Recipe.find(searchQuery)
      .populate('createdBy', 'name')
      .sort(query ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    console.log(`Found ${recipes.length} recipes`);

    const total = await Recipe.countDocuments(searchQuery);

    // Return format that matches frontend expectations
    return NextResponse.json({
      success: true,
      recipes: recipes, // Frontend expects data.recipes
      data: {
        recipes,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      },
      message: recipes.length === 0 ? 'No recipes found' : `Found ${recipes.length} recipes`
    });

  } catch (error) {
    console.error('Recipes API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const {
      title,
      description,
      ingredients,
      instructions,
      cookingTime,
      servings,
      difficulty,
      cuisine,
      category,
      tags,
      nutritionalInfo,
      imageUrl
    } = body;

    // Validate required fields
    if (!title || !description || !ingredients || !instructions || !cookingTime || !servings || !cuisine || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const recipe = new Recipe({
      title,
      description,
      ingredients,
      instructions,
      cookingTime,
      servings,
      difficulty: difficulty || 'medium',
      cuisine,
      category,
      tags: tags || [],
      nutritionalInfo: nutritionalInfo || {},
      imageUrl: imageUrl || '/images/default-recipe.jpg',
      createdBy: decoded.userId
    });

    await recipe.save();

    const populatedRecipe = await Recipe.findById(recipe._id)
      .populate('createdBy', 'name')
      .lean();

    return NextResponse.json({
      success: true,
      data: populatedRecipe
    }, { status: 201 });

  } catch (error) {
    console.error('Create Recipe Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create recipe' },
      { status: 500 }
    );
  }
}