import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";
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
          <Route path="/profile-editor" element={<ProtectedRoute><ProfileEditor /></ProtectedRoute>} />
          <Route path="/write-review" element={<ProtectedRoute><WriteReview /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
