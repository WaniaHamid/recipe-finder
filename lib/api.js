import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important: This ensures cookies are sent with requests
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Clear server-side cookie
      fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      }).catch(() => {});
      
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Auth endpoints
  register: (userData) => api.post('/api/auth/register', userData),
  login: (credentials) => api.post('/api/auth/login', credentials),
  
  // Recipe endpoints
  
  
  searchRecipes: async (ingredients, filters = {}) => {
    const query = new URLSearchParams({
      ingredients,
      mealType: filters.mealType || '',
      maxTime: filters.maxTime || '',
      maxCalories: filters.maxCalories || '',
      diet: filters.diet || '',
    }).toString();

    return api.get(`/api/search?${query}`);
  },
  
  getRecipeDetails: (id) => api.get(`/api/recipes/${id}`),
  
  // User endpoints
  getFavorites: () => api.get('/api/favourites'),
  addToFavorites: (recipe) => api.post('/api/favourites', recipe),
  removeFromFavorites: (recipeId) => api.delete(`/api/favourites/${recipeId}`),
  
  // Grocery list endpoints
  getGroceryLists: () => api.get('/api/grocery-lists'),
  createGroceryList: (listData) => api.post('/api/grocery-lists', listData),
  updateGroceryList: (id, listData) => api.put(`/api/grocery-lists/${id}`, listData),
  deleteGroceryList: (id) => api.delete(`/api/grocery-lists/${id}`),
  
  // Meal planning endpoints
  getMealPlans: () => api.get('/api/meal-plans'),
  saveMealPlan: (mealPlan) => api.post('/api/meal-plans', mealPlan),
  updateMealPlan: (date, mealPlan) => api.put(`/api/meal-plans/${date}`, mealPlan),
};

export default api;