import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-70 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-green-200 rounded-full opacity-60 animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-rose-200 rounded-full opacity-50"></div>
        <div className="absolute bottom-32 right-10 w-12 h-12 bg-teal-200 rounded-full opacity-80 animate-pulse"></div>
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Main heading */}
        <div className="mb-8">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-800 mb-6">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Recipe
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed">
            Discover delicious recipes with ingredients you already have. 
            Plan your meals and create smart grocery lists effortlessly.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link 
            href="/search-recipe"
            className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            🔍 Start Searching
          </Link>
          <Link 
            href="/meal-planning"
            className="w-full sm:w-auto bg-white text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-purple-200 hover:border-purple-400"
          >
            📅 Plan Meals
          </Link>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-1/4 left-1/4 text-6xl opacity-20 animate-spin-slow">🍕</div>
      <div className="absolute bottom-1/3 right-1/4 text-5xl opacity-20 animate-bounce">🥘</div>
      <div className="absolute top-1/3 right-1/3 text-4xl opacity-20">🍰</div>
    </div>
  );
}





