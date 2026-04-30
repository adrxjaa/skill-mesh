import { useState } from "react";
import useFeed from "../../hooks/useFeed";
import { timeAgo } from "../../context/FeedContext";

function CommentSection({ postId, isOpen }) {
  const { getComments, addComment } = useFeed();
  const [text, setText] = useState("");

  const comments = getComments(postId);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addComment(postId, text);
    setText("");
  };

  return (
    <div className="mt-4 pt-4 border-t border-outline-variant">
      {/* Existing comments */}
      {comments.length > 0 && (
        <div className="flex flex-col gap-3 mb-4">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-2 items-start">
              <div className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-text-secondary font-heading font-bold text-[10px] flex-shrink-0">
                {c.authorInitials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-heading text-body-sm font-semibold text-text-primary">
                    {c.authorName}
                  </span>
                  <span className="text-text-secondary text-[10px] font-body">
                    {timeAgo(c.createdAt)}
                  </span>
                </div>
                <p className="font-body text-body-sm text-text-secondary mt-0.5 leading-snug">
                  {c.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add comment input */}
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <div className="w-7 h-7 rounded-full bg-accent-orange-rich/20 flex items-center justify-center text-accent-orange-rich font-heading font-bold text-[10px] flex-shrink-0">
          AB
        </div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 bg-surface-container-high border border-outline-variant rounded-full py-1.5 px-3 text-text-primary font-body text-body-sm placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-orange-rich transition-colors"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="text-accent-orange-rich hover:text-accent-orange-rich/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">send</span>
        </button>
      </form>
    </div>
  );
}

export default CommentSection;
