import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from "./components/Navbar"

// function App() {
//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-slate-950 text-slate-50 pt-24">
//         <div className="mx-auto max-w-5xl px-4 py-10">
//           <Outlet />
//         </div>
//       </div>
//     </>
//   )
// }

// export default App


// import { Outlet } from "react-router-dom"
// import Navbar from "./components/Navbar"

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="pt-20 p-6">
        <Outlet />
      </main>
    </div>
  )
}
