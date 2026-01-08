import { Link, useNavigate } from "react-router-dom"

export default function Navbar() {

    console.log("Navbar inside router:", typeof useNavigate === "function")
  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-20 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-700">
      <div className="mx-auto max-w-screen-2xl h-full flex items-center justify-between px-8">
        {/* Left group */}
        <div className="flex items-center gap-10">
          <Link to="/" className="text-white font-semibold text-lg hover:text-blue-100">Home</Link>
          <Link to="/dashboard" className="text-white font-semibold text-lg hover:text-blue-100">Dashboard</Link>
          <Link to="/tasklists" className="text-white font-semibold text-lg hover:text-blue-100">Tasklists</Link>
          <Link to="/profile" className="text-white font-semibold text-lg hover:text-blue-100">Profile</Link>
        </div>

        {/* Right group */}
        <div className="flex items-center gap-8">
          <Link to="/login" className="text-white font-semibold text-lg hover:text-blue-100">Login</Link>
          <Link to="/register" className="text-white font-semibold text-lg hover:text-blue-100">Register</Link>
          <button className="text-white font-semibold text-lg hover:text-blue-100">Logout</button>
        </div>
      </div>
    </nav>
  )
}
