export default function Features() {
  const features = [
    {
      icon: "🔍",
      title: "Ingredient-Based Search",
      description: "Enter ingredients you have at home and discover recipes that use them. No more wondering what to cook!",
      color: "from-pink-200 to-pink-100"
    },
    // {
    //   icon: "❤️",
    //   title: "Save Favorites",
    //   description: "Keep track of recipes you love with our favorites system. Access them anytime, anywhere.",
    //   color: "from-purple-200 to-purple-100"
    // },
    // {
    //   icon: "🛒",
    //   title: "Smart Grocery Lists",
    //   description: "Generate grocery lists from recipes and check off items as you shop. Never forget an ingredient again!",
    //   color: "from-blue-200 to-teal-100"
    // },
    {
      icon: "📊",
      title: "Advanced Filters",
      description: "Filter recipes by meal type, prep time, calories, and dietary restrictions to find exactly what you need.",
      color: "from-green-200 to-yellow-100"
    },
    {
      icon: "🗓️",
      title: "Meal Planning",
      description: "Plan your weekly meals in advance. Organize breakfast, lunch, dinner, and snacks for each day.",
      color: "from-orange-200 to-orange-100"
    },
    // {
    //   icon: "⚡",
    //   title: "Quick & Easy",
    //   description: "Fast loading times and intuitive interface make recipe hunting a breeze. Spend more time cooking!",
    //   color: "from-teal-200 to-blue-100"
    // }
  ];

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-pink-50 to-rose-100">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">
            Why Choose
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"> RecipeFinder</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our platform combines smart technology with culinary expertise to make cooking easier,
            more enjoyable, and perfectly tailored to your needs.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-md border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <span className="text-2xl">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
              <div className={`mt-5 h-1 bg-gradient-to-r ${feature.color} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300`} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-purple-200 to-pink-200 p-10 rounded-3xl shadow-lg border border-pink-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Ready to Start Cooking?</h3>
            <p className="text-gray-700 max-w-2xl mx-auto mb-6">
              Join thousands of home cooks who have transformed their kitchen experience with RecipeFinder.
            </p>
            <a
              href="/search-recipe"
              className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition"
            >
              Get Started Today
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
