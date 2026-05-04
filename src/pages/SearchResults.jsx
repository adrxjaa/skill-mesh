import { useState, useEffect, useCallback } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Search, Clock, UserPlus, Loader2, Sparkles } from "lucide-react";
import { searchPeople } from "../services/discoverApi";

function SearchResults() {
  const { searchQuery = "" } = useOutletContext() || {};
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [expandedQuery, setExpandedQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sm:recentSearches") || "[]"); } catch { return []; }
  });

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    setError(null);
    try {
      const data = await searchPeople(q, 10);
      setResults(data.results || []);
      setExpandedQuery(data.expandedQuery || "");
      setRecentSearches(prev => {
        const next = [q, ...prev.filter(s => s !== q)].slice(0, 5);
        localStorage.setItem("sm:recentSearches", JSON.stringify(next));
        return next;
      });
    } catch (e) {
      setError("Search is taking longer than usual. Try again in a moment.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchQuery) {
      doSearch(searchQuery);
      return;
    }
    setResults([]);
    setExpandedQuery("");
    setError(null);
  }, [searchQuery, doSearch]);

  const avatarSrc = (m) =>
    m?.avatar ? (m.avatar.startsWith("/uploads") ? `http://localhost:5000${m.avatar}` : m.avatar) : null;

  const getInitials = (name) =>
    (name || "?").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const matchColor = (pct) => {
    if (pct >= 80) return "text-green-400";
    if (pct >= 60) return "text-accent-orange-rich";
    return "text-text-secondary";
  };

  const matchBarColor = (pct) => {
    if (pct >= 80) return "bg-green-500";
    if (pct >= 60) return "bg-accent-orange-rich";
    return "bg-blue-400";
  };

  return (
    <div className="flex h-full min-h-0 w-full bg-surface text-on-surface">
      <main className="flex min-w-0 flex-1 flex-col border-r border-surface-container-high">
        <div className="border-b border-surface-container-high px-6 pb-0 pt-5">
          <div className="flex gap-8 text-base font-semibold">
            <button className="border-b-2 border-primary pb-3 text-text-primary">People</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {searchQuery && (
            <div className="mb-5">
              <p className="text-sm text-text-secondary">
                {loading
                  ? "Searching..."
                  : results.length > 0
                    ? <>Showing <span className="font-semibold text-text-primary">{results.length}</span> vector matches for{" "}<span className="font-semibold text-text-primary">"{searchQuery}"</span></>
                    : <>No matches found for <span className="font-semibold text-text-primary">"{searchQuery}"</span></>
                }
              </p>
              {expandedQuery && !loading && (
                <div className="mt-2 flex items-start gap-2 bg-surface-container-high/40 rounded-lg px-3 py-2">
                  <Sparkles size={13} className="text-accent-orange-rich mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-text-secondary leading-relaxed">
                    <span className="font-semibold text-accent-orange-rich">Matched against: </span>
                    {expandedQuery}
                  </p>
                </div>
              )}
            </div>
          )}

          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-2xl border border-surface-container-high bg-surface-container-low/60 p-6 animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-surface-container-high flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-surface-container-high rounded w-40" />
                      <div className="h-3 bg-surface-container-high rounded w-28" />
                      <div className="h-2 bg-surface-container-high rounded w-full" />
                      <div className="h-2 bg-surface-container-high rounded w-3/4" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 bg-surface-container-high rounded-full" />
                      <div className="h-4 w-10 bg-surface-container-high rounded" />
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-center gap-2 text-text-secondary text-sm pt-2">
                <Loader2 size={16} className="animate-spin" />
                Searching for the best matches…
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 text-sm text-red-400">{error}</div>
          )}
          {!loading && !error && results.length === 0 && searchQuery && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="material-symbols-outlined text-5xl text-text-secondary/20 mb-3">search_off</span>
              <p className="font-heading font-semibold text-text-primary mb-1">No matching profiles found</p>
              <p className="text-text-secondary text-sm">Try a different search or wait for more users to join</p>
            </div>
          )}

          {!loading && !searchQuery && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mb-4">
                <Search size={28} className="text-text-secondary/40" />
              </div>
              <p className="font-heading font-semibold text-text-primary mb-1">Search for collaborators</p>
              <p className="text-text-secondary text-sm max-w-xs">
                Try natural language like <span className="text-accent-orange-rich">"someone good at AI and web"</span> or <span className="text-accent-orange-rich">"fullstack with React"</span>
              </p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-4">
              {results.map((result) => {
                const src = avatarSrc(result);
                return (
                  <article
                    key={result.id}
                    className="rounded-2xl border border-surface-container-high bg-surface-container-low/60 p-6 transition-colors hover:border-accent-orange-rich/30 hover:bg-surface-container-low"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4 min-w-0">
                        <button
                          onClick={() => navigate(`/profile/${result.id}`)}
                          className="flex-shrink-0 hover:opacity-80 transition-opacity"
                        >
                          {src
                            ? <img src={src} alt={result.fullName} className="h-14 w-14 rounded-full object-cover" />
                            : <div className="h-14 w-14 rounded-full bg-accent-orange-rich/20 flex items-center justify-center font-heading font-bold text-accent-orange-rich">
                                {getInitials(result.fullName)}
                              </div>
                          }
                        </button>
                        <div className="min-w-0">
                          <button
                            onClick={() => navigate(`/profile/${result.id}`)}
                            className="text-lg font-bold text-on-surface hover:text-accent-orange-rich transition-colors block truncate text-left"
                          >
                            {result.fullName}
                          </button>
                          <p className="text-sm text-text-secondary truncate">{result.title || "Developer"}</p>
                        </div>
                      </div>

                      <div className="flex-shrink-0 flex items-center gap-2 pt-1">
                        <div className="h-1.5 w-16 rounded-full bg-surface-container-high overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${matchBarColor(result.matchPercent)}`}
                            style={{ width: `${result.matchPercent}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold tabular-nums ${matchColor(result.matchPercent)}`}>
                          {result.matchPercent}%
                        </span>
                      </div>
                    </div>

                    {result.bio && (
                      <p className="mt-3 text-sm leading-relaxed text-text-secondary line-clamp-2 pl-[4.5rem]">
                        {result.bio}
                      </p>
                    )}

                    {(result.skills || []).length > 0 && (
                      <div className="mt-3 pl-[4.5rem] flex flex-wrap gap-2">
                        {result.skills.slice(0, 6).map((skill, idx) => (
                          <span
                            key={idx}
                            className="rounded-full border border-surface-container-high px-3 py-1 text-xs font-medium text-text-secondary"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-5 pl-[4.5rem] flex items-center gap-4">
                      <button
                        onClick={() => navigate(`/profile/${result.id}`)}
                        className="flex items-center gap-2 rounded-lg border border-primary px-5 py-2 text-sm font-medium text-primary transition hover:bg-primary/10"
                      >
                        <UserPlus size={16} />
                        View & Connect
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <aside className="hidden w-72 shrink-0 overflow-y-auto border-l border-surface-container-high bg-surface-container-lowest lg:block">
        <div className="space-y-5 p-5">
          {recentSearches.length > 0 && (
            <section className="rounded-xl border border-surface-container-high bg-surface-container-low/70 p-4">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-text-secondary">Recent Searches</h3>
              <div className="space-y-0.5">
                {recentSearches.map((s) => (
                  <button
                    key={s}
                    onClick={() => doSearch(s)}
                    className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm text-text-secondary transition hover:bg-surface-container-high/50 hover:text-text-primary"
                  >
                    <Clock size={14} className="shrink-0" />
                    <span className="truncate">{s}</span>
                  </button>
                ))}
              </div>
            </section>
          )}
          <section className="rounded-xl border border-accent-orange-rich/20 bg-accent-orange-muted/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-accent-orange-rich" />
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent-orange-rich">AI-Powered Search</h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Search in plain English. Try things like:
            </p>
            <ul className="mt-2 space-y-1">
              {[
                "someone good at AI and web",
                "fullstack with React and Django",
                "ML engineer who can do backend",
                "mobile dev with design skills",
              ].map(ex => (
                <li key={ex}>
                  <button
                    onClick={() => doSearch(ex)}
                    className="text-xs text-accent-orange-rich hover:underline text-left"
                  >
                    "{ex}"
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </aside>
    </div>
  );
}

export default SearchResults;
