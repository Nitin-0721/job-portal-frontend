import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import API from "../../services/api";

const STATUS_STYLE = {
  active: { label: "Active", color: "text-green-400", bg: "bg-green-950 border-green-900", dot: "bg-green-400" },
  closed: { label: "Closed", color: "text-gray-500", bg: "bg-[#111] border-[#222]", dot: "bg-gray-700" },
};

const APP_STATUS = {
  pending: { label: "Reviewing", color: "text-yellow-400", bg: "bg-yellow-950 border-yellow-900" },
  shortlisted: { label: "Shortlisted", color: "text-green-400", bg: "bg-green-950 border-green-900" },
  rejected: { label: "Rejected", color: "text-red-400", bg: "bg-red-950 border-red-900" },
};

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const name = user?.name?.split(" ")[0] || "there";

  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        API.get("/jobs/recruiter/myjobs"),
        API.get("/applications/recruiter/all"),
      ]);
      setJobs(jobsRes.data);
      setApplicants(appsRes.data);
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "closed" : "active";
      await API.put(`/jobs/${id}`, { status: newStatus });
      setJobs((prev) => prev.map((j) => j._id === id ? { ...j, status: newStatus } : j));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await API.delete(`/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredJobs = jobs.filter((j) => filter === "all" ? true : j.status === filter);

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter((j) => j.status === "active").length,
    totalApplicants: applicants.length,
    shortlisted: applicants.filter((a) => a.status === "shortlisted").length,
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-gray-300">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-10">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8 sm:mb-10">
          <div>
            <p className="text-xs font-mono text-gray-600 mb-2">recruiter panel</p>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-100">Hey, {name} 👋</h1>
            <p className="text-sm text-gray-500 mt-2 font-light">Here's what's happening with your listings.</p>
          </div>
          <button onClick={() => navigate("/post-job")}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors w-full sm:w-auto">
            + Post a Job
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 sm:mb-10">
          {[
            { label: "Jobs Posted", val: stats.totalJobs, color: "text-gray-100" },
            { label: "Active Listings", val: stats.activeJobs, color: "text-blue-400" },
            { label: "Total Applicants", val: stats.totalApplicants, color: "text-yellow-400" },
            { label: "Shortlisted", val: stats.shortlisted, color: "text-green-400" },
          ].map((s) => (
            <div key={s.label} className="bg-[#0f0f11] border border-[#1e1e22] rounded-xl p-4">
              <p className={`text-2xl sm:text-3xl font-mono font-semibold ${s.color}`}>{s.val}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-600 font-mono text-sm animate-pulse">Loading...</div>
        ) : (
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8">

            {/* JOBS LIST */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-medium text-gray-200">Your Job Listings</h2>
                <div className="flex gap-1 bg-[#0f0f11] border border-[#1e1e22] rounded-lg p-1">
                  {["all", "active", "closed"].map((f) => (
                    <button key={f} onClick={() => setFilter(f)}
                      className={`text-[10px] font-mono px-2 sm:px-3 py-1.5 rounded-md capitalize transition-all ${
                        filter === f ? "bg-[#1e1e22] text-gray-100" : "text-gray-600 hover:text-gray-300"
                      }`}>{f}</button>
                  ))}
                </div>
              </div>

              {filteredJobs.length === 0 ? (
                <div className="text-center py-16 text-gray-600">
                  <p className="text-3xl mb-3">📭</p>
                  <p className="text-sm">No jobs yet.</p>
                  <button onClick={() => navigate("/post-job")}
                    className="mt-4 text-xs text-blue-400 underline">Post your first job →</button>
                </div>
              ) : filteredJobs.map((job) => {
                const st = STATUS_STYLE[job.status];
                const jobApplicants = applicants.filter((a) =>
                  a.job?._id === job._id || a.job === job._id);
                return (
                  <div key={job._id}
                    className={`bg-[#0f0f11] border border-[#1e1e22] rounded-xl p-4 sm:p-5 ${job.status === "closed" ? "opacity-50" : ""}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0 mr-4">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="text-sm font-medium text-gray-200">{job.title}</p>
                          <span className={`flex items-center gap-1 text-[9px] font-mono border rounded-full px-2 py-0.5 ${st.bg} ${st.color}`}>
                            <span className={`w-1 h-1 rounded-full ${st.dot}`} />
                            {st.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 font-mono">{job.type} · {job.mode}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xl font-mono font-semibold text-gray-100">{jobApplicants.length}</p>
                        <p className="text-[10px] text-gray-600">applicants</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5 mb-4 flex-wrap">
                      {job.skills?.slice(0, 3).map((s) => (
                        <span key={s} className="text-[10px] font-mono text-blue-400 border border-blue-900 bg-blue-950 rounded px-2 py-0.5">{s}</span>
                      ))}
                    </div>
                    <div className="flex flex-wrap justify-between items-center gap-2 pt-3 border-t border-[#1a1a1e]">
                      <p className="text-[10px] text-gray-600 font-mono">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <button onClick={() => navigate(`/applicants?job=${job._id}`)}
                          className="text-[10px] text-blue-400 border border-blue-900 bg-blue-950 px-3 py-1.5 rounded-lg hover:bg-blue-900 transition-colors">
                          Applicants →
                        </button>
                        <button onClick={() => toggleStatus(job._id, job.status)}
                          className="text-[10px] text-gray-500 border border-[#1e1e22] px-3 py-1.5 rounded-lg hover:text-gray-300 transition-colors">
                          {job.status === "active" ? "Close" : "Reopen"}
                        </button>
                        <button onClick={() => deleteJob(job._id)}
                          className="text-[10px] text-red-500 border border-red-900 px-3 py-1.5 rounded-lg hover:bg-red-950 transition-colors">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RECENT APPLICANTS */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              <h2 className="text-sm font-medium text-gray-200">Recent Applicants</h2>
              {applicants.length === 0 ? (
                <p className="text-xs text-gray-700 text-center py-4">No applicants yet</p>
              ) : applicants.slice(0, 5).map((a) => {
                const st = APP_STATUS[a.status];
                return (
                  <div key={a._id} className="bg-[#0f0f11] border border-[#1e1e22] rounded-xl p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-950 border border-blue-900 flex items-center justify-center text-[10px] font-mono font-bold text-blue-400">
                          {a.applicant?.name?.split(" ").map((n) => n[0]).join("") || "?"}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-200">{a.applicant?.name}</p>
                          <p className="text-[10px] text-gray-600 font-mono">{new Date(a.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`text-[9px] font-mono border rounded-full px-2 py-0.5 ${st.bg} ${st.color}`}>{st.label}</span>
                    </div>
                    <p className="text-[10px] text-gray-600 truncate">{a.job?.title}</p>
                  </div>
                );
              })}

              {applicants.length > 0 && (
                <button onClick={() => navigate("/applicants")}
                  className="text-xs text-center text-blue-400 border border-blue-900 bg-blue-950 py-2.5 rounded-xl hover:bg-blue-900 transition-colors">
                  View all applicants →
                </button>
              )}

              <div className="mt-2">
                <h2 className="text-sm font-medium text-gray-200 mb-3">Quick Actions</h2>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Post a new job", path: "/post-job", icon: "+" },
                    { label: "View all applicants", path: "/applicants", icon: "◎" },
                  ].map((action) => (
                    <button key={action.label} onClick={() => navigate(action.path)}
                      className="flex items-center gap-3 text-xs text-gray-500 border border-[#1e1e22] bg-[#0f0f11] px-4 py-3 rounded-xl hover:text-gray-200 hover:border-[#333] transition-all text-left">
                      <span className="text-blue-500 font-mono w-4">{action.icon}</span>
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
