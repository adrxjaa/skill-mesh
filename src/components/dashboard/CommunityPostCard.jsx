import { useState } from "react";
import toast from "react-hot-toast";
import useFeed from "../../hooks/useFeed";
import useAuth from "../../hooks/useAuth";
import { timeAgo } from "../../context/FeedContext";
import CommentSection from "./CommentSection";

function CommunityPostCard({ post }) {
  const { toggleLike, isLiked, deletePost } = useFeed();
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleShare = async () => {
    const shareText = `${post.author.displayName}: ${post.body}`;
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
  const isOwnPost = post.author.id === (user?.id || user?._id);

  const handleDelete = () => {
    deletePost(post.id);
    setShowDeleteConfirm(false);
  };

  return (
    <article className="bg-surface-card border border-outline-variant rounded-xl p-5 hover:border-outline transition-colors">
      {/* Author */}
      <div className="flex gap-3 items-center mb-3">
        <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-text-secondary font-heading font-bold text-body-sm flex-shrink-0">
          {post.author.initials}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-body-md font-semibold text-text-primary m-0">
              {post.author.displayName}
            </h3>
            {post.label && (
              <span className="bg-surface-container-high text-text-secondary text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wide font-heading">
                {post.label}
              </span>
            )}
          </div>
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

      {/* Fallback attachment placeholder (for old posts with attachment object) */}
      {!post.imageUrl && !post.linkUrl && post.attachment && (
        <div className="w-full h-48 bg-surface-container-high rounded-lg mb-4 border border-outline-variant overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-surface-charcoal to-surface-container-high opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-text-secondary/30">
              article
            </span>
          </div>
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 rounded-md bg-surface-container-high text-text-secondary font-body text-body-sm border border-outline-variant"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 border-t border-outline-variant pt-4">
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
          className="flex items-center gap-1 text-text-secondary hover:text-text-primary transition-colors font-body text-body-sm ml-auto"
        >
          <span className="material-symbols-outlined text-[18px]">share</span>
        </button>
      </div>

      {/* Comments section */}
      <CommentSection postId={post.id} isOpen={showComments} />
    </article>
  );
}

export default CommunityPostCard;
