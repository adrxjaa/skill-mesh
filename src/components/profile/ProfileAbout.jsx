import { useState } from "react";
import useProfile from "../../hooks/useProfile";

const EMPLOYMENT_TYPES = ["full-time", "part-time", "freelance", "internship", "contract"];
const PROJECT_STATUSES = ["ongoing", "completed", "paused"];

function ProfileAbout() {
  const {
    profile, updateProfile, updateSocialLinks,
    addOpenTo, removeOpenTo,
    addExperience, updateExperience, removeExperience,
    addProject, updateProject, removeProject,
  } = useProfile();

  return (
    <div className="space-y-8">
      <AboutMeSection aboutMe={profile.aboutMe} updateProfile={updateProfile} />
      <LinksSection socialLinks={profile.socialLinks} updateSocialLinks={updateSocialLinks} />
      <OpenToSection openTo={profile.openTo} addOpenTo={addOpenTo} removeOpenTo={removeOpenTo} />
      <ExperienceSection
        experience={profile.experience}
        addExperience={addExperience}
        updateExperience={updateExperience}
        removeExperience={removeExperience}
      />
      <ProjectsSection
        projects={profile.projects}
        addProject={addProject}
        updateProject={updateProject}
        removeProject={removeProject}
      />
      <ReviewsSection reviews={profile.reviews} />
    </div>
  );
}

/* ── About Me ── */
function AboutMeSection({ aboutMe, updateProfile }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(aboutMe || "");

  const save = () => { updateProfile({ aboutMe: text.trim() }); setEditing(false); };

  return (
    <section className="bg-surface-card border border-outline-variant rounded-xl p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading text-h3 text-text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-accent-orange-rich">person</span> About Me
        </h3>
        <button onClick={() => { setText(aboutMe || ""); setEditing(!editing); }}
          className="text-text-secondary hover:text-accent-orange-rich transition-colors">
          <span className="material-symbols-outlined text-[18px]">{editing ? "close" : "edit"}</span>
        </button>
      </div>
      {editing ? (
        <div>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4}
            className="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2 px-3 text-text-primary font-body text-body-md resize-none focus:outline-none focus:border-accent-orange-rich transition-colors mb-2" />
          <button onClick={save} className="px-3 py-1.5 bg-accent-orange-rich text-white font-body text-body-sm rounded-lg hover:bg-accent-orange-rich/90 transition-colors">Save</button>
        </div>
      ) : (
        <p className="font-body text-body-md text-text-secondary leading-relaxed">{aboutMe || "No bio added yet."}</p>
      )}
    </section>
  );
}

/* ── Social Links ── */
function LinksSection({ socialLinks, updateSocialLinks }) {
  const [editing, setEditing] = useState(false);
  const [links, setLinks] = useState(socialLinks || {});

  const save = () => { updateSocialLinks(links); setEditing(false); };

  const linkEntries = [
    { key: "github", icon: "code", label: "GitHub" },
    { key: "linkedin", icon: "badge", label: "LinkedIn" },
    { key: "portfolio", icon: "language", label: "Portfolio" },
  ];

  return (
    <section className="bg-surface-card border border-outline-variant rounded-xl p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading text-h3 text-text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-accent-orange-rich">link</span> Links
        </h3>
        <button onClick={() => { setLinks(socialLinks || {}); setEditing(!editing); }}
          className="text-text-secondary hover:text-accent-orange-rich transition-colors">
          <span className="material-symbols-outlined text-[18px]">{editing ? "close" : "edit"}</span>
        </button>
      </div>
      {editing ? (
        <div className="space-y-2">
          {linkEntries.map((l) => (
            <div key={l.key} className="flex items-center gap-2">
              <span className="material-symbols-outlined text-text-secondary text-[18px]">{l.icon}</span>
              <input type="text" value={links[l.key] || ""} onChange={(e) => setLinks({ ...links, [l.key]: e.target.value })}
                placeholder={l.label} className="flex-1 bg-surface-container-high border border-outline-variant rounded-lg py-1.5 px-3 text-text-primary font-body text-body-sm focus:outline-none focus:border-accent-orange-rich transition-colors" />
            </div>
          ))}
          <button onClick={save} className="mt-2 px-3 py-1.5 bg-accent-orange-rich text-white font-body text-body-sm rounded-lg hover:bg-accent-orange-rich/90 transition-colors">Save</button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {linkEntries.map((l) => socialLinks?.[l.key] ? (
            <a key={l.key} href={socialLinks[l.key].startsWith("http") ? socialLinks[l.key] : `https://${socialLinks[l.key]}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-accent-orange-rich hover:underline font-body text-body-sm">
              <span className="material-symbols-outlined text-[16px]">{l.icon}</span> {socialLinks[l.key]}
            </a>
          ) : null)}
          {!socialLinks?.github && !socialLinks?.linkedin && !socialLinks?.portfolio && (
            <p className="text-text-secondary font-body text-body-sm">No links added.</p>
          )}
        </div>
      )}
    </section>
  );
}

/* ── Open To ── */
function OpenToSection({ openTo, addOpenTo, removeOpenTo }) {
  const [input, setInput] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleAdd = () => { if (input.trim()) { addOpenTo(input); setInput(""); } };

  return (
    <section className="bg-surface-card border border-outline-variant rounded-xl p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading text-h3 text-text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-accent-orange-rich">handshake</span> Open To
        </h3>
        <button onClick={() => setShowInput(!showInput)} className="text-primary hover:text-accent-orange-rich font-body text-body-sm flex items-center gap-1 transition-colors">
          <span className="material-symbols-outlined text-sm">{showInput ? "close" : "add"}</span> {showInput ? "Cancel" : "Add"}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {openTo?.map((item) => (
          <div key={item} className="inline-flex items-center gap-1 bg-accent-orange-muted border border-accent-orange-rich/30 px-3 py-1.5 rounded-full group">
            <span className="font-body text-body-sm text-accent-orange-rich">{item}</span>
            <button onClick={() => removeOpenTo(item)} className="text-accent-orange-rich/50 group-hover:text-status-error transition-colors">
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>
        ))}
        {showInput && (
          <div className="inline-flex items-center gap-1 bg-surface-container-high border border-accent-orange-rich px-3 py-1 rounded-full">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") setShowInput(false); }}
              placeholder="e.g. Hackathons" autoFocus
              className="bg-transparent border-none text-text-primary font-body text-body-sm w-28 focus:outline-none placeholder:text-text-secondary/50" />
            <button onClick={handleAdd} disabled={!input.trim()} className="text-accent-orange-rich disabled:text-text-secondary/30">
              <span className="material-symbols-outlined text-[16px]">check</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Experience ── */
function ExperienceSection({ experience, addExperience, updateExperience, removeExperience }) {
  const [adding, setAdding] = useState(false);
  const [editIdx, setEditIdx] = useState(null);

  const emptyExp = { company: "", position: "", employmentType: "full-time", location: "", startDate: "", endDate: null, isCurrent: false, description: "", skills: [] };

  return (
    <section className="bg-surface-card border border-outline-variant rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-h3 text-text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-accent-orange-rich">work_history</span> Experience
        </h3>
        <button onClick={() => { setAdding(!adding); setEditIdx(null); }} className="text-primary hover:text-accent-orange-rich font-body text-body-sm flex items-center gap-1 transition-colors">
          <span className="material-symbols-outlined text-sm">{adding ? "close" : "add"}</span> {adding ? "Cancel" : "Add"}
        </button>
      </div>
      {adding && <ExpForm initial={emptyExp} onSave={(data) => { addExperience(data); setAdding(false); }} onCancel={() => setAdding(false)} />}
      <div className="space-y-4">
        {experience?.map((exp, i) => (
          <div key={i}>
            {editIdx === i ? (
              <ExpForm initial={exp} onSave={(data) => { updateExperience(i, data); setEditIdx(null); }} onCancel={() => setEditIdx(null)} />
            ) : (
              <div className="flex gap-3 items-start group">
                <div className="w-2 h-2 mt-2 rounded-full bg-accent-orange-rich flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading text-body-md font-semibold text-text-primary">{exp.position}</h4>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditIdx(i); setAdding(false); }} className="text-text-secondary hover:text-accent-orange-rich"><span className="material-symbols-outlined text-[16px]">edit</span></button>
                      <button onClick={() => removeExperience(i)} className="text-text-secondary hover:text-status-error"><span className="material-symbols-outlined text-[16px]">delete</span></button>
                    </div>
                  </div>
                  <p className="font-body text-body-sm text-text-secondary">{exp.company} · {exp.employmentType} · {exp.location}</p>
                  <p className="font-body text-body-sm text-text-secondary/70">
                    {exp.startDate?.slice(0, 7)} — {exp.isCurrent ? "Present" : exp.endDate?.slice(0, 7) || "N/A"}
                  </p>
                  {exp.description && <p className="font-body text-body-sm text-text-secondary mt-1">{exp.description}</p>}
                  {exp.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {exp.skills.map((s) => <span key={s} className="px-2 py-0.5 bg-surface-container-high border border-outline-variant rounded text-text-secondary font-body text-[11px]">{s}</span>)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function ExpForm({ initial, onSave, onCancel }) {
  const [data, setData] = useState({ ...initial });
  const set = (k, v) => setData((p) => ({ ...p, [k]: v }));

  return (
    <div className="bg-surface-container-high border border-outline-variant rounded-lg p-4 mb-4 space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input type="text" value={data.position} onChange={(e) => set("position", e.target.value)} placeholder="Position *" className="bg-surface border border-outline-variant rounded-lg py-1.5 px-3 text-text-primary font-body text-body-sm focus:outline-none focus:border-accent-orange-rich" />
        <input type="text" value={data.company} onChange={(e) => set("company", e.target.value)} placeholder="Company *" className="bg-surface border border-outline-variant rounded-lg py-1.5 px-3 text-text-primary font-body text-body-sm focus:outline-none focus:border-accent-orange-rich" />
        <select value={data.employmentType} onChange={(e) => set("employmentType", e.target.value)} className="bg-surface border border-outline-variant rounded-lg py-1.5 px-3 text-text-primary font-body text-body-sm focus:outline-none focus:border-accent-orange-rich appearance-none cursor-pointer">
          {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select>
        <input type="text" value={data.location} onChange={(e) => set("location", e.target.value)} placeholder="Location" className="bg-surface border border-outline-variant rounded-lg py-1.5 px-3 text-text-primary font-body text-body-sm focus:outline-none focus:border-accent-orange-rich" />
        <input type="date" value={data.startDate?.slice(0, 10) || ""} onChange={(e) => set("startDate", e.target.value)} className="bg-surface border border-outline-variant rounded-lg py-1.5 px-3 text-text-primary font-body text-body-sm focus:outline-none focus:border-accent-orange-rich" />
        {!data.isCurrent && <input type="date" value={data.endDate?.slice(0, 10) || ""} onChange={(e) => set("endDate", e.target.value)} className="bg-surface border border-outline-variant rounded-lg py-1.5 px-3 text-text-primary font-body text-body-sm focus:outline-none focus:border-accent-orange-rich" />}
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={data.isCurrent} onChange={(e) => set("isCurrent", e.target.checked)} className="sr-only peer" />
        <div className="w-8 h-[18px] bg-surface-container-high rounded-full peer-checked:bg-accent-orange-rich transition-colors relative">
          <div className={`absolute top-[2px] w-[14px] h-[14px] bg-white rounded-full transition-transform ${data.isCurrent ? "translate-x-[16px]" : "translate-x-[2px]"}`} />
        </div>
        <span className="font-body text-body-sm text-text-secondary">Currently working here</span>
      </label>
      <textarea value={data.description} onChange={(e) => set("description", e.target.value)} placeholder="Description" rows={2} className="w-full bg-surface border border-outline-variant rounded-lg py-1.5 px-3 text-text-primary font-body text-body-sm resize-none focus:outline-none focus:border-accent-orange-rich" />
      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave(data)} disabled={!data.position.trim() || !data.company.trim()} className="px-3 py-1.5 bg-accent-orange-rich text-white font-body text-body-sm rounded-lg hover:bg-accent-orange-rich/90 disabled:opacity-40 transition-colors">Save</button>
        <button onClick={onCancel} className="px-3 py-1.5 border border-outline-variant text-text-secondary font-body text-body-sm rounded-lg hover:text-text-primary transition-colors">Cancel</button>
      </div>
    </div>
  );
}

/* ── Projects ── */
function ProjectsSection({ projects, addProject, updateProject, removeProject }) {
  const [adding, setAdding] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const emptyProj = { title: "", description: "", role: "", techStack: [], status: "ongoing", highlights: [] };

  return (
    <section className="bg-surface-card border border-outline-variant rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-h3 text-text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-accent-orange-rich">rocket_launch</span> Projects
        </h3>
        <button onClick={() => { setAdding(!adding); setEditIdx(null); }} className="text-primary hover:text-accent-orange-rich font-body text-body-sm flex items-center gap-1 transition-colors">
          <span className="material-symbols-outlined text-sm">{adding ? "close" : "add"}</span> {adding ? "Cancel" : "Add"}
        </button>
      </div>
      {adding && <ProjForm initial={emptyProj} onSave={(d) => { addProject(d); setAdding(false); }} onCancel={() => setAdding(false)} />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects?.map((proj, i) => (
          <div key={i}>
            {editIdx === i ? (
              <ProjForm initial={proj} onSave={(d) => { updateProject(i, d); setEditIdx(null); }} onCancel={() => setEditIdx(null)} />
            ) : (
              <div className="bg-surface-container-high border border-outline-variant rounded-lg p-4 group hover:border-accent-orange-rich/30 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-heading text-body-md font-semibold text-text-primary">{proj.title}</h4>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditIdx(i); setAdding(false); }} className="text-text-secondary hover:text-accent-orange-rich"><span className="material-symbols-outlined text-[14px]">edit</span></button>
                    <button onClick={() => removeProject(i)} className="text-text-secondary hover:text-status-error"><span className="material-symbols-outlined text-[14px]">delete</span></button>
                  </div>
                </div>
                <p className="font-body text-body-sm text-text-secondary mb-2">{proj.description}</p>
                <span className={`inline-block text-[10px] uppercase tracking-wide font-heading px-2 py-0.5 rounded ${proj.status === "completed" ? "bg-green-500/10 text-green-400" : proj.status === "paused" ? "bg-yellow-500/10 text-yellow-400" : "bg-accent-orange-muted text-accent-orange-rich"}`}>{proj.status}</span>
                {proj.techStack?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {proj.techStack.map((t) => <span key={t} className="px-2 py-0.5 bg-surface border border-outline-variant rounded text-text-secondary font-body text-[11px]">{t}</span>)}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjForm({ initial, onSave, onCancel }) {
  const [data, setData] = useState({ ...initial });
  const [techText, setTechText] = useState(initial.techStack?.join(", ") || "");
  const set = (k, v) => setData((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    onSave({ ...data, techStack: techText.split(",").map((s) => s.trim()).filter(Boolean) });
  };

  return (
    <div className="bg-surface border border-outline-variant rounded-lg p-4 mb-4 space-y-2">
      <input type="text" value={data.title} onChange={(e) => set("title", e.target.value)} placeholder="Project title *" className="w-full bg-surface-container-high border border-outline-variant rounded-lg py-1.5 px-3 text-text-primary font-body text-body-sm focus:outline-none focus:border-accent-orange-rich" />
      <textarea value={data.description} onChange={(e) => set("description", e.target.value)} placeholder="Description" rows={2} className="w-full bg-surface-container-high border border-outline-variant rounded-lg py-1.5 px-3 text-text-primary font-body text-body-sm resize-none focus:outline-none focus:border-accent-orange-rich" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input type="text" value={data.role} onChange={(e) => set("role", e.target.value)} placeholder="Your role" className="bg-surface-container-high border border-outline-variant rounded-lg py-1.5 px-3 text-text-primary font-body text-body-sm focus:outline-none focus:border-accent-orange-rich" />
        <select value={data.status} onChange={(e) => set("status", e.target.value)} className="bg-surface-container-high border border-outline-variant rounded-lg py-1.5 px-3 text-text-primary font-body text-body-sm focus:outline-none focus:border-accent-orange-rich appearance-none cursor-pointer">
          {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>
      <input type="text" value={techText} onChange={(e) => setTechText(e.target.value)} placeholder="Tech stack (comma-separated)" className="w-full bg-surface-container-high border border-outline-variant rounded-lg py-1.5 px-3 text-text-primary font-body text-body-sm focus:outline-none focus:border-accent-orange-rich" />
      <div className="flex gap-2 pt-1">
        <button onClick={handleSave} disabled={!data.title.trim()} className="px-3 py-1.5 bg-accent-orange-rich text-white font-body text-body-sm rounded-lg hover:bg-accent-orange-rich/90 disabled:opacity-40 transition-colors">Save</button>
        <button onClick={onCancel} className="px-3 py-1.5 border border-outline-variant text-text-secondary font-body text-body-sm rounded-lg hover:text-text-primary transition-colors">Cancel</button>
      </div>
    </div>
  );
}

/* ── Reviews (read-only) ── */
function ReviewsSection({ reviews }) {
  if (!reviews?.length) return null;

  return (
    <section className="bg-surface-card border border-outline-variant rounded-xl p-6">
      <h3 className="font-heading text-h3 text-text-primary flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-accent-orange-rich">rate_review</span> Reviews
      </h3>
      <div className="space-y-4">
        {reviews.map((r, i) => (
          <div key={i} className="bg-surface-container-high border border-outline-variant rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-text-secondary font-heading font-bold text-[11px]">{r.reviewerInitials}</div>
              <div>
                <p className="font-heading text-body-sm font-semibold text-text-primary">{r.reviewerName}</p>
                <p className="font-body text-[11px] text-text-secondary">{r.project} · {r.date}</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} className={`material-symbols-outlined text-[16px] ${j < r.rating ? "text-accent-orange-rich" : "text-text-secondary/30"}`} style={j < r.rating ? { fontVariationSettings: "'FILL' 1" } : {}}>star</span>
                ))}
              </div>
            </div>
            <p className="font-body text-body-sm text-text-secondary leading-relaxed">"{r.text}"</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProfileAbout;
