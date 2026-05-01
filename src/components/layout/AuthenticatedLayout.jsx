import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Bell, Search, Settings, ChevronDown } from "lucide-react";
import Sidebar from "./Sidebar";

function AuthenticatedLayout({ children }) {
  const [searchQuery, setSearchQuery] = useState("Mobile app developer");

  return (
    <div className="flex h-screen w-full flex-col bg-surface text-on-surface">
      <header className="flex h-14 items-center justify-between border-b border-surface-container-high bg-surface/95 px-5 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-surface-container-high">
            <div className="h-3 w-3 rounded-sm bg-primary" />
          </div>
          <span className="text-base font-semibold text-primary">SkillMesh</span>
        </div>

        <div className="flex w-full max-w-140 items-center px-6">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-10 w-full rounded-xl border border-surface-container-high bg-surface-container-low px-11 pr-10 text-sm text-on-surface outline-none transition focus:border-primary"
            />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
          </div>
        </div>

        <div className="flex items-center gap-4 text-text-secondary">
          <button className="transition-colors hover:text-on-surface" aria-label="Notifications">
            <Bell size={18} />
          </button>
          <button className="transition-colors hover:text-on-surface" aria-label="Settings">
            <Settings size={18} />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-container-high bg-surface-container-low text-xs font-semibold text-on-surface">
            SK
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 w-full overflow-hidden">
        <Sidebar />
        <div className="flex-1 min-w-0 overflow-y-auto relative">
          {children || <Outlet context={{ searchQuery, setSearchQuery }} />}
        </div>
      </div>
    </div>
  );
}

export default AuthenticatedLayout;
