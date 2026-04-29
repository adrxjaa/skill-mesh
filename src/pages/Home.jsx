import { Link, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Home() {
  const { isAuthenticated } = useAuth();

  // Authenticated users go straight to Discover
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-semibold text-slate-900 mb-4">
          SkillMesh
        </h1>

        <p className="text-lg text-slate-600 mb-8">
          Find teammates based on skills and build amazing projects together
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/login"
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-100 transition-colors duration-200"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;