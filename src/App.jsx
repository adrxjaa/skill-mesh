import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AuthenticatedLayout from "./components/layout/AuthenticatedLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProfileEditor from "./pages/ProfileEditor";
import WriteReview from "./pages/WriteReview";
import Chat from "./pages/Chat";
import SearchResults from "./pages/SearchResults";
import Settings from "./pages/Settings";

function App() {
  function AppContent() {
    const location = useLocation();
    const isAuthRoute = [
      "/dashboard",
      "/profile",
      "/profile-editor",
      "/write-review",
      "/messages",
      "/search",
      "/settings",
    ].some(
      (path) => location.pathname === path || location.pathname.startsWith(`${path}/`)
    );

    return (
      <div className={isAuthRoute ? "min-h-screen bg-surface text-on-surface" : "min-h-screen flex flex-col"}>
        {!isAuthRoute && <Navbar />}
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <main className={isAuthRoute ? "min-h-screen" : "flex-1 flex flex-col min-h-0"}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<AuthenticatedLayout />}>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile-editor"
                element={
                  <ProtectedRoute>
                    <ProfileEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/write-review"
                element={
                  <ProtectedRoute>
                    <WriteReview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <SearchResults />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </main>
        {!isAuthRoute && <Footer />}
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
