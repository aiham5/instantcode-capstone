import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function CreatePost() {
  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/api/posts",
        { image, caption },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Post created!");
      navigate("/");
    } catch {
      toast.error("Failed to create post.");
    }
  };

  return (
    <div className="page">
      <div
        className="post-card"
        style={{ maxWidth: "600px", margin: "0 auto" }}
      >
        <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>
          Create New Post
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <input
            type="text"
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
            }}
          />
          <textarea
            placeholder="Caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            required
            rows={4}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px",
              borderRadius: "8px",
              backgroundColor: "var(--accent)",
              color: "white",
              fontWeight: "bold",
              border: "none",
            }}
          >
            Publish
          </button>
        </form>
      </div>
    </div>
  );
}
