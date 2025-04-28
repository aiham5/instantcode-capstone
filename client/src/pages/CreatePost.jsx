import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function CreatePost() {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select an image to upload.");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "instantcode_upload");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dz16kp2oz/image/upload",
        formData
      );
      return res.data.secure_url;
    } catch {
      toast.error("Image upload failed.");
      return null;
    }
  };

  const extractTags = (text) => {
    const matches = text.match(/#[a-zA-Z0-9_]+/g);
    return matches ? matches.map((tag) => tag.slice(1).toLowerCase()) : [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageUrl = await handleUpload();
    if (!imageUrl) return;

    const tags = extractTags(caption);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/api/posts",
        { image: imageUrl, caption, tags },
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

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selected);
    } else {
      setPreview(null);
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
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            style={{
              padding: "10px",
              borderRadius: "8px",
              backgroundColor: "var(--card)",
              color: "var(--text)",
              border: "1px solid var(--border)",
            }}
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{
                width: "100%",
                maxHeight: "300px",
                objectFit: "cover",
                borderRadius: "8px",
                border: "1px solid var(--border)",
              }}
            />
          )}
          <textarea
            placeholder="Write a caption... Use #hashtags to tag your post"
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
