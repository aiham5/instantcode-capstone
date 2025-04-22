import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { AiFillHome } from "react-icons/ai";
import { FaUserFriends } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { FaPlusSquare } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";

export default function Sidebar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    }
  }, []);

  return (
    <nav className="sidebar">
      <ul className="sidebar-list">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active-tab" : "")}
          >
            <AiFillHome style={{ marginRight: "8px" }} /> Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/friends"
            className={({ isActive }) => (isActive ? "active-tab" : "")}
          >
            <FaUserFriends style={{ marginRight: "8px" }} /> Friends
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/notifications"
            className={({ isActive }) => (isActive ? "active-tab" : "")}
          >
            <IoNotifications style={{ marginRight: "8px" }} /> Notifications
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/create"
            className={({ isActive }) => (isActive ? "active-tab" : "")}
          >
            <FaPlusSquare style={{ marginRight: "8px" }} /> Create Post
          </NavLink>
        </li>
        {user?.role === "admin" && (
          <li>
            <NavLink
              to="/admin"
              className={({ isActive }) => (isActive ? "active-tab" : "")}
            >
              <MdAdminPanelSettings style={{ marginRight: "8px" }} /> Admin
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}
