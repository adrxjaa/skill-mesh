import { useState } from 'react';
import { Search, X, Home, Users, MessageSquare, User, Settings, HelpCircle, Clock, Star } from 'lucide-react';

function SearchResults() {
  const [searchQuery, setSearchQuery] = useState('Mobile app developer');
  const [activeTab, setActiveTab] = useState('people');
  
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

  const navItems = [
    { icon: Home, label: 'Feed', active: false },
    { icon: Search, label: 'Search', active: true },
    { icon: Users, label: 'Connections', active: false },
    { icon: MessageSquare, label: 'Messages', active: false },
    { icon: User, label: 'Profile', active: false }
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary flex">
      {/* Left Sidebar */}
      <aside className="w-60 fixed left-0 top-16 bottom-0 bg-card-bg border-r border-border-color flex flex-col overflow-y-auto">
        {/* Logo Section */}
        <div className="p-6 border-b border-border-color">
          <div className="text-2xl font-bold text-primary mb-1">SkillMesh</div>
          <div className="text-xs text-text-secondary">Build Together</div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                item.active
                  ? 'bg-primary text-black font-semibold'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <item.icon size={20} />
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-border-color space-y-3">
          <button className="w-full bg-primary text-black font-bold py-2 rounded-lg hover:bg-primary-hover transition text-sm">
            + Post Requirement
          </button>
          <div className="flex gap-3 text-text-secondary text-xs">
            <button className="hover:text-text-primary transition">Settings</button>
            <button className="hover:text-text-primary transition">Help</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-60 mr-72 border-r border-border-color">
        {/* Search Bar */}
        <div className="sticky top-16 bg-dark-bg border-b border-border-color p-4 z-10">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-text-secondary" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-input-bg border border-border-color rounded-lg px-4 py-3 pl-12 pr-12 text-text-primary placeholder-text-secondary outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
              placeholder="Search for skills, roles, or profiles..."
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3.5 text-text-secondary hover:text-text-primary"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border-color px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('people')}
              className={`py-4 font-medium transition ${
                activeTab === 'people'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              People
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-4 font-medium transition ${
                activeTab === 'posts'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Posts
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="p-6">
          {activeTab === 'people' && (
            <>
              <p className="text-sm text-text-secondary mb-6">
                Showing top matches for '<span className="text-text-primary font-semibold">{searchQuery}</span>'
              </p>

              <div className="space-y-4">
                {mockResults.map((result) => (
                  <div key={result.id} className="bg-card-bg border border-border-color rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      {/* Avatar & Name */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-4xl">{result.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-4">
                            <h3 className="text-lg font-bold text-text-primary">{result.name}</h3>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-gradient-to-r from-primary to-primary-hover rounded-full" style={{ width: '80px' }} />
                              <span className="text-sm font-bold text-primary">{result.matchPercentage}%</span>
                            </div>
                          </div>
                          <p className="text-sm text-text-secondary mt-1">{result.title}</p>
                          <p className="text-sm text-text-secondary mt-2 line-clamp-2">
                            {result.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {result.skills.map((skill, idx) => (
                        <div
                          key={idx}
                          className={`text-xs px-3 py-1 rounded-full border ${
                            idx === 0
                              ? 'bg-skill-tag border-primary text-primary'
                              : 'bg-skill-tag border-border-color text-text-secondary'
                          }`}
                        >
                          {skill}
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {result.isPending ? (
                        <button className="flex-1 bg-skill-tag text-text-secondary py-2 rounded-lg text-sm font-medium cursor-not-allowed opacity-50">
                          Pending
                        </button>
                      ) : (
                        <button className="flex-1 border border-primary text-primary py-2 rounded-lg text-sm font-medium hover:bg-primary hover:text-black transition">
                          Connect
                        </button>
                      )}
                      <button className="flex-1 text-text-secondary py-2 rounded-lg text-sm font-medium hover:text-text-primary transition">
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'posts' && (
            <div className="text-center py-12">
              <p className="text-text-secondary">No posts found matching '{searchQuery}'</p>
            </div>
          )}
        </div>
      </main>

      {/* Right Panel */}
      <aside className="w-72 fixed right-0 top-16 bottom-0 bg-card-bg border-l border-border-color overflow-y-auto">
        <div className="p-6 space-y-8">
          {/* Recent Searches */}
          <div>
            <h3 className="text-sm font-bold text-text-primary mb-4 uppercase tracking-wider">Recent Searches</h3>
            <div className="space-y-2">
              {recentSearches.map((search, idx) => (
                <button
                  key={idx}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-input-bg rounded-lg transition text-left"
                >
                  <Clock size={16} className="text-text-secondary flex-shrink-0" />
                  <span className="text-sm text-text-secondary hover:text-text-primary transition">{search}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Related Tags */}
          <div>
            <h3 className="text-sm font-bold text-text-primary mb-4 uppercase tracking-wider">Related Tags</h3>
            <div className="flex flex-wrap gap-2">
              {relatedTags.map((tag, idx) => (
                <button
                  key={idx}
                  className="px-3 py-1 bg-skill-tag border border-border-color rounded-full text-xs text-text-secondary hover:border-primary hover:text-primary transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default SearchResults;
