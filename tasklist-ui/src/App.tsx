import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from "./components/Navbar"
// import { Toaster } from "react-hot-toast"

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* <Toaster
        position="top-center"
        containerStyle={{
          top: 100, // Below navbar
        }}
        toastOptions={{
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
            fontSize: '16px',
          },
        }}
      /> */}
      <Navbar />
      <main className="pt-20 p-6">
        <Outlet />
      </main>
    </div>
  )
}
