import mongoose from 'mongoose';

const mealPlanSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Meal plan title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [300, 'Description cannot exceed 300 characters']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  meals: [{
    date: {
      type: Date,
      required: true
    },
    breakfast: {
      recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
      },
      servings: {
        type: Number,
        default: 1,
        min: 1
      }
    },
    lunch: {
      recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
      },
      servings: {
        type: Number,
        default: 1,
        min: 1
      }
    },
    dinner: {
      recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
      },
      servings: {
        type: Number,
        default: 1,
        min: 1
      }
    },
    snacks: [{
      recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
      },
      servings: {
        type: Number,
        default: 1,
        min: 1
      }
    }]
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sharedWith: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    permission: {
      type: String,
      enum: ['view', 'edit'],
      default: 'view'
    }
  }]
}, {
  timestamps: true
});

// Validation to ensure end date is after start date
mealPlanSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  } else {
    next();
  }
});

// Create indexes
mealPlanSchema.index({ createdBy: 1 });
mealPlanSchema.index({ startDate: 1 });
mealPlanSchema.index({ endDate: 1 });
mealPlanSchema.index({ isActive: 1 });

const MealPlan = mongoose.models.MealPlan || mongoose.model('MealPlan', mealPlanSchema);

export default MealPlan;