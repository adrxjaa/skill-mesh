import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

/**
 * MatchModal — "It's a Match!" celebration overlay.
 *
 * Props:
 *   matchedUser   – the user object that was just matched with
 *   currentUser   – the logged-in demo user
 *   onClose       – callback to dismiss the modal
 */
function MatchModal({ matchedUser, currentUser, onClose }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  // Animate in on mount
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleMessage = () => {
    onClose();
    navigate(`/chat/${matchedUser.id}`);
  };

  const handleKeepSwiping = () => {
    onClose();
  };

  if (!matchedUser) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 ${
        visible ? "bg-black/60 backdrop-blur-sm" : "bg-transparent"
      }`}
      onClick={handleKeepSwiping}
    >
      <div
        className={`relative mx-4 w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-500 ${
          visible ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient banner */}
        <div className="relative h-32 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600">
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-3xl font-black tracking-wide text-white drop-shadow-lg">
              It's a Match!
            </h2>
          </div>
        </div>

        {/* Avatars */}
        <div className="flex justify-center -mt-10 gap-4">
          {/* Current user */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-orange-100 text-lg font-bold text-orange-600 shadow-lg">
            {currentUser?.displayName
              ?.split(" ")
              .map((n) => n[0])
              .join("") || "ME"}
          </div>
          {/* Matched user */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-emerald-100 text-lg font-bold text-emerald-600 shadow-lg">
            {matchedUser.initials}
          </div>
        </div>

        {/* Info */}
        <div className="px-6 pt-5 pb-2 text-center">
          <p className="text-sm text-slate-500">
            You and <span className="font-semibold text-slate-900">{matchedUser.displayName}</span> are
            both interested in collaborating!
          </p>
        </div>

        {/* Shared skills */}
        {currentUser?.skills && matchedUser.skills && (
          <div className="px-6 pb-4">
            {(() => {
              const shared = currentUser.skills.filter((s) =>
                matchedUser.skills.some((ms) => ms.toLowerCase() === s.toLowerCase())
              );
              if (shared.length === 0) return null;
              return (
                <div className="text-center">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Shared skills
                  </p>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {shared.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 p-6 pt-2">
          <button
            onClick={handleKeepSwiping}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 active:scale-95"
          >
            Keep Swiping
          </button>
          <button
            onClick={handleMessage}
            className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:shadow-lg active:scale-95"
          >
            Send a Message
          </button>
        </div>
      </div>
    </div>
  );
}

export default MatchModal;
