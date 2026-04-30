import { useLocation, Link } from "react-router-dom";
import {
  Rss,
  Users,
  FolderKanban,
  PenSquare,
  MessageSquare,
  HelpCircle,
  LogOut,
  Plus,
} from "lucide-react";

const navItems = [
  { label: "Feed", icon: Rss, path: "/dashboard" },
  { label: "Network", icon: Users, path: "/search" },
  { label: "Projects", icon: FolderKanban, path: "/projects" },
  { label: "Reviews", icon: PenSquare, path: "/write-review" },
  { label: "Messages", icon: MessageSquare, path: "/messages" },
];

const bottomItems = [
  { label: "Help", icon: HelpCircle, path: "/help" },
  { label: "Logout", icon: LogOut, path: "/login" },
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
    <aside className="flex h-screen w-56 flex-col border-r border-surface-container-high bg-surface-container-lowest">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
          S
        </div>
        <div>
          <p className="text-sm font-bold text-primary">SkillMesh</p>
          <p className="text-[10px] text-text-secondary">Builder Ecosystem</p>
        </div>
      </div>

      {/* Main nav */}
      <nav className="mt-2 flex-1 space-y-1 px-3">
        {navItems.map(({ label, icon: Icon, path }) => {
          const isActive = currentPath === path;
          return (
            <Link
              key={label}
              to={path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-text-secondary hover:bg-surface-container-high/50 hover:text-on-surface border border-transparent"
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Create Post button */}
      <div className="px-3 pb-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover">
          <Plus size={16} />
          Create Post
        </button>
      </div>

      {/* Divider */}
      <div className="mx-3 border-t border-surface-container-high" />

      {/* Bottom nav */}
      <nav className="space-y-1 px-3 py-3">
        {bottomItems.map(({ label, icon: Icon, path }) => (
          <Link
            key={label}
            to={path}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-container-high/50 hover:text-on-surface border border-transparent"
          >
            <Icon size={18} strokeWidth={1.8} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
