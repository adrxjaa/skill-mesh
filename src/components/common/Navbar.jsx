import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
      <Link to="/" className="text-xl font-semibold text-slate-900 hover:text-slate-700 transition-colors">
        SkillMesh
      </Link>

      <div className="flex gap-8 items-center">
        <Link to="/" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">
          Home
        </Link>

        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">
              Dashboard
            </Link>
            <Link to="/profile" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">
              Profile
            </Link>
            <span className="text-sm text-slate-500">
              {user?.displayName || user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">
              Login
            </Link>
            <Link to="/register" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;