import useFeed from "../../hooks/useFeed";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "community", label: "Community" },
  { key: "requirements", label: "Requirements" },
];

function FeedFilters() {
  const { activeFilter, setFilter } = useFeed();

  return (
    <div className="flex gap-2 mb-2">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          onClick={() => setFilter(f.key)}
          className={`px-4 py-1.5 rounded-full font-body text-body-sm transition-colors ${
            activeFilter === f.key
              ? "bg-surface-container-high text-text-primary border border-outline-variant"
              : "bg-transparent text-text-secondary border border-transparent hover:text-text-primary"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

export default FeedFilters;
