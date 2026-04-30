import { useState } from "react";
import useProfile from "../../hooks/useProfile";

const AVAILABILITY_OPTIONS = [
  { value: "open-to-work", label: "Open to Work", color: "text-green-400 bg-green-500/10 border-green-500/30" },
  { value: "freelancing", label: "Freelancing", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
  { value: "not-available", label: "Not Available", color: "text-text-secondary bg-surface-container-high border-outline-variant" },
];

function ProfileHeader() {
  const { profile, updateProfile, updateAvatar } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarInput, setShowAvatarInput] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  // Edit form state
  const [editName, setEditName] = useState(profile.displayName || "");
  const [editTitle, setEditTitle] = useState(
    profile.experience?.[0]?.position || "Frontend Developer"
  );
  const [editBio, setEditBio] = useState(profile.bio || "");
  const [editLocation, setEditLocation] = useState(profile.location || "");
  const [editWebsite, setEditWebsite] = useState(profile.website || "");
  const [editAvailability, setEditAvailability] = useState(profile.availability || "open-to-work");

  const initials = profile.displayName
    ? profile.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const currentTitle = profile.experience?.[0]?.position || "Developer";
  const availOpt = AVAILABILITY_OPTIONS.find((o) => o.value === profile.availability) || AVAILABILITY_OPTIONS[0];

  const handleStartEdit = () => {
    setEditName(profile.displayName || "");
    setEditTitle(currentTitle);
    setEditBio(profile.bio || "");
    setEditLocation(profile.location || "");
    setEditWebsite(profile.website || "");
    setEditAvailability(profile.availability || "open-to-work");
    setIsEditing(true);
  };

  const handleSave = () => {
    updateProfile({
      displayName: editName.trim() || profile.displayName,
      bio: editBio.trim(),
      location: editLocation.trim(),
      website: editWebsite.trim(),
      availability: editAvailability,
    });
    // Update the current experience title if changed
    if (editTitle !== currentTitle && profile.experience?.length > 0) {
      const updatedExp = [...profile.experience];
      updatedExp[0] = { ...updatedExp[0], position: editTitle.trim() };
      updateProfile({ experience: updatedExp });
    }
    setIsEditing(false);
  };

  const handleAvatarSave = () => {
    if (avatarUrl.trim()) {
      updateAvatar(avatarUrl.trim());
    }
    setShowAvatarInput(false);
    setAvatarUrl("");
  };

  return (
    <section className="relative bg-surface-card rounded-xl border border-outline-variant p-6 md:p-8 mb-8 overflow-hidden">
      {/* Subtle gradient background accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-orange-rich opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
        {/* Avatar */}
        <div className="relative group cursor-pointer shrink-0" onClick={() => setShowAvatarInput(true)}>
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-surface overflow-hidden shadow-[0_0_15px_rgba(242,113,33,0.1)]">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-accent-orange-rich/20 flex items-center justify-center text-accent-orange-rich font-heading font-bold text-h1">
                {initials}
              </div>
            )}
          </div>
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-white text-3xl">edit</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          {isEditing ? (
            /* ── Edit Mode ── */
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Name */}
                <div>
                  <label className="font-heading text-[10px] uppercase tracking-wide text-text-secondary mb-1 block">Display Name</label>
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2 px-3 text-text-primary font-body text-body-md focus:outline-none focus:border-accent-orange-rich transition-colors" />
                </div>
                {/* Title */}
                <div>
                  <label className="font-heading text-[10px] uppercase tracking-wide text-text-secondary mb-1 block">Title / Role</label>
                  <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2 px-3 text-text-primary font-body text-body-md focus:outline-none focus:border-accent-orange-rich transition-colors" />
                </div>
                {/* Location */}
                <div>
                  <label className="font-heading text-[10px] uppercase tracking-wide text-text-secondary mb-1 block">Location</label>
                  <input type="text" value={editLocation} onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="e.g. Bengaluru, India"
                    className="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2 px-3 text-text-primary font-body text-body-md placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-orange-rich transition-colors" />
                </div>
                {/* Website */}
                <div>
                  <label className="font-heading text-[10px] uppercase tracking-wide text-text-secondary mb-1 block">Website</label>
                  <input type="url" value={editWebsite} onChange={(e) => setEditWebsite(e.target.value)}
                    placeholder="https://yoursite.com"
                    className="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2 px-3 text-text-primary font-body text-body-md placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-orange-rich transition-colors" />
                </div>
              </div>
              {/* Bio */}
              <div>
                <label className="font-heading text-[10px] uppercase tracking-wide text-text-secondary mb-1 block">Bio</label>
                <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} rows={3}
                  className="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2 px-3 text-text-primary font-body text-body-md resize-none focus:outline-none focus:border-accent-orange-rich transition-colors" />
              </div>
              {/* Availability dropdown */}
              <div>
                <label className="font-heading text-[10px] uppercase tracking-wide text-text-secondary mb-1 block">Availability</label>
                <select value={editAvailability} onChange={(e) => setEditAvailability(e.target.value)}
                  className="w-full md:w-64 bg-surface-container-high border border-outline-variant rounded-lg py-2 px-3 text-text-primary font-body text-body-md focus:outline-none focus:border-accent-orange-rich transition-colors appearance-none cursor-pointer">
                  {AVAILABILITY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              {/* Save / Cancel */}
              <div className="flex gap-2 pt-1">
                <button onClick={handleSave}
                  className="px-4 py-1.5 bg-accent-orange-rich text-white font-body text-body-sm font-medium rounded-lg hover:bg-accent-orange-rich/90 transition-colors">
                  Save Changes
                </button>
                <button onClick={() => setIsEditing(false)}
                  className="px-4 py-1.5 border border-outline-variant text-text-secondary font-body text-body-sm rounded-lg hover:text-text-primary hover:bg-surface-container-high transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* ── View Mode ── */
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="font-heading text-h1 text-text-primary flex items-center gap-3">
                    {profile.displayName}
                    <span className="material-symbols-outlined text-accent-orange-rich text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  </h1>
                  <p className="font-body text-body-lg text-on-surface-variant mt-1">{currentTitle}</p>
                </div>
                <button onClick={handleStartEdit}
                  className="bg-surface-container-high border border-outline-variant hover:border-outline text-text-primary font-body text-body-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-fit">
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Edit Profile
                </button>
              </div>
              <p className="font-body text-body-md text-text-secondary max-w-2xl">{profile.bio}</p>

              {/* Location & Website */}
              <div className="flex flex-wrap gap-4 text-body-sm font-body text-text-secondary">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    {profile.location}
                  </span>
                )}
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-accent-orange-rich hover:underline">
                    <span className="material-symbols-outlined text-[16px]">link</span>
                    {profile.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>

              {/* Availability chip */}
              <div className={`inline-flex items-center gap-2 border px-3 py-1.5 rounded-full mt-1 ${availOpt.color}`}>
                <div className={`w-2 h-2 rounded-full ${profile.availability === "open-to-work" ? "bg-green-400 shadow-[0_0_8px_#22C55E]" : profile.availability === "freelancing" ? "bg-blue-400 shadow-[0_0_8px_#3B82F6]" : "bg-text-secondary"}`} />
                <span className="font-heading text-label-caps uppercase">{availOpt.label}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Avatar URL input modal */}
      {showAvatarInput && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAvatarInput(false)}>
          <div className="bg-surface-card border border-outline-variant rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-heading text-body-md font-semibold text-text-primary mb-3">Update Profile Photo</h3>
            <input type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="Paste image URL..."
              className="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2 px-3 text-text-primary font-body text-body-md placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-orange-rich transition-colors mb-3" />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowAvatarInput(false)}
                className="px-3 py-1.5 text-text-secondary font-body text-body-sm rounded-lg border border-outline-variant hover:bg-surface-container-high transition-colors">
                Cancel
              </button>
              <button onClick={handleAvatarSave}
                className="px-3 py-1.5 bg-accent-orange-rich text-white font-body text-body-sm font-medium rounded-lg hover:bg-accent-orange-rich/90 transition-colors">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProfileHeader;
