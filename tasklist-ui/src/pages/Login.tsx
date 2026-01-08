import { useState } from "react"

interface LoginFormData {
    username: string
    password: string
}
export default function Login() {
    const [formData, setFormData] = useState<LoginFormData>({ username: "", password: "" })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Form submitted:", formData)

    }


    return (


        <main className="flex min-h-[60vh] items-center justify-center">
            <div className="rounded-xl border border-blue-800 bg-blue-900/70 px-6 py-10 text-center shadow-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-300 mb-6">Login</p>
                <div className="space-y-4">
                    <div className="mb-4">
                        <label htmlFor="username" className="block mb-1 text-sm">Username:</label>
                        <input
                            className="bg-white text-slate-900 text-sm border border-slate-300 rounded px-3 py-1.5 w-full"
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
