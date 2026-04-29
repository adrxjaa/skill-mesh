import { createContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // On mount, if a token exists in localStorage, fetch the current user
  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        // Demo token — restore the demo user without calling the API
        if (savedToken === "demo-token-skillmesh") {
          setUser({
            _id: "demo-user-001",
            displayName: "Ananya Bhat",
            username: "ananyabuilds",
            email: "ananya@demo.skillmesh",
            role: "user",
            avatar: "",
            bio: "Frontend developer helping founders shape polished product experiences.",
            location: "Bengaluru, India",
            skills: ["React", "CSS", "Figma", "TypeScript", "Tailwind CSS"],
            availability: "open-to-work",
          });
          setToken(savedToken);
          setLoading(false);
          return;
        }

        try {
          const res = await api.get("/auth/me", {
            headers: { Authorization: `Bearer ${savedToken}` },
          });
          setUser(res.data.user || res.data);
          setToken(savedToken);
        } catch {
          // Token is invalid or expired — clear it
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const register = async (displayName, email, password) => {
    const res = await api.post("/auth/register", {
      displayName,
      email,
      password,
    });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Demo login — bypasses the API so the app works without a backend
  const loginAsDemo = () => {
    const demoToken = "demo-token-skillmesh";
    const demoUser = {
      _id: "demo-user-001",
      displayName: "Ananya Bhat",
      username: "ananyabuilds",
      email: "ananya@demo.skillmesh",
      role: "user",
      avatar: "",
      bio: "Frontend developer helping founders shape polished product experiences.",
      location: "Bengaluru, India",
      skills: ["React", "CSS", "Figma", "TypeScript", "Tailwind CSS"],
      availability: "open-to-work",
    };
    localStorage.setItem("token", demoToken);
    setToken(demoToken);
    setUser(demoUser);
    return demoUser;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    loginAsDemo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
