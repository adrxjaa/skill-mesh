import { useState } from "react";
import toast from "react-hot-toast";
import useFeed from "../../hooks/useFeed";
import useAuth from "../../hooks/useAuth";
import { timeAgo } from "../../context/FeedContext";
import CommentSection from "./CommentSection";

function RequirementPostCard({ post }) {
  const { toggleLike, toggleInterest, isLiked, hasInterest, deletePost } = useFeed();
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleShare = async () => {
    const shareText = `${post.author.displayName}: ${post.title || ""} ${post.body}`;
    const shareData = {
      title: post.title || "SkillMesh Post",
      text: shareText,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareText);
        toast.success("Post copied to clipboard!");
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        await navigator.clipboard.writeText(shareText);
        toast.success("Post copied to clipboard!");
      }
    }
  };

  const liked = isLiked(post.id);
  const interested = hasInterest(post.id);
  const isOwnPost = post.author.id === (user?.id || user?._id);

  const handleDelete = () => {
    deletePost(post.id);
    setShowDeleteConfirm(false);
  };

  return (
    <article className="bg-surface-card border-l-4 border-l-accent-orange-rich border-y border-r border-outline-variant rounded-r-xl rounded-l-sm p-5 relative shadow-[0_0_15px_rgba(242,113,33,0.05)] hover:shadow-[0_0_20px_rgba(242,113,33,0.1)] transition-shadow">
      {/* Badge */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {/* Open to Work badge */}
        {post.openToWork && (
          <span className="bg-green-500/10 text-green-400 font-heading text-label-caps px-2 py-1 rounded border border-green-500/30 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">work</span>
            Open to Work
          </span>
        )}
        {/* Label badge */}
        <span className="bg-accent-orange-muted text-accent-orange-rich font-heading text-label-caps px-2 py-1 rounded border border-accent-orange-rich/30 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">group_add</span>
          {post.label}
        </span>
      </div>

      {/* Author row */}
      <div className="flex gap-3 items-center mb-3">
        <div className="w-10 h-10 rounded-full bg-accent-orange-rich/20 flex items-center justify-center text-accent-orange-rich font-heading font-bold text-body-sm flex-shrink-0">
          {post.author.initials}
        </div>
        <div className="flex-1">
          <h3 className="font-heading text-body-md font-semibold text-text-primary m-0">
            {post.author.displayName}
          </h3>
          <p className="font-body text-body-sm text-text-secondary m-0">
            {post.author.title} • {timeAgo(post.createdAt)}
          </p>
        </div>
        {/* ··· menu — own posts only */}
        {isOwnPost && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="text-text-secondary hover:text-text-primary transition-colors p-1.5 rounded-lg hover:bg-surface-container-high"
            >
              <span className="material-symbols-outlined text-[18px]">more_horiz</span>
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-20 bg-surface-card border border-outline-variant rounded-xl shadow-xl overflow-hidden min-w-[140px]">
                  <button
                    onClick={() => { setMenuOpen(false); setShowDeleteConfirm(true); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors font-body text-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    Delete post
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="mb-3 p-3 bg-red-500/5 border border-red-500/20 rounded-lg flex items-center justify-between">
          <p className="font-body text-body-sm text-red-400">Delete this post?</p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-2 py-1 text-text-secondary text-body-sm font-body hover:text-text-primary rounded border border-outline-variant"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-2 py-1 bg-red-500/20 text-red-400 text-body-sm font-body rounded border border-red-500/30 hover:bg-red-500/30"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Title */}
      {post.title && (
        <h4 className="font-heading text-[20px] font-semibold text-text-primary mb-2 mt-1 leading-snug">
          {post.title}
        </h4>
      )}

      {/* Body */}
      <p className="font-body text-body-md text-text-secondary mb-4 leading-relaxed">
        {post.body}
      </p>

      {/* Image attachment */}
      {post.imageUrl && (
        <div className="w-full h-48 bg-surface-container-high rounded-lg mb-4 border border-outline-variant overflow-hidden">
          <img src={post.imageUrl} alt="Post attachment" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
        </div>
      )}

      {/* Link attachment */}
      {post.linkUrl && (
        <a
          href={post.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 mb-4 px-3 py-2 bg-surface-container-high rounded-lg border border-outline-variant text-accent-orange-rich font-body text-body-sm hover:bg-surface-container-high/80 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">link</span>
          <span className="truncate">{post.linkUrl}</span>
          <span className="material-symbols-outlined text-[14px] ml-auto">open_in_new</span>
        </a>
      )}

      {/* Tags */}
      {(post.tags.length > 0 || post.matchTag) && (
        <div className="flex flex-wrap gap-2 mb-5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 rounded-md bg-surface-container-high text-text-secondary font-body text-body-sm border border-outline-variant"
            >
              {tag}
            </span>
          ))}
          {post.matchTag && (
            <span className="px-2 py-1 rounded-md bg-accent-orange-muted text-accent-orange-rich font-body text-body-sm border border-accent-orange-rich/30 shadow-[0_0_8px_rgba(242,113,33,0.2)]">
              Match: {post.matchTag}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-outline-variant pt-4">
        <div className="flex gap-4">
          <button
            onClick={() => toggleLike(post.id)}
            className={`flex items-center gap-1 transition-colors font-body text-body-sm ${
              liked
                ? "text-accent-orange-rich"
                : "text-text-secondary hover:text-accent-orange-rich"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]" style={liked ? { fontVariationSettings: "'FILL' 1" } : {}}>
              favorite
            </span>
            {post.likes}
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1 transition-colors font-body text-body-sm ${
              showComments ? "text-accent-orange-rich" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
            {post.comments}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-text-secondary hover:text-text-primary transition-colors font-body text-body-sm"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
          </button>
        </div>
        {!isOwnPost && (
          <button
            onClick={() => toggleInterest(post.id, post.projectId)}
            className={`px-4 py-1.5 rounded-lg font-body text-body-sm font-medium transition-colors flex items-center gap-2 ${
              interested
                ? "bg-accent-orange-muted text-accent-orange-rich border border-accent-orange-rich/30"
                : "border-[1.5px] border-accent-orange-rich text-accent-orange-rich hover:bg-accent-orange-muted"
            }`}
          >
            {interested ? (
              <>
                Interested
                <span className="material-symbols-outlined text-[16px]">check</span>
              </>
            ) : (
              <>
                Express Interest
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Comments section */}
      <CommentSection postId={post.id} isOpen={showComments} />
    </article>
  );
}

export default RequirementPostCard;
