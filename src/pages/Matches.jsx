import { useState } from "react";
import { Link } from "react-router-dom";
import useMatch from "../hooks/useMatch";
import WriteReviewModal from "../components/profile/WriteReviewModal";
import toast from "react-hot-toast";

function Matches() {
  const { getMatches, getMessages, getCollaboration, canReview, writeReview } = useMatch();
  const matchedUsers = getMatches();
  const [reviewTarget, setReviewTarget] = useState(null); // user object for the modal

  const handleSubmitReview = ({ rating, text }) => {
    if (!reviewTarget) return;
    const collab = getCollaboration(reviewTarget.id);
    const result = writeReview(reviewTarget.id, { rating, text });
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Review submitted! It will be sent for approval. ✅");
      setReviewTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
            SkillMesh
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Your Matches
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            You and these people both swiped right. Start a conversation!
          </p>
        </div>

        {matchedUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-4xl">
              💬
            </div>
            <h3 className="text-2xl font-bold text-slate-900">No matches yet</h3>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              Keep swiping on the Discover page or check your Likes — your next collaborator is just a swipe away.
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                to="/dashboard"
                className="rounded-full bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 active:scale-95"
              >
                Discover
              </Link>
              <Link
                to="/likes"
                className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95"
              >
                View Likes
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {matchedUsers.map((user) => {
              const msgs = getMessages(user.id);
              const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;
              const collab = getCollaboration(user.id);
              const reviewReady = canReview(user.id);

              return (
                <div
                  key={user.id}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-orange-200 hover:shadow-md"
                >
                  <Link to={`/chat/${user.id}`} className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-pink-100 text-lg font-bold text-orange-600">
                      {user.initials}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">
                          {user.displayName}
                        </h3>
                        {lastMsg && (
                          <span className="shrink-0 text-[10px] text-slate-400">
                            {new Date(lastMsg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">{user.location}</p>

                      {/* Last message or prompt */}
                      <p className="mt-2 truncate text-sm text-slate-500">
                        {lastMsg
                          ? `${lastMsg.from === "me" ? "You: " : ""}${lastMsg.text}`
                          : "Tap to start a conversation…"}
                      </p>

                      {/* Skills preview */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {user.skills.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>

                  {/* Collaboration status + Review button */}
                  {collab && (
                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`flex h-2 w-2 rounded-full ${
                            collab.status === "completed"
                              ? "bg-blue-500"
                              : collab.status === "active"
                              ? "bg-emerald-500"
                              : "bg-amber-500"
                          }`}
                        />
                        <span className="text-[11px] font-medium text-slate-500 capitalize">
                          {collab.status === "pending-completion"
                            ? "Pending completion"
                            : collab.status}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          · {collab.projectName}
                        </span>
                      </div>
                      {reviewReady && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setReviewTarget(user);
                          }}
                          className="rounded-lg bg-amber-100 px-3 py-1.5 text-[11px] font-semibold text-amber-700 transition hover:bg-amber-200 active:scale-95"
                        >
                          ⭐ Write Review
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Write Review Modal */}
      {reviewTarget && (
        <WriteReviewModal
          user={reviewTarget}
          projectName={getCollaboration(reviewTarget.id)?.projectName || "Project"}
          onSubmit={handleSubmitReview}
          onClose={() => setReviewTarget(null)}
        />
      )}
    </div>
  );
}

export default Matches;
