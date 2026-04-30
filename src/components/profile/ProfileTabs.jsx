function ProfileTabs({ activeTab, onTabChange }) {
  const tabs = ["Posts", "About"];

  return (
    <div className="flex border-b border-outline-variant mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab.toLowerCase())}
          className={`px-6 py-3 font-heading text-h3 transition-colors ${
            activeTab === tab.toLowerCase()
              ? "text-primary border-b-2 border-accent-orange-rich"
              : "text-text-secondary hover:text-on-surface"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default ProfileTabs;
