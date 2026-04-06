import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = localStorage.getItem("role");
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
    { label: "My Jobs", path: "/manage-jobs" },
    { label: "Applicants", path: "/applicants" },
  ];

  const links = role === "recruiter" ? recruiterLinks : studentLinks;

  return (
    <nav className="flex justify-between items-center px-8 py-4 border-b border-[#1e1e22] bg-[#0c0c0e]">
      {/* LOGO */}
      <Link to="/" className="font-mono text-sm text-gray-200">
        work<span className="text-blue-400">.</span>find
      </Link>

      {/* NAV LINKS */}
      <div className="flex gap-6">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`text-xs transition-colors ${
              isActive(link.path)
                ? "text-gray-100"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleLogout}
          className="text-xs text-gray-500 hover:text-gray-300 border border-[#2a2a2e] rounded-lg px-3 py-1.5 transition-colors"
        >
          Sign out
        </button>
        <Link
          to={role === "recruiter" ? "/dashboard" : "/profile"}
          className="w-8 h-8 rounded-full bg-blue-950 border border-blue-800 flex items-center justify-center text-xs font-mono font-semibold text-blue-400"
        >
          {initials}
        </Link>
      </div>
    </nav>
  );
}
