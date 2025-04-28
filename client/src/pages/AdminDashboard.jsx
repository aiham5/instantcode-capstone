import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load users");
    }
  };

  const handleRemoveImage = async (userId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:3000/api/users/${userId}/remove-image`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Profile picture removed");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to remove profile picture");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="page">
      <h2>Admin Dashboard</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {users.map((user) => (
          <div
            key={user.id}
            className="post-card"
            style={{ display: "flex", alignItems: "center", gap: "1rem" }}
          >
            <img
              src={user.image || "/default-pfp.png"}
              alt="pfp"
              className="pfp"
              style={{ width: "60px", height: "60px" }}
            />
            <div style={{ flexGrow: 1 }}>
              <strong>{user.username}</strong> ({user.role})
            </div>
            {user.image && (
              <button
                className="remove-pfp-btn"
                onClick={() => handleRemoveImage(user.id)}
              >
                Remove PFP
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
