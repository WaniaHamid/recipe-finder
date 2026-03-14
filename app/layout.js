import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'RecipeFinder - Find Perfect Recipes with Your Ingredients',
  description: 'Discover delicious recipes using ingredients you already have. Plan meals, create grocery lists, and save your favorites.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#FFE1E6',
              color: '#374151',
              border: '1px solid #E8D5FF',
            },
          }}
        />
      </body>
    </html>
  )
}