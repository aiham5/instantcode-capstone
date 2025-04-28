import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminTools() {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const [userRes, reportRes] = await Promise.all([
        axios.get("http://localhost:3000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:3000/api/reports", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setUsers(userRes.data);
      setReports(reportRes.data);
    } catch (err) {
      toast.error("Failed to load admin data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const promote = async (id) => {
    try {
      await axios.put(
        `http://localhost:3000/api/users/${id}/promote`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("User promoted");
      fetchData();
    } catch {
      toast.error("Promotion failed");
    }
  };

  const removeUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User deleted");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || "User deletion failed");
    }
  };

  const removeUserImage = async (id) => {
    try {
      await axios.put(
        `http://localhost:3000/api/users/${id}/remove-image`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Profile picture removed");
      fetchData();
    } catch {
      toast.error("Failed to remove profile picture");
    }
  };

  const deletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:3000/api/posts/admin/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Post deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete post");
    }
  };

  return (
    <div className="page">
      <h2>Admin Tools</h2>

      <section>
        <h3>👤 Users</h3>
        {users.map((user) => (
          <div key={user.id} className="post-card">
            <p>
              <strong>{user.username}</strong> ({user.email}) - {user.role}
            </p>
            <img
              src={user.image || "/default-pfp.png"}
              alt="pfp"
              className="pfp"
              style={{ width: "60px", height: "60px", borderRadius: "50%" }}
            />
            {user.image && (
              <button
                onClick={() => removeUserImage(user.id)}
                className="remove-pfp-btn"
              >
                Remove PFP
              </button>
            )}
            {user.role !== "admin" && (
              <button onClick={() => promote(user.id)}>Promote</button>
            )}
            <button
              onClick={() => removeUser(user.id)}
              style={{ backgroundColor: "#f44336" }}
            >
              Delete
            </button>
          </div>
        ))}
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h3>🚩 Reported Posts</h3>
        {reports.length === 0 && <p>No reports</p>}
        {reports.map((report) => (
          <div key={report.id} className="post-card">
            <p>
              <strong>Reason:</strong> {report.reason}
            </p>
            <p>
              <strong>Post ID:</strong> {report.postId}
            </p>
            <button
              onClick={() => deletePost(report.postId)}
              style={{ backgroundColor: "#f44336" }}
            >
              Delete Post
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
