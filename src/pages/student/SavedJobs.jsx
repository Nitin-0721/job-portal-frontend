import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const DUMMY_SAVED = [
  {
    id: 1, title: "React Frontend Developer", company: "Zoho Corp",
    logo: "ZM", logoColor: "bg-blue-950 text-blue-400",
    location: "Remote", type: "Full-time", mode: "Remote",
    salary: "₹8–14 LPA", skills: ["React", "TypeScript", "Node.js"],
    savedOn: "Jan 14, 2025", deadline: "Jan 30, 2025",
  },
  {
    id: 4, title: "Data Analyst Intern", company: "Razorpay",
    logo: "RZ", logoColor: "bg-pink-950 text-pink-400",
    location: "Remote", type: "Internship", mode: "Remote",
    salary: "₹20k/mo", skills: ["Python", "SQL", "Power BI"],
    savedOn: "Jan 13, 2025", deadline: "Feb 15, 2025",
  },
  {
    id: 5, title: "Backend Engineer", company: "CRED",
    logo: "CR", logoColor: "bg-indigo-950 text-indigo-400",
    location: "Bengaluru", type: "Full-time", mode: "On-site",
    salary: "₹18–28 LPA", skills: ["Node.js", "AWS", "PostgreSQL"],
    savedOn: "Jan 12, 2025", deadline: "Feb 5, 2025",
  },
];

export default function SavedJobs() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(DUMMY_SAVED);

  const removeJob = (id) => setSaved((prev) => prev.filter((j) => j.id !== id));

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-gray-300">
      <Navbar />

      <div className="max-w-3xl mx-auto px-8 py-10">

        {/* HEADER */}
        <div className="mb-8">
          <p className="text-xs font-mono text-gray-600 mb-2">your collection</p>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-100">Saved Jobs</h1>
          <p className="text-sm text-gray-500 mt-2 font-light">
            Jobs you bookmarked — apply before they close.
          </p>
        </div>

        {saved.length === 0 ? (
          <div className="text-center py-24 text-gray-600">
            <p className="text-4xl mb-4">🔖</p>
            <p className="text-sm mb-1">No saved jobs yet.</p>
            <p className="text-xs text-gray-700 mb-6">Hit the ♡ on any job card to save it here.</p>
            <button onClick={() => navigate("/")}
              className="text-xs text-blue-400 border border-blue-900 bg-blue-950 px-5 py-2.5 rounded-xl hover:bg-blue-900 transition-colors">
              Browse jobs →
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {saved.map((job) => (
              <div key={job.id}
                className="bg-[#0f0f11] border border-[#1e1e22] rounded-2xl p-5 hover:border-[#333] transition-colors">
                <div className="flex gap-4 items-start">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold font-mono flex-shrink-0 ${job.logoColor}`}>
                    {job.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-sm font-medium text-gray-200">{job.title}</h2>
                        <p className="text-xs text-gray-500 mt-0.5">{job.company} · {job.location}</p>
                      </div>
                      <button onClick={() => removeJob(job.id)}
                        className="text-gray-700 hover:text-red-400 text-xs transition-colors ml-4 flex-shrink-0">
                        Remove ×
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <span className="text-[10px] text-gray-500 border border-[#1e1e22] bg-[#111] rounded px-2 py-0.5">{job.mode}</span>
                      <span className="text-[10px] text-gray-500 border border-[#1e1e22] bg-[#111] rounded px-2 py-0.5">{job.type}</span>
                      {job.skills.slice(0, 3).map((s) => (
                        <span key={s} className="text-[10px] text-blue-400 border border-blue-900 bg-blue-950 rounded px-2 py-0.5 font-mono">{s}</span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#1a1a1e]">
                      <div className="flex gap-4 text-[10px] font-mono">
                        <span className="text-blue-400">{job.salary}</span>
                        <span className="text-gray-700">Saved {job.savedOn}</span>
                        <span className={`${new Date(job.deadline) < new Date() ? "text-red-500" : "text-gray-600"}`}>
                          Deadline {job.deadline}
                        </span>
                      </div>
                      <button onClick={() => navigate(`/jobs/${job.id}`)}
                        className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg transition-colors font-medium">
                        Apply →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="text-center mt-6">
              <button onClick={() => navigate("/")}
                className="text-xs text-gray-500 hover:text-gray-300 underline underline-offset-4 transition-colors">
                Browse more jobs →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
