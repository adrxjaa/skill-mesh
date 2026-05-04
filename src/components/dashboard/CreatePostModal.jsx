import { useState, useEffect, useContext } from "react";
import useFeed from "../../hooks/useFeed";
import useAuth from "../../hooks/useAuth";
import ProjectContext from "../../context/ProjectContext";

function CreatePostModal({ isOpen, onClose }) {
  const { createPost } = useFeed();
  const { user } = useAuth();
  const { projects, createProject } = useContext(ProjectContext);

  const [body, setBody] = useState("");
  const [postType, setPostType] = useState("community");
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [openToWork, setOpenToWork] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showTagsInput, setShowTagsInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // Project required for Looking for Team
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [creatingProject, setCreatingProject] = useState(false);

  const initials = (user?.displayName || user?.fullName || "U")
    .split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const parsedTags = tagsText.split(",").map((t) => t.trim()).filter(Boolean);
  const myProjects = projects.filter((p) => p.owner?._id === user?.id || p.owner === user?.id);
  const needsProject = postType === "requirement";
  const canPost = body.trim().length > 0 && (!needsProject || selectedProjectId || (showNewProject && newProjectTitle.trim()));

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!canPost) return;
    setSubmitting(true);
    try {
      let projectId = selectedProjectId;
      if (needsProject && showNewProject && newProjectTitle.trim()) {
        const created = await createProject({ title: newProjectTitle.trim() });
        projectId = created._id;
        setSelectedProjectId(projectId);
      }
      await new Promise((r) => setTimeout(r, 200));
      createPost({
        body,
        type: postType,
        tags: parsedTags,
        title: postType === "requirement" ? title : null,
        openToWork: postType === "requirement" ? openToWork : false,
        imageUrl: imageUrl.trim() || null,
        linkUrl: linkUrl.trim() || null,
        projectId: projectId || null,
      });
      setBody(""); setTitle(""); setPostType("community");
      setImageUrl(""); setLinkUrl(""); setTagsText("");
      setOpenToWork(false); setSelectedProjectId("");
      setShowNewProject(false); setNewProjectTitle("");
      setShowImageInput(false); setShowLinkInput(false); setShowTagsInput(false);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-xl bg-surface-card border border-surface-container-high rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-[slideUp_0.25s_ease]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-container-high">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent-orange-rich/20 flex items-center justify-center text-accent-orange-rich font-heading font-bold text-sm flex-shrink-0">
              {initials}
            </div>
            <div>
              <p className="font-heading font-semibold text-text-primary text-sm leading-tight">
                {user?.displayName || "You"}
              </p>
              <p className="text-text-secondary text-xs">Sharing to SkillMesh</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors p-1.5 rounded-lg hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Post Type Toggle */}
        <div className="flex gap-2 px-5 pt-4">
          <button
            onClick={() => setPostType("community")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading font-semibold uppercase tracking-wide transition-all ${
              postType === "community"
                ? "bg-surface-container-high text-text-primary ring-1 ring-outline-variant"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-container-high/50"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">rss_feed</span>
            Update
          </button>
          <button
            onClick={() => setPostType("requirement")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading font-semibold uppercase tracking-wide transition-all ${
              postType === "requirement"
                ? "bg-accent-orange-muted text-accent-orange-rich ring-1 ring-accent-orange-rich/40"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-container-high/50"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">group_add</span>
            Looking for Team
          </button>

          {postType === "requirement" && (
            <label className="flex items-center gap-1.5 ml-auto cursor-pointer select-none shrink-0">
              <input
                type="checkbox"
                checked={openToWork}
                onChange={(e) => setOpenToWork(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-[18px] bg-surface-container-high rounded-full peer-checked:bg-green-500 transition-colors relative">
                <div className={`absolute top-[2px] w-[14px] h-[14px] bg-white rounded-full transition-transform ${openToWork ? "translate-x-[16px]" : "translate-x-[2px]"}`} />
              </div>
              <span className="text-[10px] uppercase tracking-wide font-heading font-semibold text-green-400">
                Open to Work
              </span>
            </label>
          )}
        </div>

          {/* Project selector — required for Looking for Team */}
          {postType === "requirement" && (
            <div className="px-5 pb-2">
              <div className="bg-surface-container-high rounded-xl p-3 border border-accent-orange-rich/20">
                <p className="text-xs font-heading uppercase tracking-wide text-accent-orange-rich mb-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">folder_special</span>
                  Link a Project (required)
                </p>
                {!showNewProject ? (
                  <>
                    {myProjects.length > 0 ? (
                      <select
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        className="w-full bg-surface border border-outline-variant rounded-lg py-2 px-3 text-text-primary font-body text-sm focus:outline-none focus:border-accent-orange-rich"
                      >
                        <option value="">Select a project...</option>
                        {myProjects.map((p) => (
                          <option key={p._id} value={p._id}>{p.title}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-text-secondary text-xs font-body mb-2">You don't have any projects yet.</p>
                    )}
                    <button
                      onClick={() => setShowNewProject(true)}
                      className="mt-2 text-xs text-accent-orange-rich hover:underline font-body"
                    >
                      + Create a new project
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newProjectTitle}
                      onChange={(e) => setNewProjectTitle(e.target.value)}
                      placeholder="Project name"
                      className="flex-1 bg-surface border border-outline-variant rounded-lg py-2 px-3 text-text-primary font-body text-sm focus:outline-none focus:border-accent-orange-rich"
                    />
                    {myProjects.length > 0 && (
                      <button onClick={() => setShowNewProject(false)} className="text-text-secondary hover:text-text-primary text-xs font-body whitespace-nowrap">← Back</button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Body */}
        <div className="px-5 pt-3 pb-2 flex flex-col gap-2">
          {postType === "requirement" && (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title — e.g. 'Need a React developer'"
              className="w-full bg-transparent border-none text-text-primary font-heading font-semibold text-[17px] placeholder:text-text-secondary/40 focus:outline-none"
            />
          )}
          <textarea
            id="post-composer-input"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={
              postType === "requirement"
                ? "Describe the role, skills needed, and what you're building..."
                : "Share an update, insight, or what you've been working on..."
            }
            rows={postType === "requirement" ? 4 : 5}
            className="w-full bg-transparent border-none text-text-primary font-body text-body-md resize-none placeholder:text-text-secondary/40 focus:outline-none leading-relaxed"
            autoFocus={postType === "community"}
          />

          {/* Optional attachment inputs */}
          {showImageInput && (
            <div className="flex items-center gap-2 bg-surface-container-high rounded-lg px-3 py-2">
              <span className="material-symbols-outlined text-[16px] text-text-secondary">image</span>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste image URL..."
                className="flex-1 bg-transparent text-text-primary font-body text-sm placeholder:text-text-secondary/50 focus:outline-none"
              />
              <button onClick={() => { setShowImageInput(false); setImageUrl(""); }} className="text-text-secondary hover:text-text-primary">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          )}
          {showLinkInput && (
            <div className="flex items-center gap-2 bg-surface-container-high rounded-lg px-3 py-2">
              <span className="material-symbols-outlined text-[16px] text-text-secondary">link</span>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="Paste a link..."
                className="flex-1 bg-transparent text-text-primary font-body text-sm placeholder:text-text-secondary/50 focus:outline-none"
              />
              <button onClick={() => { setShowLinkInput(false); setLinkUrl(""); }} className="text-text-secondary hover:text-text-primary">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          )}
          {showTagsInput && (
            <div className="flex items-center gap-2 bg-surface-container-high rounded-lg px-3 py-2">
              <span className="material-symbols-outlined text-[16px] text-text-secondary">sell</span>
              <input
                type="text"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                placeholder="Tags: React, Node.js, Figma..."
                className="flex-1 bg-transparent text-text-primary font-body text-sm placeholder:text-text-secondary/50 focus:outline-none"
              />
              <button onClick={() => { setShowTagsInput(false); setTagsText(""); }} className="text-text-secondary hover:text-text-primary">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          )}

          {/* Tag preview pills */}
          {parsedTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {parsedTags.map((tag, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-surface-container-high text-text-secondary font-body text-[11px] border border-outline-variant">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-surface-container-high">
          <div className="flex gap-1">
            <button
              onClick={() => setShowImageInput(!showImageInput)}
              title="Add image"
              className={`p-2 rounded-lg transition-colors ${showImageInput ? "text-accent-orange-rich bg-accent-orange-muted" : "text-text-secondary hover:text-accent-orange-rich hover:bg-surface-container-high"}`}
            >
              <span className="material-symbols-outlined text-[20px]">image</span>
            </button>
            <button
              onClick={() => setShowLinkInput(!showLinkInput)}
              title="Add link"
              className={`p-2 rounded-lg transition-colors ${showLinkInput ? "text-accent-orange-rich bg-accent-orange-muted" : "text-text-secondary hover:text-accent-orange-rich hover:bg-surface-container-high"}`}
            >
              <span className="material-symbols-outlined text-[20px]">link</span>
            </button>
            <button
              onClick={() => setShowTagsInput(!showTagsInput)}
              title="Add skill tags"
              className={`p-2 rounded-lg transition-colors ${showTagsInput ? "text-accent-orange-rich bg-accent-orange-muted" : "text-text-secondary hover:text-accent-orange-rich hover:bg-surface-container-high"}`}
            >
              <span className="material-symbols-outlined text-[20px]">sell</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Character count hint */}
            {body.length > 0 && (
              <span className={`text-xs font-body tabular-nums ${body.length > 280 ? "text-red-400" : "text-text-secondary/60"}`}>
                {body.length}/500
              </span>
            )}
            <button
              onClick={handleSubmit}
              disabled={!canPost || submitting}
              className="bg-accent-orange-rich text-white px-5 py-2 rounded-lg font-heading font-semibold text-sm hover:bg-accent-orange-rich/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 active:scale-95"
            >
              {submitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  Post
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePostModal;
