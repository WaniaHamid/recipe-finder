/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: '#FFE1E6',
          purple: '#E8D5FF',
          blue: '#D1E7FF',
          green: '#D4F5D4',
          yellow: '#FFF2CC',
          orange: '#FFE5B4',
          coral: '#FFD4C4',
          mint: '#C7F7F7',
          lavender: '#F0E6FF',
          peach: '#FFE4D6'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'pastel-gradient': 'linear-gradient(135deg, #FFE1E6, #E8D5FF, #D1E7FF)',
      },
    },
  },
  plugins: [],
}