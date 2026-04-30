import { formatDate } from "../../utils/formatDate";

/**
 * Star rating display component.
 */
function Stars({ rating, max = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < rating ? "text-amber-400" : "text-slate-200"}`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

/**
 * ReviewsSection — Displays collaborator reviews for a user profile.
 *
 * Props:
 *   reviews  – array of review objects
 *   compact  – if true, shows a condensed view (for swipe cards)
 */
function ReviewsSection({ reviews = [], compact = false }) {
  if (!reviews || reviews.length === 0) return null;

  // Calculate average rating
  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  if (compact) {
    // Compact view for swipe cards: just the summary + 1 featured review
    const featured = reviews[0];
    return (
      <div className="px-6 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400">Reviews</h4>
          <div className="flex items-center gap-1.5">
            <Stars rating={Math.round(Number(avgRating))} />
            <span className="text-xs font-semibold text-slate-700">{avgRating}</span>
            <span className="text-xs text-slate-400">· {reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-[10px] font-bold text-orange-600">
              {featured.reviewerInitials}
            </div>
            <span className="text-xs font-semibold text-slate-700">{featured.reviewerName}</span>
            <Stars rating={featured.rating} />
          </div>
          <p className="text-xs leading-relaxed text-slate-600 line-clamp-2">{featured.text}</p>
          <p className="mt-1 text-[10px] text-slate-400">on {featured.project}</p>
        </div>
      </div>
    );
  }

  // Full view for profile pages
  return (
    <div className="space-y-6">
      {/* Summary header */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-2xl">
            ⭐
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-slate-900">{avgRating}</span>
              <Stars rating={Math.round(Number(avgRating))} />
            </div>
            <p className="text-sm text-slate-500">
              {reviews.length} review{reviews.length !== 1 ? "s" : ""} from collaborators
            </p>
          </div>
        </div>
      </div>

      {/* Individual reviews */}
      {reviews.map((review, index) => (
        <div key={index} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            {/* Reviewer avatar */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-pink-100 text-sm font-bold text-orange-600">
              {review.reviewerInitials}
            </div>

            <div className="min-w-0 flex-1">
              {/* Reviewer info + rating */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-900">{review.reviewerName}</span>
                <Stars rating={review.rating} />
              </div>

              {/* Project context */}
              <p className="mt-0.5 text-xs text-slate-500">
                Collaborated on <span className="font-medium text-orange-600">{review.project}</span>
                {review.date && <> · {formatDate(review.date)}</>}
              </p>

              {/* Review text */}
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                "{review.text}"
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ReviewsSection;
