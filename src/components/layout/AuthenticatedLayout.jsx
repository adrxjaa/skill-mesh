import { useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../dashboard/DashboardSidebar";
import DashboardBottomNav from "../dashboard/DashboardBottomNav";
import ProfileSetupModal from "../onboarding/ProfileSetupModal";
import AuthContext from "../../context/AuthContext";

function AuthenticatedLayout({ children }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, profileComplete } = useContext(AuthContext);

  const initials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="bg-background text-text-primary font-body overflow-x-hidden min-h-screen flex flex-col">
      {/* Hard-block gate: must complete profile */}
      {user && !profileComplete && <ProfileSetupModal />}

      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-[#12131A]/80 backdrop-blur-md font-heading text-sm font-medium tracking-tight border-b border-surface-container-high">
        <div className="flex items-center gap-6">
          <span className="text-2xl font-black text-accent-orange-rich tracking-tighter hidden md:block">SkillMesh</span>
          <div className="relative w-64 md:w-96 hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">search</span>
            <input
              className="w-full bg-surface-container-high border border-outline-variant rounded-full py-2 pl-10 pr-4 text-text-primary focus:outline-none focus:border-accent-orange-rich font-body text-sm"
              placeholder="Search..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-text-secondary hover:text-accent-orange-rich transition-colors duration-200">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="text-text-secondary hover:text-accent-orange-rich transition-colors duration-200">
            <span className="material-symbols-outlined">chat</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-accent-orange-rich/20 border border-accent-orange-rich/40 flex items-center justify-center text-accent-orange-rich font-heading font-bold text-xs">
            {user?.avatar
              ? <img src={user.avatar.startsWith("/uploads") ? `http://localhost:5000${user.avatar}` : user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
              : initials}
          </div>
        </div>
      </header>

      <div className="flex pt-16 flex-1 min-h-0 w-full overflow-hidden">
        <DashboardSidebar />
        <div className="flex-1 lg:ml-64 min-w-0 relative overflow-y-auto flex flex-col">
          {children || <Outlet context={{ searchQuery, setSearchQuery }} />}
        </div>
      </div>

      <DashboardBottomNav />
    </div>
  );
}

export default AuthenticatedLayout;
