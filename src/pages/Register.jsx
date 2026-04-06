import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function Register() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    const result = await register(form.name, form.email, form.password, form.role);
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
          <h1 className="text-2xl font-semibold text-gray-100 tracking-tight">Create account</h1>
          <p className="text-xs text-gray-500 mt-1">Join thousands of job seekers and recruiters</p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          {error && (
            <div className="text-xs text-red-400 bg-red-950 border border-red-900 rounded-xl px-4 py-3">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500">Full Name</label>
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="Your full name" required
              className="bg-[#0f0f11] border border-[#1e1e22] rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-blue-500 transition-colors placeholder-gray-700" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="your@email.com" required
              className="bg-[#0f0f11] border border-[#1e1e22] rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-blue-500 transition-colors placeholder-gray-700" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange}
              placeholder="Min 6 characters" required
              className="bg-[#0f0f11] border border-[#1e1e22] rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-blue-500 transition-colors placeholder-gray-700" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500">I am a</label>
            <select name="role" value={form.role} onChange={handleChange}
              className="bg-[#0f0f11] border border-[#1e1e22] rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-blue-500 transition-colors">
              <option value="student">Student / Job Seeker</option>
              <option value="recruiter">Recruiter / Employer</option>
            </select>
          </div>
          <button type="submit" disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-3 rounded-xl transition-colors mt-1 disabled:opacity-50">
            {loading ? "Creating account..." : "Create account →"}
          </button>
        </form>

        <p className="text-xs text-gray-600 text-center mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
