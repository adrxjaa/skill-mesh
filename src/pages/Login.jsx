import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

function Login() {
  const navigate = useNavigate();
  const { loginAsDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleDemoLogin = () => {
    loginAsDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary flex flex-col">
      {/* Navbar */}
      <nav className="w-full border-b border-border-color bg-dark-bg">
        <div className="flex h-16 items-center justify-between px-8 lg:px-12">
          <div className="text-2xl font-bold text-primary">SkillMesh</div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-text-secondary hover:text-text-primary transition">
              Login
            </Link>
            <Link to="/register" className="px-6 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary-hover transition">
              Join Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card with orange top border */}
          <div className="bg-card-bg rounded-xl border border-border-color border-t-2 border-t-primary p-8">
            {/* Heading */}
            <h1 className="text-3xl font-bold text-center text-text-primary mb-2">
              Welcome Back
            </h1>
            
            {/* Subtext */}
            <p className="text-center text-text-secondary text-sm mb-8">
              Enter your credentials to access the mesh.
            </p>

            {/* Form */}
            <div className="space-y-5 mb-6">
              {/* Email */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-primary mb-2 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-text-secondary" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="builder@example.com"
                    className="w-full bg-input-bg border border-border-color rounded-lg px-4 py-3 pl-10 text-text-primary placeholder-text-secondary outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-primary">
                    Password
                  </label>
                  <Link to="#" className="text-xs text-primary hover:text-primary-hover transition font-medium">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-text-secondary" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-input-bg border border-border-color rounded-lg px-4 py-3 pl-10 text-text-primary placeholder-text-secondary outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                  />
                </div>
              </div>
            </div>

            {/* Login Button */}
            <button className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary-hover transition mb-3">
              Login
            </button>

            {/* Demo Login Button */}
            <button
              onClick={handleDemoLogin}
              className="w-full bg-skill-tag border border-primary text-primary font-bold py-3 rounded-lg hover:bg-primary hover:text-black transition mb-6"
            >
              Login as Demo User
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-text-secondary">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-semibold hover:text-primary-hover transition">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border-color bg-dark-bg">
        <div className="flex items-center justify-between px-8 lg:px-12 py-6 text-xs text-text-secondary">
          <div className="text-primary font-bold">SkillMesh</div>
          <div>© 2024 SkillMesh. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-text-primary transition">Privacy</a>
            <a href="#" className="hover:text-text-primary transition">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Login;
