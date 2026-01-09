import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"

export default function Logout() {
    const { logout } = useAuth()
    const navigate = useNavigate();
    const handleLogout = (e : React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        logout();      
        navigate("/");
    }



    return (
    <main className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-6 py-10 text-center shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-300">Logout</p>
            <h1 className="mt-3 text-4xl font-bold text-slate-50">Please confirm your logout</h1>
            <button onClick={handleLogout} className="mt-6 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Logout</button>
            <p className="mt-3 text-slate-300">Thanks for visiting</p>
        </div>
        </main>
  )
}
