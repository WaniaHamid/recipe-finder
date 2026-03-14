// User validation
export const validateUser = (userData) => {
  const errors = {};
  // Username validation
  if (!userData.username) {
    errors.username = 'Username is required';
  } else if (userData.username.length < 3) {
    errors.username = 'Username must be at least 3 characters long';
  } else if (userData.username.length > 20) {
    errors.username = 'Username must be less than 20 characters';
  } else if (!/^[a-zA-Z0-9_]+$/.test(userData.username)) {
    errors.username = 'Username can only contain letters, numbers, and underscores';
  }
  // Email validation
  if (!userData.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  // Password validation
  if (!userData.password) {
    errors.password = 'Password is required';
  } else if (userData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(userData.password)) {
    errors.password = 'Password must contain at least one letter and one number';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Recipe validation
export const validateRecipe = (recipeData) => {
  const errors = {};
  // Title validation
  if (!recipeData.title) {
    errors.title = 'Recipe title is required';
  } else if (recipeData.title.length < 3) {
    errors.title = 'Title must be at least 3 characters long';
  } else if (recipeData.title.length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }
  // Description validation
  if (!recipeData.description) {
    errors.description = 'Description is required';
  } else if (recipeData.description.length < 10) {
    errors.description = 'Description must be at least 10 characters long';
  } else if (recipeData.description.length > 500) {
    errors.description = 'Description must be less than 500 characters';
  }
  // Ingredients validation
  if (!recipeData.ingredients || !Array.isArray(recipeData.ingredients)) {
    errors.ingredients = 'Ingredients must be an array';
  } else if (recipeData.ingredients.length === 0) {
    errors.ingredients = 'At least one ingredient is required';
  } else {
    const invalidIngredients = recipeData.ingredients.filter(ingredient => 
      !ingredient || typeof ingredient !== 'string' || ingredient.trim().length === 0
    );
    if (invalidIngredients.length > 0) {
      errors.ingredients = 'All ingredients must be non-empty strings';
    }
  }
  // Instructions validation
  if (!recipeData.instructions || !Array.isArray(recipeData.instructions)) {
    errors.instructions = 'Instructions must be an array';
  } else if (recipeData.instructions.length === 0) {
    errors.instructions = 'At least one instruction is required';
  } else {
    const invalidInstructions = recipeData.instructions.filter(instruction => 
      !instruction || typeof instruction !== 'string' || instruction.trim().length === 0
    );
    if (invalidInstructions.length > 0) {
      errors.instructions = 'All instructions must be non-empty strings';
    }
  }
  // Cooking time validation
  if (recipeData.cookingTime !== undefined) {
    if (typeof recipeData.cookingTime !== 'number') {
      errors.cookingTime = 'Cooking time must be a number';
    } else if (recipeData.cookingTime < 1) {
      errors.cookingTime = 'Cooking time must be at least 1 minute';
    } else if (recipeData.cookingTime > 1440) {
      errors.cookingTime = 'Cooking time must be less than 24 hours (1440 minutes)';
    }
  }
  // Prep time validation
  if (recipeData.prepTime !== undefined) {
    if (typeof recipeData.prepTime !== 'number') {
      errors.prepTime = 'Prep time must be a number';
    } else if (recipeData.prepTime < 0) {
      errors.prepTime = 'Prep time cannot be negative';
    } else if (recipeData.prepTime > 1440) {
      errors.prepTime = 'Prep time must be less than 24 hours (1440 minutes)';
    }  
  }
  // Servings validation
  if (recipeData.servings !== undefined) {
    if (typeof recipeData.servings !== 'number') {
      errors.servings = 'Servings must be a number';
    } else if (recipeData.servings < 1) {
      errors.servings = 'Servings must be at least 1';
    } else if (recipeData.servings > 100) {
      errors.servings = 'Servings must be less than 100';
    }
  }
  // Difficulty validation
  if (recipeData.difficulty !== undefined) {
    const validDifficulties = ['easy', 'medium', 'hard'];
    if (!validDifficulties.includes(recipeData.difficulty.toLowerCase())) {
      errors.difficulty = 'Difficulty must be easy, medium, or hard';
    }
  }
  // Category validation
  if (recipeData.category && typeof recipeData.category !== 'string') {
    errors.category = 'Category must be a string';
  } else if (recipeData.category && recipeData.category.length > 50) {
    errors.category = 'Category must be less than 50 characters';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};