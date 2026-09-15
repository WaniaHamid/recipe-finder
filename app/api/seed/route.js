import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET(request) {
  return POST(request);
}

export async function POST(request) {
  try {
    await connectDB();

    // Create a sample user first
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    let sampleUser = await User.findOne({ email: 'demo@example.com' });
    if (!sampleUser) {
      sampleUser = new User({
        name: 'Demo User',
        email: 'demo@example.com',
        password: hashedPassword,
        favoriteRecipes: [],
        mealPlans: [],
        groceryLists: []
      });
      await sampleUser.save();
    }

    // Sample recipes data
    const sampleRecipes = [
      {
        title: 'Classic Spaghetti Carbonara',
        description: 'A traditional Italian pasta dish with eggs, cheese, and pancetta',
        ingredients: [
          { name: 'spaghetti', quantity: '400', unit: 'g' },
          { name: 'eggs', quantity: '4', unit: 'pieces' },
          { name: 'pancetta', quantity: '150', unit: 'g' },
          { name: 'parmesan cheese', quantity: '100', unit: 'g' },
          { name: 'black pepper', quantity: '1', unit: 'tsp' }
        ],
        instructions: [
          { step: 1, description: 'Cook spaghetti according to package instructions' },
          { step: 2, description: 'Fry pancetta until crispy' },
          { step: 3, description: 'Beat eggs with cheese and pepper' },
          { step: 4, description: 'Mix hot pasta with egg mixture and pancetta' }
        ],
        cookingTime: { prep: 15, cook: 15, total: 30 },
        servings: 4,
        difficulty: 'medium',
        cuisine: 'Italian',
        category: 'dinner',
        tags: ['pasta', 'traditional', 'italian'],
        createdBy: sampleUser._id,
        isPublic: true
      },
      {
        title: 'Chicken Tikka Masala',
        description: 'Tender chicken in a creamy tomato-based curry sauce',
        ingredients: [
          { name: 'chicken breast', quantity: '500', unit: 'g' },
          { name: 'yogurt', quantity: '200', unit: 'ml' },
          { name: 'tomatoes', quantity: '400', unit: 'g' },
          { name: 'onion', quantity: '1', unit: 'piece' },
          { name: 'garlic', quantity: '4', unit: 'cloves' },
          { name: 'ginger', quantity: '1', unit: 'inch' },
          { name: 'garam masala', quantity: '2', unit: 'tsp' },
          { name: 'cumin', quantity: '1', unit: 'tsp' },
          { name: 'turmeric', quantity: '1', unit: 'tsp' },
          { name: 'heavy cream', quantity: '100', unit: 'ml' }
        ],
        instructions: [
          { step: 1, description: 'Marinate chicken with yogurt and spices for 30 minutes' },
          { step: 2, description: 'Cook marinated chicken until done' },
          { step: 3, description: 'Sauté onions, garlic, and ginger' },
          { step: 4, description: 'Add tomatoes and spices, cook until thick' },
          { step: 5, description: 'Add cream and cooked chicken, simmer' }
        ],
        cookingTime: { prep: 45, cook: 30, total: 75 },
        servings: 4,
        difficulty: 'medium',
        cuisine: 'Indian',
        category: 'dinner',
        tags: ['curry', 'chicken', 'spicy', 'indian'],
        createdBy: sampleUser._id,
        isPublic: true
      },
      {
        title: 'Vegetable Stir Fry',
        description: 'Quick and healthy mixed vegetable stir fry',
        ingredients: [
          { name: 'broccoli', quantity: '200', unit: 'g' },
          { name: 'bell peppers', quantity: '2', unit: 'pieces' },
          { name: 'carrots', quantity: '2', unit: 'pieces' },
          { name: 'snap peas', quantity: '150', unit: 'g' },
          { name: 'soy sauce', quantity: '3', unit: 'tbsp' },
          { name: 'garlic', quantity: '3', unit: 'cloves' },
          { name: 'ginger', quantity: '1', unit: 'inch' },
          { name: 'sesame oil', quantity: '2', unit: 'tbsp' }
        ],
        instructions: [
          { step: 1, description: 'Prepare all vegetables by cutting into bite-sized pieces' },
          { step: 2, description: 'Heat oil in a wok or large pan' },
          { step: 3, description: 'Add garlic and ginger, stir for 30 seconds' },
          { step: 4, description: 'Add harder vegetables first, then softer ones' },
          { step: 5, description: 'Add soy sauce and stir until vegetables are tender-crisp' }
        ],
        cookingTime: { prep: 15, cook: 10, total: 25 },
        servings: 4,
        difficulty: 'easy',
        cuisine: 'Asian',
        category: 'lunch',
        tags: ['vegetarian', 'healthy', 'quick', 'asian'],
        createdBy: sampleUser._id,
        isPublic: true
      },
      {
        title: 'Chocolate Chip Cookies',
        description: 'Classic homemade chocolate chip cookies',
        ingredients: [
          { name: 'flour', quantity: '300', unit: 'g' },
          { name: 'butter', quantity: '200', unit: 'g' },
          { name: 'brown sugar', quantity: '150', unit: 'g' },
          { name: 'white sugar', quantity: '100', unit: 'g' },
          { name: 'eggs', quantity: '2', unit: 'pieces' },
          { name: 'vanilla extract', quantity: '2', unit: 'tsp' },
          { name: 'baking soda', quantity: '1', unit: 'tsp' },
          { name: 'salt', quantity: '1', unit: 'tsp' },
          { name: 'chocolate chips', quantity: '200', unit: 'g' }
        ],
        instructions: [
          { step: 1, description: 'Preheat oven to 375°F (190°C)' },
          { step: 2, description: 'Cream butter and sugars together' },
          { step: 3, description: 'Beat in eggs and vanilla' },
          { step: 4, description: 'Mix in flour, baking soda, and salt' },
          { step: 5, description: 'Fold in chocolate chips' },
          { step: 6, description: 'Drop spoonfuls on baking sheet and bake 9-11 minutes' }
        ],
        cookingTime: { prep: 20, cook: 11, total: 31 },
        servings: 20,
        difficulty: 'easy',
        cuisine: 'American',
        category: 'dessert',
        tags: ['cookies', 'dessert', 'chocolate', 'baking'],
        createdBy: sampleUser._id,
        isPublic: true
      },
      {
        title: 'Greek Salad',
        description: 'Fresh Mediterranean salad with feta cheese and olives',
        ingredients: [
          { name: 'tomatoes', quantity: '4', unit: 'pieces' },
          { name: 'cucumber', quantity: '1', unit: 'piece' },
          { name: 'red onion', quantity: '1', unit: 'piece' },
          { name: 'feta cheese', quantity: '200', unit: 'g' },
          { name: 'olives', quantity: '100', unit: 'g' },
          { name: 'olive oil', quantity: '4', unit: 'tbsp' },
          { name: 'lemon juice', quantity: '2', unit: 'tbsp' },
          { name: 'oregano', quantity: '1', unit: 'tsp' }
        ],
        instructions: [
          { step: 1, description: 'Chop tomatoes, cucumber, and red onion' },
          { step: 2, description: 'Combine vegetables in a large bowl' },
          { step: 3, description: 'Add feta cheese and olives' },
          { step: 4, description: 'Whisk olive oil, lemon juice, and oregano' },
          { step: 5, description: 'Pour dressing over salad and toss gently' }
        ],
        cookingTime: { prep: 15, cook: 0, total: 15 },
        servings: 4,
        difficulty: 'easy',
        cuisine: 'Greek',
        category: 'lunch',
        tags: ['salad', 'vegetarian', 'mediterranean', 'healthy'],
        createdBy: sampleUser._id,
        isPublic: true
      }
    ];

    // Clear existing recipes (optional - remove if you want to keep existing data)
    // await Recipe.deleteMany({});

    // Insert sample recipes
    const existingRecipes = await Recipe.find({ createdBy: sampleUser._id });
    if (existingRecipes.length === 0) {
      await Recipe.insertMany(sampleRecipes);
    }

    const totalRecipes = await Recipe.countDocuments();

    return NextResponse.json({
      success: true,
      message: `Database seeded successfully! Created sample user and recipes.`,
      data: {
        userId: sampleUser._id,
        userEmail: 'demo@example.com',
        userPassword: 'password123',
        totalRecipes: totalRecipes
      }
    });

  } catch (error) {
    console.error('Seed Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed database', details: error.message },
      { status: 500 }
    );
  }
}