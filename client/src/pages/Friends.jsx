import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Friends() {
  const [friends, setFriends] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data));
      axios
        .get("http://localhost:3000/api/friends", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setFriends(res.data));
      axios
        .get("http://localhost:3000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUsers(res.data));
    }
  }, []);

  const handleAdd = async (userId) => {
    await axios.post(
      "http://localhost:3000/api/friends",
      { userId },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    const updated = await axios.get("http://localhost:3000/api/friends", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setFriends(updated.data);
  };

  const handleRemove = async (userId) => {
    await axios.delete(`http://localhost:3000/api/friends/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const updated = await axios.get("http://localhost:3000/api/friends", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setFriends(updated.data);
  };

  return (
    <div className="page">
      <div className="post-card">
        <h2>My Friends</h2>
        {friends.map((f) => (
          <div
            key={f.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <Link to={`/profile/${f.id}`}>{f.username}</Link>
            <button onClick={() => handleRemove(f.id)}>Remove</button>
          </div>
        ))}
      </div>

      <div className="post-card" style={{ marginTop: "20px" }}>
        <h2>Other Users</h2>
        {users
          .filter(
            (u) => u.id !== user?.id && !friends.find((f) => f.id === u.id)
          )
          .map((u) => (
            <div
              key={u.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <Link to={`/profile/${u.id}`}>{u.username}</Link>
              <button onClick={() => handleAdd(u.id)}>Add Friend</button>
            </div>
          ))}
      </div>
    </div>
  );
}
