import { useOutletContext } from "react-router-dom";
import { UserPlus, Clock } from "lucide-react";

function SearchResults() {
  const { searchQuery = "Mobile app developer" } = useOutletContext() || {};
  const activeTab = "people";
  
  const mockResults = [
    {
      id: 1,
      name: 'Sarah Jenkins',
      title: 'Senior React Native Developer',
      description: 'Building high-performance mobile applications for 5+ years. Currently focused on React Native, TypeScript, and...',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      matchPercentage: 92,
      skills: [
        { name: 'React Native', highlight: false },
        { name: 'TypeScript', highlight: true },
        { name: 'iOS/Swift', highlight: false },
        { name: 'GraphQL', highlight: false }
      ],
      status: 'Connect',
      isPending: false
    },
    {
      id: 2,
      name: 'Marcus Chen',
      title: 'Full Stack Mobile Engineer',
      description: 'Flutter enthusiast and cross-platform advocate. I build beautiful, responsive apps that work seamlessly across iO...',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      matchPercentage: 78,
      skills: [
        { name: 'Flutter', highlight: false },
        { name: 'Dart', highlight: false },
        { name: 'Firebase', highlight: true }
      ],
      status: 'Pending',
      isPending: true
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      title: 'iOS Developer',
      description: 'Native iOS specialist. Deep expertise in Swift, SwiftUI, and CoreData. Passionate about creating pixel-perfect UI and...',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      matchPercentage: 65,
      skills: [
        { name: 'SwiftUI', highlight: false },
        { name: 'iOS', highlight: false }
      ],
      status: 'Connect',
      isPending: false
    }
  ];

  const recentSearches = [
    'UI/UX Designer',
    'Python Backend',
    'Product Manager Startup'
  ];

  const relatedTags = [
    '#ReactNative',
    '#Flutter',
    '#iOS',
    '#AndroidDev',
    '#MobileUI'
  ];

  return (
    <div className="flex h-full min-h-0 w-full bg-surface text-on-surface">
      <main className="flex min-w-0 flex-1 flex-col border-r border-surface-container-high">
        <div className="border-b border-surface-container-high px-6 pb-2 pt-5 lg:px-8">
          <div className="flex gap-8 text-base font-semibold">
            <button className="border-b-2 border-primary pb-3 text-text-primary">
              People
            </button>
            <button className="pb-3 text-text-secondary transition hover:text-text-primary">
              Posts
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 lg:px-8">
          <p className="mb-5 text-sm text-text-secondary">
            Showing top matches for <span className="text-text-primary font-semibold">&ldquo;{searchQuery}&rdquo;</span>
          </p>

          <div className="space-y-4">
            {mockResults.map((result) => (
              <article
                key={result.id}
                className="rounded-2xl border border-surface-container-high bg-surface-container-low/60 p-6 shadow-none transition-colors hover:border-outline-variant/70"
              >
                {/* Top Section */}
                <div className="flex items-start justify-between">
                  {/* Left: Avatar + Info */}
                  <div className="flex gap-4">
                    <img src={result.avatar} alt={result.name} className="h-14 w-14 rounded-full object-cover" />
                    <div>
                      <h3 className="text-lg font-bold text-on-surface">
                        {result.name}
                      </h3>
                      <p className="text-sm text-text-secondary">{result.title}</p>
                    </div>
                  </div>
                  
                  {/* Right: Progress */}
                  <div className="flex items-center gap-2 pt-1">
                    <div className="h-1.5 w-16 rounded-full bg-surface-container-high">
                      <div
                        className="h-1.5 rounded-full bg-primary"
                        style={{ width: `${result.matchPercentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-primary">
                      {result.matchPercentage}%
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="ml-18 mt-2">
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {result.description}
                  </p>

                  {/* Skills */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {result.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${
                          skill.highlight
                            ? "border-primary/30 text-primary"
                            : "border-surface-container-high bg-surface-container-low text-text-secondary"
                        }`}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="mt-6 flex items-center gap-4">
                    {result.isPending ? (
                      <button className="flex items-center gap-2 rounded-lg bg-surface-container-high px-5 py-2 text-sm font-medium text-text-secondary transition hover:bg-surface-container-highest">
                        <Clock size={16} />
                        Pending
                      </button>
                    ) : (
                      <button className="flex items-center gap-2 rounded-lg border border-primary px-5 py-2 text-sm font-medium text-primary transition hover:bg-primary/10">
                        <UserPlus size={16} />
                        Connect
                      </button>
                    )}
                    <button className="text-sm font-medium text-text-secondary transition hover:text-on-surface">
                      View Profile
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <aside className="hidden w-72.5 shrink-0 overflow-y-auto border-l border-surface-container-high bg-surface-container-lowest lg:block">
        <div className="space-y-6 p-6">
          <section className="rounded-xl border border-surface-container-high bg-surface-container-low/70 p-4">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-text-secondary">
              Recent Searches
            </h3>
            <div className="space-y-1">
              {recentSearches.map((search) => (
                <button
                  key={search}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm text-text-secondary transition hover:bg-surface-container-high/50 hover:text-text-primary"
                >
                  <Clock size={14} className="shrink-0" />
                  <span>{search}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-surface-container-high bg-surface-container-low/70 p-4">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-text-secondary">
              Related Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {relatedTags.map((tag) => (
                <button
                  key={tag}
                  className="rounded-full border border-surface-container-high px-3 py-1.5 text-xs text-text-secondary transition hover:border-primary hover:text-primary"
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}

export default SearchResults;
