import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

// Generate daily key
const getTodayKey = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `IGIDR${year}${month}${day}`;
};

const Login = () => {
    const [accessKey, setAccessKey] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault(); // prevent page reload on Enter
        if (accessKey === getTodayKey()) {
            login();
            navigate("/home");
        } else {
            setError("Incorrect key. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-pink-100 p-6">
            <form
                onSubmit={handleLogin}
                className="bg-white shadow-xl p-8 rounded-2xl w-full max-w-sm text-center space-y-6"
            >
                <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
                <input
                    type="text"
                    className="border border-gray-300 px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="Passkey as given by I.T. Department........."
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                    Unlock Dashboard
                </button>
            </form>
        </div>
    );
};

export default Login;
