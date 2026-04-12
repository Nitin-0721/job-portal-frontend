import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }
    if (password !== confirm) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    try {
      await API.post(`/users/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. Link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="mb-8 text-center">
          <p className="font-mono text-sm text-gray-200 mb-1">
            work<span className="text-blue-400">.</span>find
          </p>
          <h1 className="text-2xl font-semibold text-gray-100 tracking-tight">
            Set new password
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Enter your new password below
          </p>
        </div>

        {success ? (
          <div className="flex flex-col gap-4 text-center">
            <div className="text-4xl">✅</div>
            <div className="bg-green-950 border border-green-900 rounded-xl px-4 py-4">
              <p className="text-sm text-green-400 font-medium">Password reset successfully!</p>
              <p className="text-xs text-green-600 mt-1">
                Redirecting you to login in 3 seconds...
              </p>
            </div>
            <Link to="/login"
              className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-4">
              Go to login →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {error && (
              <div className="text-xs text-red-400 bg-red-950 border border-red-900 rounded-xl px-4 py-3">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
                className="bg-[#0f0f11] border border-[#1e1e22] rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-blue-500 transition-colors placeholder-gray-700"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your password"
                required
                className="bg-[#0f0f11] border border-[#1e1e22] rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-blue-500 transition-colors placeholder-gray-700"
              />
            </div>

            {/* Password strength indicator */}
            {password && (
              <div className="flex gap-1 mt-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${
                    password.length >= (i + 1) * 3
                      ? password.length >= 10 ? "bg-green-500"
                        : password.length >= 6 ? "bg-yellow-500"
                        : "bg-red-500"
                      : "bg-[#1e1e22]"
                  }`} />
                ))}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-3 rounded-xl transition-colors mt-1 disabled:opacity-50">
              {loading ? "Resetting..." : "Reset Password →"}
            </button>
            <Link to="/login"
              className="text-xs text-gray-600 text-center hover:text-gray-300 transition-colors">
              ← Back to login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
