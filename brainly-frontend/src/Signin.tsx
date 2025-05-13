import { useRef } from "react";
import { BACKEND_URL } from "./config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Signin() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();
    async function handleSignin(e: React.FormEvent) {
        e.preventDefault();
    
        if (!usernameRef.current || !passwordRef.current) {
            alert("Please fill in all fields.");
            return;
        }
    
        const credentials = {
            username: usernameRef.current?.value,
            password: passwordRef.current?.value,
        };
    
        try {
            const response = await axios.post(BACKEND_URL + "/api/v1/signin", credentials, {
                headers: {
                    "Content-Type": "application/json"
                }
            });            
            alert("Login successful!");
            navigate("/dashboard");

            const jwt = response.data.token;
            localStorage.setItem("token", jwt);
            
        } catch (error) {
            console.error("Error signing in:", error);
            alert("Login failed. Please check your credentials.");
        }
    
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-4">Sign In</h2>
                <form className="space-y-4" onSubmit={handleSignin}>
                    <div>
                        <label className="block text-sm font-medium">Username</label>
                        <input
                            type="text"
                            ref={usernameRef}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            ref={passwordRef}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}
