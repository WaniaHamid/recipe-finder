// import mongoose from 'mongoose';

// const groceryListSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: [true, 'Grocery list title is required'],
//     trim: true,
//     maxlength: [100, 'Title cannot exceed 100 characters']
//   },
//   description: {
//     type: String,
//     trim: true,
//     maxlength: [300, 'Description cannot exceed 300 characters']
//   },
//   items: [{
//     name: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     quantity: {
//       type: String,
//       required: true
//     },
//     unit: {
//       type: String,
//       required: true
//     },
//     category: {
//       type: String,
//       enum: ['produce', 'dairy', 'meat', 'pantry', 'frozen', 'bakery', 'beverages', 'snacks', 'other'],
//       default: 'other'
//     },
//     isCompleted: {
//       type: Boolean,
//       default: false
//     },
//     price: {
//       type: Number,
//       min: 0
//     },
//     notes: {
//       type: String,
//       trim: true
//     }
//   }],
//   generatedFrom: {
//     mealPlan: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'MealPlan'
//     },
//     recipes: [{
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Recipe'
//     }]
//   },
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   isCompleted: {
//     type: Boolean,
//     default: false
//   },
//   completedAt: {
//     type: Date
//   },
//   totalEstimatedCost: {
//     type: Number,
//     default: 0,
//     min: 0
//   },
//   actualCost: {
//     type: Number,
//     min: 0
//   },
//   sharedWith: [{
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },
//     permission: {
//       type: String,
//       enum: ['view', 'edit'],
//       default: 'view'
//     }
//   }]
// }, {
//   timestamps: true
// });

// // Pre-save middleware to update completion status
// groceryListSchema.pre('save', function(next) {
//   if (this.isCompleted && !this.completedAt) {
//     this.completedAt = new Date();
//   } else if (!this.isCompleted && this.completedAt) {
//     this.completedAt = undefined;
//   }
//   next();
// });

// // Create indexes
// groceryListSchema.index({ createdBy: 1 });
// groceryListSchema.index({ isCompleted: 1 });
// groceryListSchema.index({ createdAt: -1 });

// const GroceryList = mongoose.models.GroceryList || mongoose.model('GroceryList', groceryListSchema);

// export default GroceryList;