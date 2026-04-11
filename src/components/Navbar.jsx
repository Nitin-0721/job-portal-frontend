import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = localStorage.getItem("role");
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const studentLinks = [
    { label: "Jobs", path: "/" },
    { label: "Applied", path: "/my-applications" },
    { label: "Saved", path: "/saved-jobs" },
    { label: "Profile", path: "/profile" },
  ];

  const recruiterLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Post Job", path: "/post-job" },
    { label: "Applicants", path: "/applicants" },
  ];

  const links = role === "recruiter" ? recruiterLinks : studentLinks;

  return (
    <nav className="bg-[#0c0c0e] border-b border-[#1e1e22]">
      <div className="px-4 sm:px-8 py-4 flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="font-mono text-sm text-gray-200">
          work<span className="text-blue-400">.</span>find
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex gap-6">
          {links.map((link) => (
            <Link key={link.path} to={link.path}
              className={`text-xs transition-colors ${
                isActive(link.path) ? "text-gray-100" : "text-gray-500 hover:text-gray-300"
              }`}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* DESKTOP RIGHT */}
        <div className="hidden md:flex items-center gap-3">
          <button onClick={handleLogout}
            className="text-xs text-gray-500 hover:text-gray-300 border border-[#2a2a2e] rounded-lg px-3 py-1.5 transition-colors">
            Sign out
          </button>
          <Link to={role === "recruiter" ? "/dashboard" : "/profile"}
            className="w-8 h-8 rounded-full bg-blue-950 border border-blue-800 flex items-center justify-center text-xs font-mono font-semibold text-blue-400">
            {initials}
          </Link>
        </div>

        {/* MOBILE HAMBURGER */}
        <button onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-400 hover:text-gray-200 transition-colors p-1">
          {menuOpen ? (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="4" x2="16" y2="16"/>
              <line x1="16" y1="4" x2="4" y2="16"/>
            </svg>
          ) : (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="17" y2="6"/>
              <line x1="3" y1="10" x2="17" y2="10"/>
              <line x1="3" y1="14" x2="17" y2="14"/>
            </svg>
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#1e1e22] px-4 py-3 flex flex-col gap-1">
          {links.map((link) => (
            <Link key={link.path} to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`text-sm py-2.5 px-3 rounded-lg transition-colors ${
                isActive(link.path)
                  ? "text-gray-100 bg-[#141416]"
                  : "text-gray-500 hover:text-gray-300 hover:bg-[#141416]"
              }`}>
              {link.label}
            </Link>
          ))}
          <div className="border-t border-[#1e1e22] mt-2 pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-950 border border-blue-800 flex items-center justify-center text-xs font-mono font-semibold text-blue-400">
                {initials}
              </div>
              <span className="text-xs text-gray-400">{user?.name}</span>
            </div>
            <button onClick={handleLogout}
              className="text-xs text-red-400 border border-red-900 px-3 py-1.5 rounded-lg">
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
