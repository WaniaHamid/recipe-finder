'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Heart, 
  Calendar, 
  ShoppingCart, 
  TrendingUp,
  Clock,
  Users,
  Star
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    favoriteRecipes: 0,
    mealPlans: 0,
    groceryLists: 0,
    totalCookingTime: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData || userData === 'undefined' || userData === 'null') {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (!parsedUser || typeof parsedUser !== 'object') {
        router.push('/login');
        return;
      }
      setUser(parsedUser);
      if (parsedUser._id) {
        fetchDashboardData(parsedUser._id);
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.error('Error parsing user data:', e);
      router.push('/login');
    }
  }, [router]);

  const fetchDashboardData = async (userId) => {
    try {
      setLoading(true);
      
      const [favoritesRes, mealPlansRes, groceryListsRes, recipesRes] = await Promise.allSettled([
        fetch(`/api/favourites?userId=${userId}`),
        fetch(`/api/meal-plans?userId=${userId}`),
        fetch(`/api/grocery-lists?userId=${userId}`),
        fetch('/api/recipes?limit=5')
      ]);

      const getJson = async (resResult, fallback) => {
        if (resResult.status === 'fulfilled' && resResult.value?.ok) {
          try {
            return await resResult.value.json();
          } catch {
            return fallback;
          }
        }
        return fallback;
      };

      const favorites = await getJson(favoritesRes, { favorites: [] });
      const mealPlans = await getJson(mealPlansRes, { mealPlans: [] });
      const groceryLists = await getJson(groceryListsRes, { groceryLists: [] });
      const recipes = await getJson(recipesRes, { recipes: [] });

      setStats({
        favoriteRecipes: Array.isArray(favorites.favorites) ? favorites.favorites.length : 0,
        mealPlans: Array.isArray(mealPlans.mealPlans) ? mealPlans.mealPlans.length : 0,
        groceryLists: Array.isArray(groceryLists.groceryLists) ? groceryLists.groceryLists.length : 0,
        totalCookingTime: Array.isArray(favorites.favorites)
          ? favorites.favorites.reduce((total, recipe) => total + (recipe.cookingTime || 0), 0)
          : 0
      });

      setPopularRecipes(Array.isArray(recipes.recipes) ? recipes.recipes : []);
      
      setRecentActivity([
        { type: 'favorite', item: 'Spaghetti Carbonara', time: '2 hours ago' },
        { type: 'meal_plan', item: 'Weekly Meal Plan', time: '1 day ago' },
        { type: 'grocery_list', item: 'Weekend Shopping', time: '2 days ago' },
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Search Recipes',
      description: 'Find your next favorite dish',
      icon: Search,
      href: '/search-recipe',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'View Favorites',
      description: 'Your saved recipes',
      icon: Heart,
      href: '/favourites',
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      title: 'Plan Meals',
      description: 'Organize your weekly meals',
      icon: Calendar,
      href: '/meal-planning',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Grocery List',
      description: 'Create shopping lists',
      icon: ShoppingCart,
      href: '/grocery-list',
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || user?.username || 'Chef'}!
          </h1>
          <p className="text-gray-600">
            Here's what's cooking in your kitchen today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Favorite Recipes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.favoriteRecipes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Meal Plans</p>
                <p className="text-2xl font-bold text-gray-900">{stats.mealPlans}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Grocery Lists</p>
                <p className="text-2xl font-bold text-gray-900">{stats.groceryLists}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cook Time</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCookingTime}min</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => router.push(action.href)}
                  className={`${action.color} text-white p-6 rounded-lg transition-colors duration-200 text-left`}
                >
                  <Icon className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold text-lg mb-1">{action.title}</h3>
                  <p className="text-white/80 text-sm">{action.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center">
                      <div className="p-2 bg-orange-100 rounded-lg mr-4">
                        {activity.type === 'favorite' && <Heart className="w-4 h-4 text-orange-600" />}
                        {activity.type === 'meal_plan' && <Calendar className="w-4 h-4 text-orange-600" />}
                        {activity.type === 'grocery_list' && <ShoppingCart className="w-4 h-4 text-orange-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.item}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No recent activity</p>
              )}
            </div>
          </div>

          {/* Popular Recipes */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Popular Recipes</h2>
            </div>
            <div className="p-6">
              {popularRecipes.length > 0 ? (
                <div className="space-y-4">
                  {popularRecipes.map((recipe, index) => (
                    <div key={recipe._id} className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg mr-4 flex items-center justify-center">
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{recipe.title}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{recipe.cookingTime} min</span>
                          <Users className="w-3 h-3 ml-2 mr-1" />
                          <span>{recipe.servings} servings</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No recipes available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
