import { Link } from "react-router-dom";
import mockUsers from "../../data/mockUsers";

/**
 * Simulated match scores for the demo.
 * In production this would come from the matching algorithm.
 */
const MATCH_SCORES = {
  u2: 85,
  u4: 72,
  u3: 60,
};

function TopDiscovered() {
  // Pick 3 users who aren't the demo user (u1) and have match scores
  const discoveredUsers = Object.entries(MATCH_SCORES)
    .map(([id, score]) => {
      const user = mockUsers.find((u) => u.id === id);
      return user ? { ...user, matchScore: score } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="bg-surface-card border border-outline-variant rounded-xl p-4">
      <h3 className="font-heading text-body-md font-semibold text-text-primary mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-accent-orange-rich">radar</span>
        Top Discovered
      </h3>

      <div className="flex flex-col gap-3">
        {discoveredUsers.map((user) => (
          <Link
            key={user.id}
            to="/search"
            className="flex items-start gap-3 group p-2 -mx-2 rounded-lg hover:bg-surface-container-high/50 transition-colors"
          >
            {/* Initials avatar */}
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-text-secondary font-heading font-bold text-body-sm flex-shrink-0 group-hover:bg-accent-orange-rich/20 group-hover:text-accent-orange-rich transition-colors">
              {user.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <h4 className="font-body text-body-md font-medium text-text-primary m-0 leading-tight truncate group-hover:text-accent-orange-rich transition-colors">
                  {user.displayName}
                </h4>
                <span className="material-symbols-outlined text-[14px] text-text-secondary/0 group-hover:text-accent-orange-rich transition-colors">
                  arrow_forward
                </span>
              </div>
              <p className="font-body text-body-sm text-text-secondary text-[12px] m-0 mb-1 truncate">
                {user.bio.split(".")[0]}
              </p>
              {/* Match score bar */}
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-orange-rich rounded-full transition-all duration-500"
                    style={{ width: `${user.matchScore}%` }}
                  />
                </div>
                <span className="font-heading text-match-score text-accent-orange-rich text-[12px]">
                  {user.matchScore}%
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link
        to="/search"
        className="mt-3 flex items-center justify-center gap-1 text-accent-orange-rich font-heading text-body-sm hover:underline"
      >
        View All Matches
        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
      </Link>
    </div>
  );
}

export default TopDiscovered;
