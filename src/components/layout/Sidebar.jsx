import { useLocation, Link } from "react-router-dom";
import {
  Layers,
  Search,
  Network,
  MessageSquare,
  User,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Feed", icon: Layers, path: "/dashboard" },
  { label: "Search", icon: Search, path: "/search" },
  { label: "Messages", icon: MessageSquare, path: "/messages" },
  { label: "Profile", icon: User, path: "/profile" },
];

const bottomItems = [
  { label: "Settings", icon: Settings, path: "/settings" },
];

/**
 * Sidebar — App-wide navigation sidebar for authenticated pages.
 *
 * Props:
 *   activeOverride – optional path string to force-highlight a nav item
 */
function Sidebar({ activeOverride }) {
  const location = useLocation();
  const currentPath = activeOverride || location.pathname;

  return (
    <aside className="flex shrink-0 overflow-y-auto w-64 flex-col border-r border-surface-container-high bg-surface-container-lowest">
      {/* Logo */}
      <div className="flex items-center gap-4 px-6 py-8">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-surface-container-high bg-surface-container shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent z-10" />
          <Network size={24} className="absolute inset-0 m-auto text-primary opacity-90 drop-shadow-[0_0_8px_rgba(255,107,0,0.8)]" />
        </div>
        <div>
          <p className="text-lg font-bold text-primary leading-tight tracking-wide">SkillMesh</p>
          <p className="mt-0.5 text-[11px] font-medium text-text-secondary/80">Build Together</p>
        </div>
      </div>

      {/* Main nav */}
      <nav className="mt-2 flex-1 space-y-0.5">
        {navItems.map(({ label, icon: Icon, path }) => {
          // For demo purposes, we highlight Feed if activeOverride isn't perfectly matching yet
          const isActive = currentPath === path || (path === '/dashboard' && currentPath === '/');
          
          return (
            <Link
              key={label}
              to={path}
              className={`flex w-full items-center gap-4 px-6 py-3.5 text-[15px] font-medium transition-all ${
                isActive
                  ? "bg-surface-container-high/60 border-r-[3px] border-primary text-primary"
                  : "text-text-secondary/90 hover:bg-surface-container-high/30 hover:text-on-surface border-r-[3px] border-transparent"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Create Post button */}
      <div className="mt-auto px-6 pb-6 pt-4">
        <button className="w-full rounded-[10px] bg-primary py-3 text-[15px] font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover active:scale-[0.98]">
          Create Post
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-surface-container-high/60" />

      {/* Bottom nav */}
      <nav className="py-2">
        {bottomItems.map(({ label, icon: Icon, path }) => (
          <Link
            key={label}
            to={path}
            className="flex w-full items-center gap-4 border-r-[3px] border-transparent px-6 py-3.5 text-[15px] font-medium text-text-secondary/90 transition-all hover:bg-surface-container-high/30 hover:text-on-surface"
          >
            <Icon size={20} strokeWidth={2} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
