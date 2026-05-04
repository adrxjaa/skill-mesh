import { useContext, useState } from "react";
import ProjectContext from "../context/ProjectContext";
import useAuth from "../hooks/useAuth";

function Projects() {
  const { user } = useAuth();
  const { projects, invites, loading, respondToInvite, respondToRequest, createProject } = useContext(ProjectContext);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);

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

      {/* Active Projects */}
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
            {projects.map((project) => (
              <div key={project._id} className="bg-surface-card border border-surface-container-high rounded-xl p-4 hover:border-accent-orange-rich/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent-orange-muted flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-accent-orange-rich">folder_special</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-heading font-semibold text-text-primary truncate">{project.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wide ${
                        project.status === "active"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-surface-container-high text-text-secondary"
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    {project.description && (
                      <p className="text-text-secondary font-body text-sm mb-2 line-clamp-1">{project.description}</p>
                    )}
                    {/* Members */}
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {(project.members || []).slice(0, 4).map((m, i) => (
                          <div key={i} className="w-6 h-6 rounded-full bg-accent-orange-rich/20 border-2 border-surface-card flex items-center justify-center text-[9px] font-heading font-bold text-accent-orange-rich overflow-hidden">
                            {m.avatar
                              ? <img src={m.avatar.startsWith("/uploads") ? `http://localhost:5000${m.avatar}` : m.avatar} alt="" className="w-full h-full object-cover" />
                              : (m.fullName || "?")[0]}
                          </div>
                        ))}
                      </div>
                      <span className="text-text-secondary text-xs font-body">
                        {project.members?.length || 1} member{(project.members?.length || 1) !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Incoming Requests (for project owner) */}
                    {project.owner?._id === (user?.id || user?._id) && project.invites && project.invites.filter(i => i.status === 'pending').length > 0 && (
                      <div className="mt-4 pt-3 border-t border-outline-variant">
                        <h4 className="text-[11px] font-heading font-semibold text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-orange-rich animate-pulse" />
                          Join Requests ({project.invites.filter(i => i.status === 'pending').length})
                        </h4>
                        <div className="flex flex-col gap-2">
                          {project.invites.filter(i => i.status === 'pending').map((invite, i) => (
                            <div key={i} className="flex items-center justify-between bg-surface-container-high rounded-lg p-2">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-accent-orange-rich/20 flex items-center justify-center text-[9px] font-heading font-bold text-accent-orange-rich overflow-hidden shrink-0">
                                  {invite.user?.avatar
                                    ? <img src={invite.user.avatar.startsWith("/uploads") ? `http://localhost:5000${invite.user.avatar}` : invite.user.avatar} alt="" className="w-full h-full object-cover" />
                                    : (invite.user?.fullName || "?")[0]}
                                </div>
                                <span className="text-xs font-body text-text-primary truncate">{invite.user?.fullName || "A user"}</span>
                              </div>
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
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Projects;
