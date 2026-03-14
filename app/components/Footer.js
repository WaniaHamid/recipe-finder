import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-pink-200 to-purple-200 p-2 rounded-full">
                <span className="text-2xl">🍳</span>
              </div>
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                RecipeFinder
              </span>
            </div>
            <p className="text-gray-700 mb-6 max-w-md">
              Discover delicious recipes, plan your meals, and create smart grocery lists. 
              Making cooking easier and more enjoyable for everyone.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-pink-100/40 p-2 rounded-full hover:bg-pink-100/60 transition-colors">
                <span className="text-xl">📘</span>
              </a>
              <a href="#" className="bg-blue-100/40 p-2 rounded-full hover:bg-blue-100/60 transition-colors">
                <span className="text-xl">🐦</span>
              </a>
              <a href="#" className="bg-green-100/40 p-2 rounded-full hover:bg-green-100/60 transition-colors">
                <span className="text-xl">📷</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-500">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/search-recipe" className="text-gray-700 hover:text-pink-500 transition-colors">
                  Search Recipes
                </Link>
              </li>
              {/* <li>
                <Link href="/grocery-list" className="text-gray-700 hover:text-blue-500 transition-colors">
                  Grocery Lists
                </Link>
              </li> */}
              <li>
                <Link href="/meal-planning" className="text-gray-700 hover:text-green-500 transition-colors">
                  Meal Planning
                </Link>
              </li>
              {/* <li>
                <Link href="/favorites" className="text-gray-700 hover:text-purple-500 transition-colors">
                  My Favorites
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-pink-500">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-700 hover:text-pink-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-orange-400 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-rose-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-purple-400 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter signup */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2 text-purple-500">Stay Updated</h3>
              <p className="text-gray-700">Get the latest recipes and cooking tips delivered to your inbox.</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2 rounded-l-full bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
              <button className="bg-gradient-to-r from-purple-400 to-pink-400 px-6 py-2 rounded-r-full text-white hover:from-purple-500 hover:to-pink-500 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-300 text-center">
          <p className="text-gray-500">
            © 2024 RecipeFinder. Made with ❤️ for food lovers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
