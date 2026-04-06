import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import API, { BASE_URL } from "../../services/api";

const STATUS_CONFIG = {
  pending: { label: "Under Review", color: "text-yellow-400", bg: "bg-yellow-950 border-yellow-900", dot: "bg-yellow-400 animate-pulse" },
  shortlisted: { label: "Shortlisted", color: "text-green-400", bg: "bg-green-950 border-green-900", dot: "bg-green-400" },
  rejected: { label: "Rejected", color: "text-red-400", bg: "bg-red-950 border-red-900", dot: "bg-red-700" },
};

export default function ViewApplicants() {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const { data } = await API.get("/applications/recruiter/all");
      setApplicants(data);
    } catch (err) {
      console.error("Failed to fetch applicants:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      setUpdating(true);
      await API.patch(`/applications/${id}/status`, { status: newStatus });
      setApplicants((prev) => prev.map((a) => a._id === id ? { ...a, status: newStatus } : a));
      if (selected?._id === id) setSelected({ ...selected, status: newStatus });
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  };

  const filtered = applicants.filter((a) => filter === "all" ? true : a.status === filter);

  const counts = {
    all: applicants.length,
    pending: applicants.filter((a) => a.status === "pending").length,
    shortlisted: applicants.filter((a) => a.status === "shortlisted").length,
    rejected: applicants.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-gray-300">
      <Navbar />
      <div className="max-w-6xl mx-auto px-8 py-10">

        <div className="mb-8">
          <button onClick={() => navigate("/dashboard")}
            className="text-xs font-mono text-gray-600 hover:text-gray-300 transition-colors mb-4 block">
            ← back to dashboard
          </button>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-100">Applicants</h1>
          <p className="text-sm text-gray-500 mt-2 font-light">Review and manage candidates across all your listings.</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total Applied", val: counts.all, color: "text-gray-100" },
            { label: "Under Review", val: counts.pending, color: "text-yellow-400" },
            { label: "Shortlisted", val: counts.shortlisted, color: "text-green-400" },
            { label: "Rejected", val: counts.rejected, color: "text-red-400" },
          ].map((s) => (
            <div key={s.label} className="bg-[#0f0f11] border border-[#1e1e22] rounded-xl p-4">
              <p className={`text-2xl font-mono font-semibold ${s.color}`}>{s.val}</p>
              <p className="text-xs text-gray-600 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-600 font-mono text-sm animate-pulse">Loading applicants...</div>
        ) : (
          <div className="grid grid-cols-3 gap-6">

            {/* LIST */}
            <div className="col-span-1 flex flex-col gap-3">
              <div className="flex gap-1 bg-[#0f0f11] border border-[#1e1e22] rounded-xl p-1">
                {["all", "pending", "shortlisted", "rejected"].map((f) => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`flex-1 text-[10px] font-mono py-1.5 rounded-lg capitalize transition-all ${
                      filter === f ? "bg-[#1e1e22] text-gray-100" : "text-gray-600 hover:text-gray-300"
                    }`}>
                    {f === "all" ? `All ${counts.all}` : f === "pending" ? `⏳ ${counts.pending}`
                      : f === "shortlisted" ? `✓ ${counts.shortlisted}` : `✗ ${counts.rejected}`}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                {filtered.length === 0 ? (
                  <p className="text-xs text-gray-700 text-center py-8">No applicants in this category</p>
                ) : filtered.map((a) => {
                  const st = STATUS_CONFIG[a.status];
                  return (
                    <div key={a._id} onClick={() => setSelected(a)}
                      className={`bg-[#0f0f11] border rounded-xl p-4 cursor-pointer transition-all ${
                        selected?._id === a._id ? "border-blue-500" : "border-[#1e1e22] hover:border-[#333]"
                      } ${a.status === "rejected" ? "opacity-50" : ""}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-950 border border-blue-900 flex items-center justify-center text-[10px] font-mono font-bold text-blue-400">
                            {a.applicant?.name?.split(" ").map((n) => n[0]).join("") || "?"}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-200">{a.applicant?.name}</p>
                            <p className="text-[10px] text-gray-600">{a.applicant?.degree || "Student"}</p>
                          </div>
                        </div>
                        <span className={`flex items-center gap-1 text-[9px] font-mono border rounded-full px-2 py-0.5 ${st.bg} ${st.color}`}>
                          <span className={`w-1 h-1 rounded-full ${st.dot}`} />
                          {st.label}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-600 truncate">{a.job?.title}</p>
                      <p className="text-[10px] text-gray-700 font-mono mt-1">{new Date(a.createdAt).toLocaleDateString()}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DETAIL PANEL */}
            <div className="col-span-2">
              {!selected ? (
                <div className="h-full flex items-center justify-center text-gray-700 border border-[#1e1e22] rounded-2xl min-h-64">
                  <div className="text-center">
                    <p className="text-3xl mb-3">👈</p>
                    <p className="text-sm">Select an applicant to view their profile</p>
                  </div>
                </div>
              ) : (
                <div className="bg-[#0f0f11] border border-[#1e1e22] rounded-2xl p-6 flex flex-col gap-6 sticky top-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-blue-950 border-2 border-blue-900 flex items-center justify-center text-lg font-mono font-bold text-blue-400">
                        {selected.applicant?.name?.split(" ").map((n) => n[0]).join("") || "?"}
                      </div>
                      <div>
                        <h2 className="text-base font-semibold text-gray-100">{selected.applicant?.name}</h2>
                        <p className="text-xs text-gray-500 mt-0.5">{selected.applicant?.email}</p>
                        <p className="text-xs text-gray-600 font-mono mt-0.5">{selected.applicant?.location}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono border rounded-full px-3 py-1 ${STATUS_CONFIG[selected.status].bg} ${STATUS_CONFIG[selected.status].color}`}>
                      {STATUS_CONFIG[selected.status].label}
                    </span>
                  </div>

                  <div className="h-px bg-[#1a1a1e]" />

                  {selected.applicant?.bio && (
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-600 font-mono mb-2">About</p>
                      <p className="text-sm text-gray-400 leading-relaxed">{selected.applicant.bio}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Degree", val: selected.applicant?.degree },
                      { label: "College", val: selected.applicant?.college },
                      { label: "CGPA", val: selected.applicant?.cgpa },
                    ].map((item) => item.val && (
                      <div key={item.label}>
                        <p className="text-[10px] uppercase tracking-widest text-gray-600 font-mono mb-1">{item.label}</p>
                        <p className="text-xs text-gray-300">{item.val}</p>
                      </div>
                    ))}
                  </div>

                  {selected.applicant?.skills?.length > 0 && (
                    <>
                      <div className="h-px bg-[#1a1a1e]" />
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-600 font-mono mb-2">Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {selected.applicant.skills.map((s) => (
                            <span key={s} className="text-[10px] font-mono text-blue-400 border border-blue-900 bg-blue-950 rounded px-2.5 py-1">{s}</span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex gap-3 flex-wrap">
                    {selected.applicant?.github && (
                      <a href={`https://${selected.applicant.github}`} target="_blank" rel="noreferrer"
                        className="text-[10px] font-mono text-gray-500 border border-[#1e1e22] px-3 py-1.5 rounded-lg hover:text-gray-300 transition-colors">
                        GitHub ↗
                      </a>
                    )}
                    {selected.applicant?.linkedin && (
                      <a href={`https://${selected.applicant.linkedin}`} target="_blank" rel="noreferrer"
                        className="text-[10px] font-mono text-gray-500 border border-[#1e1e22] px-3 py-1.5 rounded-lg hover:text-gray-300 transition-colors">
                        LinkedIn ↗
                      </a>
                    )}
                    {selected.applicant?.resume && (
                      <a href={`${BASE_URL}/uploads/resumes/${selected.applicant.resume}`}
                        target="_blank" rel="noreferrer"
                        className="text-[10px] font-mono text-blue-400 border border-blue-900 bg-blue-950 px-3 py-1.5 rounded-lg hover:bg-blue-900 transition-colors">
                        Download Resume ↓
                      </a>
                    )}
                  </div>

                  <div className="h-px bg-[#1a1a1e]" />

                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-600 font-mono mb-3">Update Status</p>
                    <div className="flex gap-2">
                      {["shortlisted", "pending", "rejected"].map((s) => (
                        <button key={s} onClick={() => updateStatus(selected._id, s)}
                          disabled={selected.status === s || updating}
                          className={`flex-1 py-2.5 text-xs font-medium rounded-xl transition-colors disabled:cursor-default ${
                            selected.status === s
                              ? s === "shortlisted" ? "bg-green-950 border border-green-900 text-green-400"
                                : s === "pending" ? "bg-yellow-950 border border-yellow-900 text-yellow-400"
                                : "bg-red-950 border border-red-900 text-red-400"
                              : s === "shortlisted" ? "bg-[#0f0f11] border border-green-900 text-green-400 hover:bg-green-950"
                                : s === "pending" ? "bg-[#0f0f11] border border-yellow-900 text-yellow-400 hover:bg-yellow-950"
                                : "bg-[#0f0f11] border border-red-900 text-red-400 hover:bg-red-950"
                          }`}>
                          {selected.status === s
                            ? s === "shortlisted" ? "✓ Shortlisted" : s === "pending" ? "⏳ Reviewing" : "✗ Rejected"
                            : s === "shortlisted" ? "Shortlist" : s === "pending" ? "Move to Review" : "Reject"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
