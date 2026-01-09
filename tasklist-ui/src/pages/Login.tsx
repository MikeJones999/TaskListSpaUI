import { useState } from "react"
import { apiRequest } from "../services/apiService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"

interface LoginFormData {
    email: string
    password: string
}

interface LoginResponse {
    token: string,
    refreshToken: string
    isAuthorised: boolean
}

export default function Login() {
 
    const [formData, setFormData] = useState<LoginFormData>({ email: "", password: "" })
    const navigate = useNavigate();
    const { login } = useAuth() // ← use AuthContext login()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Form submitted:", formData)
        try {
                const result = await apiRequest<LoginResponse>("AuthInitiate/login", { method: "POST", body: { email: formData.email, password: formData.password } });
                console.log("Login response:", result)   
                  
                if (result.isAuthorised) {
                    setFormData({ email: "", password: "" });   
                    login(result.token, result.refreshToken)
                    navigate("/dashboard");
                }
            } catch (error) {
                console.error("Login error:", error);
            }   
    }


    return (
        <main className="flex min-h-[60vh] items-center justify-center">
            <div className="rounded-xl border border-blue-800 bg-blue-900/70 px-6 py-10 text-center shadow-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-300 mb-6">Login</p>
                <div className="space-y-4">
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-1 text-sm">Email:</label>
                        <input
                            className="bg-white text-slate-900 text-sm border border-slate-300 rounded px-3 py-1.5 w-full"
                            type="text"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block mb-1 text-sm">Password:</label>
                        <input
                            className="bg-white text-slate-900 text-sm border border-slate-300 rounded px-3 py-1.5 w-full"
                            type="password" id="password" name="password" value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button onClick={handleSubmit} className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded">Login</button>

                </div>
                <p className="mt-3 text-slate-300">Please enter you credentials to login.</p>
            </div>
        </main>

    )
}
