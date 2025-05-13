import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "./config";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link component

export function Signup() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();
    
    async function signup(e: React.FormEvent) {
        e.preventDefault(); 

        if (!usernameRef.current || !passwordRef.current) {
            alert("Please fill in all fields.");
            return;
        }

        const userData = {
            username: usernameRef.current?.value,
            password: passwordRef.current?.value,
        };

        try {
            await axios.post(BACKEND_URL + "/api/v1/signup", userData);
            alert("You have signed up!!");
            navigate("/login");
        } catch (error) {
            console.error("Error signing up:", error);
            alert("Something went wrong. Please try again.");
        }
    }
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
                <form className="space-y-4" onSubmit={signup}>
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
                        Sign Up
                    </button>
                    <div>
                        Already have an account? 
                        <Link to="/signin" className="text-blue-500 hover:text-blue-700 pl-2">Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
