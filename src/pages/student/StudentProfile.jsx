import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import API from "../../services/api";

const SKILL_SUGGESTIONS = ["React", "Node.js", "MongoDB", "JavaScript", "TypeScript",
  "Python", "SQL", "Tailwind CSS", "Git", "Express", "Figma", "AWS"];

const SECTIONS = ["Basic Info", "Education", "Skills", "Resume", "Links"];

export default function StudentProfile() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", location: "", bio: "",
    degree: "B.Tech", branch: "", college: "", graduationYear: "2025", cgpa: "",
    linkedin: "", github: "", portfolio: "",
  });
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeName, setResumeName] = useState("");
  const [activeSection, setActiveSection] = useState("Basic Info");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get("/users/profile");
      setForm({
        name: data.name || "", email: data.email || "",
        phone: data.phone || "", location: data.location || "",
        bio: data.bio || "", degree: data.degree || "B.Tech",
        branch: data.branch || "", college: data.college || "",
        graduationYear: data.graduationYear || "2025",
        cgpa: data.cgpa || "", linkedin: data.linkedin || "",
        github: data.github || "", portfolio: data.portfolio || "",
      });
      setSkills(data.skills || []);
      setResumeName(data.resume || "");
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addSkill = (s) => {
    const trimmed = s.trim();
    if (trimmed && !skills.includes(trimmed)) setSkills([...skills, trimmed]);
    setSkillInput("");
  };

  const removeSkill = (s) => setSkills(skills.filter((sk) => sk !== s));

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file?.type === "application/pdf") {
      setResumeFile(file);
      setResumeName(file.name);
    } else {
      alert("Please upload a PDF file only.");
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await API.put("/users/profile", { ...form, skills });
      if (resumeFile) {
        const formData = new FormData();
        formData.append("resume", resumeFile);
        await API.post("/users/upload-resume", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...stored, name: form.name }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  };

  const fields = [form.name, form.phone, form.location, form.bio,
    form.branch, form.college, form.cgpa, form.linkedin, resumeName];
  const completion = Math.round((fields.filter(Boolean).length / fields.length) * 100);

  if (loading) return (
    <div className="min-h-screen bg-[#0c0c0e]">
      <Navbar />
      <div className="text-center py-32 text-gray-600 font-mono text-sm animate-pulse">Loading profile...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-gray-200">
      <Navbar />

      {/* MOBILE SECTION TABS */}
      <div className="lg:hidden border-b border-[#1e1e22] px-4 py-2 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {SECTIONS.map((s) => (
            <button key={s} onClick={() => setActiveSection(s)}
              className={`text-xs px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
                activeSection === s ? "bg-[#141416] text-gray-100" : "text-gray-500"
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row" style={{ minHeight: "calc(100vh - 57px)" }}>

        {/* SIDEBAR — desktop only */}
        <div className="hidden lg:flex w-64 border-r border-[#1e1e22] p-6 flex-col items-center gap-4 flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-blue-950 border-2 border-blue-800 flex items-center justify-center text-2xl font-bold font-mono text-blue-400">
            {form.name ? form.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "U"}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-200">{form.name || "Your Name"}</p>
            <p className="text-xs text-gray-500 font-mono mt-1">student</p>
          </div>
          <div className="w-full">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-gray-500">Profile complete</span>
              <span className="text-blue-400 font-mono">{completion}%</span>
            </div>
            <div className="w-full h-1 bg-[#1e1e22] rounded-full">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${completion}%` }} />
            </div>
          </div>
          <div className="w-full h-px bg-[#1e1e22]" />
          <div className="w-full flex flex-col gap-1">
            {SECTIONS.map((s) => (
              <button key={s} onClick={() => setActiveSection(s)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2.5 transition-all ${
                  activeSection === s ? "bg-[#141416] text-gray-100" : "text-gray-500 hover:text-gray-300"
                }`}>
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${activeSection === s ? "bg-blue-400" : "bg-[#2a2a2e]"}`} />
                {s}
              </button>
            ))}
          </div>
          <div className="w-full h-px bg-[#1e1e22]" />
          <button onClick={handleSave} disabled={saving}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-2 rounded-lg transition-colors disabled:opacity-50">
            {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 p-4 sm:p-8 max-w-2xl w-full mx-auto lg:mx-0">

          {/* MOBILE PROFILE HEADER */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-full bg-blue-950 border-2 border-blue-800 flex items-center justify-center text-lg font-bold font-mono text-blue-400">
              {form.name ? form.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "U"}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-200">{form.name || "Your Name"}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-20 h-1 bg-[#1e1e22] rounded-full">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${completion}%` }} />
                </div>
                <span className="text-xs text-blue-400 font-mono">{completion}%</span>
              </div>
            </div>
          </div>

          <div className="mb-6 hidden lg:block">
            <h1 className="text-base font-medium text-gray-100 tracking-tight">Edit Profile</h1>
            <p className="text-xs text-gray-500 mt-1">Keep your profile updated to get better job matches</p>
          </div>

          {/* BASIC INFO */}
          {activeSection === "Basic Info" && (
            <div className="flex flex-col gap-4">
              <p className="text-[10px] uppercase tracking-widest text-gray-600 border-b border-[#1a1a1e] pb-2">Basic Information</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: "name", label: "Full Name", placeholder: "Your full name" },
                  { name: "email", label: "Email", placeholder: "your@email.com", type: "email" },
                  { name: "phone", label: "Phone", placeholder: "+91 98765 43210" },
                  { name: "location", label: "Location", placeholder: "City, State" },
                ].map((f) => (
                  <div key={f.name} className="flex flex-col gap-1.5">
                    <label className="text-xs text-gray-500">{f.label}</label>
                    <input name={f.name} value={form[f.name]} onChange={handleChange}
                      type={f.type || "text"} placeholder={f.placeholder}
                      className="bg-[#0f0f11] border border-[#1e1e22] rounded-lg px-3 py-2.5 text-xs text-gray-200 outline-none focus:border-blue-500 transition-colors placeholder-gray-700" />
                  </div>
                ))}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs text-gray-500">Bio</label>
                  <textarea name="bio" value={form.bio} onChange={handleChange}
                    placeholder="Write a short intro about yourself..." rows={3}
                    className="bg-[#0f0f11] border border-[#1e1e22] rounded-lg px-3 py-2.5 text-xs text-gray-200 outline-none focus:border-blue-500 transition-colors placeholder-gray-700 resize-none" />
                </div>
              </div>
            </div>
          )}

          {/* EDUCATION */}
          {activeSection === "Education" && (
            <div className="flex flex-col gap-4">
              <p className="text-[10px] uppercase tracking-widest text-gray-600 border-b border-[#1a1a1e] pb-2">Education</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-500">Degree</label>
                  <select name="degree" value={form.degree} onChange={handleChange}
                    className="bg-[#0f0f11] border border-[#1e1e22] rounded-lg px-3 py-2.5 text-xs text-gray-200 outline-none focus:border-blue-500 transition-colors">
                    {["B.Tech", "B.Sc", "BCA", "MBA", "M.Tech", "MCA", "B.Com", "Other"].map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
                {[
                  { name: "branch", label: "Branch", placeholder: "e.g. Computer Science" },
                  { name: "college", label: "College", placeholder: "e.g. SPPU, Pune" },
                  { name: "cgpa", label: "CGPA", placeholder: "e.g. 8.4 CGPA" },
                ].map((f) => (
                  <div key={f.name} className="flex flex-col gap-1.5">
                    <label className="text-xs text-gray-500">{f.label}</label>
                    <input name={f.name} value={form[f.name]} onChange={handleChange}
                      placeholder={f.placeholder}
                      className="bg-[#0f0f11] border border-[#1e1e22] rounded-lg px-3 py-2.5 text-xs text-gray-200 outline-none focus:border-blue-500 transition-colors placeholder-gray-700" />
                  </div>
                ))}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-500">Graduation Year</label>
                  <select name="graduationYear" value={form.graduationYear} onChange={handleChange}
                    className="bg-[#0f0f11] border border-[#1e1e22] rounded-lg px-3 py-2.5 text-xs text-gray-200 outline-none focus:border-blue-500 transition-colors">
                    {["2024", "2025", "2026", "2027"].map((y) => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* SKILLS */}
          {activeSection === "Skills" && (
            <div className="flex flex-col gap-4">
              <p className="text-[10px] uppercase tracking-widest text-gray-600 border-b border-[#1a1a1e] pb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span key={s} className="flex items-center gap-1.5 text-xs text-gray-400 bg-[#111] border border-[#222] rounded-md px-2.5 py-1">
                    {s}
                    <button onClick={() => removeSkill(s)} className="text-gray-600 hover:text-gray-200 text-sm">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSkill(skillInput)}
                  placeholder="Type a skill and press Enter..."
                  className="flex-1 bg-[#0f0f11] border border-[#1e1e22] rounded-lg px-3 py-2.5 text-xs text-gray-200 outline-none focus:border-blue-500 transition-colors placeholder-gray-700" />
                <button onClick={() => addSkill(skillInput)}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-4 rounded-lg transition-colors">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {SKILL_SUGGESTIONS.filter((s) => !skills.includes(s)).map((s) => (
                  <button key={s} onClick={() => addSkill(s)}
                    className="text-xs text-gray-500 border border-dashed border-[#2a2a2e] rounded-md px-2.5 py-1 hover:border-blue-500 hover:text-blue-400 transition-colors">
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* RESUME */}
          {activeSection === "Resume" && (
            <div className="flex flex-col gap-4">
              <p className="text-[10px] uppercase tracking-widest text-gray-600 border-b border-[#1a1a1e] pb-2">Resume</p>
              {resumeName && (
                <div className="flex items-center gap-3 bg-blue-950 border border-blue-900 rounded-lg px-4 py-3">
                  <span className="text-xl">📄</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono text-blue-300 truncate">{resumeName}</p>
                    <p className="text-[10px] text-blue-600 mt-0.5">Current resume</p>
                  </div>
                  <button onClick={() => { setResumeName(""); setResumeFile(null); }}
                    className="text-xs text-blue-700 hover:text-red-400 transition-colors flex-shrink-0">Remove</button>
                </div>
              )}
              <label className="border border-dashed border-[#2a2a2e] hover:border-blue-500 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer transition-colors bg-[#0f0f11]">
                <span className="text-3xl">⬆</span>
                <p className="text-sm text-gray-400 text-center">
                  <span className="text-blue-400">Click to upload</span> or drag & drop
                </p>
                <p className="text-xs text-gray-600">PDF only · Max 5 MB</p>
                <input type="file" accept=".pdf" onChange={handleResumeChange} className="hidden" />
              </label>
              {resumeFile && (
                <div className="text-xs text-green-400 bg-green-950 border border-green-900 rounded-lg px-3 py-2">
                  ✓ {resumeFile.name} — click "Save Changes" to upload
                </div>
              )}
            </div>
          )}

          {/* LINKS */}
          {activeSection === "Links" && (
            <div className="flex flex-col gap-4">
              <p className="text-[10px] uppercase tracking-widest text-gray-600 border-b border-[#1a1a1e] pb-2">Links & Social</p>
              {[
                { name: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/yourprofile" },
                { name: "github", label: "GitHub", placeholder: "github.com/yourusername" },
                { name: "portfolio", label: "Portfolio", placeholder: "yourportfolio.dev" },
              ].map((link) => (
                <div key={link.name} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="text-xs text-gray-600 sm:w-20 flex-shrink-0">{link.label}</span>
                  <input name={link.name} value={form[link.name]} onChange={handleChange}
                    placeholder={link.placeholder}
                    className="flex-1 bg-[#0f0f11] border border-[#1e1e22] rounded-lg px-3 py-2.5 text-xs text-gray-200 outline-none focus:border-blue-500 transition-colors placeholder-gray-700" />
                </div>
              ))}
            </div>
          )}

          {/* SAVE BUTTON */}
          <div className="flex justify-end mt-8 pt-5 border-t border-[#1a1a1e]">
            <button onClick={handleSave} disabled={saving}
              className="w-full sm:w-auto text-sm bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-xl transition-colors disabled:opacity-50">
              {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
