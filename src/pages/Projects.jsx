import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectContext from "../context/ProjectContext";
import useAuth from "../hooks/useAuth";

function Projects() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { projects, invites, loading, respondToInvite, respondToRequest, createProject, endProject } = useContext(ProjectContext);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [endingId, setEndingId] = useState(null);
  const [confirmEndId, setConfirmEndId] = useState(null);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      await createProject({ title: newTitle.trim(), description: newDesc.trim() });
      setNewTitle("");
      setNewDesc("");
      setShowCreate(false);
    } finally {
      setCreating(false);
    }
  };

  const handleEndProject = async (projectId) => {
    setEndingId(projectId);
    try {
      await endProject(projectId);
    } finally {
      setEndingId(null);
      setConfirmEndId(null);
    }
  };

  const avatarSrc = (m) =>
    m?.avatar ? (m.avatar.startsWith("/uploads") ? `http://localhost:5000${m.avatar}` : m.avatar) : null;

  return (
    <div className="flex-1 p-5 pb-24 lg:pb-8 max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-text-primary text-2xl">Active Projects</h1>
          <p className="text-text-secondary font-body text-sm mt-0.5">
            Collaborate with your team and manage invites
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-accent-orange-rich text-white px-4 py-2 rounded-lg font-heading font-semibold text-sm hover:bg-accent-orange-rich/90 transition-all flex items-center gap-2 active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Project
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="bg-surface-card border border-accent-orange-rich/30 rounded-xl p-5 mb-6">
          <h3 className="font-heading font-semibold text-text-primary mb-3">Create Project</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Project title *"
              className="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2.5 px-3 text-text-primary font-body focus:outline-none focus:border-accent-orange-rich transition-colors"
            />
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="What are you building? (optional)"
              rows={2}
              className="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2.5 px-3 text-text-primary font-body resize-none focus:outline-none focus:border-accent-orange-rich transition-colors"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowCreate(false)}
                className="px-3 py-2 text-text-secondary border border-outline-variant rounded-lg font-body text-sm hover:bg-surface-container-high transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newTitle.trim() || creating}
                className="px-4 py-2 bg-accent-orange-rich text-white rounded-lg font-body text-sm font-medium hover:bg-accent-orange-rich/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pending Invites */}
      {invites.length > 0 && (
        <section className="mb-6">
          <h2 className="font-heading font-semibold text-text-primary text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-orange-rich animate-pulse" />
            Pending Invites ({invites.length})
          </h2>
          <div className="flex flex-col gap-3">
            {invites.map(({ project, invite }) => (
              <div key={project._id} className="bg-surface-card border border-accent-orange-rich/30 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent-orange-muted flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-accent-orange-rich">folder_special</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-semibold text-text-primary truncate">{project.title}</p>
                  <p className="text-text-secondary text-xs font-body">
                    Invited by {project.owner?.fullName}
                    {invite?.sourcePost ? " · from a post" : ""}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => respondToInvite(project._id, "decline")}
                    className="px-3 py-1.5 text-text-secondary border border-outline-variant rounded-lg font-body text-xs hover:bg-surface-container-high transition-colors"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => respondToInvite(project._id, "accept")}
                    className="px-3 py-1.5 bg-accent-orange-rich text-white rounded-lg font-body text-xs font-medium hover:bg-accent-orange-rich/90 transition-all"
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* My Projects */}
      <section>
        <h2 className="font-heading font-semibold text-text-secondary text-sm uppercase tracking-wide mb-3">
          My Projects
        </h2>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-surface-card border border-surface-container-high rounded-xl p-4 h-24 animate-pulse" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-surface-card border border-surface-container-high rounded-xl p-8 text-center">
            <span className="material-symbols-outlined text-5xl text-text-secondary/30 mb-3 block">folder_open</span>
            <p className="font-heading font-semibold text-text-primary mb-1">No projects yet</p>
            <p className="text-text-secondary font-body text-sm mb-4">
              Create a project and start inviting collaborators
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="px-4 py-2 bg-accent-orange-rich text-white rounded-lg font-heading font-semibold text-sm hover:bg-accent-orange-rich/90 transition-all"
            >
              Create your first project
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {projects.map((project) => {
              const isOwner = project.owner?._id === (user?.id || user?._id) || project.owner === (user?.id || user?._id);
              const isCompleted = project.status === "completed";

              return (
                <div key={project._id} className={`bg-surface-card border rounded-xl p-4 transition-colors ${isCompleted ? "border-surface-container-high opacity-70" : "border-surface-container-high hover:border-accent-orange-rich/30"}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isCompleted ? "bg-surface-container-high" : "bg-accent-orange-muted"}`}>
                      <span className={`material-symbols-outlined ${isCompleted ? "text-text-secondary" : "text-accent-orange-rich"}`}>
                        {isCompleted ? "folder_off" : "folder_special"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-heading font-semibold text-text-primary truncate">{project.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wide ${
                          project.status === "active"
                            ? "bg-green-500/10 text-green-400"
                            : project.status === "completed"
                            ? "bg-surface-container-high text-text-secondary"
                            : "bg-surface-container-high text-text-secondary"
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      {project.description && (
                        <p className="text-text-secondary font-body text-sm mb-2 line-clamp-1">{project.description}</p>
                      )}

                      {/* Members — clickable to view profile */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex -space-x-2">
                          {(project.members || []).slice(0, 5).map((m, i) => {
                            const mid = m._id || m;
                            const isMe = mid === (user?.id || user?._id);
                            const src = avatarSrc(m);
                            return (
                              <button
                                key={i}
                                onClick={() => !isMe && navigate(`/profile/${mid}`)}
                                title={isMe ? "You" : m.fullName}
                                className={`w-7 h-7 rounded-full border-2 border-surface-card overflow-hidden flex items-center justify-center text-[9px] font-heading font-bold transition-transform ${!isMe ? "hover:scale-110 cursor-pointer" : "cursor-default"} bg-accent-orange-rich/20 text-accent-orange-rich`}
                              >
                                {src
                                  ? <img src={src} alt={m.fullName} className="w-full h-full object-cover" />
                                  : (m.fullName || "?")[0]}
                              </button>
                            );
                          })}
                        </div>
                        <span className="text-text-secondary text-xs font-body">
                          {project.members?.length || 1} member{(project.members?.length || 1) !== 1 ? "s" : ""}
                        </span>

                        {/* End project button — owner only, active only */}
                        {isOwner && !isCompleted && (
                          confirmEndId === project._id ? (
                            <div className="ml-auto flex items-center gap-2">
                              <span className="text-text-secondary text-xs font-body">End this project?</span>
                              <button
                                onClick={() => setConfirmEndId(null)}
                                className="px-2 py-1 text-text-secondary border border-outline-variant rounded font-body text-xs hover:bg-surface-container-high transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleEndProject(project._id)}
                                disabled={endingId === project._id}
                                className="px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded font-body text-xs hover:bg-red-500/30 transition-colors disabled:opacity-50"
                              >
                                {endingId === project._id ? "Ending..." : "End Project"}
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmEndId(project._id)}
                              className="ml-auto text-text-secondary hover:text-red-400 transition-colors text-xs font-body flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[14px]">stop_circle</span>
                              End project
                            </button>
                          )
                        )}
                      </div>

                      {/* Incoming Requests */}
                      {isOwner && project.invites && project.invites.filter(i => i.status === 'pending').length > 0 && (
                        <div className="mt-4 pt-3 border-t border-outline-variant">
                          <h4 className="text-[11px] font-heading font-semibold text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-orange-rich animate-pulse" />
                            Join Requests ({project.invites.filter(i => i.status === 'pending').length})
                          </h4>
                          <div className="flex flex-col gap-2">
                            {project.invites.filter(i => i.status === 'pending').map((invite, i) => (
                              <div key={i} className="flex items-center justify-between bg-surface-container-high rounded-lg p-2">
                                <button
                                  onClick={() => navigate(`/profile/${invite.user?._id || invite.user}`)}
                                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                                >
                                  <div className="w-6 h-6 rounded-full bg-accent-orange-rich/20 flex items-center justify-center text-[9px] font-heading font-bold text-accent-orange-rich overflow-hidden shrink-0">
                                    {avatarSrc(invite.user)
                                      ? <img src={avatarSrc(invite.user)} alt="" className="w-full h-full object-cover" />
                                      : (invite.user?.fullName || "?")[0]}
                                  </div>
                                  <span className="text-xs font-body text-text-primary truncate hover:text-accent-orange-rich transition-colors">{invite.user?.fullName || "A user"}</span>
                                </button>
                                <div className="flex gap-1 shrink-0">
                                  <button
                                    onClick={() => respondToRequest(project._id, invite.user?._id || invite.user, "decline")}
                                    className="px-2 py-1 text-text-secondary hover:text-text-primary border border-outline-variant rounded font-body text-[10px] transition-colors"
                                  >
                                    Decline
                                  </button>
                                  <button
                                    onClick={() => respondToRequest(project._id, invite.user?._id || invite.user, "accept")}
                                    className="px-2 py-1 bg-accent-orange-rich/20 text-accent-orange-rich border border-accent-orange-rich/30 hover:bg-accent-orange-rich hover:text-white rounded font-body text-[10px] transition-colors"
                                  >
                                    Accept
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default Projects;
