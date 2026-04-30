import useFeed from "../../hooks/useFeed";

const TRENDS = [
  {
    id: 1,
    title: "The future of React Server Components in enterprise apps.",
    searchTerm: "React",
    likes: 342,
  },
  {
    id: 2,
    title: "Design systems: When to build vs when to buy.",
    searchTerm: "Design",
    likes: 289,
  },
  {
    id: 3,
    title: "Looking for co-founder: AI-driven logistics platform.",
    searchTerm: "AI",
    likes: 156,
  },
];

function TrendingDiscussions() {
  const { searchQuery, setSearchQuery } = useFeed();

  const handleTrendClick = (trend) => {
    // If the same trend is clicked again, clear the search
    if (searchQuery === trend.searchTerm) {
      setSearchQuery("");
    } else {
      setSearchQuery(trend.searchTerm);
    }
  };

  return (
    <div className="bg-surface-card border border-outline-variant rounded-xl p-4">
      <h3 className="font-heading text-body-md font-semibold text-text-primary mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-text-secondary">trending_up</span>
        Trending Discussions
      </h3>

      <ul className="flex flex-col gap-3">
        {TRENDS.map((trend, idx) => {
          const isActive = searchQuery === trend.searchTerm;
          return (
            <li key={trend.id} className="flex gap-2 items-start">
              <span
                className={`font-bold text-body-sm mt-0.5 font-heading ${
                  idx === 0 ? "text-accent-orange-rich" : "text-text-secondary/40"
                }`}
              >
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div>
                <button
                  onClick={() => handleTrendClick(trend)}
                  className={`font-body text-body-sm text-left transition-colors block mb-0.5 leading-snug ${
                    isActive
                      ? "text-accent-orange-rich font-medium"
                      : "text-text-primary hover:text-accent-orange-rich"
                  }`}
                >
                  {trend.title}
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary text-[10px] uppercase tracking-wide font-heading">
                    {trend.likes} Likes
                  </span>
                  {isActive && (
                    <span className="text-accent-orange-rich text-[10px] uppercase tracking-wide font-heading flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">filter_alt</span>
                      Filtering
                    </span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default TrendingDiscussions;
