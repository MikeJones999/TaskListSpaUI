import { Link } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isLoggedIn } = useAuth();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-700">
      <div className="mx-auto max-w-screen-2xl h-20 flex items-center justify-between px-4 md:px-8">
       
        <Link to="/" className="text-white font-bold text-xl md:text-2xl">
          Task Manager
        </Link>

        {/* Desktop Navigation - hidden on mobile  ** Asked AI to help with responsiveness */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          <Link to="/" className="text-white font-semibold text-base lg:text-lg hover:text-blue-100 transition">
            Home
          </Link>
             {isLoggedIn && (
              <>
          <Link to="/dashboard" className="text-white font-semibold text-base lg:text-lg hover:text-blue-100 transition">
            Dashboard
          </Link>
          <Link to="/tasklists" className="text-white font-semibold text-base lg:text-lg hover:text-blue-100 transition">
            Tasklists
          </Link>   
          </>)}
        </div>

        {/* Desktop Auth Links - hidden on mobile * * Asked AI to help with responsiveness */}
        <div className="hidden md:flex items-center gap-6">
          {!isLoggedIn && (
            <>
              <Link to="/login" className="text-white font-semibold text-base lg:text-lg hover:text-blue-100 transition">
                Login
              </Link>
              <Link to="/register" className="text-white font-semibold text-base lg:text-lg hover:text-blue-100 transition">
                Register
              </Link>
            </>
          )}
          {isLoggedIn && (
            <>
              <Link to="/userprofile" className="text-white font-semibold text-base lg:text-lg hover:text-blue-100 transition">
                User Profile
              </Link>
               <Link to="/logout" className="text-white font-semibold text-base lg:text-lg hover:text-blue-100 transition">
                Logout
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-blue-600 border-t border-blue-400">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block text-white font-semibold text-lg py-2 hover:bg-white/10 rounded px-3 transition"
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="block text-white font-semibold text-lg py-2 hover:bg-white/10 rounded px-3 transition"
            >
              Dashboard
            </Link>
            <Link
              to="/tasklists"
              onClick={() => setIsMenuOpen(false)}
              className="block text-white font-semibold text-lg py-2 hover:bg-white/10 rounded px-3 transition"
            >
              Tasklists
            </Link>
            <Link
              to="/userprofile"
              onClick={() => setIsMenuOpen(false)}
              className="block text-white font-semibold text-lg py-2 hover:bg-white/10 rounded px-3 transition"
            >
              User Profile
            </Link>
            <div className="border-t border-blue-400 pt-3 mt-3 space-y-3">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block text-white font-semibold text-lg py-2 hover:bg-white/10 rounded px-3 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="block text-white font-semibold text-lg py-2 hover:bg-white/10 rounded px-3 transition"
              >
                Register
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-left text-white font-semibold text-lg py-2 hover:bg-white/10 rounded px-3 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
