import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import API from "../../services/api";

const SKILL_SUGGESTIONS = ["React", "Node.js", "MongoDB", "JavaScript", "TypeScript",
  "Python", "SQL", "Figma", "AWS", "Docker", "Git", "Express", "Tailwind CSS"];

const STEPS = ["Basic Info", "Details", "Skills & Perks", "Preview"];

export default function PostJob() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "", description: "", location: "",
    type: "Full-time", mode: "Remote",
    salaryMin: "", salaryMax: "", experience: "Fresher",
    openings: "1", deadline: "", perks: "",
  });
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const addSkill = (s) => {
    const t = s.trim();
    if (t && !skills.includes(t)) setSkills([...skills, t]);
    setSkillInput("");
  };
  const removeSkill = (s) => setSkills(skills.filter((sk) => sk !== s));

  const isStepValid = () => {
    if (step === 0) return form.title && form.description;
    if (step === 1) return form.location && form.salaryMin && form.deadline;
    if (step === 2) return skills.length > 0;
    return true;
  };

  const handlePost = async () => {
    try {
      setPosting(true);
      setError("");
      await API.post("/jobs", { ...form, skills, openings: Number(form.openings) });
      setPosted(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post job.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-gray-300">
      <Navbar />
      <div className="max-w-2xl mx-auto px-8 py-10">
        <div className="mb-8">
          <button onClick={() => navigate("/dashboard")}
            className="text-xs font-mono text-gray-600 hover:text-gray-300 transition-colors mb-4 block">
            ← back to dashboard
          </button>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-100">Post a Job</h1>
          <p className="text-sm text-gray-500 mt-2 font-light">Fill in the details to publish your listing.</p>
        </div>

        {/* STEP INDICATOR */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-semibold transition-all ${
                  i < step ? "bg-blue-500 text-white"
                  : i === step ? "bg-blue-950 border border-blue-500 text-blue-400"
                  : "bg-[#111] border border-[#1e1e22] text-gray-700"
                }`}>{i < step ? "✓" : i + 1}</div>
                <span className={`text-[10px] font-mono whitespace-nowrap ${i === step ? "text-blue-400" : "text-gray-700"}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-2 mb-4 ${i < step ? "bg-blue-500" : "bg-[#1e1e22]"}`} />
              )}
            </div>
          ))}
        </div>

        {/* STEP 0 */}
        {step === 0 && (
          <div className="flex flex-col gap-5">
            <p className="text-[10px] uppercase tracking-widest text-gray-600 border-b border-[#1a1a1e] pb-2 font-mono">Basic Information</p>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500">Job Title <span className="text-red-500">*</span></label>
              <input name="title" value={form.title} onChange={handleChange}
                placeholder="e.g. React Frontend Developer"
                className="bg-[#0f0f11] border border-[#1e1e22] rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-blue-500 transition-colors placeholder-gray-700" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500">Job Description <span className="text-red-500">*</span></label>
              <textarea name="description" value={form.description} onChange={handleChange}
                placeholder="Describe the role and responsibilities..." rows={5}
                className="bg-[#0f0f11] border border-[#1e1e22] rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-blue-500 transition-colors placeholder-gray-700 resize-none leading-relaxed" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-500">Job Type</label>
                <select name="type" value={form.type} onChange={handleChange}
                  className="bg-[#0f0f11] border border-[#1e1e22] rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-blue-500 transition-colors">
                  {["Full-time", "Part-time", "Internship", "Contract", "Freelance"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-500">Work Mode</label>
                <select name="mode" value={form.mode} onChange={handleChange}
                  className="bg-[#0f0f11] border border-[#1e1e22] rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-blue-500 transition-colors">
                  {["Remote", "On-site", "Hybrid"].map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <p className="text-[10px] uppercase tracking-widest text-gray-600 border-b border-[#1a1a1e] pb-2 font-mono">Job Details</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "location", label: "Location *", placeholder: "e.g. Bengaluru or Remote" },
                { name: "salaryMin", label: "Min Salary *", placeholder: "e.g. 8 LPA" },
                { name: "salaryMax", label: "Max Salary", placeholder: "e.g. 14 LPA" },
                { name: "openings", label: "Openings", placeholder: "1", type: "number" },
              ].map((f) => (
                <div key={f.name} className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-500">{f.label}</label>
                  <input name={f.name} value={form[f.name]} onChange={handleChange}
                    type={f.type || "text"} placeholder={f.placeholder}
                    className="bg-[#0f0f11] border border-[#1e1e22] rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-blue-500 transition-colors placeholder-gray-700" />
                </div>
              ))}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-500">Experience</label>
                <select name="experience" value={form.experience} onChange={handleChange}
                  className="bg-[#0f0f11] border border-[#1e1e22] rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-blue-500 transition-colors">
                  {["Fresher", "1–2 years", "2–4 years", "3–5 years", "5+ years"].map((e) => <option key={e}>{e}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-500">Deadline *</label>
                <input name="deadline" value={form.deadline} onChange={handleChange}
                  type="date"
                  className="bg-[#0f0f11] border border-[#1e1e22] rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-blue-500 transition-colors" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <p className="text-[10px] uppercase tracking-widest text-gray-600 border-b border-[#1a1a1e] pb-2 font-mono">Required Skills *</p>
              <div className="flex flex-wrap gap-2 min-h-8">
                {skills.map((s) => (
                  <span key={s} className="flex items-center gap-1.5 text-xs text-gray-400 bg-[#111] border border-[#222] rounded-lg px-3 py-1">
                    {s} <button onClick={() => removeSkill(s)} className="text-gray-600 hover:text-gray-200 text-sm">×</button>
                  </span>
                ))}
                {skills.length === 0 && <p className="text-xs text-gray-700">No skills added yet</p>}
              </div>
              <div className="flex gap-2">
                <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSkill(skillInput)}
                  placeholder="Type a skill and press Enter..."
                  className="flex-1 bg-[#0f0f11] border border-[#1e1e22] rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-blue-500 transition-colors placeholder-gray-700" />
                <button onClick={() => addSkill(skillInput)}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-5 rounded-xl transition-colors">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {SKILL_SUGGESTIONS.filter((s) => !skills.includes(s)).map((s) => (
                  <button key={s} onClick={() => addSkill(s)}
                    className="text-xs text-gray-500 border border-dashed border-[#2a2a2e] rounded-lg px-3 py-1 hover:border-blue-500 hover:text-blue-400 transition-colors">
                    + {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[10px] uppercase tracking-widest text-gray-600 border-b border-[#1a1a1e] pb-2 font-mono">Perks & Benefits</p>
              <textarea name="perks" value={form.perks} onChange={handleChange}
                placeholder="e.g. Health insurance, Remote work, Learning budget..." rows={3}
                className="bg-[#0f0f11] border border-[#1e1e22] rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-blue-500 transition-colors placeholder-gray-700 resize-none" />
            </div>
          </div>
        )}

        {/* STEP 3 PREVIEW */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <p className="text-[10px] uppercase tracking-widest text-gray-600 border-b border-[#1a1a1e] pb-2 font-mono">Preview before posting</p>
            <div className="bg-[#0f0f11] border border-[#1e1e22] rounded-2xl p-6 flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-100 tracking-tight">{form.title || "—"}</h2>
                <div className="flex flex-wrap gap-2 mt-3">
                  {[form.type, form.mode, form.location, form.experience].filter(Boolean).map((v) => (
                    <span key={v} className="text-[10px] font-mono text-gray-500 border border-[#1e1e22] bg-[#111] rounded-md px-2.5 py-1">{v}</span>
                  ))}
                </div>
              </div>
              <div className="h-px bg-[#1a1a1e]" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-600 font-mono mb-2">Salary</p>
                <p className="text-sm font-mono text-blue-400">{form.salaryMin}{form.salaryMax ? ` – ${form.salaryMax}` : ""}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-600 font-mono mb-2">Description</p>
                <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">{form.description || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-600 font-mono mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span key={s} className="text-[10px] font-mono text-blue-400 border border-blue-900 bg-blue-950 rounded px-2.5 py-1">{s}</span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between text-xs font-mono text-gray-600">
                <span>Openings: {form.openings}</span>
                <span>Deadline: {form.deadline || "—"}</span>
              </div>
            </div>
            {error && (
              <div className="text-xs text-red-400 bg-red-950 border border-red-900 rounded-xl px-4 py-3">{error}</div>
            )}
            {posted && (
              <div className="text-center text-sm text-green-400 bg-green-950 border border-green-900 rounded-xl py-3">
                ✓ Job posted! Redirecting to dashboard...
              </div>
            )}
          </div>
        )}

        {/* NAV BUTTONS */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#1a1a1e]">
          <button onClick={() => step > 0 ? setStep(step - 1) : navigate("/dashboard")}
            className="text-xs text-gray-500 border border-[#2a2a2e] rounded-xl px-5 py-2.5 hover:text-gray-300 transition-colors">
            ← {step === 0 ? "Cancel" : "Back"}
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={() => isStepValid() && setStep(step + 1)}
              className={`text-xs font-medium px-6 py-2.5 rounded-xl transition-colors ${
                isStepValid() ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-[#111] text-gray-700 cursor-not-allowed border border-[#1e1e22]"
              }`}>
              Next →
            </button>
          ) : (
            <button onClick={handlePost} disabled={posting || posted}
              className="text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50">
              {posting ? "Posting..." : posted ? "✓ Posted!" : "Publish Job →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
