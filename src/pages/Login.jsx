import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(email, password);
    if (result.success) {
      if (result.role === "recruiter") navigate("/dashboard");
      else navigate("/");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-mono text-sm text-gray-200 mb-1">
            work<span className="text-blue-400">.</span>find
          </p>
          <h1 className="text-2xl font-semibold text-gray-100 tracking-tight">Welcome back</h1>
          <p className="text-xs text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          {error && (
            <div className="text-xs text-red-400 bg-red-950 border border-red-900 rounded-xl px-4 py-3">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com" required
              className="bg-[#0f0f11] border border-[#1e1e22] rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-blue-500 transition-colors placeholder-gray-700" />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs text-gray-500">Password</label>
              <Link to="/forgot-password"
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                Forgot password?
              </Link>
            </div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" required
              className="bg-[#0f0f11] border border-[#1e1e22] rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-blue-500 transition-colors placeholder-gray-700" />
          </div>
          <button type="submit" disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-3 rounded-xl transition-colors mt-1 disabled:opacity-50">
            {loading ? "Signing in..." : "Sign in →"}
          </button>
        </form>

        <p className="text-xs text-gray-600 text-center mt-5">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:text-blue-300">Register</Link>
        </p>
      </div>
    </div>
  );
}
