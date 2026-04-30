import { useState } from "react";

/**
 * WriteReviewModal — Form for writing a review about a collaborator.
 *
 * Props:
 *   user       – the user being reviewed
 *   projectName – the collaboration project name
 *   onSubmit   – callback({ rating, text })
 *   onClose    – dismiss the modal
 */
function WriteReviewModal({ user, projectName, onSubmit, onClose }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    if (text.trim().length < 20) {
      setError("Review must be at least 20 characters");
      return;
    }
    onSubmit({ rating, text });
  };

  const displayRating = hoverRating || rating;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Write a Review
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Share your experience working with{" "}
            <span className="font-medium text-slate-700">
              {user.displayName}
            </span>{" "}
            on <span className="font-medium text-orange-600">{projectName}</span>
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Reviewed user */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-pink-100 text-sm font-bold text-orange-600">
              {user.initials}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{user.displayName}</p>
              <p className="text-xs text-slate-500">{user.bio}</p>
            </div>
          </div>

          {/* Star rating */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110 active:scale-95"
                >
                  <svg
                    className={`h-8 w-8 ${
                      star <= displayRating
                        ? "text-amber-400"
                        : "text-slate-200"
                    } transition-colors`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 self-center text-sm font-medium text-slate-600">
                  {rating}/5
                </span>
              )}
            </div>
          </div>

          {/* Review text */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Your review
            </label>
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setError("");
              }}
              placeholder="Describe your experience working together — what went well, their strengths, how they contributed to the project…"
              rows={4}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
            />
            <p className="mt-1 text-xs text-slate-400">
              {text.length} characters (minimum 20)
            </p>
          </div>

          {/* Error */}
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Info box */}
          <div className="rounded-lg bg-amber-50 px-4 py-3 text-xs text-amber-700">
            <p className="font-semibold">How reviews work</p>
            <p className="mt-1">
              Your review will be sent to {user.displayName} for approval. They
              can approve, dispute, or flag it. Reviews auto-approve after 7
              days if no action is taken.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || text.length < 20}
            className="flex-1 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}

export default WriteReviewModal;
