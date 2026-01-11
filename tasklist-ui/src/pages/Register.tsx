import { useState } from "react"
import { apiRequest } from "../services/apiService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"
import ToastWrapper from "../components/toastWrapper";
import type { RegisterFormData } from "../models/RegisterFormData";
import RegisterUserValidationHelper from "../utils/RegisterUserValidationHelper";

interface RegisterResponse {
    errors: RegisterErrors,
    isSuccessful: boolean
}

interface RegisterErrors {
    ConfirmPassword: string[],
    Password: string[],
    Email: string[],
    UserName: string[]
}

export default function Register() {
 
    const [formData, setFormData] = useState<RegisterFormData>({ 
        userName: "", displayName: "", email: "", password: "", confirmPassword: ""
     })
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const validationResult =  RegisterUserValidationHelper(formData);
        if (validationResult.isError) {
            toast.error(validationResult.text);
            return;
        }

        try {
                const result = await apiRequest<RegisterResponse>("AuthInitiate/register", { 
                    method: "POST",
                    body: { 
                        userName: formData.userName, 
                        displayName: formData.displayName, 
                        email: formData.email, 
                        password: formData.password, 
                        confirmPassword: formData.confirmPassword 
                    },
                    skipErrorHandling: true
                 });

                //console.log("Register response:", result)                     
                if (result.isSuccessful) {
                    setFormData({ userName: "", displayName: "", email: "", password: "", confirmPassword: "" });   
                    toast.success("Registration successful!");
                    navigate("/login");
                }
                else{
                    const confirmPasswordErrors = result.errors.ConfirmPassword ? result.errors.ConfirmPassword[0] : undefined;
                    const passwordErrors =  result.errors.Password ? result.errors.Password[0] : undefined;
                    const emailErrors = result.errors.Email ? result.errors.Email[0] : undefined;
                    const userNameErrors = result.errors.UserName ? result.errors.UserName[0] : undefined;
                    const error = confirmPasswordErrors || passwordErrors || emailErrors || userNameErrors || "Registration failed. Please check your input.";
                    //console.log("Register failed - showing error toast", error);
                    toast.error(`${error}`);
                }
            } catch (error: any) {
                //console.error("Register error:", error);
                toast.error("An error occurred. Please try again.");
            }   
        }


    return (
        <main className="flex min-h-[60vh] items-center justify-center">           
           <ToastWrapper />
            <div className="rounded-xl border border-blue-800 bg-blue-900/70 px-6 py-10 text-center shadow-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-300 mb-6">Register</p>
                <div className="space-y-4">
                    <div className="mb-4">
                        <label htmlFor="userName" className="block mb-1 text-sm">Username:</label>
                        <input
                            className="bg-white text-slate-900 text-sm border border-slate-300 rounded px-3 py-1.5 w-full"
                            type="text"
                            id="userName"
                            name="userName"
                            value={formData.userName}
                            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="displayName" className="block mb-1 text-sm">Display Name:</label>
                        <input
                            className="bg-white text-slate-900 text-sm border border-slate-300 rounded px-3 py-1.5 w-full"
                            type="text"
                            id="displayName"
                            name="displayName"
                            value={formData.displayName}
                            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        />
                    </div>

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

                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-1 text-sm">Password:</label>
                        <input
                            className="bg-white text-slate-900 text-sm border border-slate-300 rounded px-3 py-1.5 w-full"
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block mb-1 text-sm">Confirm Password:</label>
                        <input
                            className="bg-white text-slate-900 text-sm border border-slate-300 rounded px-3 py-1.5 w-full"
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
                    </div>

                    <button onClick={handleSubmit} className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded">Register</button>
                </div>
                <p className="mt-3 text-slate-300">Please enter you credentials to register.</p>
            </div>
        </main>

    )
}