import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { handleAuthError } from "../utils/auth";

export default function EditProfile() {
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);

  const handleUpload = async () => {
    if (!file || !(file instanceof File)) {
      toast.error("No valid image selected");
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
    } catch (err) {
      console.error("Cloudinary error:", err.response?.data || err.message);
      toast.error(
        "Upload failed: " +
          (err.response?.data?.error?.message || "unknown error")
      );
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    let imageUrl = image;

    if (file) {
      toast.loading("Uploading image...");
      imageUrl = await handleUpload();
      toast.dismiss();
      if (!imageUrl) return;
    }

    try {
      await axios.put(
        "http://localhost:3000/api/users/me",
        { bio, image: imageUrl },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const res = await axios.get("http://localhost:3000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Profile updated!");
      navigate(`/profile/${res.data.id}`);
    } catch (err) {
      console.error("Profile update failed:", err);
      toast.error("Profile update failed");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setBio(res.data.bio || "");
          setImage(res.data.image || "");
        })
        .catch((err) => handleAuthError(err, navigate));
    }
  }, []);

  return (
    <div className="page">
      <div
        className="post-card"
        style={{ maxWidth: "600px", margin: "0 auto" }}
      >
        <h2>Edit Profile</h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {image && image !== "REMOVE_IMAGE" && (
            <img
              src={image}
              alt="Current"
              style={{
                maxWidth: "200px",
                borderRadius: "8px",
                marginBottom: "0.5rem",
                alignSelf: "center",
              }}
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const selected = e.target.files[0];
              if (selected && selected.type.startsWith("image/")) {
                setFile(selected);
                setPreview(URL.createObjectURL(selected));
              } else {
                toast.error("Please select a valid image file");
                setFile(null);
                setPreview(null);
              }
            }}
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{
                maxWidth: "150px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "50%",
                marginTop: "1rem",
                border: "2px solid var(--border)",
              }}
            />
          )}

          {image && image !== "REMOVE_IMAGE" && (
            <button
              type="button"
              className="remove-pfp-btn"
              onClick={() => {
                setImage("REMOVE_IMAGE");
                setFile(null);
                toast("Profile picture will be removed");
              }}
            >
              Remove Profile Picture
            </button>
          )}

          <textarea
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
          />
          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
}
