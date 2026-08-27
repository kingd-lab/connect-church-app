import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AllPosts from "./pages/AllPosts";
import MyPosts from "./pages/MyPosts";
import CreatePost from "./pages/CreatePost";
import Bookmarks from "./pages/Bookmarks";
import Profile from "./pages/Profile";
import BusinessAds from "./pages/BusinessAds";
import CreateAd from "./pages/CreateAd";
import LiveStream from "./pages/LiveStream";
import Friends from "./pages/Friends";
import Messages from "./pages/Messages";
import Groups from "./pages/Groups";
import Notifications from "./pages/Notifications";
import CommunityHub from "./pages/CommunityHub";
import Events from "./pages/Events";
import Prayer from "./pages/Prayer";
import BibleStudy from "./pages/BibleStudy";
import AdminHub from "./pages/AdminHub";

export default function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<ProtectedRoute><AllPosts /></ProtectedRoute>} />
          <Route path="/my-posts" element={<ProtectedRoute><MyPosts /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
          <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/business" element={<ProtectedRoute><BusinessAds /></ProtectedRoute>} />
          <Route path="/business/new" element={<ProtectedRoute><CreateAd /></ProtectedRoute>} />
          <Route path="/live" element={<ProtectedRoute><LiveStream /></ProtectedRoute>} />
          <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><CommunityHub /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/prayer" element={<ProtectedRoute><Prayer /></ProtectedRoute>} />
          <Route path="/bible-study" element={<ProtectedRoute><BibleStudy /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminHub /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    </ThemeProvider>
  );
}
