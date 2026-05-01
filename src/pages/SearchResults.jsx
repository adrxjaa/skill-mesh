import { useOutletContext } from "react-router-dom";
import { Users, Clock } from "lucide-react";

function SearchResults() {
  const { searchQuery = "Mobile app developer" } = useOutletContext() || {};
  const activeTab = "people";
  
  const mockResults = [
    {
      id: 1,
      name: 'Sarah Chen',
      title: 'Mobile App Developer',
      description: 'Expert in React Native and Flutter with 5+ years experience building scalable mobile solutions.',
      avatar: '👩‍💻',
      matchPercentage: 92,
      skills: ['React Native', 'Flutter', 'iOS Dev'],
      status: 'View Profile',
      isPending: false
    },
    {
      id: 2,
      name: 'Alex Rodriguez',
      title: 'Full Stack Mobile Developer',
      description: 'Specialized in cross-platform development with expertise in cloud integration and backend APIs.',
      avatar: '👨‍💻',
      matchPercentage: 85,
      skills: ['React Native', 'Node.js', 'Firebase'],
      status: 'View Profile',
      isPending: false
    },
    {
      id: 3,
      name: 'Maya Patel',
      title: 'iOS Developer',
      description: 'Creating beautiful and performant iOS applications with Swift and SwiftUI.',
      avatar: '👩‍💼',
      matchPercentage: 78,
      skills: ['Swift', 'SwiftUI', 'iOS SDK'],
      status: 'Pending',
      isPending: true
    }
  ];

  const recentSearches = [
    'Mobile app developer',
    'React Native expert',
    'UI/UX Designer',
    'Full stack engineer'
  ];

  const relatedTags = [
    '#ReactNative',
    '#Flutter',
    '#MobileFirst',
    '#iOS',
    '#Android',
    '#CrossPlatform'
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
                className="rounded-2xl border border-surface-container-high bg-surface-container-low/60 p-5 shadow-none transition-colors hover:border-outline-variant/70"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-surface-container-high to-surface-bright text-2xl">
                      {result.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-bold text-on-surface">
                            {result.name}
                          </h3>
                          <p className="text-sm text-text-secondary">{result.title}</p>
                        </div>
                        <div className="flex min-w-22.5 items-center gap-2 pt-1 text-right">
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
                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
                        {result.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center justify-end gap-3 lg:pt-8">
                    {result.isPending ? (
                      <button className="rounded-xl border border-surface-container-high bg-surface-container px-5 py-2.5 text-sm font-medium text-text-secondary opacity-70">
                        Pending
                      </button>
                    ) : (
                      <button className="rounded-xl border border-primary px-5 py-2.5 text-sm font-medium text-primary transition hover:bg-primary hover:text-black">
                        Connect
                      </button>
                    )}
                    <button className="rounded-xl bg-surface-container px-5 py-2.5 text-sm font-medium text-text-primary transition hover:bg-surface-container-high">
                      View Profile
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {result.skills.map((skill, idx) => (
                    <span
                      key={skill}
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${
                        idx === 0
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-surface-container-high bg-surface-container-low text-text-secondary"
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
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
