import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

const FILTERS = ["All", "Internship", "Full-time", "Remote", "Hybrid", "On-site", "Fresher"];

export default function Landing() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const name = user?.name?.split(" ")[0] || "there";

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [sort, setSort] = useState("newest");
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/jobs");
      setJobs(data);
    } catch (err) {
      setError("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = (id) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredJobs = jobs.filter((job) => {
    const matchSearch =
      search === "" ||
      job.title?.toLowerCase().includes(search.toLowerCase()) ||
      job.postedBy?.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      job.skills?.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    const matchLocation =
      location === "" ||
      job.location?.toLowerCase().includes(location.toLowerCase());

    const matchFilter =
      activeFilter === "All" ||
      job.type === activeFilter ||
      job.mode === activeFilter ||
      (activeFilter === "Fresher" && job.experience === "Fresher");

    return matchSearch && matchLocation && matchFilter;
  });

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-gray-200">
      <Navbar />

      {/* HERO */}
      <div className="px-8 pt-16 pb-10 max-w-4xl">
        <p className="text-xs font-mono text-blue-400 tracking-widest uppercase mb-3">
          Good morning, {name} 👋
        </p>
        <h1 className="text-5xl font-semibold tracking-tight leading-tight text-gray-100 mb-4">
          Let's get you <br />
          <span className="text-blue-400">a job.</span>
        </h1>
        <p className="text-sm text-gray-500 font-light mb-8">
          Browse opportunities posted by top recruiters — updated in real time.
        </p>

        {/* SEARCH BAR */}
        <div className="flex gap-0 max-w-2xl bg-[#141416] border border-[#2a2a2e] rounded-xl overflow-hidden mb-5">
          <input type="text" placeholder="Role, skill, or company..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-gray-200 px-5 py-3.5 placeholder-gray-600" />
          <div className="w-px bg-[#2a2a2e] my-2.5" />
          <input type="text" placeholder="Location"
            value={location} onChange={(e) => setLocation(e.target.value)}
            className="bg-transparent outline-none text-sm text-gray-200 px-4 py-3.5 placeholder-gray-600 w-36" />
          <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-6 transition-colors">
            Search →
          </button>
        </div>

        {/* FILTER PILLS */}
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`text-xs px-4 py-1.5 rounded-full border transition-all ${
                activeFilter === f
                  ? "border-blue-500 bg-blue-950 text-blue-300"
                  : "border-[#222] bg-[#111] text-gray-500 hover:border-gray-600 hover:text-gray-300"
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* STATS BAR */}
      <div className="flex gap-6 px-8 py-4 border-t border-b border-[#1a1a1e] mb-8">
        <div>
          <span className="font-mono text-gray-200 font-medium">{filteredJobs.length} </span>
          <span className="text-gray-500 text-xs">jobs found</span>
        </div>
        <div className="w-px bg-[#1e1e22]" />
        <div>
          <span className="font-mono text-gray-200 font-medium">
            {jobs.filter((j) => {
              const posted = new Date(j.createdAt);
              const now = new Date();
              return (now - posted) < 24 * 60 * 60 * 1000;
            }).length}{" "}
          </span>
          <span className="text-gray-500 text-xs">new today</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-gray-500">Sort:</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="bg-[#0f0f11] border border-[#1e1e22] text-gray-400 text-xs rounded-md px-2 py-1 outline-none">
            <option value="newest">Newest first</option>
            <option value="salary">Salary: High to Low</option>
          </select>
        </div>
      </div>

      {/* JOB CARDS */}
      <div className="px-8 pb-16">
        {loading ? (
          <div className="text-center py-20 text-gray-600">
            <p className="text-sm font-mono animate-pulse">Loading jobs...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-400">
            <p className="text-sm">{error}</p>
            <button onClick={fetchJobs} className="mt-3 text-xs text-blue-400 underline">
              Try again
            </button>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm">No jobs found. Try different keywords or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredJobs.map((job) => (
              <div key={job._id}
                className="bg-[#0f0f11] border border-[#1e1e22] rounded-xl p-5 flex flex-col gap-3 hover:border-[#333] transition-colors">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold font-mono bg-blue-950 text-blue-400">
                    {job.postedBy?.companyName?.slice(0, 2).toUpperCase() ||
                      job.postedBy?.name?.slice(0, 2).toUpperCase() || "CO"}
                  </div>
                  <button onClick={() => toggleSave(job._id)}
                    className={`text-lg transition-colors ${
                      savedIds.includes(job._id) ? "text-blue-400" : "text-gray-700 hover:text-gray-400"
                    }`}>
                    {savedIds.includes(job._id) ? "♥" : "♡"}
                  </button>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-200">{job.title}</p>
                    {(() => {
                      const posted = new Date(job.createdAt);
                      const now = new Date();
                      return (now - posted) < 24 * 60 * 60 * 1000;
                    })() && (
                      <span className="text-[9px] font-mono text-blue-400 border border-blue-900 bg-blue-950 px-1.5 py-0.5 rounded">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {job.postedBy?.companyName || job.postedBy?.name}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] text-gray-500 border border-[#1e1e22] bg-[#111] rounded px-2 py-0.5">
                    {job.mode}
                  </span>
                  <span className="text-[10px] text-gray-500 border border-[#1e1e22] bg-[#111] rounded px-2 py-0.5">
                    {job.type}
                  </span>
                  {job.skills?.slice(0, 2).map((s) => (
                    <span key={s} className="text-[10px] text-blue-400 border border-blue-900 bg-blue-950 rounded px-2 py-0.5">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-[#1a1a1e]">
                  <div>
                    <p className="text-xs font-mono text-blue-400 font-medium">
                      {job.salaryMin}{job.salaryMax ? ` – ${job.salaryMax}` : ""}
                    </p>
                    <p className="text-[10px] text-gray-600 mt-0.5">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button onClick={() => navigate(`/jobs/${job._id}`)}
                    className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md font-medium transition-colors">
                    Apply →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
