import { useState, useContext, useEffect } from "react";
import ProjectContext from "../../context/ProjectContext";
import AuthContext from "../../context/AuthContext";

/**
 * ConnectModal — invites a user to a project.
 *
 * Props:
 *   isOpen: bool
 *   onClose: fn
 *   targetUser: { id, fullName, avatar, title }
 *   sourcePost: string | null   (post id if coming from a post)
 */
export default function ConnectModal({ isOpen, onClose, targetUser, sourcePost }) {
  const { user } = useContext(AuthContext);
  const { projects, createProject } = useContext(ProjectContext);

  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  // my owned projects only
  const myProjects = projects.filter((p) => p.owner?._id === user?.id || p.owner === user?.id);

  useEffect(() => {
    if (!isOpen) {
      setSelectedProjectId("");
      setShowCreate(false);
      setNewTitle("");
      setNewDesc("");
      setSending(false);
      setDone(false);
    }
    // If user has no projects, auto-show create form
    if (isOpen && myProjects.length === 0) setShowCreate(true);
  }, [isOpen]); // eslint-disable-line

  // Close on Escape
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [isOpen, onClose]);

  const { inviteToProject } = useContext(ProjectContext);

  const handleSend = async () => {
    setSending(true);
    try {
      let pid = selectedProjectId;
      if (showCreate && newTitle.trim()) {
        const created = await createProject({ title: newTitle.trim(), description: newDesc.trim() });
        pid = created._id;
      }
      if (!pid) { setSending(false); return; }
      await inviteToProject(pid, { targetUserId: targetUser.id, sourcePost: sourcePost || null });
      setDone(true);
    } catch (err) {
      console.error("Invite failed:", err);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  const initials = (targetUser?.fullName || "?").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface-card border border-surface-container-high rounded-2xl shadow-2xl overflow-hidden animate-[slideUp_0.2s_ease]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-container-high">
          <h2 className="font-heading font-bold text-text-primary text-base">
            {sourcePost ? "Express Interest" : "Invite to Project"}
          </h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary p-1 rounded-lg hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="px-5 py-4">
          {done ? (
            <div className="flex flex-col items-center py-6 gap-3">
              <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-green-400 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <p className="font-heading font-semibold text-text-primary">Invite sent!</p>
              <p className="text-text-secondary text-sm text-center font-body">
                {targetUser.fullName} will see your project invite in their Active Projects.
              </p>
              <button onClick={onClose} className="mt-2 px-4 py-2 bg-surface-container-high text-text-primary rounded-lg font-body text-sm hover:bg-surface-container-highest transition-colors">
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Target user */}
              <div className="flex items-center gap-3 p-3 bg-surface-container-high rounded-xl mb-4">
                <div className="w-10 h-10 rounded-full bg-accent-orange-rich/20 flex items-center justify-center text-accent-orange-rich font-heading font-bold text-sm overflow-hidden flex-shrink-0">
                  {targetUser.avatar
                    ? <img src={targetUser.avatar.startsWith("/uploads") ? `http://localhost:5000${targetUser.avatar}` : targetUser.avatar} alt="" className="w-full h-full object-cover" />
                    : initials}
                </div>
                <div>
                  <p className="font-heading font-semibold text-text-primary text-sm">{targetUser.fullName}</p>
                  <p className="text-text-secondary text-xs font-body">{targetUser.title || "Builder"}</p>
                </div>
              </div>

              {sourcePost && (
                <div className="mb-4 px-3 py-2 bg-accent-orange-muted border border-accent-orange-rich/30 rounded-lg">
                  <p className="text-accent-orange-rich text-xs font-body">
                    <span className="font-semibold">Context:</span> Inviting based on their post
                  </p>
                </div>
              )}

              {/* Project selection */}
              {!showCreate && myProjects.length > 0 && (
                <div className="mb-4">
                  <label className="text-xs font-heading uppercase tracking-wide text-text-secondary mb-2 block">
                    Select a project to invite them to
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {myProjects.map((p) => (
                      <label key={p._id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedProjectId === p._id ? "border-accent-orange-rich bg-accent-orange-muted" : "border-outline-variant hover:border-accent-orange-rich/50"}`}>
                        <input
                          type="radio"
                          name="project"
                          value={p._id}
                          checked={selectedProjectId === p._id}
                          onChange={() => setSelectedProjectId(p._id)}
                          className="sr-only"
                        />
                        <span className="material-symbols-outlined text-accent-orange-rich text-[20px]">folder_special</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-heading font-semibold text-text-primary text-sm truncate">{p.title}</p>
                          <p className="text-text-secondary text-xs">{p.members?.length || 1} member{(p.members?.length || 1) > 1 ? "s" : ""}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowCreate(true)}
                    className="mt-2 w-full text-center text-xs text-accent-orange-rich hover:text-accent-orange-rich/80 font-body py-2 border border-dashed border-accent-orange-rich/40 rounded-lg hover:bg-accent-orange-muted transition-colors"
                  >
                    + Create a new project instead
                  </button>
                </div>
              )}

              {/* Create project form */}
              {showCreate && (
                <div className="mb-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-heading uppercase tracking-wide text-text-secondary">Create a new project</label>
                    {myProjects.length > 0 && (
                      <button onClick={() => setShowCreate(false)} className="text-xs text-text-secondary hover:text-text-primary font-body">
                        ← Back to my projects
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Project name *"
                    className="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2.5 px-3 text-text-primary font-body text-sm focus:outline-none focus:border-accent-orange-rich transition-colors"
                  />
                  <textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Short description (optional)"
                    rows={2}
                    className="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2.5 px-3 text-text-primary font-body text-sm resize-none focus:outline-none focus:border-accent-orange-rich transition-colors"
                  />
                </div>
              )}

              {/* Send button */}
              <button
                onClick={handleSend}
                disabled={sending || (showCreate ? !newTitle.trim() : !selectedProjectId)}
                className="w-full bg-accent-orange-rich text-white font-heading font-semibold py-2.5 rounded-lg hover:bg-accent-orange-rich/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending invite...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    Send Project Invite
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
