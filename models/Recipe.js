import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Recipe title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  ingredients: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: String,
      required: true
    },
    unit: {
      type: String,
      required: true
    }
  }],
  instructions: [{
    step: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    }
  }],
  cookingTime: {
    prep: {
      type: Number,
      required: true,
      min: 0
    },
    cook: {
      type: Number,
      required: true,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  servings: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  cuisine: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'appetizer'],
    required: true
  },
  tags: [String],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number
  },
  imageUrl: {
    type: String,
    default: '/images/default-recipe.jpg'
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create text indexes for search functionality
recipeSchema.index({
  title: 'text',
  description: 'text',
  'ingredients.name': 'text',
  cuisine: 'text',
  tags: 'text'
});

// Create other indexes for performance
recipeSchema.index({ category: 1 });
recipeSchema.index({ cuisine: 1 });
recipeSchema.index({ difficulty: 1 });
recipeSchema.index({ 'rating.average': -1 });
recipeSchema.index({ createdAt: -1 });
recipeSchema.index({ createdBy: 1 });

const Recipe = mongoose.models.Recipe || mongoose.model('Recipe', recipeSchema);

export default Recipe;