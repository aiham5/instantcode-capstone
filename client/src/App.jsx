import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import EditProfile from "./pages/EditProfile";
import Friends from "./pages/Friends";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OAuthRedirect from "./pages/OAuthRedirect";
import PostDetails from "./pages/PostDetails";
import PrivateRoute from "./components/PrivateRoute";
import RedirectProfile from "./pages/RedirectProfile";
import AdminTools from "./pages/AdminTools";

export default function App() {
  return (
    <Routes>
      <Route
        path="admin"
        element={
          <PrivateRoute>
            <AdminTools />
          </PrivateRoute>
        }
      />

      <Route path="profile" element={<RedirectProfile />} />
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="profile/:id" element={<Profile />} />
        <Route
          path="edit-profile"
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="create"
          element={
            <PrivateRoute>
              <CreatePost />
            </PrivateRoute>
          }
        />
        <Route
          path="friends"
          element={
            <PrivateRoute>
              <Friends />
            </PrivateRoute>
          }
        />
        <Route
          path="notifications"
          element={
            <PrivateRoute>
              <Notifications />
            </PrivateRoute>
          }
        />
        <Route path="posts/:id" element={<PostDetails />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/oauth-redirect" element={<OAuthRedirect />} />
    </Routes>
  );
}
