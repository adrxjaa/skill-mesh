import { useState } from "react";
import useFeed from "../../hooks/useFeed";
import useAuth from "../../hooks/useAuth";

function PostComposer() {
  const { createPost } = useFeed();
  const { user } = useAuth();

  // Core fields
  const [body, setBody] = useState("");
  const [postType, setPostType] = useState("community");
  const [title, setTitle] = useState("");

  // Attachment fields (toggled by action buttons)
  const [showImageInput, setShowImageInput] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showTagsInput, setShowTagsInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [openToWork, setOpenToWork] = useState(false);

  // Confirmation dialog
  const [showConfirm, setShowConfirm] = useState(false);

  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const parsedTags = tagsText
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const canPost = body.trim().length > 0;

  const handlePostClick = () => {
    if (!canPost) return;
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    createPost({
      body,
      type: postType,
      tags: parsedTags,
      title: postType === "requirement" ? title : null,
      openToWork: postType === "requirement" ? openToWork : false,
      imageUrl: imageUrl.trim() || null,
      linkUrl: linkUrl.trim() || null,
    });
    // Reset everything
    setBody("");
    setTitle("");
    setPostType("community");
    setImageUrl("");
    setLinkUrl("");
    setTagsText("");
    setOpenToWork(false);
    setShowImageInput(false);
    setShowLinkInput(false);
    setShowTagsInput(false);
    setShowConfirm(false);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <div>
      <h2 className="font-heading text-body-md font-semibold text-text-primary mb-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-accent-orange-rich text-[20px]">edit_square</span>
        Create Post
      </h2>
      <div data-composer-card className="bg-surface-card border border-outline-variant rounded-xl p-4 flex gap-4 items-start shadow-sm transition-all duration-300">
      {/* User Avatar */}
      <div className="w-10 h-10 rounded-full bg-accent-orange-rich/20 flex items-center justify-center text-accent-orange-rich font-heading font-bold text-body-sm flex-shrink-0">
        {initials}
      </div>

      <div className="flex-1">
        {/* Post Type Toggle */}
        <div className="flex gap-2 mb-2 items-center">
          <button
            onClick={() => setPostType("community")}
            className={`text-[11px] uppercase tracking-wide font-heading font-semibold px-2 py-0.5 rounded transition-colors ${
              postType === "community"
                ? "bg-surface-container-high text-text-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Update
          </button>
          <button
            onClick={() => setPostType("requirement")}
            className={`text-[11px] uppercase tracking-wide font-heading font-semibold px-2 py-0.5 rounded transition-colors ${
              postType === "requirement"
                ? "bg-accent-orange-muted text-accent-orange-rich"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Requirement
          </button>

          {/* Open to Work toggle (requirement posts only) */}
          {postType === "requirement" && (
            <label className="flex items-center gap-1.5 ml-auto cursor-pointer select-none">
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

        {/* Title (only for requirement posts) */}
        {postType === "requirement" && (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title (e.g. 'Need a React developer')"
            className="w-full bg-transparent border-none text-text-primary font-heading font-semibold text-body-md placeholder:text-text-secondary/50 focus:outline-none focus:ring-0 p-0 mb-2"
          />
        )}

        {/* Body */}
        <textarea
          id="post-composer-input"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share an update or look for a team..."
          rows={2}
          className="w-full bg-transparent border-none text-text-primary font-body text-body-md resize-none placeholder:text-text-secondary/50 focus:outline-none focus:ring-0 p-0 min-h-[48px]"
        />

        {/* Optional inputs — toggled by action buttons */}
        {showImageInput && (
          <div className="flex items-center gap-2 mt-2 mb-1">
            <span className="material-symbols-outlined text-[16px] text-text-secondary">image</span>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste image URL..."
              className="flex-1 bg-surface-container-high border border-outline-variant rounded-lg py-1.5 px-3 text-text-primary font-body text-body-sm placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-orange-rich transition-colors"
            />
            <button onClick={() => { setShowImageInput(false); setImageUrl(""); }} className="text-text-secondary hover:text-text-primary">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        {showLinkInput && (
          <div className="flex items-center gap-2 mt-2 mb-1">
            <span className="material-symbols-outlined text-[16px] text-text-secondary">link</span>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Paste a link..."
              className="flex-1 bg-surface-container-high border border-outline-variant rounded-lg py-1.5 px-3 text-text-primary font-body text-body-sm placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-orange-rich transition-colors"
            />
            <button onClick={() => { setShowLinkInput(false); setLinkUrl(""); }} className="text-text-secondary hover:text-text-primary">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        {showTagsInput && (
          <div className="flex items-center gap-2 mt-2 mb-1">
            <span className="material-symbols-outlined text-[16px] text-text-secondary">sell</span>
            <input
              type="text"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="Add tags (comma-separated, e.g. React, Node.js)"
              className="flex-1 bg-surface-container-high border border-outline-variant rounded-lg py-1.5 px-3 text-text-primary font-body text-body-sm placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-orange-rich transition-colors"
            />
            <button onClick={() => { setShowTagsInput(false); setTagsText(""); }} className="text-text-secondary hover:text-text-primary">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        {/* Tags preview */}
        {parsedTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1 mb-1">
            {parsedTags.map((tag, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-surface-container-high text-text-secondary font-body text-[11px] border border-outline-variant">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Bar */}
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-outline-variant">
          <div className="flex gap-1">
            <button
              onClick={() => setShowImageInput(!showImageInput)}
              className={`p-1.5 rounded transition-colors ${showImageInput ? "text-accent-orange-rich bg-accent-orange-muted" : "text-text-secondary hover:text-accent-orange-rich"}`}
              title="Add image URL"
            >
              <span className="material-symbols-outlined text-xl">image</span>
            </button>
            <button
              onClick={() => setShowLinkInput(!showLinkInput)}
              className={`p-1.5 rounded transition-colors ${showLinkInput ? "text-accent-orange-rich bg-accent-orange-muted" : "text-text-secondary hover:text-accent-orange-rich"}`}
              title="Add link"
            >
              <span className="material-symbols-outlined text-xl">link</span>
            </button>
            <button
              onClick={() => setShowTagsInput(!showTagsInput)}
              className={`p-1.5 rounded transition-colors ${showTagsInput ? "text-accent-orange-rich bg-accent-orange-muted" : "text-text-secondary hover:text-accent-orange-rich"}`}
              title="Add skill tags"
            >
              <span className="material-symbols-outlined text-xl">work</span>
            </button>
          </div>
          <button
            onClick={handlePostClick}
            disabled={!canPost}
            className="bg-accent-orange-rich text-white px-4 py-1.5 rounded-lg font-body text-body-sm font-medium hover:bg-accent-orange-rich/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Post
          </button>
        </div>

        {/* Confirmation dialog */}
        {showConfirm && (
          <div className="mt-3 p-3 bg-surface-container-high border border-outline-variant rounded-lg">
            <p className="font-heading text-body-sm font-semibold text-text-primary mb-2">
              Confirm your post
            </p>
            <div className="bg-surface-card rounded-lg p-3 mb-3 border border-outline-variant">
              {postType === "requirement" && title && (
                <p className="font-heading text-body-sm font-semibold text-text-primary mb-1">{title}</p>
              )}
              <p className="font-body text-body-sm text-text-secondary leading-snug line-clamp-3">{body}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-[10px] uppercase tracking-wide font-heading text-text-secondary px-1.5 py-0.5 bg-surface-container-high rounded">
                  {postType === "requirement" ? "Requirement" : "Update"}
                </span>
                {openToWork && postType === "requirement" && (
                  <span className="text-[10px] uppercase tracking-wide font-heading text-green-400 px-1.5 py-0.5 bg-green-500/10 rounded">
                    Open to Work
                  </span>
                )}
                {parsedTags.map((t, i) => (
                  <span key={i} className="text-[10px] px-1.5 py-0.5 bg-surface-container-high text-text-secondary rounded font-body">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 text-text-secondary hover:text-text-primary font-body text-body-sm rounded-lg border border-outline-variant hover:bg-surface-container-high transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-3 py-1.5 bg-accent-orange-rich text-white font-body text-body-sm font-medium rounded-lg hover:bg-accent-orange-rich/90 transition-colors"
              >
                Confirm Post
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

export default PostComposer;
