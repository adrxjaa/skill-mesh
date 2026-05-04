import { NavLink } from "react-router-dom";

function DashboardBottomNav() {
  const tabs = [
    { to: "/dashboard", icon: "home", label: "Feed" },
    { to: "/search", icon: "search", label: "Search" },
    { to: "/connections", icon: "group_add", label: "Connect" },
    { to: "/messages", icon: "forum", label: "Chat" },
    { to: "/profile", icon: "account_circle", label: "Profile" },
  ];

  const linkBase =
    "flex flex-col items-center justify-center active:scale-90 transition-all duration-150 hover:text-accent-orange-rich/70";

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 pb-safe bg-[#12131A]/90 backdrop-blur-lg font-heading text-[10px] uppercase tracking-widest text-accent-orange-rich rounded-t-xl border-t border-surface-container-high shadow-[0_-4px_12px_rgba(242,113,33,0.1)]">
      {tabs.map((tab) => (
        <NavLink
          key={tab.label}
          to={tab.to}
          end={tab.to === "/dashboard"}
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "text-accent-orange-rich scale-110"
                : "text-text-secondary"
            }`
          }
        >
          <span className="material-symbols-outlined">{tab.icon}</span>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default DashboardBottomNav;
