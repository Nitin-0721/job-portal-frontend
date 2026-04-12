import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await API.post("/users/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
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
            Forgot password?
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {sent ? (
          <div className="flex flex-col gap-4 text-center">
            <div className="text-4xl">📬</div>
            <div className="bg-green-950 border border-green-900 rounded-xl px-4 py-4">
              <p className="text-sm text-green-400 font-medium">Reset link sent!</p>
              <p className="text-xs text-green-600 mt-1">
                Check your email inbox. The link expires in 15 minutes.
              </p>
            </div>
            <p className="text-xs text-gray-600">
              Didn't get it?{" "}
              <button onClick={() => setSent(false)}
                className="text-blue-400 hover:text-blue-300">
                Try again
              </button>
            </p>
            <Link to="/login"
              className="text-xs text-gray-500 hover:text-gray-300 underline underline-offset-4">
              ← Back to login
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
              <label className="text-xs text-gray-500">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="bg-[#0f0f11] border border-[#1e1e22] rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-blue-500 transition-colors placeholder-gray-700"
              />
            </div>
            <button type="submit" disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-3 rounded-xl transition-colors mt-1 disabled:opacity-50">
              {loading ? "Sending..." : "Send reset link →"}
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
