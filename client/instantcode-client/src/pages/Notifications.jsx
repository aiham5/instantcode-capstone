import { useEffect, useState } from "react";
import axios from "axios";

export default function Notifications() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setList(res.data));
  }, []);

  const markAsRead = async (id) => {
    await axios.put(
      `http://localhost:3000/api/notifications/${id}/read`,
      {},
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    setList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="page">
      <div className="post-card">
        <h2>Notifications</h2>
        {list.map((n) => (
          <div
            key={n.id}
            style={{ opacity: n.read ? 0.5 : 1, marginBottom: "12px" }}
          >
            <p>{n.message}</p>
            <small>{new Date(n.createdAt).toLocaleString()}</small>
            {!n.read && (
              <button onClick={() => markAsRead(n.id)}>Mark as Read</button>
            )}
            <hr style={{ marginTop: "10px" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
