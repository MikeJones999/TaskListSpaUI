import Navbar from "./components/Navbar"
import { Outlet } from "react-router-dom"
import { useAuth } from "./context/AuthContext"

export default function Layout() {
   const { isLoggedIn } = useAuth() //force the re-render issue on nav bar - doom!
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="pt-20 p-6">
        <Outlet />
      </main>
    </div>
  )
}
