import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import Admin from "./pages/Admin";
import Requests from "./pages/Requests";
import Likes from "./pages/Likes";
import Matches from "./pages/Matches";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/u/:username" element={<PublicProfile />} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
          <Route path="/likes" element={<ProtectedRoute><Likes /></ProtectedRoute>} />
          <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
          <Route path="/chat/:userId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

