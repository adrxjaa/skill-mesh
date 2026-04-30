import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function DashboardSidebar() {
  const { logout } = useAuth();

  const navItems = [
    { to: "/dashboard", icon: "dynamic_feed", label: "Feed" },
    { to: "/search", icon: "hub", label: "Discover" },
    { to: "/messages", icon: "chat_bubble", label: "Messages" },
    { to: "/profile", icon: "person", label: "Profile" },
  ];

  const linkBase =
    "px-4 py-3 flex items-center gap-3 transition-all cursor-pointer active:translate-x-1 text-body-sm font-semibold font-heading";
  const linkActive =
    "bg-surface-container-high text-accent-orange-rich border-r-4 border-accent-orange-rich";
  const linkInactive =
    "text-text-secondary hover:bg-surface-container-high/50 hover:text-primary";

  const handleCreatePost = () => {
    const composer = document.getElementById("post-composer-input");
    if (composer) {
      // Scroll to composer
      composer.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => composer.focus(), 300);

      // Pulse animation on the composer card
      const card = composer.closest("[data-composer-card]");
      if (card) {
        card.classList.add("ring-2", "ring-accent-orange-rich", "ring-opacity-60");
        setTimeout(() => {
          card.classList.remove("ring-2", "ring-accent-orange-rich", "ring-opacity-60");
        }, 1500);
      }
    } else {
      // If we're not on dashboard, navigate there
      window.location.href = "/dashboard";
    }
  };

  return (
    <nav className="hidden lg:flex flex-col fixed left-0 top-0 h-full py-6 w-64 border-r border-outline-variant bg-surface mt-16 z-40 font-heading text-body-sm font-semibold">
      {/* Logo Section */}
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-accent-orange-rich/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-accent-orange-rich text-xl">hub</span>
        </div>
        <div>
          <h2 className="text-accent-orange-rich font-bold text-xl leading-tight font-heading">
            SkillMesh
          </h2>
          <p className="text-text-secondary text-[12px] font-normal">Build Together</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === "/dashboard"}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Bottom Links */}
      <div className="mt-6 flex flex-col gap-1 border-t border-outline-variant pt-4">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          <span className="material-symbols-outlined">settings</span>
          Settings
        </NavLink>
        <button
          onClick={logout}
          className={`${linkBase} ${linkInactive} w-full text-left`}
        >
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default DashboardSidebar;
