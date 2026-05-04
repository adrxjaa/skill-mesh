import { useContext } from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import ProjectContext from "../../context/ProjectContext";

function DashboardSidebar() {
  const { logout } = useAuth();
  const { pendingInviteCount } = useContext(ProjectContext);

  const navItems = [
    { to: "/dashboard", icon: "dynamic_feed", label: "Feed" },
    { to: "/search", icon: "search", label: "Search" },
    { to: "/projects", icon: "folder_special", label: "Active Projects", badge: pendingInviteCount },
    { to: "/messages", icon: "chat_bubble", label: "Messages" },
    { to: "/profile", icon: "person", label: "Profile" },
  ];

  const linkBase =
    "px-4 py-3 flex items-center gap-3 transition-all cursor-pointer active:translate-x-1 font-heading text-sm font-semibold";
  const linkActive =
    "bg-surface-container-high text-accent-orange-rich border-r-4 border-accent-orange-rich";
  const linkInactive =
    "text-text-secondary hover:bg-surface-container-high/50 hover:text-accent-orange-rich/70";

  return (
    <nav className="hidden lg:flex flex-col fixed left-0 top-0 h-full py-6 w-64 border-r border-surface-container-high bg-[#12131A] mt-16 z-40 font-heading text-sm font-semibold">
      {/* Logo Section */}
      <div className="px-6 mb-8 flex items-center gap-3">
        <img
          alt="SkillMesh Logo"
          className="w-10 h-10 rounded-lg"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHoMUOvsyNsNzDwvsxwZx06GI5oXCi1O8r4KxXSbravkyMWbRlEporeDUA1vJZG__nIRaTZX6dyrSNVT3flSTbEBxJ76Q_i4uac-jHDFk5Sme8Db-dWcE0Gfchc6htLXe8AcDaQzfffI_xizYkjtgNACO7qmhcs23Z9v6rWA5zWjrsNnC45opVu7ML5Ol3_YndsaH7llvwBiuGARpyTX3EOwPrMaVYAtMCTucjZf51pm38Fe2AUeg_ovpVGaCIPF4qcL7BaeoNlFg"
        />
        <div>
          <h2 className="text-accent-orange-rich font-bold text-xl leading-tight">SkillMesh</h2>
          <p className="text-text-secondary text-xs font-normal">Build Together</p>
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
            <span className="flex-1">{item.label}</span>
            {item.badge > 0 && (
              <span className="bg-accent-orange-rich text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>

      <div className="px-4 mt-auto">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open-create-post"))}
          className="w-full bg-accent-orange-rich text-white font-body font-medium py-2 rounded-lg hover:bg-[#d95c14] transition-colors active:scale-95 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Create Post
        </button>
      </div>

      {/* Bottom Links */}
      <div className="mt-6 flex flex-col gap-1 border-t border-surface-container-high pt-4">
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
