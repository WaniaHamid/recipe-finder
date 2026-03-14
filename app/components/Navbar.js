'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../../hooks/useApi';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md border-b-2 border-pink-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="bg-gradient-to-r from-pink-200 to-purple-200 p-2 rounded-full">
              <span className="text-2xl">🍳</span>
            </div>
            <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              RecipeFinder
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/search-recipe" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-full hover:bg-purple-100 transition">
              Search Recipes
            </Link>
            {/* <Link href="/grocery-list" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-full hover:bg-blue-100 transition">
              Grocery List
            </Link> */}
            <Link href="/meal-planning" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-full hover:bg-green-100 transition">
              Meal Planner
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/favorites" className="text-gray-700 hover:text-yellow-600 px-3 py-2 rounded-full hover:bg-yellow-100 transition">
                  Favorites
                </Link>
                <span className="text-sm text-gray-600 font-medium">Hi, {user.name}</span>
                <button
                  onClick={logout}
                  className="bg-gradient-to-r from-orange-200 to-red-200 text-gray-700 px-4 py-2 rounded-full hover:shadow-md hover:from-orange-300 hover:to-red-300 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-700 hover:text-teal-600 px-3 py-2 rounded-full hover:bg-teal-100 transition">
                  Login
                </Link>
                <Link href="/register" className="bg-gradient-to-r from-purple-200 to-pink-200 text-gray-700 px-4 py-2 rounded-full hover:shadow-md hover:from-purple-300 hover:to-pink-300 transition">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 p-2 rounded-full hover:bg-purple-100 transition"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-b from-pink-100 to-blue-100 px-4 py-4 space-y-2 shadow-inner">
          <Link href="/search-recipe" className="block text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md hover:bg-white hover:bg-opacity-60">
            🔍 Search Recipes
          </Link>
          {/* <Link href="/grocery-list" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md hover:bg-white hover:bg-opacity-60">
            🛒 Grocery List
          </Link> */}
          <Link href="/meal-planning" className="block text-gray-700 hover:text-green-600 px-3 py-2 rounded-md hover:bg-white hover:bg-opacity-60">
            📅 Meal Planner
          </Link>

          {user ? (
            <>
              <Link href="/favorites" className="block text-gray-700 hover:text-yellow-600 px-3 py-2 rounded-md hover:bg-white hover:bg-opacity-60">
                ❤️ Favorites
              </Link>
              <button
                onClick={logout}
                className="w-full text-left text-gray-700 hover:text-red-600 px-3 py-2 rounded-md hover:bg-white hover:bg-opacity-60"
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block text-gray-700 hover:text-teal-600 px-3 py-2 rounded-md hover:bg-white hover:bg-opacity-60">
                🔐 Login
              </Link>
              <Link href="/register" className="block text-gray-700 hover:text-pink-600 px-3 py-2 rounded-md hover:bg-white hover:bg-opacity-60">
                ✨ Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
