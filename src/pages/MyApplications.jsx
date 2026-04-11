import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

const STATUS_CONFIG = {
  pending: {
    label: "Under Review", color: "text-yellow-400",
    bg: "bg-yellow-950 border-yellow-900", dot: "bg-yellow-400 animate-pulse",
    desc: "Your application is being reviewed by the recruiter.",
  },
  shortlisted: {
    label: "Shortlisted", color: "text-green-400",
    bg: "bg-green-950 border-green-900", dot: "bg-green-400",
    desc: "Congratulations! You've been shortlisted. Expect a call soon.",
  },
  rejected: {
    label: "Not Selected", color: "text-red-400",
    bg: "bg-red-950 border-red-900", dot: "bg-red-800",
    desc: "The recruiter has moved forward with other candidates.",
  },
};

const FILTERS = ["All", "Pending", "Shortlisted", "Rejected"];

export default function MyApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await API.get("/applications/my");
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const withdraw = async (id) => {
    try {
      await API.delete(`/applications/${id}`);
      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = applications.filter((a) =>
    activeFilter === "All" ? true : a.status === activeFilter.toLowerCase()
  );

  const counts = {
    all: applications.length,
    shortlisted: applications.filter((a) => a.status === "shortlisted").length,
    pending: applications.filter((a) => a.status === "pending").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-gray-300">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-10">

        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-mono text-gray-600 mb-2">your activity</p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-100">Applications</h1>
          <p className="text-sm text-gray-500 mt-2 font-light">Track every job you've applied to.</p>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 sm:mb-8">
          {[
            { label: "Total Applied", val: counts.all, color: "text-gray-200" },
            { label: "Shortlisted", val: counts.shortlisted, color: "text-green-400" },
            { label: "Under Review", val: counts.pending, color: "text-yellow-400" },
            { label: "Not Selected", val: counts.rejected, color: "text-red-400" },
          ].map((s) => (
            <div key={s.label} className="bg-[#0f0f11] border border-[#1e1e22] rounded-xl p-3 sm:p-4">
              <p className={`text-xl sm:text-2xl font-mono font-semibold ${s.color}`}>{s.val}</p>
              <p className="text-[10px] sm:text-xs text-gray-600 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* FILTER TABS */}
        <div className="flex gap-1 mb-6 bg-[#0f0f11] border border-[#1e1e22] rounded-xl p-1 overflow-x-auto">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`text-xs px-3 sm:px-4 py-2 rounded-lg transition-all font-mono whitespace-nowrap ${
                activeFilter === f ? "bg-[#1e1e22] text-gray-100" : "text-gray-600 hover:text-gray-300"
              }`}>
              {f}
              <span className={`ml-1.5 text-[10px] ${activeFilter === f ? "text-blue-400" : "text-gray-700"}`}>
                {f === "All" ? counts.all : f === "Shortlisted" ? counts.shortlisted
                  : f === "Pending" ? counts.pending : counts.rejected}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-600">
            <p className="text-sm font-mono animate-pulse">Loading...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-600">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-sm">No applications yet.</p>
                <button onClick={() => navigate("/")}
                  className="mt-4 text-xs text-blue-400 underline underline-offset-4">Browse jobs →</button>
              </div>
            ) : filtered.map((app) => {
              const job = app.job;
              const status = STATUS_CONFIG[app.status];
              const isExpanded = expanded === app._id;
              return (
                <div key={app._id}
                  className={`bg-[#0f0f11] border rounded-xl overflow-hidden transition-all ${
                    app.status === "shortlisted" ? "border-green-900"
                    : app.status === "rejected" ? "border-[#1e1e22] opacity-60"
                    : "border-[#1e1e22]"
                  }`}>
                  <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 cursor-pointer hover:bg-[#111] transition-colors"
                    onClick={() => setExpanded(isExpanded ? null : app._id)}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold font-mono bg-blue-950 text-blue-400 flex-shrink-0">
                      {job?.title?.slice(0, 2).toUpperCase() || "JB"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-200 truncate">{job?.title}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {job?.postedBy?.companyName || job?.postedBy?.name} · {job?.type}
                      </p>
                    </div>
                    <div className={`flex items-center gap-1.5 text-[10px] font-mono border rounded-full px-2 sm:px-3 py-1 flex-shrink-0 ${status.bg} ${status.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status.dot}`} />
                      <span className="hidden sm:inline">{status.label}</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-[#1a1a1e] px-4 sm:px-5 py-4 flex flex-col gap-4">
                      <div className={`flex items-start gap-3 text-xs border rounded-lg px-4 py-3 ${status.bg} ${status.color}`}>
                        <span className="mt-0.5 text-sm">
                          {app.status === "shortlisted" ? "🎉" : app.status === "rejected" ? "📋" : "⏳"}
                        </span>
                        <p className="leading-relaxed">{status.desc}</p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                          <p className="text-gray-600 mb-1 font-mono text-[10px] uppercase tracking-wider">Salary</p>
                          <p className="text-gray-300 font-mono">
                            {job?.salaryMin}{job?.salaryMax ? ` – ${job?.salaryMax}` : ""}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1 font-mono text-[10px] uppercase tracking-wider">Applied on</p>
                          <p className="text-gray-300 font-mono">{new Date(app.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1 font-mono text-[10px] uppercase tracking-wider">Job type</p>
                          <p className="text-gray-300 font-mono">{job?.type}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <button onClick={() => navigate(`/jobs/${job?._id}`)}
                          className="text-xs text-blue-400 border border-blue-900 bg-blue-950 px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors">
                          View job →
                        </button>
                        {app.status !== "rejected" && (
                          <button onClick={() => withdraw(app._id)}
                            className="text-xs text-gray-500 border border-[#1e1e22] px-4 py-2 rounded-lg hover:text-gray-300 transition-colors">
                            Withdraw
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
