import { useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { uploadFile } from "../../services/profileApi";

const STEPS = ["Photo & Name", "Bio & Location", "Links", "Skills", "Done"];

function Step({ label, index, current }) {
  const done = index < current;
  const active = index === current;
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-heading font-bold transition-all ${
          done
            ? "bg-accent-orange-rich text-white"
            : active
            ? "bg-accent-orange-rich/20 border-2 border-accent-orange-rich text-accent-orange-rich"
            : "bg-surface-container-high text-text-secondary"
        }`}
      >
        {done ? (
          <span className="material-symbols-outlined text-[14px]">check</span>
        ) : (
          index + 1
        )}
      </div>
      <span
        className={`text-xs font-heading hidden sm:block ${
          active ? "text-text-primary font-semibold" : "text-text-secondary"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

export default function ProfileSetupModal() {
  const { user, updateMe } = useContext(AuthContext);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Step 0 — Photo & Name & Title
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [title, setTitle] = useState(user?.title || "");

  // Step 1 — Bio & Location
  const [bio, setBio] = useState(user?.bio || "");
  const [location, setLocation] = useState(user?.location || "");

  // Step 2 — Links
  const [portfolio, setPortfolio] = useState(user?.socialLinks?.portfolio || "");
  const [github, setGithub] = useState(user?.socialLinks?.github || "");
  const [linkedin, setLinkedin] = useState(user?.socialLinks?.linkedin || "");

  // Step 3 — Skills
  const [skills, setSkills] = useState(user?.skills || []);
  const [skillInput, setSkillInput] = useState("");

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills((prev) => [...prev, s]);
    setSkillInput("");
  };

  const removeSkill = (s) => setSkills((prev) => prev.filter((x) => x !== s));

  const handleFinish = async () => {
    setSaving(true);
    try {
      let finalAvatar = avatar;
      if (avatarFile) {
        finalAvatar = await uploadFile(avatarFile);
      }
      await updateMe({
        fullName,
        title,
        bio,
        location,
        avatar: finalAvatar,
        socialLinks: { portfolio, github, linkedin },
        skills,
        profileComplete: true,
      });
    } catch (err) {
      console.error("Profile setup failed:", err);
      // Even on API failure, mark complete locally so they aren't stuck
      await updateMe({ profileComplete: true }).catch(() => {});
    } finally {
      setSaving(false);
    }
  };

  const initials = (fullName || user?.fullName || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-surface-card border border-surface-container-high rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-surface-container-high">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-heading font-bold text-text-primary text-lg">
              Complete your profile
            </h2>
            <span className="text-xs text-text-secondary font-body">
              Step {step + 1} of {STEPS.length}
            </span>
          </div>
          {/* Step indicators */}
          <div className="flex items-center gap-3 mt-3">
            {STEPS.map((label, i) => (
              <div key={i} className="flex items-center gap-1">
                <Step label={label} index={i} current={step} />
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-px w-4 sm:w-8 ${
                      i < step ? "bg-accent-orange-rich" : "bg-surface-container-high"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-1 bg-surface-container-high rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-orange-rich rounded-full transition-all duration-500"
              style={{ width: `${((step) / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5 min-h-[280px]">
          {/* Step 0: Photo & Name & Title */}
          {step === 0 && (
            <div className="flex flex-col items-center gap-5">
              <label className="cursor-pointer group relative">
                <div className="w-24 h-24 rounded-full bg-accent-orange-rich/20 border-2 border-dashed border-accent-orange-rich/40 flex items-center justify-center overflow-hidden group-hover:border-accent-orange-rich transition-colors">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-heading font-bold text-accent-orange-rich">
                      {initials}
                    </span>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-white text-2xl">photo_camera</span>
                </div>
                <input type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
              </label>
              <p className="text-xs text-text-secondary font-body -mt-2">Click to upload photo</p>
              <div className="w-full space-y-3">
                <div>
                  <label className="text-xs font-heading uppercase tracking-wide text-text-secondary mb-1 block">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Arjun Krishnan"
                    className="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2.5 px-3 text-text-primary font-body focus:outline-none focus:border-accent-orange-rich transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-heading uppercase tracking-wide text-text-secondary mb-1 block">Title / Role</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2.5 px-3 text-text-primary font-body focus:outline-none focus:border-accent-orange-rich transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Bio & Location */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-heading uppercase tracking-wide text-text-secondary mb-1 block">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={5}
                  placeholder="Tell people about yourself — what you build, what you're looking for..."
                  className="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2.5 px-3 text-text-primary font-body resize-none focus:outline-none focus:border-accent-orange-rich transition-colors leading-relaxed"
                />
                <p className="text-xs text-text-secondary/60 mt-1 text-right">{bio.length}/500</p>
              </div>
              <div>
                <label className="text-xs font-heading uppercase tracking-wide text-text-secondary mb-1 block">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bengaluru, India (Remote)"
                  className="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2.5 px-3 text-text-primary font-body focus:outline-none focus:border-accent-orange-rich transition-colors"
                />
              </div>
            </div>
          )}

          {/* Step 2: Links */}
          {step === 2 && (
            <div className="space-y-4">
              {[
                { label: "Portfolio / Website", icon: "language", value: portfolio, set: setPortfolio, placeholder: "https://yoursite.com" },
                { label: "GitHub", icon: "code", value: github, set: setGithub, placeholder: "https://github.com/username" },
                { label: "LinkedIn", icon: "work", value: linkedin, set: setLinkedin, placeholder: "https://linkedin.com/in/username" },
              ].map(({ label, icon, value, set, placeholder }) => (
                <div key={label}>
                  <label className="text-xs font-heading uppercase tracking-wide text-text-secondary mb-1 block">{label}</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[18px]">{icon}</span>
                    <input
                      type="url"
                      value={value}
                      onChange={(e) => set(e.target.value)}
                      placeholder={placeholder}
                      className="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2.5 pl-9 pr-3 text-text-primary font-body placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-orange-rich transition-colors"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 3: Skills */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-heading uppercase tracking-wide text-text-secondary mb-1 block">Add Skills</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                    placeholder="e.g. React, Node.js, Figma"
                    className="flex-1 bg-surface-container-high border border-outline-variant rounded-lg py-2.5 px-3 text-text-primary font-body focus:outline-none focus:border-accent-orange-rich transition-colors"
                  />
                  <button
                    onClick={addSkill}
                    className="px-3 py-2 bg-accent-orange-muted text-accent-orange-rich rounded-lg hover:bg-accent-orange-rich hover:text-white transition-colors font-body text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[80px] p-3 bg-surface-container-high rounded-lg border border-outline-variant">
                {skills.length === 0 && (
                  <p className="text-text-secondary/50 font-body text-sm self-center mx-auto">Your skills will appear here</p>
                )}
                {skills.map((s) => (
                  <span key={s} className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-highest rounded-full text-sm font-body text-text-primary border border-outline-variant">
                    {s}
                    <button onClick={() => removeSkill(s)} className="text-text-secondary hover:text-red-400 transition-colors">
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Done */}
          {step === 4 && (
            <div className="flex flex-col items-center justify-center h-full py-6 gap-4">
              <div className="w-16 h-16 rounded-full bg-accent-orange-rich/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-accent-orange-rich text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  celebration
                </span>
              </div>
              <h3 className="font-heading font-bold text-text-primary text-xl">You're all set!</h3>
              <p className="text-text-secondary font-body text-center text-sm max-w-xs">
                Your profile is ready. Start exploring SkillMesh, connect with builders, and find your team.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-surface-container-high flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="px-4 py-2 text-text-secondary hover:text-text-primary font-body text-sm border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 0 && !fullName.trim()}
              className="px-5 py-2 bg-accent-orange-rich text-white font-heading font-semibold text-sm rounded-lg hover:bg-accent-orange-rich/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Continue
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={saving}
              className="px-5 py-2 bg-accent-orange-rich text-white font-heading font-semibold text-sm rounded-lg hover:bg-accent-orange-rich/90 transition-all disabled:opacity-40 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
                  Launch my profile
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
