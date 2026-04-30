import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useFeed from "../../hooks/useFeed";

const MOCK_NOTIFICATIONS = [
  {
    id: "n1",
    icon: "favorite",
    text: "Rahul Menon liked your post",
    time: "2m ago",
    read: false,
  },
  {
    id: "n2",
    icon: "group_add",
    text: "New match with Arjun Krishnan (72%)",
    time: "1h ago",
    read: false,
  },
  {
    id: "n3",
    icon: "chat_bubble",
    text: "Neha commented on your post",
    time: "3h ago",
    read: true,
  },
];

function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const { pathname } = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  // Dashboard-style pages get the full header
  const isDashboardPage = [
    "/dashboard",
    "/search",
    "/messages",
    "/profile",
    "/profile-editor",
    "/settings",
    "/write-review",
  ].some((p) => pathname.startsWith(p));

  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ── Dashboard Header ── */
  if (isAuthenticated && isDashboardPage) {
    return (
      <DashboardHeader
        initials={initials}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        notifRef={notifRef}
      />
    );
  }

  /* ── Default guest Navbar ── */
  return (
    <nav className="w-full border-b border-surface-container-high bg-surface text-on-surface">
      <div className="mx-auto flex h-12 max-w-[1280px] items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-surface-container-high" aria-hidden="true" />
          <Link to="/" className="text-sm font-semibold text-accent-orange-rich font-heading">
            SkillMesh
          </Link>
        </div>

        <div className="flex items-center gap-5">
          <Link
            to="/login"
            className="text-[10px] font-semibold uppercase tracking-[0.4em] text-on-surface-variant hover:text-text-primary transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-sm bg-accent-orange-rich px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white hover:bg-accent-orange-rich/90 transition-colors"
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}

/** Dashboard-specific header (extracted for clarity) */
function DashboardHeader({ initials, showNotifications, setShowNotifications, notifRef }) {
  const { searchQuery, setSearchQuery } = useFeed();
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-surface/80 backdrop-blur-md font-heading text-body-sm font-medium tracking-tight border-b border-outline-variant">
      <div className="flex items-center gap-6">
        {/* Logo */}
        <Link
          to="/dashboard"
          className="text-2xl font-black text-accent-orange-rich tracking-tighter hidden md:block"
        >
          SkillMesh
        </Link>

        {/* Search bar — functional, filters feed posts */}
        <div className="relative w-64 md:w-96 hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts..."
            className="w-full bg-surface-container-high border border-outline-variant rounded-full py-2 pl-10 pr-4 text-text-primary font-body text-body-sm placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-orange-rich transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications — dropdown */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-text-secondary hover:text-accent-orange-rich transition-colors duration-200 active:scale-95 relative"
          >
            <span className="material-symbols-outlined">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-orange-rich text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-10 w-80 bg-surface-card border border-outline-variant rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-outline-variant">
                <h4 className="font-heading text-body-md font-semibold text-text-primary">
                  Notifications
                </h4>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {MOCK_NOTIFICATIONS.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 flex gap-3 items-start hover:bg-surface-container-high/50 transition-colors cursor-pointer ${
                      !n.read ? "bg-accent-orange-muted/30" : ""
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[18px] mt-0.5 ${!n.read ? "text-accent-orange-rich" : "text-text-secondary"}`}>
                      {n.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-body-sm text-text-primary leading-snug">{n.text}</p>
                      <span className="text-text-secondary text-[10px] font-heading">{n.time}</span>
                    </div>
                    {!n.read && (
                      <span className="w-2 h-2 bg-accent-orange-rich rounded-full mt-1.5 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-outline-variant text-center">
                <span className="text-accent-orange-rich text-body-sm font-heading cursor-pointer hover:underline">
                  View All
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Discover (formerly Group) */}
        <Link
          to="/search"
          className="text-text-secondary hover:text-accent-orange-rich transition-colors duration-200 active:scale-95"
        >
          <span className="material-symbols-outlined">group</span>
        </Link>

        {/* Messages */}
        <Link
          to="/messages"
          className="text-text-secondary hover:text-accent-orange-rich transition-colors duration-200 active:scale-95"
        >
          <span className="material-symbols-outlined">chat</span>
        </Link>

        {/* User avatar */}
        <Link
          to="/profile"
          className="w-8 h-8 rounded-full bg-accent-orange-rich/20 flex items-center justify-center text-accent-orange-rich font-heading font-bold text-[12px] border border-outline-variant hover:border-accent-orange-rich transition-colors"
        >
          {initials}
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
