import mongoose from 'mongoose';

// Delete the model if it exists to avoid conflicts
if (mongoose.models.User) {
  delete mongoose.models.User;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  favoriteRecipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  mealPlans: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MealPlan'
  }],
  groceryLists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GroceryList'
  }],
  preferences: {
    dietaryRestrictions: [{
      type: String,
      enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'low-carb', 'keto']
    }],
    cuisinePreferences: [String],
    allergies: [String]
  }
}, {
  timestamps: true
});

// Only create the email index, no username index
// userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ favoriteRecipes: 1 });

const User = mongoose.model('User', userSchema);

export default User;