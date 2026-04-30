import { useState } from "react";
import useProfile from "../../hooks/useProfile";

function ProfileSkills() {
  const { profile, addSkill, removeSkill } = useProfile();
  const [showInput, setShowInput] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const handleAdd = () => {
    if (newSkill.trim()) {
      addSkill(newSkill);
      setNewSkill("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
    if (e.key === "Escape") {
      setShowInput(false);
      setNewSkill("");
    }
  };

  return (
    <section className="bg-surface-card rounded-xl border border-outline-variant p-6 md:p-8 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-h3 text-text-primary">Core Skills</h3>
        <button
          onClick={() => setShowInput(!showInput)}
          className="text-primary hover:text-accent-orange-rich font-body text-body-sm flex items-center gap-1 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">{showInput ? "close" : "add"}</span>
          {showInput ? "Cancel" : "Add Skill"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {profile.skills?.map((skill) => (
          <div
            key={skill}
            className="inline-flex items-center gap-1 bg-surface-container-high border border-outline-variant px-3 py-1.5 rounded-full group hover:border-accent-orange-rich hover:shadow-[0_0_8px_rgba(242,113,33,0.3)] transition-all"
          >
            <span className="font-body text-body-sm text-on-surface group-hover:text-primary">
              {skill}
            </span>
            <button
              onClick={() => removeSkill(skill)}
              className="text-text-secondary group-hover:text-status-error transition-colors ml-0.5"
              title={`Remove ${skill}`}
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        ))}

        {/* Add skill input */}
        {showInput && (
          <div className="inline-flex items-center gap-1 bg-surface-container-high border border-accent-orange-rich px-3 py-1 rounded-full">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type skill..."
              autoFocus
              className="bg-transparent border-none text-text-primary font-body text-body-sm w-28 focus:outline-none placeholder:text-text-secondary/50"
            />
            <button
              onClick={handleAdd}
              disabled={!newSkill.trim()}
              className="text-accent-orange-rich disabled:text-text-secondary/30 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">check</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProfileSkills;
