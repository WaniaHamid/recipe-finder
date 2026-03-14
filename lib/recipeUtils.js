// lib/recipeUtils.js
import Recipe from '../models/Recipe.js';
import { SavedRecipe, ShoppingList } from '../models/SavedRecipe.js';
import connectMongo from './mongodb.js';

// Recipe search and filtering utilities
export const recipeUtils = {
  // Search recipes by ingredients
  async searchByIngredients(ingredients, filters = {}) {
    try {
      await connectMongo();
      
      const ingredientArray = Array.isArray(ingredients) 
        ? ingredients 
        : ingredients.split(',').map(i => i.trim());

      let query = Recipe.findWithFilters({
        ingredients: ingredientArray,
        ...filters
      });

      // Apply sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'time':
            query = query.sort({ readyInMinutes: 1 });
            break;
          case 'popularity':
            query = query.sort({ aggregateLikes: -1 });
            break;
          case 'health':
            query = query.sort({ healthScore: -1 });
            break;
          default:
            query = query.sort({ createdAt: -1 });
        }
      }

      // Apply pagination
      const limit = parseInt(filters.limit) || 20;
      const skip = parseInt(filters.skip) || 0;
      
      const recipes = await query.limit(limit).skip(skip);
      const total = await Recipe.countDocuments(query.getQuery());

      return {
        recipes,
        total,
        hasMore: skip + limit < total
      };
    } catch (error) {
      console.error('Error searching recipes:', error);
      throw error;
    }
  },

  // Get recipe by ID (internal or Spoonacular)
  async getRecipeById(id, isSpoonacularId = false) {
    try {
      await connectMongo();
      
      const query = isSpoonacularId 
        ? { spoonacularId: parseInt(id) }
        : { _id: id };
        
      return await Recipe.findOne(query);
    } catch (error) {
      console.error('Error getting recipe:', error);
      throw error;
    }
  },

  // Save recipe from external API to database
  async saveExternalRecipe(recipeData) {
    try {
      await connectMongo();
      
      // Check if recipe already exists
      const existingRecipe = await Recipe.findOne({ 
        spoonacularId: recipeData.id 
      });
      
      if (existingRecipe) {
        return existingRecipe;
      }

      // Transform external recipe data to our schema
      const recipeDoc = new Recipe({
        title: recipeData.title,
        description: recipeData.summary?.replace(/<[^>]*>/g, '') || '',
        image: recipeData.image,
        servings: recipeData.servings,
        readyInMinutes: recipeData.readyInMinutes,
        preparationMinutes: recipeData.preparationMinutes || 0,
        cookingMinutes: recipeData.cookingMinutes || 0,
        ingredients: recipeData.extendedIngredients?.map(ingredient => ({
          id: ingredient.id,
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          original: ingredient.original
        })) || [],
        instructions: recipeData.analyzedInstructions?.[0]?.steps?.map(step => ({
          number: step.number,
          step: step.step
        })) || [],
        nutrition: {
          calories: recipeData.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount || 0,
          protein: recipeData.nutrition?.nutrients?.find(n => n.name === 'Protein')?.amount || 0,
          carbs: recipeData.nutrition?.nutrients?.find(n => n.name === 'Carbohydrates')?.amount || 0,
          fat: recipeData.nutrition?.nutrients?.find(n => n.name === 'Fat')?.amount || 0,
        },
        dishTypes: recipeData.dishTypes || [],
        cuisines: recipeData.cuisines || [],
        diets: recipeData.diets || [],
        spoonacularId: recipeData.id,
        sourceUrl: recipeData.sourceUrl,
        sourceName: recipeData.sourceName,
        aggregateLikes: recipeData.aggregateLikes || 0,
        healthScore: recipeData.healthScore || 0,
        pricePerServing: recipeData.pricePerServing || 0
      });

      return await recipeDoc.save();
    } catch (error) {
      console.error('Error saving external recipe:', error);
      throw error;
    }
  },

  // Get user's favorite recipes
  async getUserFavorites(userId, page = 1, limit = 20) {
    try {
      await connectMongo();
      
      const skip = (page - 1) * limit;
      
      const favorites = await SavedRecipe.find({ 
        userId, 
        isFavorite: true 
      })
      .populate('recipeId')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

      const total = await SavedRecipe.countDocuments({ 
        userId, 
        isFavorite: true 
      });

      return {
        favorites,
        total,
        hasMore: skip + limit < total
      };
    } catch (error) {
      console.error('Error getting user favorites:', error);
      throw error;
    }
  },

  // Add recipe to favorites
  async addToFavorites(userId, recipeId, isSpoonacular = false, recipeSnapshot = null) {
    try {
      await connectMongo();
      
      const saveData = {
        userId,
        ...(isSpoonacular 
          ? { spoonacularId: recipeId, recipeSnapshot }
          : { recipeId }
        ),
        isFavorite: true
      };

      return await SavedRecipe.findOneAndUpdate(
        isSpoonacular 
          ? { userId, spoonacularId: recipeId }
          : { userId, recipeId },
        saveData,
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  },

  // Remove from favorites
  async removeFromFavorites(userId, recipeId, isSpoonacular = false) {
    try {
      await connectMongo();
      
      const query = isSpoonacular 
        ? { userId, spoonacularId: recipeId }
        : { userId, recipeId };

      return await SavedRecipe.findOneAndDelete(query);
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  },

  // Generate shopping list from recipe
  async generateShoppingList(userId, recipeId, isSpoonacular = false) {
    try {
      await connectMongo();
      
      let recipe;
      if (isSpoonacular) {
        recipe = await Recipe.findOne({ spoonacularId: recipeId });
      } else {
        recipe = await Recipe.findById(recipeId);
      }

      if (!recipe) {
        throw new Error('Recipe not found');
      }

      // Create shopping list items from recipe ingredients
      const items = recipe.ingredients.map(ingredient => ({
        ingredientName: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        originalText: ingredient.original,
        category: categorizeIngredient(ingredient.name),
        isPurchased: false
      }));

      const shoppingList = new ShoppingList({
        userId,
        name: `Shopping list for ${recipe.title}`,
        items,
        recipeReferences: [{
          ...(isSpoonacular 
            ? { spoonacularId: recipeId }
            : { recipeId }
          ),
          recipeName: recipe.title
        }]
      });

      return await shoppingList.save();
    } catch (error) {
      console.error('Error generating shopping list:', error);
      throw error;
    }
  },

  // Get popular recipes
  async getPopularRecipes(limit = 10) {
    try {
      await connectMongo();
      
      return await Recipe.find()
        .sort({ aggregateLikes: -1, healthScore: -1 })
        .limit(limit);
    } catch (error) {
      console.error('Error getting popular recipes:', error);
      throw error;
    }
  }
};

// Helper function to categorize ingredients
function categorizeIngredient(ingredientName) {
  const name = ingredientName.toLowerCase();
  
  const categories = {
    'Produce': ['tomato', 'onion', 'garlic', 'lettuce', 'spinach', 'carrot', 'potato', 'apple', 'banana', 'lemon'],
    'Meat & Seafood': ['chicken', 'beef', 'pork', 'fish', 'salmon', 'shrimp', 'turkey'],
    'Dairy': ['milk', 'cheese', 'butter', 'yogurt', 'cream', 'eggs'],
    'Grains & Bread': ['rice', 'pasta', 'bread', 'flour', 'oats', 'quinoa'],
    'Pantry': ['oil', 'vinegar', 'salt', 'pepper', 'sugar', 'honey', 'spices'],
    'Frozen': ['frozen'],
    'Beverages': ['juice', 'soda', 'water', 'coffee', 'tea']
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => name.includes(keyword))) {
      return category;
    }
  }
  
  return 'Other';
}

export default recipeUtils;