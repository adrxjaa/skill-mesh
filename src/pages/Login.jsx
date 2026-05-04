import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { Card, CardHeaders, CardContent } from "../components/common/Card";
import useAuth from "../hooks/useAuth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginAsDemo, login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/search");
    } catch (err) {
      console.error("Login failed", err);
      alert("Invalid credentials");
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo();
    navigate("/search");
  };

  return (
    <div className="flex-1 min-h-0 bg-dark-bg text-text-primary flex items-center justify-center">
      {/* Main Content */}
      <main className="w-full px-4 py-0 overflow-auto min-h-0">
        <div className="w-full max-w-md mx-auto">
          {/* Card with orange top border */}
          <Card className="bg-surface-container rounded-xl  shadow-none pt-5 pb-5 border-t-4 border-primary">
            <CardHeaders className="flex-col justify-center pb-8 pt-8 px-8">
              {/* Heading */}
              <h1 className="text-3xl font-bold text-center text-text-primary mb-2">
                Welcome Back
              </h1>

              {/* Subtext */}
              <p className="text-center text-text-secondary text-sm">
                Enter your credentials to access the mesh.
              </p>
            </CardHeaders>

            <CardContent className="px-8 pb-8">
              {/* Form */}
              <div className="space-y-5 mb-6">
                {/* Email */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-text-primary mb-2 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-3.5 text-text-secondary"
                      size={20}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="builder@example.com"
                      className="w-full bg-surface-container-lowest rounded-lg px-4 py-3 pl-10 text-text-primary placeholder-text-secondary outline-none focus:border-primary focus:ring-1 focus:ring-primary transition focus:border"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-primary">
                      Password
                    </label>
                    <Link
                      to="#"
                      className="text-xs text-primary hover:text-primary-hover transition font-medium"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-3.5 text-text-secondary"
                      size={20}
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-surface-container-lowest  rounded-lg px-4 py-3 pl-10 text-text-primary placeholder-text-secondary outline-none focus:border-primary focus:ring-1 focus:ring-primary transition focus:border"
                    />
                  </div>
                </div>
              </div>

              {/* Login Button */}
              <button 
                onClick={handleLogin}
                className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary-hover transition mb-4"
              >
                Login
              </button>
              
              {/* Demo Login Button */}
              <button 
                type="button"
                onClick={handleDemoLogin}
                className="w-full bg-surface-container-high border border-border-color text-text-primary font-bold py-3 rounded-lg hover:bg-surface-container-highest transition mb-6"
              >
                Login as Demo User
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-text-secondary">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary font-semibold hover:text-primary-hover transition"
                >
                  Sign Up
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default Login;
