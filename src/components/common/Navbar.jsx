import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import useMatch from "../../hooks/useMatch";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get pending likes count (guarded)
  let pendingLikesCount = 0;
  try {
    const match = useMatch();
    pendingLikesCount = match.pendingLikesCount;
  } catch {
    // MatchProvider not available
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on Escape
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") setDropdownOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate("/");
  };

  const userInitials = user?.displayName
    ?.split(" ")
    .map((n) => n[0])
    .join("") || "?";

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center shadow-sm">
      <Link to={isAuthenticated ? "/dashboard" : "/"} className="text-xl font-semibold text-slate-900 hover:text-slate-700 transition-colors">
        SkillMesh
      </Link>

      <div className="flex gap-6 items-center">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200">
              Discover
            </Link>
            <Link to="/likes" className="relative text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200">
              Likes
              {pendingLikesCount > 0 && (
                <span className="absolute -top-2 -right-5 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white shadow-sm">
                  {pendingLikesCount}
                </span>
              )}
            </Link>
            <Link to="/matches" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200">
              Matches
            </Link>

            {/* Avatar dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-sm font-bold text-white shadow-sm transition hover:shadow-md active:scale-95"
              >
                {userInitials}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-slate-200 bg-white py-1 shadow-lg animate-in fade-in zoom-in-95">
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900">{user?.displayName}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <span className="w-5 text-center text-slate-400">👤</span>
                      My Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <span className="w-5 text-center text-slate-400">⚙️</span>
                      Account Settings
                    </Link>
                    {user?.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <span className="w-5 text-center text-slate-400">🛡️</span>
                        Admin Panel
                      </Link>
                    )}
                  </div>

                  {/* Logout */}
                  <div className="border-t border-slate-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <span className="w-5 text-center">🚪</span>
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200">
              Login
            </Link>
            <Link to="/register" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 text-sm font-medium">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;