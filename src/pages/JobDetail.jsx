import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { fetchJob(); }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/jobs/${id}`);
      setJob(data);
    } catch (err) {
      setError("Failed to load job details.");
    } finally {
      setLoading(false);
    }
  };

  const confirmApply = async () => {
    try {
      setApplying(true);
      await API.post(`/applications/apply/${id}`);
      setApplied(true);
      setShowModal(false);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to apply.";
      setError(msg);
      setShowModal(false);
      if (msg === "You have already applied to this job") setApplied(true);
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0c0c0e]">
      <Navbar />
      <div className="text-center py-32 text-gray-600 font-mono text-sm animate-pulse">Loading job...</div>
    </div>
  );

  if (!job) return (
    <div className="min-h-screen bg-[#0c0c0e]">
      <Navbar />
      <div className="text-center py-32 text-red-400 text-sm">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-gray-300">
      <Navbar />

      <div className="px-4 sm:px-8 pt-6">
        <button onClick={() => navigate(-1)}
          className="text-xs text-gray-600 hover:text-gray-300 transition-colors flex items-center gap-1.5 font-mono mb-6">
          ← back to jobs
        </button>
      </div>

      <div className="px-4 sm:px-8 pb-16 max-w-6xl mx-auto">
        {/* MOBILE: Stack layout, DESKTOP: 3 column grid */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-10">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* HEADER */}
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-sm font-bold font-mono flex-shrink-0 bg-blue-950 text-blue-400">
                  {job?.postedBy?.companyName?.slice(0, 2).toUpperCase() ||
                    job?.postedBy?.name?.slice(0, 2).toUpperCase() || "CO"}
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-gray-100 tracking-tight leading-tight">
                    {job?.title}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {job?.postedBy?.companyName || job?.postedBy?.name}
                  </p>
                </div>
              </div>

              {/* META */}
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {[
                  { icon: "◎", val: job?.mode },
                  { icon: "◷", val: job?.type },
                  { icon: "⌖", val: job?.location },
                  { icon: "◈", val: job?.experience },
                ].map((m) => m.val && (
                  <span key={m.val} className="flex items-center gap-1.5 text-gray-500 border border-[#1e1e22] bg-[#111] rounded-md px-2.5 py-1">
                    <span className="text-blue-500">{m.icon}</span> {m.val}
                  </span>
                ))}
              </div>

              {/* SKILLS */}
              <div className="flex flex-wrap gap-2">
                {job?.skills?.map((s) => (
                  <span key={s} className="text-[10px] font-mono text-blue-400 border border-blue-900 bg-blue-950 rounded px-2.5 py-1">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* MOBILE APPLY CARD */}
            <div className="lg:hidden bg-[#0f0f11] border border-[#1e1e22] rounded-2xl p-4 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <p className="text-lg font-mono font-semibold text-gray-100">
                  {job?.salaryMin}{job?.salaryMax ? ` – ${job?.salaryMax}` : ""}
                </p>
                {applied && (
                  <span className="text-[10px] font-mono text-green-400 border border-green-900 bg-green-950 px-2 py-1 rounded-md">
                    ✓ Applied
                  </span>
                )}
              </div>
              {error && (
                <p className="text-[10px] text-red-400 bg-red-950 border border-red-900 rounded-lg px-3 py-2">{error}</p>
              )}
              <button onClick={() => !applied && setShowModal(true)} disabled={applied}
                className={`w-full py-3 rounded-xl text-sm font-medium transition-all ${
                  applied
                    ? "bg-green-950 border border-green-900 text-green-400 cursor-default"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}>
                {applied ? "✓ Application Sent" : "Apply for this role →"}
              </button>
            </div>

            <div className="h-px bg-[#1a1a1e]" />

            {/* DESCRIPTION */}
            <div className="flex flex-col gap-4">
              <h2 className="text-xs uppercase tracking-widest text-gray-600 font-mono">About the role</h2>
              {job?.description?.split("\n\n").map((para, i) => (
                <p key={i} className="text-sm text-gray-400 leading-7 font-light">{para}</p>
              ))}
            </div>

            {job?.perks && (
              <>
                <div className="h-px bg-[#1a1a1e]" />
                <div className="flex flex-col gap-4">
                  <h2 className="text-xs uppercase tracking-widest text-gray-600 font-mono">Perks & Benefits</h2>
                  <p className="text-sm text-gray-400 leading-7">{job.perks}</p>
                </div>
              </>
            )}
          </div>

          {/* RIGHT COLUMN — DESKTOP ONLY */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-6 flex flex-col gap-4">
              <div className="bg-[#0f0f11] border border-[#1e1e22] rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xl font-mono font-semibold text-gray-100">
                      {job?.salaryMin}{job?.salaryMax ? ` – ${job?.salaryMax}` : ""}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">salary range</p>
                  </div>
                  {applied && (
                    <span className="text-[10px] font-mono text-green-400 border border-green-900 bg-green-950 px-2 py-1 rounded-md">
                      ✓ Applied
                    </span>
                  )}
                </div>

                <div className="h-px bg-[#1a1a1e]" />

                <div className="flex flex-col gap-2.5 text-xs">
                  {[
                    { label: "Posted", val: new Date(job?.createdAt).toLocaleDateString() },
                    { label: "Deadline", val: job?.deadline ? new Date(job?.deadline).toLocaleDateString() : "Open" },
                    { label: "Openings", val: job?.openings },
                    { label: "Experience", val: job?.experience },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="text-gray-300 font-mono">{item.val}</span>
                    </div>
                  ))}
                </div>

                {error && (
                  <p className="text-[10px] text-red-400 bg-red-950 border border-red-900 rounded-lg px-3 py-2">{error}</p>
                )}

                <div className="h-px bg-[#1a1a1e]" />

                <button onClick={() => !applied && setShowModal(true)} disabled={applied}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
                    applied
                      ? "bg-green-950 border border-green-900 text-green-400 cursor-default"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}>
                  {applied ? "✓ Application Sent" : "Apply for this role →"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#0f0f11] border border-[#2a2a2e] rounded-2xl p-6 w-full max-w-md flex flex-col gap-5">
            <div>
              <h2 className="text-base font-semibold text-gray-100 tracking-tight">Confirm Application</h2>
              <p className="text-xs text-gray-500 mt-1.5">
                Applying for <span className="text-gray-300">{job?.title}</span> at{" "}
                <span className="text-gray-300">{job?.postedBy?.companyName || job?.postedBy?.name}</span>
              </p>
            </div>
            <div className="bg-[#141416] border border-[#1e1e22] rounded-xl p-4 flex flex-col gap-2 text-xs">
              <p className="text-gray-500 uppercase tracking-widest text-[10px] font-mono mb-1">What will be shared</p>
              <div className="flex items-center gap-2 text-gray-400"><span className="text-blue-500">✦</span> Your profile</div>
              <div className="flex items-center gap-2 text-gray-400"><span className="text-blue-500">✦</span> Your resume (PDF)</div>
              <div className="flex items-center gap-2 text-gray-400"><span className="text-blue-500">✦</span> Your contact info</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 text-xs text-gray-500 border border-[#2a2a2e] rounded-xl hover:text-gray-300 transition-colors">
                Cancel
              </button>
              <button onClick={confirmApply}
                className="flex-1 py-2.5 text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors">
                {applying ? "Sending..." : "Confirm & Apply →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
