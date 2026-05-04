import { createContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        if (savedToken === "demo-token-skillmesh") {
          setUser(DEMO_USER);
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

  const register = async (fullName, email, password, skills) => {
    const res = await api.post("/auth/register", { fullName, email, password, skills });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  /** Update the current user's profile (calls PATCH /api/profile/me) */
  const updateMe = async (fields) => {
    const res = await api.patch("/profile/me", fields);
    const updated = res.data;
    setUser((prev) => ({ ...prev, ...updated }));
    return updated;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const loginAsDemo = () => {
    localStorage.setItem("token", "demo-token-skillmesh");
    setToken("demo-token-skillmesh");
    setUser(DEMO_USER);
    return DEMO_USER;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        profileComplete: user?.profileComplete ?? false,
        login,
        register,
        logout,
        loginAsDemo,
        updateMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const DEMO_USER = {
  id: "demo-user-001",
  fullName: "Ananya Bhat",
  email: "ananya@demo.skillmesh",
  bio: "Frontend developer helping founders shape polished product experiences.",
  title: "Frontend Developer",
  location: "Bengaluru, India",
  avatar: "",
  availability: "open-to-work",
  socialLinks: { portfolio: "", github: "", linkedin: "", twitter: "" },
  skills: ["React", "CSS", "Figma", "TypeScript", "Tailwind CSS"],
  experience: [],
  profileComplete: true, // demo user skips onboarding
};

export default AuthContext;
