import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTopMatches } from "../../services/discoverApi";

function TopDiscovered() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopMatches(3)
      .then(setMatches)
      .catch(() => setMatches([]))
      .finally(() => setLoading(false));
  }, []);

  const avatarSrc = (m) =>
    m?.avatar ? (m.avatar.startsWith("/uploads") ? `http://localhost:5000${m.avatar}` : m.avatar) : null;

  return (
    <div className="bg-surface-card border border-outline-variant rounded-xl p-4">
      <h3 className="font-heading text-body-md font-semibold text-text-primary mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-accent-orange-rich">radar</span>
        Top Matches
      </h3>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-surface-container-high rounded w-24" />
                <div className="h-2 bg-surface-container-high rounded w-32" />
                <div className="h-1.5 bg-surface-container-high rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-4">
          <span className="material-symbols-outlined text-3xl text-text-secondary/30 block mb-2">person_search</span>
          <p className="text-text-secondary font-body text-xs">Complete your profile to see matches</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {matches.map((match) => {
            const src = avatarSrc(match);
            const initials = (match.fullName || "?").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
            return (
              <button
                key={match.id}
                onClick={() => navigate(`/profile/${match.id}`)}
                className="flex items-start gap-3 group p-2 -mx-2 rounded-lg hover:bg-surface-container-high/50 transition-colors text-left w-full"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-accent-orange-rich/20 flex items-center justify-center text-accent-orange-rich font-heading font-bold text-body-sm group-hover:ring-2 group-hover:ring-accent-orange-rich/40 transition-all">
                  {src
                    ? <img src={src} alt={match.fullName} className="w-full h-full object-cover" />
                    : initials}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <h4 className="font-body text-body-md font-medium text-text-primary m-0 leading-tight truncate group-hover:text-accent-orange-rich transition-colors">
                      {match.fullName}
                    </h4>
                    <span className="material-symbols-outlined text-[14px] text-transparent group-hover:text-accent-orange-rich transition-colors">
                      arrow_forward
                    </span>
                  </div>
                  <p className="font-body text-body-sm text-text-secondary text-[12px] m-0 mb-1.5 truncate">
                    {match.title || (match.skills || []).slice(0, 2).join(", ")}
                  </p>
                  {/* Match % bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-orange-rich rounded-full transition-all duration-700"
                        style={{ width: `${match.matchPercent}%` }}
                      />
                    </div>
                    <span className="font-heading text-accent-orange-rich text-[11px] font-bold tabular-nums">
                      {match.matchPercent}%
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <Link
        to="/search"
        className="mt-4 flex items-center justify-center gap-1 text-accent-orange-rich font-heading text-body-sm hover:underline"
      >
        View All Matches
        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
      </Link>
    </div>
  );
}

export default TopDiscovered;
