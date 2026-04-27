import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
      <Link to="/" className="text-xl font-semibold text-slate-900 hover:text-slate-700 transition-colors">
        SkillMesh
      </Link>

      <div className="flex gap-8 items-center">
        <Link to="/" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">
          Home
        </Link>
        <Link to="/dashboard" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">
          Dashboard
        </Link>
        <Link to="/profile" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">
          Profile
        </Link>
        <Link to="/login" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium">
          Login
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;